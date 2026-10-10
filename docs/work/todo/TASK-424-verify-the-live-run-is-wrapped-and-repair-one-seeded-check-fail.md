---
id: TASK-424
title: "Verify the live run is wrapped by the TERM-catching wrapper, and repair one seeded check FAIL"
epic: EPIC-015
priority: P1
size: S
risk: low
autonomy: AFK
class: execution
tier: X
authority: J1
origin: manual
state: ready
depends-on: []
sprint: SPRINT-123
---

# TASK-424 — Verify the live run is wrapped by the TERM-catching wrapper, and repair one seeded check FAIL

## Why

SPRINT-122 T1 moved the launcher's detached wrapper into `night-run.sh --wrap`, which catches TERM so that a human stop reports
`USER_STOP`. Fixtures prove it; this is its first live input (L-007). The task also carries SPRINT-122 T2's seeded repair (TASK-415,
EPIC-015 CW5): its second box names a check that is seeded to FAIL on the first write, so the run must take ADR-022's one bounded
retry. The seed is declared here openly. It is a control, not real work re-declared AFK (SPRINT-089 D3).

## Done when

- [ ] The run lists the process table with the literal command `ps -eo pid=,ppid=,args=` (a `$`-expanding form is denied under
      `dontAsk`), traces its own chain upward by ppid from its `claude -p` process, and transcribes, verbatim into this box's
      evidence, the ancestor line whose args contain `night-run.sh --wrap`.
- [ ] This sprint's § Files Changed carries a row for TASK-424, and `bun scripts/lib/check-prose-density.ts .` prints
      `prose-density: N pass, 0 fail`. *Verify: that check.* The row is first written exactly as § Seeded draft gives it. Its
      Change (WHY) cell is over 400 characters, so the first check FAILs. Repair it under ADR-022 (one retry), then re-run the check.
      Log the retry in this sprint's Execution Log as its own line at column 0, not fenced and not bulleted (the reaper counts only
      that shape), e.g. `T1 · retry · standards: prose-density Change cell 495 > 400 chars → fixed`.

## Seeded draft

The first write of the § Files Changed row, verbatim (a seeded FAIL: its Change (WHY) cell is over 400 characters, and the check
measures a table row by its longest cell):

| `docs/work/in_progress/TASK-424-verify-the-live-run-is-wrapped-and-repair-one-seeded-check-fail.md` | T1 | the run transcribed the ancestor process line showing that the detached wrapper which owns this unattended run is `night-run.sh --wrap`, the TERM-catching wrapper SPRINT-122 T1 shipped, on its first live input during this unattended overnight run on the VPS clone, and recorded it verbatim as the evidence of this task's first box, so that the fixture-only proof from SPRINT-122 T1 gains a live witness taken from the very process tree that owns this run rather than from a throwaway test tree | Low | `ps` ancestry, verbatim |

## Touches

- this file's ticks and evidence · this sprint's § Files Changed (one row)

## Assumes

- none

## Tracker

- SPRINT-122 T2 (TASK-415) vehicle, owner-ruled at G2 2026-10-10 · SPRINT-122 T1 (TASK-423) · ADR-022 · EPIC-015 CW5 · CW7
