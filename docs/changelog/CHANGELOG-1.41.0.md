---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.41.0

> Rotated out of root `CHANGELOG.md` at v1.43.0 (§11: keep current + previous inline).

## v1.41.0 — The Proof Layer (2026-08-15)

MINOR — SPRINT-067, **2 of 2 units**, coordinator + dispatched builders. Builds what v1.40.0's
rulings enabled; with it, the second gauntlet audit's remainder is fully landed — contract ruled,
proof built.

**What changed for you**

- **A run now proves its integrated tree, not just its tasks.** `dispatch.md` § System verify: after
  a multi-task run's **final** merge-back, one full-gate pass runs over the integrated tree — the
  host repo's own gate command, **discovered** (manifest scripts → Makefile/justfile → CI test step →
  ask attended / a `no-gate-discovered` rollup line unattended), never hard-coded. A FAIL **blocks
  the silent close** (ADR-021): the coordinator surfaces it and the override is a documented,
  machine-checkable shape — `owner-ruling: system-verify — <ruling + reason>`. Verdict is read from
  the gate's output, never its exit code. Retained contract fixtures:
  `evals/fixtures/system-verify/` (5 legs incl. the must-FAIL and the archive-skip).
- **Every ticked criterion names what proved it.** `night-run.md` Part 4: the rollup's `N of M`
  header gains a per-criterion block — `Tn.k · ticked | open | overridden · <evidence: test | check |
  fixture | review | owner-ruling>` — emitted always; a `ticked` line with no named evidence is the
  silent tick ADR-021 exists to close, and an `overridden` criterion cites the recorded owner ruling,
  so an override reads as exactly that. The review report and `SPRINT.md.template`'s DoD guidance
  teach the same convention (✓-evidence ticks + `*Verify:*` clauses).
- **Both features first fired on the run that built them** — the sprint's exit rollup carries the
  first real `system-verify · PASS` line and the first twelve `Tn.k` evidence lines.

**Maintainer-facing**

- **The revise loop fired twice — its first runs against dispatched builders — and both catches were
  mirror images**: a checker asserting a format no procedure documented (T1), and prose referencing a
  shape no checker asserts (T2). Filed as **L-123** (a machine-asserted shape and its checker are
  born together, or not at all); **L-122 → count 2** (brief reviewers with the decision as logged —
  promotable at the next promote).
- Known gaps, named: `check-system-verify-block.sh` is deliberately not yet wired into `qa-check.sh`
  (→ follow-up task) · TD-055 ruled — rename `complete` → `run-complete` (→ follow-up task) · the
  plugin-reinstall owner action is three sprints unactioned (installed 1.38.0 vs repo 1.41.0).

