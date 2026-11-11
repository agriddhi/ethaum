#!/usr/bin/env node
/**
 * EthAum · deterministic catalogue seed generator.
 *
 *   node scripts/seed.mjs          regenerate src/data/seed.generated.json + src/data/seed.ts
 *   node scripts/seed.mjs --check  regenerate in memory, compare with the files on disk, write nothing
 *
 * Rules this script obeys:
 *   · no dependencies, no network, no clock, no Math.random  → byte-identical output every run
 *   · the 8 hand-audited institutions and the 12 curated treatments are copied verbatim from
 *     src/data/ethaum.ts (parsed from source, never re-typed by hand)
 *   · everything else is SYNTHETIC demo data and is flagged as such (`demo: true` on hospitals,
 *     "Illustrative review" tags on reviews, "index" tier on hospitals)
 *   · no phone numbers, anywhere
 *
 * Output shape (src/data/seed.generated.json):
 *   { meta, hospitals[132], treatments[18], doctors[30], reviews[90], faqs[70] }
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CURATED_SRC = join(ROOT, "src", "data", "ethaum.ts");
const OUT_JSON = join(ROOT, "src", "data", "seed.generated.json");
const OUT_TS = join(ROOT, "src", "data", "seed.ts");

const SEED = 20261111;
const GENERATOR = "scripts/seed.mjs";

/* ────────────────────────────────────────────────────────────────────────────
   1 · deterministic PRNG (mulberry32)
   ──────────────────────────────────────────────────────────────────────────── */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(SEED);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const intBetween = (min, max) => min + Math.floor(rand() * (max - min + 1));
const floatBetween = (min, max, dp) => Number((min + rand() * (max - min)).toFixed(dp));
const chance = (p) => rand() < p;

function sample(arr, n) {
  const pool = arr.slice();
  const out = [];
  while (out.length < n && pool.length > 0) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────────────────
   2 · read the curated dataset straight out of src/data/ethaum.ts
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Extract a top-level `export const NAME = [ ... ]` literal from the TS source and
 * convert it to plain JSON. The arrays in ethaum.ts are plain object literals, so a
 * small string-aware scanner is enough — no TypeScript compiler, no dependencies.
 */
function extractArrayLiteral(source, name) {
  const decl = source.indexOf("export const " + name);
  if (decl === -1) throw new Error("could not find `export const " + name + "` in ethaum.ts");
  const eq = source.indexOf("=", decl);
  if (eq === -1) throw new Error("could not find the initialiser for " + name);
  const start = source.indexOf("[", eq);
  if (start === -1) throw new Error("could not find the array literal for " + name);

  let depth = 0;
  let inString = false;
  let quote = "";
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error("unbalanced array literal for " + name);
}

/**
 * Re-serialise a JS object literal as JSON.
 * Bare identifiers used as keys become quoted; string literals are decoded and
 * re-encoded so escapes survive the round-trip; trailing commas are dropped
 * (JSON has none, JS object literals do).
 */
function literalToJson(literal) {
  let out = "";
  let lastSignificant = -1;

  const push = (chunk) => {
    out += chunk;
    const trimmed = chunk.trimEnd();
    if (trimmed.length > 0) lastSignificant = out.length - 1;
  };

  const dropTrailingComma = () => {
    if (lastSignificant >= 0 && out[lastSignificant] === ",") {
      out = out.slice(0, lastSignificant) + out.slice(lastSignificant + 1);
    }
  };

  let i = 0;
  while (i < literal.length) {
    const ch = literal[i];

    if (ch === '"' || ch === "'") {
      // read the raw string literal, honouring backslash escapes
      const quote = ch;
      let j = i + 1;
      let raw = "";
      while (j < literal.length) {
        const c = literal[j];
        if (c === "\\") {
          raw += c + (literal[j + 1] ?? "");
          j += 2;
          continue;
        }
        if (c === quote) break;
        raw += c;
        j++;
      }
      // double-quoted source strings are already valid JSON
      const value = quote === '"'
        ? JSON.parse('"' + raw + '"')
        : raw.replace(/\\'/g, "'").replace(/\\"/g, '"');
      push(JSON.stringify(value));
      i = j + 1;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < literal.length && /[A-Za-z0-9_$]/.test(literal[j])) j++;
      const word = literal.slice(i, j);
      let k = j;
      while (k < literal.length && /\s/.test(literal[k])) k++;
      if (literal[k] === ":") {
        // object key → quote it; the colon itself is emitted on the next pass
        push(JSON.stringify(word));
      } else if (word === "as") {
        // `as const` assertion → drop it
        const next = literal.slice(j).match(/^\s+const\b/);
        if (next) {
          i = j + next[0].length;
          continue;
        }
        push(word);
      } else {
        push(word);
      }
      i = j;
      continue;
    }

    if (ch === "}" || ch === "]") dropTrailingComma();
    push(ch);
    i++;
  }
  return out;
}

const curatedSource = readFileSync(CURATED_SRC, "utf8");
const readCurated = (name) => JSON.parse(literalToJson(extractArrayLiteral(curatedSource, name)));

const CURATED_TREATMENTS = readCurated("TREATMENTS");
const CURATED_HOSPITALS = readCurated("HOSPITALS");
const CURATED_DOCTORS = readCurated("DOCTORS");
const CURATED_REVIEWS = readCurated("REVIEWS");
const CURATED_FAQS = readCurated("FAQS");

if (CURATED_TREATMENTS.length !== 12) throw new Error("expected 12 curated treatments, found " + CURATED_TREATMENTS.length);
if (CURATED_HOSPITALS.length !== 8) throw new Error("expected 8 curated hospitals, found " + CURATED_HOSPITALS.length);

/* ────────────────────────────────────────────────────────────────────────────
   3 · shared vocabulary for the synthetic index
   ──────────────────────────────────────────────────────────────────────────── */

// price of a treatment/hospital in each country, as a multiple of the private-India price
const COUNTRY_FACTOR = { India: 1, Thailand: 0.63, Singapore: 1.45, Turkey: 0.58, Malaysia: 0.74 };

const fmtPrice = (lakhs) =>
  lakhs >= 1 ? `₹${lakhs.toFixed(1)}L` : `₹${Math.round(lakhs * 100)}k`;

