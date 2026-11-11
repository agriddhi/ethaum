import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Terms of use — EthAum",
  description: "Terms for the EthAum international healthcare marketplace demo.",
};

export default function TermsPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Terms", "/terms"]]}
        eyebrow="Plain English, no traps"
        title="Terms of the EthAum demo"
        sub="A hackathon build with demo data. Written short on purpose — clarity is part of the product."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          {[
            ["This is a demonstration", "EthAum is a working MVP built for a healthcare hackathon. Hospital records beyond the eight audited institutions, catalogue index entries, prices, reviews and doctor profiles are illustrative demo data. Nothing here is a binding quote."],
            ["No payments are processed", "The checkout runs in test mode. No card details are stored, no money moves, and the ₹9,999 token is a simulated escrow step."],
            ["No medical relationship is created", "Using this platform does not create a doctor–patient relationship. Treatment happens between you and the accredited hospital, under its own consent and clinical governance."],
            ["Your data stays on your device", "The session, case and marketplace state live in your browser's local storage. We receive nothing. Clearing browser data removes it permanently."],
            ["How we are paid", "Hospitals pay a referral fee, disclosed in every quote, and the fee is identical across partner institutions. Patients pay nothing to EthAum for comparison or coordination."],
            ["Fair use", "Do not use the demo to submit real patient data, to book real procedures, or to misrepresent quotes. Our in-app concierge chat is scripted and sends nothing."],
          ].map(([t, d]) => (
            <section key={t} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
              <h2 className="font-display text-lg font-semibold text-forest-ink">{t}</h2>
              <p className="mt-1.5 text-[13px] leading-6 text-charcoal/85">{d}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-[11px] leading-5 text-slate">
          Illustrative demo built by kairo-aeon-tech ·{" "}
          <Link href="/about" className="font-semibold text-forest underline">about the team</Link> ·{" "}
          <Link href="/disclaimer" className="font-semibold text-forest underline">medical disclaimer</Link>.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
