---
id: TASK-607
title: "Run the release arm for TASK-605 and TASK-606, and release 2.21.0 or record a no-ship"
type: feature
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-605, TASK-606]
---

# TASK-607 — Run the release arm for TASK-605 and TASK-606, and release 2.21.0 or record a no-ship

## Why
EPIC-023 D19: an arm runs before a release that changes `/orchestrator` or gate behaviour; TASK-606 changes G2 and TASK-605 the
review's Standards axis. The arm's amendment also closes two carry-forwards: TD-289 (adopt three workers) and TD-290 (disclose
TASK-602's judge fix).

## Done when
- [ ] An owner-signed amendment, frozen before any trial, adopts three workers (TD-289 resolved), discloses TASK-602's judge fix
      (TD-290 resolved) and any other harness change since arm Release, and pre-registers the ship rule against arm Release.
- [ ] One 32-slot arm on the exact final stack is VALID, and its result and the ship ruling are recorded with their numbers.
- [ ] Negative: no trial starts before the amendment's freeze line, and a result that fails the pre-registered rule ships nothing
      (a no-ship recorded with its numbers).
- [ ] Released as 2.21.0 (MINOR; every versioned manifest and the README footer in lockstep, stopping before push), or the no-ship
      recorded.

## Touches
`evals/ab/PREREGISTRATION.md` · `evals/ab/arms/` · `evals/ab/schedule-*.json` · `docs/research/logs/` · `TECH-DEBT.md` ·
`CHANGELOG.md` · `.claude-plugin/` · `.codex-plugin/` · `.kimi-plugin/` · `README.md`

## Assumes
- The ship rule is the owner's call at the amendment: the expected shape is non-inferiority against arm Release (93.8%), but the
  margin is decided there, before any trial.
- About 50 minutes at three workers and about 50 USD (Release cost about 50 USD at two workers); the arm runs unattended with a
  notification after its pilot is approved.
- Whether this arm's migrate route reaches the Standards question is unchecked (TD-293); settle it at the amendment, before the freeze line.
- **blocked-by:** TASK-605 and TASK-606 both done.

## Tracker
TASK-601 (superseded) · intake ruling 2026-11-04 (release arm included) · EPIC-023 D19 · TD-289 · TD-290
