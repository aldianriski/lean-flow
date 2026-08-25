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

> _None._ SPRINT-084 closed 2026-08-25 → [docs/sprint/SPRINT-084-gate-recovery-and-owed-work.md](docs/sprint/SPRINT-084-gate-recovery-and-owed-work.md)

**Next promote is EPIC-014's V3 Sprint B**, and its blocking condition is now met. Sprint B (Markdown
AST parser + Shell parity, H05/H06) has **no Backlog tasks** — EPIC-014 states the post-083 shape is
*"not promoted, and each re-derived at its own promote."* Slicing it is `/task-decomposer --epic
EPIC-014`. It was held because the strangler method rests on *measured* parity and the gate could not
print a verdict line; **SPRINT-084 T1 restored that** (`QA-CHECK: 176 pass, 3 fail`, 492s), so the
condition that deferred it no longer holds.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P1 — Next Phase Required

- [ ] TASK-273 — Close `check-review-depth.sh`'s absence blind spot  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — a `check-*.sh` in the QA gate; a false negative here is silent by
                  construction, and this row exists because the guard already produced one)
      done-when:  a live sprint log carrying a `governance:high` (or `behaviour:material`) task with
                  **no** `review ·` line is reported as a **FAIL with a named finding**, not as a
                  `nothing to verify` note. One retained must-FAIL fixture per branch (absent-line +
                  governance:high · absent-line + behaviour:material), each failing with its own named
                  finding, plus the discrimination proof ADR-029 requires of Tier G. The archive-skip
                  half is ruled separately and explicitly — either archived paths become readable when
                  passed by name, or recording a review there is forbidden — but it is **ruled**, not
                  left implicit
      touches:    scripts/lib/check-review-depth.sh · evals/run-review-depth-fixtures.sh ·
                  possibly scripts/qa-check.sh (leg 2b wiring)
      depends-on: none
      assumes:    **the defect is reproduced, not inferred** — SPRINT-084 T2 ran it live: a log with a
                  `governance:high · behaviour:material` task and no `review ·` line prints
                  `no review line -- nothing to verify` and exits **0**. SPRINT-082 did exactly this and
                  closed 38 of 38 with zero review lines on the record; SPRINT-084's own live log does
                  the same. Escalated to P1 by the ledger's own rule (`severity: high` → auto-P1), not
                  by preference. Out of scope: re-litigating whether archived history should be
                  re-read — that is the ruling this task must *make*, not assume
      tracker:    TD-085 · L-165 · L-105 · SPRINT-082 T2 · SPRINT-084 T2
      origin:     close-retro
      state:      ready

- [ ] TASK-274 — Rule on `qa-gate-timing.md`'s superseded recommendation  [size: S] [risk: low] [HITL]
      class:      decision
      tier:       P (ADR-029 — a research decision doc; a defect is visible on first read)
      done-when:  `docs/research/qa-gate-timing.md`'s standing Recommendation is either amended or
                  marked superseded with a pointer to § Round 4, so a reader cannot act on a conclusion
                  the measurement overturned. Whichever way it is ruled, the doc stops asserting a
                  recommendation that the evidence below it contradicts
      touches:    docs/research/qa-gate-timing.md · docs/knowledge-index.md (generated)
      depends-on: none
      assumes:    **the supersession is specific, not general.** The doc's Recommendation ("Option C
                  stands... no sub-part of section 4 worth cutting") correctly ruled out
                  *coverage reduction* as a lever and was never wrong about that. It never tested
                  *spawn-count reduction*, which is where SPRINT-084 T1's actual cure came from
                  (271.5s → 23.6s with no coverage removed). So this is a scope correction, not a
                  reversal. Deliberately left for a promote-time ruling rather than edited mid-sprint,
                  because rewriting a decision doc to match a result is how the record stops being one
      tracker:    docs/research/logs/qa-gate-timing.md § Round 4 · TD-090 · SPRINT-084 T1
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

_(no active sprint)_ — SPRINT-082's shipped changes are written up as **v1.56.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Consumer-facing surfaces: the root `.gate-command` declaration (ADR-033) and review depth keyed on consequence rather than file extension.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

