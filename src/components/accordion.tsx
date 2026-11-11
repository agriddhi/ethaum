"use client";

import { useState } from "react";

export default function Accordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white shadow-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-forest-ink transition-colors hover:text-forest"
            >
              {item.q}
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-forest/20 text-forest transition-transform duration-300 ${isOpen ? "rotate-45 bg-amber/20 border-amber/50 text-amber-deep" : ""}`} aria-hidden>
                <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 2v10M2 7h10" /></svg>
              </span>
            </button>
            {isOpen && <div className="px-5 pb-5 text-[13px] leading-6 text-charcoal/85">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
