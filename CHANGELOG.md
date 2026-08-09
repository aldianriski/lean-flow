---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.27.3 — Surface Truth (2026-08-09)

PATCH — SPRINT-053. One consumer-facing change, and it stops `init` handing you documentation about
things your repo does not have.

**What changed for you:**
- **`init` no longer scaffolds docs for substrate you don't have.** It used to scaffold the base tier
  *always*, even though every higher tier was already gated on detection — a database repo got the
  database docs, an API repo got the integration docs, but a repo with no code still got coding
  standards and a testing guide describing code that does not exist. Four base rows now carry a
  condition: `development/coding-standards` and `testing/testing-guide` need **code**;
  `deployment/deployment-guide` and `deployment/rollback-guide` need something you **publish**. A
  skipped row is reported by name along with the condition that skipped it, so an absent doc reads as
  a decision rather than an oversight.
- **The two substrates are deliberately independent**, because bundling them is what made the original
  rule wrong. "Docs-only repo" is not a condition: a markdown plugin publishes an artifact without
  holding a line of application code, and its deployment guides are correct and load-bearing. lean-flow
  is exactly that repo, which is how the mistake was caught — the first version of this rule predicted
  our own deployment docs out of existence.
- **The standard agrees with the tool again.** `DOCS_Guide` §6's base row previously read "every dev
  repo" flat out, so a consumer following the standard and a consumer running `init` got different
  answers. §6 now states the same four conditions.

**Maintainer-side (ships to nobody):** the two `Layers:` completeness FAILs now name the `Cites:`
escape in the message. Tripping the gate used to tell you only what was missing from your declaration,
whose obvious repair is to declare a touch that never happened — the behaviour the escape exists to
prevent. The fixtures assert the hint, so it cannot quietly disappear.

---

## v1.27.2 — Rule Placement (2026-08-09)

PATCH — SPRINT-052. One surface changed, and it is the one that decides where every *future* rule
lands. Two tasks, both placement questions, both wider than the plan assumed.

**What changed for you:**
- **Promoting a learning now has a test instead of a menu.** `DOCS_Guide` §10 used to say a recurring
  learning becomes "a `CLAUDE.md` anti-pattern, a `CONTEXT.md` rule, **or** a skill red-flag" and stop
  there, as though the three were interchangeable. They are not: a skill red-flag only ever fires
  inside that skill's flow. So a rule about mis-diagnosis filed into `/diagnose` stayed silent when the
  same mistake happened during a `promote`, and a redaction rule that lived in `/handoff` never reached
  `/diagnose` — the skill that tells you to capture HAR files and traces. The rule now: **ask which
  flows can hit this failure, then place it where all of them read.** A `CONTEXT.md` rule reaches
  everything that reads your SSOT; a `CLAUDE.md` anti-pattern reaches everything, and is the honest
  answer when the enumeration says "all of them" — it is capped, so landing there displaces something,
  which is a decision rather than an append. And where the rule already appears on more than one
  surface, the duplicates get rewritten to point at the one home, because a stale second copy
  reproduces the very failure being promoted against. The test reaches you in three places, not one:
  the standard, `/lean-doc-generator`'s governance checklist at promote, and the header of the
  `LEARNINGS.md` the generator scaffolds for you.
- **A `Mitigation:` line is treated as a hypothesis, not a plan.** The cure written on a tech-debt row
  is the filer's best guess, recorded at the moment the cost was being felt — and after a few re-reads
  it starts to read as settled, which is how it ends up carried unquestioned into a sprint's
  acceptance criteria. §10 now says to cite the evidence for the *problem* and re-derive the *fix*,
  both when filing one at close and before building a task on one at promote. Two rows in a row were
  right about the symptom and wrong about the cause; one proposed cure would have destroyed evidence.

**Maintainer-side (no consumer runs it):** the `Cites:` escape stays undocumented in the SPRINT
template on purpose — the checker that reads it is maintainer tooling that ships to nobody, so a
template line would advertise a convention nothing enforces on your side.

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
