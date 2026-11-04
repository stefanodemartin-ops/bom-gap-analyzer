"use client";

import { CARD, Logo, MUTED, PILL_GOOD, PILL_IMPORTANT } from "./ui";

type Props = {
  onChooseBom: () => void;
  onChooseMinMax: () => void;
};

export default function ServiceChooser({ onChooseBom, onChooseMinMax }: Props) {
  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="mb-5">
          <Logo size={48} />
        </div>
        <h1 className="m-0 text-[40px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-none">SparesView</h1>
        <p className={`${MUTED} text-[17px] mt-2.5 font-medium`}>Spare Parts Intelligence</p>
        <p className="text-[14px] text-[#71717A] mt-3 max-w-md mx-auto leading-relaxed">
          Choose a service to get started.
        </p>
      </div>

      {/* Service cards */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* BOM Gap Analysis */}
        <button
          onClick={onChooseBom}
          className={`${CARD} group text-left p-7 hover:border-[#0A0A0A] transition-colors duration-150 cursor-pointer flex flex-col`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#F4F4F5] text-[#0A0A0A]">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className={PILL_GOOD}>Available now</span>
          </div>
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em] text-[#0A0A0A]">BOM Gap Analysis</h2>
          <p className={`${MUTED} text-[14.5px] mt-2 leading-[1.6] flex-1`}>
            Compare OEM manuals and drawings against your CMMS to surface missing, mismatched, and
            mis-entered spare parts — including components found only in engineering drawings.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0A0A0A] mt-5 group-hover:gap-2.5 transition-all">
            Start analysis
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>

        {/* Min/Max Justification */}
        <button
          onClick={onChooseMinMax}
          className={`${CARD} group text-left p-7 hover:border-[#0A0A0A] transition-colors duration-150 cursor-pointer flex flex-col`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#F4F4F5] text-[#0A0A0A]">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            </div>
            <span className={PILL_IMPORTANT}>Coming soon</span>
          </div>
          <h2 className="m-0 text-[18px] font-semibold tracking-[-0.01em] text-[#0A0A0A]">Min/Max Justification</h2>
          <p className={`${MUTED} text-[14.5px] mt-2 leading-[1.6] flex-1`}>
            Justify the right reorder (min) and maximum stocking levels for every spare — defensible,
            data-backed numbers your team and auditors can trust.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#52525B] mt-5 group-hover:gap-2.5 transition-all">
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
