"use client";

import { useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { useCase, updateCase } from "@/lib/case-store";

export default function BookingPage() {
  const [emi, setEmi] = useState(6);
  const [paid, setPaid] = useState(false);
  const c = useCase();
  const remaining = c?.quoteTotal ? c.quoteTotal - 9999 : 1070000;
  const monthly = Math.round((remaining * 1.06) / emi / 100) / 100; // 6% flat, demo
  const hospital = c?.quoteHospital ?? "Bumrungrad Intl, Bangkok";

  if (paid) {
    return (
      <div className="bg-oat">
        <SiteNav />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-wash">
            <svg viewBox="0 0 28 28" className="h-8 w-8 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15.5 11.5 22 23 8" /></svg>
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-forest-ink">Booking confirmed — see you in Bangkok.</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-charcoal/85">Token ₹9,999 received · booking ref <span className="font-semibold">BK-2411-0718</span> for <span className="font-semibold">{hospital}</span>. Your e-visa packet, hotel voucher and pickup card are in the app inbox — and in the concierge chat, in Hindi if you prefer.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full bg-forest px-6 text-sm font-bold text-oat hover:bg-forest-deep">Open journey tracker</Link>
            <Link href="/consult" className="inline-flex h-12 items-center rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">Pre-op call · Tue 9:30 IST</Link>
          </div>
          <p className="mt-6 text-[10.5px] text-slate">Balance ₹10.7L payable at admission (card / UPI / wire). 48h free cancellation on the token.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"], ["Booking", "/booking"]]}
        eyebrow="Final step — token ₹9,999"
        title="Your Bangkok itinerary, locked."
        sub="Review every line, then confirm with a refundable token. Balance payable at the hospital — no prepayment of surgery fees."
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12">
        {/* itinerary */}
        <ol className="lg:col-span-7">
          {[
            ["Done", `Quote held — ${hospital} · ${c?.treatmentName ?? "CABG"} · ${c?.quoteTotal ? `₹${(c.quoteTotal / 100000).toFixed(1)}L` : "₹10.8L"} all-in (30-day lock)`],
            ["Done", "Visa letter ID-BKK-2411-00981 — printed 2× for check-in"],
            ["Held", "Flights DEL → BKK · 11 Nov · 06:05 · ₹19,600 · refundable in 48h"],
            ["Held", "Hotel Eastin Grand Sathorn · 6 nights · companion + breakfast · ₹48,000"],
            ["12 Nov 07:30", "Airport pickup → Bumrungrad · Central registration (passport + reports)"],
            ["12 Nov 10:00", "Pre-op panel — echo, HbA1c, creatinine, anaesthesia review"],
            ["13 Nov 07:00", "CABG — Dr. Meera Krishnan (off-pump planned)"],
            ["Day 2–8", "ICU 2d → room · Hindi-speaking nurses · Meena stays in-room"],
            ["Day 10–14", "Fit-to-fly · tele-check at day 30/90 after you land back home"],
          ].map(([when, what], i) => (
            <li key={i} className="relative flex gap-4 pb-4">
              {i < 8 && <span className="absolute left-[13px] top-7 h-full w-px bg-forest/15" aria-hidden />}
              <span className={`relative z-10 mt-1 flex h-7 w-14 shrink-0 items-center justify-center rounded-full text-[9px] font-black uppercase tracking-wide ${when === "Done" ? "bg-mint text-forest-ink" : "border border-amber/60 bg-amber-wash text-amber-deep"}`}>{when}</span>
              <p className="pt-1 text-[13px] leading-6 text-charcoal">{what}</p>
            </li>
          ))}
        </ol>

        {/* payment rail */}
        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Payable now</p>
            <p className="mt-1 font-display text-5xl font-semibold">₹9,999</p>
            <p className="mt-1 text-[11px] text-white/55">Refundable for 48h · covers token + visa packet + insurance pre-auth for trip medical cover (₹5L limit)</p>

            <div className="mt-5 rounded-2xl border border-white/10 p-4">
              <div className="flex items-baseline justify-between"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage-mist">Balance — EMI planner</p><span className="text-[10px] text-white/40">6% flat · demo</span></div>
              <div className="mt-2 flex items-center gap-3">
                <input type="range" min={3} max={24} value={emi} onChange={(e) => setEmi(Number(e.target.value))} className="flex-1 accent-[#E6A15C]" aria-label="EMI months" />
                <span className="w-16 text-right font-display text-xl text-amber">{emi} mo</span>
              </div>
              <p className="mt-2 text-[13px] text-white/80">≈ <span className="font-semibold text-oat">₹{(monthly / 100000).toFixed(2)}L</span>/month for {emi} months · or pay ₹10.7L at admission (0% if card)</p>
            </div>

            <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); updateCase({ tokenPaid: true }); setPaid(true); }}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-sage-mist" htmlFor="pp">Passport</label><input id="pp" required placeholder="M••••••2" defaultValue="M••••••2" className="mt-1 h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none placeholder:text-white/30" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-sage-mist" htmlFor="card">Card (test)</label><input id="card" inputMode="numeric" placeholder="4111 1111 1111 1111" defaultValue="4111 1111 1111 1111" className="mt-1 h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm tabular-nums outline-none placeholder:text-white/30" /></div>
              </div>
              <label className="flex items-start gap-3 text-[11px] leading-5 text-white/70"><input type="checkbox" required defaultChecked className="mt-0.5 h-4 w-4 accent-[#00C9A7]" />I consent to share my records with {hospital} and authorise EthAum + insurer to process them for this admission. I understand EthAum is a facilitator, not the treating hospital.</label>
              <button type="submit" className="h-13 flex h-14 w-full items-center justify-center rounded-2xl bg-amber text-base font-bold text-forest-ink transition-all hover:bg-amber-deep hover:text-oat">Pay ₹9,999 — confirm booking</button>
            </form>
            <p className="mt-3 text-center text-[9.5px] uppercase tracking-[0.2em] text-white/35">Razorpay test mode · PCI-DSS · we never see your card</p>
          </div>
          <p className="mt-4 rounded-2xl border border-forest/10 bg-white px-5 py-4 text-[12px] leading-6 text-charcoal/80"><span className="font-bold text-forest-ink">Trust:</span> EthAum escrow holds your token — released to the hospital only when you check in. 48h cooling period, full refund, no questions.</p>
          <button onClick={() => window.print()} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-forest/20 px-4 text-[12px] font-bold text-forest hover:bg-sage-wash">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4.5 6V2.5h7V6M4.5 12H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.5M4.5 10h7v3.5h-7z" /></svg>
            Print itinerary
          </button>
          <Link href="/care-buddies" className="mt-3 flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-[12px] transition-colors hover:bg-white/10">
            <span>
              <span className="block font-semibold text-oat">Travelling with a companion?</span>
              <span className="block text-[11px] text-white/55">Pair your companion with a verified patient who has done this route</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber">→</span>
          </Link>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
