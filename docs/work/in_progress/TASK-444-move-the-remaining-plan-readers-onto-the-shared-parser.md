---
id: TASK-444
sprint: SPRINT-128
title: "Move the remaining Plan readers onto the shared parser, so Cites means the same thing everywhere"
epic: EPIC-022
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-443]
---

# TASK-444 — Move the remaining Plan readers onto the shared parser

## Why

Six `Cites:` readers disagree on continuation lines and heading suffixes: `check-authority.ts` skips a `### T3a` block silently,
the frozen-Plan reader in `check-sprint-by-reference.ts` takes only the first `Cites:` line, and the members CLI folds a
suffixed block into the previous one. A task id merely mentioned on a `Cites:` line governs that member (TD-199). The by-reference
checker and the CLI are reached by `conformance.sh`, so this is consequential G.

## Done when

- [x] `check-authority.ts`, `check-sprint-by-reference.ts`, `sprint-members-cli.ts` and `check-dod-delta.ts` read Plans only ✓ four readers read Plans through parsePlan, own regexes deleted; each keeps its own reading of a non-task heading (6e0a31a7)
      through TASK-443's parser; their own heading and `Cites:` regexes are deleted.
- [x] A `Cites:` task id governs a member only in the declaring position the parser defines; a mention in prose (`split from ✓ mechanical: leading-run rule in six places with must-FAIL + leading control each; seeds L1a-g redden only their case; coordinator re-seeded L1f (1 case)
      TASK-NNN`) no longer masks `member-layers-undeclared` (TD-199), with a retained must-FAIL fixture.
- [x] `conformance.sh .` reports the same verdicts before and after, and the four readers agree with each other on every ✓ mechanical: conformance A/B identical (builder); post-merge run rc 0 no FAIL, deltas only sprint progress; four readers agree on 283 of 283 plans
      archived plan, recorded as a differential.
- [x] Full Tier G bar: seeded breaks on the moved readers each redden exactly their case, and an isolated outside review. ✓ mechanical: seeds L1-L3 per reader; Codex R1 -> R2, the one residual (multi-Cites lines, 0 of 505 blocks) routed to TD by the census-zero rule

## Touches

- scripts/lib/check-authority.ts · scripts/lib/check-sprint-by-reference.ts · scripts/lib/sprint-members-cli.ts ·
  scripts/lib/check-dod-delta.ts · evals/

## Assumes

- The declaring position for a `Cites:` task id is ruled at G2 against the 82 real `Cites:` lines that carry ids.

## Tracker

- EPIC-022 Closed-when 7 · TD-199 · TD-189 (its inconsistency; the shape itself is census-zero) · SPRINT-127 intake recon
