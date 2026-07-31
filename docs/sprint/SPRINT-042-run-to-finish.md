---
sprint: 042
slug: run-to-finish
owner: Maintainer
last_updated: 2026-08-01
status: active
plan_commit: ccf1f07
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-042 — Run to Finish

> **Theme:** SPRINT-041's night run did everything right and delivered nothing. Two agents built,
> committed, and self-reviewed their work; then the merge-back was denied and both branches stranded.
> The blocker was never HITL — it was the shared landing path every unit funnels through, plus a Plan
> declaration that omitted a file both tasks edited and a preflight that cannot see an omission. This
> sprint makes a single unattended run able to *finish*, and replaces one cost datapoint with a series.

## Scope

**In:** the pre-flight allowlist recipe covers the commands a run needs to finish, not only the ones
its tasks need to work (T1) · a run's own cost and throughput recorded as first-class pre-flight and
rollup data, distinct from its tasks' verification cost (T2) · a gate leg that cross-checks a Plan's
declared `Layers:`/`Depends-on:` against what each task's DoD prose implies (T3) · TD-016's decided
split of the harness legs into always-on vs opt-in (T4).

**Out (deferred):** a **pre-decision register** — no run has ever parked on an emergent fork, and
`## Decisions (pre-locked)` already carries the case if one occurs; building for it now is the
speculative-section trap · a **6–8h sizing standard** — T2 produces the data it would need, and
writing it from a single datapoint is spec-only debt (L-007) · **TD-021** (`gen-index.sh`
non-atomic write) — filed, no forcing trigger · **TD-014** (night-run.md length) — trigger is a third
embedded snippet, and no task here adds one · **firing the proof night run** — it belongs to the next
sprint, because T1 is the fix that makes landing possible (D3).

## Plan

### T1 — Extend the pre-flight allowlist recipe to the run's terminal steps `[size: S · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/night-run.md` · `skills/orchestrator/references/dispatch.md`
Depends-on: none

L-072, promoted this promote. The recipe enumerates the commands *tasks* need and omits the ones the
*run* needs to finish. Because every unit funnels through one landing path, a denial there converts a
fully-successful run into zero delivered work — the asymmetry per-task risk assessment misses. Second
occurrence of the shape; the `/handoff` denial already recorded in Part 1 was the first. State a
derivation method rather than a copyable literal list: a list goes stale and leaks this repo's
commands into generic guidance (L-015).

**Acceptance:** taking SPRINT-041's four recorded denials as the test input, the documented derivation
method yields an allowlist covering every one of them — checked against the Execution Log, no paid run.

**DoD:**
- [x] Pre-flight covers the coordinator's landing path (integration-worktree creation · the no-ff
      merge · worktree removal/prune) and the git writes the always-on gate's own harnesses perform
      on throwaway repos — as a stated derivation method, not a literal command list
- [x] The reasoning is stated, not just the fix: the shared landing path is where a denial costs the
      whole run, so it is scoped harder than any per-task command
- [x] The two references no longer disagree — if dispatch prescribes a merge-back command, pre-flight's
      method reaches it
