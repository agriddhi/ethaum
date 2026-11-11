import Link from "next/link";
import { LogoMark } from "./site-nav";
import DemoChat from "./demo-chat";

const columns: Array<[string, Array<[string, string]>]> = [
  [
    "Patients",
    [
      ["How it works", "/#how-it-works"],
      ["Packages, all-in", "/packages"],
      ["Browse treatments", "/treatments"],
      ["Meet our doctors", "/doctors"],
      ["Hospitals audited", "/hospitals"],
      ["Care buddies (verified patients)", "/care-buddies"],
      ["Clinical brief for your doctor", "/doctor-summary"],
      ["Compare all-in quotes", "/quotes/compare"],
      ["Book & pay securely", "/booking"],
      ["Virtual consultation", "/consult"],
      ["In-hospital stay", "/treatment"],
      ["Aftercare & follow-ups", "/aftercare"],
    ],
  ],
  [
    "Destinations",
    [
      ["India", "/destinations/india"],
      ["Thailand", "/destinations/thailand"],
      ["Singapore", "/destinations/singapore"],
      ["Turkey", "/destinations/turkey"],
      ["Malaysia", "/destinations/malaysia"],
      ["UAE", "/destinations/uae"],
    ],
  ],
  [
    "EthAum",
    [
      ["Market research & benchmarks", "/market-research"],
      ["Reviews (verified)", "/reviews"],
      ["Help centre", "/help"],
      ["Privacy & data promise", "/privacy"],
      ["Become a partner hospital", "/provider"],
      ["Press & investors", "/about"],
    ],
  ],
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-sage-mist">
      {/* assurance bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 md:justify-between">
          <span className="inline-flex items-center gap-2"><Dot /> 640+ JCI / NABH hospitals</span>
          <span className="inline-flex items-center gap-2"><Dot /> GDPR &amp; DPDP aligned records</span>
          <span className="inline-flex items-center gap-2"><Dot /> ISO 27001-ready infra</span>
          <span className="inline-flex items-center gap-2"><Dot /> 100% refundable ₹9,999 token</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-10 w-10" />
            <span className="font-display text-2xl font-semibold text-oat">EthAum</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            The patient-centric international healthcare marketplace — discovery, records,
            AI-matched providers, transparent quotes and aftercare, in one coordinated journey.
          </p>
          <p className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] leading-5 text-white/55">
            EthAum coordinates care; it does not replace doctors. All providers are independently
            accredited. Demo build — hospital figures shown are illustrative.
          </p>
        </div>

        {columns.map(([title, links]) => (
          <nav key={title} className="md:col-span-2" aria-label={title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber">{title}</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/65 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber">Support &amp; sign in</p>
          <p className="mt-3 text-sm text-white/70">
            24×7 care coordinators<br />
            <span className="text-white/50">demo build — no live phone line</span>
          </p>
          <DemoChat label="Chat with a coordinator" className="mt-4" />
          <Link
            href="/signin"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-oat transition-colors hover:bg-white/10"
          >
            Sign in / my account
          </Link>
          <p className="mt-4 text-[11px] leading-5 text-white/45">
            Medical emergencies: always call your local emergency number first.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-[11px] text-white/40">
          <p>© 2026 EthAum Health Pvt Ltd · CIN U85100KA2026PTC000000 · Bengaluru, India</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white/70">Terms</Link>
            <Link href="/privacy" className="hover:text-white/70">Privacy</Link>
            <Link href="/disclaimer" className="hover:text-white/70">Medical disclaimer</Link>
            <Link href="/market-research" className="hover:text-white/70">Research</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />;
}
