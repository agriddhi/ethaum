# Submission checklist

| Required item | What to submit | Where it lives | Status |
|---|---|---|---|
| **Video demo (≤ 5 min)** | Screen recording + voiceover, captions on, end card with team + LinkedIn | Script & shot list: `docs/DEMO_VIDEO_SCRIPT.md` (also `DEMO_SCRIPT.md`) | ⬜ Record it — script ready |
| **Source code** | The whole repository (GitHub / zip) | Repository root `ethaum/` — run `npm install && npm run dev` | ✅ Ready to push |
| **Tools / tech used** | Written list with rationale | `docs/TECH_STACK.md` (also summarised in `README.md`) | ✅ Written |
| **Team LinkedIn profiles** | Names, roles and profile URLs | `docs/TEAM.md` — replace the placeholder rows | ⬜ **Needs your names + URLs** |
| **Market research & benchmarking** | Documented study: what we observed, what we adapt / improve / avoid | `docs/MARKET_RESEARCH.md` + interactive `/market-research` page (printable) | ✅ Written |
| **Bonus artefacts** | Care-buddy marketplace, printable clinical brief for the local doctor, seeded catalogue (132/18/30), printable quote sheet + itinerary + recovery plan | `/care-buddies`, `/doctor-summary`, `scripts/seed.mjs` | ✅ Built |

## Before you submit

1. **Fill in `docs/TEAM.md`** — real names, roles and LinkedIn URLs (5 minutes).
2. **Record the video** using `docs/DEMO_VIDEO_SCRIPT.md`. Use the in-app "▶ Play the 60-sec
   demo" button as a safety net.
3. **Optional live-AI upgrade:** copy `.env.local.example` → `.env.local`, add a Gemini key, so the
   qualification note reads "Gemini (live)" on camera.
4. **Push the repo**: `git add -A && git commit -m "EthAum MVP — marketplace, AI layer, research"`,
   then push to your team repo (or zip the folder minus `node_modules` and `.next`).
5. **Deploy for judges** (optional but recommended): `npx vercel --prod` → live URL in the video
   description.

## What to say if they ask "does this really work?"

- The session, case and marketplace stores are real application state — they persist across
  pages, across reloads and across two browser tabs, and every screen derives from them.
- The AI endpoint is a real route with a real provider integration and a deterministic fallback;
  `source: "rules" | "llm"` is surfaced in the UI so nothing is faked.
- The partner portal and the patient side share one contract — send a quote in one tab, decide
  in the other.
- There is no database because a hackathon demo should be reproducible in one command; the store
  contracts are API-shaped (see `docs/ARCHITECTURE.md`).
- Everything that is illustrative is labelled: the data, the prices, the doctors, the reviews.

## Known limitations to state up front (honesty is a feature)

- Hospital prices, reviews and outcome figures in the demo are **illustrative**; only the eight
  audited institutions carry real public accreditation data, and synthetic catalogue entries are
  explicitly flagged as demo index records.
- Payments run in **test mode**; no money moves and no card data is stored.
- **No phone numbers anywhere** — every contact CTA opens an in-app concierge chat, because a
  demo must never ring a stranger. In production these become hospital and coordinator lines.
- EthAum **coordinates care, it does not provide it**; every clinical decision stays with the
  accredited hospital and the patient's own doctor.
