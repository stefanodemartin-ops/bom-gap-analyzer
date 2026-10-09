import Anthropic from "@anthropic-ai/sdk";
import { EXTRACT_PROMPT, MATCH_PROMPT } from "@/lib/prompts";
import { buildOemBlocks } from "@/lib/pdfImages";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MODEL = "claude-sonnet-4-6";

// LLMs cannot reliably text-search thousands of CSV rows in-context, so we
// pre-locate candidate rows deterministically: digit tokens from the OEM
// filenames (unit tags like "1657", drawing numbers like "31690") are grepped
// against the CMMS text, and the hits are handed to Claude as a scoping hint.
const MAX_HINT_ROWS = 200;

function buildScopingHint(oemFileNames, cmmsText) {
  const tokens = new Set();
  for (const name of oemFileNames) {
    for (const m of name.matchAll(/\d{3,}/g)) tokens.add(m[0]);
  }
  if (tokens.size === 0) return null;

  const lines = cmmsText.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length && hits.length < MAX_HINT_ROWS; i++) {
    for (const t of tokens) {
      if (lines[i].includes(t)) {
        hits.push(`row ${i + 1}: ${lines[i]}`);
        break;
      }
    }
  }
  if (hits.length === 0) return null;

  return (
    `SCOPING HINT — the following CMMS rows contain identifiers found in the OEM document filename(s) ` +
    `(${[...tokens].join(", ")}), located by exact text search of the full export` +
    `${hits.length >= MAX_HINT_ROWS ? ` (truncated to first ${MAX_HINT_ROWS} hits)` : ""}. ` +
    `Use them to locate the asset's functional-location node, then scope to ALL rows under that node in the full export above:\n` +
    hits.join("\n")
  );
}

