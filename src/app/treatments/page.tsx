"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { TREATMENTS } from "@/data/ethaum";
import { SEED_TREATMENTS, type SeedTreatment } from "@/data/seed";

/** Slugs with a published detail page (src/app/treatments/[slug]). */
const WITH_DETAIL = new Set(TREATMENTS.map((t) => t.slug));

const CATEGORIES = ["All", ...Array.from(new Set(SEED_TREATMENTS.map((t) => t.category)))];
const fmtL = (v: number) => (v >= 1 ? `₹${v.toFixed(2)}L` : `₹${Math.round(v * 100)}k`);

export default function TreatmentsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [budget, setBudget] = useState("any");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "name">("price-asc");

  const results = useMemo(() => {
    let list = SEED_TREATMENTS.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (budget !== "any") {
        const cap = Number(budget);
        if (Math.min(...Object.values(t.allIn)) > cap) return false;
      }
      if (q.trim()) {
        const hay = `${t.name} ${t.short} ${t.category} ${t.bestFor}`.toLowerCase();
        if (!q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const key = (t: SeedTreatment) => Math.min(...Object.values(t.allIn));
    if (sort === "price-asc") list = [...list].sort((a, b) => key(a) - key(b));
    else if (sort === "price-desc") list = [...list].sort((a, b) => key(b) - key(a));
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [q, cat, budget, sort]);

  const flagship = SEED_TREATMENTS.filter((t) => WITH_DETAIL.has(t.slug)).length;

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Treatments", "/treatments"]]}
        eyebrow={`${SEED_TREATMENTS.length} treatment guides · ${flagship} with a full guide · 6 countries`}
        title="Browse by treatment, not by hospital."
        sub="Every price is all-in — procedure, implants, room, flights, visa, companion and 90-day follow-ups. Pick a treatment to see the honest breakdown."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* filter bar */}
        <div className="grid gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-card md:grid-cols-12">
          <label className="flex items-center gap-2 rounded-xl border border-forest/10 bg-oat px-3 py-2.5 md:col-span-4">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><circle cx="9" cy="9" r="6.5" /><path d="m14.5 14.5 3.5 3.5" /></svg>
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search — e.g. bypass, knee, IVF, LASIK…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate" aria-label="Search treatments" />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border border-forest/10 bg-oat px-3 py-2.5 text-sm text-charcoal outline-none md:col-span-2" aria-label="Category">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="rounded-xl border border-forest/10 bg-oat px-3 py-2.5 text-sm text-charcoal outline-none md:col-span-2" aria-label="Max budget">
            <option value="any">Any budget</option>
            <option value="1">Up to ₹1L</option>
            <option value="5">Up to ₹5L</option>
            <option value="10">Up to ₹10L</option>
            <option value="25">Up to ₹25L</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-xl border border-forest/10 bg-oat px-3 py-2.5 text-sm text-charcoal outline-none md:col-span-2" aria-label="Sort">
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name">Name A–Z</option>
          </select>
          <p className="flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.16em] text-forest md:col-span-2">{results.length} of {SEED_TREATMENTS.length}</p>
        </div>

        {/* grid */}
        {results.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-display text-2xl text-forest-ink">Nothing matches that — yet.</p>
            <p className="mt-2 text-sm text-slate">Try a broader search, or tell us your condition and we&apos;ll find it within 31 hours.</p>
            <Link href="/case/new" className="mt-6 inline-flex h-11 items-center rounded-full bg-forest px-6 text-sm font-bold text-oat">Start your case — free</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((t) => {
              const min = Math.min(...Object.values(t.allIn));
              const hasDetail = WITH_DETAIL.has(t.slug);
              const body = (
                <>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-sage-wash px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-forest">{t.category}</span>
                    {!hasDetail && (
                      <span className="rounded-full border border-amber/40 bg-amber-wash px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-deep">New · index</span>
                    )}
                  </div>
                  <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-forest-ink group-hover:text-forest">{t.name}</h2>
                  <p className="mt-1 text-[11px] text-slate">{t.short}</p>
                  <div className="mt-auto border-t border-forest/10 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">All-in from</p>
                    <p className="mt-0.5 font-display text-2xl font-semibold text-forest-deep">{fmtL(min)}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-deep">Save {t.savingVsPrivateIndia} vs private India</p>
                    <p className="mt-1 text-[10px] text-slate">Stay {t.hospitalStay} · {t.recovery}</p>
                  </div>
                </>
              );
              if (!hasDetail) {
                return (
                  <article key={t.slug} className="group flex flex-col rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
                    {body}
                    <Link href="/case/new" className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-forest/20 text-[11px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat">
                      Request a quote →
                    </Link>
                  </article>
                );
              }
              return (
                <Link key={t.slug} href={`/treatments/${t.slug}`} className="group flex flex-col rounded-2xl border border-forest/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-forest/25">
                  {body}
                </Link>
              );
            })}
          </div>
        )}
        <p className="mt-6 text-center text-[10.5px] text-slate">Prices indicative as of Nov 2026 · your written quote locks the figure · demo data. Prefer a ready-made bundle? <Link href="/packages" className="font-semibold text-forest hover:underline">See 8 curated all-in packages →</Link></p>
        <p className="mx-auto mt-3 max-w-3xl text-center text-[10.5px] leading-5 text-slate">
          {SEED_TREATMENTS.length} guides in the index: {flagship} hand-curated flagship guides with a full cost breakdown, and {SEED_TREATMENTS.length - flagship} newly added index entries with indicative bands only — request a quote for a written figure.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
