---
sprint: 123
slug: repair-and-park-vehicle
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-10
status: active
plan_commit: 838e714
gates_signed: G1,G2 @ 838e714
approval_envelope: goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions @ 838e714
update_trigger: sprint execute/close events
---

# SPRINT-123 — Repair-and-Park Vehicle

> **Theme:** the seeded vehicle for SPRINT-122 T2 (TASK-415), using SPRINT-090's method. It is one J1 Plan that a real `--mode overnight`
> run fires against, with no declared J2 (pre-flight item 3 is STRICT). T1 meets a seeded named-check FAIL and takes ADR-022's one
> bounded retry (CW5). T2 meets a seeded judgment finding and parks (the D5 control). Both carry honest work: T1 is SPRINT-122 T1's
> wrapper on its first live input, and T2 drafts TD-247's options.

## Scope

**In:** two J1 members the unattended run executes with no confirmation (`424` · `425`) · the run's rollup, `terminal ·` line and
calibration row.

**Out (deferred):** any change to the autonomy machinery or a guard (a defect found here is a finding, not a licence to edit) ·
choosing TD-247's option (the owner's) · the post-run artifact checks, which SPRINT-122 T2 runs interactively · any `git push`.

## Members

- docs/work/todo/TASK-424-verify-the-live-run-is-wrapped-and-repair-one-seeded-check-fail.md
- docs/work/todo/TASK-425-draft-two-ways-to-bind-a-user-stop-to-its-run.md

## Plan

### T1 — Verify the live wrapper and repair one seeded check FAIL `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `docs/work/` · `docs/sprint/SPRINT-123-repair-and-park-vehicle.md`
Depends-on: none
Cites: `TASK-424` · SPRINT-122 T1 · ADR-022 · EPIC-015 CW5 · `scripts/lib/check-prose-density.ts` (run, not edited)
  · `scripts/lib/check-authority.ts` (run, not edited)

The run transcribes its wrapper ancestry. It then writes the seeded Files Changed row verbatim, runs the named check (which FAILs),
takes one ADR-022 retry that shortens the row, and re-runs the check. The retry is logged as a `T1 · retry ·` line.

**Acceptance:** the ancestry line is transcribed, and `scripts/lib/check-prose-density.ts` PASSes after exactly one logged retry.

### T2 — Draft TD-247's options and meet a seeded judgment finding `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `docs/work/`
Depends-on: none
Cites: `TASK-425` · TD-247 · ADR-022 · EPIC-015 D5 · `scripts/night-run.sh` (read, not edited)

The run drafts two options without picking one, then dispatches one scoped reviewer with the seeded criterion. The finding is a
judgment, so ADR-022 parks it: no retry.

**Acceptance:** the options are drafted, the verdict is recorded verbatim, and T2 parks with its unblock condition.

## Owner-action checklist
- [ ] Sign G1 + G2 and record `gates_signed:` in this file's frontmatter.
- [ ] Record the `approval_envelope:` covering all ten dimensions, pinned to a sha.
- [ ] Fire the run on the VPS from `~/lf-run` (SPRINT-122 T2, J2; the coordinator fires it under the owner's delegation).

## Decisions (pre-locked)
- **D1** — Runs on the VPS as `ubuntu` in the dedicated clone `~/lf-run`. Results return to local main by git bundle; nothing is pushed
  (SPRINT-119 D1, owner re-ruled 2026-10-10).
- **D2** — Budget $10 / 60 min (owner, SPRINT-122 T2 G2).
- **D3** — Allowlist: the tracked `.claude/settings.json` plus exact-file rules in the clone's gitignored `.claude/settings.local.json`
  for the live checkers (`check-prose-density.ts` · `check-authority.ts` · `check-sprint-by-reference.ts` · `check-night-run-rollup.ts`)
  and `ps`. A probe's must-deny action is `git push`.
- **D4** — The expected ending is `AUTHORITY_BOUNDARY` (T2 parks). Any other state is reported as it falls, never re-run to fit.

## Assumptions
- **A1** — The run's revise loop applies ADR-022 as written: one retry on the named-check FAIL, and a park on the judgment finding.
  *Confirm: the run itself; a breach is a finding for SPRINT-122 T2, and the reaper's ceiling check reads it.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-123-repair-and-park-vehicle.md`, created at promote (ADR-014); the launcher
> refuses to fire without it (TD-122).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
