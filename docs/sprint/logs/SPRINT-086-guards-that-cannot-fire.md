---
sprint: 086
slug: guards-that-cannot-fire
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-086 — Execution Log

> Append-only companion to [`../SPRINT-086-guards-that-cannot-fire.md`](../SPRINT-086-guards-that-cannot-fire.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-25 | progress | Owner-action discharged first: the plugin is reinstalled, 1.58.0 == 1.58.0
Carried unaddressed through SPRINT-084 and SPRINT-085; done before any task started. Verified from
the **base-dir version `/orchestrator` prints in its own invocation header**
(`…/lean-flow/1.58.0/skills/orchestrator`) against `.claude-plugin/plugin.json` — **not** from
`/plugin`'s report, which L-021 names specifically as the thing not to trust. This is the first run
since SPRINT-083 executing procedures that match the repo; SPRINT-085 survived a 1.55.0/1.57.1 gap
only because its agents were briefed to read `skills/<name>/SKILL.md` from the repo, reaching *past*
the stale procedure rather than following it.

### 2026-08-25 | progress | Batch G1+G2 signed @ 835e744; wave 0 parallel, T2 sequenced behind T1
**G1 ran the full checklist for all four tasks — no fast-path.** Every task carries
`origin: close-retro`, and that origin never met the intake grill, so there is no prior scope
agreement for a fast-path to re-confirm. Sizes S · M · S · M; nothing to split.

**A1–A6 were each confirmed against a source, run rather than read:** `QA_BUDGET_SECONDS=900` at
`scripts/qa-check.sh:23` · the `^T[0-9]+ · ` anchor at `check-review-depth.sh:60` · Round 4's
271.5→23.6 figures present in the timing log · `sh evals/run-review-depth-fixtures.sh` as its own
call returning **9 cases green**, including the `low-self-reviewed-passes` control.

**A6 nearly went the wrong way, and the way it was caught is the point.** `grep 'size: L'` over the
Plan returned a hit — which, taken at face value, means an `L` task that G1 must split. The match was
**A6's own text**, the assumption asserting no `L` exists. Self-describing corpus, L-108 exactly. The
anchored second query over `^### T[0-9]+ .*\[size: [A-Z]+` disagreed (S·M·S·M), and the disagreement
is what surfaced it — not recall of the rule.

**Ownership map.** `scripts/qa-check.sh` is the only genuinely shared file (T2 conditionally, T3 at
its invocation point) → **single-owner chain, T3 commits before T2**, per-hunk staging, never a plain
`git add` over the other's WIP. T2/T3/T4 all touch `scripts/lib/` but different files in it. The
sprint file and this Log are **coordinator-owned** and assigned to no task — SPRINT-063 produced two
copies of one Log by assigning it.

**Waves.** 0 = {T1, T3, T4}, disjoint → parallel, worktree-isolated · 1 = {T2}, behind T1 for
evidence and behind T3 for `qa-check.sh` ownership.

**Reachability pre-screen: `0 claimed targets, 17 judgment-method clauses left to G2`.** All 17 DoD
`Verify:` clauses are judgment methods — none names a script+path pair the checker can pre-screen.
That was left as-is deliberately: the Plan froze at `5ada67e`, and rewriting frozen criteria so they
*look* mechanical is L-088, while inventing a checker merely to make a criterion look mechanical is
named by G2 itself as the failure rather than the fix. RUNS and PROVES stay the coordinator's job.

**Residual grill — one question, ruled by the owner rather than absorbed.** T2's `Layers:` declares
`conformance-engine.sh` and its rule families, but **TD-090's headline subject is leg 12 (eval
harnesses) at 396.3s of a 492s run** — a different leg from the conformance engine Round 5 profiled
at 281.2s. The two figures do not fit in one 492s run together, which is part of what T1 exists to
untangle. So T2's declared scope may be pointing at the wrong subsystem and nobody can know until T1
lands. **Owner ruling: T2 follows T1's verdict wherever it points, correcting `Layers:` and logging
it** — L-100's rule that `Layers:` is a live declaration corrected per task, not a frozen prediction
to defend. If T1 points at `evals/`, that is T4's tree and the ownership map is re-ruled here before
any edit.

