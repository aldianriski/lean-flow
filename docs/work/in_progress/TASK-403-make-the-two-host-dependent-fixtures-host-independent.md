---
id: TASK-403
title: "Make the two host-dependent gate fixtures host-independent (TD-224 · TD-225)"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-115
---

# TASK-403 — Make the two host-dependent gate fixtures host-independent (TD-224 · TD-225)

## Why

origin note: SPRINT-114 post-push full gate (2026-10-06), run off-host on a Linux VPS; filed at the SPRINT-115 promote, NOT grilled at intake

The first full `QA_FULL=1` gate on a second host came back `300 pass, 3 fail`, and two of the three FAILs were the fixtures, not
the code. `run-gen-index-locale-fixtures.ts` claims bash's glob order but spawns `sh`, which is dash on Debian/Ubuntu (TD-224).
`run-qa-budget-position-fixtures.sh` case 2 asserts silence inside a 60 s wall-clock window, so a fast host trips leg 12's own
check in 3 s (TD-225). A gate that is red on every fast or dash host cannot be the off-host route the memory-starved maintainer
host now depends on.

## Done when

- [x] TD-224: the locale control either spawns `bash` (its stated claim) or reports a dash host as a named host-INVALID finding outside the gate's FAIL count — ruled at G2 — and the gate is green on Ubuntu 24.04 with `en_US.utf8`. Verify: the harness run on the VPS and on the Windows host, both read from their own verdict lines. ✓ bash chosen (6184fd2): locale harness `5 pass, 0 fail` on Windows and on the Ubuntu 24.04 VPS, own verdict lines (coordinator re-ran Windows on the merged tree, 8b780fa); the sh-revert seed gives `3 pass, 2 fail` on dash
- [x] TD-225: case 2 asserts WHERE the first budget finding lands (leg 12's loop-internal check, never an early checkpoint), not silence within a wall-clock window. Verify: PASS on both hosts, and the seeded design (checkpoints kept) still reddens case 2 with its named finding while case 1 stays green. ✓ case 2 PASS on Windows (2m02s) and VPS (4.4s) via `broken-copy-first-finding-at-leg-12`; the checkpoints-kept seed reddens case 2 with its named `-early` finding on both hosts while case 1 stays green; blobs restored (hash-object == HEAD) (6184fd2)

## Touches

- `evals/run-gen-index-locale-fixtures.ts` · `evals/run-qa-budget-position-fixtures.sh` · `TECH-DEBT.md` (TD-224 · TD-225 rows)

## Assumes

- the VPS `ubuntu@129.226.95.172` stays available as the second host. *Confirm: key login at execution.*

## Tracker

- TD-224 · TD-225 · SPRINT-114 log, 2026-10-06 entry · L-198 (a second route that varies the selection — here, the host)
