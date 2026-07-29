---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Never — frozen archive of rotated CHANGELOG blocks (§11)
status: archived
---

# lean-flow — Changelog archive (v1.13.0)

> Rotated out of `docs/CHANGELOG.md` at the SPRINT-031 close (§11 retention — v1.15.0 landed;
> current + previous minor stay inline). Verbatim.
> Older still → [`CHANGELOG-1.12.0.md`](CHANGELOG-1.12.0.md).

## v1.13.0 — Fleet & Night-Run Build (2026-07-29)

MINOR — bundles **SPRINT-026** (the build sprint for v1.12.0's decisions).

**What changed for you:**
- **Parallel worktree dispatch is first-class in `sprint-bulk`** — disjoint sprint tasks now
  dispatch as worktree-isolated agents (one `Agent(isolation:"worktree")` per task, soft cap 3–5)
  with a coordinator-only **merge-back queue** (G2-order `--no-ff` per task, two-tier review,
  conflict + failure + cleanup paths incl. the Windows handle-lock and remote-base caveats) —
  `orchestrator/references/dispatch.md`, wired from the SKILL Sequence line and CONTEXT §Streams
  (L-042's per-hunk rule now binds intra-tree only).
- **Night-run is operational** — `orchestrator/references/night-run.md` ships the pre-flight
  checklist (all-AFK guard · zero open assumes · scoped `--allowedTools` build · `bypassPermissions`
  never) + the OS-scheduled headless trigger recipe (cron / Task Scheduler). Wired from the
  sprint-bulk Loop line. Watchdog + morning rollup land as TASK-098.
- Both capabilities were **exercised on the sprint's own wave** — the protocol dispatched and
  merged the very tasks that built it; the pre-flight guard correctly *refused* to arm an
  unattended run over HITL tasks.

Manifests → 1.13.0 lockstep; skill roster unchanged (14). Additive — nothing to migrate.
