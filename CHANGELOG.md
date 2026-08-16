---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.43.0 — First Extraction (2026-08-16)

MINOR — SPRINT-069, **5 of 5 units**, EPIC-003's first member sprint. The standard stops being one
skill's reference file and becomes an artifact you can pin.

**What changed for you**

- **The standard now lives at `spec/STANDARD.md`, versioned at `0.1.0`, with its own
  `spec/CHANGELOG.md`** — moved out of `skills/lean-doc-generator/references/` in a single move+cite
  commit (ADR-023: no commit in history leaves a rule stated in two places). It versions
  **independently of `plugin.json`**, so pinning the standard no longer means pinning the plugin, and
  a plugin patch release no longer moves your standard version. Every skill may now cite it — until
  now only `lean-doc-generator` could, because a skill never points into another skill's
  `references/`.
- **Three conformance levels are defined — Structural → Gated → Attested** ([ADR-024]) . Each is
  checkable from a *different* class of evidence: the file tree, the repo's planning records, and git
  history alone. That means you can self-assess with `ls` and `git log` before adopting any tooling —
  the engine that automates it is EPIC-004's, and no level's definition depends on it. lean-flow
  itself is **Gated**, deliberately not the top: it records gate sign-off but cannot yet emit
  per-task attestation trailers.
- **86 citation sites across skills, templates, scripts and docs** now name the standard by its new
  name. Frozen surfaces were deliberately left alone — accepted ADRs, past learnings, superseded
  research and archived sprints are history and stay readable as written.
- **Two gate checkers no longer pass silently when run with no arguments.**
  `check-layers-completeness.sh` and `check-layers-observed.sh` used to print nothing and exit 0,
  which is indistinguishable from a clean run; both now print a "nothing verified" note (TD-056
  resolved). If you invoke them directly, silence no longer reads as success.
- **`.claude/worktrees/` is git-ignored**, so a `git add -A` during parallel dispatch can no longer
  stage a second copy of your whole repo (TD-053 leg 2 resolved).
- **`CLAUDE.md`'s Self-contained principle now states what is true:** the generator bundles its
  templates and *cites* the standard, rather than owning a copy.

**Maintainer-facing**

- **TD-054's mechanism identified after four sightings.** Every dispatched worktree across two
  sprints branched from one identical sha — a **pin**, not drift. It caused a merge conflict, forced
  one task inline, and made every merge require union-verification. Filed as **TASK-217**, now
  actionable rather than waiting for evidence.
- **TD-053 leg 1 fired live and scales with fan-out** — one false-positive gate FAIL *per concurrent
  worktree*, a property the row had not anticipated. **TD-048 fired three times in one sprint** — the
  token-spelling half of a wider problem now filed as **TD-057**: `Layers:` feeds three checkers that
  match it three different ways, and nothing states the contract.
- **A mechanical citation sweep rewrote two historical statements into falsehoods** — including a
  path that has never existed in this repo — and the reconciliation stayed green throughout. Caught
  by reading the diff. Filed as **L-125**: a self-describing corpus is unsafe to edit by token,
  because some of its sentences are assertions about the past.

[ADR-024]: docs/adr/ADR-024-conformance-levels.md

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

_Older releases (**v1.41.0** and earlier) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
