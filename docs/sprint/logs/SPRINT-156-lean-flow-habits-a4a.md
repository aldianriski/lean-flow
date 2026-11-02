---
sprint: 156
slug: lean-flow-habits-a4a
owner: Maintainer
last_updated: 2026-11-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-156 — Execution Log

> Append-only companion to [`../SPRINT-156-lean-flow-habits-a4a.md`](../SPRINT-156-lean-flow-habits-a4a.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-02 | promote | plan locked, governance signed, four members: three lean-flow fixes and arm A4a
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Census 256 headings = 224 promoted + 31 active + 1 superseded; no active entry at count 2 or more.
- ☑ TD aging: 103 open, 102 aged against sprint 156 (created at 153 or earlier); TD-285 is new (155). Second route, by severity:
  59 low + 24 minor + 15 medium + 5 trivial = 103. No `high` row.
- ☑ doc-aging, §11: nothing pruned. Every closed task of sprints 152 and 153 keeps a live citation (`git grep -w`, archive and
  the work store excluded: 1 to 7 files each). No CHANGELOG rotation (no new MINOR), no LEARNINGS collapse due.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only).
- ☑ epic rollup currency: EPIC-023 current (checker PASS). ☑ epic coverage: 2 open, both covered (S3 → TASK-573..576, S4 →
  next slice). ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: TASK-573, 575, 576 and 574, stream s3-expertise, the only active sprint. All four `ready`, origin
decomposer, size M, no `L`. Epic: EPIC-023 (S3, D11 and D12).
promote-check: 13 pass, 0 fail.

### 2026-11-02 | scope-change | T1, T2: box 1 of TASK-573 and TASK-575 names the cause from the kept streams, not a fresh run
What changed: G2 recon found every measured session's streams kept in `D:\ab-work\kept\` (phase 1, revise, phase 2), all nine parked
sessions included; TASK-573's line that they were swept was wrong (the coordinator looked in the wrong directory). The streams
already show the cause: the first design adds assertions to `scripts/verify-*.mjs` and lists the task file, G2's scope check
refuses them (82 of 93: 45 tests, 35 docs, 14 the task file alone), the revise round drops the tests and promises a throwaway
probe "outside the repo", and the build writes it to the OS temp folder, which parks a headless run. Owner ruling by popup: box 1
of both tasks names and quotes the cause from the kept streams; a fresh park would take about ten paid runs to reproduce. Impact:
box 1 wording only; box 2 (fresh re-runs prove the fix) and box 3 are unchanged. G2 re-confirmed with the designs.

