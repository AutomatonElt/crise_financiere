"""
keeper.py -- collapse voice-over retakes and dead air into a clean final cut.

The problem this solves: a narrator records a script straight through, flubs lines,
and re-reads them. Sometimes they re-read one sentence; sometimes they say "okay,
let's restart" and go back several paragraphs. The last attempt at any given passage
is the good one. Everything before it, plus the chatter between takes, plus the long
dead air, has to go.

Architecture (see ../SKILL.md for the research behind each choice):

  1. Parse the reference script into a flat word stream, remembering which sentence
     each word came from.
  2. Transcribe the recording with faster-whisper at word-level timestamps.
  3. Group words into utterances, splitting wherever the narrator pauses longer than
     --utterance-gap. One utterance == one continuous run of speech.
  4. LOCATE each utterance in the reference word stream by longest-common-subsequence
     (difflib), producing a reference span [ref_start, ref_end) and a match score.
     This is the key departure from naive sentence matching: real utterances straddle
     sentence boundaries, and a script sentence is often delivered across two breaths.
     Matching against a span of the reference rather than a single sentence is what
     makes alignment survive real narration.
  5. ROLLBACK in time order. When a new utterance's reference span starts at or before
     an already-kept utterance's span, the narrator has gone back -- that is a retake.
     Drop every kept utterance from that point forward and keep the new one. This is
     the offline equivalent of punch-and-roll: last take wins, at any rollback depth,
     including a restart from the very top.
  6. TRIM overlaps so a partial re-read does not replay the words the next take repeats,
     then render: word-boundary cuts with a small pad, a fixed pause between kept runs,
     and short fades on every edit to avoid clicks.

Outputs: the final cut WAV, the raw transcript (json + txt), an EDL of kept spans, and
an edit report naming every keep, every discarded retake, and every low-confidence
decision that a human should spot-check.
"""

import argparse
import difflib
import json
import re
import time
import wave
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np


# ---------------------------------------------------------------------------
# 1. Reference script parsing
# ---------------------------------------------------------------------------

BOLD_RE = re.compile(r"\*\*(.*?)\*\*")
BRACKET_RE = re.compile(r"\[[^\]]*\]")
PAREN_NOTE_RE = re.compile(r"^\s*\(.*\)\s*$")
WS_RE = re.compile(r"\s+")
SENTENCE_SPLIT_RE = re.compile(r'(?<=[.!?])\s+(?=[A-Z"“‘\'])')
DASH_LINE_RE = re.compile(r"^-{3,}$")
SECTION_RE = re.compile(r"^(SCRIPT|OPENING[ ,].*|PRE-TITLE CARD.*)$", re.IGNORECASE)
NORMALIZE_RE = re.compile(r"[^a-z0-9' ]")

# Spoken-form expansions so the reference matches what a narrator actually says.
NUMBER_WORDS = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
    "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
    "11": "eleven", "12": "twelve", "13": "thirteen", "14": "fourteen",
    "15": "fifteen", "16": "sixteen", "17": "seventeen", "18": "eighteen",
    "19": "nineteen", "20": "twenty", "23": "twenty three", "47": "forty seven",
    "50": "fifty", "52": "fifty two", "79": "seventy nine", "80": "eighty",
}


def clean_fragment(text: str) -> str:
    text = BOLD_RE.sub(r"\1", text)
    text = BRACKET_RE.sub(" ", text)
    return WS_RE.sub(" ", text).strip()


def parse_reference_script(path: Path) -> list[str]:
    """Return the ordered spoken sentences of a vo-only-export markdown file.

    Everything that could plausibly be read aloud is kept, including the pre-title
    card -- narrators often read on-screen text as a guide take, and an unmatched
    extra reference line is harmless while a missing one breaks alignment. Dropped:
    the markdown title, horizontal rules, section markers, bracketed stage
    directions, whole-line parenthetical notes, and everything from the
    "in pinned comment" block onward (never spoken).
    """
    lines = path.read_text(encoding="utf-8").splitlines()

    paragraphs: list[str] = []
    current: list[str] = []

    def flush():
        if current:
            paragraphs.append(" ".join(current))
            current.clear()

    for line in lines:
        s = line.strip()
        if not s:
            flush()
            continue
        if s.lower().startswith("in pinned comment"):
            break
        if s.startswith("#") or DASH_LINE_RE.match(s) or SECTION_RE.match(s):
            flush()
            continue
        if PAREN_NOTE_RE.match(s):
            continue
        if s.startswith("**") and s.endswith("**") and s.strip("*").isupper():
            continue
        current.append(s)
    flush()

    sentences: list[str] = []
    for para in paragraphs:
        cleaned = clean_fragment(para)
        if not cleaned:
            continue
        for piece in SENTENCE_SPLIT_RE.split(cleaned):
            piece = piece.strip()
            if piece:
                sentences.append(piece)
    return sentences


