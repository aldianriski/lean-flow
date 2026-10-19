---
owner: Maintainer
last_updated: 2026-10-18
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## v2.9.0 — one Plan parser; the member resolver names what it cannot resolve (2026-10-19)

**MINOR** — ships SPRINT-128 (Planning Debt), and closes EPIC-022. **Upgrade step:** a task store with a duplicate task id, a listed
member with no file, or a task file outside `docs/work/<folder>/` now FAILs by name (`member-ambiguous` · `member-missing` ·
`member-misplaced`), where it was skipped silently. Run `sh conformance.sh <repo>` once and fix any it names. The standard is
unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-128 — Planning Debt (2026-10-19)

EPIC-022's last slice: a Plan has one parser, and nothing that reads it drops what it cannot place.

**Consumer-facing:**
- **`conformance.sh` reads CRLF frontmatter itself.** Every Shell field reader strips a trailing CR, so a verdict no longer depends
  on whether the host's awk folds Windows line endings.
- **The members reader names store anomalies.** A duplicate id, a missing listed member or a misplaced task file is a named FAIL;
  the CLI exits 2 with the anomaly after its unchanged first line.
- **The dispatch preflight names a column-0 wrapped `Layers:` line** ("indent it, or separate prose with a blank line"), instead of
  building the ownership map from the first line only.

**Maintainer-side:**
- One shared Plan parser (`parsePlan`) replaces about eight heading regexes and six `Cites:` readers; a `Cites:` task id governs a
  member only in the leading run that opens the line.
- The Shell twins of the layers-observed and authority checkers, and the reaper's v1 Plan counting, are retired.
- `layers-token-matches-nothing` names a `Layers:` token that matched no file once its task is done; a member `## Done when` edit
  is covered only by a scope-change logged before it.
- TD-049 · 131 · 138 · 177 · 178 · 188 · 190 · 198 · 199 · 205 · 215 · 248 resolved; 8 rows closed at promote; TD-255 · 256 · 257 ·
  258 filed. EPIC-022 closed (8 of 8).

---

## v2.8.0 — a sprint without git; a task keeps its own sign-off (spec 0.18.0) (2026-10-18)

**MINOR** — ships SPRINT-127 (Plans Without Git). Installing the release is enough; no upgrade step. Spec 0.18.0 is MINOR and moves
no git repository's verdict (only a git-less tree's dated `gates_signed:` moves, fail → pass). Restart the session after installing.

### SPRINT-127 — Plans Without Git (2026-10-18)

EPIC-022's third slice: an approval lives where the next reader finds it, and a repo without git can run the lifecycle.
**Spec 0.18.0 · ADR-054.**

**Consumer-facing:**
- **A task records its own G1/G2 sign-off.** `/orchestrator` `quick` and `mvp` write `gates_signed: G1[,G2] @ <sha>` (a date with no
  git) on the task file the moment you approve, by popup or plan-mode exit, plus an `## Approved design` paragraph at G2. Absent means
  not signed. You may set Claude Code's `plansDirectory` to keep plan mode's own file; lean-flow never edits a settings file.
- **A repo without git can run a sprint.** When `git rev-parse --git-dir` fails, promote copies each member's `## Done when` into the
  promote log entry and sets `plan_commit: none (no git)`. Tick and close compare against that snapshot, moves are plain file moves,
  and sign-off and close carry dates (`close_commit: none (no git) · closed <date>`).
- **`conformance.sh`: `S9.GATESWELLFORMED` accepts `@ YYYY-MM-DD` only in a tree with no git.** In a git repository a date is still
  malformed. The `S9.PLANFROZEN` note now names the snapshot as where the frozen text lives.

**Maintainer-side:**
- `scripts/lib/tick-box.ts`: the coordinator's tick step runs the gate's own checkers after the write (L-224 ×6), with an always-on
  must-FAIL harness.
- Exercised on workdoo itself: its roadmap rendered from the template (16 rows) and one task signed `G1,G2` without git.
- EPIC-022 Closed-when 5 · 6 · 8 delivered (7 of 8). TD-253 · TD-254 filed.

---
