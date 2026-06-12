"use client";

import { useEffect, useState } from "react";
import UploadZone from "./UploadZone";
import { Session } from "@/lib/types";
import { getRecentSessions, RecentSession } from "@/lib/persistence";

type Props = {
  onContinue: (session: Session) => void;
  onLoadSample: () => void;
  onOpenSession: (id: string) => void;
};

export default function StartScreen({ onContinue, onLoadSample, onOpenSession }: Props) {
  const [recents, setRecents] = useState<RecentSession[]>([]);

  // localStorage is browser-only — read it after mount to avoid hydration mismatch
  useEffect(() => {
    setRecents(getRecentSessions());
  }, []);
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
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 flex flex-col items-center justify-center px-6 py-14">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B2A4A] mb-5 shadow-md">
          <svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-[#1B2A4A] tracking-tight leading-none">
          SparesView
        </h1>
        <p className="text-lg text-slate-500 mt-2 font-medium">Spare Parts Intelligence</p>
        <p className="text-sm text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed">
          Surface gaps between OEM parts lists and your CMMS before they cause unplanned downtime.
        </p>
      </div>

      {/* Setup card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 pt-7 pb-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-[#1E293B]">New Analysis Session</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Enter your client and site details, then upload the CMMS export used for all assets.
          </p>
        </div>

        <div className="px-8 py-7 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plant / Site</label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Houston Plant 2"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
            <p className="text-xs text-slate-400 -mt-2">
              {cmmsRowCount.toLocaleString()} data rows detected
            </p>
          )}
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={[
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
              canContinue
                ? "bg-sky-500 text-white hover:bg-sky-600 shadow-sm cursor-pointer"
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

      {/* Recent sessions */}
      {recents.length > 0 && (
        <div className="w-full max-w-lg mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <p className="px-6 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Recent sessions on this computer
          </p>
          <ul>
            {recents.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => onOpenSession(r.id)}
                  className="w-full flex items-center justify-between gap-3 px-6 py-3 text-left hover:bg-slate-50 transition-colors cursor-pointer border-t border-slate-100"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-700 truncate">{r.clientName}</span>
                    <span className="block text-xs text-slate-400 truncate">{r.plantName}</span>
                  </span>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(r.savedAt).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sample analysis entry point */}
      <button
        onClick={onLoadSample}
        className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors cursor-pointer group"
      >
        <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Just looking? <span className="font-semibold text-sky-600 group-hover:underline">Explore a sample analysis</span>
        <svg className="w-3.5 h-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}