def normalize_words(text: str) -> list[str]:
    text = text.lower().replace("$", " dollars ").replace("%", " percent ")
    text = NORMALIZE_RE.sub(" ", text)
    out: list[str] = []
    for tok in text.split():
        if tok.isdigit() and tok in NUMBER_WORDS:
            out.extend(NUMBER_WORDS[tok].split())
        else:
            out.append(tok)
    return out


# ---------------------------------------------------------------------------
# 2. Transcription
# ---------------------------------------------------------------------------

@dataclass
class Word:
    text: str
    start: float
    end: float
    prob: float


def detect_speech_runs(audio, sr, split_silence, min_speech, drop_db):
    """Find silence-separated runs of speech directly from the waveform.

    This runs BEFORE any ASR, and that ordering is the whole point. Whisper's language
    model silently de-duplicates immediate repetitions: four consecutive takes of the
    same sentence come back as one, and forced alignment then smears those few words
    across every take (observed: a single "McLennan's" spanning 4.85 seconds). No cutter
    can remove a repeat the transcript does not contain. Splitting on silence first
    guarantees each take is a separate ASR call, so repeats survive into the transcript
    where they can be compared and dropped.
    """
    frame = int(0.02 * sr)
    n = len(audio) // frame
    if n == 0:
        return []
    rms = np.sqrt(np.maximum(
        (audio[:n * frame].astype(np.float32) ** 2).reshape(n, frame).mean(axis=1), 1e-20))
    db = 20 * np.log10(rms)

    peak = float(np.percentile(db, 95))
    floor = float(np.percentile(db, 10))
    thr = max(peak - drop_db, floor + 8.0)

    speech = db > thr
    runs: list[list[float]] = []
    i = 0
    while i < n:
        if speech[i]:
            j = i
            while j < n and speech[j]:
                j += 1
            runs.append([i * 0.02, j * 0.02])
            i = j
        else:
            i += 1

    merged: list[list[float]] = []
    for r in runs:
        if merged and r[0] - merged[-1][1] < split_silence:
            merged[-1][1] = r[1]
        else:
            merged.append(r)

    return [(a, b) for a, b in merged if (b - a) >= min_speech]


def transcribe_chunked(audio_path, model_size, device, compute_type, language,
                       batch_size, split_silence, min_speech, drop_db, pad):
    """Transcribe each silence-separated take on its own, then align once."""
    import whisperx

    sr = 16000
    audio = whisperx.load_audio(str(audio_path))
    runs = detect_speech_runs(audio, sr, split_silence, min_speech, drop_db)
    print(f"[keeper] {len(runs)} silence-separated speech runs "
          f"(split at >={split_silence}s of silence)", flush=True)

    print(f"[keeper] loading {model_size} ({device}/{compute_type}) ...", flush=True)
    model = whisperx.load_model(model_size, device, compute_type=compute_type, language=language)

    t0 = time.time()
    segments: list[dict] = []
    for k, (a, b) in enumerate(runs):
        s = max(0.0, a - pad)
        e = min(len(audio) / sr, b + pad)
        clip = audio[int(s * sr):int(e * sr)]
        if len(clip) < int(0.15 * sr):
            continue
        try:
            r = model.transcribe(clip, batch_size=batch_size, language=language)
        except Exception:
            continue
        text = " ".join(seg.get("text", "").strip() for seg in r.get("segments", [])).strip()
        if text:
            segments.append({"start": a, "end": b, "text": text})
        if (k + 1) % 50 == 0:
            print(f"[keeper]   ... {k+1}/{len(runs)} runs ({a:7.1f}s) "
                  f"[{time.time()-t0:.0f}s]", flush=True)

    print(f"[keeper] per-take ASR done in {time.time()-t0:.0f}s; aligning ...", flush=True)

    align_model, metadata = whisperx.load_align_model(language_code=language, device=device)
    aligned = whisperx.align(segments, align_model, metadata, audio, device,
                             return_char_alignments=False)

    words: list[Word] = []
    raw_segments: list[dict] = []
    for seg in aligned["segments"]:
        kept_w = [
            Word(str(w.get("word", "")).strip(), float(w["start"]), float(w["end"]),
                 float(w.get("score", 1.0)))
            for w in (seg.get("words") or [])
            if "start" in w and "end" in w
        ]
        words.extend(kept_w)
        if kept_w:
            raw_segments.append({"start": kept_w[0].start, "end": kept_w[-1].end,
                                 "text": " ".join(x.text for x in kept_w)})

    words.sort(key=lambda w: w.start)
    dur = len(audio) / sr
    print(f"[keeper] {len(words)} aligned words, {len(raw_segments)} segments "
          f"({time.time()-t0:.0f}s wall, {dur:.0f}s audio)", flush=True)
    return words, raw_segments, dur


