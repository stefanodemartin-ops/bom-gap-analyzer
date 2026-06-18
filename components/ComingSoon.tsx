"use client";

type Props = {
  onBack: () => void;
};

const CAPABILITIES = [
  {
    title: "Defensible min & max for every spare",
    body: "A recommended reorder point and maximum stock level for each part, with the reasoning written out — not a black-box number.",
  },
  {
    title: "Criticality- and lead-time-aware",
    body: "Levels weighted by how critical the part is and how long it takes to source, so critical long-lead items are never under-stocked.",
  },
  {
    title: "Flags over- and under-stocking",
    body: "Surfaces cash tied up in parts you hold too many of, and risk hiding in parts you hold too few of.",
  },
  {
    title: "Audit- and boss-ready output",
    body: "A branded report that justifies each level — the document your team shows finance and auditors when they ask 'why this number?'",
  },
];

export default function ComingSoon({ onBack }: Props) {
  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to services
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 text-violet-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            Coming soon
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1B2A4A] tracking-tight">Min/Max Justification</h1>
        <p className="text-base text-slate-500 mt-3 leading-relaxed">
          The companion to gap analysis: once you know <span className="font-medium text-slate-600">which</span> spares
          you should hold, this service tells you <span className="font-medium text-slate-600">how many</span> — and
          gives you the defensible reasoning to back it up.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-[#1B2A4A]">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-violet-50 border border-violet-200 rounded-xl px-5 py-4">
          <p className="text-sm text-violet-900 font-medium">In active development.</p>
          <p className="text-sm text-violet-800/80 mt-1 leading-relaxed">
            Helping shape it? Tell us how your team sets min/max today and what would make the number trustworthy —
            that feedback is driving what we build first.
          </p>
        </div>
      </div>
    </div>
  );
}
