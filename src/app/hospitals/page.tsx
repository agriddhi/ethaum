"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import HospitalCard from "@/components/hospital-card";
import { SEED_HOSPITALS, type SeedHospital } from "@/data/seed";

const COUNTRIES = ["All", ...Array.from(new Set(SEED_HOSPITALS.map((h) => h.country)))];
const ACCREDITATIONS = [
  "All",
  ...Array.from(new Set(SEED_HOSPITALS.flatMap((h) => h.accreditations))).sort(),
];

const AUDITED_COUNT = SEED_HOSPITALS.filter((h) => h.audited).length;
const INDEX_COUNT = SEED_HOSPITALS.length - AUDITED_COUNT;

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function HospitalsPage() {
  const [scope, setScope] = useState<"audited" | "all">("all");
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const [accred, setAccred] = useState("All");

  const results = useMemo(() => {
    return SEED_HOSPITALS.filter((h) => {
      if (scope === "audited" && !h.audited) return false;
      if (country !== "All" && h.country !== country) return false;
      if (accred !== "All" && !h.accreditations.includes(accred)) return false;
      if (q.trim()) {
        const hay = `${h.name} ${h.city} ${h.country} ${h.specialties.join(" ")} ${h.bestFor}`.toLowerCase();
        if (!q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [q, country, accred, scope]);

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Hospitals", "/hospitals"]]}
        eyebrow={`${SEED_HOSPITALS.length} institutions indexed · ${AUDITED_COUNT} audited · 6 countries`}
        title="Every hospital, pre-audited — or not listed."
        sub={`${AUDITED_COUNT} institutions have been audited by EthAum: we verify accreditation quarterly, read surgical outcomes, and interview discharged patients. The rest of the index is unverified — it shows the shape of the marketplace, not verified quality.`}
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* scope toggle */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Index scope"
            className="inline-flex rounded-full border border-forest/15 bg-white p-1 shadow-card"
          >
            {(
              [
                ["audited", `Audited only (${AUDITED_COUNT})`],
                ["all", `Full index (${SEED_HOSPITALS.length})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setScope(value)}
                aria-pressed={scope === value}
                className={`rounded-full px-4 py-2 text-[12px] font-bold transition-colors ${
                  scope === value ? "bg-forest text-oat" : "text-charcoal hover:text-forest"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate">
            {scope === "audited"
              ? "Showing the institutions we have audited end-to-end."
              : `Showing every indexed institution — ${INDEX_COUNT} of them are unverified index entries.`}
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-card md:grid-cols-12">
          <label className="flex items-center gap-2 rounded-xl border border-forest/10 bg-oat px-3 py-2.5 md:col-span-5">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><circle cx="9" cy="9" r="6.5" /><path d="m14.5 14.5 3.5 3.5" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hospitals, cities, specialities…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate" aria-label="Search hospitals" />
          </label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border border-forest/10 bg-oat px-3 py-2.5 text-sm md:col-span-3" aria-label="Country">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={accred} onChange={(e) => setAccred(e.target.value)} className="rounded-xl border border-forest/10 bg-oat px-3 py-2.5 text-sm md:col-span-2" aria-label="Accreditation">{ACCREDITATIONS.map((a) => <option key={a}>{a}</option>)}</select>
          <p className="flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.16em] text-forest md:col-span-2">{results.length} shown</p>
        </div>

        {/* honesty note */}
        <p className="mt-4 rounded-2xl border border-amber/40 bg-amber-wash/50 px-4 py-3 text-[12px] leading-5 text-charcoal">
          <span className="font-bold text-amber-deep">Read this before you compare:</span>{" "}
          {AUDITED_COUNT} institutions carry verified accreditation, outcome and patient-experience data. The remaining index entries are illustrative demo listings used to show marketplace scale.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((h) =>
            h.audited ? (
              <div key={h.slug} className="relative">
                <HospitalCard h={h} />
                <span className="absolute left-3 top-3 rounded-md bg-amber px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-forest-ink shadow-sm">
                  Audited
                </span>
              </div>
            ) : (
              <IndexCard key={h.slug} h={h} />
            )
          )}
        </div>
        {results.length === 0 && <p className="mt-10 text-center text-sm text-slate">No match — try clearing a filter.</p>}
        <p className="mt-6 text-center text-[10.5px] text-slate">Certification numbers verified quarterly for audited institutions · full audit PDFs on request · demo data.</p>
      </section>
      <SiteFooter />
    </div>
  );
}

/**
 * Index entries are illustrative demo listings: no accreditation has been checked
 * by EthAum and no profile page exists for them, so they route to a quote request
 * rather than to a "profile" that would imply verification.
 */
function IndexCard({ h }: { h: SeedHospital }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-float">
      <div className="relative flex h-28 items-end justify-between bg-gradient-to-br from-sage-mist to-sage-soft p-4">
        <div className="flex flex-wrap gap-1.5">
          {h.accreditations.map((a) => (
            <span key={a} className="rounded-md border border-forest/20 bg-white/60 px-2 py-0.5 text-[10px] font-black tracking-[0.2em] text-forest">
              {a}
            </span>
          ))}
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 font-display text-lg font-bold text-forest">
          {initials(h.name)}
        </span>
        <span className="absolute left-3 top-3 rounded-md border border-forest/20 bg-white/70 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-forest">
          index
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg font-semibold leading-snug text-forest-ink">{h.name}</h2>
        <p className="mt-0.5 text-xs text-slate">{h.city}, {h.country} · est. {h.since}</p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-deep">{h.flagship}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {h.specialties.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-sage-wash px-2 py-0.5 text-[10px] font-medium text-forest">{s}</span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-charcoal/80"><span className="font-semibold text-forest-deep">Best for:</span> {h.bestFor}</p>
        <p className="mt-2 text-[10px] leading-4 text-slate">Accreditation listed but not verified by EthAum · {h.priceNote}.</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-forest/10 pt-4">
          <p className="text-[11px] text-slate">★ <span className="font-bold text-forest-deep">{h.rating}</span> · {h.reviews.toLocaleString("en-IN")} reviews</p>
          <Link href="/case/new" className="rounded-full border border-forest/20 px-3.5 py-1.5 text-[11px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat">
            Request quote →
          </Link>
        </div>
      </div>
    </article>
  );
}
