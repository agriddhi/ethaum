import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import ReviewForm from "./review-form";
import { REVIEWS } from "@/data/ethaum";

export const metadata: Metadata = {
  title: "Verified patient voices — EthAum reviews",
  description:
    "Read reviews written only by patients whose treatment EthAum coordinated — cross-checked against hospital records before publishing. 4.8/5 across 8,300 verified reviews (illustrative demo data).",
};

const DISTRIBUTION: Array<{ star: number; count: number }> = [
  { star: 5, count: 6900 },
  { star: 4, count: 900 },
  { star: 3, count: 250 },
  { star: 2, count: 90 },
  { star: 1, count: 160 },
];

const TOTAL_REVIEWS = DISTRIBUTION.reduce((sum, d) => sum + d.count, 0);

export default function ReviewsPage() {
  return (
    <div className="bg-oat">
      <SiteNav />

      {/* ───────── HEADER BAND ───────── */}
      <section className="relative overflow-hidden bg-forest-ink text-oat">
        <div className="bg-dotgrid bg-hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:pb-20 lg:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-sage-mist/70"
          >
            <Link href="/" className="transition-colors hover:text-oat">
              Home
            </Link>
            <span aria-hidden>›</span>
            <span className="text-amber">Reviews</span>
          </nav>

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
            Verified patient voices
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Not curated.<br />
            <em className="text-amber">Cross-checked.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Every review here is written by a patient whose treatment EthAum
            coordinated — then verified against the hospital&apos;s admission file
            before it goes live. No paid placements, no anonymous rants, no edits
            for tone.
          </p>
          <p className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
              Updated Nov 2026
            </span>
            <span aria-hidden>·</span>
            <span>Illustrative demo data</span>
          </p>
        </div>
      </section>

      {/* ───────── SUMMARY + GRID ───────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* rating summary card */}
          <aside className="lg:col-span-4">
            <div className="h-full rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">
                Overall rating
              </p>
              <div className="mt-4 flex items-end gap-4">
                <p className="font-display text-7xl font-semibold leading-none text-forest-ink">
                  4.8
                </p>
                <div className="pb-1.5">
                  <Stars rating={4.8} large />
                  <p className="mt-1.5 text-[11px] font-semibold text-slate">
                    {TOTAL_REVIEWS.toLocaleString("en-IN")} verified reviews
                  </p>
                </div>
              </div>

              {/* distribution bars */}
              <div className="mt-6 space-y-2.5" aria-label="Rating distribution">
                {DISTRIBUTION.map(({ star, count }) => {
                  const pct = Math.round((count / TOTAL_REVIEWS) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-6 text-right text-[12px] font-bold tabular-nums text-charcoal">
                        {star}★
                      </span>
                      <div
                        className="h-2.5 flex-1 overflow-hidden rounded-full bg-sage-wash"
                        role="img"
                        aria-label={`${star} star: ${count.toLocaleString("en-IN")} reviews (${pct}%)`}
                      >
                        <div
                          className="h-full rounded-full bg-forest"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-[11px] tabular-nums text-slate">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <dl className="mt-6 border-t border-forest/10 pt-5 text-[12px] leading-6 text-slate">
                <div className="flex items-center justify-between gap-3">
                  <dt>Would recommend EthAum</dt>
                  <dd className="font-bold text-forest-deep">96%</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Quote matched final bill</dt>
                  <dd className="font-bold text-forest-deep">98%</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Coordinator rated &ldquo;excellent&rdquo;</dt>
                  <dd className="font-bold text-forest-deep">92%</dd>
                </div>
              </dl>
              <p className="mt-4 text-[10px] leading-4 text-slate/80">
                Illustrative demo data — distribution modelled on EthAum&apos;s
                verified-review base, Nov 2026. Individual reviews below are real
                entries from the demo dataset.
              </p>
            </div>
          </aside>

          {/* review cards */}
          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {REVIEWS.map((r) => (
                <figure
                  key={`${r.name}-${r.date}`}
                  className="flex flex-col rounded-2xl border border-forest/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-forest/25"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Stars rating={r.rating} />
                    <time className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate">
                      {r.date}
                    </time>
                  </div>
                  <blockquote className="mt-3 flex-1 text-[13.5px] leading-6 text-charcoal/90">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 border-t border-forest/10 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold leading-snug text-forest-ink">
                          {r.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate">
                          {r.city} · {r.treatment}
                        </p>
                        <p className="text-[11px] text-slate">{r.hospital}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-mint-deep/30 bg-mint-wash px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-mint-deep">
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2 6.2 4.6 8.8 10 3.2" />
                        </svg>
                        {r.tag}
                      </span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-right text-[10.5px] text-slate">
              Showing all {REVIEWS.length} featured reviews from the demo dataset · Illustrative demo data
            </p>
          </div>
        </div>
      </section>

      {/* ───────── WRITE YOUR REVIEW ───────── */}
      <section className="border-t border-forest/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">
              Add your voice
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-forest-ink sm:text-4xl">
              Write your review —<br />
              <em className="text-forest">if you were there.</em>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-charcoal/85">
              We publish reviews only after cross-checking your admission with the
              hospital. Your name appears as you write it — first name and last
              initial is fine. Honest 4-star reviews help the next patient more
              than a perfect 5.
            </p>
            <ol className="mt-7 space-y-3 text-[13px] leading-6 text-charcoal">
              {[
                "You submit — takes about two minutes",
                "EthAum verifies your admission & procedure with the hospital",
                "Published within 7 working days, unedited — good or bad",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest font-display text-[12px] font-bold text-oat">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-2xl border border-forest/10 bg-oat px-4 py-3 text-[11px] leading-5 text-slate">
              Demo build: the form validates locally and stores nothing — no
              review is sent, saved or shared.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ReviewForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ─── star row (integer + fractional fill) ─── */
function Stars({ rating, large = false }: { rating: number; large?: boolean }) {
  const size = large ? "h-6 w-6" : "h-4 w-4";
  const pct = Math.min(100, Math.max(0, (rating / 5) * 100));
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      <span className="flex gap-0.5 text-sage-mist" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={size} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${size} shrink-0`} />
        ))}
      </span>
    </span>
  );
}

function Star({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
