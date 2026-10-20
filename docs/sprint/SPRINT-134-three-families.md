---
sprint: 134
slug: three-families
epic: EPIC-007
owner: Maintainer
last_updated: 2026-10-20
status: active
gates_signed: G1,G2 @ 66a6de28
plan_commit: 1384dd75
update_trigger: sprint execute/close events
---

# SPRINT-134 — Three Families

> **Theme:** EPIC-007's second slice. It extracts two more packs from procedures this repo really runs: verification, from the
> scoped review and the close-time verify, and solution analysis, from decision research. That makes three pack families and
> closes condition 2's lower bound. Each pack is checked for model identity (condition 4). With a second family in hand, the
> owner rules whether workflow packs alone satisfy the decision gate (condition 5).

## Scope

**In:** the verification pack (`467`) · the solution-analysis pack (`468`) · the condition-5 ruling (`469`).
**Out (deferred):** a no-plugin exercise per pack (condition 3 is met; owner ruling at intake) · a security-review pack (no
lean-flow procedure, no runs: D1) · packs from `/council` or `/prototype` (one run and none) · any mechanical pack checker (D6,
ADR-053) · a second runtime.

## Members

- docs/work/todo/TASK-467-extract-the-verification-pack-from-review-and-system-verify.md
- docs/work/todo/TASK-468-extract-the-solution-analysis-pack-from-decision-research.md
- docs/work/todo/TASK-469-rule-epic-007-condition-5-two-workflow-families.md

## Plan

### T1 — Extract the verification pack `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `packs/verification.md` · `README.md`
  · `docs/work/todo/TASK-467-extract-the-verification-pack-from-review-and-system-verify.md`
  · `docs/work/in_progress/TASK-467-extract-the-verification-pack-from-review-and-system-verify.md`
  · `docs/work/done/TASK-467-extract-the-verification-pack-from-review-and-system-verify.md`
Depends-on: none
Cites: `TASK-467` · EPIC-007 D1 · D2 · ADR-055 · `packs/CONTRACT.md` · `skills/orchestrator/references/review-scoping.md`

Extracted from the orchestrator's review procedure and the close-time whole-suite verify, the two with logged runs. The builder
check stays out (intake ruling). Tier P.

**Acceptance:** a verification pack passes a fresh reader against the contract's checklist and names no model.

### T2 — Extract the solution-analysis pack `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `packs/solution-analysis.md` · `README.md`
  · `docs/work/todo/TASK-468-extract-the-solution-analysis-pack-from-decision-research.md`
  · `docs/work/in_progress/TASK-468-extract-the-solution-analysis-pack-from-decision-research.md`
  · `docs/work/done/TASK-468-extract-the-solution-analysis-pack-from-decision-research.md`
Depends-on: T1 (README order only, D1)
Cites: `TASK-468` · EPIC-007 D1 · D2 · ADR-055 · `packs/CONTRACT.md` · `skills/lean-doc-generator/templates/RESEARCH.md.template`

Extracted from the RESEARCH template and the 24 template-shaped decision-research docs. Tier P.

**Acceptance:** a solution-analysis pack passes a fresh reader against the contract's checklist and names no model.

### T3 — Rule EPIC-007 condition 5 `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/epic/EPIC-007-workflow-packs.md`
  · `docs/work/todo/TASK-469-rule-epic-007-condition-5-two-workflow-families.md`
  · `docs/work/in_progress/TASK-469-rule-epic-007-condition-5-two-workflow-families.md`
  · `docs/work/done/TASK-469-rule-epic-007-condition-5-two-workflow-families.md`
Depends-on: T1
Cites: `TASK-469` · EPIC-007 open question 3 · L-094 · L-088

The owner rules; the agent assembles the evidence and the options, never the verdict.

**Acceptance:** condition 5 is ticked with the owner's ruling and reason, and the open question agrees with it.

## Decisions (pre-locked)

- **D1** — `README.md` § Workflow packs is shared by T1 and T2: T1 commits first, T2 after, each adding its own line.
  `CHANGELOG.md` and the epic's § Member sprints row are the coordinator's, at close. Status moves the Layers do not
  declare, and log or sprint-file edits, commit as bare `sprint(134):` (CONTEXT § Sprint model, L-238).

## Assumptions

- **A1** — each pack is extracted from its maintained source and does not fork it. *Confirm: G2.*
- **A2** — condition 4 is checked per pack by a fresh reader and a model-name search, with no checker (D6). *Confirm: G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-134-three-families.md`](logs/SPRINT-134-three-families.md) (STANDARD §9 · ADR-014).
> Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
