---
id: TASK-599
title: "Release the admitted set as 2.20.0, or record a no-ship"
type: feature
epic: EPIC-023
sprint: SPRINT-161
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-598]
---

# TASK-599 — Release the admitted set as 2.20.0, or record a no-ship

## Why
EPIC-023 S4's release half: the version follows the measured result (D9), and nothing ships without a passing arm (D6, D16).
3.0.0 needs H1/H2 held and a named consumer-contract break; H1 failed (arm A2) and H2 was never admitted (D10), so unless
TASK-598 changes that reading the release is a 2.x MINOR.

## Done when
- [x] The version ruling is recorded in EPIC-023: a 2.x MINOR unless H1/H2 held and a named consumer contract breaks (D9); when ✓ EPIC-023 D22: 2.20.0 MINOR; STANDARD major and 3.0.0 not taken (H1 failed, H2 not admitted, no contract break)
      they did not hold, the STANDARD MAJOR is recorded as not taken, with the reason.
- [x] Every component TASK-598 ruled out is absent from what ships, and what ships is a set TASK-598 measured as passing: ✓ bundle 3 + TASK-597 off `main` at `1d6b616a` before the bump; arm Release measured the exact set (93.8%, passes); off-host gate 490/0, bun test 589/0
      removed from `main` before the version bump, with the gate green (a removal larger than size S is split into its own task
      first).
- [x] When TASK-598 rules that something ships: `[Unreleased]` becomes the release entry with migration notes for adopters (what ✓ `847911c0`: release entry with Upgrading notes, D6's held S1 notes released, 4 grep-derived manifests + README footer 2.20.0 (lockstep PASS), v2.18.x rotated; stops before push
      re-running `migrate` adds, what changed in `/orchestrator`), D6's held notes resolved; every versioned manifest equal (the set
      derived with `grep -l '"version"' .*-plugin/*.json`) and the README footer; the CHANGELOG rotated as §11 requires for a new
      MINOR; the off-host gate green. It stops before push: the owner pushes.
- [x ] EPIC-023's S4 condition is ticked only after the owner has pushed the release (D6: a release, not a commit, is what ships), ✓ owner pushed `ec30d8d9..00bf98de` 2026-11-03; v2.20.0, release commit `847911c0`; EPIC-023 S4 ticked
      naming the version and its commit; or, when TASK-598 rules that nothing ships, on a recorded no-ship with its numbers and
      `[Unreleased]` held.

## Touches
`CHANGELOG.md` · `docs/changelog/` · the versioned manifests · `README.md` · `docs/epic/EPIC-023-specific-not-short.md` · whatever a
ruled-out component's removal touches

## Assumes
- Work outside the epic already on `main` (SPRINT-157, SPRINT-159) ships in the same release; it has its own gates, not D16's arm.
  A no-ship holds it too, until the epic's components are removed from `main` or a later arm passes.
- An S1 removal, if TASK-598 rules one, is large (init, migrate, templates, entangled with SPRINT-159's migrate work) and is split
  out before this task proceeds.
- Unblocks when TASK-598 is done.

## Tracker
EPIC-023 S4 · D6, D9, D16 · STANDARD §15 (versioning) · draft reviewed by Codex, 2 rounds, CLEAR
