"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Asset, Session } from "@/lib/types";
import { tagResult, mergeResults } from "@/lib/mergeResults";
import UploadZone from "./UploadZone";

type Props = {
  asset: Asset;
  session: Session;
  onBack: () => void;
  onUpdateAsset: (asset: Asset) => void;
};

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

const CRITICALITY_STYLES = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  IMPORTANT: "bg-amber-100 text-amber-700 border-amber-200",
  ROUTINE: "bg-slate-100 text-slate-600 border-slate-200",
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
    "Category": "",
    "Reason": item.reason,
    "Recommendation": item.recommendation,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 18 }, { wch: 40 }, { wch: 12 }, { wch: 20 }, { wch: 50 }, { wch: 50 }];
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
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to asset list
        </button>
        <div className="flex items-center gap-2">
          {result.missing_from_cmms.length > 0 && (
            <button
              onClick={() => exportMissingParts(asset)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Missing Parts
            </button>
          )}
          <button
            onClick={handleDownloadReport}
            disabled={generatingReport}
            className={[
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
              generatingReport
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-sky-500 text-white hover:bg-sky-600 shadow-sm cursor-pointer",
            ].join(" ")}
          >
            {generatingReport ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            )}
            {generatingReport ? "Generating…" : "Download Report"}
          </button>
        </div>
      </div>

      {/* Asset header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{asset.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{asset.oemFileNames.join(" · ")}</p>
          <p className="text-xs text-slate-400">{result.equipment_identified}</p>
        </div>
        <button
          onClick={() => { setAddDocsOpen((o) => !o); setError(null); setNewOemFiles([]); }}
          disabled={analyzing}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Documents
        </button>
      </div>

      {/* Inline add-documents panel */}
      {addDocsOpen && (
        <div className="mb-6 bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Add OEM Documents</p>
            <p className="text-xs text-slate-400 mt-0.5">
              New documents will be analyzed against{" "}
              <span className="font-medium text-slate-600">{session.cmmsFileName}</span> and merged into existing results.
            </p>
          </div>

          <div className="px-6 py-5">
            <UploadZone
              label="New OEM Documents"
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
            <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <span className="font-semibold">Error: </span>{error}
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => { setAddDocsOpen(false); setNewOemFiles([]); setError(null); }}
              disabled={analyzing}
              className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDocuments}
              disabled={!newOemFiles.length || analyzing}
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150",
                newOemFiles.length && !analyzing
                  ? "bg-sky-500 text-white hover:bg-sky-600 shadow-sm cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              {analyzing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                "Analyze New Documents"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 text-center">
          <p className="text-xl font-bold text-emerald-600 leading-tight">{pct(summary.match_rate)}</p>
          <p className="text-xs text-slate-500">matched</p>
          <p className="text-xl font-bold text-red-600 leading-tight mt-2">{pct(1 - summary.match_rate)}</p>
          <p className="text-xs text-slate-500">missing</p>
        </div>
        {[
          { label: "Matched", value: summary.matched_count, color: "text-emerald-600" },
          { label: "Missing", value: summary.missing_count, color: "text-red-600" },
          { label: "Extra in CMMS", value: summary.extra_count, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {summary.critical_missing_count > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 font-medium mb-3">
          {summary.critical_missing_count} critical part{summary.critical_missing_count > 1 ? "s are" : " is"} missing from your CMMS — immediate attention recommended.
        </div>
      )}
      {(summary.visually_identified_count ?? 0) > 0 && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 text-sm text-violet-700 font-medium mb-6">
          {summary.visually_identified_count} part{summary.visually_identified_count === 1 ? "" : "s"} identified from visual inspection of drawings — not listed in any parts table.
        </div>
      )}

      <div className="flex flex-col gap-8">
        <MissingSection items={result.missing_from_cmms} showSource={multiDoc} />
        <MatchedSection items={result.matched} showSource={multiDoc} />
        <ExtraSection items={result.extra_in_cmms} />
      </div>
    </div>
  );
}

function SectionHeader({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
      {label}
      <span className="ml-1 text-xs font-normal text-slate-400">({count})</span>
    </h3>
  );
}

