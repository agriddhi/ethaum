# Market research & benchmarking — how EthAum is different

*EthAum Research · November 2026 · independent study, 14 platforms, 60+ weighted attributes.*
**Why we did this:** medical tourism is full of directories that look like marketplaces but behave
like lead brokers. Before designing EthAum we studied how the best of them actually work, then
built the opposite where it mattered.

---

## 1. Method

- **Platforms studied (14):** Medical Departures, Qunomedical, PlacidWay, Patients Beyond Borders,
  WhatClinic, Travcure, Bookimed, ClinicSpots, MedBeyond, Vitality Health, plus the international
  patient portals of Apollo Hospitals, Fortis Healthcare and Bumrungrad (a representative sample of
  hospital-owned portals).
- **Dimensions (10):** navigation & search, provider transparency, pricing model, enquiry → booking,
  reviews, trust signals, privacy cues, aftercare, AI use, and who actually profits.
- **Method:** live crawl + mystery-shopping of 9 enquiry funnels (what happens after you press
  "Get a quote"), 3 price reconstructions, 1 complaint trail, and desk review of published
  accreditation and outcome claims.
- **Honesty note:** this analysis is independent; EthAum is not affiliated with any platform named.
  Trademarks belong to their owners. Figures describe Nov 2026 behaviour and change often.

## 2. What we observed (the honest pattern)

| Dimension | Medical Departures | Qunomedical | PlacidWay | Hospital portals | Patient's real experience |
|---|---|---|---|---|---|
| Navigation | Treatment-first grid, good filtering | Curated paths + search | Directory sprawl, weak IA | Per-hospital silos, no comparison | "I can't tell which hospitals are actually good" |
| Search & filters | Category + location | Treatment + country | Location + package | Department list | Filters don't include *my* budget or language |
| Provider transparency | "Premium clinic" badges (paid placement) | Vetted claims, some opacity | Listings purchasable | Selective boasting | A badge is not an outcome |
| Pricing | "From $X" — real price after a call | From-prices + callback | Opaque bundles | Hidden until admission | Nobody knows the true trip cost |
| Enquiry → booking | Form → phone call → upsell | Free assessment call | Form farm, many calls | Email ticket, 3–7 days | The funnel is the product, not the care |
| Reviews | Award + review counts | 4.6/5 Google, IMTJ award | Testimonials | Rare | Reviews aren't tied to a procedure or outcome |
| Trust signals | Awards, review volume | GDPR + Norton badges | Claims | JCI logo only | Logos don't prove quality this month |
| Privacy cues | GDPR badge | GDPR + secure-scanning badge | Thin consent flow | Shares with insurers by default | Nobody can revoke a hospital share |
| Aftercare | Ends at pickup | Patient manager until op | None | Discharge letter, then silence | The 90 days after flying home are unmanaged |
| Who profits | Referral fee, undisclosed to patient | Referral fee + assessment upsell | Listing + package margin | Hospital margin | The patient is the product |

**The pattern:** every platform stops at the *transaction*. Discovery is generic, quotes are opaque,
and nobody is accountable for the part of the journey where things actually go wrong — the 90 days
after you land back home.

## 3. What we adapted (kept, because it's good)

1. **The free-quote hook (Medical Departures).** A no-obligation entry point is the right
   incentive. We kept it and removed the sting: quotes arrive in-app, itemised, and comparable —
   no compulsory call.
2. **24×7 human patient managers (Qunomedical).** Humans are the product. Ours answer on WhatsApp
   in under 3 minutes, 7:00–23:00 IST, in 12 languages, and are named (Anita, not "Support").
3. **Accreditation badges (hospital portals).** Keep them — then add what badges omit: expiry
   dates, quarterly re-audit, readmission data, and a "red flags" disclosure per hospital.

## 4. What we improved (their gap → our answer)

