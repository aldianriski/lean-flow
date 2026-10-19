---
id: TASK-455
title: "Make the gate-discovery guard recognise a wrapped gate invocation"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-130
---

# TASK-455 — Make the gate-discovery guard recognise a wrapped gate invocation

## Why

ADR-035's own guard has been red since SPRINT-097 (TD-154): the rung-1 command wraps the declared gate as
`bun scripts/qa-verdict.ts sh scripts/qa-check.sh`, and the guard only accepts a segment that *starts* with the declared
command, so it reports the gate as bypassed when it is run. A guard that is always red is read past, and then guards nothing.

## Done when

- [x] A command segment counts as invoking the declared gate when the declared command is its trailing argument list and the segment's head is not a non-executing builtin (`echo`, `printf`, `:`); `test/gate-discovery/discovery-order.test.ts` passes on this repository. ✓ b64ff9c0 (T1 1e0d443a + review fix 1da1259b); gate-discovery 15/0 on this repo incl. the rung-1 test; Codex re-review CLEAR
- [x] A new retained must-FAIL fixture: an unquoted `echo sh scripts/qa-check.sh` segment still reports the gate as bypassed. The existing negatives (the quoted-echo mention, the `.bak` prefix) still report bypassed, and the control still passes. ✓ unquoted echo/printf/: MUST-FAIL retained; seeded drop of echo reddens exactly it (14/1), restored 15/0; quoted-echo and .bak negatives stay red
- [x] One run on the real artifact (this repository's `package.json` + `.gate-command`) recorded, and TD-154 marked resolved with that evidence. ✓ real-artifact run bun test test/gate-discovery/ 15/0 on integ-130; TD-154 resolved in TECH-DEBT.md

## Touches

test/gate-discovery/discover.ts (`invokes`) · test/gate-discovery/discovery-order.test.ts · TECH-DEBT.md (TD-154, coordinator)

## Assumes

- the guard is maintainer-only: only `test/gate-discovery/` calls `bypassesDeclaredGate`, so the "Other G" bar applies (must-FAIL fixture + one real-artifact run, ADR-050); `.gate-command` and its consumer-visible format are not changed (owner ruling at intake, 2026-10-19).

## Tracker

- TD-154 · ADR-033 · ADR-035 · cause commit `3404422`
