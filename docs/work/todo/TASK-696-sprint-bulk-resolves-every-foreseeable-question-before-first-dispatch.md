---
id: TASK-696
title: "Sprint-bulk resolves every foreseeable question before the first dispatch"
type: feature
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-185
depends-on: [TASK-695]
---

# TASK-696 — Sprint-bulk resolves every foreseeable question before the first dispatch

## Why

Sprint-bulk is interrupted mid-run by questions that could have been asked once up front; batch G2 only grills tasks with an open `assumes:`. The owner wants every foreseeable question answered before the run so the sprint does not stop until the tasks end (owner note 4). The runtime half (park, continue, ask at the end) is TASK-698.

The `depends-on: [TASK-695]` is a shared-file sequence only (`orchestrator/SKILL.md`: 695 commits first), not a logical dependency.

## Done when

- [ ] Pre-run sweep (new `orchestrator/references/sprint-bulk-run.md` § Sweep) starts at batch G1 with scope-blocking questions and exclusions, then continues at batch G2 with design and builder-check questions: every open intent question across members (builder-check residue, unconfirmed assumes, J2/HITL steps, owner decisions) in successive frontier rounds until none is open; dependent questions wait for their prerequisites.
- [ ] Answers land where their reader is: each member's `## Assumes` closed, design rulings + builder-check lines in the Execution Log, sign-off in sprint frontmatter after approval. Credentials/environment are verified as capability facts, not asked as opinions.
- [ ] A member still blocked after the sweep → the owner approves scoping it out with its dependents via the existing scope-change path before signing; never left silently in the frozen Plan. A declared J2 still blocks overnight launch.
- [ ] Consumer proof in D:\Research\workdoo (pre-run file-hash manifest compared after revert): a sprint with a scope-blocking assumption (settled at batch G1), an open assumes, a dependent question pair and one unresolvable member → all asked before the first dispatch, the pair in two rounds, the member scoped out by owner ruling; no question asked after dispatch starts for anything the sweep could see.
- [ ] Negative: batch sign-off never waves an open assumes through; a scoped-out member never runs; workdoo matches baseline.
- [ ] `orchestrator/SKILL.md` step 2 changes by pointer only and stays ≤ 140; Codex review of the shipped diff clean within 2 rounds; the report returns proposed README/CHANGELOG/CONTEXT lines.

## Touches

`orchestrator/SKILL.md` steps 1-2, new `orchestrator/references/sprint-bulk-run.md` § Sweep, `references/builder-check.md` (feeds the sweep), `references/night-run.md` pre-flight pointer. README, CHANGELOG, CONTEXT are coordinator-owned.

## Assumes

- Tier P, no script; re-tier at G2 if one is added. No new guard is admitted without a named defect.
- The sweep cannot foresee every question; that fallback is TASK-698's runtime rule.

## Tracker

Owner note item 4 ("sprint-bulk also need to makesure all question needed answer in first"), 2026-11-21.
