---
id: TASK-461
title: "Trial open questions for discovery and pickers for decisions on the next 12 discovery questions"
priority: P3
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: decomposer
state: blocked
depends-on: [TASK-460]
---

# TASK-461 — Trial open questions for discovery and pickers for decisions on the next 12 discovery questions

## Why

If TASK-460 shows open questions invite intent that pickers miss, the claim still has to survive real use: a longer answer costs
the owner time, and L-002 exists because blocking questions buried in prose went unanswered.

## Done when

- [ ] Across the next 12 discovery questions (intent, goals, definitions — not choices between understood alternatives), the two formats alternate, each still posed as a visible blocking question (L-002), and each is logged with its format, answer time and any later scope correction it caused.
- [ ] The verdict keeps the split only if later scope corrections fall without more than 20% extra answer time; otherwise the pickers-everywhere rule stands. Either way it is written into `docs/research/reference-rejudge.md`, and a rule change, if any, is filed as its own task.

## Touches

docs/research/reference-rejudge.md · the sprint Execution Logs where the questions occur

## Assumes

- **blocked-by:** TASK-460 recording a coverage gain (unblock condition). If it records none, this task is proposed for cancellation.

## Tracker

- `docs/research/reference-rejudge.md` (I6) · L-002
