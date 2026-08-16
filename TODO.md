---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt lives in root **`TECH-DEBT.md`**: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> **SPRINT-069 — First Extraction** → [`docs/sprint/SPRINT-069-first-extraction.md`](docs/sprint/SPRINT-069-first-extraction.md) — EPIC-003's first member sprint. Five tasks: the conformance-levels ruling, the move+cite extraction to `spec/` v0.1.0, its citation sweep, and two small guards carried from SPRINT-068's close. Gates not yet signed — `/orchestrator mvp` or `sprint-bulk` runs G1+G2 first.
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room (closed 2026-08-15)** → **EPIC-003 The Standard** (next — its opening
> ruling landed as ADR-023 at SPRINT-068; extraction sprints are the members) →
> **EPIC-004 Conformance** → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- EPIC-003 The Standard — the critical path since EPIC-002 closed 2026-08-15. ADR-018 sequences
     it; ADR-023 rules how extraction commits behave (move+cite atomic, spec/ is SSOT). These are
     the first member sprint's slice, decomposed 2026-08-16 — not the whole epic, which spans
     sprints by definition. -->

- [ ] TASK-214 — Rule the conformance levels and what makes each independently checkable  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  a recorded ruling naming the levels, their order, and — per level — the property
                  that makes it checkable in principle; EPIC-003 open question 1 struck through with
                  a pointer to the ruling. ADR only if §4's three tests all hold
      touches:    docs/adr/ (if it qualifies) · docs/DECISIONS.md · docs/epic/EPIC-003-the-standard.md
      depends-on: none
      assumes:    the epic routes this to "the first member sprint's G2", so it is specified here and
                  the engine that CHECKS a level is EPIC-004's — a level that cannot be described as
                  checkable without naming the engine belongs to that epic, not this ruling
      tracker:    EPIC-003 § Open questions (1) · ADR-018 · SPRINT-069 promote
      origin:     decomposer
      state:      ready

- [ ] TASK-215 — Extract the standard to `spec/` v0.1.0 in one move+cite commit  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  the standard lives in the versioned `spec/` tree under a name that reads as a
                  standard, carrying `version: 0.1.0` in its ownership header and a sibling
                  `spec/CHANGELOG.md`; every PATH reference to its old location resolves to the new
                  one; the cap checker's default guide path follows it; `.claude/CLAUDE.md`'s
                  self-contained principle states what is true after the move; the gate is green —
                  **all in one commit** (ADR-023: no commit leaves a rule stated in two places), and
                  the review carries "is any rule now stated twice?" as an explicit named check
      touches:    spec/ (new) · the standard document's current home · the cap checker's default
                  path · .claude/CLAUDE.md · .claude/CONTEXT.md · README · architecture overview
      depends-on: none
      assumes:    (a) `spec/` reaches consumers with no packaging work — the plugin manifest declares
                  no file list, so install copies the whole repo (verified against a real install,
                  SPRINT-042); (b) the cap checker takes the guide path as its first parameter with a
                  default, so the move costs one default, not a rewrite; (c) the other three checkers
                  naming the guide do not open it — comments and output strings only; (d) extraction
                  makes CLAUDE.md's "bundles its own templates + standard" principle FALSE, so
                  correcting it is part of this commit, not a follow-up. Re-measure the path-reference
                  count at execution rather than trusting any figure written here (L-097)
      tracker:    EPIC-003 § Scope · ADR-018 · ADR-023 · SPRINT-069 promote
      origin:     decomposer
      state:      ready

- [ ] TASK-216 — Sweep the standard's textual section citations to the new name  [size: M] [risk: low] [AFK]
      class:      mechanical-ingest
      done-when:  no live surface cites the standard by its pre-extraction document name; the count is
                  established by **two queries that reconcile** (total mentions = renamed +
                  legitimately-unchanged), never by a single grep whose zero could mean either clean
                  or unreached (L-118); every table row and list entry touched is re-read whole after
                  editing (L-009), and the gate is green
      touches:    every live surface citing the standard by section — skills, templates, docs, ADRs,
                  checker output strings. Not enumerated here: the set is re-derived at execution,
                  since a path list written now goes stale before an AFK task is picked up
      depends-on: TASK-215
      assumes:    these are stale NAMES, not broken links — ADR-023 forbids a rule living in two
                  places, not a name lagging a commit behind, which is why this is safely a separate
                  task rather than bloating the move commit. Archived sprints, rotated changelogs and
                  the generated index are history or derived: not swept
      tracker:    EPIC-003 § Scope · ADR-023 · SPRINT-069 promote
      origin:     decomposer
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-212 — Guard the two Layers-family checkers against bare invocation  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `check-layers-completeness.sh` and `check-layers-observed.sh` invoked with no
                  arguments print a "nothing verified" note (their guarded siblings' shape) instead
                  of a silent exit-0 no-op, with a must-FAIL/must-note leg per checker proving it
      touches:    scripts/lib/check-layers-completeness.sh · scripts/lib/check-layers-observed.sh ·
                  evals/ (the proving legs)
      depends-on: none
      assumes:    TD-056's family scan (SPRINT-068 T2) is the scope ruling — exactly these two
                  checkers share the silent bare no-op; the cure is per-checker, matching the
                  `check-gates-signed.sh` note-line shape. Gate path unaffected (qa-check.sh always
                  supplies arguments)
      tracker:    TD-056 (family scoped 2026-08-15) · SPRINT-068 T2 scan
      origin:     close-retro
      state:      ready

- [ ] TASK-213 — Ignore `.claude/worktrees/` so a stray `git add -A` cannot commit a repo copy  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `.claude/worktrees/` is in `.gitignore`, and `git status --short` stays clean with a
                  worktree present — verified against a real dispatched worktree, not a mkdir'd stand-in
      touches:    .gitignore
      depends-on: none
      assumes:    TD-053's leg 2 only. The row's mitigation rules out `.gitignore` as the *whole* fix
                  because it does not stop `check-ephemeral-intake.sh`'s `find` walk — that is leg 1,
                  which stays routed to EPIC-004 D1 and is NOT this task. Splitting them is the
                  2026-08-16 re-review's ruling: a one-line cure was waiting on an engine question it
                  does not depend on
      tracker:    TD-053 (leg 2 split 2026-08-16) · SPRINT-069 promote governance review
      origin:     manual
      state:      ready

- [ ] TASK-188 — Exercise the reaper on a genuinely partial Plan  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
                  as `unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via
                  `--reap`
      touches:    scripts/night-run.sh (only if the exercise finds a defect) · a sprint Execution Log
      depends-on: none
      assumes:    **carried from SPRINT-060 T5, acceptance unmet — read the ruling before re-promoting.**
                  The trigger is OPPORTUNISTIC and that is the whole design: the next night run that
                  stops mid-Plan *for its own reasons* is the exercise. Do not schedule a run to produce
                  one, and do not promote this into a sprint whose shape cannot generate it — SPRINT-060
                  promoted it alongside four HITL tasks, the run mode was then ruled interactive at G2,
                  and that foreclosed the only vehicle it had (L-111). Its partial-Plan path is already
                  proven three ways that each stop short of the others: a real log through `--reap`, a
                  zero-ticked-box regression, and an end-to-end launcher run against a complete Plan
      tracker:    SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
      origin:     close-retro
      state:      blocked

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — SPRINT-068's shipped changes are written up as **v1.42.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.42.0 + v1.41.0** inline, with **v1.40.0 rotated** → [`docs/changelog/CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) in the same commit.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

