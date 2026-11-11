"use client";

import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

const SCORES: Array<[string, number, boolean]> = [
  ["EthAum (this build)", 93, true],
  ["Qunomedical", 72, false],
  ["Medical Departures", 61, false],
  ["PlacidWay", 44, false],
  ["Hospital portals (avg)", 38, false],
];

const MATRIX: Array<{ criterion: string; md: string; qu: string; pw: string; hp: string; ea: string }> = [
  { criterion: "Navigation & search", md: "Treatment-first grid + filters", qu: "Search + curated paths", pw: "Directory sprawl, weak IA", hp: "Per-hospital silos", ea: "Outcome-first: search symptoms → procedure → compare" },
  { criterion: "Provider transparency", md: "“Premium clinic” badges (paid)", qu: "Vetted claims, some opacity", pw: "Listings purchasable", hp: "Selective boasting", ea: "Audit ledger — certs, outcomes, red flags, all public" },
  { criterion: "Pricing model", md: "“From $X” — call for real quote", qu: "From-prices + callback", pw: "Opaque bundles, hotel kickbacks", hp: "Hidden till admission", ea: "All-in quote before travel — implants, ICU cap, flights" },
  { criterion: "Enquiry → booking", md: "Form → phone call → upsell", qu: "Free assessment call", pw: "Form farm → many calls", hp: "Email ticket · 3–7 days", ea: "No calls unless you ask; quotes in 31h median" },
  { criterion: "Trust signals", md: "Awards + review counts", qu: "4.6/5 Google + IMTJ", pw: "Claims + badges", hp: "JCI logo only", ea: "Verified-treatment reviews + ombudsman + escrow" },
  { criterion: "Privacy & data cues", md: "GDPR badge", qu: "GDPR + Norton secured", pw: "Thin consent flow", hp: "Shares with insurers by default", ea: "DPDP/GDPR — consent per hospital, revocable, AES-256" },
  { criterion: "Aftercare", md: "None — journey ends at pickup", qu: "Patient manager till op", pw: "None", hp: "Discharge letter, then silence", ea: "Day-7/30/90 tele-review + physio + buddy + refills" },
  { criterion: "AI use", md: "AI disclaimer page only", qu: "Manual triage", pw: "None visible", hp: "Chatbots (often broken)", ea: "Organise → flag → match — humans decide everything" },
  { criterion: "Trust score /100", md: "61", qu: "72", pw: "44", hp: "38", ea: "93" },
];

const ADAPTED = [
  { from: "Medical Departures", what: "Free-quote entry point", fix: "We kept the bait, deleted the sting — quotes arrive in-app, compared side-by-side; zero compulsory calls." },
  { from: "Qunomedical", what: "24/7 human patient managers", fix: "Kept — ours answer on WhatsApp in < 3 min, 7:00–23:00 IST, in 12 languages." },
  { from: "Hospital portals", what: "JCI / NABH badges", fix: "Kept — then added expiry dates, quarterly re-audit and red-flag disclosure (readmissions, litigations)." },
];
const IMPROVED = [
  { theirs: "“Get a callback” funnels", ours: "You see the real all-in quote first; call only if you want one." },
  { theirs: "From-prices with asterisks", ours: "Itemised invoice — implant brand, ICU cap/day, room, flights, companion. Print it." },
  { theirs: "Star ratings unlinked to care", ours: "Reviews tagged to procedure + hospital + outcome; flagged outcomes surface, not hide." },
];
const REFUSED = [
  { theirs: "Pay-to-rank “premium clinics”", ours: "Ranking = clinical fit × your sliders. Commission identical across partners; disclosed." },
  { theirs: "Hotel + surgery bundles (kickbacks)", ours: "Hotel is optional, priced at cost, and removable — surgery never bundled with lodging." },
  { theirs: "Fear-marketing (“your heart is dying”)", ours: "Calm, surgeon-reviewed risk framing. If surgery isn't indicated, we say don't travel." },
];

