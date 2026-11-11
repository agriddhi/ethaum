import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import Accordion from "@/components/accordion";
import { TREATMENTS, HOSPITALS } from "@/data/ethaum";

const COUNTRIES: Array<[keyof typeof TREATMENTS[number]["allIn"], string]> = [
  ["india", "India"],
  ["thailand", "Thailand"],
  ["singapore", "Singapore"],
  ["turkey", "Turkey"],
  ["malaysia", "Malaysia"],
];
const fmtL = (v: number) => (v >= 1 ? `₹${v.toFixed(2)}L` : `₹${Math.round(v * 100)}k`);

export const instant = false;

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = TREATMENTS.find((x) => x.slug === slug);
  return { title: t ? `${t.name} — all-in cost abroad · EthAum` : "Treatment — EthAum" };
}

export default async function TreatmentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = TREATMENTS.find((x) => x.slug === slug);
  if (!t) notFound();

  const max = Math.max(...Object.values(t.allIn));
  const best = Math.min(...Object.values(t.allIn));
  const flagship = HOSPITALS.slice(0, 3);

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Treatments", "/treatments"], [t.name, `/treatments/${t.slug}`]]}
        eyebrow={`${t.category} · all-in pricing`}
        title={t.name}
        sub={t.description}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:py-14">
        {/* main column */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-card">
            {[
              ["Hospital stay", t.hospitalStay],
              ["Procedure time", t.surgeryTime],
              ["Back to life", t.recovery],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-oat px-3 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate">{k}</p>
                <p className="mt-1 text-[13px] font-semibold leading-snug text-forest-ink">{v}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Best suited for</h2>
          <p className="mt-2 text-sm leading-6 text-charcoal/85">{t.bestFor}</p>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Everything the quote includes</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {t.included.map((i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl border border-forest/10 bg-white px-3 py-2.5 text-[12px] leading-snug text-charcoal shadow-sm">
                <svg viewBox="0 0 14 14" className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2.4 7.3 5.6 10.3 11.6 3.6" /></svg>
                {i}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Questions patients ask us</h2>
          <div className="mt-3"><Accordion items={t.faqs} /></div>
          <p className="mt-4 text-[10.5px] text-slate">Indicative — your written quote governs. Demo dataset; partner hospitals verify every figure on acceptance.</p>
        </div>

        {/* rail */}
        <aside className="lg:col-span-5">
          <div className="rounded-3xl border border-forest/10 bg-forest-ink p-6 text-oat shadow-float">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">All-in cost · 2 travellers · 10 nights</p>
            <div className="mt-5 space-y-4">
              {COUNTRIES.map(([key, label]) => {
                const v = t.allIn[key];
                const isBest = v === best;
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-baseline justify-between text-[12px]">
                      <span className={`font-medium ${isBest ? "text-mint" : "text-white/75"}`}>{label}{isBest && " · best value"}</span>
                      <span className="tabular-nums font-semibold text-oat">{fmtL(v)}</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${isBest ? "bg-gradient-to-r from-mint to-mint-deep" : "bg-sage-soft/60"}`} style={{ width: `${(v / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-[12px] leading-5 text-amber-wash">
              <span className="font-bold text-amber">Price lock:</span> accept any quote and the figure holds 30 days — including implants.
            </div>
            <Link href={`/case/new?treatment=${t.slug}`} className="mt-6 flex h-12 items-center justify-center rounded-full bg-mint text-[15px] font-bold text-forest-ink transition-all hover:bg-[#2be3bc]">
              Start my case for {t.name.split("(")[0].trim()}
            </Link>
            <Link href="/quotes/compare" className="mt-2 flex h-11 items-center justify-center rounded-full border border-white/15 text-[13px] font-semibold text-sage-mist transition-colors hover:text-oat">
              Compare live quotes →
            </Link>
          </div>

          {/* featured hospitals for this category */}
          <div className="mt-6 rounded-3xl border border-forest/10 bg-white p-5 shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Partner centres</p>
            <ul className="mt-3 divide-y divide-forest/10">
              {flagship.map((h) => (
                <li key={h.slug} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/hospitals/${h.slug}`} className="text-[13px] font-semibold leading-snug text-forest-ink hover:underline">{h.name}</Link>
                    <p className="mt-0.5 text-[11px] text-slate">{h.city}, {h.country} · ★ {h.rating}</p>
                  </div>
                  <span className="rounded-md border border-amber/40 bg-amber-wash px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-amber-deep">{h.accreditations[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
