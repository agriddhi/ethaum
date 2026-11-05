import Link from "next/link";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/ethaum-mark.svg" alt="EthAum logo" className={className} width={44} height={44} />
  );
}

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50">
      {/* utility bar */}
      <div className="hidden md:block bg-forest-ink text-[11px] tracking-wide text-sage-mist">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <p className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
              24×7 care coordinators · +91 8047 190 000
            </span>
            <span className="hidden lg:inline text-sage-mist/60">|</span>
            <span className="hidden lg:inline">Visa letters in 48h · Airport pickup · Halal &amp; Jain meals</span>
          </p>
          <nav className="flex items-center gap-4" aria-label="Utility">
            <Link href="/market-research" className="inline-flex items-center gap-1.5 text-amber transition-colors hover:text-oat">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
                <path d="M2 13.5h12v1.5H2zM3 11h2.5V6H3zm4 0h2.5V2h-2.5zm4 0H13.5v-7H11z" />
              </svg>
              Market research: how we compare
            </Link>
            <Link href="/provider" className="transition-colors hover:text-oat">I&apos;m a provider →</Link>
          </nav>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-forest/10 bg-oat/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="EthAum home">
            <LogoMark className="h-9 w-9" />
            <span className="leading-none">
              <span className="block font-display text-[26px] font-semibold tracking-tight text-forest-ink">
                EthAum
              </span>
              <span className="mt-0.5 hidden text-[9.5px] font-medium uppercase tracking-[0.18em] text-slate sm:block">
                Care beyond borders
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 text-[13.5px] font-medium text-charcoal lg:flex" aria-label="Primary">
            <Link href="/treatments" className="transition-colors hover:text-forest">Treatments</Link>
            <Link href="/destinations" className="transition-colors hover:text-forest">Destinations</Link>
            <Link href="/hospitals" className="transition-colors hover:text-forest">Hospitals</Link>
            <Link href="/help" className="transition-colors hover:text-forest">Help centre</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/signin"
              className="hidden text-[13px] font-semibold text-forest transition-colors hover:text-forest-deep md:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/case/new"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-forest px-4 text-[13px] font-semibold text-oat shadow-sm transition-all hover:bg-forest-deep hover:shadow-md sm:px-5"
            >
              Start your case
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </Link>
            {/* mobile menu toggle */}
            <details className="relative lg:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-forest/15 text-forest [&::-webkit-details-marker]:hidden" aria-label="Menu">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>
              <div className="absolute right-0 top-12 w-64 rounded-2xl border border-forest/10 bg-white p-3 shadow-float">
                {[
                  ["Treatments", "/treatments"],
                  ["Destinations", "/destinations"],
                  ["Hospitals", "/hospitals"],
                  ["Market research", "/market-research"],
                  ["Help centre", "/help"],
                  ["For providers", "/provider"],
                  ["Sign in", "/signin"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-sage-wash">
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
