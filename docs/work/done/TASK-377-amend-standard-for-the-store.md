---
id: TASK-377
title: "Amend STANDARD for the work-item store and bump the spec MAJOR"
epic: EPIC-017
sprint: SPRINT-109
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-359, TASK-360]
---

# TASK-377 — Amend STANDARD for the work-item store and bump the spec MAJOR

## Done when

- [x] §2 places docs/work/ and retires TODO.md; §9 describes a sprint by reference; §10 routes Retro follow-ups to task files; §11 retention prunes done/ and cancel/ instead of TODO.md. ✓ 616a373+f8027d8 (merged 3c85e84): §2 docs/work/ row; TODO.md row kept (cap 320) as the retired v1 layout, read only by migrate; §9 by reference (ADR-047); §10 follow-ups → backlog task file `origin: close-retro`; §11 done/·cancel/ prune (owner-accepted trigger, highest-id guard in the condition); reconcile 100/100, doc-caps output identical, engine 73 FAIL before and after
- [x] Spec version bumped MAJOR with a spec/CHANGELOG entry marked breaking. ✓ f8027d8: 0.11.0 → 0.12.0, a 0.x MINOR carrying MAJOR meaning per §15 (owner re-ruled A1 once §15's 1.0.0 condition surfaced); spec/CHANGELOG `## 0.12.0` marked breaking; 1.0.0 deferred to TASK-373; §15 byte-identical to b9d06a8
- [x] No rule the conformance engine checks is left pointing at TODO.md unannounced — hand-off list to TASK-383. ✓ hand-off list written into TASK-383 § Amended 2026-09-28 (S11.TODOCAP · S11.BACKLOG · S10.FOURBUCKETS · S9.PLANFROZEN/SCOPECHANGE · S9.VERIFYCLAUSE · _s2_cap_for · _own_docs), and also named in the spec/CHANGELOG 0.12.0 entry

## Touches

spec/STANDARD.md · spec/CHANGELOG.md

## Assumes

none

## Amended 2026-09-26

- Carried from SPRINT-107 T2: `/triage` writes two conventions under `## Assumes` that `docs/work/README.md` does not yet document: `- **open:** …` (an assumption still unconfirmed) and `- **blocked-by:** TASK-NNN` (read when ordering the backlog, where a blocker sorts at the highest priority of anything waiting on it). The schema doc is this task's.

## Tracker

EPIC-017 D1 · D2 · hard-cut ruling 2026-09-23
