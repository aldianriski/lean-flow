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
