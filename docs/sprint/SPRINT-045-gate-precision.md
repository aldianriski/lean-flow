---
sprint: 045
slug: gate-precision
owner: Maintainer
last_updated: 2026-08-01
status: active
plan_commit: d6f3c75
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-045 — Gate Precision

> **Theme:** Both of this sprint's tasks fix the same defect class in two different guards: a check
> that fails on input it should accept. One halts a legitimate Plan whose ordering is derivable through
> a chain; the other reports a red gate during a window the sprint convention *guarantees* exists. A
> guard that cries wolf on a known-good state is on its way to being read past, which costs more than
> the false alarm — and both were found by those guards blocking real work last sprint.

## Scope

**In:** transitive ordering in the dispatch preflight's shared-file check, so a chain counts as owned
(T1) · a named SKIP instead of a FAIL in the sha-recording window, without weakening the genuine
missing-plan-commit case (T2) · and executing both **unattended, launched through `night-run.sh`**, which
is what TASK-143 exists to prove.

**Out (deferred):** any change to what the two guards *catch* — this sprint narrows false positives
only, and a fix that also loosened a true positive would defeat both tasks · **throughput** (larger
Plans per night) — still waiting on calibration row three, which this run produces · the accepted
residual on TD-024 (a hand-run gate under an exported `MSYS_NO_PATHCONV` still shows the spurious FAIL);
the launcher handles it, and the standing rule is now CLAUDE.md trap (d).

## Plan

### T1 — Let the dispatch preflight see ordering through a dependency chain `[size: M · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/dispatch.md` · `evals/run-dispatch-preflight-fixtures.sh`
Depends-on: none

TD-025. The shared-file check demands a **direct** `Depends-on:` edge between every pair of tasks
touching one file. SPRINT-044 chained four tasks on one reference — unambiguously ordered — and the
check HALTed on the pairs without a direct edge. The workaround was listing every earlier task in each
later one's edges, which is noise the next Plan will copy. Strictly sequential execution cannot
collide, so a chain already satisfies the check's actual intent.

**Acceptance:** a Plan whose shared file is covered by a transitive chain reports PASS naming the
derived order; a Plan with two rank-0 tasks sharing a file and no path between them still FAILs by name.

**DoD:**
- [ ] Ownership is derived from the **transitive closure** of `Depends-on:`, not pairwise direct edges
- [ ] Computed over the existing markup — no new field, no second source of truth (ADR-013 rejected a
      compiled DAG once already)
- [ ] The PASS line names the **derived** order, so a reader can tell chain-ownership from direct
- [ ] **Negative-tested per check, fixtures retained** (L-058): a genuine unowned overlap still FAILs by
      name. A fix that made every overlap pass would satisfy the acceptance and destroy the guard
- [ ] SPRINT-044's Plan replayed as a must-PASS fixture — the real case that exposed this
- [ ] Run bare, never piped (L-057); commands issued one per invocation (CLAUDE.md trap (d) family)
<!-- QA: this IS a gate — the must-FAIL fixture is the bar. Narrowing a false positive is exactly when
     a true positive gets lost, so the unowned-overlap case earns more scrutiny than the fix itself. -->

### T2 — Stop the observed-layers check failing in the sha-recording window `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-layers-observed.sh` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none

TD-026. The two-commit convention records the plan sha *after* the `plan locked` commit, so between
those two commits the checker reads a placeholder and reports `plan_commit not recorded`. One FAIL, by
construction, in a window that always exists. The check is otherwise behaving correctly — it names its
finding rather than passing — which is precisely why the false alarm is worth removing.

**Acceptance:** a sprint still holding the placeholder reports a named SKIP; a sprint genuinely missing
the field at execute time still FAILs by name.

**DoD:**
- [ ] The placeholder case reports a **named SKIP**, never a bare skip and never a FAIL
- [ ] A genuinely absent or unresolvable plan-commit at execute time **still FAILs by name** — this is
      the leg that must not weaken, and it is the whole risk of the task
- [ ] **Both directions negative-tested, fixtures retained** (L-058)
- [ ] If placeholder and absent cannot be told apart, the task **says so** and stops rather than
      widening the SKIP to cover both (A2)

## Owner-action checklist
<!-- These gate the unattended run; none is a dev task. -->
- [ ] **Reinstall the plugin so installed reaches 1.25.0** — pre-flight's skill-freshness check will
      BLOCK otherwise, and a run executing the *previous* procedure would prove nothing.
- [ ] **Push the plan-locked commit** before firing — agent worktrees fork from the remote branch.
- [ ] **Fire via `sh scripts/night-run.sh -- …`**, not a hand-pasted command. Using the launcher is what
      makes this run TASK-143's proof rather than another manual trigger.
- [ ] `git push` after close — owner-reserved, always.

## Decisions (pre-locked)

- **D1** — **`TECH-DEBT.md` is coordinator-owned at close.** Both tasks would otherwise mark their own
  `TD-NNN`, making the ledger shared and forcing them sequential — which would forfeit the parallel
  dispatch this run exists to exercise. Same convention as SPRINT-043/044.
- **D2** — **This sprint runs unattended, launched through `night-run.sh`.** It is TASK-143: the
  launcher and the settings-based allowlist have been verified interactively but never on a real Plan,
  and only a real run falsifies them.
- **D3** — **A denial or a `DEAD-ON-ARRIVAL` is a result, not a failure**, recorded against which
  allowlist source or command *form* failed to cover it. That is the finding the run exists to produce.
- **D4** — Both tasks narrow a **false positive**. Neither may weaken the true positive underneath;
  each carries a must-FAIL leg for exactly that, and those legs outrank the fixes at review.

## Assumptions

- **A1** — The installed plugin matches the repo manifest at trigger time. *Confirm: pre-flight's
  skill-freshness check, which must read PASS before firing.*
- **A2** — A placeholder plan-commit is distinguishable from a genuinely absent one. *Confirm: T2's
  final DoD line, which requires the task to stop and say so if it is not.*
- **A3** — T1 and T2 share no file, so both compute at rank 0 and the run fans out. *Confirm:
  pre-dispatch preflight reports two rank-0 tasks and no shared-file finding.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan.
     Keep entries short: a finding's durable home is TECH-DEBT / LEARNINGS / CHANGELOG, and restating
     it at length here is what pushed the last sprint past its 400-line cap. -->

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
