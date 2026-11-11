"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSession } from "@/lib/session";

/* ───────── demo profile (illustrative demo data) ───────── */
const PROFILE = {
  name: "Priya Raghavan",
  initials: "PR",
  city: "Chennai, India",
  caseTitle: "CABG — triple-vessel · Bumrungrad shortlisted",
  caseId: "ETH-CABG-2481",
  memberSince: "March 2026",
  languages: "English + Hindi",
  currency: "INR (₹)",
  patientId: "ETH-2026-000481",
  email: "priya.raghavan@example.in",
};

const STATS = [
  { value: "1", label: "Active case", detail: "CABG · Triple-vessel", href: "/dashboard" },
  { value: "3", label: "All-in quotes", detail: "Bumrungrad · Memorial · Apollo", href: "/quotes/compare" },
  { value: "14", label: "Documents", detail: "AI organised · HbA1c flagged", href: "/dashboard" },
  { value: "6", label: "Unread", detail: "Latest: Dr. Meera's pre-op note", href: "/notifications" },
];

const JOURNEY = [
  { name: "Discover", state: "done" },
  { name: "Case", state: "done" },
  { name: "Records", state: "done" },
  { name: "Match", state: "done" },
  { name: "Quotes", state: "done" },
  { name: "Book", state: "active" },
  { name: "Consult", state: "upcoming" },
  { name: "Treatment", state: "upcoming" },
  { name: "Aftercare", state: "upcoming" },
] as const;

type Tab = "overview" | "medical" | "travel" | "privacy";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "medical", label: "Medical profile" },
  { id: "travel", label: "Travel preferences" },
  { id: "privacy", label: "Privacy & data" },
];

const BLOOD_GROUPS = ["O+", "O−", "A+", "A−", "B+", "B−", "AB+", "AB−"];

