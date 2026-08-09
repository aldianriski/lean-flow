---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.27.1 — Layer Checks and Keeper Adoption (2026-08-09)

PATCH — SPRINT-049 **and** SPRINT-051, cut as one release. SPRINT-049's user-visible surface was a
single red flag, too thin to release on its own; two sprints later there were five more. Releasing
separately would have published one and left the rest pending, so they go together. Most of
SPRINT-049 was maintainer tooling and is summarised at the end.

**What changed for you:**
- **`/diagnose` now tells you to redact before you show — and how.** The skill has always instructed
  capturing traces, HAR files, log dumps and replayed payloads; those carry auth headers by default,
  and a debugging session is exactly where they get pasted into a chat or an issue. The new rule sits
  *before* Phase 1, so you meet it before anything produces an artifact, and it leads with the
  mechanism rather than the warning: **build the loop against environment variables**, so the
  credential never enters the command you show. Redacting afterwards removes instances; the env var
  removes the class. `/handoff` had carried this rule for a long time — `/diagnose` never did.
- **`/tdd` names the tautological test.** An assertion that recomputes the expected value the way the
  code does — `expect(add(a, b)).toBe(a + b)`, a hand-derived snapshot — passes by construction and can
  never disagree with the code. It reads as coverage while testing nothing. The tell is a question you
  can actually apply: *what would have to be wrong for this to fail?* If the only answer is "the
  language", it is tautological. Expected values now have to come from an independent source — a
  known-good literal, a worked example, the spec — and it is in the per-cycle checklist, so it fires
  every loop rather than only when you re-read the anti-patterns.
- **`/orchestrator` catches a DoD that went stale.** Distinct from the existing scope-change rule: the
  scope holds, but a *criterion* frozen at promote turns out to carry a number nobody measured or a
  premise a later decision dissolved. Log a `scope-change`, get a ruling — never round a measurement up
  to meet a stated figure, and never re-read the words to fit what was built.
- **`/refactor-advisor` scopes before it scans.** It used to scan, then rank. Deepening only pays off
  where change is frequent, so it now walks `git log` for the files that keep reappearing and lets
  those pull first.
- **`/prototype` stops throwing the prototype away.** "Delete or absorb" lost the artifact entirely;
  a spent prototype now goes to a throwaway branch with a pointer beside the captured answer, so the
  primary source stays retrievable when the verdict is later questioned.
- **Merge-back guidance for parallel runs.** When a wave's branches conflict, recover each side's
  intent from the commit messages before choosing, preserve both where they compose, never invent
  behaviour to bridge them, and always resolve rather than `--abort` — abandoning the merge strands
  the whole wave the fan-out existed to produce.

**Maintainer tooling (ships in the install; no consumer runs it):** the two `Layers:` declaration
checks were redesigned rather than patched a fifth time. They now attribute each changed path to the
task that changed it instead of testing against one union of every task's declaration — closing a
false negative where a file declared by *any* task satisfied the check for *all* of them. Proven in
both directions: the same fixture passes on the old checker and fails by name on the new one. A
`Cites:` escape lets a Plan name a file it merely cites without the gate reading it as a touch, and a
wrapped declaration is no longer silently truncated to its first line.

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
