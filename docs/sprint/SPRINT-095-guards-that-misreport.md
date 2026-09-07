---
sprint: 095
slug: guards-that-misreport
owner: Maintainer
last_updated: 2026-09-07
status: active
plan_commit: 2453678
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-095 — Guards That Misreport

> **Theme:** SPRINT-094 shipped guards for properties that had **no reader at all**. This sprint is
> the adjacent failure: four guards that *do* read their subject and then **report something the
> artifact contradicts** — a closed sprint's commits attributed to a sibling, a dependency graph
> invented out of prose, a DoD claim nobody reconciles against the ticks, and a truncated run wearing
> the verdict shape of a completed one. A property with no reader cannot go red; a guard that
> misreports goes *green*, which is worse, because the green is evidence.

## Scope

**In:** the archived-sibling attribution fix that unblocks three parked sprint archivals · the
dispatch preflight's `Depends-on:` parser, which ships to consumers inside the plugin · a reconciler
for a commit's claimed DoD delta against the ticks it made · truncation as an outcome distinct from
failure, closing both remaining `severity: high` debt rows.

**Out (deferred):** the SPRINT-092/093/094 **archival itself** — `TASK-298` removes its blocker, the
move stays owner-gated (§11, re-proposed at the next close) · the gate's **speed** under concurrent
load — T4 fixes the report, not the runtime, and the cap-concurrency and raise-the-budget directions
were both rejected on evidence · EPIC-015's run-dependent tasks (`TASK-319`/`296`/`297`), which need
a real unattended run and are the next sprint's shape, not this one's · the three §2 soft-cap
breaches, routed to the next close.

## Plan

### T1 — Keep an archived sprint owning its own commits `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-layers-observed.sh` (the `sibling_sprints` build at :392-402 and the
per-commit skip at :428-431) · `evals/fixtures/layers-observed/**` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none
Cites: TD-125 · TASK-298 · TASK-299 (the shipped half) · L-166 · L-058

One list is answering two different questions. `:397` drops `*/archive/*` when building
`sibling_sprints`, and `:430` uses that list to skip another sprint's commits — so *is this sprint
still active work?* (archive = yes, exclude) and *does it own its commits?* (archive = irrelevant, a
closed sprint owns its history forever) share one answer. First, because three sprint archivals are
parked behind it.

**Acceptance:** SPRINT-092 and SPRINT-093 can both be moved to `docs/sprint/archive/` with the gate
staying green, and a path declared by no sprint still FAILs by name.

**DoD:**
- [ ] The two questions are separated — archival no longer removes a sprint from the commit-ownership list — *Verify: `sh scripts/lib/check-layers-observed.sh` over a tree with 092/093 archived*
- [ ] Reproduced on the **real 092/093 pair**, not fixtures alone (L-166): green in place AND green archived. TD-125 measured 214 pass/0 fail in place vs 202 pass/1 fail archived; **the pass count is the signal that matters** — it fell because twelve checks stopped being invoked, and a guard that stops being *invoked* is invisible in a red/green summary — *Verify: reconcile BOTH numbers, not the FAIL count alone*
- [ ] Retained fixture: an archived sprint's commits do not land on an active sibling — *Verify: `sh evals/run-layers-observed-fixtures.sh`*
- [ ] Sibling control in the same run: a path declared by NO sprint still FAILs with its named finding
- [ ] Seeded-break discrimination proof — seed verified landed, artifact still parses, break targeted not demolition, and a landed seed reddening nothing reported as untested (L-137 · L-142 · L-187), all under ONE stated hash convention (L-169)
- [ ] Worktree-isolated outside reviewer (L-165 · L-168 — Tier G, and the reviewer *writes*, so it must not share this tree)

### T2 — Anchor the dispatch preflight's `Depends-on:` parser to the id list `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` (the `<!-- dispatch-preflight:start/end -->`
snippet — the `"Depends-on:"*)` arm AND the indented `D)` continuation arm) ·
`evals/run-dispatch-preflight-fixtures.sh` · `evals/fixtures/dispatch-preflight/**`
Depends-on: none
Cites: TD-132 · TD-043 · TASK-328 · L-058 · L-166

