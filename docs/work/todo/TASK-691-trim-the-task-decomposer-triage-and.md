---
id: TASK-691
title: "Trim the task-decomposer, triage and prime SKILL.md bodies with no behaviour change"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-690]
---
# TASK-691 — Trim the task-decomposer, triage and prime SKILL.md bodies with no behaviour change

## Why
Per-call cost is task-decomposer 14.7k, triage 11.0k and prime 10.8k characters, all at the line cap with dense lines. The owner chose the density trim. This is the lower-blast set (intake, grooming, session start) and proves the method before 692 and 693. No skill-behaviour eval exists in this repo, so the proof is an instruction inventory plus a real-input run.

## Done when
- [ ] Each body is at or under its TASK-690 census target (starting at 15% fewer bytes), `wc -c` before and after recorded.
- [ ] A retained inventory per skill (`docs/work/evidence/TASK-691/<skill>.md`) accounts for EVERY behavioural line in the body before the trim, as a complete line-by-line list, each kept, moved (named reference plus the pointer line at the branch point) or deleted (reason: duplicate of a named surviving line). An instruction that fires on every call stays in the body (L-327).
- [ ] Each trimmed skill is exercised on real input via `claude -p --plugin-dir D:/Project/lean-flow` (the transcript shows the repo base dir): /prime on this repo, /task-decomposer on a small freeform intake, /triage on a throwaway copy of the backlog (worktree or export), never the real backlog; the same gates and outputs as before are shown for every mode or route of each skill whose text was moved or deleted (not one sample), including each moved reference being read. Spend is recorded against this task's 3.50 USD share in `docs/work/evidence/TASK-691/spend.md`.
- [ ] The inventories and runs are reviewed by a different model family than the builder (worktree-isolated), at most 2 rounds; `qa-check`, prose-density, count-claims and skill-freshness stay green.
- [ ] Negative: no hard rule, gate or "never write before approve" line is deleted without an equivalent surviving line, and a moved instruction with no pointer at its branch point fails the review.

## Touches
`skills/task-decomposer/SKILL.md` (+ its `references/`), `skills/triage/SKILL.md`, `skills/prime/SKILL.md`. Procedure may move only into each skill's own `references/` (ADR-006). Consumer-facing; its CHANGELOG line is written by TASK-693.

## Assumes
- Run budget: this task's fixed share is 3.50 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- Builder choice is a dispatch decision; the reviewer is a different model family.

## Tracker
Owner intake 2026-11-21, area 5; answer Q4.
