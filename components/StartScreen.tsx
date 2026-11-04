"use client";

import { useState, useSyncExternalStore } from "react";
import UploadZone from "./UploadZone";
import { Session } from "@/lib/types";
import { BACK_LINK, BTN, CARD, INPUT, LABEL, MUTED } from "./ui";
import {
  getRecentSessionsSnapshot,
  getServerRecentsSnapshot,
  subscribeToRecents,
} from "@/lib/persistence";

type Props = {
  onContinue: (session: Session) => void;
  onLoadSample: () => void;
  onOpenSession: (id: string) => void;
  onBack: () => void;
};

export default function StartScreen({ onContinue, onLoadSample, onOpenSession, onBack }: Props) {
  // localStorage is browser-only; the server snapshot renders an empty list
  const recents = useSyncExternalStore(
    subscribeToRecents,
    getRecentSessionsSnapshot,
    getServerRecentsSnapshot
  );
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
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center px-6 py-10">
      {/* Back to services */}
      <div className="w-full max-w-lg">
        <button onClick={onBack} className={`${BACK_LINK} mb-6`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to services
        </button>
      </div>

      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="m-0 text-[30px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-none">
          BOM Gap Analysis
        </h1>
        <p className="text-[14px] text-[#71717A] mt-3 max-w-sm mx-auto leading-relaxed">
          Surface gaps between OEM parts lists and your CMMS before they cause unplanned downtime.
        </p>
      </div>

      {/* Setup card */}
      <div className={`${CARD} w-full max-w-lg overflow-hidden`}>
        <div className="px-8 pt-7 pb-5 border-b border-[#F1F1F3]">
          <h2 className="m-0 text-[16px] font-semibold text-[#0A0A0A]">New Analysis Session</h2>
          <p className="text-[14px] text-[#71717A] mt-0.5">
            Enter your client and site details, then upload the CMMS export used for all assets.
          </p>
        </div>

        <div className="px-8 py-7 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Client name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className={INPUT}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Plant / site</label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Houston Plant 2"
                className={INPUT}
              />
            </div>
          </div>

          <UploadZone
            label="CMMS export"
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
            <p className="text-[12.5px] text-[#71717A] -mt-2">
              {cmmsRowCount.toLocaleString()} data rows detected
            </p>
          )}
        </div>

        <div className="px-8 py-5 bg-[#FAFAFA] border-t border-[#F1F1F3] flex justify-end">
          <button onClick={handleContinue} disabled={!canContinue} className={BTN}>
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Recent sessions */}
      {recents.length > 0 && (
        <div className={`${CARD} w-full max-w-lg mt-6 overflow-hidden`}>
          <p className="px-6 pt-4 pb-2 text-[12px] font-medium text-[#71717A] tracking-[0.02em]">
            Recent sessions on this computer
          </p>
          <ul className="m-0 p-0 list-none">
            {recents.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => onOpenSession(r.id)}
                  className="w-full flex items-center justify-between gap-3 px-6 py-3 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer border-t border-[#F1F1F3]"
                >
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium text-[#0A0A0A] truncate">{r.clientName}</span>
                    <span className="block text-[12.5px] text-[#71717A] truncate">{r.plantName}</span>
                  </span>
                  <span className="text-[12.5px] text-[#71717A] shrink-0">
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
        className={`mt-6 inline-flex items-center gap-2 text-[14px] ${MUTED} hover:text-[#0A0A0A] transition-colors cursor-pointer group`}
      >
        Just looking?{" "}
        <span className="font-medium text-[#0A0A0A] group-hover:underline underline-offset-4">
          Explore a sample analysis
        </span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}