The parser greps `T[0-9]+` as a bare substring over the whole line, so it harvests ids out of the
field's own explanatory prose and ignores the literal `none`. The false HALT is the harmless half;
the false `PASS shared-file-owned` issued off a phantom edge is the one that green-lights a wave with
no ownership order. It ships to consumers, and `orchestrator/SKILL.md` § sprint-bulk step 3 tells
every run to execute it.

**Acceptance:** SPRINT-094's own sprint file — where all four tasks declare `Depends-on: none` —
computes clean waves instead of an unresolvable self-edge.

**DoD:**
- [ ] Against SPRINT-094's sprint file the snippet yields `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and no `FAIL cycle-detected` — *Verify: run the anchor-extracted snippet against that file; today it yields `FAIL cycle-detected: tasks unresolved -> T2 T3`*
- [ ] A literal `none` short-circuits the field, and no id is harvested from it or from any line continuing it
- [ ] **Both call sites fixed, each with its own fixture** — the field arm and the indented `D)` continuation arm run the same bare grep, and SPRINT-094's prose ran onto continuation lines, so fixing one leaves the other leaking (L-058)
- [ ] Declared ids still parse: `Depends-on: T1 · T2 — but see **D1** (…)` yields exactly `[T1,T2]`
- [ ] Retained must-FAIL + sibling control added to the existing 8-case harness — *Verify: `sh evals/run-dispatch-preflight-fixtures.sh`*
- [ ] Seeded-break discrimination proof under ONE stated hash convention (L-137 · L-142 · L-169 · L-187)
- [ ] Worktree-isolated outside reviewer (L-165 · L-168)

### T3 — Reconcile a commit's claimed DoD delta against the ticks it made `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/lib/` (a new checker) · `scripts/qa-check.sh` (a leg + the always-on eval list) ·
`evals/fixtures/` + its harness
Depends-on: none — but **T3 commits to `scripts/qa-check.sh` before T4** (D1)
Cites: TASK-326 · SPRINT-094 Execution Log · L-009 · L-165

Nothing compares what a commit *claims* it did to what it *did*. `6a6aeac` claimed "5 of 6 DoD" and
flipped three boxes, two belonging to other tasks; every downstream signal stayed clean and it
survived a worktree-isolated review an hour later, because that reviewer read the script it was told
to read.

**Acceptance:** `6a6aeac` is reported by name, and a commit whose claim and ticks agree is not.

**DoD:**
- [ ] A `sprint(NNN)` commit's claimed DoD figure is reconciled against the `[ ] → [x]` transitions that commit made, FAILing by name on disagreement — *Verify: the new checker over this repo's history*
- [ ] The **unattributed-tick** case is covered: a commit flipping a DoD outside the tasks whose `Layers:` it touched. **If the claim proves unparseable, scope narrows to this half and says so** — it is the half carrying the real defect
- [ ] Retained must-FAIL: SPRINT-094's `6a6aeac`. Sibling control: an agreeing commit, green in the same run — *Verify: the fixture harness*
- [ ] The claim's parseability is **re-derived by sampling real `sprint(NNN)` subjects**, not assumed from the task's own line (L-097 · L-130)
- [ ] Seeded-break discrimination proof under ONE stated hash convention
- [ ] Worktree-isolated outside reviewer (L-165 · L-168)

### T4 — Make gate truncation a distinct outcome from gate failure `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` (the `qb_checkpoint` truncation path and the § Summary block) ·
`scripts/lib/qa-budget-check.sh` · `evals/run-qa-budget-fixtures.sh` · `evals/fixtures/qa-budget/**`
Depends-on: T3 — **not for its logic, but for its harness** (D1): T4 must enumerate every harness it
fails to reach, and a harness T3 adds afterwards would be absent from that enumeration
Cites: TD-117 · TD-128 · TASK-329 · TD-084 · TD-091 · L-120 · L-166

`qb_checkpoint` calls `bad`, prints `QA-CHECK: <n> pass, <m> fail` — the same shape the Summary block
prints — and exits 1. Truncation and failure are therefore indistinguishable to any reader, and the
skipped legs are described in prose without one being named. Six harnesses went unnoticed that way,
two of them guards of the gate itself.

**Acceptance:** a budget-tripped run announces truncation, names every harness it did not reach, and
cannot be mistaken for either a pass or a fail.

