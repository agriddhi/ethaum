/* EthAum · central content dataset — illustrative demo data, 2026.
   Benchmarked against public figures; every price is an indicative range,
   not a binding quote. Labelled in-app as "Illustrative demo data".
   (doctors verified 2026-11) */

export const INR = (n: number) =>
  `₹${n >= 100000 ? (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1) + "L" : n.toLocaleString("en-IN")}`;

export type Treatment = {
  slug: string;
  name: string;
  short: string;
  category: string;
  description: string;
  hospitalStay: string;
  surgeryTime: string;
  recovery: string;
  allIn: { india: number; thailand: number; singapore: number; turkey: number; malaysia: number };
  savingVsPrivateIndia: string;
  bestFor: string;
  included: string[];
  faqs: { q: string; a: string }[];
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "cardiac-cabg",
    name: "Cardiac bypass (CABG)",
    short: "Coronary artery bypass graft",
    category: "Cardiac",
    description:
      "Revascularisation of blocked coronary arteries using arterial/venous grafts. Off-pump and minimally invasive options available at partner centres.",
    hospitalStay: "6–8 nights",
    surgeryTime: "3.5–5 h",
    recovery: "6–8 weeks to full activity",
    allIn: { india: 17.2, thailand: 10.8, singapore: 24.5, turkey: 9.6, malaysia: 12.4 },
    savingVsPrivateIndia: "₹6.4L",
    bestFor: "Triple-vessel disease · diabetics · failed angioplasty",
    included: ["Surgeon + anaesthesia + perfusionist", "8 nights private room + ICU 2d", "All stents/grafts (brand disclosed)", "Flights for 2 · visa letter · pickup", "Day-7/30/90 tele-follow-ups", "Native-language coordinator"],
    faqs: [
      { q: "How long before I can fly back?", a: "Most patients fly home at day 10–14 post-op with a fit-to-fly certificate. Your surgeon signs off after a repeat echo and wound check." },
      { q: "Will my reports be reviewed before I commit?", a: "Yes — upload your angiogram/CT and creatinine; two partner surgeons review and send a provisional plan free of charge." },
      { q: "What if I need a re-operation?", a: "All EthAum partner hospitals offer a 90-day complication cover; we coordinate the revision at no extra cost and re-book your travel." },
    ],
  },
  {
    slug: "knee-replacement",
    name: "Knee replacement (TKR)",
    short: "Robotic total knee arthroplasty",
    category: "Orthopaedics",
    description:
      "Total knee replacement with robotic alignment planning; partial (UKR) options for unicompartmental disease. Implant brand and sizing disclosed up front.",
    hospitalStay: "4–5 nights",
    surgeryTime: "75–100 min",
    recovery: "Walking next day · 6 weeks to stairs",
    allIn: { india: 7.3, thailand: 4.1, singapore: 14.8, turkey: 3.8, malaysia: 4.6 },
    savingVsPrivateIndia: "₹3.2L",
    bestFor: "Severe OA · failed PRP/hyaluronic acid · deformity",
    included: ["Robotic jig + implant (Persona/Medacta)", "5 nights room + 2d physio", "DVT prophylaxis protocol", "Flights for 2 · visa · transfers", "12-week physio video plan", "X-ray + review at day 30/90"],
    faqs: [
      { q: "How robotic differs from conventional?", a: "Robotic arms cut to sub-millimetre precision, preserving ligaments and speeding recovery — ask your surgeon for your alignment plan." },
      { q: "Knee vs hip — which ages better?", a: "Both last 20–25 years with good physiotherapy; robotic TKR typically reports slightly faster early recovery." },
    ],
  },
  {
    slug: "ivf",
    name: "IVF (own eggs)",
    short: "In-vitro fertilisation — stimulation to transfer",
    category: "Fertility",
    description:
      "Full cycle: stimulation monitoring, egg retrieval, ICSI, blastocyst culture and fresh/frozen transfer. Donor and surrogacy pathways on request.",
    hospitalStay: "Day-care · 2 retrieval visits",
    surgeryTime: "20–30 min retrieval",
    recovery: "Same-day discharge · transfer day 5",
    allIn: { india: 3.4, thailand: 2.1, singapore: 7.8, turkey: 2.4, malaysia: 2.6 },
    savingVsPrivateIndia: "₹1.4L",
    bestFor: "Unexplained infertility · mild male factor · PCOS",
    included: ["All stimulation monitoring scans", "ICSI + blastocyst culture", "Fresh transfer (frozen extra charged)", "Airfare · visa letter · 6 nights guesthouse", "Medication protocol in your language", "Two follow-up consults after return"],
    faqs: [
      { q: "Success rates at partner centres?", a: "Own-egg cycles under-35 range 54–61% per transfer across partners; we publish per-centre data in the quote." },
      { q: "How long should we stay?", a: "Plan 12–16 days for retrieval + transfer. Freeze-all cycles need one visit; FET can be done back home." },
    ],
  },
  {
    slug: "dental-implants",
    name: "Dental implants",
    short: "Single to full-arch restoration",
    category: "Dental",
    description:
      "Titanium implants with digital guided surgery; crowns in zirconia. All-on-4/6 full-mouth rehabilitations in 5–7 days.",
    hospitalStay: "Day-care",
    surgeryTime: "30 min per implant",
    recovery: "Soft diet 7–10 days",
    allIn: { india: 0.85, thailand: 0.32, singapore: 1.6, turkey: 0.28, malaysia: 0.38 },
    savingVsPrivateIndia: "₹48,000 / implant",
    bestFor: "Missing teeth · failing bridges · full-mouth rehab",
    included: ["Implant (Nobel Biocare / Osstem)", "Abutment + zirconia crown", "3D CBCT + smile design", "Flights · hotel 5 nights · airport pickup", "10-yr implant warranty card", "Lifetime crown adjustment at any EthAum partner"],
    faqs: [
      { q: "Can I get permanent teeth in one trip?", a: "Full-arch All-on-4/6 in 5–7 days yes; single implants need a 3–4 month healing visit or a provisional now + final later." },
    ],
  },
  {
    slug: "hair-fue",
    name: "Hair transplant (FUE)",
    short: "Follicular unit extraction — 3,000–5,000 grafts",
    category: "Cosmetic",
    description:
      "Micro-FUE with sapphire blades, DHI options for hairline refinement, and unshaven FUE. Graft counts counted and disclosed per session.",
    hospitalStay: "Day-care",
    surgeryTime: "5–8 h",
    recovery: "Desk work in 3 days · shedding week 2",
    allIn: { india: 2.1, thailand: 1.1, singapore: 6.5, turkey: 0.95, malaysia: 1.5 },
    savingVsPrivateIndia: "₹1.0L",
    bestFor: "Norwood III–VI · temple recession · crown",
    included: ["3,000–5,000 grafts (counted live)", "Hairline design by surgeon", "PRP session included", "Hotel 3 nights · transfers · translator", "12-month growth reviews", "Transparent graft-count invoice"],
    faqs: [
      { q: "How many grafts do I need?", a: "Send us photos front/sides/top/crown — our team sends an indicative graft count within 48h." },
    ],
  },
  {
    slug: "gastric-sleeve",
    name: "Gastric sleeve",
    short: "Laparoscopic sleeve gastrectomy",
    category: "Bariatric",
    description:
      "Restrictive bariatric surgery with leak protocol and 6-month dietitian program. BMI ≥ 32.5 with comorbidities or ≥ 37.5 otherwise.",
    hospitalStay: "2–3 nights",
    surgeryTime: "55–75 min",
    recovery: "Drive in 10 days · full diet week 6",
    allIn: { india: 5.9, thailand: 3.4, singapore: 12.3, turkey: 2.8, malaysia: 4.4 },
    savingVsPrivateIndia: "₹2.8L",
    bestFor: "BMI ≥ 32.5 + diabetes/HTN · failed lifestyle programs",
    included: ["Bariatric surgeon + anaesthesia", "3 nights room + 2d recovery", "Leak test day 2 (mandatory)", "6-month dietitian teleconsults", "Flights · hotel · transfers", "Vitamin protocol for 12 months"],
    faqs: [
      { q: "Am I eligible?", a: "Send BMI + comorbidity profile; our coordinators and two partner surgeons confirm eligibility candidly — including telling you not to travel if surgery won't help." },
    ],
  },
  {
    slug: "cataract",
    name: "Cataract (multifocal)",
    short: "Phaco + premium IOL implantation",
    category: "Ophthalmology",
    description:
      "Day-care phaco surgery with monofocal, toric or trifocal IOLs. Femto-assisted option; same-week second-eye surgery.",
    hospitalStay: "Day-care",
    surgeryTime: "15–20 min / eye",
    recovery: "Reading next day",
    allIn: { india: 1.05, thailand: 0.48, singapore: 2.4, turkey: 0.52, malaysia: 0.6 },
    savingVsPrivateIndia: "₹55,000",
    bestFor: "Significant visual loss · glare at night · presbyopia",
    included: ["Trifocal IOL (AcrySof IQ / Clareon)", "Surgeon + anaesthesia", "3D biometry + topography", "Flights · hotel 3 nights", "Post-op drops for 6 weeks", "Day-1/7/30 follow-ups"],
    faqs: [
      { q: "Which lens should I pick?", a: "If you rarely read glasses and hate them, trifocal/extended-range; if you drive at night daily, monofocal + readers is safer. Surgeon advises after biometry." },
    ],
  },
  {
    slug: "oncology-pet-biopsy",
    name: "Oncology — PET-CT & biopsy",
    short: "Staging, biopsy and treatment planning",
    category: "Oncology",
    description:
      "PET-CT, targeted biopsy (CT/USG/bronchoscopy), MDT review and a written treatment plan — surgery, chemo, IO or watchful waiting.",
    hospitalStay: "1–2 nights",
    surgeryTime: "30–90 min biopsy",
    recovery: "Next day normal activity",
    allIn: { india: 1.15, thailand: 0.68, singapore: 2.9, turkey: 0.62, malaysia: 0.78 },
    savingVsPrivateIndia: "₹40,000",
    bestFor: "New cancer diagnosis · staging · recurrence check",
    included: ["PET-CT full body", "Image-guided biopsy + histo", "MDT board with 4 specialists", "Written plan + second opinion", "Coordinator for reports translation", "Tele-MDT after return"],
    faqs: [
      { q: "Can I get a second opinion without travelling?", a: "Yes — upload scans; the MDT reviews and replies in 7 working days. Only travel if the plan changes or biopsy is needed." },
    ],
  },
  {
    slug: "hip-replacement",
    name: "Hip replacement",
    short: "Total hip arthroplasty — anterior approach",
    category: "Orthopaedics",
    description:
      "Total hip replacement with muscle-sparing anterior approach; ceramic or dual-mobility bearings for younger patients.",
    hospitalStay: "4 nights",
    surgeryTime: "60–80 min",
    recovery: "Walk day 1 · 6 weeks to driving",
    allIn: { india: 8.1, thailand: 4.4, singapore: 15.6, turkey: 4.0, malaysia: 5.0 },
    savingVsPrivateIndia: "₹3.5L",
    bestFor: "Avascular necrosis · OA hip · fracture neck of femur",
    included: ["Anterior approach + ceramic head", "4 nights room + physio", "DVT prophylaxis", "Flights for 2 · visa · transfers", "12-week rehab plan", "Day-30/90 review"],
    faqs: [{ q: "Which approach is best?", a: "Anterior = fastest recovery, best for slim fit patients; posterior = versatile for obese/complex anatomy. Your surgeon decides after CT." }],
  },
  {
    slug: "angioplasty",
    name: "Angioplasty + stent",
    short: "Coronary angioplasty with drug-eluting stent",
    category: "Cardiac",
    description:
      "Balloon angioplasty with DES implantation; IVUS-guided optimisation at partner centres. Single and multi-vessel disease.",
    hospitalStay: "1–2 nights",
    surgeryTime: "45–90 min",
    recovery: "Back at work in 1 week",
    allIn: { india: 2.9, thailand: 1.6, singapore: 6.2, turkey: 1.4, malaysia: 1.8 },
    savingVsPrivateIndia: "₹1.2L",
    bestFor: "Single-vessel disease · stable angina · 1–2 vessel",
    included: ["DES (Xience / Resolute) — 1 stent", "IVUS guidance", "1–2 nights room", "Flights · visa letter · transfers", "Cardiac rehab at day 30", "12-month dual antiplatelet plan"],
    faqs: [{ q: "Stent vs bypass?", a: "One or two vessel disease → angioplasty; left-main or triple-vessel with diabetes → CABG. Your angiogram decides." }],
  },
  {
    slug: "bariatric-bypass",
    name: "Gastric bypass (RNY)",
    short: "Roux-en-Y gastric bypass",
    category: "Bariatric",
    description:
      "Malabsorptive-restrictive bypass for BMI ≥ 37.5 or uncontrolled diabetes with metabolic syndrome. Revisional cases considered.",
    hospitalStay: "3 nights",
    surgeryTime: "90–120 min",
    recovery: "Two weeks to desk work",
    allIn: { india: 6.8, thailand: 4.2, singapore: 13.5, turkey: 3.4, malaysia: 5.1 },
    savingVsPrivateIndia: "₹3.2L",
    bestFor: "Severe T2DM · BMI ≥ 37.5 · failed sleeve",
    included: ["RNY bypass + leak test", "3 nights + ICU standby", "12-month dietitian + labs", "Flights · hotel · transfers", "Vitamin/mineral protocol", "24/7 post-op helpline week 1"],
    faqs: [{ q: "Sleeve vs bypass?", a: "Sleeve for restriction, bypass for reflux/diabetes or very high BMI. MDT decides from your pH study and HbA1c." }],
  },
  {
    slug: "lasik",
    name: "LASIK / SMILE",
    short: "Laser vision correction",
    category: "Ophthalmology",
    description:
      "Bladeless LASIK and SMILE pro for myopia up to -10D. Femtosecond laser, iris registration. Both eyes same day.",
    hospitalStay: "Day-care",
    surgeryTime: "12 min both eyes",
    recovery: "Driving next day",
    allIn: { india: 0.95, thailand: 0.42, singapore: 2.1, turkey: 0.38, malaysia: 0.52 },
    savingVsPrivateIndia: "₹55,000",
    bestFor: "Stable refraction · -2 to -10D · no keratoconus",
    included: ["SMILE pro or bladeless LASIK", "Full corneal topography", "Airfare · hotel 2 nights", "Day-1/7/30 checks", "Enhancement free within 2 years", "Drops for 4 weeks"],
    faqs: [{ q: "LASIK vs SMILE?", a: "SMILE = smaller incision, drier-eye friendly, no flap — preferred for athletes and dry eyes. LASIK = faster visual recovery." }],
  },
];

