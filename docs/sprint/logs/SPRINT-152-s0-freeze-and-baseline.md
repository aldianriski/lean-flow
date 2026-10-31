---
sprint: 152
slug: s0-freeze-and-baseline
owner: Maintainer
last_updated: 2026-10-31
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-152 — Execution Log

> Append-only companion to [`../SPRINT-152-s0-freeze-and-baseline.md`](../SPRINT-152-s0-freeze-and-baseline.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-10-31 | promote | plan locked, governance signed, four members in two waves: S0's freeze and paid baseline, the review-depth fix, and the promote rule's first use
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: L-267 due (count 2) and promoted: merged into the edit-safety run-every-check line, pointer on the entry.
  Census before: 22 active + 224 promoted + 1 superseded = 247, equal to the heading count; after, 21 + 225 + 1.
- ☑ TD aging: all 100 open rows aged against sprint 152 (newest created at 148). Second route: 102 matching lines − 2 prose
  lines = 100; by severity 59 low + 24 minor + 12 medium + 5 trivial = 100. Nothing newly aged, no `high` row, none resolved.
- ☑ doc-aging, §11: TASK-546 pruned (SPRINT-149; no live citation on git grep or ripgrep). Every other done or cancelled file
  from sprint 149 or earlier keeps a live citation. No CHANGELOG rotation, no LEARNINGS collapse. Commit `cbb869f9`.
- ☑ doc-aging, §2: no breach (`check-doc-caps` PASS); token budget ~12688 of 12691.
- ☑ epic rollup currency: EPIC-023 current. ☑ epic coverage: 5 of 5. ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: all four, two waves. Size check: three S and one M, no `L`. Origins: two decomposer (TASK-544,
545), one manual (TASK-558), one close-retro (TASK-559). Epic: EPIC-023 (TASK-544, 545; TASK-558 and 559 carry none).
Dependent pull (TASK-558's third box): TASK-545 joins in wave 1 beside its only blocker TASK-544 under the promote rule, with
no owner state ruling; its `blocked` state is unchanged. TASK-544 joins with zero open blockers (TASK-537..543 all in
`done/`). The installed plugin copy predates `07a75451` at the same version, so this promote ran the repo's procedure.
Pre-dispatch preflight by inspection: no cycle; wave 0 paths disjoint (T2 in the review-depth checker and its fixtures, T3
under `evals/ab/` and `docs/research/logs/`); T3 and T4 share those two paths in sequence only.

### 2026-10-31 | progress | batch G1 signed for T1-T4; G2 signed for T1 and T2; T3 G2 in round 2, T4 G2 after T3 freezes
Batch G1, signed by the owner by popup: T3 and T4 by fast-path (`origin: decomposer`, scope unchanged); T1 and T2 by the
full checklist. T1: tick box 3 only, no rule or skill text changes. T2: grade only the latest `review · Tn` line per task;
touches the checker, its fixture runner and its fixtures; no depth-token validation, no doc change. Sizes: T1 S, T2 S, T3
re-sized S to M (calibration re-run, inventory and allow-list changes, corpus hash), T4 M; no `L`.
Pre-dispatch preflight (the dispatch.md snippet, base `b5f1089d`): CLEAR. Waves T1=0, T2=0, T3=0, T4=1; the two shared
paths ordered T3 then T4.
G2 for T1 and T2 signed by popup. T2's archive-skip trap is in the design: the checker skips archived paths, so the real-
artifact run uses non-archive copies of the archived logs, old and new checker side by side.
builder-check · T1 · 0 contradictions · 0 questions · nothing important left
builder-check · T2 · 0 contradictions · 1 questions · factual (an unknown depth token counts as superseding): settled as designed, depth tokens are not validated today and that is outside TASK-559
T3 rulings taken by popup ahead of its G2: measured arms run an Opus 5.5 session with Sonnet 5.5 subagents at default
effort (the Haiku tier cannot be enforced, recorded as a limit); permission mode stays `acceptEdits` with one shared
allow-list for both arms; calibration fixes its data and the business prompt's locale check, then runs again in full under
a new lock. T4's G2 waits for T3's freeze, because its spend ceiling, validity and stop rules are what T3 writes (L-111).
`gates_signed` stays unset until every task's G2 is signed.

### 2026-10-31 | progress | T1 done: TASK-558's third box ticked against this sprint's promote entry; TASK-558 in done
The promote at `421d8d82` pulled TASK-545 beside its in-sprint blocker TASK-544 under the dependent-pull rule, with no owner
state ruling. Box 3 ticked by the tick tool (sprint-by-reference 5/0, layers-completeness 12/0). All three boxes now ticked.
consequence · T1 · behaviour:low · governance:low
review · T1 · self-review · behaviour:low · governance:low

### 2026-10-31 | progress | T3 G2 signed (round 2); T2 merged back for coordinator verification
T3's builder check returned 2 contradictions and 5 questions. Settled before the popup: the measured inventory drops the
smoke-grade low effort and lives apart from the smoke inventory, which the arm hashes cover; M6 hashing and M7 run last, and
any edit after M6 voids the hash; the builder drafts the allow-list from each repo's graders, package scripts and git, and
the owner signs it inside the document; existing measurement rows already carry the smoke tag, so the M8 check needs no
retag; calibration agreement is reported with and without the three re-ruled rows, each re-ruling recorded with its reason
before the re-run. One correction went to the owner: 2.x picks subagent models by role itself, so pinning every subagent to
Sonnet would not be "2.x dispatch tiers".
builder-check · T3 · 2 contradictions · 5 questions · four settled from the repo, the dispatch-tier contradiction and the circularity question put to the owner
Owner rulings by popup: measured arms run an Opus 5.5 session with subagents unpinned, chosen by each arm's own routing from
the inventory set (Opus, Sonnet, Haiku 5.5), which supersedes the round-1 Sonnet pin; R-b is applied pooled over both repos,
per-repo figures reported only; T4's spend rule is the structural cap (at most 96 slots, 2 infra retries per slot, 2
replacement rounds) with a pilot pause after the first four slots for an owner review, a subscription limit pausing without
scoring, and three consecutive infra failures aborting for a ruling. T3 G2 signed as designed (M1 to M8).
T2 built in an isolated worktree (commits `28c34056`, `1002581f`) and merged at `5e982d0b`; the review-depth fixtures
re-run green on the main tree. Builder's archived-log comparison, 105 logs: 83 PASS to PASS, 21 FAIL to FAIL, SPRINT-151
FAIL to PASS, none PASS to FAIL; SPRINT-119 dropped from three findings to two (a duplicate self-review line now graded once).

### 2026-10-31 | progress | T2 done: review-depth grades the latest review line per task; TASK-559 in done
`scripts/lib/check-review-depth.sh` now keeps the last review line per task id and grades only that one; finding names and
the PASS wording are unchanged. Three retained fixtures (cases 26 to 28): a later self-review FAILs, an earlier self-review
followed by scoped-reviewer PASSes as the control, and an interleaved two-task log FAILs on T1. The coordinator re-ran on
main: review-depth fixtures all green, system-verify fixtures all green, emitter-column 9/0, and the live log PASS. The
archived-log comparison was re-derived by exit code over the same 105 copies and matched the builder's finding-count route:
SPRINT-151 FAIL to PASS, 83 PASS kept, 21 FAIL kept, none PASS to FAIL. One independent scoped review: no findings; it noted
a pre-existing gap (a CRLF line ending exactly at the depth token is never graded), not introduced here.
consequence · T2 · behaviour:material · governance:high
review · T2 · scoped-reviewer · behaviour:material · governance:high

### 2026-10-31 | progress | T3 phase 1 built (pin, measured inventory, allow-list, judge cap and locale clause); three calibration rows re-ruled before the re-run
Phase 1 on the builder's worktree (commits `a70c7e38`, `9a56d5cf`, not yet merged): the A1 pin copied to a durable path with
its sha and hash unchanged; a measured inventory (Opus 5.5 session, default effort, subagents unpinned, three-model allowed
set) apart from the smoke one; one allow-list per repo shared by A0 and A1; the judge line cap raised from 400 to 600 (the
self-onboarding-guard store file is 518 lines after its patch); a locale clause in the business rubric. The smoke A1 run on
the fixture repo now completes; three selftests stay red only until the new prompt lock is written in M5.
Owner rulings by popup, each recorded before the full calibration re-run (with its reason):
- forecast-month-end, reference scope: narrow the reference to a forecast-local helper. The judge was right that the shared
  helper also moved the renew action's stored date and a leap-day annual case, against "only the forecast timing".
- reissue-invitation, reference convention: clean up the reference (one shared revoke helper for both actions, no bare
  block). The duplication the judge named was real, though minor.
- access-activity-type-filter, reference convention: add the 14-value enum to the reference's API parameter, matching the
  sibling closed-set parameters. The judge's doc point was right; its hardcoded-list point was not.
- access-activity-type-filter, reference business: expectation stays PASS; the UNKNOWN is the judge declining without the
  recorder code (all 14 types confirmed by a server grep), counted as not-passed and reported as Unknown.
Agreement will be reported with and without these three tasks, since the references were changed after reading the judge.

### 2026-10-31 | progress | T3 done: the A/B pre-registration is frozen and owner-signed; TASK-544 in done
Phase 2 on the builder's worktree applied the three re-rulings to the references (each re-verified red then green on a fresh
baseline copy, wrong patches still failing), re-ran the full calibration under the new prompts (64 of 64 rows with an
expectation agree, 52 of 52 without the three re-ruled tasks, no Unknown, no lost call; in-sample, as the document says),
wrote the new prompt lock, added the hash tool and drafted the document. Review round 1 (independent, scoped): numbers and
hashes right, eleven decision-procedure gaps; one bounded revision closed them (a per-task cost comparator in code, an exit
scoring table, a frozen 96-slot schedule, pooled figures deciding every test, strict and inclusive bounds named, the in-sample
note). Review round 2: all eleven closed, nothing blocking; the cap of two rounds is spent and the rest goes to notes.
Owner signed by popup and ruled that a slot ending in usage-missing, source-mutated or an invalid run stands as not-passed
after the operator's stop. Merged at `bc1ddf4a`; on main the corpus, eleven pinned files and the document all re-hash to the
recorded values (document sha256 `e72002cf1d1be69586833ca37133c6bcb64fc47655d51270a2dba122cd64393b`, also equal to the
committed blob's sha256); selftest 43 of 43; typecheck clean. The freeze is recorded in the A/B measurement log at `d029ba2b`;
the 13 rows before it are all smoke runs on the fixture repo.
Notes carried to T4: no code yet turns trial rows into analysis slots, so T4's builder must follow the document's slot rule
verbatim (with the round tag the operator passes); exact equality at the +10 pp bound in floating point; the Unknown counts
read the post-replacement view; the fixture-only guard on protocol trials is lifted by a code edit after the freeze.
consequence · T3 · behaviour:material · governance:high
review · T3 · scoped-reviewer · behaviour:material · governance:high

### 2026-10-31 | scope-change | T4: the frozen pre-registration gains a trial timeout before any trial; TASK-545's first box then reads against the re-signed document
What broke: the pre-registration froze every scoring rule but not the trial timeout. The harness kills a trial at 300 s, and
a killed run carries no usage, so it logs as usage-missing: not-passed plus an operator stop each time, which would have
made the baseline measure the timeout, mostly on A1. Impact: `evals/ab/PREREGISTRATION.md` is amended before any trial (one
45-minute cap on a trial's whole wall time, all phases included, identical for both arms; a distinct timeout exit label),
re-hashed and re-signed by the owner, and recorded as a superseding freeze. The scoring stays as frozen: killed mid-work is
the task's failure (not-passed, not retried), killed before the first action is infra. TASK-545's Done-when text is
unchanged; its "frozen pre-registration" means the superseding signed document. Re-confirm G2: done by popup below.

### 2026-10-31 | progress | T4 G2 signed; every task's G2 now signed
builder-check · T4 · 3 contradictions · 6 questions · contradictions settled (the frozen kill classification kept, the check asserts class and no retry, the parallelism ruling asked), four factual questions settled (rounds keyed by slot and round from the log tag, pilot completion read from the log, infra retries stay in their slot, usage-limit attempts marked by the driver and excluded from retry budget, abort counter and infra share), three intent questions to the owner
Owner rulings by popup: trial timeout 45 minutes on the whole trial, identical for A0 and A1; a timed-out trial keeps the
frozen classification under its own label, graders and judges not run, partial usage kept and flagged incomplete; one
trial at a time. T4 G2 signed: M1 timeout amendment (its own re-sign popup), M2 lift the fixture-only guard, M3 driver, M4
log-to-slots builder, M5 pilot with owner review, M6 full run, M7 analysis and symptom rulings, M8 wiring closure, M9 epic.

### 2026-10-31 | progress | T4 M1-M4 built and merged; pre-registration re-frozen with Amendment 1; pilot launched
Built on an isolated worktree and merged at `eab31280`: the 45-minute whole-trial deadline shared by every phase, a timeout
exit label with the frozen classification unchanged, the measured-trial guard lift, the baseline driver (one trial at a
time, pilot stop, owner stops, three-in-a-row infra abort, usage-limit pause by an appended void row, refusal before a
matching freeze line) and the log-to-slots builder. Review round 1 (independent): one blocker (the driver rewrote a log row in
place) and five should-fixes (the timeout narrowed the frozen classification, a signer killed at the deadline crashed the
driver, an unbounded kill on Windows, table parsing, voided spend and a stale lock); one revision closed them all. Review
round 2: all closed, nothing blocking. Its last should-fix (the protocol path read "no first action" from the final phase
only, so a silent phase-2 kill retried A1) went to the owner with the cap spent; owner ruled to fix it, verified by a
retained fixture. Coordinator re-ran on main: typecheck clean, selftest 51 of 51, the document and hashed files reproduce.
Owner re-signed by popup; the superseding freeze (sha256 `83750fc4f4cc34c096da0b77c79f48e4733937be938f78678f84dcf3e2f6909e`)
is recorded in the measurement log header and the shared freeze guard accepts it. The pilot (four slots, one per arm and
repo) runs next, one trial at a time, and stops for the owner's review.

### 2026-10-31 | surprise | T4 pilot ran (four slots) and found two harness defects that void it as a measurement
The pilot ran one slot per arm and repo and stopped as designed (driver exit 10). Wall time 49 to 157 s per trial, notional
cost 0.57 to 0.86 USD per trial plus about 0.35 USD of judges per scored A0 trial. Results: both A0 trials exited ok, their
judges rated business and convention PASS, yet every Node grader failed (typecheck, build, lint, the verify scripts; clinic's
go test too). Both A1 trials were refused at the D9 G2 scope check. Root causes, read from the code and the task briefs:
(1) the arm snapshots carry no dependencies and the trial path never provisions the environment the task authors used
(workdoo: an npm install; clinic: an npm install in web and a fresh Postgres cluster with both databases migrated), so no
Node grader can pass in either arm; (2) the D9 scope matcher treats a layer as a directory only when it ends in a slash,
while the task schema writes directory layers without one, so every clinic A1 design touching its own directories is
refused, and the post-run scope-breach check shares the matcher. Workdoo's A1 refusal was a real out-of-layer edit (a
verify script), the same edit A0 made, which A0 paid for only in its scope verdict: a D9 asymmetry for the owner to weigh.
The harness had never run end to end on a real A/B task before this pilot, because R-c limited every earlier run to the
fixture. No further slot runs until the owner rules.

### 2026-10-31 | scope-change | T4: Amendment 2 to the pre-registration (trial environment, directory layers, one G2 revise round, pilot void) before any further trial
What broke: the pilot showed the trial harness provides none of the environment the task authors used, and the D9 scope
matcher misreads directory layers. Impact: the four pilot rows are voided by appended void rows (owner ruling: harness
defect), and `evals/ab/PREREGISTRATION.md` gains Amendment 2 before any further trial: (1) every trial, both arms, is
provisioned before its 45-minute clock starts with the authors' environment (Node 24 first on the path, dependencies
installed from the lockfile, clinic's own fresh Postgres cluster with both databases migrated); (2) a layer that names a
directory in the snapshot matches everything under it, in the G2 check and the post-run scope-breach check alike; (3) a
refused A1 G2 design gets one revise round with the refusal reason fed back, a second refusal ending the trial (this changes
the owner's D9 ruling, by the owner). Re-hash, owner re-sign, superseding freeze, then a re-pilot of the same four slots.
TASK-545's Done-when text is unchanged. Re-confirm G2: owner rulings by popup this entry; the amendment gets its own builder
check and up to two independent review rounds.
Host facts for the brief: the path's Node is 22.22.3 while workdoo needs 24.16 or later (the authors used a Node 24 under
`D:\Research\ab-tools`); Postgres binaries and Go are on the path.

### 2026-10-31 | progress | T4 Amendment 2 built, reviewed twice and merged; awaiting the owner's re-sign before the voids and the re-pilot
Built on an isolated worktree and merged at `ef9a66bc`. A: every trial in both arms is provisioned before its clock with the
authors' environment (Node 24 first on the path, a lockfile install, clinic's own fresh Postgres cluster migrated), the
environment identical for the agent and the graders, provisioning failure classed as infra and never scored; a dry-run on
throwaway copies of the A0 snapshots passed every build, typecheck, lint and test grader on the unmodified code, with the
acceptance tests failing as authored (setup about 33 to 41 s). B: a directory layer matches everything under it in the G2 and
breach checks. C: one G2 revise round within the deadline. D: owner-reasoned voids. E (builder-found, for the owner's
signature): all eight workdoo tasks freeze a lint grader whose command is the words "not applicable", which the harness ran
as a shell command and failed in every workdoo trial of both arms; it is now recorded as not applicable, as frozen §11
already reads. Trial work moved to D:, each trial copy deleted after its row with its stream kept, and stale trial
directories swept at driver start. Review round 1 (independent): nothing blocking; three should-fix (the before-manifest was
taken before provisioning, so setup writes could be charged to the agent; no cleanup after a killed driver; a void did not
echo its target) and the first G2 signer missing from overhead; one revision closed all four. Review round 2: all closed,
nothing new. On main: typecheck clean, selftest 60 of 60, the document hash reproduces by the tool and by the committed
blob (`ce811aa31e2fbf04eef0179976a30800aecd454ab56256d09236efdb124c266c`); the other hashed files are unchanged.
Operating rule: never run a hand `run-trial.ts` while the driver runs (the driver's startup sweep treats every trial
directory as stale).
