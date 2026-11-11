"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import ProviderTabs from "@/components/provider-tabs";
import { LEADS } from "@/data/ethaum";
import { useMarketplace, timeAgo, inr as inrM } from "@/lib/marketplace";

type Lead = (typeof LEADS)[number];
type LeadStatus = Lead["status"] | "quote-sent" | "accepted";
type DocType = "Lab" | "Imaging" | "Prescription" | "Discharge";

const STATUS_LABEL: Record<LeadStatus, string> = {
  "records-pending": "Records pending",
  matched: "Matched",
  "quote-requested": "Quote requested",
  "quote-sent": "Quote sent",
  accepted: "Accepted by patient",
  "consult-booked": "Consult booked",
};

const STATS = [
  { label: "New leads", value: "14", delta: "+3 this week", dir: "up" as const },
  { label: "Quotes sent", value: "38", delta: "+6 this month", dir: "up" as const },
  { label: "Conversion", value: "31%", delta: "+4 pts vs Q3", dir: "up" as const },
  { label: "Avg. response", value: "3.2h", delta: "−0.6h vs Sep", dir: "down" as const },
];

const COLUMNS: Array<{ status: LeadStatus; label: string; dot: string }> = [
  { status: "records-pending", label: "Records pending", dot: "bg-slate" },
  { status: "matched", label: "Matched", dot: "bg-amber" },
  { status: "quote-requested", label: "Quote requested", dot: "bg-mint" },
  { status: "quote-sent", label: "Quote sent", dot: "bg-mint" },
  { status: "accepted", label: "Accepted", dot: "bg-forest" },
  { status: "consult-booked", label: "Consult booked", dot: "bg-forest" },
];

/* ─── per-lead clinical context (illustrative demo content) ─── */

type LeadDetail = {
  condition: string;
  hba1c: string;
  creatinine: string;
  bmi: string;
  allergies: string;
  bullets: string[];
  specificDocs: Array<{ name: string; type: DocType; meta: string }>;
};

