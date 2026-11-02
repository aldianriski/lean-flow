---
sprint: 158
slug: s3-bundle-2
owner: Maintainer
last_updated: 2026-11-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-158 — Execution Log

> Append-only companion to [`../SPRINT-158-s3-bundle-2.md`](../SPRINT-158-s3-bundle-2.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.

### 2026-11-02 | promote | plan locked, governance signed, five members: parallel trials, three fixes and their arm
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. 258 headings; 32 active by block (33 by first status tag, two headlines quote a status); no active
  entry at count 2 or more.
- ☑ TD aging: 104 open, 103 aged against sprint 158 (created at 155 or earlier); TD-286 is new (156). By severity: 60 low + 24
  minor + 15 medium + 5 trivial = 104. No `high` row.
- ☑ doc-aging, §11: nothing pruned, no CHANGELOG rotation (no new MINOR), no LEARNINGS collapse due.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only).
- ☑ epic rollup currency: EPIC-023 current (`check-epic-archive.ts` PASS). ☑ epic coverage: 2 open, both covered (S3 → TASK-581,
  583, 584, 585; S4 → next slice). ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: TASK-582, 583, 584, 585 and 581, stream s3-expertise, EPIC-023 (S3). No `L`. TASK-582 and TASK-581 set
`ready` (A4a ruled, D15); TASK-581's order inside the sprint is its Depends-on (T5 after T1-T4).
Renumbered before promote (owner ruling): bundle 2 was filed as TASK-577..580, ids the parallel stream SPRINT-157 (stream
verification, branch `sprint-157-reusable-verification`, unmerged) had taken at 12:40; they are now TASK-582..585 (`0a0ef79e`).
This sprint is 158 for the same reason: SPRINT-157 exists on that branch.
promote-check: 16 pass, 0 fail.

### 2026-11-02 | scope-change | T1, T3: TASK-582 box 2 states how a stop treats a running trial; TASK-584 adds the outside-tree case
What broke: G2's builder check found TASK-582 box 2's "owner stops ... stopping every worker" silent on a trial already running
when another worker hits a stop, and TASK-584's evidence (A4a's one park) is a session deleting a system-temp directory the
repo's own test made, outside the working tree, which box 1 does not cover and box 2's "any A4a slot that breached on a check
artifact" does not reach (no A4a slot breached on one; the forecast-month-end scope FAIL is a code-scope judgment).
Impact, by owner ruling at G2 (popup, 2026-11-02): TASK-582 box 2 reads that no worker starts another slot and a running trial
finishes and records its row. TASK-584 box 1 adds that what the repo's own tests leave outside the working tree is named in the
report, never deleted; box 2 adds one development run on workdoo reissue-invitation ending with no popup. Re-confirm G2: signed
in the same popup.

### 2026-11-02 | gate | G1 and G2 signed for all five tasks (owner popup); builder check on T1-T5 settled
G1: scope unchanged since approval for TASK-581, 582, 584 and 585 (TASK-583's G1 signed at `12ae19fc`). G2, owner rulings:
Amendment 8 rules bundle 2 against A4a by non-inferiority (the gain's 90% lower end above -0.05, no symptom regression, not
below A0, cost within 2.0x A1; business and scope reported), because A4a's 90.6% leaves at most +9.4 points of gain (L-279);
T3 takes the outside-tree case (scope-change above); a stop lets running trials finish. Settled from the builder check:
- T1: capacity check on 2 tasks x 2 trials (one task per repo whose two A4a trials both passed), compared slot by slot with
  those serial trials; the sweep test spawns a real second process as the live owner; N = 1 is checked against the old loop on
  rows, stop code and say-lines (the sweep's ownership rule is box 1's own change); a reused pid errs to keeping a directory;
  box 4 ticks when Amendment 8 (shared with T5) is signed.
- T2: the evidence is T4's two workdoo development runs, real tasks completed with the changed skill (the copy has an active
  sprint and epic), their Progress figures read against those files; a miss is fixed by replacing words, never adding a line.
- T3/T4: both extend existing lines (Reachability, Approach), so SKILL.md stays at 140 lines and 13 dense lines (`check-prose-
  density`); the coordinator launches the development runs; a run that misses the fact is a result to report, one wording
  revision at most, then the owner rules; invitation-issued-by need only name the locale fact, not pass.
- T5: the same slot set as A4a (task, trial, order; compared, not rebuilt), the development runs disclosed, validity first,
  the pin at the commit after bundle 2; Amendment 8 is the next number (7 is the last).
builder-check · T1 · 4 contradictions · 5 questions · settled by fact and one owner ruling (stops)
builder-check · T2 · 3 contradictions · 3 questions · settled by fact (workdoo runs as real input; cap by replacement)
builder-check · T3 · 2 contradictions · 2 questions · settled by owner ruling (outside-tree scope-change) and fact
builder-check · T4 · 3 contradictions · 5 questions · settled by fact
builder-check · T5 · 4 contradictions · 5 questions · settled by fact and one owner ruling (non-inferiority)