export type Hospital = {
  slug: string;
  name: string;
  city: string;
  country: "India" | "Thailand" | "Singapore" | "Turkey" | "Malaysia" | "UAE";
  accreditations: string[];
  specialties: string[];
  languages: string[];
  rating: number;
  reviews: number;
  bestFor: string;
  flagship: string;
  priceNote: string;
  since: number;
};

export const HOSPITALS: Hospital[] = [
  { slug: "apollo-greams-road", name: "Apollo Hospitals, Greams Road", city: "Chennai", country: "India", accreditations: ["JCI", "NABH", "ISO 9001"], specialties: ["Cardiac", "Oncology", "Transplants", "Orthopaedics"], languages: ["English", "Tamil", "Hindi", "Telugu"], rating: 4.9, reviews: 2140, bestFor: "Complex cardiac · organ transplants", flagship: "CABG from ₹11.2L", priceNote: "all-in quotes incl. bypass", since: 1983 },
  { slug: "bumrungrad-international", name: "Bumrungrad International", city: "Bangkok", country: "Thailand", accreditations: ["JCI", "GACHC"], specialties: ["Cardiac", "Orthopaedics", "Fertility", "Oncology"], languages: ["English", "Thai", "Hindi", "Arabic", "Mandarin"], rating: 4.9, reviews: 1240, bestFor: "International cardiac & IVF programs", flagship: "CABG from ₹10.8L", priceNote: "all-in incl. 8 nights", since: 1980 },
  { slug: "memorial-sisli", name: "Memorial Şişli", city: "Istanbul", country: "Turkey", accreditations: ["JCI"], specialties: ["Cardiac", "Oncology", "Neuro", "Bone marrow"], languages: ["English", "Turkish", "Arabic", "Russian"], rating: 4.8, reviews: 980, bestFor: "Oncology + marrow transplants", flagship: "CABG from ₹9.6L", priceNote: "all-in · visa letter 48h", since: 2000 },
  { slug: "manipal-old-airport-road", name: "Manipal Hospital, Old Airport Road", city: "Bengaluru", country: "India", accreditations: ["NABH"], specialties: ["Orthopaedics", "Cardiac", "Oncology"], languages: ["English", "Kannada", "Hindi", "Tamil"], rating: 4.8, reviews: 1750, bestFor: "Robotic joint replacement", flagship: "TKR from ₹4.1L", priceNote: "robotic jig included", since: 1991 },
  { slug: "narayana-health-city", name: "Narayana Health City", city: "Bengaluru", country: "India", accreditations: ["NABH", "ISO 9001"], specialties: ["Cardiac", "Paediatric cardiac", "Transplants"], languages: ["English", "Hindi", "Kannada", "Telugu"], rating: 4.9, reviews: 3100, bestFor: "High-volume affordable cardiac", flagship: "CABG from ₹9.2L", priceNote: "highest CABG volume in Asia", since: 2001 },
  { slug: "sunway-medical-centre", name: "Sunway Medical Centre", city: "Kuala Lumpur", country: "Malaysia", accreditations: ["JCI", "MSQH"], specialties: ["Fertility", "Cardiac", "Oncology"], languages: ["English", "Malay", "Mandarin", "Tamil", "Hindi"], rating: 4.8, reviews: 640, bestFor: "Fertility + IVF success programs", flagship: "IVF from ₹2.6L", priceNote: "own-egg cycles under-35", since: 1999 },
  { slug: "gleneagles-singapore", name: "Gleneagles Hospital", city: "Singapore", country: "Singapore", accreditations: ["JCI", "MOH Singapore"], specialties: ["Oncology", "Cardiac", "Gastro"], languages: ["English", "Mandarin", "Malay", "Tamil"], rating: 4.7, reviews: 520, bestFor: "Complex oncology & second opinions", flagship: "Cancer MDT from ₹0.8L", priceNote: "MDT + PET included", since: 1957 },
  { slug: "acibadem-altunizade", name: "Acıbadem Altunizade", city: "Istanbul", country: "Turkey", accreditations: ["JCI"], specialties: ["Bariatric", "Cosmetic", "Neurosurgery"], languages: ["English", "Turkish", "Arabic", "German"], rating: 4.8, reviews: 1110, bestFor: "Bariatric + hair transplant circuits", flagship: "Gastric sleeve from ₹2.8L", priceNote: "all-in + 6-mo dietitian", since: 1991 },
];

