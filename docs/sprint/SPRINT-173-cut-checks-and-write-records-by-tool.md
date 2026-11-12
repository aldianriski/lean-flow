---
sprint: 173
slug: cut-checks-and-write-records-by-tool
epic: EPIC-025
owner: Maintainer
last_updated: 2026-11-12
status: active
gates_signed: G1,G2 @ b1ed060b
plan_commit: 7503d39d
update_trigger: sprint execute/close events
---

# SPRINT-173 — Cut the Zero-Defect Checks and Write the Record Lines by Tool

> **Theme:** EPIC-025's Sprint A (D8). It acts on the SPRINT-172 census and the owner's rulings: 28 zero-defect checks and harnesses go, 13 record steps merge, and one tool writes the record lines a gate check parses.
> It also runs the 1 USD Jev trial and ends with the MINOR release that Sprint B, the workdoo and measuring sprint, runs on.

## Scope

**In:** the 28 cuts (TASK-651, TASK-655) · moves and ticks riding in a task's own commits (TASK-652) · the record-line writer (TASK-653) · the Jev consequence trial (TASK-654) · the two skill merge passes (TASK-656, TASK-657) · the MINOR release, stopped before push (TASK-658).
**Out (deferred):** any census-kept row, including the 6 borderline rows, the 17 unknown-history rows and R09 · the measuring sprint and the workdoo run (Sprint B) · `/triage` of TASK-489, TASK-627 and TASK-629 · any push or tag · editing permission settings.

## Members

- docs/work/todo/TASK-651-cut-zero-defect-gate-checks-and-harnesses.md
- docs/work/todo/TASK-652-one-commit-per-task-adr-045-and-layers-observed.md
- docs/work/todo/TASK-653-record-line-writer.md
- docs/work/todo/TASK-654-jev-consequence-classification-trial.md
- docs/work/todo/TASK-655-cut-zero-defect-harnesses.md
- docs/work/todo/TASK-656-orchestrator-skill-merges-and-writer-wiring.md
- docs/work/todo/TASK-657-lean-doc-generator-skill-merges-and-writer-wiring.md
- docs/work/todo/TASK-658-minor-release-epic-025.md

## Plan

### T1 — Cut 9 zero-defect checks and their 7 harnesses `[size: M · risk: med · class: mechanical-ingest · AFK · J0]`
Layers: `scripts/qa-check.sh` · `scripts/lib/check-qa-budget-default.sh` · `scripts/lib/check-handoff-state.sh` · `scripts/lib/check-research-archive.sh` · `scripts/lib/check-task-origin.sh` · `scripts/lib/check-work-type.ts` · `scripts/lib/check-approval-envelope.sh` · `scripts/lib/qa-budget-check.sh` · `scripts/lib/sprint-members.ts`
  `evals/run-prose-density-fixtures.ts` · `evals/run-qa-budget-default-fixtures.sh` · `evals/run-task-origin-fixtures.sh` · `evals/run-work-type-fixtures.sh` · `evals/run-research-archive-fixtures.sh` · `evals/run-approval-envelope-fixtures.sh` · `evals/run-handoff-state-fixtures.sh`
  `evals/fixtures/prose-density/` · `evals/fixtures/handoff-state/` · `evals/fixtures/research-archive/` · `evals/fixtures/task-origin/` · `evals/fixtures/work-type/` · `evals/fixtures/approval-envelope/` · `evals/README.md` · `evals/run-emitter-column-fixtures.ts` · `skills/lean-doc-generator/references/handoff-reconciliation.md` · `docs/QA.md`
  `scripts/night-run.sh` · `skills/orchestrator/references/night-run.md` · `evals/run-qa-budget-fixtures.sh`
  `scripts/merge-check.ts` · `evals/merge-check.test.ts` · `skills/orchestrator/references/dispatch.md` · `evals/run-workflow-command-fixtures.ts`
Depends-on: none
Cites: TASK-651, EPIC-025 D2 and D7, `docs/research/logs/process-cost-census.md` (read only), `check-prose-density.ts` (kept under `scripts/lib/`, read only)
The census appendix names each row's script, harness and fixture. A script stays when a kept caller still imports it, so `check-prose-density.ts` stays and only G0268's leg goes.

**Acceptance:** the gate no longer prints the 16 cut rows, every census-kept check still fails its must-FAIL fixture by name, and the full gate is green.

