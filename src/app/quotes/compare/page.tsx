"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { QUOTES } from "@/data/ethaum";
import { useCase, updateCase } from "@/lib/case-store";
import { useSession } from "@/lib/session";
import { useMarketplace, setQuoteStatus, setLeadStatus, timeAgo } from "@/lib/marketplace";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function QuotesComparePage() {
  const [accepted, setAccepted] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);
  const [audit, setAudit] = useState<Array<{ quote: string; severity: string; text: string }> | null>(null);
  const [auditSource, setAuditSource] = useState<string | null>(null);
  const c = useCase();
  const session = useSession();
  const market = useMarketplace();

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 6000);
    fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: "quote-audit",
        payload: { quotes: QUOTES.map((q) => ({ hospital: q.hospital, total: q.total })) },
      }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.output?.flags?.length) return;
        setAudit(d.output.flags);
        setAuditSource(d.source === "llm" ? `${d.model} (live)` : "EthAum rules engine");
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  if (accepted) {
    // The accepted quote can be one of the seeded benchmark quotes or a live
    // quote sent from the partner portal — look it up in both.
    const seeded = QUOTES.find((x) => x.hospital === accepted);
    const live = market.quotes.find((x) => x.hospital === accepted);
    const total = seeded?.total ?? live?.total ?? 0;
    const isLive = !seeded && !!live;
    return (
      <div className="bg-oat">
        <SiteNav />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-wash">
            <svg viewBox="0 0 28 28" className="h-8 w-8 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15.5 11.5 22 23 8" /></svg>
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-forest-ink">Quote held for 30 days.</h1>
          {isLive && (
            <p className="mx-auto mt-2 inline-flex rounded-full bg-mint-wash px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-mint-deep">
              Live quote from the partner hospital — sent {live ? timeAgo(live.createdAt) : "just now"}
            </p>
          )}
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-charcoal/85"><span className="font-semibold">{accepted}</span> locked <span className="font-semibold">{inr(total)}</span> all-in. Your coordinator will confirm the admission slot within 4 working hours — ICU bed is pencilled for 12 Nov.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="inline-flex h-12 items-center rounded-full bg-forest px-6 text-sm font-bold text-oat hover:bg-forest-deep">Proceed to booking</Link>
            <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">Journey tracker</Link>
          </div>
          <p className="mt-6 text-[10.5px] text-slate">Nothing is charged yet. Token ₹9,999 (refundable 48h) only when you confirm the admission date.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"], ["Quotes", "/quotes/compare"]]}
        eyebrow="All-in · apples to apples"
        title="Three quotes. One honest page."
        sub="Same procedure, same implants class, same room category. What differs is everything hospitals usually hide in fine print — flights, companion, follow-ups — shown in full."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {c && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mint/30 bg-mint-wash px-4 py-3">
            <p className="text-[12px] text-mint-deep">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Live case</span>{" "}
              <span className="font-semibold text-forest-ink">{c.treatmentName}</span> · budget ₹{c.budget}L ·{" "}
              {c.quoteHospital ? `quote locked: ${c.quoteHospital}` : "no quote held yet"}
            </p>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-forest/20 bg-white px-4 text-[11px] font-bold text-forest hover:bg-sage-wash">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4.5 6V2.5h7V6M4.5 12H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.5M4.5 10h7v3.5h-7z" /></svg>
                Print / save PDF
              </button>
              <Link href="/booking" className="inline-flex h-9 items-center rounded-full bg-forest px-4 text-[11px] font-bold text-oat">Continue to booking →</Link>
            </div>
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-3">
          {QUOTES.map((q) => {
            const best = q.accent === "best";
            return (
              <article key={q.hospital} className={`flex flex-col rounded-3xl border p-5 shadow-card ${best ? "border-mint/60 bg-white ring-2 ring-mint/50" : "border-forest/10 bg-white"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold leading-snug text-forest-ink">{q.hospital}</h2>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {best && <span className="rounded-full bg-mint px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-forest-ink">Recommended</span>}
                    {c?.quoteHospital === q.hospital && <span className="rounded-full bg-amber px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-forest-ink">Your locked quote</span>}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">{q.tags.map((t) => <span key={t} className="rounded-full bg-sage-wash px-2.5 py-1 text-[10px] font-medium text-forest">{t}</span>)}</div>
                <p className="mt-4 font-display text-4xl font-semibold text-forest-ink">{inr(q.total)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate">Total, all-in · 30-day lock</p>

                <dl className="mt-4 divide-y divide-forest/10 border-y border-forest/10 text-[12px]">
                  {q.breakdown.map(([label, amount]) => (
                    <div key={label as string} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="leading-snug text-charcoal/80">{label}</dt>
                      <dd className="tabular-nums font-medium text-forest-ink">{(amount as number) === 0 ? "included" : inr(amount as number)}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  onClick={() => {
                    updateCase({ quoteHospital: q.hospital, quoteTotal: q.total, quoteLocked: true });
                    setAccepted(q.hospital);
                  }}
                  className={`mt-5 flex h-12 items-center justify-center rounded-full text-[13px] font-bold transition-all ${best ? "bg-mint text-forest-ink hover:bg-[#2be3bc]" : "border border-forest/20 text-forest hover:bg-sage-wash"}`}
                >
                  Hold this quote — {inr(q.total)}
                </button>
              </article>
            );
          })}
        </div>

        {/* ── live quotes from partner hospitals (marketplace bridge) ── */}
        {market.quotes.length > 0 && (
          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-forest-ink">Live quotes from partner hospitals</h2>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint-deep">
                {market.quotes.length} quote{market.quotes.length === 1 ? "" : "s"} · sent from the partner portal
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {market.quotes.map((q) => {
                const isHeld = q.status === "held" || q.status === "accepted";
                return (
                  <article key={q.id} className={`flex flex-col rounded-3xl border p-5 shadow-card ${q.status === "accepted" ? "border-mint/60 bg-mint-wash/40" : "border-forest/10 bg-white"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-mint-deep">Sent by hospital</p>
                        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-forest-ink">{q.hospital}</h3>
                        <p className="mt-0.5 text-[11px] text-slate">{timeAgo(q.createdAt)} · ref {q.id}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${q.status === "accepted" ? "bg-mint text-forest-ink" : q.status === "held" ? "bg-amber text-forest-ink" : "bg-sage-wash text-forest"}`}>
                        {q.status === "accepted" ? "Accepted" : q.status === "held" ? "Held" : "New"}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-3xl font-semibold text-forest-deep">{inr(q.total)}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate">all-in · {q.nights} nights · price locked</p>
                    <dl className="mt-3 divide-y divide-forest/10 border-y border-forest/10 text-[11.5px]">
                      {q.items.slice(0, 5).map((it) => (
                        <div key={it.label} className="flex items-baseline justify-between gap-3 py-1.5">
                          <dt className="leading-snug text-charcoal/80">{it.label}</dt>
                          <dd className="tabular-nums font-medium text-forest-ink">{inr(it.amount)}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2 text-[11px] leading-snug text-slate">{q.notes}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {q.checks.implantBrand && <li className="rounded-full bg-mint-wash px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-mint-deep">Implant brand ✓</li>}
                      {q.checks.withinCeiling && <li className="rounded-full bg-mint-wash px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-mint-deep">Within your ceiling ✓</li>}
                      {q.checks.icuCap && <li className="rounded-full bg-mint-wash px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-mint-deep">ICU cap written ✓</li>}
                    </ul>
                    <div className="mt-auto flex flex-col gap-2 pt-4">
                      {!isHeld ? (
                        <button
                          onClick={() => {
                            setQuoteStatus(q.id, "held");
                            updateCase({ quoteHospital: q.hospital, quoteTotal: q.total, quoteLocked: true });
                          }}
                          className="h-11 rounded-full bg-forest text-[13px] font-bold text-oat transition-colors hover:bg-forest-deep"
                        >
                          Hold this quote — {inr(q.total)}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuoteStatus(q.id, "accepted");
                            setLeadStatus("L-2481", "accepted");
                            updateCase({ quoteHospital: q.hospital, quoteTotal: q.total, quoteLocked: true });
                            setAccepted(q.hospital);
                          }}
                          className="h-11 rounded-full bg-mint text-[13px] font-bold text-forest-ink transition-colors hover:bg-[#2be3bc]"
                        >
                          Confirm &amp; proceed — {inr(q.total)}
                        </button>
                      )}
                      <p className="text-[10px] text-slate">Holding locks the price for 30 days. The hospital sees your decision instantly.</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mt-3 text-[10.5px] text-slate">
              These arrive live from the EthAum partner portal — open <Link href="/provider/quote-builder" className="font-semibold text-forest hover:underline">/provider/quote-builder</Link> in another tab, send a quote, and it lands here in real time. Demo store, no server involved.
            </p>
          </section>
        )}

        {/* AI quote audit */}
        <div className="mt-6 rounded-2xl border border-mint/30 bg-mint-wash px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint-deep">AI quote audit — what we checked</p>
          <ul className="mt-2 grid gap-2 text-[12px] leading-snug text-charcoal md:grid-cols-3">
            {audit ? (
              audit.map((f) => (
                <li key={f.quote} className="flex items-start gap-2">
                  <span className={f.severity === "warn" ? "font-black text-amber-deep" : "text-mint-deep"}>{f.severity === "warn" ? "!" : "✓"}</span>
                  <span><span className="font-semibold text-forest-ink">{f.quote}</span> — {f.text}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2"><span className="text-mint-deep">✓</span>All three disclose implants &amp; stent brands in writing (LIMA + SVG grafts)</li>
                <li className="flex items-start gap-2"><span className="font-black text-amber-deep">!</span>Memorial at ₹9.6L is 11% below market — get ICU cap (₹11,000/d × 7d) and graft brand <em>in the consent email</em> before you fly</li>
                <li className="flex items-start gap-2"><span className="text-mint-deep">✓</span>Bumrungrad includes 8 nights vs 7 elsewhere — one night extra = ₹18,000 if discharge slips; budgeted for you</li>
              </>
            )}
          </ul>
          <p className="mt-2 text-[10px] text-mint-deep/80">Rule-based audit (price deviation &gt; 15%, coverage deltas, brand disclosure){auditSource ? ` · engine: ${auditSource}` : ""}. Nothing is sent or committed until you e-sign.</p>
        </div>

        {/* verdict */}
        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="rounded-3xl border border-amber/40 bg-amber-wash/50 p-6 lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">EthAum desk verdict</p>
            <p className="mt-2 text-[15px] leading-7 text-charcoal">
              For your sliders — budget 60, outcomes 90, speed 50 — <span className="font-semibold text-forest-ink">Bumrungrad wins on ₹10.8L locked</span>: outcomes per rupee are the strongest of the three, ICU opens in 6 days, and the Hindi-speaking team lowers post-op confusion. Memorial is the better pure-cash deal (₹9.6L) if you stretch the flight; Apollo removes all travel risk at +₹0.4L over Bumrungrad.
            </p>
            <p className="mt-3 text-[12px] text-charcoal/70">We don&apos;t bury the loser — every figure above is verifiable, and changing your mind costs nothing until you e-sign.</p>
          </div>
          <div className="rounded-3xl border border-forest/10 bg-white p-6 lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest-ink">Still deciding?</p>
            <p className="mt-2 text-[13px] leading-6 text-charcoal/85">Ask all three hospitals the same question — we send it verbatim and keep their answers side-by-side.</p>
            {asked ? (
              <p className="mt-4 rounded-2xl border border-mint/40 bg-mint-wash px-4 py-3 text-[13px] font-semibold text-mint-deep" role="status">✓ Sent to all three. Expect answers within 31h — we&apos;ll notify you.</p>
            ) : (
              <button onClick={() => setAsked(true)} className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-forest text-[13px] font-bold text-oat hover:bg-forest-deep">Ask: “What if I need an extra ICU day?”</button>
            )}
            <p className="mt-4 text-[10.5px] text-slate">Extra-ICU answers: Bumrungrad ₹14,000/day (capped 5d) · Memorial ₹11,000/day (capped 7d) · Apollo ₹16,500/day (capped 4d).</p>
          </div>
        </div>
        {/* print-only quote sheet */}
        <section className="hidden print:block">
          <h1 className="font-display text-2xl font-bold text-black">EthAum — all-in quote comparison</h1>
          <p className="mt-1 text-[12px] text-black">
            Patient: {session?.name ?? "Priya Raghavan"} · Case {c?.id ?? "ETA-2417"} · {c?.treatmentName ?? "CABG"} · Issued 11 Nov 2026 · Quotes valid 30 days
          </p>
          <table className="mt-4 w-full border-collapse text-[11px] text-black">
            <thead>
              <tr>
                {["Line item", ...QUOTES.map((q) => q.hospital)].map((h) => (
                  <th key={h} className="border border-black/40 bg-black/5 px-2 py-1 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUOTES[0].breakdown.map(([label], i) => (
                <tr key={label as string}>
                  <td className="border border-black/30 px-2 py-1">{label as string}</td>
                  {QUOTES.map((q) => (
                    <td key={q.hospital} className="border border-black/30 px-2 py-1 tabular-nums">
                      {q.breakdown[i][1] === 0 ? "included" : inr(q.breakdown[i][1] as number)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="border border-black/40 bg-black/5 px-2 py-1 font-bold">TOTAL (all-in)</td>
                {QUOTES.map((q) => (
                  <td key={q.hospital} className="border border-black/40 bg-black/5 px-2 py-1 font-bold tabular-nums">{inr(q.total)}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-[10px] leading-4 text-black">
            All-in includes procedure, anaesthesia, room nights, implants (brand disclosed), visa letter, airport transfers, one companion stay and day-7/30/90 tele-follow-ups. Flights at published fares. Extra ICU days are capped and written into the consent. EthAum coordinates the journey; the hospital provides treatment. Illustrative demo data — not a binding quote or medical advice.
          </p>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
