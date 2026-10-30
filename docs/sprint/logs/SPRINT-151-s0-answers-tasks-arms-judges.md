---
sprint: 151
slug: s0-answers-tasks-arms-judges
owner: Maintainer
last_updated: 2026-10-30
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-151 — Execution Log

> Append-only companion to [`../SPRINT-151-s0-answers-tasks-arms-judges.md`](../SPRINT-151-s0-answers-tasks-arms-judges.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-10-30 | promote | plan locked, governance signed, eight members in three waves: S0's answers, tasks, arms and judges, plus the promote rule
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Census 19 active + 224 promoted + 1 superseded = 244, equal to the heading count (first tag per
  heading). L-263, 264 and 265 are at count 1.
- ☑ TD aging: all 100 open rows aged against sprint 151. Second route: 102 rows − 2 resolved = 100 open, all created at 148 or
  earlier. Newly aged: TD-281 (low) and TD-282 (trivial), no action. No `high` row.
- ☑ doc-aging, §11: TD-268 and TD-279 deleted (resolved at 148); TASK-532 pruned (SPRINT-148; 0 live citations on git grep and
  ripgrep). TASK-531, 535 and 542 keep live citations. No CHANGELOG rotation, no LEARNINGS collapse. Commit `253aa012`.
- ☑ doc-aging, §2: no breach; token budget ~12688 of 12691.
- ☑ epic rollup currency: EPIC-023 current. ☑ epic coverage: 5 of 5. ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: S0 waves 0-2, S0 only (no parallel S1 stream), with parallel worktree builders, one review per
wave and one batch G2 popup. TASK-537..541 and 543 were ruled ready to ride with their in-sprint blockers (`bfa1e741`). The
owner asked for that ruling to become the standard, filed as TASK-558 and added to wave 0. Size check: two S and six M, no
`L`. Origins: six decomposer, two manual (TASK-558; TASK-536 is decomposer). Epic: EPIC-023 (seven; TASK-558 carries none).
`promote-check`: 25 pass, 0 fail, after a first run's eight findings were fixed: two prose mentions of another Tn reworded,
and two cited-only files moved to `Cites:`.
Pre-dispatch preflight by inspection (no script): no cycle; wave 1 paths disjoint (four batch subfolders, the arms folder);
one overlap found and resolved before the lock: T8 (`evals/ab/`) contains T7 (`evals/ab/arms/`), so T8 now depends on T7 as well.

### 2026-10-30 | scope-change | T1 -- TASK-536 box 3 reworded: task authors read the repo and its answers file, not the spec
What broke: TASK-536 box 3 said task authors read "repo + spec", while TASK-537..540 say each author's brief holds only the
repo, its answers file and the category list. Both were frozen, and they contradict for clinic (workdoo has no spec). Impact:
box 3's author clause now matches 537..540 (for clinic the answers file distils the spec; the spec itself is not given), and
`BUSINESS-NOTES.md` is named as the answers file's raw-facts part. No Layers change. Re-confirm G2: owner ruling in the G2
popup below.

### 2026-10-30 | G2 | batch G1 (seven fast-path, TASK-558 full) + G2 signed for T1-T8 (owner popup), `gates_signed: G1,G2 @ d12a4cf6`
G1: seven `origin: decomposer` members, scope unchanged since intake; TASK-558 (manual) took the full checklist: done when the
promote procedure lets a dependent join with its open in-sprint blockers; size S; two files plus CHANGELOG; out of scope:
triage's in-flight rule and any check. Owner rulings: authors get the repo and its answers file only, as sub-agents in
snapshots outside this repo; a slot still infra-lost after two replacement rounds fails the run and the owner decides; T2 is
scoped out at close with boxes 1 and 2 and closes at the next promote that pulls a dependent; the owner operates the A1 clinic
init against the pinned 2.19.1 checkout; graders run without remote services, clinic may use its repo-local Postgres cluster.
Design settlements (from five builder checks): each answers file splits into raw facts (`BUSINESS-NOTES.md` in every arm)
and a provenance file (citations, coverage table) that no trial sees; lost-detail facts are absent from the repo's code, docs
and tests (grep-checked); T2 defines a wave and says "every open blocker", and no gate reads a member's state; batch folders
fixed as batch-a and batch-b; A0 differs from A1 by the declared doc set and the absent plugin pin, all else asserted equal;
the arm check is wired into runTrial; T8's analysis choices (token weighting, bootstrap, calibration bar, the k=2 cell limit)
are parameters with proposed defaults, frozen at TASK-544.
- builder-check · T1 · 2 contradictions · 4 questions · settled: raw-facts/provenance split; authors' input ruled by owner (scope-change above)
- builder-check · T2 · 2 contradictions · 5 questions · settled: frontmatter depends-on, wave defined, "open" blockers, no state gate; box 3 carry ruled by owner
- builder-check · T3 · 2 contradictions · 5 questions · settled (one shared design for T3..T6): folders, brief, repo graders, lost-detail grep; isolation ruled by owner
- builder-check · T4 · covered by the T3 check (shared design; one fresh reader read all four Done-when lists)
- builder-check · T5 · covered by the T3 check (shared design)
- builder-check · T6 · covered by the T3 check (shared design)
- builder-check · T7 · 2 contradictions · 6 questions · settled: A0 has no plugin by declaration, Arm extended, check wired into runTrial, manifest excludes build files
- builder-check · T8 · 3 contradictions · 6 questions · settled: R5 wording owner-ruled, validity measured on the first pass, dropped items restored, analysis choices parameterised to TASK-544

### 2026-10-30 | progress | T2 -- promote rule built and reviewed in one Codex round; boxes 1 and 2 ticked, box 3 carries (owner ruling)
consequence · T2 · behaviour:low · governance:high
Built inline at `07a75451`. A blocked task may join when every open blocker joins the same sprint; it waits a wave, needs no
state change, and a failed blocker removes it by scope-change. The SKILL.md promote line points to the rule without growing
(139 lines). merge-check green; the prose-density ratchet unchanged (the file's 10 dense lines predate this change); token
budget unchanged. Codex R1: CLEAR on all four items. Box 3 waits for the next real promote that pulls a dependent.
review · T2 · scoped-reviewer · behaviour:low · governance:high

### 2026-10-30 | progress | T1 -- answers files and access protocol landed; all three boxes ticked
consequence · T1 · behaviour:low · governance:low
Two sonnet drafters wrote clinic (from its spec, 35 facts, 34 citations spot-checked against the spec) and workdoo (from its
own docs, 87 facts, 9 owner-interview gaps). The coordinator found that both facts files still held tool-facing content:
setup answers, the lean-flow loop and ADR rule, and the stack and conventions. Under R-a (A0 = raw facts without lean-flow)
those move to an operator-only file. Owner rulings: BUSINESS-NOTES carries business facts only (stack and conventions stay
operator-only, so the convention-adherence gap S1 targets stays measurable), and the nine workdoo interview answers. A sonnet
agent restructured each repo into facts, operator and provenance files plus the protocol; the coordinator re-checked the facts
files for tool, process and stack terms and trimmed one stack word. Committed at `f81e0214`. Self-review: maintainer-only
data, no code. Wave 1 is released.

### 2026-10-30 | scope-change | T7 -- the harness files the signed design named join T7's `Layers:`
What broke: T7's G2 design wires the arm check into the trial runner and adds fixtures and a launcher, but promote declared
only `evals/ab/arms/`; merge-check's layers-observed FAILed on T7's commits. Impact: T7's Plan line gains
`evals/ab/lib/arm.ts`, `evals/ab/lib/freeze.ts`, `evals/ab/lib/setup.ts`, `evals/ab/lib/snapshot.ts`, `evals/ab/lib/trial.ts`,
`evals/ab/run-trial.ts`, `evals/ab/selftest.ts`, `evals/ab/setup-a1.ts` and `evals/ab/fixtures/arm-freeze/`. T8 also declares
the whole harness folder but depends on T7, so T7 owns these first; no wave-1 author writes this repo. Re-confirm G2: not needed, the files
are the ones the signed design named.

### 2026-10-30 | scope-change | T5 T6 -- clinic lost-detail facts are partly readable from code; owner accepts it as the clinic's limit
What broke: TASK-539 and TASK-540 box 5 ask for a lost-detail task whose acceptance depends on a fact found only in
`BUSINESS-NOTES.md`. The clinic repo was built test-first from its spec, so every fact in the notes also shows in its code or
tests: the clinic-local display rule, for instance, is in its zone code. The authors found no fully absent fact. Impact: the
box is read as "the fact's statement is notes-only, its behaviour may be partly visible in code" for clinic; the Done-when
text is not reworded. Re-confirm G2: owner ruling by popup (accepted as the clinic's limit, recorded in each batch's notes).

### 2026-10-30 | scope-change | T5 -- the root TypeScript config joins T5's `Layers:` to exclude the stored A/B tasks
What broke: the first copied batch put the clinic app's acceptance tests under the task corpus, and the repo-wide typecheck
compiled them as lean-flow code (they import the app's test runner), so merge-check FAILed with 7 errors. Impact:
`tsconfig.json` gains an exclude for the task corpus; the batches are fixtures of other repos, never compiled here. Re-confirm
G2: not needed, no design change.

### 2026-10-30 | progress | T5 -- clinic batch A verified, signed and committed; all seven boxes ticked
consequence · T5 · behaviour:low · governance:low
The author's four tasks were re-run by the coordinator in fresh baseline copies, each with its own Postgres cluster; all four
went red before the reference and green after, every grader passing (`verify.json`). A first verify run went red on all
sixteen for a harness reason, not a task reason: GNU tar read the drive letter as a remote host. That was fixed and re-run.
Owner realism review signed, with the clinic lost-detail limit accepted (scope-change above). Committed at `5b3f731f`; the batch
folder is marked `-text` so a reference patch keeps its line endings. Self-review: maintainer-only fixtures, no code.

### 2026-10-30 | progress | T6 -- clinic batch B verified, signed and committed; all seven boxes ticked
consequence · T6 · behaviour:low · governance:low
Two of the author's tasks overlapped batch A and were replaced on the coordinator's request: a 17-August closing rule became
a 2-hour booking lead time, and a clinic-local confirmation time became an appointment lookup. Every final task was re-run by
the coordinator in a fresh baseline (verify.json, 4 of 4). Owner realism review signed, including the replacement. Committed
at `ca5769c5`, folder marked `-text`. Self-review: maintainer-only fixtures, no code.

### 2026-10-30 | scope-change | T3 T4 -- workdoo lost-detail facts are partly readable from code; owner accepts it as the workdoo limit
What broke: TASK-537 and TASK-538 box 5 ask for a lost-detail task whose acceptance depends on a fact found only in
`BUSINESS-NOTES.md`. Workdoo's docs are thorough, so the authors found no fully absent fact: both chosen tasks rest on one
statement (date-times shown in UTC, en-GB style) whose wording is notes-only while the behaviour is partly visible in code.
Impact: box 5 is read for workdoo the way it is for clinic; the Done-when text is not reworded. Re-confirm G2: owner
ruling by popup (both batches signed, the shared fact accepted, recorded in each batch's notes).

### 2026-10-30 | progress | T3 T4 -- workdoo batches A and B verified, signed and committed; all seven boxes ticked on each
consequence · T3 · behaviour:low · governance:low
consequence · T4 · behaviour:low · governance:low
Both authors needed Node 24.16+ (the host has 22); the coordinator kept a copy outside the author snapshots and re-ran all
eight tasks in fresh baselines on it, every one red before and green after with its graders (verify.json per batch). The
batch notes record the Node 24 requirement for every later workdoo trial. Owner realism review signed for both.
Self-review: maintainer-only fixtures, no code.

### 2026-10-30 | scope-change | T8 -- T8 starts beside T7: its dependency on T7 is dropped, and T7 keeps the arms folder
What broke: T8 depended on T7 only because T8's harness folder contains T7's arms folder (path ownership), and T7 now waits
on the owner-operated clinic init. Impact: T8's Plan line depends on T3..T6 only (all done); T8 never writes T7's arms
folder, while T7's remaining writes are the clinic arm manifests and configs there. The harness library files T7 changed
are committed, so T8 takes them over from here. Re-confirm G2: owner ruling by popup (start T8 now).

### 2026-10-30 | progress | T8 -- judges, retry, validity and analysis built and fixture-proven; boxes 1 and 3-6 ticked, calibration open
consequence · T8 · behaviour:material · governance:low
A sonnet builder committed `d1b9a98a` (14 files, none in the arms folder, no paid call). The coordinator re-ran the checks:
tsc clean, selftest 30 of 30, the fixture analysis VALID, and merge-check green. Each new rule has a must-FAIL with a green
control (S20..S28), and a real-artifact check built all 96 judge prompts from the 16 real tasks with no arm or lean-flow leak.
Analysis choices are parameters with proposed defaults for the pre-registration. Box 2 (calibration against the owner's read)
waits for a deliberately wrong solution per task and a live, owner-approved judge run. Review: coordinator re-run per the
one-review-per-wave lever (maintainer-only, Other G).
review · T8 · self-review · behaviour:material · governance:low

### 2026-10-30 | progress | revise · T8 -- independent wave review R1 NOT CLEAR on six Highs; one bounded builder retry fired
consequence · T7 · behaviour:material · governance:low
The review-depth check refused T8's self-review record (a material change needs an independent pass), so Codex reviewed
the wave's harness code from `plan_commit` (T7's arm freeze, T8's judges and pipeline; about 1,100 lines). R1 was NOT CLEAR
on six Highs, all confirmed by the coordinator against the rules. A measured D9 run skips the freeze, and a missing
snapshot passes. Short arm ids slip the blindness filter. A missing-usage phase zeroes known spend. Infra keywords in task
prose cause a retry. The expected slots come from the data itself. The primary endpoint used the post-replacement results.
One bounded retry was sent to the T8 builder: all six fixes, each with its own must-FAIL fixture. T6 follows the signed
brief, so the primary endpoint counts the first pass. R2 is the last round and blocks only on an outcome-changing High.

### 2026-10-30 | progress | T8 -- first live calibration: 48 of 64 expected verdicts (75%), below the 80% bar; judges get file context
The coordinator wrote one deliberately wrong solution per task (16, each a single-dimension break). All 16 apply to a fresh
baseline. The owner ruled that their read is the construction: references pass every dimension, and a wrong solution fails
its named dimension. The live run (96 judge calls) matched 48 of 64 expected verdicts. Fifteen of the sixteen misses were
UNKNOWN, and the judges' own reasons name the cause: a diff alone cannot show whether a change follows the repo's
conventions. Owner ruling: judges also see the post-change content of the touched files, capped, with lean-flow docs
excluded for blindness; the prompts are re-hashed and calibration re-runs live. Run 1 is kept as calibration-run1.md.

### 2026-10-30 | progress | revise · T8 -- wave review R2 (final): five of six closed; two outcome-changing Highs left in retry.ts, fixed by owner ruling
The first R2 run died when C: filled up. The owner had the disk cleaned (old session temp, npm and Go caches; tool caches now
go to D: per command), and R2 was re-run. Result: T1, T2, T3, T5 and T6 CLOSED. T4 is still open: a recovered rate-limit
line in the stderr tail still turns a later task failure into infra. T7 is new: the regex in retry.ts holds literal
backspace bytes where word boundaries were meant, so a terminal HTTP 503 is scored as a task failure. The coordinator
confirmed both in the file. The round cap was reached; owner ruling: fix both now, each with a must-FAIL, no further round
(stderr counts only when the run left no result event; real word boundaries, written with the edit tool, never a shell
heredoc).
review · T7 · scoped-reviewer · behaviour:material · governance:low
review · T8 · scoped-reviewer · behaviour:material · governance:low

### 2026-10-30 | progress | T7 -- clinic A1 frozen after the owner's init and clinic A0 built; all four boxes ticked
The owner operated the A1 clinic init through the isolated launcher on Opus 5.5. The coordinator read every popup in the
transcript: seven answers differed from the sheet's "not decided yet", and by owner ruling they became the owner's setup
decisions in the operator file, so the transcript matches the file and A2's setup gives the same answers. The arms builder
committed `ea58cec1` (freeze manifest, declared set of 22 added or modified paths, A0 equal to the pre-init copy plus the
notes, S35). The coordinator re-ran tsc and selftest, 37 of 37. Copying the transcript into the repo was refused by the
permission classifier, because it sits beside a copied credentials file, so it stays outside the repo and its path is recorded in the
tick.

### 2026-10-30 | progress | T8 -- second live calibration: 36 of 36 where a judge ran; 28 workdoo calls failed on the Windows command-line limit
Run 2 used the judge file context (`8d02c88b`) and the fixed retry rules (`a0b61b70`): the coordinator re-ran tsc, selftest
39 of 39, the fixture analysis and merge-check, and confirmed the new must-FAILs and their controls are present. All 32 clinic
rows and the four rows of one workdoo task matched the construction, so the context removed run 1's Unknowns. The other 28
workdoo rows came back UNKNOWN because the judge call failed (ENAMETOOLONG): the prompt, with up to 60 KB of context, was
passed on the command line, which Windows caps near 32 KB. That is plumbing, not judgement. The fix sends judge prompts
on stdin, with a must-FAIL, before run 3. Run 2 is kept as calibration-run2.md.

### 2026-10-30 | progress | T8 -- third live calibration: 85.5% on judged rows, accepted by the owner; box 2 ticked
Run 3 sent judge prompts on stdin (`a69a654a`; the coordinator first checked with one live call that the CLI reads a piped
prompt). 47 of the 55 judged rows with an expectation matched the owner's read, 85.5% against the 80% bar. Fourteen calls on
three workdoo tasks failed with an API error during a transient authentication drop, the same login expiry that ended the
arms builder; the login worked again right after. Owner ruling: accept 85.5% and close box 2. The judged disagreements
(three where the construction may be wrong, three cut off by the 400-line cap, one missed lost-detail fact) and the three
unjudged tasks go to TASK-544 as open lines, since it freezes the prompts and the bar.

### 2026-10-30 | scope-change | T2 -- TASK-558 leaves the sprint with boxes 1-2 ticked; box 3 is met at the next promote
What broke: TASK-558 box 3 (the next real promote that pulls a dependent uses the rule) can only be met at a later promote.
Impact: per the owner's G2 ruling, TASK-558 is scoped out at this close with boxes 1 and 2 ticked; its `sprint:` stamp and its
Members line are removed, and it returns to the backlog to join the next sprint, whose promote meets box 3. Re-confirm
G2: owner ruling at G2 (carry to the next promote).

### 2026-10-30 | progress | close -- system verify found two FAILs: the corpus's app tests ran as lean-flow tests (fixed), and T8's early self-review record
System verify through gate-remote at `a27eeaed`: qa-check 340 pass, 1 fail; bun test 589 pass, 3 fail. The three bun test
failures were the clinic web acceptance tests stored in the task corpus, which `bun test` picked up as lean-flow tests (the
same class as the typecheck exclusion at T5). The test config now ignores the corpus; bun test locally: 589 pass, 0 fail.
The qa-check FAIL is review-depth: the log's first T8 record says self-review against behaviour:material. Two independent
Codex rounds followed it, but the checker examines every self-review line on its own, and an append-only log cannot drop
it. Owner ruling sought.

### 2026-10-31 | close | 7 of 8 members delivered (TASK-536, 537, 538, 539, 540, 541, 543), TASK-558 scoped out; system verify ruled by the owner
Close by reference: the seven delivered members are in `done/`, and TASK-558 left by its scope-change
(`check-sprint-by-reference --close` 17/0). System verify through gate-remote at `a27eeaed`: qa-check 340 pass, 1 fail;
bun test 589 pass, 3 fail. The three test failures were the corpus's app tests run as lean-flow tests, fixed in `bb7c91fd`
(local bun test 589/0). The one qa-check FAIL is review-depth on T8's first record, a self-review line written before the
wave review; two independent Codex rounds followed it, recorded as scoped-reviewer. Owner override (ADR-021): the FAIL is
surfaced, the independent review is on record, and the checker fix is filed as TASK-559 (L-268). Handoff reconciliation: no
`handoff` entry in this log. Retro buckets filed. Doc freshness: CONTEXT.md's triggers did not fire (roster, loop, gates and
modes unchanged; promote's dependent rule lives in its procedure reference); README names no promote detail. Epic rollup:
SPRINT-151's EPIC-023 row is completed at archive; Closed-when line 1 (S0) stays open on TASK-544 and TASK-545.
