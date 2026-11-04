"use client";

import { Asset, Session } from "@/lib/types";
import { BACK_LINK, BAD_TEXT, CARD, GOOD_TEXT } from "./ui";

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
  if (rate >= 0.8) return "bg-[#0F766E]";
  if (rate >= 0.5) return "bg-[#D97706]";
  return "bg-[#B42318]";
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

const TH = "px-5 py-3 text-[11px] uppercase tracking-[0.06em] text-[#71717A] font-medium";

export default function RollupDashboard({ session, assets, onBack, onSelectAsset }: Props) {
  const totalOemParts = assets.reduce((s, a) => s + a.result.oem_parts_count, 0);
  const totalMatched = assets.reduce((s, a) => s + a.result.summary.matched_count, 0);
  const totalMissing = assets.reduce((s, a) => s + a.result.summary.missing_count, 0);
  const totalCritical = assets.reduce((s, a) => s + a.result.summary.critical_missing_count, 0);
  const overallMatchRate = totalOemParts > 0 ? totalMatched / totalOemParts : 0;

  const duplicates = findDuplicates(assets);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={onBack} className={`${BACK_LINK} mb-6`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to asset list
      </button>

      <div className="mb-8">
        <h2 className="m-0 text-[22px] font-semibold text-[#0A0A0A] tracking-[-0.02em]">Roll-up Dashboard</h2>
        <p className="m-0 text-[14px] text-[#71717A] mt-0.5">
          {session.clientName} · {session.plantName} · {assets.length} assets
        </p>
      </div>

      {/* Aggregate stats */}
      <div className={`${CARD} grid grid-cols-2 sm:grid-cols-4 mb-10 overflow-hidden`}>
        {[
          { label: "Overall drawing coverage", value: pct(overallMatchRate), color: "text-[#0A0A0A]" },
          { label: "Total matched", value: totalMatched, color: GOOD_TEXT },
          { label: "Total missing", value: totalMissing, color: BAD_TEXT },
          { label: "Critical missing", value: totalCritical, color: BAD_TEXT },
        ].map(({ label, value, color }, i) => (
          <div key={label} className={`px-5 py-[18px] flex flex-col gap-1 ${i < 3 ? "sm:border-r sm:border-[#F1F1F3]" : ""}`}>
            <p className="m-0 text-[12px] text-[#71717A] font-medium">{label}</p>
            <p className={`m-0 text-[26px] font-semibold tracking-[-0.02em] tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Per-asset breakdown */}
      <section className="mb-10">
        <h3 className="m-0 text-[14px] font-semibold text-[#0A0A0A] mb-4">Per-asset breakdown</h3>
        <div className={`${CARD} overflow-x-auto`}>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
                <th className={`${TH} text-left`}>Asset</th>
                <th className={`${TH} text-left hidden sm:table-cell`}>Coverage</th>
                <th className={`${TH} text-right`}>Matched</th>
                <th className={`${TH} text-right`}>Missing</th>
                <th className={`${TH} text-right`}>Critical</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => {
                const { summary } = asset.result;
                return (
                  <tr
                    key={asset.id}
                    className={[
                      "hover:bg-[#FAFAFA] cursor-pointer transition-colors",
                      i < assets.length - 1 ? "border-b border-[#F1F1F3]" : "",
                    ].join(" ")}
                    onClick={() => onSelectAsset(asset.id)}
                  >
                    <td className="px-5 py-3">
                      <p className="m-0 font-medium text-[#0A0A0A]">{asset.name}</p>
                      <p className="m-0 text-[12px] text-[#71717A] truncate max-w-[180px]">{asset.oemFileNames.join(", ")}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-[#F4F4F5] rounded-full h-2 min-w-[80px]">
                          <div
                            className={`h-2 rounded-full ${matchRateColor(summary.match_rate)}`}
                            style={{ width: pct(summary.match_rate) }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-[#3F3F46] w-9 text-right tabular-nums">
                          {pct(summary.match_rate)}
                        </span>
                      </div>
                    </td>
                    <td className={`px-5 py-3 text-right font-medium tabular-nums ${GOOD_TEXT}`}>{summary.matched_count}</td>
                    <td className="px-5 py-3 text-right text-[#3F3F46] tabular-nums">{summary.missing_count}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {summary.critical_missing_count > 0 ? (
                        <span className={`font-semibold ${BAD_TEXT}`}>{summary.critical_missing_count}</span>
                      ) : (
                        <span className="text-[#D4D4D8]">—</span>
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
          <h3 className="m-0 text-[14px] font-semibold text-[#0A0A0A] mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] inline-block" />
            Shared parts across assets
            <span className="text-[12px] font-normal text-[#71717A]">({duplicates.length})</span>
          </h3>
          <p className="m-0 text-[12.5px] text-[#71717A] mb-3">
            These OEM part numbers appear in more than one asset&rsquo;s document — possible shared spares or consolidation opportunity.
          </p>
          <div className={`${CARD} overflow-x-auto`}>
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
                  <th className={`${TH} text-left`}>Part number</th>
                  <th className={`${TH} text-left`}>Found in</th>
                </tr>
              </thead>
              <tbody>
                {duplicates.map(({ partNumber, assetNames }, i) => (
                  <tr key={partNumber} className={i < duplicates.length - 1 ? "border-b border-[#F1F1F3]" : ""}>
                    <td className="px-5 py-3">
                      <span className="font-mono text-[12px] bg-[#F4F4F5] text-[#3F3F46] px-2 py-1 rounded">
                        {partNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#3F3F46]">{assetNames.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {duplicates.length === 0 && (
        <div className={`${CARD} px-5 py-4 text-[14px] text-[#71717A] text-center`}>
          No shared part numbers detected across assets.
        </div>
      )}
    </div>
  );
}
