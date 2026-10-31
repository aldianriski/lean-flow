---
id: TASK-554
title: "Wire S1 discovery through every job that runs init or migrate, and document it for adopters"
epic: EPIC-023
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-547, TASK-548, TASK-549, TASK-550, TASK-551, TASK-552, TASK-553]
---

# TASK-554 — Wire S1 discovery through every job that runs init or migrate, and document it for adopters

## Why
Research §6: every slice's DoD carries the wiring check, exercised on a real run rather than satisfied by prose (L-020). It
is also where the finished S1 flow is shown whole on an unprofiled stack (Codex R1 finding F1). Not frozen under ADR-053.
G2 review-round cap: 2.

## Done when
- [ ] Every entry that triggers `init` or `migrate` (the generator's mode table, `/flow`'s assess stage, `/prime`'s next-step
  routing) reaches the new discovery, shown by one real `/flow` run through the installed plugin on a fresh snapshot.
- [ ] `.claude/CONTEXT.md`, README and CHANGELOG describe the profile, and 2.x adopters get migration notes naming what
  `migrate` adds and that it removes nothing.
- [ ] With every S1 task in place, a real `init` through the installed plugin on a fresh portfolio-sveltekit snapshot (unprofiled)
  writes all seven profile topics, each as an evidence-backed fact (a file or doc it cites, or the owner's answer) or an explicit
  "not decided yet", none left as an unfilled template prompt.

## Touches
flow skill · prime skill (only if routing changes) · `.claude/CONTEXT.md` · README · CHANGELOG

## Assumes
- **blocked-by:** TASK-547..553 (the whole S1 flow).
- Whether S1 ships as a 2.x MINOR is ruled at S1 promote (the epic's open question), not here.
- Routing to `init`/`migrate` only; if wiring needs a change to dispatch, gates or review routing (ADR-053 frozen), that part
  leaves S1 and needs S0's measured defect (EPIC-023 D2).

## Tracker
EPIC-023 Closed-when S1 · research §6 · S1 intake (2026-10-30; Codex R1 finding F1)
