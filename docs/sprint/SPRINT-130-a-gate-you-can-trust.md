---
sprint: 130
slug: a-gate-you-can-trust
owner: Maintainer
last_updated: 2026-10-19
status: active
plan_commit: 9c782185
update_trigger: sprint execute/close events
---

# SPRINT-130 — A Gate You Can Trust

> **Theme:** three medium debt rows that make the gate say something untrue about the code. ADR-035's own guard has been red
> for thirty sprints over a wrapper it cannot see (TD-154); an always-on fixture reddens on correct code when the clock ticks
> (TD-167); and a one-off `bun test` flake from SPRINT-094 still stands unexplained (TD-135). Each one teaches readers to
> re-run until green, which is how a real red gets waved through.

## Scope

**In:** the gate-discovery guard recognises a wrapped gate (`455`) · a frozen clock and a named empty capture in the qa-budget
ceiling case (`456`) · a measured verdict on the `bun test` flake (`457`).
**Out (deferred):** gate cost on Windows (TD-090 · TD-117 → TASK-367) · TD-165 · TD-194 · TD-244 · TD-099 · the other medium rows ·
TASK-366 · 367 · 402.

## Members

- docs/work/todo/TASK-455-gate-discovery-guard-recognises-a-wrapped-gate.md
- docs/work/todo/TASK-456-freeze-the-clock-in-the-qa-budget-ceiling-case.md
- docs/work/todo/TASK-457-measure-whether-the-bun-test-suite-is-still-flaky.md

## Plan

### T1 — Make the gate-discovery guard recognise a wrapped gate `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `test/gate-discovery/discover.ts` · `test/gate-discovery/discovery-order.test.ts`
  · `docs/work/todo/TASK-455-gate-discovery-guard-recognises-a-wrapped-gate.md`
  · `docs/work/in_progress/TASK-455-gate-discovery-guard-recognises-a-wrapped-gate.md`
Depends-on: none
Cites: `TASK-455` · TD-154 · ADR-033 · ADR-035 · ADR-050 · bare names as the member spells them: `discovery-order.test.ts` ·
  `package.json` (read, not edited) · `TECH-DEBT.md` (coordinator-owned, D1)

`invokes()` accepts a segment only when it starts with the declared command; a trailing-argument rule with non-executing heads
excluded keeps every existing negative while seeing the wrapper.

**Acceptance:** `discovery-order.test.ts` passes on this repository, and an unquoted `echo` of the declared command still reports
a bypass.

### T2 — Freeze the clock in the qa-budget ceiling case `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `evals/run-qa-budget-fixtures.sh`
  · `docs/work/todo/TASK-456-freeze-the-clock-in-the-qa-budget-ceiling-case.md`
  · `docs/work/in_progress/TASK-456-freeze-the-clock-in-the-qa-budget-ceiling-case.md`
Depends-on: none
Cites: `TASK-456` · TD-167 · ADR-042 · ADR-050 · `TECH-DEBT.md` (coordinator-owned, D1)

Case 12 derives its asserted figure from the wall clock; shadowing `date` inside the case makes it a fixture again, harness-only,
clear of the TD-117 cost path.

**Acceptance:** case 12 gives the same verdict under load as idle, still reddens on a seeded ceiling-FAIL, and an empty capture is
named as a harness-environment failure.

### T3 — Measure the `bun test` flake, then close TD-135 or name the test `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/todo/TASK-457-measure-whether-the-bun-test-suite-is-still-flaky.md`
  · `docs/work/in_progress/TASK-457-measure-whether-the-bun-test-suite-is-still-flaky.md`
Depends-on: T1
Cites: `TASK-457` · TD-135 · TD-127 · ADR-051 · `docs/research/logs/qa-gate-timing.md` · `package.json` · `qa-check.sh`
  (read, not edited) · `TECH-DEBT.md` (coordinator-owned, D1)

A measurement, not a fix: eight full-suite runs on two hosts after T1 turns the baseline green, each read by its own summary line.

**Acceptance:** eight recorded summary lines against one commit, and TD-135 either closed as not reproduced or replaced by a named
fix task.

## Decisions (pre-locked)

- **D1** — Shared files and order: no Layers file is shared between tasks; T3 runs after T1 so a green suite is its baseline.
  `TECH-DEBT.md` (TD-154 · TD-167 · TD-135 outcomes), this file, its log and the member files are coordinator-owned.
- **D2** — Owner rulings at intake (2026-10-19): a trailing-argv rule with non-executing heads excluded, test-only, `.gate-command`
  unchanged · freeze the clock in the harness, no `now` seam in the lib · measure 5× VPS + 3× Windows · TD-117 routes to TASK-367.
- **D3** — Review: T1 and T2 are maintainer-only Tier G ("Other G", ADR-050): a must-FAIL fixture + one real-artifact run each, a
  scoped Codex review, and the adversarial floor on a 0-finding pass. Every review is logged as a `review · Tn` line, not prose
  (L-151).

## Assumptions

- **A1** — A POSIX shell function named `date` overrides the binary inside `$(...)` in the case's subshell on both hosts' `sh`.
  *Confirm: T2's real run on Windows/MSYS and on the VPS (dash).*
- **A2** — With TD-154 fixed, the full `bun test` suite is green on both hosts. *Confirm: T3's first run.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-130-a-gate-you-can-trust.md`](logs/SPRINT-130-a-gate-you-can-trust.md), created at
> promote. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10). -->
