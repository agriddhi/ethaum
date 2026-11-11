import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { DOCTORS } from "@/data/ethaum";
import { SEED_DOCTORS } from "@/data/seed";

export const instant = false;

export function generateStaticParams() {
  const curated = DOCTORS.map((d) => ({ slug: d.slug }));
  const extra = SEED_DOCTORS.filter((d) => !DOCTORS.some((c) => c.slug === d.slug)).map((d) => ({ slug: d.slug }));
  return [...curated, ...extra];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DOCTORS.find((x) => x.slug === slug) ?? SEED_DOCTORS.find((x) => x.slug === slug);
  return { title: d ? `${d.name} — profile & reviews · EthAum` : "Doctor — EthAum" };
}

export default async function DoctorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DOCTORS.find((x) => x.slug === slug) ?? SEED_DOCTORS.find((x) => x.slug === slug);
  if (!d) notFound();
  const isIndexEntry = !DOCTORS.some((x) => x.slug === slug);

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Doctors", "/doctors"], [d.name, `/doctors/${d.slug}`]]}
        eyebrow={`${d.specialty} · ${d.expYears} yrs experience`}
        title={d.name}
        sub={`${d.role} — ${d.hospital}, ${d.city}. Education, volumes and languages verified by EthAum's credentialing desk against original certificates.`}
      />
      {isIndexEntry && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <p className="rounded-2xl border border-amber/40 bg-amber-wash px-5 py-3 text-[12px] leading-5 text-charcoal">
            <span className="font-bold text-amber-deep">Index listing.</span> This clinician is part of our catalogue index — registration details are illustrative until EthAum&apos;s credentialing desk verifies them.{" "}
            <Link href="/doctors" className="font-bold text-forest underline">See verified profiles →</Link>
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-7">
          <blockquote className="rounded-3xl border border-forest/10 bg-white p-6 font-display text-xl leading-snug text-forest-ink shadow-card">
            “{d.bio}”
            <span className="mt-3 block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-amber-deep">Interview — EthAum Clinical Desk, Oct 2026</span>
          </blockquote>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Education &amp; fellowships</h2>
          <ul className="mt-3 space-y-2">
            {d.education.map((e) => (
              <li key={e} className="flex items-start gap-2.5 rounded-xl border border-forest/10 bg-white px-4 py-3 text-[13px] leading-snug text-charcoal shadow-sm">
                <svg viewBox="0 0 14 14" className="mt-0.5 h-4 w-4 shrink-0 text-forest" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2.4 7.3 5.6 10.3 11.6 3.6" /></svg>
                {e}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Signature procedures</h2>
          <div className="mt-3 flex flex-wrap gap-2">{d.procedures.map((p) => <span key={p} className="rounded-full bg-sage-wash px-4 py-2 text-[12px] font-semibold text-forest">{p}</span>)}</div>

          <h2 className="mt-8 font-display text-2xl font-semibold text-forest-ink">Languages</h2>
          <p className="mt-2 text-[13px] text-charcoal/85">{d.languages.join(" · ")}</p>

          <p className="mt-8 text-[10.5px] leading-5 text-slate">Credential numbers on file: medical registration verified against state council + hospital employment letter. EthAum does not list doctors who decline verification — four applicants failed in 2026.</p>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
            <div className="flex items-center gap-4">
              {d.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.photo} alt={d.name} className="h-24 w-24 rounded-2xl object-cover object-[50%_12%]" />
              ) : (
                <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-amber font-display text-3xl font-bold text-forest-ink">{d.name.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("")}</span>
              )}
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{d.name}</p>
                <p className="mt-1 text-[11px] text-white/55">{d.hospital} · {d.city}</p>
                <p className="mt-1.5 text-[11px] text-amber">★ {d.rating} · {d.reviews.toLocaleString("en-IN")} verified reviews</p>
              </div>
            </div>
            <div className="mt-5 border-t border-white/10 pt-5 text-[13px] text-white/80">
              <p className="flex justify-between"><span>Next pre-op call</span><span className="text-oat">{d.nextSlot}</span></p>
              <p className="mt-2 flex justify-between"><span>Response time</span><span className="text-oat">&lt; 31h via EthAum</span></p>
              <p className="mt-2 flex justify-between"><span>Fee (via EthAum)</span><span className="text-oat">Same as direct — always</span></p>
            </div>
            <Link href="/case/new" className="mt-6 flex h-12 items-center justify-center rounded-full bg-mint text-[15px] font-bold text-forest-ink hover:bg-[#2be3bc]">Request {d.name.split(" ")[1]} for my case</Link>
            <Link href={`/hospitals/${d.hospitalSlug}`} className="mt-2 flex h-11 items-center justify-center rounded-full border border-white/15 text-[13px] font-semibold text-sage-mist hover:text-oat">See {d.hospital.split(",")[0]} audit →</Link>
          </div>
          <p className="mt-4 rounded-2xl border border-amber/40 bg-amber-wash/60 px-5 py-4 text-[12px] leading-6 text-charcoal"><span className="font-bold text-amber-deep">Reminder:</span> choosing a doctor ≠ agreeing to surgery. Every case here gets a free independent surgeon review before you commit to anything.</p>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
