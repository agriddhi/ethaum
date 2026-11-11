"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import DemoChat from "@/components/demo-chat";
import { HOSPITALS, TREATMENTS } from "@/data/ethaum";

/* EthAum · Care Buddy marketplace — a NEW product line.
   Buddies are verified *patients* (not clinicians) who have already made the
   trip and offer to travel alongside a new patient. Everything below is
   illustrative demo data; requests are local state only (no backend). */

type Buddy = {
  id: string;
  name: string;
  city: string;
  ageBand: string;
  treatmentSlug: string;
  hospitalSlug: string;
  hospitalLabel: string;
  hospitalBadge: string;
  year: number;
  languages: string[];
  offers: string[];
  rating: number;
  reviews: number;
  trips: number;
  proximity: 0 | 1 | 2 | 3;
  proximityLabel: string;
  fliesOn: string;
  slotISO: string;
  slotsLeft: number;
  price: number;
};

const SERVICE_INCLUDES =
  "Companion care: airport pickup, hospital navigation, translation, daily check-in, hospital-side advocate.";

const BUDDIES: Buddy[] = [
  {
    id: "meera-sundaram",
    name: "Meera Sundaram",
    city: "Chennai",
    ageBand: "50–59",
    treatmentSlug: "cardiac-cabg",
    hospitalSlug: "bumrungrad-international",
    hospitalLabel: "Bumrungrad International, Bangkok",
    hospitalBadge: "Bumrungrad · 2 trips",
    year: 2024,
    languages: ["Tamil", "Hindi", "English"],
    offers: [
      "I did my CABG at Bumrungrad in 2024 — I can show you the exact gate the taxi drops at, and the ward lift that reaches the cardiac block without passing ICU.",
      "I speak Tamil and Hindi; my aunt runs a guesthouse 10 minutes from the hospital — ₹900 a night, with a filter and a rice cooker.",
      "Nurse Sasi on ward 12B makes you walk at 6am whether you like it or not. She was right — after day 3 I could take stairs again.",
    ],
    rating: 4.9,
    reviews: 11,
    trips: 6,
    proximity: 0,
    proximityLabel: "Been to your hospital",
    fliesOn: "12 Nov",
    slotISO: "2026-11-12",
    slotsLeft: 1,
    price: 4500,
  },
  {
    id: "suresh-bhatt",
    name: "Suresh Bhatt",
    city: "Bengaluru",
    ageBand: "60–69",
    treatmentSlug: "cardiac-cabg",
    hospitalSlug: "bumrungrad-international",
    hospitalLabel: "Bumrungrad International, Bangkok",
    hospitalBadge: "Bumrungrad · 2 trips",
    year: 2022,
    languages: ["Kannada", "Hindi", "English", "Telugu"],
    offers: [
      "I have made this trip twice for a bypass. The second time I walked in knowing which discharge counter to use — it is the one behind pharmacy, not the main lobby.",
      "The visa invitation letter arrives as a PDF by email; print two copies — one for immigration, one for the foreign-patient desk at gate 4.",
      "Carry every tablet in its original strip with the strength printed, plus two photocopies of your passport and Aadhaar. I was sent back to the pharmacy once because I had the strip but not the dose.",
    ],
    rating: 4.9,
    reviews: 17,
    trips: 12,
    proximity: 0,
    proximityLabel: "Been to your hospital",
    fliesOn: "13 Nov",
    slotISO: "2026-11-13",
    slotsLeft: 2,
    price: 4500,
  },
  {
    id: "rakesh-pillai",
    name: "Rakesh Pillai",
    city: "Kochi",
    ageBand: "40–49",
    treatmentSlug: "knee-replacement",
    hospitalSlug: "apollo-greams-road",
    hospitalLabel: "Apollo Hospitals, Greams Road, Chennai",
    hospitalBadge: "Apollo Greams Road · 1 trip",
    year: 2023,
    languages: ["Malayalam", "Tamil", "English"],
    offers: [
      "I had my knee replaced at Apollo Greams Road in 2023 — the ortho ward is one lift up from the main lobby, and the physio room is a five-minute walk through the food court, not through reception.",
      "Admission was 5:30am and my bag was still in the car. Take clothes that unzip — you cannot pull a tracksuit over a swollen leg.",
      "The discharge slip lists your medicines on the second page only. Ask for the second page before you leave the ward, not at the pharmacy counter.",
    ],
    rating: 4.8,
    reviews: 9,
    trips: 9,
    proximity: 2,
    proximityLabel: "Partner hospital in India",
    fliesOn: "14 Nov",
    slotISO: "2026-11-14",
    slotsLeft: 2,
    price: 3800,
  },
  {
    id: "kavya-nair",
    name: "Kavya Nair",
    city: "Hyderabad",
    ageBand: "30–39",
    treatmentSlug: "ivf",
    hospitalSlug: "sunway-medical-centre",
    hospitalLabel: "Sunway Medical Centre, Kuala Lumpur",
    hospitalBadge: "Sunway · 1 trip",
    year: 2025,
    languages: ["Malayalam", "Tamil", "Hindi", "English"],
    offers: [
      "I did my IVF cycle at Sunway in KL in 2025 — the scans are on one floor and the retrieval happens in a different building; I can walk you the route so you are not crossing blocks on day 5.",
      "Half the nurses in the fertility wing speak Tamil. Ask for Sister Suresh and the consent forms get explained in your language, line by line.",
      "Do not book your return before day 6 — the clinic wants the day-5 blood test read first. I booked day 4 and had to change it at the counter.",
    ],
    rating: 4.9,
    reviews: 6,
    trips: 4,
    proximity: 1,
    proximityLabel: "Been to your destination country",
    fliesOn: "18 Nov",
    slotISO: "2026-11-18",
    slotsLeft: 3,
    price: 5200,
  },
  {
    id: "harpreet-kaur",
    name: "Harpreet Kaur",
    city: "Chandigarh",
    ageBand: "40–49",
    treatmentSlug: "hair-fue",
    hospitalSlug: "acibadem-altunizade",
    hospitalLabel: "Acıbadem Altunizade, Istanbul",
    hospitalBadge: "Acıbadem · 1 trip",
    year: 2024,
    languages: ["Punjabi", "Hindi", "English", "Basic Turkish"],
    offers: [
      "I had 3,200 grafts at Acıbadem in 2024 and counted every one of them on the screen with the assistant. Ask them to count with you and keep the sheet they print.",
      "You cannot walk straight for six hours afterwards, so they put you in a taxi. Give the driver your hotel address in Turkish too — most drivers near the hospital do not read English maps.",
      "The first shampoo is on day 4 and it stings. Ask for the numbing gel they use on day 4, not the standard clinic one.",
    ],
    rating: 4.7,
    reviews: 5,
    trips: 2,
    proximity: 3,
    proximityLabel: "Partner hospital abroad",
    fliesOn: "22 Nov",
    slotISO: "2026-11-22",
    slotsLeft: 1,
    price: 6000,
  },
  {
    id: "anil-deshmukh",
    name: "Anil Deshmukh",
    city: "Pune",
    ageBand: "50–59",
    treatmentSlug: "gastric-sleeve",
    hospitalSlug: "memorial-sisli",
    hospitalLabel: "Memorial Şişli, Istanbul",
    hospitalBadge: "Memorial Şişli · 1 trip",
    year: 2023,
    languages: ["Marathi", "Hindi", "English"],
    offers: [
      "I had my sleeve done at Memorial Şişli in 2023 — the surgeon asks for a three-month food diary before he books you. I faked mine in week two and he called me on it at the pre-op consult.",
      "You are on liquids for two weeks afterwards. The kitchens near the hospital do not stock what you need — I ate from the hospital menu for eleven days and it was fine.",
      "The flight is the worst part, not the surgery. Take an aisle seat and stand at every stop; I could not sit for more than forty minutes.",
    ],
    rating: 4.8,
    reviews: 7,
    trips: 5,
    proximity: 3,
    proximityLabel: "Partner hospital abroad",
    fliesOn: "25 Nov",
    slotISO: "2026-11-25",
    slotsLeft: 2,
    price: 4800,
  },
];

