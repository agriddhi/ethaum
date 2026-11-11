import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Medical & AI disclaimer — EthAum",
  description:
    "EthAum coordinates international healthcare and does not provide medical advice. Our AI organises and flags; accredited hospitals and your own doctor decide.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Disclaimer", "/disclaimer"]]}
        eyebrow="Read this before you travel"
        title="EthAum coordinates care. It does not provide it."
        sub="Everything on this platform — including the AI — exists to make a journey clearer. Clinical decisions stay with accredited hospitals and your own doctor."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          {[
            ["Not medical advice", "Nothing here is a diagnosis, a treatment recommendation or a substitute for consultation with a licensed doctor. Quote pages, pre-screen results and match scores are coordination aids only."],
            ["The AI never decides", "Our AI classifies documents, flags missing reports, drafts questions and ranks hospitals by published weights. It never decides that a procedure is needed, and it can tell you that you should wait and optimise before travelling."],
            ["Human review always happens", "Partner surgeons review your file before quotes are issued, and you can request an independent second opinion. Where a hospital disagrees with the clinical picture, the clinician wins — the platform does not override medicine."],
            ["Prices are illustrative until written", "All figures in this demo are indicative and expire. A quote becomes binding only when a hospital confirms it in writing and you e-sign — with a 30-day price lock and a 48-hour refundable token."],
            ["Accreditation is checked, marketing is not", "Eight institutions carry accreditation and audit data we have verified. Catalogue index entries are explicitly illustrative and are labelled as such throughout the site."],
            ["In an emergency", "Contact your local emergency number and the treating hospital first. EthAum coordination runs alongside clinical care and never replaces it."],
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
          <Link href="/privacy" className="font-semibold text-forest underline">privacy promise</Link>.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
