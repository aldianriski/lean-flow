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

> _None._ SPRINT-067 closed 2026-08-15 (2 of 2, v1.41.0) — the system-verify pass (a run proves its
> integrated tree) and per-criterion evidence lines (every tick names what proved it). The second
> gauntlet audit's arc is complete: mapped → ruled (066) → proven (067). Follow-ups TASK-210/211
> filed `ready`; TASK-198 remains EPIC-003's opening ruling.
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room (closed 2026-08-15)** → **EPIC-003 The Standard** (next — TASK-198 is its
> opening ruling) → **EPIC-004 Conformance** → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- EPIC-002 Make Room — the critical path. These block EPIC-003/004/005, which have nowhere to
     write their rules while both SSOT files sit at cap. -->

### P2 — Quality / Polish

- [ ] TASK-198 — Rule what CONTEXT.md becomes once the spec is extracted  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  a recorded ruling on whether `.claude/CONTEXT.md` stays an SSOT or becomes a consumer
                  of the extracted spec, with the migration-window risk named and its mitigation stated
      touches:    .claude/CONTEXT.md · docs/adr/ · EPIC-003
      depends-on: none
      assumes:    this is settled BEFORE the first extraction commit, not during it. Extraction that
                  leaves the same rule in two places mid-migration is precisely the second SSOT LAW 4
                  and the anti-SSOT rule forbid — ADR-018 accepts that risk explicitly and names this
                  task as how it gets retired. Blocking for EPIC-003, not for EPIC-002
      tracker:    EPIC-003 open question 3 · ADR-018
      origin:     manual
      state:      ready

- [ ] TASK-210 — Wire check-system-verify-block.sh into the QA gate  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the system-verify contract checker runs inside `sh scripts/qa-check.sh` (registered
                  per the gate's own harness conventions), its five fixture legs green in-gate, and a
                  deliberate violation FAILs the gate with the named finding
      touches:    scripts/qa-check.sh · evals/ (paths only if registration requires the harness at
                  the standard evals/run-*.sh location)
      depends-on: none
      assumes:    SPRINT-067 T1 deliberately deferred this ("qa-check.sh: run, never edited" bound
                  that task; the builder's placement deviation named the gap). Moving the nested
                  harness is in scope; the five legs and their named findings stay identical (L-058)
      tracker:    SPRINT-067 T1 builder deviation · evals/README.md § system-verify · L-058
      origin:     close-retro
      state:      ready

- [ ] TASK-211 — Rename the reserved `complete` event to `run-complete`  [size: S] [risk: med] [HITL]
      class:      execution
      done-when:  the run-level Execution Log event is `run-complete` in `check-night-run-rollup.sh`,
                  its fixtures, and `sprint-log.md.template`'s taxonomy comment, with a task-level
                  "complete" no longer arming the rollup assertions; the checker's must-FAIL legs
                  pass with the renamed finding, and TD-055 is marked resolved
      touches:    scripts/lib/check-night-run-rollup.sh · evals/fixtures/ (rollup fixtures) ·
                  skills/lean-doc-generator/templates/sprint-log.md.template
      depends-on: none
      assumes:    TD-055's ruled cure (SPRINT-067 T2: a note was declined with reason — no in-scope
                  file was the authoring point; the rename makes the collision impossible). Historical
                  logs keep `complete` — archives are not re-litigated (the */archive/* skip
                  convention). The template ships to consumers (L-015)
      tracker:    TD-055 (ruled 2026-08-15) · check-night-run-rollup.sh · L-015
      origin:     close-retro
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

_(no active sprint)_ — SPRINT-067's shipped changes are written up as **v1.41.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.41.0 + v1.40.0** inline, with **v1.39.0 rotated** → [`docs/changelog/CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) in the same commit.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