const SPECIALTY_CARDS = {
  Cardiac: { label: "CABG", base: 8.6, best: ["High-volume bypass surgery", "Complex coronary intervention", "Affordable open-heart care"] },
  Oncology: { label: "PET-CT + tumour MDT", base: 1.2, best: ["Second opinions on complex tumours", "Protocol-led cancer care", "Affordable oncology pathways"] },
  Orthopaedics: { label: "robotic knee replacement", base: 4.1, best: ["Robotic joint replacement", "Sports-injury reconstruction", "Revision knee surgery"] },
  Fertility: { label: "IVF cycle", base: 2.4, best: ["Own-egg IVF programmes", "Age-honest success rates", "Halal-friendly fertility care"] },
  Transplants: { label: "kidney transplant", base: 9.8, best: ["Living-donor transplants", "Paediatric transplant care", "Complex immunology cases"] },
  Neuro: { label: "craniotomy", base: 7.2, best: ["Microneurosurgery", "Stroke intervention", "Spine and nerve work"] },
  "Bone marrow": { label: "bone marrow transplant", base: 18.5, best: ["Haematology transplant", "Leukaemia protocols", "Matched-donor programmes"] },
  Bariatric: { label: "gastric sleeve", base: 3.4, best: ["Metabolic surgery", "Diabetic remission pathways", "Laparoscopic bariatric care"] },
  Cosmetic: { label: "FUE hair transplant", base: 0.95, best: ["Hair restoration circuits", "Body contouring", "Skin and aesthetics"] },
  Dental: { label: "full-mouth implants", base: 2.6, best: ["Full-arch implant rehab", "Cosmetic dentistry", "Same-day ceramic work"] },
  Ophthalmology: { label: "LASIK both eyes", base: 0.45, best: ["Bladeless vision correction", "Premium cataract surgery", "Retina and glaucoma care"] },
  Gastroenterology: { label: "endoscopy + polypectomy", base: 0.6, best: ["Diagnostic endoscopy", "Hepatology and liver care", "Colorectal screening"] },
  Urology: { label: "robotic prostatectomy", base: 6.4, best: ["Nerve-sparing prostate surgery", "Kidney stone care", "Urology day-care"] },
  ENT: { label: "FESS sinus surgery", base: 1.1, best: ["Chronic sinusitis surgery", "Sleep and airway clinics", "Hearing and ear surgery"] },
  Vascular: { label: "laser vein ablation", base: 0.95, best: ["Day-care vein ablation", "Varicose ulcer clinics", "Diabetic foot care"] },
  "General Surgery": { label: "laparoscopic hernia repair", base: 0.72, best: ["Day-care hernia repair", "Laparoscopic general surgery", "Hernia revision work"] },
  "Sports medicine": { label: "knee arthroscopy", base: 1.3, best: ["Ligament reconstruction", "Athlete recovery programmes", "Shoulder and knee sports care"] },
  "Plastic surgery": { label: "breast augmentation", base: 1.9, best: ["Reconstructive surgery", "Post-mastectomy reconstruction", "Body contouring"] },
  "Paediatric cardiac": { label: "paediatric VSD closure", base: 11.4, best: ["Congenital heart repair", "Paediatric intensive care", "Neonatal cardiac work"] },
};

const COUNTRIES = [
  {
    name: "India",
    count: 32,
    cities: ["Chennai", "Bengaluru", "Hyderabad", "Mumbai", "Delhi NCR", "Pune", "Jaipur", "Lucknow", "Kochi", "Kolkata", "Ahmedabad", "Coimbatore", "Bhubaneswar", "Nagpur", "Visakhapatnam", "Thiruvananthapuram", "Chandigarh", "Vadodara", "Madurai", "Surat"],
    local: {
      Chennai: "Tamil", Bengaluru: "Kannada", Hyderabad: "Telugu", Mumbai: "Marathi", "Delhi NCR": "Hindi",
      Pune: "Marathi", Jaipur: "Hindi", Lucknow: "Hindi", Kochi: "Malayalam", Kolkata: "Bengali",
      Ahmedabad: "Gujarati", Coimbatore: "Tamil", Bhubaneswar: "Odia", Nagpur: "Hindi",
      Visakhapatnam: "Telugu", Thiruvananthapuram: "Malayalam", Chandigarh: "Punjabi",
      Vadodara: "Gujarati", Madurai: "Tamil", Surat: "Gujarati",
    },
    roots: ["Aarogya", "Sanjeevani", "Sushruta", "Vardhman", "Kaveri", "Trishul", "Prakash", "Sagar", "Madhav", "Devdeep", "Nirmiti", "Chandran", "Yugdeep", "Aarambh", "Sarvodaya", "Shanti", "Amrita", "Pranav", "Jeevan", "Utkal"],
    kinds: ["Hospital", "Medical Centre", "Multi-speciality Hospital", "Super Specialty Hospital", "Institute of Medical Sciences", "Health City"],
    accreditations: [["NABH", "JCI"], ["JCI"], ["NABH"], ["NABH", "ISO 9001"], ["JCI", "ISO 9001"]],
    languages: ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Odia"],
    bias: ["Cardiac", "Orthopaedics", "Oncology", "Transplants", "Bariatric", "Fertility", "Urology", "General Surgery"],
  },
  {
    name: "Thailand",
    count: 22,
    cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Krabi", "Chiang Rai", "Hua Hin", "Surat Thani", "Koh Samui", "Rayong", "Nonthaburi", "Chonburi"],
    local: {},
    roots: ["Siam", "Andaman", "Lanna", "Mekong", "Suvarna", "Chaiya", "Sawasdee", "Chao Phraya", "Thai Care", "Nong Khai", "Trang", "Aroon", "Ban Dara", "Doi Saket", "Maha Chai", "Sena", "Prachuap", "Ratchaburi", "Thai Heritage", "Banpra"],
    kinds: ["Medical Centre", "International Hospital", "Specialty Hospital", "General Hospital", "Health Centre", "Surgical Centre"],
    accreditations: [["JCI", "GACHC"], ["JCI"], ["GACHC"], ["JCI", "ISO 9001"]],
    languages: ["Thai", "Mandarin", "Hindi", "Arabic", "Russian"],
    bias: ["Cardiac", "Orthopaedics", "Fertility", "Cosmetic", "Dental", "Oncology", "Sports medicine"],
  },
  {
    name: "Singapore",
    count: 16,
    cities: ["Orchard", "Novena", "Tanglin", "Jurong", "Woodlands", "Bedok", "Raffles Place", "Kallang", "Sentosa", "Bukit Timah", "Tampines", "Marine Parade"],
    local: {
      Orchard: "Mandarin", Novena: "Mandarin", Tanglin: "Mandarin", Jurong: "Malay", Woodlands: "Mandarin",
      Bedok: "Malay", "Raffles Place": "Mandarin", Kallang: "Mandarin", Sentosa: "Mandarin",
      "Bukit Timah": "Mandarin", Tampines: "Malay", "Marine Parade": "Tamil",
    },
    roots: ["Meridian", "Cairnhill", "Lattice", "Solstice", "Halcyon", "Vantage", "Steadfast", "Orchard Rise", "Cedarcrest", "Claremont", "Marina Rise", "Aveline", "Banyan", "Kew Grove", "Seletar", "Novalis"],
    kinds: ["Medical Centre", "Health Institute", "Specialty Hospital", "Hospital", "Clinic & Hospital", "Medical Institute"],
    accreditations: [["JCI", "MOH Singapore"], ["JCI"], ["MOH Singapore"], ["JCI", "ISO 9001"]],
    languages: ["Mandarin", "Malay", "Tamil", "Hindi", "Bengali"],
    bias: ["Oncology", "Cardiac", "Gastroenterology", "Neuro", "Orthopaedics", "Ophthalmology", "Bone marrow"],
  },
  {
    name: "Turkey",
    count: 20,
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Trabzon", "Gaziantep", "Kayseri", "Eskisehir", "Mersin"],
    local: {},
    roots: ["Kartal", "Bosphorus", "Aegean", "Cappadocia", "Marmara", "Toros", "Sakarya", "Halic", "Meridyen", "Anadolu", "Yildiz", "Selcuk", "Emek", "Guney", "Trakya", "Kuzey", "Doruk", "Atil", "Kiraz", "Beyaz"],
    kinds: ["Hospital", "Medical Center", "Health Group", "Specialty Hospital", "International Hospital", "Medical Centre"],
    accreditations: [["JCI"], ["JCI", "ISO 9001"], ["ISO 9001"]],
    languages: ["Turkish", "Arabic", "Russian", "German"],
    bias: ["Cardiac", "Bariatric", "Cosmetic", "Oncology", "Orthopaedics", "Neuro"],
  },
  {
    name: "Malaysia",
    count: 18,
    cities: ["Kuala Lumpur", "Penang", "Johor Bahru", "Kota Kinabalu", "Malacca", "Ipoh", "Kuching", "Alor Setar", "Kuantan", "Shah Alam", "Kota Bharu", "Klang"],
    local: {},
    roots: ["Merdeka", "Damansara", "Nusa", "Sungai", "Langkawi", "Tanjung", "Melaka", "Putrajaya", "Cempaka", "Kenanga", "Mutiara", "Selat", "Perdana", "Bintang", "Cahaya", "Harmoni", "Istana", "Wawasan", "Terang", "Setia"],
    kinds: ["Medical Centre", "Specialist Hospital", "General Hospital", "Health Institute", "Hospital & Clinic", "Medical Institute"],
    accreditations: [["MSQH", "JCI"], ["MSQH"], ["JCI"], ["MSQH", "ISO 9001"]],
    languages: ["Malay", "Mandarin", "Tamil", "Hindi", "Arabic"],
    bias: ["Fertility", "Cardiac", "Oncology", "Orthopaedics", "Ophthalmology", "General Surgery"],
  },
  {
    name: "UAE",
    count: 16,
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
    local: {},
    roots: ["Al Bateen", "Falcon", "Oasis", "Qasr", "Mina", "Souq", "Wasl", "Al Reem", "Al Barsha", "Masaar", "Al Wathba", "Horizon", "Al Yahar", "Marasi", "Rimal", "Al Qusais"],
    kinds: ["Medical Centre", "Specialty Hospital", "Health City", "General Hospital", "International Hospital", "Clinic Hospital"],
    accreditations: [["JCI"], ["JCI", "ISO 9001"], ["ISO 9001"]],
    languages: ["Arabic", "Hindi", "Urdu", "Russian", "Tagalog"],
    bias: ["Cardiac", "Oncology", "Orthopaedics", "Plastic surgery", "Dental", "Ophthalmology", "Vascular"],
  },
];

