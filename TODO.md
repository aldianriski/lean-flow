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

> _(no active sprint)_ — **SPRINT-070 — Attested** closed 2026-08-16 at **10 of 10 DoD**
> ([archive](docs/sprint/archive/SPRINT-070-attested.md)). The next sprint forms from the Backlog
> below via `/lean-doc-generator promote`.
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room (closed 2026-08-15)** → **EPIC-003 The Standard** (active — SPRINT-069
> extracted the spec and ruled the conformance levels; SPRINT-070 specified the attestation format,
> leaving conditions 2 and 5, both sweeps rather than specifications) →
> **EPIC-004 Conformance** → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-218 — Stop the uncommitted-WIP path accepting a sibling task's declaration  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a coordinator running the gate over uncommitted work no longer reads a PASS that
                  the committed run would fail; whichever cure is chosen is recorded with its
                  reasoning, and the behaviour is proven by a fixture driving the same tree through
                  both paths
      touches:    scripts/lib/check-layers-observed.sh · evals/
      depends-on: none
      assumes:    TD-037's trigger fired at SPRINT-069 (T3's sweep passed 151/0 uncommitted, then
                  FAILed on three files once committed — the union accepting T2's declaration on
                  T3's behalf). **The row's standing warning binds the cure: do not close this by
                  inferring the in-flight task from open-DoD state** — that was a guess when the row
                  was filed and one observation of masking is not evidence the guess would be right.
                  Candidates to price first, none pre-selected: report the WIP leg as a named SKIP
                  rather than a PASS (TD-051 candidate-(c) shape) · attribute WIP by staged-vs-
                  unstaged · accept the boundary and document it where a coordinator reads it
      tracker:    TD-037 (trigger fired, 2026-08-16) · SPRINT-069 Execution Log · TD-035 lineage
      origin:     close-retro
      state:      ready

<!-- EPIC-003 The Standard — the critical path. ADR-018 sequences it; ADR-023 rules how extraction
     commits behave (move+cite atomic, spec/ is SSOT); ADR-024 defines the conformance levels.
     SPRINT-069 shipped the first member slice (extraction + levels). The next slice is decomposed
     per member sprint, never the whole epic, which spans sprints by definition. -->

### P2 — Quality / Polish

- [ ] TASK-219 — Rule whether `spec/STANDARD.md` gets a §2 cap row, and which  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `spec/STANDARD.md` either carries a §2 row whose cap `check-doc-caps.sh` derives and
                  enforces, or an explicit recorded ruling that the spec is deliberately uncapped —
                  either way the absence stops reading as an oversight, and the reasoning is written
                  where the next reader of §2 finds it
      touches:    spec/STANDARD.md (§2 table) · docs/adr/ if the ruling is hard-to-reverse
      depends-on: none
      assumes:    **the number is not derivable from this repo's history and that is the whole
                  difficulty** — the file has never been capped, so there is no growth curve under a
                  ceiling to reason from, while ADR-015 requires a stated cap to be a real number
                  rather than a gesture. It is also self-referential: the standard would be capping
                  itself, and whatever is chosen becomes a rule every adopter inherits with their pin.
                  Candidates to price, none pre-selected: a soft cap with §6's tier-split escape
                  (for a spec, that means numbered section files) · a hard cap, since an adopter's
                  pin makes surprise growth expensive · an explicit "deliberately uncapped" ruling.
                  Measured at filing: 587 lines, the largest governed doc in the repo, and
                  `check-doc-caps.sh` reports zero rows for `spec/` because it derives coverage
                  from §2 rather than hand-listing
      tracker:    TD-058 · SPRINT-070 T1 Execution Log · A4 (flagged at promote; G1 scoped it out)
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

_(no active sprint)_ — SPRINT-070's shipped changes are written up as **v1.44.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.44.0 + v1.43.0** inline, with **v1.42.0 rotated** → [`docs/changelog/CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) in the same commit. The **spec versions separately** and *did* move this time: `spec/STANDARD.md` **0.1.0 → 0.2.0** for §13, independently of the plugin — EPIC-003 D3's first demonstration of the spec moving without a plugin release driving it.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

