"use client";

import { useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { useCase, updateCase } from "@/lib/case-store";

type Match = {
  id: string;
  rank: number;
  hospital: string;
  city: string;
  score: number;
  badge: string;
  why: string[];
  flags: string[];
  price: string;
  wait: string;
};

const MATCHES: Match[] = [
  { id: "bumrungrad", rank: 1, hospital: "Bumrungrad International", city: "Bangkok, Thailand", score: 94, badge: "Best value for your priorities", why: ["Fits ₹12L ceiling with ₹1.2L headroom", "ICU bed confirmed in 6 days — fastest of the three", "Hindi-speaking cardiothoracic team (Dr. Meera Krishnan)", "4.9★ · 1,240 verified CABG reviews", "90-day complication cover — visa letter in 48h"], flags: ["7h flight — advise senior cardiac clearance for air travel", "Companion hotel ₹8,000/night beyond day 6 (negotiable)"], price: "₹10.8L", wait: "6 days" },
  { id: "apollo", rank: 2, hospital: "Apollo Hospitals, Greams Road", city: "Chennai, India", score: 91, badge: "Zero-travel comfort", why: ["No international travel — same city network, Tamil & Hindi", "Highest CABG volume in South India (2,300+/yr)", "GST-free cashless desk · insurance paperwork handled", "4.9★ · 2,140 verified reviews", "Meena (companion) has family in Adyar — stay arranged"], flags: ["Private-room demand high — book within 72h to hold price", "₹11.2L all-in — ₹0.4L above Bumrungrad"], price: "₹11.2L", wait: "9 days" },
  { id: "memorial", rank: 3, hospital: "Memorial Şişli", city: "Istanbul, Turkey", score: 88, badge: "Lowest cash price", why: ["₹9.6L all-in — ₹2.6L under your ceiling", "JCI since 2005 · marrow + cardiac flagship", "Direct flight DEL–IST · 7h · from ₹18,400"], flags: ["Turkish/Arabic team — interpreter arranged but not fluent Hindi", "Flight costlier — net saving vs Apollo only ₹1.6L"], price: "₹9.6L", wait: "12 days" },
];

const SORTS = [
  { key: "priority", label: "Your priorities" },
  { key: "cost", label: "Cheapest first" },
  { key: "speed", label: "Fastest ICU" },
  { key: "outcomes", label: "Best outcomes" },
] as const;

export default function MatchesPage() {
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("priority");
  const c = useCase();
  const holding = c?.matchedSlug ?? null;

  const ordered = [...MATCHES].sort((a, b) => {
    if (sort === "cost") return parseFloat(a.price.replace(/[₹L]/g, "")) - parseFloat(b.price.replace(/[₹L]/g, ""));
    if (sort === "speed") return parseInt(a.wait) - parseInt(b.wait);
    if (sort === "outcomes") return b.score - a.score;
    return a.rank - b.rank;
  });

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"], ["Matches", "/matches"]]}
        eyebrow="AI-matched · surgeon-approved"
        title="Three hospitals fit Priya's heart."
        sub="Ranked by your priorities (capacity to pay 60 · outcomes 90 · speed 50). The AI reorders — your surgeon still decides whether surgery is indicated."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Reorder by</span>
          {SORTS.map((s) => (
            <button key={s.key} onClick={() => setSort(s.key)} aria-pressed={sort === s.key} className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-colors ${sort === s.key ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"}`}>{s.label}</button>
          ))}
          <span className="ml-auto text-[10.5px] text-slate">Matched 31 Oct · quotes locked 30 days</span>
        </div>

        {c ? (
          <p className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-mint/30 bg-mint-wash px-4 py-3 text-[12px] text-mint-deep">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Matching your live case</span>
            <span className="font-semibold text-forest-ink">{c.treatmentName}</span>
            <span className="text-charcoal/40">·</span>
            <span className="text-charcoal">budget ₹{c.budget}L</span>
            <span className="text-charcoal/40">·</span>
            <span className="text-charcoal">cost {c.priorities.cost} / outcomes {c.priorities.quality} / speed {c.priorities.speed}</span>
            <span className="text-charcoal/40">·</span>
            <span className="text-charcoal">{c.languages.join(" · ")}</span>
          </p>
        ) : (
          <p className="mt-4 rounded-2xl border border-amber/40 bg-amber-wash px-4 py-3 text-[12px] text-charcoal">
            You are seeing the generic ranking. <Link href="/case/new" className="font-bold text-forest underline">Create your case</Link> and we will re-rank these hospitals around your budget, priorities and language.
          </p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {ordered.map((m) => (
            <article key={m.id} className={`flex flex-col rounded-3xl border p-5 shadow-card transition-all ${holding === m.id ? "border-mint/60 bg-mint-wash/40" : "border-forest/10 bg-white"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-deep">{m.badge}</p>
                  <h2 className="mt-1.5 font-display text-xl font-semibold leading-snug text-forest-ink">{m.hospital}</h2>
                  <p className="mt-0.5 text-[11px] text-slate">{m.city}</p>
                </div>
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-forest-ink">
                  <span className="font-display text-2xl font-bold text-mint leading-none">{m.score}</span>
                  <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-sage-soft">match</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-oat p-3 text-center">
                <div><p className="text-[9px] font-bold uppercase tracking-widest text-slate">All-in</p><p className="font-display text-lg font-semibold text-forest-ink">{m.price}</p></div>
                <div><p className="text-[9px] font-bold uppercase tracking-widest text-slate">ICU in</p><p className="font-display text-lg font-semibold text-forest-ink">{m.wait}</p></div>
              </div>

              <ul className="mt-4 space-y-1.5 text-[12px] leading-snug text-charcoal">
                {m.why.map((w) => <li key={w} className="flex items-start gap-2"><svg viewBox="0 0 12 12" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6.2 4.8 9 10 3.2" /></svg>{w}</li>)}
              </ul>
              <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-amber-deep">
                {m.flags.map((f) => <li key={f} className="flex items-start gap-2"><span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-amber/70 text-[8px] font-black">!</span>{f}</li>)}
              </ul>

              <div className="mt-auto flex gap-2 pt-5">
                <button
                  onClick={() => updateCase({ matchedSlug: m.id, matchedName: m.hospital, matchedScore: m.score })}
                  aria-pressed={holding === m.id}
                  className={`h-11 flex-1 rounded-full text-[12px] font-bold transition-all ${holding === m.id ? "bg-mint text-forest-ink" : "bg-forest text-oat hover:bg-forest-deep"}`}
                >
                  {holding === m.id ? "✓ Held — quote locked" : "Hold this pick"}                </button>
                <Link href="/quotes/compare" className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/20 text-forest hover:bg-sage-wash" aria-label="Compare quotes">
                  <svg viewBox="0 0 18 18" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h12M3 9h12M3 13h12" /></svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-5 text-slate">Match scores blend clinical fit (35), accreditation (15), budget fit (20), wait time (15), language (10), reviews (5) — re-weighted by your sliders in the case wizard. EthAum never ranks by commission; commission is disclosed and identical across partners.</p>
      </div>
      <SiteFooter />
    </div>
  );
}
