---
id: TASK-692
title: "Trim the orchestrator SKILL.md body with no behaviour change"
priority: P2
size: M
risk: high
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-691]
---
# TASK-692 — Trim the orchestrator SKILL.md body with no behaviour change

## Why
orchestrator is 25.4k characters, the heaviest body and the gate engine of the loop (G1, G2, modes). Every consumer runs it. It follows TASK-691 so the method is proven first.

## Done when
- [ ] The orchestrator body is at or under its TASK-690 census target, `wc -c` before and after recorded.
- [ ] A retained inventory (`docs/work/evidence/TASK-692/orchestrator.md`) accounts for EVERY behavioural line in the body before the trim, as a complete line-by-line list (not selected classes), each kept, moved (with its branch-point pointer) or deleted (reason: duplicate of a named surviving line); anything that fires on every call stays in the body.
- [ ] The skill is exercised on real input via `claude -p --plugin-dir D:/Project/lean-flow` (transcript shows the repo base dir): every mode and every gate whose text was moved or deleted, on a small task in a scratch worktree, nothing committed to main; the same gates and stops as before are shown for each, including each moved reference being read. Spend is recorded against this task's 4.00 USD share in `docs/work/evidence/TASK-692/spend.md`.
- [ ] The inventory and the runs are reviewed by a different model family than the builder (worktree-isolated), at most 2 rounds; the existing gates stay green.
- [ ] Negative: no G1 or G2 gate, no `approve` stop and no "never git push" line is removed or weakened in the orchestrator body, and a gate line moved into a reference with no pointer at its point of use fails the review.

## Touches
`skills/orchestrator/SKILL.md` and `skills/orchestrator/references/` (the orchestrator's own only). Not CONTEXT.md; a roster edit goes to TASK-685's owner.

## Assumes
- Run budget: this task's fixed share is 4.00 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- If the census shows the target is unsafe, the owner may cut scope at G2.
- Escalate to the owner if the 2-round cap leaves an open high-severity finding.

## Tracker
Owner intake 2026-11-21, area 5; answer Q4 and the split ruling.
