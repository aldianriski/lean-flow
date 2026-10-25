---
owner: Maintainer
last_updated: 2026-10-25
update_trigger: a re-calibration round is appended (a new `--calibrate` adoption)
status: active
id: token-calibration-log
tags: [tooling, governance]
domain: governance
related: [ADR-048]
---

# Token calibration — measurement log

> Append-only companion to
> [`../adr/ADR-048-the-always-loaded-read-set-is-budgeted-in-tokens.md`](../../adr/ADR-048-the-always-loaded-read-set-is-budgeted-in-tokens.md).
> ADR-048 is the decision doc here, not a `docs/research/<slug>.md` file (TASK-364 shipped the
> decision straight to an ADR) — this log pairs with it on the same append-only, uncapped shape the
> `research/logs/` row otherwise reserves for a decision doc's own measurement rounds (STANDARD §2,
> ADR-014's mechanism). **Never edit a past round** — a later measurement supersedes an earlier one by
> being appended, and the superseded figure stays visible. The series *is* the evidence.

## Round 1 — first adoption, headless differential (TASK-364 phase 2, 2026-09-28)

**Why headless, not the API.** Owner ruling 2026-09-28: no `ANTHROPIC_API_KEY` in this environment —
a Claude subscription only — and calibration was authorised to run through Claude Code's own headless
mode (`claude -p --output-format json`) instead of the `count_tokens` endpoint `--calibrate`
otherwise prefers when a key is set. The coordinator first verified headless mode works at all:
`claude -p "Reply with exactly: OK" --model claude-opus-5-5 --output-format json` from outside the
repo returned a `usage` object with `input_tokens`, `cache_creation_input_tokens` and
`cache_read_input_tokens` — the three fields this method sums as `totalInput`.

**Method.** Every call ran from a fresh temp directory outside this (or any) repo, so no
`.claude/CLAUDE.md`/memory of any repo was auto-loaded into a measurement of its own size, and every
prompt was sent over **stdin**, never argv (`.claude/CLAUDE.md` is ~23 KB, past what Windows'
`cmd.exe`/MSYS argv quoting reliably carries). A fixed baseline prompt `P` (calibration
instructions, no reference text) was run **twice** — a diverging total would mean a drifting system
prompt or cache state could corrupt every delta computed against it, and calibration would FAIL
rather than adopt a number under that condition. `P` + a fixed delimiter + an **empty** body was run
once to isolate the delimiter's own cost. `P` + delimiter + each always-loaded file's
CRLF-normalised text (`normalizeReadSetText`, the same helper the gate's own estimate uses — B1) was
run once per file. A file's token cost is `totalInput(P + delimiter + file) − totalInput(baseline) −
delimiterCost`. **5 calls total**: 2 baseline + 1 delimiter-cost + 2 files (one per always-loaded
file), against `claude-opus-5-5`.

**Baseline-stability check.** Both baseline runs measured **36,969** total input tokens — identical,
so the delta below is trusted.

**Raw per-file numbers.**

| File | Normalised bytes | Measured tokens | Ratio (bytes/token) |
|---|---|---|---|
| `.claude/CLAUDE.md` | 23,248 | 8,182 | 2.841 |
| `.claude/CONTEXT.md` | 24,867 | 7,906 | 3.145 |
| **Pooled** | **48,115** | **16,088** | **2.991** |

Delimiter cost (isolated once, subtracted from both files above): **36 tokens**.

**Error band.** Per-file spread = max − min = 3.145 − 2.841 = **0.304 bytes/token** across the 2
files — the range a single pooled ratio papers over.

**Adopted.** `scripts/lib/token-budget.txt`: ratio **2.991** (pooled, rounded to 3dp), budget
**16,087 tokens** — the check's own estimate of the always-loaded set's size on adoption day
(`ceil(48115 / 2.991)`), so the gate reads PASS at the moment of adoption and any growth beyond it is
a FAIL (owner G2 ruling: "ratchet at adoption"). `adopted-at 2026-09-28+899be0c` (date plus the short
sha of the adopting commit's parent). Confirmed live: `bun scripts/lib/check-doc-caps.ts` now prints
`PASS  doc-caps: token-budget ~16087 tokens <= budget 16087 (ratio 2.991 bytes/token, claude-opus-5-5
tokenizer; adopted 2026-09-28+899be0c)`.

## Round 2 — budget ratchet after compaction, no recalibration (TASK-506, SPRINT-140, 2026-10-25)

**What moved.** `.claude/CLAUDE.md` was compacted to rule plus pointer: each bullet keeps its rule and its
`L-NNN` / ADR pointer, and its incident narrative was either cut (the cited `L-NNN` already holds it) or moved
verbatim into `docs/LEARNINGS.md` § Durable rules moved out of CLAUDE.md. `.claude/CONTEXT.md` was not touched.

**Method.** No headless or API call. Owner ruling 2026-10-25: the ratio stays the Round 1 pooled **2.991**
bytes/token; only the budget moves, to the check's own estimate (`bun scripts/lib/check-doc-caps.ts`,
`ceil(normalised bytes / 2.991)`) at **zero headroom** — ADR-048's "ratchet at adoption" rule.

| | `.claude/CLAUDE.md` | `.claude/CONTEXT.md` | Pair |
|---|---|---|---|
| Before — lines / words / bytes | 80 / 2,432 / 15,700 | 149 / 3,998 / 26,512 | 229 / 6,430 / 42,212 |
| After — lines / words / bytes | 79 / 1,715 / 11,445 | 149 / 3,998 / 26,512 | 228 / 5,713 / 37,957 |
| Estimated tokens at 2.991, before → after | ~5,250 → ~3,827 | ~8,864 (unchanged) | **~14,114 → ~12,691** |

The gate line before: `PASS  doc-caps: token-budget ~14114 tokens <= budget 16087 (ratio 2.991 bytes/token,
claude-opus-5-5 tokenizer; adopted 2026-09-28+899be0c)`. The budget in `scripts/lib/token-budget.txt` drops
**16,087 → 12,691**, `adopted-at 2026-10-25+bc0cac72` (date plus the short sha of the adopting commit's parent).

**Caveat on the ratio.** It is unchanged by ruling, not re-measured. At Round 1 `.claude/CLAUDE.md` alone
measured **2.841** bytes/token against `.claude/CONTEXT.md`'s 3.145, so the pooled 2.991 leans on the file mix of
2026-09-28. CLAUDE.md is now a smaller share of the pair, and the narrative it lost may not tokenize like the
rules it kept, so the pooled ratio may now be slightly off in either direction. A future `--calibrate` run can
correct it; until then the estimate carries Round 1's error band (0.304 bytes/token per-file spread).
