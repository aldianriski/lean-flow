---
epic: 015
slug: execution-autonomy
owner: Maintainer
last_updated: 2026-08-29
status: active
member_sprints: [SPRINT-088, SPRINT-089, SPRINT-090, SPRINT-093]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-015 — Execution Autonomy

> **Outcome:** an approved sprint Plan runs to a **named terminal state** without per-task human
> confirmation — delegated judgment (J1) executes inside the pre-authorized envelope, authority
> decisions (J2) park — and every run reports `DELIVERED` / `PARTIAL` / `FAILED` with the evidence
> behind that verdict.

## Why this, why now

Task completion is being read as run completion. `sprint-bulk` pauses between tasks the owner already
authorized, `overnight` is not the discoverable name of the mode that exists, the authority classes the
loop already behaves as if it has (mechanical · delegated · human) are nowhere declared, and a run's
outcome is a prose rollup rather than a typed verdict. Each is cheap alone; together they are why an
approved Plan still needs a human sitting beside it.

It spans sprints because the authority model (J0/J1/J2) has to be declared and *proven* — including a
**seeded J2 control**, since a natural J2 park cannot be scheduled — before the envelope, the repair
loop and the run-outcome vocabulary can rest on it, and because V3 §56's two dogfoods are integration
boundaries, not steps inside a task.

### It supersedes SPRINT-082's freeze — owner ruling, 2026-08-24

SPRINT-082 T5 wrote *"the core execution architecture is FROZEN"* into
`docs/research/adlc-epic-sequencing.md`, admitting further workflow change only on a measured defect ·
measured cost · repeated workflow failure · security issue · consumer evidence. That freeze was written
before V3 existed. The owner ruled that **V3 supersedes it**: the freeze re-arms after V3's integrated
dogfood (V3 §56/§58), not after SPRINT-082.

> **Owner-action — DONE 2026-08-25.** The ruling was not in force until written where the admission
> decision reads it: `adlc-epic-sequencing.md` is the file consulted when an epic is proposed, so a
> ruling recorded only here, or only in a commit message, governs nothing (**L-151** — this epic would
> otherwise *be* that failure). The amendment had been deferred solely because SPRINT-082's close held
> uncommitted WIP in that file (L-042); that close landed and the file went clean, so the amendment is
> now written into its § *The core execution architecture is FROZEN*. **D1 is binding.**

## Scope

**In:** the sprint-bulk continuation contract and its five terminal states · `overnight` registered as
the canonical mode with its aliases · the J0/J1/J2 authority classes · the pre-authorized AFK envelope
with one recorded approval · bounded unattended Gauntlet repair · generator budget awareness · a
reusable unattended capability profile · typed run outcomes (V3 H27–H31, H35–H37).

