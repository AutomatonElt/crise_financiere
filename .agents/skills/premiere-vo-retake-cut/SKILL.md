---
name: premiere-vo-retake-cut
description: Turn a long voice-over recording full of retakes into a cut, colour-coded Premiere Pro timeline. Transcribes with WhisperX word-level forced alignment, matches every utterance against the script, keeps the last good take of each line, then lands the whole cut on a Premiere timeline with each piece colour-labelled (keep / alternate / junk). Use when the user says "cut the retakes", "clean up this voiceover", "I recorded a VO with a lot of retakes", "colour-code the takes on the timeline", "build the retake review timeline", or hands over a raw VO file plus a script.
version: 2.0.0
license: MIT
---

# Voice-over retake cut → coloured Premiere timeline

One job: a raw narration recording goes in, a cut and colour-coded Premiere sequence comes out,
with a report naming every decision.

The narrator reads a script straight through, flubs lines, re-reads them, mutters between
attempts, and leaves long dead air while finding their place. The last attempt at any passage is
usually the good one. This skill finds it, then puts the whole session on a timeline in colour so
a human can review the choices instead of trusting them.

Proven end to end on a 48-minute session (16:52 of clean narration, 96 % script coverage,
116 superseded takes and 72 junk utterances identified) and on a 63-minute session landed as
480 colour-labelled clips in a single import.

## What it is not

Not a silence remover. `auto-editor` and `ffmpeg silenceremove` cut dead air but keep every bad
take, which is the actual problem. Silence compression here is a side effect of keeping only the
audio inside chosen word spans.

## The two stages

| stage | what happens | where |
|---|---|---|
| **1. Transcribe and choose** | WhisperX forced alignment → word-level times → match against the script → last take wins → report | `scripts/keeper.py` |
| **2. Land it in Premiere** | Express the whole cut as FCP7 XML with a colour per piece, import once | this file, "Colouring a big cut" |

Stage 1 is useful on its own: it produces the clean audio plus a decision report. Stage 2 exists
for when a human wants to *review* the cut in a timeline before trusting it.

---

## Stage 1 — transcribe and choose the takes

### Prior art this is built on

Each idea earned its place.