/** The local language a hospital in a given city would realistically speak first. */
const localLanguage = (country, city) => {
  if (country.name === "Thailand") return "Thai";
  if (country.name === "Turkey") return "Turkish";
  if (country.name === "UAE") return "Arabic";
  if (country.name === "Malaysia") return "Malay";
  return country.local[city] ?? country.languages[0];
};

const usedNames = new Set();
const usedSlugs = new Set();

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

/** Deterministic de-duplication: candidate → candidate + city → candidate + numeral. */
function uniqueName(candidate, city) {
  const attempts = [candidate, `${candidate} ${city}`, ...ROMAN.map((n) => `${candidate} ${n}`)];
  for (const attempt of attempts) {
    if (!usedNames.has(attempt)) {
      usedNames.add(attempt);
      return attempt;
    }
  }
  let n = 1;
  let fallback = `${candidate} ${city} ${n}`;
  while (usedNames.has(fallback)) fallback = `${candidate} ${city} ${++n}`;
  usedNames.add(fallback);
  return fallback;
}

function slugify(name, city) {
  let base = (name + " " + city).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base;
  let n = 2;
  while (usedSlugs.has(slug)) slug = base + "-" + n++;
  usedSlugs.add(slug);
  return slug;
}

const PRICE_NOTES = [
  "index band · not a quote",
  "indicative package · verified on request",
  "indicative band · quote in 48h",
  "index band · inclusive estimate",
  "indicative band · implants itemised in quote",
];

/* ────────────────────────────────────────────────────────────────────────────
   4 · hospitals — 8 audited (verbatim) + 124 synthetic index entries
   ──────────────────────────────────────────────────────────────────────────── */

function buildHospitals() {
  const audited = CURATED_HOSPITALS.map((h) => ({
    ...h,
    audited: true,
    tier: "audited",
    verified: true,
    demo: false,
  }));
  for (const h of audited) {
    usedNames.add(h.name);
    usedSlugs.add(h.slug);
  }

  const index = [];
  for (const country of COUNTRIES) {
    for (let i = 0; i < country.count; i++) {
      const root = pick(country.roots);
      const kind = pick(country.kinds);
      const city = pick(country.cities);
      const name = uniqueName(root + " " + kind, city);
      const slug = slugify(name, city);

      const primary = chance(0.55) ? pick(country.bias) : pick(Object.keys(SPECIALTY_CARDS));
      const card = SPECIALTY_CARDS[primary];
      const secondaries = sample(
        Object.keys(SPECIALTY_CARDS).filter((s) => s !== primary),
        intBetween(1, 3)
      );
      const specialties = [primary, ...secondaries];

      const factor = COUNTRY_FACTOR[country.name];
      const flagshipPrice = Number((card.base * factor * floatBetween(0.88, 1.12, 3)).toFixed(2));

      const rating = floatBetween(3.9, 4.9, 1);
      const age = intBetween(4, 62);
      const reviews = Math.round((40 + age * 46) * floatBetween(0.6, 1.5, 3));

      // a hospital always speaks English plus its own local language
      const local = localLanguage(country, city);
      const others = sample(country.languages.filter((l) => l !== local), intBetween(2, 4));
      const languages = ["English", local, ...others];

      index.push({
        slug,
        name,
        city,
        country: country.name,
        accreditations: pick(country.accreditations),
        specialties,
        languages,
        rating,
        reviews,
        bestFor: pick(card.best),
        flagship: `${card.label} from ${fmtPrice(flagshipPrice)}`,
        priceNote: pick(PRICE_NOTES),
        since: 2026 - age,
        audited: false,
        tier: "index",
        verified: false,
        demo: true,
      });
    }
  }
  return [...audited, ...index];
}

/* ────────────────────────────────────────────────────────────────────────────
   5 · treatments — 12 curated (verbatim) + 6 new synthetic guides
   ──────────────────────────────────────────────────────────────────────────── */

