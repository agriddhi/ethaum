"use client";

import { useEffect, useRef, useState } from "react";

/* Demo concierge chat — replaces every phone/WhatsApp CTA.
   Nothing is sent anywhere: the replies are canned and the transcript is
   local to this browser. In production this component would deep-link to
   WhatsApp with a coordinator; here it demonstrates the flow safely. */

type Msg = { from: "concierge" | "you"; text: string };

const CHIPS = [
  "I need a quote for CABG",
  "How do I get a visa letter?",
  "What happens after I fly home?",
  "Can I speak to a human?",
];

const ANSWERS: Record<string, string> = {
  "I need a quote for CABG":
    "Happy to help. Start your case at /case/new — two surgeons review your file free within 31 hours, and you will get itemised all-in quotes (surgery, ICU, flights, visa, companion). Nothing is booked until you sign.",
  "How do I get a visa letter?":
    "Once a hospital accepts your case, we send the invitation letter within 48 hours and track the e-visa for you. Thailand = visa on arrival, Turkey = e-Visa in 48h, Malaysia = visa-free 30 days, Singapore = e-Visa.",
  "What happens after I fly home?":
    "Aftercare runs Day 7, Day 30 and Day 90: tele-reviews with your surgeon, a physio plan, medicine refills to your door and a named care buddy. See /aftercare for the full plan.",
  "Can I speak to a human?":
    "Yes — in this build you are chatting with a scripted concierge. A live coordinator would reply in under 3 minutes, 7:00–23:00 IST, in 12 languages. Nothing you type is transmitted.",
};

export default function DemoChat({
  label = "Chat with a coordinator",
  variant = "green",
  className = "",
}: {
  label?: string;
  variant?: "green" | "light" | "dark";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "concierge", text: "Hi — EthAum Care here. Ask me about quotes, visas, travel or aftercare. (Demo build: replies are scripted, nothing is sent.)" },
  ]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const push = (text: string, from: Msg["from"]) => setMsgs((m) => [...m, { from, text }]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    push(clean, "you");
    setDraft("");
    const reply = ANSWERS[clean] ??
      "Good question — a coordinator would pull your case file and reply with specifics. In this demo build I can answer the four common ones: quotes, visas, aftercare and live help.";
    window.setTimeout(() => push(reply, "concierge"), 650);
  };

  const btn =
    variant === "green"
      ? "bg-[#25D366] text-[#0b3b21] hover:brightness-105"
      : variant === "dark"
        ? "bg-white/10 text-oat hover:bg-white/20"
        : "border border-forest/20 text-forest hover:bg-sage-wash";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-bold transition-all ${btn} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-2 1.4-.5.1-1.2.2-3.9-.8-3.3-1.4-5.4-4.8-5.5-5-.2-.3-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5-.3.3c-.1.1-.2.3 0 .5.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.8 1.8.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.6-.1 1Z" />
        </svg>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-forest-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="EthAum demo concierge chat" onClick={() => setOpen(false)}>
          <div
            className="flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-float sm:h-[560px] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-forest-ink px-5 py-4 text-oat">
              <div>
                <p className="font-display text-base font-semibold">EthAum Care · demo concierge</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-mint">scripted · nothing is sent</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-oat hover:bg-white/20">
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l10 10M12 2 2 12" /></svg>
              </button>
            </div>

            <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto bg-oat px-4 py-4">
              {msgs.map((m, i) => (
                <p key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${m.from === "you" ? "ml-auto bg-forest text-oat" : "bg-white text-charcoal shadow-sm"}`}>
                  {m.text}
                </p>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                {CHIPS.map((c) => (
                  <button key={c} onClick={() => send(c)} className="rounded-full border border-forest/15 bg-white px-3 py-1.5 text-[11px] font-medium text-forest transition-colors hover:border-mint">
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="flex items-center gap-2 border-t border-forest/10 bg-white px-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <label className="sr-only" htmlFor="demo-chat-input">Message</label>
              <input
                id="demo-chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about quotes, visas, aftercare…"
                className="h-11 flex-1 rounded-xl border border-forest/15 bg-oat px-4 text-sm outline-none focus:border-forest"
              />
              <button type="submit" className="h-11 rounded-xl bg-forest px-4 text-sm font-bold text-oat">Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
