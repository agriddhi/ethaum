# EthAum — the patient-first international healthcare marketplace

> World-class care, arranged around you.

EthAum is a working MVP of an end-to-end medical-tourism marketplace: a patient discovers
treatments, creates a case, uploads records, gets **AI-matched** to accredited hospitals,
compares **all-in** quotes, books, consults, travels, recovers — and is still cared for after
landing back home. The other side of the same marketplace (hospitals) gets a vetted lead inbox,
case management, a transparency-gated quote builder, appointment management and encrypted
communication.

**This repository is a demo build.** Everything runs locally: no database, no server, no
telephone numbers. Sessions, cases and quotes live in the browser (`localStorage`), and the
"AI" layer runs on a deterministic rules engine with an optional upgrade to a live LLM.

---

## The patient journey (all 12 stages are implemented)

| # | Stage | Where it lives |
|---|---|---|
| 1 | Discover | `/` — personalised hero, catalogue, destinations, doctors, packages |
| 2 | Create case | `/case/new` — 3-step guided wizard (condition → records → budget, companions, languages, priority sliders) |
| 3 | Upload records | `/case/new` — AI classification (Lab / Imaging / Prescription / Discharge) + treatment-specific missing-document checklist |
| 4 | Qualification | `/case/new` — 5-question surgeon pre-screen, readiness score out of 100, honest "don't travel yet" verdicts, live AI coordination note |
| 5 | Provider matching | `/matches` — ranked by the patient's own sliders, with "why it fits" and "what could go wrong" on every card |
| 6 | Quote comparison | `/quotes/compare` — itemised all-in quotes + AI audit of under-scoped pricing + live quotes from the partner portal |
| 7 | Select provider | `/matches` → `/quotes/compare` — hold a pick, 30-day price lock |
| 8 | Booking & payment | `/booking` — itinerary, visa, EMI planner, refundable ₹9,999 escrow token (test-mode payment) |
| 9 | Virtual consultation | `/consult` — AI-briefed pre-op call, question checklist, translated chat |
| 10 | Treatment | `/treatment` — day-by-day in-hospital plan, named care team, money-so-far, escalation numbers |
| 11 | Aftercare | `/aftercare` — Day 7 / 30 / 90 plan, medicine reminders, recovery buddy, red-flag triage |
| 12 | Review & referral | `/reviews` — verified-treatment reviews + ₹5,000 referral credit |

**Provider side:** `/provider` (lead inbox + live marketplace activity), `/provider/quote-builder`
(transparency checks gate the send button), `/provider/appointments` (week grid, arrivals check-in,
E2E-encrypted chat drawer).

**Extras that make it feel like a real marketplace:** `/care-buddies` (verified patient companions
who have already made the journey), `/doctor-summary` (a printable clinical brief for the local
cardiologist), `/packages` (eight curated all-in bundles), and a seeded catalogue index of
**132 hospitals · 18 treatments · 30 doctors** where the 8 audited institutions are clearly marked
apart from the unverified index entries.

**AI layer:** `POST /api/ai` with five tasks — `classify`, `qualify`, `match`, `quote-audit`,
`reminder`. Uses Gemini or OpenRouter when a key is configured, otherwise a deterministic rules
engine with identical output shape. The AI organises, flags, ranks and drafts — it never
diagnoses and never decides; that is stated on every screen and in the footer.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Optional (makes the AI live instead of rule-based):

```bash
cp .env.local.example .env.local
# add GEMINI_API_KEY=...  (or OPENROUTER_API_KEY=...)
```

Other scripts:

```bash
npm run build        # production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
node scripts/seed.mjs        # regenerate the seeded catalogue index (deterministic)
node scripts/seed.mjs --check # verify the seed matches the committed files
```

### Demo tips

- Sign in at `/signin` → **"Continue as Priya"** (local session, no database).
- The homepage hero, dashboard, matches, quotes, booking and aftercare all react to that session.
- Open `/provider/quote-builder` in one tab and `/quotes/compare` in another: a quote sent by the
  hospital appears on the patient's screen **live**, and the patient's decision flips the
  hospital's lead to "accepted".
