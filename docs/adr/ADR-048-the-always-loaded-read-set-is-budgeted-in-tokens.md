---
id: ADR-048
tags: [docs, tooling]
domain: doc-standard
status: accepted
related: [ADR-015, ADR-017, ADR-019, ADR-006, ADR-032, ADR-033]
---

# ADR-048 — The always-loaded read set is budgeted in tokens, not lines

- **Status:** accepted (2026-09-28)
- **Deciders:** Maintainer
- **Context driver:** TASK-364 / EPIC-017 D3 — `check-doc-caps` counts newlines; SPRINT-105's
  `check-prose-density.ts` proved that is gameable for exactly the pair this repo reads on every
  invocation.

## Context

ADR-015, ADR-017 and ADR-019 each treat a **line count** as the resource worth capping precisely.
ADR-017 in particular raised `CONTEXT.md`'s cap to 150 lines "because the file grows by design,"
measuring growth in lines per sprint. That reasoning assumed a line is a reasonable stand-in for "how
expensive is this file to read" — a stand-in, never the resource itself.

`check-prose-density.ts` (SPRINT-105) falsified the assumption directly: `.claude/CLAUDE.md` held 63
lines against an 80 cap while its content grew 2.62x after first reaching that cap, and its longest
single line reached 6,681 characters. A file can satisfy a line cap while writing longer lines, and
that is measurably what happened — STANDARD 157 already said "split, never squeeze," but nothing
checked it before that sprint.

The resource that actually matters for `.claude/CLAUDE.md` + `.claude/CONTEXT.md` — the
`ALWAYS_LOADED` pair every skill invocation reads before any task-specific content
(`check-prose-density.ts`) — is the **tokens** a session spends reading them, not the newlines. This
repo had no tokenizer to measure that with: it ships zero dependencies (ADR-032, ADR-033), so
`check-prose-density.ts`'s own INFO line stated an explicit approximation ("4 bytes/token") rather than
inventing a real count.

## Decision

**`check-doc-caps` computes a token budget over the always-loaded read set** — `.claude/CLAUDE.md` +
`.claude/CONTEXT.md`, the existing `ALWAYS_LOADED` population from `check-prose-density.ts`, imported
rather than redefined — and reports PASS/FAIL against `scripts/lib/token-budget.txt`.

- **Tokenizer: Claude's own**, sampled via the Messages `count_tokens` API (model `claude-opus-5-5` —
  the tokenizer is sampled from the model that actually reads the always-loaded set in this repo's
  sessions) — never a third-party tokenizer such as `tiktoken`, which undercounts Claude text. The gate
  itself stays **offline and zero-dependency**
  (ADR-032/033): it *estimates* tokens as `bytes ÷ ratio`, where `ratio` (bytes/token) is measured
  **once** by an opt-in `bun scripts/lib/check-doc-caps.ts --calibrate` run against the real API,
  using the built-in `fetch` (no SDK). Calibration writes nothing to disk; the owner adopts a ratio by
  pasting it into `token-budget.txt` themselves.
- **Ratchet, not a live call.** `token-budget.txt` records `<budget-tokens> <ratio> <adopted-at>
  <reason>` — the ratio and budget move only when the owner re-calibrates and re-adopts, the same
  pattern `scripts/lib/doc-caps-grandfathered.txt` already uses (ADR-015). No API call happens on an
  ordinary gate run.
- **Line caps are retained as a secondary signal.** `CLAUDE.md` (80) and `CONTEXT.md` (150, ADR-017)
  keep their line caps: a token budget catches density-gaming within a line cap; a line cap still
  catches unbounded growth via short lines. The two compose; neither supersedes the other's
  *mechanism* — the token budget supersedes ADR-015/017/019's *claim that a line count is the exact,
  sufficient measure* for this pair.
- **No disposition on breach, yet.** `TASK-384` is expected to add a disposition mechanism (replace ·
  merge · move to an on-demand reference · automate into a check · retain with justification) for a
  promoted-rule breach; it has not shipped. Until it does, an over-budget always-loaded read set is a
  **FAIL with no escape route** — stated as such in the finding itself, not left implicit.
- **Phase 1 (this sprint) ships the mechanism uncalibrated.** `token-budget.txt` carries a `PENDING`
  sentinel in all three of budget/ratio/adopted-at; `check-doc-caps` reports that as a named
  not-yet-calibrated finding — never a silent PASS, and never a FAIL either, since there is nothing yet
  to enforce. Phase 2 (a follow-up dispatch) runs `--calibrate` and adopts real numbers.