function SourceBadge({ doc }: { doc?: string }) {
  if (!doc) return null;
  return (
    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono truncate max-w-[160px]" title={doc}>
      {doc}
    </span>
  );
}

function MissingSection({ items, showSource }: { items: Asset["result"]["missing_from_cmms"]; showSource: boolean }) {
  if (items.length === 0) return null;
  const order = { CRITICAL: 0, IMPORTANT: 1, ROUTINE: 2 };
  const sorted = [...items].sort((a, b) => order[a.criticality] - order[b.criticality]);

  return (
    <section>
      <SectionHeader color="bg-red-500" label="Missing from CMMS" count={items.length} />
      <div className="flex flex-col gap-2">
        {sorted.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.oem_part_number && (
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {item.oem_part_number}
                    </span>
                  )}
                  <span className="text-sm font-medium text-slate-800">{item.oem_description}</span>
                  {item.source === "visual_inspection" && (
                    <span className="text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
                      Visual
                    </span>
                  )}
                  {showSource && <SourceBadge doc={item.source_doc} />}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">{item.reason}</p>
                {item.visual_note && (
                  <p className="text-xs text-violet-600 mt-1 italic">{item.visual_note}</p>
                )}
                <p className="text-xs text-sky-600 mt-1">{item.recommendation}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded border ${CRITICALITY_STYLES[item.criticality]}`}>
                {item.criticality}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MatchedSection({ items, showSource }: { items: Asset["result"]["matched"]; showSource: boolean }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  const visible = open ? items : items.slice(0, 4);

  return (
    <section>
      <SectionHeader color="bg-emerald-500" label="Matched Parts" count={items.length} />
      <div className="flex flex-col gap-2">
        {visible.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 flex-1 min-w-0">
                <div>
                  <p className="text-xs text-slate-400">OEM</p>
                  <p className="text-sm text-slate-700">
                    {item.oem_part_number && <span className="font-mono text-xs text-slate-500 mr-1">{item.oem_part_number}</span>}
                    {item.oem_description}
                  </p>
                  {showSource && <SourceBadge doc={item.source_doc} />}
                </div>
                <div>
                  <p className="text-xs text-slate-400">CMMS</p>
                  <p className="text-sm text-slate-700">
                    {item.cmms_part_number && <span className="font-mono text-xs text-slate-500 mr-1">{item.cmms_part_number}</span>}
                    {item.cmms_description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-semibold text-emerald-600">{pct(item.confidence)}</span>
                <p className="text-xs text-slate-400">confidence</p>
              </div>
            </div>
            {item.match_rationale && (
              <p className="text-xs text-slate-400 mt-1.5 italic">{item.match_rationale}</p>
            )}
          </div>
        ))}
      </div>
      {items.length > 4 && (
        <button onClick={() => setOpen(!open)} className="mt-2 text-xs text-sky-600 hover:underline cursor-pointer">
          {open ? "Show less" : `Show all ${items.length} matched parts`}
        </button>
      )}
    </section>
  );
}

function ExtraSection({ items }: { items: Asset["result"]["extra_in_cmms"] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  const visible = open ? items : items.slice(0, 4);

  return (
    <section>
      <SectionHeader color="bg-amber-400" label="Extra in CMMS" count={items.length} />
      <div className="flex flex-col gap-2">
        {visible.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 px-5 py-3">
            <div className="flex items-start gap-2 flex-wrap">
              {item.cmms_part_number && (
                <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {item.cmms_part_number}
                </span>
              )}
              <span className="text-sm text-slate-700">{item.cmms_description}</span>
            </div>
            {item.note && <p className="text-xs text-slate-400 mt-1.5">{item.note}</p>}
          </div>
        ))}
      </div>
      {items.length > 4 && (
        <button onClick={() => setOpen(!open)} className="mt-2 text-xs text-sky-600 hover:underline cursor-pointer">
          {open ? "Show less" : `Show all ${items.length} extra entries`}
        </button>
      )}
    </section>
  );
}