| Source | What was taken |
|---|---|
| [narration.studio](https://github.com/stevenwaterman/narration.studio) | The core idea: match recognised speech against the *script*, and when a line repeats, compare takes and keep the right one. It does this live with Levenshtein distance over phonemes; this skill does it offline over word sequences, which survives a 48-minute session where the narrator jumps around. |
| [auto-editor](https://github.com/WyattBlue/auto-editor) | Padding discipline. Its `--margin` default of 0.2 s around a cut is why `--lead-pad` / `--tail-pad` exist: cutting exactly on a word boundary clips plosives and sounds amputated. |
| [WhisperX](https://github.com/m-bain/whisperx) | wav2vec2 forced alignment. Whisper's own word timings are decoder estimates and drift; forced alignment puts boundaries on real phoneme onsets, which is what makes a word-boundary cut land cleanly. |
| ffmpeg `silencedetect` practice for speech | Threshold discipline — treat only genuinely quiet audio as silence and keep the duration threshold low, so natural pauses survive. That is why `--utterance-gap` defaults to 0.9 s rather than something aggressive. |
| Audiobook punch-and-roll workflows | The mental model: narrators roll back and re-read. The editor's job is to honour the last pass over each passage. |

### Environment

Needs WhisperX, and a GPU for anything long. Install it in a virtualenv of its own — it pins
`torch` and `numpy` versions that will fight with everything else:

```bash
python -m venv .venv
.venv/Scripts/pip install whisperx            # Windows; use .venv/bin/pip elsewhere
```

On Windows set `PYTHONIOENCODING=utf-8` and `PYTHONUTF8=1` — WhisperX crashes printing
non-ASCII characters to a legacy console. A `torchcodec is not installed correctly` warning is
harmless; WhisperX falls back to its own loader and alignment is unaffected.

### Run it

```bash
PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python scripts/keeper.py \
  --audio  "/path/to/raw_vo.wav" \
  --script "/path/to/script.md" \
  --out    "/path/to/raw_vo_edit"
```

Add `--reuse-transcript` to re-cut without re-transcribing. **Always use it while tuning** — the
transcription is the slow part and it does not change when you change a cut parameter.

Read `scripts/keeper.py --help` for the full flag set. The ones that matter:

| flag | why |
|---|---|
| `--lead-pad` / `--tail-pad` | padding around each kept span. Cutting on the exact word boundary clips plosives. |
| `--utterance-gap` | how much silence separates two utterances. Low, so natural pauses survive. |
| `--reuse-transcript` | re-cut from the cached transcript |

### Rules that hold regardless of the tool

1. **`Last take wins` is a recording convention, not a judgement.** It reflects how narrators
   work. It is not a claim that the latest performance is the best one, and an end-of-session
   pickup must not invalidate every later passage.
2. **Preserve the original recording.** The cut is a new file, always.
3. **Chunk before ASR when the session has retakes.** Separating takes *before* recognition and
   force-aligning them protects repeats that whole-file ASR merges into one.
4. **Match utterances to compact reference regions**, not to the outer envelope of scattered
   common-word matches. "the" appearing in paragraph 1 and paragraph 9 is not a span.
5. **Report the gaps.** Coverage holes, short fragments, low-confidence picks, discarded ad-libs
   and duplicated spans are the output a human actually reviews.

---

## Stage 2 — landing the cut on a Premiere timeline

Premiere automation here goes through an MCP bridge:
[`leancoderkavy/premiere-pro-mcp`](https://github.com/leancoderkavy/premiere-pro-mcp) (npm
`premiere-pro-mcp`, MIT). Its transport is a **CEP panel inside Premiere**, so the panel has to
be open and the bridge started, in `Window > Extensions`.

```bash
npm install -g premiere-pro-mcp
premiere-pro-mcp --install-cep      # installs the signed panel + the CEP debug flag
premiere-pro-mcp --doctor           # server / Node / connector readiness
```

Register it with two environment variables, each for a measured reason:

| var | why |
|---|---|
| `PREMIERE_TEMP_DIR` | The bridge folder. **The panel must be pointed at the same string.** Two folders = both sides reporting fine and nothing happening. The panel writes `config.json` and `bridge-heartbeat.json` there, which is the cheapest way to see which folder it actually chose. |
| `PREMIERE_TIMEOUT_MS=120000` | The default is 30 000 ms, and importing a few hundred MB of audio plus a shot list does not reliably fit in 30 s. |

Leave `PREMIERE_MCP_CAPABILITIES` alone: the default `inspect,edit,export,filesystem` profile is
enough to build a timeline. `unsafe-script` adds raw scripting and is not needed.

### Session start-up, always

1. Premiere open, project open, panel open, bridge **started**.
2. `verify_premiere_connection` — read-only, the cheapest liveness check. Run it before anything
   that writes.
3. `get_capabilities` if a tool seems missing.

With the panel closed this bridge returns a diagnosis rather than a fake success
(`"status": "bridge_unavailable"` with a `nextStep`). Read `nextStep` and do what it says,
including its advice not to retry other tools — hammering a dead bridge just fills the log.

### Colouring a big cut: one XML import, not three calls per clip

This is the part worth knowing, and it took a wrong route first.

**No API colours a timeline clip.** `set_color_label` reaches the *project item*, not the clip on
the timeline, and answers "Item not found" for a track-clip id. ExtendScript's `TrackItem` and the
QE DOM have no label method either. The per-clip workaround is a `create_subclip` +
`set_color_label` + `overwrite_clip` trio — correct, but **three bridge round trips per piece**,
which is 1,440 calls for 480 pieces.

**The rule: express a big cut as FCP7 XML and import it in one call.**

```xml
<clipitem id="take_0137">
  <name>take 137 — kept</name>
  <start>412</start><end>503</end>
  <in>0</in><out>91</out>
  <file id="vo"><pathurl>file://localhost/C:/path/raw_vo.wav</pathurl></file>
  <labels><label2>Green</label2></labels>
</clipitem>
```

`<labels><label2>…</label2></labels>` sets the **timeline clip's** colour, which no MCP tool can
do. 480 coloured clips landed in a single import this way.

Four rules that come with it:

1. **`import_fcp_xml` is dead on current builds** — it fails `Error: Not Enough Parameters` on any
   path, short-name or clean. Put the `.xml` in `import_media`'s `file_paths` instead; it imports
   the XML correctly and builds the sequence.
2. **An XML import creates a NEW sequence**, so it never writes into the timeline the user is
   working in. That makes it the safe default while someone is editing.
3. **Match the rate to the target sequence**:
   `<rate><timebase>24</timebase><ntsc>TRUE</ntsc></rate>`. Read the target with
   `get_sequence_settings` and convert: `254016000000 / ticks = fps`
   (`10594584000` = 23.976, `10584000000` = 24).
4. **Verify by exporting the sequence back out.** `export_as_fcp_xml` then count `label2` by
   colour and compare against the plan. `get_full_clip_info` reports only `source.colorLabel` —
   the shared master clip's — so it shows one colour for every clip and tells you nothing.

There is no pure red in the label set; Rose is the closest. A sensible three-colour scheme:
**Green = kept take, Yellow = alternate worth hearing, Rose = junk / superseded.**

### Razoring audio, if you go the per-clip route anyway

`split_clip` **works on audio tracks** on current builds (113 razors, each `verified: true`,
113 clips counted afterwards) even though it no-ops on some video tracks. Test one cut and read
it back before choosing a route — do not assume either way.

A subclip's in/out cannot be moved afterwards (`set_item_in_out` refuses), and the out point
rounds by ±1 frame, so re-read each piece and colour any leftover one-frame sliver.

---

## The two ways to freeze Premiere while automating it

Both of these cost about 25 minutes of frozen application, and neither is a bridge bug.

**1. Never run a second MCP server beside the session's registered one.** Both speak to the
*same* file bridge in `PREMIERE_TEMP_DIR`. The second server's call hangs at its timeout, the
runner kills it mid-request, and that leaves a `busy_<uuid>.json` in the bridge folder whose
`elapsedMs` climbs forever while every later call — including the first server's — times out.
Read that folder first when calls stop returning: a live `bridge-heartbeat.json`
(`state: running`) **plus** a stale `busy_*.json` is bridge contention, not a closed panel, and
the fix is to stop the extra client, not to restart anything.

**2. Never run GPU ASR, or any GPU job, while Premiere has to stay responsive.** This is the trap
that bites this exact skill, because stage 1 *is* a GPU job. WhisperX `large-v3` float16 on an
8 GB GPU wedged the driver. The tell is specific: the Python process's **CPU time stops
advancing** while `nvidia-smi` itself hangs. Premiere's Mercury Playback engine is a CUDA client,
so its main thread blocks with it — "not responding" with **no modal dialog**, which the bridge's
own diagnosis will nonetheless blame on a dialog. Enumerate Premiere's windows before believing
that: one enabled main window and nothing else means the thread is blocked, not prompting.
Killing the GPU process releases it.

**Transcribe first, with Premiere closed. Open Premiere for the import.**

A frozen host is diagnosable without guessing: compare `TotalVirtualMemorySize` against
`FreeVirtualMemory` (the commit charge). Premiere alone reserved 73 GB of a 127 GB limit on one
box, and with the limit saturated `torch` could not even load `cublas64_12.dll`. Check commit,
not just free RAM, before blaming a library.

## The rules of working in someone's timeline

These are not MCP rules, they are editing rules, and they matter more.

1. **Never work in the user's live project without being told to.** Duplicate the sequence, or
   work in a new one. An undo stack is not a backup. (This is why the XML route's new-sequence
   behaviour is a feature.)
2. **Import real media before editing.** Tools that build a timeline from clips that were never
   imported produce offline clips that look like success in a tool result.
3. **Read before you write.** `list_sequences`, then the active sequence, then act. Timeline
   tools on this server have no sequence argument — they act on the **active** sequence, so call
   `set_active_sequence` and never assume.
4. **A tool result is not proof of a picture.** The bridge reports what it asked Premiere to do.
   Confirm what actually happened by asking Premiere back.
5. **The bridge writes to the project that has FOCUS, not the one you opened.** With two projects
   open, `app.project` is whichever the user last clicked, and `open_project` on the other one
   returns `opened: true` while leaving focus where it was. A script that runs while someone
   works checks `get_project_info` → `activeSequence.name` before **every** write and stops on a
   mismatch. Never force focus away from someone who is editing.
6. **`add_tracks` inserts at the BOTTOM and renumbers every existing track.** Indices captured
   before the call then point at different tracks. Add every track you need first, re-read the
   sequence, and identify a track by *what is on it*, never by a number.
7. **Removing a video clip leaves its linked audio behind.** Check `durationSeconds` afterwards —
   it is the cheapest tell that something invisible is still out there.

## Calling a tool from a shell

A session started before the MCP server was registered cannot see its tools. Talk to the server
directly instead of restarting anything:

```bash
node scripts/call_tool.js verify_premiere_connection
node scripts/call_tool.js list_sequences '{}'
node scripts/call_tool.js import_media "@/path/to/args.json"
```

**Any argument carrying a Windows path must go in via `@file`.** Inline JSON loses a level of
backslashes on the way through the shell and the call dies with *"Bad escaped character in
JSON"*. Write the args with `json.dumps` and pass the file.

For many calls, `scripts/batch_tool.js` runs them through **one** stdio session and re-reads the
active sequence every 25 calls, aborting on a mismatch (`GUARD_SEQUENCE`). `call_tool.js` spawns
a server per call, which costs about a second each. Run `batch_tool.js` **only** when no other
client holds the bridge — see the freeze section above. Both scripts read `NODE_BIN`,
`PREMIERE_MCP_SERVER` and `PREMIERE_TEMP_DIR` from the environment; set them for your install.

## Do not propose again

- **A per-clip colour route for a big cut.** Three round trips per piece. Use the XML import.
- **`get_full_clip_info` to verify clip colour.** It reports the master clip's label.
- **`import_fcp_xml`.** Dead on current builds; use `import_media`.
- **Premiere's bundled `.mogrt` templates for scripted text.** `Basic Title`, `Film Title`,
  `Basic Lower Third` and the caption set are Premiere-native graphics whose `Source Text` is an
  opaque token, not a string. Writing a plain string into it succeeds, reads back correctly, and
  **blanks the graphic**. Adobe's own answer: *"The API is designed for AE-created .mogrts"*.
  For a text overlay, render a PNG with alpha (`scripts/make_title_png.py`) and import it as
  media, or build the graphic in After Effects.
- **Inline JSON for any argument holding a Windows path.** Use `@file`.
- **Backslash paths inside a script sent to `execute_extendscript`.** They are eaten a second
  time; `new File('C:\\Users\\…')` reports `exists=false` and the same path with forward slashes
  reports `exists=true`. Forward slashes in ExtendScript — note this is the **opposite** of
  `preset_path` on the MCP side, which needs backslashes, so the two cannot be blurred into one
  habit.
- **Deleting a "tail" without proving it is one.** Razoring and then removing the clip found just
  after the cut can delete whole clips, because a razor that silently did nothing makes the
  lookup return the *same* clip. Check that the piece has a **different node id** and **starts at
  the cut** before removing it.

## Files

| file | what |
|---|---|
| `scripts/keeper.py` | stage 1 — transcribe, match, choose, report |
| `scripts/call_tool.js` | one MCP tool call over stdio, `@file` args |
| `scripts/batch_tool.js` | many calls over one session, with a focus guard |
| `scripts/make_title_png.py` | a title as real media (PNG with alpha) |

The FCP7 XML writer is not included — the shape above is the whole contract, and what generates
it depends on where your cut decisions live.