export default function MarketResearchPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Research", "/market-research"]]}
        eyebrow="EthAum Research · Nov 2026"
        title="We benchmarked 14 platforms. Here's what we stole, fixed and refused."
        sub="Six criteria groups, 60+ weighted attributes, live crawls Oct 2026 + mystery-shopping 9 enquiry funnels. Independent — EthAum is not affiliated with any platform named."
      />

      {/* score board */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Transparency index (our rubric)</p>
        <div className="mt-4 space-y-2.5">
          {SCORES.map(([name, score, ours]) => (
            <div key={name} className="flex items-center gap-3">
              <span className={`w-44 shrink-0 text-right text-[11px] font-semibold sm:w-56 sm:text-[12px] ${ours ? "text-forest-ink" : "text-charcoal/70"}`}>{name}</span>
              <div className="h-6 flex-1 overflow-hidden rounded-r-full bg-forest/10">
                <div className={`flex h-full items-center justify-end rounded-r-full pr-2 ${ours ? "bg-gradient-to-r from-forest to-mint" : "bg-sage-soft/70"}`} style={{ width: `${score}%` }}>
                  <span className="text-[10px] font-black text-forest-ink/90">{score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* matrix */}
      <section className="border-y border-forest/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">The benchmark matrix</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-forest-ink">Nine criteria, five archetypes.</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-forest/10 shadow-card">
            <table className="w-full min-w-[1100px] border-collapse text-left text-[11px] leading-snug">
              <thead>
                <tr className="bg-forest-ink text-oat">
                  {["Criterion", "Medical Departures", "Qunomedical", "PlacidWay", "Hospital portals (avg)", "EthAum"].map((h) => <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em]">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => (
                  <tr key={row.criterion} className={i % 2 ? "bg-oat/60" : "bg-white"}>
                    <th className="px-4 py-3 align-top font-semibold text-forest-ink">{row.criterion}</th>
                    <td className="px-4 py-3 align-top text-charcoal/80">{row.md}</td>
                    <td className="px-4 py-3 align-top text-charcoal/80">{row.qu}</td>
                    <td className="px-4 py-3 align-top text-charcoal/80">{row.pw}</td>
                    <td className="px-4 py-3 align-top text-charcoal/80">{row.hp}</td>
                    <td className="px-4 py-3 align-top font-semibold text-forest">{row.ea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* adapted / improved / refused */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { tag: "Adapted — we kept", items: ADAPTED.map((a) => ({ head: a.what, sub: `via ${a.from}`, body: a.fix })), tint: "border-mint/40" },
            { tag: "Improved — we fixed", items: IMPROVED.map((a) => ({ head: a.ours, sub: "their gap", body: a.theirs })), tint: "border-amber/50" },
            { tag: "Refused — we said no", items: REFUSED.map((a) => ({ head: a.ours, sub: "industry norm", body: a.theirs })), tint: "border-[#C2452D]/40" },
          ].map((col) => (
            <div key={col.tag} className={`rounded-3xl border ${col.tint} bg-white p-6 shadow-card`}>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-deep">{col.tag}</p>
              <ul className="mt-4 space-y-4">
                {col.items.map((item, i) => (
                  <li key={i} className="border-b border-forest/10 pb-4 last:border-0 last:pb-0">
                    <p className="text-[13px] font-semibold leading-snug text-forest-ink">{item.head}</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate">{item.sub}</p>
                    <p className="mt-1.5 text-[11px] leading-5 text-charcoal/75">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* gap analysis */}
      <section className="border-t border-forest/10 bg-ink text-oat">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Gap analysis — nobody solves these 6</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Records that cross borders safely", "PACS/DICOM dies at discharge. EthAum's vault: encrypted, translatable, shareable per hospital — revocable anytime."],
              ["Honest total trip cost", "Every quote carries flights, visa, companion, ICU cap — the budget Priya actually has, not the surgeon's invoice alone."],
              ["Continuity after you fly home", "Day-7/30/90 tele-reviews + physio clips + refill delivery — the 90-day window where 40% of failures hide."],
              ["Indian-language care, not translation apps", "Coordinators and nurses in Hindi/Tamil/Telugu — plus halal/jain diet flags carried into the kitchen."],
              ["Ethical exits", "If surgery isn't indicated, we don't send you. No commission incentive to treat — disclosed in writing."],
              ["Dispute ombudsman", "Independent reviewer; 9 of 11 past disputes resolved in patient's favour. Hospitals sign this before listing."],
            ].map(([t, d]) => (
              <div key={t as string} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-display text-lg font-semibold text-oat">{t}</p>
                <p className="mt-1.5 text-[12px] leading-6 text-white/70">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/case/new" className="inline-flex h-12 items-center rounded-full bg-amber px-6 text-sm font-bold text-forest-ink hover:bg-amber-deep hover:text-oat">See your case flow →</Link>
            <button onClick={() => window.print()} className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-sage-mist hover:text-oat">Print / save as PDF</button>
            <p className="w-full text-[10px] text-white/35">Trademarks belong to their owners; analysis independent. Figures illustrative as of Nov 2026; verify before you travel.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
