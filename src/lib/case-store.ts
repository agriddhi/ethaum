"use client";

import { useSyncExternalStore } from "react";

/* EthAum case store — the single source of truth for the patient's journey.
   Local-only (localStorage), like the session: no database, no server.
   Every screen (matches, quotes, booking, dashboard, aftercare, hero) reads
   from here, so the demo behaves like a real product instead of a set of
   static mock-ups: hold a provider → the quote screen picks it up → pay the
   token → the dashboard moves to "Booking complete". */

export type Priorities = { cost: number; quality: number; speed: number };

export type EthAumCase = {
  id: string;
  treatmentSlug: string;
  treatmentName: string;
  condition: string;
  urgency: "routine" | "soon" | "urgent";
  budget: number;
  companions: number;
  languages: string[];
  diet: string;
  priorities: Priorities;
  docsUploaded: number;
  readiness: number | null;
  qualification: string | null;
  qualificationSent: boolean;
  matchedSlug: string | null;
  matchedName: string | null;
  matchedScore: number | null;
  quoteHospital: string | null;
  quoteTotal: number | null;
  quoteLocked: boolean;
  tokenPaid: boolean;
  consultDone: boolean;
  aftercareStarted: boolean;
  createdAt: string;
};

const KEY = "ethaum-case-v2";
const EVENT = "ethaum-case-change";

let cache: EthAumCase | null = null;
let rawCache: string | null = null;

