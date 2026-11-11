/* EthAum · generated catalogue seed — DO NOT EDIT BY HAND.
 *
 * Regenerate with:  node scripts/seed.mjs
 * Verify with:       node scripts/seed.mjs --check
 *
 * src/data/seed.generated.json holds the raw arrays. This module only adds the
 * runtime types and validation so the app stays strict-mode clean.
 *
 * Honesty rules baked into the data:
 *   · hospitals[].demo === true  → synthetic demo listing (not a real institution)
 *   · hospitals[].audited === true → hand-audited institution from ethaum.ts
 *   · reviews[].tag === "Illustrative review" → synthetic demo review
 */

import raw from "./seed.generated.json";
import type { Doctor, Hospital, Treatment } from "./ethaum";

export type SeedHospital = Hospital & {
  /** true for the 8 hand-audited institutions audited by the EthAum clinical desk */
  audited: boolean;
  /** "audited" = verified data · "index" = scale listing without verified data */
  tier: "audited" | "index";
  /** true only where accreditation, outcome and patient-experience data was checked */
  verified: boolean;
  /** true for synthetic demo listings (not real institutions) */
  demo: boolean;
};

export type SeedTreatment = Treatment;
export type SeedDoctor = Doctor;

export type SeedReview = {
  name: string;
  city: string;
  treatment: string;
  hospital: string;
  rating: number;
  date: string;
  text: string;
  tag: string;
};

export type SeedFaq = { q: string; a: string; cat: string };

export type SeedMeta = {
  generator: string;
  seed: number;
  note: string;
  counts: Record<string, number>;
};

type RawSeed = {
  meta: SeedMeta;
  hospitals: unknown[];
  treatments: unknown[];
  doctors: unknown[];
  reviews: unknown[];
  faqs: unknown[];
};

const COUNTRIES = ["India", "Thailand", "Singapore", "Turkey", "Malaysia", "UAE"] as const;
type Country = (typeof COUNTRIES)[number];

const data = raw as unknown as RawSeed;

