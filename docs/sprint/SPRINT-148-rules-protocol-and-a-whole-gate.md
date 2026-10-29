---
sprint: 148
slug: rules-protocol-and-a-whole-gate
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-29
status: active
plan_commit: a241c29e
gates_signed: G1,G2 @ 0c33d7ce
update_trigger: sprint execute/close events
---

# SPRINT-148 — Rules, Protocol and a Whole Gate

> **Theme:** EPIC-023's S0 moves from foundations to the parts the A/B depends on: the clinic repo gets its full rule set
> and a complete business spec, and the harness gets the unattended trial protocol with the D9 G2 exception. Beside
> them, the off-host gate stops skipping `bun test`. SPRINT-147's close had to run that stage by hand, and every later
> close would have to as well.

## Scope

**In:** the clinic repo's remaining rules (cancellation window, daily cap, patient record required) and its completed
spec, including the time-zone fact SPRINT-147 surfaced (T1, TASK-535) · the trial protocol: G1 pre-signed, G2 under the
D9 exception with file-scope and behaviour-scope checks, and the popup-park branch, exercised on the fixture repo only
(T2, TASK-542) · `gate-remote.ts` runs and judges both stages of the declared gate (T3, TASK-531, TD-279) · it reads the
last verdict line, closes its exit codes and warns on a dirty tree (T4, TASK-532, TD-268).
**Out (deferred):** TASK-536..541, 543..545 (blocked on T1 or later S0 work) · TASK-546 (ready, not chosen) · TASK-367,
402, 489, 498 (blocked) and TASK-507, 523 (`needs-info`).

## Members

- docs/work/todo/TASK-535-add-clinic-ab-remaining-rules-and-spec.md
- docs/work/todo/TASK-542-implement-ab-trial-protocol-with-d9-g2.md
- docs/work/todo/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md
- docs/work/todo/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md

## Plan

### T1 — Add the clinic repo's remaining rules and complete its spec `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/work/todo/TASK-535-add-clinic-ab-remaining-rules-and-spec.md`
  · `docs/work/in_progress/TASK-535-add-clinic-ab-remaining-rules-and-spec.md`
  · `docs/work/done/TASK-535-add-clinic-ab-remaining-rules-and-spec.md`
Depends-on: none
Cites: `TASK-535` · EPIC-023 D3 · `lean-flow-3-foundation.md` (in `docs/research/`; D7) · `ab-clinic-builder-brief.md` (in `docs/research/logs/`)

The rule set and the spec are what the business-rule and lost-detail measures stand on. The app lives outside this repo,
so the in-repo footprint is the member file. The owner's realism review closes it, including where the clinic's working
hours live in time (the SPRINT-147 note on the task).

**Acceptance:** the clinic repo enforces at least five invariants end-to-end with tests, and the external spec records
goal, flows, invariants, quality attributes, non-goals and the facts not visible in code, signed off as realistic by the owner.

### T2 — Implement the unattended trial protocol with the D9 G2 exception `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements.md`
  · `docs/work/todo/TASK-542-implement-ab-trial-protocol-with-d9-g2.md`
  · `docs/work/in_progress/TASK-542-implement-ab-trial-protocol-with-d9-g2.md`
  · `docs/work/done/TASK-542-implement-ab-trial-protocol-with-d9-g2.md`
Depends-on: none
Cites: `TASK-542` · EPIC-023 D4 · `lean-flow-3-foundation.md` (in `docs/research/`; D9) · `night-run.md` (Part 0, in the orchestrator skill's references)

A1+ trials run the lean-flow loop unattended, and G2's subject is produced inside the trial, so the eval-only exception
must be built and proven before any real trial. Fixture repo only (R-c). Maintainer-only harness code, never a gate leg.

**Acceptance:** on the fixture repo, a design outside `Layers:` and a design doing an out-of-scope behaviour each leave G2
unsigned and the trial not-passed, an in-scope control is signed, and a trial that raises a popup is parked and recorded.

### T3 — Make gate-remote run and judge the declared gate's bun test stage `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `scripts/gate-remote.ts` · `evals/gate-remote.test.ts` · `TECH-DEBT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md`
  · `docs/work/in_progress/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md`
  · `docs/work/done/TASK-531-gate-remote-runs-the-declared-gate-s-bun-test-stage.md`
Depends-on: none
Cites: `TASK-531` · TD-279 · ADR-033 · `package.json`

The declared gate chains `qa-check.sh && bun test`, and the off-host verify runs only the first. A defect fix of an existing
maintainer tool, unfrozen under ADR-053.

**Acceptance:** one VPS run prints a verdict for both stages and exits 0 only when both pass; a failing `bun test` under a
passing qa-check exits non-zero.

### T4 — Make gate-remote read the last verdict, close its exit codes, and warn on a dirty tree `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/gate-remote.ts` · `scripts/qa-verdict.ts` · `evals/gate-remote.test.ts` · `evals/qa-verdict.test.ts`
  · `TECH-DEBT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md`
  · `docs/work/in_progress/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md`
  · `docs/work/done/TASK-532-gate-remote-reads-the-last-verdict-and-closes-its-exit-codes.md`
Depends-on: T3
Cites: `TASK-532` · TD-268

Same tool as T3, so it follows T3 in the same tree. The exit-code set and the last-line rule close TD-268.

**Acceptance:** the verdict is the last `QA-CHECK:` line, every exit code is in the stated closed set, and a dirty tree
prints one warning while a clean tree prints none.

## Decisions (pre-locked)

- **D1** — `scripts/gate-remote.ts`, `evals/gate-remote.test.ts`, `TECH-DEBT.md` and `CHANGELOG.md` are shared by T3 and T4,
  owned in that order (T4 depends on T3), sequential in the main tree. T1 and T2 share nothing with each other or with
  T3/T4, so they may run in parallel. Status moves, Log and sprint-file edits commit as bare `sprint(148):` (L-238), and
  so does a tick on a member in a folder its `Layers:` does not name (L-258). A file a task turns out to need joins its
  `Layers:` by scope-change first (L-229).
- **D2** — T2, T3 and T4 are maintainer-only tooling, Other G (ADR-050): a retained must-FAIL fixture per check with a
  green control, one real run, coordinator self-review. T1 is X. No task edits a shipped skill. Any outside review
  runs under the owner's gauntlet rhythm: at most 2 rounds, the rest carried as G2 notes.
- **D3** — Nothing here is frozen under ADR-053: T2 extends the hand-run measurement harness, and T3/T4 are defect fixes of
  an existing tool. No new guard, ledger, field or `.sh`.
- **D4** — Before ticking, run every check that reads a touched file (L-251). At close, system verify runs both stages of the
  declared gate: once T3 lands it does so through `gate-remote.ts` itself, otherwise `bun test` runs by hand (TD-279).
  Prose in governed artifacts names files only when it means them (L-261).

## Assumptions

- **A1** — The clinic repo and its cluster still work from SPRINT-147's state (`D:\Research\clinic-ab\`, `.pgdata/` stopped).
  *Confirm: T1 build, first step.*
- **A2** — The VPS gate runner is reachable with the key route in the owner's memory. *Confirmed 2026-10-29 (three runs).*
- **A3** — The time zone the clinic's hours live in is an owner ruling, not a builder choice. *Confirm: T1 G2 popup.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-148-rules-protocol-and-a-whole-gate.md`](logs/SPRINT-148-rules-protocol-and-a-whole-gate.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
