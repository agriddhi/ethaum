import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import AccountView from "./account-view";

export const metadata: Metadata = {
  title: "Your account — EthAum",
  description:
    "Priya Raghavan's care file: active CABG case, quotes, documents, medical profile, travel preferences and your privacy controls — including one-click data export and account deletion.",
};

export default function AccountPage() {
  return (
    <div className="bg-oat">
      <SiteNav />

      {/* ───────── HEADER BAND ───────── */}
      <section className="relative overflow-hidden bg-forest-ink text-oat">
        <div className="bg-dotgrid bg-hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:pb-16 lg:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-sage-mist/70"
          >
            <Link href="/" className="transition-colors hover:text-oat">
              Home
            </Link>
            <span aria-hidden>›</span>
            <span className="text-amber">Account</span>
          </nav>

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
            Patient account
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your care file,<br />
            <em className="text-amber">in your hands.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            One place for your case, your records and your rights — export
            everything, correct anything, or walk away entirely. Your data is
            yours, always.
          </p>
          <p className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
              Signed in as Priya Raghavan
            </span>
            <span aria-hidden>·</span>
            <span>Illustrative demo data</span>
          </p>
        </div>
      </section>

      {/* ───────── ACCOUNT VIEW (client) ───────── */}
      <AccountView />

      <SiteFooter />
    </div>
  );
}
