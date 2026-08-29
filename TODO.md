---
owner: Maintainer
last_updated: 2026-08-29
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file** — Backlog pool + a pointer per active stream. The loop that drives it
> (`/prime` → `/triage` → `promote` → `sprint-bulk` → `close`) is documented once in
> [`.claude/CONTEXT.md`](.claude/CONTEXT.md) § The loop; debt lives in [`TECH-DEBT.md`](TECH-DEBT.md),
> never deleted, aged at promote. Pointers rather than a second copy (L-008).

---

## Active Sprint

> **Two active sprints — one per stream** (CONTEXT.md § Sprint model). Streams introduced at this
> promote; every prior sprint was single-stream and omitted `stream:`.

> **`engine` · SPRINT-092 — The Conversion's Measured Delta** → [docs/sprint/SPRINT-092-the-conversions-measured-delta.md](docs/sprint/SPRINT-092-the-conversions-measured-delta.md)
> **`autonomy` · SPRINT-093 — Close the Autonomy Guard Gap** → [docs/sprint/SPRINT-093-close-the-autonomy-guard-gap.md](docs/sprint/SPRINT-093-close-the-autonomy-guard-gap.md)

**092** is the half SPRINT-091 deferred by name — convert the ADR-family harness off the Shell engine,
then **measure what it bought** against T2's ceiling of 9.5–13.6 s, naming any shortfall. Strict chain
T1→T2→T3→T4. **093** closes § Closed-when 1, open since SPRINT-089: a reaper published a false
`PLAN_EXHAUSTED` and the shape checker **passed it**. Four independent tasks.

**Cross-stream ownership, fixed before either starts** (overlap coordinated, never parallel-built):
`scripts/qa-check.sh` + `evals/` → **092**, except `evals/run-night-run-rollup-fixtures.sh` → **093**;
`gen-index.sh` + `knowledge-index.md` + `night-run.sh` + `night-run.md` → **093**.

**Neither Plan is a night-run candidate** — every 093 task is `authority: J2` (two are `class: decision`),
so an unattended run would park 4 of 4: L-111's shape, refused at pre-flight not discovered mid-run.

