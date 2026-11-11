"use client";

import { useEffect, useState } from "react";

/** Shows a live-ish FX snapshot for INR with graceful fallback. */
export default function LiveRates() {
  const [text, setText] = useState("₹1 = $0.0114 · ฿0.40 · S$0.0152");

  useEffect(() => {
    const controller = new AbortController();
    const t = window.setTimeout(() => controller.abort(), 4000);
    fetch("https://open.er-api.com/v6/latest/INR", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.rates) return;
        const usd = d.rates.USD?.toFixed(4);
        const thb = d.rates.THB?.toFixed(2);
        const sgd = d.rates.SGD?.toFixed(4);
        const try_ = d.rates.TRY?.toFixed(2);
        if (usd && thb && sgd) setText(`₹1 = $${usd} · ฿${thb} · S$${sgd}${try_ ? ` · ${try_} ₺` : ""}`);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(t));
    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, []);

  return (
    <span className="hidden xl:inline-flex items-center gap-1.5 text-sage-mist/80" title="Indicative FX · refreshes hourly">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M2 8h12M8 2v12" strokeLinecap="round" />
        <circle cx="8" cy="8" r="6.5" />
      </svg>
      <span className="tabular-nums">{text}</span>
    </span>
  );
}
