"use client";

import { Asset, Session } from "@/lib/types";

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
  if (rate >= 0.8) return "bg-emerald-500";
  if (rate >= 0.5) return "bg-amber-400";
  return "bg-red-500";
}

function PlantSummary({ assets }: { assets: Asset[] }) {
  if (assets.length === 0) return null;

  const totalOem     = assets.reduce((s, a) => s + a.result.oem_parts_count, 0);
  const totalMatched = assets.reduce((s, a) => s + a.result.summary.matched_count, 0);
  const totalMissing = assets.reduce((s, a) => s + a.result.summary.missing_count, 0);
  const totalCritical = assets.reduce((s, a) => s + a.result.summary.critical_missing_count, 0);
  const matchRate    = totalOem > 0 ? totalMatched / totalOem : 0;
  const missingRate  = 1 - matchRate;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
      {/* Colour bar */}
      <div className="flex h-2">
        <div className="bg-emerald-500 transition-all duration-500" style={{ width: pct(matchRate) }} />
        <div className="bg-red-400 flex-1" />
      </div>

      <div className="px-7 py-6">
        {/* Headline percentages */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 mb-5">
          <span className="text-4xl font-extrabold text-emerald-600 leading-none">
            {pct(matchRate)}
          </span>
          <span className="text-lg font-semibold text-emerald-600">matched</span>
          <span className="text-slate-300 text-2xl font-light">·</span>
          <span className="text-4xl font-extrabold text-red-500 leading-none">
            {pct(missingRate)}
          </span>
          <span className="text-lg font-semibold text-red-500">missing</span>
        </div>

        {/* Count pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "OEM parts",       value: totalOem,      color: "text-slate-700",   bg: "bg-slate-100"   },
            { label: "matched",         value: totalMatched,  color: "text-emerald-700", bg: "bg-emerald-50"  },
            { label: "missing",         value: totalMissing,  color: "text-red-700",     bg: "bg-red-50"      },
            { label: "critical missing",value: totalCritical, color: "text-red-700 font-bold", bg: totalCritical > 0 ? "bg-red-100" : "bg-slate-100" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`flex items-baseline gap-1.5 px-4 py-2 rounded-xl ${bg}`}>
              <span className={`text-2xl font-bold leading-none ${color}`}>{value.toLocaleString()}</span>
              <span className={`text-xs ${color} opacity-80`}>{label}</span>
            </div>
          ))}
        </div>
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
          <h2 className="text-xl font-bold text-slate-800">{session.clientName}</h2>
          <p className="text-sm text-slate-500">{session.plantName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-slate-500 border border-slate-200 rounded-lg px-3 py-2 bg-white">
            <span className="font-medium text-slate-700">{session.cmmsFileName}</span>
            <span className="ml-2 text-slate-400">·</span>
            <span className="ml-2">{session.cmmsRowCount.toLocaleString()} rows</span>
          </div>
          {assets.length >= 2 && (
            <button
              onClick={onOpenRollup}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Roll-up
            </button>
          )}
          <button
            onClick={onAddAsset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
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
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">No assets analyzed yet</p>
          <p className="text-sm text-slate-400 mt-1">Click "Add Asset" to analyze your first OEM document.</p>
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
                className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{asset.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {asset.oemFileNames.join(", ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-emerald-600 leading-tight">{pct(summary.match_rate)} matched</p>
                    <p className="text-base font-bold text-red-500 leading-tight">{pct(1 - summary.match_rate)} missing</p>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${barColor(summary.match_rate)}`}
                    style={{ width: pct(summary.match_rate) }}
                  />
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {summary.matched_count} matched
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {summary.missing_count} missing
                  </span>
                  {summary.critical_missing_count > 0 && (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
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
