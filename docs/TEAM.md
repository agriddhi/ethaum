# Team — kairo-aeon-tech

> **Action needed before submission:** add the remaining team members' names, roles and
> LinkedIn URLs below. The team name, primary LinkedIn and the contribution map are already
> filled in. The same list is rendered on the end card of the demo video and in the
> "Team & LinkedIn" section of the submission deck.

**Team name:** kairo-aeon-tech
**Primary LinkedIn:** https://www.linkedin.com/in/agriddhi/

## Team members

| # | Name | Role in EthAum | What they own in the build | LinkedIn |
|---|---|---|---|---|
| 1 | **agriddhi** (team lead) | Product, clinical journey & narrative | Patient journey design, qualification rules and the "AI coordinates, doctors decide" boundary, benchmarking study, demo script and the story judges hear | https://www.linkedin.com/in/agriddhi/ |
| 2 | _[Full name]_ | Full-stack engineering | Next.js app, local stores (session / case / marketplace), AI engine + API routes, print artefacts | _[linkedin.com/in/…]_ |
| 3 | _[Full name]_ | Marketplace & provider side | Partner portal, quote builder with transparency gates, two-sided quote loop, lead pipeline | _[linkedin.com/in/…]_ |
| 4 | _[Full name]_ | Research, content & data | Benchmarking of 14 platforms, treatment/hospital dataset, seed generator, help centre + reviews content | _[linkedin.com/in/…]_ |
| 5 | _[Full name]_ | Design & brand | "Sage & Ink" design system, logo, typography, patient-facing copy and trust cues | _[linkedin.com/in/…]_ |

_(add or remove rows to match the real team — 4–6 rows reads best; if you are a small team,
showing fewer roles with deeper ownership beats padding the list)_

## How to present the team on the end card

```
ETH AUM — HEAL BETTER, EVERYWHERE
built by kairo-aeon-tech
agriddhi · Product & clinical journey · linkedin.com/in/agriddhi
[Name] · [Role] · linkedin.com/in/handle
```

Keep it to the team name plus two or three names with links on screen; put the full list in the
submission deck.

## Suggested role framing for judges

- **One clinical owner** — proves the safety boundary is real (qualification rules, disclaimers,
  "we will tell you not to travel" logic).
- **One engineering owner** — proves the build is real (stateful app, live two-sided loop, AI
  API with fallback).
- **One marketplace owner** — proves the two-sided model works (provider portal, quote gating).
- **One research/data owner** — proves the decisions were evidence-based (benchmarking, seeded
  catalogue, transparent pricing).
- **One design owner** — proves the product is patient-first, not a template (design system,
  honesty cues, accessible copy).

## Contribution map (for the submission deck)

| Area | Files |
|---|---|
| Patient journey & case flow | `src/app/case`, `src/app/dashboard`, `src/app/matches`, `src/app/quotes`, `src/app/booking`, `src/app/consult`, `src/app/treatment`, `src/app/aftercare` |
| Provider side | `src/app/provider/**` |
| AI layer | `src/lib/ai.ts`, `src/app/api/ai/route.ts` |
| Marketplace bridge | `src/lib/marketplace.ts` |
| Catalogue & data | `src/data/ethaum.ts`, `src/data/seed.generated.json`, `scripts/seed.mjs` |
| Research | `src/app/market-research`, `docs/MARKET_RESEARCH.md` |
| Design system | `src/app/globals.css`, `public/ethaum-mark.svg`, `src/components/**` |
| Submission artefacts | `README.md`, `docs/**`, `DEMO_SCRIPT.md` |