### T2 — Let a task's own commit carry its moves and ticks `[size: S · risk: med · class: execution · AFK · J1]`
Layers: `docs/adr/ADR-045-the-work-item-store.md` · `docs/knowledge-index.md` · `scripts/lib/check-layers-observed.ts` · `evals/layers-observed.test.ts` · `evals/run-layers-observed-test-fixtures.ts` · `evals/fixtures/layers-observed/`
Depends-on: none
Cites: TASK-652, EPIC-025 D7 (R14), L-258
The amendment is the owner's ruling. The checker change is the one that lets a `Tn:` commit carry its own task file without opening the door to another task's file.

**Acceptance:** ADR-045 D6 carries the dated amendment, and `layers observed` admits a member's own task file while still failing another task's.

### T3 — Build the record-line writer `[size: M · risk: high · class: decision · AFK · J1]`
Layers: `scripts/lib/record-line.ts` · `scripts/lib/tick-box.ts` · `evals/run-record-line-fixtures.ts` · `evals/fixtures/record-line/` · `scripts/qa-check.sh`
Depends-on: T1 (shared `scripts/qa-check.sh`, D1)
Cites: TASK-653, EPIC-025 D6, `check-review-depth.sh` and `check-sprint-by-reference.ts` (under `scripts/lib/`, read only, run by path), SPRINT-171 T5 (that sprint's T5, not this Plan's), TASK-655 (consumes the `tick` fixture), `docs/sprint/archive/logs/SPRINT-171-*.md` (read only)
The writer refuses missing or ambiguous input and never writes a default, so a slimmer process cannot turn a visible FAIL into a silent pass. The bar is the owner's "Fixtures + real replay".

**Acceptance:** the replay of SPRINT-171 still FAILs, T5 and T3 with `review-depth-governance-absent` and T1 with `review-depth-material-absent`, and every refusal case writes nothing and names its field.

### T4 — Trial Jev on consequence classification `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/jev-consequence.ts` · `scripts/jev-done-when.ts`
Depends-on: none
Cites: TASK-654, TASK-627, SPRINT-171 T5 (that sprint's T5, not this Plan's), EPIC-025 D3 and D7, `docs/research/jev-use-cases.md` (read only)
One paid run, capped at 1.00 USD, with the key read from `jev_key` only. Jev is kept only if it flags SPRINT-171 T5's owed review and never downgrades one.

**Acceptance:** the spend and the keep-or-drop ruling are recorded, and a run without a key or budget stops at spend 0 USD.

### T5 — Cut 12 zero-defect harnesses `[size: M · risk: low · class: mechanical-ingest · AFK · J0]`
Layers: `evals/run-sprint-family-spec-reduction-fixtures.ts` · `evals/run-sprint-close-fixtures.sh` · `evals/run-revise-loop-ceiling-fixtures.sh` · `evals/run-system-verify-fixtures.sh` · `evals/run-reap-terminal-fixtures.sh` · `evals/run-night-run-gate-exception-fixtures.sh` · `evals/run-night-run-outcome-fixtures.sh`
  `evals/run-promote-check-fixtures.ts` · `evals/run-tick-box-fixtures.ts` · `evals/run-workflow-command-fixtures.ts` · `evals/run-doc-caps-differential.ts` · `evals/run-night-run-rollup-differential-parity.ts`
  `evals/fixtures/sprint-close/` · `evals/fixtures/revise-loop-ceiling/` · `evals/fixtures/system-verify/` · `evals/fixtures/night-run-outcome/` · `evals/fixtures/promote-check/` · `evals/fixtures/night-run-gate-exceptions/`
  `scripts/qa-check.sh` · `evals/README.md` · `evals/run-sprint-family-fixtures.sh` · `docs/QA.md`
  `evals/doc-caps.test.ts` · `evals/run-doc-caps-fixtures.sh` · `scripts/lib/check-night-run-rollup.ts` · `scripts/lib/check-night-run-rollup.sh` · `evals/run-night-run-rollup-fixtures.sh`
Depends-on: T1, T3
Cites: TASK-655, EPIC-025 D7, `docs/research/logs/process-cost-census.md` (read only), `promote-check.ts` and `tick-box.ts` (kept under `scripts/lib/`, read only)
H50 goes only because T3's `tick` fixture replaces it. A fixture directory is deleted only when no kept harness reads it.

**Acceptance:** the 12 harnesses no longer run, the two-query census agrees, and the full gate is green.

