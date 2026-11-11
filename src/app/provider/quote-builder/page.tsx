"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import ProviderTabs from "@/components/provider-tabs";
import { sendQuote as sendMarketQuote, setLeadStatus, useMarketplace } from "@/lib/marketplace";
import { useCase } from "@/lib/case-store";
import { useSession } from "@/lib/session";

const HOSPITALS = ["Bumrungrad Intl", "Memorial Şişli", "Apollo Greams Road"] as const;
const PROCEDURES = ["CABG", "TKR", "IVF", "FUE", "Gastric sleeve"] as const;
const LOCK_DAYS = ["15", "30", "45"] as const;

type Row = { id: string; label: string; amount: string };

const DEFAULT_ROWS: Row[] = [
  { id: "r1", label: "CABG — surgeon + anaesthesia + perfusion", amount: "720000" },
  { id: "r2", label: "Room 8n + ICU 2d", amount: "135000" },
  { id: "r3", label: "Implants — grafts & consumables", amount: "95000" },
  { id: "r4", label: "OT consumables & drugs", amount: "42000" },
  { id: "r5", label: "Pre-op workup & imaging", amount: "28000" },
  { id: "r6", label: "Visa letter + airport transfers", amount: "15000" },
];

const FLIGHT_ROWS: Row[] = [
  { id: "f1", label: "Flights — 2 pax (return)", amount: "62000" },
  { id: "f2", label: "Travel insurance ×2", amount: "8000" },
];
const COMPANION_ROWS: Row[] = [
  { id: "c1", label: "Companion stay — 6n guesthouse", amount: "48000" },
  { id: "c2", label: "Companion meals — 6 days", amount: "9000" },
];

const CEILING = 1_300_000; // ₹13.0L hard warning threshold (patient ceiling ₹12.0L)
const PATIENT_CEILING_LABEL = "₹12.0L";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const parseAmount = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

let rowSeq = 100;
const nextRowId = () => `r${++rowSeq}`;