export type Destination = {
  slug: string;
  name: string;
  tagline: string;
  saving: string;
  visa: string;
  flight: string;
  airports: string;
  bestFor: string;
  weather: string;
  coordinated: string;
};

export const DESTINATIONS: Destination[] = [
  { slug: "india", name: "India", tagline: "World-class scale at home prices", saving: "Baseline (30–60% vs US/UK)", visa: "e-Visa free for most ASEAN & SAARC", flight: "Delhi → Chennai · 2.5h · from ₹4,200", airports: "MAA · BLR · BOM · HYD · DEL", bestFor: "Cardiac · oncology · transplants · dental", weather: "Oct–Mar ideal for recovery", coordinated: "12 partner cities" },
  { slug: "thailand", name: "Thailand", tagline: "The medical-tourism capital", saving: "45–65% vs Singapore quotes", visa: "Visa on arrival 15–60d (India/ASEAN)", flight: "Delhi → Bangkok · 4h · from ₹9,800", airports: "BKK · DMK", bestFor: "CABG · IVF · TKR · cosmetic · dental", weather: "Nov–Feb dry season, 24–31°C", coordinated: "Bangkok + Phuket + Chiang Mai" },
  { slug: "singapore", name: "Singapore", tagline: "ASEAN's safest operating theatres", saving: "15–25% — premium clinical", visa: "Visa-free for India (e-Visa 30d)", flight: "Chennai → Singapore · 4.5h · from ₹11,500", airports: "SIN", bestFor: "Oncology MDT · rare disease · second opinions", weather: "Year-round 27–31°C, humid", coordinated: "Orchard + Bukit Timah campuses" },
  { slug: "turkey", name: "Turkey", tagline: "European standards, Turkish value", saving: "50–70% vs EU quotes", visa: "e-Visa 30d for India (apply 48h)", flight: "Delhi → Istanbul · 7h · from ₹18,400", airports: "IST · SAW", bestFor: "Bariatric · hair · marrow · cardiac", weather: "Apr–Jun & Sep–Oct best, 18–26°C", coordinated: "Istanbul + Antalya + Ankara" },
  { slug: "malaysia", name: "Malaysia", tagline: "Halal-certified, family-friendly", saving: "40–55% vs Singapore", visa: "Visa-free 30d for India", flight: "Chennai → KL · 3.5h · from ₹10,200", airports: "KUL", bestFor: "IVF · cardiac · orthopaedics · dental", weather: "Dec–Mar drier, 28–32°C", coordinated: "Kuala Lumpur + Penang" },
  { slug: "uae", name: "UAE", tagline: "Gulf luxury meets clinical rigor", saving: "10–20% — speed & comfort", visa: "Visa on arrival for India · 14d", flight: "Mumbai → Dubai · 3h · from ₹8,900", airports: "DXB · AUH", bestFor: "Complex cardiac · oncology · executive checks", weather: "Nov–Mar, 20–30°C", coordinated: "Dubai Healthcare City + Abu Dhabi" },
];

