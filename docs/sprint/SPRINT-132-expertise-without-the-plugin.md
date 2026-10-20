---
sprint: 132
slug: expertise-without-the-plugin
epic: EPIC-007
owner: Maintainer
last_updated: 2026-10-20
status: active
plan_commit: [sha — set at promote]
update_trigger: sprint execute/close events
---

# SPRINT-132 — Expertise Without the Plugin

> **Theme:** EPIC-007's first slice. It writes the contract a workflow pack must meet and proves the contract is not
> software-shaped. Then it extracts the first pack from a procedure this repo really runs (`/diagnose`), and has an agent with
> no lean-flow installed follow it. Contract first, because every later pack is judged against it.

## Scope

**In:** the eight-field pack contract with a reader checklist and its domain-neutral proof (`463`) · the verification pack from
`/diagnose` (`464`) · the no-plugin exercise (`465`).
**Out (deferred):** packs 2–3 (next slice) · ruling EPIC-007's gate condition 5 (next slice) · any mechanical pack checker
(ADR-053; owner ruling D6) · a runtime other than a fresh Claude agent (owner ruling D7).

## Members

- docs/work/todo/TASK-463-write-the-domain-neutral-pack-contract.md
- docs/work/todo/TASK-464-extract-the-verification-pack-from-diagnose.md
- docs/work/todo/TASK-465-exercise-the-verification-pack-with-no-plugin.md

## Plan

### T1 — Write the domain-neutral pack contract `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `packs/` · `spec/packs/` · `skills/diagnose/` · `docs/adr/` · `docs/DECISIONS.md`
  · `docs/work/todo/TASK-463-write-the-domain-neutral-pack-contract.md`
  · `docs/work/in_progress/TASK-463-write-the-domain-neutral-pack-contract.md`
Depends-on: none
Cites: `TASK-463` · EPIC-007 D1 · D5 · D6 · `docs/strategy/adlc/03-ADLC-ROADMAP.md` § Phase E · ADR-053 · ADR-030 · ADR-031

The contract's placement and its layer (A or E) are ruled at this task's G2. The Layers name the candidate trees, so whichever
one is ruled is already declared. The domain-neutral proof is a non-software skeleton validated by a fresh reader.

**Acceptance:** a contract a fresh reader can check a declaration against, with a non-software skeleton passing it.

### T2 — Extract the verification pack from `/diagnose` `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `packs/` · `skills/diagnose/` · `README.md`
  · `docs/work/todo/TASK-464-extract-the-verification-pack-from-diagnose.md`
  · `docs/work/in_progress/TASK-464-extract-the-verification-pack-from-diagnose.md`
Depends-on: T1
Cites: `TASK-464` · EPIC-007 D1 · D2 · `skills/diagnose/SKILL.md` · ADR-010 · `CHANGELOG.md` (coordinator-owned)

The pack is extracted from the maintained skill and does not fork it. It routes by role, never by model.

**Acceptance:** a verification pack that passes T1's checklist and names no model.

### T3 — Exercise the pack with no plugin present `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/logs/workflow-pack-exercises.md`
  · `docs/work/todo/TASK-465-exercise-the-verification-pack-with-no-plugin.md`
  · `docs/work/in_progress/TASK-465-exercise-the-verification-pack-with-no-plugin.md`
Depends-on: T2
Cites: `TASK-465` · EPIC-007 D7 · `evals/run-foreign-repo-fixtures.sh` · L-016

A recorded run, not a retained guard: no new checker or gate leg (ADR-053).

**Acceptance:** a fresh agent in a repo without lean-flow reaches the pack's output contract, with no lean-flow file copied in.

## Decisions (pre-locked)

- **D1** — Shared files: `packs/` and `skills/diagnose/` are in both T1's and T2's Layers. They are owned in chain order,
  T1 → T2 → T3 (each depends on the one before), so the tasks run sequentially. CHANGELOG, this file, its log, the member files
  and EPIC-007's files are coordinator-owned.
- **D2** — Owner rulings at intake (2026-10-19): the slice is the contract plus 1 pack · "checkable" means a reader checklist,
  with no checker (EPIC-007 D6) · "reusable without the plugin" means readable alone by any agent (D7) · the first pack is
  verification, from `/diagnose`.
- **D3** — Review: T1 and T2 change consumer-facing surface, so each gets a scoped Codex review plus the adversarial floor,
  logged as `review · Tn` lines. T3's record is reviewed once by Codex. Codex runs from an empty working directory with "do not
  run any command" (L-239).

## Assumptions

- **A1** — Placement is a G2 ruling: an ADR if it adds a §2 row or a new tree (ADR-030 · ADR-031 are the precedents).
  *Confirm: T1's G2.*
- **A2** — `security-review` has no lean-flow procedure (it is Claude's built-in), so D1 leaves three eligible families; "3–5
  packs" still holds. *Confirm: the next slice's intake.*
- **A3** — The installed plugin is 2.10.0 and the repo is 2.11.0. The G2 builder check is run from the repo's own
  `skills/orchestrator/references/builder-check.md`. *Confirm: the `Skills:` row at the next `/prime`, after reinstalling.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-132-expertise-without-the-plugin.md`](logs/SPRINT-132-expertise-without-the-plugin.md),
> created at promote. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10). -->
