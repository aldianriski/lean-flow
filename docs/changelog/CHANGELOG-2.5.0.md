---
owner: Maintainer
last_updated: 2026-10-18
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.5.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.7.0 release** (2026-10-18). §11 keeps the
> current and previous minor inline (2.7.x and 2.6.x), so cutting v2.7.0 pushed v2.5.x out.

## v2.5.0 — stopping an unattended run reports USER_STOP; a run that parks passes its own rollup guard (2026-10-11)

**MINOR** — ships SPRINT-122 (Finish EPIC-015). Installing the next release is enough; no upgrade step. The standard is unchanged
(spec 0.15.0).

**Consumer-facing (unattended runs):**
- **Stopping a run now reports `USER_STOP`.** Send TERM to the pid the launcher prints as `fired detached: pid=`. The wrapper catches
  it, stops the run, and the rollup reads `terminal · USER_STOP` / `PARTIAL` with every field. INT and HUP are ignored on entry to a
  detached shell, so use TERM. Killing the `claude -p` process itself still reads `HARD_FAILURE`, the same as the watchdog
  (`night-run.md` Part 3 and Part 4).
- **A run that parks now passes its own rollup guard.** The launcher's rollup block carries every non-green task line (parked,
  blocked, stalled, denied-tool), as Part 4 requires. Before this, every reaped `AUTHORITY_BOUNDARY` failed `check-night-run-rollup`.
  A re-reap no longer double-counts, and a CRLF checkout no longer defeats it.

**Maintainer-side:** EPIC-015 CW5, CW6 and CW7 proven. The first unattended repair cycle and Dogfood 2 ran on vehicle SPRINT-123
($1.32, one ADR-022 retry, one seeded park). TD-247 (Option A → TASK-426) · TD-248.
