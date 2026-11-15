---
sprint: 177
slug: spec-fix-and-detached-preflight
owner: Maintainer
last_updated: 2026-11-15
status: active
plan_commit: 0ba7c901fea805fdfa09f72ad897eadac49c219e
gates_signed: G1,G2 @ 54ebcdb5
update_trigger: sprint execute/close events
---

# SPRINT-177 — Fix TASK-367's Spec, Then Let the Caller Declare Detachment

> **Theme:** TASK-367's launcher fix is owner-ruled (2026-11-14), but its Touches and Done-when still carry dead paths and a question that is already closed. Wave 1 fixes the spec. Wave 2 builds the `--detached` flag, so a complete pre-flight gate runs only when the caller has declared detachment.

## Scope

**In:** TASK-665 (fix TASK-367's stale text) · TASK-367 (the `--detached` launcher flag, its fixtures and docs).
**Out (deferred):** the cost side of the gate (TD-090, TD-117, TD-171) · EPIC-025 Sprint B (workdoo) · the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-665-fix-task-367-stale-touches-and-done-when-before-promotion.md
- docs/work/todo/TASK-367-let-the-caller-declare-detachment-so-the-pre-flight-gate-can-run-complete.md

## Plan

### T1 — Fix TASK-367's stale Touches, Done-when, state note, Tracker and depends-on `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/work/todo/TASK-367-let-the-caller-declare-detachment-so-the-pre-flight-gate-can-run-complete.md`
Depends-on: none
Cites: TASK-665, `evals/run-night-run-gate-exception-fixtures.sh` (deleted, named only as the dead path) · `evals/run-night-run-rollup-fixtures.sh` · `evals/night-run-rollup.test.ts`, `docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md`, `docs/work/done/TASK-661-run-single-family-conformance-cases-on-a-reduced-spec.md`
Tier P. TASK-367's Done-when is frozen at `plan_commit`. Its edits (box (a), box (d), the `:589` reference) are made only after a `scope-change` Log entry naming TASK-367 and T1 (what broke, impact, re-confirm G2 for the wave-2 task), committed before or with the first Done-when edit. The wave-2 task does not build until its G2 is signed on the fixed text.

**Acceptance:** TASK-367 names only existing paths and the `--detached` flag, and `check-sprint-by-reference.ts --scope-change` reports TASK-367 covered by the scope-change entry.

### T2 — Add the `--detached` launcher flag so the pre-flight gate can run complete `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` · `scripts/qa-check.sh` · `evals/night-run-detached.test.ts` · `skills/orchestrator/references/night-run.md` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-367, `docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md`, `docs/adr/ADR-050-proof-bar-scales-with-consequence.md`, `docs/research/logs/qa-gate-timing.md`
Tier G, other-G bar (D2). The member's `class: decision` is advisory (ADR-010): the decision is ruled, so the Plan runs it as execution. The raise is set inline on the one pre-flight gate call, never exported. Prune unused Layers tokens at G2 (L-240).

**Acceptance:** a `--detached` launch runs the gate with both limits raised, a launch without it does not and refuses by name, and both arms of the `[ -f scripts/qa-check.sh ]` test are exercised.

## Decisions (pre-locked)

- **D1** — Owner ruling 2026-11-15, verbatim "Promote now (Recommended)": promote in parallel with workdoo Sprint B (EPIC-025 D9, frozen 2.23.0 worktree). Verbatim "Both, in order (Recommended)": wave 1 T1, wave 2 T2, one sprint.
- **D2** — Owner ruling 2026-11-15, verbatim "Claude builds, Codex reviews (Recommended)": a Sonnet worker builds, Codex reviews at most 2 rounds. Verbatim "Other G (Recommended)": T2 takes the other-G bar (ADR-050): a must-FAIL fixture, one real detached run, no mutation campaign, no mandatory isolated review. The census ruled the launcher maintainer-only. T2 stays size M.
- **D3** — No new `.sh` (owner ruling 2026-09-09). T2's fixtures are a Bun TypeScript test, `evals/night-run-detached.test.ts`; `night-run.sh` is edited in place.
- **D4** — Net-zero rule: T2 adds nothing to `.claude/CONTEXT.md` or `.claude/CLAUDE.md` (150 of 150 lines; token budget 12683 of 12691). If a cap check fails mid-build, stop and ask.
- **D5** — T1 alone edits TASK-367's spec text; T2 only ticks boxes. Coordinator writes (Log, status moves) commit as bare `sprint(177):`; tasks commit as `sprint(177) Tn: …`.
- **D6** — Owner ruling 2026-11-15, verbatim "T2's G2 after T1 lands (Recommended)": G1 is signed for both; G2 for T1 first; T2's G2 on the fixed Done-when after T1 is committed. `gates_signed` is recorded only once both G2s are signed.

## Assumptions

- **A1** — Only the Done-when body is frozen; Touches, Why, Assumes, Tracker and frontmatter edits need no entry. *Confirm: T1's run of `check-sprint-by-reference.ts`.*
- **A2** — A bun test can drive `night-run.sh` against a stub repo whose stub `qa-check.sh` echoes its received environment. *Confirm: T2's first red test.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-177-spec-fix-and-detached-preflight.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _filled during execution_ | | | | |

## Retro
<!-- Written at close. -->
