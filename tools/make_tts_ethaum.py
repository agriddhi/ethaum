#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the EthAum hackathon demo voiceover (under 5 minutes) with Edge neural voices.

Measured calibration for this script: edge-tts reads ~133 wpm at +6% rate, so
~630 spoken words lands at 4:45 (plus an 8-second end card = 4:53 total).

Usage:
    pip install edge-tts
    python make_tts_ethaum.py            # writes ETHAUM_voice_prabhat.mp3 + ETHAUM_voice_neerja.mp3
    python make_tts_ethaum.py --test     # writes a 20-second sample first
    python make_tts_ethaum.py --txt      # also writes ETHAUM_narration.txt for other TTS tools

Shot list (what to show while each block speaks) lives in
ethaum/docs/VIDEO_SHOTLIST.md - the TIMING comments below map 1:1 to it.
"""

import asyncio
import os
import sys

import edge_tts

# ---------------------------------------------------------------------------
# TIMING 0:00-0:30 - HOOK
# SHOW: blurred listings/prices montage -> hard cut to the EthAum logo
# ---------------------------------------------------------------------------
BLOCK_HOOK = """When my uncle needed a bypass, it took eleven phone calls, forty thousand rupees in agent fees, and we never knew if the quote was honest. International healthcare is not broken because the medicine is bad. It is broken because the journey is fragmented. Finding a hospital is hard. Comparing real costs is harder. Aftercare is hardest. EthAum fixes all three, in one place."""

# ---------------------------------------------------------------------------
# TIMING 0:30-0:55 - WHAT ETHAUM IS
# SHOW: homepage hero -> click persona switcher -> hero rewrites to 94 - Bumrungrad
# ---------------------------------------------------------------------------
BLOCK_WHAT = """So imagine one marketplace for international care, built on one idea: the patient should never chase anyone. Discover, create a case, upload records, get matched, compare quotes, book, consult, travel, recover. Twelve stages, one owner, one record. On the other side, the same platform is a hospital's portal, so both sides finally talk to each other."""

# ---------------------------------------------------------------------------
# TIMING 0:55-1:22 - CASE, RECORDS, QUALIFICATION
# SHOW: /case/new wizard - step 1, step 2 upload with AI chips landing,
#       step 3 sliders, then the qualification screen -> readiness ring -> AI note
# ---------------------------------------------------------------------------
BLOCK_CASE = """Here is Priya. Fifty-four, Chennai, triple-vessel disease. In ten minutes: her condition, budget, companion, languages, and what matters most, cost, outcomes or speed. She uploads fourteen reports; our AI classifies each one and tells her what is still missing for a bypass. Two partner surgeons then review the file, free. Note the boundary: the AI organises and flags, doctors decide. And if the honest answer is that she should optimise first, the screen says so."""

# ---------------------------------------------------------------------------
# TIMING 1:22-1:50 - MATCHING
# SHOW: /matches - click Cheapest first so cards reorder, then open a card to show
#       the why-it-fits bullets and the amber what-could-go-wrong flags
# ---------------------------------------------------------------------------
BLOCK_MATCH = """Matching shows her three best fits, and shows the working. Clinical fit, accreditation, budget fit, wait time, language, reviews, re-weighted by her own sliders. Care about speed, Thailand moves up. Care about outcomes, the high-volume centres move up. Every card says why it fits, and in amber, what could go wrong. A hospital that only tells you the good things is a brochure, not a match."""

# ---------------------------------------------------------------------------
# TIMING 1:50-2:18 - QUOTES
# SHOW: /quotes/compare - three itemised quotes, the AI audit strip, then
#       Print / save PDF producing the one-page quote sheet
# ---------------------------------------------------------------------------
BLOCK_QUOTES = """Then the quotes, where the industry goes quiet. Every quote is all-in and itemised: procedure, anaesthesia, room nights, implant brands, an ICU cap per day, flights, visa, companion stay, ninety days of follow-ups. Our AI flags the one priced eleven percent below market, so she knows what to demand in writing before she flies. She can print it and take it to her own cardiologist."""

# ---------------------------------------------------------------------------
# TIMING 2:18-2:55 - THE TWO-SIDED MARKETPLACE (slow down here)
# SHOW: SPLIT SCREEN - left tab /provider/quote-builder fills the implant brand,
#       checks turn green, send; right tab /quotes/compare shows the live card,
#       then hold, then confirm, then back to the portal: accepted by the patient
# ---------------------------------------------------------------------------
BLOCK_TWO_SIDED = """Now the part nobody else has. Watch two tabs at once. On the left, the hospital's portal. Their quote builder refuses to send until three transparency checks pass: implant brand, price ceiling, ICU cap. We send it, and on the right, live, it arrives in Priya's browser. She holds it, locking the price for thirty days, then confirms. Back in the portal, the lead reads: accepted by the patient. One event, both sides, instantly. A marketplace, not two demos side by side."""

