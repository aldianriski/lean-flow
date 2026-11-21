---
sprint: 185
slug: handoff-offers-pre-run-sweep-and-park-rule
owner: Maintainer
last_updated: 2026-11-21
status: active
plan_commit: <sha, set after plan locked>
update_trigger: sprint execute/close events
---

# SPRINT-185 — Hand-off Offers, a Pre-run Sweep, One Park Rule and the Loop Audit

> **Theme:** Five owner notes from 2026-11-21 about the loop's seams. Init stops instead of handing over to migrate, a decomposed backlog ends without offering promote,
> sprint-bulk asks mid-run what it could ask once, and attended and overnight runs park blockers by two different rules.
> A fifth task audits the lane and loop workflow and ranks what to optimise next, so the owner picks the following sprint from evidence.

## Scope

**In:** TASK-694 to TASK-698: init hand-over and reviewed suggestions · promote and mode offers at each hand-off · the pre-run question sweep · the park-continue-ask-at-end rule for both run kinds · the ranked loop audit.
**Out (deferred):** any workdoo product work and EPIC-025's open condition · a version bump, tag or push · new hooks, agents, gate legs or scripts · lane token re-measurement (TASK-668) · fixes for what the audit ranks (a later decompose).

## Members

- docs/work/todo/TASK-694-init-hands-over-into-migrate-and-drafts-reviewed-suggestions.md
- docs/work/todo/TASK-695-offer-promote-and-a-recommended-execute-mode-at-each-hand-off.md
- docs/work/todo/TASK-697-audit-the-lane-and-loop-workflow-and-recommend-what-to-optimize.md
- docs/work/todo/TASK-696-sprint-bulk-resolves-every-foreseeable-question-before-first-dispatch.md
- docs/work/todo/TASK-698-one-park-continue-ask-at-end-rule-for-attended-and-overnight-runs.md

## Plan

### T1 — Hand init over into migrate and draft reviewed suggestions `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/references/migration-map.md`
Depends-on: none
Cites: TASK-694 · `lean-doc-generator/SKILL.md` · L-293
Init writes nothing and stops when migrate is chosen, and both skills offer the owner no starting point when evidence is absent. The sole writer of the lean-doc-generator skill body in this sprint.

**Acceptance:** init on a repo with docs, migrate chosen, runs migrate's plan in the same session with no init writes, and an init and a migrate round each show a reviewed suggestion.

### T2 — Offer promote and a recommended execute mode at each hand-off `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/intake-brief.md` · `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/mode-choice.md` · `skills/orchestrator/references/dispatch.md` · `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/lean-doc-generator/references/promote-brief.md` · `skills/prime/SKILL.md` · `skills/flow/SKILL.md`
Depends-on: none
Cites: TASK-695 · `orchestrator/references/mode-choice.md` · `references/sprint-by-reference.md` · `lean-doc-generator/SKILL.md` · `orchestrator/SKILL.md` · L-293
Nothing suggests promote after decomposing, and the orchestrator picks a mode silently. First of three writers of the orchestrator, prime and flow skill bodies.

**Acceptance:** through `/flow`, decompose leads to a promote popup, then a mode popup with a recommendation, and "Stop here" ends the chain with no sprint created.

### T3 — Audit the lane and loop workflow and rank what to optimise `[size: M · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/loop-audit-2026-11.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-697 · `templates/RESEARCH.md.template` · `coordinator.md` · `night-run.md` · `dispatch.md` · `LEARNINGS.md`
The owner asked what is weak in the coordinator and lane workflow and the whole loop. Recon and ranking come before fixes so the owner chooses what ships. Built inline on the session model, Codex reviews.

**Acceptance:** a research doc ranks evidence-backed weak points for both scopes with a recommendation, Codex-reviewed within two rounds, and no skill, ADR or core doc is edited.

### T4 — Resolve every foreseeable sprint-bulk question before the first dispatch `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/sprint-bulk-run.md` · `skills/orchestrator/references/builder-check.md` · `skills/orchestrator/references/night-run.md`
Depends-on: T2
Cites: TASK-696 · `orchestrator/references/sprint-bulk-run.md` · `orchestrator/SKILL.md` · L-293
Batch G2 grills only tasks with an open `assumes:`, so questions surface mid-run. The `Depends-on: T2` is a shared-file sequence, not a logical one. Creates the sprint-bulk run reference.

**Acceptance:** a workdoo sprint with a scope-blocking assumption, an open assumes, a dependent question pair and one unresolvable member has every foreseeable question asked before dispatch.

### T5 — One park, continue, ask-at-end rule for attended and overnight runs `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/sprint-bulk-run.md` · `skills/orchestrator/references/night-run.md` · `skills/orchestrator/references/dispatch.md` · `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/flow/SKILL.md` · `skills/prime/SKILL.md` · `skills/handoff/SKILL.md`
Depends-on: T4
Cites: TASK-698 · `scripts/night-run.sh` · `orchestrator/SKILL.md` · `coordinator.md` · L-293
Attended runs halt at the first blocker while overnight parks, which is two processes. One rule: park, continue disjoint work, ask at the end. The `Depends-on: T4` is a shared-file sequence, not a logical one.

**Acceptance:** against the unchanged launcher and reaper, a seeded mid-run blocker parks, disjoint work continues, and one round is asked at exit, with the same rule for an overnight halt.

## Decisions (pre-locked)

- **D1** — Waves: W1 T1, T2, T3 · W2 T4 · W3 T5. Every blocker joins, so no state change.
- **D2** — Shared-file order, single writer at a time: `orchestrator/SKILL.md` T2 then T4 then T5 · `sprint-bulk-run.md` and `night-run.md` T4 then T5 · `dispatch.md`, `sprint-by-reference.md`, `prime/SKILL.md`, `flow/SKILL.md` T2 then T5. Commit stage per hunk.
- **D3** — README, CHANGELOG and CONTEXT are coordinator-owned, written once in a bare `sprint(185):` commit, in no Tn's Layers. Each task's report returns its proposed lines.
- **D4** — No epic and no stream: none of the five tasks advances EPIC-025, whose open condition is a workdoo sprint.
- **D5** — Builders: Codex in worktrees for T1, T2, T4, T5; Claude inline for T3.
- **D6** — T5 carries a G2 review-round cap of 2 and stays size M (owner ruling).
- **D7** — Consumer proofs: a 15 USD spend cap for the sprint. Proofs run serialised through the coordinator, one workdoo copy at a time, after merge-back. The builder stages, the coordinator launches, the owner approves each launch, and the child's tool route is named at G2 (L-293, `headless-proof-launcher`).

## Assumptions

- **A1** — No ADR governs init's "never generates candidate answers". *Confirm: re-derive at G2 (L-220).*
