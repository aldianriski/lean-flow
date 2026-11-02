---
id: TASK-573
title: "Stop lean-flow sessions parking a headless run by writing verification probes outside the working tree"
epic: EPIC-023
sprint: SPRINT-156
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-573 — Stop lean-flow sessions parking a headless run by writing verification probes outside the working tree

## Why
S0's convention (-10.3) and business (-11.1) regressions, which admitted S3 (EPIC-023 D10), are not more judge FAILs. On each
measure's own tasks, first pass: convention FAIL A1 1 vs A0 2, business FAIL 0 vs 0. They are UNKNOWN verdicts (convention 8 vs
3, business 4 vs 1). Part of them comes from lean-flow sessions that stopped at a permission popup and were parked, so no judge
ran (L-272). Scored parks: A1 3 of 48, A2 3 of 32, A0 none. Five were a throwaway `check.mjs`/`probe.mjs`/`check.ts` written to
the OS temp dir, and one a Bash `mktemp` heredoc writing a probe there. An adopter's unattended run loses the task the same
way. The parked sessions' streams are kept in `D:\ab-work\kept\` (an earlier line here said they were swept; corrected at G2).
Owner ruling 2026-11-02: S3's first slice targets these popup stops; S3a's brief fields wait.

## Done when
- [x] Cause named: the kept streams of the parked sessions (`D:\ab-work\kept\`) show the out-of-tree write or prompted command and the design step that led to it, and the skill text or behaviour behind it is quoted (scope-change 2026-11-02, owner ruling). If the cause is not lean-flow text (the model's own default), that is recorded with the stream as evidence, and the fix below is the guidance that counters it. ✓ 2026-11-02: from the nine kept parked streams: pin-first adds verify-script tests outside the layers, G2 refuses, the revise round promises a throwaway probe "outside the repo", the build writes it to the OS temp folder; no lean-flow sentence names the temp folder (the model's own default), quoted in the SPRINT-156 log
- [ ] Fixed: the named skill text changed so a verification probe stays inside the working tree, or uses the repo's own test
      runner, and is removed afterwards. The same tasks re-run headless with the fixed plugin, one run each, stop at 0 popups;
      streams kept.
- [x] Consumer surface: CHANGELOG `[Unreleased]` entry (unversioned until its arm passes, D6); README only if a user-visible behaviour changes. ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line for `/orchestrator` (`ca13d54e`); README unchanged, no user-visible mode change

## Touches
the skill(s) the diagnosis names (`skills/**`) · CHANGELOG.md · evidence under `docs/research/` (streams summarised, never
committed raw)

## Assumes
- Reproduction and re-runs start only after the A2 trials end (EPIC/SPRINT-154 D3: no load on this machine while trials
  measure wall time); about $2 a run.
- A park is a lean-flow defect, not a harness artifact: A0 sessions run in the same isolation, at the same permission mode, and never parked.
- The cache-breach and judge-cutoff UNKNOWNs are out of scope here. They are harness measurement limits, not session
  behaviour.

## Tracker
EPIC-023 § Closed when S3 (first slice, owner ruling 2026-11-02) · S0 report `docs/research/logs/ab-measurements.md` § Report
2026-11-01 · A2 rows in `docs/research/logs/ab-measurements-a2.md`