**DoD:**
- [ ] A budget-tripped run no longer prints the verdict shape a genuinely-failing run prints — *Verify: the seeded-trip fixture's output vs a seeded-FAIL sibling*
- [ ] The truncation verdict names actual elapsed seconds **and enumerates every unreached leg/harness by name** — today the message names none
- [ ] Actual runtime is asserted against the ceiling (TD-128's half). **Out of scope: `check-qa-budget-default.sh` is correct within its declared scope** (configured default < ceiling) — this is a *missing reader*, not a broken checker, and widening that script is the wrong fix
- [ ] The three outcomes are distinguishable off the printed verdict line alone, never a wrapper's status (L-120)
- [ ] Retained must-FAIL + sibling control: a seeded trip reports truncation and names its unrun harnesses while a genuinely-failing run still reports FAIL — *Verify: `sh evals/run-qa-budget-fixtures.sh`*
- [ ] Pointed at the motivating condition, not fixtures alone (L-166): reproduce TD-117's measurement — concurrent load, or a checkpoint seeded to trip at `run-s2-placement-fixtures.sh` — and show the same six named
- [ ] Seeded-break discrimination proof under ONE stated hash convention
- [ ] Worktree-isolated outside reviewer (L-165 · L-168)

## Owner-action checklist

- [ ] Rule on the SPRINT-092/093/094 **archival** once T1 lands — parked at three consecutive closes, lossy, and close never self-approves it (§11). 092 and 093 share `plan_commit: c52496f`, so archive them **together** or measure again.

## Decisions (pre-locked)

- **D1 — `scripts/qa-check.sh` is shared by T3 and T4; T3 owns it first.** Not an arbitrary
  tie-break: T4's enumeration clause must name every harness, so it has to be written *after* T3 has
  added its leg — the reverse order ships T4 blind to a harness added minutes later, which is L-020's
  shape inside one sprint. Stage per hunk, never a plain `git add` over the other task's WIP
  (L-042 · L-037).
- **D2 — T4 fixes the report, not the runtime.** TD-117 offered three directions and ruled none;
  the other two were rejected on evidence at the 2026-09-07 decompose — capping dispatch concurrency
  slows the worktree-isolated review this repo mandates for Tier G and rests on an unmeasured figure,
  and raising the budget cannot work because the 600 s ceiling is external. Speed remains a separate,
  unfiled concern. **Not ADR-grade** — reversible, and it settles one debt row rather than a
  repo-wide trade-off.
- **D3 — the `Depends-on:` parser tolerates prose rather than the field being linted down to bare
  ids.** The field demonstrably carries reasoning; the alternative makes every existing sprint file
  non-conforming to buy a simpler grep.
- **D4 — all four tasks are Tier G (ADR-029), declared here, not inferred.** Each is a guard whose
  false negative is silent by construction, so each carries the retained fixture, the sibling
  control, the seeded-break discrimination proof, and the worktree-isolated outside reviewer.

## Assumptions

- **A1** — TD-125's reproduction still holds at this HEAD (214 pass/0 fail in place vs 202 pass/1
  fail archived). *Confirm: re-run the archive experiment at T1 before designing; both numbers, not
  the FAIL count alone.*
- **A2** — the `Depends-on:` defect has two call sites. *Confirm: already read at the 2026-09-07
  decompose — the field arm and the indented `D)` arm run the same bare `grep -oE 'T[0-9]+'`. Not
  inherited from TD-132, whose Location line names only the field arm.*
- **A3** — `6a6aeac` is a usable must-FAIL fixture, and the `N of M DoD` claim is parseable from
  subjects this repo already writes. *Confirm: sample real `sprint(NNN)` subjects at T3; if not
  reliably parseable, narrow to the unattributed-tick half and say so.*
- **A4** — TD-117's concurrency measurement is reproducible on this host. *Confirm: at T4. If it is
  not, the seeded-checkpoint path is the fallback vehicle and the DoD says which was used.*
- **A5** — no task here belongs to an open epic, so no `epic:` rollup is owed. *Confirm: checked at
  promote — T1–T4 trace to TD-125, TD-132, SPRINT-094's close-Retro and TD-117/TD-128, none of which
  is an EPIC-015 member.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-095-guards-that-misreport.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