### 2026-11-02 | scope-change | T3, T4: TASK-576 cancelled at G2; arm A4a bundles TASK-573 and TASK-575
What changed: G2 recon of A2's kept streams. The design phase is already lean (about 15 turns, no plugin reads, no sub-agents);
the cost above A0 comes from the trial protocol running design, revise and build as separate resumed sessions (the build phase
starts at a median 66.5k tokens of carried context against A0's 22.7k). A lean-flow light path cannot remove the protocol's design
phase, so A4a could barely measure it; fix 2 removes the revise round, the largest measured cost. Owner ruling by popup: TASK-576
moves to `cancel/` with a `.out-of-scope/` entry, and A4a pins the commit carrying TASK-573 and TASK-575 (EPIC-023 D13). Impact:
T3 leaves the Plan; T4 depends on T1 and T2; D1 and D2 read T1 and T2. Probe rule for T1 (owner ruling): prefer the repo's
existing runners; a check that needs a script keeps it inside the working tree and deletes it before the report; never a system
temp dir; otherwise the criterion is ticked on judgment and says so.

### 2026-11-02 | progress | G2 designs drafted; builder check on T1, T2, T4 (Codex readers), findings settled
Each design went to a fresh Codex reader with its frozen Done-when and touched paths. All three returned findings, all facts or
contradictions, settled by the coordinator: the Plan prose for T1, T4, D1 and D2 now matches the scope-changes (kept streams; two
fixes, pin after T2); the re-run population is the four distinct workdoo tasks with a scored park plus clinic appointment-lookup,
and a run counts only if it reaches the build; T1's verifier reads the scratch rows' exit plus a stream scan with unclassifiable
commands listed, never passed; T2's verifier reads `(g2.firstRound ?? g2).scope`; T2's doc clause includes behaviour-required
docs and the pin-first qualifier lands on both SKILL.md lines; `--comparator` leaves the cost ratio against A1; the park rate is
reported over scored slots; the five development runs are not A4a trials and Amendment 7 discloses them.
builder-check · T1 · 2 contradictions · 5 questions · settled: Plan prose, re-run population, verifier boundary, build-reach rule
builder-check · T2 · 2 contradictions · 3 questions · settled: doc clause, firstRound read, pin-first on both lines, population
builder-check · T4 · 2 contradictions · 3 questions · settled: cost ratio vs A1, park-rate denominator, development runs disclosed

### 2026-11-02 | progress | batch G1 and G2 signed for T1, T2, T4 (owner, by popup) at 7f770538
G1 by fast-path (origin decomposer; the scope moved only by the two owner-ruled scope-changes). G2 on the settled designs.
Order: T1, then T2 (shared `skills/` and `CHANGELOG.md`), then the five development re-runs, then T4.

### 2026-11-02 | progress | T1: cause named from the kept streams (box 1); rule landed in orchestrator/SKILL.md (box 3 CHANGELOG)
Evidence, all nine parked sessions' kept streams (six scored, three voided A1 pilot attempts). Each scored park follows one chain.
Phase 1's design adds assertions to `scripts/verify-*.mjs`, from SKILL.md's "a change to working behaviour opens with its pin".
G2's scope check refuses it (outside the task's layers). The revise round drops the tests and writes, in its own words, "The
evidence will come from a throwaway script I run from the OS temp folder, outside the repo" (iso-cs4n9X) and "I'll check the rule
with a throwaway HTTP probe ... The probe lives in the OS temp folder and is never committed" (iso-XlJw7m). The build then says
"Next is the out-of-repo probe for the new rule" (iso-XlJw7m) and writes `probe.mjs`/`check.mjs`/`check.ts` to `%TEMP%`, or a
`mktemp -d` heredoc (iso-mBpUkJ), and the CLI's permission prompt parks the run. No lean-flow sentence names the temp folder: the
SKILL.md Reachability rule ends at "the criterion stays a judgment tick and says so", and the build is told to touch only its
`Files:` list, so the model's own default puts the probe outside the repo (the box's "model's own default" branch). Fix
(`ca13d54e`): that Reachability line now says evidence comes from the repo's existing runners first and a throwaway probe lives
inside the working tree, deleted before the report, never in a system temp dir; SKILL.md stays at 140 lines, density baseline
unchanged (13). CHANGELOG [Unreleased] carries it. Box 2 waits for the shared re-run batch after T2.
consequence · T1 · behaviour:material · governance:low

### 2026-11-02 | scope-change | T1: Layers names TASK-573's own member file in each status folder
What changed: two commits under a `T1` subject moved and ticked TASK-573 (`f6e85058`, `29677d14`), and `layers observed` reads a
Tn commit against that Tn's `Layers:`, which did not list the member file. Ticks and moves are coordinator bookkeeping and later
ones carry `sprint(156):` subjects; these two stay as written (`ca13d54e` between them is cited), so T1's `Layers:` gains
`docs/work/todo/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md`,
`docs/work/in_progress/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md` and
`docs/work/done/TASK-573-stop-headless-sessions-parking-on-out-of-tree-probes.md`, as SPRINT-154's T1 did. Impact: none on scope.

### 2026-11-02 | progress | T2: cause named from the kept streams (box 1); rule landed in orchestrator/SKILL.md (box 3 CHANGELOG)
Evidence, the 93 measured A1/A2 sessions' kept streams and rows: 82 first G2 designs failed the scope check; outside the layers
were tests in 45 (assertions added to `scripts/verify-*.mjs`), docs in 35 (acceptance criteria, flow docs, requirements,
BUSINESS-NOTES.md), the task file alone in 14, other code in 2. The skill text behind them: SKILL.md's "a change to working
behaviour opens with its pin" and "adds a pin first, whatever its route" (no layer bound), and no rule on what a design's file
list holds, while the trial prompt asks for "every file you will touch", so the session lists the task file it will tick and the
docs it habitually refreshes. Fix (`56964ce2`): the G2 Approach line now says the file list holds only what the change needs, inside
the declared layers, with ticking as bookkeeping and docs only when the task or the change's behaviour needs them; both pin-first
clauses are bound to the declared layers, a pin outside them named as an open point. SKILL.md stays at 140 lines, density
baseline 13. Box 2 waits for the shared re-run batch, which starts now (the plugin pin for it is this commit).
consequence · T2 · behaviour:material · governance:low

