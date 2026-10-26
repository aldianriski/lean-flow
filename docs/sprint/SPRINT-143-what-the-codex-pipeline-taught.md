---
sprint: 143
slug: what-the-codex-pipeline-taught
owner: Maintainer
last_updated: 2026-10-26
status: active
gates_signed: G1,G2 @ 8424fa09
plan_commit: dce1cd3b
update_trigger: sprint execute/close events
---

# SPRINT-143 — What the Codex Pipeline Taught

> **Theme:** The owner's Codex `run-project-pipeline` skill closes gaps lean-flow still has
> (`docs/research/codex-run-project-pipeline.md`). This sprint lands the six P2 deltas: resume reads back a write
> whose outcome is unknown, a review finding can be rejected with evidence, `init` records the first milestone,
> working behaviour is pinned before it changes, and `/prototype` gains a customer-review demo and a design direction.

## Scope

**In:** readback before retry on resume (T1) · `rejected`/`deferred` review outcomes with a fixture (T2) · a
First-milestone section filled by `init` (T3) · a pin-existing-behaviour route (T4) · a `/prototype` demo branch (T5) ·
a design-direction brief in the `/prototype` UI branch (T6).
**Out (deferred):** TASK-515 · 517 · 518 (P3 template deltas) · TASK-520 (blocked on TASK-516) · TASK-523 (`needs-info`,
no ADR-053 reason) · a new skill or agent (ruled out in the research doc) · TASK-367, 402, 489, 498 (blocked) · TASK-507.

## Members

- docs/work/todo/TASK-513-reconcile-an-uncertain-write-before-retrying-it-on-resume.md
- docs/work/todo/TASK-514-let-a-review-finding-be-rejected-with-evidence-or-deferred-with-impact.md
- docs/work/todo/TASK-516-add-a-first-milestone-section-to-the-requirements-template.md
- docs/work/todo/TASK-519-pin-existing-behaviour-before-changing-it.md
- docs/work/todo/TASK-521-add-a-customer-review-demo-branch-to-prototype.md
- docs/work/todo/TASK-522-add-a-design-direction-brief-to-the-prototype-ui-branch.md

## Plan

### T1 — Read back an uncertain write before retrying it on resume `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/handoff/SKILL.md` · `skills/prime/SKILL.md` · `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-513-reconcile-an-uncertain-write-before-retrying-it-on-resume.md`
  · `docs/work/in_progress/TASK-513-reconcile-an-uncertain-write-before-retrying-it-on-resume.md`
  · `docs/work/done/TASK-513-reconcile-an-uncertain-write-before-retrying-it-on-resume.md`
Depends-on: none
Cites: `TASK-513` · `docs/research/codex-run-project-pipeline.md` (1) · `.out-of-scope/checkpointed-run-state.md` · CLAUDE.md edit-safety (c)

A timeout is not a failure: a worktree agent, a remote gate run or a merge-back can land after the session lost sight
of it. Prose only, no state file (the out-of-scope guardrail).

**Acceptance:** a handoff naming an unknown write, resumed, shows the readback before any retry.

### T2 — Let a review finding be rejected with evidence or deferred with impact `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/night-run.md`
  · `scripts/night-run.sh` · `evals/fixtures/revise-loop-ceiling/` · `evals/run-revise-loop-ceiling-fixtures.sh`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-514-let-a-review-finding-be-rejected-with-evidence-or-deferred-with-impact.md`
  · `docs/work/in_progress/TASK-514-let-a-review-finding-be-rejected-with-evidence-or-deferred-with-impact.md`
  · `docs/work/done/TASK-514-let-a-review-finding-be-rejected-with-evidence-or-deferred-with-impact.md`
Depends-on: T1
Cites: `TASK-514` · ADR-022 · L-251 · `docs/research/codex-run-project-pipeline.md` (2) · `evals/fixtures/revise-loop/` (read by box 4)

A false positive today reaches the owner as `still-open`. Owner ruling at intake: the builder may reject with evidence
when attended; an unattended run parks it. Depends on T1 for `CHANGELOG.md` order only (D1).

**Acceptance:** a `rejected` with no evidence fails its retained fixture with a named finding while a sibling with
evidence stays green, and the existing revise-loop fixtures still pass.

### T3 — Add a First-milestone section that `init` fills from the owner `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/product-requirements.md.template` · `skills/lean-doc-generator/references/init.md`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-516-add-a-first-milestone-section-to-the-requirements-template.md`
  · `docs/work/in_progress/TASK-516-add-a-first-milestone-section-to-the-requirements-template.md`
  · `docs/work/done/TASK-516-add-a-first-milestone-section-to-the-requirements-template.md`
Depends-on: T2
Cites: `TASK-516` · `docs/research/codex-run-project-pipeline.md` (5) · STANDARD §2

Proof goal, stopping condition and integration boundary keep a first slice from growing past what it must prove.
Depends on T2 for `CHANGELOG.md` order only (D1).

