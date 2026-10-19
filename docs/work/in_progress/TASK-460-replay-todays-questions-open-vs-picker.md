---
id: TASK-460
title: "Replay today's 14 questions to see whether open questions would have surfaced the scope changes"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-131
---

# TASK-460 — Replay today's 14 questions to see whether open questions would have surfaced the scope changes

## Why

mattpocock/skills rejects native question pickers because they push toward pre-baked choices; lean-flow's promoted rule L-002
asks every blocking question as a picker. On 2026-10-19, 3 of 14 answers came as free-text "Other" and changed scope. Codex
proposed separating discovery (open questions) from decisions (pickers). This stage measures coverage cheaply before any change
to how questions are asked.

## Done when

- [ ] Today's 14 question contexts are reconstructed from the session's records and re-posed twice to fresh readers playing the owner from the context available then, once open-ended and once as the original picker, with the real answers hidden.
- [ ] The result records, per question, whether the open form elicits the scope-changing intent of the three known "Other" answers, and whether it costs material clarity on the other eleven.
- [ ] A verdict — coverage gain or none — is written into `docs/research/reference-rejudge.md`, and TASK-461 is unblocked (gain) or proposed for cancellation (none).

## Touches

docs/research/reference-rejudge.md

## Assumes

- a reader playing the owner is a proxy, not the owner: the stage measures whether the question *invites* the answer, never what the owner would actually say.

## Tracker

- `docs/research/reference-rejudge.md` (I6) · mattpocock `.out-of-scope/native-question-tool.md` · L-002
