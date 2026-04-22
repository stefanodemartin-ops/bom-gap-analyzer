import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const dynamic = "force-dynamic";

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

  const oemBlocks = await Promise.all(
    oemFiles.map(async (file, i) => ({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: Buffer.from(await file.arrayBuffer()).toString("base64"),
      },
      title: oemFiles.length > 1 ? `OEM Document ${i + 1}: ${file.name}` : "OEM Document",
    }))
  );

  const cmmsText = await cmmsFile.text();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16384,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            ...oemBlocks,
            {
              type: "text",
              text: `CMMS EXPORT (CSV):\n${cmmsText}`,
            },
          ],
        },
      ],
    });
  } catch (err) {
    const status = err?.status ?? 500;
    const detail = err?.message ?? String(err);
    console.error("[analyze] Anthropic API error:", status, detail);
    return Response.json(
      { error: `Anthropic API error (${status}): ${detail}` },
      { status: 502 }
    );
  }

  if (message.stop_reason === "max_tokens") {
    console.error("[analyze] Response truncated at max_tokens");
    return Response.json(
      { error: "Analysis too large — try with a smaller document." },
      { status: 422 }
    );
  }

  const raw = message.content[0]?.text ?? "";
  console.log("[analyze] Raw Claude response:\n", raw);

  if (!raw) {
    console.error("[analyze] Empty response from Claude");
    return Response.json(
      { error: "Claude returned an empty response. Try again." },
      { status: 502 }
    );
  }

  // Strip markdown fences and any text outside the outermost { }
  const stripped = raw.replace(/```(?:json)?\n?/g, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  const jsonStr = start !== -1 && end !== -1 ? stripped.slice(start, end + 1) : stripped;

  let result;
  try {
    result = JSON.parse(jsonStr);
  } catch {
    console.error("[analyze] Failed to parse Claude response as JSON.\nRaw:\n", raw, "\nStripped:\n", jsonStr);
    return Response.json(
      { error: "Claude returned malformed JSON. Try again." },
      { status: 502 }
    );
  }

  return Response.json(result);
}