const NEW_TREATMENTS = [
  {
    slug: "kidney-transplant",
    name: "Kidney transplant",
    short: "Living-donor renal transplant",
    category: "Transplants",
    description:
      "End-to-end transplant pathway: recipient and donor work-up, cross-match review, nephrectomy plus implantation, and 12 weeks of immunosuppression titration with one named transplant coordinator.",
    hospitalStay: "10–14 nights",
    surgeryTime: "4–6 h",
    recovery: "6 weeks to normal activity",
    india: 9.8, thailand: 6.2, singapore: 14.2, turkey: 5.7, malaysia: 7.4,
    saving: "₹4.1L",
    bestFor: "ESRD · eGFR <30 · failed medical therapy",
    included: [
      "Recipient + donor work-up (24 tests)",
      "Transplant surgeon + anaesthesia team",
      "10 nights room + ICU standby 3d",
      "Immunosuppressants for 3 months",
      "Flights for 3 travellers · visa · pickup",
      "Monthly creatinine tracking for 12 months",
    ],
    faqs: [
      { q: "How are donor and recipient matched?", a: "Cross-match, blood-group and HLA antibody screens are reviewed by the transplant team before any date is offered. If the pairing is weak, the coordinator says so instead of booking." },
      { q: "How long do we need to stay?", a: "Plan 18–24 days in country for the operation, the first dressing change and the initial immunosuppression review; the rest of the protocol runs remotely." },
    ],
  },
  {
    slug: "robotic-prostatectomy",
    name: "Robotic prostatectomy",
    short: "Nerve-sparing robotic prostate removal",
    category: "Urology",
    description:
      "Robot-assisted radical prostatectomy with a nerve-sparing approach, intraoperative margin assessment and a 48-hour discharge pathway, including a written continence and potency plan.",
    hospitalStay: "1–2 nights",
    surgeryTime: "90–150 min",
    recovery: "Catheter 7 days · desk work in 3 weeks",
    india: 6.4, thailand: 4.1, singapore: 9.3, turkey: 3.7, malaysia: 4.9,
    saving: "₹2.7L",
    bestFor: "Prostate cancer · PSA <30 · fit for surgery",
    included: [
      "MRI + PSA + biopsy review by the surgeon",
      "Robotic system + 6 ports, keyhole incision",
      "1 night room + 1 night observation",
      "Bladder and urine drainage plan",
      "Flights for 2 · hotel 6 nights · transfers",
      "Pathology report explained at day 10",
    ],
    faqs: [
      { q: "Will I keep urinary control afterwards?", a: "Early continence varies. The surgeon sends a written expectation based on your pre-operative assessment, and the package includes a 12-week pelvic-floor physiotherapy plan." },
      { q: "When is the PSA result available?", a: "The final pathology report is usually ready by day 7–10 after surgery and is explained in a video call before you fly home." },
    ],
  },
  {
    slug: "liver-transplant",
    name: "Liver transplant",
    short: "Deceased-donor liver transplant",
    category: "Transplants",
    description:
      "Deceased-donor liver transplantation for end-stage liver disease and select liver cancers, with MELD scoring, ICU stay planning and a 6-month rehabilitation pathway.",
    hospitalStay: "21–30 nights",
    surgeryTime: "6–10 h",
    recovery: "3–6 months to full recovery",
    india: 21.5, thailand: 14.2, singapore: 31.0, turkey: 12.6, malaysia: 16.4,
    saving: "₹8.9L",
    bestFor: "Decompensated cirrhosis · MELD 15–30 · HCC within criteria",
    included: [
      "MELD / Child-Pugh scoring + transplant board review",
      "Transplant surgeon + hepatology team",
      "ICU stay + ward stay, 21 nights included",
      "Immunosuppression and antiviral protocols",
      "Flights for 3 travellers · visa · hospital transfer",
      "Monthly liver-function checks for 6 months",
    ],
    faqs: [
      { q: "Is a transplant always possible?", a: "No. The transplant board applies published criteria and often declines — when that happens the coordinator shares the reasoning and, where relevant, a liver-cancer or cirrhosis-management plan instead." },
      { q: "Who stays with the patient?", a: "One companion is included for the whole admission. Because the ICU phase is unpredictable, we advise one family member who can travel at short notice." },
    ],
  },
  {
    slug: "varicose-vein-ablation",
    name: "Varicose vein ablation",
    short: "Endovenous laser ablation · day-care",
    category: "Vascular",
    description:
      "Duplex-guided endovenous laser ablation with triphlex ultrasound, usually completed as a single day-care visit with compression therapy and a remote wound check.",
    hospitalStay: "Day-care",
    surgeryTime: "45–60 min",
    recovery: "Walking the same day · compression for 3 weeks",
    india: 0.95, thailand: 0.62, singapore: 2.3, turkey: 0.55, malaysia: 0.72,
    saving: "₹40,000",
    bestFor: "Varicose veins · skin changes · recurrent aching",
    included: [
      "Duplex mapping + ABPI measurement",
      "Laser ablation ± truncal phlebectomy",
      "Day-care room + sedation-free anaesthesia option",
      "Compression stockings for 6 weeks",
      "Flights + hotel 3 nights + transfers",
      "Day-14 scan review with the vascular team",
    ],
    faqs: [
      { q: "Do I need to stay in hospital?", a: "Most patients are treated as day-care and fly or drive home the same evening; the quote shows the exact day-care pathway before you commit." },
      { q: "How soon do the veins disappear?", a: "Most visible veins fade over 6–12 weeks as the treated vein closes and the circulation re-routes — progress photos are tracked at day 14 and day 60." },
    ],
  },
  {
    slug: "sinus-septal-surgery",
    name: "Sinus & septal surgery",
    short: "FESS endoscopic sinus surgery with septoplasty",
    category: "ENT",
    description:
      "Functional endoscopic sinus surgery with septoplasty and turbinate reduction for chronic rhinosinusitis, nasal polyps and long-standing obstruction, including allergy work-up.",
    hospitalStay: "1–2 nights",
    surgeryTime: "60–90 min",
    recovery: "7 days of saline rinses",
    india: 1.1, thailand: 0.72, singapore: 2.5, turkey: 0.63, malaysia: 0.85,
    saving: "₹47,000",
    bestFor: "Chronic sinusitis · polyps · blocked nose for years",
    included: [
      "CT of PNS + nasal endoscopy + allergy panel",
      "ENT surgeon + anaesthesia + day-care option",
      "1 night room + nasal pack removal at day 5",
      "Steroid and saline protocol for 6 weeks",
      "Flights + hotel 4 nights + transfers",
      "Day-30 endoscopic review",
    ],
    faqs: [
      { q: "Is the pack removal painful?", a: "The pack is removed on day 5 in clinic; most patients describe it as uncomfortable rather than painful, and you can fly home 24 hours later." },
      { q: "Will my sense of smell return?", a: "Smell often improves within weeks of clearing the sinuses, but patients with long-standing polyps may need a second opinion on smell training and steroid therapy." },
    ],
  },
  {
    slug: "laparoscopic-hernia-repair",
    name: "Laparoscopic hernia repair",
    short: "TAPP/TEP mesh repair · day-care",
    category: "General Surgery",
    description:
      "Keyhole mesh repair (TAPP or TEP) for inguinal or incisional hernia with same-day discharge, an explicit no-heavy-lifting protocol and remote wound reviews.",
    hospitalStay: "Day-care",
    surgeryTime: "45–75 min",
    recovery: "No heavy lifting for 6 weeks",
    india: 0.72, thailand: 0.46, singapore: 1.7, turkey: 0.41, malaysia: 0.55,
    saving: "₹31,000",
    bestFor: "Groin or incisional hernia · reducible swelling · fit for surgery",
    included: [
      "Ultrasound + surgeon review before travel",
      "Mesh (brand disclosed) + keyhole laparoscopy",
      "Day-care + 24h observation room",
      "Pain protocol + laxatives + dressing pack",
      "Flights + hotel 3 nights + transfers",
      "Day-10 and day-30 tele-reviews",
    ],
    faqs: [
      { q: "Mesh or no mesh?", a: "Mesh repair has the lower recurrence rate and is standard for most inguinal hernias; the surgeon confirms the approach and the mesh brand in writing before you travel." },
      { q: "When can I fly home?", a: "Most patients fly 2–3 days after surgery once the driver is dry and pain is oral-only — your fit-to-fly note is issued on day 2 or 3." },
    ],
  },
];

function buildTreatments() {
  const curated = CURATED_TREATMENTS.map((t) => ({ ...t }));
  const added = NEW_TREATMENTS.map((t) => ({
    slug: t.slug,
    name: t.name,
    short: t.short,
    category: t.category,
    description: t.description,
    hospitalStay: t.hospitalStay,
    surgeryTime: t.surgeryTime,
    recovery: t.recovery,
    allIn: {
      india: t.india,
      thailand: t.thailand,
      singapore: t.singapore,
      turkey: t.turkey,
      malaysia: t.malaysia,
    },
    savingVsPrivateIndia: t.saving,
    bestFor: t.bestFor,
    included: t.included,
    faqs: t.faqs,
  }));
  return [...curated, ...added];
}

/* ────────────────────────────────────────────────────────────────────────────
   6 · doctors — 6 curated (verbatim) + 24 synthetic index listings
   ──────────────────────────────────────────────────────────────────────────── */

