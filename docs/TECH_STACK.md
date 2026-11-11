# Tools & technology used to build EthAum

Everything below is in this repository. No paid services, no proprietary SDKs, no hidden
infrastructure — the whole platform runs on `npm install && npm run dev`.

## 1. Core stack

| Tool | Version | Role | Why this one |
|---|---|---|---|
| **Next.js** | 16.4 (App Router, Turbopack) | Framework, routing, build, dev server | One codebase for the marketplace front-end *and* the AI API. Server Components keep static pages (catalogue, research) cheap; Client Components give us the live marketplace without a second app. |
| **React** | 19.3 | UI runtime | `useSyncExternalStore` gives us hydration-safe local stores with no flicker — the backbone of the demo's "the site remembers you" behaviour. |
| **TypeScript** | 5.x, `strict` | Types across app, stores and data | The matching/quote maths and the store contracts are typed, so a change in the case model breaks the build instead of the demo. |
| **Tailwind CSS** | v4 (CSS-first `@theme`) | Styling | Design tokens live in `globals.css` as CSS variables (`--color-forest`, `--color-mint`, `--font-display`), so the brand is consistent across 30+ routes with zero runtime cost. |
| **ESLint** | 9 + `eslint-config-next` | Linting | React Compiler-aware rules (`react-hooks/set-state-in-effect`, `preserve-manual-memoization`) caught real bugs during the build. |
| **Node.js** | 20+ (tested on 26) | Tooling + seed scripts | `scripts/seed.mjs` generates the catalogue index deterministically (seeded PRNG) with zero dependencies. |

## 2. Design & media

| Tool | Role | Notes |
|---|---|---|
| **Hand-authored SVG** | Logo (`public/ethaum-mark.svg`), favicon (`src/app/icon.svg`), 20+ interface icons | Vector, tiny, themeable, no icon-library dependency. The lotus + ECG mark is drawn from scratch. |
| **Fraunces + Inter** via `next/font/google` | Display + UI typefaces | Self-hosted at build time: no runtime requests to Google, no layout shift, no privacy leak. |
| **Unsplash** (downloaded, not hotlinked) | Photography (4 portraits, care imagery) | Stored under `public/img/` so the demo renders identically offline and on stage. |
| **CSS animations & keyframes** | Marquee, float, fade-slide, equalizer, progress rings | No animation library; respects `prefers-reduced-motion` for the demo tour. |

## 3. Data & state (no database in the demo)

| Tool | Role | Notes |
|---|---|---|
| **JSON / TS data modules** | `src/data/ethaum.ts` (curated) + `src/data/seed.generated.json` (generated) | Static, typed, version-controlled content. |
| **`localStorage` + `useSyncExternalStore`** | Three stores: session, case, marketplace bridge | Hydration-safe (server snapshot → client snapshot), cross-tab live (the `storage` event), and swappable for a real API later. |
| **Node seed generator** | `scripts/seed.mjs` | Deterministic PRNG → same output every run; `--check` mode verifies the committed files. |

## 4. AI layer

| Tool | Role | Notes |
|---|---|---|
| **Next.js Route Handlers** | `POST /api/ai` — tasks: `classify`, `qualify`, `match`, `quote-audit`, `reminder` | One endpoint, one JSON contract, rules fallback always on. |
| **Google Gemini API** (`gemini-2.0-flash`) | Optional live LLM | Set `GEMINI_API_KEY`; used for document classification, qualification prose, match reasoning, quote audits, reminder copy. |
| **OpenRouter API** | Optional alternative LLM provider | Set `OPENROUTER_API_KEY`; same contract, provider-swappable. |
| **Deterministic rules engine** (`src/lib/ai.ts`) | Default path | Weighted scoring, medical red-flag rules, price-deviation audits. The demo never depends on a network call — critical when the wifi dies on stage. |
| **Prompt guardrails** | Same file | The model is instructed never to diagnose, never to prescribe and never to rank by commercial relationship; output is always parsed defensively and falls back to rules. |

## 5. Free, keyless data sources

| API | Use | Endpoint | Fallback |
|---|---|---|---|
| **open-meteo.com** | Live weather for destination recovery windows | `api.open-meteo.com/v1/forecast` | Static seasonal note per country |
| **open.er-api.com** | Live INR FX rates in the nav bar | `open.er-api.com/v6/latest/INR` | Hard-coded indicative rates |

## 6. Quality & delivery

| Tool | Role |
|---|---|
| **TypeScript CLI** (`npx tsc --noEmit`) | Type gate across the whole project |
| **ESLint** | Lint gate (0 errors, 0 warnings at submission) |
| **Next.js production build** | `npm run build` — static generation for catalogue/research pages |
| **Print stylesheets** (`@media print` + Tailwind `print:` variants) | One-page quote sheet, itinerary and recovery plan as PDF artefacts |
| **Browser-driven QA** | Every route smoke-tested (27/27 clean), full journey scripted end-to-end: sign-in → case → qualification → match → hold quote → token → consult → aftercare, plus the two-sided marketplace loop |

## 7. What we deliberately did **not** use

| Not used | Why |
|---|---|
| A database (Postgres/Mongo/Firebase) | Out of scope for a demo, and a local-first store is faster and safer to demo. The store contracts are API-shaped so it can be swapped in. |
| UI component libraries (MUI/Ant/Headless UI) | Would have fought the EthAum visual language; the custom design system is the brand. |
| Auth providers (Auth0/Clerk) | Same reason — the local session demonstrates the *personalisation* behaviour, which is the point of the demo. |
| Payment SDKs (Razorpay/Stripe) | Test-mode checkout instead: no card data, no keys, no compliance surface in a hackathon build. |
| Icon/animation libraries | Hand-authored SVG + CSS keeps the bundle small and the look distinctive. |
| Google Analytics / trackers | Privacy-first: no third-party trackers on a healthcare journey site. |

## 8. External data references used in the research

Medical Departures · Qunomedical · PlacidWay · Patients Beyond Borders · WhatClinic · hospital
international-patient portals (Apollo, Fortis, Narayana, Manipal, Max, Bumrungrad, Memorial,
Acıbadem, Sunway, Gleneagles) · JCI / NABH / GACHC / MSQH accreditation registries · public price
guidelines for CABG, TKR, IVF, dental implants, FUE, bariatric and cataract care in India,
Thailand, Singapore, Turkey, Malaysia and the UAE. Full analysis: `docs/MARKET_RESEARCH.md`.