def transcribe_whisperx(audio_path, model_size, device, compute_type, language, batch_size):
    """WhisperX: whisper transcription + wav2vec2 forced alignment.

    Preferred backend. Forced alignment puts word boundaries on the actual phoneme
    onsets rather than whisper's decoder-estimated timings, which is what makes a
    word-boundary cut land cleanly instead of clipping a consonant.
    """
    import whisperx

    print(f"[keeper] whisperx: loading {model_size} ({device}/{compute_type}) ...", flush=True)
    model = whisperx.load_model(model_size, device, compute_type=compute_type, language=language)

    print(f"[keeper] whisperx: transcribing {audio_path.name} ...", flush=True)
    t0 = time.time()
    audio = whisperx.load_audio(str(audio_path))
    result = model.transcribe(audio, batch_size=batch_size, language=language)
    print(f"[keeper] whisperx: {len(result['segments'])} segments in {time.time()-t0:.0f}s; aligning ...", flush=True)

    align_model, metadata = whisperx.load_align_model(language_code=language, device=device)
    aligned = whisperx.align(
        result["segments"], align_model, metadata, audio, device,
        return_char_alignments=False,
    )

    words: list[Word] = []
    raw_segments: list[dict] = []
    for seg in aligned["segments"]:
        seg_words = seg.get("words") or []
        kept_w = []
        for w in seg_words:
            # Alignment can fail on numerals/symbols; inherit neighbouring timing.
            if "start" not in w or "end" not in w:
                continue
            kept_w.append(Word(str(w.get("word", "")).strip(),
                               float(w["start"]), float(w["end"]),
                               float(w.get("score", 1.0))))
        words.extend(kept_w)
        if kept_w:
            raw_segments.append({
                "start": kept_w[0].start,
                "end": kept_w[-1].end,
                "text": " ".join(x.text for x in kept_w),
            })

    dur = len(audio) / 16000.0
    print(f"[keeper] whisperx: {len(words)} aligned words, {len(raw_segments)} segments "
          f"({time.time()-t0:.0f}s wall, {dur:.0f}s audio)", flush=True)
    return words, raw_segments, dur


def transcribe(audio_path, model_size, device, compute_type, language, vad_min_silence_ms):
    from faster_whisper import WhisperModel

    print(f"[keeper] loading model {model_size} ({device}/{compute_type}) ...", flush=True)
    model = WhisperModel(model_size, device=device, compute_type=compute_type)

    print(f"[keeper] transcribing {audio_path.name} ...", flush=True)
    t0 = time.time()
    segments, info = model.transcribe(
        str(audio_path),
        language=language,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=vad_min_silence_ms),
        condition_on_previous_text=False,
        beam_size=5,
    )

    words: list[Word] = []
    raw_segments: list[dict] = []
    n = 0
    for seg in segments:
        n += 1
        raw_segments.append({"start": seg.start, "end": seg.end, "text": seg.text.strip()})
        for w in (seg.words or []):
            words.append(Word(w.word.strip(), w.start, w.end, w.probability))
        if n % 25 == 0:
            print(f"[keeper]   ... {seg.end:8.1f}s / {info.duration:.0f}s", flush=True)

    print(
        f"[keeper] transcribed {len(words)} words in {n} segments "
        f"({time.time()-t0:.0f}s wall, {info.duration:.0f}s audio)",
        flush=True,
    )
    return words, raw_segments, info.duration


# ---------------------------------------------------------------------------
# 3. Utterance grouping
# ---------------------------------------------------------------------------

@dataclass
class Utterance:
    words: list[Word]
    norm: list[str] = field(default_factory=list)
    src_index: list[int] = field(default_factory=list)  # norm token -> Word index

    def __post_init__(self):
        for i, w in enumerate(self.words):
            for tok in normalize_words(w.text):
                self.norm.append(tok)
                self.src_index.append(i)

    @property
    def start(self) -> float:
        return self.words[0].start

    @property
    def end(self) -> float:
        return self.words[-1].end

    @property
    def text(self) -> str:
        return " ".join(w.text for w in self.words)


def group_utterances(words: list[Word], gap_s: float) -> list[Utterance]:
    out: list[Utterance] = []
    cur: list[Word] = []
    for w in words:
        if cur and (w.start - cur[-1].end) >= gap_s:
            out.append(Utterance(cur))
            cur = []
        cur.append(w)
    if cur:
        out.append(Utterance(cur))
    return [u for u in out if u.norm]


# ---------------------------------------------------------------------------
# 4. Locate each utterance in the reference word stream
# ---------------------------------------------------------------------------

@dataclass
class Located:
    utt: Utterance
    ref_start: int
    ref_end: int
    score: float
    pairs: list[tuple[int, int]]  # (ref_index, utt_norm_index) for matched tokens

    def utt_word_at_or_after_ref(self, ref_pos: int) -> int | None:
        """Index into utt.words of the first spoken word aligned at/after ref_pos."""
        for r, u in self.pairs:
            if r >= ref_pos:
                return self.utt.src_index[u]
        return None


