"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import ProviderTabs from "@/components/provider-tabs";

type SlotType = "virtual" | "surgery" | "followup";

type Appointment = {
  id: string;
  day: number; // 0 = Mon … 5 = Sat
  hour: number; // 8–17
  type: SlotType;
  patientId: string;
  name: string;
  procedure: string;
  when: string;
  where: string;
  coordinator: string;
  note: string;
};

const DAYS = [
  { label: "Mon", date: "2 Nov" },
  { label: "Tue", date: "3 Nov" },
  { label: "Wed", date: "4 Nov" },
  { label: "Thu", date: "5 Nov", today: true },
  { label: "Fri", date: "6 Nov" },
  { label: "Sat", date: "7 Nov" },
];

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 … 17:00

const APPOINTMENTS: Appointment[] = [
  { id: "a1", day: 0, hour: 9, type: "virtual", patientId: "L-2481", name: "Priya", procedure: "CABG pre-op consult", when: "Mon 2 Nov · 09:00–09:30 IST", where: "Tele-consult · video link in secure chat", coordinator: "Divya (Hindi + English)", note: "Metformin hold discussed; wife joins from Chennai." },
  { id: "a2", day: 0, hour: 13, type: "followup", patientId: "L-2478", name: "Vikram", procedure: "FUE day-30 review", when: "Mon 2 Nov · 13:00–13:15 IST", where: "OPD · Day-care suite 3", coordinator: "Arjun (English)", note: "Graft count invoice verified; shedding phase reassurance given." },
  { id: "a3", day: 1, hour: 8, type: "surgery", patientId: "L-2476", name: "Sanjay", procedure: "PET-CT + CT-guided biopsy", when: "Tue 3 Nov · 08:00–11:30", where: "OT 2 · Imaging block, 4th floor", coordinator: "Divya (Marathi + English)", note: "Contrast cleared — eGFR 78. Pre-meds for contrast allergy in file." },
  { id: "a4", day: 1, hour: 10, type: "virtual", patientId: "L-2480", name: "Ahmed", procedure: "Gastric sleeve — pre-op review", when: "Tue 3 Nov · 10:00–10:30 IST", where: "Tele-consult · video link in secure chat", coordinator: "Divya (Hindi + Urdu)", note: "Liquid diet starts Tue; HbA1c 5.9 — diabetes counselling done." },
  { id: "a5", day: 2, hour: 9, type: "surgery", patientId: "L-2479", name: "Meera", procedure: "TKR — right knee (robotic)", when: "Wed 4 Nov · 09:00–12:30", where: "OT 1 · Orthopaedics, 6th floor", coordinator: "Divya (Malayalam + English)", note: "Staged left knee 8 weeks later if recovery on track." },
  { id: "a6", day: 2, hour: 14, type: "followup", patientId: "L-2477", name: "Kavya", procedure: "IVF — cycle day-5 check", when: "Wed 4 Nov · 14:00–14:20 IST", where: "OPD · Fertility clinic", coordinator: "Arjun (Telugu + English)", note: "Blastocyst count + grading to be shared same evening." },
  { id: "a7", day: 3, hour: 11, type: "virtual", patientId: "L-2479", name: "Meera", procedure: "Records review — post-labs", when: "Today · 11:00–11:20 IST", where: "Tele-consult · video link in secure chat", coordinator: "Divya (Malayalam + English)", note: "Hb 11.8 — iron studies added; continue without transfusion." },
  { id: "a8", day: 4, hour: 8, type: "surgery", patientId: "L-2480", name: "Ahmed", procedure: "Laparoscopic gastric sleeve", when: "Fri 6 Nov · 08:00–09:30", where: "OT 2 · Bariatric, 5th floor", coordinator: "Divya (Hindi + Urdu)", note: "Leak test day 2. VTE prophylaxis per protocol." },
  { id: "a9", day: 4, hour: 15, type: "followup", patientId: "L-2481", name: "Priya", procedure: "Day-7 cardiac review", when: "Fri 6 Nov · 15:00–15:20 IST", where: "OPD · Cardiac clinic", coordinator: "Divya (Hindi + English)", note: "Wound check + ECHO; metformin restart only after surgeon sign-off." },
  { id: "a10", day: 5, hour: 10, type: "virtual", patientId: "L-2477", name: "Kavya", procedure: "IVF — embryo transfer consult", when: "Sat 7 Nov · 10:00–10:30 IST", where: "Tele-consult · video link in secure chat", coordinator: "Arjun (Telugu + English)", note: "Lining 8.4 mm on day 12 scan; transfer window confirmed." },
];

