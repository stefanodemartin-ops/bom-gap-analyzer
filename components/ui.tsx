// Shared "Executive Clean" design tokens for the tool at /app.
// Must stay visually in sync with the marketing landing page (app/page.tsx).

export const BTN =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#0A0A0A] px-4 h-10 text-[14px] font-medium text-white hover:bg-[#27272A] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:bg-[#A1A1AA]";

export const GHOST =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#D4D4D8] bg-white px-3.5 h-10 text-[14px] font-medium text-[#0A0A0A] hover:border-[#0A0A0A] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const CARD = "rounded-xl border border-[#E4E4E7] bg-white";

export const INPUT =
  "h-[46px] w-full box-border rounded-lg border border-[#D4D4D8] bg-white px-3.5 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] focus:outline-2 focus:outline-offset-1 focus:outline-[#0A0A0A] focus:border-[#0A0A0A] disabled:opacity-50";

export const LABEL = "text-[13.5px] font-medium text-[#0A0A0A]";

export const MUTED = "text-[#52525B]";

const PILL = "inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-medium whitespace-nowrap";
export const PILL_CRITICAL = `${PILL} bg-[#FEF2F2] text-[#B42318]`;
export const PILL_IMPORTANT = `${PILL} bg-[#FFFBEB] text-[#92400E]`;
export const PILL_NEUTRAL = `${PILL} bg-[#F4F4F5] text-[#3F3F46]`;
export const PILL_GOOD = `${PILL} bg-[#ECFDF5] text-[#0F766E]`;
export const PILL_INFO = `${PILL} bg-[#EFF6FF] text-[#1D4ED8]`;

// Semantic text colors
export const GOOD_TEXT = "text-[#0F766E]";
export const BAD_TEXT = "text-[#B42318]";
export const WARN_TEXT = "text-[#92400E]";

export const BACK_LINK =
  "inline-flex items-center gap-1.5 text-[14px] font-medium text-[#52525B] hover:text-[#0A0A0A] cursor-pointer transition-colors";

export const Logo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" fill="#0A0A0A" />
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Spinner = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
  </svg>
);
