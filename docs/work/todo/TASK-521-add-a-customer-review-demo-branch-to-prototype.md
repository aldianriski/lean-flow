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
depends-on: []
---

# TASK-521 — Add a customer-review demo branch to /prototype

## Why
`/prototype` answers one internal design question and is thrown away. The owner also builds bounded demos for customer
review (Kawanan, Sela, Vigor in the Codex skill's own lessons), which need different rules: a contract (interaction depth ·
persistence/reset · integration boundary · demo identity ≠ auth), labelled simulated actions, a customer task script, and
"ready for walkthrough" kept apart from "validated". Source: `docs/research/codex-run-project-pipeline.md` (10).

## Done when
- [ ] `/prototype` routes a "will a customer understand and want this?" question to a third branch, in its own reference file.
- [ ] The branch records the contract, labels every simulated action, and never presents fixtures as real customers or data.
- [ ] It prepares a task script (starting state · tasks · expected outcomes · non-leading questions) and claims
      "validated" only after a recorded session.
- [ ] Lifecycle: retired after the recorded session; observations captured to requirements or an ADR, as the other branches do.
- [ ] Exercised once on a real brief; SKILL.md stays within ~140 lines; CHANGELOG + README if the skill's one-liner changes.

## Touches
`skills/prototype/SKILL.md` · `skills/prototype/references/demo.md` (new) · CHANGELOG.md · README.md (if wording changes)

## Assumes
- Owner ruling 2026-10-25: a `/prototype` branch, not a new skill; the roster stays at 15.
- Shares `skills/prototype/SKILL.md` with TASK-522: G2 names one owner and the commit order.

## Tracker
Research `codex-run-project-pipeline`, Findings row (10).