**Out (explicitly not):** **H32 · H33 · H34 — already shipped in SPRINT-082** (T1 risk-aware
`no-gate-discovered` + declared gate rung/ADR-033 · T2 risk-based review depth · T3 Verify
reachability). This epic *exercises* them in dogfood and re-implements none of them. Also out: any new
agent definition, hook or reviewer role · a critic swarm · turning the bounded revise into an unbounded
loop · push/deploy/external destructive authorization · a scheduler or queue service · run-state resume
(ADR-013 (b) was deferred, and EPIC-006 carries its guardrail) · the reference-engine migration
(**EPIC-014**).

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-015-execution-autonomy.md per ADR-030, created
     lazily at the first member close. -->

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-088](../sprint/archive/SPRINT-088-execution-autonomy-foundation.md) | Execution Autonomy Foundation | **closed** 2026-08-26 — 13 of 16 DoD | **Contributed:** the authority vocabulary the rest of the epic is written in — `J0`/`J1`/`J2` declared per task and guarded (`check-authority.sh`); the continuation contract with five named terminal states, emitted by the launcher (`reap()` + `check-night-run-rollup.sh`); `overnight` canonical with every prior name resolving as an alias (`resolve-run-mode.sh`) — **§ Closed-when 2 complete**; and a ten-dimension `approval_envelope:` recorded in sprint frontmatter (`check-approval-envelope.sh`). Five retained harnesses, 49 assertions. **Did NOT complete § Closed-when 1, 3 or 4:** each needs a real unattended run, and this Plan is entirely `HITL`, which Part 1 pre-flight forbids a run against — the criteria were unreachable the moment the Plan froze (L-111, cited *inside* the DoD that repeated it). Carried by **TASK-301**, which seeds a Plan a run is permitted to execute. An independent Tier G review found 2 HIGH defects post-hoc, both fixed, both invisible to 39 green assertions (L-165 ×3). Slice: V3 H27–H30, targeting § Closed-when **1–4**. The authority model first, because the envelope is expressed in J-classes and the continuation contract has no definition of "already authorized" without them. Then continuation with five named terminal states, `overnight` as the canonical mode named after the contract it runs, and one pre-launch approval written where the run reads it. **This repo's first parallel stream** (`stream: autonomy`), running beside EPIC-014 rather than after it — admissible because the two surfaces are disjoint, verified token-by-token at promote, and because TASK-299 taught the gate to scope attribution by commit ownership. Deferred: bounded repair (TASK-296), typed outcomes (TASK-297, gated on the EPIC-008 `RunSummary` ruling), both dogfoods and the freeze re-arm. |
| [SPRINT-089](../sprint/archive/SPRINT-089-prove-the-unattended-run.md) | Prove the Unattended Run | **closed** 2026-08-27 — 10 of 10 DoD | **Contributed § Closed-when 3 and 4, complete.** The epic's first real unattended run: a `J1` task executed headless inside the recorded envelope with **no confirmation**, and a **seeded** `J2` parked with its unblock condition — the seeded control D5 requires, not a naturally occurring one. The ten-dimension `approval_envelope:` was recorded in frontmatter, pinned, and consumed with no repeated J0/J1 confirmation. Every claim was verified **against artifacts rather than the run's own report**: the commit, its window, `check-authority.sh`'s `1 park, 0 execution, 0 owner-ruling`, and zero commits touching the parked task's Layers. **§ Closed-when 1 deliberately NOT ticked** — the run itself ended at `AUTHORITY_BOUNDARY` correctly, but the launcher's reaper simultaneously published a false `PLAN_EXHAUSTED` into a different sprint's log and `check-night-run-rollup.sh` **passed it**, so "a run ends only at one of five named states" is not yet true of what a run *reports* (**TD-112** · `TASK-303`). **T1 first, and it missed its stated target — recorded as missing it.** The 83s cut was not achieved; what it bought instead was Round 8's finding that the gate's cost is **host-dependent** (1.92–2.20× on byte-identical code), so TD-090's re-raise condition was restated as reproducible arithmetic against a pinned anchor rather than a wall-clock figure, and a Tier G coverage hole was closed — the engine's git-availability branch had *zero* discriminating coverage in either direction, and now has 15 assertions that redden in disjoint sets. **The sprint's durable output is the map**: five independent foreclosures stood between a promoted Plan and an executed one — an all-`HITL` Plan (L-111), pre-flight item 3 versus a declared `J2` (**TD-109**), `sprint-bulk` step 0's unanswerable "which sprint", the launcher's green-gate catch-22 (**TD-110**), and midnight index staleness (**TD-111**) — and **not one was found by reading the procedure**. An independent reviewer then found the author's own reasoning defect in the D4 ruling (2 of 3 cited mechanisms overclaimed), so D4 is recorded as a judgement between two defensible readings and routed to `TASK-306` rather than inherited as precedent. L-175 · L-176 · L-177 · L-178 · L-179 filed. |
| [SPRINT-090](../sprint/archive/SPRINT-090-run-evidence-vehicle.md) | Run-Evidence Vehicle | **closed** 2026-08-27 — 6 of 6 DoD | **Contributed the vehicle itself**, seeded per `TASK-301` because SPRINT-088's Plan was entirely `HITL` and pre-flight forbids a run against one — and re-declaring real work AFK to make a run fire would have been reshaping a task to dodge a gate. One honestly AFK/`J1` task and one honestly `J2` task, disjoint by design so the park could not block the execution. Both resolved as intended: `T1` ran unattended and committed `docs/research/logs/qa-gate-timing.md` § Round 9; `T2` parked. **Its own history is the evidence for TD-109/110/111**: `T1` had to be rewritten mid-sprint because its first form repaired a gate FAIL, and the launcher refuses to fire on a red gate — so the run could not start until the work it existed to do was already done. The replacement had to be **gate-neutral**, a property measured by probe rather than argued. The run then parked its own close on a red system-verify caused by midnight staleness, exactly as `repair-policy: none` requires — the contract holding on a case outside its authors' design. |
| [SPRINT-093](../sprint/SPRINT-093-close-the-autonomy-guard-gap.md) | Close the Autonomy Guard Gap | **active** — promoted 2026-08-29 | _(completed at close)_ Targets § Closed-when **1**, open since SPRINT-089 for one reason: the reaper published a **false `PLAN_EXHAUSTED`** into a *different* sprint's log and `check-night-run-rollup.sh` **PASSED it**, because it asserts the terminal line's SHAPE and never its AGREEMENT with the per-task lines beside it (**TD-112** · **L-178**). T1 teaches the checker agreement and the reaper which Plan it was pointed at — Tier G twice over, since the reaper *produces* the field the checker reads, and L-174 records this exact asymmetry shipping a defect once already when fixtures were written for the derivation while the bug moved upstream; the retained fixture is therefore the **real committed SPRINT-089 artifact** (L-166). T2–T4 clear the three smaller foreclosures found alongside it, which between them can refuse a night run outright: a knowledge index that goes stale on the passage of time alone (**TD-111**, a daily false FAIL that becomes a refused launch), the launcher's green-gate precondition living only in `night-run.sh:339` where the checklist's reader never meets it (**TD-110** · L-151), and pre-flight item 3's wording against a declared `J2` (**TD-109**) — where **SPRINT-090's D4 is explicitly NOT inherited**, its justification having been corrected in two of three parts. **Every task is `authority: J2` and two are `class: decision`**, so this Plan is deliberately not a night-run candidate: an unattended run would park 4 of 4. Runs as the `autonomy` stream, concurrently with EPIC-014's `engine` stream. |

