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
sprint: SPRINT-184
depends-on: [TASK-690]
---
# TASK-691 — Trim the task-decomposer, triage and prime SKILL.md bodies with no behaviour change

## Why
Per-call cost is task-decomposer 14.7k, triage 11.0k and prime 10.8k characters, all at the line cap with dense lines. The owner chose the density trim. This is the lower-blast set (intake, grooming, session start) and proves the method before 692 and 693. No skill-behaviour eval exists in this repo, so the proof is an instruction inventory plus a real-input run.

## Done when
- [x] Each body is at or under its TASK-690 census target (starting at 15% fewer bytes), `wc -c` before and after recorded. ✓ census basis: task-decomposer 14,273→13,707 (≤13,707), prime 10,557→9,764 (≤9,764), triage 10,540→9,498 (≤9,546); before/after in checks.md
- [x] A retained inventory per skill (`docs/work/evidence/TASK-691/<skill>.md`) accounts for EVERY behavioural line in the body before the trim, as a complete line-by-line list, each kept, moved (named reference plus the pointer line at the branch point) or deleted (reason: duplicate of a named surviving line). An instruction that fires on every call stays in the body (L-327). ✓ inventories docs/work/evidence/TASK-691/{task-decomposer,prime,triage}.md: every behavioural line kept/moved/deleted with reason; every-call text stays in the body
- [x] Each trimmed skill is exercised on real input via `claude -p --plugin-dir D:/Project/lean-flow` (the transcript shows the repo base dir): /prime on this repo, /task-decomposer on a small freeform intake, /triage on a throwaway copy of the backlog (worktree or export), never the real backlog; the same gates and outputs as before are shown for every mode or route of each skill whose text was moved or deleted (not one sample), including each moved reference being read. Spend is recorded against this task's 3.50 USD share in `docs/work/evidence/TASK-691/spend.md`. ✓ before/after pairs for all four routes via claude -p, after arm on the live checkout D:\Project\lean-flow (init); same gates and outputs; moved reference read; 1.4220 of 3.50 USD in spend.md
- [x] The inventories and runs are reviewed by a different model family than the builder (worktree-isolated), at most 2 rounds; `qa-check`, prose-density, count-claims and skill-freshness stay green. ✓ different-family review CLEAR (Claude on Codex's build, 1 retry); system-verify gate on 899ec6e4 (off-host): bun test 643 pass, 0 fail; QA-CHECK 245 pass, 0 fail (qa-check, prose-density, count-claims, skill-freshness legs inside it)
- [x] Negative: no hard rule, gate or "never write before approve" line is deleted without an equivalent surviving line, and a moved instruction with no pointer at its branch point fails the review. ✓ Negative held: no hard rule, gate or approve stop deleted without a surviving line (reviewer + comparer); both triage branch points carry the pointer

## Touches
`skills/task-decomposer/SKILL.md` (+ its `references/`), `skills/triage/SKILL.md`, `skills/prime/SKILL.md`. Procedure may move only into each skill's own `references/` (ADR-006). Consumer-facing; its CHANGELOG line is written by TASK-693.

## Assumes
- Run budget: this task's fixed share is 3.50 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- Builder choice is a dispatch decision; the reviewer is a different model family.

## Tracker
Owner intake 2026-11-21, area 5; answer Q4.
