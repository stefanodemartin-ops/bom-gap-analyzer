"use client";

import { useState } from "react";
import UploadZone from "./UploadZone";
import { Asset, Session } from "@/lib/types";
import { tagResult } from "@/lib/mergeResults";

type Props = {
  session: Session;
  onBack: () => void;
  onComplete: (asset: Asset) => void;
};

export default function AddAsset({ session, onBack, onComplete }: Props) {
  const [assetName, setAssetName] = useState("");
  const [oemFiles, setOemFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = assetName.trim() && oemFiles.length > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setError(null);

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
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 cursor-pointer transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to asset list
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Add Asset</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload the OEM document(s) for this asset. Analysis will run against{" "}
            <span className="font-medium text-slate-600">{session.cmmsFileName}</span>.
          </p>
        </div>

        <div className="px-8 py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Asset Name</label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g. Centrifugal Pump P-101"
              disabled={analyzing}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <UploadZone
            label="OEM Documents"
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

        {error && (
          <div className="mx-8 mb-4 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700">
            <span className="font-semibold">Error: </span>{error}
          </div>
        )}

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {oemFiles.length === 0
              ? "No OEM documents selected"
              : `${oemFiles.length} document${oemFiles.length > 1 ? "s" : ""} selected`}
          </p>
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || analyzing}
            className={[
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
              canAnalyze && !analyzing
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer"
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
