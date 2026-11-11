import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import HospitalCard from "@/components/hospital-card";
import WeatherChip from "@/components/weather-chip";
import { DESTINATIONS, HOSPITALS } from "@/data/ethaum";

const COORDS: Record<string, { lat: number; lon: number; city: string }> = {
  india: { lat: 13.08, lon: 80.27, city: "Chennai" },
  thailand: { lat: 13.75, lon: 100.5, city: "Bangkok" },
  singapore: { lat: 1.29, lon: 103.85, city: "Singapore" },
  turkey: { lat: 41.01, lon: 28.97, city: "Istanbul" },
  malaysia: { lat: 3.14, lon: 101.69, city: "Kuala Lumpur" },
  uae: { lat: 25.2, lon: 55.27, city: "Dubai" },
};

export const instant = false;

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DESTINATIONS.find((x) => x.slug === slug);
  return { title: d ? `${d.name} — medical travel guide · EthAum` : "Destination — EthAum" };
}

export default async function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DESTINATIONS.find((x) => x.slug === slug);
  if (!d) notFound();
  const hospitals = HOSPITALS.filter((h) => h.country.toLowerCase() === d.slug);
  const coords = COORDS[d.slug];

  const facts: Array<[string, string]> = [
    ["Visa from India", d.visa],
    ["Flight time", d.flight],
    ["Airports", d.airports],
    ["Best for", d.bestFor],
    ["Recovery weather", d.weather],
    ["EthAum footprint", d.coordinated],
  ];

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Destinations", "/destinations"], [d.name, `/destinations/${d.slug}`]]}
        eyebrow={`Country guide · ${d.name}`}
        title={`Heal in ${d.name} — the honest fine print.`}
        sub={d.tagline + ". These are the numbers, visa quirks and recovery windows we show every patient before they decide."}
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-forest/10 bg-white p-4 shadow-card">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate">{k}</p>
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-forest-ink">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-mint/30 bg-mint-wash px-5 py-4">
            <WeatherChip lat={coords.lat} lon={coords.lon} city={coords.city} />
            <p className="mt-2 text-[11px] text-mint-deep">Your coordinator checks forecasts for your surgery week and rebooks transfers if it rains.</p>
          </div>

          <h2 className="mt-10 font-display text-2xl font-semibold text-forest-ink">EthAum partner hospitals here</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {hospitals.length === 0 ? <p className="text-sm text-slate">Partner onboarding in progress — join the waitlist via a coordinator.</p> : hospitals.map((h) => <HospitalCard key={h.slug} h={h} />)}
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-forest-ink p-6 text-oat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Cost context — vs private India</p>
            <p className="mt-2 font-display text-4xl font-semibold text-oat">{d.saving}</p>
            <p className="mt-1 text-[12px] leading-5 text-white/60">Indicative, Sep–Nov 2026 tariffs. Your quote locks the figure for 30 days.</p>
            <ul className="mt-5 space-y-2.5 text-[13px] leading-6 text-white/80">
              {["Visa letter in 48h · e-filing included", "Flights booked at net fares, or book yourself", "Companion stay + halal/jain/jain meal plan", "Airport pickup · SIM · hospital escort", "Day-7/30/90 tele-follow-ups in your language"].map((t) => (
                <li key={t} className="flex items-start gap-2"><svg viewBox="0 0 14 14" className="mt-1 h-4 w-4 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2.4 7.3 5.6 10.3 11.6 3.6" /></svg>{t}</li>
              ))}
            </ul>
            <Link href="/case/new" className="mt-6 flex h-12 items-center justify-center rounded-full bg-mint text-[15px] font-bold text-forest-ink transition-all hover:bg-[#2be3bc]">Start my {d.name} case</Link>
            <Link href="/help" className="mt-2 flex h-11 items-center justify-center rounded-full border border-white/15 text-[13px] font-semibold text-sage-mist hover:text-oat">Visa & travel FAQs →</Link>
          </div>
          <div className="mt-4 rounded-2xl border border-amber/40 bg-amber-wash/60 px-5 py-4 text-[12px] leading-6 text-charcoal">
            <span className="font-bold text-amber-deep">Honest note:</span> {d.name} isn&apos;t best for every procedure — if your surgery is cheaper and equally accredited in India, we&apos;ll say so.
          </div>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
