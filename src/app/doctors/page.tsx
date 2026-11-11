"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { DOCTORS } from "@/data/ethaum";
import { SEED_DOCTORS } from "@/data/seed";

/** Slugs with a published profile page (src/app/doctors/[slug]). */
const WITH_PROFILE = new Set(DOCTORS.map((d) => d.slug));

const SPECS = ["All", ...Array.from(new Set(SEED_DOCTORS.map((d) => d.specialty)))];

export default function DoctorsPage() {
  const [spec, setSpec] = useState("All");
  const [q, setQ] = useState("");

  const results = useMemo(
    () =>
      SEED_DOCTORS.filter((d) => {
        if (spec !== "All" && d.specialty !== spec) return false;
        if (q.trim()) {
          const hay = `${d.name} ${d.role} ${d.hospital} ${d.city} ${d.languages.join(" ")}`.toLowerCase();
          if (!q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      }),
    [spec, q]
  );

  const verified = SEED_DOCTORS.filter((d) => WITH_PROFILE.has(d.slug)).length;
  const indexCount = SEED_DOCTORS.length - verified;

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Doctors", "/doctors"]]}
        eyebrow={`${SEED_DOCTORS.length} clinicians indexed · ${verified} credentialed in full · 6 countries`}
        title="Meet the hands, not just the hospital."
        sub="Every published EthAum profile is credentialed, case-logged and patient-reviewed. Index listings below are illustrative demo entries that show how the roster is structured — they are not real clinicians."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-forest/10 bg-white px-3 py-2.5">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><circle cx="9" cy="9" r="6.5" /><path d="m14.5 14.5 3.5 3.5" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors, hospitals, languages…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate" aria-label="Search doctors" />
          </label>
          {SPECS.map((s) => (
            <button key={s} onClick={() => setSpec(s)} aria-pressed={spec === s} className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-colors ${spec === s ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"}`}>{s}</button>
          ))}
        </div>

        {/* honesty note */}
        <p className="mt-4 rounded-2xl border border-amber/40 bg-amber-wash/50 px-4 py-3 text-[12px] leading-5 text-charcoal">
          <span className="font-bold text-amber-deep">Honest labelling:</span>{" "}
          only doctors whose credentials we have verified against original registration, degree and employer records are published in production. The {indexCount} index listings here are illustrative demo entries — no real clinician is represented, and no credential has been checked.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((d) => {
            const hasProfile = WITH_PROFILE.has(d.slug);
            return (
              <article key={d.slug} className="group flex flex-col rounded-3xl border border-forest/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  {d.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.photo} alt={d.name} className="h-20 w-20 rounded-2xl object-cover object-[50%_15%]" />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sage-wash font-display text-2xl font-bold text-forest">{d.name.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("")}</span>
                  )}
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-snug text-forest-ink">{d.name}</h2>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate">{d.role}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mint-deep">{d.specialty} · {d.expYears} yrs</p>
                    {!hasProfile && (
                      <span className="mt-1.5 inline-block rounded-full border border-forest/20 bg-sage-wash px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-forest">
                        index listing
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate">{d.hospital} · {d.city}</p>
                <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-charcoal/80">{d.bio}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-forest/10 pt-4">
                  <p className="text-[11px] text-slate">★ <span className="font-bold text-forest-deep">{d.rating}</span> · {d.reviews.toLocaleString("en-IN")} reviews · next {d.nextSlot}</p>
                  {hasProfile ? (
                    <Link href={`/doctors/${d.slug}`} className="rounded-full border border-forest/20 px-3.5 py-1.5 text-[11px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat">Profile →</Link>
                  ) : (
                    <Link href="/case/new" className="rounded-full border border-forest/20 px-3.5 py-1.5 text-[11px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat">Request consult →</Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {results.length === 0 && <p className="mt-10 text-center text-sm text-slate">No doctor matches those filters.</p>}
        <p className="mt-6 text-center text-[10.5px] text-slate">{results.length} of {SEED_DOCTORS.length} shown · credential numbers verified quarterly for published profiles · demo data.</p>
      </section>
      <SiteFooter />
    </div>
  );
}
