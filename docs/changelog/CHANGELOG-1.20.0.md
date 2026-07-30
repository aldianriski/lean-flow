---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Never — rotated archive (DOCS_Guide §11); append-only history
status: current
---

# lean-flow — Changelog archive (v1.20.0 era)

<!-- Rotated verbatim from CHANGELOG.md at the v1.22.0 MINOR (§11). Never edit past blocks. -->

---

## v1.20.0 — Preflight and Verify (2026-07-30)

MINOR — SPRINT-036. ADR-013's adopted leg built, and both standing verification gaps closed —
by running the machinery on itself.

**What changed for you:**
- **The declared-base rule ships.** Parallel dispatch (interactive or unattended) now states:
  every worktree/agent branches from the wave's declared base commit, verified against live HEAD
  at spawn — mismatch halts the wave; the check re-runs at every wave boundary. Traced against
  the real incident that motivated it (worktrees cut from stale session-start HEAD): caught
  pre-spawn.
- **The JSON execution-graph is rejected — the checks stay, the file format doesn't.** A throwaway
  163-line POSIX-sh preflight proved cycle detection, shared-file single-owner, base-ref, AND
  parallel-wave computation all derive from the three markup tokens the sprint lint already
  enforces (ADR-013 addendum). Productionizing the step is TASK-121.
- **The unattended contract is verified on the consumer path.** A headless `sprint-bulk unattended`
  run against the installed 1.19.0 cache parked every HITL task, refused to commit over the
  coordinator's WIP, and recorded (not dodged) its one tool denial. Found one real gap: `/handoff`
  isn't in the Part 1 allowlist (TASK-122).
- **Three wording gaps fixed by a cold read** of the night-run entry-path surfaces — including a
  genuine prose-vs-table contradiction in `night-run.md`'s Mode note, now aligned with Part 0's
  derivation rule.

---

_Older releases (**v1.19.0** and earlier) → [`CHANGELOG-1.19.0.md`](CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](CHANGELOG-1.7.1.md)._