- Bottom-right **"▶ Play the 60-sec demo"** button walks the journey with narration.
- Every quote, itinerary and recovery plan has a **Print / save as PDF** button.

---

## Tech stack (full list in [docs/TECH_STACK.md](docs/TECH_STACK.md))

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server + client components in one app; static-ish routes with client islands for interactivity |
| UI | React 19, Tailwind CSS v4 (CSS-first `@theme` tokens) | Design tokens in one place; no runtime CSS-in-JS cost |
| Language | TypeScript (strict) | The data model, matching math and store contracts are all typed |
| Styling | Hand-built SVG icon set + CSS animations | Zero icon-library dependency, no runtime bloat |
| Fonts | `next/font` — Fraunces + Inter | Self-hosted, no layout shift, no external requests |
| State | `useSyncExternalStore` + `localStorage` | Hydration-safe local session / case / marketplace stores; no database in the demo |
| API | Next.js Route Handlers (`/api/ai`) | One endpoint, five tasks, rules fallback so it never breaks |
| Live data | open-meteo.com (weather), open.er-api.com (FX) | Keyless, public, cached-fallback friendly |
| Imagery | Hand-drawn SVG logo + licensed Unsplash photos, stored locally | No hotlinking, works offline |
| Tooling | ESLint 9 (Next config), TypeScript CLI, Node seed scripts | Lint + typecheck + deterministic data generation in CI |

---

## Repository map

```
ethaum/
├─ src/app/                 # 30+ routes (patient, provider, research, API)
│  ├─ api/ai/route.ts       # the AI endpoint (rules + optional LLM)
│  ├─ provider/             # partner portal: inbox, quote builder, appointments
│  └─ market-research/      # the benchmarking deliverable (printable)
├─ src/components/          # nav, footer, page header, demo chat, demo tour, cards
├─ src/lib/                 # session · case store · marketplace bridge · AI engine
├─ src/data/                # curated dataset + generated seed index
├─ scripts/seed.mjs         # deterministic catalogue generator
├─ docs/                    # tech stack, research, architecture, team, video script
└─ DEMO_SCRIPT.md           # shot-by-shot demo script
```

---

## Honesty & limitations (we'd rather say it ourselves)

- **No medical advice.** EthAum coordinates; accredited hospitals treat. The AI never diagnoses.
- **Demo data.** Hospital names, accreditation status and price ranges are drawn from public
  sources for the eight audited institutions and are labelled illustrative; catalogue scale comes
  from a seeded generator whose synthetic entries are explicitly marked as demo index entries.
- **No phone numbers, by design.** Every call/WhatsApp CTA opens an in-app concierge chat so a
  demo can never ring a stranger. Medical emergencies always go to the local emergency number first.
- **No real payments.** The ₹9,999 token runs in a test-mode checkout; no card data is stored.
- **No backend.** Session, case and marketplace state live in the browser. The architecture is
  designed so a real database can replace the stores without changing the UI contracts
  (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)).

---

## Documentation index

| Document | What it covers |
|---|---|
| [docs/WHY_ETHAUM.md](docs/WHY_ETHAUM.md) | The judge-facing pitch: 8 differentiators, "is this a mockup?" answers, risks we own |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | Every tool/technology used, and why we chose it |
| [docs/MARKET_RESEARCH.md](docs/MARKET_RESEARCH.md) | Benchmarking of 14 platforms: what we adapt, improve and refuse |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stores, AI layer, marketplace bridge, print system, data model |
| [docs/VIDEO_SHOTLIST.md](docs/VIDEO_SHOTLIST.md) | Shot-by-shot guide for the 5-minute demo video |
| [docs/DEMO_VIDEO_SCRIPT.md](docs/DEMO_VIDEO_SCRIPT.md) | 5-minute demo video script, shot list and narration |
| [docs/TEAM.md](docs/TEAM.md) | Team members, roles and LinkedIn profiles |
| [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md) | What to submit where |

**Voiceover:** `make_tts_ethaum.py` (in the project root) generates the narration with Edge neural
voices — `ETHAUM_voice_prabhat.mp3` (4:44) and `ETHAUM_voice_neerja.mp3` (4:40), plus
`ETHAUM_narration.txt` for any other TTS tool.