const ROLES = {
  Cardiac: ["Consultant Cardiothoracic Surgeon", "Interventional Cardiologist", "Senior Cardiac Surgeon", "Electrophysiology Consultant"],
  Oncology: ["Head, Oncology — MDT Lead", "Medical Oncologist", "Surgical Oncologist", "Radiation Oncologist"],
  Orthopaedics: ["Senior Orthopaedic Surgeon", "Joint Replacement Surgeon", "Robotic Orthopaedic Surgeon", "Spine Surgeon"],
  Fertility: ["Director, IVF & Reproductive Medicine", "Reproductive Endocrinologist", "IVF & Embryology Consultant"],
  Transplants: ["Transplant & Hepatobiliary Surgeon", "Consultant Transplant Physician", "Renal Transplant Surgeon"],
  Neuro: ["Consultant Neurosurgeon", "Spine & Neuro Surgeon", "Interventional Neuroradiologist"],
  "Bone marrow": ["Haematology & Bone Marrow Specialist", "Consultant Haematologist", "Transplant Physician"],
  Bariatric: ["Consultant Bariatric & Metabolic Surgeon", "Laparoscopic Bariatric Surgeon", "Metabolic Medicine Consultant"],
  Cosmetic: ["Consultant Plastic & Reconstructive Surgeon", "Hair Restoration Surgeon", "Aesthetic Surgeon"],
  Dental: ["Implantologist & Prosthodontist", "Cosmetic & Restorative Dentist"],
  Ophthalmology: ["Consultant Ophthalmologist & Cataract Surgeon", "Refractive Surgery Specialist", "Retina & Vitreous Specialist"],
  Gastroenterology: ["Consultant Gastroenterologist & Endoscopist", "Hepatology Specialist"],
  Urology: ["Consultant Urologist", "Robotic Prostate Surgeon", "Endourology Specialist"],
  ENT: ["ENT & Rhinology Consultant", "Otology & Hearing Specialist"],
  Vascular: ["Vascular & Endovascular Surgeon", "Phlebology Specialist"],
  "General Surgery": ["Laparoscopic & General Surgeon", "Day-care Surgery Surgeon"],
  "Sports medicine": ["Sports Medicine & Arthroscopy Surgeon", "Ligament Reconstruction Specialist"],
  "Plastic surgery": ["Aesthetic & Reconstructive Surgeon", "Microsurgical Reconstructive Surgeon"],
  "Paediatric cardiac": ["Paediatric Cardiac Surgeon", "Congenital Heart Fellow"],
};

const PROCEDURES = {
  Cardiac: ["Off-pump CABG", "Valve repair (mitral)", "IVUS-guided PCI", "Electrophysiology study"],
  Oncology: ["Tumour MDT", "Immunotherapy planning", "Precision biopsy pathways", "Neoadjuvant protocols"],
  Orthopaedics: ["Robotic total knee (TKR)", "Partial knee (UKR)", "Revision hip", "ACL reconstruction"],
  Fertility: ["IVF / ICSI", "PGT-A embryo testing", "Donor programmes", "Blastocyst culture"],
  Transplants: ["Living-donor nephrectomy", "Recipient transplant surgery", "Immunosuppression titration"],
  Neuro: ["Microneurosurgery", "Craniotomy for tumour", "Spinal decompression", "Stroke intervention"],
  "Bone marrow": ["Bone marrow transplant", "Lymphoma protocols", "Aplastic anaemia care"],
  Bariatric: ["Gastric sleeve (LSG)", "Roux-en-Y bypass", "Revisional bariatric"],
  Cosmetic: ["FUE hair transplant", "Body contouring", "Facelift surgery", "Rhinoplasty"],
  Dental: ["Full-arch implants (All-on-4/6)", "Zirconia crowns", "Digital guided surgery"],
  Ophthalmology: ["SMILE pro / bladeless LASIK", "Trifocal IOL implantation", "Vitrectomy"],
  Gastroenterology: ["Diagnostic endoscopy", "Polypectomy", "ERCP", "Liver fibrosis staging"],
  Urology: ["Robotic radical prostatectomy", "PCNL stone surgery", "TURP"],
  ENT: ["FESS endoscopic sinus surgery", "Septoplasty + turbinate reduction", "Tympanoplasty"],
  Vascular: ["Endovenous laser ablation", "Varicose ulcer care", "Diabetic foot surgery"],
  "General Surgery": ["TAPP/TEP hernia repair", "Laparoscopic cholecystectomy", "Day-care appendicectomy"],
  "Sports medicine": ["Knee arthroscopy", "Shoulder stabilisation", "Meniscus repair"],
  "Plastic surgery": ["Breast augmentation", "Mastectomy reconstruction", "Body contouring (liposuction)"],
  "Paediatric cardiac": ["VSD closure", "Congenital repair", "Paediatric ICU care"],
};

const COLLEGES = [
  "Government Medical College, Patna",
  "B. J. Medical College, Pune",
  "MGM Medical College, Indore",
  "R. G. Kar Medical College, Kolkata",
  "Kalinga Institute of Medical Sciences, Bhubaneswar",
  "M. S. Ramaiah Medical College, Bengaluru",
  "St. John's Medical College, Bengaluru",
  "JSS Medical College, Mysuru",
  "Mahatma Gandhi Institute of Medical Sciences, Nagpur",
  "Rajiv Gandhi Institute of Medical Sciences, Patna",
];

/** Postgraduate degree that actually belongs to the specialty. */
const DEGREE_BY_SPECIALTY = {
  Cardiac: "DM Cardiology",
  Oncology: "MD Radiation Oncology",
  Orthopaedics: "MS Orthopaedics",
  Fertility: "MD Obstetrics & Gynaecology",
  Transplants: "MS General Surgery",
  Neuro: "MCh Neurosurgery",
  "Bone marrow": "MD Internal Medicine",
  Bariatric: "MS General Surgery",
  Cosmetic: "MS Plastic Surgery",
  Dental: "MDS Prosthodontics",
  Ophthalmology: "MS Ophthalmology",
  Gastroenterology: "DM Gastroenterology",
  Urology: "MS Urology",
  ENT: "MS ENT",
  Vascular: "MS Vascular Surgery",
  "General Surgery": "MS General Surgery",
  "Sports medicine": "MS Orthopaedics",
  "Plastic surgery": "MS Plastic Surgery",
  "Paediatric cardiac": "MCh Paediatric Cardiac Surgery",
};

/** Fellowship that actually belongs to the specialty. */
const FELLOWSHIP_BY_SPECIALTY = {
  Cardiac: [
    "Fellowship in Interventional Cardiology — Erasmus, Rotterdam",
    "Fellowship in Cardiac Imaging — St. Thomas' Hospital, London",
    "Fellowship in Structural Heart — Royal Melbourne Hospital",
  ],
  Oncology: [
    "Fellowship in Immuno-oncology — Dana-Farber, Boston",
    "Fellowship in Breast Oncology — Charité, Berlin",
    "Fellowship in Radiation Oncology — Royal Marsden, London",
  ],
  Orthopaedics: [
    "Fellowship in Robotic Arthroplasty — Hospital for Special Surgery, New York",
    "Fellowship in Revision Knee Surgery — Charité, Berlin",
    "Fellowship in Sports Orthopaedics — Rikshospitalet, Stockholm",
  ],
  Fertility: [
    "Fellowship in Reproductive Endocrinology — Karolinska, Stockholm",
    "Fellowship in Reproductive Medicine — Monash IVF, Melbourne",
  ],
  Transplants: [
    "Fellowship in Hepatobiliary & Transplant Surgery — Royal Melbourne Hospital",
    "Fellowship in Multivisceral Transplant — Heidelberg",
  ],
  Neuro: [
    "Fellowship in Microneurosurgery — Heidelberg",
    "Fellowship in Cerebrovascular Surgery — Amsterdam UMC",
  ],
  "Bone marrow": [
    "Fellowship in Haematopoietic Stem Cell Transplantation — Karolinska, Stockholm",
  ],
  Bariatric: [
    "Fellowship in Metabolic Surgery — Eras MC, Rotterdam",
  ],
  Cosmetic: [
    "Fellowship in Aesthetic & Reconstructive Surgery — Campanile, Paris",
    "Fellowship in Hair Restoration — ISHRS, Amsterdam",
  ],
  Dental: [
    "Fellowship in Implant Dentistry — University of Toronto",
    "Fellowship in Digital Dentistry — ZM, Lund",
  ],
  Ophthalmology: [
    "Fellowship in Vitreoretinal Surgery — Moorfields Eye Hospital, London",
    "Fellowship in Refractive Surgery — Zuerich Eye Center, Zurich",
  ],
  Gastroenterology: [
    "Fellowship in Advanced Endoscopy — Amsterdam UMC",
    "Fellowship in Hepatology — Royal Melbourne Hospital",
  ],
  Urology: [
    "Fellowship in Robotic Uro-oncology — Heidelberg",
    "Fellowship in Endourology — Charité, Berlin",
  ],
  ENT: [
    "Fellowship in Rhinology & Skull Base — Amsterdam UMC",
    "Fellowship in Otology — St. Thomas' Hospital, London",
  ],
  Vascular: [
    "Fellowship in Vascular & Endovascular Surgery — St. Thomas' Hospital, London",
    "Fellowship in Phlebology — St. Marien Hospital, Düsseldorf",
  ],
  "General Surgery": [
    "Fellowship in Minimal Access Surgery — Royal Melbourne Hospital",
  ],
  "Sports medicine": [
    "Fellowship in Sports Medicine & Arthroscopy — Isolasio, Barcelona",
  ],
  "Plastic surgery": [
    "Fellowship in Microsurgical Reconstruction — Charité, Berlin",
  ],
  "Paediatric cardiac": [
    "Fellowship in Congenital Cardiac Surgery — Great Ormond Street Hospital, London",
  ],
};

