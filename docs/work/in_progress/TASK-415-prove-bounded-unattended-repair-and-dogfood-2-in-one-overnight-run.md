---
id: TASK-415
title: "Prove bounded unattended repair and Dogfood 2 in one overnight run"
epic: EPIC-015
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-122
depends-on: []
---

# TASK-415 — Prove bounded unattended repair and Dogfood 2 in one overnight run

## Why

CW5 (a concrete J1 critic finding → repair → re-review → continue, within ADR-022's ceiling) and CW7's Dogfood 2 (overnight with
≥1 J1 decision, ≥1 repair, and a J2 park or seeded control) are both claims about a real run. Owner ruling 2026-10-10: one combined
vehicle run proves both.

## Done when

- [x] A vehicle sprint is promoted with a signed, pinned `approval_envelope:` whose `repair-policy` grants ADR-022's carve-out, and
      a Plan holding one honest J1 task whose done-when names a check seeded to FAIL on its first build, plus a seeded J2 control:
      a second J1 task whose review is seeded to return a judgment finding (EPIC-015 D5). *(Re-scoped at G2: a judgment finding
      always parks under ADR-022:35-36, so the repair seed is a named-check FAIL. A declared J2 task fails pre-flight item 3, TD-109
      ruled STRICT by SPRINT-093 D3, so the J2 is met mid-run, the shape night-run.md:73-75 parks. Owner ruling, 2026-10-10.)*
      ✓ SPRINT-123 `plan locked` `838e714`; pins `3ccc41d6`; `scripts/lib/check-approval-envelope.sh` PASS (all 10, @ 838e714); TASK-424 and TASK-425 J1.
- [x] One real `--mode overnight` run on this repository: the seeded FAIL is repaired and re-checked (≥1 repair cycle, never
      exceeding ADR-022's ceiling), the run continues past it, and the seeded judgment finding parks with its unblock condition.
      ✓ Fired 2026-10-10T10:05:33Z on the VPS (`fired detached: pid=1390349`, `ALIVE`); exit 0, $1.32, 26 turns, 0 denials; merged `29cefb66`.
- [x] Each claim is verified against artifacts, not the run's report: the finding, the repair commit, the re-review record and the
      park are each cited by commit or log line; the rollup guard PASSes on the committed log; the outcome line shows
      repair-cycles ≥ 1.
      ✓ SPRINT-123 log l.94 FAIL · l.96 re-check `0 fail` · l.97 `T1 · retry · … → fixed` · repair `86672c57` · l.106 `T2 · parked-hitl · …`
      · reviewer verdict in TASK-425 (`b56272b5`). Guard: the first reaper block FAILed (a reaper defect, fixed in T2 `27d75a78`…`dc490880`);
      the re-reap with the fixed launcher (`d4b726db`) → `PASS … agrees with its per-task lines`; `repair-cycles · 1`.
- [x] EPIC-015 CW5 is ticked, and CW7's Dogfood-2 half is recorded as proven, each naming that evidence.
      ✓ CW5 and CW7 ticked in `docs/epic/EPIC-015-execution-autonomy.md` (Dogfood 1 was already proven by SPRINT-121).

## Touches

- a new vehicle sprint file + its Execution Log · `docs/epic/EPIC-015-execution-autonomy.md`

## Assumes

- G2 recon fact: the overnight path runs a reviewer and the bounded revise unattended under ADR-022's mechanical carve-out. If it
  does not, stop for a scope ruling: the task is re-scoped into building that first (Tier G per EPIC-015 D4) and re-sized, never
  expanded silently.
- Out of scope: making the retry line mechanically emitted (TD-152 stays ruled inherent) and detached pre-flight (TASK-367 —
  SPRINT-118's run fired without it).

## Tracker

- EPIC-015 CW5 · CW7 · D5 · ADR-022 · owner grill 2026-10-10
