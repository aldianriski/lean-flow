---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.27.0 — Epic Layer (2026-08-09)

MINOR — SPRINT-048. `/task-decomposer` has advertised an `--epic` input since long before an epic had
anywhere to live. Seven tasks against the ~12-task capacity the previous release created — the first
sprint to actually spend that headroom, and the first written in the split log format.

**What changed for you:**
- **Epics have a home.** `docs/epic/EPIC-NNN-<slug>.md` + a lazily-created `INDEX.md`, mirroring the
  `docs/sprint/` shape. `/lean-doc-generator epic` opens one; `/task-decomposer --epic` consumes it and
  never creates one. `promote` stamps `epic:` on a member sprint and appends its row; `close` completes
  that row — and closes the epic only when **every** Closed-when condition is ticked, because a member
  sprint closing is not an epic closing. **Admission test, in order:** outcome not nameable → it is fog
  (`--fog`) · nameable but fits one sprint → it is a sprint · otherwise an epic.
- **One clear owner for document creation.** `/lean-doc-generator` creates every core doc;
  `/task-decomposer` consumes them and emits tasks. Concretely: `--prd <path>` now means *consume this
  file* and nothing else, and a new `prd` verb owns `docs/product/requirements.md` — a template that
  had been shipping orphaned, never referenced by the skill that bundles it. **Note two things share
  the name "PRD"** and are deliberately both kept: the working *feature* PRD the decomposer synthesizes
  to slice against, and the durable *project* requirements doc. The pipeline is feature PRD → sanitize
  → requirements.md.
- **The SKILL.md cap is now ~140, and it finally has a criterion.** The cap only ever said *when* to
  move something out of a skill file, never *which* something. It now carries the test: **inline what
  every path needs; disclose what only some paths reach.** The raise itself follows ADR-007's
  precedent — diet first, measured (a 7-line reclaim), then raise — and `DOCS_Guide` was corrected to
  match: "never raise the limit **to fit content**; a cap moves only by ADR."
- **The night-run launcher stops calling healthy runs dead.** A third verdict, `UNKNOWN` (exit 2), for
  when the process is up but nothing observable has happened yet. Previously that reported
  `DEAD-ON-ARRIVAL … the prompt may have been rejected` — an inference the launcher cannot support, and
  one a real run acted on while working normally. It also names `--output-format json` when you use it,
  since that format buffers until exit and an empty log there means nothing at all.

---

## v1.26.0 — Sprint Log Split (2026-08-09)

MINOR — SPRINT-047. Your sprint file has a 400-line hard cap, and the Execution Log was eating it.
That mattered more than it sounds: an unattended run stops when the promoted Plan's work runs out, and
it cannot promote more for itself — so how much a night run can do is decided by how big a Plan you
could fit inside that cap.

**What changed for you:**
- **The Execution Log now lives in its own file** — `docs/sprint/logs/SPRINT-NNN-<slug>.md`,
  append-only and uncapped, created at your first log entry. The 400-line cap now governs only the
  frozen Plan. Measured across the six sprints before the change: 232–368 lines while holding just
  2–6 tasks, one of them reaching 368 lines on **two** tasks. Task count was never what filled the
  file. Post-split a Plan holds roughly **12 task blocks** — not the 15 first estimated, because
  Files Changed and the Retro still share the budget; the measured figure is the one documented.
- **The `logs/` subdirectory is load-bearing, so don't rename it into a suffix.** The four sprint-file
  checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a subdirectory is skipped for free — while
  a same-folder `SPRINT-NNN-log.md` would be capped at 400 and schema-checked as though it were a
  Plan, reintroducing the exact problem. `ADR-014` records the reasoning; a retained fixture keeps the
  claim honest by failing loudly if that glob is ever widened.
- **A new `sprint-log.md.template`** ships with the generator (31 core templates now), and the SPRINT
  template's Execution Log section became a pointer to it. **Existing sprints keep working unchanged** —
  nothing migrates automatically; new sprints simply get the new shape.
- **Sprint close now archives the pair together**, log alongside Plan, in one commit. A Retro whose
  evidence got left behind in a different directory is worse than no split at all.
- **An adoption re-scan of `mattpocock/skills`** (`docs/research/mattpocock.md`) — 2 keepers of 5
  examined, both filed as tasks rather than adopted blind. The interesting one contradicts a rule
  lean-flow currently ships: our grill insists on one question at a time, but the real discriminator
  is *dependency*, not count — independent questions can be asked together.

---

_Older releases (**v1.25.2** and earlier) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
