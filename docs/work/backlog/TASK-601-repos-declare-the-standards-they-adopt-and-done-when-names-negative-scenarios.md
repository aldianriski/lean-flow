---
id: TASK-601
title: "Let a repo declare the engineering standards it adopts, and make Done-when name its negative scenarios"
type: feature
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: needs-info
depends-on: []
---

# TASK-601 — Let a repo declare the engineering standards it adopts, and make Done-when name its negative scenarios

## Why
Owner question, 2026-11-03 (SPRINT-161, after comparing ECC and pstack): how lean-flow carries specialities that need a proper
standard (SOLID, clean architecture, Mermaid diagram breakdown) and why a Done-when covers no negative scenario. Today a repo's
standards live as free prose in coding-standards, judged on review's Standards axis; templates describe and never prescribe
(TASK-552). `/task-decomposer` step 6 asks only for an observable acceptance criterion; the one negative case anywhere is G2's
one-line abuse case for `risk: high` auth or input tasks. pstack carries 24 named principle leaves with yes/no tests; Codex's
review (2026-11-03): keep "the repo declares, lean-flow applies", start minimal, earn each increment by comparison.

## Done when
- [ ] Coding-standards has an optional `## Standards adopted` section (each entry: the standard, its scope, an authoritative
      reference, concrete yes/no checks, exceptions); `init` and `migrate` ask once (default none) and never infer adoption;
      review's Standards axis checks a diff against adopted entries and names an actual violation, not a principle name.
- [ ] A task that changes behaviour has a Done-when naming at least one negative scenario (what must not happen, or the failure
      path and its observable result); `/task-decomposer` validation and G2 reachability check it.
- [ ] Shown on a consumer repo with two adopted standards: a violating change caught, a compliant one passed, a justified exception
      accepted, a repo with none adopted unchanged; and a decomposed task whose Done-when carries its negative scenario.

## Touches
`skills/lean-doc-generator/templates/development-coding-standards.md.template` · `init`/`migrate` question references ·
`skills/orchestrator/references/review-scoping.md` · `skills/task-decomposer/SKILL.md` · `skills/orchestrator/SKILL.md` (G2)

## Assumes
- Needs intake (`/task-decomposer`) after 2.20.0 ships: split, sized and grilled there; outside EPIC-023.
- Later increments only on comparative evidence: a G2 line naming the adopted standard that changed a decision (an
  `/orchestrator` behaviour change, so an arm under EPIC-023 D19), and a curated principle library.

## Tracker
Proposal drafted in SPRINT-161 (Codex-reviewed twice) · `docs/research/plugin-reference-delta.md` · backnotprop/pstack `6c75f4e6`
