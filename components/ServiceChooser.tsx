"use client";

type Props = {
  onChooseBom: () => void;
  onChooseMinMax: () => void;
};

export default function ServiceChooser({ onChooseBom, onChooseMinMax }: Props) {
  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 flex flex-col items-center px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B2A4A] mb-5 shadow-md">
          <svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-[#1B2A4A] tracking-tight leading-none">SparesView</h1>
        <p className="text-lg text-slate-500 mt-2 font-medium">Spare Parts Intelligence</p>
        <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
          Choose a service to get started.
        </p>
      </div>

      {/* Service cards */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* BOM Gap Analysis */}
        <button
          onClick={onChooseBom}
          className="group text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-sky-300 hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
              Available now
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#1B2A4A]">BOM Gap Analysis</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-1">
            Compare OEM manuals and drawings against your CMMS to surface missing, mismatched, and
            mis-entered spare parts — including components found only in engineering drawings.
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 mt-5 group-hover:gap-2.5 transition-all">
            Start analysis
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>

        {/* Min/Max Justification */}
        <button
          onClick={onChooseMinMax}
          className="group text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-sky-300 hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 text-violet-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
              Coming soon
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#1B2A4A]">Min/Max Justification</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-1">
            Justify the right reorder (min) and maximum stocking levels for every spare — defensible,
            data-backed numbers your team and auditors can trust.
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 mt-5 group-hover:gap-2.5 transition-all">
            Preview what&rsquo;s coming
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
