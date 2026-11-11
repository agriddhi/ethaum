"use client";

import { useEffect, useState } from "react";

const QUOTES = [
  {
    quote:
      "I got quotes from three hospitals in 48 hours, all itemised. Chose Bumrungrad for my CABG, flew with my wife, and EthAum's coordinator handled the visa and hotel. Surgery cost ₹10.4L — ₹6.1L less than Delhi.",
    name: "Rakesh Verma, 58",
    meta: "Bypass surgery · Bumrungrad, Bangkok · Verified treatment",
    avatar: "RV",
  },
  {
    quote:
      "As a couple we expected pressure. Instead EthAum's AI checklist told us exactly which reports to upload for IVF, compared 4 centres on success rates, and we never spoke to a salesperson until we chose.",
    name: "Ananya & Rahul Mehta, 33 & 34",
    meta: "IVF with donor program · Sunway Medical, KL · Verified treatment",
    avatar: "AM",
  },
  {
    quote:
      "The aftercare is what nobody else offers — teleconsults with my surgeon at day 7 and 30, physiotherapy videos, and a WhatsApp check-in when my creatinine was borderline. Night and day from 'fly home and hope'.",
    name: "Zainab Sheikh, 46",
    meta: "Kidney stone laser · Memorial Şişli, Istanbul · Verified treatment",
    avatar: "ZS",
  },
];

export default function Testimonial() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % QUOTES.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  const q = QUOTES[i];
  return (
    <figure className="relative">
      <blockquote
        key={i}
        className="font-display text-xl leading-snug text-oat sm:text-2xl lg:text-[28px] lg:leading-[1.35]"
        style={{ animation: "fadeSlide .5s ease both" }}
      >
        “{q.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber font-display text-sm font-bold text-forest-ink">
          {q.avatar}
        </span>
        <span>
          <span className="block font-semibold text-oat">{q.name}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-sage-mist/80">
            <VerifiedBadge />
            {q.meta}
          </span>
        </span>
      </figcaption>
      <div className="mt-6 flex gap-2" role="tablist" aria-label="Patient stories">
        {QUOTES.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Story ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-amber" : "w-4 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
      <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
    </figure>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mint">
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2.2 6.3 4.8 8.8 9.8 3.2" />
      </svg>
      Verified
    </span>
  );
}
