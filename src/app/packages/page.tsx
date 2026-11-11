import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = { title: "Packages — ready-made care journeys · EthAum" };

const PACKAGES = [
  { name: "CABG Bangkok — Grand Recovery", tag: "Most chosen", hospital: "Bumrungrad International, Bangkok", days: "12 days · 8 nights", price: "₹10.8L", includes: ["Off-pump CABG · Dr. Meera Krishnan", "Flights (2 pax) + hotel · Eastin Grand", "Visa letter 48h + pickup + SIM", "Day-7/30/90 tele-follow-ups", "Hindi-speaking nurses · Meena buddy"], bestFor: "Triple-vessel · diabetes · budget ≤ ₹12L" },
  { name: "Knee Strong Chennai", tag: "Zero travel", hospital: "Manipal, Old Airport Road, Bengaluru", days: "6 days · 5 nights", price: "₹4.1L", includes: ["Robotic TKR · 12-week physio plan", "Room + 2d physiotherapy", "Airport & hospital transfers", "Blood panel + X-ray at day 30", "Hindi · Kannada · Tamil care team"], bestFor: "Severe OA · want max outcomes at min faff" },
  { name: "IVF Nurturing, KL", tag: "Fertility", hospital: "Sunway Medical Centre, Kuala Lumpur", days: "16 days · 6 nights", price: "₹2.6L", includes: ["Full stimulation monitoring", "ICSI + blastocyst culture", "Flights + visa-free entry · guesthouse", "Halal & vegetarian meals", "Two follow-up consults after return"], bestFor: "Unexplained infertility · PCOS · under-38" },
  { name: "Istanbul Hair Revival", tag: "Cosmetic", hospital: "Acıbadem Altunizade, Istanbul", days: "4 days · 3 nights", price: "₹1.1L", includes: ["4,000–5,000 grafts FUE (live count)", "PRP session included", "Hotel 3 nights + transfers", "12-month growth reviews", "Arabic/English/Turkish staff"], bestFor: "Norwood III–VI · want minimal downtime" },
  { name: "Cancer Answer — Singapore MDT", tag: "Second opinion", hospital: "Gleneagles, Singapore", days: "5 days · 4 nights", price: "₹2.9L", includes: ["PET-CT + targeted biopsy", "4-specialist MDT board review", "Written plan + 2nd opinion letter", "Flights + hotel + transfers", "Tele-MDT after you return"], bestFor: "New cancer diagnosis · staging confusion" },
  { name: "Heart Reset, Chennai Home", tag: "Ayush + allopathy adjunct", hospital: "Apollo Greams Road + Siddha wing", days: "10 days · 9 nights", price: "₹6.5L", includes: ["Post-CABG cardiac rehab", "Nutritionist + yoga therapy", "Daily walk program with nurse", "Echo at discharge & day 30", "English · Tamil · Hindi"], bestFor: "Post-surgery recovery · want a supervised reset" },
  { name: "Clear Vision Both Eyes", tag: "Day-care", hospital: "Apollo Greams Road, Chennai", days: "2 days · same city", price: "₹95,000", includes: ["Trifocal IOL both eyes", "3D biometry + topography", "Drops for 6 weeks", "Day-1/7/30 checks", "Home delivery of meds"], bestFor: "Significant cataracts · don't want spectacles" },
  { name: "Liver New Istanbul", tag: "Transplant", hospital: "Memorial Şişli, Istanbul", days: "21 days · 18 nights", price: "₹38.5L", includes: ["Living-donor LDLT evaluation", "Donor + recipient surgery", "ICU 3d + rehab", "Flights ×2 for both", "6-month tele-follow-ups + labs"], bestFor: "Decompensated cirrhosis · family donor" },
];

export default function PackagesPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Packages", "/packages"]]}
        eyebrow="Curated bundles · all-in"
        title="Ready-made journeys, honestly priced."
        sub="Not a hospital's marketing brochure — EthAum's desk picked these eight from 3,100 cases: strongest outcomes-per-rupee, real inclusions, zero hidden extras."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PACKAGES.map((p) => (
            <article key={p.name} className="flex flex-col rounded-3xl border border-forest/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-sage-wash px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-forest">{p.tag}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">{p.days}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-forest-ink">{p.name}</h2>
              <p className="mt-0.5 text-[11px] text-slate">{p.hospital}</p>
              <p className="mt-3 font-display text-3xl font-semibold text-forest-deep">{p.price}<span className="ml-2 align-middle text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-slate">all-in</span></p>
              <ul className="mt-4 space-y-1.5 text-[12px] leading-snug text-charcoal/85">
                {p.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2"><svg viewBox="0 0 12 12" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 6.2 4.8 9 10 3.2" /></svg>{i}</li>
                ))}
              </ul>
              <p className="mt-3 border-t border-forest/10 pt-3 text-[10.5px] leading-5 text-slate"><span className="font-semibold text-forest-deep">Best for:</span> {p.bestFor}</p>
              <Link href="/case/new" className="mt-4 flex h-11 items-center justify-center rounded-full bg-forest text-[13px] font-bold text-oat transition-colors hover:bg-forest-deep">Start this package →</Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-[10.5px] text-slate">Packages are starting points, not contracts — your written quote governs; inclusions above are the floor, never the ceiling. Illustrative demo pricing, Nov 2026.</p>
      </section>
      <SiteFooter />
    </div>
  );
}
