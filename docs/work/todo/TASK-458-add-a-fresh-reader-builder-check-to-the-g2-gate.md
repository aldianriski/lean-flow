---
id: TASK-458
title: "Add a fresh-reader builder check to the G2 design gate"
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-131
---

# TASK-458 — Add a fresh-reader builder check to the G2 design gate

## Why

On 2026-10-19, 4 of 5 real defects were in *what to build*, and each was caught only after the build, costing a builder retry
and a re-review. A replay of superpowers' builder check on today's frozen designs caught 3 of those 4 before the build (1
partial) and raised nothing on a clean control (`docs/research/reference-rejudge.md`). One of them was the coordinator's own G2
wording loosening a frozen Done-when (L-237), which no current G2 step can see.

## Done when

- [ ] The G2 design gate (mvp and sprint-bulk) runs one fresh reader per task design before sign-off, given the design, the frozen Done-when and the code or text it touches; it reports open questions **and contradictions between the design and the Done-when**, ranked, or "nothing important left".
- [ ] The coordinator resolves factual questions itself; a contradiction is settled before sign-off (fix the design, or a recorded owner ruling on the Done-when); only intent questions go to the owner, inside the G2 popup.
- [ ] The reader prompt lives in the orchestrator's `references/` (uncounted, ADR-006); the orchestrator SKILL.md stays within ~140 lines.
- [ ] Wiring: the check fires wherever G2 runs — `/orchestrator` mvp and sprint-bulk, the `/flow` conductor, and the overnight run's pre-signed G2 — not only in its own file (L-020).
- [ ] Exercised once on a real design before its sign-off (L-007); CHANGELOG reflects the change.

## Touches

skills/orchestrator/SKILL.md (G2 checklist) · skills/orchestrator/references/builder-check.md (new) · possibly skills/flow/SKILL.md and skills/orchestrator/references/night-run.md (wiring) · CHANGELOG

## Assumes

- every G2 design gets the pass, one reader per task design, run in parallel in sprint-bulk (owner ruling at intake, 2026-10-19).
- the adapted prompt (questions + contradictions, design + Done-when + touched code) is used, not the upstream prompt verbatim; the replay used the verbatim prompt on the same inputs.

## Tracker

- `docs/research/reference-rejudge.md` · superpowers `brainstorming/builder-check-prompt.md` · L-237