def locate(utt: Utterance, ref_norm: list[str], min_block: int,
           span_slack: float = 1.8) -> Located | None:
    """Find where this utterance sits in the reference word stream.

    Naively taking the first and last matching block is wrong: one spurious
    two-word hit ("of the") thousands of words away stretches the span across the
    whole script, which downstream reads as a full restart and wipes the session.
    Instead, cluster the matching blocks and keep the densest cluster whose
    reference span is a plausible length for what was actually said.
    """
    n = len(utt.norm)
    if n == 0:
        return None

    sm = difflib.SequenceMatcher(None, ref_norm, utt.norm, autojunk=False)
    blocks = [b for b in sm.get_matching_blocks() if b.size >= min_block]
    if not blocks:
        return None

    max_span = max(int(n * span_slack), n + 8)

    best = None
    for anchor in blocks:
        lo = anchor.a
        hi = lo + max_span
        inside = [b for b in blocks if b.a >= lo and (b.a + b.size) <= hi]
        if not inside:
            continue
        matched = sum(b.size for b in inside)
        if best is None or matched > best[0]:
            best = (matched, inside)

    if best is None:
        return None

    matched, inside = best
    score = matched / n
    ref_start = inside[0].a
    ref_end = inside[-1].a + inside[-1].size

    pairs = [(b.a + k, b.b + k) for b in inside for k in range(b.size)]
    return Located(utt, ref_start, ref_end, score, pairs)


# ---------------------------------------------------------------------------
# 5. Rollback: last take wins, at any depth
# ---------------------------------------------------------------------------

@dataclass
class Decision:
    located: Located
    reason: str
    superseded: list[Located] = field(default_factory=list)


@dataclass
class Region:
    loc: Located
    ref_start: int
    ref_end: int
    word_first: int
    word_last: int  # exclusive


def prefer_simpler_takes(located: list[Located], dup_similarity: float, dup_overlap: float):
    """Among near-identical takes of the same line, keep the simplest one.

    Narrator's own rule: when a line comes back with a word dropped, that is a live
    simplification, not a flub -- the shorter delivery is the intended one. So for a
    cluster of takes covering the same reference span with near-identical wording,
    prefer the fewest words and break ties by recency. Takes that differ materially are
    left alone for the coverage pass, where last-take-wins still applies.
    """
    winners: list[Located] = []
    drops: list[tuple[Located, Located]] = []  # (dropped, kept)
    used = [False] * len(located)

    for i, a in enumerate(located):
        if used[i]:
            continue
        cluster = [a]
        used[i] = True
        for j in range(i + 1, len(located)):
            if used[j]:
                continue
            b = located[j]
            inter = min(a.ref_end, b.ref_end) - max(a.ref_start, b.ref_start)
            union = max(a.ref_end, b.ref_end) - min(a.ref_start, b.ref_start)
            if union <= 0 or inter / union < dup_overlap:
                continue
            if difflib.SequenceMatcher(
                None, " ".join(a.utt.norm), " ".join(b.utt.norm)
            ).ratio() < dup_similarity:
                continue
            cluster.append(b)
            used[j] = True

        if len(cluster) == 1:
            winners.append(a)
            continue

        # Fewest words wins; latest recording breaks the tie.
        best = min(cluster, key=lambda c: (len(c.utt.norm), -c.utt.start))
        winners.append(best)
        for c in cluster:
            if c is not best:
                drops.append((c, best))

    winners.sort(key=lambda l: l.utt.start)
    return winners, drops


