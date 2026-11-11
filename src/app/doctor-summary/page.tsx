"use client";

import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import DemoChat from "@/components/demo-chat";
import { DOCTORS, HOSPITALS } from "@/data/ethaum";

/* EthAum · Clinical summary for your local doctor.
   A one-page brief the patient hands to their cardiologist before travelling.
   Assembled by the EthAum coordination desk from uploaded records — for
   discussion, never a diagnosis. All figures are illustrative demo data. */

const SURGEON = DOCTORS.find((d) => d.slug === "meera-krishnan");
const HOSPITAL = HOSPITALS.find((h) => h.slug === "bumrungrad-international");

const PATIENT = {
  name: "Priya Raghavan",
  age: 54,
  sex: "Female",
  city: "Chennai, India",
  bloodGroup: "O+",
  allergies: "Penicillin",
  conditions: "Type 2 diabetes mellitus since 2014 (T2DM, on metformin)",
  currentMeds: "Metformin 500 mg twice daily · Aspirin 75 mg once daily",
  caseId: "ETA-2727",
  date: "11 Nov 2026",
};

const REPORTS = [
  {
    name: "Coronary angiogram",
    result: "LAD 95% stenosis · circumflex 80% · RCA 70%",
    date: "28 Sep 2026",
    file: "cath-summary-28sep.pdf",
  },
  {
    name: "Echocardiogram (2D)",
    result: "LVEF 55% · no significant mitral regurgitation",
    date: "05 Oct 2026",
    file: "echo-2d-05oct.pdf",
  },
  { name: "HbA1c", result: "6.4%", date: "02 Oct 2026", file: "labs-hba1c-02oct.pdf" },
  { name: "Serum creatinine", result: "1.1 mg/dL", date: "02 Oct 2026", file: "labs-renal-02oct.pdf" },
  { name: "Haemoglobin", result: "11.8 g/dL", date: "02 Oct 2026", file: "labs-cbc-02oct.pdf" },
  { name: "LDL cholesterol", result: "132 mg/dL", date: "02 Oct 2026", file: "labs-lipid-02oct.pdf" },
];

type MedTone = "hold" | "keep" | "stop";

const MEDS: { name: string; dose: string; instruction: string; tone: MedTone }[] = [
  {
    name: "Metformin 500 mg",
    dose: "1 tablet twice daily",
    instruction: "HOLD — stop 48 h before surgery",
    tone: "hold",
  },
  {
    name: "Aspirin 75 mg",
    dose: "1 tablet once daily",
    instruction: "CONTINUE — do not stop",
    tone: "keep",
  },
  {
    name: "Clopidogrel 75 mg",
    dose: "1 tablet once daily (started 02 Oct 2026)",
    instruction: "STOP — stop 5 days before surgery",
    tone: "stop",
  },
];

const MED_TONES: Record<MedTone, string> = {
  hold: "bg-amber-wash text-amber-deep print:bg-transparent print:text-black print:border print:border-black/40",
  keep: "bg-mint-wash text-mint-deep print:bg-transparent print:text-black print:border print:border-black/40",
  stop: "bg-[#FBEFED] text-[#A83B26] print:bg-transparent print:text-black print:border print:border-black/40",
};

const SURGERY = [
  ["Procedure", "Off-pump CABG × 3 — LIMA + SVG × 2"],
  ["Surgeon", `${SURGEON?.name ?? "Dr. Meera Krishnan"} · ${SURGEON?.role ?? "Consultant Cardiothoracic Surgeon"}`],
  ["Hospital", `${HOSPITAL?.name ?? "Bumrungrad International"}, ${HOSPITAL?.city ?? "Bangkok"}, Thailand`],
  ["Accreditation", HOSPITAL?.accreditations.join(" · ") ?? "JCI"],
  ["Admission", "12 Nov 2026 — pre-op workup on day of admission"],
  ["ICU", "2 nights (quoted)"],
  ["Total stay", "8 nights"],
  ["ICU cap", "₹14,000/day × 5 days, written into the consent"],
];