const TYPE_STYLE: Record<SlotType, { chip: string; dot: string; label: string }> = {
  virtual: { chip: "border-mint/40 bg-mint-wash text-mint-deep", dot: "bg-mint", label: "Virtual" },
  surgery: { chip: "border-amber/50 bg-amber-wash text-amber-deep", dot: "bg-amber", label: "Surgery" },
  followup: { chip: "border-slate/30 bg-mist text-slate", dot: "bg-slate", label: "Follow-up" },
};

/* ─── today's arrivals ─── */

type Arrival = { id: string; patientId: string; name: string; procedure: string; eta: string; companionNote: string };

const ARRIVALS: Arrival[] = [
  { id: "A1", patientId: "L-2479", name: "Meera", procedure: "TKR pre-admission · bloods + consent", eta: "07:40", companionNote: "Companion (husband) checked in at lobby · 07:35" },
  { id: "A2", patientId: "L-2481", name: "Priya", procedure: "CABG pre-op workup · ECG + echo", eta: "09:30", companionNote: "Companion (wife) arrived in lobby · 09:22" },
  { id: "A3", patientId: "L-2476", name: "Sanjay", procedure: "PET-CT + biopsy admission", eta: "12:15", companionNote: "Companion (wife) arrived in lobby · 12:08" },
];

/* ─── secure chat threads ─── */

type ChatMessage = { id: string; from: "patient" | "hospital"; text: string; time: string };
type ChatThread = { id: string; patientId: string; name: string; tag: string; unread: number; messages: ChatMessage[] };

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "t-2481", patientId: "L-2481", name: "Priya", tag: "CABG · Bumrungrad", unread: 2,
    messages: [
      { id: "m1", from: "patient", text: "Namaste, do I keep fasting before the angiogram results call?", time: "08:12" },
      { id: "m2", from: "hospital", text: "Hi Priya — fasting only for the blood draw, 8 hours. Water is fine.", time: "08:20" },
      { id: "m3", from: "patient", text: "And the metformin — stop from when?", time: "08:24" },
      { id: "m4", from: "patient", text: "Also requesting the Hindi consent form please.", time: "08:25" },
    ],
  },
  {
    id: "t-2480", patientId: "L-2480", name: "Ahmed", tag: "Gastric sleeve · Apollo", unread: 1,
    messages: [
      { id: "m1", from: "hospital", text: "Ahmed — your pre-op labs arrived. All within range except HbA1c 5.9, noted.", time: "Yesterday" },
      { id: "m2", from: "patient", text: "Should I stop metformin before surgery?", time: "Yesterday" },
    ],
  },
  {
    id: "t-2479", patientId: "L-2479", name: "Meera", tag: "TKR bilateral · Bumrungrad", unread: 3,
    messages: [
      { id: "m1", from: "hospital", text: "Meera — your right knee surgery is confirmed for Wed 4 Nov, 09:00.", time: "07:40" },
      { id: "m2", from: "patient", text: "Can my husband stay overnight in the room?", time: "07:52" },
      { id: "m3", from: "patient", text: "And is the robotic jig included in the quote?", time: "07:53" },
      { id: "m4", from: "patient", text: "Please share the consent in Malayalam.", time: "07:54" },
    ],
  },
  {
    id: "t-2478", patientId: "L-2478", name: "Vikram", tag: "FUE · Acıbadem", unread: 0,
    messages: [
      { id: "m1", from: "patient", text: "Graft count 3,800 confirmed. My flight lands 14:20 — pickup?", time: "Tue" },
      { id: "m2", from: "hospital", text: "Yes — lounge exit, name board L-2478. Driver will be there.", time: "Tue" },
    ],
  },
];

const E2E_PILL = (
  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint-wash/60 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.16em] text-mint-deep">
    <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="8" height="5.5" rx="1.2" /><path d="M4 5V3.6a2 2 0 0 1 4 0V5" />
    </svg>
    encrypted · E2E
  </span>
);

