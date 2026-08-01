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
- [x] The placeholder case reports a **named SKIP**, never a bare skip and never a FAIL
- [x] A genuinely absent or unresolvable plan-commit at execute time **still FAILs by name** — this is
      the leg that must not weaken, and it is the whole risk of the task
- [x] **Both directions negative-tested, fixtures retained** (L-058)
- [x] If placeholder and absent cannot be told apart, the task **says so** and stops rather than
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

### 2026-08-01 | pre-flight | green — G1+G2 pre-signed, fired through the launcher
Owner reinstalled; **skill-freshness PASS, content-verified** rather than read off `/plugin` (L-021):
the installed 1.25.0 cache carries `scripts/night-run.sh` (with the `MSYS_NO_PATHCONV` fix, ×2), the
bare-invocation rule, and the split `night-run-checks.md`. The run will execute *this* sprint's
procedure, which is the whole point of the check.

Pre-flight green: charter execute-only over a Plan frozen at `d6f3c75` · both tasks AFK · zero open
`assumes:` (A1 confirmed here, A2/A3 confirmed by preflight `T1=0 T2=0` and T2's own DoD) · worktree
AVAILABLE, clean · 0 unpushed · gate 69/0 · `bypassPermissions` off the table.

**Gap found and closed before firing — my own incomplete application of T2's rule.** T2 shipped
"the derivation covers **tools** as well as commands", and I had populated `.claude/settings.json` with
Bash rules only. Under `dontAsk` the run would have been denied on `Write`/`Edit`/`Agent`/`Skill` — a
predictable denial, not a discovery worth a paid run. Settings now carry tool names plus the
script/text-utility commands the gate and harnesses need: **20 → 46 rules**. This is pre-flight
allowlist building (an owner-action checklist item), not a scope change; the Plan is untouched.

**G1 + G2 pre-signed by the owner** over the frozen Plan. Parallel worktree dispatch, both tasks rank 0
and disjoint, coordinator merge-back on a separate integration worktree, no ADR. **D4 reaffirmed**: each
task's must-FAIL leg outranks its fix at review.

**Expected cost: $10–16** — and the estimate is itself the hypothesis under test. SPRINT-043's
comparable shape cost $16.54 across 64 turns with ~40% of those turns lost to denials that T2's rule
should now prevent; a result near $16 would falsify the cost finding as surely as a lower one confirms
it. Fired via `scripts/night-run.sh`, which is what makes this run TASK-143's proof rather than another
manual trigger.

Recovery if it misbehaves: `origin/main` is current at `ba493cd` and the run cannot push, so
`git reset --hard origin/main` restores everything.

### 2026-08-01 | wave 1 dispatched | T1 + T2 in parallel worktrees

Pre-dispatch preflight run bare against the frozen Plan at declared base `ba393a3`:
`PASS base-ref` · `PASS wave-computation: T1=0 T2=0` · no shared-file finding → `PREFLIGHT: CLEAR`.
**A3 confirmed** — both tasks rank 0 and disjoint, so the run fans out as designed. `origin/main` ==
local HEAD == `ba393a3` (0 unpushed), so agent worktrees fork from a base that already carries both
tasks' target files — no add/add hazard.

**Baseline gate: 68 pass / 1 fail — the one FAIL is TD-024's accepted residual, not a regression.**
`run-dispatch-preflight-fixtures.sh` exits 2 with `could not resolve live HEAD in /d/Project/lean-flow`
because `MSYS_NO_PATHCONV=1` is exported into this headless session (inherited) and the harness passes
a POSIX `$repo_root` to `git -C`. Diffed the environments before the code, per CLAUDE.md trap (d):
`git -C /d/Project/lean-flow rev-parse HEAD` → fatal, while `git -C D:/Project/lean-flow rev-parse HEAD`
resolves. The launcher clears the variable around its own gate run (69/0); the spawned run inherits it.
Explicitly **out of scope** for this sprint — both dispatch briefs name it so neither agent burns turns
re-diagnosing it a third time (L-081).

Dispatched `class: execution` → Sonnet, one `general-purpose` agent per task, worktree-isolated, both
Agent calls in one message. Each brief carries its procedure skill (`/tdd`) rather than a paraphrase,
the verbatim tree-wide-git-state-op ban (L-043), the coordinator-owned file list (D1), the bare-command
form rule, and **D4** — the must-FAIL leg outranks the fix at review. Each must return its fixtures'
literal printed findings, not a self-reported pass (an exit code is evidence about the reporter).

### 2026-08-01 | T2 landed | merged --no-ff; two allowlist form findings; one park

**T2 reviewed and merged.** Pre-merge review read the whole diff rather than the agent's summary.
D4 holds: the `case` arm split `''|*'['*` into `''` → FAIL (text unchanged) and `*'['*` → named SKIP;
the `git rev-parse` unresolvable leg is untouched. Both true-positive legs survive, and the new
`skip()` never flips `$fail`. **A2 confirmed** — emptiness vs non-empty-bracketed is the split, and
real shas are bare hex, so the two states are reliably distinguishable. Fixtures retained in the
harness for both directions.

**Two `denied-tool` findings — the run's own product (D3), recorded once and not re-wrapped (Part 4).**
Both are *form* failures on the rule syntax, not missing capability:
1. `sh <abs-path>/evals/<harness>.sh` → **denied**. The `Bash(sh evals/:*)` rule is relative-anchored,
   so the same script denied by absolute path. With the `cd`-prefix ban, the consequence is that
   **a harness inside an agent worktree cannot be executed at all** from the coordinator.
2. `sh evals/run-layers-observed-fixtures.sh` (relative, exactly the rule's shape) → **also denied**,
   while `sh scripts/qa-check.sh` runs fine under `Bash(sh scripts/qa-check.sh:*)`. So the
   **directory-prefix rule form does not match; only the exact-file form does.** This is night-run.md's
   "pin one rule syntax" warning firing for real: the settings file carries both spellings, and the
   broader-looking one is the one that silently fails.

Consequence for this task's evidence: I could not independently execute T2's fixture harness. Verified
instead by reading the checker diff and the harness diff together and confirming the asserted finding
strings match the checker's emitted strings literally, plus the merged `layers observed` leg running
green on the real sprint file inside `qa-check.sh`. Stated as a gap rather than papered over.

**Parked (scope-change → HITL, Part 0).** Post-merge gate surfaced a *new* false positive:
`layers observed … changed but undeclared: .claude/worktrees/agent-<id>/` — the worktree dispatch
protocol creates agent worktrees **inside the repo**, and this checker counts them as undeclared
changed paths. Same defect class as T2, different instance, and outside T2's chartered scope — so it
is parked, not fixed. Expected to clear when the worktrees are pruned at cleanup; that will be
verified, not assumed. Durable home: a TD candidate at close.

Also corrected: the agent reported `knowledge index STALE` from inside its worktree. On the merged
main tree the gate reads `PASS knowledge index current` — a worktree-local artifact, not a repo fact,
and another instance of a report disagreeing with the artifact (CLAUDE.md trap (c)).

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/check-layers-observed.sh` | T2 | Split the `plan_commit` case arm so the bracketed promote-time placeholder reports a named SKIP instead of a FAIL — the two-commit convention guarantees that window exists, so the old FAIL was a false alarm by construction (TD-026) | low | `run-layers-observed-fixtures.sh` cases 3 (named SKIP, exit 0) + 3b (genuinely absent, still FAILs by name, exit 1) |
| `evals/run-layers-observed-fixtures.sh` | T2 | Repurposed case 3 to assert the named SKIP and added case 3b for the must-not-weaken leg — retained so the narrowed check keeps a regression guard (L-058 · TD-012) | low | self (harness) |

## Retro

<!-- Written at close. -->
