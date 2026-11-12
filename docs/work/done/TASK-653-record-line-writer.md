---
id: TASK-653
title: "Write consequence, review, scope-change, builder-check, tick and move lines with one tool that refuses missing or ambiguous input"
epic: EPIC-025
sprint: SPRINT-173
priority: P1
size: M
risk: high
autonomy: AFK
class: decision
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-653 — Record-line writer

## Why

Admitted on a measured cost (ADR-053): SPRINT-171's first close run had 12 FAILs, mostly record-line wording and format. Repeated failure also applies (L-224 x6 on ticks). D6: the writer refuses missing or ambiguous input and never defaults to `low`, so a slimmer process never turns a visible FAIL into a silent wrong pass. G2 cap: 2 rounds.
Other G with the owner-chosen bar "Fixtures + real replay": a must-FAIL fixture per refusal plus the real-defect replay, no mutation campaign. It becomes consequential only if a shipped skill names it as an adopter-run step; the skills say "lean-flow's own:".

## Done when

- [x] `bun scripts/lib/record-line.ts <consequence|review|scope-change|builder-check|tick|move> ...` writes, to an explicitly named sprint log or task file, exactly the line each kept check parses: `consequence · Tn · behaviour:low|material · governance:low|high`, `review · Tn · <depth> · ...`, a `### date | scope-change | ...` entry, `builder-check · Tn · ...`, ✓ six commands write the checks' exact lines; the harness runs check-review-depth.sh and check-sprint-by-reference.ts on the output (record-line fixtures 93 pass, 0 fail; 84e938d1)
  a tick with evidence suffix (delegating to `tick-box.ts`), and a `git mv`. Its output passes `check-review-depth.sh` and `check-sprint-by-reference.ts` unchanged.
- [x] A retained fixture replays the census real-defect cases through the writer and then the gate: SPRINT-171 T5 and T3 (consequence recorded governance:high, no review line) still FAIL `review-depth-governance-absent`, and T1 (behaviour:material, no review line) FAILs `review-depth-material-absent`. A completed review line written by the writer turns each green. ✓ replay from the archived SPRINT-171 log: T5 and T3 FAIL review-depth-governance-absent, T1 review-depth-material-absent; a written scoped-reviewer line clears each
- [x] The harness is registered in `scripts/qa-check.sh` leg 12 and the gate prints its verdict. The `tick` path keeps a retained fixture, so TASK-655 may cut H50. ✓ registered opt-in (about 23 s); off-host QA_FULL at 84e938d1 prints PASS eval harness run-record-line-fixtures.ts, QA-CHECK 248 pass 0 fail; wrong-box tick case retained
- [x] Negative: every missing input (either consequence dimension, depth, Tn, log path), any unknown value, and an ambiguous Tn or log resolution exits non-zero, writes nothing (`git hash-object` unchanged), and names the missing field. No default is ever written. One must-FAIL case per refusal. ✓ one must-FAIL case per refusal, each exits 2 naming its field with hash-object unchanged, incl. traversal and junction escapes; scoped review found no default path

## Touches

New `scripts/lib/record-line.ts`; `scripts/lib/tick-box.ts` (reuse, minimal edit if any); new `evals/run-record-line-fixtures.ts` plus `evals/fixtures/record-line/`; `scripts/qa-check.sh` (harness registry line). Overlap: qa-check.sh with TASK-651 and TASK-655. No new `.sh`.

## Assumes

- One TypeScript file run by Bun; `tick` delegates to `tick-box.ts`; it appends only to an explicitly named path.
- Skills keep describing each line's format for consumers, who lack `scripts/`.
- Fixture sources: SPRINT-171's archived log under `docs/sprint/archive/logs/`.

## Tracker

EPIC-025 condition 3 and D6; owner popup, 2026-11-12.
