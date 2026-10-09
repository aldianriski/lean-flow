---
owner: Maintainer
last_updated: 2026-10-09
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

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

---

## v2.2.0 — The night-run launcher keeps a fire-time ledger (2026-10-09)

**MINOR** — ships SPRINT-118 · SPRINT-119 (entries below). No upgrade step beyond installing `2.2.x` and restarting the session
(a live session keeps the plugin copy it started with).

- **`scripts/night-run.sh` writes `fired · <ts> · <mode>` to the sprint's Execution Log before the run starts**, and refuses to fire when
  no sprint resolves. A run that dies before the reaper is now on record, and the sprint cannot close past it (`CLOSE-FIRED-UNREAPED`).
- **First real unattended run since the reaper repair:** `PLAN_EXHAUSTED` · `DELIVERED`, checked on the committed log (EPIC-015).

---

## SPRINT-119 — Fire-Ledger Vehicle (2026-10-07)

**Unreleased**: no consumer-facing file changed (it is the seeded vehicle for SPRINT-118 T2).

- **The first real unattended run since the reaper repair** fired against this all-J0 Plan on the VPS: `PLAN_EXHAUSTED` · `DELIVERED`,
  $0.83, no confirmation asked, 0 permission denials. It transcribed its own `fired ·` line and the authority verdict (TASK-405).

---

## SPRINT-118 — Prove the Run (2026-10-09)

**Unreleased**: `scripts/night-run.sh` and `skills/orchestrator/references/night-run.md` changed, so this reaches adopters at the next release.

- **The night-run launcher writes a fire-time ledger.** `night-run.sh` appends `fired · <ts> · <mode>` to the sprint's Execution Log
  before the wrapped command runs, and refuses to fire when no sprint resolves. A run that fires and dies before the reaper is now on
  record, and the sprint close check FAILs it as `CLOSE-FIRED-UNREAPED` (TD-122). The authority check reads the same line as the
  written fact of an unattended run (TD-124).
- **EPIC-015 Closed-when 1 is met on live input:** one real `--mode overnight` run ended at a named terminal state, and every check read
  the committed log. The first real `/handoff` record went `live` → `consumed` → `spent` through `check-handoff-state.sh` (TASK-327).

---

