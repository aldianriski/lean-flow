---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.42.0

> Rotated out of root `CHANGELOG.md` at v1.44.0 (§11: keep current + previous inline).

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
