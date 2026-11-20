---
sprint: 181
slug: rtk-trial-graphify-test-and-cell-verdicts
epic: EPIC-026
owner: Maintainer
last_updated: 2026-11-20
status: active
plan_commit: 22b9d5ec
gates_signed: G1,G2 @ 664e979a
update_trigger: sprint execute/close events
---

# SPRINT-181 — RTK Trial, graphify Test and the Cell Verdicts

> **Theme:** EPIC-026's two open trials run here, and the dispatch trial's verdict follows SPRINT-180's numbers. RTK is
> installed project-scoped and measured over this sprint's own USD per box. graphify is tested once on a workdoo
> snapshot against Explore. The three rulings are recorded as the sprint's last member. It adds no governance
> machinery, so ADR-053's freeze does not apply, and nothing ships without a separate owner ruling.

## Scope

**In:** TASK-671, TASK-673, TASK-674.
**Out (deferred):** TASK-675 (graphify wiring, blocked on a TASK-673 keep and owned by the next sprint, so the RTK
measurement stays clean) · TASK-402, 489, 507, 523 and 668 · any new guard, checker or ledger field · a global RTK hook
· shipping RTK or graphify (needs its own owner ruling).

## Members

- docs/work/todo/TASK-671-rule-each-model-effort-cell-keep-retune-or-drop.md
- docs/work/todo/TASK-673-test-graphify-on-a-workdoo-snapshot-against-explore.md
- docs/work/todo/TASK-674-rule-rtk-on-the-trial-sprint-s-usd-per-box.md

## Plan

### T1 — Rule each model × effort cell keep, retune or drop `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md` · `docs/adr/ADR-010-model-dispatch-role-tiers.md` · `docs/research/model-effort-trial-verdict.md` · `docs/knowledge-index.md` · `CHANGELOG.md` · `README.md`
Depends-on: none
Cites: TASK-671, TASK-670
The trial's numbers exist only from SPRINT-180, so the verdict is its own task. Cells with fewer than two dispatches are inconclusive.

**Acceptance:** each changed cell carries a keep, retune or drop ruling with its number, and dispatch.md and CONTEXT keep the kept cells only.

### T2 — Test graphify on a workdoo snapshot against Explore `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/graphify-workdoo-questions.md` · `docs/research/graphify-workdoo-test.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-673, `docs/research/graphify-reference-run.md`, `docs/research/graphify-daily-value.md`, `docs/epic/EPIC-026-token-cost-per-box.md`
Six fixed questions with an answer key built first, two Sonnet arms, a blind score and one verdict. The snapshot is left as found.

**Acceptance:** a keep, drop or inconclusive verdict with both arms' correct counts and tokens, graph build cost included, and workdoo reverted.

### T3 — Rule RTK on this sprint's USD per box and record all three verdicts `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/rtk-trial-verdict.md` · `docs/epic/INDEX.md` · `docs/knowledge-index.md`
Depends-on: T1, T2
Cites: TASK-674, TASK-669, `docs/epic/EPIC-026-token-cost-per-box.md`, `docs/research/ponytail-delta-review.md`
It runs last so its measure window (promote up to the commit before its own work) holds T1 and T2. It states the figure with and without T2's dispatches.

**Acceptance:** an RTK verdict with its measure basis and the bypass rule's record, and the INDEX row naming RTK, graphify and ponytail.

## Decisions (pre-locked)

- **D1** — Three members in two waves: T1 and T2 together, then T3. T3 is last by owner ruling 2026-11-20, so its window holds the rest.
- **D2** — This is the RTK trial sprint. RTK is on from promote; the measure window is promote to the commit before T3's own work.
- **D3** — Commits: a task commits as `sprint(181) Tn: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(181):`. T1 and T2 share only the generated `docs/knowledge-index.md`; regenerate it once after each merge.
- **D4** — The dispatch trial is not extended to this sprint (owner answer 2026-11-20). TASK-671 rules on SPRINT-180's record.
- **D5** — Trial rule for RTK: any count, id derivation or existence check uses the Glob or Grep tools or `rtk bypass`, never a compressed Bash listing. Each truncation is logged; a real miss counts against RTK.

## Assumptions

- **A1** — The three verdict-note slugs above. *Confirm: G2.*
- **A2** — T1 needs a CHANGELOG `[Unreleased]` line for a shipped-reference change; it is absent from the task's Touches. *Confirm: G2 for T1.*
- **A3** — T2's arm A cannot read `graphify-out` (run it before the build or on a separate copy), and workdoo's pre-test state includes an untracked `.claude/worktrees/`. *Confirm: G2 for T2.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-181-rtk-trial-graphify-test-and-cell-verdicts.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/epic/EPIC-026-token-cost-per-box.md` | COORD | D8 amendment and the SPRINT-181 member row (WHY: the owner moved the graphify test to a standalone run) | Low | coverage re-read |

## Retro