function fail(path: string, expected: string): never {
  throw new Error("seed.generated.json: " + path + " — expected " + expected);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function reqObject(entry: unknown, path: string): Record<string, unknown> {
  if (!isRecord(entry)) fail(path, "object");
  return entry;
}

function reqString(o: Record<string, unknown>, key: string, path: string): string {
  const value = o[key];
  if (typeof value !== "string" || value.length === 0) fail(path + "." + key, "non-empty string");
  return value;
}

function reqNumber(o: Record<string, unknown>, key: string, path: string): number {
  const value = o[key];
  if (typeof value !== "number" || !Number.isFinite(value)) fail(path + "." + key, "finite number");
  return value;
}

function reqBoolean(o: Record<string, unknown>, key: string, path: string): boolean {
  const value = o[key];
  if (typeof value !== "boolean") fail(path + "." + key, "boolean");
  return value;
}

function reqStringArray(o: Record<string, unknown>, key: string, path: string): string[] {
  const value = o[key];
  if (!Array.isArray(value) || value.length === 0) fail(path + "." + key, "non-empty string[]");
  for (const item of value) {
    if (typeof item !== "string") fail(path + "." + key, "string[]");
  }
  return value as string[];
}

function reqArray(o: Record<string, unknown>, key: string, path: string): unknown[] {
  const value = o[key];
  if (!Array.isArray(value)) fail(path + "." + key, "array");
  return value;
}

export const SEED_META: SeedMeta = data.meta;

export const SEED_HOSPITALS: SeedHospital[] = data.hospitals.map((entry, i) => {
  const path = "hospitals[" + i + "]";
  const o = reqObject(entry, path);
  const country = reqString(o, "country", path);
  if (!(COUNTRIES as readonly string[]).includes(country)) {
    fail(path + ".country", "one of " + COUNTRIES.join(" | "));
  }
  const tier = reqString(o, "tier", path);
  if (tier !== "audited" && tier !== "index") fail(path + ".tier", '"audited" | "index"');
  return {
    slug: reqString(o, "slug", path),
    name: reqString(o, "name", path),
    city: reqString(o, "city", path),
    country: country as Country,
    accreditations: reqStringArray(o, "accreditations", path),
    specialties: reqStringArray(o, "specialties", path),
    languages: reqStringArray(o, "languages", path),
    rating: reqNumber(o, "rating", path),
    reviews: reqNumber(o, "reviews", path),
    bestFor: reqString(o, "bestFor", path),
    flagship: reqString(o, "flagship", path),
    priceNote: reqString(o, "priceNote", path),
    since: reqNumber(o, "since", path),
    audited: reqBoolean(o, "audited", path),
    tier: tier,
    verified: reqBoolean(o, "verified", path),
    demo: reqBoolean(o, "demo", path),
  };
});

export const SEED_TREATMENTS: SeedTreatment[] = data.treatments.map((entry, i) => {
  const path = "treatments[" + i + "]";
  const o = reqObject(entry, path);
  const allIn = reqObject(o.allIn, path + ".allIn");
  const faqs = reqArray(o, "faqs", path).map((f, j) => {
    const fo = reqObject(f, path + ".faqs[" + j + "]");
    return { q: reqString(fo, "q", path + ".faqs[" + j + "]"), a: reqString(fo, "a", path + ".faqs[" + j + "]") };
  });
  return {
    slug: reqString(o, "slug", path),
    name: reqString(o, "name", path),
    short: reqString(o, "short", path),
    category: reqString(o, "category", path),
    description: reqString(o, "description", path),
    hospitalStay: reqString(o, "hospitalStay", path),
    surgeryTime: reqString(o, "surgeryTime", path),
    recovery: reqString(o, "recovery", path),
    allIn: {
      india: reqNumber(allIn, "india", path + ".allIn"),
      thailand: reqNumber(allIn, "thailand", path + ".allIn"),
      singapore: reqNumber(allIn, "singapore", path + ".allIn"),
      turkey: reqNumber(allIn, "turkey", path + ".allIn"),
      malaysia: reqNumber(allIn, "malaysia", path + ".allIn"),
    },
    savingVsPrivateIndia: reqString(o, "savingVsPrivateIndia", path),
    bestFor: reqString(o, "bestFor", path),
    included: reqStringArray(o, "included", path),
    faqs,
  };
});

export const SEED_DOCTORS: SeedDoctor[] = data.doctors.map((entry, i) => {
  const path = "doctors[" + i + "]";
  const o = reqObject(entry, path);
  const doctor: SeedDoctor = {
    slug: reqString(o, "slug", path),
    name: reqString(o, "name", path),
    role: reqString(o, "role", path),
    specialty: reqString(o, "specialty", path),
    expYears: reqNumber(o, "expYears", path),
    education: reqStringArray(o, "education", path),
    languages: reqStringArray(o, "languages", path),
    hospitalSlug: reqString(o, "hospitalSlug", path),
    hospital: reqString(o, "hospital", path),
    city: reqString(o, "city", path),
    rating: reqNumber(o, "rating", path),
    reviews: reqNumber(o, "reviews", path),
    procedures: reqStringArray(o, "procedures", path),
    bio: reqString(o, "bio", path),
    nextSlot: reqString(o, "nextSlot", path),
  };
  if (typeof o.photo === "string" && o.photo.length > 0) doctor.photo = o.photo;
  return doctor;
});

export const SEED_REVIEWS: SeedReview[] = data.reviews.map((entry, i) => {
  const path = "reviews[" + i + "]";
  const o = reqObject(entry, path);
  return {
    name: reqString(o, "name", path),
    city: reqString(o, "city", path),
    treatment: reqString(o, "treatment", path),
    hospital: reqString(o, "hospital", path),
    rating: reqNumber(o, "rating", path),
    date: reqString(o, "date", path),
    text: reqString(o, "text", path),
    tag: reqString(o, "tag", path),
  };
});

export const SEED_FAQS: SeedFaq[] = data.faqs.map((entry, i) => {
  const path = "faqs[" + i + "]";
  const o = reqObject(entry, path);
  return {
    q: reqString(o, "q", path),
    a: reqString(o, "a", path),
    cat: reqString(o, "cat", path),
  };
});

/** The 8 hand-audited institutions — verified data, shown first everywhere. */
export const SEED_AUDITED_HOSPITALS: SeedHospital[] = SEED_HOSPITALS.filter((h) => h.audited);
/** Synthetic scale listings — structure only, no verified clinical data. */
export const SEED_INDEX_HOSPITALS: SeedHospital[] = SEED_HOSPITALS.filter((h) => !h.audited);