**Noted against this run's own subject:** wave 0 dispatches three agents, and TD-090 *is* that the
gate cannot finish under accumulated session load. System-verify at close will likely need a fresh
process table — the same condition that beat the blocker at SPRINT-085's close.

### 2026-08-25 | progress | T1 — Round 4 is the wrong one, and leg 12 is not the engine sweep
**§ Round 6 appended: 148 insertions, 0 deletions.** Coordinator-verified independently rather than
read off the agent's report — `@@ -617,0 +618,148 @@`, a pure append at EOF with **zero** deleted or
modified lines, so Rounds 1–5 are untouched (ADR-014). The first verification attempt `cmp`-ed
`git show HEAD~1:<file>` against the on-disk file and reported the *whole file* changed; that
contradicted `git diff --stat`'s "0 deletions", and the disagreement was the tell — git-show emits
1448 CRs against the worktree's 2252. Line endings, not content. The same trap that made the plugin
cache look wholly different from the repo earlier today.

**Verdict: Round 4.** Its implied **≤4s** was never a measurement of `S11.LOGPAIR` + `S11.WHENITRUNS` —
it is an **arithmetic residual** (`176.6s − 57.16s _own_scan − 29.39s S4.APPEND − ~86.0s across 8 named
rules`) covering **~35 unnamed rules combined**, of which the pair is an unmeasured subset. Round 4's
own §Method (2) instrumented the *identical* rule-dispatch loop Round 5 later used, so the capability
to name these two rules was present in its own run and simply went unreported. Round 4's text had even
flagged itself as partial ("only some" families named, spawn counts "a lower bound").

