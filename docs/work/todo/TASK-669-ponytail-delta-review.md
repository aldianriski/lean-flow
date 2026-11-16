---
id: TASK-669
title: "Ponytail delta review (EPIC-026 slice 1)"
type: feature
epic: EPIC-026
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
sprint: SPRINT-178
state: ready
depends-on: []
---

# TASK-669 — Ponytail delta review (EPIC-026 slice 1)

## Why

EPIC-026 D3: ponytail gets a delta review only, no install. The owner ruled 2026-11-16 that this reading slice runs now, since it cannot affect EPIC-025 Sprint B.

## Done when

- [ ] ponytail's SKILL.md and its benchmark are read first-hand. Nothing is installed.
- [ ] Each technique is mapped to lean-flow's existing surface first (L-017). Only the unmatched remainder is named, each as kept or dropped. Candidates are /ponytail-review and /ponytail-debt shortcut comments.
- [ ] "-45% tokens" is judged credible, not credible or inconclusive from its benchmark only. There is no paid re-run.
- [ ] A verdict is recorded in a new `docs/research/` file, with the basis stated as a first-hand read, not a measurement. The INDEX row is deferred to EPIC-026's "record the verdicts" slice.
- [ ] Negative: nothing ships inside lean-flow, and no hook, skill or CONTEXT line is added on this verdict. A kept technique becomes a separate owner ruling.

## Touches

`docs/research/` (one new file).

## Assumes

- EPIC-026 is `proposed` with D1 timing "after Sprint B". For this slice it must be activated and the D1 timing amended per the owner's 2026-11-16 ruling. That doc write belongs to `/lean-doc-generator` at promote, not to this task.
- The RTK and graphify slices are not decomposed now.

## Tracker

`docs/epic/EPIC-026-token-cost-per-box.md` D3 and Scope-In "Ponytail delta review"; owner sprint ruling 2026-11-16.
