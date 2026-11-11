# EthAum — demo script

> **The submission-grade script (5-minute, shot-by-shot, with the two-sided marketplace
> segment) lives in [`docs/DEMO_VIDEO_SCRIPT.md`](docs/DEMO_VIDEO_SCRIPT.md).**
> This file is the longer working draft with extra recording notes.

# EthAum — 90-second demo script (hackathon submission)

**Format:** screen recording + voiceover · captions on · music: low, warm, hopeful · end card with tagline + team + LinkedIn.

---

**[0:00–0:08] HOOK — the problem**
> "When my uncle needed a bypass, it took us 11 calls, 4 websites and ₹40,000 in agent fees — and we still didn't know if Bumrungrad's quote was fair. International healthcare is broken: finding, affording and surviving the system."

*Visual: rapid montage of blurred hospital pages, phone, WhatsApp threads → cut to black. EthAum logo fades in.*

**[0:08–0:18] THE PROMISE**
> "EthAum is one patient-centric marketplace: discover → create a case → upload records → AI matches you → compare all-in quotes → book → consult → treat → aftercare — all in one place."

*Visual: homepage hero. Persona toggle click — "Priya · CABG · ₹12L". Hero re-renders: "Your cardiac match is ready: 94 — Bumrungrad."*

**[0:18–0:32] PATIENT JOURNEY — the magic**
> "Priya, 54, triple-vessel disease in Chennai. She types her condition — or just speaks it. Uploads 14 reports; our AI classifies them, flags HbA1c, and shows exactly what's missing. Two surgeons review free — AI coordinates, doctors decide."

*Visual: /case/new wizard → file upload → "AI reading… Lab" chips → missing-documents checklist ticking off.*

**[0:32–0:48] MATCHING + QUOTES**
> "Three hospitals fit. Reordered live by her sliders — cost, outcomes, speed. Bumrungrad wins for her: ₹10.8L all-in — surgery, ICU, flights, visa, companion, 90 days of follow-ups. Every quote is honest: implant brands, ICU daily caps, what happens on day 2."

*Visual: /matches cards → reorder by "Cheapest first" (cards animate) → /quotes/compare side-by-side → ₹10.8L locked.*

**[0:48–0:58] BOOKING + CONSULT**
> "Token ₹9,999 — refundable. Flights held, hotel booked, visa letter in 48 hours. Her pre-op call with Dr. Meera — AI-briefed, Hindi and English — happens before she packs."

*Visual: /booking itinerary → /consult: video call, "Pre-consult brief" panel, question checklist ticks itself.*

**[0:58–1:10] AFTERCARE + REVIEWS**
> "The real gap in medical tourism is after you fly home. EthAum: day-7 wound check, day-30 cardiac rehab, day-90 audit — plus a nurse who calls at 7 am. Her review is verified because we coordinated her care."

*Visual: /aftercare plan + medicine toggles → /reviews.*

**[1:10–1:20] PROVIDER SIDE**
> "Hospitals get qualified, pre-vetted leads — not tyre-kickers. Quote builder enforces transparency: no implant brand, no send-button. ICU beds confirmed at booking, not at arrival."

*Visual: /provider kanban → urgent lead → quote-builder transparency checklist goes mint-green → "Send quote".*

**[1:20–1:28] THE PROOF — research**
> "We benchmarked 14 platforms across 60 attributes. Nobody does records + matching + aftercare together. EthAum is the first full-stack patient journey."

*Visual: /market-research — benchmark matrix scroll, transparency index bars (EthAum 93).*

**[1:28–1:30] TAGLINE**
> "EthAum — heal better, everywhere."

*End card: logo · tagline · team names + LinkedIn · ethaum.in · "Illustrative demo — not medical advice."*

---

**Recording notes**
- Viewport 1440×900, 100% zoom, hide bookmarks bar; cursor highlight on.
- Record at 30fps; cuts every 2–3s max; captions key (judges watch muted).
- Priya flow must be clickable end-to-end in the video: home → case → matches → quotes → booking → consult → aftercare. Rehearse once; the demo never leaves localhost.
- Swap in real team names + LinkedIn handles in the end card.

**New in this build (use these on camera)**
- **Sign in is local** — "Continue as Priya" on `/signin` writes a session to this browser only (no database). The nav then shows her avatar on every page.
- **The journey is stateful** — hold a provider on `/matches`, hold a quote on `/quotes/compare`, pay the ₹9,999 token on `/booking`, and `/dashboard` re-derives all 12 stages live (8 of 12 cleared → "Now — Virtual consultation"). The homepage hero rewrites itself to "Booking confirmed. See you in Bangkok."
- **Printable artefacts** — "Print / save PDF" on `/quotes/compare` produces a clean one-page all-in quote sheet; `/booking` prints the itinerary, `/aftercare` prints the recovery plan.
- **Guided tour** — the "▶ Play the 60-sec demo" button (bottom-right, on every page) auto-walks the 8-step journey with narration captions. Use it as a safety net if live clicking stalls, or record it as the backbone of your video.
- **No phone numbers anywhere** — every call/WhatsApp CTA opens an in-app concierge chat (scripted, nothing sent). Say this out loud: *"we removed real numbers from a demo because dialling a stranger is not a feature."*
- **Live AI note** — on the qualification screen the AI coordination note appears with its engine badge ("EthAum rules engine" or your LLM model). Add a Gemini key to `.env.local` (see `.env.local.example`) and it switches to live LLM assistance.
