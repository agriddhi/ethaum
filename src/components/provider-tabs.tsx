"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    label: "Inbox",
    href: "/provider",
    icon: (
      <path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5M3 13l3.2-7.2A2 2 0 0 1 8 4.6h8a2 2 0 0 1 1.8 1.2L21 13M3 13h6l1.5 2.5h3L15 13h6" />
    ),
  },
  {
    label: "Quote builder",
    href: "/provider/quote-builder",
    icon: (
      <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v4h4M9.5 12h5M9.5 15.5h5M9.5 8.5h2" />
    ),
  },
  {
    label: "Appointments",
    href: "/provider/appointments",
    icon: (
      <path d="M8 2v4M16 2v4M3.5 9h17M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm4.5 10 2 2 4-4.5" />
    ),
  },
] as const;

/**
 * Sidebar-style tab nav for the provider portal — rendered as a top strip
 * on md+ screens. Active state derives from the current pathname.
 */
export default function ProviderTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Partner portal sections"
      className="flex flex-col gap-1.5 rounded-2xl border border-forest/10 bg-white p-1.5 shadow-card sm:flex-row sm:items-center"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold transition-all ${
              active
                ? "bg-forest text-oat shadow-sm"
                : "text-charcoal hover:bg-sage-wash hover:text-forest"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {tab.icon}
            </svg>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