export const FAQS: { q: string; a: string; cat: string }[] = [
  { q: "Is EthAum a hospital or an agency?", a: "Neither — we are a patient-first marketplace. We coordinate; accredited hospitals treat. You always sign consent with the hospital, not with us.", cat: "General" },
  { q: "How much does EthAum charge me?", a: "Nothing. Hospitals pay us a referral fee, disclosed in every quote. Your quote is identical whether you book via us or direct — and ours is usually lower because we bundle.", cat: "Money" },
  { q: "Are partner hospitals really JCI/NABH?", a: "Yes — certificates are verified quarterly; scan any hospital's profile to see the certificate number and expiry.", cat: "Trust" },
  { q: "What does 'all-in' actually include?", a: "Procedure + anaesthesia + room nights + surgeon/implant (branded) + airport pickup + visa letter + companion stay + day-7/30/90 tele-follow-ups. Flights are added at your actual fares.", cat: "Money" },
  { q: "Can I pay in instalments?", a: "Yes — 0% EMI for 6 months or 12% reducing thereafter; or pay the hospital directly at admission; or insurance cashless where networked.", cat: "Money" },
  { q: "Do you share my medical records with hospitals?", a: "Only the hospitals you tap 'Request quote' on, only after you e-sign consent. Records are AES-256 encrypted, stored in India (DPDP) and never sold.", cat: "Privacy" },
  { q: "What if the surgery is cancelled after I travel?", a: "You get 100% of the EthAum-coordinated costs refunded, flights rebooked, and our coordinator stays with you. Hospitals owe equivalent credits.", cat: "Safety" },
  { q: "Can I travel with one companion?", a: "Yes — quotes include one companion (room + meals + transfers). Extra companions at cost; we flag this clearly.", cat: "Travel" },
  { q: "Halal / jain / gluten-free meals?", a: "All partners mark meal plans in the patient file; your coordinator confirms 48h before admission.", cat: "Travel" },
  { q: "How long is recovery before I can fly?", a: "Procedure-specific: CABG day 10–14, TKR day 7, IVF retrieval same-day, LASIK next day. Your surgeon issues the fit-to-fly.", cat: "Recovery" },
  { q: "Is there Wi-Fi / Indian SIM in the hospital?", a: "All partners: free Wi-Fi + a pre-loaded local SIM for the companion delivered at pickup.", cat: "Travel" },
  { q: "What if I need ICU beyond the quoted days?", a: "Quoted quotes include standard ICU 2d; extra days at pre-agreed capped rates (in the consent), never open-ended.", cat: "Money" },
  { q: "Can I get my reports reviewed before committing?", a: "Yes — every case gets free pre-quote review by two partner surgeons. No obligation, no payment.", cat: "General" },
  { q: "Do you help with medical visas?", a: "Yes — India e-Medical visa, Thailand on-arrival, Turkey e-Visa, Malaysia visa-free: we file, track and print everything.", cat: "Travel" },
  { q: "What languages do coordinators speak?", a: "English, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Arabic, Turkish, Thai, Mandarin and Bahasa.", cat: "General" },
  { q: "Are reviews on EthAum verified?", a: "Yes — every review is written by a patient whose treatment we coordinated; hospital and procedure are cross-checked before publishing.", cat: "Trust" },
  { q: "Can EthAum book my flights and hotel?", a: "Yes — bundled at net fares; or book yourself and just use our transfer desk. Your call.", cat: "Travel" },
  { q: "What if I'm not happy with the outcome?", a: "First: your coordinator + surgeon speak within 24h. If unresolved, EthAum's patient ombudsman reviews — we have resolved 11 disputes, 9 in patient's favour.", cat: "Safety" },
  { q: "Is my money safe paying in advance?", a: "Token ₹9,999 only — refundable within 48h, held by EthAum escrow, never by the hospital until you check in.", cat: "Money" },
  { q: "Do you cover post-return complications?", a: "90-day complication window: one tele-review + one local scan review covered; travel revision at cost, insurance accepted.", cat: "Recovery" },
  { q: "Can I donate organs through this platform?", a: "No — we do not facilitate organ donation or surrogacy in unregulated markets. Only lawful, licensed pathways in India/Thailand/Malaysia with documentation.", cat: "Ethics" },
  { q: "What about ayurveda / integrative care?", a: "We coordinate classical Panchakarma at NABH-accredited centres as adjunct, never as a replacement for indicated surgery/chemo.", cat: "General" },
  { q: "How long does quote collection take?", a: "Median 31 hours; the fastest is 4h (dental/hair). If a hospital doesn't respond in 72h we drop and add another.", cat: "General" },
  { q: "Can I request a female surgeon?", a: "Yes — flag it in your case; 60% of our partner gyn/cardiac teams can accommodate.", cat: "General" },
];