export default function AppointmentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>("a7");
  const [emptySlot, setEmptySlot] = useState<{ day: number; hour: number } | null>(null);
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});
  const [chatOpen, setChatOpen] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_THREADS[0].id);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => APPOINTMENTS.find((a) => a.id === selectedId) ?? null,
    [selectedId]
  );
  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);
  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const openThread = (id: string) => {
    setActiveThreadId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const msg: ChatMessage = { id: `m-${Date.now()}`, from: "hospital", text, time: "now" };
    setThreads((prev) => prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, msg] } : t)));
    setDraft("");
  };

  const selectAppointment = (id: string) => {
    setSelectedId(id);
    setEmptySlot(null);
  };
  const selectEmptySlot = (day: number, hour: number) => {
    setSelectedId(null);
    setEmptySlot({ day, hour });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://meet.ethaum.demo/c/L-2479?t=11:00");
      setCopied(true);
    } catch {
      setCopied(true); // still show feedback in demo environments without clipboard access
    }
  };
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  return (
    <>
      <SiteNav />
      <PageHeader
        crumbs={[
          ["Home", "/"],
          ["Partner portal", "/provider"],
          ["Appointments", "/provider/appointments"],
        ]}
        eyebrow="Partner portal · Appointments"
        title="The week at a glance."
        sub="Virtual checks, theatre slots and follow-ups in one grid. Timings and notes are illustrative demo data."
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <ProviderTabs />

        <div className="grid gap-6 xl:grid-cols-3">
          {/* ─── week grid ─── */}
          <section aria-label="Week grid" className="xl:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/10 px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Week · 2–7 Nov 2026</p>
                  <p className="text-[11px] text-slate">IST · partner OTs &amp; tele-clinics</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                  {(Object.keys(TYPE_STYLE) as SlotType[]).map((t) => (
                    <span key={t} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${TYPE_STYLE[t].chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${TYPE_STYLE[t].dot}`} aria-hidden />
                      {TYPE_STYLE[t].label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[46rem]">
                  {/* day header */}
                  <div className="grid grid-cols-[3.25rem_repeat(6,1fr)] border-b border-forest/10">
                    <div aria-hidden />
                    {DAYS.map((d) => (
                      <div key={d.label} className={`px-2 py-2 text-center ${d.today ? "bg-mint-wash/50" : ""}`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal">
                          {d.label}
                          {d.today && <span className="ml-1 rounded-full bg-mint px-1.5 py-0.5 text-[8px] font-bold text-forest-ink">Today</span>}
                        </p>
                        <p className="text-[10px] tabular-nums text-slate">{d.date}</p>
                      </div>
                    ))}
                  </div>
                  {/* time rows */}
                  {HOURS.map((hour) => (
                    <div key={hour} className="grid grid-cols-[3.25rem_repeat(6,1fr)] border-b border-forest/5 last:border-0">
                      <div className="px-2 pt-1.5 text-right text-[10px] font-semibold tabular-nums text-slate">
                        {String(hour).padStart(2, "0")}:00
                      </div>
                      {DAYS.map((d, dayIdx) => {
                        const appt = APPOINTMENTS.find((a) => a.day === dayIdx && a.hour === hour);
                        if (!appt) {
                          return (
                            <button
                              key={d.label}
                              type="button"
                              onClick={() => selectEmptySlot(dayIdx, hour)}
                              aria-label={`Open slot ${d.label} ${hour}:00`}
                              className="group min-h-[4.5rem] border-l border-forest/5 p-1 text-left transition-colors hover:bg-sage-wash/50"
                            >
                              <span className="block h-full rounded-lg border border-transparent transition-colors group-hover:border-dashed group-hover:border-forest/20" />
                            </button>
                          );
                        }
                        const style = TYPE_STYLE[appt.type];
                        const active = selectedId === appt.id;
                        return (
                          <div key={d.label} className={`min-h-[4.5rem] border-l border-forest/5 p-1 ${d.today ? "bg-mint-wash/30" : ""}`}>
                            <button
                              type="button"
                              onClick={() => selectAppointment(appt.id)}
                              aria-pressed={active}
                              className={`flex h-full w-full flex-col justify-between rounded-lg border px-2 py-1.5 text-left transition-all ${style.chip} ${active ? "ring-2 ring-forest/40" : "hover:brightness-95"}`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-[0.12em] leading-tight">
                                {appt.patientId} · {appt.name}
                              </span>
                              <span className="mt-1 text-[10px] leading-tight opacity-90 line-clamp-2">{appt.procedure}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─── right rail ─── */}
          <div className="space-y-4">
            {/* selected slot details */}
            <section aria-label="Slot details" aria-live="polite" className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
              {selected ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Slot details</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] ${TYPE_STYLE[selected.type].chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${TYPE_STYLE[selected.type].dot}`} aria-hidden />
                      {TYPE_STYLE[selected.type].label}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-forest-ink">
                    {selected.patientId} · {selected.name}
                  </h2>
                  <p className="mt-0.5 text-[13px] leading-snug text-charcoal">{selected.procedure}</p>
                  <dl className="mt-4 space-y-2.5 text-[12.5px]">
                    {[
                      ["When", selected.when],
                      ["Where", selected.where],
                      ["Coordinator", selected.coordinator],
                      ["Clinical note", selected.note],
                    ].map(([k, v]) => (
                      <div key={k as string} className="rounded-xl bg-oat px-3 py-2">
                        <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate">{k}</dt>
                        <dd className="mt-0.5 leading-5 text-charcoal">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.type === "virtual" && (
                      <button type="button" onClick={copyLink}
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-forest/20 px-4 text-[12px] font-semibold text-forest transition-colors hover:bg-sage-wash">
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <rect x="5" y="5" width="8" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H4.5A1.5 1.5 0 0 0 3 3.5v8A1.5 1.5 0 0 0 4.5 13H5" />
                        </svg>
                        {copied ? "Link copied ✓" : "Copy video link"}
                      </button>
                    )}
                    <Link href="/provider"
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-forest px-4 text-[12px] font-semibold text-oat transition-colors hover:bg-forest-deep">
                      Open full case
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg>
                    </Link>
                  </div>
                </>
              ) : emptySlot ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Open slot</p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-forest-ink">
                    {DAYS[emptySlot.day].label} {DAYS[emptySlot.day].date} · {String(emptySlot.hour).padStart(2, "0")}:00
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-6 text-charcoal">
                    No appointment booked in this hour. EthAum can offer it to the waitlist — typically 2–3 patients are
                    waiting for {DAYS[emptySlot.day].label} morning slots (illustrative).
                  </p>
                  <p className="mt-3 rounded-xl border border-dashed border-forest/25 bg-sage-wash/40 px-4 py-3 text-[12px] leading-5 text-forest">
                    Waitlist auto-notify is on. If a patient confirms, you’ll get a nudge here and in secure chat — no action needed now.
                  </p>
                </>
              ) : (
                <p className="text-[13px] text-slate">Select any slot in the grid to see details.</p>
              )}
            </section>

            {/* today's arrivals */}
            <section aria-label="Today's arrivals" className="rounded-2xl border border-forest/10 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-deep">Today · Thu 5 Nov · arrivals</p>
                <span className="rounded-full bg-sage-wash px-2 py-0.5 text-[10px] font-bold tabular-nums text-forest">
                  {ARRIVALS.filter((a) => checkedIn[a.id]).length}/{ARRIVALS.length} in
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {ARRIVALS.map((a) => {
                  const done = !!checkedIn[a.id];
                  return (
                    <li key={a.id} className={`rounded-xl border px-3 py-2.5 transition-colors ${done ? "border-mint/30 bg-mint-wash/40" : "border-forest/10 bg-oat"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                            {a.id} · {a.patientId} · ETA {a.eta}
                          </p>
                          <p className="mt-0.5 text-[13px] font-semibold leading-snug text-forest-ink">{a.name} — {a.procedure}</p>
                        </div>
                        <button type="button" onClick={() => setCheckedIn((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}
                          aria-pressed={done}
                          className={`h-10 shrink-0 rounded-xl px-3.5 text-[11.5px] font-bold uppercase tracking-[0.1em] transition-colors ${done ? "bg-mint text-forest-ink" : "border border-forest/25 text-forest hover:bg-sage-wash"}`}>
                          {done ? "Checked in ✓" : "Check in"}
                        </button>
                      </div>
                      {done && (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-mint/25 bg-white px-2.5 py-1.5 text-[11px] font-medium text-mint-deep">
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5 6.5 12 13 4.5" /></svg>
                          {a.companionNote}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* secure chat launcher */}
            <button type="button" onClick={() => setChatOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-forest/10 bg-forest-ink px-5 py-4 text-left text-oat shadow-float transition-transform hover:-translate-y-0.5">
              <span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">Secure chat</span>
                <span className="mt-1 block text-[15px] font-semibold">Patient threads · end-to-end encrypted</span>
                <span className="mt-0.5 block text-[11px] text-sage-mist">Only your hospital’s threads · DPDP aligned</span>
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-forest">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v6A2.5 2.5 0 0 1 14.5 14H9l-4.2 3.2A.8.8 0 0 1 3.5 16.6V5.5Z" />
                </svg>
                {totalUnread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber px-1.5 text-[11px] font-bold text-forest-ink">
                    {totalUnread}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        <p className="text-[11px] leading-5 text-slate">
          Slot timings, ETAs and clinical notes are illustrative demo data. Chat payloads never leave this browser in the demo build.
        </p>
      </main>

      {/* ─── secure chat drawer ─── */}
      {chatOpen && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Secure chat">
          <button type="button" aria-label="Close secure chat" onClick={() => setChatOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]" />
          <aside className="animate-fade-slide absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-oat shadow-float">
            {/* banner */}
            <div className="flex items-start gap-2 border-b border-forest/10 bg-forest-ink px-4 py-3 text-oat">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3.5" y="8" width="13" height="9" rx="2" /><path d="M6.5 8V6a3.5 3.5 0 0 1 7 0v2" />
              </svg>
              <p className="text-[11.5px] leading-5 text-sage-mist">
                <span className="font-semibold text-oat">End-to-end encrypted.</span> Hospital staff see only their hospital’s thread — never EthAum ops, never other partners.
              </p>
              <button type="button" onClick={() => setChatOpen(false)} aria-label="Close"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-sage-mist transition-colors hover:bg-white/10">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M5 5l10 10M15 5 5 15" /></svg>
              </button>
            </div>

            {/* thread picker */}
            <div className="border-b border-forest/10 px-3 py-2.5">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {threads.map((t) => {
                  const active = t.id === activeThreadId;
                  return (
                    <button key={t.id} type="button" onClick={() => openThread(t.id)}
                      aria-pressed={active}
                      className={`relative flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${active ? "border-forest bg-forest text-oat" : "border-forest/15 bg-white text-charcoal hover:border-forest/30"}`}>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[0.14em]">{t.patientId}</span>
                        <span className="block text-[11px] opacity-80">{t.name}</span>
                      </span>
                      {t.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1.5 text-[10px] font-bold text-forest-ink">
                          {t.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate">{activeThread.tag}</p>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {activeThread.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "hospital" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-5 shadow-sm ${m.from === "hospital" ? "rounded-br-md bg-forest text-oat" : "rounded-bl-md border border-forest/10 bg-white text-charcoal"}`}>
                    <p>{m.text}</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className={`text-[9px] tabular-nums ${m.from === "hospital" ? "text-sage-mist/80" : "text-slate"}`}>{m.time}</span>
                      {E2E_PILL}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* composer */}
            <form
              className="border-t border-forest/10 bg-white p-3"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <label htmlFor="chat-input" className="sr-only">Message {activeThread.name}</label>
              <div className="flex items-center gap-2">
                <input id="chat-input" value={draft} onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${activeThread.name}…`}
                  autoComplete="off"
                  className="h-12 flex-1 rounded-xl border border-forest/20 bg-oat px-4 text-[13.5px] text-charcoal outline-none placeholder:text-slate/60 focus:border-forest" />
                <button type="submit" aria-label="Send message" disabled={!draft.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-oat transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M17.5 2.5 9 11M17.5 2.5 12 17.5l-3-6.5-6.5-3L17.5 2.5Z" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[9.5px] text-slate">Press Enter to send · messages are encrypted before leaving this device.</p>
            </form>
          </aside>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
