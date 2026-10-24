---
sprint: 138
slug: validation-where-work-happens
owner: Maintainer
last_updated: 2026-10-24
status: active
plan_commit: ade5c5c3
gates_signed: G1,G2 @ d58c7538
update_trigger: sprint execute/close events
---

# SPRINT-138 — Validation Where Work Happens

> **Theme:** System verify was red at close in at least 5 of the last 8 sprints, each time on a cross-cutting leg that no
> per-task check ran. This sprint moves validation to where work happens: a builder's worktree, every merge-back, the
> reviewer's brief and an off-host gate that one command can run. It also maps the learning loop end to end, so the next
> iteration starts from measured breaks rather than from the newest sighting. Each change is checked from the adopter's side
> (workdoo), not only from our own dogfooding.

## Scope

**In:** an off-host gate runner (T1) · worktree builders and reviewers that run the dependency-needing leg (T2) · a fixed
merge-back check plus tick-at-acceptance (T3) · reviewers that run the tests pinning a change (T4) · the task birth-folder line,
here and in a scaffolded repo (T5) · a one-time worktree cleanup (T6) · learning-loop research and a target architecture (T7).
**Out (deferred):** changing `scripts/qa-check.sh` or its leg list, except registering T1/T3's one test harness (scope-change) · any new gate leg, ledger or ledger field · the TD cohort
review of the 78 low/minor/trivial rows (a separate triage pass) · TASK-367 and TASK-402 (blocked) · writing anything in workdoo.

## Members

- docs/work/todo/TASK-482-one-command-runs-the-full-gate-off-host.md
- docs/work/todo/TASK-483-worktree-builders-run-the-dependency-needing-gate-leg.md
- docs/work/todo/TASK-484-the-merge-back-check-runs-a-fixed-cross-cutting-set.md
- docs/work/todo/TASK-485-a-reviewer-runs-the-tests-that-pin-the-change.md
- docs/work/todo/TASK-486-an-always-loaded-line-says-where-a-new-task-is-born.md
- docs/work/todo/TASK-487-clean-up-the-accumulated-agent-worktrees.md
- docs/work/todo/TASK-488-map-the-learning-loop-end-to-end-and-propose-an-architecture.md

## Plan

### T1 — Run the full gate off-host in one command `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/gate-remote.ts` · `evals/gate-remote.test.ts` · `.claude/CONTEXT.md`
  · `evals/run-workflow-command-fixtures.ts` · `scripts/qa-check.sh`
  · `docs/work/todo/TASK-482-one-command-runs-the-full-gate-off-host.md`
  · `docs/work/in_progress/TASK-482-one-command-runs-the-full-gate-off-host.md`
  · `docs/work/done/TASK-482-one-command-runs-the-full-gate-off-host.md`
Depends-on: none
Cites: `TASK-482` · ADR-053 · `scripts/qa-verdict.ts` · `evals/run-typecheck-population-fixtures.ts`

Other G. A wrapper around the existing gate: no new check, verdict format or run state. Review cap 2.

**Acceptance:** one command runs the full gate off-host and passes only on the remote's own passing verdict.

### T2 — Worktrees run the dependency-needing gate leg `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `TECH-DEBT.md` · `README.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-483-worktree-builders-run-the-dependency-needing-gate-leg.md`
  · `docs/work/in_progress/TASK-483-worktree-builders-run-the-dependency-needing-gate-leg.md`
  · `docs/work/done/TASK-483-worktree-builders-run-the-dependency-needing-gate-leg.md`
Depends-on: T1
Cites: `TASK-483` · TD-194 · `scripts/gate-remote.ts`

Tier P, shipped skill: the Codex review loop applies. T1 is its remote route if this host cannot typecheck in a worktree.

**Acceptance:** a seeded type error in a worktree is reported by its builder before merge-back.

### T3 — A fixed merge-back check, and tick at acceptance `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/merge-check.ts` · `evals/merge-check.test.ts` · `skills/orchestrator/references/dispatch.md`
  · `README.md` · `CHANGELOG.md` · `evals/run-workflow-command-fixtures.ts` · `scripts/qa-check.sh`
  · `docs/work/todo/TASK-484-the-merge-back-check-runs-a-fixed-cross-cutting-set.md`
  · `docs/work/in_progress/TASK-484-the-merge-back-check-runs-a-fixed-cross-cutting-set.md`
  · `docs/work/done/TASK-484-the-merge-back-check-runs-a-fixed-cross-cutting-set.md`
Depends-on: T2
Cites: `TASK-484` · L-218 · L-224 · L-238 · ADR-053

Other G for lean-flow's command; the shipped `skills/orchestrator/references/dispatch.md` change takes the Codex loop.
It follows T2's edit of the same file.

**Acceptance:** every merge-back runs the five legs that reddened closes, and boxes are ticked at acceptance.