### 2026-11-02 | progress | development re-runs (5, scratch log, never a measurement): T1 box 2 and T2 box 2 pass
Plugin pinned at `56964ce2` (a clone), arms `workdoo-dev156`/`clinic-dev156` on research copies of the A2 snapshots
(`D:\Research\dev156\`, manifest drift 0), `run-trial.ts --measured --protocol d9` into a scratch log whose freeze line equals
A2's. Tasks: self-onboarding-guard, reissue-invitation, pilot-seat-limit, access-activity-type-filter (workdoo) and
appointment-lookup (clinic), one run each; every run reached the build. Results: 5 of 5 exit ok and pass every grader; first G2
scope check passes in 5 of 5 (82 of 93 failed in A1/A2); 0 parks. Verifier (scratch `verify.py`: row exit plus a stream scan for
Write/Edit paths outside the trial copy and temp markers in shell commands), proven first on A2's log, where it flagged all three
parks. That control also showed the habit was wider than the parks: sessions writing a probe outside the repo were A0 3 of 49,
A1 33 of 61, A2 18 of 32 (most by Bash, which raises no prompt). On the re-runs it flagged one command, read by hand: reissue-
invitation piped its probe to `node` over stdin ("so no extra file gets written into the repo"), and only the probe's runtime
database sat in `os.tmpdir()`, as the repo's own verify scripts do; no file was written outside the tree and nothing prompted.
Cost, these five tasks: $7.62 against A2's per-task means summing to $11.52. Development evidence only; A4a measures it.

### 2026-11-02 | progress | T4: A4a arm files and `analyze.ts --comparator` (Codex-built) landed; Amendment 7 drafted
Arm files (`a7867e8a`): `workdoo-a4a`/`clinic-a4a` on A2's snapshots, manifests byte copies of A2's (same sha256), plugin pinned at
`56964ce2` (drift 0, pin verified), `schedule-a4a.json` (A2's 32 slots renamed), `hash-prereg.ts` pins them. Against A2's pin the
plugin differs in 11 skill files: the two orchestrator edits under test and ten lean-doc-generator template/init files from
SPRINT-155; in all 32 A2 sessions the only skill invoked was the orchestrator and no plugin file was read, so the ten are not
expected to reach a trial (stated in Amendment 7). `--comparator` was built by Codex in a worktree (82.8k Codex tokens), reviewed
by the coordinator (a small diff, the same recipe as `deltaVsA1`, nothing above line 134 touched), landed with equal blobs.
Selftest 75/75 here (Codex's sandbox showed S43 failing on process-tree cleanup, a sandbox limit); tsc clean. Must-FAIL: a
baseline computed from A1 instead of the comparator reddens S70 alone. Next: Codex review of Amendment 7, then the owner signs.
review · T4 · self-review (coordinator; diff +103 lines, execution piece, Codex-built) · behaviour:low · governance:low

### 2026-11-02 | review | T4: Codex R1 and R2 on Amendment 7; one Med ruled by the owner; Amendment 7 appended, awaiting signature
R1 (78.2k Codex tokens): two Med. Item 8 had not reconciled section 18's R-c with the five development runs nor said how a ruling
reads after tuning on five tasks; item 2 named other-skill calls but no consequence for attribution and missed direct reads. Both
revised: the runs postdate Amendment 6's recorded hash, a secondary on the eleven untouched tasks is reported; exposure (any other
Skill call or read of the ten changed files) is measured from the kept streams and, if above zero, the ruling is stated for the
A4a plugin against the A2 plugin. R2 (42.9k): item 2 closed; one Med left on item 8 (the five tuned tasks still count in the
decisive ruling). Stop rule reached; owner ruling by popup: the sixteen-task ruling decides, and a ship-eligible A4a whose gain on
the eleven untouched tasks is below +0.10 is reported "ship-eligible, tuning-sensitive" and does not ship under D6 without the
owner's ruling. Amendment 7 appended (CRLF); the document's sha256 is recorded at signature.

### 2026-11-02 | progress | T4: Amendment 7 owner-signed; A4a log created with its freeze line
The owner signed Amendment 7 by popup. `docs/research/logs/ab-measurements-a4a.md` created, frozen 2026-11-02T06:10:41Z, sha256 `937e9855...3e03` at
`5339c67c`; the harness reports no freeze problem. Next: the owner runs the A4a pilot (2 slots) in their own terminal.

### 2026-11-02 | progress | T4: A4a pilot done (2 of 2 scored, both pass); owner approves the remaining 30
workdoo-a4a access-activity-type-filter: G2 passed on the first round, every grader pass, convention/business/scope PASS, $1.46,
156 s. clinic-a4a appointment-lookup: same, $1.49, 151 s. Both rows pin `56964ce2`. A2's pilot on the same two slots cost
$2.26 and $1.98, and its workdoo slot needed a revise round. The owner approved the full run by popup before the pilot ended.
