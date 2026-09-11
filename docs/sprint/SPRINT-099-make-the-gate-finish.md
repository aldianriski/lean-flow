---
sprint: 099
slug: make-the-gate-finish
owner: Maintainer
last_updated: 2026-09-12
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-099 — Make the Gate Finish

> **Theme:** The gate not finishing is now the most reliable blocker in this loop. SPRINT-096 closed
> under an ADR-021 override after a memory kill; SPRINT-098 closed under one after **three of six**
> attempts died. Two consecutive closes have rested on targeted evidence because the instrument that
> should decide them could not speak. This sprint does not make the gate faster — it makes a
> truncated run *say so*, and replaces three sprints of inference about why it dies with one
> measurement. `TD-143`'s own **Re-file fresh if** condition asks for exactly that.

## Scope

**In:**
1. The gate's memory profile **measured**, so a kill is a known mechanism rather than an inference
   carried across four sprints (TASK-344 · TD-143's cost half).
2. Truncation reported as an outcome **distinct from failure**, naming the elapsed seconds and every
   leg and harness it did not reach (TASK-329 · TD-117 · TD-128).
3. The `*/archive/*` exclusion made a **filesystem-identity** predicate rather than a case-sensitive
   string glob, at all three call sites under one shared predicate (TASK-342 · TD-145).

**Out (deferred):**
- **Making the gate FASTER.** Speed is a separate, unfiled concern. T2 fixes the report, because the
  report is what is lying; `TD-117`'s "cap dispatch concurrency" option is explicitly rejected at
  intake — it would slow the worktree-isolated review this repo mandates for Tier G.
- **EPIC-015 § Closed-when 1.** `TASK-319` + `TASK-188` stay paired in the Backlog for a third sprint.
  The run needs a recorded ten-dimension envelope *and* a host that can finish a gate; this sprint is
  the second half of that precondition.
- **`TD-152` and `TD-153`** — the limits qualifying § Closed-when 5 and 6. Both fixes are new Tier G
  surfaces (a retry-firing choke point; a machine-only sidecar plus a cross-file guard), not patches.
- **`check-qa-budget-default.sh`.** Correct within its declared scope. TD-128 is a *missing reader*,
  not a broken checker — do not "fix" it by widening that script (T2 DoD 3).
- The rest of the gate-accuracy cluster (`TASK-338` · 339 · 340 · 341 · 343) — see **D4**.

## Plan

### T1 — Measure the gate's memory profile, so a kill is a known mechanism `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `scripts/qa-check.sh` (instrumentation only) · `docs/research/` (a measurement record)
Depends-on: none
Cites: TD-143 · TD-090 · TD-117 · L-091 · L-094
Four kills are now on record — three in SPRINT-098 alone, one in SPRINT-096 — and every account of
*why* is inference. TD-143's row says so itself: its **Re-file fresh if** condition is that the profile
be measured, so the mechanism is known rather than read off three artifacts that merely look alike.
A measurement is the class of fact that closes this and it accumulates, so it is deferrable without
being parked forever (L-094).

**Acceptance:** A committed measurement record states where the gate's memory actually goes, derived
from instrumented runs rather than from the shape of the kills.

**DoD:**
- [ ] Instrumentation lands in `scripts/qa-check.sh` and is **off by default** — a measurement harness that changes the default profile has changed the thing it measures.
- [ ] At least **three** instrumented runs, and the record says how many completed and how many were killed. A profile built only from runs that survived is a profile of the survivors.
- [ ] The record names **where** the memory goes — per-leg or per-harness, not a single total. A total reproduces the inference this task exists to replace.
- [ ] **A1 is tested, not assumed:** whether the four recorded kills share one mechanism. If the measurement says they do not, that is the finding and it is recorded as such.
- [ ] TD-143's Mitigation line is **not** carried in as a plan — it is the filer's hypothesis, written while the cost was being felt (L-091). Re-derive before building on it.
- [ ] The record lands in `docs/research/` with an ownership header, and `TD-143` is updated to point at it.

### T2 — Make truncation a distinct outcome from failure `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` (the `qb_checkpoint` truncation path **and** the § Summary block — the two places that print the verdict) · `scripts/lib/qa-budget-check.sh` · `evals/run-qa-budget-fixtures.sh` · `evals/fixtures/qa-budget/`
Depends-on: T1 — **D1** (shared `scripts/qa-check.sh`)
Cites: TD-117 · TD-128 · TD-084 · TD-091 · L-120 · L-166 · ADR-029 · `scripts/lib/check-qa-budget-default.sh` (named in DoD 3 as explicitly NOT widened — cited, never touched) · `evals/run-s2-placement-fixtures.sh` (where the real checkpoint tripped; read as the motivating condition, never modified)
**Tier G** (ADR-029) — a skipped harness is an **unrun** guard, and the run still prints a verdict in
the same shape a completed run prints. The gate cannot currently report on itself: truncation and
failure are byte-indistinguishable, which is how six skipped harnesses went unnoticed, two of them
guards of the gate itself. The fix direction is **ruled at intake** (**A2**), not re-opened here.

**Acceptance:** A reader distinguishes *completed-and-passed*, *completed-and-failed*, and *truncated*
from the printed verdict line alone — never from a wrapper's exit code.

**DoD:**
- [ ] A run that trips the budget checkpoint no longer prints the same verdict shape a genuinely-failing run prints.
- [ ] The truncation verdict names the **actual elapsed seconds** and **every** leg or harness it did not reach, **enumerated by name** — today the message names none.
- [ ] The **actual** runtime is asserted against the ceiling (TD-128's half, a missing *reader*). `scripts/lib/check-qa-budget-default.sh` is not widened.
- [ ] The three outcomes are distinguishable from the printed line alone (L-120). — *Verify: `sh evals/run-qa-budget-fixtures.sh`*
- [ ] Retained must-FAIL + sibling control: a seeded checkpoint trip reports truncation and names its unrun harnesses, while a genuinely-failing run in the same suite still reports FAIL (L-058 · L-142).
- [ ] **Pointed at the motivating condition, not fixtures alone (L-166):** reproduce TD-117's measurement — a run under concurrent worktree agents, or a checkpoint seeded to trip where the real one tripped (`evals/run-s2-placement-fixtures.sh`) — and show the same six harnesses named.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention; a landed, targeted seed that reddens nothing is reported **untested**, never scored as a pass (L-137 · L-142 · L-169 · L-187).
- [ ] **Outside reviewer, worktree-isolated** (L-165 · L-168), after the author enumerates every call site touched and seeds a break in each fix (L-193).
- [ ] **The new harness is registered** in `eval_harnesses_always`/`_optin`/`_excluded`, verified **from the registry's side** — enumerate the registry against `evals/`, never confirm by running the new thing (L-196).

### T3 — Make the `*/archive/*` exclusion a filesystem-identity predicate `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-layers-completeness.sh` · `evals/fixtures/` + its harness
Depends-on: none — disjoint from T1/T2 (**D2**)
Cites: TD-145 · TD-151 · L-186 · L-165 · L-168 · ADR-029
**Tier G** (ADR-029) — this is the **set predicate itself**, not a branch inside one. Three gate
checkers depend on it to keep closed sprints out of their examined set, and SPRINT-098's A1
grandfathering ruling explicitly inherits its defect.

**Acceptance:** `docs/sprint/Archive/…` and `docs/sprint/archive/…` — the same file on this host,
inode `5910974512661248` — are excluded identically.

**DoD:**
- [ ] The case-variant path is excluded. Today `case "$sp" in */archive/*)` returns `NOT-EXCLUDED` for it, and feeding that path to `scripts/lib/check-layers-completeness.sh` produces **3 real FAILs against a closed sprint's stale content**.
- [ ] **All three sites** fixed under **one shared predicate**, not three copies — `scripts/lib/check-layers-observed.sh:344` and `:401`, `scripts/lib/check-layers-completeness.sh:183`. **Derive the set yourself before editing** (L-186): the review that found this named two, and the third surfaced from an independent grep at merge.
- [ ] A retained must-FAIL varying path **casing** as its selection axis, plus a lowercase sibling control green in the same run. The existing `archive-path-excluded` fixture **passes** and proves nothing here — it validates a *string* predicate where the real job is *filesystem identity*.
- [ ] **Seeded-break discrimination proof** under ONE stated hash convention (L-169 · L-187).
- [ ] **Outside reviewer, worktree-isolated** (L-165 · L-168).

## Owner-action checklist
<!-- none this sprint: no unattended run, no external credential, no envelope. -->

## Decisions (pre-locked)
- **D1 — `scripts/qa-check.sh` is owned T1 → T2.** Measure before changing the thing measured: T2 edits the verdict path T1 is instrumenting, and the reverse order would profile a file that no longer exists. Stage per-hunk and verify `git diff --cached`; never a plain `git add` over the other's WIP (L-042 · L-037).
- **D2 — T3 is disjoint** (different files, no `depends-on`) and is therefore eligible for a **parallel worktree-isolated build** alongside T1/T2, at the coordinator's discretion.
- **D3 — T2's fix direction is ruled, not open.** TD-117 offers three options and rules none; the third (make the skipped-harness list its own named outcome) is chosen. Capping dispatch concurrency would slow the worktree-isolated review this repo mandates for Tier G, and rests on a concurrency figure nobody has measured; raising the budget cannot work, since the 600 s ceiling is external and `qa-check.sh:27` already calls the current 520 *"NOT a permanent figure"*.
- **D4 — `TASK-342` is promoted APART from its cluster, deliberately.** Its `grouped:` line says schedule it with `TASK-338` (SPRINT-097 T1's ruling). It is pulled forward because `TD-151` and SPRINT-098's A1 grandfathering ruling **both already inherit its defect**, so leaving it costs correctness in two shipped guards. The cluster ruling is not withdrawn — `TASK-338` · 339 · 340 · 341 · 343 stay grouped for a later sprint.
- **D5 — T1 is `J2`, T2 and T3 are `J1`.** T1 produces a *record that a later sprint will act on*, which is a judgement; the Plan is deliberately not all-J2.

## Assumptions
- **A1** — That the four recorded gate kills share one mechanism. **UNCONFIRMED, and T1's measurement is what tests it** — it is the task's subject, not its premise. *Confirm: T1's instrumented runs; a negative result is a finding, not a failure.*
- **A2** — T2's fix direction is settled at intake (**D3**) and is not re-opened at G2. *Confirm: read `TASK-329`'s `assumes:` block before designing.*
- **A3** — **TD-117's quoted 450 s default is STALE**; `qa-check.sh:27` has read 520 since SPRINT-093. *Confirm: re-derive at build and quote neither figure from a row (L-130).*
- **A4** — The `*/archive/*` predicate has exactly three call sites. Two were named by review, the third found by an independent grep. *Confirm: derive the set before editing, do not inherit this count (L-186).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-099-make-the-gate-finish.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014). **Do not paste a `### <date> | run-complete | …` header at line start into
> that file** — it arms `check-night-run-rollup.sh`, which parses it (L-197, learned the hard way at
> SPRINT-098).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** —

**Cost** —

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
