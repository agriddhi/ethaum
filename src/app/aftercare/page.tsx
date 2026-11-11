"use client";

import { useState } from "react";
import Link from "next/link";
import DemoChat from "@/components/demo-chat";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { useCase, updateCase } from "@/lib/case-store";

const MEDS = [
  { name: "Aspirin 75mg", dose: "Morning · lifelong", left: 60, refill: true },
  { name: "Clopidogrel 75mg", dose: "Morning × 12 months", left: 28, refill: false },
  { name: "Pantoprazole 40mg", dose: "Before breakfast × 4 weeks", left: 42, refill: false },
  { name: "Atorvastatin 40mg", dose: "Night · lifelong", left: 60, refill: false },
];

const PLAN = [
  { day: "Day 7", title: "Wound + suture check", items: ["ECG + troponin (if symptomatic)", "Dressing change — diabetes protocol", "Physio: dangle → indoor walk, ankle + shoulder circles", "Meds reconciliation — clopidogrel adherence check"], done: 4, total: 4 },
  { day: "Day 30", title: "Cardiac rehab review", items: ["Echo + HbA1c + lipid panel", "6-minute walk test (baseline)", "Gradual return to desk work — 4h sessions", "No lifting > 5kg till day 42"], done: 2, total: 4 },
  { day: "Day 90", title: "Full recovery audit", items: ["Stress test (treadmill) if symptomatic", "Psychological screen — post-op blues is common (1 in 5)", "Driving + sexual activity clearance", "Long-term plan: statins, BP, weight, walking 30 min"], done: 0, total: 4 },
];

export default function AftercarePage() {
  const [meds, setMeds] = useState(MEDS.map((m) => m.refill === false));
  const c = useCase();
  const toggle = (i: number) => setMeds((cur) => cur.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"], ["Aftercare", "/aftercare"]]}
        eyebrow="Day 30 · Bumrungrad → home"
        title="The surgery went well. The recovery is the job."
        sub="Your follow-ups, medicines and physio — scheduled, reminded and tracked from your sofa in Chennai. A human checks in at every milestone."
      />

      {c && !c.tokenPaid && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <p className="rounded-2xl border border-amber/40 bg-amber-wash px-5 py-4 text-[13px] text-charcoal">
            <span className="font-bold text-amber-deep">Preview mode:</span> this recovery plan unlocks for your own case once booking is confirmed.{" "}
            <Link href="/booking" className="font-bold text-forest underline">Confirm booking →</Link>
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12">
        {/* plan timeline */}
        <div className="lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest-ink">Your recovery plan{c ? ` · ${c.treatmentName}` : ""}</p>
            <div className="flex gap-2">
              <button onClick={() => updateCase({ aftercareStarted: true })} className="inline-flex h-9 items-center rounded-full bg-forest px-4 text-[11px] font-bold text-oat hover:bg-forest-deep">
                {c?.aftercareStarted ? "✓ Day-7 check-in started" : "Start my Day-7 check-in"}
              </button>
              <button onClick={() => window.print()} className="inline-flex h-9 items-center rounded-full border border-forest/20 px-4 text-[11px] font-bold text-forest hover:bg-sage-wash">Print plan</button>
            </div>
          </div>
          <div className="space-y-4">
            {PLAN.map((p) => (
              <section key={p.day} className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-wash font-display text-xs font-bold text-forest">{p.day}</span>
                    <h2 className="font-display text-lg font-semibold text-forest-ink">{p.title}</h2>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${p.done === p.total ? "text-mint-deep" : "text-amber-deep"}`}>{p.done === p.total ? "Complete ✓" : `${p.done}/${p.total} done`}</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-forest/10"><div className="h-full rounded-full bg-gradient-to-r from-forest to-mint-deep transition-all duration-700" style={{ width: `${(p.done / p.total) * 100}%` }} /></div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {p.items.map((i) => <li key={i} className="rounded-xl bg-oat px-3 py-2 text-[11.5px] leading-snug text-charcoal">▸ {i}</li>)}
                </ul>
              </section>
            ))}
          </div>

          {/* red flags */}
          <section className="mt-6 rounded-3xl border-2 border-[#C2452D]/40 bg-[#FBEFED] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83B26]">Call us immediately &mdash; don&apos;t wait for the day-30 review if&hellip;</p>
            <ul className="mt-3 grid gap-2 text-[13px] font-medium text-[#6E2412] sm:grid-cols-2">
              {["Chest pain or pressure > 5 min", "Fever > 38°C or wound redness/pus", "Shortness of breath at rest", "Sudden leg swelling or calf pain"].map((t) => <li key={t}>▪ {t}</li>)}
            </ul>
            <DemoChat label="Open the 24×7 concierge line" variant="light" className="mt-4" />
          </section>
        </div>

        {/* meds + buddy */}
        <aside className="space-y-4 lg:col-span-5">
          <section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-3"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Medicines · auto-reminders</p><span className="text-[10px] font-semibold text-forest">refill all →</span></div>
            <ul className="mt-3 divide-y divide-forest/10">
              {MEDS.map((m, i) => (
                <li key={m.name} className="flex items-center gap-3 py-3">
                  <button role="switch" aria-checked={meds[i]} aria-label={`Reminder for ${m.name}`} onClick={() => toggle(i)} className={`h-6 w-11 shrink-0 rounded-full transition-colors ${meds[i] ? "bg-mint" : "bg-forest/15"}`}><span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform ${meds[i] ? "translate-x-[22px]" : ""}`} /></button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-forest-ink">{m.name}</p>
                    <p className="text-[10.5px] text-slate">{m.dose} · {m.left} left</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-slate">Delivered to Chennai with your discharge kit · 3-day buffer before stockouts.</p>
          </section>

          <section className="rounded-3xl bg-forest-ink p-6 text-oat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Your recovery buddy</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber font-display text-xl font-bold text-forest-ink">AN</span>
              <div><p className="font-semibold">Anita — EthAum Care</p><p className="text-[11px] text-white/55">Cardiac nurse · EN · HI · Tam <br />Calls day 3, 7, 14, 30, 90</p></div>
            </div>
            <p className="mt-4 text-[13px] leading-6 text-white/75">“Anything off — a twinge, a doubt, a silly question — ping me first. I answer at 7 am and 9 pm. For true emergencies, always the red numbers.”</p>
            <DemoChat label="Message Anita (demo concierge)" className="mt-4" />
            <Link href="/care-buddies" className="mt-3 flex items-center justify-between rounded-2xl border border-forest/15 bg-white/5 px-4 py-3 text-[12px] transition-colors hover:bg-white/10">
              <span>
                <span className="block font-semibold text-oat">Want company on the trip?</span>
                <span className="block text-[11px] text-white/55">Verified patient companions who have made the same journey</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber">→</span>
            </Link>
          </section>

          <Link href="/reviews" className="block rounded-3xl border border-amber/40 bg-amber-wash/60 px-6 py-5 text-[13px] leading-6 text-charcoal hover:bg-amber-wash"><span className="font-bold text-amber-deep">Feeling better?</span> Tell your story &mdash; verified reviews help the next patient decide, and we&apos;ll credit your account ₹5,000.</Link>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
