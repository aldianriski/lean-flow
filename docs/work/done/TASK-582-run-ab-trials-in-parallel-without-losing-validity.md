---
id: TASK-582
title: "Run A/B trials in parallel without losing validity"
epic: EPIC-023
sprint: SPRINT-158
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-574]
---

# TASK-582 — Run A/B trials in parallel without losing validity

## Why
A full arm (32 slots) takes about 2 hours because `run-baseline.ts` runs one trial at a time. Codex's process review (SPRINT-156,
2026-11-02) found the serial order is a resource and implementation constraint, not an endpoint requirement: wall time decides
nothing, though the 45-minute timeout does. Two workers could bring an arm near one hour. Owner ruling 2026-11-02: adopt
development runs as the iteration loop, bundled fixes, unattended full arms with a notification, and start this now. Maintainer
harness only, never a gate.

## Done when
- [x] The stale-workspace sweep removes only directories that belong to no live driver: a second driver started beside a running ✓ 2026-11-02: `15012173`; S71 spawns a real second process as the live owner, its dir survives the sweep, a dead owner's is swept; with the old sweep S71 FAILS
      one leaves the running trial's workspace in place (today the lock is per log while the sweep takes every `iso-*` directory).
      Shown by a selftest with two drivers, failing on the current sweep.
- [x] A bounded worker count (`--workers N`, default 1) runs N slots at once under one lock and one log, with appends serialised, ✓ 2026-11-02: `15012173`; S72 N = 1 equals the old loop (calls, rows, stop, say lines), S73 a stop drains running trials, S74 bad --workers exits 2, S75 refill and streak, S76 pilot barrier at N = 2 (FAILS on round 1); selftest 81/81, tsc clean
      owner stops (usage limit, owner-ruling exits) stopping every worker (none starts another slot; a running trial finishes and
      records its row, scope-change 2026-11-02), and resume unchanged; default 1 is byte-identical in
      behaviour to today.
- [x] A capacity check on this PC: N = 2 on a pilot-sized run completes with no timeout, no low-memory kill and no infra-lost ✓ 2026-11-02: N = 2 on 4 slots of the A4a task set, all ok and passing as in the serial trials, no timeout, no infra, no low-memory kill, pilot stop held; owner accepted (popup); SPRINT-158 log
      slot, and its per-slot results stay inside the run-to-run spread of the serial runs on the same slots (owner reads it).
- [x] An owner-signed amendment adopts the worker count for later arms before any arm runs with N > 1; earlier arms stay as ✓ 2026-11-02: PREREGISTRATION Amendment 8 item 1, owner-signed (`4c61911d`), before A4b, the first arm at N = 2; A0, A1, A2 and A4a stay as measured
      measured.

## Touches
`evals/ab/run-baseline.ts` · `evals/ab/lib/isolate.ts` · `evals/ab/selftest.ts` · `evals/ab/PREREGISTRATION.md` (amendment)

## Assumes
- RAM, not the CLI's rate limit, is the binding constraint at N = 2; the capacity check confirms it.
- Unattended launch with a completion notification already works (detached driver plus an exit watcher, SPRINT-156 T4); folding it
  into a launcher script is part of this task if it stays small.

## Tracker
SPRINT-156 log (Codex process review, owner ruling 2026-11-02) · EPIC-023 D14
