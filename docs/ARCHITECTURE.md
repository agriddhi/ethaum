# Architecture — how EthAum is built

A demo that behaves like a product needs a spine. Ours is three local stores, one AI endpoint,
one marketplace bridge and a print system — all designed so a real backend can replace the
browser without rewriting the UI.

```
┌──────────────────────────── PATIENT ────────────────────────────┐
│  /  /treatments  /destinations  /doctors  /hospitals  /packages   │
│  /case/new → /matches → /quotes/compare → /booking → /consult    │
│  → /treatment → /aftercare → /reviews        /dashboard  /help   │
└───────────────┬──────────────────────┬──────────────────────────┘
                │                      │
      useSyncExternalStore      POST /api/ai  (rules → LLM)
                │                      │
     ┌──────────┴─────────┐    ┌───────┴────────┐
     │  session store      │    │  AI engine     │
     │  case store         │    │  classify      │
     │  marketplace bridge │    │  qualify       │
     └──────────┬─────────┘    │  match         │
                │              │  quote-audit   │
                │              │  reminder      │
                │              └────────────────┘
┌───────────────┴────────── PARTNER ─────────────────────────────┐
│  /provider (leads · live marketplace activity)                   │
│  /provider/quote-builder (transparency gates → send)             │
│  /provider/appointments (week grid · check-in · E2E chat)        │
└─────────────────────────────────────────────────────────────────┘
```

## 1. The three stores (`src/lib/`)

| Store | Key | Holds | Read by |
|---|---|---|---|
| `session.ts` | `ethaum-session` | name, email, city, role, since | nav avatar, /signin, /account, homepage hero |
| `case-store.ts` | `ethaum-case-v2` | treatment, budget, companions, languages, priorities, readiness, provider held, quote locked, token paid, consult done | case wizard, matches, quotes, booking, consult, aftercare, dashboard, homepage |
| `marketplace.ts` | `ethaum-marketplace` | provider quotes (items, total, checks, status), lead statuses, buddy requests | patient quotes screen, provider inbox, quote builder |

**Why `useSyncExternalStore`:** React 19 requires a stable snapshot between renders, warns about
`getSnapshot` returning new objects, and complains about `setState` inside effects. The store
pattern solves all three: the raw string is cached for identity stability while the parsed object
is refreshed whenever the underlying `localStorage` changes — including cross-tab writes via the
`storage` event. That is what makes a quote sent in the provider tab appear in the patient tab
without a server.

**Swapping to a real backend:** each store exposes `subscribeX / getXSnapshot / updateX`. Replace
the storage body with `fetch` + `router.refresh()` and the UI contracts stay identical.

## 2. The AI engine (`src/lib/ai.ts` + `src/app/api/ai/route.ts`)

```
request → validate task → try Gemini → try OpenRouter → parse & validate JSON
        → on any failure → deterministic rules engine → same output shape
```

- **Guardrails** are part of the prompt: never diagnose, never prescribe, never rank by
  commercial relationship, always end by deferring to a doctor.
- **Parsing is defensive**: fenced blocks are stripped, partial JSON is salvaged, and anything
  unparseable falls through to the rules engine.
- **The rules engine** is the source of truth for safety-critical numbers (readiness score,
  price-deviation flags, weighted match components), so the demo is deterministic and works
  with no network.
- **UI contract:** every response carries `source: "llm" | "rules"` and a human-readable `note`,
  surfaced in the interface (e.g. "AI coordination note · EthAum rules engine").

## 3. The marketplace bridge (the two-sided loop)

```
Provider portal                     Patient app                     Provider portal
─────────────────                   ───────────                     ────────────────
quote-builder                       quotes/compare                  /provider
  checks pass                          │                               │
  send ──► marketplace.quotes[]         │  live card appears            │
  lead L-2481 = "quote-sent"           │  patient holds → "held"        │
                                        │  patient confirms → "accepted" │
                                        └──────── lead L-2481 = "accepted" ──►
```

Because both sides read the same store, the demo can be run as a two-tab performance: the
hospital sends a quote, the patient sees it appear, decides, and the hospital watches the lead
flip. In production this is the same contract over WebSockets.

## 4. Journey derivation (`deriveStages`)

The 12 stages are **derived from case state**, not hardcoded:

| State | Effect |
|---|---|
| case created | stages 1–3 done, 4 active |
| qualification sent | 4 done, 5 active |
| provider held | 5 done, 6 active |
| quote locked | 6–7 done, 8 active |
| token paid | 8 done, 9 active |
| consult ended | 9 done, 10 active |
| aftercare started | 11 active, 12 upcoming |

The dashboard progress ring, the "Now —" card, the homepage hero and the aftercare gate all read
from this derivation, so the app can never contradict itself.

## 5. Print system

- `@media print` in `globals.css` hides header/footer and forces black-on-white.
- Tailwind `print:block` renders a dedicated one-page artefact that has no on-screen twin:
  the quote sheet (`/quotes/compare`), the itinerary (`/booking`), the recovery plan (`/aftercare`)
  and the clinical brief for the patient's local doctor (`/doctor-summary`).
- Prints are produced by the browser (Ctrl+P → Save as PDF) — no PDF library, no server.

## 6. Data layer

| File | Role |
|---|---|
| `src/data/ethaum.ts` | Hand-curated content: 12 treatments, 8 audited hospitals, 6 destinations, 6 doctors, reviews, FAQs, quotes, leads, journey stages |
| `scripts/seed.mjs` | Deterministic generator (seeded PRNG) → `src/data/seed.generated.json` + typed `src/data/seed.ts` |
| `src/data/seed.generated.json` | Scaled catalogue index with explicit `audited` / `demo` flags so scale never masquerades as verification |

## 7. Quality gates

```bash
npx tsc --noEmit     # types
npm run lint         # lint (react-hooks + react-compiler aware rules)
npm run build        # production build
node scripts/seed.mjs --check   # dataset integrity
```

Plus a scripted browser QA pass over all routes and the full journey (sign-in → case →
qualification → match → hold → pay → consult → aftercare) and the two-sided marketplace loop.
