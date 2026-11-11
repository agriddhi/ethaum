import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { HOSPITALS, REVIEWS } from "@/data/ethaum";

export const instant = false;

export function generateStaticParams() {
  return HOSPITALS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const h = HOSPITALS.find((x) => x.slug === slug);
  return { title: h ? `${h.name} — profile & reviews · EthAum` : "Hospital — EthAum" };
}

export default async function HospitalProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = HOSPITALS.find((x) => x.slug === slug);
  if (!h) notFound();
  const reviews = REVIEWS.slice(0, 3);

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Hospitals", "/hospitals"], [h.name, `/hospitals/${h.slug}`]]}
        eyebrow={`${h.accreditations.join(" · ")} · since ${h.since}`}
        title={h.name}
        sub={`${h.city}, ${h.country} — best for ${h.bestFor.toLowerCase()}. All-in quotes reviewed by EthAum's clinical desk before you see them.`}
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 gap-3">
            {[["Rating", `★ ${h.rating}`], ["Verified reviews", h.reviews.toLocaleString("en-IN")], ["EthAum audits", "4/yr · last Mar 2026"]].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-forest/10 bg-white p-4 shadow-card">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate">{k}</p>
                <p className="mt-1.5 font-display text-xl font-semibold text-forest-ink">{v}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Specialities</h2>
          <div className="mt-3 flex flex-wrap gap-2">{h.specialties.map((s) => <span key={s} className="rounded-full bg-sage-wash px-3 py-1.5 text-[11px] font-semibold text-forest">{s}</span>)}</div>

          <h2 className="mt-6 font-display text-2xl font-semibold text-forest-ink">Languages spoken</h2>
          <div className="mt-3 flex flex-wrap gap-2">{h.languages.map((s) => <span key={s} className="rounded-full border border-forest/15 px-3 py-1.5 text-[11px] font-medium text-charcoal">{s}</span>)}</div>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">What patients say (verified)</h2>
          <div className="mt-3 space-y-3">
            {reviews.map((r) => (
              <figure key={r.name} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
                <blockquote className="text-[13px] leading-6 text-charcoal/90">“{r.text}”</blockquote>
                <figcaption className="mt-3 flex items-center justify-between gap-4 text-[11px] text-slate">
                  <span><span className="font-semibold text-forest-ink">{r.name}</span> · {r.city}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint-wash px-2 py-0.5 font-semibold uppercase tracking-wide text-mint-deep">{r.tag}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Flagship package</p>
            <p className="mt-2 font-display text-3xl font-semibold">{h.flagship}</p>
            <p className="mt-1 text-[11px] text-white/60">{h.priceNote} · illustrative, locked in written quote</p>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-5 text-[13px] text-white/80">
              <p className="flex justify-between"><span>Coordinator languages</span><span>{h.languages.slice(0, 3).join(" · ")}</span></p>
              <p className="flex justify-between"><span>Visa letter</span><span>48h</span></p>
              <p className="flex justify-between"><span>ICU availability</span><span>Confirmed at booking</span></p>
              <p className="flex justify-between"><span>Companion policy</span><span>1 included</span></p>
            </div>
            <Link href="/case/new" className="mt-6 flex h-12 items-center justify-center rounded-full bg-mint text-[15px] font-bold text-forest-ink hover:bg-[#2be3bc]">Request {h.name.split(",")[0]} quote — free</Link>
            <Link href="/quotes/compare" className="mt-2 flex h-11 items-center justify-center rounded-full border border-white/15 text-[13px] font-semibold text-sage-mist hover:text-oat">Compare against 2 other hospitals →</Link>
          </div>
          <div className="mt-4 rounded-2xl border border-forest/10 bg-white p-5 text-[12px] leading-6 text-charcoal/80 shadow-card">
            <span className="font-bold text-forest-ink">Accreditation ledger:</span> {h.accreditations.join(" · ")} — certificate numbers and expiry dates verified quarterly; available on request or via our verification desk.
          </div>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