const LEAD_DETAILS: Record<string, LeadDetail> = {
  "L-2481": {
    condition: "Triple-vessel CAD · CABG ×3",
    hba1c: "6.4%",
    creatinine: "0.9 mg/dL",
    bmi: "29.1",
    allergies: "Penicillin",
    bullets: [
      "Candidate CABG ×3, off-pump preferred",
      "Diabetes controlled — continue metformin hold pre-op",
      "Prefers Hindi + English; spouse travels",
      "Budget ceiling ₹12.0L all-in — current draft ₹11.4L ✓",
    ],
    specificDocs: [
      { name: "HbA1c panel — 6.4% (flagged)", type: "Lab", meta: "PDF · 2 pages · 0.4 MB" },
      { name: "Creatinine 0.9 mg/dL — renal OK", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
      { name: "Coronary angiogram — 3-vessel CAD", type: "Imaging", meta: "DICOM · cath lab · 28 Oct" },
    ],
  },
  "L-2480": {
    condition: "Obesity class II · sleeve candidate",
    hba1c: "5.9%",
    creatinine: "0.8 mg/dL",
    bmi: "41.2",
    allergies: "None reported (NKDA)",
    bullets: [
      "BMI 41.2 with early T2DM — sleeve indicated",
      "Leak test day 2 mandatory — built into draft quote",
      "Prefers Hindi + Urdu; airport pickup for 2",
      "Budget ceiling ₹4.5L all-in — current draft ₹4.3L ✓",
    ],
    specificDocs: [
      { name: "OGTT — impaired glucose tolerance", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
      { name: "Ultrasound abdomen — fatty liver grade I", type: "Imaging", meta: "PDF · report + images · 0.9 MB" },
      { name: "Metformin 500 mg BD — current Rx", type: "Prescription", meta: "PDF · 1 page · 0.1 MB" },
    ],
  },
  "L-2479": {
    condition: "Bilateral knee OA · TKR ×2",
    hba1c: "5.7%",
    creatinine: "0.9 mg/dL",
    bmi: "31.4",
    allergies: "Penicillin",
    bullets: [
      "Bilateral TKR same sitting vs staged — patient prefers single trip",
      "Creatinine 0.9 — hold NSAIDs post-op; DVT prophylaxis protocol",
      "Prefers Malayalam + English; husband travels",
      "Budget ceiling ₹9.0L all-in — current draft ₹8.6L ✓",
    ],
    specificDocs: [
      { name: "Right knee X-ray — Kellgren–Lawrence grade IV", type: "Imaging", meta: "DICOM · 2 views · 0.8 MB" },
      { name: "Left knee X-ray — grade III", type: "Imaging", meta: "DICOM · 2 views · 0.8 MB" },
      { name: "CBC — Hb 11.8 g/dL (mild anaemia)", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
    ],
  },
  "L-2478": {
    condition: "Male pattern hair loss · Norwood IV",
    hba1c: "5.2%",
    creatinine: "0.9 mg/dL",
    bmi: "24.6",
    allergies: "None reported (NKDA)",
    bullets: [
      "Norwood IV · 3,800 grafts · donor density adequate",
      "No medication holds needed — disclosure-forward clinic chosen",
      "Prefers English; flying solo · hotel 3 nights",
      "Budget ceiling ₹2.2L all-in — current draft ₹2.05L ✓",
    ],
    specificDocs: [
      { name: "Scalp trichoscopy — donor density 92/cm²", type: "Imaging", meta: "PDF · annotated · 1.1 MB" },
      { name: "Thyroid panel (TSH) — normal", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
      { name: "Finasteride 1 mg OD — current Rx", type: "Prescription", meta: "PDF · 1 page · 0.1 MB" },
    ],
  },
  "L-2477": {
    condition: "Unexplained infertility · IVF cycle",
    hba1c: "5.1%",
    creatinine: "0.7 mg/dL",
    bmi: "23.8",
    allergies: "None reported (NKDA)",
    bullets: [
      "AMH 3.1 ng/mL · AFC 14 — favourable ovarian reserve",
      "BMI 23.8 — standard antagonist protocol; monitor day 6 stim",
      "Prefers Telugu + English; partner joins retrieval day",
      "Budget ceiling ₹3.0L all-in — current draft ₹2.9L ✓",
    ],
    specificDocs: [
      { name: "AMH — 3.1 ng/mL · FSH 6.2 IU/L", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
      { name: "Pelvic ultrasound — AFC 14, no cysts", type: "Imaging", meta: "PDF · report + stills · 0.7 MB" },
      { name: "Semen analysis — mild oligo (14M/mL)", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
    ],
  },
  "L-2476": {
    condition: "Lung nodule RUL · PET + MDT",
    hba1c: "6.1%",
    creatinine: "1.0 mg/dL",
    bmi: "27.3",
    allergies: "Contrast dye — pre-medication plan advised",
    bullets: [
      "14 mm RUL nodule — PET avidity indeterminate, biopsy advised",
      "HbA1c 6.1 · creat 1.0 — eGFR > 60, contrast cleared with pre-meds",
      "Prefers Marathi + English; wife travels as companion",
      "Budget ceiling ₹1.5L all-in — current draft ₹1.4L ✓",
    ],
    specificDocs: [
      { name: "CT chest — 14 mm RUL solid nodule", type: "Imaging", meta: "DICOM · HRCT · 12 Oct" },
      { name: "CEA 3.1 ng/mL — within range", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
      { name: "Discharge summary — prior appendectomy 2019", type: "Discharge", meta: "PDF · 3 pages · 0.6 MB" },
    ],
  },
};

const BASE_DOCS: Array<{ name: string; type: DocType; meta: string }> = [
  { name: "Lipid profile — LDL 96 · HDL 44", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
  { name: "CBC — Hb 12.6 · platelets 240k", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
  { name: "Troponin I — negative ×2", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
  { name: "12-lead ECG — sinus rhythm, no ST changes", type: "Imaging", meta: "PDF · scanned · 0.5 MB" },
  { name: "Echocardiogram — EF 55%, mild MR", type: "Imaging", meta: "DICOM · 4-chamber · 1.3 MB" },
  { name: "Chest X-ray PA view — clear", type: "Imaging", meta: "DICOM · 1 view · 0.6 MB" },
  { name: "Aspirin 75 mg OD — continue", type: "Prescription", meta: "PDF · 1 page · 0.1 MB" },
  { name: "Atorvastatin 20 mg OD — continue", type: "Prescription", meta: "PDF · 1 page · 0.1 MB" },
  { name: "Discharge summary — angioplasty 2023", type: "Discharge", meta: "PDF · 6 pages · 1.1 MB" },
  { name: "Prior procedure note + consent", type: "Discharge", meta: "PDF · 4 pages · 0.8 MB" },
  { name: "eGFR / renal panel — 78 mL/min", type: "Lab", meta: "PDF · 1 page · 0.2 MB" },
];

function docsFor(leadId: string) {
  const specific = LEAD_DETAILS[leadId]?.specificDocs ?? [];
  return [...specific, ...BASE_DOCS].slice(0, 14);
}

const DOC_TYPE_STYLE: Record<DocType, string> = {
  Lab: "bg-mint-wash text-mint-deep",
  Imaging: "bg-amber-wash text-amber-deep",
  Prescription: "bg-sage-wash text-forest",
  Discharge: "bg-mist text-slate",
};

const DECLINE_REASONS = [
  "Budget mismatch — cannot honour the ceiling",
  "Not clinically appropriate — local care advised",
  "No surgical capacity in the quoted window",
  "Records incomplete — no response in 14 days",
  "Outside hospital's licensed scope",
];

const firstName = (patient: string) => patient.split(" ")[0];
const ageOf = (patient: string) => patient.split(", ")[1] ?? "—";

/* ─── countdown helpers ─── */

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function ProviderInboxPage() {
  const [leads, setLeads] = useState<Lead[]>(() => [...LEADS]);
  const market = useMarketplace();
  // Live overlay: statuses written by the patient side (quote sent → accepted)
  // are reflected here the moment they happen.
  const liveLeads: Lead[] = leads.map((l) => ({
    ...l,
    status: (market.leads[l.id] ?? l.status) as Lead["status"],
  }));
  const [openId, setOpenId] = useState<string | null>(null);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  // SLA targets + clock are created only on the client, inside an effect (prerender-safe).
  const [slaTargets, setSlaTargets] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    // asynchronous kick-off avoids synchronous setState in the effect body
    const kick = window.setTimeout(() => {
      const start = Date.now();
      setSlaTargets({
        "L-2481": start + 2 * 3600_000 + 14 * 60_000,
        "L-2479": start + 5 * 3600_000,
        "L-2476": start + 8 * 3600_000,
      });
      setNow(Date.now());
    }, 0);
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(kick);
      window.clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const openLead = liveLeads.find((l) => l.id === openId) ?? null;
  const urgentLeads = liveLeads.filter((l) => l.urgent);
  const openDocs = openLead ? docsFor(openLead.id) : [];

  const closePanel = () => {
    setOpenId(null);
    setDeclineId(null);
    setReason("");
  };

  const confirmDecline = (lead: Lead) => {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    closePanel();
    setToast(`${lead.id} declined politely — patient notified with your reason. (demo)`);
  };

  // Close on Escape
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <>
      <SiteNav />
      <PageHeader
        crumbs={[
          ["Home", "/"],
          ["Partner portal", "/provider"],
          ["Inbox", "/provider"],
        ]}
        eyebrow="Partner portal · Lead inbox"
        title="Cases that need you."
        sub="Live queue of matched patients across EthAum partners. Figures and timings below are illustrative demo data — not binding commitments."
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <ProviderTabs />

        {/* stat tiles */}
        <section aria-label="Partner performance" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-forest/10 bg-white p-4 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">{s.label}</p>
              <p className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-forest-ink">{s.value}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-mint-deep">
                <svg viewBox="0 0 16 16" className={`h-3 w-3 ${s.dir === "down" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 10.5 8 5.5l5 5" />
                </svg>
                {s.delta}
              </p>
            </div>
          ))}
        </section>

        {/* needs you now */}
        <section aria-label="Live marketplace activity" className="rounded-2xl border border-mint/40 bg-mint-wash/50 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mint-deep">Live marketplace activity</p>
            <Link href="/provider/quote-builder" className="text-[11px] font-semibold text-forest underline decoration-mint decoration-2 underline-offset-4">Send a quote →</Link>
          </div>
          <div className="mt-2 space-y-2">
            {market.quotes.length === 0 && (
              <p className="text-[12px] leading-5 text-charcoal/80">
                No live quotes yet. Build one in the quote builder and it appears on the patient&apos;s screen instantly — and their decision comes back here.
              </p>
            )}
            {market.quotes.map((q) => (
              <p key={q.id} className="text-[12px] leading-5 text-charcoal">
                <span className="font-semibold text-forest-ink">{q.hospital}</span> · {inrM(q.total)} · sent {timeAgo(q.createdAt)} ·{" "}
                <span className={q.status === "accepted" ? "font-semibold text-mint-deep" : q.status === "held" ? "font-semibold text-amber-deep" : "text-slate"}>
                  {q.status === "accepted" ? "accepted by the patient — proceed to admission" : q.status === "held" ? "held by the patient (price locked 30 days)" : "awaiting the patient"}
                </span>
              </p>
            ))}
          </div>
        </section>

        <section aria-label="Urgent leads" className="rounded-2xl border border-amber/60 bg-amber-wash/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" aria-hidden />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber" aria-hidden />
              </span>
              Needs you now
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/70">
              {urgentLeads.length} urgent · SLA 24h first response
            </p>
          </div>
          <ul className="mt-3 grid gap-2 md:grid-cols-3">
            {urgentLeads.length === 0 && (
              <li className="rounded-xl border border-forest/10 bg-white px-4 py-3 text-sm text-slate md:col-span-3">
                All clear — no urgent leads in your queue. Nicely done.
              </li>
            )}
            {urgentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 rounded-xl border border-amber/60 bg-white px-4 py-3 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-forest-ink">
                    {lead.id} · {firstName(lead.patient)} <span className="font-normal text-slate">· {lead.treatment}</span>
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-deep">
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                      <circle cx="8" cy="8" r="6.2" /><path d="M8 4.8V8l2.1 1.4" />
                    </svg>
                    SLA window{" "}
                    <span className="tabular-nums text-charcoal">
                      {now !== null && slaTargets?.[lead.id] ? formatRemaining(slaTargets[lead.id] - now) : "--:--:--"}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(lead.id)}
                  className="shrink-0 rounded-lg border border-amber/70 bg-amber/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-deep transition-colors hover:bg-amber hover:text-forest-ink"
                >
                  Open
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* kanban */}
        <section aria-label="Case pipeline" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colLeads = liveLeads.filter((l) => l.status === col.status);
            return (
              <div key={col.status} className="rounded-2xl border border-forest/10 bg-sage-wash/40 p-3">
                <div className="flex items-center justify-between px-1 pb-2.5">
                  <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} aria-hidden />
                    {col.label}
                  </p>
                  <span className="rounded-full border border-forest/10 bg-white px-2 py-0.5 text-[11px] font-bold tabular-nums text-forest">
                    {colLeads.length}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {colLeads.length === 0 && (
                    <li className="rounded-xl border border-dashed border-forest/20 px-3 py-4 text-center text-[12px] text-slate">
                      Nothing here right now
                    </li>
                  )}
                  {colLeads.map((lead) => (
                    <li
                      key={lead.id}
                      className="rounded-2xl border border-forest/10 bg-white p-3.5 shadow-card"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">{lead.id}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate">
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                            <circle cx="8" cy="8" r="6.2" /><path d="M8 4.8V8l2.1 1.4" />
                          </svg>
                          {lead.age} ago
                        </span>
                      </div>
                      <p className="mt-2 font-display text-[17px] font-semibold leading-snug text-forest-ink">
                        {firstName(lead.patient)} · {ageOf(lead.patient)} yrs
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-slate">{lead.treatment}</p>
                      <div className="mt-2.5 flex items-end justify-between gap-3 border-t border-forest/10 pt-2.5">
                        <div>
                          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-slate">Budget</p>
                          <p className="text-[14px] font-semibold text-charcoal">{lead.budget}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-display text-[28px] font-semibold leading-none tabular-nums ${lead.match >= 90 ? "text-mint" : "text-amber"}`}>
                            {lead.match}
                          </p>
                          <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-slate">Match · illus.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenId(lead.id)}
                        className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-forest/20 py-2 text-[12px] font-semibold text-forest transition-colors hover:bg-sage-wash"
                      >
                        Open case
                        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <p className="text-[11px] leading-5 text-slate">
          Lead identities are anonymised to L-XXXX + first name until consent is countersigned. Match scores, budgets and
          response timings are illustrative demo data, not clinical or financial advice.
        </p>
      </main>

      {/* ─── slide-over case panel ─── */}
      {openLead && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={`Case ${openLead.id}`}>
          <button
            type="button"
            aria-label="Close case panel"
            onClick={closePanel}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
          />
          <aside className="animate-fade-slide absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-oat shadow-float">
            {/* header */}
            <div className="sticky top-0 z-10 border-b border-forest/10 bg-oat/95 px-5 py-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-oat">
                    {openLead.id}
                  </span>
                  <span className="rounded-full border border-forest/15 bg-white px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest">
                    {STATUS_LABEL[openLead.status]}
                  </span>
                  {openLead.urgent && (
                    <span className="rounded-full border border-amber/60 bg-amber-wash px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-amber-deep">
                      Urgent
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/15 text-charcoal transition-colors hover:bg-sage-wash"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                    <path d="M5 5l10 10M15 5 5 15" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-forest-ink">
                {firstName(openLead.patient)} · {ageOf(openLead.patient)} yrs
              </h2>
              <p className="text-[13px] text-slate">{openLead.treatment} · from {openLead.from} · budget {openLead.budget}</p>
            </div>

            <div className="flex-1 space-y-5 px-5 py-5">
              {/* snapshot */}
              <section aria-label="Patient snapshot">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Patient snapshot</p>
                <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    ["Age", `${ageOf(openLead.patient)} yrs`],
                    ["City", openLead.from],
                    ["Condition", LEAD_DETAILS[openLead.id]?.condition ?? openLead.treatment],
                    ["HbA1c", LEAD_DETAILS[openLead.id]?.hba1c ?? "—"],
                    ["Creatinine", LEAD_DETAILS[openLead.id]?.creatinine ?? "—"],
                    ["BMI", LEAD_DETAILS[openLead.id]?.bmi ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-forest/10 bg-white px-3 py-2.5">
                      <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate">{k}</dt>
                      <dd className="mt-1 text-[12.5px] font-semibold leading-snug text-forest-ink">{v}</dd>
                    </div>
                  ))}
                  <div className="col-span-2 rounded-xl border border-amber/50 bg-amber-wash/50 px-3 py-2.5 sm:col-span-3">
                    <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-amber-deep">Allergies</dt>
                    <dd className="mt-1 text-[12.5px] font-semibold text-forest-ink">{LEAD_DETAILS[openLead.id]?.allergies ?? "None reported"}</dd>
                  </div>
                </dl>
              </section>

              {/* AI summary */}
              <section aria-label="AI case summary" className="rounded-2xl border border-mint/30 bg-mint-wash/50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mint-deep">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M10 1.5 12.2 7l5.3 2-5.3 2L10 16.5 7.8 11l-5.3-2 5.3-2L10 1.5Z" />
                    </svg>
                    AI case summary
                  </p>
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-mint-deep/80">Draft · verify</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {(LEAD_DETAILS[openLead.id]?.bullets ?? []).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] leading-6 text-forest-ink">
                      <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M2.5 8.5 6 12 13.5 4" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-mint/20 pt-2 text-[10.5px] leading-4 text-mint-deep/90">
                  AI-assisted draft for triage only — the treating surgeon must verify against source records before any clinical decision.
                </p>
              </section>

              {/* documents */}
              <section aria-label="Documents">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">
                    Documents · {openDocs.length} reports
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(Object.keys(DOC_TYPE_STYLE) as DocType[]).map((t) => (
                      <span key={t} className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] ${DOC_TYPE_STYLE[t]}`}>
                        {t} · {openDocs.filter((d) => d.type === t).length}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="mt-2 max-h-64 space-y-1.5 overflow-y-auto pr-1">
                  {openDocs.map((doc) => (
                    <li key={doc.name} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-white px-3 py-2">
                      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-slate" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 2.5h6.5L15 6v11.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" /><path d="M11 2.5V6h3.5" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-medium leading-snug text-charcoal">{doc.name}</p>
                        <p className="text-[10.5px] text-slate">{doc.meta}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${DOC_TYPE_STYLE[doc.type]}`}>
                        {doc.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* actions */}
              <section aria-label="Actions" className="space-y-2 border-t border-forest/10 pt-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/provider/quote-builder"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-forest px-4 text-[13px] font-semibold text-oat transition-colors hover:bg-forest-deep"
                  >
                    Draft quote
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/provider/appointments"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-forest/25 px-4 text-[13px] font-semibold text-forest transition-colors hover:bg-sage-wash"
                  >
                    Schedule consult
                  </Link>
                </div>

                {declineId === openLead.id ? (
                  <div className="rounded-2xl border border-amber/50 bg-amber-wash/40 p-3.5">
                    <label htmlFor="decline-reason" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-deep">
                      Reason for declining
                    </label>
                    <select
                      id="decline-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-forest/20 bg-white px-3 text-[13px] text-charcoal outline-none focus:border-forest"
                    >
                      <option value="">Select a reason…</option>
                      {DECLINE_REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <p className="mt-2 text-[11px] leading-4 text-charcoal/80">
                      The patient receives a courteous, templated note with your reason and alternative partners. No clinical detail is shared.
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        disabled={!reason}
                        onClick={() => confirmDecline(openLead)}
                        className="h-10 flex-1 rounded-xl bg-forest text-[12.5px] font-semibold text-oat transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Confirm decline
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDeclineId(null); setReason(""); }}
                        className="h-10 rounded-xl border border-forest/20 px-4 text-[12.5px] font-semibold text-charcoal transition-colors hover:bg-sage-wash"
                      >
                        Keep case
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setDeclineId(openLead.id); setReason(""); }}
                    className="h-11 w-full rounded-xl border border-forest/10 text-[13px] font-semibold text-slate transition-colors hover:border-amber/60 hover:text-amber-deep"
                  >
                    Decline politely
                  </button>
                )}
              </section>
            </div>
          </aside>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2">
          <div className="flex items-start gap-3 rounded-2xl border border-forest/20 bg-forest-ink px-4 py-3 text-oat shadow-float">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint">
              <svg viewBox="0 0 16 16" className="h-3 w-3 text-forest-ink" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 8.5 6.5 12 13 4.5" />
              </svg>
            </span>
            <p className="text-[13px] leading-5">{toast}</p>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
