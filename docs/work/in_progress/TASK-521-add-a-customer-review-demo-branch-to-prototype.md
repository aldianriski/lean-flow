---
id: TASK-521
title: "Add a customer-review demo branch to /prototype with a contract, a task script and honest claims"
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-143
depends-on: []
---

# TASK-521 — Add a customer-review demo branch to /prototype

## Why
`/prototype` answers one internal design question and is thrown away. The owner also builds bounded demos for customer
review (Kawanan, Sela, Vigor in the Codex skill's own lessons), which need different rules: a contract (interaction depth ·
persistence/reset · integration boundary · demo identity ≠ auth), labelled simulated actions, a customer task script, and
"ready for walkthrough" kept apart from "validated". Source: `docs/research/codex-run-project-pipeline.md` (10).

## Done when
- [x] `/prototype` routes a "will a customer understand and want this?" question to a third branch, in its own reference file. ✓ review: SKILL.md § Pick a branch + fallback → references/demo.md (5fb1ac2c); Codex R2 CLEAR
- [x] The branch records the contract, labels every simulated action, and never presents fixtures as real customers or data. ✓ review: demo.md § Write the contract first (undecided field blocks the build) + § Honest claims; Codex R2 CLEAR
- [x] It prepares a task script (starting state · tasks · expected outcomes · non-leading questions) and claims ✓ review: demo.md § The task script + § Claims ladder (validated = real target users, owner-ruling R2); Codex R2 CLEAR
      "validated" only after a recorded session.
- [x] Lifecycle: retired after the recorded session; observations captured to requirements or an ADR, as the other branches do. ✓ review: demo.md § Lifecycle + SKILL.md § Capture the answer; Codex R2 CLEAR
- [x] Exercised once on a real brief; SKILL.md stays within ~140 lines; CHANGELOG + README if the skill's one-liner changes. ✓ test: Workdoo onboarding brief → contract + task script, no validated claim (signed G2 scope); `wc -l` 56; CHANGELOG + README lines 196 and 483 (5fb1ac2c)

## Touches
`skills/prototype/SKILL.md` · `skills/prototype/references/demo.md` (new) · CHANGELOG.md · README.md (if wording changes)

## Assumes
- Owner ruling 2026-10-25: a `/prototype` branch, not a new skill; the roster stays at 15.
- Shares `skills/prototype/SKILL.md` with TASK-522: G2 names one owner and the commit order.

## Tracker
Research `codex-run-project-pipeline`, Findings row (10).
