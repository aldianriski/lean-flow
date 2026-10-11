---
owner: Maintainer
last_updated: 2026-10-11
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.3.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.5.0 release** (2026-10-11). §11 keeps the
> current and previous minor inline (2.5.x and 2.4.x), so cutting v2.5.0 pushed v2.3.x out.

## v2.3.0 — conformance.sh skips worktrees; §11 keeps a task a live doc cites; spec 0.14.0 (2026-10-09)

**MINOR** — ships SPRINT-120 (entry below). No upgrade step beyond installing `2.3.x` and restarting the session (a live session keeps
the plugin copy it started with). The standard moves to **spec 0.14.0** (MINOR: no verdict goes from pass to fail).

- **`conformance.sh` ignores `.claude/worktrees/`** on every file walk, so isolated-agent copies no longer produce findings.
- **§11's closed-task prune keeps a task any live doc still cites**, and a scan that cannot complete proposes nothing.

---

## SPRINT-120 — Conform to Our Own Standard (2026-10-09)

**Unreleased**: `scripts/lib/conformance-engine.sh` and `spec/STANDARD.md` changed (spec 0.14.0), so this reaches adopters at the next release.

- **`conformance.sh` no longer reads Claude Code's worktree copies.** Every file walk skips `.claude/worktrees/`, so a repo that uses
  isolated agents stops getting findings sourced from those copies. A repo root containing glob characters is handled too (TASK-409).
- **§11's closed-task prune keeps a task that a live doc still cites** (spec 0.14.0, MINOR: only fail → pass). A live citation is the
  task id as a whole word in any tracked `.md` that is not history: closed task files, archives, archive indexes, changelogs, ADRs,
  LEARNINGS and TECH-DEBT. A citation scan that cannot complete now proposes nothing, rather than proposing everything (TASK-410).
- **lean-flow passes its own conformance check at level Structural**, up from `level: none`.
