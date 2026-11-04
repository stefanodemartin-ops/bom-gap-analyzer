"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Asset, Session } from "@/lib/types";
import { tagResult, mergeResults } from "@/lib/mergeResults";
import UploadZone from "./UploadZone";
import { BACK_LINK, BAD_TEXT, BTN, CARD, GHOST, GOOD_TEXT, PILL_CRITICAL, PILL_IMPORTANT, PILL_NEUTRAL, Spinner, WARN_TEXT } from "./ui";

type Props = {
  asset: Asset;
  session: Session;
  onBack: () => void;
  onUpdateAsset: (asset: Asset) => void;
};

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

const CRITICALITY_PILLS = {
  CRITICAL: PILL_CRITICAL,
  IMPORTANT: PILL_IMPORTANT,
  ROUTINE: PILL_NEUTRAL,
};

const CRITICALITY_LABELS = {
  CRITICAL: "Critical",
  IMPORTANT: "Important",
  ROUTINE: "Routine",
};

const SOURCING_LABELS: Record<string, string> = {
  distributor_stock: "Distributor stock",
  oem_configured: "OEM configured",
  oem_proprietary: "OEM proprietary",
  fabricate: "Fabricate from drawing",
  unknown: "Sourcing unknown",
};

function exportMissingParts(asset: Asset) {
  const order = { CRITICAL: 0, IMPORTANT: 1, ROUTINE: 2 };
  const sorted = [...asset.result.missing_from_cmms].sort(
    (a, b) => order[a.criticality] - order[b.criticality]
  );
  const rows = sorted.map((item) => ({
    "OEM Part Number": item.oem_part_number ?? "",
    "OEM Description": item.oem_description,
    "Criticality": item.criticality,
    "Sourcing": item.sourcing_category ? SOURCING_LABELS[item.sourcing_category] ?? item.sourcing_category : "",
    "Typical Lead Time": item.lead_time_estimate ?? "",
    "Reason": item.reason,
    "Recommendation": item.recommendation,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 18 }, { wch: 40 }, { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 50 }, { wch: 50 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Missing Parts");
  const slug = asset.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  XLSX.writeFile(wb, `${slug}-missing-parts.xlsx`);
}

export default function AssetDetail({ asset, session, onBack, onUpdateAsset }: Props) {
  const { result } = asset;
  const { summary } = result;

  const [addDocsOpen, setAddDocsOpen] = useState(false);
  const [newOemFiles, setNewOemFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadReport = async () => {
    setGeneratingReport(true);
    setError(null);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, asset }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? `Report failed (${res.status})`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = asset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      a.href = url;
      a.download = `sparesview-gap-analysis-${slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Network error while generating the report.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleAddDocuments = async () => {
    if (!newOemFiles.length) return;
    setAnalyzing(true);
    setError(null);

    try {
      const body = new FormData();
      for (const f of newOemFiles) body.append("oem", f);
      body.append("cmms", new Blob([session.cmmsText], { type: "text/csv" }), session.cmmsFileName);

      const res = await fetch("/api/analyze", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? `Server error (${res.status})`);
        return;
      }

      const newFileNames = newOemFiles.map((f) => f.name);
      const tagged = tagResult(data, newFileNames.join(", "));
      const merged = mergeResults(result, tagged);

      onUpdateAsset({
        ...asset,
        oemFileNames: [...asset.oemFileNames, ...newFileNames],
        result: merged,
      });

      setNewOemFiles([]);
      setAddDocsOpen(false);
    } catch {
      setError("Network error — is the dev server running?");
    } finally {
      setAnalyzing(false);
    }
  };

  const multiDoc = asset.oemFileNames.length > 1;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <button onClick={onBack} className={BACK_LINK}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to asset list
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setAddDocsOpen((o) => !o); setError(null); setNewOemFiles([]); }}
            disabled={analyzing}
            className={GHOST}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Documents
          </button>
          {result.missing_from_cmms.length > 0 && (
            <button onClick={() => exportMissingParts(asset)} className={GHOST}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Missing Parts
            </button>
          )}
          <button onClick={handleDownloadReport} disabled={generatingReport} className={BTN}>
            {generatingReport ? (
              <Spinner />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            )}
            {generatingReport ? "Generating…" : "Download Report"}
          </button>
        </div>
      </div>

      {/* Asset header card */}
      <div className={`${CARD} mb-5 overflow-hidden`}>
        <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr]">
          <HeaderLabel>Asset</HeaderLabel>
          <HeaderValue>
            <span className="text-[16px] font-semibold text-[#0A0A0A]">{asset.name}</span>
          </HeaderValue>
          <HeaderLabel>Equipment</HeaderLabel>
          <HeaderValue>{result.equipment_identified}</HeaderValue>
          <HeaderLabel>OEM documents</HeaderLabel>
          <HeaderValue>
            <span className="font-mono text-[12px] text-[#3F3F46]">{asset.oemFileNames.join("  ·  ")}</span>
          </HeaderValue>
          {result.cmms_scope?.asset_node && (
            <>
              <HeaderLabel last>CMMS node</HeaderLabel>
              <HeaderValue last>
                <span className="font-mono text-[12px] text-[#3F3F46]">{result.cmms_scope.asset_node}</span>
              </HeaderValue>
            </>
          )}
        </div>
      </div>

      {/* Inline add-documents panel */}
      {addDocsOpen && (
        <div className={`${CARD} mb-5 !border-[#0A0A0A] overflow-hidden`}>
          <div className="px-6 pt-5 pb-4 border-b border-[#F1F1F3]">
            <p className="m-0 text-[14px] font-semibold text-[#0A0A0A]">Add OEM Documents</p>
            <p className="m-0 text-[12.5px] text-[#71717A] mt-0.5">
              New documents will be analyzed against{" "}
              <span className="font-medium text-[#3F3F46]">{session.cmmsFileName}</span> and merged into existing results.
            </p>
          </div>

          <div className="px-6 py-5">
            <UploadZone
              label="New OEM documents"
              description="Parts list, BOM, or service manual"
              accept=".pdf,application/pdf"
              acceptLabel="PDF"
              multiple
              files={newOemFiles}
              onFiles={(f) => setNewOemFiles((prev) => [...prev, ...f])}
              onRemoveFile={(i) => setNewOemFiles((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={analyzing}
            />
          </div>

          {error && (
            <div className="mx-6 mb-4 bg-[#FEF2F2] rounded-lg px-4 py-3 text-[14px] text-[#B42318]" role="alert">
              <span className="font-semibold">Error: </span>{error}
            </div>
          )}

          <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#F1F1F3] flex items-center justify-between gap-3">
            <button
              onClick={() => { setAddDocsOpen(false); setNewOemFiles([]); setError(null); }}
              disabled={analyzing}
              className="text-[14px] font-medium text-[#52525B] hover:text-[#0A0A0A] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button onClick={handleAddDocuments} disabled={!newOemFiles.length || analyzing} className={BTN}>
              {analyzing ? (
                <>
                  <Spinner />
                  Analyzing…
                </>
              ) : (
                "Analyze New Documents"
              )}
            </button>
          </div>
        </div>
      )}

      {/* CMMS scope — what the BOM already contains for this asset */}
      {result.cmms_scope && (
        <div className={`${CARD} px-4 py-2.5 text-[14px] text-[#52525B] mb-4`}>
          Your CMMS already contains{" "}
          <span className="font-semibold text-[#0A0A0A]">{result.cmms_scope.asset_entry_count}</span> entries for
          this asset. The coverage figures below measure how much of your OEM documents those entries cover — not
          whether the BOM is empty.
        </div>
      )}

      {/* Summary stats */}
      <div className={`${CARD} grid grid-cols-2 ${result.cmms_scope ? "sm:grid-cols-5" : "sm:grid-cols-4"} mb-4 overflow-hidden`}>
        <StatCell value={pct(summary.match_rate)} label="Drawing coverage in CMMS" color="text-[#0A0A0A]" />
        {result.cmms_scope && (
          <StatCell value={result.cmms_scope.asset_entry_count} label="In CMMS for this asset" color="text-[#0A0A0A]" />
        )}
        <StatCell value={summary.matched_count} label="Matched" color={GOOD_TEXT} />
        <StatCell value={summary.missing_count} label="Missing" color={BAD_TEXT} />
        <StatCell value={summary.needs_review_count ?? 0} label="Needs review" color={WARN_TEXT} last />
      </div>

      {result.coverage_note && (
        <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg px-4 py-2.5 text-[14px] text-[#3F3F46] mb-3">
          <span className="font-semibold text-[#0A0A0A]">Document coverage: </span>{result.coverage_note}
        </div>
      )}

      {summary.critical_missing_count > 0 && (
        <div className="bg-[#FEF2F2] rounded-lg px-4 py-2.5 text-[14px] text-[#B42318] font-medium mb-3">
          {summary.critical_missing_count} critical part{summary.critical_missing_count > 1 ? "s are" : " is"} missing from your CMMS — immediate attention recommended.
        </div>
      )}
      {(summary.visually_identified_count ?? 0) > 0 && (
        <div className="bg-[#EFF6FF] rounded-lg px-4 py-2.5 text-[14px] text-[#1D4ED8] font-medium mb-6">
          {summary.visually_identified_count} part{summary.visually_identified_count === 1 ? "" : "s"} identified from visual inspection of drawings — not listed in any parts table.
        </div>
      )}

      <div className="flex flex-col gap-8">
        <MissingSection items={result.missing_from_cmms} showSource={multiDoc} />
        <NeedsReviewSection items={result.needs_review ?? []} showSource={multiDoc} />
        <MatchedSection items={result.matched} showSource={multiDoc} />
        <ExtraSection items={result.extra_in_cmms} />
      </div>
    </div>
  );
}

function HeaderLabel({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`px-4 py-2.5 bg-[#FAFAFA] border-r border-[#F1F1F3] ${last ? "" : "border-b"} text-[11px] uppercase tracking-[0.08em] text-[#71717A] font-medium flex items-center`}>
      {children}
    </div>
  );
}

function HeaderValue({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`px-4 py-2.5 ${last ? "" : "border-b"} border-[#F1F1F3] text-[14px] text-[#3F3F46] min-w-0`}>
      {children}
    </div>
  );
}

function StatCell({ value, label, color, last }: { value: string | number; label: string; color: string; last?: boolean }) {
  return (
    <div className={`bg-white px-4 py-3.5 ${last ? "" : "sm:border-r sm:border-[#F1F1F3]"}`}>
      <p className={`m-0 text-[24px] font-semibold tracking-[-0.02em] tabular-nums ${color}`}>{value}</p>
      <p className="m-0 text-[11.5px] text-[#71717A] mt-0.5">{label}</p>
    </div>
  );
}

function SectionHeader({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <h3 className="m-0 text-[14px] font-semibold text-[#0A0A0A] tracking-[-0.01em] mb-2 flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
      {label}
      <span className="ml-1 font-normal text-[#71717A]">({count})</span>
    </h3>
  );
}

function SourceBadge({ doc }: { doc?: string }) {
  if (!doc) return null;
  return (
    <span className="text-[10.5px] text-[#71717A] bg-[#F4F4F5] px-1.5 py-0.5 rounded font-mono truncate max-w-[160px] inline-block align-middle" title={doc}>
      {doc}
    </span>
  );
}

const TH = "px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.06em] text-[#71717A] font-medium whitespace-nowrap";
const TD = "px-4 py-3 align-top";

function MissingSection({ items, showSource }: { items: Asset["result"]["missing_from_cmms"]; showSource: boolean }) {
  if (items.length === 0) return null;
  const order = { CRITICAL: 0, IMPORTANT: 1, ROUTINE: 2 };
  const sorted = [...items].sort((a, b) => order[a.criticality] - order[b.criticality]);

  const hasSourcing = sorted.some((i) => i.sourcing_category || i.lead_time_estimate);

  return (
    <section>
      <SectionHeader color="bg-[#B42318]" label="Missing from CMMS" count={items.length} />
      {hasSourcing && (
        <p className="m-0 text-[12.5px] text-[#71717A] mb-2">
          Lead times are planning estimates based on sourcing category — not supplier quotes.
        </p>
      )}
      <div className={`${CARD} overflow-x-auto`}>
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
              <th className={TH}>Part no.</th>
              <th className={`${TH} w-full`}>Description / action</th>
              <th className={TH}>Priority</th>
              {hasSourcing && <th className={TH}>Sourcing</th>}
              {hasSourcing && <th className={TH}>Typical lead time</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => (
              <tr key={i} className="border-b border-[#F1F1F3] last:border-b-0 hover:bg-[#FAFAFA]">
                <td className={`${TD} whitespace-nowrap`}>
                  {item.oem_part_number ? (
                    <span className="font-mono text-[12px] text-[#3F3F46]">{item.oem_part_number}</span>
                  ) : (
                    <span className="text-[12px] text-[#D4D4D8]">—</span>
                  )}
                  {item.source === "visual_inspection" && (
                    <span className="block mt-1 w-fit text-[10.5px] font-medium text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                      Visual
                    </span>
                  )}
                </td>
                <td className={TD}>
                  <p className="m-0 font-medium text-[#0A0A0A]">{item.oem_description}</p>
                  <p className="m-0 text-[12.5px] text-[#52525B] mt-1">{item.reason}</p>
                  {item.visual_note && <p className="m-0 text-[12.5px] text-[#1D4ED8] mt-0.5 italic">{item.visual_note}</p>}
                  <p className="m-0 text-[12.5px] text-[#0A0A0A] font-medium mt-0.5">{item.recommendation}</p>
                  {item.sourcing_note && <p className="m-0 text-[12.5px] text-[#71717A] mt-0.5 italic">{item.sourcing_note}</p>}
                  {showSource && <span className="block mt-1"><SourceBadge doc={item.source_doc} /></span>}
                </td>
                <td className={`${TD} whitespace-nowrap`}>
                  <span className={CRITICALITY_PILLS[item.criticality]}>{CRITICALITY_LABELS[item.criticality]}</span>
                </td>
                {hasSourcing && (
                  <td className={`${TD} whitespace-nowrap text-[12.5px] text-[#3F3F46]`}>
                    {item.sourcing_category ? SOURCING_LABELS[item.sourcing_category] ?? item.sourcing_category : "—"}
                  </td>
                )}
                {hasSourcing && (
                  <td className={`${TD} whitespace-nowrap text-[12.5px] text-[#3F3F46] tabular-nums`}>
                    {item.lead_time_estimate ?? "—"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NeedsReviewSection({
  items,
  showSource,
}: {
  items: NonNullable<Asset["result"]["needs_review"]>;
  showSource: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeader color="bg-[#D97706]" label="Needs review — possible data entry errors" count={items.length} />
      <p className="m-0 text-[12.5px] text-[#71717A] mb-2">
        The drawing and your CMMS disagree on these — verify which model is physically installed.
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className={`${CARD} px-5 py-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <p className="m-0 text-[11px] uppercase tracking-[0.06em] text-[#71717A] font-medium">OEM document says</p>
                <p className="m-0 text-[14px] text-[#0A0A0A] mt-1">
                  {item.oem_part_number && (
                    <span className="font-mono text-[12px] bg-[#F4F4F5] text-[#3F3F46] px-1.5 py-0.5 rounded mr-1.5">
                      {item.oem_part_number}
                    </span>
                  )}
                  {item.oem_description}
                </p>
                {showSource && <SourceBadge doc={item.source_doc} />}
              </div>
              <div>
                <p className="m-0 text-[11px] uppercase tracking-[0.06em] text-[#71717A] font-medium">Your CMMS has</p>
                <p className="m-0 text-[14px] text-[#0A0A0A] mt-1">
                  {item.cmms_part_number && (
                    <span className="font-mono text-[12px] bg-[#F4F4F5] text-[#3F3F46] px-1.5 py-0.5 rounded mr-1.5">
                      {item.cmms_part_number}
                    </span>
                  )}
                  {item.cmms_description}
                </p>
              </div>
            </div>
            <p className={`m-0 text-[12.5px] ${WARN_TEXT} mt-2.5`}>{item.issue}</p>
            <p className="m-0 text-[12.5px] text-[#0A0A0A] font-medium mt-1">{item.recommendation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MatchedSection({ items, showSource }: { items: Asset["result"]["matched"]; showSource: boolean }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  const visible = open ? items : items.slice(0, 6);

  return (
    <section>
      <SectionHeader color="bg-[#0F766E]" label="Matched parts" count={items.length} />
      <div className={`${CARD} overflow-x-auto`}>
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
              <th className={`${TH} w-1/2`}>OEM document</th>
              <th className={`${TH} w-1/2`}>CMMS entry</th>
              <th className={TH}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, i) => (
              <tr key={i} className="border-b border-[#F1F1F3] last:border-b-0 hover:bg-[#FAFAFA]">
                <td className={TD}>
                  {item.oem_part_number && (
                    <span className="font-mono text-[12px] text-[#3F3F46] block">{item.oem_part_number}</span>
                  )}
                  <span className="text-[#3F3F46] text-[12.5px]">{item.oem_description}</span>
                  {showSource && <span className="block mt-0.5"><SourceBadge doc={item.source_doc} /></span>}
                </td>
                <td className={TD}>
                  {item.cmms_part_number && (
                    <span className="font-mono text-[12px] text-[#3F3F46] block">{item.cmms_part_number}</span>
                  )}
                  <span className="text-[#3F3F46] text-[12.5px]">{item.cmms_description}</span>
                  {item.match_rationale && (
                    <span className="block text-[12.5px] text-[#71717A] italic mt-0.5">{item.match_rationale}</span>
                  )}
                </td>
                <td className={`${TD} whitespace-nowrap`}>
                  <span className={`text-[12.5px] font-semibold ${GOOD_TEXT} tabular-nums`}>{pct(item.confidence)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > 6 && (
        <button onClick={() => setOpen(!open)} className="mt-2 text-[13px] font-medium text-[#52525B] hover:text-[#0A0A0A] underline underline-offset-4 cursor-pointer">
          {open ? "Show less" : `Show all ${items.length} matched parts`}
        </button>
      )}
    </section>
  );
}

function ExtraSection({ items }: { items: Asset["result"]["extra_in_cmms"] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  const visible = open ? items : items.slice(0, 6);

  return (
    <section>
      <SectionHeader color="bg-[#D97706]" label="In CMMS, not in these documents" count={items.length} />
      <div className={`${CARD} overflow-x-auto`}>
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
              <th className={TH}>CMMS number</th>
              <th className={`${TH} w-full`}>Description</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, i) => (
              <tr key={i} className="border-b border-[#F1F1F3] last:border-b-0 hover:bg-[#FAFAFA]">
                <td className={`${TD} whitespace-nowrap`}>
                  {item.cmms_part_number ? (
                    <span className="font-mono text-[12px] text-[#3F3F46]">{item.cmms_part_number}</span>
                  ) : (
                    <span className="text-[12px] text-[#D4D4D8]">—</span>
                  )}
                </td>
                <td className={TD}>
                  <span className="text-[#3F3F46] text-[12.5px]">{item.cmms_description}</span>
                  {item.note && <span className="block text-[12.5px] text-[#71717A] mt-0.5">{item.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > 6 && (
        <button onClick={() => setOpen(!open)} className="mt-2 text-[13px] font-medium text-[#52525B] hover:text-[#0A0A0A] underline underline-offset-4 cursor-pointer">
          {open ? "Show less" : `Show all ${items.length} extra entries`}
        </button>
      )}
    </section>
  );
}
