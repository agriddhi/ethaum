# Why EthAum — what makes it different, and why a judge should pick it

*The 60-second answer. Use it in the deck, in the demo intro, and in your own head.*

## The one-line pitch

> **Every medical-tourism marketplace stops at the transaction. EthAum owns the whole journey —
> and it is the only one where the hospital's quote and the patient's decision are the same live event.**

## The eight things that are genuinely hard to copy

| # | Differentiator | Why judges will care | Proof in the build |
|---|---|---|---|
| 1 | **The full 12-stage journey is one system** | Competitors show a catalogue or a call form. Ours runs discovery → aftercare → referral, with the state carried between stages. | `/dashboard` derives all 12 stages from one case object |
| 2 | **A real two-sided marketplace loop** | "Marketplace" usually means a listings page. Ours: a hospital sends a quote in its portal → it appears in the patient's browser live → the patient decides → the lead flips to "accepted". | `/provider/quote-builder` ⇄ `/quotes/compare`, two tabs, live |
| 3 | **An AI layer that refuses to overstep** | Every competitor bolts on a chatbot. Ours documents, flags gaps, scores readiness, ranks hospitals and writes briefs — and explicitly *declines* to decide. The qualification screen can tell a patient **not to travel yet**. | `POST /api/ai` (5 tasks) + readiness screen + "doctors decide" boundary everywhere |
| 4 | **All-in pricing with a teeth-showing audit** | The industry's dirty secret: hotel kickbacks and hidden packages. Ours itemises surgery, implants, ICU-per-day cap, flights, visa, companion, follow-ups — and flags any quote >8% below median. | `/quotes/compare` + printable quote sheet |
| 5 | **Honest scale, honestly labelled** | 132 institutions indexed, 8 audited — and the UI *says so*. Marketing-grade claims with a "demo" badge on everything loses to an honest index with verified records next to it. | `/hospitals` "Audited only (8) / Full index (132)" |
| 6 | **Aftercare as the product's spine** | Nobody serves the 90 days after patients fly home — that's where complications surface. Ours: day-7/30/90 reviews, physio, refills, a named nurse, red-flag triage, care buddies. | `/aftercare`, `/care-buddies` |
| 7 | **A safety net for the patient's own doctor** | A printable clinical brief for the cardiologist who stays behind — the referral route competitors ignore. | `/doctor-summary` (fits one page) |
| 8 | **Research-led, and we publish our refusals** | We benchmarked 14 platforms and documented what we *refuse* (pay-to-rank, kickbacks, fear marketing). Judges reward teams that know their category. | `/market-research` + `docs/MARKET_RESEARCH.md` |

## The five "how do you know this isn't a mockup?" answers

1. **State is real.** Sign in → create a case → hold a quote → pay the token → the dashboard, hero,
   aftercare and provider portal all change. Refresh the page: it's still there. Open a second tab:
   the quote crosses over live.
2. **The AI endpoint is real.** `POST /api/ai` with Gemini/OpenRouter support and a deterministic
   rules fallback — the UI labels which one answered (`source: llm | rules`).
3. **The transparency gate is enforced in code.** The provider's "Send quote" button is *disabled*
   until the implant brand, price ceiling and ICU cap checks pass. That's a rule in the product, not
   a caption.
4. **The build is production-shaped.** Next.js 16, React 19, Tailwind v4 tokens, strict TypeScript,
   0 lint errors, 0 type errors, **219 static pages**, a deterministic seed generator with a
   `--check` integrity mode, and a documented architecture.
5. **We removed the phone numbers on purpose.** Every contact CTA is an in-app concierge chat,
   because a demo must never ring a stranger — and we say that out loud in the video.

## The three risks we own before the judges do

| Risk | Our answer |
|---|---|
| "No database — is it a real app?" | Correct, and intentional: the stores are API-shaped so a backend slots in behind them. `docs/ARCHITECTURE.md` shows the swap. |
| "Are the hospital prices/doctor profiles real?" | The 8 audited institutions carry public accreditation data and are labelled illustrative on price; catalogue entries carry explicit `demo`/`verified` flags. |
| "Does the AI replace doctors?" | No — it coordinates. The qualification screen can output "pause, optimise before surgery", and every clinical decision stays with the accredited hospital and the patient's own doctor. |

## Where we are still behind (say it before they ask)
Breadth of the live catalogue (leaders list hundreds, we audit 8), per-surgeon outcome-adjusted
metrics (not yet published), automated travel/visa APIs (coordinated by humans today), and real
payments/insurance (test mode only).

## The ask, if you want the pilot
1. **Two partner hospitals** for a 20-patient pilot in Chennai × Bangkok cardiac + orthopaedic.
2. **A clinical advisor** (one cardiac surgeon, one orthopaedic surgeon) to own the qualification
   rulebook and the veto.
3. **A coordinator** — our care manager answers in under 3 minutes; that promise only holds if
   someone owns it.