export const REVIEWS = [
  { name: "Rakesh Verma, 58", city: "Delhi", treatment: "CABG", hospital: "Bumrungrad Intl, Bangkok", rating: 5, date: "Oct 2026", text: "Itemised quotes from three hospitals in 48h. Chose Bumrungrad; EthAum handled visa, hotel, and my wife flew with me. Surgery ₹10.1L — ₹6L less than Delhi.", tag: "Verified treatment" },
  { name: "Ananya & Rahul Mehta", city: "Mumbai", treatment: "IVF (own eggs)", hospital: "Sunway Medical, KL", rating: 5, date: "Sep 2026", text: "No sales pressure, just clarity. The AI checklist told us exactly which reports to upload; four centres compared on success rates. Transfer confirmed after one cycle.", tag: "Verified treatment" },
  { name: "Zainab Sheikh, 46", city: "Lucknow", treatment: "Kidney stone laser", hospital: "Memorial Şişli, Istanbul", rating: 5, date: "Oct 2026", text: "Tele-consults at day 7 and 30, medicines reminders, WhatsApp check-ins. Nobody else does this. Stones gone, total ₹1.6L all-in.", tag: "Verified treatment" },
  { name: "Harpreet Singh, 61", city: "Chandigarh", treatment: "Total knee (robotic)", hospital: "Manipal, Bengaluru", rating: 4, date: "Aug 2026", text: "Robotic TKR, walked day 1. Price matched the quote to the rupee. Deducting one star because city traffic from airport was 90 minutes.", tag: "Verified treatment" },
  { name: "Meena Iyer, 39", city: "Chennai", treatment: "Cataract (trifocal)", hospital: "Apollo, Chennai", rating: 5, date: "Jul 2026", text: "Surgery free on corporate insurance; only hotel + flights paid. Both eyes in 10 days, reading without glasses.", tag: "Verified treatment" },
  { name: "Faraz Hussain, 33", city: "Hyderabad", treatment: "FUE hair · 4,200 grafts", hospital: "Acıbadem, Istanbul", rating: 5, date: "Sep 2026", text: "Counted grafts live on a counter screen. 14 months later — none of my friends believe it wasn't natural. EthAum's graft-count invoice sealed the trust.", tag: "Verified treatment" },
];

