export type MatchedPart = {
  oem_part_number: string | null;
  oem_description: string;
  cmms_part_number: string | null;
  cmms_description: string;
  confidence: number;
  match_rationale: string;
  source_doc?: string;
};

export type SourcingCategory =
  | "distributor_stock"
  | "oem_configured"
  | "oem_proprietary"
  | "fabricate"
  | "unknown";

export type MissingPart = {
  oem_part_number: string | null;
  oem_description: string;
  criticality: "CRITICAL" | "IMPORTANT" | "ROUTINE";
  reason: string;
  recommendation: string;
  source?: "parts_table" | "visual_inspection";
  visual_note?: string | null;
  sourcing_category?: SourcingCategory;
  lead_time_estimate?: string | null;
  sourcing_note?: string | null;
  source_doc?: string;
};

export type ReviewPart = {
  oem_part_number: string | null;
  oem_description: string;
  cmms_part_number: string | null;
  cmms_description: string;
  issue: string;
  recommendation: string;
  source_doc?: string;
};

export type ExtraPart = {
  cmms_part_number: string | null;
  cmms_description: string;
  note: string;
  source_doc?: string;
};

export type CmmsScope = {
  asset_entry_count: number;
  asset_node: string | null;
  note: string;
};

export type AnalysisResult = {
  equipment_identified: string;
  oem_parts_count: number;
  cmms_parts_count: number;
  cmms_scope?: CmmsScope;
  coverage_note?: string;
  summary: {
    matched_count: number;
    missing_count: number;
    extra_count: number;
    match_rate: number;
    critical_missing_count: number;
    important_missing_count: number;
    routine_missing_count: number;
    visually_identified_count?: number;
    needs_review_count?: number;
  };
  matched: MatchedPart[];
  missing_from_cmms: MissingPart[];
  needs_review?: ReviewPart[];
  extra_in_cmms: ExtraPart[];
};

export type Asset = {
  id: string;
  name: string;
  oemFileNames: string[];
  result: AnalysisResult;
};

export type Session = {
  clientName: string;
  plantName: string;
  cmmsFileName: string;
  cmmsRowCount: number;
  cmmsText: string;
};
