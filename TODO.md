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

> **One active sprint.** Single stream — this sprint is not part of a stream and omits the `stream:`
> field (CONTEXT.md § Sprint model).

> **SPRINT-091 — Full Run and the First Family** → [docs/sprint/SPRINT-091-full-run-and-first-family.md](docs/sprint/SPRINT-091-full-run-and-first-family.md)

EPIC-014's **fourth member sprint** (`epic: EPIC-014`), targeting § Closed-when **2**. SPRINT-087 proved
one rule through the engine; this makes the engine able to run *whole*, migrates the **F6 §4
ADR-governance** family — chosen on measured cost across **both** axes, never by section number
(V3 §43) — and carries the slice through to one eval harness that no longer spawns the 3,142-line Shell
engine on every gate run. **T1 is the type checker**: ten TypeScript tasks on a toolchain that evaluates
no types would satisfy their own type-level DoD with unchecked code (**TD-101**, `high` and unrouted for
four sprints, escalated at this promote).
**G1/G2 are NOT yet signed** — `gates_signed:` is absent from that file, and its absence means not
signed, never approval.

Carried from the previous pair: EPIC-015 § Closed-when **1** stays open — the reaper published a false
`PLAN_EXHAUSTED` and the shape checker passed it (**TD-112** → `TASK-303`). SPRINT-089/090's full
post-close writeup lives in [`CHANGELOG.md`](CHANGELOG.md) v1.61.0, their archived sprint files, and
EPIC-015 § Member sprints.

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

      **Tier G, and the discrimination bar applies twice.** The checker is a guard; so is the reaper,
      which PRODUCES the field. L-174 named exactly this asymmetry and its fix still shipped a defect,
      because fixtures were written for the derivation and the bug moved upstream to which file the
      derivation is handed. Point the new fixture at the real committed artifact (L-166), not only at
      a synthetic one.

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

      A daily false FAIL in the gate is the noise that trains a reader to skim the failure list, and
      combined with TD-110 it converts into a **refused overnight launch** — the mode most likely to
      cross midnight is the one this epic is about.

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

      The wording half is cheap. The ruling half is not: the gate's whole job is refusing to run on a
      red tree, so permitting gate-repair work trades a guard for a convenience, and that is a decision
      rather than a fix.

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

      **SPRINT-090's D4 ruled the permissive reading and its justification was later corrected: only
      ONE of three cited mechanisms is genuinely unreachable under the strict reading, and `AFK-safe`
      (`:46`) and `J2` (`:58`) are defined as opposites in the same document, which cuts the other way.**
      So this is a genuine ambiguity between two defensible readings, and D4 must not be inherited as
      settled precedent — re-derive before relying on it.

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

- [ ] TASK-307 — Derive the conversion's real headroom before any threshold is frozen  [size: S] [risk: low] [HITL]
      class:      execution
      authority:  J1
      done-when:  a new Round in docs/research/logs/qa-gate-timing.md records (a) run-adr-family-
                  fixtures.sh's cost split between git-repo construction and engine invocation,
                  measured by instrumented copy rather than read from source; (b) a per-invocation
                  TS-vs-Shell comparison on the same fixture target using the already-migrated §12
                  family, explicitly named as a proxy; (c) the derived ceiling on what converting this
                  harness can save. No later task's DoD carries a performance number that does not
                  trace to this Round
      touches:    docs/research/logs/qa-gate-timing.md · instrumented temp copies, never shipped files
      depends-on: none
      assumes:    none — A4 (a TS in-process traversal costs ~ms where the Shell spawn costs 8.5s) is
                  UNMEASURED, and this task exists to kill it as an assumption before it reaches a
                  frozen artifact (L-130)
      tracker:    EPIC-014 H13 · TD-090 · qa-gate-timing Rounds 5-8
      origin:     decomposer
      state:      ready

- [ ] TASK-308 — Full Standard traversal in TS, at parity with the Shell full run  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  a full conformance invocation with no rule/section flag traverses every rule the
                  parser admits, dispatching by §14 mark; asserted row-by-row against
                  conformance-engine.sh spawned live as an oracle, never a copied literal; a rule with
                  no registered evaluator reports as a NAMED gap, never silently omitted — proven by
                  seeding a rule out of the registry and confirming exactly that row reddens
      touches:    apps/cli · packages/standard (traversal + mark-driven dispatch) · tests
      depends-on: none
      assumes:    the registry's Map dispatch stays open-closed (SPRINT-087 proved this), so no
                  evaluator edits are needed to add traversal
      tracker:    EPIC-014 H12 · § Closed-when 2
      origin:     decomposer
      state:      ready

