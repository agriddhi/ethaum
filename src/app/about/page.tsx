import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import DemoChat from "@/components/demo-chat";

export const metadata: Metadata = {
  title: "About EthAum — built by kairo-aeon-tech",
  description:
    "EthAum is the patient-first international healthcare marketplace built by kairo-aeon-tech: one journey from discovery to aftercare, with hospitals on the same platform.",
};

const DIFFERENTIATORS: Array<[string, string]> = [
  ["One journey, twelve stages", "Discovery → case → records → qualification → matching → quotes → booking → consultation → treatment → aftercare → review → referral. One record, one owner, no handoffs into the void."],
  ["A real two-sided marketplace", "A hospital sends a quote in its partner portal; it appears in the patient's browser live; the patient's decision flips the lead to accepted. One event, both sides, instantly."],
  ["AI that coordinates, never decides", "It classifies records, flags what is missing, scores readiness, ranks hospitals and drafts briefs — and can tell a patient that she should optimise before travelling."],
  ["All-in pricing, audited", "Procedure, implants, ICU-per-day cap, flights, visa, companion, 90 days of follow-ups — itemised, printable, and checked by an AI audit that flags under-scoped quotes."],
  ["Aftercare is the product", "Day-7/30/90 reviews, physio plans, refills to the door, a named nurse and a red-flag triage panel — the part every competitor leaves behind."],
  ["Honest scale", "132 institutions indexed, 8 audited — and the interface says exactly which is which."],
];

export default function AboutPage() {
  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["About", "/about"]]}
        eyebrow="Built by kairo-aeon-tech"
        title="We build for the patient who is scared and far from home."
        sub="EthAum exists because international healthcare is not broken at the operating table — it is broken at every hand-off around it. We are a small team that treated that as a systems problem and shipped the whole journey."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* team */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">The team</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-forest-ink">kairo-aeon-tech</h2>
              <div className="mt-5 flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest font-display text-xl font-bold text-oat">KA</span>
                <div>
                  <p className="text-[14px] font-semibold text-forest-ink">agriddhi</p>
                  <p className="text-[11px] text-slate">Product · clinical journey · research & narrative</p>
                  <a
                    href="https://www.linkedin.com/in/agriddhi/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-forest underline decoration-amber decoration-2 underline-offset-4 hover:text-forest-deep"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.46-2.2 2.96V21h-4V9Z" />
                    </svg>
                    linkedin.com/in/agriddhi
                  </a>
                </div>
              </div>
              <p className="mt-5 text-[13px] leading-6 text-charcoal/85">
                We came to this problem from the patient side. Every one of us has watched a
                relative negotiate a surgical quote across three time zones, in a language that
                was not theirs, with no way to check whether the number was fair. EthAum is the
                tool we wished we had.
              </p>
              <DemoChat label="Talk to the team (demo concierge)" variant="light" className="mt-5" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">What we believe</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-forest-ink">Six things we refuse to compromise</h2>
            <ul className="mt-5 space-y-3">
              {DIFFERENTIATORS.map(([t, d]) => (
                <li key={t} className="rounded-2xl border border-forest/10 bg-white p-4 shadow-card">
                  <p className="text-[13px] font-bold text-forest-ink">{t}</p>
                  <p className="mt-1 text-[12px] leading-6 text-charcoal/85">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* honesty */}
        <div className="mt-10 rounded-3xl border border-amber/40 bg-amber-wash/50 p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">What this build is, honestly</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-[13px] font-bold text-forest-ink">It is</p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] leading-6 text-charcoal/85">
                <li>· A working end-to-end marketplace: state persists across pages, reloads and two browser tabs.</li>
                <li>· A two-sided platform — patient app and hospital partner portal on one contract.</li>
                <li>· A real AI endpoint with a rules fallback, so it never breaks on stage.</li>
                <li>· Honest about scale: 132 institutions indexed, 8 audited, and labelled as such.</li>
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-bold text-forest-ink">It is not</p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] leading-6 text-charcoal/85">
                <li>· A database-backed production service — the demo runs entirely in the browser.</li>
                <li>· A source of medical advice — EthAum coordinates; accredited hospitals treat.</li>
                <li>· A place where real patient data lives — no real records, no real payments, no phone numbers.</li>
                <li>· A claim that our prices are live — every figure is illustrative until a hospital confirms it in writing.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/market-research" className="inline-flex h-11 items-center rounded-full bg-forest px-5 text-[13px] font-bold text-oat hover:bg-forest-deep">Read the benchmarking study</Link>
            <Link href="/case/new" className="inline-flex h-11 items-center rounded-full border border-forest/20 bg-white px-5 text-[13px] font-semibold text-forest hover:bg-sage-wash">Walk the journey yourself</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
