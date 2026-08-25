---
sprint: 086
slug: guards-that-cannot-fire
owner: Maintainer
last_updated: 2026-08-25
status: closed
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

### 2026-08-25 | blocker | I committed a live reviewer's seeded break into a shipped guard — L-042, caught only by the outside pass
**The independent T4 reviewer's first finding was not about T4.** It was that `main` — at that moment,
`822b67b` — shipped `scripts/lib/check-review-depth.sh` with the `consequence` anchor replaced by
`XXconsequence` in **18 places**. The shipped guard returned **PASS, exit 0** on SPRINT-086's own live
log: a `governance:high` task with no review line, reported clean. The exact TD-085/TD-092 false
negative this sprint exists to close, reopened by the commit that was supposed to be about T2.

**Root cause is mine and it is a rule I had loaded.** I dispatched the T4 reviewer as a plain agent
with **no worktree isolation**, so it ran in the main working tree. It seeded `consequence` →
`XXconsequence` to reproduce T4's discrimination proof — correct reviewer behaviour, and exactly what
the brief asked for. Then I ran `git add -A && git commit` for the scope-change while that seed was
in flight. **L-042 verbatim**: staging a shared file while another task has WIP in it contaminates at
the *commit* phase and mis-attributes history. The remedy is recorded in CLAUDE.md — `git add -p` +
verify `git diff --cached` — and I used `git add -A` three times today without reading the staged diff.
Twice it was harmless because only my own files were dirty. The third time an agent was live in the tree.

**It compounded, in the way this repo's edit-safety rules predict.** The reviewer, tidying up, ran
`git checkout -- <file>` — which restores from HEAD, and HEAD was already poisoned. So the cleanup
*reproduced* the corruption and then correctly reported a clean tree. Two independent, individually
reasonable actions produced a shipped guard that fails green with no dirty file to notice.

**Nothing in the normal loop would have caught it.** The commit's own message was about T2. `git status`
was clean. The sprint file was untouched. The one instrument that saw it was the **independent reviewer
running the shipped checker against real input** — which is L-165's thesis observed again: what catches
these is an outside pass or a disagreeing second number, never the author re-reading their own work.
Worth noting the reviewer was dispatched *because* T4's own new schema classified T4 as
`governance:high` and routed it to one. The guard T4 wrote is what caught the corruption of the guard
T4 wrote.

**Restored from `302a222` and verified rather than assumed:** 0 occurrences · byte-identical to the
known-good blob · `sh -n` clean · 12 fixtures green / 0 red · the guard again FAILs this log with both
named findings. The restore commit staged the file **by name**, with `git diff --cached` read before
committing.

**Standing correction for the rest of this run:** every review/analysis agent is dispatched
worktree-isolated, and no `git add -A` while any agent is live.

### 2026-08-25 | progress | T4 independent review — one blocker (mine), one major, one nit; revise pass dispatched
**Standards axis — major, and genuine.** The anchor is correct in refusing prose, but it is
zero-tolerance: four benign transcription drifts each produce a **silent false negative** on
`governance:high` work — a double space, capitalised field names, a trailing space, and leading
indentation inside a list or blockquote. Each verified against the real checker, not argued. This line
is hand-written by agents into narrative markdown, so drift is the expected case rather than the exotic
one. One bounded revise pass dispatched (worktree-isolated), briefed to keep the match anchored and
whole-line while normalising whitespace and case, with a retained must-FAIL fixture per drift class and
a negative control proving prose about the schema still does not match.

**Spec axis — clean, and checked by running things.** The wiring T4's DoD 1 claims is present at all
three points. The reviewer **reproduced T4's discrimination proof exactly** against T4's own commit —
seed at line 170, `cmp` differing at byte 11519, `sh -n` clean, 216 = 216 lines, cases 11+12 reddening,
all 10 siblings green including both low/low controls. The fixtures are **retained on disk** (TD-012),
not deleted with the prototype.

**Reachability — confirmed firing on real content**, not merely present: `qa-check.sh:321` wires the
checker against every `docs/sprint/logs/` file matching a live `SPRINT-*.md`, which currently includes
this log; the `*/archive/*` skip does not block it because live logs are not archived.

