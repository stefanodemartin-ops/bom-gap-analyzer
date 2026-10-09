@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

SparesView (working title; previously "SparesRecon" and "BOM Gap Analyzer") is a SaaS tool for maintenance and reliability teams. It compares OEM documentation (parts manuals, spare parts lists, drawings) against a plant's CMMS BOM export and uses Claude to find gaps — missing parts, mismatched records, and data entry errors. Core workflow: start a session (client/plant + CMMS CSV) → add assets (OEM PDFs) → AI gap analysis per asset → results dashboard showing matched / missing / extra parts with reasoning and recommended actions.

## Who you're working with

Stefano is a maintenance/reliability consultant, not a professional developer. Explain technical steps simply and concretely (exact commands, where to click). His nephew (a programmer) is a collaborator on the GitHub repo.

## Commands

- `npm run dev` — dev server at `localhost:3000`. Node 20 required — if it fails, run `nvm use 20` first.
- `npm run build` — production build (run before deploying to catch errors).
- `npm run lint` — ESLint.
- `vercel --prod` — deploy; live at `bom-gap-analyzer.vercel.app`.
- There is no test suite.

Environment: `ANTHROPIC_API_KEY` in `.env.local` (gitignored via `.env*` — **never commit it**; the same key is also set in the Vercel dashboard). GitHub: private repo `stefanodemartin-ops/bom-gap-analyzer`.

## Architecture

Next.js 16 (App Router) + React 19 + Tailwind 4. Mostly TypeScript; the API route and prompt are plain JS (`route.js`, `prompts.js`).

**Routes:** `/` is the public marketing landing page (`app/page.tsx`, server component; sections pull sample stats from `lib/sampleData.ts` and pricing/contact/booking config from `lib/siteConfig.ts` — edit prices there). The tool lives at `/app` (`app/app/page.tsx`); `/app?sample=1` opens the sample analysis directly (used by landing CTAs). The landing demo form posts to `/api/leads`, which stores leads in the Neon `leads` table (created on first insert; no email sending yet). Leads are viewed at `/leads?key=<LEADS_KEY>` — the key lives in `.env.local` and the Vercel env (Preview + Production).

**Tool state:** React `useState` inside `app/app/page.tsx` — a view state machine (`home → start → asset-list → add-asset → asset-detail → rollup`) that renders one component from `components/` per view and passes state down via props; sessions can be persisted to Neon via `/api/sessions` (`?s=<id>` restores one).

Data flow:

1. `StartScreen` collects client/plant names and the CMMS CSV; the CSV is kept in memory as raw text on the `Session` object.
2. `AddAsset` (and `AssetDetail`, for adding more documents to an existing asset) POSTs to `/api/analyze` as multipart form data: one or more `oem` PDF files plus the `cmms` CSV re-wrapped as a blob from session text.
3. `app/api/analyze/route.js` runs a **two-pass analysis** with Claude (`claude-sonnet-4-6`, temperature 0): Pass 1 (`EXTRACT_PROMPT`) reads only the OEM documents and returns the authoritative parts list — scanned PDFs (no text layer) are rasterized into high-res image tiles by `lib/pdfImages.js` (mupdf WASM) so parts tables stay legible; Pass 2 (`MATCH_PROMPT`) never sees the PDFs — it gets the extracted list as fixed input plus the CMMS text and a deterministic "scoping hint" (CMMS rows grepped for digit tokens from the OEM filenames, e.g. unit tag "1657"). `sanitizeResult()` in the route then enforces in code that pass-2 output references only extracted parts (drops hallucinated OEM entries, re-adds dropped ones as missing, recomputes summary counts). Do not collapse this back into one call: single-pass matching at whole-plant CSV size makes the model fabricate OEM-side parts from CMMS rows.
4. `lib/mergeResults.ts` merges a new analysis into an asset's existing result: dedupe by normalized part number (fallback: first 60 chars of description); for `matched` the higher-confidence entry wins, for `missing`/`extra` first-seen wins; summary counts are recalculated.
5. `RollupDashboard` aggregates results across all assets in the session. `AssetDetail` exports missing parts to `.xlsx` via the `xlsx` package.

**Three-way contract coupling:** the JSON output schema embedded in `lib/prompts.js` (MATCH_PROMPT), the `AnalysisResult` types in `lib/types.ts`, and the merge/dedupe keys in `lib/mergeResults.ts` must stay in sync (plus `sanitizeResult()` in the analyze route, which recomputes summary counts). Changing the analysis output means updating all of them — and the renderers: `AssetDetail`, `RollupDashboard`, `lib/report.tsx` (PDF), and `lib/sampleData.ts` (demo mode). Current schema beyond matched/missing/extra: `cmms_scope` (what the CMMS already holds for the asset — added because a 0% match read as "your BOM is empty" to clients), `coverage_note`, `needs_review` (near-matches / suspected CMMS data entry errors, e.g. OEM "1519-4" vs CMMS "N.A.#1519-3"), and per-missing-part `sourcing_category` / `lead_time_estimate` / `sourcing_note` (planning estimates by sourcing class, never supplier quotes).

The system prompt also instructs Claude to visually inspect drawings and flag components visible in diagrams but absent from parts tables (`source: "visual_inspection"`, with `visual_note`). This is a key product differentiator — don't weaken it when editing the prompt.

## Branding (locked in)

- Tagline: "Spare Parts Intelligence"
- Color palette:
  - Primary: deep navy `#1B2A4A`
  - Accent (buttons/interactive): teal/sky `#0EA5E9`
  - Critical/missing: red `#DC2626`
  - Matched/success: green `#16A34A`
  - Background: light `#F8FAFC`
  - Text: charcoal `#1E293B`
- Look and feel: clean, premium, professional industrial SaaS

## Business context & key decisions

- Business model: SaaS subscription; 1–2 prospects currently interested.
- Current priority: polish UI and branding so the app is demo-ready.
- Validation before features: avoid building big new features until real prospect feedback comes in.
- To charge money later, the app will need: user accounts/login, Stripe payments, and branded PDF report export.
- Stefano owns **sparesview.com** (registered via Bluehost, where he also pays for hosting). Plan: point the domain at the Vercel app via DNS; the Bluehost hosting itself is not used by this app.
- Patent: interested in a provisional patent on the method (AI-assisted classification of BOM gaps as CMMS data entry errors); needs an attorney.

## Roadmap ideas (not yet built)

- AI visual analysis of engineering drawings to catch components in drawings that aren't in parts lists (real example: 6 tension springs on a calciner kiln seal no parts list mentioned) — the prompt already attempts this; a dedicated workflow is the differentiator.
- Old/undocumented equipment: build BOMs from purchase history, work orders, field measurements, supplier cross-references.
- Branded PDF reports clients can show their bosses; PowerPoint export; persistent data; user accounts.

## Working conventions

- When restyling or rebranding, keep all existing functionality exactly the same unless told otherwise.
- Before any git push, verify `.gitignore` still covers `.env*`.
- After UI changes, remind Stefano to check `localhost:3000` (hard refresh Cmd+Shift+R if stale).