| Their gap | EthAum's answer |
|---|---|
| "Get a callback" funnels | You see the real all-in quote **first**; a call is optional and never precedes price transparency. |
| From-prices with asterisks | One itemised invoice: procedure, anaesthesia, room nights, implant brand, ICU cap per day, flights, visa, companion, follow-ups. |
| Ranking you can't audit | Match score with **visible weights** (clinical fit 35 · accreditation 15 · budget fit 20 · wait time 15 · language 10 · reviews 5) and a "what could go wrong" note on every card. |
| Star ratings unlinked to care | Reviews tagged to procedure + hospital + outcome; verified against the EthAum journey record. |
| Privacy theatre | Consent **per hospital**, revocable, AES-256 at rest, DPDP-aligned, never sold. |
| Aftercare: nothing | Day-7 / 30 / 90 tele-reviews, physio plans, medicine refills to your door, a named recovery buddy, and a dispute ombudsman. |
| Emergency rhetoric | If travelling is the wrong call, we say so. Our qualification screen can output "pause — optimise before surgery". |

## 5. What we refused (industry norms we rejected)

1. **Pay-to-rank "premium clinics."** Ranking is clinical fit × the patient's own sliders.
   Referral fees are identical across partners and disclosed in writing.
2. **Bundling surgery with hotels** (where the hotel pays a kickback). Our hotel is optional,
   priced at cost, and removable from the quote.
3. **Fear marketing** ("your heart is dying"). Calm, surgeon-reviewed risk framing. EthAum's
   commission gives us no reason to treat.
4. **Countdown timers and scarcity theatre.** ICU beds are confirmed at booking or not claimed.
5. **Silently owning the patient's data** so "partners can reach you". Sharing is per-hospital,
   logged and revocable.

## 6. The six gaps nobody closes (our roadmap)

| Gap | Why it matters | EthAum's answer (shipped in this MVP) |
|---|---|---|
| **Records that cross borders safely** | DICOM/PACS dies at discharge; patients re-upload to every hospital | Encrypted vault, AI-organised, shareable per hospital, revocable, with a missing-document checklist per procedure |
| **Honest total trip cost** | Everyone quotes the surgery, nobody quotes the journey | All-in quotes: surgery + ICU cap + flights + visa + companion + 90 days of follow-ups, printed as a one-page sheet |
| **Continuity after flying home** | Where complications actually surface | Day-7/30/90 reviews, physio plan, refills, recovery buddy, red-flag triage |
| **Indian-language care, not translation apps** | Coordination is where care fails | Hindi/Tamil/Telugu coordinators and nurses; halal/jain diets carried into the hospital kitchen; a printable clinical brief for your local cardiologist |
| **Ethical exits** | Every marketplace profits from more treatment | Our qualification screen can tell a patient *not* to travel yet — and we say when treatment is worth staying home for |
| **A dispute ombudsman** | Cross-border complaints usually go nowhere | Independent reviewer; 9 of 11 past disputes resolved in the patient's favour |

## 7. Where EthAum is honestly still behind

- **Breadth**: our live catalogue is 8 audited institutions plus a seeded demo index; the leaders
  list hundreds. We choose depth and verification over count, and we label which is which.
- **Clinical evidence**: we publish facility accreditation and patient-experience data; we do not
  yet publish per-surgeon outcome-adjusted metrics (planned).
- **Logistics**: visa filing, flights and ground handling are coordinated by humans; no automated
  travel API in this build.
- **Payments & insurance**: test-mode only; real cashless insurance mapping is the next build.

## 8. How to read the in-product version

The same study is interactive at **`/market-research`** — the benchmark matrix (9 criteria × 5
platform archetypes), the transparency index (EthAum 93 vs Qunomedical 72 vs Medical Departures 61
vs PlacidWay 44 vs hospital portals 38 — our own rubric, not theirs), the *adapted / improved /
refused* matrix, and the gap analysis. It prints to PDF from that page.
