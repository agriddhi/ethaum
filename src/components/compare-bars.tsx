"use client";

import { useEffect, useRef, useState } from "react";

const ROWS = [
  { label: "India — Apollo, Chennai", value: 17.2, max: 20, tag: "Zero travel", highlight: false },
  { label: "Thailand — Bumrungrad", value: 10.8, max: 20, tag: "Most chosen", highlight: true },
  { label: "Turkey — Memorial Şişli", value: 9.6, max: 20, tag: "Lowest all-in", highlight: false },
];

export default function CompareBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSeen(true)),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      {ROWS.map((r) => (
        <div key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[12px] sm:text-[13px]">
            <span className={`font-medium ${r.highlight ? "text-forest-ink" : "text-charcoal"}`}>{r.label}</span>
            <span className="tabular-nums font-semibold text-forest-deep">₹{r.value}L</span>
          </div>
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-forest/10">
            <div
              className={`h-full rounded-full transition-[width] duration-1000 ease-out ${
                r.highlight ? "bg-gradient-to-r from-forest to-mint-deep" : "bg-sage-soft"
              }`}
              style={{ width: seen ? `${(r.value / r.max) * 100}%` : "0%" }}
            />
          </div>
          <p className={`mt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] ${r.highlight ? "text-mint-deep" : "text-slate"}`}>
            {r.tag}
          </p>
        </div>
      ))}
      <p className="pt-1 text-[10.5px] text-slate">
        All-in estimates include procedure, anaesthesia, 8-night room, flights (del→dest, 2 travellers), visa &amp; transfers. Indicative, Nov 2026 — your quote locks the figure.
      </p>
    </div>
  );
}