**Reproduced a third time, by a third mechanism.** `--spec` reduction (the lever `qa-check.sh`'s own
leg 2f-ter already uses, independent of Round 5's `QAT_ONLY` env filter): **66,850.8 ms**, against
Round 5's 75.6s embedded / 76.1s isolated — **16.7×** Round 4's implied ceiling, on code unchanged
since `a5feb8a`, which predates both rounds. Three measurements, two independently-built isolation
mechanisms, one order of magnitude from Round 4.

**The leg-12 question is settled, and the answer matters more than the S11 verdict.** They are
**disjoint by target and by profile**: every eval harness that invokes the engine builds its own
throwaway `mktemp` repo and none targets this repository, while the engine's full-spec sweep against
this repo (Round 5's 281.2s) runs **only under `QA_FULL=1`** — a profile the 492s run TD-090 measured
does not set. That run's own leg 2f-ter uses the **7-rule reduced spec at 1.9–5s**. So
`396.3 + 281.2 = 677.5s` does not fit in 492s precisely because neither figure contains the other.
Neither round is wrong about its own number.

**Ranking restated: unchanged from Round 5, strengthened rather than corrected** — F11 §11 retention
84.7s › F6 §4 ADR 72.1s › F5 §1 ownership 56.0s › F9 §10 37.4s, 89% of the real-scale total. T1
**declined to choose T2's target**, correctly: that is a G2 call under V3 §43 and its scope forbade it.

**One gap named rather than smoothed.** Round 4's leg 2f-ter total (176.6s) and Round 5's full-engine
wall clock for what should be the same operation (287.4s) disagree by **63%** on comparable corpora —
ruled *out* as an alternative explanation for the S11 gap (a uniform 1.63× scale of a genuine 4s would
land near 6.5s, not 66–76s), but left open and flagged for whoever next re-measures leg 2f-ter.

### 2026-08-25 | surprise | T4's guard was blind to this very sprint's log — the coordinator, not T4, was the missing half
T4 shipped correctly: schema, 12 green fixtures, discrimination proven. Then the finished checker was
pointed at **SPRINT-086's own Execution Log** — a live, attended log for a sprint carrying
`governance:high` work — and printed `no review line -- nothing to verify`, **exit 0**. The same string
and the same exit code the whole TD-085 → TD-092 line of work exists to eliminate.

**The cause is not in T4's diff.** The schema is wired into the template and the two skill files that
*describe* when to emit it, but the thing that actually *emits* it for this sprint is the coordinator,
who writes the Execution Log — and the coordinator had written three entries without it. T4 built the
carrier; nobody had put anything in it. **L-020's shape one level up**: the capability was wired into
every file that documents it and into none that produces the traffic.

Worth naming plainly: this is the *third* consecutive sighting of one pattern — SPRINT-085 T6's guard
anchored to a shape no sprint emits, T4's schema emitted by nobody, and both found only by running the
finished guard against **the real artifact it was built for** rather than against a fixture. Fixtures
prove a branch works; only the motivating case proves the branch is reachable.

**Fixed here, by the coordinator, from this entry onward** — consequence lines for the work so far,
appended rather than backdated into the entries above (append-only; never edit a past entry):

consequence · T1 · behaviour:low · governance:low
review · T1 · self-reviewed · behaviour:low · governance:low
consequence · T4 · behaviour:material · governance:high

T1 takes the self-review floor legitimately: a measurement round appended to a research log changes no
shipped behaviour and no spec, ADR or protocol contract. **T4 does not, and the guard it wrote is what
says so** — it changed a shipped QA checker (`behaviour:material`) *and* two workflow-contract files,
`skills/orchestrator/SKILL.md` and `references/review-scoping.md` (`governance:high`). The skip table
routes governance impact at any size to an independent scoped reviewer, so one was dispatched against
T4's diff, adversarially briefed, before its DoD were ticked. Its `review ·` line lands when it reports.

The pleasing part: **T4's own guard is what forced T4's author to be reviewed.** Had the classification
gone unrecorded, the routing decision would have left no trace and the review would simply not have
happened — which is the exact silent false negative § Two dimensions describes.

### 2026-08-25 | scope-change | T2 retargeted from the conformance engine to leg 12 — logged before § Plan is edited
**What broke.** T2's Acceptance requires `qa-check.sh` to print a verdict on a **loaded** process
table — the *default* profile. Its DoD 1 requires cutting spawn counts "in the families T1 confirms as
dominant". At promote both readings pointed the same way, because Round 5's ranking was the only
profile anyone had. **T1 dissolved that premise.** The two are disjoint by target *and* by profile:

| | default profile (what T2's Acceptance targets) | `QA_FULL=1` |
|---|---|---|
| leg 12 — 29 zero-API eval harnesses | **396.3s of 492s (~81%)** | + 3 `selftest-assert-*` behind the flag |
| conformance engine sweep | 7-rule reduced spec, **1.9–5s** | **281.2s** ← Round 5's F11/F6/F5/F9 ranking lives here |

So DoD 1 as written targets work that costs the default gate **1.9–5s**, while DoD 3 demands the
default gate survive load, where the cost is leg 12. **Satisfying DoD 1 literally cannot achieve
DoD 3.** This is L-088 exactly — a criterion frozen at promote whose premise a later measurement
removed. The tempting move is to re-read DoD 1's words until they cover leg 12; that is the failure
the rule names, so it was surfaced instead.

**Impact.** T2's `Layers:` moves off `conformance-engine.sh` and onto leg 12's machinery
(`scripts/qa-check.sh` § leg 12 + the `evals/run-*.sh` harnesses it drives). `Layers:` is a *live
declaration corrected per task, not a frozen prediction to defend* (L-100), so this is the expected
cost of declaring before the work — logged, declared, continue.

**Ownership map re-ruled.** The retarget puts T2 into `evals/`, which is T4's tree. **No WIP
collision: T4 is merged and committed**, so T2 branches from a tree containing it and any conflict is
a merge conflict, not contaminated staging (L-042's hazard is a plain `git add` over *uncommitted*
work). T2 must not modify `evals/run-review-depth-fixtures.sh`'s **assertions** — T4's 12 cases and
both controls are retained fixtures under TD-012 and deleting or weakening them to make the leg
cheaper would be the exact trade the sprint forbids. `scripts/qa-check.sh` remains the T3→T2
single-owner chain, unchanged.

**G2 re-confirmed on the changed part only.** Approach still "cut spawn count, delete no check". The
constraint that mattered at G2 — *no check deleted, no coverage lowered* — becomes **more** load-bearing
here, not less: leg 12 *is* the retained-fixture corpus, so the cheapest way to make it fast is to run
fewer fixtures, which is precisely the false economy DoD 2 exists to block.

**Owner ruling:** retarget, recorded here rather than absorbed. DoD 1's reinterpretation is an
ADR-021 surfaced ruling, not a silent re-read — it will be ticked against leg 12's families, with this
entry as the record of why the words say "families T1 confirms" and the work is in `evals/`.
