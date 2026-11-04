"use client";

import { Asset, Session } from "@/lib/types";
import { BAD_TEXT, BTN, CARD, GHOST, GOOD_TEXT } from "./ui";

type Props = {
  session: Session;
  assets: Asset[];
  onAddAsset: () => void;
  onSelectAsset: (id: string) => void;
  onOpenRollup: () => void;
};

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function barColor(rate: number) {
  if (rate >= 0.8) return "bg-[#0F766E]";
  if (rate >= 0.5) return "bg-[#D97706]";
  return "bg-[#B42318]";
}

function PlantSummary({ assets }: { assets: Asset[] }) {
  if (assets.length === 0) return null;

  const totalOem     = assets.reduce((s, a) => s + a.result.oem_parts_count, 0);
  const totalMatched = assets.reduce((s, a) => s + a.result.summary.matched_count, 0);
  const totalMissing = assets.reduce((s, a) => s + a.result.summary.missing_count, 0);
  const totalCritical = assets.reduce((s, a) => s + a.result.summary.critical_missing_count, 0);
  const matchRate    = totalOem > 0 ? totalMatched / totalOem : 0;

  const cells = [
    { label: "Documented parts", value: totalOem.toLocaleString(), color: "text-[#0A0A0A]" },
    { label: "Matched in CMMS", value: totalMatched.toLocaleString(), color: GOOD_TEXT },
    { label: "Missing from CMMS", value: totalMissing.toLocaleString(), color: BAD_TEXT },
    { label: "Critical missing", value: totalCritical.toLocaleString(), color: totalCritical > 0 ? `${BAD_TEXT} ` : "text-[#0A0A0A]" },
  ];

  return (
    <div className={`${CARD} mb-8 overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 border-b border-[#F1F1F3]">
        <span className="text-[13px] font-medium text-[#71717A]">Plant coverage</span>
        <div className="flex-1 min-w-[140px] bg-[#F4F4F5] rounded-full h-2">
          <div className={`h-2 rounded-full ${barColor(matchRate)} transition-all duration-500`} style={{ width: pct(matchRate) }} />
        </div>
        <span className="text-[14px] font-semibold tabular-nums">{pct(matchRate)} matched</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {cells.map(({ label, value, color }, i) => (
          <div key={label} className={`px-6 py-[18px] flex flex-col gap-1 ${i < cells.length - 1 ? "sm:border-r sm:border-[#F1F1F3]" : ""}`}>
            <div className="text-[12px] text-[#71717A] font-medium">{label}</div>
            <div className={`text-[26px] font-semibold tracking-[-0.02em] tabular-nums ${color}`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AssetList({ session, assets, onAddAsset, onSelectAsset, onOpenRollup }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Session info bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="m-0 text-[22px] font-semibold text-[#0A0A0A] tracking-[-0.02em]">{session.clientName}</h2>
          <p className="m-0 text-[14px] text-[#71717A]">{session.plantName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right text-[12.5px] text-[#71717A] border border-[#E4E4E7] rounded-lg px-3 py-2 bg-white">
            <span className="font-medium text-[#3F3F46]">{session.cmmsFileName}</span>
            <span className="mx-2 text-[#D4D4D8]">·</span>
            <span>{session.cmmsRowCount.toLocaleString()} rows</span>
          </div>
          {assets.length >= 2 && (
            <button onClick={onOpenRollup} className={GHOST}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Roll-up
            </button>
          )}
          <button onClick={onAddAsset} className={BTN}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Asset
          </button>
        </div>
      </div>

      <PlantSummary assets={assets} />

      {/* Empty state */}
      {assets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#F4F4F5] mb-4">
            <svg className="w-7 h-7 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="m-0 text-[#0A0A0A] font-medium">No assets analyzed yet</p>
          <p className="m-0 text-[14px] text-[#71717A] mt-1">Click &ldquo;Add Asset&rdquo; to analyze your first OEM document.</p>
        </div>
      )}

      {/* Asset grid */}
      {assets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const { summary } = asset.result;
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={`${CARD} text-left p-5 hover:border-[#0A0A0A] transition-colors duration-150 cursor-pointer group`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="m-0 font-semibold text-[#0A0A0A]">{asset.name}</p>
                    <p className="m-0 text-[12px] text-[#71717A] mt-0.5 truncate">
                      {asset.oemFileNames.join(", ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="m-0 text-[16px] font-semibold text-[#0A0A0A] leading-tight tabular-nums">{pct(summary.match_rate)} covered</p>
                    <p className="m-0 text-[11.5px] text-[#71717A] leading-tight">of documented parts in CMMS</p>
                  </div>
                </div>

                <div className="w-full bg-[#F4F4F5] rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${barColor(summary.match_rate)}`}
                    style={{ width: pct(summary.match_rate) }}
                  />
                </div>

                <div className="flex items-center gap-3 text-[12px]">
                  <span className={`flex items-center gap-1 ${GOOD_TEXT}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
                    {summary.matched_count} matched
                  </span>
                  <span className="flex items-center gap-1 text-[#52525B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D8]" />
                    {summary.missing_count} missing
                  </span>
                  {summary.critical_missing_count > 0 && (
                    <span className={`flex items-center gap-1 ${BAD_TEXT} font-medium`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
                      {summary.critical_missing_count} critical
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