def resolve(
    utterances: list[Utterance],
    ref_norm: list[str],
    match_threshold: float,
    min_block: int,
    min_run: int,
    dup_similarity: float,
    dup_overlap: float,
    stub_fraction: float,
    stub_max_words: int,
    seam_similarity: float,
):
    """Last take wins, per reference region.

    Earlier designs treated a backward jump as a restart and discarded everything
    recorded after the superseded take. That is wrong for a *pickup*: a narrator who
    re-reads one early sentence at the end of a long session has not invalidated the
    forty minutes in between. So instead of reasoning about takes, reason about
    coverage -- every reference word is claimed by the latest utterance that covers
    it, and the final cut is assembled in script order. Immediate retakes, mid-session
    restarts and end-of-session pickups all fall out of that one rule.
    """
    located: list[Located] = []
    discarded_noise: list[tuple[Utterance, float]] = []

    for u in utterances:
        loc = locate(u, ref_norm, min_block)
        if loc is None or loc.score < match_threshold:
            discarded_noise.append((u, loc.score if loc else 0.0))
            continue
        located.append(loc)

    located, simplification_drops = prefer_simpler_takes(
        located, dup_similarity, dup_overlap
    )

    # Later utterances overwrite earlier claims on the same reference words. Then drop
    # "stubs": a take that got mostly overwritten was an abandoned false start, and the
    # sliver it still owns plays as an audible repeat before the good take. Removing it
    # entirely lets the ground revert to a take that actually covers the line, so this
    # has to iterate until stable.
    alive = list(located)
    for _ in range(6):
        winner: dict[int, Located] = {}
        for loc in alive:  # recording order
            for r in range(loc.ref_start, loc.ref_end):
                winner[r] = loc

        held: dict[int, int] = {}
        for loc in winner.values():
            held[id(loc)] = held.get(id(loc), 0) + 1

        stubs = set()
        for loc in alive:
            span = max(loc.ref_end - loc.ref_start, 1)
            kept_words = held.get(id(loc), 0)
            if kept_words == 0:
                continue
            if kept_words / span < stub_fraction and kept_words < stub_max_words:
                stubs.add(id(loc))
        if not stubs:
            break
        alive = [l for l in alive if id(l) not in stubs]

    stub_drops = [l for l in located if l not in alive]
    located = alive

    winner = {}
    for loc in located:
        for r in range(loc.ref_start, loc.ref_end):
            winner[r] = loc

    # Group consecutive reference words sharing a winner into runs.
    runs: list[tuple[Located, int, int]] = []
    for r in sorted(winner):
        loc = winner[r]
        if runs and runs[-1][0] is loc and runs[-1][2] == r:
            runs[-1] = (loc, runs[-1][1], r + 1)
        else:
            runs.append((loc, r, r + 1))

    # Drop micro-runs left behind when a later take clipped an earlier one, then
    # merge neighbouring runs that came from the same utterance.
    runs = [r for r in runs if (r[2] - r[1]) >= min_run or r[0].ref_end - r[0].ref_start <= min_run]

    regions: list[Region] = []
    for loc, r0, r1 in runs:
        ws = [loc.utt.src_index[u] for (r, u) in loc.pairs if r0 <= r < r1]
        if not ws:
            continue
        first, last = min(ws), max(ws) + 1
        if regions and regions[-1].loc is loc and first <= regions[-1].word_last:
            regions[-1].ref_end = r1
            regions[-1].word_last = max(regions[-1].word_last, last)
        else:
            regions.append(Region(loc, r0, r1, first, last))

    # Region edges were set from *matched* words only, so a spoken word that differs
    # from the script ("No plane hit it" -> "No plane hit") sits outside the range and
    # would be clipped. Give each utterance's outermost regions the utterance's own
    # edges back; interior splits keep the matched boundary because that is where a
    # later take genuinely takes over.
    by_utt: dict[int, list[Region]] = {}
    for reg in regions:
        by_utt.setdefault(id(reg.loc), []).append(reg)
    for group in by_utt.values():
        group.sort(key=lambda r: r.word_first)
        head, tail = group[0], group[-1]
        # Only reclaim an edge the utterance still owns. If a later take took over the
        # head or tail of this utterance, extending would replay the superseded words.
        if head.ref_start <= head.loc.ref_start:
            head.word_first = 0
        if tail.ref_end >= tail.loc.ref_end:
            tail.word_last = len(tail.loc.utt.words)

    # Final pass at the seam, which is where the ear actually catches a repeat: if a
    # region's words are essentially the opening of the very next region, it is an
    # abandoned run-up to the line that follows. Span arithmetic misses these because
    # the fragment legitimately owns its few reference words; only comparing the spoken
    # text across the join finds them.
    seam_drops: list[Region] = []
    cleaned: list[Region] = []
    for i, reg in enumerate(regions):
        if i + 1 < len(regions):
            nxt = regions[i + 1]
            a = reg.loc.utt.norm[reg.word_first:reg.word_last]
            b = nxt.loc.utt.norm[nxt.word_first:nxt.word_last]
            if a and b and len(a) <= len(b):
                head = b[:len(a) + 2]
                if difflib.SequenceMatcher(None, " ".join(a), " ".join(head)).ratio() >= seam_similarity:
                    seam_drops.append(reg)
                    continue
        cleaned.append(reg)
    regions = cleaned

    superseded_count = sum(
        1 for loc in located
        if not any(reg.loc is loc for reg in regions)
    )
    return (regions, located, discarded_noise, superseded_count,
            simplification_drops, stub_drops, seam_drops)


# ---------------------------------------------------------------------------
# 6. Render
# ---------------------------------------------------------------------------

