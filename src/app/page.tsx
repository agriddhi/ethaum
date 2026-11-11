"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Testimonial from "@/components/testimonial";
import CompareBars from "@/components/compare-bars";
import DemoChat from "@/components/demo-chat";
import { useSession } from "@/lib/session";
import { useCase, caseStatusLine } from "@/lib/case-store";

type Persona = "visitor" | "priya" | "rahul";
const PERSONA_KEY = "ethaum-persona";
const PERSONA_EVENT = "ethaum-persona-change";
const subscribePersona = (cb: () => void) => {
  window.addEventListener(PERSONA_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(PERSONA_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const getPersonaSnapshot = (): Persona => {
  const v = window.localStorage.getItem(PERSONA_KEY);
  return v === "priya" || v === "rahul" ? v : "visitor";
};
const getPersonaServerSnapshot = (): Persona => "visitor";

const PERSONAS: Record<
  Persona,
  {
    eyebrow: string;
    titleA: string;
    titleB: string;
    sub: string;
    cta: { label: string; href: string };
    chips: string[];
    popularTitle: string;
    popularSub: string;
  }
> = {
  visitor: {
    eyebrow: "Trusted by 12,400+ patients from 46 countries",
    titleA: "World-class care,",
    titleB: "arranged around you.",
    sub: "Compare 640+ accredited hospitals across 28 countries, see all-in quotes in ₹, and travel with a 24×7 coordinator — from first search to full recovery.",
    cta: { label: "Find my match", href: "/case/new" },
    chips: ["Cardiac bypass", "Knee replacement", "IVF", "Hair transplant", "Dental implants"],
    popularTitle: "Popular from India right now",
    popularSub: "Most requested by patients flying from Delhi, Mumbai, Bengaluru & Chennai in the last 90 days.",
  },
  priya: {
    eyebrow: "Good evening, Priya — welcome back",
    titleA: "Your cardiac match is ready:",
    titleB: "94 — Bumrungrad.",
    sub: "Your CABG case matched 3 JCI hospitals. Bumrungrad fits your ₹12L budget, has an ICU bed in 6 days, and a Hindi-speaking cardiac team. Quotes close 14 Nov.",
    cta: { label: "View your 3 matches", href: "/matches" },
    chips: ["Match rest of case", "Visa checklist — done ✓", "2 quotes pending", "Consult · Tue 9:30 IST"],
    popularTitle: "Because you're exploring cardiac care",
    popularSub: "Patients like you (CABG · budget ≤ ₹12L) shortlisted these next.",
  },
  rahul: {
    eyebrow: "Welcome back, Rahul",
    titleA: "3 IVF specialists match",
    titleB: "your case — from ₹2.1L.",
    sub: "Two in Bangkok, one in Kuala Lumpur. All fit your ₹6L ceiling, report ≥54% cycle success (own eggs, under-35), and include visa letters in 48h.",
    cta: { label: "Compare the 3 quotes", href: "/quotes/compare" },
    chips: ["Semen analysis ✓ uploaded", "AMH — AI organised", "Slot held · Dr. Chen", "Hindi coordinator"],
    popularTitle: "Because you're exploring IVF",
    popularSub: "Common next steps for patients comparing Thailand & Malaysia programs.",
  },
};

/* ─── doctor spotlight (hero slideshow) ─── */
type Spotlight = {
  id: string;
  photo: string;
  alt: string;
  nameLine: string;
  hospitalLine: string;
  score: number;
  matchName: string;
  lines: string[];
  allIn: string;
  allInNote: string;
  delta: string;
};

const SPOTLIGHTS: Spotlight[] = [
  {
    id: "meera",
    photo: "/img/dr-krishnan.jpg",
    alt: "Dr. Meera Krishnan, cardiothoracic surgeon",
    nameLine: "Dr. Meera Krishnan · Cardiothoracic · 17 yrs",
    hospitalLine: "Bumrungrad Intl · Bangkok",
    score: 94,
    matchName: "Bumrungrad Intl · CABG",
    lines: ["Fits ₹12L · ICU in 6 days", "Hindi-speaking surgeon", "4.9★ · 1,240 verified reviews"],
    allIn: "₹10.8L",
    allInNote: "all-in CABG · flights + 8 nights",
    delta: "save ₹6.4L vs Delhi",
  },
  {
    id: "ananya",
    photo: "/img/dr-anya.jpg",
    alt: "Dr. Ananya Iyer, reproductive medicine specialist",
    nameLine: "Dr. Ananya Iyer · Reproductive med · 13 yrs",
    hospitalLine: "Bumrungrad Intl · IVF & Fertility",
    score: 89,
    matchName: "Bumrungrad · IVF & Fertility",
    lines: ["61% success · own eggs · under-35", "English · Hindi coordinator", "4.9★ · 860 verified reviews"],
    allIn: "₹4.6L",
    allInNote: "all-in IVF cycle · incl. meds estimate",
    delta: "save ₹3.1L vs Mumbai",
  },
  {
    id: "arjun",
    photo: "/img/dr-arjun.jpg",
    alt: "Dr. Arjun Mehta, orthopaedic surgeon",
    nameLine: "Dr. Arjun Mehta · Orthopaedics · 15 yrs",
    hospitalLine: "Apollo Greams Road · Chennai",
    score: 91,
    matchName: "Apollo Chennai · Total knee",
    lines: ["Robotic TKR · 2,300+ procedures", "Fits ₹5.5L ceiling", "Tamil · Hindi · English"],
    allIn: "₹4.2L",
    allInNote: "all-in TKR · implant disclosed up front",
    delta: "save ₹3.6L vs private Delhi",
  },
];

const SPOTLIGHT_ORDER: Record<Persona, string[]> = {
  visitor: ["meera", "ananya", "arjun"],
  priya: ["meera", "arjun", "ananya"],
  rahul: ["ananya", "meera", "arjun"],
};

const TREATMENTS = [
  { name: "Cardiac bypass (CABG)", from: "₹9.6L", save: "save ₹6.4L", icon: "heart", slug: "cardiac-cabg" },
  { name: "Knee replacement", from: "₹4.1L", save: "save ₹3.2L", icon: "bone", slug: "knee-replacement" },
  { name: "IVF (own eggs)", from: "₹2.1L", save: "save ₹1.4L", icon: "bloom", slug: "ivf" },
  { name: "Dental implants", from: "₹32,000", save: "save ₹48,000", icon: "tooth", slug: "dental-implants" },
  { name: "Hair transplant (FUE)", from: "₹1.1L", save: "save ₹90,000", icon: "follicle", slug: "hair-fue" },
  { name: "Bariatric (gastric sleeve)", from: "₹3.4L", save: "save ₹2.8L", icon: "scale", slug: "gastric-sleeve" },
  { name: "Cataract (multifocal)", from: "₹48,000", save: "save ₹55,000", icon: "eye", slug: "cataract" },
  { name: "Oncology — PET & biopsy", from: "₹68,000", save: "save ₹40,000", icon: "scan", slug: "oncology-pet-biopsy" },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const persona = useSyncExternalStore(subscribePersona, getPersonaSnapshot, getPersonaServerSnapshot);
  const session = useSession();
  const c = useCase();

  const order = SPOTLIGHT_ORDER[persona].map((id) => SPOTLIGHTS.find((s) => s.id === id)!);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % order.length), 5500);
    return () => window.clearInterval(id);
  }, [paused, order.length]);

  const choosePersona = (p: Persona) => {
    window.localStorage.setItem(PERSONA_KEY, p);
    setSlide(0);
    window.dispatchEvent(new Event(PERSONA_EVENT));
  };

  const P =
    session && c
      ? {
          eyebrow: `Signed in as ${session.name} · case ${c.id}`,
          titleA: c.tokenPaid
            ? "Booking confirmed."
            : c.quoteLocked
              ? "Your quote is locked —"
              : c.matchedSlug
                ? "Provider held. Now compare"
                : `Your ${c.treatmentName} case is moving —`,
          titleB: c.tokenPaid
            ? "See you in Bangkok."
            : c.quoteLocked
              ? `${c.quoteHospital}, ₹${((c.quoteTotal ?? 0) / 100000).toFixed(1)}L.`
              : c.matchedSlug
                ? "the all-in quotes."
                : `${c.readiness ?? "—"}/100 ready for surgeon review.`,
          sub: `${caseStatusLine(c)}. Everything here is remembered on this device — sign out and it disappears.`,
          cta: { label: c.tokenPaid ? "Open my journey" : "Continue my case", href: "/dashboard" },
          chips: [
            c.docsUploaded ? `${c.docsUploaded} reports scanned ✓` : "Upload records",
            c.readiness !== null ? `Pre-screen ${c.readiness}/100` : "Pre-screen pending",
            c.matchedName ?? "No provider held",
            c.quoteTotal ? `Quote locked · ₹${(c.quoteTotal / 100000).toFixed(1)}L` : "Quotes pending",
            c.tokenPaid ? "Token paid ✓" : "Token ₹9,999 pending",
          ],
          popularTitle: `Recommended for your ${c.treatmentName} case`,
          popularSub: `Budget ceiling ₹${c.budget}L · care in ${c.languages.join(" / ")} · companions ${c.companions}.`,
        }
      : PERSONAS[persona];
  const D = order[slide % order.length];

  return (
    <div className="bg-oat">
      <SiteNav />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden bg-forest-ink text-oat">
        <div className="bg-dotgrid bg-hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-16">
          {/* left copy */}
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              {P.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-[42px] font-semibold leading-[1.02] tracking-tight sm:text-6xl xl:text-[68px]">
              {P.titleA}
              <br />
              <em className="text-amber">{P.titleB}</em>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{P.sub}</p>

            {/* search bar */}
            <form
              className="mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full"
              onSubmit={(e) => e.preventDefault()}
              role="search"
              aria-label="Find a treatment"
            >
              <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 sm:border-r sm:border-white/10">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-sage-soft" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <circle cx="9" cy="9" r="6.5" /><path d="m14.5 14.5 3.5 3.5" />
                </svg>
                <span className="sr-only">Treatment or condition</span>
                <input
                  type="text"
                  placeholder="Search treatment — e.g. bypass, IVF, knee…"
                  className="w-full bg-transparent text-sm text-oat placeholder-white/40 outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl px-3 py-2.5">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-sage-soft" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" strokeLinejoin="round" /><circle cx="10" cy="8" r="2.2" />
                </svg>
                <span className="sr-only">Destination</span>
                <select className="bg-transparent text-sm text-oat outline-none [&>option]:text-charcoal" defaultValue="any">
                  <option value="any">Any destination</option>
                  <option>India</option><option>Thailand</option><option>Singapore</option>
                  <option>Turkey</option><option>Malaysia</option><option>UAE</option>
                </select>
              </label>
              <button type="submit" className="h-11 rounded-xl bg-amber px-5 text-sm font-bold text-forest-ink transition-colors hover:bg-amber-deep hover:text-oat sm:rounded-full">
                Search
              </button>
            </form>

            {/* chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {P.chips.map((chip) => (
                <Link key={chip} href="/case/new" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:border-mint/40 hover:text-mint">
                  {chip}
                </Link>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href={P.cta.href} className="inline-flex h-12 items-center gap-2 rounded-full bg-mint px-6 text-[15px] font-bold text-forest-ink transition-all hover:bg-[#2be3bc] hover:shadow-[0_0_36px_rgba(0,201,167,0.35)]">
                {P.cta.label}
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
                </svg>
              </Link>
              <Link href="/#how-it-works" className="text-sm font-semibold text-sage-mist underline decoration-amber decoration-2 underline-offset-4 hover:text-oat">
                See how it works
              </Link>
            </div>

            {/* trust strip */}
            <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-white/70">
              {[
                ["12,400+", "journeys coordinated"],
                ["4.8/5", "from 8,300 verified reviews"],
                ["640+", "JCI / NABH accredited hospitals"],
              ].map(([n, d]) => (
                <div key={d}>
                  <dt className="sr-only">{d}</dt>
                  <dd className="font-display text-2xl font-semibold text-oat">{n}</dd>
                  <dd className="max-w-[10rem] text-[10.5px] leading-4 text-white/55">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right — doctor spotlight slideshow */}
          <div
            className="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* desktop composition */}
            <div className="relative hidden h-[560px] lg:block">
              <figure key={D.id} className="animate-fade-slide absolute right-0 top-0 h-[496px] w-[57%] overflow-hidden rounded-3xl border border-white/10 shadow-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={D.photo} alt={D.alt} className="h-full w-full object-cover object-[50%_10%]" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-ink/95 via-forest-ink/45 to-transparent p-4 pt-16">
                  <p className="text-[13px] font-semibold leading-snug text-oat">{D.nameLine}</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-amber">{D.hospitalLine}</p>
                </figcaption>
              </figure>
              <div className="absolute left-0 top-8 z-10 flex w-[50%] flex-col gap-3">
                <MatchCard key={`m-${D.id}`} name={D.matchName} score={D.score} lines={D.lines} className="animate-fade-slide" />
                <SaveCard key={`s-${D.id}`} allIn={D.allIn} note={D.allInNote} delta={D.delta} className="animate-fade-slide" />
                <VisaChip />
                <SlideControls
                  index={slide}
                  count={order.length}
                  onPrev={() => setSlide((s) => (s - 1 + order.length) % order.length)}
                  onNext={() => setSlide((s) => (s + 1) % order.length)}
                  onDot={setSlide}
                />
              </div>
            </div>

            {/* mobile / tablet composition */}
            <div className="lg:hidden">
              <figure key={D.id} className="animate-fade-slide relative overflow-hidden rounded-3xl border border-white/10 shadow-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={D.photo} alt={D.alt} className="aspect-[16/10] w-full object-cover object-[50%_15%]" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-ink/95 via-forest-ink/45 to-transparent p-4 pt-12">
                  <p className="text-[13px] font-semibold leading-snug text-oat">{D.nameLine}</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-amber">{D.hospitalLine}</p>
                </figcaption>
              </figure>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <MatchCard key={`mm-${D.id}`} name={D.matchName} score={D.score} lines={D.lines} />
                <SaveCard key={`ss-${D.id}`} allIn={D.allIn} note={D.allInNote} delta={D.delta} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <VisaChip />
                <SlideControls
                  index={slide}
                  count={order.length}
                  onPrev={() => setSlide((s) => (s - 1 + order.length) % order.length)}
                  onNext={() => setSlide((s) => (s + 1) % order.length)}
                  onDot={setSlide}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PERSONA SWITCHER (demo) ───────── */}
      {!(session && c) && (
      <div className="border-b border-forest/10 bg-sage-wash">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-2.5 text-[11px] sm:gap-3 sm:px-6">
          <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] text-forest">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z" /></svg>
            Preview as
          </span>
          {(
            [
              ["visitor", "General visitor"],
              ["priya", "Priya · CABG · ₹12L"],
              ["rahul", "Rahul · IVF · ₹6L"],
            ] as [Persona, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => choosePersona(key)}
              aria-pressed={persona === key}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
                persona === key
                  ? "bg-forest text-oat shadow-sm"
                  : "bg-white/70 text-forest hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="hidden text-slate md:inline">· stored on this device — no signup needed</span>
        </div>
      </div>
      )}

      {/* ───────── TRUST MARQUEE ───────── */}
      <div className="overflow-hidden border-b border-forest/10 bg-oat py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.2em] text-forest/60">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-12">
              {["Apollo", "Fortis", "Bumrungrad", "Memorial", "Mount Elizabeth", "Manipal", "Max Healthcare", "Gleneagles", "Narayana Health", "Acıbadem", "Sunway", "Fortis Malar"].map((n) => (
                <span key={n + i} className="inline-flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-amber" />{n}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ───────── TREATMENT GRID ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" id="treatments">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">01 · Treatment catalogue</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest-ink sm:text-4xl">{P.popularTitle}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate">{P.popularSub}</p>
          </div>
          <Link href="/treatments" className="text-sm font-semibold text-forest underline decoration-amber decoration-2 underline-offset-4 hover:text-forest-deep">
            Browse all treatment guides →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {TREATMENTS.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="group rounded-2xl border border-forest/10 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-forest/25 sm:p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-wash text-forest transition-colors group-hover:bg-mint-wash group-hover:text-mint-deep">
                <TreatmentIcon name={t.icon} />
              </span>
              <p className="mt-3 text-[13px] font-semibold leading-snug text-charcoal sm:text-sm">{t.name}</p>
              <p className="mt-2 text-[11px] font-medium text-slate">from <span className="tabular-nums font-bold text-forest-deep">{t.from}</span></p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-mint-deep">{t.save}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section id="how-it-works" className="border-y border-forest/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">02 · The EthAum journey</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-forest-ink sm:text-4xl">Twelve steps, <em className="text-forest">one coordinator.</em></h2>
            <p className="max-w-sm text-sm text-slate">From discovery to day-90 teleconsult — every handoff is owned, every document encrypted, every price all-in.</p>
          </div>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ["01", "Tell us your case", "10 minutes — condition, budget, travel dates"],
              ["02", "Upload records", "AI classifies & flags missing tests for your procedure"],
              ["03", "AI-matched, doctor-approved", "Ranked by fit — budget, ICU bed, language, reviews"],
              ["04", "Compare all-in quotes", "Procedure + stay + flights + visa — one number"],
              ["05", "Book & travel", "Coordinator, pickup, visa letter, meals, SIM"],
              ["06", "Heal & follow up", "Day-7/30/90 teleconsults, physio plan, verified review"],
            ].map(([n, title, d]) => (
              <li key={n} className="group relative rounded-2xl border border-forest/10 bg-oat p-4 transition-colors hover:border-mint/40">
                <span className="font-display text-2xl font-semibold text-sage-mist transition-colors group-hover:text-mint-deep">{n}</span>
                <p className="mt-2 text-[13px] font-bold leading-snug text-forest-ink">{title}</p>
                <p className="mt-1.5 text-[11px] leading-snug text-slate">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── ALL-IN QUOTE TEASER ───────── */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">03 · Transparent pricing</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-forest-ink sm:text-4xl">One number.<br />No surprises at the <em className="text-forest">billing counter.</em></h2>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-charcoal/85">
            Every EthAum quote bundles the procedure, anaesthesia, room nights, surgeon &amp; implant fees, flights, visa, transfers and companion stay. If a hospital quotes lower but excludes implants or ICU — we flag it in red.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-charcoal">
            {["Implant & stent brands disclosed up front", "Currency-locked quotes valid 30 days", "EMI from ₹12,900/mo · 0% for 6 months"].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <svg viewBox="0 0 14 14" className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.4 7.3 5.6 10.3 11.6 3.6" /></svg>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/quotes/compare" className="mt-7 inline-flex h-11 items-center rounded-full border-2 border-forest px-5 text-sm font-bold text-forest transition-all hover:bg-forest hover:text-oat">
            Compare CABG quotes — India vs Thailand vs Turkey
          </Link>
        </div>
        <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">CABG · 2 travellers · 10 nights</p>
            <span className="rounded-full bg-amber-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-deep">Live demo data</span>
          </div>
          <CompareBars />
        </div>
      </section>

      {/* ───────── WHY ETHAUM — care hands ───────── */}
      <section className="relative overflow-hidden bg-forest-deep text-oat">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="relative lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/care-hands.jpg" alt="A family member holding the patient's hand" className="aspect-[4/5] w-full rounded-3xl object-cover opacity-95 shadow-float sm:aspect-[5/5]" />
            <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/15 bg-forest-ink/85 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-2xl font-semibold text-amber">92%</p>
              <p className="max-w-[12rem] text-[10px] leading-snug text-white/70">say the coordinator &ldquo;felt like family&rdquo; — Medallion patient NPS, 2026</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">04 · Why EthAum</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">Medicine is clinical.<br />The <em className="text-sage-mist">journey</em> is human.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                ["One owner, start to finish", "A named care coordinator answers in under 3 minutes in the concierge chat — not a call centre script."],
                ["AI does the paperwork, doctors decide", "Our AI organises scans, flags missing reports & drafts questions. Your surgeon approves every clinical step."],
                ["Aftercare that flies home with you", "Tele-follow-ups, physio plans, medicine reminders and a recovery buddy — day 7, 30 and 90."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <svg viewBox="0 0 20 20" className="h-6 w-6 text-mint" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M10 17s-6.5-4.3-6.5-9A4 4 0 0 1 10 5.6 4 4 0 0 1 16.5 8c0 4.7-6.5 9-6.5 9Z" />
                  </svg>
                  <p className="mt-3 text-[13px] font-bold leading-snug">{t}</p>
                  <p className="mt-1.5 text-[11px] leading-snug text-white/65">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber/30 bg-amber/10 px-5 py-4">
              <p className="max-w-xl text-[13px] leading-6 text-oat/90">
                <span className="font-bold text-amber">Company if you want it:</span> verified patient companions who have already made the same journey — same hospital, same language, same visa route, same ward rules.
              </p>
              <Link href="/care-buddies" className="inline-flex h-10 items-center rounded-full bg-amber px-4 text-[12px] font-bold text-forest-ink transition-colors hover:bg-amber-deep hover:text-oat">
                Meet care buddies →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FEATURED HOSPITALS ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">05 · Handpicked providers</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest-ink sm:text-4xl">Audited. Accredited. <em className="text-forest">Patient-proof.</em></h2>
          </div>
          <Link href="/hospitals" className="text-sm font-semibold text-forest underline decoration-amber decoration-2 underline-offset-4">View all 640+ hospitals →</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { name: "Apollo Hospitals, Greams Road", city: "Chennai, India", badges: ["JCI", "NABH"], price: "CABG from ₹11.2L", rating: "4.9", reviews: "2,140", initials: "AP" },
            { name: "Bumrungrad International", city: "Bangkok, Thailand", badges: ["JCI", "GACHC"], price: "CABG from ₹10.8L", rating: "4.9", reviews: "1,240", initials: "BU" },
            { name: "Memorial Şişli", city: "Istanbul, Turkey", badges: ["JCI"], price: "CABG from ₹9.6L", rating: "4.8", reviews: "980", initials: "ME" },
          ].map((h) => (
            <article key={h.name} className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition-all hover:-translate-y-0.5">
              <div className="relative flex h-36 items-end bg-gradient-to-br from-forest to-forest-deep p-4">
                <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 font-display text-lg font-bold text-oat backdrop-blur-sm">{h.initials}</span>
                <div className="flex gap-1.5">
                  {h.badges.map((b) => (
                    <span key={b} className="rounded-md border border-amber/50 bg-forest-ink/40 px-2 py-0.5 text-[10px] font-black tracking-[0.2em] text-amber backdrop-blur-sm">{b}</span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-forest-ink">{h.name}</h3>
                <p className="mt-0.5 text-xs text-slate">{h.city}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-forest/10 pt-4">
                  <div>
                    <p className="text-[12px] font-bold text-forest-deep">{h.price}</p>
                    <p className="mt-0.5 text-[10px] text-slate">★ {h.rating} · {h.reviews} verified reviews</p>
                  </div>
                  <Link href="/hospitals" className="rounded-full border border-forest/20 px-3.5 py-1.5 text-[11px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat">View</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── TESTIMONIALS + MARKET RESEARCH ───────── */}
      <section className="bg-ink text-oat">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">06 · Verified patient voices</p>
            <div className="mt-6"><Testimonial /></div>
          </div>
          <aside className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint">Research · Nov 2026</p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-snug">We benchmarked the market — here&apos;s the gap we&apos;re closing.</h3>
              <ul className="mt-5 space-y-3 text-[13px] leading-6 text-white/75">
                {[
                  "14 platforms mapped across 60+ criteria — Medical Departures, Qunomedical, PlacidWay, hospital portals & more",
                  "Nobody pairs secure records + AI matching + aftercare — they all stop at 'get a callback'",
                  "EthAum keeps the free-quote hook, deletes the phone-call funnel, adds transparent all-in pricing",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />{t}</li>
                ))}
              </ul>
              <Link href="/market-research" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-amber px-5 text-sm font-bold text-forest-ink transition-colors hover:bg-amber-deep hover:text-oat">
                Read the full benchmark →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ───────── HELP + NEWSLETTER ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-forest/10 bg-white p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-forest-ink">Not sure where to start?</h3>
            <p className="mt-2 text-sm leading-6 text-slate">A human coordinator (not a bot) will understand your situation, tell you honestly if travelling is worth it, and never charge for advice.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <DemoChat label="Chat with a coordinator" />
              <Link href="/help" className="inline-flex h-11 items-center rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest hover:bg-sage-wash">Help centre &amp; 40+ FAQs</Link>
            </div>
          </div>
          <form
            className="rounded-3xl border border-amber/40 bg-amber-wash/50 p-6 sm:p-8"
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
          >
            <h3 className="font-display text-2xl font-semibold text-forest-ink">Free: India → Abroad treatment cost guide</h3>
            <p className="mt-2 text-sm leading-6 text-charcoal/80">Real 2026 price ranges for 25 procedures across 6 countries — 14-page PDF from EthAum Research.</p>
            {subscribed ? (
              <p className="mt-5 rounded-2xl border border-mint-deep/30 bg-mint-wash px-4 py-3 text-sm font-semibold text-mint-deep" role="status">
                ✓ Check your inbox — the guide is on its way to {email}.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="nl-email">Email</label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 flex-1 rounded-xl border border-forest/20 bg-white px-4 text-sm outline-none focus:border-forest"
                />
                <button type="submit" className="h-11 rounded-xl bg-forest px-5 text-sm font-bold text-oat hover:bg-forest-deep">Send PDF</button>
              </div>
            )}
          </form>
        </div>
        <p className="mt-6 text-center text-[10.5px] text-slate">We never share your details with hospitals until you ask. Unsubscribe anytime. EthAum is a facilitation platform, not a hospital — always consult your doctor.</p>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ─── hero art components ─── */
function SlideControls({ index, count, onPrev, onNext, onDot }: { index: number; count: number; onPrev: () => void; onNext: () => void; onDot: (i: number) => void }) {
  const btn = "flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sage-mist transition-all hover:border-mint hover:text-mint";
  return (
    <div className="flex items-center gap-3" role="group" aria-label="Doctor spotlight controls">
      <button onClick={onPrev} aria-label="Previous doctor" className={btn}>
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10 3 5 8l5 5" /></svg>
      </button>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            aria-label={`Show doctor ${i + 1} of ${count}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-amber" : "w-3 bg-white/25 hover:bg-white/45"}`}
          />
        ))}
      </div>
      <button onClick={onNext} aria-label="Next doctor" className={btn}>
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 3l5 5-5 5" /></svg>
      </button>
    </div>
  );
}

function MatchCard({ name, score, lines, className = "" }: { name: string; score: number; lines: string[]; className?: string }) {
  return (
    <div className={`rounded-2xl border border-mint/25 bg-forest-ink/90 p-4 shadow-float backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-3">
        <div className="match-dial flex h-16 w-16 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--color-mint) 0 ${score}%, rgba(255,255,255,0.12) ${score}% 100%)` }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-ink font-display text-xl font-bold text-mint">
            {score}
          </div>
        </div>
        <p className="text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] text-sage-soft">AI<br />Match<br />score</p>
      </div>
      <p className="mt-2.5 text-[11px] font-semibold leading-snug text-oat">{name}</p>
      <ul className="mt-2 space-y-1 text-[9.5px] leading-snug text-white/65">
        {lines.map((l) => (
          <li key={l} className="flex items-start gap-1">
            <svg viewBox="0 0 10 10" className="mt-0.5 h-2.5 w-2.5 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M1.6 5.2 4 7.5 8.4 2.4" /></svg>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SaveCard({ allIn, note, delta, className = "" }: { allIn: string; note: string; delta: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-amber/30 bg-[#241f14]/90 p-4 shadow-float backdrop-blur-md ${className}`}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-amber">All-in estimate</p>
      <p className="mt-1 font-display text-2xl font-semibold text-oat xl:text-3xl">{allIn}</p>
      <p className="mt-0.5 text-[9.5px] leading-snug text-white/55">{note}</p>
      <p className="mt-2 inline-flex rounded-full bg-amber/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber">{delta}</p>
    </div>
  );
}

function VisaChip({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-2 pr-3 backdrop-blur-md ${className}`}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-[10px] font-black text-forest-ink" aria-hidden>✓</span>
      <span className="text-[10px] font-semibold text-oat">Visa letter in 48h</span>
    </div>
  );
}

/* ─── inline icon set (stroke style) ─── */
function TreatmentIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "heart": return (<svg {...common}><path d="M12 20s-7-4.6-7-9.5A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 3.5C19 15.4 12 20 12 20Z" /><path d="M3.5 12h4l1.5-3 2 5 2-4 1.5 2h6" /></svg>);
    case "bone": return (<svg {...common}><path d="M8 3a3 3 0 0 0-3 3c0 .8.3 1.4.8 2L3 13a7 7 0 1 0 8 8l5-2.8c.6.5 1.3.8 2 .8a3 3 0 0 0 0-6c-.8 0-1.4.3-2 .8L13 17a7 7 0 0 0-5-14Z" /></svg>);
    case "bloom": return (<svg {...common}><circle cx="12" cy="12" r="2.4" /><path d="M12 2.5c2 3 2 5.5 0 7-2-1.5-2-4 0-7ZM12 21.5c-2-3-2-5.5 0-7 2 1.5 2 4 0 7ZM2.5 12c3-2 5.5-2 7 0-1.5 2-4 2-7 0ZM21.5 12c-3 2-5.5 2-7 0 1.5-2 4-2 7 0Z" /></svg>);
    case "tooth": return (<svg {...common}><path d="M7 3.5c-2.5 0-4 2-4 4.5 0 4 2 6 2.7 9 .5 2 1 3.5 2.6 3.5 2 0 1.6-3.5 3.7-3.5s1.7 3.5 3.7 3.5c1.6 0 2.1-1.5 2.6-3.5.7-3 2.7-5 2.7-9 0-2.5-1.5-4.5-4-4.5-2.5 0-3 1-5 1s-2.5-1-5-1Z" /></svg>);
    case "follicle": return (<svg {...common}><path d="M7 20c0-6 1-9 5-13M12 20c0-5 .8-8 4-11M17 20c.3-3 1.2-4.5 3-6" /><path d="M5 4h2M11 3h2M16 6h2" /></svg>);
    case "scale": return (<svg {...common}><path d="M12 4v16M8 20h8" /><path d="M6 7h12M6 7l-2.5 5a3.5 3.5 0 0 0 5 0L6 7Zm12 0-2.5 5a3.5 3.5 0 0 0 5 0L18 7Z" /></svg>);
    case "eye": return (<svg {...common}><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3.2" /></svg>);
    case "scan": return (<svg {...common}><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><circle cx="12" cy="12" r="3.5" /></svg>);
    default: return (<svg {...common}><circle cx="12" cy="12" r="8" /></svg>);
  }
}
