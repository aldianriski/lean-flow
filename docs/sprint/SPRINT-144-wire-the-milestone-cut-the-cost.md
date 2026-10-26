---
sprint: 144
slug: wire-the-milestone-cut-the-cost
owner: Maintainer
last_updated: 2026-10-26
status: active
plan_commit: 79ff7e89
update_trigger: sprint execute/close events
---

# SPRINT-144 — Wire the Milestone, Cut the Cost

> **Theme:** 2.17.0 shipped a First-milestone proof goal that nothing reads yet, and SPRINT-143's largest cost was a
> humanizer child per commit message that changed none of fifteen. This sprint gives the proof goal its reader, moves
> commit messages to the inline humanizer path, and lands the three small template deltas left from the Codex research.

## Scope

**In:** commit messages humanized inline with the catalogs read once per session (T1) · the decomposer builds the
riskiest ready slice first, reading the proof goal (T2) · an optional Revisit-when line in the ADR template (T3) · step
owners in the flows template (T4) · data scope in the authentication role table (T5).
**Out (deferred):** TASK-523 and TASK-507 (`needs-info`) · TASK-367, 402, 489, 498 (blocked) · TD-276 and TD-277
(filed, not scheduled) · PR bodies and documents (they keep the child humanizer pass).

## Members

- docs/work/todo/TASK-524-humanize-commit-messages-inline-once-per-session.md
- docs/work/todo/TASK-520-build-the-riskiest-ready-slice-first.md
- docs/work/todo/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md
- docs/work/todo/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md
- docs/work/todo/TASK-518-add-data-scope-to-the-authentication-role-table.md

## Plan

### T1 — Humanize commit messages inline, catalogs once per session `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/embedded.md` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-524-humanize-commit-messages-inline-once-per-session.md`
  · `docs/work/in_progress/TASK-524-humanize-commit-messages-inline-once-per-session.md`
  · `docs/work/done/TASK-524-humanize-commit-messages-inline-once-per-session.md`
Depends-on: none
Cites: `TASK-524` · TD-278 · L-252 · `evals/fixtures/humanizer/fact-keep/`

Fifteen child passes in SPRINT-143 cost ~73k tokens each and changed nothing. Owner ruling at intake: commit messages use
the existing inline path; PR bodies and documents keep the child. First in the sprint so every later commit uses it.

**Acceptance:** commit messages after T1 spawn no humanizer child, and the retained fact-keep sample keeps every fact
over three inline runs.

### T2 — Build the riskiest ready slice first, reading the proof goal `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/lean-doc-generator/templates/product-requirements.md.template`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-520-build-the-riskiest-ready-slice-first.md`
  · `docs/work/in_progress/TASK-520-build-the-riskiest-ready-slice-first.md`
  · `docs/work/done/TASK-520-build-the-riskiest-ready-slice-first.md`
Depends-on: T1
Cites: `TASK-520` · `TASK-516` · `docs/research/codex-run-project-pipeline.md` (9)

The proof goal shipped in 2.17.0 has no reader. This task is it, and it re-adds the template sentence that SPRINT-143
removed because it claimed a reader ahead of the code. Depends on T1 for `CHANGELOG.md` order only (D1).

**Acceptance:** one real decomposition lists the slice that removes the most uncertainty first, citing the proof goal.

### T3 — Add an optional Revisit-when line to the ADR template `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/ADR.md.template` · `skills/lean-doc-generator/references/ADR-example.md`
  · `CHANGELOG.md`
  · `docs/work/todo/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md`
  · `docs/work/in_progress/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md`
  · `docs/work/done/TASK-515-add-an-optional-revisit-when-line-to-the-adr-template.md`
Depends-on: T2
Cites: `TASK-515` · STANDARD §4 · `scripts/lib/conformance-engine.sh` (S4 checks)

A decision should name what would reopen it. An optional header line only; making it required would change §4 and the
engine. Depends on T2 for `CHANGELOG.md` order only (D1).

**Acceptance:** the example ADR fills the line and the engine's S4 checks still pass on it.

### T4 — Record step owners in the flows template `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/flows.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
  · `docs/work/in_progress/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
  · `docs/work/done/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`
Depends-on: T3
Cites: `TASK-517` · `docs/research/codex-run-project-pipeline.md` (6)

Business flows break at handovers; each step names the record it changes, its owner and the next owner. Depends on T3 for
`CHANGELOG.md` order only (D1).

**Acceptance:** the template's steps carry record changed, owner and next owner, within its line cap.

### T5 — Add data scope to the authentication role table `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/architecture-authentication.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-518-add-data-scope-to-the-authentication-role-table.md`
  · `docs/work/in_progress/TASK-518-add-data-scope-to-the-authentication-role-table.md`
  · `docs/work/done/TASK-518-add-data-scope-to-the-authentication-role-table.md`
Depends-on: T4
Cites: `TASK-518` · `docs/research/codex-run-project-pipeline.md` (7)

Permission bugs live in which data a role reaches; hiding a control is not enforcement. Depends on T4 for `CHANGELOG.md`
order only (D1).

**Acceptance:** the role table gains a data-scope column and the enforcement line.

## Owner-action checklist

- [ ] T2: name one real decomposition to exercise on (or approve a scratch intent).
- [ ] Close: push the release.

## Decisions (pre-locked)

- **D1** — `CHANGELOG.md` is shared by all five: each adds its `## [Unreleased]` line in T order, so execution is
  sequential in the main tree (T1 → T5). Status moves, log and sprint-file edits commit as bare `sprint(144):` (L-238).
- **D2** — Every task changes a shipped file, so each takes the Codex review → fix → re-review loop; cap 2 rounds, a
  third only by owner ruling. One `consequence · Tn ·` line per task in the log.
- **D3** — Before ticking, run every check that reads the touched file: `evals/` harnesses and gate legs alike, each as
  itself (L-251, promoted at this promote).

## Assumptions

- **A1** — TASK-524's box 3 says "the next sprint's commit messages". Read as the commits after T1 lands, which include
  the rest of this sprint; otherwise the box can only close in SPRINT-145. *Confirm: owner ruling at G2.*
- **A2** — TASK-520 also re-adds the template sentence that names the decomposer as the proof goal's reader, which is
  why T2's `Layers:` names the requirements template. *Confirm: T2 G2.*
- **A3** — TASK-515's line is optional and outside §4's required sections, so the conformance engine needs no change.
  *Confirm: T3 G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-144-wire-the-milestone-cut-the-cost.md`](logs/SPRINT-144-wire-the-milestone-cut-the-cost.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
