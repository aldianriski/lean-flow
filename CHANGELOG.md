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

## v2.7.0 — a phased roadmap with row coverage (spec 0.17.0) (2026-10-18)

**MINOR** — ships SPRINT-126 (Roadmap and Traceability). **Upgrade step:** spec 0.17.0 is MINOR carrying MAJOR meaning (§15): a
`roadmap.md` outside `docs/product/` (with neither `docs/product/roadmap.md` nor the legacy `docs/roadmap.md` present) is now flagged
by `S2.R-PLACEMENT` — re-run `sh conformance.sh <repo>` and move or rename it. Restart the session after installing.

### SPRINT-126 — Roadmap and Traceability (2026-10-18)

EPIC-022's second slice: a repo can write a phased delivery plan and see which rows nothing is delivering. **Spec 0.17.0.**

**Consumer-facing:**
- **New `roadmap.md.template`** for a phased delivery plan at `docs/product/roadmap.md`, created lazily when a delivery sequence
  spans two or more sprints or epics. Each row of its table carries a `Status` (done · active · planned) and a `Covered by` cell
  naming the tasks, the epic or the next slice that delivers it.
- **Spec 0.17.0 — MINOR carrying MAJOR meaning (§15).** STANDARD §2 gains the `product/roadmap.md` row (legacy `docs/roadmap.md`,
  matched second) and a **roadmap coverage** rule: an `active` row must be covered by an open task, an active epic or a named next
  slice; `planned` rows are exempt. **Upgrade step:** with neither file in place, a `roadmap.md` elsewhere (outside `docs/product/`)
  is now flagged by `S2.R-PLACEMENT` — move or rename it. A root `ROADMAP.md` is not flagged.
- **`/prime`, `/triage` and the promote checklist report uncovered active rows** through the same procedure as epic coverage
  (unmarked · stale task · epic not active). Promote warns for the owner to sign and never refuses on a roadmap row.
- **`/task-decomposer --roadmap <row>`** decomposes a single row, reading its outcome, dependencies and acceptance evidence as
  settled context, and tells you what to put in its `Covered by` cell — it never edits the roadmap. `/flow`, CONTEXT and README
  name the roadmap as a feed source.

**Maintainer-side:** EPIC-022 Closed-when 4 delivered. TASK-424 · TASK-425 pruned (§11).

---
