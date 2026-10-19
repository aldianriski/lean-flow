---
owner: Maintainer
last_updated: 2026-10-19
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.8.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.10.0 release** (2026-10-19). §11 keeps the
> current and previous minor inline (2.10.x and 2.9.x), so cutting v2.10.0 pushed v2.8.x out.

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
