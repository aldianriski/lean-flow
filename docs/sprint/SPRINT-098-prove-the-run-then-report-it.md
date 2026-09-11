---
sprint: 098
slug: prove-the-run-then-report-it
epic: EPIC-015
owner: Maintainer
last_updated: 2026-09-11
status: active
plan_commit: a341378
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-098 — Prove the Run, Then Report It

> **Theme:** EPIC-015 has three conditions left that a guard cannot satisfy — they need a run. § Closed-when
> 1 wants a real unattended run whose terminal state agrees with its own task lines; 5 wants a bounded
> repair loop; 6 wants a typed outcome carrying the evidence behind it. SPRINT-093 closed the *guard* gap
> and proved each half separately, which is not the same claim. This sprint first makes the rollup
> unconditional — today's checker is reachable only through the reaper, so the mode this repository
> actually runs in has no guard at all (L-192) — then fires the run and says what it did.

## Scope

**In:**
1. The run rollup emitted and checked **unconditionally**, not gated on run mode, and the continuation
   contract lifted out of a paragraph into a headed section (TASK-336 · L-192).
2. A bounded unattended repair loop at exactly ADR-022's ceiling, escalating rather than looping
   (TASK-296 · EPIC-015 § Closed-when 5).
3. A typed run outcome — `DELIVERED` / `PARTIAL` / `FAILED` plus its evidence (TASK-297 · § Closed-when 6).
4. A genuinely unattended run through `--mode overnight` whose `terminal ·` line agrees with its own
   per-task lines, verified against the run's committed log rather than a fixture (TASK-319 · § Closed-when 1).
5. If — and only if — that run stops mid-Plan, the rollup's `unattempted` naming claimed end-to-end
   (TASK-188, opportunistic).

**Out (deferred):**
- **TASK-326** (a commit's claimed DoD delta vs the ticks it made). It is the cheaper standalone guard
  the epic-first ruling defers; it stays P1.
- **The P2 gate-accuracy cluster** (TASK-338 · 339 · 340 · 341 · 342 · 343). One family, scheduled
  together, not here.
- **Making the gate finish.** TD-090 · TD-117 · TD-143's cost half are untouched for a fourth sprint.
  T1 makes a missing rollup unmistakable; it does not make the gate cheaper.
- **Backfilling the existing sprint logs** — unless T1's own ruling chooses backfill over grandfathering.
- **EPIC-015 § Closed-when 7 and 8** (the two dogfoods, and re-arming the V3 §58 freeze). Both rest on
  5 and 6 landing first.

## Plan

### T1 — Make the run rollup unconditional, and lift the continuation contract out of a paragraph `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-night-run-rollup.sh` · `scripts/night-run.sh` (the reap gate) · `skills/orchestrator/SKILL.md` (step 4) · `evals/fixtures/` + its harness
Depends-on: none
Cites: L-192 · L-166 · ADR-016 · ADR-021 · ADR-029
**Tier G** (ADR-029) — the false negative is silent by construction: a run that ends mid-Plan and emits
no rollup is indistinguishable from one that finished, and the artifact that would tell them apart is the
one the failure drops. The guard is correct and blind to 100% of real traffic, because every sprint this
repository runs is attended and the reaper fires only on unattended runs.

**Acceptance:** An attended sprint with open DoD and no `run-complete` entry carrying a `terminal ·`
state FAILs with its named finding, while an attended sprint carrying one PASSes in the same run.

**DoD:**
- [ ] **An ABSENT log is a named FAIL, not a skip** — a sprint with open DoD is a FAIL whether its Execution Log holds no `run-complete` entry *or* does not exist at all. Today `qa-check.sh` leg 2g builds its input from live Plans that already have a log and emits `note … skip -- no Execution Log alongside an active sprint` when none does, so the one state the guard exists to catch — a run that died before writing anything — is the one it skips. *(Judgment tick against the named check: running `check-night-run-rollup.sh` shows it ran, not that the skip is gone; the mechanical proof is DoD 4's must-FAIL + control. `scope-change` 2026-09-11 — the frozen premise "reachable only through the reaper" is true of workdoo, false here.)*
- [ ] Pointed at its **motivating population**, not only at fixtures (L-166): the set of sprint logs carrying no `run-complete` entry is **derived at execution by shape, cross-checked two ways that agree** — never restated from this Plan or from TASK-336's row (see **A2**; L-108 · L-130).
- [ ] The ruling per ADR-021 is **grandfather, by scoping the guard to live sprints** (owner-ruled 2026-09-11, Log): the check fires at close, while the sprint is still in `docs/sprint/` and a rollup can still be written; the **36 of 97** archived sprints carrying open DoD fall out of scope by construction, not by a maintained list. Implemented as scoped, and the inherited `*/archive/*` glob defect (`TASK-342`) named in the code.
- [ ] Retained must-FAIL **plus a sibling control green in the same run** (L-058 · L-142).
- [ ] At least one fixture varies the **selection**, not the verdict — a log reached by the other glob arm, or a sprint whose open-DoD state is read from the other side of the archive boundary (L-186).
- [ ] **Seeded-break discrimination proof**: seed verified landed, artifact still parses, break targeted not a demolition, and a landed seed that reddens nothing reported as **untested** rather than scored as a pass — all under ONE stated hash convention (L-137 · L-142 · L-169 · L-187).
- [ ] The **continuation contract** moves out of `orchestrator/SKILL.md` step 4's paragraph into its own headed section at G1/G2's structural level, naming the five terminal states (L-192 — form, not wording).
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168), after the author has enumerated every call site touched and seeded a break in each fix (L-193).

### T2 — Run bounded unattended repair on one J1 finding `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` (§ The revise loop) · `skills/orchestrator/references/night-run.md` · `scripts/night-run.sh`
Depends-on: T1 — **D1** (shared `scripts/night-run.sh`)
Cites: EPIC-015 § Closed-when 5 · ADR-022 · ADR-029 · V3 H31
**Tier G** (ADR-029 · D4) — an unbounded loop and a silently-skipped repair both end in a green run, and
the run's own report cannot tell them apart. The ceiling is **not** re-decided here (**A4**).

**Acceptance:** A concrete J1 critic finding drives repair → re-review → continue at exactly the ceiling
ADR-022 admits; a second failure escalates instead of looping.

**DoD:**
- [ ] The loop is specified **and wired where the run reads it**, not only where it is described (L-020).
- [ ] The ceiling is **read from ADR-022**, cited by section, never re-chosen in this sprint (**A4** · L-130).
- [ ] A second failure **escalates** — the escalation path is named and reachable, and the run does not continue past it.
- [ ] Retained must-FAIL: a repair exceeding the ceiling fails with its named finding, while a within-ceiling sibling passes in the same run (L-058 · L-142).
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-137 · L-169 · L-187).
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).