const QUESTIONS = [
  "With EF 55% and 95% LAD stenosis, is off-pump still the right approach for me, or would you put me on the pump?",
  "Which conduit material and size will you use for the LIMA and vein grafts — and will the brands be printed on my consent copy?",
  "What is my expected ICU stay, and what actually happens if I need a third night beyond the two quoted?",
  "My HbA1c is 6.4% and I am on metformin — would you postpone surgery if my sugars run high on the day, and how should I manage metformin in the 48 hours before?",
  "When can I fly home — who signs the fit-to-fly certificate, and who arranges my first post-operative echo after I land?",
];

const NEEDS = [
  "Confirm I am fit for a long-haul flight (Chennai → Bangkok, about 4 hours) on 12 Nov, and for the return journey after surgery.",
  "Tell me, in writing, any medication change you want before I travel, so that my surgeon and I are working from the same list.",
  "Say whether you want a repeat ECG or echocardiogram within the next 30 days — my latest echo is dated 05 Oct 2026.",
  "Point me to a cardiac rehabilitation referral at home: which centre, and when should I start after landing?",
  "Confirm how you want the penicillin allergy handled (prophylaxis protocol), and whether you see any interaction with the antiplatelets above.",
  "Tell me whether 6.4% HbA1c is good enough to travel on 12 Nov or whether you want tighter control before I fly.",
];

