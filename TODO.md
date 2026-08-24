---
owner: Maintainer
last_updated: 2026-08-24
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

_(none — SPRINT-081 closed 2026-08-24. Next: **SPRINT-082**, EPIC-005's first member sprint.)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-259 — Exercise the absent-attestation hold against a foreign repo that has commits  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the foreign-repo harness runs a target with real git history and no §13 trailers, and
                  the assertion records what an adopter actually sees — `attestation-absent` named,
                  `level: Gated`, exit code unmoved. Whichever way it falls is the result; a surprise
                  here is a finding about T4, not a nuisance
      touches:    evals/run-foreign-repo-fixtures.sh (the current stranger is git-less by construction,
                  so this needs a second target or an added `git init` + one commit) ·
                  docs/research/logs/conformance-coverage.md § Round 5
      depends-on: none
      assumes:    **the gap is real and was named at the moment it was created, not discovered later.**
                  SPRINT-081 T4 added the hold and T3 could not exercise it: the stranger is built from
                  four `printf`s with no `git init`, so §13 reports `not evaluated` and the new branch
                  never runs against a foreign tree. It IS exercised against this repository and by
                  `run-attestation-fixtures.sh`, so this is coverage of the *consumer path*, not of the
                  rule (L-016) — the one thing dogfooding structurally cannot check here
      tracker:    SPRINT-081 T4 · T3 · TD-079 · L-159 · docs/research/logs/conformance-coverage.md
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

_(no active sprint)_ — SPRINT-081's shipped changes are written up as **v1.55.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). `level: none` → `Gated`; the one new consumer-facing surface is `.conformance-exempt` (ADR-031), and v1.53.0 rotated to `docs/changelog/`.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