### T3 — Emit a typed run outcome with the evidence behind it `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/night-run.md` · `scripts/night-run.sh` · `skills/lean-doc-generator/templates/sprint-log.md.template` *(corrected at G2 — there is no root `templates/`; L-100)*
Depends-on: T1 · T2 — **D1** · **D2** (both shared files)
Cites: EPIC-015 § Closed-when 6 · EPIC-008 · ADR-016 · ADR-029 · V3 H37
**Tier G** (ADR-029 · D4). The outcome is a function of the terminal state SPRINT-088 shipped; what is
missing is the evidence beside it. A run reporting `DELIVERED` off a mid-Plan stop is the same silent
false negative T1 closes, one level up.

**Acceptance:** Every run emits `DELIVERED` / `PARTIAL` / `FAILED` **plus** DoD counts, tasks
attempted/completed, parks, repair cycles, verification state, warnings and terminal reason.

**DoD:**
- [ ] **A3 is ruled (owner, 2026-09-11): EPIC-015 ships a local run outcome; EPIC-008 keeps the portable protocol.** EPIC-008 is `status: proposed` with no member sprints and its object set explicitly refuses to assume a repository, while this needs a local report in a sprint Execution Log (V3 §11 — build only what hardening needs). **Binding: the name `RunSummary` is NOT minted here** — the shape is named for the Part 4 rollup it types, and it records that EPIC-008 may subsume or map it.
- [ ] All nine evidence fields emitted, each sourced from the run rather than restated by the launcher's narrative.
- [ ] The outcome is **wired into what reads the log** — the template's event vocabulary and the rollup consumer, not present only in its own file (L-020).
- [ ] Retained must-FAIL: a run ending mid-Plan that reports `DELIVERED` fails with its named finding, while a genuinely-exhausted sibling passes in the same run (L-058 · L-142).
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-137 · L-169 · L-187).
- [ ] **Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).

### T4 — Prove § Closed-when 1 with a real unattended run against the repaired reaper `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `docs/sprint/` (a seeded Plan a run is permitted to execute) · `scripts/night-run.sh` (**read, not modified** — **D1**)
Depends-on: T1 — and **not** T2/T3 (**D3**)
Cites: EPIC-015 § Closed-when 1 · TD-112 · TD-110 · L-179 · L-007 · L-166
SPRINT-093 closed the guard gap and proved each half separately, which is not the same claim as *"a run
ends only at one of five named states."* The two defects it repaired — the reap gate that ignored the
canonical mode name (T3) and the window/agreement matrix (T1) — have never been observed together in one
live run. Its reviewer reproduced the chain in a throwaway repo, never in this one.

**Acceptance:** A genuinely unattended run fires via `--mode overnight`, reaps, and writes a `terminal ·`
line whose state agrees with its own per-task lines — verified by `check-night-run-rollup.sh` against the
run's **own committed log**, not a fixture.

