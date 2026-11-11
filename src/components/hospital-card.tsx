import Link from "next/link";
import type { Hospital } from "@/data/ethaum";

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function HospitalCard({ h }: { h: Hospital }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-float">
      <div className="relative flex h-28 items-end justify-between bg-gradient-to-br from-forest to-forest-deep p-4">
        <div className="flex gap-1.5">
          {h.accreditations.map((a) => (
            <span key={a} className="rounded-md border border-amber/50 bg-forest-ink/40 px-2 py-0.5 text-[10px] font-black tracking-[0.2em] text-amber backdrop-blur-sm">
              {a}
            </span>
          ))}
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 font-display text-lg font-bold text-oat backdrop-blur-sm">
          {initials(h.name)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg font-semibold leading-snug text-forest-ink">{h.name}</h2>
        <p className="mt-0.5 text-xs text-slate">{h.city}, {h.country} · est. {h.since}</p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-deep">{h.flagship}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {h.specialties.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-sage-wash px-2 py-0.5 text-[10px] font-medium text-forest">{s}</span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-charcoal/80"><span className="font-semibold text-forest-deep">Best for:</span> {h.bestFor}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-forest/10 pt-4">
          <p className="text-[11px] text-slate">★ <span className="font-bold text-forest-deep">{h.rating}</span> · {h.reviews.toLocaleString("en-IN")} reviews</p>
          <Link href={`/hospitals/${h.slug}`} className="rounded-full border border-forest/20 px-3.5 py-1.5 text-[11px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat">
            Profile →
          </Link>
        </div>
      </div>
    </article>
  );
}
