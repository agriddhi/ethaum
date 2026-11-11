"use client";

import { useState } from "react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import PageHeader from "@/components/page-header";

const TASKS = [
  { key: "classify", payload: { files: [{ name: "angiogram_oct.pdf" }, { name: "lipid_panel.pdf" }, { name: "prescription_metformin.pdf" }] } },
  { key: "qualify", payload: { answers: [false, false, false, true, false] } },
  { key: "match", payload: { specialty: "Cardiac", budget: 1200000, language: "Hindi", hospitals: [
    { slug: "bumrungrad", name: "Bumrungrad International", specialties: ["Cardiac"], accreditations: ["JCI"], languages: ["English", "Hindi"], rating: 4.9, waitDays: 6, allIn: 1080000 },
    { slug: "apollo", name: "Apollo Greams Road", specialties: ["Cardiac"], accreditations: ["JCI", "NABH"], languages: ["English", "Tamil", "Hindi"], rating: 4.9, waitDays: 9, allIn: 1120000 },
  ] } },
  { key: "quote-audit", payload: { quotes: [{ hospital: "Bumrungrad Intl", total: 1080000 }, { hospital: "Memorial Şişli", total: 960000 }] } },
  { key: "reminder", payload: { plan: [{ day: "Day 7", title: "Day-7 check-in", items: ["Wound + suture check", "Physio: ankle pumps, 40m walk", "Clopidogrel adherence check"] }] } },
];

export default function ModelPlayground() {
  const [task, setTask] = useState("qualify");
  const [out, setOut] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setOut("");
    const t = TASKS.find((x) => x.key === task)!;
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task: t.key, payload: t.payload }),
      });
      const j = await r.json();
      setOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setOut("Request failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-oat">
      <SiteNav />
      <PageHeader
        crumbs={[["Home", "/"], ["AI engine", "/model"]]}
        eyebrow="EthAum AI coordination engine"
        title="Organise, flag, rank, audit. Never decide."
        sub="One endpoint, five tasks. Safety-critical numbers come from the deterministic rules engine; the language model only writes prose and sorts evidence — and every response says which engine answered. Live playground below."
      />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-card lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Try a task</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TASKS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTask(t.key)}
                aria-pressed={task === t.key}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${task === t.key ? "bg-forest text-oat" : "border border-forest/15 text-charcoal hover:border-forest"}`}
              >
                {t.key}
              </button>
            ))}
          </div>
          <button
            onClick={run}
            disabled={busy}
            className="mt-5 h-11 w-full rounded-full bg-mint text-[13px] font-bold text-forest-ink transition-colors hover:bg-[#2be3bc] disabled:opacity-50"
          >
            {busy ? "Running…" : "POST /api/ai"}
          </button>
          <p className="mt-3 text-[10.5px] leading-5 text-slate">
            No API key configured → the rules engine answers. Add <code className="rounded bg-sage-wash px-1">GEMINI_API_KEY</code> to
            <code className="rounded bg-sage-wash px-1">.env.local</code> for the live path.
          </p>
        </div>

        <div className="rounded-3xl bg-forest-ink p-5 shadow-float lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber">Response</p>
          <pre className="mt-3 max-h-[380px] overflow-auto whitespace-pre-wrap break-words text-[11.5px] leading-5 text-sage-mist">
            {out || "// hit POST /api/ai to see the response\n// it includes: source (llm | rules), model, output, note"}
          </pre>
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TASKS.map((t) => (
          <div key={t.key} className="rounded-2xl border border-forest/10 bg-white p-4 shadow-card">
            <p className="font-display text-base font-semibold text-forest-ink">{t.key}</p>
            <p className="mt-1 text-[11px] leading-5 text-slate">
              {t.key === "classify" && "Files → Lab / Imaging / Prescription / Discharge, with confidence."}
              {t.key === "qualify" && "Five answers → readiness 0–100, verdict, flags, plain-English explanation."}
              {t.key === "match" && "Case + hospitals → ranked providers with score parts and watch-outs."}
              {t.key === "quote-audit" && "Competing quotes → under-scoped and price-deviation flags."}
              {t.key === "reminder" && "Recovery plan → patient-level reminders, one action per message."}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-[11px] leading-5 text-slate">
        Built by <span className="font-semibold text-forest">kairo-aeon-tech</span> —{" "}
        <a href="https://www.linkedin.com/in/agriddhi/" className="font-semibold text-forest underline">
          linkedin.com/in/agriddhi
        </a>{" "}
        · read the engine design in{" "}
        <a href="https://github.com/agriddhi/ethaum/blob/main/docs/AI_LAYER.md" target="_blank" rel="noreferrer noopener" className="font-semibold text-forest underline">
          docs/AI_LAYER.md
        </a>{" "}
        and the evaluation protocol in{" "}
        <a href="https://github.com/agriddhi/ethaum/blob/main/docs/EVALS.md" target="_blank" rel="noreferrer noopener" className="font-semibold text-forest underline">
          docs/EVALS.md
        </a>
        .
      </p>
      </main>
      <SiteFooter />
    </div>
  );
}
