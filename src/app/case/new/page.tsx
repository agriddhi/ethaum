"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";
import DemoChat from "@/components/demo-chat";
import { createCase, updateCase, getCaseSnapshot } from "@/lib/case-store";
import { TREATMENTS } from "@/data/ethaum";

type UploadedDoc = { id: number; name: string; size: string; kind: "Lab" | "Imaging" | "Prescription" | "Discharge" | "Unknown"; status: "scanning" | "done" };
type Phase = "form" | "qualify" | "done";

const QUAL = [
  { q: "Chest pain at rest, lying flat, or with minimal exertion?", weight: 25 },
  { q: "Breathlessness climbing 15–20 stairs?", weight: 10 },
  { q: "Diabetes uncontrolled (recent HbA1c > 8.5% or symptoms)?", weight: 10 },
  { q: "On aspirin / clopidogrel or other blood thinners?", weight: 10 },
  { q: "BMI > 35 or weight above 110 kg?", weight: 10 },
];

const KIND_FOR = ["Lab", "Imaging", "Prescription", "Discharge", "Lab", "Imaging"] as const;
const REQUIRED_BY: Record<string, string[]> = {
  Cardiac: ["Angiogram / CT", "Echo + ECG", "Lipid profile", "Creatinine"],
  Orthopaedics: ["X-ray (standing)", "MRI (if recent)", "Blood panel"],
  Fertility: ["AMH + baseline scan", "Semen analysis", "Previous cycle history"],
  Dental: ["OPG / CBCT"],
  Bariatric: ["BMI + comorbidity profile", "HbA1c", "Endoscopy report"],
  Ophthalmology: ["Refraction sheet", "Topography"],
  Oncology: ["Biopsy / histo", "PET-CT", "MDT notes"],
  Cosmetic: ["Photos (front/sides)", "Medical history form"],
};

