---
sprint: 130
slug: a-gate-you-can-trust
owner: Maintainer
last_updated: 2026-10-19
status: closed
plan_commit: 9c782185
gates_signed: G1,G2 @ 9345cb17
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
| `test/gate-discovery/discover.ts` · `test/gate-discovery/discovery-order.test.ts` | T1 | `invokes()` sees a wrapped gate (trailing whole tokens, non-executing heads excluded); ADR-035's guard green again | Low | gate-discovery 15/0; seeded must-FAIL red then restored |
| `evals/run-qa-budget-fixtures.sh` | T2 | case 12 reads a frozen clock; an empty capture is named with its exit status | Low | harness PASS; seeded ceiling-FAIL and both empty shapes fire, restores cmp-identical |
| `TECH-DEBT.md` · `docs/LEARNINGS.md` · `CHANGELOG.md` | close | TD-154 · 167 · 135 resolved, TD-117 routed; L-237; an unreleased CHANGELOG block | Low | system verify 299/0 |

## Retro

**Retrieval check** — no miss. L-151's lesson from SPRINT-129 held: every review was logged as a `review · Tn` line the moment
it fired (D3), and system verify went green first time. L-187/L-186 held too: both seeded breaks and both empty-capture seeds were
cmp-proven landed and restored.

**Cost** — coordinator + 2 Sonnet builders (T1, T2, each with one bounded retry) + 1 Explore recon at intake + 1 Codex reviewer over
5 rounds (`gpt-6-astra`). Builder spend ≈ 140k tokens (T1 72k · T2 71k) + recon 68k for 3 S members; T3 was coordinator-run. Eight
`bun test` runs (5 VPS, 3 Windows) and one `QA_FULL` system verify on the VPS (299/0, 111 s).

**Worked**
- The adversarial floor earned its keep for the second sprint running: T2's first review was clean, and the assume-guilty pass found
  the empty-capture line asserting a cause a code regression also produces — fixed, and both empty shapes seeded and fire.
- The Spec comparand caught the coordinator's own drift: the G2 wording loosened TASK-455's frozen "trailing" to "ending or followed
  by a space"; the review, briefed with the Done-when, caught the interior-run hole (L-237).
- Recon before the grill turned TD-135 from a worry into a measurement: the suspect test was gone and the ledger's impact line was
  wrong, so the task measured instead of chasing a ghost.

**Friction**
- The coordinator's G2 paraphrase of a frozen criterion (above) cost one review round.
- A `cd` into a builder worktree moved the session's working directory mid-review; recovered by absolute paths from then on.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- L-237 (new, count 1): a G2 design that paraphrases a frozen Done-when can loosen it, and the builder follows the paraphrase.

**Owner actions**
- Push `main` (release 2.10.0, SPRINT-129 and this sprint are committed, not pushed).
