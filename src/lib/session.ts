"use client";

import { useSyncExternalStore } from "react";

/* EthAum session — intentionally local-only.
   No database, no server call, no password ever leaves the device.
   The session is a JSON blob in localStorage so the whole journey can be
   demonstrated without an auth backend. */

export type Session = {
  name: string;
  email: string;
  city?: string;
  role?: "patient" | "provider";
  since: string;
};

const KEY = "ethaum-session";
const EVENT = "ethaum-session-change";

const cache: { value: Session | null } = { value: null };
let rawCache: string | null = null;

function read(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (raw === rawCache) return cache.value;
  rawCache = raw;
  try {
    cache.value = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    cache.value = null;
  }
  return cache.value;
}

export function subscribeSession(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function getSessionSnapshot(): Session | null {
  return read();
}

export function getServerSessionSnapshot(): Session | null {
  return null;
}

export function saveSession(session: Session) {
  cache.value = session;
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(EVENT));
}

export function clearSession() {
  cache.value = null;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);
}

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
