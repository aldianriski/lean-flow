---
owner: Maintainer
last_updated: 2026-08-30
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

> **One active sprint.** The `autonomy` stream closed with SPRINT-093 (2026-08-30); `engine` runs on.
> Streams were introduced at the SPRINT-092/093 promote — every prior sprint was single-stream and
> omitted `stream:`.
>
> **SPRINT-093's §11 archive is DEFERRED, deliberately — do not move it until SPRINT-092 closes.**
> Both were promoted at the same `plan_commit: c52496f`, and `check-layers-observed.sh:397` drops
> `*/archive/*` from the sibling list that line 429 uses to skip another sprint's commits. Archiving
> 093 therefore re-attributes its entire history to 092: measured in both directions at the close —
> **214 pass / 0 fail** in place, **202 pass / 1 fail** archived (**TD-125** · `TASK-298`). The file
> stays in `docs/sprint/` with `status: closed`; its `INDEX.md` row is already written.

> **`engine` · SPRINT-092 — The Conversion's Measured Delta** → [docs/sprint/SPRINT-092-the-conversions-measured-delta.md](docs/sprint/SPRINT-092-the-conversions-measured-delta.md)

**092** is the half SPRINT-091 deferred by name — convert the ADR-family harness off the Shell engine,
then **measure what it bought** against T2's ceiling of 9.5–13.6 s, naming any shortfall. Strict chain
T1→T2→T3→T4, so no task in it parallelises.

**The cross-stream ownership split is spent** now that `autonomy` has closed: `scripts/qa-check.sh`,
`evals/`, `gen-index.sh`, `knowledge-index.md`, `night-run.sh` and `night-run.md` all have a single
active claimant again. **`QA_BUDGET_SECONDS` is at 520 on loan** — raised from 450 at `d815dc6` because
093 added ~37 s of always-on coverage before 092's saving arrived, and explicitly not permanent: 092
T2/T4 reclaim 9.5–13.6 s and should bring it back down (**TD-117**).

**Still Backlog:** `TASK-318` (`L-172`'s durable form — belongs to no epic) · `TASK-300` ·
`TASK-319`/`320` (SPRINT-093's close-Retro follow-ups) · `TASK-188`/`296` (`blocked`) ·
`TASK-297`/`298` (`needs-info`; 298 reads SUPERSEDED since SPRINT-088 → `/triage`).
Route **`TD-120`** next: the S4.APPEND git-spawn cost, **before** H24–H26.

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
                  **AND the archived-sibling half (TD-125, measured live at SPRINT-093's close):** a
                  sprint moved to `docs/sprint/archive/` must keep owning its own commits. Line 397
                  drops `*/archive/*` from `sibling_sprints`, which line 429 uses to skip another
                  sprint's commits — so archiving a closed sprint re-attributes its whole history to
                  whichever active sprint shares its `plan_commit` window. The two questions the one
                  list answers are different: *is this sprint active work?* (archive = yes, exclude)
                  versus *does it own its commits?* (archive = irrelevant, a closed sprint owns its
                  history forever). Retained fixture: an archived sprint's commits do NOT land on an
                  active sibling, while a genuinely undeclared path still FAILs
      touches:    scripts/lib/check-layers-observed.sh (the `is_excluded` family + the per-sprint
                  loop + the `sibling_sprints` build at :397) · possibly scripts/qa-check.sh (it passes every `docs/sprint/SPRINT-*.md`) ·
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
                  **TD-125** (the archived-sibling half, reproduced in both directions at SPRINT-093's
                  close: 214 pass/0 fail with the file in place, 202 pass/1 fail archived) ·
                  blocks promoting EPIC-015 as stream 2 · blocks archiving SPRINT-093 until 092 closes
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

- [ ] TASK-319 — Prove § Closed-when 1 with a real unattended run against the repaired reaper  [size: M] [risk: high] [HITL]
      class:      execution
      authority:  J2
      done-when:  a genuinely unattended run fires via `--mode overnight`, reaps, and writes a
                  `terminal ·` line whose state AGREES with its own per-task lines — verified by
                  `check-night-run-rollup.sh` against the run's own committed log, not a fixture. The
                  run must exercise the two defects SPRINT-093 repaired but never observed together in
                  one live run: the reap gate that ignored the canonical mode name (T3) and the
                  window/agreement matrix (T1). EPIC-015 § Closed-when 1 is ticked only on that
                  artifact — SPRINT-093 closed the GUARD gap and proved each half separately, which is
                  not the same claim as "a run ends only at one of five named states" (L-007's
                  exercise-on-real-input half; L-166 — fixtures prove a branch works, the motivating
                  artifact proves it is reachable)
      touches:    docs/sprint/ (a seeded Plan a run is permitted to execute) · scripts/night-run.sh (read, not modified)
      depends-on: none — but it needs a Plan that is NOT all-J2, since pre-flight item 3 now refuses
                  one outright under SPRINT-093 T4's STRICT ruling. Seed the vehicle the way SPRINT-090
                  did, rather than re-declaring real work AFK to make a run fire (that is reshaping a
                  task to dodge a gate)
      assumes:    the reap-gate and agreement fixes hold under a live run — UNCONFIRMED by construction,
                  which is the entire point of this task; T3's reviewer reproduced the chain in a
                  throwaway repo, never in this one
      tracker:    EPIC-015 § Closed-when 1 · TD-112 (resolved → SPRINT-093 T1) · TD-110 (resolved → T3) · L-179
      origin:     close-retro
      state:      ready

- [ ] TASK-320 — Give the launcher a fire-time run ledger, closing TD-122 and TD-124 together  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  the launcher records that a run FIRED at the moment it fires, independent of
                  `reap()`'s later decision to append — so (a) a run that fires but never reaches the
                  reaper is distinguishable from one that never happened (**TD-122**), and (b)
                  `check-authority.sh` can read attendedness from a written fact instead of inferring
                  it from two defeatable signals (**TD-124**). Retained must-FAIL: a fired-but-unreaped
                  run must be detectable as such; sibling control: a never-fired tree stays green.
                  Seeded-break discrimination proof under ONE hash convention (L-142 · L-169)
      touches:    scripts/night-run.sh · scripts/lib/check-authority.sh · evals/fixtures/
      depends-on: none
      assumes:    the two rows genuinely share one mechanism — CONFIRM at G2 by re-deriving both
                  rows' evidence rather than inheriting this line; TD-122's own row states it is
                  explicitly NOT closable by better parsing, and TD-124's residual is named in
                  `check-authority.sh`'s own header comment (L-091 — a Mitigation is a hypothesis)
      tracker:    TD-122 · TD-124 · L-178
      origin:     close-retro
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

_(nothing yet for **092**, still active.)_ **093 closed 2026-08-30 at 19 of 19** and is written up in full in [`CHANGELOG.md`](CHANGELOG.md) — unreleased, bundling into the next MINOR alongside SPRINT-088; not restated here (L-008). The previous released entry, SPRINT-091 → **v1.62.0**, is likewise there.

---

## Quick Rules

> Collapsed to a pointer at the SPRINT-092/093 promote (L-008 — this file had accreted a copy of rules
> its satellites own): curated-not-copied, built-in leverage and the ADR bar live in
> [`.claude/CLAUDE.md`](.claude/CLAUDE.md) § Design Principles + § Anti-Patterns; reporting style in its
> § Behavioral Guidelines. A copied rule drifts from the one it copied.

