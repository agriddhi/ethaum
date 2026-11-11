import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import NotificationCentre from "./notification-centre";

export const metadata: Metadata = {
  title: "Notification centre — EthAum",
  description:
    "Everything that needs you — quote approvals, visa letters, parsed lab reports, physio plans and refill reminders — in one quiet place. No marketing, no noise.",
};

export default function NotificationsPage() {
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
            <span className="text-amber">Notifications</span>
          </nav>

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
            Notification centre
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Everything that needs you —<br />
            <em className="text-amber">nothing that doesn&apos;t.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Quote approvals, visa letters, parsed lab reports, physio plans and
            refill reminders — in one quiet place. EthAum never sends marketing
            without your written opt-in.
          </p>
          <p className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
              Synced just now
            </span>
            <span aria-hidden>·</span>
            <span>Illustrative demo data</span>
          </p>
        </div>
      </section>

      {/* ───────── NOTIFICATION CENTRE (client) ───────── */}
      <NotificationCentre />

      <SiteFooter />
    </div>
  );
}