/** Strip markdown fences / stray text and parse the model's JSON reply. */
function parseModelJson(raw) {
  const stripped = raw.replace(/```(?:json)?\n?/g, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  const jsonStr = start !== -1 && end !== -1 ? stripped.slice(start, end + 1) : stripped;
  return JSON.parse(jsonStr);
}

function normKey(s) {
  return s.toUpperCase().replace(/[-\s]/g, "");
}

function keyOf(partNumber, description) {
  return partNumber
    ? normKey(partNumber)
    : `desc:${(description ?? "").toLowerCase().trim().slice(0, 60)}`;
}

/**
 * Enforce, in code, that the match pass only classified parts from the
 * extract pass: drop hallucinated OEM-side entries, re-add extracted parts
 * the matcher lost, and recompute the summary from the final arrays.
 */
function sanitizeResult(result, oemParts) {
  const allowed = new Map(oemParts.map((p) => [keyOf(p.part_number, p.description), p]));

  // A needs_review item without a CMMS counterpart is by definition missing.
  const review = [];
  const demoted = [];
  for (const p of result.needs_review ?? []) {
    if (p.cmms_part_number || p.cmms_description) {
      review.push(p);
    } else {
      demoted.push({
        oem_part_number: p.oem_part_number ?? null,
        oem_description: p.oem_description,
        criticality: "IMPORTANT",
        reason: p.issue ?? "No CMMS counterpart found.",
        recommendation: p.recommendation ?? "Add this part to the CMMS.",
        source: "parts_table",
        visual_note: null,
        sourcing_category: "unknown",
        lead_time_estimate: null,
        sourcing_note: null,
      });
    }
  }
  result = {
    ...result,
    needs_review: review,
    missing_from_cmms: [...(result.missing_from_cmms ?? []), ...demoted],
  };

  const seen = new Set();
  const keepOem = (partNumber, description) => {
    const key = keyOf(partNumber, description);
    // Description-keyed (null part number) entries may be rephrased by the
    // matcher, so only enforce membership for numbered parts.
    if (partNumber && !allowed.has(key)) return false;
    if (seen.has(key)) return false; // one bucket per part
    seen.add(key);
    return true;
  };

  const matched = (result.matched ?? []).filter((p) => keepOem(p.oem_part_number, p.oem_description));
  const needs_review = (result.needs_review ?? []).filter((p) => keepOem(p.oem_part_number, p.oem_description));
  const missing = (result.missing_from_cmms ?? []).filter((p) => keepOem(p.oem_part_number, p.oem_description));

  // Any extracted part the matcher dropped is still a gap — surface it.
  for (const [key, p] of allowed) {
    if (!seen.has(key)) {
      missing.push({
        oem_part_number: p.part_number ?? null,
        oem_description: p.description,
        criticality: "IMPORTANT",
        reason: "Extracted from the OEM document but not classified by the matching pass — treat as missing until reviewed.",
        recommendation: "Search the CMMS for this part manually, then add it or record the match.",
        source: p.source ?? "parts_table",
        visual_note: p.visual_note ?? null,
        sourcing_category: "unknown",
        lead_time_estimate: null,
        sourcing_note: null,
      });
      seen.add(key);
    }
  }

  const matched_count = matched.length;
  const missing_count = missing.length;
  const total = matched_count + missing_count;

  return {
    ...result,
    matched,
    needs_review,
    missing_from_cmms: missing,
    oem_parts_count: oemParts.length,
    summary: {
      ...(result.summary ?? {}),
      matched_count,
      missing_count,
      extra_count: (result.extra_in_cmms ?? []).length,
      match_rate: total > 0 ? matched_count / total : 0,
      critical_missing_count: missing.filter((p) => p.criticality === "CRITICAL").length,
      important_missing_count: missing.filter((p) => p.criticality === "IMPORTANT").length,
      routine_missing_count: missing.filter((p) => p.criticality === "ROUTINE").length,
      visually_identified_count: missing.filter((p) => p.source === "visual_inspection").length,
      needs_review_count: needs_review.length,
    },
  };
}

export async function POST(request) {
  const formData = await request.formData();
  const oemFiles = formData.getAll("oem");
  const cmmsFile = formData.get("cmms");

  if (!oemFiles.length || !cmmsFile) {
    return Response.json(
      { error: "At least one oem file and a cmms file are required." },
      { status: 400 }
    );
  }

  const oemBlocks = [];
  for (const [i, file] of oemFiles.entries()) {
    const buf = Buffer.from(await file.arrayBuffer());
    const title =
      oemFiles.length > 1 ? `OEM Document ${i + 1}: ${file.name}` : `OEM Document: ${file.name}`;
    oemBlocks.push(...buildOemBlocks(buf, title));
  }

  const cmmsText = await cmmsFile.text();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // ── Pass 1: extract the authoritative OEM parts list from the documents ──
  let extraction;
  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 16384,
      temperature: 0,
      system: EXTRACT_PROMPT,
      messages: [{ role: "user", content: oemBlocks }],
    });
    if (message.stop_reason === "max_tokens") {
      return Response.json(
        { error: "Parts extraction too large — try with a smaller document." },
        { status: 422 }
      );
    }
    extraction = parseModelJson(message.content[0]?.text ?? "");
  } catch (err) {
    const status = err?.status ?? 500;
    const detail = err?.message ?? String(err);
    console.error("[analyze] extract pass failed:", status, detail);
    return Response.json(
      { error: `Anthropic API error (${status}): ${detail}` },
      { status: 502 }
    );
  }

  const oemParts = Array.isArray(extraction?.oem_parts) ? extraction.oem_parts : [];
  if (!oemParts.length) {
    return Response.json(
      { error: "No parts could be extracted from the OEM document(s)." },
      { status: 422 }
    );
  }

  // ── Pass 2: match the extracted list against the CMMS ────────────────────
  const hint = buildScopingHint(oemFiles.map((f) => f.name), cmmsText);
  let result;
  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 16384,
      temperature: 0,
      system: MATCH_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `OEM PARTS LIST (authoritative, extracted from documents):\n` +
                JSON.stringify(
                  {
                    equipment_identified: extraction.equipment_identified ?? "",
                    coverage_note: extraction.coverage_note ?? "",
                    oem_parts: oemParts,
                  },
                  null,
                  1
                ),
            },
            {
              type: "text",
              text: `CMMS EXPORT (CSV):\n${cmmsText}${hint ? `\n\n${hint}` : ""}`,
            },
          ],
        },
      ],
    });
    if (message.stop_reason === "max_tokens") {
      return Response.json(
        { error: "Analysis too large — try with a smaller document." },
        { status: 422 }
      );
    }
    result = parseModelJson(message.content[0]?.text ?? "");
  } catch (err) {
    const status = err?.status ?? 500;
    const detail = err?.message ?? String(err);
    if (err instanceof SyntaxError) {
      console.error("[analyze] match pass returned malformed JSON:", detail);
      return Response.json(
        { error: "Claude returned malformed JSON. Try again." },
        { status: 502 }
      );
    }
    console.error("[analyze] match pass failed:", status, detail);
    return Response.json(
      { error: `Anthropic API error (${status}): ${detail}` },
      { status: 502 }
    );
  }

  return Response.json(sanitizeResult(result, oemParts));
}
