---
sprint: 115
slug: gate-and-host-cost
owner: Maintainer
last_updated: 2026-10-06
status: active
plan_commit: cede84c
gates_signed: G1,G2 @ 9bbc8be
update_trigger: sprint execute/close events
---

# SPRINT-115 — Gate and Host Cost

> **Theme:** the gate's cost has been argued from estimates and a memory-starved host for six sprints. A second host now exists
> (an Ubuntu VPS that finished `QA_FULL=1` while the maintainer host could not), so measure the total there, rule the deferred
> opt-in against the number, and re-aim the high-severity cost rows at the host envelope they actually depend on. Two
> host-dependent fixtures go first, so the second host's verdict is clean. Two small gate repairs ride along.

## Scope

**In:** the two fixtures host-independent (`403`, TD-224 · TD-225) · the gate total measured as a range and ADR-039's deferred
`layers-observed` opt-in ruled against it (`357`, owns TD-090 · TD-117 · TD-128 · TD-168) · TD-143's cost half re-filed
against the host envelope or ruled closed (`348`) · a ruled-exemption declaration for the `dod-delta` leg (`354`, TD-166) ·
the sprint file's own per-file checkers run at promote (`368`).

**Out (deferred):** `TASK-345` (re-check first: workdoo's supervisor may already enforce the pin) · `TASK-319` / `TASK-320`
(EPIC-015's unattended run) · TD-223 (Windows MAX_PATH) · workdoo's VPS database and temidev's migration (other repos, run
outside this sprint) · any `git push` (owner-reserved).

## Members

- docs/work/todo/TASK-403-make-the-two-host-dependent-fixtures-host-independent.md
- docs/work/todo/TASK-357-re-measure-the-gate-total-after-sprint-103-then-rule-adr-039s-deferred-layers-observed-opt-in.md
- docs/work/todo/TASK-348-re-file-td-143s-cost-half-against-the-host-envelope-not-the-gate.md
- docs/work/todo/TASK-354-give-the-dod-delta-leg-a-ruled-exemption-declaration-so-a-historical-mis-attribution-stops-blocking-every-close.md
- docs/work/todo/TASK-368-run-the-sprint-files-own-per-file-checkers-at-promote-before-plan-locked.md

## Plan

### T1 — Make the two host-dependent fixtures host-independent `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `evals/run-gen-index-locale-fixtures.ts` · `evals/run-qa-budget-position-fixtures.sh` · `TECH-DEBT.md` (TD-224 · TD-225 rows)
Depends-on: none
Cites: `TASK-403` · TD-224 · TD-225 · SPRINT-114 log, 2026-10-06 entry

Tier G; whether it is *consequential* G (ADR-050) is ruled at G2, defaulting up (ADR-029). Both harnesses run inside the gate, so
a fixture that reddens on a fast or dash host turns the off-host route red for reasons unrelated to the code. Fix the assertion,
never widen the window.

**Acceptance:** both harnesses PASS on the VPS and on the Windows host, read from their own verdict lines, and each still reddens
on its seeded design.

### T2 — Measure the gate total, then rule the deferred `layers-observed` opt-in `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/research/logs/qa-gate-timing.md` · `scripts/qa-check.sh` (`eval_harnesses_optin`, only if the ruling admits it)
Depends-on: T1
Cites: `TASK-357` · ADR-039 · ADR-043 · TD-090 · TD-117 · TD-128 · TD-168

The member's unblock condition (> 3 GB free that stays free for ~90 min) has not held on the maintainer host for six sprints.
Measuring on the VPS is what A1 asks G2 to rule. The ruling is owner-reserved (J2); the measurement is not.

**Acceptance:** a Round with a total stated as a range over ≥ 3 completed runs, naming its host and tree, and a ruling on
`layers-observed` that cites that Round by number.

### T3 — Re-file TD-143's cost half against the host envelope `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `TECH-DEBT.md` (TD-143 row) · an ADR only if the ruling is hard to reverse
Depends-on: T2 (its Round is the evidence on off-host cost)
Cites: `TASK-348` · TD-143 · `docs/research/qa-check-memory-profile.md`

The gate holds ~9.5 MB, while the host loses its free memory to other processes. A row aimed at the gate points at nothing.
This settles whether the cost is ours to pay at all.

**Acceptance:** TD-143's open half names a subject that exists, or the row is ruled closed, with the reason written in the row.

### T4 — Give the `dod-delta` leg a ruled-exemption declaration `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-dod-delta.ts` (the member names it `check-dod-delta.ts`) · `evals/dod-delta.test.ts` · `evals/fixtures/dod-delta/` · `evals/run-dod-delta-fixtures.sh`
Depends-on: none
Cites: `TASK-354` · TD-166 · L-205 · ADR-031 · ADR-021

Tier G. Whether it is consequential G (ADR-050) is ruled at G2. Its false negative would let an unruled cross-task tick through a close.
Today a historical mis-attribution can only be cleared by rewriting history or by closing, so the leg produces rulings, not fixes.

**Acceptance:** a declared, ruled commit is reported as a named exemption; an undeclared sibling still FAILs in the same run.

### T5 — Run the sprint file's own per-file checkers at promote `[size: S · risk: low · class: execution · HITL · J1]`
Layers: lean-flow's own promote procedure (where it lives is a G2 question, A2); never the generic `lean-doc-generator` skill
Depends-on: none
Cites: `TASK-368` · TD-177 · TD-178 · L-212 · L-166 · L-015

Tier X. It is run plumbing, not a guard. A finding in the Plan is cheapest at the moment the Plan is written; today the only
runner is the full gate.

**Acceptance:** a sprint file carrying both seeded findings is refused at promote with both named; a clean one passes.

## Owner-action checklist

- [ ] Push `main` once you have reviewed the plan (owner-reserved).
- [ ] Keep the VPS `ubuntu@129.226.95.172` up for T1 and T2.

## Decisions (pre-locked)

- **D1** — `TECH-DEBT.md` is shared by T1 and T3. T1 commits first, and each stages per-hunk (`git add -p`), never a plain `git add`.
- **D2** — No `git push` inside the sprint (owner-reserved).

## Assumptions

- **A1** — The VPS (Ubuntu 24.04, 2 vCPU, 7 GB) is an acceptable measurement host for T2's Round, provided the Round names the host and states that a
  Linux total cannot speak for the Windows host. *Confirm: G2 ruling.*
- **A2** — TASK-368's "this repo's promote procedure" has a home outside the shipped skill (a `scripts/` entry point the maintainer runs at promote).
  *Confirm: G2, against the member's L-015 constraint.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-115-gate-and-host-cost.md`, created lazily at the first entry.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** —

**Cost** —

**Worked**

**Friction**

**Pattern candidate**