const SORTS = [
  { key: "closest", label: "Closest to your hospital" },
  { key: "rated", label: "Best rated" },
  { key: "soonest", label: "Soonest slot" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

const treatmentName = (slug: string) =>
  TREATMENTS.find((t) => t.slug === slug)?.name ?? slug;

const hospitalOf = (slug: string) => HOSPITALS.find((h) => h.slug === slug);

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export default function CareBuddiesPage() {
  const [q, setQ] = useState("");
  const [treatment, setTreatment] = useState("all");
  const [hospital, setHospital] = useState("all");
  const [sort, setSort] = useState<SortKey>("closest");
  const [requested, setRequested] = useState<string[]>([]);

  const treatmentChips = useMemo(
    () => Array.from(new Set(BUDDIES.map((b) => b.treatmentSlug))),
    []
  );
  const hospitalChips = useMemo(
    () => Array.from(new Set(BUDDIES.map((b) => b.hospitalLabel))),
    []
  );

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = BUDDIES.filter((b) => {
      if (treatment !== "all" && b.treatmentSlug !== treatment) return false;
      if (hospital !== "all" && b.hospitalLabel !== hospital) return false;
      if (!query) return true;
      const hay = `${b.name} ${b.city} ${b.hospitalLabel} ${b.languages.join(" ")} ${treatmentName(b.treatmentSlug)} ${b.offers.join(" ")}`.toLowerCase();
      return query.split(/\s+/).every((w) => hay.includes(w));
    });

    return list.sort((a, b) => {
      if (sort === "rated") return b.rating - a.rating || b.trips - a.trips;
      if (sort === "soonest") return a.slotISO.localeCompare(b.slotISO);
      return a.proximity - b.proximity || b.rating - a.rating;
    });
  }, [q, treatment, hospital, sort]);

  const request = (id: string) =>
    setRequested((cur) => (cur.includes(id) ? cur : [...cur, id]));

  const activeFilters = (treatment !== "all" ? 1 : 0) + (hospital !== "all" ? 1 : 0);

  return (
    <div className="bg-oat">
      <SiteNav />

      <PageHeader
        crumbs={[
          ["Home", "/"],
          ["Journey", "/dashboard"],
          ["Care buddies", "/care-buddies"],
        ]}
        eyebrow="New on EthAum · verified patient companions"
        title="Someone who has already made the trip."
        sub="A Care Buddy is a verified patient who went through the same hospital, the same ward and the same visa route — and offers to travel alongside you. They carry the lived experience; the surgeon keeps the stethoscope."
      />

      {/* ───────── WHAT A CARE BUDDY IS + HONEST NOTE ───────── */}
      <section className="border-b border-forest/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">
              01 · What a Care Buddy is
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-forest-ink sm:text-3xl">
              Not a nurse. Not a fixer. <em className="text-forest">A patient who went first.</em>
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["They travel with you", "Same flight window, same city, same hospital — you are not explaining your fear to a stranger at the admissions desk."],
                ["They show, not tell", "The gate, the lift, the ward, the pharmacy, the discharge counter. Small things that cost a first-timer half a day."],
                ["They speak your language", "Tamil, Hindi, Malayalam, Bengali, Urdu, English — matched before anything is booked."],
                ["They cost nothing extra", "A Care Buddy is a paid service you choose. It is never bundled into your surgery quote."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-2xl border border-forest/10 bg-oat p-4">
                  <p className="text-[13px] font-bold text-forest-ink">{t}</p>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-charcoal/80">{d}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-forest/10 pt-5">
              {[
                ["38", "verified buddies on the roster"],
                ["12", "hospitals covered across 6 countries"],
                ["0", "medical opinions given by a buddy"],
              ].map(([n, d]) => (
                <div key={d}>
                  <dt className="sr-only">{d}</dt>
                  <dd className="font-display text-2xl font-semibold text-forest-deep">{n}</dd>
                  <dd className="max-w-[13rem] text-[10.5px] leading-4 text-slate">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-mint/40 bg-mint-wash/60 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint-deep">
                How we verify — and what we don&apos;t do
              </p>
              <ul className="mt-4 space-y-3 text-[12.5px] leading-6 text-charcoal">
                {[
                  "Every buddy is verified before listing: government ID, plus proof of the trip they say they made — hospital admission record or discharge summary, cross-checked with the hospital.",
                  "Every buddy's review is written only after the trip. No paid placements, no listings for people who have not travelled.",
                  "The service is optional and always priced separately. It is never added to a surgery quote, and a hospital never sees your request for a buddy.",
                  "A buddy can show you where to go and translate what the ward says. They cannot read your angiogram, change a medicine, or speak for your surgeon.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg viewBox="0 0 14 14" className="mt-1 h-4 w-4 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M2.4 7.3 5.6 10.3 11.6 3.6" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-2xl border border-forest/10 bg-white/80 px-4 py-3 text-[11px] leading-5 text-charcoal/80">
                If a buddy is caught giving clinical advice, we suspend the listing the same day and tell the patient. Buddies are patients — EthAum is explicit about it.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ───────── FILTERS ───────── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-forest/10 bg-oat px-3 py-2.5">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <circle cx="9" cy="9" r="6.5" />
                <path d="m14.5 14.5 3.5 3.5" />
              </svg>
              <span className="sr-only">Search buddies</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, city, hospital or language…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate"
                aria-label="Search care buddies"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate">Sort</span>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSort(s.key)}
                  aria-pressed={sort === s.key}
                  className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                    sort === s.key
                      ? "bg-forest text-oat"
                      : "border border-forest/15 text-charcoal hover:border-forest"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-forest/10 pt-4">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate">Treatment</span>
            <button
              type="button"
              onClick={() => setTreatment("all")}
              aria-pressed={treatment === "all"}
              className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                treatment === "all" ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"
              }`}
            >
              All
            </button>
            {treatmentChips.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setTreatment(slug === treatment ? "all" : slug)}
                aria-pressed={treatment === slug}
                className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  treatment === slug ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"
                }`}
              >
                {treatmentName(slug)}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate">Hospital</span>
            <button
              type="button"
              onClick={() => setHospital("all")}
              aria-pressed={hospital === "all"}
              className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                hospital === "all" ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"
              }`}
            >
              All
            </button>
            {hospitalChips.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHospital(h === hospital ? "all" : h)}
                aria-pressed={hospital === h}
                className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  hospital === h ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <p className="mt-4 border-t border-forest/10 pt-3 text-[11px] text-slate">
            <span className="font-bold text-forest-deep">{results.length}</span> buddy
            {results.length === 1 ? "" : "ies"} shown
            {activeFilters > 0 && " · a filter is on — clear it to see the full roster"}
            {". Roles, slots and prices are illustrative demo data."}
          </p>
        </div>
      </section>

      {/* ───────── BUDDY CARDS ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((b) => {
            const pending = requested.includes(b.id);
            const h = hospitalOf(b.hospitalSlug);
            return (
              <article
                key={b.id}
                className="flex flex-col rounded-3xl border border-forest/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sage-wash font-display text-xl font-bold text-forest">
                    {initialsOf(b.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold leading-snug text-forest-ink">
                        {b.name}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mint-deep">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
                        Verified patient
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-slate">
                      {b.city} · {b.ageBand} · {b.languages.join(" · ")}
                    </p>
                    <p className="mt-1.5 text-[11.5px] font-semibold text-forest-deep">
                      {treatmentName(b.treatmentSlug)} · {b.hospitalLabel} · {b.year}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber/50 bg-amber-wash/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-deep">
                    {b.hospitalBadge}
                  </span>
                  <span className="rounded-full bg-sage-wash px-2.5 py-1 text-[10px] font-semibold text-forest">
                    {b.proximityLabel}
                  </span>
                  {h && (
                    <span className="rounded-full border border-forest/15 px-2.5 py-1 text-[10px] font-semibold text-charcoal/80">
                      {h.accreditations.join(" · ")}
                    </span>
                  )}
                  <span className="rounded-full border border-forest/15 px-2.5 py-1 text-[10px] font-semibold text-charcoal/80">
                    ★ {b.rating.toFixed(1)} · {b.reviews} reviews · {b.trips} trips completed
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-oat p-4">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-amber-deep">
                    What I can do for you
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {b.offers.map((o) => (
                      <li key={o} className="flex gap-2.5 text-[12px] leading-5 text-charcoal/90">
                        <svg viewBox="0 0 12 12" className="mt-1 h-3.5 w-3.5 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2 6.2 4.8 9 10 3.2" />
                        </svg>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-forest/10 pt-4">
                  <div>
                    <p className="text-[11px] font-semibold text-forest-deep">
                      Flies {b.fliesOn} · {b.slotsLeft} slot{b.slotsLeft === 1 ? "" : "s"} left
                    </p>
                    <p className="mt-0.5 text-[10.5px] leading-4 text-slate">
                      {SERVICE_INCLUDES}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold text-forest-deep">
                      ₹{b.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate">
                      per trip, billed separately
                    </p>
                  </div>
                </div>

                {pending ? (
                  <div
                    role="status"
                    className="mt-4 rounded-2xl border border-amber/40 bg-amber-wash/60 px-4 py-3"
                  >
                    <p className="text-[12.5px] font-bold text-amber-deep">
                      Request pending — {b.name} has been notified.
                    </p>
                    <p className="mt-1 text-[11.5px] leading-5 text-charcoal/85">
                      Request sent to {b.name}. They usually reply within 6 hours; your coordinator Anita is copied.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => request(b.id)}
                    className="mt-4 flex h-11 items-center justify-center rounded-full bg-amber text-[13px] font-bold text-forest-ink transition-colors hover:bg-amber-deep hover:text-oat"
                  >
                    Request this buddy
                  </button>
                )}
              </article>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="rounded-3xl border border-forest/10 bg-white p-10 text-center shadow-card">
            <p className="font-display text-xl font-semibold text-forest-ink">
              No buddy matches that yet.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-slate">
              We only list buddies we have verified, so the roster is small by design. Clear the
              filters, or ask coordinator Anita to source one for your hospital and dates.
            </p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setTreatment("all");
                setHospital("all");
              }}
              className="mt-5 inline-flex h-11 items-center rounded-full border-2 border-forest px-5 text-[13px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* ───────── TWO OTHER OPTIONS ───────── */}
      <section className="border-y border-forest/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">
            02 · Not a buddy? Two other options
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-forest-ink sm:text-3xl">
            Cover, and an always-on human.
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-forest/10 bg-oat p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest">
                  Medical companion insurance
                </p>
                <span className="rounded-full bg-sage-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest">
                  30 days
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-forest-deep">
                ₹1,200
                <span className="ml-2 align-middle text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-slate">
                  per companion
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-[12.5px] leading-5 text-charcoal/85">
                {[
                  "Hospital-side advocate assigned for the length of your stay — the person who chases your discharge summary.",
                  "Emergency medical evacuation to India, up to ₹5,00,000, if you need to be brought home urgently.",
                  "No claim for elective surgery — this cover is for complications of travel and hospital stay, not for the procedure itself.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg viewBox="0 0 12 12" className="mt-1 h-3.5 w-3.5 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M2 6.2 4.8 9 10 3.2" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10.5px] leading-4 text-slate">
                Priced per companion per 30-day trip. Illustrative demo pricing — the policy
                wording you sign governs, not this page.
              </p>
              <Link
                href="/packages"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full border-2 border-forest px-5 text-[13px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat"
              >
                See what the hospital quote includes
              </Link>
            </article>

            <article className="flex flex-col rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                The EthAum coordinator · Anita
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber font-display text-xl font-bold text-forest-ink">
                  AN
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">Anita</p>
                  <p className="text-[11.5px] text-white/60">
                    Cardiac nurse · English, Hindi, Tamil · 24×7 in-app chat
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-6 text-white/80">
                Anita is not a buddy and does not travel. She is the always-on alternative: your
                named coordinator for the whole journey — flights, visa, admission, the ward, the
                discharge date and the flight home. Every answer lands on your case file, and no
                hospital switchboard is involved.
              </p>
              <p className="mt-3 text-[11.5px] leading-5 text-white/55">
                Choose Anita if you want a professional on your side but not a travelling companion.
                Choose both if you want a nurse in the thread and a patient beside you at the ward
                door.
              </p>
              <DemoChat label="Message Anita (demo concierge)" variant="dark" className="mt-5 self-start" />
            </article>
          </div>
        </div>
      </section>

      {/* ───────── ETHICS ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-amber/40 bg-amber-wash/50 p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">
            Ethics of a Care Buddy
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-forest-ink sm:text-2xl">
            A buddy is a patient. Not a medical professional.
          </h2>
          <ul className="mt-4 grid gap-3 text-[12.5px] leading-6 text-charcoal sm:grid-cols-2">
            {[
              "Buddies never give clinical advice — no reading your angiogram, no opinion on your medicines, no second-guessing the surgeon.",
              "Your surgeon decides everything: the procedure, the dates, the medicines, the discharge. A buddy can only show you where to go and help you be heard.",
              "A buddy may share their own experience. That is a story, not a medical opinion, and your doctor will tell you if the two differ.",
              "If a buddy gives you medical advice, report it to coordinator Anita — we suspend the listing the same day.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-deep" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-amber/30 pt-4 text-[11px] leading-5 text-charcoal/75">
            EthAum coordinates the journey; accredited hospitals provide the treatment; your
            treating surgeon makes every clinical decision. Buddy listings, slots and prices shown
            here are illustrative demo data and are not a binding quote.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