const BIO_OPENERS = [
  "publishes procedure volumes and complication rates openly, including the ones that go wrong",
  "runs a structured follow-up registry and phones every patient on day 7, day 30 and day 90",
  "keeps a personal log of every case and reviews it monthly with the department",
  "trains the next generation of scrub nurses and reviews cases with them weekly",
  "refuses to operate without a second imaging read and says so in the pre-op plan",
  "writes to every family in their own language before the consent conversation",
  "keeps same-day-discharge protocols and audits them monthly against readmission",
  "publishes age-adjusted outcomes and refuses to quote success rates by clinic volume",
];

const BIO_CLOSERS = [
  "Patients describe the pre-op explanation as unusually honest.",
  "Most of the case load comes from repeat patients and referrals.",
  "The coordinator team answers in the same working day.",
  "Families say the discharge paperwork is actually readable.",
  "The unit keeps a second opinion open for every elective case.",
  "Out-of-hours questions go to a named registrar, not a call centre.",
  "Reviews mention short waiting times and clear pricing.",
  "The team is known for conservative first-line advice.",
];

const DOCTOR_NAMES = {
  India: ["Dr. A. Balasubramanian", "Dr. Ritu Bhalla", "Dr. Nikhil Varma", "Dr. Sneha Kulkarni", "Dr. Manish Rathore", "Dr. Aditi Deshpande", "Dr. Vivek Sundaram", "Dr. Kavya Nair", "Dr. Rohit Aggarwal", "Dr. Shalini Padmanabhan", "Dr. Arindam Chatterjee", "Dr. Deepika Rao"],
  Thailand: ["Dr. Chaiwat Suwan", "Dr. Pimchanok Lek", "Dr. Nattapong Wong", "Dr. Kanya Rojanapruk", "Dr. Thanawat Prasert", "Dr. Siriporn Vittaya", "Dr. Anuwat Bunnag", "Dr. Pornchai Saelim"],
  Singapore: ["Dr. Wei Ling Tan", "Dr. Adrian Lim", "Dr. Hui Fang Goh", "Dr. Marcus Ng", "Dr. Nurul Aisyah", "Dr. Kelvin Ong"],
  Turkey: ["Dr. Emre Yildiz", "Dr. Zeynep Aydin", "Dr. Ahmet Demir", "Dr. Elif Kaya", "Dr. Mert Sahin", "Dr. Selin Arslan", "Dr. Burak Ozturk", "Dr. Ceren Aslan"],
  Malaysia: ["Dr. Siti Rahman", "Dr. Aisyah Bakar", "Dr. Wei Jian Tan", "Dr. Ravi Kumar", "Dr. Nurul Imani", "Dr. Farah Adilah"],
  UAE: ["Dr. Faisal Al Suwaidi", "Dr. Huda Al Mansoori", "Dr. Rashid Al Nuaimi", "Dr. Mariam Haddad", "Dr. Khalid Al Zaabi", "Dr. Aisha Farouk"],
};

const FIRST_NAMES = ["Ananya", "Rajesh", "Sanjay", "Priya", "Vikram", "Kavya", "Arjun", "Meera", "Rohit", "Divya", "Suresh", "Nandini", "Imran", "Sameer", "Lakshmi", "Vivek"];
const LAST_NAMES = ["Iyer", "Nair", "Menon", "Rao", "Kulkarni", "Bose", "Chawla", "Reddy", "Joshi", "Pillai", "Shetty", "Varma", "Menon", "Malhotra", "Desai", "Kapoor"];

