---
id: TASK-574
title: "Measure the popup-stop fix as arm A4a against A2"
epic: EPIC-023
sprint: SPRINT-156
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-573, TASK-575]
---

# TASK-574 — Measure the popup-stop fix as arm A4a against A2

## Why
EPIC-023 D8 measures each S3 step on its own arm, and D10 has S3 compare against A2. The fix from TASK-573 changes only
plugin text, so A4a is A2's frozen snapshots with the plugin pinned at the fix commit. Owner ruling 2026-11-02: a full
arm, not targeted runs only.

## Done when
- [x] PREREGISTRATION Amendment 7 owner-signed before any A4a trial: arm A4a (both repos, A2's snapshots and manifests unchanged, ✓ 2026-11-02: Amendment 7 owner-signed at 5339c67c, before the pilot (6f190c59)
      plugin pinned at the commit that carries the fixes of TASK-573 and TASK-575), a 32-slot schedule built like A2's, a derived pilot, its own log with a
      freeze line, and section 11 validity first. The ruling against A2 follows Amendment 6 §7's rules with A2 as the comparator, and the park
      rate is reported as the mechanism measure.
- [x] All 32 slots measured; A4a passes section 11's run-validity rule on its own slots. ✓ 2026-11-02: 32/32 slots, 0 infra-lost, VALID (881a79a2)
- [x] The ruling (ship-eligible / failed / inconclusive) is owner-signed and recorded in the A4a log and EPIC-023. ✓ 2026-11-02: ship-eligible, tuning-sensitive; owner rules it ships (A4a log § Report 2026-11-02, EPIC-023 D15)

## Touches
evals/ab/PREREGISTRATION.md (Amendment 7) · evals/ab/arms/<repo>-a4a.json · evals/ab/schedule-a4a.json ·
evals/ab/hash-prereg.ts · docs/research/logs/ab-measurements-a4a.md · the analysis code TASK-555 extends for a non-A0 comparator

## Assumes
- TASK-555 extends the analysis to a comparator other than A0, and this task reuses it rather than writing a second one.
- About $65 and 2 hours of trials, run by the owner in their terminal, as for A2.
- If TASK-555 rules A2 failed, A4a still stacks on A2 (owner ruling 2026-11-02).

## Amended 2026-11-02
Owner ruling: arm A4a bundles three lean-flow fixes (TASK-573 popup stops, TASK-575 declared files only, TASK-576 light
path for small tasks) and is measured once against A2; S4's leave-one-out attributes them. The plugin pin and `depends-on` now
name all three; TASK-555 is done.

Amended 2026-11-02 (SPRINT-156 G2, owner ruling): TASK-576 is cancelled, so A4a pins the commit carrying TASK-573 and
TASK-575 only (EPIC-023 D13).

## Tracker
EPIC-023 § Closed when S3 · D8 · D10
