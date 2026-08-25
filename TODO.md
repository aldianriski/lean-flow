---
owner: Maintainer
last_updated: 2026-08-25
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

_(none — SPRINT-085 closed 2026-08-25, 26 of 26. It closed **EPIC-014's first § Closed-when condition**
whole: the Standard is parsed by AST to a typed model and agrees with `read-spec-rules.sh` row-by-row on
all 100 rows and on every retained malformed case. Next: **EPIC-014**'s third member sprint — V3 Sprint C
(H07–H11), whose first rule family is deliberately **not** chosen yet and is that sprint's own G2 call
(V3 §43 · L-130).)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P1 — Next Phase Required

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

- [ ] TASK-280 — Map `ok:false` to exit 1 when H11's CLI lands  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — the exit meaning is ADR-034 D3's frozen surface)
      done-when:  the TS CLI exits **1** for every `SpecReadFail` and **0** for every `SpecReadOk`,
                  including the legitimate zero-row section, asserted against the Shell reader's exit
                  as an independent oracle rather than against a copied literal
      touches:    packages/standard (CLI entry, H11) · its colocated tests
      depends-on: none (blocked in practice until H11's CLI exists)
      assumes:    **the domain half is already correct and must not be re-litigated.** SPRINT-085 T3
                  ruled `ok:false` vs exit 0/1 *not* a TS/Shell difference: ADR-034 D3 freezes exit
                  *meaning*, and `ok:false` carries that meaning faithfully — but the domain layer has
                  **no process boundary**, so nothing has yet mapped it to an exit code. The mapping is
                  where the meaning is lost if it is skipped
      tracker:    SPRINT-085 T3 carry-forward 1 · ADR-034 D3 · EPIC-014 V3 H11
      origin:     close-retro
      state:      ready

- [ ] TASK-281 — Stop a permission-denied spec from reporting `spec-not-found`  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — a wrongly *named* finding is the failure this repo prices highest)
      done-when:  an unreadable-but-present spec produces a finding distinct from `spec-not-found`,
                  matching whatever the Shell reader does, with a retained must-FAIL fixture per branch
      touches:    packages/standard (H11 CLI — the layer that touches the filesystem) · its tests
      depends-on: none (blocked in practice until H11's CLI exists)
      assumes:    **this is not a shipped defect and the task must not be written as if it were.**
                  `specNotFound()` in production is a *pure constructor with no filesystem access*, so
                  the domain never decides when to emit it; the over-broad catch lives only in T3's
                  test stand-in. What this task fixes is the decision H11 will otherwise make by
                  accident. Out of scope: changing the domain constructor
      tracker:    SPRINT-085 T3 carry-forward 2 · EPIC-014 V3 H11
      origin:     close-retro
      state:      ready

- [ ] TASK-282 — Carry every `--reconcile` finding, not just the first  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8)
      done-when:  a `--reconcile` run over a spec with **two or more** mismatching sections surfaces
                  every mismatch, matching the Shell reader's enumeration, with a fixture that has
                  more than one mismatch — the case a single-finding shape cannot pass
      touches:    packages/standard (result shape, H07) · its colocated tests
      depends-on: none (lands naturally at H07, when findings become typed data)
      assumes:    **accepted deliberately at SPRINT-085 T4, not overlooked.** Shell prints several
                  findings per run; TS surfaces the first mismatching section. The **verdict and the
                  finding name are identical**, so ADR-034 D3's frozen surface is intact and this is
                  cosmetic *today*. It stops being cosmetic at H07, where a result carrying N findings
                  is the natural shape — the point of filing it is that Sprint C should not inherit
                  the collapse silently
      tracker:    SPRINT-085 T4 carry-forward · ADR-034 D3 · EPIC-014 V3 H07
      origin:     close-retro
      state:      ready

- [ ] TASK-283 — Resolve the Round 4 / Round 5 disagreement on `S11.LOGPAIR` + `S11.WHENITRUNS`  [size: S] [risk: low] [AFK]
      class:      execution
      tier:       P (ADR-029 — a measurement record; a defect is visible on first read)
      done-when:  a **§ Round 6** in `docs/research/logs/qa-gate-timing.md` states which of the two
                  rounds is wrong and why, with the disagreement either reproduced or dissolved. The
                  numbers are **19× apart** on byte-identical code, so exactly one of them is a
                  measurement artefact and saying which is the deliverable
      touches:    docs/research/logs/qa-gate-timing.md (append-only — never edit a past round)
      depends-on: none
      assumes:    **the class of fact that closes this is a measurement (L-094)**, so it genuinely
                  parks until someone measures — unlike a documented behaviour or a judgement call,
                  which park forever behind that phrasing. The two rounds: Round 5 measured the pair
                  at **76.1s** combined, confirmed by an isolated rerun; Round 4 never named them and
                  its own arithmetic implies **≤4s** for its entire unnamed remainder. The engine is
                  byte-identical between the rounds and the archived corpus moved 120→122 files, so
                  neither round is obviously wrong. Out of scope: acting on either figure — TD-090's
                  ranking must not be re-ordered on a number this task exists to check
      tracker:    SPRINT-085 T5 · TD-090 · docs/research/qa-gate-timing.md § Caveats
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

_(no active sprint)_ — SPRINT-085's shipped changes are written up as **v1.58.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Consumer-facing surface: `check-review-depth.sh` now FAILs named on a *missing* review line instead of passing it as `nothing to verify` — a gate that got stricter, so a consumer repo previously closing clean may now see a named FAIL. The TS reference engine is **not** consumer-facing yet: it has no CLI until H11, and `package.json` still declares zero dependencies, so the no-toolchain install guarantee is unchanged.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

