---
sprint: 045
slug: gate-precision
owner: Maintainer
last_updated: 2026-08-01
status: closed
plan_commit: d6f3c75
close_commit: eaf3e1f
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
Layers: `skills/orchestrator/references/dispatch.md` · `evals/run-dispatch-preflight-fixtures.sh` · `evals/fixtures/dispatch-preflight/sprint-044-chain/sprint.md` · `evals/fixtures/dispatch-preflight/shared-file-unowned-diverging-ranks/sprint.md`
Depends-on: none

TD-025. The shared-file check demands a **direct** `Depends-on:` edge between every pair of tasks
touching one file. SPRINT-044 chained four tasks on one reference — unambiguously ordered — and the
check HALTed on the pairs without a direct edge. The workaround was listing every earlier task in each
later one's edges, which is noise the next Plan will copy. Strictly sequential execution cannot
collide, so a chain already satisfies the check's actual intent.

**Acceptance:** a Plan whose shared file is covered by a transitive chain reports PASS naming the
derived order; a Plan with two rank-0 tasks sharing a file and no path between them still FAILs by name.

**DoD:**
- [x] Ownership is derived from the **transitive closure** of `Depends-on:`, not pairwise direct edges
- [x] Computed over the existing markup — no new field, no second source of truth (ADR-013 rejected a
      compiled DAG once already)
- [x] The PASS line names the **derived** order, so a reader can tell chain-ownership from direct
- [x] **Negative-tested per check, fixtures retained** (L-058): a genuine unowned overlap still FAILs by
      name. A fix that made every overlap pass would satisfy the acceptance and destroy the guard
- [x] SPRINT-044's Plan replayed as a must-PASS fixture — the real case that exposed this
- [x] Run bare, never piped (L-057); commands issued one per invocation (CLAUDE.md trap (d) family)
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

> **Moved** → [`logs/SPRINT-045-gate-precision.md`](logs/SPRINT-045-gate-precision.md).
> Split out at SPRINT-047 T1 per ADR-014: the Log is append-only and uncapped, so it no longer
> competes with the Plan for this file's 400-line budget. Content moved verbatim.

## Files Changed (during execution)

> **Superseded by "Files Changed (final, at close)" below** — kept, not merged (SPRINT-051 T4). This is
> the table as the *run* left it: it records per-row verification state at that moment, including work
> still parked and steps the run could not execute. The final table records what the sprint shipped.
> Two honest snapshots at different times, not a duplicate; TD-034's complaint was that nothing said
> which superseded which.

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/check-layers-observed.sh` | T2 | Split the `plan_commit` case arm so the bracketed promote-time placeholder reports a named SKIP instead of a FAIL — the two-commit convention guarantees that window exists, so the old FAIL was a false alarm by construction (TD-026) | low | `run-layers-observed-fixtures.sh` cases 3 (named SKIP, exit 0) + 3b (genuinely absent, still FAILs by name, exit 1) |
| `evals/run-layers-observed-fixtures.sh` | T2 | Repurposed case 3 to assert the named SKIP and added case 3b for the must-not-weaken leg — retained so the narrowed check keeps a regression guard (L-058 · TD-012) | low | self (harness) |
| `skills/orchestrator/references/dispatch.md` | T1 | Shared-file ownership now derived from the transitive closure of `Depends-on:` so a chain counts as owned, with the PASS line naming the derived order — a legitimate chained Plan no longer HALTs (TD-025) | low | awk logic verified in isolation; **end-to-end run blocked by denials — owner to re-run** |
| `evals/run-dispatch-preflight-fixtures.sh` | T1 | Added the SPRINT-044 chain must-PASS case and a rank-divergence must-FAIL case, guarding against a rank-based false PASS (L-058) | low | fixtures retained; wrapper unrunnable under inherited `MSYS_NO_PATHCONV` |
| `evals/fixtures/dispatch-preflight/sprint-044-chain/sprint.md` · `.../shared-file-unowned-diverging-ranks/sprint.md` | T1 | New fixture inputs — **undeclared in T1's frozen `Layers:`, parked for owner** | low | gate FAIL is the parked finding |

## Files Changed (final, at close)

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/dispatch.md` | T1 | preflight derives shared-file ownership from the **transitive closure** of `Depends-on:`, so a chain counts as owned (TD-025) | low — narrows a false positive | 5 fixtures green end-to-end; unowned overlap still FAILs, verified against my own fixture too |
| `evals/run-dispatch-preflight-fixtures.sh` + 2 fixture dirs | T1 | retained must-PASS chain + must-FAIL diverging-ranks cases (L-058) | none | both run bare; the must-FAIL discriminates |
| `scripts/lib/check-layers-observed.sh` | T2, close | three-state `plan_commit`: empty → FAIL · placeholder → named SKIP · unresolvable → FAIL (TD-026). Pre-flight settings file excluded (close) | low — the SKIP never flips exit | all three states verified against fixtures I built |
| `evals/run-layers-observed-fixtures.sh` | T2 | retained fixtures for all three states | none | harness green |
| `skills/orchestrator/references/night-run.md` | close | calibration row three + what it proves | none | figures read off the captured result |
| `.claude/settings.json` | pre-flight | tool rules added (20 → 46) so `dontAsk` covers more than Bash | low | run executed; 3 denials, all recorded |

