---
sprint: 172
slug: process-cost-census
epic: EPIC-025
owner: Maintainer
last_updated: 2026-11-11
status: active
plan_commit: abb3297d
gates_signed: G1,G2 @ 7b0205cc
update_trigger: sprint execute/close events
---

# SPRINT-172 — Census Every Check and Record Step, With Its Real-Defect History

> **Theme:** EPIC-025 cuts lean-flow's process by evidence, never by impression, so its first sprint builds the evidence. It tests whether SPRINT-171 is a fair baseline, lists every gate check at a pinned revision, classifies each check's FAIL history, and then does the same for the record steps the skills require. Nothing is cut in this sprint.

## Scope

**In:** the baseline test against SPRINT-169 and 170 (TASK-647) · an inventory of every gate check with its fixture and consumer-guard flag (TASK-648) · each check's FAIL history and real defects, with a proposed keep, merge or cut (TASK-649) · the same for skill-required record steps, plus a rulings summary for the owner (TASK-650).
**Out (deferred):** any cut, merge or edit under `skills/`, `scripts/` or `evals/` · the tools that write record lines · the Jev trial · the measuring sprint · any release or push.

## Members

- docs/work/todo/TASK-647-measure-sprint-169-170-and-test-the-baseline.md
- docs/work/todo/TASK-648-inventory-every-gate-check-at-a-pinned-revision.md
- docs/work/todo/TASK-649-classify-each-gate-check-fail-history-and-propose-rulings.md
- docs/work/todo/TASK-650-census-skill-record-steps-and-summarise-rulings.md

## Plan

### T1 — Test the SPRINT-171 baseline against SPRINT-169 and 170 `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/process-cost-census.md`
Depends-on: none
Cites: TASK-647, EPIC-025 D4 and its first open question, `docs/sprint/archive/` and `docs/sprint/archive/logs/` (read only)
D4's targets are half of SPRINT-171's figures, so they are only as good as that baseline. Each count is measured with its command and cross-checked by a second selection.

**Acceptance:** the census's Baseline section gives each sprint's figures with commands, and either keeps SPRINT-171 or carries the owner's median ruling.

### T2 — List every gate check at a pinned revision `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/process-cost-census.md` · `docs/research/logs/process-cost-census.md`
Depends-on: T1
Cites: TASK-648, `scripts/qa-check.sh`, `scripts/lib/`, `evals/` (all read only), `scripts/gate-remote.ts` (read only, run by path)
Rows are per checker or harness, never per printed name; every printed name maps to exactly one row. The real gate run is the coordinator's, off-host.

**Acceptance:** the names a real gate run prints and the names read from source each map to exactly one row, with zero missing and zero extra.

### T3 — Classify each check's FAIL history and propose a ruling `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `docs/research/process-cost-census.md` · `docs/research/logs/process-cost-census.md`
Depends-on: T2
Cites: TASK-649, EPIC-025 D2, `docs/sprint/archive/logs/` (read only)
The bar is EPIC-025 D2. Every real defect cites its log entry, and an unreadable history is `unknown`, never zero.

**Acceptance:** every check row carries its FAIL count, real defects with log evidence and a proposed ruling, and no proposed cut has a real defect or an unknown history.

### T4 — Census the skill-required record steps and summarise the rulings `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/process-cost-census.md` · `docs/research/logs/process-cost-census.md`
Depends-on: T3
Cites: TASK-650, `skills/orchestrator/`, `skills/lean-doc-generator/` (read only, the sprint-log template included), `docs/sprint/archive/logs/` (read only)
Most of SPRINT-171's 43 non-work commits come from these steps. The summary is what the owner rules on before the cutting sprint.

**Acceptance:** every record step has a row reconciled against the skills and the logs, and the summary lists the proposed cuts, merges, keeps, unknowns and owner decisions, with no cut made.

## Decisions (pre-locked)

- **D1** — Nothing is cut, merged or edited outside the census doc in this sprint. Cuts are EPIC-025's next slice, after the owner rules on T4's summary.
- **D2** — Codex builds each task in a worktree, Claude reviews, and the coordinator commits, ticks and runs the gate (memory ruling, 2026-11-02). Review: one scoped reviewer per task, at most 2 rounds.
- **D3** — No paid API call: no Jev, no headless replay. The only cost is the builder and reviewer sessions.

## Assumptions

- **A1** — The pin for T2 is the newest commit reached from `ec4ee660` by docs-only commits, recorded with its reason. *Confirm: T2's G1 lists `git diff --stat ec4ee660..<pin> -- scripts evals skills spec` as empty.*
- **A2** — SPRINT-169 and 170's plan and close commits are read from their archived sprint files' frontmatter. *Confirm: T1's G1.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-172-process-cost-census.md`](logs/SPRINT-172-process-cost-census.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/process-cost-census.md`, `docs/knowledge-index.md` | T1 | Census doc with the Baseline section: SPRINT-169 to 171 measured, the owner's median baseline recorded | low | scoped review re-measured; prose-density 1/0 |
| `docs/research/logs/process-cost-census.md`, `docs/research/process-cost-census.md` | T2 | 103-row gate check inventory at pin `e29815a9` in the appendix; decision doc trimmed to 99 lines | low | 570 names and 236 templates reconciled; review CLEAR at round 2 |
