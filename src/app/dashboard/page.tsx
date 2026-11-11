"use client";

import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { STAGES, NOTIFICATIONS } from "@/data/ethaum";
import { useCase, deriveStages, caseProgress, caseStatusLine } from "@/lib/case-store";
import { useSession } from "@/lib/session";

const stateIcon = (s: (typeof STAGES)[number]["state"], n: number) => {
  if (s === "done")
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-forest-ink">
        <svg viewBox="0 0 14 14" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.4 7.3 5.6 10.3 11.6 3.6" /></svg>
      </span>
    );
  if (s === "active")
    return (
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amber text-forest-ink">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber/40" aria-hidden />
        <span className="relative font-display text-sm font-bold">{n}</span>
      </span>
    );
  return <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/15 bg-white text-[13px] font-bold text-slate">·</span>;
};

export default function DashboardPage() {
  const c = useCase();
  const session = useSession();
  const stages = deriveStages(c);
  const { done: doneCount, total: stageTotal, pct } = caseProgress(c);
  const firstName = session?.name.split(" ")[0] ?? "Priya";
  const active = stages.find((s) => s.state === "active");

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"]]}
        eyebrow={c ? `Case ${c.id} · ${c.treatmentName}` : "No active case yet"}
        title={c ? `Welcome back, ${firstName}.` : "Your journey, one step at a time."}
        sub={c ? caseStatusLine(c) : "Start with your condition — we take it from records to recovery."}
      />

      {/* progress band */}
      <div className="border-b border-forest/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#E9EFE9" strokeWidth="6" />
                <circle cx="28" cy="28" r="22" fill="none" stroke="#00C9A7" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 138.2} 138.2`} />
              </svg>
              <span className="absolute font-display text-xs font-bold text-forest-ink">{pct}%</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-ink">Journey progress</p>
              <p className="text-[11px] text-slate">{doneCount} of {stageTotal} stages cleared{c?.tokenPaid ? " · admission 12 Nov" : " · live from your case file"}</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link href="/notifications" className="inline-flex h-9 items-center gap-2 rounded-full border border-forest/15 px-4 text-[11px] font-semibold text-forest hover:bg-sage-wash">3 unread updates</Link>
            {c?.tokenPaid ? (
              <Link href="/aftercare" className="inline-flex h-9 items-center rounded-full bg-forest px-4 text-[11px] font-bold text-oat hover:bg-forest-deep">Open aftercare plan →</Link>
            ) : (
              <Link href={c?.quoteLocked ? "/booking" : "/matches"} className="inline-flex h-9 items-center rounded-full bg-forest px-4 text-[11px] font-bold text-oat hover:bg-forest-deep">
                {c?.quoteLocked ? "Finish booking — token ₹9,999" : "Get my matches →"}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12">
        {/* timeline */}
        <ol className="lg:col-span-7">
          {stages.map((s, i) => (
            <li key={s.n} className="relative flex gap-4 pb-5">
              {i < stages.length - 1 && <span className={`absolute left-4 top-8 h-full w-px ${s.state === "done" ? "bg-mint/60" : "bg-forest/10"}`} aria-hidden />}
              <div className="relative z-10 shrink-0">{stateIcon(s.state, s.n)}</div>
              <div className={`min-w-0 flex-1 rounded-2xl border p-4 transition-colors ${s.state === "active" ? "border-amber/50 bg-amber-wash/40" : "border-forest/10 bg-white"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className={`text-[13px] font-bold ${s.state === "upcoming" ? "text-slate" : "text-forest-ink"}`}>
                    <span className="mr-2 font-display text-sage-mist">{String(s.n).padStart(2, "0")}</span>
                    {s.name}
                  </p>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.16em] ${s.state === "done" ? "text-mint-deep" : s.state === "active" ? "text-amber-deep" : "text-slate"}`}>{s.state === "done" ? "Cleared" : s.state === "active" ? "In motion" : "Upcoming"}</span>
                </div>
                <p className={`mt-1 text-[12px] leading-5 ${s.state === "upcoming" ? "text-slate" : "text-charcoal/85"}`}>{s.hint}</p>
                {s.n === 10 && (
                  <Link href="/treatment" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-forest hover:underline">
                    Open the hospital-day plan →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* right rail */}
        <aside className="space-y-4 lg:col-span-5">
          {/* active stage detail */}
          <section className="rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Now — {active?.name ?? "start your case"}</p>
            <p className="mt-1 text-[13px] leading-5 text-white/70">{active?.hint ?? "Tell us your condition and we will match, quote and travel-manage the rest."}</p>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-6 text-white/85">
              {[
                ["Treatment", c?.treatmentName ?? "—"],
                ["Budget ceiling", c ? `₹${c.budget}L all-in` : "—"],
                ["Companions", c ? (c.companions === 0 ? "Travelling solo" : `${c.companions} companion${c.companions > 1 ? "s" : ""}`) : "—"],
                ["Care languages", c?.languages.join(" · ") ?? "—"],
                ["Pre-screen", c?.readiness !== null && c?.readiness !== undefined ? `${c.readiness}/100 · ${c.qualification ?? "pending"}` : "not done yet"],
                ["Provider held", c?.matchedName ?? "—"],
                ["Quote", c?.quoteTotal ? `${c.quoteHospital} · ₹${(c.quoteTotal / 100000).toFixed(1)}L` : "—"],
                ["Token", c?.tokenPaid ? "Paid ✓" : "₹9,999 · refundable 48h"],
              ].map(([k, v]) => (
                <li key={k as string} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5"><span className="text-white/50">{k}</span><span className="text-right font-medium">{v}</span></li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <Link href={c?.tokenPaid ? "/aftercare" : c?.quoteLocked ? "/booking" : "/matches"} className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-mint text-[13px] font-bold text-forest-ink hover:bg-[#2be3bc]">
                {c?.tokenPaid ? "Aftercare plan" : c?.quoteLocked ? "Complete booking" : "See my matches"}
              </Link>
              <Link href="/consult" className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-white/15 text-[13px] font-semibold text-sage-mist hover:text-oat">Pre-op call · Tue 9:30</Link>
            </div>
          </section>

          {/* documents */}
          <section className="rounded-3xl border border-forest/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Records vault</p>
              <Link href="/case/new" className="text-[11px] font-semibold text-forest hover:underline">+ add</Link>
            </div>
            <ul className="mt-3 divide-y divide-forest/10 text-[12px]">
              {[["Angiogram.pdf", "Imaging", "AI ✓"], ["Lipid_profile_Oct.pdf", "Lab", "AI ✓"], ["Prescription_metformin.pdf", "Prescription", "AI ✓"], ["Discharge_2019_MI.pdf", "Discharge", "AI ✓"], ["Creatinine_Oct26.pdf", "Lab", "AI ✓ · flagged 1.1"]].map(([n, k, s]) => (
                <li key={n} className="flex items-center gap-3 py-2.5">
                  <svg viewBox="0 0 18 18" className="h-4 w-4 shrink-0 text-slate" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M4 2h7l4 4v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 16Z" /><path d="M11 2v5h4" /></svg>
                  <span className="min-w-0 flex-1 truncate font-medium text-charcoal">{n}</span>
                  <span className="rounded-full bg-sage-wash px-2 py-0.5 text-[9px] font-bold uppercase text-forest">{k}</span>
                  <span className="text-[10px] text-slate">{s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-slate">Encrypted · shared only with Bumrungrad (approved 31 Oct) · revoke anytime</p>
          </section>

          {/* doctor brief */}
          <section className="rounded-3xl border border-amber/40 bg-amber-wash/60 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">For the doctor who stays behind</p>
            <p className="mt-2 text-[12px] leading-6 text-charcoal/85">One page with your diagnosis, key reports, medication changes and the questions you&apos;ll ask the surgeon — print it for your local cardiologist before you fly.</p>
            <Link href="/doctor-summary" className="mt-3 inline-flex h-10 items-center rounded-full bg-forest px-4 text-[12px] font-bold text-oat hover:bg-forest-deep">Open clinical summary →</Link>
          </section>

          {/* latest updates */}
          <section className="rounded-3xl border border-forest/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Latest</p><Link href="/notifications" className="text-[11px] font-semibold text-forest hover:underline">all →</Link></div>
            <ul className="mt-3 space-y-3">
              {NOTIFICATIONS.slice(0, 3).map((n) => (
                <li key={n.id} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span>
                    <span className="block text-[12px] font-semibold leading-snug text-forest-ink">{n.t}</span>
                    <span className="mt-0.5 block text-[10px] text-slate">{n.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
