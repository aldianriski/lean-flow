---
owner: Maintainer
last_updated: 2026-10-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## v2.4.0 — an active epic's open conditions must each be covered; workdoo epics move to workdoo; spec 0.15.0 (2026-10-10)

**MINOR** — ships SPRINT-121 (T5 · TASK-420 is the consumer-facing change). Installing the next release is enough; no upgrade step. The standard moves to
**spec 0.15.0** (MINOR: prose rule, no conformance rule added, no verdict changes).

- **The rule (STANDARD § 2):** while an epic is `status: active`, every open `- [ ]` Closed-when condition ends with
  `→ TASK-NNN[, TASK-MMM]` or `→ next slice: <name>`. A named task that is done, cancelled or missing does not cover it.
  `proposed` epics are exempt.
- **`/lean-doc-generator`** lists uncovered conditions when an epic is activated and at promote (new `☐ epic coverage` line),
  and promote refuses to form a sprint while an epic it touches has one, unless the owner records an override.
- **`/triage`** reads active epics alongside the backlog and lists each uncovered condition with its epic;
  **`/prime`** reports a `Coverage:` count.
- An epic that a promote **activates** is judged as active in that same promote (Codex review fix), and `/triage` may read beyond
  `backlog/` to resolve a coverage mark.

**Also in SPRINT-121 (Cover What Is Open), maintainer-side:**
- **The workdoo-built epics moved to workdoo** (EPIC-016 · 018 · 019 · 020, ids unchanged). **ADR-052** amends ADR-041: an epic's
  outcome record lives with its execution. lean-flow keeps relation pointers in `docs/epic/INDEX.md`.
- **ADR-044 and ADR-048** have their accepted § Decision text restored, and their later corrections are kept as appended, dated
  § Correction sections. The S4.APPEND findings are cleared.
- **Learnings ledger:** a new gate leg FAILs an active entry with no body `count:` or `promoted:` line (5 retained fixtures). 58
  repeat entries are folded into their family heads (`disposition: merge`), so the ledger carries 4 active entries, not 62.
- **The engine's Windows cost is measured** (`qa-gate-timing.md` Round 23): five rules' per-row spawn loops, at about 100 ms per
  spawn. TASK-404's target is a 50% cut.
- **EPIC-015:** Dogfood 1 is proven on this sprint. CW6 is still open because no code path emits `USER_STOP` (TASK-423).

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