function buildDoctors(hospitals) {
  const curated = CURATED_DOCTORS.map((d) => ({ ...d }));
  const auditedHospitals = hospitals.filter((h) => h.audited);
  const indexHospitals = hospitals.filter((h) => !h.audited);

  const added = [];
  const makeDoctor = (hospital, specialty) => {
    const pool = DOCTOR_NAMES[hospital.country] ?? DOCTOR_NAMES.India;
    const useCuratedName = chance(0.35);
    const name = useCuratedName
      ? `Dr. ${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
      : pick(pool);
      const expYears = intBetween(9, 32);
    const procedures = sample(PROCEDURES[specialty] ?? PROCEDURES["General Surgery"], intBetween(2, 4));
    const languages = ["English", ...sample(hospital.languages.filter((l) => l !== "English"), intBetween(1, 3))];
    const slug = slugify(name.replace(/^Dr\.\s*/, "") + " " + hospital.city, hospital.slug);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const times = ["09:30", "10:15", "11:00", "12:30", "15:00", "16:30", "18:00"];
    const degree = DEGREE_BY_SPECIALTY[specialty] ?? "MS General Surgery";
    const fellowships = FELLOWSHIP_BY_SPECIALTY[specialty] ?? ["Fellowship in General Surgery — Royal Melbourne Hospital"];
    return {
      slug,
      name,
      role: pick(ROLES[specialty] ?? ROLES["General Surgery"]),
      specialty,
      expYears,
      education: [
        `MBBS — ${pick(COLLEGES)}`,
        `${degree} — ${pick(COLLEGES)}`,
        pick(fellowships),
      ],
      languages,
      hospitalSlug: hospital.slug,
      hospital: hospital.name,
      city: hospital.city,
      rating: floatBetween(4.1, 4.9, 1),
      reviews: intBetween(40, 1800),
      procedures,
      bio: `${expYears} years in ${specialty.toLowerCase()}; ${pick(BIO_OPENERS)}. ${pick(BIO_CLOSERS)}`,
      nextSlot: `${pick(days)} ${pick(times)} IST (${chance(0.6) ? "video" : "in-clinic"})`,
    };
  };

  // 12 synthetic doctors at the audited centres + 12 at index hospitals
  for (let i = 0; i < 12; i++) {
    const hospital = auditedHospitals[i % auditedHospitals.length];
    const specialty = pick(hospital.specialties);
    added.push(makeDoctor(hospital, specialty));
  }
  for (let i = 0; i < 12; i++) {
    const hospital = indexHospitals[(i * 7 + 3) % indexHospitals.length];
    const specialty = pick(hospital.specialties);
    added.push(makeDoctor(hospital, specialty));
  }
  return [...curated, ...added];
}

/* ────────────────────────────────────────────────────────────────────────────
   7 · reviews (90) and FAQs (70)
   ──────────────────────────────────────────────────────────────────────────── */

const PATIENTS = [
  "Suresh Kulkarni, 61", "Fatima Sheikh, 44", "Ramesh Iyer, 52", "Anjali Nair, 37", "Imran Qureshi, 48",
  "Sunita Rao, 55", "Gurpreet Sandhu, 39", "Leela Menon, 66", "Vijay Bhatt, 47", "Shabana Ali, 33",
  "Deepak Chawla, 58", "Rekha Pillai, 49", "Nitin Sharma, 42", "Kavya Reddy, 29", "Harish Bhat, 63",
  "Meenakshi Joshi, 54", "Arun Deshpande, 50", "Saira Khan, 36", "Mohan Varma, 60", "Pooja Sinha, 41",
];

const REVIEW_CITIES = ["Delhi", "Mumbai", "Chennai", "Bengaluru", "Hyderabad", "Pune", "Kochi", "Jaipur", "Lucknow", "Ahmedabad", "Kolkata", "Coimbatore", "Chandigarh", "Indore"];

const REVIEW_TEXT_OPENERS = [
  "Quotes from three hospitals arrived inside two days",
  "The comparison table made the price difference obvious",
  "I had reports reviewed before booking and nobody pushed me",
  "The coordinator called every week until I flew",
  "The hospital matched the quote to the rupee",
  "Everything — visa, hotel, transfers — was arranged before I landed",
  "The surgeon explained my own scans with me on a video call",
  "I compared four centres on price and on complication rates",
];

const REVIEW_TEXT_MIDDLES = [
  "and the aftercare calls on day 7 and day 30 were the difference for me.",
  "so I could pick with my family in the same room.",
  "which mattered more than the headline saving.",
  "and the written quote had every line itemised.",
  "and the implant brand was disclosed before I paid anything.",
  "so the total cost was clear on day one.",
  "and I did not have to chase anyone for a document.",
  "and the discharge paperwork was in plain language.",
];

const REVIEW_TEXT_ENDERS = [
  "Would do it again.",
  "Slower than expected, but the outcome was good.",
  "Took two quotes to compare, worth it.",
  "Travel was the easy part; the clinical care was solid.",
  "Happy with the result and the follow-up.",
  "Would tell a friend to prepare records early.",
  "Saved roughly the difference between the two quotes.",
  "Felt looked after rather than processed.",
];

function buildReviews(hospitals, treatments) {
  const curated = CURATED_REVIEWS.map((r) => ({ ...r }));
  const indexHospitals = hospitals.filter((h) => !h.audited);
  const added = [];
  const months = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026"];

  // keep the 84 illustrative reviews distinct: 8 openers × 8 middles × 8 enders = 512 combos
  const combos = [];
  for (const o of REVIEW_TEXT_OPENERS) for (const m of REVIEW_TEXT_MIDDLES) for (const e of REVIEW_TEXT_ENDERS) combos.push(`${o} ${m} ${e}`);

  for (let i = 0; i < 84; i++) {
    const hospital = indexHospitals[(i * 13 + 5) % indexHospitals.length];
    const treatment = treatments[(i * 5 + 2) % treatments.length];
    added.push({
      name: PATIENTS[i % PATIENTS.length],
      city: REVIEW_CITIES[(i * 3) % REVIEW_CITIES.length],
      treatment: treatment.name,
      hospital: hospital.name,
      rating: chance(0.62) ? 5 : 4,
      date: months[(i * 7) % months.length],
      text: combos[(i * 37 + 11) % combos.length],
      tag: "Illustrative review",
    });
  }
  return [...curated, ...added];
}

const FAQ_POOL = [
  { cat: "General", q: "How do I know which country suits my case?", a: "Tell us your condition and the reports you already have. The clinical desk compares the specialities, the direct-flight times and the aftercare network, then narrows it to two or three countries worth quoting." },
  { cat: "General", q: "How is the hospital index built?", a: "Eight institutions are hand-audited by our clinical desk and carry verified accreditation, outcome and patient-experience data. The wider index is a scale model of the marketplace and its entries are illustrative demo listings, not audited providers." },
  { cat: "General", q: "Can I see a hospital's audit before I enquire?", a: "Yes for audited institutions — accreditation numbers, expiry dates and the last audit date sit on each profile. Index listings do not yet have an audit pack, and we label them as such." },
  { cat: "General", q: "Do I need a referral from my local doctor?", a: "No. Many patients arrive without one. We do ask for recent reports, and your case is reviewed by a surgeon before you travel so nobody books a flight for the wrong procedure." },
  { cat: "General", q: "What if I am not sure which treatment I need?", a: "Start a case with your symptoms and reports instead of a procedure. The clinical desk replies with what the evidence suggests and which specialities to compare." },
  { cat: "Money", q: "Can I pay in instalments?", a: "Yes — 0% EMI for 6 months or 12% reducing thereafter; or pay the hospital directly at admission; or insurance cashless where networked." },
  { cat: "Money", q: "Are the prices on treatment pages binding?", a: "No. Every figure is an indicative all-in band. The written quote you accept is the binding one, and it holds for 30 days including implants." },
  { cat: "Money", q: "What is not included in an all-in quote?", a: "Flights are added at your actual fare, personal spending is yours, and any extra nights you choose to keep are billed at the pre-agreed capped rate in your consent." },
  { cat: "Money", q: "Do you charge a booking fee?", a: "Only a refundable token of ₹9,999, held in escrow until you check in. Hospitals pay the referral fee, and it is disclosed inside every quote." },
  { cat: "Money", q: "Can I compare a quote against a private hospital at home?", a: "Yes. Every treatment page shows the private-India saving so you can sanity-check the number before you talk to anyone." },
  { cat: "Trust", q: "How do you verify a doctor?", a: "Original registration certificates, the hospital employment letter and a log of recent cases are checked before a profile is published, and again every year." },
  { cat: "Trust", q: "What if a hospital stops meeting your standard?", a: "It is delisted from the audited set the same quarter it fails, and patients with a booked case are re-matched by the clinical desk at no cost." },
  { cat: "Trust", q: "Can I talk to a patient who went to the same centre?", a: "For audited institutions, yes, after you have shared your treatment plan with the coordinator and the patient has consented to the call." },
  { cat: "Trust", q: "Are outcome statistics per surgeon or per hospital?", a: "Both are published separately for audited centres, and we never mix a hospital's overall figures into a single surgeon's record." },
  { cat: "Trust", q: "Do index listings come with outcome data?", a: "No. Index entries are scale listings in this demo build; they show structure, not verified clinical performance, and we mark them accordingly." },
  { cat: "Privacy", q: "Who can see my medical records?", a: "Only the hospitals you request a quote from, only after you e-sign consent. Records are encrypted, stored under DPDP and never sold." },
  { cat: "Privacy", q: "Can my employer or insurer see my case?", a: "Only if you name them. You can add an insurer later — most policies need the hospital's invoice and discharge summary rather than our notes." },
  { cat: "Privacy", q: "How long do you keep my files?", a: "Until you ask us to delete them, and then within 30 days across primary stores and backups, with a written confirmation." },
  { cat: "Safety", q: "What if the surgery is cancelled after I travel?", a: "You get 100% of the coordinated costs refunded, flights rebooked, and your coordinator stays with you until a new date is confirmed." },
  { cat: "Safety", q: "What if I need ICU beyond the quoted days?", a: "Quoted packages include standard ICU days. Extra days are billed at pre-agreed capped rates in your consent, never open-ended." },
  { cat: "Safety", q: "Who is responsible if something goes wrong?", a: "Clinical responsibility stays with the treating hospital and its clinician. We coordinate, we do not practise medicine, and we make sure the consent, the escalation route and the insurer are all in place before admission." },
  { cat: "Safety", q: "Do you screen for pre-travel health risks?", a: "Yes. We ask about mobility, cardiac history, diabetes control and recent infections, and we flag cases where flying is genuinely unsafe." },
  { cat: "Travel", q: "How long do I need to stay in the country?", a: "It depends on the procedure — day-care for dental, cataract and vein work, 10–14 days for a bypass, 3–6 months for a transplant rehabilitation path." },
  { cat: "Travel", q: "Can my companion travel with me?", a: "Yes — quotes include one companion for room, meals and transfers. Extra companions are priced separately and shown as a separate line." },
  { cat: "Travel", q: "What about meals if I have dietary requirements?", a: "All partner hospitals mark meal plans in the patient file, and your coordinator confirms them 48 hours before admission." },
  { cat: "Travel", q: "Do you arrange airport transfers and a driver?", a: "Yes, on every quote that includes a hospital stay. The driver's number is shared with your coordinator, not with a call centre." },
  { cat: "Travel", q: "Can I extend my stay for a holiday?", a: "Usually, yes. The medical part of the quote is fixed; you book the extra nights directly with the hospital and we help with the visa extension paperwork." },
  { cat: "Recovery", q: "Who follows me up when I get home?", a: "A named coordinator runs the day-7, day-30 and day-90 tele-reviews, and local scans are reviewed remotely by the treating team." },
  { cat: "Recovery", q: "What if I need physiotherapy after I fly home?", a: "Your package includes a video-based physiotherapy plan with a local partner clinic for hands-on sessions where they are needed." },
  { cat: "Recovery", q: "How do I know a wound is healing normally?", a: "You get a written day-by-day checklist with photos, and a direct line to the surgical team if anything looks different from it." },
  { cat: "Recovery", q: "Can I fly home before the surgeon says so?", a: "Not safely. Every fit-to-fly is signed after a repeat check, and the quote includes that review — it is why most travel dates are not day seven." },
  { cat: "Ethics", q: "Do you sell patient data or accept paid placement?", a: "No. A hospital can pay for coordination after your case, and that fee is disclosed inside every quote you receive from us." },
  { cat: "Ethics", q: "Will you coordinate a treatment you think is wrong for me?", a: "No. If the review suggests surgery will not help, the coordinator tells you that and suggests the conservative path, even though it costs the platform less." },
  { cat: "Ethics", q: "Do you accept every hospital that applies?", a: "No. Every applicant is audited, and a meaningful share of audited candidates fail and are never listed." },
  { cat: "Ethics", q: "How do you handle research and market data?", a: "Benchmark figures are aggregated, published with their method and sample size, and never built from individual patient records." },
];

function buildFaqs() {
  const curated = CURATED_FAQS.map((f) => ({ ...f }));
  const seen = new Set(curated.map((f) => f.q));
  const added = [];
  for (const item of FAQ_POOL) {
    if (seen.has(item.q)) continue;
    seen.add(item.q);
    added.push({ q: item.q, a: item.a, cat: item.cat });
  }
  // top up from the pool if the curated set ever overlaps more than expected
  let i = 0;
  while (added.length < 46 && i < FAQ_POOL.length * 4) {
    const item = FAQ_POOL[i % FAQ_POOL.length];
    const q = item.q + " (" + (Math.floor(i / FAQ_POOL.length) + 1) + ")";
    if (!seen.has(q)) {
      seen.add(q);
      added.push({ q, a: item.a, cat: item.cat });
    }
    i++;
  }
  return [...curated, ...added.slice(0, 46)];
}

/* ────────────────────────────────────────────────────────────────────────────
   8 · assemble + emit
   ──────────────────────────────────────────────────────────────────────────── */

const hospitals = buildHospitals();
const treatments = buildTreatments();
const doctors = buildDoctors(hospitals);
const reviews = buildReviews(hospitals, treatments);
const faqs = buildFaqs();

const payload = {
  meta: {
    generator: GENERATOR,
    seed: SEED,
    note: "Curated entries are copied verbatim from src/data/ethaum.ts. All other entries are synthetic demo data and are labelled as such in the app.",
    counts: {
      hospitals: hospitals.length,
      hospitalsAudited: hospitals.filter((h) => h.audited).length,
      hospitalsIndex: hospitals.filter((h) => !h.audited).length,
      treatments: treatments.length,
      doctors: doctors.length,
      reviews: reviews.length,
      faqs: faqs.length,
    },
  },
  hospitals,
  treatments,
  doctors,
  reviews,
  faqs,
};

const jsonText = JSON.stringify(payload, null, 2) + "\n";

const tsText = `/* EthAum · generated catalogue seed — DO NOT EDIT BY HAND.
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
`;

/* ────────────────────────────────────────────────────────────────────────────
   9 · write / check
   ──────────────────────────────────────────────────────────────────────────── */

const rel = (p) => relative(process.cwd(), p) || p;

function firstDifference(a, b) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const max = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < max; i++) {
    if (aLines[i] !== bLines[i]) {
      return { line: i + 1, expected: aLines[i] ?? "<eof>", actual: bLines[i] ?? "<eof>" };
    }
  }
  return null;
}

