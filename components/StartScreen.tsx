"use client";

import { useState } from "react";
import UploadZone from "./UploadZone";
import { Session } from "@/lib/types";

type Props = {
  onContinue: (session: Session) => void;
};

export default function StartScreen({ onContinue }: Props) {
  const [clientName, setClientName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [cmmsFile, setCmmsFile] = useState<File | null>(null);
  const [cmmsRowCount, setCmmsRowCount] = useState(0);
  const [cmmsText, setCmmsText] = useState("");

  const canContinue = clientName.trim() && plantName.trim() && cmmsFile;

  const handleCmmsFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const text = await file.text();
    const rowCount = Math.max(0, text.split("\n").filter((l) => l.trim()).length - 1);
    setCmmsFile(file);
    setCmmsText(text);
    setCmmsRowCount(rowCount);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue({
      clientName: clientName.trim(),
      plantName: plantName.trim(),
      cmmsFileName: cmmsFile!.name,
      cmmsRowCount,
      cmmsText,
    });
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">New Analysis Session</h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter your client and site details, then upload the CMMS export that will be used for all asset analyses.
          </p>
        </div>

        <div className="px-8 py-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Plant / Site</label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Houston Plant 2"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <UploadZone
            label="CMMS Export"
            description="Inventory or spare parts export — used for all assets"
            accept=".csv,text/csv"
            acceptLabel="CSV"
            files={cmmsFile ? [cmmsFile] : []}
            onFiles={handleCmmsFile}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-7.5A1.125 1.125 0 013.375 9.75h16.5A1.125 1.125 0 0121 10.875m0 7.5v-7.5m0 7.5a1.125 1.125 0 01-1.125 1.125M21 10.875v-3a1.125 1.125 0 00-1.125-1.125h-16.5A1.125 1.125 0 003.375 7.875v3m17.25 0h-17.25" />
              </svg>
            }
          />

          {cmmsFile && (
            <p className="text-xs text-slate-400 -mt-3">
              {cmmsRowCount.toLocaleString()} data rows detected
            </p>
          )}
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={[
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
              canContinue
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed",
            ].join(" ")}
          >
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
