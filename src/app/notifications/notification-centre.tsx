"use client";

import { useMemo, useState } from "react";
import { NOTIFICATIONS } from "@/data/ethaum";

type Kind = (typeof NOTIFICATIONS)[number]["kind"];
type Filter = "all" | Kind;

const KIND_META: Record<Kind, { label: string; plural: string }> = {
  quote: { label: "Quote", plural: "Quotes" },
  consult: { label: "Consult", plural: "Consults" },
  travel: { label: "Travel", plural: "Travel" },
  record: { label: "Record", plural: "Records" },
  aftercare: { label: "Aftercare", plural: "Aftercare" },
  med: { label: "Medicine", plural: "Medicine" },
};

const FILTERS: Filter[] = ["all", "quote", "consult", "travel", "record", "aftercare", "med"];

/* Initially, the two newest notifications are unread */
const INITIAL_UNREAD = [1, 2];

export default function NotificationCentre() {
  const [filter, setFilter] = useState<Filter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [readIds, setReadIds] = useState<ReadonlySet<number>>(
    () => new Set(NOTIFICATIONS.filter((n) => !INITIAL_UNREAD.includes(n.id)).map((n) => n.id)),
  );

  const unreadCount = useMemo(
    () => NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length,
    [readIds],
  );

  const counts = useMemo(() => {
    const map = new Map<Kind, number>();
    for (const n of NOTIFICATIONS) map.set(n.kind, (map.get(n.kind) ?? 0) + 1);
    return map;
  }, []);

  const visible = useMemo(
    () =>
      NOTIFICATIONS.filter((n) => {
        if (filter !== "all" && n.kind !== filter) return false;
        if (unreadOnly && readIds.has(n.id)) return false;
        return true;
      }),
    [filter, unreadOnly, readIds],
  );

  const markAllRead = () => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  const toggleRead = (id: number) =>
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16" aria-label="Your notifications">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate" role="status" aria-live="polite">
          {unreadCount === 0 ? (
            <span className="inline-flex items-center gap-1.5 text-mint-deep">
              <svg viewBox="0 0 14 14" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.4 7.3 5.6 10.3 11.6 3.6" />
              </svg>
              All caught up
            </span>
          ) : (
            `${unreadCount} unread of ${NOTIFICATIONS.length}`
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setUnreadOnly((v) => !v)}
            aria-pressed={unreadOnly}
            className={`h-9 rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
              unreadOnly
                ? "bg-forest text-oat"
                : "border border-forest/20 text-forest hover:bg-sage-wash"
            }`}
          >
            Unread only
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-forest px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-oat transition-all hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2.4 7.3 5.6 10.3 11.6 3.6" />
            </svg>
            Mark all as read
          </button>
        </div>
      </div>

      {/* kind filter chips */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
        {FILTERS.map((f) => {
          const active = filter === f;
          const n = f === "all" ? NOTIFICATIONS.length : (counts.get(f) ?? 0);
          const label = f === "all" ? "All" : KIND_META[f].plural;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                active
                  ? "bg-forest text-oat shadow-sm"
                  : "border border-forest/15 bg-white text-forest hover:border-forest/35 hover:bg-sage-wash"
              }`}
            >
              {label} <span className={active ? "text-oat/70" : "text-slate"}>· {n}</span>
            </button>
          );
        })}
      </div>

      {/* list or empty state */}
      {visible.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-forest/25 bg-white/60 px-6 py-14 text-center">
          <EmptyIllustration />
          <h2 className="mt-6 font-display text-2xl font-semibold text-forest-ink">
            All caught up.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate">
            {unreadOnly
              ? "No unread notifications match this filter. Nice — everything is dealt with."
              : "Nothing here yet. When your case moves, you'll hear it first — here, and on WhatsApp if you opt in."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {unreadOnly && (
              <button
                type="button"
                onClick={() => setUnreadOnly(false)}
                className="inline-flex h-11 items-center rounded-full border border-forest/25 px-5 text-sm font-semibold text-forest transition-colors hover:bg-sage-wash"
              >
                Show read too
              </button>
            )}
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="inline-flex h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-oat transition-colors hover:bg-forest-deep"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((n) => {
            const unread = !readIds.has(n.id);
            return (
              <li
                key={n.id}
                className={`group relative flex items-start gap-4 rounded-2xl border p-4 shadow-card transition-all sm:p-5 ${
                  unread
                    ? "border-mint-deep/30 bg-white"
                    : "border-forest/10 bg-white/70"
                }`}
              >
                {/* unread dot */}
                {unread && (
                  <span
                    className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-amber-deep"
                    role="status"
                    aria-label="Unread notification"
                    title="Unread"
                  />
                )}
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    unread ? "bg-mint-wash text-mint-deep" : "bg-sage-wash text-forest"
                  }`}
                >
                  <KindIcon kind={n.kind} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-6">
                    <span className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-amber-deep">
                      {KIND_META[n.kind].label}
                    </span>
                    <span aria-hidden className="text-slate/40">·</span>
                    <time className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate">
                      {n.time}
                    </time>
                  </div>
                  <h2 className="mt-1.5 text-[15px] font-bold leading-snug text-forest-ink">
                    {n.t}
                  </h2>
                  <p className="mt-1 text-[13px] leading-6 text-slate">{n.d}</p>
                  <button
                    type="button"
                    onClick={() => toggleRead(n.id)}
                    className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-forest/70 underline decoration-amber decoration-2 underline-offset-4 transition-colors hover:text-forest"
                  >
                    {unread ? "Mark as read" : "Mark as unread"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-center text-[10.5px] text-slate">
        Demo dataset — notifications illustrate the real flow. EthAum never shares
        your details with hospitals until you tap “Request quote”.
      </p>
    </section>
  );
}

/* ─── simple inline SVG empty-state illustration ─── */
function EmptyIllustration() {
  return (
    <svg viewBox="0 0 120 84" className="mx-auto h-20 w-28 text-sage-mist" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* inbox tray */}
      <path d="M8 46h24l6 9h44l6-9h24" className="text-sage-mist" />
      <path d="M14 46V22a6 6 0 0 1 6-6h80a6 6 0 0 1 6 6v24" />
      {/* bell, quiet */}
      <path d="M60 26a10 10 0 0 1 10 10c0 6 2 8 4 10H46c2-2 4-4 4-10a10 10 0 0 1 10-10Z" className="text-forest/50" />
      <path d="M56 52a4 4 0 0 0 8 0" className="text-forest/50" />
      {/* z z z */}
      <path d="M84 12h7l-7 8h7" className="text-amber-deep" />
      <path d="M98 4h9l-9 10h9" className="text-amber-deep" />
    </svg>
  );
}

/* ─── per-kind icons (stroke style) ─── */
function KindIcon({ kind }: { kind: Kind }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "quote": // document
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5" />
          <path d="M9.5 13h5M9.5 16.5h3.5" />
        </svg>
      );
    case "consult": // stethoscope
      return (
        <svg {...common}>
          <path d="M6 3v5.5a4 4 0 0 0 8 0V3" />
          <path d="M4.5 3h3M12.5 3h3" />
          <path d="M10 12.5v2a5 5 0 0 0 5 5 4.5 4.5 0 0 0 4.5-4.5v-2.5" />
          <circle cx="19.5" cy="10.5" r="1.6" />
        </svg>
      );
    case "travel": // plane
      return (
        <svg {...common}>
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
        </svg>
      );
    case "record": // file
      return (
        <svg {...common}>
          <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z" />
          <path d="M13 3v6h6" />
          <path d="M9.5 14.5h5M9.5 17h5M9.5 12h1.5" />
        </svg>
      );
    case "aftercare": // heart
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.6-7-9.5A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 3.5C19 15.4 12 20 12 20Z" />
          <path d="M6.5 12h2l1-2 1.4 3.4 1.4-2.4h2.2" />
        </svg>
      );
    case "med": // pill
      return (
        <svg {...common}>
          <rect x="2.6" y="8.4" width="18.8" height="7.6" rx="3.8" transform="rotate(-45 12 12.2)" />
          <path d="m8.7 8.7 6.6 6.6" />
        </svg>
      );
  }
}
