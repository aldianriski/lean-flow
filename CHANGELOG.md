---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.44.0 — Attested (2026-08-16)

MINOR — SPRINT-070, **10 of 10 DoD**, EPIC-003's second member sprint. The top conformance level
becomes writable, and parallel dispatch stops handing every agent a stale copy of your repo.

**What changed for you**

- **The attestation format is specified — `spec/STANDARD.md` §13, spec `0.2.0`** ([ADR-025]). Three
  git trailers on the task's own commit (`Gate-Signed-By:` · `Gate:` · `Evidence:`), so gate approval
  travels with the commit and a reviewer with a clone can read it without opening your sprint file.
  You can adopt the format today.
- **§13 states plainly that an unsigned trailer is a claim, not proof.** Trailers are plain text;
  anyone who can write a commit can name anyone as approver. So **Attested is not reachable by
  trailers alone** — it needs commit signing. Emitting trailers over unsigned commits leaves you at
  **Gated** with more legible records, which is exactly where lean-flow itself sits. The worked
  example in §13 is a real commit from this repo shown in its true unsigned state rather than an
  invented signed one.
- **The trailer carries your *sprint-level* sign-off onto each covered commit — it does not require
  approving every task.** This corrects [ADR-018], which described git-native attestation as raising
  approval to per-task granularity. What you gain is verifiability, not more approvals; batch G1/G2
  stays viable and conformant.
- **Worktree-isolated subagents now branch from your current work, not your remote's default branch.**
  If you dispatch parallel tasks over commits you have not pushed, every agent used to get a tree
  missing them — silently, and identically, every run. `.claude/settings.json` now sets
  `worktree.baseRef: "head"`, and `dispatch.md` ships a **worktree-base guard** that halts a dispatch
  whose base is not current, naming what it found. **If you dispatch worktree agents and push
  infrequently, set `worktree.baseRef` in your own repo — the default is `"fresh"`.**
- **Know before you dispatch:** a task editing a file that exists only in unpushed commits still must
  not be worktree-dispatched under a `"fresh"` base — the merge becomes add/add. And a subagent
  worktree that finishes without changes is deleted *with its branch* the moment it returns, so any
  measurement you want from it belongs in the agent's brief, not in a check you run afterwards.

**Fixed** — the stale-base pin behind SPRINT-069's merge conflict, a task forced inline, and
union-verification on every merge (TD-054, open since SPRINT-063; the cause turned out to be
documented default behaviour, recorded in this repo since SPRINT-026).

[ADR-025]: docs/adr/ADR-025-git-native-attestation-format.md
[ADR-018]: docs/adr/ADR-018-standard-implementation-split.md

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


_Older releases (**v1.42.0** and earlier) → [`CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
