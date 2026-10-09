import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_ASSETS } from "@/lib/sampleData";
import { CONTACT_EMAIL, BOOKING_URL, PRICING_TIERS } from "@/lib/siteConfig";
import DemoForm from "@/components/landing/DemoForm";

export const metadata: Metadata = {
  title: "SparesView | Find missing spare parts in your CMMS",
  description:
    "SparesView compares OEM manuals and drawings against your CMMS bill of materials and shows exactly which spare parts are missing, mismatched, or mis-entered.",
};

// Proof-section numbers come straight from the built-in sample so the
// landing page can never drift out of sync with what the demo shows.
const sample = SAMPLE_ASSETS[0].result;
const SAMPLE_STATS = [
  { value: String(sample.oem_parts_count), label: "Parts in OEM documents" },
  { value: String(sample.cmms_scope?.asset_entry_count ?? sample.cmms_parts_count), label: "In CMMS for this asset" },
  { value: `${Math.round(sample.summary.match_rate * 100)}%`, label: "Drawing coverage in CMMS" },
  { value: String(sample.summary.missing_count), label: "Missing parts", accent: "text-red-600" },
  { value: String(sample.summary.critical_missing_count), label: "Critical missing", accent: "text-red-600" },
];

const LogoMark = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500 shrink-0">
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  </span>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-[#1B2A4A] border-b border-[#253d6a] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center gap-6">
          <a href="#top" className="flex items-center gap-3">
            <LogoMark />
            <span className="text-left">
              <span className="block text-sm font-bold text-white leading-tight tracking-tight">SparesView</span>
              <span className="block text-xs text-sky-300 leading-tight">Spare Parts Intelligence</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-300 ml-4">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/app"
              className="text-xs text-slate-300 hover:text-white border border-[#3a5580] rounded-sm px-3 py-1.5 hover:bg-[#253d6a] transition-colors"
            >
              Open app
            </Link>
            <a
              href="#demo"
              className="text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-sm px-3 py-1.5 transition-colors"
            >
              Book a demo
            </a>
          </div>
        </div>
      </header>

      {/* ── 1. Hero ────────────────────────────────────────────────────── */}
      <section id="top" className="bg-[#1B2A4A]">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Find the critical spares missing from your CMMS before they shut down your line.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            SparesView compares OEM manuals and drawings against your CMMS bill of materials and shows
            exactly which spare parts are missing, mismatched, or mis-entered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-3 rounded-sm text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors"
            >
              Book a demo
            </a>
            <Link
              href="/app?sample=1"
              className="w-full sm:w-auto px-7 py-3 rounded-sm text-sm font-semibold text-slate-200 border border-[#3a5580] hover:bg-[#253d6a] transition-colors"
            >
              See a sample analysis
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Proof ───────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-sky-600 text-center">
            From the built-in sample analysis
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mt-2">
            One calciner kiln. {sample.summary.critical_missing_count} critical spares missing.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-slate-300 border border-slate-300 rounded-sm overflow-hidden mt-8 max-w-4xl mx-auto">
            {SAMPLE_STATS.map((s) => (
              <div key={s.label} className="bg-white px-4 py-5 text-center">
                <p className={`text-3xl font-bold tabular-nums ${s.accent ?? "text-slate-800"}`}>{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 text-center mt-5">
            Several components were found only in engineering drawings — not in any parts list.
          </p>
          <p className="text-center mt-3">
            <Link href="/app?sample=1" className="text-sm font-medium text-sky-600 hover:underline">
              Explore the full sample analysis →
            </Link>
          </p>
        </div>
      </section>

      {/* ── 3. The problem ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
            Incomplete BOMs are a downtime problem, not a data problem.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {[
              {
                title: "The part isn't on the shelf",
                body: "An incomplete BOM means the spare was never stocked — you find out when the asset is already down.",
              },
              {
                title: "Downtime costs more than the spare",
                body: "Unplanned downtime on a critical asset costs far more per hour than the missing part would ever have cost to stock.",
              },
              {
                title: "Nobody has time to cross-check",
                body: "Checking hundreds of OEM pages and drawings against the CMMS by hand is weeks of work that never makes it off the backlog.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-slate-300 border-l-4 border-l-red-500 rounded-sm px-5 py-5">
                <h3 className="text-sm font-bold text-slate-800">{c.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How it works ────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-slate-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {[
              {
                step: "1",
                title: "Upload your documents",
                body: "OEM manuals and engineering drawings as PDF — scanned drawings included — plus a CMMS BOM export (CSV).",
              },
              {
                step: "2",
                title: "SparesView matches every part",
                body: "Every part is matched against your CMMS and flagged missing, mismatched, or extra — ranked critical, important, or routine.",
              },
              {
                step: "3",
                title: "Get a gap report you can act on",
                body: "A clear report with sourcing categories and typical lead times for every missing part — ready to hand to your planner, your storeroom, and your boss.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white border border-slate-300 rounded-sm px-5 py-5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-[#1B2A4A] text-sky-300 text-sm font-bold">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-3">{s.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Pilot pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="bg-slate-50 border-b border-slate-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">Pilot pricing</h2>
          <p className="text-sm text-slate-500 text-center mt-2">Start free with one asset. Scale when the gaps speak for themselves.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={[
                  "bg-white rounded-sm px-6 py-6 flex flex-col",
                  tier.highlighted ? "border-2 border-sky-500" : "border border-slate-300",
                ].join(" ")}
              >
                <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500">{tier.name}</h3>
                <p className="text-3xl font-bold text-slate-800 mt-2">{tier.price}</p>
                {tier.priceNote && <p className="text-xs text-slate-400 mt-0.5">{tier.priceNote}</p>}
                <ul className="mt-4 mb-6 flex flex-col gap-2">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm text-slate-600 flex gap-2">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.ctaKind === "mailto" ? (
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=SparesView%20—%20multi-site%20inquiry`}
                    className="mt-auto text-center px-4 py-2.5 rounded-sm text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <a
                    href="#demo"
                    className={[
                      "mt-auto text-center px-4 py-2.5 rounded-sm text-sm font-semibold transition-colors",
                      tier.highlighted
                        ? "bg-sky-500 text-white hover:bg-sky-600"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {tier.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. About + Book a demo ─────────────────────────────────────── */}
      <section id="about" className="border-b border-slate-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Built on the plant floor, not in a pitch deck.</h2>
            <div className="flex items-start gap-4 mt-6">
              {/* Monogram avatar (matches stefanodemartin.com) — to use a real photo instead,
                  drop it at public/stefano.jpg and swap this div for an <img>. */}
              <div className="w-20 h-20 rounded-sm bg-[#1B2A4A] flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-sky-300">SD</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Stefano Demartin</p>
                <p className="text-xs text-slate-400">Founder · Sr. Reliability Consultant, MBA</p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Stefano has spent 20+ years inside manufacturing plants — food &amp; beverage,
                  steelmaking, mining, pulp &amp; paper, and oil &amp; gas — fixing the maintenance
                  systems that cause unplanned downtime. A manufacturing engineer and MBA, he has
                  worked across Fortune 100 companies and privately held manufacturers. He built
                  SparesView after finding the same missing-spares problem at plant after plant.
                </p>
                <a
                  href="https://stefanodemartin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-sky-600 font-medium hover:underline mt-2"
                >
                  More about Stefano&apos;s consulting work →
                </a>
              </div>
            </div>
          </div>
          <div id="demo" className="scroll-mt-16">
            <h2 className="text-2xl font-bold text-slate-800">Book a demo</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              Tell us about your plant and we&apos;ll set up a walkthrough with your own documents.
            </p>
            {BOOKING_URL ? (
              <p className="mb-5 text-sm">
                <a href={BOOKING_URL} className="text-sky-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                  Prefer to pick a time directly? Open the booking calendar →
                </a>
              </p>
            ) : null /* PLACEHOLDER: set BOOKING_URL in lib/siteConfig.ts to show a calendar link here */}
            <DemoForm />
          </div>
        </div>
      </section>

      {/* ── 7. Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#1B2A4A]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span>
              <span className="block text-sm font-bold text-white leading-tight">SparesView</span>
              <span className="block text-xs text-sky-300 leading-tight">Spare Parts Intelligence</span>
            </span>
          </div>
          <nav className="flex items-center gap-5 text-xs text-slate-300">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">{CONTACT_EMAIL}</a>
            <Link href="/app?sample=1" className="hover:text-white transition-colors">Sample analysis</Link>
            <Link href="/app" className="hover:text-white transition-colors">Open app</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
