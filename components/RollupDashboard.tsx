"use client";

import { Asset, Session } from "@/lib/types";

type Props = {
  session: Session;
  assets: Asset[];
  onBack: () => void;
  onSelectAsset: (id: string) => void;
};

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function matchRateColor(rate: number) {
  if (rate >= 0.8) return "bg-emerald-500";
  if (rate >= 0.5) return "bg-amber-400";
  return "bg-red-500";
}

function findDuplicates(assets: Asset[]) {
  const counts = new Map<string, Set<string>>(); // partNumber -> set of asset names

  for (const asset of assets) {
    const partNumbers = [
      ...asset.result.matched.map((p) => p.oem_part_number),
      ...asset.result.missing_from_cmms.map((p) => p.oem_part_number),
    ].filter((n): n is string => !!n);

    for (const pn of partNumbers) {
      const key = pn.toUpperCase().replace(/[-\s]/g, "");
      if (!counts.has(key)) counts.set(key, new Set());
      counts.get(key)!.add(asset.name);
    }
  }

  return [...counts.entries()]
    .filter(([, assetNames]) => assetNames.size > 1)
    .map(([pn, assetNames]) => ({ partNumber: pn, assetNames: [...assetNames] }));
}

export default function RollupDashboard({ session, assets, onBack, onSelectAsset }: Props) {
  const totalOemParts = assets.reduce((s, a) => s + a.result.oem_parts_count, 0);
  const totalMatched = assets.reduce((s, a) => s + a.result.summary.matched_count, 0);
  const totalMissing = assets.reduce((s, a) => s + a.result.summary.missing_count, 0);
  const totalCritical = assets.reduce((s, a) => s + a.result.summary.critical_missing_count, 0);
  const overallMatchRate = totalOemParts > 0 ? totalMatched / totalOemParts : 0;

  const duplicates = findDuplicates(assets);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 cursor-pointer transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to asset list
      </button>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800">Roll-up Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {session.clientName} · {session.plantName} · {assets.length} assets
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Overall Match Rate", value: pct(overallMatchRate), color: "text-sky-600" },
          { label: "Total Matched", value: totalMatched, color: "text-emerald-600" },
          { label: "Total Missing", value: totalMissing, color: "text-red-600" },
          { label: "Critical Missing", value: totalCritical, color: "text-red-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Per-asset breakdown */}
      <section className="mb-10">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Per-Asset Breakdown</h3>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 font-medium">
                <th className="text-left px-5 py-3">Asset</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Match Rate</th>
                <th className="text-right px-5 py-3">Matched</th>
                <th className="text-right px-5 py-3">Missing</th>
                <th className="text-right px-5 py-3">Critical</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => {
                const { summary } = asset.result;
                return (
                  <tr
                    key={asset.id}
                    className={[
                      "hover:bg-slate-50 cursor-pointer transition-colors",
                      i < assets.length - 1 ? "border-b border-slate-100" : "",
                    ].join(" ")}
                    onClick={() => onSelectAsset(asset.id)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{asset.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{asset.oemFileNames.join(", ")}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[80px]">
                          <div
                            className={`h-2 rounded-full ${matchRateColor(summary.match_rate)}`}
                            style={{ width: pct(summary.match_rate) }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 w-9 text-right">
                          {pct(summary.match_rate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-emerald-600 font-medium">{summary.matched_count}</td>
                    <td className="px-5 py-3 text-right text-slate-600">{summary.missing_count}</td>
                    <td className="px-5 py-3 text-right">
                      {summary.critical_missing_count > 0 ? (
                        <span className="text-red-600 font-semibold">{summary.critical_missing_count}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Duplicate parts */}
      {duplicates.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
            Shared Parts Across Assets
            <span className="text-xs font-normal text-slate-400">({duplicates.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            These OEM part numbers appear in more than one asset&rsquo;s document — possible shared spares or consolidation opportunity.
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 font-medium">
                  <th className="text-left px-5 py-3">Part Number</th>
                  <th className="text-left px-5 py-3">Found In</th>
                </tr>
              </thead>
              <tbody>
                {duplicates.map(({ partNumber, assetNames }, i) => (
                  <tr key={partNumber} className={i < duplicates.length - 1 ? "border-b border-slate-100" : ""}>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {partNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{assetNames.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {duplicates.length === 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-500 text-center">
          No shared part numbers detected across assets.
        </div>
      )}
    </div>
  );
}