**Still Backlog:** `TASK-318` (`L-172`'s durable form — belongs to no epic) · `TASK-300` ·
`TASK-188`/`296` (`blocked`) · `TASK-297`/`298` (`needs-info`; 298 reads SUPERSEDED since SPRINT-088 →
`/triage`). Route **`TD-120`** next: the S4.APPEND git-spawn cost, **before** H24–H26.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P1 — Next Phase Required

- [ ] TASK-303 — Teach the rollup checker to compare agreement, and the reaper which Plan it ran  [size: M] [risk: high] [HITL]
      class:      execution
      authority:  J2
      done-when:  `check-night-run-rollup.sh` FAILs a rollup whose `terminal ·` state contradicts the
                  per-task lines in the same file (a `parked` line under `PLAN_EXHAUSTED` is the
                  motivating case, and the SPRINT-089 artifact is the retained fixture), **and** the
                  reaper writes into the Plan the run was actually pointed at rather than inferring one
      touches:    scripts/lib/check-night-run-rollup.sh · scripts/night-run.sh · evals/run-night-run-rollup-fixtures.sh
      depends-on: none
      assumes:    none — the false artifact is committed and reproducible (SPRINT-089 log, quoted)
      tracker:    TD-112 · L-178 · L-174 (the same class, one sprint earlier, different route)
      origin:     close-retro
      state:      ready

- [ ] TASK-304 — Stop stamping a wall-clock date into the generated knowledge index  [size: S] [risk: med] [HITL]
      class:      execution
      authority:  J2
      done-when:  the index does not go stale from the passage of time alone — `gen-index.sh --check`
                  returns 0 on an unchanged tree across a midnight boundary, and the generator's
                  "Idempotent" claim is true of the whole file rather than only the marked region
      touches:    scripts/gen-index.sh · docs/knowledge-index.md
      depends-on: none
      assumes:    none — reproduced live: the sole diff after rollover was `last_updated: 2026-08-26` → `2026-08-27`
      tracker:    TD-111
      origin:     close-retro
      state:      ready

- [ ] TASK-305 — Make the launcher's gate precondition visible, and rule on declared exceptions  [size: S] [risk: med] [HITL]
      class:      decision
      authority:  J2
      done-when:  Part 1's checklist states the green-gate precondition where the checklist is read,
                  **and** an owner ruling is recorded on whether a run may fire against a *named,
                  pre-approved* failing check (never a blanket `--force`)
      touches:    skills/orchestrator/references/night-run.md · scripts/night-run.sh (only if the ruling says so)
      depends-on: none
      assumes:    none — `night-run.sh:339` dies on any non-zero gate exit; `grep -n bypass` is empty
      tracker:    TD-110 · L-179
      origin:     close-retro
      state:      ready

- [ ] TASK-306 — Rule pre-flight item 3's wording against a declared J2  [size: S] [risk: med] [HITL]
      class:      decision
      authority:  J2
      done-when:  item 3 says what the machinery does — either a declared `J2` that parks satisfies it,
                  or it does not and `TASK-301`'s Plan shape is invalid — with the ruling recorded where
                  the checklist is read, and `AFK-safe`/`J2` reconciled so the two are no longer
                  defined as opposites while one is said to permit the other
      touches:    skills/orchestrator/references/night-run.md · .claude/CONTEXT.md (only if the ruling moves the vocabulary)
      depends-on: none
      assumes:    none
      tracker:    TD-109 · SPRINT-090 D4
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

- [ ] TASK-296 — Run bounded unattended repair on one J1 finding  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4 — an unbounded or silently-skipped repair both end in a green run)
      done-when:  a concrete J1 critic finding drives repair → re-review → continue, with the retry
                  ceiling **exactly** what ADR-022 admits and no more; a second failure escalates
                  rather than looping. Retained must-FAIL: a repair that exceeds the ceiling fails
                  with its named finding while a within-ceiling sibling passes
      touches:    skills/orchestrator/references/review-scoping.md § The revise loop ·
                  skills/orchestrator/references/night-run.md · scripts/night-run.sh
      depends-on: TASK-292 · TASK-293
      assumes:    the ceiling is **not** re-decided here. Whether unattended repair inherits ADR-022's
                  single retry or earns its own is a **measurement** that accumulates from EPIC-006's
                  records (L-094); freezing a number before those exist is L-130. This task ships the
                  loop at the ceiling ADR-022 already admits
      tracker:    EPIC-015 § Closed-when 5 · V3 H31 · ADR-022
      origin:     decomposer
      state:      blocked

- [ ] TASK-297 — Emit a typed run outcome with the evidence behind it  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4)
      done-when:  every run emits `DELIVERED` / `PARTIAL` / `FAILED` **plus** DoD counts, tasks
                  attempted/completed, parks, repair cycles, verification state, warnings and terminal
                  reason. Retained must-FAIL: a run ending mid-Plan that reports `DELIVERED` fails
                  with its named finding while a genuinely-exhausted sibling passes
      touches:    skills/orchestrator/references/night-run.md · scripts/night-run.sh ·
                  templates/sprint-log.md.template
      depends-on: TASK-293 — the outcome is a function of the terminal state
      assumes:    **open question, ruled at this task's G2, not assumed here:** whether the
                  run-outcome vocabulary belongs to EPIC-015 or to EPIC-008's Run Protocol. V3 §11
                  says build only what hardening needs and leaves EPIC-008 owning the portable
                  protocol — so the ruling must land before a `RunSummary` shape is minted, or the two
                  epics mint competing ones
      tracker:    EPIC-015 § Closed-when 6 · V3 H37 · EPIC-008
      origin:     decomposer
      state:      needs-info