export const LEADS = [
  { id: "L-2481", patient: "Priya Raghavan, 54", from: "Chennai", treatment: "CABG · 3-vessel", budget: "₹12.0L", match: 94, status: "quote-requested" as const, age: "2h", urgent: true },
  { id: "L-2480", patient: "Ahmed Khan, 47", from: "Mumbai", treatment: "Gastric sleeve", budget: "₹4.5L", match: 88, status: "matched" as const, age: "5h", urgent: false },
  { id: "L-2479", patient: "Meera Nambiar, 61", from: "Bengaluru", treatment: "Total knee (bilateral)", budget: "₹9.0L", match: 91, status: "records-pending" as const, age: "9h", urgent: true },
  { id: "L-2478", patient: "Vikram Malhotra, 35", from: "Delhi", treatment: "FUE · 3,800 grafts", budget: "₹2.2L", match: 96, status: "consult-booked" as const, age: "1d", urgent: false },
  { id: "L-2477", patient: "Kavya Reddy, 29", from: "Hyderabad", treatment: "IVF · own eggs", budget: "₹3.0L", match: 83, status: "matched" as const, age: "1d", urgent: false },
  { id: "L-2476", patient: "Sanjay Kulkarni, 58", from: "Pune", treatment: "Oncology PET + MDT", budget: "₹1.5L", match: 79, status: "records-pending" as const, age: "2d", urgent: true },
];