## Retro

**Retrieval check** — **one genuine miss, mine.** `night-run.md` Part 3 already names `stream-json` as
the format whose lines signal liveness; I fired with `--output-format json` because it is what exposes
`total_cost_usd`, and thereby made a healthy run report `DEAD-ON-ARRIVAL`. The information was in our
own doc and I reached past it. → **L-083**, **TD-029**. The run itself had no miss and did the opposite:
it applied **CLAUDE.md trap (d)** — promoted at *this sprint's own promote* — to diagnose the baseline
68/1 as TD-024's residual by diffing environments before code, then briefed both agents so neither
re-derived it a third time.

**Cost** — **$10.84 · 25 turns · 17 min wall · 2/2 units landed**, coordinator + 2 worktree agents.
$5.42 per unit delivered. Against SPRINT-043's identical shape ($16.54 / 64 turns / 25 denials), the
turn-count hypothesis held: **−61% turns, −88% denials, −34% cost.** That is calibration row three, and
it is the first evidence that T4's cost finding was actionable rather than merely true.

**Worked**
- **The park protocol converted a blocker into a five-minute task.** The run hit an undeclared-fixture
  FAIL it could not fix without editing a frozen Plan, and parked with a rollup naming the exact files
  to declare and the exact command to verify. I executed both verbatim. Nothing was reshaped to dodge
  the gate, and no scope was quietly widened.
- **It refused to call TD-025 closed on review alone.** Five denials blocked end-to-end execution, so
  it wrote an owner-verification item instead of accepting its own careful diff review as proof.
  Discharged at close in one command: all 5 fixtures green. → **L-085**.
- **It adjudicated a fixture-design question rather than following the DoD literally.** The DoD said
  "replay SPRINT-044's Plan"; the agent declined, because that Plan carries the redundant workaround
  edges and would pass under the *old* check too — a fixture that cannot fail (L-058's worst case). It
  surfaced the ambiguity instead of silently resolving it, and the coordinator confirmed by reading the
  archive. Both were right.
- **Both narrowings kept their true positives**, verified at close against fixtures I built rather than
  theirs — which is what D4 was for.

**Friction**
- **The permission surface degraded mid-session** — command forms denied after succeeding earlier in
  the same run, observed independently by coordinator and agent. Undercuts the assumption that a
  well-derived allowlist is sufficient for a long run. → **TD-027**.
- **A directory-prefix permission rule silently never matches** (`Bash(sh evals/:*)`), while the
  exact-file form works. The rule *looks* like coverage. → **TD-028**.
- **The launcher's liveness check and the cost-capture format are in direct conflict.** → **TD-029**.
- **Agent worktrees live inside the repo**, so the observed check counts them as undeclared on every
  fan-out. → **TD-030**, which also notes this is the fourth exclusion in four sprints.

**Pattern candidate**
- **L-083** — a guard that infers state from an observable inherits that observable's format as a precondition.
- **L-084** — a permission surface can narrow mid-session; static derivation is necessary, not sufficient.
- **L-085** — when verification is blocked, ship the artifact *plus the named command the next person must run*.

**Bucket routing**

| Bucket | Filed |
|---|---|
| Shipped | two shipped guards fixed → CHANGELOG at release (owner call below) |
| Tech debt | **TD-025 · TD-026** resolved · **TD-027** (mid-session degradation) · **TD-028** (prefix rule never matches) · **TD-029** (liveness vs output format) · **TD-030** (worktree paths) filed |
| Follow-ups | none new — **TASK-143 satisfied by this run** (fired via the launcher, both units landed, row three recorded) |
| Learnings | **L-083 · L-084 · L-085** |