**Supersedes ADR-015, ADR-017 and ADR-019** (EPIC-017 D3's ruling). ADR-015's rule 1 (a stated cap is
a real number, checked to the line) and ADR-017's specific 150-line figure are superseded exactly
where they apply to this pair: the number that now governs the pair's reading cost is a token budget
with a stated ratio and error band, not an integer line count. ADR-019's subject, `TODO.md`, is a
different file — retired as the v1 layout at 0.12.0 — and is superseded here as part of D3's blanket
ruling over the cap-precision family this ADR revises, not because a token budget now applies to it
directly. ADR-015's rule 2 (the grandfather file records hard-cap breaches only) is untouched in
substance; `token-budget.txt` deliberately mirrors its ratchet shape rather than replacing it.

## Consequences

**Positive:** the always-loaded pair is now measured on the resource a session actually pays —
tokens — closing the density-gaming hole `check-prose-density.ts` documented as already live. The
budget is honest about being an estimate: it states its tokenizer, its ratio, and (once calibrated)
its error band, rather than presenting an approximate number as exact the way ADR-015 found `~10` and
`~150 soft` were doing. Line caps are not discarded — they keep catching what they always caught —
so nothing already enforced is weakened.

**Negative (trade-offs accepted):**

- **The gate is an estimate, not a live-verified count.** `bytes ÷ ratio` can drift from the real
  `count_tokens` answer between calibrations, and the gate never re-verifies live — a deliberate
  zero-dependency, zero-latency, zero-cost tradeoff (ADR-032/033) over exactness on every run.
- **No disposition mechanism exists yet**, so an over-budget breach has exactly one outcome (FAIL)
  until `TASK-384` ships one — a legitimate edit that pushes the pair over budget has no recorded
  escape route in the interim.
- **Calibration is a manual, owner-gated act**, not an automatic one: it needs an `ANTHROPIC_API_KEY`
  in the environment and a deliberate paste into `token-budget.txt`. Accepted because hardcoding a
  bytes-per-token constant would silently drift as the tokenizer changes across model generations —
  precisely the "approximate cap dressed as precision" failure ADR-015 diagnosed, moved from the cap
  number to the ratio.
- **Phase 1 enforces nothing.** Shipping with a `PENDING` sentinel is an honest partial delivery, not
  a working gate — it is reported as such, but a reader expecting an active budget check today will
  not find one until phase 2 lands.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep the line cap as the only signal | Retains the density-gaming hole `check-prose-density.ts` already documented as live: a file can satisfy a line cap while writing longer lines |
| Vendor a third-party tokenizer (`tiktoken`, `gpt-tokenizer`) | Wrong tokenizer for Claude text (undercounts materially, worse on code); adds a dependency this repo has never taken (ADR-032/033) |
| Call `count_tokens` live on every gate run | Turns an offline, zero-cost check into a paid, network-dependent, API-key-gated one running on every promote/close — unacceptable for this checker's role; calibrate-once-and-ratchet is used instead |
| Fold the token budget into `check-prose-density.ts` instead of `check-doc-caps.ts` | TASK-364's Touches and Done-when name `check-doc-caps`; `check-prose-density.ts`'s population (every capped prose file) is broader than the always-loaded pair this budget targets, and it already exports `ALWAYS_LOADED` for `check-doc-caps` to import rather than duplicate |
| Raise `CLAUDE.md`/`CONTEXT.md`'s line caps instead of adding a token budget | Doesn't address the actual failure mode (density gaming within a cap); §7 forbids raising a cap to fit content rather than diet-first |

## Amended 2026-09-28 (TASK-364 phase 2 — calibration lands, both paths, first adoption)

Phase 1 above described the API path only, because it was the only one built. Owner ruling
2026-09-28: no `ANTHROPIC_API_KEY` in this environment, a Claude subscription only, calibration
**authorised to run through Claude Code's own headless mode instead**. `--calibrate` now tries BOTH,
in order, naming the method on every printed line: the API when `ANTHROPIC_API_KEY` is set (unchanged
from Phase 1); otherwise a **headless differential** through `claude -p` when a `claude` CLI is on
PATH (there is no `count_tokens` call in headless mode, so the count is inferred instead); neither
available is a named FAIL naming both options, never a silent skip.

**The headless method.** A fixed baseline prompt is run **twice** — if the two totals disagree,
calibration FAILs outright rather than adopt a number a drifting system prompt or cache state could
have corrupted. A delimiter's own cost (baseline + delimiter + an empty body) is isolated once and
subtracted from every file, leaving each file's marginal cost alone. Every run executes from a temp
directory **outside this repo** (`mkdtempSync(tmpdir())`), so no `.claude/CLAUDE.md`/memory of any
repo is auto-loaded into a measurement of its own size, and every prompt goes over **stdin, never
argv** (`.claude/CLAUDE.md` is ~23 KB, past what Windows/`cmd.exe`/MSYS argv quoting reliably
carries). `totalInput = input_tokens + cache_creation_input_tokens + cache_read_input_tokens`, read
from `claude -p --output-format json`'s own `usage` object — the full cost of the turn's input,
cached or not (owner ruling). The tokenizer identity is unchanged either way: `claude-opus-5-5`'s own,
sampled through whichever path is available, never a third-party approximation.

**The adopted figure was produced by the headless path** (no key in this environment): 5 calls total
against `claude-opus-5-5` (2 baseline + 1 delimiter-cost + 1 per file). Pooled ratio **2.991
bytes/token** over 48,115 normalised bytes / 16,088 measured tokens; per-file spread (error band)
0.304 bytes/token (`.claude/CLAUDE.md` 2.841, `.claude/CONTEXT.md` 3.145). Adopted into
`scripts/lib/token-budget.txt`: budget **16,087 tokens**, `adopted-at 2026-09-28+899be0c` — the
check's own estimate of the always-loaded set's size on adoption day, so the gate reads PASS at the
moment of adoption and any growth beyond it is a FAIL (owner G2 ruling: "ratchet at adoption"). Full
method, raw per-file numbers and the baseline-stability check: `docs/research/logs/token-calibration.md`.

This amendment adds a second measurement path and records the first real adoption; it changes nothing
already decided above — the gate stays offline and zero-dependency either way (`Bun.spawn`, no SDK,
no new package), and Phase 1's "no disposition mechanism exists yet" and "line caps retained as a
secondary signal" both stand unchanged.

## Amended 2026-10-02 (TASK-384 — the disposition route ships, for soft caps only)

Phase 1 said an over-budget always-loaded set is "a FAIL with no escape route" until `TASK-384` ships a
disposition mechanism. It has shipped, and it is **narrower than that sentence promised**.

**What shipped.** A repo-root `.cap-dispositions` (`<path> -- <kind> -- <reason>`, mirroring
`.conformance-exempt`) read by `check-doc-caps` in both implementations — the Shell authority and the TS
port, held in parity by `evals/run-doc-caps-differential.ts`. The closed set of kinds is replace · merge ·
move-to-reference · automate-into-check · retain. A **soft** `OVER-CAP` whose path carries a valid row
prints a named `retained: <path> (<n> > <cap>) [<kind>] -- <reason>` line instead of `OVER-CAP (soft)` —
named on every run, never silent. A malformed row is itself a FAIL: `disposition-reason-missing`,
`disposition-kind-unknown`, `disposition-duplicate`, and `disposition-stale` (the path matches no examined
file, the file is no longer over its cap, or it is FROZEN) — a disposition that outlived its breach must
not linger. Matching is exact: trimmed, case-sensitive, no `./` tolerance.

**What did not ship.** A **hard cap and the token budget are not dispositionable.** A row naming a
hard-capped path is reported (`disposition-hard-cap`) and the hard FAIL stands; the token-budget FAIL is
unchanged. The route for an always-loaded breach is the prose one: a promoted rule must name its
`disposition: <kind>` on the LEARNINGS pointer line, and a rule moved out of `.claude/CLAUDE.md` is recorded
with its destination — that, not a file row, is what makes room under the budget.

**Why.** TD-174's failure was a soft cap that reports and nothing acts: this route gives every standing
`OVER-CAP` a recorded ruling and a reader (the gate names it). Making hard caps and the budget
dispositionable would turn a ratchet into a log line — the same silent-pass the budget exists to prevent.
`retain` is the only kind that keeps the overage and so needs a real justification; the other four describe
a move the file's diff must show.

**What this does not change.** No ADR-034 element moves: `check-doc-caps` is a gate leg, not an engine
rule, and every finding id and severity already in force stays — a dispositioned row is an explicit,
named exclusion of the same kind as `.conformance-exempt`. The engine does not call the checker
(`qa-check.sh` leg 1 does), so ADR-043's adopter contract is untouched: no file, no change. Phase 1's
"no disposition mechanism exists yet" now reads as scoped to the always-loaded budget; the line caps
as a secondary signal stand.