- [ ] TASK-298 — Teach the layers checker that a sibling active sprint is not undeclared work  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — this IS the attribution guard. Widening an exclusion is exactly how a
                  guard acquires a silent false negative: too broad and real undeclared work walks
                  through under cover of "another sprint owns it")
      done-when:  with **two active sprint files present**, each sprint's attribution is scoped to
                  itself — a file or commit that a *sibling active sprint's* `Layers:` declares no
                  longer reports as `undeclared` / `attributable to no task` against this one, while
                  every genuinely undeclared path still does. Proven on a **real two-active-sprint
                  tree**, not fixtures alone (L-166: fixtures prove the branch works, only the real
                  artifact proves it is reachable). Retained must-FAIL + sibling control: a path
                  declared by NO sprint still fails with its named finding while the sibling-declared
                  path passes. Seeded-break discrimination proof, seed verified landed by `cmp` and
                  restored under a checked hash, artifact still parses, break targeted not demolition
      touches:    scripts/lib/check-layers-observed.sh (the `is_excluded` family + the per-sprint
                  loop) · possibly scripts/qa-check.sh (it passes every `docs/sprint/SPRINT-*.md`) ·
                  evals/fixtures/layers-observed/** (new retained fixture pair) ·
                  evals/run-layers-observed-fixtures.sh
      depends-on: none — it is the prerequisite for promoting any stream 2, so it cannot sit inside one
      assumes:    **measured, not inferred.** `qa-check.sh:1013` does `ls docs/sprint/SPRINT-*.md` and
                  hands all of them to a checker that loops `for sp in "$@"` with zero stream
                  awareness, so attribution is repo-wide per sprint. Demonstrated live: commit
                  `39eedb8` (governance work, no sprint) reds SPRINT-087 with `commit attributable to
                  no task and not coordinator bookkeeping`. Reproduced independently by the session
                  executing SPRINT-087. `.claude/CONTEXT.md` § Sprint model already specifies streams
                  — the SSOT describes what the gate never learned (L-020, shipped != wired)
      tracker:    L-020 · L-166 · L-165/L-168 (isolated reviewer) · CONTEXT.md § Sprint model ·
                  blocks promoting EPIC-015 as stream 2
      origin:     manual
      state:      needs-info   # SPRINT-088 promote: looks SUPERSEDED — TASK-299 shipped the
                  # commit-ownership approach and its tracker reads "reverted from TASK-298".
                  # Routed to /triage to rule kept-vs-out-of-scope rather than deleted silently.

- [ ] TASK-300 — Decide whether the five gate-accuracy defects are one task or five  [size: S] [risk: low] [HITL]
      class:      decision
      done-when: a recorded ruling says whether TD-086 · TD-087 · TD-089 · TD-097 · TD-105 are fixed
                  as one "gate accuracy" task or separately, and the chosen shape is filed — not a fix,
                  a decomposition call
      touches:   TECH-DEBT.md · TODO.md (no code)
      depends-on: none
      assumes:   **the cluster is real, not an artifact of one sprint noticing things.** All five are
                  accuracy defects in the checkers that gate this repo, and two of them —
                  TD-087 (REACHES half) and TD-097 (EXISTS half) — are the *same script*,
                  `check-verify-reaches.sh`, filed three sprints apart with neither aware of the other
                  until SPRINT-087's close sweep read both rows together. That pairing is the evidence
                  the cluster is a cluster; the rest is judgement.
      tracker:   SPRINT-087 close sweep · TD-086 · TD-087 · TD-089 · TD-097 · TD-105
      origin:    close-retro
      state:     ready

- [ ] TASK-313 — ADR and git-repo fixture factories in TypeScript  [size: S] [risk: low] [AFK]
      class:      execution
      authority:  J1
      done-when:  the §4 cases build their fixtures through a factory instead of inline construction; a
                  test's expected verdict comes from the engine and never from the factory — enforced by
                  the factory exposing no assertion vocabulary at all, with a must-FAIL proving a
                  verdict-deciding factory is rejected
      touches:    test factories · §4 tests
      depends-on: none — TASK-312 was delivered as SPRINT-091 T7 (`e0ccdb6`)
      assumes:    durable spec — H14's guardrail is "factory creates state, factory does not decide
                  expected verdict"; no file paths or line numbers named here, they go stale
      tracker:    EPIC-014 H14
      origin:     decomposer
      state:      ready

- [ ] TASK-314 — Convert the ADR-family harness to bun:test and drop it from the always-on leg  [size: M] [risk: high] [HITL]
      class:      execution
      authority:  J1
      done-when:  every case the shell harness asserted has a bun:test equivalent, matched case-name FOR
                  case-name and diffed to an identical list — never "most" (D2); the harness is removed
                  from the always-on eval set in qa-check.sh; the gate's own PRINTED verdict line is
                  read directly as the check, never a piped or redirected status (L-120)
      touches:    evals/ · scripts/qa-check.sh leg 12 · test/
      depends-on: TASK-313 — the rest (TASK-308–312) were delivered as SPRINT-091 T3/T4/T5/T6/T7
      assumes:    git-repo construction cost survives the conversion and only the engine-spawn term is
                  removed — TASK-307 quantifies which, and this task's expected saving derives from that
                  Round rather than from an estimate
      tracker:    EPIC-014 H21 (slice pulled forward) · D5 feature-first · TD-090
      origin:     decomposer
      state:      ready

- [ ] TASK-315 — Relocate §4 differential parity to the opt-in profile, with an ADR naming when parity must run  [size: S] [risk: med] [HITL]
      class:      decision
      authority:  J1
      done-when:  a parity harness still spawns the Shell engine live and still asserts §4 row-by-row,
                  now sitting in the opt-in eval set; an ADR records the trade-off (a §4 drift window
                  between full-profile runs) and names the moments parity MUST run — promote, close, and
                  any full-profile run; the ADR states explicitly that Shell RETAINS §4 authority under
                  D2, since this is not a cutover
      touches:    evals/ · scripts/qa-check.sh · docs/adr/
      depends-on: TASK-314
      assumes:    owner ruled this shape at intake — parity moves to opt-in rather than staying
                  always-on or leaving the gate entirely
      tracker:    EPIC-014 D2 · ADR-029 Tier G + Tier P
      origin:     decomposer
      state:      ready

- [ ] TASK-316 — Measure the delta and settle what §4's conversion bought  [size: S] [risk: low] [HITL]
      class:      execution
      authority:  J1
      done-when:  a new Round records the gate before/after on the same host, same profile and same
                  semantic coverage; the measured delta is compared against TASK-307's derived ceiling
                  and any SHORTFALL IS NAMED rather than smoothed, following SPRINT-089 T1's precedent
                  of recording a missed target as missed; TD-090 is updated with what this conversion
                  did and did not buy
      touches:    docs/research/logs/qa-gate-timing.md · TECH-DEBT.md
      depends-on: TASK-314, TASK-315
      assumes:    none
      tracker:    TD-090 · EPIC-014 § Closed-when 7 · qa-gate-timing
      origin:     decomposer
      state:      ready

- [ ] TASK-318 — Detect a shipped capability that nothing calls, mechanically  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  a check reports any exported or registry-registered symbol in packages/ or apps/ that
                  has ZERO non-test callers, and it is pointed at the three real artifacts that
                  motivated it rather than fixtures alone (L-166): `attachLevel` before SPRINT-091 T11,
                  `createF4Registry`/`createS4AppendRegistry` before T12, and TD-103's `reconcile()` /
                  `marksInStandard()` — each must be reported by the check when run against the tree at
                  the commit that shipped it unwired. Retained must-FAIL fixture plus a sibling control
                  (a symbol WITH a production caller must stay green), and a seeded-break discrimination
                  proof verified landed under ONE hash convention (L-137 · L-142 · L-169)
      touches:    scripts/lib/ · scripts/qa-check.sh · evals/fixtures/
      depends-on: none
      assumes:    the class is mechanically detectable from imports/registrations without running the
                  code — CONFIRM at G2 by re-deriving against the three motivating artifacts before
                  designing; if a symbol reached only through a registry string proves undetectable
                  statically, the scope narrows to exported symbols and says so
      tracker:    L-172 (count: 2, promotable — "a per-task DoD cannot enforce a property that lives
                  BETWEEN tasks"; it exists because L-020 was already promoted and still missed the
                  class, then missed it twice more in SPRINT-091) · L-020 · TD-103 · L-166
      origin:     close-retro
      state:      ready

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.
---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(nothing yet for 092/093 — both were promoted 2026-08-29 and have shipped no change.)_ The previous entry, SPRINT-091 → **v1.62.0**, is written up in full in [`CHANGELOG.md`](CHANGELOG.md) and is not restated here (L-008).

---

## Quick Rules

> Collapsed to a pointer at the SPRINT-092/093 promote (L-008 — this file had accreted a copy of rules
> its satellites own): curated-not-copied, built-in leverage and the ADR bar live in
> [`.claude/CLAUDE.md`](.claude/CLAUDE.md) § Design Principles + § Anti-Patterns; reporting style in its
> § Behavioral Guidelines. A copied rule drifts from the one it copied.

