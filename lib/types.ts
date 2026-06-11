export type MatchedPart = {
  oem_part_number: string | null;
  oem_description: string;
  cmms_part_number: string | null;
  cmms_description: string;
  confidence: number;
  match_rationale: string;
  source_doc?: string;
};

export type MissingPart = {
  oem_part_number: string | null;
  oem_description: string;
  criticality: "CRITICAL" | "IMPORTANT" | "ROUTINE";
  reason: string;
  recommendation: string;
  source?: "parts_table" | "visual_inspection";
  visual_note?: string | null;
  source_doc?: string;
};

export type ExtraPart = {
  cmms_part_number: string | null;
  cmms_description: string;
  note: string;
  source_doc?: string;
};

export type AnalysisResult = {
  equipment_identified: string;
  oem_parts_count: number;
  cmms_parts_count: number;
  summary: {
    matched_count: number;
    missing_count: number;
    extra_count: number;
    match_rate: number;
    critical_missing_count: number;
    important_missing_count: number;
    routine_missing_count: number;
    visually_identified_count?: number;
  };
  matched: MatchedPart[];
  missing_from_cmms: MissingPart[];
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