def render(
    audio_path: Path,
    plan: list[Region],
    lead_pad: float,
    tail_pad: float,
    gap_ms: int,
    fade_ms: int,
    out_wav: Path,
):
    with wave.open(str(audio_path), "rb") as wf:
        nch, sampwidth, framerate, nframes = (
            wf.getnchannels(), wf.getsampwidth(), wf.getframerate(), wf.getnframes()
        )
        if sampwidth != 2:
            raise SystemExit(f"expected 16-bit PCM, got sampwidth={sampwidth}")
        raw = wf.readframes(nframes)

    data = np.frombuffer(raw, dtype=np.int16).reshape(-1, nch)
    del raw

    gap = np.zeros((int(framerate * gap_ms / 1000), nch), dtype=np.int16)
    fade_n = max(1, int(framerate * fade_ms / 1000))

    pieces: list[np.ndarray] = []
    edl = []
    for reg in plan:
        loc, first, last = reg.loc, reg.word_first, reg.word_last
        t0 = max(0.0, loc.utt.words[first].start - lead_pad)
        t1 = min(nframes / framerate, loc.utt.words[last - 1].end + tail_pad)
        a, b = int(t0 * framerate), int(t1 * framerate)
        if b <= a:
            continue
        clip = data[a:b].astype(np.float32)
        n = min(fade_n, len(clip) // 2)
        if n > 0:
            ramp = np.linspace(0.0, 1.0, n, dtype=np.float32)[:, None]
            clip[:n] *= ramp
            clip[-n:] *= ramp[::-1]
        pieces.append(clip.astype(np.int16))
        pieces.append(gap)
        edl.append({
            "src_start_s": round(t0, 3),
            "src_end_s": round(t1, 3),
            "duration_s": round(t1 - t0, 3),
            "ref_start_word": reg.ref_start,
            "ref_end_word": reg.ref_end,
            "score": round(loc.score, 3),
            "text": " ".join(w.text for w in loc.utt.words[first:last]),
        })

    final = np.concatenate(pieces) if pieces else np.zeros((0, nch), dtype=np.int16)

    with wave.open(str(out_wav), "wb") as wf:
        wf.setnchannels(nch)
        wf.setsampwidth(2)
        wf.setframerate(framerate)
        wf.writeframes(final.tobytes())

    return nframes / framerate, len(final) / framerate, edl


# ---------------------------------------------------------------------------
# 7. Reports
# ---------------------------------------------------------------------------

def fmt(t: float) -> str:
    m, s = divmod(t, 60)
    h, m = divmod(int(m), 60)
    return f"{h:02d}:{int(m):02d}:{s:05.2f}"


def write_reports(out_dir, audio_path, words, raw_segments, sentences, ref_sent_of_word,
                  ref_words_flat, located, plan, discarded_noise, superseded_count,
                  sim_drops, stub_drops, seam_drops, edl, orig_s, final_s, review_floor):
    (out_dir / "transcript_raw.json").write_text(json.dumps({
        "audio": str(audio_path),
        "words": [{"text": w.text, "start": round(w.start, 3), "end": round(w.end, 3),
                   "prob": round(w.prob, 3)} for w in words],
        "segments": raw_segments,
    }, indent=2), encoding="utf-8")

    with (out_dir / "transcript_raw.txt").open("w", encoding="utf-8") as f:
        for s in raw_segments:
            f.write(f"[{fmt(s['start'])} - {fmt(s['end'])}] {s['text']}\n")

    (out_dir / "final_cut_edl.json").write_text(json.dumps(edl, indent=2), encoding="utf-8")

    covered = set()
    for reg in plan:
        for i in range(reg.ref_start, reg.ref_end):
            covered.add(i)
    missing_sentences = []
    for si, sent in enumerate(sentences):
        idxs = [i for i, s in enumerate(ref_sent_of_word) if s == si]
        if idxs and not any(i in covered for i in idxs):
            missing_sentences.append((si, sent))

    low = [r for r in plan if r.loc.score < review_floor]

    L = []
    L.append("# Keeper edit report\n")
    L.append(f"Source: `{audio_path}`\n")
    L.append(f"| | |\n|---|---|")
    L.append(f"| Original duration | {fmt(orig_s)} |")
    L.append(f"| Final duration | {fmt(final_s)} |")
    L.append(f"| Removed | {fmt(orig_s - final_s)} ({100*(orig_s-final_s)/max(orig_s,1):.1f}%) |")
    L.append(f"| Kept segments | {len(plan)} |")
    L.append(f"| Takes fully superseded by a later read | {superseded_count} |")
    L.append(f"| Duplicate takes dropped (simpler kept) | {len(sim_drops)} |")
    L.append(f"| False starts dropped | {len(stub_drops)+len(seam_drops)} |")
    L.append(f"| Junk utterances discarded | {len(discarded_noise)} |")
    L.append(f"| Script sentences never covered | {len(missing_sentences)} |")
    L.append(f"| Kept below {review_floor:.2f} confidence | {len(low)} |\n")

    if missing_sentences:
        L.append("## Script lines with no take in the recording\n")
        L.append("Either never recorded, or delivered too differently to align. Check before publishing.\n")
        for si, sent in missing_sentences:
            L.append(f"- [{si}] {sent}")
        L.append("")

    # Contiguous stretches of script that no kept segment covers. This is the sharpest
    # quality signal the tool produces: it names the words that are missing from the cut.
    gaps: list[tuple[int, int]] = []
    for i in range(len(ref_words_flat)):
        if i in covered:
            continue
        if gaps and gaps[-1][1] == i:
            gaps[-1] = (gaps[-1][0], i + 1)
        else:
            gaps.append((i, i + 1))
    gaps = [g for g in gaps if (g[1] - g[0]) >= 1]
    if gaps:
        L.append("## Coverage gaps -- script words with no audio in the final cut\n")
        L.append("Short gaps are usually words the narrator skipped or slurred. "
                 "Long gaps mean a line never made it in.\n")
        for a, b in gaps:
            words_txt = " ".join(ref_words_flat[a:b])
            ctx_before = " ".join(ref_words_flat[max(0, a - 6):a])
            ctx_after = " ".join(ref_words_flat[b:b + 6])
            flag = "  **LONG**" if (b - a) >= 6 else ""
            L.append(f"- ref[{a}:{b}] ({b-a} word{'s' if b-a>1 else ''}){flag}\n"
                     f"  ...{ctx_before} **[{words_txt}]** {ctx_after}...")
        L.append("")

    if low:
        L.append(f"## Low-confidence keeps (score < {review_floor:.2f}) -- listen to these\n")
        for r in low:
            L.append(f"- [{fmt(r.loc.utt.start)}-{fmt(r.loc.utt.end)}] score={r.loc.score:.2f}\n"
                     f"  \"{' '.join(w.text for w in r.loc.utt.words[r.word_first:r.word_last])}\"")
        L.append("")

    if sim_drops:
        L.append("## Duplicate takes dropped -- same line, simpler delivery kept\n")
        for dropped, kept in sim_drops:
            L.append(f"- dropped [{fmt(dropped.utt.start)}] ({len(dropped.utt.norm)} words) "
                     f"\"{dropped.utt.text[:130]}\"\n"
                     f"  kept    [{fmt(kept.utt.start)}] ({len(kept.utt.norm)} words) "
                     f"\"{kept.utt.text[:130]}\"")
        L.append("")

    if stub_drops:
        L.append("## False starts dropped -- abandoned part-takes of a line read properly later\n")
        for l in stub_drops:
            L.append(f"- [{fmt(l.utt.start)}-{fmt(l.utt.end)}] ref[{l.ref_start}:{l.ref_end}] "
                     f"\"{l.utt.text[:130]}\"")
        L.append("")

    if seam_drops:
        L.append("## Run-ups dropped -- fragment repeated as the opening of the next segment\n")
        for r in seam_drops:
            txt = " ".join(w.text for w in r.loc.utt.words[r.word_first:r.word_last])
            L.append(f"- [{fmt(r.loc.utt.start)}] \"{txt[:130]}\"")
        L.append("")

    used = {id(r.loc) for r in plan}
    dropped = [l for l in located if id(l) not in used]
    if dropped:
        L.append("## Takes dropped -- fully replaced by a later read of the same lines\n")
        for l in dropped:
            L.append(f"- [{fmt(l.utt.start)}-{fmt(l.utt.end)}] ref[{l.ref_start}:{l.ref_end}] "
                     f"score={l.score:.2f} \"{l.utt.text[:150]}\"")
        L.append("")

    L.append("## Final cut, in script order\n")
    for i, e in enumerate(edl):
        L.append(f"{i:3d}. [{fmt(e['src_start_s'])} -> {fmt(e['src_end_s'])}] "
                 f"({e['duration_s']:6.2f}s, score {e['score']:.2f}) \"{e['text'][:120]}\"")
    L.append("")

    if discarded_noise:
        L.append("## Discarded as junk (no reliable match to the script)\n")
        for u, sc in discarded_noise:
            L.append(f"- [{fmt(u.start)}-{fmt(u.end)}] score={sc:.2f} \"{u.text[:160]}\"")

    (out_dir / "edit_report.md").write_text("\n".join(L), encoding="utf-8")

    summary = {
        "orig_duration_s": round(orig_s, 2),
        "final_duration_s": round(final_s, 2),
        "removed_pct": round(100 * (orig_s - final_s) / max(orig_s, 1), 1),
        "kept_segments": len(plan),
        "takes_superseded": superseded_count,
        "duplicate_takes_dropped": len(sim_drops),
        "false_starts_dropped": len(stub_drops) + len(seam_drops),
        "junk_discarded": len(discarded_noise),
        "script_sentences_total": len(sentences),
        "script_sentences_uncovered": len(missing_sentences),
        "script_words_total": len(ref_words_flat),
        "script_words_uncovered": len(ref_words_flat) - len(covered),
        "coverage_pct": round(100 * len(covered) / max(len(ref_words_flat), 1), 1),
        "coverage_gaps": len(gaps),
        "long_gaps": sum(1 for a, b in gaps if (b - a) >= 6),
        "low_confidence_keeps": len(low),
    }
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return summary


# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="Cut voice-over retakes and dead air.")
    ap.add_argument("--audio", required=True, type=Path)
    ap.add_argument("--script", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--backend", default="chunked",
                    choices=["chunked", "whisperx", "faster-whisper"],
                    help="chunked = silence-split then per-take ASR (only mode that preserves "
                         "repeated takes); whisperx/faster-whisper transcribe the file whole "
                         "and will silently merge repeats")
    ap.add_argument("--split-silence", type=float, default=0.45,
                    help="silence (s) that separates one take from the next, pre-ASR")
    ap.add_argument("--min-speech", type=float, default=0.20)
    ap.add_argument("--drop-db", type=float, default=35.0,
                    help="dB below the loud percentile that counts as silence")
    ap.add_argument("--chunk-pad", type=float, default=0.15)
    ap.add_argument("--dup-similarity", type=float, default=0.82,
                    help="text similarity above which two takes are 'the same line'")
    ap.add_argument("--dup-overlap", type=float, default=0.55,
                    help="reference-span overlap above which two takes compete")
    ap.add_argument("--stub-fraction", type=float, default=0.6,
                    help="a take keeping less than this share of its span is a false start")
    ap.add_argument("--stub-max-words", type=int, default=8)
    ap.add_argument("--seam-similarity", type=float, default=0.72,
                    help="a segment this similar to the opening of the next one is a run-up")
    ap.add_argument("--model", default="large-v3")
    ap.add_argument("--device", default="cuda")
    ap.add_argument("--compute-type", default="float16")
    ap.add_argument("--language", default="en")
    ap.add_argument("--batch-size", type=int, default=16)
    ap.add_argument("--vad-min-silence-ms", type=int, default=500)
    ap.add_argument("--utterance-gap", type=float, default=0.9,
                    help="silence (s) that ends an utterance; also the longest pause kept inside one")
    ap.add_argument("--match-threshold", type=float, default=0.55)
    ap.add_argument("--min-block", type=int, default=2)
    ap.add_argument("--min-run", type=int, default=3,
                    help="drop leftover fragments shorter than this many reference words")
    ap.add_argument("--lead-pad", type=float, default=0.12)
    ap.add_argument("--tail-pad", type=float, default=0.18)
    ap.add_argument("--gap-ms", type=int, default=420, help="pause inserted between kept runs")
    ap.add_argument("--fade-ms", type=int, default=10)
    ap.add_argument("--review-floor", type=float, default=0.70)
    ap.add_argument("--reuse-transcript", action="store_true",
                    help="reuse transcript_raw.json in --out instead of re-transcribing")
    args = ap.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)

    sentences = parse_reference_script(args.script)
    ref_norm: list[str] = []
    ref_sent_of_word: list[int] = []
    for si, sent in enumerate(sentences):
        for tok in normalize_words(sent):
            ref_norm.append(tok)
            ref_sent_of_word.append(si)
    print(f"[keeper] reference: {len(sentences)} sentences, {len(ref_norm)} words", flush=True)

    cache = args.out / "transcript_raw.json"
    if args.reuse_transcript and cache.exists():
        d = json.loads(cache.read_text(encoding="utf-8"))
        words = [Word(w["text"], w["start"], w["end"], w.get("prob", 1.0)) for w in d["words"]]
        raw_segments = d["segments"]
        print(f"[keeper] reusing cached transcript ({len(words)} words)", flush=True)
    elif args.backend == "chunked":
        words, raw_segments, _ = transcribe_chunked(
            args.audio, args.model, args.device, args.compute_type, args.language,
            args.batch_size, args.split_silence, args.min_speech, args.drop_db,
            args.chunk_pad,
        )
    elif args.backend == "whisperx":
        words, raw_segments, _ = transcribe_whisperx(
            args.audio, args.model, args.device, args.compute_type,
            args.language, args.batch_size,
        )
    else:
        words, raw_segments, _ = transcribe(
            args.audio, args.model, args.device, args.compute_type,
            args.language, args.vad_min_silence_ms,
        )
        cache.write_text(json.dumps({
            "audio": str(args.audio),
            "words": [{"text": w.text, "start": w.start, "end": w.end, "prob": w.prob} for w in words],
            "segments": raw_segments,
        }, indent=2), encoding="utf-8")
        print("[keeper] transcript checkpointed.", flush=True)

    utterances = group_utterances(words, args.utterance_gap)
    print(f"[keeper] {len(utterances)} utterances (split at >={args.utterance_gap}s silence)", flush=True)

    plan, located, noise, superseded, sim_drops, stub_drops, seam_drops = resolve(
        utterances, ref_norm, args.match_threshold, args.min_block, args.min_run,
        args.dup_similarity, args.dup_overlap, args.stub_fraction, args.stub_max_words,
        args.seam_similarity,
    )
    print(f"[keeper] {len(plan)} regions kept, {superseded} superseded, "
          f"{len(sim_drops)} duplicates dropped, "
          f"{len(stub_drops)+len(seam_drops)} false starts dropped, "
          f"{len(noise)} junk", flush=True)

    orig_s, final_s, edl = render(
        args.audio, plan, args.lead_pad, args.tail_pad, args.gap_ms, args.fade_ms,
        args.out / (args.audio.stem + "_FINALCUT.wav"),
    )

    summary = write_reports(
        args.out, args.audio, words, raw_segments, sentences, ref_sent_of_word,
        ref_norm, located, plan, noise, superseded, sim_drops, stub_drops, seam_drops, edl,
        orig_s, final_s, args.review_floor,
    )
    print("[keeper] done.")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
