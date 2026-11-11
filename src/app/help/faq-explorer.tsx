"use client";

import { useMemo, useState } from "react";
import { FAQS } from "@/data/ethaum";

const CATEGORIES = [
  "All",
  "General",
  "Money",
  "Trust",
  "Privacy",
  "Travel",
  "Recovery",
  "Safety",
  "Ethics",
] as const;

type Category = (typeof CATEGORIES)[number];

export default function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [open, setOpen] = useState<number[]>([0]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const f of FAQS) map.set(f.cat, (map.get(f.cat) ?? 0) + 1);
    return map;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, index: i })).filter((f) => {
      if (category !== "All" && f.cat !== category) return false;
      if (!q) return true;
      return (
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.cat.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const toggle = (index: number) =>
    setOpen((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16" aria-label="Search frequently asked questions">
      {/* search input */}
      <label className="relative block">
        <span className="sr-only">Search questions and answers</span>
        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="9" cy="9" r="6.5" />
          <path d="m14.5 14.5 3.5 3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search answers — try “visa”, “EMI”, “ICU”, “penicillin”…"
          className="h-14 w-full rounded-2xl border border-forest/15 bg-white pl-[3.25rem] pr-14 text-[15px] text-charcoal shadow-card outline-none transition-colors placeholder:text-slate/70 focus:border-forest"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate transition-colors hover:bg-sage-wash hover:text-forest"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </label>

      {/* category chips */}
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          const n = cat === "All" ? FAQS.length : (counts.get(cat) ?? 0);
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                active
                  ? "bg-forest text-oat shadow-sm"
                  : "border border-forest/15 bg-white text-forest hover:border-forest/35 hover:bg-sage-wash"
              }`}
            >
              {cat} <span className={active ? "text-oat/70" : "text-slate"}>· {n}</span>
            </button>
          );
        })}
      </div>

      {/* result count */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-b border-forest/10 pb-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "answer" : "answers"}
          {category !== "All" ? ` in ${category}` : ""}
          {query.trim() ? ` for “${query.trim()}”` : ""}
        </p>
        <span className="rounded-full bg-sage-wash px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-forest">
          Illustrative demo data
        </span>
      </div>

      {/* results — accordion */}
      {results.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-forest/25 bg-white/60 p-10 text-center">
          <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14 text-sage-mist" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="21" cy="21" r="12" />
            <path d="m30 30 9 9" />
            <path d="M16 21h10" />
          </svg>
          <h2 className="mt-4 font-display text-xl font-semibold text-forest-ink">
            Nothing matches “{query.trim()}” yet.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate">
            Try a shorter word — “visa”, “EMI”, “ICU”, “refund” — or browse a
            category above. Still stuck? A coordinator can answer in minutes.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 inline-flex h-11 items-center rounded-full border border-forest/25 px-5 text-sm font-semibold text-forest transition-colors hover:bg-sage-wash"
          >
            Clear search &amp; filters
          </button>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-forest/10 overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card">
          {results.map((f) => {
            const isOpen = open.includes(f.index);
            const panelId = `faq-panel-${f.index}`;
            return (
              <li key={f.index}>
                <button
                  type="button"
                  onClick={() => toggle(f.index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-oat/60 sm:px-7"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-amber-deep">
                      {f.cat}
                    </span>
                    <span className="mt-1.5 block font-display text-[17px] font-semibold leading-snug text-forest-ink sm:text-lg">
                      {f.q}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    className={`mt-2 h-4 w-4 shrink-0 text-forest transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>
                {isOpen && (
                  <div id={panelId} role="region" className="animate-fade-slide px-5 pb-6 sm:px-7">
                    <p className="max-w-3xl border-l-2 border-amber/60 pl-4 text-[15px] leading-7 text-charcoal/90">
                      {f.a}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
