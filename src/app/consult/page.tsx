"use client";

import { useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import { updateCase } from "@/lib/case-store";

const QUESTIONS = [
  "Off-pump vs on-pump for my triple-vessel disease?",
  "Can I hold metformin from 10 Nov? What about aspirin?",
  "How soon after surgery can I climb stairs / travel by air?",
  "Which graft (LIMA vs radial) will you use, and why?",
  "Expected ICU stay and physiotherapy start?",
  "What warning signs after discharge need an immediate call?",
];

export default function ConsultPage() {
  const [asked, setAsked] = useState<string[]>(["Off-pump vs on-pump for my triple-vessel disease?"]);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [ended, setEnded] = useState(false);
  const [messages, setMessages] = useState([
    { from: "doc", text: "Namaste Priya — I reviewed your angiogram. LAD is 95%, circumflex 80%, RCA 70%. Off-pump is right for you." },
    { from: "you", text: "Will aspirin continue till surgery? Blood sugar runs 140–180 fasting." },
  ]);
  const [draft, setDraft] = useState("");

  const toggleAsked = (q: string) => setAsked((cur) => (cur.includes(q) ? cur.filter((x) => x !== q) : [...cur, q]));
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "you", text: t }]);
    setDraft("");
    window.setTimeout(() => setMessages((m) => [...m, { from: "doc", text: "Noted — I'll fold that into the operative plan and the orders on day 1." }]), 900);
  };

  if (ended) {
    return (
      <div className="bg-oat">
        <SiteNav />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-wash">
            <svg viewBox="0 0 28 28" className="h-8 w-8 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15.5 11.5 22 23 8" /></svg>
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-forest-ink">Consult complete — notes filed.</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-charcoal/85">Dr. Meera&apos;s summary is in your case file (operative plan, medication changes, admission checklist). A copy goes to your cardiologist in Chennai on request.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full bg-forest px-6 text-sm font-bold text-oat hover:bg-forest-deep">Journey tracker</Link>
            <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">Download summary (PDF)</Link>
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
        crumbs={[["Home", "/"], ["Dashboard", "/dashboard"], ["Consult", "/consult"]]}
        eyebrow="Pre-op · Tue 9:30 IST"
        title="10 minutes with your surgeon."
        sub="Camera on, questions ready. The AI brief is read-aloud ready; you can interject anytime — this is your body, your call."
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12">
        {/* AI brief */}
        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-mint/30 bg-mint-wash p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint-deep">AI pre-consult brief</p>
            <ul className="mt-3 space-y-1.5 text-[12px] leading-snug text-charcoal">
              {["HbA1c 6.4% (Oct) — continue metformin till 10 Nov, hold 48h pre-op", "Creatinine 1.1 — contrast OK for angiogram if needed", "Aspirin 75 — continue; clopidogrel stopped 5d pre-op", "Prior MI 2019 (PCI ×1, LAD) — EF 55% on echo", "Allergies: penicillin → cefazolin safe"].map((t) => <li key={t} className="flex gap-2"><span className="text-mint-deep">▸</span>{t}</li>)}
            </ul>
            <p className="mt-3 text-[10px] leading-5 text-mint-deep/80">Generated from 14 documents · verified by Dr. Meera&apos;s team · not medical advice — decisions stay with the surgeon.</p>
          </div>

          <div className="mt-4 rounded-3xl border border-forest/10 bg-white p-5 shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">Your questions ({asked.length}/{QUESTIONS.length} asked)</p>
            <ul className="mt-3 space-y-2">
              {QUESTIONS.map((q) => {
                const checked = asked.includes(q);
                return (
                  <li key={q}>
                    <button onClick={() => toggleAsked(q)} aria-pressed={checked} className="flex w-full items-start gap-2.5 rounded-xl border border-forest/10 px-3 py-2.5 text-left text-[12px] leading-snug text-charcoal transition-colors hover:border-mint">
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded ${checked ? "bg-mint" : "border border-forest/25"}`}>{checked && <svg viewBox="0 0 10 10" className="h-3 w-3 text-forest-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.7 5.2 4 7.5 8.3 2.3" /></svg>}</span>
                      <span className={checked ? "text-slate line-through" : ""}>{q}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* video + chat */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl bg-forest-ink p-5 sm:h-96">
            <div className="bg-dotgrid absolute inset-0 opacity-40" aria-hidden />
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-mint backdrop-blur-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-mint" />Live · encrypted</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Ref VC-2411-018 · Bumrungrad</span>
            </div>
            <div className="relative flex flex-1 flex-col items-center justify-center">
              <span className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-deep font-display text-4xl font-semibold text-sage-mist ring-4 ring-mint/20 sm:h-36 sm:w-36 sm:text-5xl">MK</span>
              <p className="mt-4 text-lg font-semibold text-oat">Dr. Meera Krishnan</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber">Cardiothoracic · EN · HI</p>
              {/* equalizer */}
              <div className="mt-4 flex h-6 items-end gap-1" aria-hidden>
                {[10, 18, 26, 14, 22, 12, 24, 16, 8, 20, 14, 26, 10].map((h, i) => (
                  <span key={i} className="w-1.5 rounded-full bg-mint/70" style={{ height: `${h}px`, animation: `eq 1.1s ease-in-out ${i * 0.09}s infinite alternate` }} />
                ))}
              </div>
              <style>{`@keyframes eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
            </div>
            <div className="relative flex items-center justify-center gap-3">
              <button onClick={() => setMuted((v) => !v)} aria-pressed={muted} className={`flex h-12 w-12 items-center justify-center rounded-full ${muted ? "bg-amber text-forest-ink" : "bg-white/10 text-oat"}`} aria-label={muted ? "Unmute" : "Mute"}>
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{muted ? <><path d="M3 3l14 14" /><path d="M9 5v6.5m2 4V15M5 10a5 5 0 0 0 5 5m4-8v-1a4 4 0 0 0-7.5-2" /></> : <><path d="M5 10a5 5 0 0 0 5 5m5-5v-1a4 4 0 0 0-8 0v1" /><rect x="8" y="3" width="4" height="7" rx="2" /></>}</svg>
              </button>
              <button onClick={() => setCamOff((v) => !v)} aria-pressed={camOff} className={`flex h-12 w-12 items-center justify-center rounded-full ${camOff ? "bg-amber text-forest-ink" : "bg-white/10 text-oat"}`} aria-label="Toggle camera">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">{camOff ? <><path d="M3 3l14 14" strokeLinecap="round" /><path d="M6 6h7a2 2 0 0 1 2 2v5M4 6a2 2 0 0 0-1 1.7v5.6A2 2 0 0 0 5 15h8" /></> : <><rect x="2.5" y="6" width="10" height="9" rx="2" /><path d="M12.5 10.5 17.5 7v7l-5-3.5" /></>}</svg>
              </button>
              <button onClick={() => { updateCase({ consultDone: true }); setEnded(true); }} className="flex h-12 items-center rounded-full bg-[#C2452D] px-6 text-sm font-bold text-white hover:bg-[#A83B26]">End call</button>
            </div>
          </div>

          {/* chat */}
          <div className="rounded-3xl border border-forest/10 bg-white p-4 shadow-card">
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate">In-call chat · auto-translated EN ↔ HI · saved to case file</p>
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {messages.map((m, i) => (
                <li key={i} className={`max-w-[80%] rounded-2xl px-4 py-2 text-[13px] leading-snug ${m.from === "doc" ? "bg-sage-wash text-forest-ink" : "ml-auto bg-forest text-oat"}`}>{m.text}</li>
              ))}
            </ul>
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <label className="sr-only" htmlFor="msg">Message</label>
              <input id="msg" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type — e.g. 'Can we do it without blood transfusion?'" className="h-11 flex-1 rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest" />
              <button type="submit" className="h-11 rounded-xl bg-forest px-4 text-sm font-bold text-oat">Send</button>
            </form>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
