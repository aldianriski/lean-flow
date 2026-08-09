---
sprint: 045
slug: gate-precision
owner: Maintainer
last_updated: 2026-08-09
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-045 — Execution Log

> Append-only companion to [`../SPRINT-045-gate-precision.md`](../SPRINT-045-gate-precision.md).
> Split out of the Plan file at SPRINT-047 T1 as ADR-014's real-input migration proof — the content
> below is moved verbatim, not rewritten. Uncapped by design (DOCS_Guide §9).

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

### 2026-08-01 | T1 landed | merged; fixture reading adjudicated; end-to-end verification blocked

**T1 reviewed and merged.** Logic read in full: `reach[]` is a fixed-point transitive closure over the
already-parsed `deps[]`, so no new field and no second SSOT (ADR-013 holds). The shared-file loop tries
the direct edge first (original PASS text unchanged), falls back to `reach[]` for a chain
(`PASS shared-file-owned-transitive: … derived-order=T1 -> T2 -> T3`), and FAILs only when no path
exists in either direction — **D4 holds, the true positive is intact**, and the FAIL text now names
"direct or transitive".

**Coordinator adjudication — the agent's fixture judgment call is CONFIRMED.** It declined to replay
SPRINT-044's archived Plan verbatim, and it was right to. I checked the archive: T2 `T1` · T3 `T1, T2` ·
T4 `T1, T2, T3` — every pair sharing `night-run.md` already carries a **direct** edge, because the
redundant workaround edges are baked into the shipped Plan. Replaying it verbatim would produce a
fixture that passes under the *old* pairwise check too — a guard that cannot fail, which is L-058's
exact worst case. The fixture uses the natural minimal chain (T2→T1, T3→T2, T4→T3), which is the form
that actually HALTed, matching the DoD line's own "the real case that exposed this". The agent surfaced
the ambiguity instead of silently resolving it — the behaviour the brief asked for.

**Verification gap, stated plainly.** Neither the agent nor I could execute the shipped snippet
end-to-end. The agent verified the awk program in isolation against hand-built records; I reviewed the
merged diff and confirmed T1 touches **only** the prose and the awk block — the `sh` parsing loop is
byte-unchanged from the version I ran successfully against this sprint at wave start. That is strong
but not equivalent to an end-to-end run. **Owner verification item:** run
`sh evals/run-dispatch-preflight-fixtures.sh` interactively with `MSYS_NO_PATHCONV` cleared before
treating TD-025 as closed.

**Three more `denied-tool` findings, and together they change the diagnosis.** `git show … > file`,
`awk … > /tmp/file`, and `sh /tmp/pf-045.sh <args>` were all denied — but the **last two are the exact
command forms that succeeded earlier in this same run** (they are how the wave-start preflight was
extracted and executed). The T1 agent independently reported the same shape in its own sandbox: every
`sh` and `awk -f <file>` invocation denied regardless of allowlist match, while inline `awk '…'` worked.
So this is **not** a static allowlist gap that a better-derived rule list would have prevented — the
permission surface **degraded mid-session**. That is a materially different finding from SPRINT-043's
form-failure story, and it is the most valuable thing this run produced (D3). Five denials total; each
recorded once and never re-wrapped (Part 4).

**Parked (scope-change → HITL).** Gate is 67/2. Worktree cleanup cleared the transient half of the
`layers observed` finding — **verified by re-running the gate after pruning, not assumed**. The
remaining half is real: T1's two new fixture files are undeclared in its **frozen** `Layers:`. Declaring
them means editing § Plan, which is scope-changing and needs an owner G2 re-confirm — the identical
situation SPRINT-044 resolved that way. Parked as-is; not worked around, and no task reshaped to dodge
it. The other FAIL is TD-024's known MSYS residual, out of scope by § Scope.

### 2026-08-01 | rollup | run complete, halting clean

```
T1 · parked-hitl · new fixture files undeclared in frozen Layers: — owner logs a scope-change,
     adds evals/fixtures/dispatch-preflight/{sprint-044-chain,shared-file-unowned-diverging-ranks}/sprint.md
     to T1's Layers:, re-confirms G2, re-runs gate (expect 69/0 with MSYS cleared)
T1 · denied-tool · end-to-end harness run unavailable — verify interactively before closing TD-025
run · cost unavailable from inside the session · ~2 waves, 2 units built / 2 landed · coordinator + 2
     worktree agents · subagent tokens 89k (T2) + 156k (T1); agent tool-uses 28 (T2) + 75 (T1)
```

Cost is stated as **unavailable** rather than omitted (Part 4 degrade rule) — a headless `claude -p`
exposes `total_cost_usd` to its *caller*, not to itself, so the launcher's JSON result carries the
figure this row needs. Sprint is **not closed**: T1 carries a parked HITL blocker and the gate is red
on its files, so `close` would be closing through a failing check.