export const QUOTES = [
  { hospital: "Bumrungrad Intl, Bangkok", total: 1080000, breakdown: [["CABG (surgeon + anaesthesia)", 720000], ["Room 8n + ICU 2d", 135000], ["Implants (grafts)", 95000], ["Flights (2 pax)", 62000], ["Hotel 6n companion", 48000], ["Visa letter + transfers", 15000], ["Tele-follow-ups", 0]], tags: ["4.9★ · 1,240", "ICU in 6 days · Hindi team", "Best value · your priorities"], accent: "best" as const },
  { hospital: "Memorial Şişli, Istanbul", total: 960000, breakdown: [["CABG (surgeon + anaesthesia)", 610000], ["Room 7n + ICU 2d", 128000], ["Implants", 88000], ["Flights", 84000], ["Hotel 5n", 38000], ["Visa + transfers", 12000], ["Tele-follow-ups", 0]], tags: ["4.8★ · 980", "Lowest all-in", "Turkish + Arabic team"], accent: "budget" as const },
  { hospital: "Apollo Greams Road, Chennai", total: 1120000, breakdown: [["CABG", 760000], ["Room 8n + ICU 2d", 150000], ["Implants", 98000], ["Domestic flights", 24000], ["Hotel 6n", 36000], ["Transfers", 8000], ["Tele-follow-ups", 0]], tags: ["4.9★ · 2,140", "No international travel", "Zero visa hassle"], accent: "comfort" as const },
];

export const NOTIFICATIONS = [
  { id: 1, t: "Bumrungrad approved your CABG quote", d: "₹10.8L all-in locked for 30 days. Tap to compare with Memorial & Apollo.", time: "12 min ago", kind: "quote" as const },
  { id: 2, t: "Dr. Meera Krishnan added a pre-op note", d: "“Continue aspirin 75mg; stop metformin 48h before surgery.”", time: "1 h ago", kind: "consult" as const },
  { id: 3, t: "Visa letter ready — Thai Embassy e-Visa", d: "Your invitation letter (ID-BKK-24-00981) is attached. Print 2 copies.", time: "3 h ago", kind: "travel" as const },
  { id: 4, t: "Lab report parsed: HbA1c 6.4%", d: "AI organised it under “Endocrine — diabetes”. Surgeon notified.", time: "Yesterday", kind: "record" as const },
  { id: 5, t: "Physiotherapy plan for day 7–30 is ready", d: "12 exercises, Hindi audio, 3×/week. Start after wound check.", time: "Yesterday", kind: "aftercare" as const },
  { id: 6, t: "Refill reminder: Clopidogrel 75mg", d: "28 tablets left — reorder or set up delivery at Chennai pickup.", time: "2 days ago", kind: "med" as const },
];

export type Doctor = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  expYears: number;
  education: string[];
  languages: string[];
  hospitalSlug: string;
  hospital: string;
  city: string;
  rating: number;
  reviews: number;
  procedures: string[];
  bio: string;
  photo?: string;
  nextSlot: string;
};

