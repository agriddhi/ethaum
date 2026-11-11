"use client";

import { useSyncExternalStore } from "react";

/* EthAum marketplace bridge — the layer that makes this a two-sided
   marketplace instead of two separate demos.
   A hospital sends a quote in the partner portal; it appears on the patient's
   quote screen in real time; when the patient holds it, the hospital's lead
   flips to "accepted". Everything is local (localStorage) — no backend —
   but the interaction model is the real one. */

export type QuoteStatus = "sent" | "held" | "accepted" | "declined";

export type ProviderQuote = {
  id: string;
  hospital: string;
  hospitalSlug: string | null;
  patientName: string;
  caseId: string | null;
  items: Array<{ label: string; amount: number }>;
  total: number;
  nights: number;
  notes: string;
  status: QuoteStatus;
  checks: { implantBrand: boolean; withinCeiling: boolean; icuCap: boolean };
  createdAt: string;
};

export type LeadStatus =
  | "records-pending"
  | "matched"
  | "quote-requested"
  | "quote-sent"
  | "accepted"
  | "consult-booked";

export type BuddyRequest = {
  id: string;
  buddyId: string;
  buddyName: string;
  hospital: string;
  note: string;
  createdAt: string;
};

type MarketState = {
  quotes: ProviderQuote[];
  leads: Record<string, LeadStatus>;
  buddyRequests: BuddyRequest[];
};

const KEY = "ethaum-marketplace";
const EVENT = "ethaum-marketplace-change";

const EMPTY: MarketState = { quotes: [], leads: {}, buddyRequests: [] };
let cache: MarketState = EMPTY;
let rawCache: string | null = null;

function read(): MarketState {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(KEY);
  if (raw === rawCache) return cache;
  rawCache = raw;
  try {
    cache = raw ? (JSON.parse(raw) as MarketState) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

export function subscribeMarket(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const getMarketSnapshot = () => read();
export const getMarketServerSnapshot = () => EMPTY;

export function useMarketplace(): MarketState {
  return useSyncExternalStore(subscribeMarket, getMarketSnapshot, getMarketServerSnapshot);
}

function write(next: MarketState) {
  cache = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function sendQuote(input: Omit<ProviderQuote, "id" | "status" | "createdAt">): ProviderQuote {
  const state = read();
  const quote: ProviderQuote = {
    ...input,
    id: `QT-${Math.floor(1000 + Math.random() * 8999)}`,
    status: "sent",
    createdAt: new Date().toISOString(),
  };
  write({ ...state, quotes: [quote, ...state.quotes] });
  return quote;
}

export function setQuoteStatus(id: string, status: QuoteStatus) {
  const state = read();
  write({ ...state, quotes: state.quotes.map((q) => (q.id === id ? { ...q, status } : q)) });
}

export function setLeadStatus(leadId: string, status: LeadStatus) {
  const state = read();
  write({ ...state, leads: { ...state.leads, [leadId]: status } });
}

export function requestBuddy(input: Omit<BuddyRequest, "id" | "createdAt">): BuddyRequest {
  const state = read();
  const req: BuddyRequest = { ...input, id: `CB-${Math.floor(100 + Math.random() * 899)}`, createdAt: new Date().toISOString() };
  write({ ...state, buddyRequests: [req, ...state.buddyRequests] });
  return req;
}

export function clearMarketplace() {
  rawCache = null;
  write(EMPTY);
}

/* helpers */
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