- [x] Verified against SPRINT-041's recorded denials: each one falls inside what the method derives
- [x] No new embedded shell snippet (TD-014's split trigger stays unfired — A3)

### T2 — Record a run's own cost and throughput as pre-flight and rollup data `[size: S · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/night-run.md` · `skills/lean-doc-generator/templates/SPRINT.md.template`
Depends-on: T1

L-073. "Zero API cost" at SPRINT-041's promote was true of the tasks' verification and false of the
run, which spent $6.60 on two ~25-line changes. Two unrelated budgets in one reassuring phrase is what
let the number land as a surprise afterwards instead of as an input to firing. One datapoint is not a
budget — the fix is to start a series, not to write a sizing rule on top of a single row.

**Acceptance:** pre-flight states the run's own expected cost on a line distinct from its tasks'
verification cost, and the morning rollup carries actual cost · turns · wall-clock · units completed,
with SPRINT-041's figures present as the first calibration row.

**DoD:**
- [x] Pre-flight carries the run's own expected cost as its own line, explicitly not the tasks'
      verification cost
- [x] The morning rollup format carries actual cost · turn count · wall-clock · units of work completed
- [x] SPRINT-041's recorded figures ($6.60 · 15 turns · coordinator + 2 worktree agents · 2 tasks) are
      entered as the first calibration row
- [x] The format states plainly that one row is an estimate, not a budget
- [x] If cost is not observable from the harness result output, the row degrades to the observable
      fields and **says so** rather than omitting the line (A1)
- [x] Shares `night-run.md` with T1 — lands after it, per D2

### T3 — Cross-check a Plan's declared Layers against what its DoD implies `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `docs/QA.md` · `evals/run-layers-completeness-fixtures.sh` · `TECH-DEBT.md`
Depends-on: none

TD-020 · L-071. The preflight's shared-file check is sound and negative-tested; its *input* is an
author's memory at promote time, and a gate reading a manifest cannot detect an omission from that
manifest, because omission looks identical to absence. SPRINT-041 is the proof: both tasks' DoDs
required marking a TD resolved, neither declared the debt ledger, the check passed, and the parallel
edits merged clean by ~19 lines of luck. Fails toward over-reporting by design — a false positive
costs a glance, the current false negative costs a corrupted merge.

**Acceptance:** run against SPRINT-041's Plan reconstructed as a fixture, the gate FAILs naming the
debt ledger as required-by-DoD but absent from `Layers:`; run against this sprint's own Plan, it passes.

**DoD:**
- [ ] For each task block in an active sprint's Plan, the gate reports any file named in that task's
      DoD/Acceptance prose but absent from its `Layers:`
- [ ] Same treatment for a dependency the prose implies but `Depends-on:` omits
- [ ] Leg follows the existing text-lint idiom (`ok`/`bad` helpers, named finding, never a bare FAIL)
- [ ] **Negative-tested per check**, each failing with its own named finding, with **SPRINT-041's Plan
      reconstructed as the must-FAIL fixture** — a real recorded miss, not an invented one. Run bare,
      never piped (L-057)
- [ ] Fixtures **retained** in the eval set, not deleted with the scaffolding that built them (L-058 ·
      TD-012's lesson)
- [ ] Green on this sprint's own Plan, whose `Layers:` were written to be complete (D4)
- [ ] `docs/QA.md` leg inventory updated; TD-020 marked `status: resolved → SPRINT-042 T3`

### T4 — Split the harness legs into always-on and opt-in (TD-016, option c) `[size: S · risk: med · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `docs/QA.md` · `TECH-DEBT.md`
Depends-on: T3

TD-016, decided at this promote because its written trigger fired: T3 lands the **7th** harness, and
the row named "a 7th harness" as the deciding condition (L-068 — a deferral with a written trigger is
answered when it fires, or it drifts toward never). The principled cut the row itself identified: the
snippet runners guard **shipped** `skills/**` text, which is what a consumer receives, so they stay
always-on; the selftests guard maintainer-only assertion scripts, so they move behind an opt-in flag.
`risk: med` because this *removes* checks from the always-on path — the failure mode is a guard
silently no longer running.

**Acceptance:** a bare gate run no longer executes the selftests and reports the reduced runtime; the
opt-in flag runs the full set; a deliberately broken guarded snippet still FAILs the bare run.

**DoD:**
- [ ] Snippet runners stay always-on; selftests run only under the opt-in flag
- [ ] The bare gate still FAILs on a deliberately broken **shipped-text** guard — verified, then reverted
- [ ] The opt-in flag runs the full set and still FAILs on a broken maintainer-only assertion — verified
- [ ] The always-on/opt-in split is stated in `docs/QA.md` beside the existing manual/gated boundary,
      so what no longer runs by default is discoverable rather than silently dropped
- [ ] Runtime before/after recorded — the number is TD-016's whole subject
- [ ] TD-016 marked `status: resolved → SPRINT-042 T4`

## Decisions (pre-locked)

- **D1** — TD-016 resolved as **option (c)** at this promote, not deferred a fourth time. Its written
  trigger (a 7th harness) is exactly what T3 lands, so the decision is made before the harness arrives
  rather than after (L-068).
- **D2** — **Single-owner order, declared up front.** `night-run.md`: T1 → T2. `qa-check.sh` ·
  `docs/QA.md` · `TECH-DEBT.md`: T3 → T4. Both pairs carry a `Depends-on:` edge, so the preflight's
  shared-file check resolves them rather than reporting an unowned overlap.
- **D3** — **This sprint runs interactively, not unattended.** T1 is the fix that lets a night run land
  its work; executing this sprint unattended would depend on the very thing it ships. The proof-run is
  the next sprint, fired once T1 has shipped.
- **D4** — `Layers:` on every block here was written to include files implied by the DoD — notably the
  debt ledger on T3 and T4. Deliberate: it is the omission T3 exists to catch, and this Plan is T3's
  must-PASS input.

## Assumptions

- **A1** — A headless run can observe its own cost from the harness result output. *Confirm: T2's
  degrade-path DoD line — if it cannot, the row drops to observable fields and says so.*
- **A2** — T3 lands the 7th harness, which is the count T4's split is sized against. *Confirm: harness
  count at T3 completion, before T4 starts.*
- **A3** — T1 and T2 grow `night-run.md` with prose only, so TD-014's split trigger (a third embedded
  snippet) stays unfired. *Confirm: T1's final DoD line + a line-count check at T2.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan. -->

### 2026-08-01 | sprint-bulk G1+G2 | signed off — sequential, shared tree, no worktrees
Batch G1 fast-path (T1–T3 arrived via decomposer `approve` this session; T4 signed off on the promote
checklist). G2 approved as designed.

**Worktree isolation ruled out on evidence, not preference.** The repo is 11 commits ahead of
`origin/main` and the sprint file does not exist there at all — every task appends to the Execution Log
and ticks DoD, so every agent would hit an add/add merge on it (dispatch.md's own corollary). Worse,
`scripts/qa-check.sh` on the remote predates SPRINT-041's leg 13, so a worktree agent editing it would
fork from a base missing the guard we just shipped. Shared tree, coordinator-owned commits.

**Sequential over parallel** despite T1→T2 and T3→T4 being disjoint chains: L-073's measured $6.60 for
two ~25-line changes says fan-out re-pays the full substrate per branch, and these are four small
markdown/shell edits. T3+T4 dispatch to Sonnet; T1+T2 run inline — prose edits to two references
already read in full this session, where dispatching would re-pay the substrate to produce ~15 lines.

Pre-dispatch preflight re-run at live HEAD (`bac6f01`): **CLEAR** — waves T1+T3 (rank 0), T2+T4 (rank 1),
all four shared-file overlaps carrying an ownership edge.

### 2026-08-01 | T1 | allowlist derivation extended to the run's terminal steps
Replaced the single-source allowlist bullet with a **four-source derivation** (per-task commands ·
landing path · the gate's own writing subprocesses · the exit path), plus the asymmetry that makes 2
and 4 load-bearing: a per-task denial costs one task, a shared-path denial costs the whole run.

All five denial signatures recorded in SPRINT-041 map onto the new sources — `mktemp`/`git -C` → 3,
`git worktree add`/`git merge --no-ff` → 2, `Skill(/handoff)` → 4. Verified against the archived
Execution Log, no paid run needed.

Reconciled the two references bidirectionally: `dispatch.md` § Merge-back queue now states that its
steps are source 2 and must be pre-authorized, so a step added there is a step to add here. Also
corrected a clause my own change made stale — Part 1 claimed the `/handoff` denial was "the only
evidence so far", which the merge-back denial makes false.

Noted, not acted on: night-run.md is now **446 lines** (was 427). TD-014's split trigger is a *third
embedded snippet* and the count is unchanged at 2, so it stays unfired — but the file keeps growing,
and T2 adds to it again.

### 2026-08-01 | T2 | run cost + throughput made first-class; A1 confirmed on real input
**A1 resolved by measurement, not reasoning.** `claude -p --output-format json` returns
`total_cost_usd`, `num_turns`, `duration_api_ms`, and a per-model `modelUsage` breakdown — verified by
running it, not by reading docs. So the degrade path shipped in the DoD is a genuine fallback rather
than the expected case, which is the opposite of what the assumption feared.

The same probe produced a second datum worth more than the first: a **single-turn agent that does no
work at all cost ~$0.22**, almost entirely cache-creation. That is the substrate every dispatched
branch re-pays before starting, measured directly rather than inferred from ADR-010's cost term. It is
now stated in pre-flight as the floor under any fan-out decision.

Pre-flight gained a cost line explicitly separated from the tasks' verification cost — the exact
conflation L-073 names. Part 4 gained a per-run calibration row (`cost · turns · wall-clock · units ·
shape`) with a degrade rule (unavailable cost is *stated*, never silently dropped) and SPRINT-041 as
row one. The table is framed as a series being started, and the row is annotated honestly: $6.60
bought two branches that were built and never landed, so cost **per unit delivered** was undefined.
`SPRINT.md.template`'s Retro gained the matching prompt, phrased for any sprint rather than only
unattended ones (consumer lens, L-015).

night-run.md is now **484 lines**, up 57 this sprint. TD-014's trigger (a third embedded snippet)
remains unfired at 2, so no split — but the growth is real and worth raising at close.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