**Over-firing — the control is load-bearing, not vacuous**, verified by re-running it through the
seeded-anchor scenario. One nit: a fenced code block containing a *concrete-valued* example line would
trip the checker — unreachable today, because every real doc reference uses the `Tn` / `low|material`
placeholders the anchored regex cannot match, and the gate only feeds it `docs/sprint/logs/` files.

review · T4 · independent-scoped-reviewer · behaviour:material · governance:high

### 2026-08-25 | progress | T3 — the budget guard fires in both lateness paths, and the old bug is now a fixture
**Path (a):** default 900s → **450s**, arithmetic stated inline (`600s ceiling - 150s headroom`). Not
left as a comment anyone can drift away from — a **new mechanical self-check**
(`scripts/lib/check-qa-budget-default.sh`) runs as a gate leg and FAILs
`qa-budget-default-exceeds-ceiling` if the shipped default ever climbs back to the ceiling.

**Path (b):** `qb_checkpoint()` threaded through **22 sites across legs 2–12**, not just leg 12's
harness loop, with its own finding `qa-check-budget-exceeded-early`. **Proven on this host rather than
argued from the code:** a bare gate run took **9m12s** with leg 12 not starting until ~84% of output —
so legs 1–11 alone can burn the whole budget before the old leg-12-only check is ever reached. That is
the second lateness path demonstrated, which is what made "fix one and the other stays open" concrete.

**The discrimination is stronger than the DoD asked for.** Path (b)'s case 2 does not merely seed a
break — it **retains TD-084's original silent shape as a fixture**: with the checkpoints seeded away
the run dies mute, no budget verdict printed, exactly as it did in SPRINT-085's blocker. The bug is
pinned, not just guarded against, so a future regression reproduces a *named* fixture rather than a
fresh mystery.

**A live environment bug found while building its own fixture.** The path-(b) fixture needs `QA_FULL=1`,
and that flag **leaked into the inner `qa-check.sh` invocations it exercises**, silently bypassing the
budget check by contract — CLAUDE.md edit-safety trap (d), the same inheritance shape as the
`MSYS_NO_PATHCONV` incident that once produced a red gate on correct code and survived two wrong
diagnoses. Scoped with `env -u QA_FULL`. Worth recording: the trap fired inside the task whose subject
is guards that do not fire.

**Ownership honoured:** `scripts/qa-check.sh` staged **per-hunk** with an empty `git diff` verified
after staging — the T3→T2 chain, and precisely the discipline the coordinator failed at earlier today.

consequence · T3 · behaviour:material · governance:low
review · T3 · self-reviewed · behaviour:material · governance:low

### 2026-08-25 | progress | T4 revise — drift tolerated, anchor unchanged; and T4's DoD 2 ruled, not silently ticked
The revise normalises each candidate line through `awk` (trim · collapse whitespace runs · case-fold
field names) **before** applying the unchanged whole-line anchor. The anchor was not loosened, which is
the whole point: normalisation cannot turn a sentence *about* the schema into an exact match, and the
`drift-prose-mention-passes` control — the same drift spellings embedded mid-sentence — confirms L-108
stays closed. Four drift classes, one retained must-FAIL fixture each; suite **12 → 17, all green**.

**T4's DoD 2 was ticked on an ADR-021 surfaced ruling.** As literally worded it is **unsatisfiable**:
SPRINT-084's log exits 0 unmodified and always will, because the schema postdates it and no historical
log can carry a line that did not exist when it was written. Retrofitting one into the past entry would
have satisfied the words by editing the evidence — the shape L-088 forbids. It was met in a stronger
form instead: **SPRINT-086's own live attended log** was reported FAIL with both named findings while
T4's review was outstanding, and PASSes now that the `review ·` line is appended. Live traffic caught
in real time is better proof than a retrofitted historical file, and the difference is recorded here
rather than absorbed into a tick.

**T4's DoD 5 stays open deliberately** — TD-085 and TD-092 are dispositioned at the close Retro, per
repo convention, not mid-task. The work closing both is done; the bookkeeping is a close-time act.

### 2026-08-25 | progress | T2 — leg 12 cut by adopting the pattern its own siblings already used; DoD 3 left unmet, on purpose
**First, the failure that nearly cost the task.** T2 stopped mid-run saying it would "wait for the
background gate run to complete", and the harness recorded it **completed** — with **zero commits on
its branch**. Verbatim SPRINT-085 T5's shape. Caught the same way that one was: by checking the
artifact (`git log main..HEAD`, empty) instead of the report. The coordinator's brief to T1 carried an
explicit ban on long background waits and **the brief to T2 did not** — that omission is the
coordinator's, and it is the second time today a rule was correctly known and not applied at the point
it mattered. The agent was **resumed rather than restarted**, preserving ~241k tokens of sound work.