### 2026-11-02 | progress | T3, T4: skill text landed; T4's cause named from A2's kept streams; development runs wait for T1
T3 (`36054061`): the Reachability line's probe sentence goes on: anything else a check creates in the working tree is removed
before the report unless declared; what the repo's own tests leave outside it is named, never deleted. T4 (`d09db7f5`): a new G2 box,
"Business facts" (the design names each stated fact it touches and how it honours it; a fact wins over the neighbouring code);
two lines of the continuation-contract paragraph joined, words unchanged, so SKILL.md stays at 140 lines; dense lines 13 of 13.
T4 cause (TASK-585 box 1), from A2's kept streams (pin `lean-flow-s1-82990174`): invitation-issued-by `iso-pHKUKD` and
`iso-ZTaJYd`, self-onboarding-guard `iso-JM0yW0` and `iso-yPPt1S`. In all four the design phase never opened `BUSINESS-NOTES.md`
(it appears once, in a grep's file list); the designs read the task file, the code and the API contract. invitation-issued-by's
build reused the neighbouring `formatDate` helper (`'en'`) over fact 14 ("users see dates and times in UTC (en-GB style)");
self-onboarding-guard searched the code for intake and responsibility and never met fact 6 ("The intake creator is initially
available for all three preparation responsibilities"). No lean-flow sentence sent the design to the business facts.
Development runs (T3 clinic appointment-lookup and workdoo reissue-invitation; T4 the two tasks above, which also give T2 its
real input) start after T1's ownership-safe sweep lands.

### 2026-11-02 | progress | T1: safe sweep and --workers N landed (Codex-built, Claude-reviewed in two rounds)
Codex built TASK-582 boxes 1 and 2 in a worktree (`sprint158-t1`). Round 1: `makeIsolation` writes `owner.json` before the dir
is published; `sweepStale` sweeps only dead owners and legacy dirs, keeping live or uncertain pids; `runBaseline` takes
`--workers N` (default 1), a stop drains running trials and the first stop wins. Claude's review found one defect: at N = 2 the
worker that finished the first pilot slot started slot 3 while slot 2 was still running, spending a non-pilot slot before the
owner's pilot review. Round 2 holds non-pilot dispatch while any pilot slot runs (an unscored pilot still continues as the
serial loop would); S76 proves it and fails on round 1. Selftest 81/81 outside Codex's sandbox (S43 fails only inside it, a
known sandbox limit), tsc clean. Codex 136.9k tokens over two rounds. Landed as `15012173`; boxes 1 and 2 ticked.
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped outside review (Claude reviewing the Codex build, 2 rounds, 1 finding fixed) · behaviour:material · governance:low

### 2026-11-02 | progress | T1 capacity check at N = 2; T3/T4 development runs; T4's one wording revision; T2's evidence path fails
Capacity check (TASK-582 box 3), N = 2, A4a's arms and pin, 4 slots into a scratch log: workdoo access-activity-type-filter and
clinic patient-cancel-all, trials 1 and 2. The pilot stopped after its 2 slots, which ran at once (exit 10); the restart ran the
other 2 at once (exit 0). All 4 ok, graders and business judge PASS, as in A4a's serial trials of the same slots; no timeout, no
infra attempt, no low-memory kill. Wall 169/217 s and 258/134 s (A4a serial 156/152 and 119/121); cost 1.55/1.49 and 1.61/1.36
USD (A4a 1.46/1.54 and 1.38/1.45). Elapsed 13.3 minutes for 4 slots including the pilot stop. Awaits the owner's reading.
Development runs (pin `11c768c3`, research copies `D:\Research\dev156\`, scratch log): invitation-issued-by, self-onboarding-guard,
clinic appointment-lookup and workdoo reissue-invitation all ok and passed, no popup, no park, scope PASS; business PASS on all
four; reissue-invitation's convention judge UNKNOWN. T4: the invitation-issued-by design names the en-GB fact and says it wins over
the neighbouring `formatDate` (`iso-RyvHro`); the self-onboarding-guard design takes duty holders "from the current configuration"
and names no fact 6 (`iso-9NayTL`), and neither design opened `BUSINESS-NOTES.md`. One wording revision, as G2 allows (`a9b7097f`):
the box now says the design reads the stated facts first. Re-run of self-onboarding-guard on pin `a9b7097f` in progress.
T2: the evidence G2 chose does not work. The trial tasks are not members of workdoo's sprint, so a report cannot carry its sprint
or epic figures; one of the four final reports printed a `Progress:` line, counting checks. A different real input needs the owner.

### 2026-11-02 | gate | owner rulings on T1's capacity check, T3, T4 and T2's real input (popup)
T4's re-run on pin `a9b7097f` (`iso-PtJHOH`) parked: its design named no business fact and never opened `BUSINESS-NOTES.md`
though the box's text was in its context, and its build tried `rm -rf` on a system-temp directory the repo's own test made, in
the same command that removed its own in-tree probe (the outside-tree clause was in context through `--resume`). Rulings:
- T1: the capacity check is accepted (TASK-582 box 3); Amendment 8 adopts N = 2 for later arms.
- T4: TASK-585 box 3 is half met by owner ruling: the locale fact named (`iso-RyvHro`), fact 6 missed in both self-onboarding-guard
  runs (`iso-9NayTL`, `iso-PtJHOH`). The rule stays; bundle 2's arm measures it. No more development spend.
- T3: TASK-584 box 2 is ticked as written (clinic appointment-lookup clean, reissue-invitation no popup); the counter-run above is
  recorded, and the arm's park rate measures the outside-tree clause against A4a's 1 of 32.
- T2: the evidence G2 chose (workdoo runs) cannot carry sprint figures; replaced by a headless run of the pinned changed skill in a
  lean-flow worktree completing one real step of this sprint (TASK-584's last box), its Progress line read against SPRINT-158
  and EPIC-023.
