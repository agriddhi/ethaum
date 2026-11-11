"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

/* Guided demo tour — a 60-second narrated walkthrough of the patient journey.
   State lives at module level so navigating between steps never unmounts
   the tour (it is mounted once, in the root layout). */

type Step = { title: string; narration: string; route: string; cta: string };

const STEPS: Step[] = [
  { title: "Discover", narration: "One homepage, tuned to the person looking at it — treatment, budget, language and the patient's own case.", route: "/", cta: "Personalised hero" },
  { title: "Create case & upload records", narration: "Ten minutes: your condition, your records. Our AI classifies each file and flags the tests this procedure still needs.", route: "/case/new", cta: "Guided wizard" },
  { title: "Qualification", narration: "A five-question surgeon pre-screen scores readiness out of 100 — and tells you honestly if travelling is premature.", route: "/dashboard", cta: "AI pre-screen" },
  { title: "Provider matching", narration: "Hospitals ranked by your own sliders — every match shows why it fits, and what could go wrong.", route: "/matches", cta: "Ranked matches" },
  { title: "Quote comparison", narration: "Three itemised all-in quotes, plus an AI audit that flags under-scoped pricing before you commit.", route: "/quotes/compare", cta: "All-in quotes" },
  { title: "Booking & payment", narration: "Itinerary built for you: visa letter, flights held, hotel near the hospital, EMI options, refundable ₹9,999 token.", route: "/booking", cta: "Escrow token" },
  { title: "Virtual consultation", narration: "A pre-op call where the surgeon already read your file, and your questions are written before you meet.", route: "/consult", cta: "AI-briefed consult" },
  { title: "Treatment & aftercare", narration: "Day-by-day inside the hospital, then Day-7/30/90 tele-reviews, physio and refills once you are home.", route: "/aftercare", cta: "90-day continuity" },
];

type TourState = { active: boolean; step: number; playing: boolean };

const INITIAL: TourState = { active: false, step: 0, playing: true };
let state: TourState = INITIAL;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const setTour = (patch: Partial<TourState>) => {
  state = { ...state, ...patch };
  emit();
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => state;
const getServerSnapshot = () => INITIAL;

export default function DemoTour() {
  const router = useRouter();
  const tour = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const step = STEPS[tour.step];

  useEffect(() => {
    if (!tour.active) return;
    router.push(step.route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.step]);

  useEffect(() => {
    if (!tour.active || !tour.playing) return;
    const id = window.setTimeout(() => {
      setTour({ step: (tour.step + 1) % STEPS.length });
    }, 8000);
    return () => window.clearTimeout(id);
  }, [tour.active, tour.playing, tour.step]);

  if (!tour.active) {
    return (
      <button
        onClick={() => setTour({ active: true, step: 0, playing: true })}
        className="no-print fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-forest-ink px-5 py-3 text-[12px] font-bold text-oat shadow-float transition-transform hover:scale-[1.03]"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-mint" fill="currentColor" aria-hidden>
          <path d="M4 2.5v11l9-5.5-9-5.5Z" />
        </svg>
        Play the 60-sec demo
      </button>
    );
  }

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-forest-ink/95 shadow-float backdrop-blur-md">
        <div className="h-1 w-full bg-white/10">
          <div className="h-full bg-mint transition-[width] duration-700" style={{ width: `${((tour.step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="flex flex-wrap items-center gap-4 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber font-display text-sm font-bold text-forest-ink">
            {tour.step + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber">
              {step.cta} · step {tour.step + 1} of {STEPS.length}
            </p>
            <p className="mt-0.5 font-display text-base font-semibold text-oat">{step.title}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-white/70">{step.narration}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setTour({ playing: !tour.playing })}
              aria-label={tour.playing ? "Pause tour" : "Resume tour"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-oat hover:border-mint"
            >
              {tour.playing ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><rect x="4" y="3" width="3" height="10" rx="1" /><rect x="9" y="3" width="3" height="10" rx="1" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M5 3v10l8-5-8-5Z" /></svg>
              )}
            </button>
            <button
              onClick={() => setTour({ step: (tour.step + STEPS.length - 1) % STEPS.length })}
              className="h-9 rounded-full border border-white/15 px-3 text-[11px] font-bold text-oat hover:border-mint"
            >
              Back
            </button>
            <button
              onClick={() => setTour({ step: (tour.step + 1) % STEPS.length })}
              className="h-9 rounded-full bg-mint px-4 text-[11px] font-bold text-forest-ink hover:bg-[#2be3bc]"
            >
              Next
            </button>
            <button
              onClick={() => setTour({ active: false })}
              className="h-9 rounded-full px-2 text-[11px] font-semibold text-white/60 hover:text-oat"
            >
              End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