export default function QuoteBuilderPage() {
  const [hospital, setHospital] = useState<(typeof HOSPITALS)[number]>("Bumrungrad Intl");
  const [procedure, setProcedure] = useState<(typeof PROCEDURES)[number]>("CABG");
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [flights, setFlights] = useState(true);
  const [companion, setCompanion] = useState(true);
  const [implantBrand, setImplantBrand] = useState("");
  const [priceLock, setPriceLock] = useState<(typeof LOCK_DAYS)[number]>("30");
  const [bestValue, setBestValue] = useState(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const liveCase = useCase();
  const session = useSession();
  const market = useMarketplace();
  // Quotes in this demo go to the lead the hospital is working with (L-2481).
  const patientName = session?.name && session.email.endsWith("@ethaum.demo") && session.role === "patient" ? session.name : "Priya Raghavan";

  const effectiveRows = useMemo(
    () => [...rows, ...(flights ? FLIGHT_ROWS : []), ...(companion ? COMPANION_ROWS : [])],
    [rows, flights, companion]
  );

  const subtotal = effectiveRows.reduce((sum, r) => sum + parseAmount(r.amount), 0);
  const taxes = 0;
  const grandTotal = subtotal + taxes;

  // Per-night room cost — parse "8n" out of the room row label, fall back to 8 nights.
  const roomRow = effectiveRows.find((r) => /room/i.test(r.label));
  const roomNights = roomRow ? Math.max(1, Number(roomRow.label.match(/(\d+)\s*n/i)?.[1] ?? 8) || 8) : 0;
  const perNight = roomRow && roomNights > 0 ? parseAmount(roomRow.amount) / roomNights : null;

  const anyZeroRow = effectiveRows.some((r) => parseAmount(r.amount) === 0);
  const brandMissing = implantBrand.trim().length === 0;

  const checks = useMemo(
    () => [
      {
        label: "All-in total within ceiling",
        ok: grandTotal <= CEILING,
        warn: `Exceeds patient's ${PATIENT_CEILING_LABEL} ceiling — justify or trim`,
      },
      {
        label: "Implant / stent brand specified",
        ok: !brandMissing,
        warn: "Specify implant brand — patients compare line by line",
      },
      {
        label: "Every line item has an amount",
        ok: !anyZeroRow,
        warn: "One or more rows are ₹0 or blank — complete every line",
      },
      {
        label: "90-day complication cover included",
        ok: true,
        warn: "",
      },
    ],
    [grandTotal, brandMissing, anyZeroRow]
  );
  const allChecksPass = checks.every((c) => c.ok);

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const addRow = () => setRows((prev) => [...prev, { id: nextRowId(), label: "New line item", amount: "" }]);

  const sendQuote = () => {
    if (!allChecksPass) return;
    const ref = `QB-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setQuoteRef(ref);
    // Push the quote across the marketplace bridge: it now appears on the
    // patient's quote screen in real time, and this lead flips to "quote sent".
    sendMarketQuote({
      hospital,
      hospitalSlug: hospital.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      patientName: patientName,
      caseId: liveCase?.id ?? null,
      items: effectiveRows.map((r) => ({ label: r.label, amount: parseAmount(r.amount) })),
      total: grandTotal,
      nights: 8,
      notes: `${procedure} · ${implantBrand || "implant brand disclosed in consent"} · price locked ${priceLock} days`,
      checks: {
        implantBrand: !brandMissing,
        withinCeiling: grandTotal <= CEILING,
        icuCap: effectiveRows.some((r) => /icu/i.test(r.label)),
      },
    });
    setLeadStatus("L-2481", "quote-sent");
  };

  const resetBuilder = () => {
    setQuoteRef(null);
    setBestValue(false);
  };

  if (quoteRef) {
    return (
      <>
        <SiteNav />
        <PageHeader
          crumbs={[
            ["Home", "/"],
            ["Partner portal", "/provider"],
            ["Quote builder", "/provider/quote-builder"],
          ]}
          eyebrow="Partner portal · Quote builder"
          title="Quote sent — for review, not for binding."
          sub="Illustrative demo. Nothing is transmitted, stored or shared with any hospital or patient."
        />
        <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
          <ProviderTabs />
          <section aria-label="Quote confirmation" className="overflow-hidden rounded-3xl border border-mint/30 bg-white shadow-card">
            <div className="flex items-center gap-3 border-b border-mint/20 bg-mint-wash/60 px-6 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint">
                <svg viewBox="0 0 20 20" className="h-5 w-5 text-forest-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 10.5 8.5 15 16 6" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mint-deep">Quote drafted &amp; queued</p>
                <p className="font-display text-2xl font-semibold tracking-tight text-forest-ink">{quoteRef}</p>
              </div>
            </div>
            <dl className="grid gap-4 px-6 py-6 sm:grid-cols-2">
              {[
                ["Hospital", hospital],
                ["Procedure", procedure],
                ["Grand total (all-in)", fmt(grandTotal)],
                ["Price locked", `${priceLock} days`],
                ["Flights included", flights ? "Yes — 2 pax" : "No"],
                ["Companion included", companion ? "Yes — 6n guesthouse" : "No"],
                ["Implant / stent brand", implantBrand.trim() || "—"],
                ["Best-value flag", bestValue ? "Flagged for patient’s priorities" : "Not flagged"],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded-xl border border-forest/10 bg-oat px-4 py-3">
                  <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate">{k}</dt>
                  <dd className="mt-1 text-[13.5px] font-semibold leading-snug text-forest-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-forest/10 px-6 py-4">
              <p className="rounded-xl border border-mint/40 bg-mint-wash/60 px-4 py-3 text-[12px] leading-5 text-charcoal">
                <span className="font-semibold text-mint-deep">Live in the marketplace.</span>{" "}
                This quote is now visible on the patient&apos;s quote screen and their lead in your inbox reads &ldquo;quote sent&rdquo;.
                {market.quotes.length} quote{market.quotes.length === 1 ? "" : "s"} sent from this portal in this session.
              </p>
              <p className="mt-3 rounded-xl border border-amber/50 bg-amber-wash/50 px-4 py-3 text-[12px] leading-5 text-charcoal">
                <span className="font-semibold text-amber-deep">Demo only — nothing leaves this browser.</span>{" "}
                In production this quote routes to the patient&apos;s EthAum inbox with a 15/30/45-day price lock,
                a signed consent pack and a coordinator intro. No email, SMS or API call left this page.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={resetBuilder} className="h-11 rounded-xl bg-forest px-5 text-[13px] font-semibold text-oat transition-colors hover:bg-forest-deep">
                  Build another quote
                </button>
                <Link href="/quotes/compare" className="inline-flex h-11 items-center rounded-xl border border-mint/40 bg-mint-wash px-5 text-[13px] font-semibold text-mint-deep transition-colors hover:bg-mint">
                  See it as the patient →
                </Link>
                <Link href="/provider" className="inline-flex h-11 items-center rounded-xl border border-forest/20 px-5 text-[13px] font-semibold text-forest transition-colors hover:bg-sage-wash">
                  Back to inbox
                </Link>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteNav />
      <PageHeader
        crumbs={[
          ["Home", "/"],
          ["Partner portal", "/provider"],
          ["Quote builder", "/provider/quote-builder"],
        ]}
        eyebrow="Partner portal · Quote builder"
        title="Quote builder, line by line."
        sub="Every figure below is illustrative demo data in ₹ — never a binding quote. Patients see the same line items you type here."
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <ProviderTabs />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ─── form column ─── */}
          <form className="space-y-5 lg:col-span-3" onSubmit={(e) => e.preventDefault()}>
            {/* hospital + procedure */}
            <fieldset className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
              <legend className="sr-only">Quote context</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hospital" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Hospital</label>
                  <select id="hospital" value={hospital} onChange={(e) => setHospital(e.target.value as (typeof HOSPITALS)[number])}
                    className="mt-1.5 h-11 w-full rounded-xl border border-forest/20 bg-oat px-3 text-[13.5px] font-medium text-charcoal outline-none focus:border-forest">
                    {HOSPITALS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="procedure" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Procedure</label>
                  <select id="procedure" value={procedure} onChange={(e) => setProcedure(e.target.value as (typeof PROCEDURES)[number])}
                    className="mt-1.5 h-11 w-full rounded-xl border border-forest/20 bg-oat px-3 text-[13.5px] font-medium text-charcoal outline-none focus:border-forest">
                    {PROCEDURES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* line items */}
            <section aria-label="Line items" className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Line items</p>
                <button type="button" onClick={addRow}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-forest/20 px-3 py-1.5 text-[11.5px] font-semibold text-forest transition-colors hover:bg-sage-wash">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M8 3v10M3 8h10" /></svg>
                  Add row
                </button>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-[13px]">
                  <thead>
                    <tr className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate">
                      <th className="pb-2 pr-2">Description</th>
                      <th className="pb-2 w-36">Amount (₹)</th>
                      <th className="pb-2 w-10"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/5">
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="py-1.5 pr-2">
                          <label className="sr-only" htmlFor={`label-${row.id}`}>Line item label</label>
                          <input id={`label-${row.id}`} value={row.label} onChange={(e) => updateRow(row.id, { label: e.target.value })}
                            className="h-10 w-full rounded-lg border border-transparent bg-transparent px-2 text-[13px] text-charcoal outline-none transition-colors focus:border-forest/30 focus:bg-oat" />
                        </td>
                        <td className="py-1.5">
                          <input type="number" min={0} step={1000} inputMode="numeric" aria-label={`Amount for ${row.label}`} value={row.amount}
                            onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                            className={`h-10 w-full rounded-lg border px-2 text-right tabular-nums outline-none transition-colors focus:border-forest ${parseAmount(row.amount) === 0 ? "border-amber/60 bg-amber-wash/40 text-amber-deep" : "border-forest/15 bg-oat text-charcoal"}`} />
                        </td>
                        <td className="py-1.5 text-right">
                          <button type="button" onClick={() => removeRow(row.id)} aria-label={`Remove ${row.label}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate transition-colors hover:bg-amber-wash hover:text-amber-deep">
                            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M3 4.5h10M6.5 4V2.5h3V4M5 4.5l.7 9a1.5 1.5 0 0 0 1.5 1.4h1.6a1.5 1.5 0 0 0 1.5-1.4l.7-9" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(flights ? FLIGHT_ROWS : []).concat(companion ? COMPANION_ROWS : []).map((row) => (
                      <tr key={row.id} className="bg-mint-wash/30">
                        <td className="py-1.5 pr-2">
                          <span className="inline-flex items-center gap-2 px-2 text-[13px] text-forest-ink">
                            <svg viewBox="0 0 12 12" className="h-3 w-3 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="5" width="8" height="5.5" rx="1" /><path d="M4 5V3.8a2 2 0 0 1 4 0V5" /></svg>
                            {row.label}
                          </span>
                        </td>
                        <td className="py-1.5 text-right tabular-nums text-[13px] font-medium text-forest-ink">{fmt(parseAmount(row.amount))}</td>
                        <td className="py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-mint-deep">Fixed</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* toggles */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Include flights?", hint: "Adds 2 fixed rows: airfare + travel insurance", value: flights, set: setFlights },
                  { label: "Include companion?", hint: "Adds 2 fixed rows: 6n stay + meals", value: companion, set: setCompanion },
                ].map(({ label, hint, value, set }) => (
                  <button key={label} type="button" role="switch" aria-checked={value} onClick={() => set(!value)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-forest/15 bg-oat px-4 py-3 text-left transition-colors hover:border-forest/30">
                    <span>
                      <span className="block text-[13px] font-semibold text-forest-ink">{label}</span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-slate">{hint}</span>
                    </span>
                    <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-forest" : "bg-forest/20"}`} aria-hidden>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* implant + lock */}
            <fieldset className="grid gap-4 rounded-2xl border border-forest/10 bg-white p-5 shadow-card sm:grid-cols-2">
              <legend className="sr-only">Implant and price lock</legend>
              <div className="sm:col-span-1">
                <label htmlFor="implant" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Implant / stent brand</label>
                <input id="implant" value={implantBrand} onChange={(e) => setImplantBrand(e.target.value)}
                  placeholder="e.g. Xience Xpedition · Persona Medacta"
                  className={`mt-1.5 h-11 w-full rounded-xl border px-3 text-[13.5px] text-charcoal outline-none transition-colors placeholder:text-slate/60 focus:border-forest ${brandMissing ? "border-amber/60 bg-amber-wash/30" : "border-forest/20 bg-oat"}`} />
                <p className="mt-1 text-[10.5px] text-slate">Shown to the patient verbatim — specificity builds trust.</p>
              </div>
              <div>
                <label htmlFor="lock" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Price lock days</label>
                <select id="lock" value={priceLock} onChange={(e) => setPriceLock(e.target.value as (typeof LOCK_DAYS)[number])}
                  className="mt-1.5 h-11 w-full rounded-xl border border-forest/20 bg-oat px-3 text-[13.5px] font-medium text-charcoal outline-none focus:border-forest">
                  {LOCK_DAYS.map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
                <p className="mt-1 text-[10.5px] text-slate">Longer locks win patient trust; 30 days is the EthAum median.</p>
              </div>
            </fieldset>
          </form>

          {/* ─── live summary column ─── */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <section aria-label="Quote summary" className="rounded-2xl border border-forest/10 bg-forest-ink p-5 text-oat shadow-float">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">Live summary · {procedure}</p>
                <dl className="mt-3 space-y-2 text-[13px]">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sage-mist">Subtotal ({effectiveRows.length} lines)</dt>
                    <dd className="tabular-nums font-semibold">{fmt(subtotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sage-mist">Taxes &amp; GST</dt>
                    <dd className="tabular-nums font-semibold">₹0</dd>
                  </div>
                  <p className="text-[10px] leading-4 text-sage-mist/70">Healthcare services are GST-exempt — 0% shown for transparency. Demo simplification; final invoice follows hospital billing.</p>
                  <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-oat">Grand total</dt>
                    <dd className="font-display text-3xl font-semibold tracking-tight tabular-nums text-oat">{fmt(grandTotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sage-mist">Per-night room cost</dt>
                    <dd className="tabular-nums font-semibold">{perNight !== null ? `${fmt(perNight)} / night` : "—"}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[10px] leading-4 text-sage-mist/60">All figures illustrative · {hospital} · not a binding quote.</p>
              </section>

              {/* transparency checks */}
              <section aria-label="Transparency checks" className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Transparency checks</p>
                <ul className="mt-3 space-y-2">
                  {checks.map((check) => (
                    <li key={check.label} className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-[12.5px] leading-5 ${check.ok ? "border-mint/25 bg-mint-wash/40 text-forest-ink" : "border-amber/50 bg-amber-wash/40 text-charcoal"}`}>
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${check.ok ? "bg-mint" : "bg-amber"}`}>
                        {check.ok ? (
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-forest-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 6.5 4.8 9 10 3" /></svg>
                        ) : (
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-forest-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 2.5v4.5M6 9.2h.01" /></svg>
                        )}
                      </span>
                      <span>
                        <span className="block font-semibold">{check.label}{check.ok ? " ✓" : ""}</span>
                        {!check.ok && <span className="mt-0.5 block text-[11.5px] leading-4 text-amber-deep">{check.warn}</span>}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* best value toggle */}
                <button type="button" role="switch" aria-checked={bestValue} disabled={!allChecksPass}
                  title={allChecksPass ? "Flag this quote as best value for the patient’s stated priorities" : "Available once all transparency checks pass"}
                  onClick={() => setBestValue((v) => !v)}
                  className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-forest/15 bg-oat px-4 py-3 text-left transition-colors enabled:hover:border-forest/30 disabled:cursor-not-allowed disabled:opacity-60">
                  <span>
                    <span className="block text-[13px] font-semibold text-forest-ink">Flag as best value for this patient’s priorities</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-slate">
                      {allChecksPass ? "All checks green — flag away." : "Locked until every transparency check passes."}
                    </span>
                  </span>
                  <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${bestValue && allChecksPass ? "bg-mint" : "bg-forest/20"}`} aria-hidden>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${bestValue && allChecksPass ? "left-[22px]" : "left-0.5"}`} />
                  </span>
                </button>

                {/* send */}
                <button type="button" onClick={sendQuote} disabled={!allChecksPass}
                  title={allChecksPass ? "Send quote to patient (demo)" : "Fix the warnings above to send"}
                  className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest text-[14px] font-semibold text-oat transition-all hover:bg-forest-deep disabled:cursor-not-allowed disabled:bg-forest/30">
                  {allChecksPass ? "Send quote to patient" : "Send quote — fix checks first"}
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </button>
                <p className="mt-2 text-center text-[10.5px] text-slate">Reference issued on send · nothing leaves this demo.</p>
              </section>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
