import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { DESTINATIONS } from "@/data/ethaum";

export const metadata = { title: "Destinations — where to heal abroad · EthAum" };

const GRADIENTS: Record<string, string> = {
  india: "from-[#3A6B4F] to-[#23402F]",
  thailand: "from-[#A8573B] to-[#1F3325]",
  singapore: "from-[#33415C] to-[#1A1F36]",
  turkey: "from-[#7A4A2B] to-[#2B2D42]",
  malaysia: "from-[#2F5D50] to-[#14261F]",
  uae: "from-[#8C6A3F] to-[#241F14]",
};
const CODES: Record<string, string> = { india: "IN", thailand: "TH", singapore: "SG", turkey: "TR", malaysia: "MY", uae: "AE" };

export default function DestinationsPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Destinations", "/destinations"]]}
        eyebrow="6 destinations · visa support"
        title="Pick the country; we handle the rest."
        sub="From visa letters to airport pickup to halal/jain meals — every destination guide shows honest flight times, savings and which treatments it's truly best for."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <Link key={d.slug} href={`/destinations/${d.slug}`} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${GRADIENTS[d.slug]} p-6 text-oat shadow-float transition-transform hover:-translate-y-0.5`}>
              <span className="absolute -right-3 -top-6 font-display text-[120px] font-black leading-none text-white/5 select-none">{CODES[d.slug]}</span>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber">{CODES[d.slug]} · EthAum partner network</p>
              <h2 className="mt-1.5 font-display text-3xl font-semibold">{d.name}</h2>
              <p className="mt-1 text-[12px] text-white/70">{d.tagline}</p>
              <dl className="mt-5 space-y-2 text-[11px] text-white/75">
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3"><dt className="text-white/50">Savings</dt><dd className="font-semibold text-mint">{d.saving}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-white/50">Visa</dt><dd className="text-right">{d.visa}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-white/50">Flight</dt><dd className="text-right">{d.flight}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-white/50">Best for</dt><dd className="text-right">{d.bestFor}</dd></div>
              </dl>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-oat transition-colors group-hover:border-amber group-hover:text-amber">
                Open guide →
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-[10.5px] text-slate">Weather windows, visa rules and flight fares checked at booking — figures illustrative, Nov 2026.</p>
      </section>
      <SiteFooter />
    </div>
  );
}