export default function AccountView() {
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<string | null>(null);
  const session = useSession();

  /* medical profile — locally editable fields */
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("Penicillin — rash (childhood)");
  const [conditions, setConditions] = useState("Type 2 diabetes (T2DM) · HbA1c 6.4%");
  const [medications, setMedications] = useState(
    "Metformin 500mg BD (stop 48h pre-op) · Atorvastatin 10mg HS · Aspirin 75mg OD",
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [savedField, setSavedField] = useState<string | null>(null);

  /* delete-account dialog */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!savedField) return;
    const t = window.setTimeout(() => setSavedField(null), 2200);
    return () => window.clearTimeout(t);
  }, [savedField]);

  useEffect(() => {
    if (!deleteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteOpen]);

  const fieldValues: Record<string, string> = {
    bloodGroup,
    allergies,
    conditions,
    medications,
  };
  const setters: Record<string, (v: string) => void> = {
    bloodGroup: setBloodGroup,
    allergies: setAllergies,
    conditions: setConditions,
    medications: setMedications,
  };

  const startEdit = (field: string) => {
    setEditing(field);
    setDraft(fieldValues[field]);
  };
  const saveEdit = () => {
    if (!editing) return;
    const value = draft.trim();
    if (!value) return;
    setters[editing](value);
    setSavedField(editing);
    setEditing(null);
  };

  /* actual JSON download of the profile */
  const downloadJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      notice:
        "Illustrative demo data — EthAum demo build. This is not a real medical record.",
      profile: PROFILE,
      medicalProfile: {
        bloodGroup,
        allergies,
        conditions,
        medications,
        emergencyContact: "Meena Raghavan (spouse) · contact saved on this device",
        insurance:
          "Star Health Comprehensive · cashless at Apollo Greams Road · sums insured ₹15L",
      },
      travelPreferences: {
        diet: "Jain — no onion/garlic, pure vegetarian",
        airportPickup: "Yes — Bumrungrad desk, 12 Nov, arrival gate B",
        companion: "Spouse (Meena Raghavan) — attendant fare booked, same room",
        languagePreference: "Hindi first · English fine · Tamil on request",
        smoking: "No",
        preferredAirport: "Chennai International (MAA)",
      },
      caseSummary: {
        activeCases: 1,
        quotes: 3,
        documents: 14,
        unreadNotifications: 6,
        currentStage: "Booking & payment — token paid · EMI ₹18,400/mo · flights held",
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ethaum-my-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setToast("ethaum-my-data.json downloaded — check your downloads folder.");
  };

  const confirmDelete = () => {
    if (deleteText !== "DELETE") return;
    setDeleteOpen(false);
    setDeleteText("");
    setToast("Account scheduled for deletion (demo). You have 30 days to change your mind — we'll email you.");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ───────── PROFILE CARD ───────── */}
        <aside className="lg:col-span-4">
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-forest font-display text-2xl font-semibold text-oat">
                {PROFILE.initials}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-semibold leading-tight text-forest-ink">
                  {PROFILE.name}
                </h2>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-mint-deep/30 bg-mint-wash px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.16em] text-mint-deep">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 6.2 4.6 8.8 10 3.2" />
                  </svg>
                  Verified patient
                </span>
              </div>
            </div>

            <dl className="mt-6 divide-y divide-forest/10 border-y border-forest/10">
              {[
                ["Location", PROFILE.city],
                ["Current case", PROFILE.caseTitle],
                ["Case ID", PROFILE.caseId],
                ["Member since", PROFILE.memberSince],
                ["Languages", PROFILE.languages],
                ["Currency", PROFILE.currency],
                ["Patient ID", PROFILE.patientId],
                ["Email", PROFILE.email],
                ["Session ID", session ? `${session.localId} · temporary local ID, no email verification in this build` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-3 py-3 text-[13px]">
                  <dt className="text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-slate">
                    {k}
                  </dt>
                  <dd className="col-span-2 font-medium leading-5 text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setToast("Signed out (demo) — nothing changed on this device.")}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-forest/20 text-sm font-semibold text-forest transition-colors hover:bg-sage-wash"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 17h7" />
                <path d="M13.5 13.5 17 10l-3.5-3.5M17 10H8" />
              </svg>
              Sign out
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-slate/80">
              Illustrative demo data · Not a real account
            </p>
          </div>
        </aside>

        {/* ───────── TABBED SECTIONS ───────── */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card sm:p-7">
            {/* tab bar */}
            <div role="tablist" aria-label="Account sections" className="flex flex-wrap gap-2 border-b border-forest/10 pb-4">
              {TABS.map(({ id, label }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    id={`tab-${id}`}
                    aria-selected={active}
                    aria-controls={`panel-${id}`}
                    onClick={() => setTab(id)}
                    className={`h-10 rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                      active
                        ? "bg-forest text-oat shadow-sm"
                        : "text-forest hover:bg-sage-wash"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className="pt-6">
                {/* quick stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {STATS.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      className="group rounded-2xl border border-forest/10 bg-oat/60 p-4 transition-all hover:-translate-y-0.5 hover:border-forest/25 hover:bg-sage-wash/50"
                    >
                      <p className="font-display text-3xl font-semibold text-forest-ink transition-colors group-hover:text-forest">
                        {s.value}
                      </p>
                      <p className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-amber-deep">
                        {s.label}
                      </p>
                      <p className="mt-1.5 text-[10.5px] leading-snug text-slate">{s.detail}</p>
                    </Link>
                  ))}
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate/80">
                  Illustrative demo data
                </p>

                {/* journey mini-stepper */}
                <div className="mt-6 rounded-2xl border border-forest/10 bg-oat/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate">
                      Your journey · CABG
                    </p>
                    <span className="rounded-full bg-amber-wash px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-deep">
                      Step 8 of 9 shown · Illustrative demo data
                    </span>
                  </div>
                  <div className="mt-4 overflow-x-auto pb-1">
                    <ol className="flex min-w-[680px]" aria-label="Treatment journey stages">
                      {JOURNEY.map((stage, i) => (
                        <li key={stage.name} className="relative flex-1">
                          {i > 0 && (
                            <div
                              aria-hidden
                              className={`absolute left-[-50%] right-[50%] top-[18px] h-0.5 ${
                                JOURNEY[i - 1].state === "done" ? "bg-mint" : "bg-sage-mist"
                              }`}
                            />
                          )}
                          <div className="relative flex flex-col items-center gap-1.5 px-1 text-center">
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-[13px] font-bold ${
                                stage.state === "done"
                                  ? "bg-mint text-forest-ink"
                                  : stage.state === "active"
                                    ? "animate-pulse-ring bg-amber text-forest-ink"
                                    : "border border-sage-mist bg-white text-slate"
                              }`}
                              aria-current={stage.state === "active" ? "step" : undefined}
                            >
                              {stage.state === "done" ? (
                                <svg viewBox="0 0 14 14" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M2.4 7.3 5.6 10.3 11.6 3.6" />
                                </svg>
                              ) : (
                                i + 1
                              )}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
                                stage.state === "upcoming" ? "text-slate/70" : "text-forest-deep"
                              }`}
                            >
                              {stage.name}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-forest/10 pt-4">
                    <p className="text-[11px] leading-5 text-slate">
                      Current: <span className="font-semibold text-forest-deep">Booking &amp; payment</span> — token paid · EMI ₹18,400/mo · flights held
                    </p>
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate">
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mint" aria-hidden /> Done</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" aria-hidden /> Now</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-sage-mist bg-white" aria-hidden /> Next</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-forest px-6 text-[15px] font-semibold text-oat transition-colors hover:bg-forest-deep"
                  >
                    Go to dashboard
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/case/new"
                    className="inline-flex h-12 items-center rounded-full bg-amber px-6 text-[15px] font-bold text-forest-ink transition-colors hover:bg-amber-deep hover:text-oat"
                  >
                    Start a new case
                  </Link>
                </div>
              </div>
            )}

            {/* ── MEDICAL PROFILE ── */}
            {tab === "medical" && (
              <div role="tabpanel" id="panel-medical" aria-labelledby="tab-medical" className="pt-6">
                <p className="text-[12px] leading-6 text-slate">
                  Visible only to you and the hospitals you approve. Edits apply to
                  your active CABG case and are re-checked by your surgeon before
                  admission.
                </p>
                <ul className="mt-4 divide-y divide-forest/10">
                  <EditableRow
                    label="Blood group"
                    field="bloodGroup"
                    value={bloodGroup}
                    editing={editing}
                    draft={draft}
                    saved={savedField === "bloodGroup"}
                    onEdit={startEdit}
                    onDraft={setDraft}
                    onSave={saveEdit}
                    onCancel={() => setEditing(null)}
                    renderEditor={() => (
                      <select
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="h-10 w-full rounded-lg border border-forest/25 bg-white px-3 text-sm outline-none focus:border-forest"
                        aria-label="Blood group"
                      >
                        {BLOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    )}
                  />
                  <EditableRow
                    label="Allergies"
                    field="allergies"
                    value={allergies}
                    editing={editing}
                    draft={draft}
                    saved={savedField === "allergies"}
                    onEdit={startEdit}
                    onDraft={setDraft}
                    onSave={saveEdit}
                    onCancel={() => setEditing(null)}
                  />
                  <EditableRow
                    label="Conditions"
                    field="conditions"
                    value={conditions}
                    editing={editing}
                    draft={draft}
                    saved={savedField === "conditions"}
                    onEdit={startEdit}
                    onDraft={setDraft}
                    onSave={saveEdit}
                    onCancel={() => setEditing(null)}
                  />
                  <EditableRow
                    label="Current medications"
                    field="medications"
                    value={medications}
                    editing={editing}
                    draft={draft}
                    saved={savedField === "medications"}
                    onEdit={startEdit}
                    onDraft={setDraft}
                    onSave={saveEdit}
                    onCancel={() => setEditing(null)}
                    multiline
                  />
                  {/* static rows */}
                  <li className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-3">
                    <span className="text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-slate">Emergency contact</span>
                    <span className="col-span-2 text-[13px] font-medium leading-6 text-charcoal">Meena Raghavan (spouse) · contact saved on this device</span>
                  </li>
                  <li className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-3">
                    <span className="text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-slate">Insurance</span>
                    <span className="col-span-2 text-[13px] font-medium leading-6 text-charcoal">Star Health Comprehensive · cashless at Apollo Greams Road · sum insured ₹15L</span>
                  </li>
                </ul>
                <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-slate/80">
                  Illustrative demo data · Edits live on this device only
                </p>
              </div>
            )}

            {/* ── TRAVEL PREFERENCES ── */}
            {tab === "travel" && (
              <div role="tabpanel" id="panel-travel" aria-labelledby="tab-travel" className="pt-6">
                <p className="text-[12px] leading-6 text-slate">
                  Shared with your coordinator (Divya) and Bumrungrad&apos;s patient
                  desk before you fly. Change anything — it costs nothing.
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Diet",
                      value: "Jain — no onion/garlic, pure vegetarian",
                      note: "Flagged to kitchen 48h before admission",
                      icon: (<path d="M6 3c-2 4-2 7 0 9 2-2 2-5 0-9ZM12 3c-2 4-2 7 0 9 2-2 2-5 0-9ZM18 3c-2 4-2 7 0 9 2-2 2-5 0-9ZM4 16h16M7 16c0 3 2.5 5 5 5s5-2 5-5" />),
                    },
                    {
                      label: "Airport pickup",
                      value: "Yes — Bumrungrad desk, 12 Nov",
                      note: "Arrival gate B · driver with name card",
                      icon: (<path d="M3 11.5 21 4l-4.5 16-3.5-6.5L3 11.5Z" />),
                    },
                    {
                      label: "Companion",
                      value: "Spouse — Meena Raghavan",
                      note: "Attendant fare booked · same room · meals incl.",
                      icon: (<path d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6 6 0 0 1 12 0M16 8a3 3 0 1 1 .5 5.96M17.5 14.5A6 6 0 0 1 21.5 20" />),
                    },
                    {
                      label: "Language preference",
                      value: "Hindi first · English fine",
                      note: "Tamil interpreter on request at the hospital",
                      icon: (<path d="M4 6h9M8.5 3.5v2.5M6.5 6c.8 2.6 2.6 4.6 5 6M11 6c-.8 2.6-2.6 4.6-5 6M13 20l4.2-9L21.4 20M14.6 16.4h5.2" />),
                    },
                    {
                      label: "Smoking",
                      value: "No",
                      note: "Nicotine patch plan discussed pre-op",
                      icon: (<path d="M3 15h13v3.5H3zM16 15c2 0 2-3 4-3M18.5 8.5c.6.8.6 2 0 2.8" />),
                    },
                    {
                      label: "Preferred airport",
                      value: "Chennai International (MAA)",
                      note: "DEL→BKK business-saver fare held · 26A",
                      icon: (<path d="M10.5 13.5 3 11l1.5-1.5L9 11l4.5-6L15 6.5 12 12l1.5 4.5L12 18l-2.5-5.5Z" />),
                    },
                  ].map((item) => (
                    <li key={item.label} className="rounded-2xl border border-forest/10 bg-oat/50 p-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-wash text-forest">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          {item.icon}
                        </svg>
                      </span>
                      <p className="mt-3 text-[9.5px] font-bold uppercase tracking-[0.2em] text-amber-deep">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[14px] font-semibold leading-snug text-forest-ink">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[10.5px] leading-snug text-slate">{item.note}</p>
                    </li>
                  ))}
                </ul>
                <a
                  href="/help"
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition-colors hover:bg-sage-wash"
                >
                  Change a preference on WhatsApp
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </a>
              </div>
            )}

            {/* ── PRIVACY & DATA ── */}
            {tab === "privacy" && (
              <div role="tabpanel" id="panel-privacy" aria-labelledby="tab-privacy" className="pt-6">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-amber-deep">
                  Our promise — DPDP &amp; GDPR
                </p>
                <ul className="mt-3 space-y-3">
                  {[
                    "Stored in India (Mumbai region) — AES-256 at rest, TLS 1.3 in transit; ISO 27001-ready infrastructure.",
                    "Aligned to India's DPDP Act 2023 and the EU GDPR — access, correction and erasure answered within 30 days.",
                    "Nothing reaches a hospital until you tap “Request quote” and e-sign consent — withdraw anytime; your care continues, matching stops.",
                    "We never sell your data, never run ads against your records, and never show your file to insurers without your written consent.",
                    "Every access to your record is logged — ask us for the audit trail and we'll send it.",
                  ].map((promise) => (
                    <li key={promise} className="flex items-start gap-2.5 text-[13px] leading-6 text-charcoal">
                      <svg viewBox="0 0 14 14" className="mt-1 h-4 w-4 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M2.4 7.3 5.6 10.3 11.6 3.6" />
                      </svg>
                      {promise}
                    </li>
                  ))}
                </ul>
                <Link href="/privacy" className="mt-3 inline-flex text-[12px] font-bold text-forest underline decoration-amber decoration-2 underline-offset-4 hover:text-forest-deep">
                  Read the full privacy promise →
                </Link>

                {/* data export */}
                <div className="mt-6 rounded-2xl border border-forest/10 bg-oat/50 p-5">
                  <h3 className="font-display text-lg font-semibold text-forest-ink">Take your data with you</h3>
                  <p className="mt-1 text-[12.5px] leading-6 text-slate">
                    One JSON file with your profile, medical details, travel
                    preferences and case summary — machine-readable, no lock-in,
                    no email required.
                  </p>
                  <button
                    type="button"
                    onClick={downloadJson}
                    className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-oat transition-colors hover:bg-forest-deep"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M10 3v11M6 10.5 10 14.5l4-4" />
                      <path d="M4 17h12" />
                    </svg>
                    Download my data (JSON)
                  </button>
                </div>

                {/* danger zone */}
                <div className="mt-5 rounded-2xl border border-red-800/20 bg-red-50/60 p-5">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-red-900">
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M10 3 2.5 16.5h15L10 3Z" />
                      <path d="M10 8.5v4M10 14.8h.01" />
                    </svg>
                    Danger zone
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-red-900/85">
                    Deleting your account erases your profile, case ETH-CABG-2481,
                    14 documents and 3 quotes from EthAum. Hospitals keep their own
                    clinical records as required by law — we cannot delete those for
                    you. A 30-day grace period applies before erasure is final.
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="mt-4 inline-flex h-11 items-center rounded-full border-2 border-red-800/60 px-5 text-sm font-bold text-red-900 transition-colors hover:bg-red-900 hover:text-white"
                  >
                    Delete my account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───────── DELETE CONFIRMATION DIALOG ───────── */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setDeleteOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-3xl border border-red-800/20 bg-white p-6 shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-dialog-title" className="font-display text-xl font-semibold text-red-900">
              Type DELETE to confirm
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-charcoal/85">
              This schedules your EthAum account and case file for erasure after a
              30-day grace period. You can cancel any time within those 30 days by
              signing back in or messaging your coordinator.
            </p>
            <label htmlFor="delete-confirm" className="mt-4 mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate">
              Confirmation
            </label>
            <input
              id="delete-confirm"
              type="text"
              autoComplete="off"
              autoFocus
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="DELETE"
              className="h-12 w-full rounded-xl border border-red-800/30 bg-red-50/50 px-4 font-mono text-base tracking-[0.3em] text-red-900 outline-none placeholder:text-red-900/30 focus:border-red-800"
            />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteText("");
                }}
                className="h-11 rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition-colors hover:bg-sage-wash"
              >
                Keep my account
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteText !== "DELETE"}
                className="h-11 rounded-full bg-red-800 px-5 text-sm font-bold text-white transition-all enabled:hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Delete forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── TOAST ───────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 flex w-[min(92vw,30rem)] -translate-x-1/2 items-start gap-3 rounded-2xl border border-white/10 bg-forest-ink px-5 py-4 text-oat shadow-float"
        >
          <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 10.5 8.5 15 16 6" />
          </svg>
          <p className="text-[13px] leading-6 text-white/90">{toast}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-oat"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── one editable field row ─── */
function EditableRow({
  label,
  field,
  value,
  editing,
  draft,
  saved,
  onEdit,
  onDraft,
  onSave,
  onCancel,
  multiline = false,
  renderEditor,
}: {
  label: string;
  field: string;
  value: string;
  editing: string | null;
  draft: string;
  saved: boolean;
  onEdit: (field: string) => void;
  onDraft: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  multiline?: boolean;
  renderEditor?: () => ReactNode;
}) {
  const isEditing = editing === field;
  return (
    <li className="grid gap-2 py-4 sm:grid-cols-3 sm:gap-3">
      <span className="text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-slate">
        {label}
      </span>
      {isEditing ? (
        <div className="col-span-2">
          {renderEditor ? (
            renderEditor()
          ) : multiline ? (
            <textarea
              autoFocus
              rows={2}
              value={draft}
              onChange={(e) => onDraft(e.target.value)}
              aria-label={label}
              className="w-full rounded-lg border border-forest/25 bg-white px-3 py-2 text-[13px] leading-6 outline-none focus:border-forest"
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={draft}
              onChange={(e) => onDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
              aria-label={label}
              className="h-10 w-full rounded-lg border border-forest/25 bg-white px-3 text-[13px] outline-none focus:border-forest"
            />
          )}
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-forest px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-oat transition-colors hover:bg-forest-deep"
            >
              <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 6.2 4.6 8.8 10 3.2" />
              </svg>
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 items-center rounded-full border border-forest/20 px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-forest transition-colors hover:bg-sage-wash"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="col-span-2 flex items-start justify-between gap-3">
          <span className="text-[13px] font-medium leading-6 text-charcoal">
            {value}
            {saved && (
              <span className="ml-2 inline-flex items-center gap-1 align-middle text-[10px] font-bold uppercase tracking-[0.14em] text-mint-deep" role="status">
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 6.2 4.6 8.8 10 3.2" />
                </svg>
                Saved
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => onEdit(field)}
            aria-label={`Edit ${label.toLowerCase()}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest/15 text-forest transition-colors hover:border-forest/40 hover:bg-sage-wash"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M13.5 3.5a2.1 2.1 0 0 1 3 3L8 15l-4 1 1-4 8.5-8.5Z" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}
