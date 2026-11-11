# EthAum — 5-minute demo video script

**Format:** screen recording + voiceover · captions burned in · end card with team + LinkedIn.
**Runtime target:** 4:30–5:00. Cut at 5:00 hard.

---

## 0:00–0:20 · The problem (hook)
> "When my uncle needed a bypass, it took us eleven phone calls, four websites and forty thousand
> rupees in agent fees — and we still didn't know if the quote we got was honest. International
> healthcare has a discovery problem, a price problem, and an aftercare problem."

*Visual: fast, quiet montage of blurred listings and price pages → hard cut to the EthAum logo.*

## 0:20–0:45 · What EthAum is
> "EthAum is a patient-first marketplace for international care. Discovery, records, AI matching,
> honest all-in quotes, booking, consultation, treatment and aftercare — one journey, one owner,
> twelve stages."

*Visual: homepage hero. Then the **persona switcher** — click "Priya · CABG · ₹12L" → hero rewrites
to "Your cardiac match is ready: 94 — Bumrungrad."*

## 0:45–1:20 · The patient journey, live
> "Priya is 54 with triple-vessel disease in Chennai. She tells us her situation, uploads fourteen
> reports — and our AI classifies every file, then tells her exactly what's still missing for a
> bypass. Two partner surgeons review her case free. AI organises; doctors decide."

*Visual: `/case/new` → step 1 → step 2 (upload, watch "AI reading… Lab / Imaging" chips land and
the missing-document checklist tick off) → step 3 (budget slider, companion, language, priority
sliders) → **Create my case** → the qualification screen: answer the five questions → watch the
readiness ring move to **100/100** and the green **AI COORDINATION NOTE** appear.*

## 1:20–1:50 · Matching with receipts
> "Three hospitals match. We re-rank them by *her* priorities — cost, outcomes, speed. Every card
> shows why it fits and what could go wrong. The score isn't magic: the weights are published."

*Visual: `/matches` → click "Reorder by cheapest first" → cards animate → open a card to show the
"why it fits" bullets and the amber "what could go wrong" flags → hold Bumrungrad (mint ✓ Held).*

## 1:50–2:25 · Quotes, audited
> "Three itemised all-in quotes — surgery, ICU cap, implant brands, flights, visa, companion. Our
> AI audits them and flags the one priced eleven percent below market, so she knows exactly what
> to ask in writing before she flies."

*Visual: `/quotes/compare` → three quote cards with full breakdowns → the **AI quote audit** strip →
click **Print / save PDF** (a clean one-page quote sheet appears).*

## 2:25–2:50 · The other side of the marketplace (the wow moment)
> "Now the same platform, from the hospital's side. The partner portal gets qualified leads, not
> tyre-kickers. Their quote builder refuses to send a quote until every transparency check passes
> — implant brand, price ceiling, ICU cap. And when they send it, it lands on her screen *live*."

*Visual: split screen — `/provider/quote-builder` in one tab: fill the implant brand, watch the
checks turn green, click **Send quote to patient**; `/quotes/compare` in the other tab: the live
quote card appears "sent just now" → she holds it → she confirms → back in the portal, the lead
now reads **"accepted by the patient — proceed to admission."***

## 2:50–3:20 · Booking, consult, travel
> "Booking builds the whole itinerary — visa letter, flights held, hotel near the hospital, EMI
> options, a refundable nine-thousand-nine-hundred-and-ninety-nine rupee token in escrow. Then a
> pre-op call with the surgeon who has already read her file, and a day-by-day plan for the ten
> days inside the hospital."

*Visual: `/booking` (itinerary + EMI slider + token payment) → `/consult` (AI pre-consult brief,
live call mock, question checklist) → `/treatment` (day-by-day hospital plan, named team).*

## 3:20–3:50 · Aftercare — the gap nobody fills
> "Every other platform stops when you fly home. Ninety days later is where things actually go
> wrong. Day seven, day thirty, day ninety — reviews, physio, refills to her door, a nurse who
> calls at seven in the morning."

*Visual: `/aftercare` (plan, medicine toggles, recovery buddy, red-flag panel) → `/reviews`.*

## 3:50–4:15 · The research behind it
> "We benchmarked fourteen platforms across sixty attributes. Nobody connects records, matching and
> aftercare. We adapted what works — free quotes, human coordinators, accreditation — and refused
> what doesn't: pay-to-rank listings, hotel kickbacks, fear marketing."

*Visual: `/market-research` — matrix, transparency index bars (EthAum 93), adapted/improved/refused
cards, gap analysis.*

## 4:15–4:35 · The build
> "This is a working build, not a mock-up: thirty routes, Next.js and TypeScript, a rules-based AI
> engine that upgrades to a live model with one API key, and a marketplace where the hospital's
> quote and the patient's decision are the same event. No database in the demo — and no phone
> numbers, because dialling a stranger isn't a feature."

*Visual: rapid route sweep (catalogue → destinations → doctor profile → partner portal → help
centre) with the URL bar visible.*

## 4:35–5:00 · Close
> "EthAum. Heal better, everywhere."

*End card: logo, tagline, 3-line value prop, team names + LinkedIn handles, "Illustrative demo —
not medical advice."*

---

## Shooting checklist

- 1440×900 viewport, 100% zoom, bookmarks bar hidden, cursor highlight on.
- 30 fps, hard cuts every 2–3 seconds, captions on (judges watch muted).
- **Rehearse the whole flow once before recording.** The demo is 100% clickable: sign in
  (`/signin` → "Continue as Priya") → `/case/new` → `/matches` → `/quotes/compare` → `/booking` →
  `/consult` → `/treatment` → `/aftercare`.
- Open **two tabs** for the 2:25 marketplace segment (provider portal + patient quotes).
- Safety net: the **"▶ Play the 60-sec demo"** button (bottom-right, on every page) auto-walks the
  journey with narration — if a click stalls on stage, hit it and keep talking.
- Pre-clear browser state (localStorage) so the demo starts from a clean case, then sign in as
  Priya live.
- Swap the real team names + LinkedIn URLs into the end card (see `docs/TEAM.md`).
- Optional upgrade before recording: add `GEMINI_API_KEY` to `.env.local` so the AI note reads
  "Gemini (live)" instead of "EthAum rules engine".
