"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { HOSPITALS, TREATMENTS } from "@/data/ethaum";

type FormState = {
  name: string;
  treatment: string;
  hospital: string;
  rating: string;
  review: string;
};

const INITIAL: FormState = {
  name: "",
  treatment: "",
  hospital: "",
  rating: "",
  review: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function ReviewForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2)
      next.name = "Please tell us your name (at least 2 characters).";
    if (!form.treatment) next.treatment = "Choose the treatment you had.";
    if (!form.hospital) next.hospital = "Choose the hospital where you were treated.";
    if (!form.rating) next.rating = "Choose a rating between 1 and 5.";
    if (form.review.trim().length < 20)
      next.review = "A little more detail helps — at least 20 characters.";
    return next;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  };

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div
        className="animate-fade-slide flex h-full flex-col items-start justify-center rounded-3xl border border-mint-deep/30 bg-mint-wash/70 p-7 sm:p-10"
        role="status"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-forest-ink">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
          </svg>
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-forest-ink sm:text-3xl">
          Thank you, {form.name.trim().split(" ")[0]} — received.
        </h3>
        <p className="mt-2 max-w-md text-[15px] leading-7 text-charcoal/85">
          Your review entered the verification queue for{" "}
          <span className="font-semibold text-forest-deep">{form.hospital}</span>.
          We&apos;ll cross-check your admission and publish within 7 working days —
          unedited. You&apos;ll get a WhatsApp note when it&apos;s live.
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-slate">
          Demo build — nothing was stored or sent
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center rounded-full border border-forest/25 px-5 text-sm font-semibold text-forest transition-colors hover:bg-sage-wash"
        >
          Write another review
        </button>
      </div>
    );
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-forest/20 bg-oat/50 px-4 text-sm text-charcoal outline-none transition-colors placeholder:text-slate/60 focus:border-forest focus:bg-white";
  const labelClass =
    "mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate";
  const errorClass = "mt-1.5 text-[11.5px] font-medium text-red-800";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-forest/10 bg-oat/40 p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="rv-name" className={labelClass}>
            Your name <span aria-hidden className="text-amber-deep">*</span>
          </label>
          <input
            id="rv-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Priya Raghavan"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "rv-name-err" : undefined}
            className={inputClass}
          />
          {errors.name && <p id="rv-name-err" className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="rv-treatment" className={labelClass}>
            Treatment <span aria-hidden className="text-amber-deep">*</span>
          </label>
          <select
            id="rv-treatment"
            value={form.treatment}
            onChange={set("treatment")}
            aria-invalid={Boolean(errors.treatment)}
            aria-describedby={errors.treatment ? "rv-treatment-err" : undefined}
            className={`${inputClass} ${form.treatment ? "" : "text-slate/60"}`}
          >
            <option value="">Select treatment…</option>
            {TREATMENTS.map((t) => (
              <option key={t.slug} value={t.name}>
                {t.name}
              </option>
            ))}
            <option value="Other">Other / not listed</option>
          </select>
          {errors.treatment && <p id="rv-treatment-err" className={errorClass}>{errors.treatment}</p>}
        </div>

        <div>
          <label htmlFor="rv-hospital" className={labelClass}>
            Hospital <span aria-hidden className="text-amber-deep">*</span>
          </label>
          <select
            id="rv-hospital"
            value={form.hospital}
            onChange={set("hospital")}
            aria-invalid={Boolean(errors.hospital)}
            aria-describedby={errors.hospital ? "rv-hospital-err" : undefined}
            className={`${inputClass} ${form.hospital ? "" : "text-slate/60"}`}
          >
            <option value="">Select hospital…</option>
            {HOSPITALS.map((h) => (
              <option key={h.slug} value={`${h.name}, ${h.city}`}>
                {h.name} — {h.city}
              </option>
            ))}
            <option value="Other">Other / not listed</option>
          </select>
          {errors.hospital && <p id="rv-hospital-err" className={errorClass}>{errors.hospital}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="rv-rating" className={labelClass}>
            Your rating <span aria-hidden className="text-amber-deep">*</span>
          </label>
          <select
            id="rv-rating"
            value={form.rating}
            onChange={set("rating")}
            aria-invalid={Boolean(errors.rating)}
            aria-describedby={errors.rating ? "rv-rating-err" : undefined}
            className={`${inputClass} ${form.rating ? "" : "text-slate/60"}`}
          >
            <option value="">Select rating…</option>
            <option value="5">5 — Excellent, exactly as quoted</option>
            <option value="4">4 — Good, minor hiccups</option>
            <option value="3">3 — Okay, room for improvement</option>
            <option value="2">2 — Poor, would not book again</option>
            <option value="1">1 — Unacceptable</option>
          </select>
          {errors.rating && <p id="rv-rating-err" className={errorClass}>{errors.rating}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="rv-review" className={labelClass}>
            How was it, honestly? <span aria-hidden className="text-amber-deep">*</span>
          </label>
          <textarea
            id="rv-review"
            rows={4}
            value={form.review}
            onChange={set("review")}
            placeholder="What was smooth? What wasn't? Would you send your parent here?"
            aria-invalid={Boolean(errors.review)}
            aria-describedby={errors.review ? "rv-review-err" : undefined}
            className="w-full rounded-xl border border-forest/20 bg-oat/50 px-4 py-3 text-sm leading-6 text-charcoal outline-none transition-colors placeholder:text-slate/60 focus:border-forest focus:bg-white"
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            {errors.review ? (
              <p id="rv-review-err" className={errorClass.replace("mt-1.5", "")}>{errors.review}</p>
            ) : (
              <span />
            )}
            <span className={`text-[10.5px] tabular-nums ${form.review.trim().length >= 20 ? "text-mint-deep" : "text-slate"}`}>
              {form.review.trim().length}/20 min
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-[15px] font-semibold text-oat transition-colors hover:bg-forest-deep sm:w-auto"
      >
        Submit for verification
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
        </svg>
      </button>
    </form>
  );
}
