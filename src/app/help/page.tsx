import type { Metadata } from "next";
import Link from "next/link";
import DemoChat from "@/components/demo-chat";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import FaqExplorer from "./faq-explorer";

export const metadata: Metadata = {
  title: "Help centre — EthAum",
  description:
    "Straight answers on cost, safety, visas, records, recovery and privacy — written with EthAum's medical advisers and reviewed monthly. Search 24 plain-English answers before you commit to treatment abroad.",
};

export default function HelpPage() {
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
            <span className="text-amber">Help centre</span>
          </nav>

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
            Help centre · 24 honest answers
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Real answers,<br />
            <em className="text-amber">before you commit.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            No sales scripts — just plain answers on cost, safety, visas, records,
            recovery and your rights. Written with our medical advisers and real
            patients, reviewed monthly.
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

      {/* ───────── SEARCH + FAQ EXPLORER (client) ───────── */}
      <FaqExplorer />

      {/* ───────── STILL STUCK + AI NOTE ───────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* WhatsApp coordinator */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-forest-deep p-6 text-oat shadow-card sm:p-8 lg:col-span-2">
            <div className="bg-dotgrid absolute inset-0 opacity-60" aria-hidden />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
                Still stuck?
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold leading-snug sm:text-3xl">
                WhatsApp a coordinator —<br />
                a human, not a bot.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
                Tell us your situation in your own words. We&apos;ll tell you honestly
                whether travelling is worth it — even if the honest answer is
                &ldquo;stay home and see your local doctor.&rdquo; Free, no pressure, never
                a sales call.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <DemoChat label="Chat with a coordinator" />
                <Link
                  href="/signin"
                  className="inline-flex h-12 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-oat transition-colors hover:border-mint hover:text-mint"
                >
                  Create an account
                </Link>
              </div>
              <p className="mt-5 text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                24×7 · Median first response under 3 minutes · Illustrative demo data
              </p>
            </div>
          </div>

          {/* AI disclaimer */}
          <aside className="rounded-3xl border border-amber/40 bg-amber-wash/60 p-6 sm:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber text-forest-ink">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                <path d="M10 14v1.5a5 5 0 0 0 5 5 4 4 0 0 0 4-4V14" />
                <circle cx="19" cy="11.5" r="1.5" />
                <path d="M4.5 4h3M8.5 4h3" />
              </svg>
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-forest-ink">
              AI can&apos;t replace doctors.
            </h2>
            <p className="mt-2 text-sm leading-6 text-charcoal/85">
              EthAum AI organises records, flags missing tests and drafts questions
              for your surgeon. It never diagnoses, never changes a prescription and
              never overrules a clinician. Every clinical decision on your case is
              made — or approved — by a human doctor.
            </p>
            <Link
              href="/#how-it-works"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-forest underline decoration-amber decoration-2 underline-offset-4 hover:text-forest-deep"
            >
              See how AI fits into your journey
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </Link>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