export default function CaseNewPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [treatment, setTreatment] = useState("cardiac-cabg");
  const [condition, setCondition] = useState("");
  const [urgency, setUrgency] = useState<"routine" | "soon" | "urgent">("soon");
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [budget, setBudget] = useState(12);
  const [companions, setCompanions] = useState(1);
  const [languages, setLanguages] = useState<string[]>(["Hindi", "English"]);
  const [diet, setDiet] = useState("No preference");
  const [cost, setCost] = useState(60);
  const [quality, setQuality] = useState(90);
  const [speed, setSpeed] = useState(50);
  const [phase, setPhase] = useState<Phase>("form");
  const [caseId, setCaseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean | undefined>>({});
  const [aiExplain, setAiExplain] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);

  const t = TREATMENTS.find((x) => x.slug === treatment)!;
  const required = REQUIRED_BY[t.category] ?? REQUIRED_BY.Cardiac;
  const present = new Set(docs.filter((d) => d.status === "done").map((d) => d.kind));
  const missingRefined = required.filter((r) => {
    const k = r.toLowerCase();
    const labHit = present.has("Lab") && ["lipid", "creatinine", "blood", "amh", "hba1c", "vitamin", "histo"].some((s) => k.includes(s));
    const imgHit = present.has("Imaging") && ["x-ray", "mri", "angiogram", "ct", "opg", "topography", "echo", "pet"].some((s) => k.includes(s));
    const rxHit = present.has("Prescription") && k.includes("previous");
    const dcHit = present.has("Discharge") && k.includes("history");
    return !(labHit || imgHit || rxHit || dcHit);
  });

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
      kind: KIND_FOR[(docs.length + i) % KIND_FOR.length] as UploadedDoc["kind"],
      status: "scanning" as const,
    }));
    setDocs((d) => [...d, ...incoming]);
    incoming.forEach((doc) => {
      window.setTimeout(() => {
        setDocs((cur) => cur.map((d) => (d.id === doc.id ? { ...d, status: "done" } : d)));
        updateCase({ docsUploaded: (getCaseSnapshot()?.docsUploaded ?? 0) + 1 });
      }, 900 + Math.random() * 900);
    });
  };

  const toggleLang = (l: string) => setLanguages((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]));

  const createCaseAndQualify = () => {
    const created = createCase({
      treatmentSlug: treatment,
      treatmentName: t.name,
      condition,
      urgency,
      budget,
      companions,
      languages,
      diet,
      priorities: { cost, quality, speed },
      docsUploaded: docs.filter((d) => d.status === "done").length,
    });
    setCaseId(created.id);
    setPhase("qualify");
  };

  const risk = QUAL.reduce((acc, q, i) => acc + (answers[i] === true ? q.weight : 0), 0);
  const readiness = Math.max(0, 100 - risk);
  const answered = QUAL.filter((_, i) => answers[i] !== undefined).length;
  const verdict =
    readiness >= 85
      ? { label: "Clear for surgeon review", cls: "border-mint/50 bg-mint-wash text-mint-deep", note: "No red flags on this screen — the full surgeon review still happens before any decision." }
      : readiness >= 60
        ? { label: "Proceed with optimisation", cls: "border-amber/60 bg-amber-wash text-amber-deep", note: "HbA1c / BP / weight first — 4–6 weeks of optimisation cuts operative risk meaningfully. We'll loop in your endocrinologist." }
        : { label: "Pause — optimise before surgery", cls: "border-[#C2452D]/40 bg-[#FBEFED] text-[#A83B26]", note: "Resting chest pain on this profile needs urgent cardiologist input — not a booking. We will not send you for this." };

  const answeredCount = QUAL.filter((_, i) => answers[i] !== undefined).length;

  useEffect(() => {
    if (phase !== "qualify" || answeredCount !== QUAL.length) return;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 6000);
    fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        task: "qualify",
        payload: { answers: QUAL.map((_, i) => answers[i] === true), treatment, budget, condition },
      }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.output) return;
        if (typeof d.output.explain === "string") setAiExplain(d.output.explain);
        setAiSource(d.source === "llm" ? `${d.model} (live)` : "EthAum rules engine");
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [phase, answeredCount, answers, treatment, budget, condition]);

  const stepCls = (n: number) =>
    `flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${step > n ? "bg-mint text-forest-ink" : step === n ? "bg-amber text-forest-ink" : "border border-forest/20 text-slate"}`;

  if (phase === "done" && caseId) {
    return (
      <div className="bg-oat">
        <SiteNav />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-wash">
            <svg viewBox="0 0 28 28" className="h-8 w-8 text-mint-deep" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15.5 11.5 22 23 8" /></svg>
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-forest-ink">Case {caseId} created.</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-charcoal/85">Two partner surgeons will review your file within 31 hours. Your coordinator (Meera) will WhatsApp you the moment quotes start landing — typically ₹10.2–11.6L for this case.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/matches" className="inline-flex h-12 items-center rounded-full bg-forest px-6 text-sm font-bold text-oat hover:bg-forest-deep">See your AI matches now</Link>
            <Link href="/dashboard" className="inline-flex h-12 items-center rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">Open journey tracker</Link>
            <DemoChat label="Ask a coordinator" variant="light" />
          </div>
          <p className="mt-6 text-[10.5px] text-slate">Quotes are not binding until you e-sign. EthAum token ₹9,999 refundable for 48h.</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["Your case", "/case/new"]]}
        eyebrow="Free · no obligation"
        title="Tell us once. We'll handle the rest."
        sub="Ten minutes, four steps. Your file is encrypted end-to-end and shown only to the hospitals you approve."
      />

      {/* stepper */}
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 pt-8 sm:gap-4 sm:px-6">
        {(phase === "qualify"
          ? (["Your case", "Upload records", "AI pre-screen", "Surgeon review"] as const)
          : (["Your case", "Upload records", "Constraints & priorities"] as const)).map((label, i) => (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            <span className={stepCls(i + 1)}>{phase === "qualify" ? (i < 2 ? "✓" : i + 1) : step > i + 1 ? "✓" : i + 1}</span>
            <span className={`hidden text-[12px] font-semibold sm:block ${phase === "qualify" ? (i <= 2 ? "text-forest-ink" : "text-slate") : step >= i + 1 ? "text-forest-ink" : "text-slate"}`}>{label}</span>
            {i < (phase === "qualify" ? 3 : 2) && <span className="mx-1 h-px w-6 bg-forest/15 sm:w-12" aria-hidden />}
          </div>
        ))}
      </div>

      {/* ───────── QUALIFICATION (AI pre-screen) ───────── */}
      {phase === "qualify" && (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <fieldset className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
              <legend className="sr-only">AI pre-screen — five questions</legend>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-deep">One minute &mdash; the surgeon&apos;s pre-screen</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-forest-ink">Five questions. Honest answers only.</h2>
              <p className="mt-1 text-[12px] text-slate">Same questions our partner surgeons ask on rounds. This screen does not reject anyone — it tells us how to prepare you safely.</p>
              <ol className="mt-5 space-y-3">
                {QUAL.map((item, i) => {
                  const a = answers[i];
                  return (
                    <li key={i} className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-oat p-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="max-w-md text-[13px] leading-snug text-charcoal"><span className="mr-2 font-display text-sage-mist">{String(i + 1).padStart(2, "0")}</span>{item.q}</span>
                      <div className="flex shrink-0 gap-2">
                        {(["no", "yes"] as const).map((opt) => {
                          const val = opt === "yes";
                          const active = a === val;
                          return (
                            <button key={opt} onClick={() => setAnswers((cur) => ({ ...cur, [i]: val }))} aria-pressed={active} className={`h-9 w-16 rounded-full text-[12px] font-bold uppercase tracking-wide transition-colors ${active ? (val ? "bg-amber text-forest-ink" : "bg-forest text-oat") : "border border-forest/20 text-slate hover:border-forest"}`}>{opt}</button>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-[10.5px] leading-5 text-slate">Rule-based screen &mdash; not a clinical assessment and never a rejection letter. Your surgeon decides everything; we just don&apos;t waste their time or yours.</p>
            </fieldset>
          </section>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl bg-forest-ink p-6 text-oat shadow-float">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Readiness score</p>
              <div className="mt-4 flex items-center gap-5">
                <svg viewBox="0 0 120 120" className="h-28 w-28" role="img" aria-label={`Readiness ${readiness} out of 100`}>
                  <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#00C9A7" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(readiness / 100) * 301.6} 301.6`} transform="rotate(-90 60 60)" style={{ transition: "stroke-dasharray .5s ease" }} />
                  <text x="60" y="57" textAnchor="middle" dominantBaseline="middle" fill="#F7F5F0" fontSize="26" fontWeight="700">{readiness}</text>
                  <text x="60" y="76" textAnchor="middle" dominantBaseline="middle" fill="#A8C3A8" fontSize="9" fontWeight="700">/ 100</text>
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-soft">{answered}/{QUAL.length} answered</p>
                  <p className="mt-1 text-[12px] leading-5 text-white/65">Answer all five to unlock surgeon review.</p>
                </div>
              </div>
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-[12px] font-semibold leading-5 ${verdict.cls}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Verdict</p>
                <p className="mt-1">{verdict.label}</p>
                <p className="mt-1.5 font-normal opacity-90">{verdict.note}</p>
              </div>
              {aiExplain && (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-mint">AI coordination note{aiSource ? ` · ${aiSource}` : ""}</p>
                  <p className="mt-1 text-[12px] leading-5 text-white/80">{aiExplain}</p>
                  <p className="mt-1.5 text-[10px] text-white/40">Coordination only — your surgeon decides the clinical plan.</p>
                </div>
              )}
              <ol className="mt-4 space-y-1.5 text-[11px] leading-snug text-white/65">
                {["Surgeon reviews your file within 31h", "WhatsApp ping when quotes land", "No booking until you e-sign — ever"].map((t) => <li key={t} className="flex items-start gap-2"><span className="text-mint">▸</span>{t}</li>)}
              </ol>
              <button
                onClick={() => {
                  updateCase({ readiness, qualification: verdict.label, qualificationSent: true });
                  setPhase("done");
                }}
                disabled={answered !== QUAL.length}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-amber text-[15px] font-bold text-forest-ink transition-all enabled:hover:bg-amber-deep enabled:hover:text-oat disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send for surgeon review →
              </button>
              <button onClick={() => setPhase("form")} className="mt-2 h-11 w-full rounded-full border border-white/15 text-[12px] font-semibold text-sage-mist hover:text-oat">← Edit my case details</button>
            </div>
          </aside>
        </div>
      )}

      {phase === "form" && (
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
        {/* form column */}
        <div className="lg:col-span-7">
          {step === 1 && (
            <fieldset className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
              <legend className="sr-only">Step 1 — your case</legend>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="treatment">Which treatment?</label>
              <select id="treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} className="mt-2 w-full rounded-xl border border-forest/15 bg-oat px-4 py-3 text-sm outline-none focus:border-forest">
                {TREATMENTS.map((x) => <option key={x.slug} value={x.slug}>{x.name} — from ₹{Math.min(...Object.values(x.allIn)).toFixed(2)}L</option>)}
              </select>

              <label className="mt-5 block text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="condition">Your situation, in your words</label>
              <textarea id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} rows={4} placeholder="e.g. 58F, triple-vessel disease on angiogram, diabetes since 2014, on metformin, wanted opinion on off-pump CABG…" className="mt-2 w-full rounded-xl border border-forest/15 bg-oat px-4 py-3 text-sm outline-none focus:border-forest" />

              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep">How soon?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {([["routine", "Whenever — plan well"], ["soon", "Within 6–8 weeks"], ["urgent", "ASAP — symptoms matter"]] as const).map(([v, label]) => (
                  <button key={v} onClick={() => setUrgency(v)} aria-pressed={urgency === v} className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-colors ${urgency === v ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"}`}>{label}</button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-mint/30 bg-mint-wash px-4 py-3 text-[12px] leading-5 text-mint-deep">
                <span className="font-bold">AI note:</span> doctors review every case — the AI only organises, never decides. If we see red flags (e.g. HbA1c {">"} 9%), we say so and suggest pre-op optimisation first.
              </div>
              <button onClick={() => setStep(2)} className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-forest text-[15px] font-bold text-oat transition-all hover:bg-forest-deep">Continue — upload records →</button>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
              <legend className="sr-only">Step 2 — upload records</legend>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep">Upload reports</p>
                  <p className="mt-1 text-[12px] text-slate">PDF, JPG, DICOM — up to 25 files · encrypted at rest</p>
                </div>
                <button onClick={() => fileRef.current?.click()} className="rounded-full bg-forest px-4 py-2 text-[12px] font-bold text-oat hover:bg-forest-deep">+ Add files</button>
              </div>
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.dcm" className="hidden" onChange={(e) => handleFiles(e.target.files)} />

              {docs.length === 0 && (
                <button onClick={() => fileRef.current?.click()} className="mt-5 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-forest/20 text-slate transition-colors hover:border-forest/40 hover:text-forest">
                  <svg viewBox="0 0 28 28" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 20V5m0 0-4.5 4.5M14 5l4.5 4.5" /><path d="M4 19v3.5A2.5 2.5 0 0 0 6.5 25h15a2.5 2.5 0 0 0 2.5-2.5V19" /></svg>
                  <span className="text-sm font-semibold">Drop angiograms, labs, prescriptions…</span>
                </button>
              )}

              {docs.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {docs.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-oat px-3 py-2.5">
                      <svg viewBox="0 0 18 18" className="h-5 w-5 shrink-0 text-slate" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden><path d="M4 2h7l4 4v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 16Z" /><path d="M11 2v5h4" /></svg>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-charcoal">{d.name}</p>
                        <p className="text-[10px] text-slate">{d.size}</p>
                      </div>
                      {d.status === "scanning" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate"><span className="h-2 w-2 animate-pulse rounded-full bg-amber" />AI reading…</span>
                      ) : (
                        <span className="rounded-full bg-mint-wash px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-mint-deep">{d.kind}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* missing checklist */}
              <div className="mt-5 rounded-2xl border border-forest/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-ink">For {t.category.toLowerCase()} we also need</p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {required.map((r) => {
                    const covered = !missingRefined.includes(r);
                    return (
                      <li key={r} className="flex items-center gap-2 text-[12px]">
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full ${covered ? "bg-mint text-forest-ink" : "border border-amber/60 text-amber-deep"}`}>{covered ? <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.7 5.2 4 7.5 8.3 2.3" /></svg> : <span className="text-[9px] font-black">!</span>}</span>
                        <span className={covered ? "text-charcoal" : "text-amber-deep"}>{r}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-[10.5px] text-slate">Missing items don&apos;t block your case — surgeons see the gaps and request them directly.</p>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={() => setStep(1)} className="h-12 rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">← Back</button>
                <button onClick={() => setStep(3)} className="h-12 flex-1 rounded-full bg-forest text-[15px] font-bold text-oat hover:bg-forest-deep">Continue — preferences →</button>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
              <legend className="sr-only">Step 3 — constraints and priorities</legend>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="budget">Total budget (incl. travel)</label>
              <div className="mt-2 flex items-center gap-4">
                <input id="budget" type="range" min={1} max={30} step={0.5} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="flex-1 accent-[#2E5A44]" />
                <output className="w-20 text-right font-display text-2xl font-semibold text-forest-ink">₹{budget.toFixed(1)}L</output>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep">Companions</p>
                  <div className="mt-2 flex gap-2">{[0, 1, 2].map((n) => <button key={n} onClick={() => setCompanions(n)} aria-pressed={companions === n} className={`h-10 w-10 rounded-full text-sm font-bold ${companions === n ? "bg-forest text-oat" : "border border-forest/15 text-charcoal"}`}>{n === 2 ? "2+" : n}</button>)}</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep" htmlFor="diet">Meal needs</label>
                  <select id="diet" value={diet} onChange={(e) => setDiet(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-forest/15 bg-oat px-3 text-sm outline-none">{["No preference", "Vegetarian", "Jain", "Halal", "Gluten-free"].map((d) => <option key={d}>{d}</option>)}</select>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep">Languages for care</p>
                <div className="mt-2 flex flex-wrap gap-2">{["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Arabic", "Turkish"].map((l) => (
                  <button key={l} onClick={() => toggleLang(l)} aria-pressed={languages.includes(l)} className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium ${languages.includes(l) ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"}`}>{l}</button>
                ))}</div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-deep">What matters most to you</p>
                {[["Cost matters", cost, setCost], ["Outcomes matter", quality, setQuality], ["Speed matters", speed, setSpeed]].map(([label, value, setter]) => (
                  <div key={label as string} className="flex items-center gap-3">
                    <span className="w-36 text-[12px] font-semibold text-charcoal">{label as string}</span>
                    <input type="range" min={0} max={100} value={value as number} onChange={(e) => (setter as (n: number) => void)(Number(e.target.value))} className="flex-1 accent-[#E6A15C]" aria-label={label as string} />
                    <output className="w-8 text-right text-[12px] font-bold tabular-nums text-forest-ink">{value as number}</output>
                  </div>
                ))}
                <p className="text-[10.5px] text-slate">These sliders re-weight your match scores — price-sensitive? We surface Turkey &amp; Thailand; outcome-sensitive? We surface Apollo, Narayana and Bumrungrad first.</p>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={() => setStep(2)} className="h-12 rounded-full border border-forest/20 px-6 text-sm font-semibold text-forest hover:bg-sage-wash">← Back</button>
                <button onClick={createCaseAndQualify} className="h-12 flex-1 rounded-full bg-amber text-[15px] font-bold text-forest-ink hover:bg-amber-deep hover:text-oat">Create my case — free</button>
              </div>
            </fieldset>
          )}
        </div>

        {/* live summary rail */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-forest/10 bg-forest-ink p-6 text-oat">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">Live case summary</p>
            <dl className="mt-4 space-y-3 text-[13px] leading-6 text-white/80">
              {[
                ["Procedure", t.name],
                ["Typical stay", t.hospitalStay],
                ["Indicative all-in", `₹${Math.min(...Object.values(t.allIn)).toFixed(2)}L – ₹${Math.max(...Object.values(t.allIn)).toFixed(2)}L`],
                ["Urgency", urgency === "routine" ? "Whenever — plan well" : urgency === "soon" ? "Within 6–8 weeks" : "ASAP — symptoms matter"],
                ["Budget ceiling", `₹${budget.toFixed(1)}L all-in`],
                ["Companions", companions === 0 ? "Solo" : `${companions} companion${companions > 1 ? "s" : ""}`],
                ["Languages", languages.join(" · ") || "—"],
                ["Diet", diet],
                ["Records", docs.length === 0 ? "None yet" : `${docs.filter((d) => d.status === "done").length}/${docs.length} scanned`],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-6 border-b border-white/10 pb-3">
                  <dt className="text-white/45">{k}</dt>
                  <dd className="text-right font-medium text-oat">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-mint/10 px-4 py-3 text-[11px] font-semibold text-mint">
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
              AI coordinator standing by — quotes usually land in 31h
            </div>
            <p className="mt-4 text-[10.5px] leading-5 text-white/40">Your file is encrypted (AES-256) and visible only to partner hospitals you approve. EthAum never sells patient data — referral fee is paid by the hospital, disclosed in the quote.</p>
          </div>
        </aside>
      </div>
      )}
      <SiteFooter />
    </div>
  );
}
