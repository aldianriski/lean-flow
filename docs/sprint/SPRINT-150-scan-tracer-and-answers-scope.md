---
sprint: 150
slug: scan-tracer-and-answers-scope
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-30
status: active
update_trigger: sprint execute/close events
---

# SPRINT-150 — Scan Tracer and Answers Scope

> **Theme:** EPIC-023's S1 begins with its tracer: can `init` write the conventions a repo actually follows, rather than a
> generic skeleton, from a scan alone? Beside it, the S0 answers file is widened to the profile topics before it freezes,
> which also unblocks the rest of the S0 chain. Without that widening, A2's setup would answer "not decided yet" to S1's
> new questions.

## Scope

**In:** TASK-536's answers-file DoD widened to the seven profile topics, and TASK-536 set ready (T1, TASK-556) · the profile
sections in the core templates and a scan that fills stack and conventions in use, exercised on a portfolio-sveltekit snapshot
through the installed plugin (T2, TASK-547).
**Out (deferred):** TASK-548..555 (blocked on T2 or later S1 work) · TASK-536..545 (S0 chain, blocked on T1 and on each other) ·
TASK-489 (blocked) · TASK-367, 402, 498 (blocked) · TASK-507, 523 (`needs-info`).

## Members

- docs/work/todo/TASK-556-widen-task-536-answers-file-to-the-profile-topics.md
- docs/work/todo/TASK-547-add-repo-profile-sections-and-fill-them-from-a-scan.md

## Plan

### T1 — Widen TASK-536's answers-file coverage to the profile topics `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `docs/work/backlog/TASK-536-prepare-ab-answers-files-and-access-protocol.md`
  · `docs/work/todo/TASK-556-widen-task-536-answers-file-to-the-profile-topics.md`
  · `docs/work/in_progress/TASK-556-widen-task-536-answers-file-to-the-profile-topics.md`
  · `docs/work/done/TASK-556-widen-task-536-answers-file-to-the-profile-topics.md`
Depends-on: none
Cites: `TASK-556` · `TASK-536` · EPIC-023 (S1 intake ruling I-6)

The answers file freezes at pre-registration and is every arm's business evidence, so it has to cover S1's topics before it
freezes. An edit to a backlog task's Done-when, made by this task under the owner's I-6 ruling, not by `/triage`.

**Acceptance:** TASK-536's DoD names the seven profile topics as facts each answers file covers, and TASK-536 is ready.

### T2 — Add the repo-profile sections and fill stack and conventions from a scan `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/references/init.md`
  · `skills/lean-doc-generator/templates/architecture-overview.md.template`
  · `skills/lean-doc-generator/templates/development-coding-standards.md.template`
  · `skills/lean-doc-generator/templates/product-requirements.md.template` · `CHANGELOG.md`
  · `docs/work/todo/TASK-547-add-repo-profile-sections-and-fill-them-from-a-scan.md`
  · `docs/work/in_progress/TASK-547-add-repo-profile-sections-and-fill-them-from-a-scan.md`
  · `docs/work/done/TASK-547-add-repo-profile-sections-and-fill-them-from-a-scan.md`
Depends-on: none
Cites: `TASK-547` · EPIC-023 (H1, D2, D12) · `lean-flow-3-foundation.md` (in `docs/research/`; §6 S1 row)

S1's tracer and H1's premise. The scan-only path is the fallback every unprofiled stack takes, so it is built first and
exercised on a stack no profile matches. Shipped skill and template work: not frozen under ADR-053.

**Acceptance:** a real `init` through the installed plugin on a portfolio-sveltekit snapshot writes stack and conventions in
use that cite the files they were seen in, and the owner reads them as specific to that repo.

## Decisions (pre-locked)

- **D1** — T1 and T2 share no file, so they may run in either order or in parallel. Status moves, Log and sprint-file edits
  commit as bare `sprint(150):` (L-238), and so does a tick on a member in a folder its `Layers:` does not name (L-258). A file
  a task turns out to need joins its `Layers:` by scope-change first (L-229).
- **D2** — T2 is a shipped-skill change, Tier P at minimum (re-tier at G2 if it grows a script): the owner's Codex review loop
  under § Draft reviews' sibling rule for diffs (the revise loop), at most 2 rounds. T1 is Tier P, coordinator read-through.
- **D3** — T2's exercise runs on a snapshot copy in `D:\Research` through the installed plugin, never the original and never an
  A/B repo (I-2); its output carries no lean-flow-internal path (L-015). Before ticking, run every check that reads a touched
  file (L-251).

## Assumptions

- **A1** — The installed plugin can carry T2's change for the exercise: a reinstall from this checkout, or a `--plugin-dir`
  run. *Confirm: T2 G2.*
- **A2** — The portfolio-sveltekit snapshot is copied fresh into `D:\Research` for the run and holds no lean-flow docs.
  *Confirm: T2 build, first step.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-150-scan-tracer-and-answers-scope.md`](logs/SPRINT-150-scan-tracer-and-answers-scope.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
