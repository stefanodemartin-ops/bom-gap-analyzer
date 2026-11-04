import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { SAMPLE_ASSETS } from "@/lib/sampleData";
import { APP_URL, BOOKING_URL, CONTACT_EMAIL, PRICING_TIERS, type PricingTier } from "@/lib/siteConfig";
import DemoForm from "@/components/landing/DemoForm";

export const metadata: Metadata = {
  title: "SparesView — Find the critical spares your CMMS is missing",
  description:
    "SparesView compares OEM manuals and drawings against your CMMS bill of materials and shows which spare parts are missing, mismatched or mis-entered. Free analysis of one critical asset, results within 24 hours.",
};

// Inter is scoped to the landing page so the tool at /app keeps its own look.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Headline numbers come straight from the built-in sample analysis (Calciner Kiln BK-1854)
// so the landing page can't drift out of sync with the demo or the sample PDF.
const sample = SAMPLE_ASSETS[0].result;
const S = {
  matched: sample.summary.matched_count,
  missing: sample.summary.missing_count,
  critical: sample.summary.critical_missing_count,
  important: sample.summary.important_missing_count,
  drawingOnly: 7,
};

const SAMPLE_PDF = "/landing/sparesview-sample-report-calciner-kiln.pdf";

// ── Shared styles (design system: HANDOFF.md, "Executive Clean") ───────────
const WRAP = "max-w-[1200px] w-full mx-auto px-8 box-border";
const BTN =
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[#0A0A0A] px-[22px] h-12 text-[15px] font-medium text-white no-underline hover:bg-[#27272A] hover:text-white";
const GHOST =
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-[#D4D4D8] bg-white px-[22px] h-[46px] text-[15px] font-medium text-[#0A0A0A] no-underline hover:border-[#0A0A0A] hover:text-[#0A0A0A]";
const CARD = "rounded-xl border border-[#E4E4E7] bg-white";
const EYEBROW = "text-[13px] font-medium tracking-[0.02em] text-[#71717A]";
const H2 = "m-0 text-[36px] max-[760px]:text-[28px] leading-[1.12] font-semibold tracking-[-0.03em] text-balance";
const MUTED = "text-[#52525B]";
const TEXT_LINK = "text-[14.5px] font-medium text-[#52525B] no-underline hover:text-[#2563EB]";
const ROW =
  "grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] max-[760px]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 items-center px-5 py-3 border-t border-[#F1F1F3] text-[13.5px]";
const GRID_320 = "grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6";

const PILL = "inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[12px] font-medium whitespace-nowrap";
const CRITICAL = `${PILL} bg-[#FEF2F2] text-[#B42318]`;
const IMPORTANT = `${PILL} bg-[#FFFBEB] text-[#92400E]`;
const NEUTRAL = `${PILL} bg-[#F4F4F5] text-[#3F3F46]`;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const Logo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" fill="#0A0A0A" />
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HERO_ROWS = [
  { part: "Fixed seal ring, feed end", no: "FA-110-22-997", lead: "12–26 wk", critical: true },
  { part: 'Riding ring 42" OD', no: "FC-77-4-393", lead: "Long lead", critical: true },
  { part: "Trunnion roll assembly", no: "FA-110-6-163", lead: "—", critical: true },
  { part: "Emergency drive unit", no: "Drawing only", lead: "—", critical: true },
  { part: "Clamp ring, fixed seal", no: "HA-110-22-299", lead: "2–4 wk", critical: false },
];

const PROBLEMS = [
  {
    title: "The part isn't on the shelf",
    body: "The failure is on the schedule. The spare that fixes it was never in the CMMS, so nobody stocked it.",
  },
  {
    title: "Downtime costs more than the spare",
    body: "One seal ring missing from the CMMS on our sample kiln has a 12–26 week lead time. That's months of risk for one part.",
  },
  {
    title: "Nobody has time to cross-check",
    body: "Reconciling manuals, drawings and the BOM by hand never makes it to the top of anyone's list.",
  },
];

const FAQS = [
  {
    q: "Is my CMMS data safe?",
    a: "Your files are used only to run your analysis. They are never shared or sold, and never used to train AI models. Ask us and we'll delete them.",
  },
  {
    q: "Which CMMS do you support?",
    a: "Any system that exports a bill of materials to CSV or Excel — SAP PM, IBM Maximo, eMaint, Fiix, MaintainX and others. No integration project required.",
  },
  {
    q: "How long does the first analysis take?",
    a: "You get results within 24 hours of upload, followed by a 30-minute review call.",
  },
  {
    q: "What if our drawings are old scans?",
    a: `Most are. SparesView inspects the drawings visually — in the sample report it found ${S.drawingOnly} components that appear in no parts table. Anything it can't confirm is flagged “Needs review.”`,
  },
  {
    q: "Who does the work on our side?",
    a: "One person with CMMS export rights and access to the OEM manuals and drawings. That's it.",
  },
];

function tierLink(tier: PricingTier) {
  if (tier.ctaKind === "booking") return { href: BOOKING_URL, ...external };
  if (tier.ctaKind === "mailto")
    return { href: `mailto:${CONTACT_EMAIL}?subject=SparesView%20%E2%80%94%20multi-site%20inquiry` };
  return { href: "#start" };
}

export default function Landing() {
  return (
    <div
      className={`${inter.className} flex flex-col min-h-screen bg-white text-[#0A0A0A] antialiased`}
    >
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="border-b border-[#F1F1F3]">
        <div className={`${WRAP} flex flex-wrap items-center gap-6 py-4`}>
          <div className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em]">
            <Logo />
            SparesView
          </div>
          <div className="ml-auto flex flex-wrap gap-7 text-[14px] font-medium">
            <a href="#how" className="text-[#52525B] no-underline">How it works</a>
            <a href="#pricing" className="text-[#52525B] no-underline">Pricing</a>
            <a href="#faq" className="text-[#52525B] no-underline">FAQ</a>
            <a href="#about" className="text-[#52525B] no-underline">About</a>
          </div>
          <div className="flex items-center gap-2">
            <a href={APP_URL} className={`${GHOST} !h-9 !px-3.5 !text-[14px]`}>Sign in</a>
            <a href="#start" className={`${BTN} !h-[38px] !px-4 !text-[14px]`}>Get your free analysis</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F7F8_100%)]">
        <div className="max-w-[1200px] mx-auto pt-20 pl-8 box-border grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-12 items-center">
          <div className="flex flex-col gap-[22px] pb-20 pr-8">
            <div className={EYEBROW}>Spare-parts gap analysis for your CMMS</div>
            <h1 className="m-0 text-[58px] max-[760px]:text-[40px] leading-[1.04] font-semibold tracking-[-0.04em] text-balance">
              Find the critical spares your CMMS is missing.
            </h1>
            <p className={`${MUTED} m-0 text-[18px] leading-[1.55] max-w-[500px] text-pretty`}>
              SparesView compares OEM manuals and drawings against your CMMS bill of materials and shows which spare
              parts are missing, mismatched or mis-entered — before they shut down your line.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <div className="flex flex-wrap gap-4 items-center">
                <a href="#start" className={BTN}>Get your free asset analysis</a>
                <a href={BOOKING_URL} {...external} className={TEXT_LINK}>or book a 15-minute demo →</a>
              </div>
              <div className="text-[13px] text-[#71717A]">One critical asset, free. Results within 24 hours. No credit card.</div>
            </div>
            <div className="flex items-center gap-3.5 pt-3 mt-2 border-t border-[#E4E4E7]">
              <div className="text-[30px] font-semibold tracking-[-0.03em] text-[#B42318] leading-none">{S.critical}</div>
              <div className="text-[13.5px] leading-[1.4] text-[#3F3F46] max-w-[320px]">
                critical spares missing from the CMMS on a single calciner kiln — from a real SparesView report.{" "}
                <a href="#report" className="font-medium text-[#52525B]">See it →</a>
              </div>
            </div>
          </div>

          <div
            id="sample"
            className="min-w-0 mt-8 mr-[-120px] max-[760px]:mr-0 max-[760px]:-ml-2 overflow-hidden bg-white border border-b-0 border-[#E4E4E7] rounded-t-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_70px_-30px_rgba(10,10,10,0.22)]"
          >
            <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-[#F1F1F3] bg-[#FAFAFA]">
              <div className="flex items-center gap-2.5 text-[13px] text-[#52525B]">
                <span className="font-semibold text-[#0A0A0A]">Calciner kiln BK-1854</span>
                <span className="text-[#D4D4D8]">/</span>
                <span>Gap analysis</span>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <span className={CRITICAL}>{S.critical} critical</span>
                <span className={IMPORTANT}>{S.important} important</span>
              </div>
            </div>
            <div className="grid grid-cols-3 border-b border-[#F1F1F3]">
              {[
                ["Matched", S.matched],
                ["Missing from CMMS", S.missing],
                ["Found only in drawings", S.drawingOnly],
              ].map(([label, value], i) => (
                <div key={label} className={`px-5 py-[18px] flex flex-col gap-1 ${i < 2 ? "border-r border-[#F1F1F3]" : ""}`}>
                  <div className="text-[12px] text-[#71717A] font-medium">{label}</div>
                  <div className="text-[26px] font-semibold tracking-[-0.02em]">{value}</div>
                </div>
              ))}
            </div>
            <div className={`${ROW} !border-t-0 !text-[12px] font-medium text-[#71717A]`}>
              <span>Part</span>
              <span>Part no.</span>
              <span className="max-[760px]:hidden">Lead time</span>
              <span>Priority</span>
            </div>
            {HERO_ROWS.map((r) => (
              <div key={r.part} className={ROW}>
                <span className="font-medium">{r.part}</span>
                <span className={MUTED}>{r.no}</span>
                <span className={`${MUTED} max-[760px]:hidden`}>{r.lead}</span>
                <span>
                  <span className={r.critical ? CRITICAL : IMPORTANT}>{r.critical ? "Critical" : "Important"}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credibility strip ────────────────────────────────────────── */}
      <section className="border-t border-[#E4E4E7] border-b border-b-[#F1F1F3] bg-white">
        <div className={`${WRAP} flex flex-wrap items-center gap-x-9 gap-y-3.5 py-[22px] text-[14px] text-[#71717A]`}>
          <span className="font-medium text-[#3F3F46]">Built by a reliability consultant with 20+ years in</span>
          <span>Food &amp; beverage</span>
          <span>Steelmaking</span>
          <span>Mining</span>
          <span>Pulp &amp; paper</span>
          <span>Oil &amp; gas</span>
          <span className="ml-auto">Works with SAP PM, IBM Maximo and any CMMS that exports CSV</span>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <section className={`${WRAP} pt-[88px] pb-[72px] flex flex-col gap-11`}>
        <div className="flex flex-col gap-3.5 max-w-[680px]">
          <div className={EYEBROW}>The problem</div>
          <h2 className={H2}>Incomplete BOMs are a downtime problem, not a data problem.</h2>
          <p className={`${MUTED} m-0 text-[17px] leading-[1.6]`}>
            Most plants have three versions of the truth: the OEM manual, the engineering drawings, and the CMMS. The
            spare that stops the line is usually in the first two and missing from the third.
          </p>
        </div>
        <div className={GRID_320}>
          {PROBLEMS.map((p, i) => (
            <div key={p.title} className={`${CARD} p-[26px] flex flex-col gap-2.5`}>
              <div className="text-[13px] font-semibold text-[#B42318]">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="m-0 text-[18px] font-semibold tracking-[-0.01em]">{p.title}</h3>
              <p className={`${MUTED} m-0 text-[15px] leading-[1.6]`}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how" className="bg-[#F7F7F8] border-y border-[#F1F1F3]">
        <div className={`${WRAP} py-20 flex flex-col gap-11`}>
          <div className="flex flex-col gap-3.5 max-w-[680px]">
            <div className={EYEBROW}>How it works</div>
            <h2 className={H2}>From a CSV export to a ranked gap report within 24 hours.</h2>
          </div>
          <div className={GRID_320}>
            <Step n={1} title="Export and upload">
              <p className={`${MUTED} m-0 text-[15px] leading-[1.6]`}>
                Export the asset&apos;s BOM from your CMMS as CSV. Upload it with the OEM manuals and drawings you already
                have as PDFs.
              </p>
              <div className="flex flex-col gap-1.5 pt-1.5 border-t border-[#F1F1F3] text-[13px] text-[#52525B]">
                {["1854-bom-export.csv", "1854 Calciner Drawings.pdf", "B-508898-1 CA.pdf · 2 more"].map((f) => (
                  <div key={f} className="flex justify-between gap-2">
                    <span className="min-w-0 truncate">{f}</span>
                    <span className="text-[#0F766E] font-medium">Uploaded</span>
                  </div>
                ))}
              </div>
            </Step>
            <Step n={2} title="Every part is matched">
              <p className={`${MUTED} m-0 text-[15px] leading-[1.6]`}>
                SparesView reads every parts list and visually inspects the drawings, then matches each part against the
                CMMS.
              </p>
              <div className="flex flex-col gap-2 pt-1.5 border-t border-[#F1F1F3] text-[13px]">
                <div className="flex justify-between gap-2"><span className={MUTED}>Matched</span><span className="font-medium">{S.matched}</span></div>
                <div className="flex justify-between gap-2"><span className={MUTED}>Found only in drawings</span><span className="font-medium">{S.drawingOnly}</span></div>
                <div className="flex justify-between gap-2"><span className={MUTED}>Missing from CMMS</span><span className="font-medium text-[#B42318]">{S.missing}</span></div>
              </div>
            </Step>
            <Step n={3} title="Review the ranked report">
              <p className={`${MUTED} m-0 text-[15px] leading-[1.6]`}>
                Each gap is ranked critical, important or routine, with a sourcing category and typical lead time. We walk
                through it with you on a 30-minute call.
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5 border-t border-[#F1F1F3]">
                <span className={NEUTRAL}>PDF report</span>
                <span className={NEUTRAL}>Excel workbook</span>
                <span className={NEUTRAL}>Review call</span>
              </div>
            </Step>
          </div>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────── */}
      <section
        id="report"
        className={`${WRAP} py-20 grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-12 items-center`}
      >
        <div className="flex flex-col gap-[18px]">
          <div className={EYEBROW}>What you walk away with</div>
          <h2 className={H2}>A stocking decision for every critical spare, not another spreadsheet.</h2>
          <p className={`${MUTED} m-0 text-[17px] leading-[1.6] max-w-[520px]`}>
            The report is built for the person who has to act on it. Every gap comes with:
          </p>
          <div className="flex flex-col gap-2.5 text-[15px] text-[#3F3F46]">
            {[
              ["Risk", "what fails if the part isn't there"],
              ["Recommendation", "part number, minimum stock, PM link"],
              ["Sourcing", "OEM, fabricate or commodity, with lead time"],
              ["Drawing evidence", "where on which drawing it was found"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2.5 items-baseline">
                <span className="font-semibold text-[#0A0A0A] min-w-[128px]">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-center pt-2.5">
            <a href="#start" className={BTN}>Get your free asset analysis</a>
            <a href={SAMPLE_PDF} {...external} className={TEXT_LINK}>Download the sample report (PDF) →</a>
          </div>
        </div>
        <div className="relative min-h-[560px] max-[760px]:min-h-[420px] min-w-0">
          <Image
            src="/landing/report-2.jpg"
            alt="Page 2 of a SparesView gap report"
            width={1360}
            height={1760}
            sizes="(max-width: 760px) 70vw, 420px"
            className="absolute top-0 right-0 w-[72%] h-auto rounded-lg border border-[#E4E4E7] shadow-[0_20px_50px_-24px_rgba(10,10,10,0.25)] rotate-2"
          />
          <Image
            src="/landing/report-1.jpg"
            alt="Page 1 of a SparesView gap report for calciner kiln BK-1854: 32% drawing coverage, 47 in CMMS, 22 matched, 47 missing, 12 critical"
            width={1360}
            height={1760}
            sizes="(max-width: 760px) 75vw, 440px"
            className="absolute top-7 left-0 w-[76%] h-auto rounded-lg border border-[#E4E4E7] shadow-[0_30px_70px_-28px_rgba(10,10,10,0.35)]"
          />
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-[#F7F7F8] border-y border-[#F1F1F3]">
        <div className={`${WRAP} py-20 flex flex-col gap-10`}>
          <div className="flex flex-col gap-3.5 max-w-[680px]">
            <div className={EYEBROW}>Pricing</div>
            <h2 className={H2}>Start with one asset. Scale to the plant when the numbers make the case.</h2>
          </div>
          <div className={`${GRID_320} items-stretch`}>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`${CARD} p-7 flex flex-col gap-[18px] ${tier.highlighted ? "!border-[#0A0A0A]" : ""}`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="text-[14px] font-semibold">{tier.name}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[40px] font-semibold tracking-[-0.03em] leading-none">{tier.price}</span>
                    {tier.priceNote && <span className={`${MUTED} text-[14px]`}>{tier.priceNote}</span>}
                  </div>
                  <div className={`${MUTED} text-[14px]`}>{tier.subtitle}</div>
                </div>
                <div className="flex flex-col gap-2.5 text-[14.5px] text-[#3F3F46] border-t border-[#F1F1F3] pt-4">
                  {tier.features.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
                <a {...tierLink(tier)} className={`${tier.highlighted ? BTN : GHOST} mt-auto`}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className={`${WRAP} pt-20 pb-[72px] grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-12`}
      >
        <div className="flex flex-col gap-3.5">
          <div className={EYEBROW}>Questions plant managers ask</div>
          <h2 className={H2}>Before you upload anything.</h2>
        </div>
        <div className="flex flex-col">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className={`flex flex-col gap-1.5 py-[18px] border-t border-[#E4E4E7] ${i === FAQS.length - 1 ? "border-b" : ""}`}
            >
              <h3 className="m-0 text-[16px] font-semibold">{f.q}</h3>
              <p className={`${MUTED} m-0 text-[15px] leading-[1.6]`}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="bg-[#0A0A0A] text-white">
        <div
          className={`${WRAP} py-[72px] grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-12 items-center`}
        >
          <Image
            src="/landing/founder.jpg"
            alt="Stefano Demartin in a hard hat and safety glasses at an industrial plant"
            width={941}
            height={733}
            sizes="(max-width: 760px) 100vw, 440px"
            className="block w-full max-w-[440px] h-auto aspect-[4/3] object-cover object-[50%_30%] rounded-xl"
          />
          <div className="flex flex-col gap-4">
            <div className={`${EYEBROW} !text-[#A1A1AA]`}>About</div>
            <h2 className={`${H2} text-white`}>Built on the plant floor, not in a pitch deck.</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-[#D4D4D8] max-w-[520px]">
              SparesView was built by Stefano Demartin, a reliability consultant with more than 20 years in plants across
              food and beverage, steelmaking, mining, pulp and paper, and oil and gas. It started as the cross-check he
              kept doing by hand for clients — and the one nobody on site had time for.
            </p>
            <a
              href={BOOKING_URL}
              {...external}
              className="text-[14.5px] font-medium text-white underline underline-offset-4 hover:!text-[#D4D4D8]"
            >
              Talk to Stefano →
            </a>
          </div>
        </div>
      </section>

      {/* ── Free analysis form ───────────────────────────────────────── */}
      <section
        id="start"
        className={`${WRAP} py-[88px] grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-12 items-center`}
      >
        <div className="flex flex-col gap-4">
          <h2 className={`${H2} !text-[40px] max-[760px]:!text-[28px]`}>Get your free asset analysis.</h2>
          <p className={`${MUTED} m-0 text-[17px] leading-[1.6] max-w-[480px]`}>
            Pick your most critical asset. We&apos;ll tell you what to upload, run the analysis, and walk through the
            results with you on a 30-minute call.
          </p>
          <div className="flex flex-col gap-2 text-[14px] text-[#3F3F46] pt-1">
            <span>Results within 24 hours</span>
            <span>One asset, full report, no credit card</span>
            <span>Your files are deleted on request</span>
          </div>
          <figure className="mt-4 mx-0 mb-0 px-6 py-[22px] rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col gap-3 max-w-[480px]">
            <blockquote className="m-0 text-[16.5px] leading-[1.5] tracking-[-0.01em] text-[#0A0A0A] text-pretty">
              “We had spares in the storeroom but didn&apos;t know which part went with which equipment. SparesView helped
              us build a comprehensive BOM.”
            </blockquote>
            <figcaption className="text-[13px] text-[#71717A]">Maintenance Planner · Building materials plant, Louisiana</figcaption>
          </figure>
        </div>
        <DemoForm />
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#F1F1F3]">
        <div className={`${WRAP} py-7 flex flex-wrap items-center gap-x-8 gap-y-4 text-[13px] text-[#71717A]`}>
          <div className="flex items-center gap-2 text-[15px] font-semibold text-[#0A0A0A]">
            <Logo size={20} />
            SparesView
          </div>
          <div className="ml-auto flex flex-wrap gap-6">
            <a href="#how" className="text-[#71717A] no-underline">How it works</a>
            <a href="#pricing" className="text-[#71717A] no-underline">Pricing</a>
            <a href="#faq" className="text-[#71717A] no-underline">FAQ</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#71717A] no-underline">{CONTACT_EMAIL}</a>
            {/* Privacy and Terms links go here once those pages exist. */}
          </div>
          <span>© 2026 SparesView · Boulder, Colorado</span>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className={`${CARD} p-[26px] flex flex-col gap-3.5`}>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0A0A0A] text-white text-[13px] font-semibold">
          {n}
        </span>
        <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}