function read(): EthAumCase | null {
  if (typeof window === "undefined") return null;
  // Always re-read the raw string so a second bundle instance never serves a
  // stale snapshot, but keep the parsed object identity stable between reads
  // (useSyncExternalStore requires a cached snapshot).
  const raw = window.localStorage.getItem(KEY);
  if (raw === rawCache) return cache;
  rawCache = raw;
  try {
    cache = raw ? (JSON.parse(raw) as EthAumCase) : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function subscribeCase(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const getCaseSnapshot = () => read();
export const getCaseServerSnapshot = () => null;

export function useCase(): EthAumCase | null {
  return useSyncExternalStore(subscribeCase, getCaseSnapshot, getCaseServerSnapshot);
}

export function saveCase(next: EthAumCase) {
  cache = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function updateCase(patch: Partial<EthAumCase>) {
  const current = read();
  if (!current) return;
  saveCase({ ...current, ...patch });
}

export function clearCase() {
  cache = null;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function createCase(input: Partial<EthAumCase> & { treatmentSlug: string; treatmentName: string }): EthAumCase {
  const next: EthAumCase = {
    id: `ETA-${Math.floor(2400 + Math.random() * 500)}`,
    condition: "",
    urgency: "soon",
    budget: 12,
    companions: 1,
    languages: ["English"],
    diet: "No preference",
    priorities: { cost: 60, quality: 90, speed: 50 },
    docsUploaded: 0,
    readiness: null,
    qualification: null,
    qualificationSent: false,
    matchedSlug: null,
    matchedName: null,
    matchedScore: null,
    quoteHospital: null,
    quoteTotal: null,
    quoteLocked: false,
    tokenPaid: false,
    consultDone: false,
    aftercareStarted: false,
    createdAt: new Date().toISOString(),
    ...input,
  };
  saveCase(next);
  return next;
}

/* ── derived journey ─────────────────────────────────────────── */

export type StageState = "done" | "active" | "upcoming";
export type Stage = { n: number; name: string; hint: string; state: StageState };

export function deriveStages(c: EthAumCase | null): Stage[] {
  if (!c) {
    return [
      { n: 1, name: "Discover", hint: "Browse 12 treatment guides across 6 countries", state: "active" },
      { n: 2, name: "Create case", hint: "10 minutes — condition, budget, timelines", state: "upcoming" },
      { n: 3, name: "Upload records", hint: "AI classifies & flags missing tests", state: "upcoming" },
      { n: 4, name: "Qualification", hint: "AI pre-screen, then surgeon review", state: "upcoming" },
      { n: 5, name: "Provider matching", hint: "Ranked by your priorities", state: "upcoming" },
      { n: 6, name: "Quote comparison", hint: "All-in quotes side by side", state: "upcoming" },
      { n: 7, name: "Select provider", hint: "Hold your pick — 30-day price lock", state: "upcoming" },
      { n: 8, name: "Booking & payment", hint: "Refundable ₹9,999 token", state: "upcoming" },
      { n: 9, name: "Virtual consultation", hint: "Pre-op call with your surgeon", state: "upcoming" },
      { n: 10, name: "Treatment", hint: "Day-by-day hospital plan", state: "upcoming" },
      { n: 11, name: "Aftercare", hint: "Day-7/30/90 reviews + physio", state: "upcoming" },
      { n: 12, name: "Review & referral", hint: "Verified review · ₹5,000 credit", state: "upcoming" },
    ];
  }

  const quoteHeld = !!c.quoteHospital;
  const providerHeld = !!c.matchedSlug;
  const stage = (
    n: number,
    name: string,
    done: boolean,
    active: boolean,
    hint: string
  ): Stage => ({ n, name, hint, state: done ? "done" : active ? "active" : "upcoming" });

  return [
    stage(1, "Discover", true, false, `Explored ${c.treatmentName} guides`),
    stage(2, "Create case", true, false, `${c.treatmentName} · ${c.urgency === "urgent" ? "ASAP" : c.urgency === "soon" ? "within 6–8 weeks" : "whenever"}`),
    stage(3, "Upload records", true, false, `${c.docsUploaded} report${c.docsUploaded === 1 ? "" : "s"} · AI organised`),
    stage(4, "Qualification", c.qualificationSent, !c.qualificationSent, c.qualification ? `${c.qualification} · readiness ${c.readiness}/100` : "AI pre-screen, then surgeon review"),
    stage(5, "Provider matching", providerHeld, !providerHeld && c.qualificationSent, providerHeld ? `Held ${c.matchedName}${c.matchedScore ? ` · ${c.matchedScore}% match` : ""}` : "Ranked by your priorities"),
    stage(6, "Quote comparison", quoteHeld, !quoteHeld && providerHeld, quoteHeld ? `3 all-in quotes compared` : "All-in quotes side by side"),
    stage(7, "Select provider", quoteHeld, !quoteHeld && providerHeld, c.quoteHospital ? `${c.quoteHospital} · price locked` : "Hold your pick — 30-day price lock"),
    stage(8, "Booking & payment", c.tokenPaid, !c.tokenPaid && quoteHeld, c.tokenPaid ? "Token paid · flights held" : "Refundable ₹9,999 token"),
    stage(9, "Virtual consultation", c.consultDone, !c.consultDone && c.tokenPaid, c.consultDone ? "Pre-op call completed" : "Pre-op call with your surgeon"),
    stage(10, "Treatment", c.consultDone, !c.consultDone && c.tokenPaid, "Day-by-day hospital plan"),
    stage(11, "Aftercare", c.aftercareStarted, c.tokenPaid && !c.aftercareStarted, "Day-7/30/90 reviews + physio"),
    stage(12, "Review & referral", false, false, "Verified review · ₹5,000 credit"),
  ];
}

export function caseProgress(c: EthAumCase | null): { done: number; total: number; pct: number } {
  const stages = deriveStages(c);
  const done = stages.filter((s) => s.state === "done").length;
  const total = stages.length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function caseStatusLine(c: EthAumCase | null): string {
  if (!c) return "No case yet — start with your condition";
  if (c.tokenPaid) return "Booking complete · pre-op call next";
  if (c.quoteLocked) return "Quote locked · ₹9,999 token to confirm";
  if (c.matchedSlug) return "Provider held · compare the all-in quotes";
  if (c.qualificationSent) return "Under surgeon review · quotes in ~31h";
  if (c.readiness !== null) return `Pre-screen done (${c.readiness}/100) · send for review`;
  return `${c.treatmentName} case created`;
}