**The fix is small and slightly embarrassing in a useful way.**
`evals/run-conformance-engine-fixtures.sh` was the one harness in the repo that had **never adopted the
spec-reduction pattern its own siblings already use** (`run-adr-family-fixtures.sh` ·
`run-ownership-header-fixtures.sh` · `run-s2-placement-fixtures.sh`) — and which **three cases inside
that same file** already used for one section. 25 of its 38 engine calls dispatched the full ~100-row
spec to check **six** rule ids. It now builds one reduced spec by the same section-preserving technique,
carrying a self-guard that FAILs if the reduction anchor ever drifts from the shipped spec.

**196.1s → 143.2s / 163.7s** (two samples), ~32–53s off leg 12. The cross-check that makes the number
usable: a per-harness sweep of all 26 always-on harnesses summed to **400.7s, within 1.1% of TD-090's
cited 396.3s** — an independent corroboration of the row's own figure, arrived at by a different route.
§ Round 7 appended (pure append, 0 deletions).

**"No check deleted" was verified by the coordinator, not accepted.** The runtime before/after capture
was killed mid-run, so it was established statically from three angles that agree: **50 unique fixture
names before and after, zero removed, zero added**, assertion count unchanged. Recorded as static
evidence rather than described as if the runtime diff had been observed.

**DoD 3 is UNMET and was not substituted.** T2's under-load run was killed before producing a verdict.
A clean-table run would have satisfied the sentence and proved nothing — that case already passes
today, which is the entire premise of TD-090's load-dependent characterisation. Reported plainly by the
agent and carried here as an open criterion. It is closable only from a genuinely loaded session.

consequence · T2 · behaviour:material · governance:low
review · T2 · self-reviewed · behaviour:material · governance:low

### 2026-08-25 | progress | The gate completed under load — DoD 3 met, and the run proved two of this sprint's fixes at once
**Load state recorded before the run, not asserted after:** 6 live agent worktrees · 7 agent dispatches
· 4 prior full gate runs in this session. That is the accumulated process table TD-090 describes.

**Result: 226 lines, `QA-CHECK: 176 pass, 7 fail` printed.** SPRINT-085's three attempts under
comparable load died at **204 → 117 → 100 lines without ever printing a verdict**. T2's DoD 3 is met on
the exact failure, not on a proxy.

**T3's budget guard fired for real, and that is the run's best evidence.** At **461s against the 450s
budget** it tripped and named its three skipped harnesses — `run-s2-placement-fixtures.sh` ·
`run-review-depth-fixtures.sh` · `run-verify-reaches-fixtures.sh`. Its FAIL text reads *"rather than
left to run past an external timeout with no verdict line (TD-084)"* — **verbatim the sentence TD-091
quoted as the thing that never happened**. Shipped by SPRINT-084, inert until now, fixed by T3 this
morning, and firing on production traffic by evening. The gate completed *because* it fired: printing a
verdict with named skips is what "completes" was written to mean, and the alternative it replaced was
dying mute.

**A new defect the run exposed, which no fixture would have.** Five of the seven FAILs were
`ephemeral-intake` findings inside `.claude/worktrees/agent-*` — **the gate scans live agent
worktrees**, six full repo copies, inflating the run *and* emitting false FAILs on fixture files that
are not repo content. This repo's own dispatch guidance recommends worktree-isolated parallel builds,
so the gate penalises the very pattern it prescribes. Worktrees removed (all seven branches confirmed
merged first — the first check said UNMERGED because a `+` prefix was not stripped and `merge-base`
got `+worktree-…`; the second query disagreed and was right). **Filed as debt at close** — the fix
belongs in the gate's path exclusions, not in a habit of tidying up before running it.

**The seventh FAIL was the coordinator's**, again: T2's Tier G tick names `S6.MULTISVC`, which the
layers checker requires declared on `Cites:`. Identical in class to T1's finding hours earlier — a
field-presence check cannot see what prose implies, and I had already been caught by it once.
