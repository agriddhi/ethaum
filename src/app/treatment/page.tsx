import Link from "next/link";
import DemoChat from "@/components/demo-chat";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = { title: "Your hospital stay, day by day · EthAum" };

const DAYS = [
  { d: "Day 0", t: "Arrival & registration", time: "07:30 · 10:00", who: "Coordinator Anita + admissions desk", items: ["Airport pickup, hospital escort, no billing desk maze", "Passport + visa + 14 reports handed over once, copied digitally", "Pre-op panel: echo, ECG, HbA1c, creatinine, blood cross-match", "Meet the anaesthetist — questions in Hindi, English or Tamil"], tone: "forest" },
  { d: "Day 1", t: "Surgery — off-pump CABG", time: "07:00 · 13:00", who: "Dr. Meera Krishnan + team of 6", items: ["3 grafts planned: LIMA + SVG ×2 (brands on your consent copy)", "Family gets a scheduled update at 11:00 and 13:30 — from Anita, not the ward desk", "ICU 2 nights with a Hindi-speaking nurse assigned to you"], tone: "amber" },
  { d: "Day 2–3", t: "ICU → step-down ward", time: "Rounds 09:00 & 16:00", who: "Cardiac team + physio", items: ["Extubation morning of day 2 if stable", "Physio starts day 2 — 6 breaths, ankle pumps, 40m walk with frame", "Chest X-ray + drain removal day 3"], tone: "mint" },
  { d: "Day 4–8", t: "Recovery ward", time: "Meals 08:00 / 13:00 / 19:00", who: "Ward team + Anita (daily 10:00 call)", items: ["Jain/vegetarian meals confirmed in your file from day 0", "Cardiac rehab session 1 & 2 with a video you can repeat at home", "Wound check + suture plan; steri-strips reviewed day 6"], tone: "forest" },
  { d: "Day 8–9", t: "Discharge & fit-to-fly", time: "10:00 discharge", who: "Surgeon + EthAum coordinator", items: ["Discharge summary + all imaging on a USB + your EthAum vault", "Fit-to-fly certificate only if surgeon signs — we don't rush you", "Hotel + airport transfer booked; companion's room extended"], tone: "mint" },
  { d: "Day 10", t: "Fly home", time: "15:40 departure", who: "Anita on WhatsApp until wheels-up", items: ["VTE prevention: walk every 2h on the flight, hydrate, wear the provided stockings", "Medicines in carry-on (not checked) with a written schedule", "Home arrival: blood thinner injection teaching + day-30 review booked"], tone: "amber" },
];

const TONES: Record<string, string> = {
  forest: "border-forest/20 bg-white",
  amber: "border-amber/40 bg-amber-wash/40",
  mint: "border-mint/40 bg-mint-wash/50",
};

export default function TreatmentPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"], ["Treatment", "/treatment"]]}
        eyebrow="12–14 Nov · Bumrungrad, Bangkok"
        title="Inside the hospital — day by day."
        sub="Nobody wants surprises at 3am in a foreign hospital. Here is exactly what each day looks like, who owns it, and what your family hears from us."
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ol className="space-y-3">
            {DAYS.map((day) => (
              <li key={day.d} className={`rounded-3xl border p-5 shadow-card ${TONES[day.tone]}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-forest-ink px-3 py-1.5 font-display text-[12px] font-bold text-oat">{day.d}</span>
                    <h2 className="font-display text-lg font-semibold text-forest-ink">{day.t}</h2>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate">{day.time}</p>
                </div>
                <p className="mt-1 text-[11px] text-slate">Owner: {day.who}</p>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {day.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] leading-snug text-charcoal/85">
                      <svg viewBox="0 0 12 12" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 6.2 4.8 9 10 3.2" /></svg>
                      {i}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <aside className="space-y-4 lg:col-span-5">
          <section className="rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Your people</p>
            <ul className="mt-4 space-y-3 text-[13px]">
              {[
                ["Dr. Meera Krishnan", "Lead surgeon — 2,300+ bypasses", "MK"],
                ["Dr. Anong Chai", "Anaesthetist — Hindi-speaking, 1,900 cases", "AC"],
                ["Anita (EthAum)", "Your coordinator — calls 10:00 IST daily", "AN"],
                ["Meena", "Your companion — room-sharing, family visa ready", "ME"],
              ].map(([name, role, ini]) => (
                <li key={name} className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber font-display text-xs font-bold text-forest-ink">{ini}</span>
                  <span><span className="block font-semibold">{name}</span><span className="block text-[11px] text-white/55">{role}</span></span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-5 text-white/50">Any of them is one WhatsApp away — EthAum numbers, not the hospital switchboard.</p>
          </section>

          <section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Money so far</p>
            <ul className="mt-3 space-y-2 text-[12px]">
              {[["Token paid to EthAum", "₹9,999"], ["Flights (2 pax)", "₹19,600"], ["Hotel · 6 nights", "₹48,000"], ["Hospital deposit", "₹1,00,000"]].map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-forest/10 pb-2"><span className="text-charcoal/80">{k}</span><span className="tabular-nums font-semibold text-forest-ink">{v}</span></li>
              ))}
              <li className="flex justify-between pt-1"><span className="font-semibold text-forest-ink">Paid so far</span><span className="tabular-nums font-display text-xl font-bold text-forest-deep">₹1,77,599</span></li>
              <li className="flex justify-between text-slate"><span>Balance on admission</span><span className="tabular-nums">₹9,22,401</span></li>
            </ul>
            <p className="mt-3 text-[10.5px] leading-5 text-slate">No surprise line items: your quote caps ICU at ₹14,000/day (5 days) and every extra is written into the consent before you sign.</p>
          </section>

          <section className="rounded-3xl border-2 border-[#C2452D]/40 bg-[#FBEFED] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A83B26]">In hospital, call us first</p>
            <p className="mt-2 text-[12px] leading-6 text-[#6E2412]">Chest pain · breathlessness at rest · fever &gt; 38°C · heavy bleeding from the wound · sudden confusion. We reach the surgeon in minutes — open the concierge chat below (24×7 in production). For emergencies, hospital emergency first, then us.</p>
            <DemoChat label="Open the 24×7 concierge" variant="light" className="mt-3" />
          </section>

          <div className="flex gap-2">
            <Link href="/dashboard" className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-forest text-[13px] font-bold text-oat hover:bg-forest-deep">Journey tracker</Link>
            <Link href="/aftercare" className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-forest/20 text-[13px] font-semibold text-forest hover:bg-sage-wash">Aftercare plan →</Link>
          </div>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
