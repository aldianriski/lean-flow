---
owner: Maintainer
last_updated: 2026-08-10
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

> **SPRINT-061 — Named, Not Answered** → [docs/sprint/SPRINT-061-named-not-answered.md](docs/sprint/SPRINT-061-named-not-answered.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

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

- [ ] TASK-189 — Promote "every hygiene rule gets a matcher" out of the spent PRD  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the principle lives in a durable home chosen by §10's placement test, and
                  `loop-hygiene-prd.md` no longer carries a live rule inside a `superseded` doc
      touches:    the durable home §10's test selects (likely DOCS_Guide §10 or `.claude/CLAUDE.md`) ·
                  docs/research/loop-hygiene-prd.md
      depends-on: none
      assumes:    the principle is genuinely still live — SPRINT-060 T2 applied it, turning ADR-015
                  rule 2 from prose into an enforced check, so this is evidence rather than sentiment.
                  Re-derive the placement before writing (L-091): ask which flows can hit the failure.
                  Note `CLAUDE.md` is at 80/80 and would need its own diet pass or ADR first, exactly
                  as ADR-017 did for CONTEXT.md — so the placement test may decide the home, and the
                  cap may decide the timing
      tracker:    SPRINT-060 T4 ruling
      origin:     close-retro
      state:      ready

- [ ] TASK-190 — Rule on the two sibling loop-hygiene docs' statuses  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `loop-hygiene-findings.md` and `loop-hygiene-workstreams.md` each carry a deliberate
                  `status:`, ruled on the RESEARCH template's actual trigger ("once a decision is built
                  on it"), with the reasoning recorded
      touches:    docs/research/loop-hygiene-findings.md · docs/research/loop-hygiene-workstreams.md
      depends-on: none
      assumes:    they raise the same question SPRINT-060 T4 answered for their parent and were
                  explicitly left out of its scope rather than swept along. Do not assume the answer
                  matches the parent's: a findings register can outlive the PRD that spawned it, and
                  T4's own lesson was that the template's trigger is not the one people reach for
      tracker:    SPRINT-060 T4 Execution Log, out-of-scope note
      origin:     close-retro
      state:      ready

- [ ] TASK-191 — Split section 4's cost between its three jobs  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `docs/research/qa-gate-timing.md` carries a per-job figure for section 4 — index
                  freshness vs dangling refs vs frontmatter completeness — from at least two samples,
                  with the shipped `scripts/qa-check.sh` verifiably byte-identical afterwards
      touches:    docs/research/qa-gate-timing.md · an instrumented COPY of scripts/qa-check.sh
                  (never the shipped one) · TECH-DEBT.md TD-050
      depends-on: none
      assumes:    **measurement only — no cure, no narrowing.** TD-050 names this as the first honest
                  step precisely because "section 4 is expensive" is itself an undifferentiated blob,
                  and treating it as one unit is the error L-107 describes (now promoted into the
                  TECH-DEBT header). Do not touch the index-freshness read while here: it is a genuine
                  whole-corpus read and that is exactly what ADR-009 wired it for, so cheapening it
                  risks the L-058 family. Repeat SPRINT-060 T3's method — instrumented copy, shipped
                  script verified byte-identical — rather than inventing one
      tracker:    TD-050 · docs/research/qa-gate-timing.md · L-107
      origin:     manual
      state:      ready



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

_(SPRINT-061 just promoted — nothing shipped yet.)_ Current inline in [`CHANGELOG.md`](CHANGELOG.md): **v1.34.0** (SPRINT-060) + **v1.33.0** (SPRINT-059), which is §11's keep-current-plus-previous-minor rule satisfied; everything older is rotated under [`docs/changelog/`](docs/changelog/). Both manifests read **1.34.0** and are in lockstep — the MINOR bumps this block used to track as outstanding have all landed.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

