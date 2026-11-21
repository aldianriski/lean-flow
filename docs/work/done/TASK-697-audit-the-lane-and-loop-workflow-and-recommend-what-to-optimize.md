---
id: TASK-697
title: "Audit the lane and loop workflow, rank its weak points and recommend what to optimize"
type: feature
priority: P1
size: M
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-185
depends-on: []
---

# TASK-697 — Audit the lane and loop workflow, rank its weak points and recommend what to optimize

## Why

The owner asked to optimise the workflow lane again: find what is weak and what to optimise, across both the coordinator and lane sessions and the whole loop prime, decompose, promote, orchestrate, close. This is judgment work: built inline by Claude on the session model, Codex reviews it (not a Codex build). Recon and ranking is separate from fixes so the owner chooses what ships.

## Done when

- [x] A research doc exists at `docs/research/loop-audit-2026-11.md`, shaped by `templates/RESEARCH.md.template`, with a ranked weak-point table, one row per finding: rank, stage (prime · decompose · promote · orchestrate · close · coordinator/lane), weakness, evidence (file § section, `L-NNN`, sprint log or measured figure), cost or defect, proposed fix size, and a named justification under the governance-machinery rule where a new guard, ledger or check is proposed. ✓ docs/research/loop-audit-2026-11.md from RESEARCH.md.template: 8 ranked rows, each with rank, stage, weakness, evidence, cost/defect, fix size and governance justification
- [x] The doc has a `## Recommendation` section (per the template) covering both scopes, the coordinator/lane workflow and the whole loop: what to optimise first and why, what to leave alone, and which findings go to TD versus a later decompose. ✓ ## Recommendation has a coordinator/lane part and a whole-loop part, each naming what first, what to leave alone, and TD vs later decompose
- [x] Both scopes are covered with evidence read from real files: `coordinator.md`, `night-run.md`, `dispatch.md`, each loop-stage skill, recent sprint logs and `LEARNINGS.md` repeats (`count>=2`). Findings owned by TASK-668, TASK-523, TASK-694, TASK-695, TASK-696 or TASK-698 are marked "covered by", not re-filed. ✓ both scopes read at 9478dec4 (coordinator.md, night-run.md, dispatch.md, 7 loop-stage skills, SPRINT-175..184 logs, count>=2 learnings); covered-by rows for TASK-668, 523, 694, 695, 696, 698 and TD-321
- [x] A Codex review of the ranked list and the recommendation runs before it is final, briefed to the evidence, at most 2 rounds; disagreements are recorded, not dropped. ✓ Codex gpt-6-astra read-only via cross-model-route.md, round 1 of 2: VERDICT: CLEAR, 7 medium/low findings all accepted and fixed, recorded in the doc's ## Review
- [x] `docs/knowledge-index.md` is regenerated and committed in the same commit as the research doc. ✓ sh scripts/gen-index.sh, then --check: PASS knowledge index current; committed with the research doc
- [x] Negative: a finding with no cited evidence, or a proposed new guard, ledger or check with no named justification, is not ranked and is recorded as "no evidence" (a census-zero shape goes to TD, never a task); no skill, ADR or core doc is edited by this task. ✓ uncited items and unjustified guard ideas sit in ## Not ranked (no evidence); commit touches only the doc, the index and this task file

## Touches

Reads `skills/*/SKILL.md`, `orchestrator/references/*`, `docs/sprint/` logs, `docs/LEARNINGS.md`, `TECH-DEBT.md`. Writes only `docs/research/loop-audit-2026-11.md` and the regenerated `docs/knowledge-index.md`.

## Assumes

- Reading transcripts is out of scope: TASK-668 owns lane token re-measurement. Only repo artefacts are audited.
- The output path is a proposal; if `docs/research/` has a layout rule, that rule wins (checked at G2).

## Tracker

Owner note item 5 and answer "Both, dont forget to review with codex", 2026-11-21.