### T6 — Merge 8 record steps in the orchestrator skill `[size: M · risk: med · class: execution · AFK · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/builder-check.md` · `skills/orchestrator/references/night-run.md`
  `evals/run-orchestrator-store-fixtures.ts`
Depends-on: T2, T3
Cites: TASK-656, `references/dispatch.md` (the Done-when's short name for the Layers file), EPIC-025 D7, `docs/research/logs/process-cost-census.md` (R02, R06, R14, R19, R21, R27, R37, R64; read only)
A merge keeps every record's content; only its separate step or commit goes. The writer is named as "lean-flow's own:", so consumers keep a self-contained procedure.

**Acceptance:** the 8 merges land, no required record line is lost, and each writer command is named by a shipped step.

### T7 — Merge 5 record steps in the lean-doc-generator skill `[size: S · risk: med · class: execution · AFK · J1]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/lean-doc-generator/templates/sprint-log.md.template`
  `evals/run-layout-fixtures.ts`
Depends-on: T2, T3
Cites: TASK-657, `references/sprint-by-reference.md` and `templates/sprint-log.md.template` (the Layers files under `skills/lean-doc-generator/`), EPIC-025 D7, `docs/research/logs/process-cost-census.md` (R03, R08, R16, R45, R51; read only)
R45 and R51 are where most close-time bookkeeping commits come from. The freeze and the close pin stay.

**Acceptance:** the 5 merges land, the scope-change writer is named, and the knowledge-index check stays green.

### T8 — Release the MINOR, stopped before push `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` · `README.md` · `CHANGELOG.md` · `docs/changelog/`
  `spec/STANDARD.md` · `spec/CHANGELOG.md` · `scripts/lib/record-line.ts` · `evals/run-record-line-fixtures.ts`
Depends-on: T1, T2, T3, T4, T5, T6, T7
Cites: TASK-658, EPIC-025 condition 5, TASK-489, `scripts/gate-remote.ts` (read only, run by path)
A release is a Codex review of the shipped diff plus the off-host gate, never an arm.

**Acceptance:** every manifest and the README footer carry one new MINOR version, the Codex review and the gate are recorded, and nothing is pushed.

## Owner-action checklist

- [ ] After T1 lands, remove the two stale `check-approval-envelope.sh` allow entries from `.claude/settings.json` by hand (no task edits permission settings).
- [ ] Before T4's paid run, make `jev_key` available to Bun's environment; `.env` is never opened by the agent.
- [ ] After T8, push `main` and tag the release (owner-reserved).

## Decisions (pre-locked)

- **D1** — Shared files, one owner each in order: `scripts/qa-check.sh` T1 → T3 → T5, `evals/README.md` and `docs/QA.md` T1 → T5, and `skills/orchestrator/references/night-run.md` and `dispatch.md` T1 → T6 (scope-changes, 2026-11-12). Each later task builds on the earlier one's commit. T6 and T7 are disjoint. The coordinator owns the Log, ticks, moves, the epic and the knowledge index.
- **D2** — Codex builds each task in a worktree, a scoped Sonnet reviewer reviews, and the coordinator commits (memory ruling, 2026-11-02). At most two builders run at once while the host has about 1.5 GB free. Review cap: 2 rounds per task.
- **D3** — Moves and ticks stay bare `sprint(173):` commits for this whole sprint. TASK-652's amendment ships with the release, so Sprint B is the first sprint under it, and the measuring sprint counts it.
- **D4** — The only paid API call is T4's Jev run, capped at 1.00 USD (EPIC-025 D7). Push and tag are owner-reserved; T8 stops at the gate.
- **D5** — The census appendix at pin `e29815a9` is the only source for what is cut or merged. A census-kept row is never touched, whatever a builder finds.

## Assumptions

- **A1** — Wave order under D1 and D2: T1 and T2, then T3 (on T1) and T4, then T6 and T7, then T5, then T8. *Confirm: G2's shared-file map.*
- **A2** — Every cut fixture directory is read only by its cut harness. *Confirm: each task's G2 caller grep; a directory with a kept reader stays and is logged.*
- **A3** — TASK-489's retarget, TASK-627's fold into T4 and TASK-629's cancel happen at `/triage`, outside this sprint. *Confirm: at close.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-173-cut-checks-and-write-records-by-tool.md`](logs/SPRINT-173-cut-checks-and-write-records-by-tool.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
