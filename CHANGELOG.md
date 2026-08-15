---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

## v1.40.0 — Verification Authority (2026-08-15)

MINOR — SPRINT-066, **2 of 2 units**. Two ADR-grade rulings that decide *who may say no* — the
boundary the second gauntlet audit's remainder funnels through, settled before anything is built on
it (TASK-208/209 unblock with this release).

**What changed for you**

- **ADR-021 — mechanical evidence gates the silent path, never the owner.** Where a task's
  `done-when` names a mechanical check, that check's FAIL now blocks the *silent* DoD tick: the
  coordinator surfaces it and gets a **recorded owner ruling** (the override is always available —
  the owner is never gated). The consumer's CI is never run as a blocker on lean-flow's own
  authority. G2 gains one checklist line: each `done-when` notes its verification method where a
  mechanical check exists. Wired: `orchestrator/SKILL.md` § G2 · `review-scoping.md` § QA suggestion
  (the evidence boundary) · CONTEXT.md § Gates.
- **ADR-022 — unattended retry: the mechanical-trigger carve-out.** The revise loop may fire inside
  an unattended run only when **three prior human decisions** exist: the trigger is a
  `done-when`-named check FAIL (the ADR-021 class — a critic's *judgment* finding always parks), the
  ceiling is the owner-ruled one-retry-per-pass, and the repo's **declared policy** enables it
  (absence of the policy = never — absence ≠ consent). One rollup line per firing. Wired:
  `night-run.md` Part 0 boundary rows + Part 4 retry line · `review-scoping.md` § The revise loop ·
  SKILL.md § Review · CONTEXT.md.
- **The revise loop's first production firing was on its own extension.** T2's scoped review caught
  the superseded "unattended never retries" line surviving in two consumer touchpoints (the L-020
  shape); one bounded retry fixed both axes' findings; the delta re-review confirmed with no second
  firing.

**Maintainer-facing**

- Filed: **L-122** (brief the Spec axis with the decision as logged — it turns the wiring check into
  a mechanical matcher) · a sighting note on **TD-052** (two more procedural gates, each naming its
  control at authoring time — the third-gate trigger did not fire). TASK-207/203 shipped;
  TASK-208/209 → `ready`. The plugin-reinstall owner action carries a second sprint — installed
  cache 1.38.0 vs repo 1.40.0.

_Older releases (**v1.39.0** and earlier) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
