---
id: TASK-573
title: "Stop lean-flow sessions parking a headless run by writing verification probes outside the working tree"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-555]
---

# TASK-573 — Stop lean-flow sessions parking a headless run by writing verification probes outside the working tree

## Why
S0's convention (-10.3) and business (-11.1) regressions, which admitted S3 (EPIC-023 D10), are not more judge FAILs: A1 has
1 and 2 against A0's 2 and 3. They are UNKNOWN verdicts. Part of them comes from lean-flow sessions that stopped at a permission popup and were
parked, so no judge ran. That happened in 6 of A1's 48 round-0 trials and in 3 of A2's first 17, and in none of A0's. Each one was a throwaway
`check.mjs`/`probe.mjs` written to the OS temp dir or `C:\Users\Public`, or a Bash/PowerShell command needing a prompt
(an env export + `go run ./cmd/migrate`, a `mktemp` heredoc, a piped `npm run typecheck`). An adopter's unattended run
loses the task the same way. The parked sessions' streams were swept, so the cause is not yet known.
Owner ruling 2026-11-02: S3's first slice targets these popup stops; S3a's brief fields wait.

## Done when
- [ ] Cause named: at least one fresh lean-flow session on a task that parked (reissue-invitation, access-activity-type-filter,
      self-onboarding-guard or pilot-seat-limit), run headless on a research copy of its A2 snapshot (never the frozen
      snapshot), reproduces an out-of-tree write or prompted command; its stream is kept and the skill text or behaviour that
      led to it is quoted. If the cause is not lean-flow text (the model's own default), that is recorded with the stream as
      evidence, and the fix below is the guidance that counters it.
- [ ] Fixed: the named skill text changed so a verification probe stays inside the working tree, or uses the repo's own test
      runner, and is removed afterwards. The same tasks re-run headless with the fixed plugin, one run each, stop at 0 popups;
      streams kept.
- [ ] Consumer surface: CHANGELOG `[Unreleased]` entry (unversioned until its arm passes, D6); README only if a
      user-visible behaviour changes.

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
