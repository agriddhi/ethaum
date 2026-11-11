# Pitch to the event host / judges — ready to paste into Gmail

**Subject line (pick one):**
- `EthAum — the international healthcare marketplace that survives the journey (demo + research)`
- `kairo-aeon-tech submits EthAum: one patient journey, two sides, no lead-broker funnel`

---

Hi [Host / Jury name],

We're **kairo-aeon-tech** (LinkedIn: https://www.linkedin.com/in/agriddhi/) and we're submitting
**EthAum** — an AI-assisted marketplace for international healthcare, built as a working web app
rather than a slide deck.

**The problem we picked.** International medical travel is fragmented in a specific, fixable way.
Patients discover hospitals on one site, chase quotes by phone, upload the same scans again to
every hospital, get billed in a currency they don't understand, and then — after the surgery — get
abandoned in the 90 days where complications actually surface. We benchmarked **14** platforms
(Medical Departures, Qunomedical, PlacidWay, plus hospital international-patient portals) and found
the same pattern in all of them: **every one stops at the transaction.** That gap is our product.

**What we built (all clickable, not mocked).**

- **The full 12-stage patient journey** — Discover → Create Case → Upload Records →
  Qualification → Provider Matching → Quote Comparison → Select Provider → Booking & Payment →
  Virtual Consultation → Treatment → Aftercare → Review & Referral — carried by **one live case
  object**, so the homepage, dashboard, quotes, booking and aftercare always agree.
- **A real two-sided marketplace loop.** A hospital builds a quote in our partner portal; it is
  **gated** until three transparency checks pass (implant brand named, total inside the patient's
  ceiling, ICU cap written in); the patient sees it **arrive live** in their browser, holds it
  (30-day price lock), and confirms — at which point the hospital's lead flips to *"accepted by the
  patient."* One event, both sides, instantly. No competitor does this.
- **An AI layer with a conscience.** One endpoint (`/api/ai`) classifies records, flags the
  reports a procedure still needs, scores readiness, ranks hospitals by published weights and
  audits quotes — and it can tell a patient to **wait and optimise before travelling**. The product
  states the boundary everywhere: *AI organises and flags; accredited doctors decide.*
- **All-in pricing with an audit trail**, printable as a one-page quote sheet, plus a printable
  itinerary, recovery plan and **a clinical brief for the patient's own cardiologist**.
- **Aftercare as the spine** — day-7/30/90 reviews, physio, refills to the door, a named nurse and
  a red-flag triage panel — plus **care buddies**: verified patients who have already made the same
  journey.
- **Honest scale** — 132 institutions indexed, **8 audited**, and the interface says exactly which
  is which. We label every synthetic entry rather than passing demo data off as verified.

**Why we think it should be picked.** It is the only submission that (a) runs the *whole* journey
rather than a discovery page, (b) connects **both sides of a real marketplace**, (c) keeps the
clinical safety boundary visible, and (d) shows its reasoning — our benchmarking study, our
adapt/improve/refuse matrix and the places where we are honestly still behind are published in the
app itself (`/market-research`).

**Evidence in the submission**
- **Video demo:** 4:44 (voiceover + screen capture) — the two-tab marketplace loop is the centrepiece
- **Source code:** Next.js 16, React 19, Tailwind v4, strict TypeScript — 0 lint errors, 0 type
  errors, **219 static pages**, deterministic seed generator with an integrity check, documented
  architecture
- **Tools & tech:** every dependency with the reason we chose it, plus what we deliberately rejected
- **Team:** kairo-aeon-tech — https://www.linkedin.com/in/agriddhi/

**What we are honest about (we'd rather say it first).** There is no database in the demo — the
session, case and marketplace state live in the browser, and the stores are API-shaped so a real
backend drops in behind them. Payments are test-mode. Prices, catalogue scale beyond the eight
audited institutions, and all reviews are illustrative. And we publish **no phone number anywhere**
— every contact CTA opens an in-app concierge chat, because a demo must never ring a stranger.

Happy to walk you through it live (the app has a **60-second guided tour** built in), or to answer
anything on the clinical rules — including the ones we got wrong.

Best regards,
**agriddhi** — kairo-aeon-tech
https://www.linkedin.com/in/agriddhi/

---

## Shorter version (if the email needs to fit one screen)

> Hi [name] — we're **kairo-aeon-tech** (https://www.linkedin.com/in/agriddhi/) submitting
> **EthAum**, an AI-assisted international healthcare marketplace.
>
> **The gap we found:** we benchmarked 14 platforms (Medical Departures, Qunomedical, PlacidWay,
> hospital portals) — every one stops at the transaction. Nothing connects records → matching →
> aftercare, and nobody serves the 90 days after patients fly home.
>
> **What we built:** the complete 12-stage journey on one live case object; a genuine two-sided
> marketplace (a hospital's gated quote appears in the patient's browser live, and the patient's
> decision flips the lead); an AI layer that classifies records, scores readiness and audits
> quotes but never decides medicine — it can even tell a patient to wait and optimise first;
> all-in printable quotes; aftercare with day-7/30/90 reviews; and care buddies (verified patients
> who've made the same journey).
>
> **Why pick us:** it's the only submission that runs the whole journey, connects both sides of a
> marketplace, keeps the clinical boundary visible, and publishes its own benchmarking — including
> where we're behind.
>
> **In the submission:** 4:44 demo video, full source (Next.js 16 / React 19 / strict TypeScript,
> 219 static pages, zero lint and type errors), the complete tools & tech list with reasons, and
> our team profiles.
>
> We'd love to walk you through it live — the app includes a 60-second guided tour. Happy to
> discuss the clinical rules, including the ones we got wrong.
>
> — **agriddhi**, kairo-aeon-tech · https://www.linkedin.com/in/agriddhi/

---

## If they ask "what would you do next?" (have this ready)

1. **Swap the local stores for a real backend** — Postgres + object storage + a partner-facing API;
   the UI contracts don't change (see `docs/ARCHITECTURE.md`).
2. **Get clinical governance** — a clinical advisory board that owns the qualification rulebook and
   holds a veto over what the AI may surface.
3. **Sign two partner hospitals** for a 20-patient pilot in Chennai × Bangkok (cardiac + orthopaedic),
   and measure: time-to-quote, quote variance, day-30 follow-up completion.
4. **Ship the money rails** — escrow, EMI and insurance cashless mapping, plus the ombudsman
   process we already reference in-app.
