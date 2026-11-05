import Link from "next/link";
import { LogoMark } from "./site-nav";

const columns: Array<[string, Array<[string, string]>]> = [
  [
    "Patients",
    [
      ["How it works", "/#how-it-works"],
      ["Browse treatments", "/treatments"],
      ["Compare all-in quotes", "/quotes/compare"],
      ["Book & pay securely", "/booking"],
      ["Virtual consultation", "/consult"],
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber">Emergency &amp; support</p>
          <p className="mt-3 text-sm text-white/70">
            24×7 care coordinators<br />
            <a href="tel:+918047190000" className="font-semibold text-oat hover:underline">+91 8047 190 000</a>
          </p>
          <a
            href="https://wa.me/918047190000?text=Hi%20EthAum%2C%20I%20need%20help%20with%20my%20case"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-[#0b3b21] transition-transform hover:scale-[1.02]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M20.5 3.5A11 11 0 0 0 2.6 16.6L2 22l5.6-.6a11 11 0 0 0 12.9-17.9Zm-8.4 17.4a9 9 0 0 1-4.6-1.3l-.3-.2-3.3.4.4-3.2-.2-.3a9 9 0 1 1 8 4.6Zm5-6.8c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1a7.4 7.4 0 0 1-2.2-1.4 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.7l.4-.5c.1-.2.2-.4.3-.6.1-.2 0-.5 0-.7l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.3 2.4 3.6 5.7 5 3.4 1.4 3.4 1 4 0 .6-.9 2-2.3 2.3-2.9.3-.6.3-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z"/>
            </svg>
            Chat on WhatsApp
          </a>
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