_First member sprint promoted 2026-08-26._ The freeze amendment that blocked it
**closed 2026-08-25** (§ Open questions), so this epic is admissible. Its other condition — sequenced
after **SPRINT-083** so the two epics do not contend for `skills/orchestrator/**` and `scripts/` in the
same window — is also met: SPRINT-083 closed 2026-08-24. The gate was set at that sprint, **not** at
EPIC-014's close, so running as a **second stream alongside EPIC-014 is admitted**. The one genuinely
shared file is `.claude/CONTEXT.md` (this epic rewrites § Modes and § Unattended; EPIC-014 touches
§ Sprint model at cutover) — it takes a single owner and a commit order at G2, never a parallel build.

## Decisions

- **D1** — **V3 supersedes SPRINT-082's freeze** (owner ruling 2026-08-24). **Binding since
  2026-08-25**, when the amendment was written into `adlc-epic-sequencing.md` § *The core execution
  architecture is FROZEN*. The freeze re-arms after V3 §56's dogfoods, never at this epic's promote —
  which is why re-arming is the last § Closed-when condition rather than an assumption.
- **D2** — **H32/H33/H34 are shipped, not re-opened.** They are verified by SPRINT-082's retained
  fixtures and re-exercised by V3 §56's dogfoods. Re-implementing them would create a second definition
  of risk beside the classifier SPRINT-082 T1 defined — the second SSOT LAW 4 forbids.
- **D3** — **J2 stays human, and absence is never consent.** Headless has no ask channel; a missing
  channel, a denial or a timeout is a BLOCK, never a default-yes, and never reasoned out by the run
  (`orchestrator/references/night-run.md` Part 0). This epic widens what J1 may do; it does not narrow
  J2.