**DoD:**
- [ ] The vehicle is a **seeded** Plan (the SPRINT-090 way), not real work re-declared AFK to make a run fire — reshaping a task to dodge a gate is the failure, not the fix.
- [ ] The seeded Plan is **not all-J2**, which pre-flight item 3 refuses outright under SPRINT-093 T4's STRICT ruling.
- [ ] The run fires through `--mode overnight` and **reaps** — the canonical name, the one L-183 found the gate ignoring.
- [ ] The `terminal ·` state **agrees** with the run's own per-task lines, checked against the committed log. — *Verify: `sh scripts/lib/check-night-run-rollup.sh .` over that log*
- [ ] EPIC-015 § Closed-when 1 is ticked **on that artifact** and names it.

### T5 — Claim the mid-Plan artifact if the run produces one `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` (only if the exercise finds a defect) · a sprint Execution Log
Depends-on: T4
Cites: SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
**Opportunistic by design, and that design is not being changed here** (**D5**). The trigger is a run that
stops mid-Plan *for its own reasons*; do not schedule a run to produce one. What pairing with T4 fixes is
L-111's other half — a run happening in a sprint where nobody is positioned to claim the artifact.

**Acceptance:** A real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks as
`unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via `--reap`.

**DoD:**
- [ ] The rollup names every untouched task `unattempted`, end-to-end through the launcher.
- [ ] If T4's run does **not** stop mid-Plan, this task closes `unattempted` with that stated — never reshaped into a scheduled stop (**D5**).

## Owner-action checklist
- [ ] Record the **ten-dimension pre-launch approval envelope** in this file's frontmatter before T4 fires — goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions. Absence means NOT approved, and a bracketed placeholder counts as absent.

## Decisions (pre-locked)
- **D1 — `scripts/night-run.sh` is owned in order T1 → T2 → T3 → T5.** T4 **reads** it and never modifies it. **T5 appended at G2:** its `Layers:` claims the file conditionally ("only if the exercise finds a defect"), and a conditional write to a shared file is still a shared-file write. Stage per-hunk on any shared file and verify `git diff --cached`; never a plain `git add` over another task's WIP (L-042 · L-037).
- **D2 — `skills/orchestrator/references/night-run.md` is owned T2 → T3**, same staging rule.
- **D3 — T4's run is NOT gated on T2 or T3 being green.** If either slips, T4 fires against T1's repair alone, which is all its acceptance requires. SPRINT-060 foreclosed its only vehicle by letting an unrelated ruling decide the run's shape (L-111); this row exists so that cannot happen twice.
- **D4 — T1/T2/T3 are `J1`; T4/T5 are `J2`.** The Plan is deliberately not all-J2 so pre-flight item 3 admits a run at all. `J2 ⇒ HITL`; the converse does not hold, so a J1 task run with a human present stays J1.
- **D5 — T5 is opportunistic and is not scheduled.** Closing it `unattempted` is a correct outcome; manufacturing a mid-Plan stop is not.

## Assumptions
- **A1** — **RULED at G2, 2026-09-11: grandfather, by scoping the guard to live sprints.** The check fires at close, the only moment a rollup can still be written; the **36 of 97** archived sprints carrying open DoD are out of scope by construction, not by a maintained list. Inherits `TASK-342`'s `*/archive/*` glob defect, named in the Log rather than discovered later.
- **A2** — **RESOLVED at G2 by derivation: the figure is 36 of 97, not 44 of 50.** Matched by shape (`^### <date> | run-complete |`), worktrees excluded, each count cross-checked by its own inverse: 51 sprint logs = 6 with a rollup + 45 without; 97 archived sprints = 37 with open DoD + 60 fully ticked; of those 37, **36 carry no rollup**. TASK-336's row counted *logs* in its denominator while its criterion is about *sprints* (L-130 · L-108 · L-170).
- **A3** — **RULED at G2, 2026-09-11: EPIC-015 ships a local run outcome; EPIC-008 keeps the portable protocol**, and the name `RunSummary` is not minted here. EPIC-008 is `status: proposed` with no member sprints and its object set refuses to assume a repository at all.
- **A4** — **CONFIRMED at G2 by reading, not by ruling.** ADR-022 § Decision item 2: **one retry per review pass, total** (owner-ruled SPRINT-065 T3); still-open → `parked-hitl`, never a second firing — plus a mechanical trigger and a declared repo policy, absence of which means never. A documented behaviour is closed by reading (L-094); T2 ships at this ceiling and re-decides nothing.
- **A5** — SPRINT-093's reap-gate and agreement fixes hold under a live run. **UNCONFIRMED by construction** — that is T4's entire point. *Confirm: T4's run, or its failure.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-098-prove-the-run-then-report-it.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** —

**Cost** —

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