### T4 — Reviewers run the tests that pin a change `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` · `TECH-DEBT.md` · `README.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-485-a-reviewer-runs-the-tests-that-pin-the-change.md`
  · `docs/work/in_progress/TASK-485-a-reviewer-runs-the-tests-that-pin-the-change.md`
  · `docs/work/done/TASK-485-a-reviewer-runs-the-tests-that-pin-the-change.md`
Depends-on: none
Cites: `TASK-485` · TD-212

Tier P, shipped skill: the Codex review loop applies. Procedure only, no gate leg.

**Acceptance:** a review reports the host's pinning tests and their results, or says none were found.

### T5 — Say where a new task is born `[size: S · risk: low · class: execution · HITL · J0]`
Layers: `.claude/CONTEXT.md` · `skills/lean-doc-generator/templates/CLAUDE.md.template` · `TECH-DEBT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-486-an-always-loaded-line-says-where-a-new-task-is-born.md`
  · `docs/work/in_progress/TASK-486-an-always-loaded-line-says-where-a-new-task-is-born.md`
  · `docs/work/done/TASK-486-an-always-loaded-line-says-where-a-new-task-is-born.md`
Depends-on: none
Cites: `TASK-486` · TD-222 · `docs/research/logs/epic-017-effectiveness.md` · `.claude/CLAUDE.md`

Tier P. G2 ruled the scaffold template: CLAUDE.md, the one file `init` writes that Claude Code always loads.

**Acceptance:** lean-flow and a fresh `init` scaffold each answer "where is a new task born" from an always-loaded file.

### T6 — Clean up the agent worktrees `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `TECH-DEBT.md`
  · `docs/work/todo/TASK-487-clean-up-the-accumulated-agent-worktrees.md`
  · `docs/work/in_progress/TASK-487-clean-up-the-accumulated-agent-worktrees.md`
  · `docs/work/done/TASK-487-clean-up-the-accumulated-agent-worktrees.md`
Depends-on: none
Cites: `TASK-487` · TD-246

J2: it deletes worktrees, and the disposition is the owner's. Run it when no worktree dispatch is live.

**Acceptance:** only clean, merged, unlocked worktrees are removed, by the owner's recorded disposition.

### T7 — Map the learning loop end to end `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/learning-loop-architecture.md` · `docs/knowledge-index.md`
  · `docs/work/todo/TASK-488-map-the-learning-loop-end-to-end-and-propose-an-architecture.md`
  · `docs/work/in_progress/TASK-488-map-the-learning-loop-end-to-end-and-propose-an-architecture.md`
  · `docs/work/done/TASK-488-map-the-learning-loop-end-to-end-and-propose-an-architecture.md`
Depends-on: none
Cites: `TASK-488` · `docs/LEARNINGS.md` · `spec/STANDARD.md` · `docs/research/epic-017-effectiveness.md`
  · `docs/research/loop-mechanics-audit.md` · `docs/research/night-run-cost.md`

Tier P research: builds nothing. Two Codex review rounds; the baseline is the completed pre-change sprints.

**Acceptance:** the doc maps every hop of the loop with its break points, and ranks next-intake candidates with admissions.

## Owner-action checklist
- [ ] T6: record the worktree disposition (remove · decline) when the list is presented.

## Decisions (pre-locked)

- **D1** — Shared files get one owner and a commit order: `dispatch.md` T2 then T3 (declared `Depends-on`); `.claude/CONTEXT.md`
  T1 then T5. `TECH-DEBT.md`, `README.md` and `CHANGELOG.md` are written by the coordinator serially as bare `sprint(138):`
  commits; builders do not touch them. Status moves, log and sprint-file edits commit as bare `sprint(138):` (L-238).
- **D2** — One `consequence · Tn ·` line per task in this sprint's log, never a multi-task or event key (SPRINT-137 T3).
- **D3** — workdoo is read, never written: every consumer-path box is a read-only check against it.
- **D4** — Shipped-skill or template changes (T2, T3's `dispatch.md`, T4, T5's template) take the Codex review → fix → re-review
  loop; T7 takes two Codex rounds on the doc. Maintainer-only commands (T1, T3's script) take ADR-050's bar plus self-review.

## Assumptions

- **A1** — The owner has provisioned the VPS clone (dev dependencies installed). *Confirm: G2; T1's real run.*
- **A2** — A blocking remote run of about 105–125 s fits one foreground call. *Confirm: T1's real run.*
- **A3** — An in-worktree typecheck may not fit this host's free memory (0.3–0.5 GB). *Confirm: T2's measurement, either branch.*
- **A4** — The fixed set is the five legs that reddened a merge or close, each sighted at least twice (TASK-484 § Assumes).
  *Confirm: G2 against the Retros.*
- **A5** — Shipped wording stays host-generic; lean-flow's commands appear only as examples. *Confirm: each consumer-path box.*
- **A6** — workdoo is a lean-flow adopter (bun, a `verify` script, 29 learnings). *Confirm: G2 read.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-138-validation-where-work-happens.md`](logs/SPRINT-138-validation-where-work-happens.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