- **D4** — **Every new autonomy behaviour is ADR-029 Tier G.** A false negative in a continuation
  contract, an authority classification or a park is silent by construction: the run reports success and
  the omission leaves no trace. Retained must-FAIL fixture + sibling control + a seeded-break
  discrimination proof, per task.
- **D5** — **The seeded J2 control is required, not a fallback.** V3 §56 Dogfood 2 asks for one J2 park
  *or* a seeded control; a natural park cannot be scheduled, and TASK-188 is the standing evidence that
  waiting for one to occur foreclosed the criterion once already (L-111). Seed it.
- **D6** — **Coordinates with EPIC-014 at the QA-profile boundary.** V3 §23 routes final integration to
  a `STANDARD` System Verify — a profile EPIC-014 H17 defines. Until it exists, this epic's System
  Verify step names today's `sh scripts/qa-check.sh` and is re-pointed at cutover, never forked.

## Open questions

- ~~**The freeze amendment**~~ — **CLOSED 2026-08-25.** The unblock condition (`git status` shows
  `adlc-epic-sequencing.md` clean) was met once SPRINT-082's close committed; the amendment is written
  into that file's § *The core execution architecture is FROZEN*, recording that V3 supersedes the
  freeze for V3's execution-autonomy scope only, and that it re-arms after V3 §56's two dogfoods.
  **This epic is now admissible** — the first member sprint is no longer gated on it.
- **Does `overnight` become the canonical mode name in `spec/STANDARD.md`, or only in the skills?** →
  a **judgement call, closed by ruling** (L-094) at the first member sprint's G2 — ADR-grade only if it
  adds a §2 row.
- **What is the repair budget?** V3 says "bounded" and SPRINT-082 kept exactly one retry. Whether
  unattended repair inherits that ceiling or earns its own → a **measurement** (L-094): it accumulates
  from EPIC-006's records. Do not freeze a number before they exist (L-130).
- **Does the run-outcome vocabulary belong to this epic or to EPIC-008's Run Protocol?** V3 §11 says
  build only what hardening needs and that EPIC-008 still owns the portable protocol. → ruled at the
  member sprint that ships H37, so the two do not mint competing `RunSummary` shapes.

## Closed when

- [ ] `sprint-bulk` does not pause between already-authorized tasks, and a run ends **only** at
      `PLAN_EXHAUSTED` · `AUTHORITY_BOUNDARY` · `HARD_FAILURE` · `BUDGET_STOP` · `USER_STOP`
- [x] **`overnight` is the canonical mode name**, discoverable in `/orchestrator` and `/flow`, with
      `night-run` · `unattended` · `sprint-bulk unattended` resolving to it as aliases
- [x] **J0 / J1 / J2 are declared per task**, J1 executes unattended inside the approved envelope, and a
      **J2 parks** — proven by a *seeded* J2 control, not only by a naturally occurring one (D5)
- [x] **One recorded pre-launch approval** covers goal · scope · acceptance · design · verification · J1
      delegation · capabilities · repair policy · budget · stop conditions, with no repeated J0/J1
      confirmation during the run
- [ ] **Bounded unattended repair runs**: a concrete J1 critic finding → repair → re-review → continue,
      with the retry ceiling still exactly what ADR-022 admits
- [ ] Every run emits `DELIVERED` / `PARTIAL` / `FAILED` **plus** DoD, tasks attempted/completed, parks,
      repair cycles, verification state, warnings and terminal reason
- [ ] **Dogfood 1** (continuous attended `sprint-bulk`, no per-task confirmation) and **Dogfood 2**
      (overnight with ≥1 J1 decision, ≥1 repair, and a J2 park or seeded control) both ran on this
      repository, each naming what proved it
- [ ] **The freeze is re-armed** in `adlc-epic-sequencing.md` after the dogfoods pass (V3 §58) — this
      epic does not close leaving the execution architecture unfrozen