export default function DoctorSummaryPage() {
  return (
    <div className="bg-oat print:bg-white">
      <SiteNav />

      <div className="no-print">
        <PageHeader
          crumbs={[
            ["Home", "/"],
            ["Journey", "/dashboard"],
            ["Doctor summary", "/doctor-summary"],
          ]}
          eyebrow="Case ETA-2727 · 11 Nov 2026"
          title="One page for the cardiologist who stays behind."
          sub="Print this, hand it over, and talk. It carries the reports your surgeon has already seen, the plan being made, and the questions you intend to ask — so the conversation starts from facts, not from scratch."
        />
      </div>

      {/* ───────── ACTIONS ───────── */}
      <div className="no-print border-b border-forest/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-amber px-6 text-[14px] font-bold text-forest-ink transition-colors hover:bg-amber-deep hover:text-oat"
          >
            <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 7V2.5h8V7M5 13H3.5A1.5 1.5 0 0 1 2 11.5v-3A1.5 1.5 0 0 1 3.5 7h11A1.5 1.5 0 0 1 16 8.5v3a1.5 1.5 0 0 1-1.5 1.5H13" />
              <path d="M5 11h8v4.5H5z" />
            </svg>
            Print / save as PDF
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-forest px-6 text-[14px] font-bold text-forest transition-colors hover:bg-forest hover:text-oat"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14 8H3.5M7 3.5 2.5 8 7 12.5" />
            </svg>
            Back to my journey
          </Link>
          <p className="text-[11px] leading-4 text-slate sm:ml-auto sm:max-w-xs sm:text-right">
            Prints on one A4 page. Use your browser&apos;s print dialogue and choose “Save as PDF” to
            keep a copy for your records.
          </p>
        </div>
      </div>

      {/* ───────── THE BRIEF ───────── */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 print:max-w-none print:px-2 print:py-0">
        <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card print:rounded-none print:border-0 print:p-0 print:shadow-none print:[zoom:0.8] sm:p-8">
          {/* masthead */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-forest/80 pb-4 print:border-black">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:text-black">
                EthAum coordination desk
              </p>
              <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-forest-ink print:text-black">
                EthAum — Clinical summary for your local doctor
              </h1>
              <p className="mt-1.5 text-[11.5px] leading-4 text-charcoal/80 print:text-black">
                Prepared by the EthAum coordination desk — for discussion, not a diagnosis.
              </p>
            </div>
            <dl className="text-[11px] leading-5 print:text-black">
              <div className="flex gap-2">
                <dt className="font-semibold text-slate print:text-black">Case</dt>
                <dd className="font-bold text-forest-ink print:text-black">{PATIENT.caseId}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-slate print:text-black">Date</dt>
                <dd className="font-bold text-forest-ink print:text-black">{PATIENT.date}</dd>
              </div>
            </dl>
          </div>

          {/* patient block */}
          <div className="mt-4 rounded-2xl border border-forest/15 bg-oat p-4 print:rounded-none print:border-black/40 print:bg-white print:p-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest print:text-black">
                Patient
              </p>
              <span className="rounded-full bg-amber-wash px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-amber-deep print:bg-transparent print:text-black">
                Illustrative demo data
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[11.5px] leading-4 print:text-black sm:grid-cols-3">
              {[
                ["Name", PATIENT.name],
                ["Age / sex", `${PATIENT.age} · ${PATIENT.sex}`],
                ["City", PATIENT.city],
                ["Blood group", PATIENT.bloodGroup],
                ["Allergies", PATIENT.allergies],
                ["Conditions", PATIENT.conditions],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate print:text-black">
                    {k}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-forest-ink print:text-black">{v}</dd>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-forest/10 pt-2 text-[11px] leading-4 print:border-black/30 print:text-black">
              <span className="font-bold">Current medication:</span> {PATIENT.currentMeds}
            </p>
          </div>

          {/* disclaimer banner */}
          <div className="mt-4 rounded-2xl border-2 border-amber/50 bg-amber-wash/60 px-4 py-3 print:rounded-none print:border-black print:bg-white print:px-3 print:py-2">
            <p className="text-[11.5px] leading-5 text-charcoal print:text-black">
              <span className="font-bold">Please read first.</span> This summary was assembled by
              EthAum&apos;s coordination desk from your uploaded records and shared with you for
              review. It is not a medical opinion — your treating surgeon and your local cardiologist
              decide everything.
            </p>
          </div>

          {/* two columns */}
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2 print:mt-3 print:grid-cols-2 print:gap-3">
            {/* ── LEFT ── */}
            <section className="min-w-0">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:text-black">
                01 · Reason for travelling
              </h2>
              <p className="mt-2 text-[12.5px] leading-5 text-charcoal print:mt-1 print:text-[11px] print:leading-[1.35] print:text-black">
                <span className="font-bold text-forest-ink print:text-black">
                  CABG for triple-vessel coronary artery disease.
                </span>{" "}
                Angiogram of 28 Sep 2026 showed significant stenosis in the LAD (95%), circumflex
                (80%) and RCA (70%). Surgical revascularisation has been planned at Bumrungrad
                International, Bangkok, with admission on 12 Nov 2026. She has Type 2 diabetes since
                2014 and takes dual antiplatelet therapy started 02 Oct 2026.
              </p>

              <h2 className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:mt-2.5 print:text-black">
                02 · Key reports on file
              </h2>
              <table className="mt-2 w-full border-collapse text-left text-[10.5px] print:mt-1 print:text-[9px] print:leading-[1.3] print:text-black">
                <thead>
                  <tr className="border-b border-forest/25 print:border-black/50">
                    <th className="py-1.5 pr-2 font-bold text-forest-ink print:py-1 print:text-black">Report</th>
                    <th className="py-1.5 pr-2 font-bold text-forest-ink print:py-1 print:text-black">Result</th>
                    <th className="py-1.5 pr-2 font-bold text-forest-ink print:py-1 print:text-black">Date</th>
                    <th className="py-1.5 font-bold text-forest-ink print:py-1 print:text-black">Source file</th>
                  </tr>
                </thead>
                <tbody>
                  {REPORTS.map((r) => (
                    <tr key={r.name} className="border-b border-forest/10 align-top print:border-black/25">
                      <td className="py-1.5 pr-2 font-semibold text-charcoal print:py-1 print:text-black">{r.name}</td>
                      <td className="py-1.5 pr-2 text-charcoal/85 print:py-1 print:text-black">{r.result}</td>
                      <td className="py-1.5 pr-2 whitespace-nowrap text-slate print:py-1 print:text-black">{r.date}</td>
                      <td className="py-1.5 font-mono text-[9.5px] text-slate print:py-1 print:text-black">
                        {r.file}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:mt-2.5 print:text-black">
                03 · Current medication &amp; EthAum pre-op instruction
              </h2>
              <table className="mt-2 w-full border-collapse text-left text-[10.5px] print:mt-1 print:text-[9px] print:leading-[1.3] print:text-black">
                <thead>
                  <tr className="border-b border-forest/25 print:border-black/50">
                    <th className="py-1.5 pr-2 font-bold text-forest-ink print:py-1 print:text-black">Medicine</th>
                    <th className="py-1.5 pr-2 font-bold text-forest-ink print:py-1 print:text-black">Dose</th>
                    <th className="py-1.5 font-bold text-forest-ink print:py-1 print:text-black">
                      EthAum pre-op instruction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MEDS.map((m) => (
                    <tr key={m.name} className="border-b border-forest/10 align-top print:border-black/25">
                      <td className="py-1.5 pr-2 font-semibold text-charcoal print:py-1 print:text-black">{m.name}</td>
                      <td className="py-1.5 pr-2 text-charcoal/85 print:py-1 print:text-black">{m.dose}</td>
                      <td className="py-1.5 print:py-1">
                        <span
                          className={`inline-block rounded-md px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] ${MED_TONES[m.tone]}`}
                        >
                          {m.instruction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[10px] leading-4 text-slate print:text-black">
                Pre-op instructions above are as advised by the treating surgeon, for confirmation.
                Please confirm or amend them here.
              </p>
            </section>

            {/* ── RIGHT ── */}
            <section className="min-w-0">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:text-black">
                04 · Planned surgery
              </h2>
              <dl className="mt-2 rounded-2xl border border-forest/15 p-3 print:mt-1 print:rounded-none print:border-black/40 print:p-2">
                {SURGERY.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-wrap items-baseline gap-x-2 border-b border-forest/10 py-1 last:border-0 print:border-black/20 print:py-0.5"
                  >
                    <dt className="w-28 shrink-0 text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate print:text-black">
                      {k}
                    </dt>
                    <dd className="text-[11px] leading-4 font-semibold text-forest-ink print:text-[9.5px] print:leading-[1.3] print:text-black">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:mt-2.5 print:text-black">
                05 · Five questions I will ask the surgeon
              </h2>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[11px] leading-4 text-charcoal print:mt-1 print:space-y-1 print:text-[9.5px] print:leading-[1.35] print:text-black">
                {QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>

              <h2 className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:mt-2.5 print:text-black">
                06 · What we need from you
              </h2>
              <ul className="mt-2 space-y-1.5 text-[11px] leading-4 text-charcoal print:mt-1 print:space-y-1 print:text-[9.5px] print:leading-[1.35] print:text-black">
                {NEEDS.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest print:bg-black" aria-hidden />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-deep print:mt-2.5 print:text-black">
                07 · EthAum coordinator
              </h2>
              <div className="mt-2 rounded-2xl border border-forest/15 bg-oat p-3 print:rounded-none print:border-black/40 print:bg-white print:p-2.5">
                <p className="text-[11.5px] leading-4 font-bold text-forest-ink print:text-black">
                  Anita — EthAum coordination desk
                </p>
                <p className="mt-1 text-[10.5px] leading-4 text-charcoal/85 print:text-black">
                  In-app concierge chat inside the EthAum app, 24×7 — no phone line, no call centre.
                  Anita answers within 3 minutes on visa letters, the ICU cap, the discharge date,
                  the fit-to-fly certificate and your return flight, and every answer is saved on
                  your case file. Emergency medical help always comes from the hospital first.
                </p>
                <div className="no-print mt-2.5">
                  <DemoChat label="Open the concierge chat" variant="light" />
                </div>
                <p className="no-print mt-2 text-[9.5px] leading-3.5 text-slate">
                  Demo build — the chat is scripted and nothing is transmitted.
                </p>
              </div>
            </section>
          </div>

          {/* footer line */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-forest/15 pt-3 print:border-black/40">
            <p className="text-[9.5px] leading-3.5 text-slate print:text-black">
              Case {PATIENT.caseId} · Issued {PATIENT.date} by the EthAum coordination desk ·
              Illustrative demo data, not a binding quote or a medical opinion.
            </p>
            <p className="text-[9.5px] leading-3.5 font-semibold text-forest print:text-black">
              EthAum coordinates the journey; accredited hospitals provide the treatment.
            </p>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
