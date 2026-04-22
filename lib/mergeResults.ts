import { AnalysisResult, MatchedPart, MissingPart, ExtraPart } from "./types";

/** Normalise a part number for deduplication keying. */
function normKey(s: string) {
  return s.toUpperCase().replace(/[-\s]/g, "");
}

/** Tag every item in a result with the source document label. */
export function tagResult(result: AnalysisResult, sourceDoc: string): AnalysisResult {
  return {
    ...result,
    matched: result.matched.map((p) => ({ ...p, source_doc: sourceDoc })),
    missing_from_cmms: result.missing_from_cmms.map((p) => ({ ...p, source_doc: sourceDoc })),
    extra_in_cmms: result.extra_in_cmms.map((p) => ({ ...p, source_doc: sourceDoc })),
  };
}

/**
 * Merge an incoming analysis result into an existing one.
 *
 * Deduplication rules:
 *  - matched:          key on oem_part_number; keep the entry with higher confidence
 *  - missing_from_cmms: key on oem_part_number; keep existing (first seen wins)
 *  - extra_in_cmms:    key on cmms_part_number; keep existing (first seen wins)
 *
 * For items without a part number, key on the first 60 chars of the description.
 * Summary counts are recalculated from the merged arrays.
 */
export function mergeResults(existing: AnalysisResult, incoming: AnalysisResult): AnalysisResult {
  // ── matched ────────────────────────────────────────────────────────────────
  const matchedByKey = new Map<string, MatchedPart>();
  for (const item of [...existing.matched, ...incoming.matched]) {
    const key = item.oem_part_number
      ? normKey(item.oem_part_number)
      : `desc:${item.oem_description.toLowerCase().trim().slice(0, 60)}`;
    const prev = matchedByKey.get(key);
    if (!prev || item.confidence > prev.confidence) {
      matchedByKey.set(key, item);
    }
  }
  const merged_matched = [...matchedByKey.values()];

  // ── missing_from_cmms ─────────────────────────────────────────────────────
  const missingByKey = new Map<string, MissingPart>();
  for (const item of [...existing.missing_from_cmms, ...incoming.missing_from_cmms]) {
    const key = item.oem_part_number
      ? normKey(item.oem_part_number)
      : `desc:${item.oem_description.toLowerCase().trim().slice(0, 60)}`;
    if (!missingByKey.has(key)) {
      missingByKey.set(key, item);
    }
  }
  const merged_missing = [...missingByKey.values()];

  // ── extra_in_cmms ─────────────────────────────────────────────────────────
  const extraByKey = new Map<string, ExtraPart>();
  for (const item of [...existing.extra_in_cmms, ...incoming.extra_in_cmms]) {
    const key = item.cmms_part_number
      ? normKey(item.cmms_part_number)
      : `desc:${item.cmms_description.toLowerCase().trim().slice(0, 60)}`;
    if (!extraByKey.has(key)) {
      extraByKey.set(key, item);
    }
  }
  const merged_extra = [...extraByKey.values()];

  // ── recalculate summary ───────────────────────────────────────────────────
  const matched_count = merged_matched.length;
  const missing_count = merged_missing.length;
  const extra_count = merged_extra.length;
  const total = matched_count + missing_count;

  return {
    equipment_identified: existing.equipment_identified,
    oem_parts_count: existing.oem_parts_count + incoming.oem_parts_count,
    cmms_parts_count: existing.cmms_parts_count, // same CMMS file throughout
    summary: {
      matched_count,
      missing_count,
      extra_count,
      match_rate: total > 0 ? matched_count / total : 0,
      critical_missing_count: merged_missing.filter((p) => p.criticality === "CRITICAL").length,
      important_missing_count: merged_missing.filter((p) => p.criticality === "IMPORTANT").length,
      routine_missing_count: merged_missing.filter((p) => p.criticality === "ROUTINE").length,
    },
    matched: merged_matched,
    missing_from_cmms: merged_missing,
    extra_in_cmms: merged_extra,
  };
}