const targets = [
  { path: OUT_JSON, text: jsonText },
  { path: OUT_TS, text: tsText },
];

const checkOnly = process.argv.slice(2).includes("--check");

if (checkOnly) {
  let drifted = false;
  for (const target of targets) {
    let onDisk = "";
    try {
      onDisk = readFileSync(target.path, "utf8");
    } catch {
      onDisk = "";
    }
    if (onDisk === target.text) {
      console.log(`  ok    ${rel(target.path)}`);
      continue;
    }
    drifted = true;
    const diff = firstDifference(target.text, onDisk);
    console.log(`  DIFF  ${rel(target.path)}`);
    if (diff) {
      console.log(`        first difference at line ${diff.line}`);
      console.log(`        expected: ${diff.expected}`);
      console.log(`        on disk : ${diff.actual}`);
    } else {
      console.log("        file content differs (same line count)");
    }
  }
  if (drifted) {
    console.log("\nseed FAILED — run `node scripts/seed.mjs` to regenerate");
    process.exit(1);
  }
  console.log("\nseed OK — generated files match scripts/seed.mjs output");
  process.exit(0);
}

for (const target of targets) {
  writeFileSync(target.path, target.text, "utf8");
}

console.log("EthAum seed written");
console.log(`  hospitals   ${hospitals.length}  (${payload.meta.counts.hospitalsAudited} audited · ${payload.meta.counts.hospitalsIndex} index)`);
console.log(`  treatments  ${treatments.length}  (12 curated · ${treatments.length - 12} new)`);
console.log(`  doctors     ${doctors.length}  (${CURATED_DOCTORS.length} curated · ${doctors.length - CURATED_DOCTORS.length} index)`);
console.log(`  reviews     ${reviews.length}  (${CURATED_REVIEWS.length} curated · ${reviews.length - CURATED_REVIEWS.length} illustrative)`);
console.log(`  faqs        ${faqs.length}  (${CURATED_FAQS.length} curated · ${faqs.length - CURATED_FAQS.length} added)`);
console.log(`  → ${rel(OUT_JSON)}`);
console.log(`  → ${rel(OUT_TS)}`);
console.log("  seed " + SEED + " · deterministic · re-run for identical output");
