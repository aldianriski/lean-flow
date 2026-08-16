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

> _(no active sprint)_ — SPRINT-069 closed 2026-08-16 → [`docs/sprint/archive/SPRINT-069-first-extraction.md`](docs/sprint/archive/SPRINT-069-first-extraction.md), 5 of 5 units. Next: `/lean-doc-generator promote` — EPIC-003 is **active** with 2 of 5 Closed-when conditions met; its next member sprint takes the harder half (attestation format · the no-skill-restates-a-rule pass).
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room (closed 2026-08-15)** → **EPIC-003 The Standard** (active — SPRINT-069 is its
> first member: the spec is extracted and the conformance levels are ruled) →
> **EPIC-004 Conformance** → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-217 — Stop worktree dispatch branching from a stale pinned base  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  a dispatched worktree provably branches from the coordinator's HEAD — demonstrated
                  on a real dispatch, with the base recorded — AND a guard halts the dispatch when it
                  does not, rather than discovering it at merge
      touches:    the dispatch protocol reference · whatever creates the worktree · a proving fixture
      depends-on: none
      assumes:    TD-054's second sighting establishes the mechanism as a **pin**, not drift: four
                  worktrees across SPRINT-068 and SPRINT-069 all branched from the same sha
                  (`622f420`), current during the first sprint and 13 commits stale during the
                  second. Two halves, and the row is explicit that they are not the same fix — the
                  **assertion** (worktree HEAD == coordinator HEAD at spawn) catches it, the **pin**
                  is the cause to remove. Deriving why the base is pinned comes first; a guard
                  written against the wrong cause guards nothing (L-091)
      tracker:    TD-054 (second sighting + mechanism, 2026-08-16) · SPRINT-069 Execution Log
      origin:     close-retro
      state:      ready

<!-- EPIC-003 The Standard — the critical path. ADR-018 sequences it; ADR-023 rules how extraction
     commits behave (move+cite atomic, spec/ is SSOT); ADR-024 defines the conformance levels.
     SPRINT-069 shipped the first member slice (extraction + levels). The next slice is decomposed
     per member sprint, never the whole epic, which spans sprints by definition. -->

### P2 — Quality / Polish

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

_(no active sprint)_ — SPRINT-069's shipped changes are written up as **v1.43.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.43.0 + v1.42.0** inline, with **v1.41.0 rotated** → [`docs/changelog/CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) in the same commit. The **spec versions separately** and did not move: `spec/STANDARD.md` stays at **0.1.0** (EPIC-003 D3).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

