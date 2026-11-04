"use client";

import { useState } from "react";
import UploadZone from "./UploadZone";
import { Asset, Session } from "@/lib/types";
import { tagResult } from "@/lib/mergeResults";
import { BACK_LINK, BTN, CARD, INPUT, LABEL, Spinner } from "./ui";

type Props = {
  session: Session;
  onBack: () => void;
  onComplete: (asset: Asset) => void;
};

const ANALYSIS_STEPS = [
  "Reading OEM documents",
  "Extracting parts and part numbers",
  "Comparing against your CMMS export",
  "Classifying gaps and criticality",
];

export default function AddAsset({ session, onBack, onComplete }: Props) {
  const [assetName, setAssetName] = useState("");
  const [oemFiles, setOemFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = assetName.trim() && oemFiles.length > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setAnalysisStep(0);
    setError(null);

    // Advance the displayed step on a timer while the API call runs
    const stepTimers = [
      setTimeout(() => setAnalysisStep(1), 6000),
      setTimeout(() => setAnalysisStep(2), 14000),
      setTimeout(() => setAnalysisStep(3), 24000),
    ];

    try {
      const body = new FormData();
      for (const f of oemFiles) body.append("oem", f);
      // Re-send CMMS as a blob so the API receives it as a file
      body.append("cmms", new Blob([session.cmmsText], { type: "text/csv" }), session.cmmsFileName);

      const res = await fetch("/api/analyze", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? `Server error (${res.status})`);
        return;
      }

      const fileNames = oemFiles.map((f) => f.name);
      onComplete({
        id: crypto.randomUUID(),
        name: assetName.trim(),
        oemFileNames: fileNames,
        result: tagResult(data, fileNames.join(", ")),
      });
    } catch {
      setError("Network error — is the dev server running?");
    } finally {
      stepTimers.forEach(clearTimeout);
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={onBack} className={`${BACK_LINK} mb-6`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to asset list
      </button>

      <div className={`${CARD} overflow-hidden`}>
        <div className="px-8 pt-8 pb-6 border-b border-[#F1F1F3]">
          <h2 className="m-0 text-[18px] font-semibold text-[#0A0A0A] tracking-[-0.01em]">Add Asset</h2>
          <p className="text-[14px] text-[#71717A] mt-1">
            Upload the OEM document(s) for this asset. Analysis will run against{" "}
            <span className="font-medium text-[#3F3F46]">{session.cmmsFileName}</span>.
          </p>
        </div>

        <div className="px-8 py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Asset name</label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g. Centrifugal Pump P-101"
              disabled={analyzing}
              className={INPUT}
            />
          </div>

          <UploadZone
            label="OEM documents"
            description="Parts list, BOM, or service manual — multiple files supported"
            accept=".pdf,application/pdf"
            acceptLabel="PDF"
            multiple
            files={oemFiles}
            onFiles={(newFiles) => setOemFiles((prev) => [...prev, ...newFiles])}
            onRemoveFile={(i) => setOemFiles((prev) => prev.filter((_, idx) => idx !== i))}
            disabled={analyzing}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            }
          />
        </div>

        {analyzing && (
          <div className="mx-8 mb-6 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <Spinner className="w-5 h-5 text-[#0A0A0A] shrink-0" />
              <p className="m-0 text-[14px] font-semibold text-[#0A0A0A]">
                Analyzing {assetName.trim() || "asset"}…
              </p>
            </div>
            <ul className="flex flex-col gap-2 m-0 p-0 list-none">
              {ANALYSIS_STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-2.5 text-[14px]">
                  {i < analysisStep ? (
                    <svg className="w-4 h-4 text-[#0F766E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : i === analysisStep ? (
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#0A0A0A] animate-pulse" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#D4D4D8]" />
                    </span>
                  )}
                  <span className={i <= analysisStep ? "text-[#0A0A0A]" : "text-[#A1A1AA]"}>{step}</span>
                </li>
              ))}
            </ul>
            <p className="m-0 text-[12px] text-[#71717A] mt-4">
              AI analysis typically takes 20–60 seconds depending on document size.
            </p>
          </div>
        )}

        {error && (
          <div className="mx-8 mb-4 bg-[#FEF2F2] rounded-lg px-5 py-3 text-[14px] text-[#B42318]" role="alert">
            <span className="font-semibold">Error: </span>{error}
          </div>
        )}

        <div className="px-8 py-6 bg-[#FAFAFA] border-t border-[#F1F1F3] flex items-center justify-between gap-4">
          <p className="m-0 text-[12.5px] text-[#71717A]">
            {oemFiles.length === 0
              ? "No OEM documents selected"
              : `${oemFiles.length} document${oemFiles.length > 1 ? "s" : ""} selected`}
          </p>
          <button onClick={handleAnalyze} disabled={!canAnalyze || analyzing} className={BTN}>
            {analyzing ? (
              <>
                <Spinner />
                Analyzing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
