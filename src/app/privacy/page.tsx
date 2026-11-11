import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Privacy & data promise — EthAum",
  description: "How EthAum handles patient data: per-hospital consent, revocable sharing, encryption at rest, DPDP-aligned, never sold.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Privacy", "/privacy"]]}
        eyebrow="Our data promise"
        title="Your records are yours. Sharing is a decision, not a default."
        sub="EthAum is a coordination layer. We hold the minimum needed to arrange care, for as long as it takes, and never sell it."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          {[
            ["Consent per hospital, revocable", "Records are shared only with the hospitals you explicitly approve, only for that episode of care. One tap revokes it — the hospital loses access immediately."],
            ["Encrypted at rest, minimised in transit", "Documents are stored encrypted (AES-256) and transferred over TLS. We keep the file you sent plus the AI's structured summary, nothing extra."],
            ["Never sold, never advertised", "We do not sell patient data, and we do not use it for advertising. The hospital pays us a disclosed referral fee; the patient pays nothing extra."],
            ["Aligned to DPDP and GDPR", "Access, correction and erasure on request. In this demo build there is no server at all: your session, case and quotes live in your own browser and disappear when you clear it."],
            ["You can take it with you", "Your account page exports everything we hold as a JSON file in one click. Records, quotes and journey history are yours, in a format you can read without us."],
            ["Emergency reality", "In a genuine medical emergency, treat first and tell us later. Coordination must never delay care — and in this build we publish no phone number, because a demo must never ring a stranger."],
          ].map(([t, d]) => (
            <section key={t} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
              <h2 className="font-display text-lg font-semibold text-forest-ink">{t}</h2>
              <p className="mt-1.5 text-[13px] leading-6 text-charcoal/85">{d}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-[11px] leading-5 text-slate">
          Illustrative demo built by kairo-aeon-tech. See also the{" "}
          <Link href="/disclaimer" className="font-semibold text-forest underline">medical disclaimer</Link> and{" "}
          <Link href="/about" className="font-semibold text-forest underline">about the team</Link>.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