**Acceptance:** a greenfield `init` run on a scratch repo fills the section from the owner's answers and leaves
`[CUSTOMIZE]` where none was given.

### T4 — Pin working behaviour before changing it `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/` · `.claude/CONTEXT.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-519-pin-existing-behaviour-before-changing-it.md`
  · `docs/work/in_progress/TASK-519-pin-existing-behaviour-before-changing-it.md`
  · `docs/work/done/TASK-519-pin-existing-behaviour-before-changing-it.md`
Depends-on: T1, T3
Cites: `TASK-519` · `docs/research/codex-run-project-pipeline.md` (8)

Owner ruling at intake: it lives in `/orchestrator`'s routing and G2, not `/tdd`, because the owner's loop does not use
`/tdd`. Depends on T3 for `CHANGELOG.md` order and on T1 for `skills/orchestrator/SKILL.md` (D1, D2).

**Acceptance:** one real change to existing behaviour runs the pin first, and a difference the task did not name is
reported rather than absorbed.

### T5 — Add a customer-review demo branch to `/prototype` `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `skills/prototype/SKILL.md` · `skills/prototype/references/demo.md` · `CHANGELOG.md` · `README.md`
  · `docs/work/todo/TASK-521-add-a-customer-review-demo-branch-to-prototype.md`
  · `docs/work/in_progress/TASK-521-add-a-customer-review-demo-branch-to-prototype.md`
  · `docs/work/done/TASK-521-add-a-customer-review-demo-branch-to-prototype.md`
Depends-on: T4
Cites: `TASK-521` · `docs/research/codex-run-project-pipeline.md` (10) · L-256

A demo for customer review needs its own contract and honest claims. Owner ruling at intake: a third `/prototype` branch,
retired after the recorded session, roster unchanged. Depends on T4 for `CHANGELOG.md` order only (D1).

**Acceptance:** one real brief routed to the branch yields a contract, a task script, and no claim of validation
without a recorded session.

### T6 — Add a design-direction brief to the `/prototype` UI branch `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/prototype/references/ui.md` · `skills/prototype/SKILL.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-522-add-a-design-direction-brief-to-the-prototype-ui-branch.md`
  · `docs/work/in_progress/TASK-522-add-a-design-direction-brief-to-the-prototype-ui-branch.md`
  · `docs/work/done/TASK-522-add-a-design-direction-brief-to-the-prototype-ui-branch.md`
Depends-on: T5
Cites: `TASK-522` · `skills/orchestrator/references/review-scoping.md` § UI floor (the deferral shape) · `skills/lean-doc-generator/templates/DESIGN.md.template`
  · `DESIGN.md` (the adopter's file, offered at run time, never edited here) · `docs/research/codex-run-project-pipeline.md` (11)

Direction first, then variants; defer to `frontend-design` or `anti-slop` when installed, keep a floor when not. Depends
on T5 for `skills/prototype/SKILL.md` and `CHANGELOG.md` (D1, D2).

**Acceptance:** one real UI question gets a direction brief before its variants, and the winner's direction is offered
into `DESIGN.md`, never written there without the owner.

## Owner-action checklist

- [ ] T3: supply a scratch greenfield repo path for the consumer-path run (or approve one under `D:\Research`).
- [ ] T5: name one real customer brief to exercise the demo branch on.
- [ ] Close: push the release.

## Decisions (pre-locked)

- **D1** — `CHANGELOG.md` is shared by all six: each task adds its `## [Unreleased]` line in T order, so execution is
  sequential in the main tree (T1 → T6). Status moves, log and sprint-file edits commit as bare `sprint(143):` (L-238).
- **D2** — Shared skill files have one owner at a time, in T order: `skills/orchestrator/SKILL.md` T1 then T4;
  `skills/prototype/SKILL.md` T5 then T6.
- **D3** — `skills/orchestrator/SKILL.md` is at 140/140 and `skills/prime/SKILL.md` at 138/140: new procedure goes into
  the skill's `references/`, with at most a pointer line in SKILL.md, offset by a trim if needed (ADR-006).
- **D4** — Every task changes a shipped file, so each takes the Codex review → fix → re-review loop; cap 2 rounds, a third
  only by owner ruling. One `consequence · Tn ·` line per task in the log.
- **D5** — Before ticking, search `evals/` for each touched path and run those harnesses (L-251).

## Assumptions

- **A1** — T4's `.claude/CONTEXT.md` edit fits within its 150 cap (149 now), or is dropped in favour of the orchestrator
  reference alone. *Confirm: T4 G2.*
- **A2** — T2's outcome words are read by fixtures only, not a gate leg, so it stays tier X. *Confirm: T2 G2 (re-tier if not).*
- **A3** — Headless or consumer-path runs go in `D:\Research` copies, never `D:\Project\workdoo`; briefs name secret files
  as off-limits (L-247). *Confirm: per task at G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-143-what-the-codex-pipeline-taught.md`](logs/SPRINT-143-what-the-codex-pipeline-taught.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