# ---------------------------------------------------------------------------
# TIMING 2:55-3:20 - BOOKING, CONSULT, TREATMENT
# SHOW: /booking itinerary + EMI slider + token, then /consult with the AI brief
#       and the call mock, then /treatment day-by-day plan
# ---------------------------------------------------------------------------
BLOCK_TREATMENT = """Booking builds the whole trip: visa letter, flights held, hotel near the hospital, instalments, a refundable token in escrow. Then a pre-op call where the surgeon has read her file and her questions are ready. Inside the hospital: a day-by-day plan, who owns each day, what is billed, and who she calls at three in the morning. Not a visitor in a foreign corridor, a patient with a schedule."""

# ---------------------------------------------------------------------------
# TIMING 3:20-3:44 - AFTERCARE
# SHOW: /aftercare - day 7/30/90 plan, medicine toggles, recovery buddy, red flags
# ---------------------------------------------------------------------------
BLOCK_AFTERCARE = """And then, where every other platform stops: aftercare, the part that actually protects her. Day seven, day thirty, day ninety. Wound checks, cardiac rehab, physio she repeats at home, refills to her door, a nurse who calls at seven in the morning, and a red-flag panel for when to pick up the phone. She can book a care buddy, a verified patient who made the same journey."""

# ---------------------------------------------------------------------------
# TIMING 3:44-4:10 - RESEARCH + BUILD
# SHOW: /market-research matrix and transparency bars, then a fast route sweep
# ---------------------------------------------------------------------------
BLOCK_RESEARCH = """We did not guess. We benchmarked fourteen platforms across sixty attributes and documented what we adapt, improve and refuse: pay-to-rank, hotel kickbacks, fear marketing, silence after discharge. This is a working build. Thirty routes, Next dot J S, TypeScript, an AI engine that upgrades from rules to a live model with one API key, and a marketplace where the hospital's quote and the patient's decision are the same event."""

# ---------------------------------------------------------------------------
# TIMING 4:10-4:25 - CLOSE
# SHOW: end card - logo, tagline, team names and LinkedIn, disclaimer
# ---------------------------------------------------------------------------
BLOCK_CLOSE = """No database, so it runs in one command, and not a single phone number anywhere, because dialling a stranger is not a feature. EthAum. Heal better, everywhere."""

BLOCKS = [
    BLOCK_HOOK,
    BLOCK_WHAT,
    BLOCK_CASE,
    BLOCK_MATCH,
    BLOCK_QUOTES,
    BLOCK_TWO_SIDED,
    BLOCK_TREATMENT,
    BLOCK_AFTERCARE,
    BLOCK_RESEARCH,
    BLOCK_CLOSE,
]

TEXT = "\n\n".join(BLOCKS)


async def gen(voice: str, out: str, rate: str, body: str = TEXT) -> None:
    tts = edge_tts.Communicate(body, voice, rate=rate)
    await tts.save(out)
    print("wrote", out, "at rate", rate)


async def gen_sample(voice: str, out: str, rate: str) -> None:
    sample = " ".join(BLOCK_HOOK.split()[:60])
    tts = edge_tts.Communicate(sample, voice, rate=rate)
    await tts.save(out)
    print("wrote sample", out, "at rate", rate)


def report_duration(path: str) -> None:
    """Report the real MP3 duration (edge-tts writes 48kbps CBR, so size works)."""
    import struct
    MPEG2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
    MPEG1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
    SR = {3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000]}
    size = os.path.getsize(path)
    with open(path, "rb") as f:
        data = f.read(300000)
    for i in range(len(data) - 4):
        if data[i] == 0xFF and (data[i + 1] & 0xE0) == 0xE0:
            h = struct.unpack(">I", data[i:i + 4])[0]
            ver_bits, layer_bits = (h >> 19) & 0x3, (h >> 17) & 0x3
            br_index, sr_index = (h >> 12) & 0xF, (h >> 10) & 0x3
            if layer_bits == 1 and br_index not in (0, 15) and sr_index != 3 and ver_bits != 1:
                table = MPEG1_L3 if ver_bits == 3 else MPEG2_L3
                bitrate = table[br_index] * 1000
                secs = size * 8 / bitrate
                print(f"    duration: {int(secs//60)}:{int(secs%60):02d}  ({bitrate//1000}kbps)")
                return


async def main() -> None:
    words = len(TEXT.split())
    print(f"spoken words: {words}")
    if "--txt" in sys.argv:
        with open("ETHAUM_narration.txt", "w", encoding="utf-8") as f:
            f.write(TEXT)
        print("wrote ETHAUM_narration.txt")
    if "--test" in sys.argv:
        await gen_sample("en-IN-PrabhatNeural", "ETHAUM_sample_prabhat.mp3", "+6%")
        await gen_sample("en-IN-NeerjaNeural", "ETHAUM_sample_neerja.mp3", "+4%")
        return
    # EthAum voiceover is calm and explanatory: slightly faster than a reading
    # pace so the whole story lands inside the 5-minute cap with room for the
    # end card (measured: +10% -> 4:44, +8% -> 4:40).
    await gen("en-IN-PrabhatNeural", "ETHAUM_voice_prabhat.mp3", "+10%")
    report_duration("ETHAUM_voice_prabhat.mp3")
    await gen("en-IN-NeerjaNeural", "ETHAUM_voice_neerja.mp3", "+8%")
    report_duration("ETHAUM_voice_neerja.mp3")


asyncio.run(main())
