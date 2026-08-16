---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.43.0

> Rotated out of root `CHANGELOG.md` at v1.45.0 (§11: keep current + previous inline).

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

