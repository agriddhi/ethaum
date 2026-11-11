"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { useSession, saveSession, clearSession, newLocalId } from "@/lib/session";

const DEMO_ACCOUNTS: Record<string, { name: string; city: string }> = {
  "priya@ethaum.demo": { name: "Priya Raghavan", city: "Chennai" },
  "rahul@ethaum.demo": { name: "Rahul Mehta", city: "Mumbai" },
  "coordinator@ethaum.demo": { name: "Anita (EthAum Care)", city: "Bengaluru" },
};

export default function SignInPage() {
  const router = useRouter();
  const session = useSession();
  const [tab, setTab] = useState<"signin" | "create">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const start = (
    sessionName: string,
    sessionEmail: string | undefined,
    sessionCity?: string,
    persona?: "priya" | "rahul",
    existingId?: string
  ) => {
    saveSession({
      name: sessionName,
      email: sessionEmail,
      localId: existingId ?? newLocalId(),
      city: sessionCity,
      role: "patient",
      since: new Date().toISOString(),
    });
    if (persona) window.localStorage.setItem("ethaum-persona", persona);
    router.push("/dashboard");
  };

  if (session) {
    return (
      <div className="bg-oat">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-mint/40 bg-mint-wash/50 p-8 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest font-display text-xl font-bold text-oat">
              {session.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
            <h1 className="mt-5 font-display text-3xl font-semibold text-forest-ink">You&apos;re signed in, {session.name.split(" ")[0]}.</h1>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-charcoal/80">
              Local session on this device only — no database, no password stored, nothing transmitted.
            </p>
            <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-2xl border border-forest/15 bg-white px-5 py-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate">Your session ID</span>
              <span className="font-display text-xl font-semibold text-forest-ink">{session.localId}</span>
            </div>
            <p className="mx-auto mt-3 max-w-md text-[11px] leading-5 text-slate">
              <span className="font-semibold text-amber-deep">Temporary:</span> this build has no auth server, so we minted a local ID in your browser instead of verifying an email. In production this becomes a verified account with cross-device sync — same code path, one backend behind it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full bg-forest px-6 text-sm font-bold text-oat hover:bg-forest-deep">Open my journey</Link>
              <Link href="/account" className="inline-flex h-12 items-center rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">Account &amp; privacy</Link>
              <button
                onClick={() => {
                  clearSession();
                  setError(null);
                }}
                className="inline-flex h-12 items-center rounded-full border border-[#C2452D]/40 px-6 text-sm font-semibold text-[#A83B26] hover:bg-[#FBEFED]"
              >
                Sign out
              </button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Sign in", "/signin"]]}
        eyebrow="Local session · no database"
        title="Your journey, remembered."
        sub="This build signs you in on this device only — email is optional: skip it and we mint a local session ID for you. No account database, no password stored, nothing sent to a server."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-8">
            {/* tabs */}
            <div className="inline-flex rounded-full bg-sage-wash p-1">
              {([["signin", "Sign in"], ["create", "Create account"]] as const).map(([k, label]) => (
                <button key={k} onClick={() => { setTab(k); setError(null); }} aria-pressed={tab === k} className={`rounded-full px-5 py-2 text-[13px] font-bold transition-colors ${tab === k ? "bg-forest text-oat" : "text-forest"}`}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "signin" ? (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const mail = email.trim().toLowerCase();
                  if (!mail) {
                    // No email given — mint a purely local guest session.
                    start("Guest Patient", undefined, undefined, undefined);
                    return;
                  }
                  if (!mail.includes("@")) return setError("That email doesn’t look right — or leave it blank and continue locally.");
                  const known = DEMO_ACCOUNTS[mail];
                  start(known?.name ?? mail.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), mail, known?.city, mail.startsWith("priya") ? "priya" : mail.startsWith("rahul") ? "rahul" : undefined);
                }}
              >
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="email">Email <span className="font-normal normal-case tracking-normal text-slate">(optional in this local build)</span></label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com — or leave blank" className="mt-2 h-12 w-full rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest" />
                  <p className="mt-1.5 text-[10.5px] text-slate">Skip it and we mint a local session ID (like ETH-7F3A) on this device. Demo accounts: <code className="text-forest">priya@ethaum.demo</code> · <code className="text-forest">rahul@ethaum.demo</code></p>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="pw">Password</label>
                  <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="anything — never stored" className="mt-2 h-12 w-full rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest" />
                  <p className="mt-1.5 text-[10.5px] text-slate">Demo build: this field is ignored and never saved. A production build would use magic links.</p>
                </div>
                {error && <p className="rounded-xl border border-[#C2452D]/30 bg-[#FBEFED] px-4 py-3 text-[12px] font-semibold text-[#A83B26]" role="alert">{error}</p>}
                <button type="submit" className="flex h-12 w-full items-center justify-center rounded-full bg-forest text-[15px] font-bold text-oat hover:bg-forest-deep">Sign in →</button>
              </form>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const mail = email.trim().toLowerCase();
                  if (!name.trim()) return setError("Tell us what to call you.");
                  if (mail && !mail.includes("@")) return setError("That email doesn’t look right — or leave it blank and continue locally.");
                  start(name.trim(), mail || undefined, city.trim() || undefined);
                }}
              >
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="name">Full name</label>
                  <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Raghavan" className="mt-2 h-12 w-full rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="cemail">Email <span className="font-normal normal-case tracking-normal text-slate">(optional)</span></label>
                  <input id="cemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com — or leave blank" className="mt-2 h-12 w-full rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="city">City (optional)</label>
                  <input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Chennai" className="mt-2 h-12 w-full rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest" />
                </div>
                {error && <p className="rounded-xl border border-[#C2452D]/30 bg-[#FBEFED] px-4 py-3 text-[12px] font-semibold text-[#A83B26]" role="alert">{error}</p>}
                <button type="submit" className="flex h-12 w-full items-center justify-center rounded-full bg-amber text-[15px] font-bold text-forest-ink hover:bg-amber-deep hover:text-oat">Create my account →</button>
                <p className="text-[10.5px] leading-5 text-slate">No verification email, no SMS, no password. Everything you type stays in this browser until you clear it.</p>
              </form>
            )}
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Skip the form</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Enter as a demo patient</h2>
            <p className="mt-2 text-[13px] leading-6 text-white/70">The homepage, dashboard and quotes are already populated with Priya&apos;s CABG case. One click and you&apos;re inside her journey — including her persona on the homepage.</p>
            <div className="mt-5 space-y-2">
              <button onClick={() => start("Priya Raghavan", "priya@ethaum.demo", "Chennai", "priya")} className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-left transition-colors hover:bg-white/20">
                <span><span className="block text-[13px] font-bold">Continue as Priya</span><span className="block text-[11px] text-white/60">CABG · Chennai · ₹12L budget</span></span>
                <span className="text-[10px] uppercase tracking-widest text-amber">CABG</span>
              </button>
              <button onClick={() => start("Rahul Mehta", "rahul@ethaum.demo", "Mumbai", "rahul")} className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-left transition-colors hover:bg-white/20">
                <span><span className="block text-[13px] font-bold">Continue as Rahul</span><span className="block text-[11px] text-white/60">IVF · Mumbai · ₹6L budget</span></span>
                <span className="text-[10px] uppercase tracking-widest text-amber">IVF</span>
              </button>
              <button onClick={() => start("Anita (EthAum Care)", "coordinator@ethaum.demo", "Bengaluru")} className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-left transition-colors hover:bg-white/20">
                <span><span className="block text-[13px] font-bold">Continue as coordinator</span><span className="block text-[11px] text-white/60">Patient-side view of a care manager</span></span>
                <span className="text-[10px] uppercase tracking-widest text-amber">Staff</span>
              </button>
            </div>
            <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/45">Signing in changes what the site knows about you — the homepage persona, saved case and dashboard all follow the session. That is the whole point of the product, demoed honestly.</p>
          </div>

          <div className="mt-4 rounded-2xl border border-forest/10 bg-white p-5 text-[12px] leading-6 text-charcoal/85 shadow-card">
            <span className="font-bold text-forest-ink">Your data:</span> stored in <code className="rounded bg-sage-wash px-1">localStorage</code> on this device only, under a session ID we mint for you (for example <code className="rounded bg-sage-wash px-1">ETH-7F3A</code>). Clearing browser data removes it instantly. EthAum servers receive nothing — and we would never sell it if we had them.
            <br /><br />
            <span className="font-bold text-amber-deep">Temporary by design:</span> this demo has no auth server. Production swaps the local session for a verified email account with cross-device sync — the screens and contracts don&apos;t change.
          </div>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
}
