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

> _None._ SPRINT-061 closed 2026-08-10 (3 of 3).

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

- [ ] TASK-192 — Rule `qa-gate-timing.md`'s cap: raise it, or split the doc  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the doc is no longer breaching a cap nobody intends it to meet — either the §2
                  research cap is raised for it by an ADR, or the doc is split per §6's cap-hit rule,
                  with the reasoning recorded either way
      touches:    docs/research/qa-gate-timing.md · skills/lean-doc-generator/references/DOCS_Guide.md §2
                  · possibly docs/adr/ · scripts/lib/doc-caps-grandfathered.txt
      depends-on: none
      assumes:    this is L-106's tell, not ordinary fat: the doc is **223 / 120** and is a longitudinal
                  measurement log accreting one round per sprint (three now), while the 120 cap is sized
                  for a write-once decision doc. It cannot be trimmed without deleting measurements that
                  are the whole point, which L-106 says means the number is wrong rather than the file.
                  Do NOT bulk this with the other two breaches — `graph-engineering.md` (122) and
                  `loop-hygiene-prd.md` (139) are ordinary drift and a different question. ADR-015 rules
                  that a soft cap cannot be grandfathered, so "add it to the list" is not available
      tracker:    SPRINT-061 Retro · L-106 · ADR-015 · SPRINT-058 T1 (the same tell, twice)
      origin:     close-retro
      state:      ready

- [ ] TASK-193 — Give the §2 soft-cap report a consumer at promote  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a §2 soft-cap breach is visible to whoever signs the promote governance checklist,
                  rather than only to the gate's scrollback
      touches:    skills/lean-doc-generator/SKILL.md § Governance review ·
                  skills/lean-doc-generator/references/DOCS_Guide.md §10/§11
      depends-on: none
      assumes:    the failure is a **matcher with no consumer**, which is the exact inverse of the rule
                  SPRINT-061 T1 promoted, and neither caught it. `check-doc-caps.sh` has printed three
                  `OVER-CAP (soft)` rows on every run for sprints; SPRINT-061's promote scan reported
                  doc-aging clean because the checklist enumerates §11's four triggers and a §2 breach is
                  not one of them. Re-derive before writing (L-091): "add a fifth checklist line" is the
                  obvious move and may be wrong — the honest question is whether §11's trigger list or
                  §2's caps should own this, and a fifth line on a checklist read under time pressure is
                  how TD-047 describes items getting skipped
      tracker:    SPRINT-061 Retro · L-106 (count 2)
      origin:     close-retro
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

_(no active sprint)_ — SPRINT-061's shipped changes are written up as **v1.35.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.35.0 + v1.34.0** inline, with **v1.33.0 rotated** → [`docs/changelog/CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) in the same commit.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