- [ ] TASK-309 — Hold semantics and full-run level arithmetic  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  the full-run conformance level matches Shell's across fixture repos including at least
                  one HOLD case; a partial (single-rule or single-section) invocation still emits NO
                  global level, re-proven by seeding one in and confirming only the structural checks
                  redden; hold-vs-fail is distinguished, never collapsed
      touches:    packages/standard (result domain · level arithmetic) · tests
      depends-on: TASK-308
      assumes:    none — SPRINT-087 froze "no global level on a partial run" as a property of the
                  frozen result rather than of the printer, and this task must not regress it
      tracker:    EPIC-014 H12 · § Closed-when 2
      origin:     decomposer
      state:      ready

- [ ] TASK-310 — Accept a caller-supplied spec path on the TS CLI  [size: S] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  a caller-supplied spec path is evaluated against instead of the shipped Standard; a
                  doctored spec that drops one rule row provably changes the result (seeded, with a
                  sibling control left unchanged); a nonexistent path fails loudly and stays
                  distinguished from an unreadable one, per SPRINT-087's spec-not-found vs
                  permission-denied precedent
      touches:    apps/cli · tests
      depends-on: none
      assumes:    fixture harnesses hand the engine doctored specs — verified at intake: adr-family
                  reduces its spec to §4, and three other harnesses do the same by design
      tracker:    EPIC-014 H11/H13 · prerequisite for the harness conversion
      origin:     decomposer
      state:      ready

- [ ] TASK-311 — Migrate S4.ONEFILE · S4.INDEX · S4.SECTIONS · S4.NEGATIVE  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  four evaluators registered at their own call sites with no edit to dispatch; per-rule
                  parity against Shell on the retained fixtures; each retained must-FAIL reddens with
                  its OWN named finding while its sibling control stays green; every seeded break is
                  verified to have landed, under ONE stated hash convention (L-169)
      touches:    packages/standard/src/rules · evals/fixtures (retained, never replaced) · tests
      depends-on: none
      assumes:    these four are file/text-based and need no git port — S4.APPEND is split out for
                  exactly that reason
      tracker:    EPIC-014 H13 · F6 §4 ADR governance · D2 strangler
      origin:     decomposer
      state:      ready

- [ ] TASK-312 — Migrate S4.APPEND behind a real git port  [size: M] [risk: high] [HITL]
      class:      execution
      authority:  J1
      done-when:  S4.APPEND reaches parity with Shell including the marker-passes and shallow-clone
                  cases; a real Bun adapter plus an in-memory fake, per SPRINT-087's port pattern; the
                  shallow-clone branch is pointed at the artifact that motivated it and shown REACHABLE,
                  not merely working on a fixture (L-166)
      touches:    packages/standard/src/rules · adapters · tests
      depends-on: TASK-311
      assumes:    S4.APPEND is the only §4 rule defined over git objects — derived from the family's
                  rule list at intake, to be re-confirmed at G2 rather than inherited from this line
      tracker:    EPIC-014 H13 · F6 · the family's only git-bound rule
      origin:     decomposer
      state:      ready

- [ ] TASK-313 — ADR and git-repo fixture factories in TypeScript  [size: S] [risk: low] [AFK]
      class:      execution
      authority:  J1
      done-when:  the §4 cases build their fixtures through a factory instead of inline construction; a
                  test's expected verdict comes from the engine and never from the factory — enforced by
                  the factory exposing no assertion vocabulary at all, with a must-FAIL proving a
                  verdict-deciding factory is rejected
      touches:    test factories · §4 tests
      depends-on: TASK-312
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
      depends-on: TASK-308, TASK-309, TASK-310, TASK-311, TASK-312, TASK-313
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

- [ ] TASK-317 — Wire a type checker into the gate so "enforced by a type" means something  [size: S] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  a type check runs inside the gate and FAILS on a real type error — proven by the exact
                  case TD-101 recorded (a bare string assigned to a readonly Finding[], and a number
                  assigned to a string field), which the current gate accepts silently; a type-checker
                  dependency is declared rather than assumed present; the checker's OWN printed verdict
                  is read as the result, never a wrapper's exit status (L-120)
      touches:    package.json · scripts/qa-check.sh · tsconfig
      depends-on: none
      assumes:    none — TD-101 recorded the reproducing case and confirmed independently that no type
                  check is invoked anywhere and no type-checker dependency is declared at all
      tracker:    TD-101 (high, open since Sprint-087, never routed to the Backlog) · EPIC-014 D4 ·
                  L-105 (an absent guard wearing the shape of a present one)
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

_(no active sprint)_ — SPRINT-086's shipped changes are written up as **v1.59.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Consumer-facing surfaces: the attended **consequence** schema (new field in `sprint-log.md.template` + `orchestrator/SKILL.md` + `review-scoping.md`), a **stricter** review-depth gate that now FAILs on a missing review line for `governance:high`/`behaviour:material` work, and the QA budget default lowered **900s → 450s** so an over-budget run reports and names its skipped harnesses instead of dying past an external timeout.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