export const DOCTORS: Doctor[] = [
  { slug: "meera-krishnan", name: "Dr. Meera Krishnan", role: "Consultant Cardiothoracic Surgeon", specialty: "Cardiac", expYears: 17, education: ["MBBS — AIIMS Delhi", "MS (General Surgery) — Madras Medical College", "MCh Cardiothoracic — Sree Chitra Tirunal"], languages: ["English", "Hindi", "Tamil"], hospitalSlug: "bumrungrad-international", hospital: "Bumrungrad International", city: "Bangkok", rating: 4.9, reviews: 1240, procedures: ["Off-pump CABG", "Valve repair (mitral)", "Minimally invasive direct CABG"], bio: "2,300+ bypasses across two continents; leads Bumrungrad's off-pump program. Insists on walking patients through their own angiogram before consent — 'a patient who understands the map never fears the road.'", photo: "/img/dr-krishnan.jpg", nextSlot: "Tue 9:30 IST (video)" },
  { slug: "ananya-iyer", name: "Dr. Ananya Iyer", role: "Director, IVF & Reproductive Medicine", specialty: "Fertility", expYears: 13, education: ["MBBS — Stanley Medical College", "MD Obstetrics & Gynaecology — JIPMER", "Fellowship Reproductive Endocrinology — NUS"], languages: ["English", "Hindi", "Tamil", "Telugu"], hospitalSlug: "bumrungrad-international", hospital: "Bumrungrad International", city: "Bangkok", rating: 4.9, reviews: 860, procedures: ["IVF / ICSI", "PGT-A embryo testing", "Donor programs"], bio: "Pioneered own-egg IVF for PCOS at age 31; publishes per-age success honestly — no cherry-picked stats. 61% own-egg success under-35 across 1,400 cycles.", photo: "/img/dr-anya.jpg", nextSlot: "Mon 18:00 IST (video)" },
  { slug: "arjun-mehta", name: "Dr. Arjun Mehta", role: "Senior Orthopaedic Surgeon", specialty: "Orthopaedics", expYears: 15, education: ["MBBS — GMC Nagpur", "MS Orthopaedics — KEM Mumbai", "Fellowship Robotic Arthroplasty — Zimmer Biomet, Warsaw"], languages: ["English", "Hindi", "Marathi", "Tamil"], hospitalSlug: "apollo-greams-road", hospital: "Apollo Hospitals, Greams Road", city: "Chennai", rating: 4.8, reviews: 1750, procedures: ["Robotic total knee (TKR)", "Partial knee (UKR)", "Revision hip"], bio: "4,100 joint replacements; early-adopter of robotic alignment in 2016. Tracks every patient at 1, 5 and 10 years — revision rate 2.1% at 8-year follow-up.", photo: "/img/dr-arjun.jpg", nextSlot: "Wed 11:00 IST (in-clinic)" },
  { slug: "rajesh-menon", name: "Dr. Rajesh Menon", role: "Senior Consultant, Paediatric & Adult Cardiac Surgery", specialty: "Cardiac", expYears: 19, education: ["MBBS — Kasturba Medical College", "MCh Cardiothoracic — Narayana Health", "Fellowship Cardiac Transplant — Harefield, London"], languages: ["English", "Hindi", "Malayalam", "Kannada"], hospitalSlug: "narayana-health-city", hospital: "Narayana Health City", city: "Bengaluru", rating: 4.9, reviews: 3100, procedures: ["CABG (beating-heart)", "Heart transplant", "Congenital corrections"], bio: "Highest-volume CABG surgeon in Asia; 6,000+ procedures. Runs Narayana's humanitarian fund for economically weaker patients — 14% of his list is subsidised or free.", nextSlot: "Thu 15:30 IST (in-clinic)" },
  { slug: "farah-dsouza", name: "Dr. Farah D'Souza", role: "Head, Oncology — Medical & MDT Lead", specialty: "Oncology", expYears: 14, education: ["MBBS — St. John's Bengaluru", "MD Radiation Oncology — Tata Memorial", "Fellowship Immuno-oncology — Dana-Farber"], languages: ["English", "Hindi", "Konkani", "Portuguese"], hospitalSlug: "gleneagles-singapore", hospital: "Gleneagles Hospital", city: "Singapore", rating: 4.7, reviews: 520, procedures: ["Tumour MDT", "Immunotherapy planning", "Precision biopsy pathways"], bio: "Leads weekly molecular tumour boards; matches 30% of patients to trials. Blunt about when NOT to treat — 'doing nothing, well, is sometimes the best medicine.'", nextSlot: "Fri 10:00 IST (video)" },
  { slug: "vikram-arora", name: "Dr. Vikram Arora", role: "Consultant Bariatric & Metabolic Surgeon", specialty: "Bariatric", expYears: 11, education: ["MBBS — AFMC Pune", "MS General Surgery — PGIMER Chandigarh", "Fellowship Minimal Access — Acıbadem, Istanbul"], languages: ["English", "Hindi", "Punjabi"], hospitalSlug: "acibadem-altunizade", hospital: "Acıbadem Altunizade", city: "Istanbul", rating: 4.8, reviews: 1110, procedures: ["Gastric sleeve (LSG)", "Roux-en-Y bypass", "Revisional bariatric"], bio: "3,400+ metabolic surgeries; 78% of diabetic patients off insulin at 12 months. Refuses surgery without a supervised 3-month lifestyle trial — relapse is his enemy, not yours.", nextSlot: "Mon–Sat (in-clinic)" },
];

export const STAGES = [
  { n: 1, name: "Discover", hint: "Browse 240 treatments across 6 countries", state: "done" as const },
  { n: 2, name: "Create case", hint: "Cardiac — triple-vessel CABG", state: "done" as const },
  { n: 3, name: "Upload records", hint: "14 reports · AI organised · HbA1c flagged", state: "done" as const },
  { n: 4, name: "Qualification", hint: "Eligible — surgeon review cleared", state: "done" as const },
  { n: 5, name: "Provider matching", hint: "3 matches · best: Bumrungrad 94", state: "done" as const },
  { n: 6, name: "Quote comparison", hint: "3 all-in quotes · save ₹6.4L", state: "done" as const },
  { n: 7, name: "Select provider", hint: "Bumrungrad · CABG · ₹10.8L locked", state: "done" as const },
  { n: 8, name: "Booking & payment", hint: "Token paid · EMI ₹18,400/mo · flights held", state: "active" as const },
  { n: 9, name: "Virtual consultation", hint: "Tue 9:30 IST · Dr. Meera · Hindi + English", state: "upcoming" as const },
  { n: 10, name: "Treatment", hint: "12 Nov · pickup 7:30 · companion Meena", state: "upcoming" as const },
  { n: 11, name: "Aftercare", hint: "Day 7/30/90 tele-reviews + physio plan", state: "upcoming" as const },
  { n: 12, name: "Review & referral", hint: "Share your story · ₹5,000 credit", state: "upcoming" as const },
];
