---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.42.0 — Open the Standard (2026-08-15)

MINOR — SPRINT-068, **3 of 3 units**, coordinator + 2 dispatched builders + 1 scoped reviewer.
Clears the ready pool and opens EPIC-003's door: the pre-extraction ruling lands, and the proof
layer's two ruled follow-ups ship.

**What changed for you**

- **ADR-023 — CONTEXT.md becomes a consumer of the extracted spec.** EPIC-003's opening ruling,
  settled before the first extraction commit as ADR-018 required: the future `spec/` tree is the
  SSOT for every standard-owned rule; `.claude/CONTEXT.md` cites it and keeps only project-local
  facts (roster · streams · tiers). The migration window is closed by **move+cite atomic commits** —
  a rule enters `spec/` and its old home becomes a citation in the same commit, so no commit leaves
  a rule stated twice. EPIC-003's extraction sprints can now promote.
- **The run-level Execution Log event is now `run-complete`** (TD-055 resolved by rename, not by
  note). Writing a task-level "complete" no longer arms the run-level rollup assertions —
  `check-night-run-rollup.sh` matches the delimited `| run-complete |` field, `scripts/night-run.sh`
  writes it, and `sprint-log.md.template` (ships to consumers) documents it, all renamed together.
  A new fixture leg pins the old misfire shape as passing; historical `complete` logs stay valid
  (archives are not re-litigated).
- **The system-verify contract checker now runs inside the QA gate** — promoted to
  `evals/run-system-verify-fixtures.sh` and registered always-on in `qa-check.sh` (0.66s, git-free —
  TD-016's axis). Five legs green in-gate; a deliberate violation fails the whole gate naming
  `system-verify-fail-silently-closed`.
- **Every mechanism proved itself on this run**: system-verify's first real firing was a legitimate
  RED that blocked this very close (an out-of-vocabulary ADR tag no reviewer was briefed on — fixed,
  re-run, 147/0); the revise loop fired once and closed at its ceiling; the rollup carries the first
  `run-complete` event plus 13 per-criterion evidence lines.

**Maintainer-facing**

- **Scope-change, owner-ruled mid-sprint:** TD-055's ruling named the checker, fixtures and template
  but not the event's live **writer** — `night-run.sh` would have kept emitting `complete` against a
  checker that no longer reads it (a silently dark rollup gate). Extended in-sprint; filed as
  **L-124** (a rename's census enumerates producers, not only asserters and docs). **TD-056 family
  scoped** by T2's scan (exactly two Layers-family checkers share the silent bare no-op) →
  **TASK-212**. Plugin reinstall owner-action finally actioned (cache 1.41.0, three sprints carried).
- **Found at this close and fixed in it:** `check-layers-observed.sh` excluded `CHANGELOG.md` from
  close-time bookkeeping but never its §11 rotation sibling `docs/changelog/CHANGELOG-<version>.md`,
  so every MINOR close since the rotation convention shipped has gone red on its own bookkeeping —
  SPRINT-067's `CHANGELOG-1.39.0.md` tripped it unnoticed. Row added with the two-phase width guard
  its neighbouring case already used (reported during execution, excluded at close).

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

_Older releases (**v1.40.0** and earlier) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
