---
sprint: 160
slug: s3-bundle-3
owner: Maintainer
last_updated: 2026-11-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-160 — Execution Log

> Append-only companion to [`../SPRINT-160-s3-bundle-3.md`](../SPRINT-160-s3-bundle-3.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-02 | promote | plan locked, governance signed, four members: quoted business facts, no delete outside the tree, release worker count, storm copy
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (no active entry at count 2 or more).
- ☑ TD aging: 106 rows, 105 open and 1 resolved (TD-285 → TASK-596, deletion clock not due); none `high` (62 low, 24 minor,
  15 medium, 5 trivial); no escalation.
- ☑ doc-aging, §11: nothing pruned, no CHANGELOG rotation (no release since SPRINT-159), no LEARNINGS collapse due.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only).
- ☑ epic rollup currency: EPIC-023 current (`check-epic-archive.ts` PASS). ☑ epic coverage: 2 open, both covered (S3 → TASK-587,
  588; S4 → next slice). ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: TASK-587, 588, 586 (EPIC-023) and 595 (no epic, D7); stream s3-expertise. All size S, no `L` to split.
Status moves in `801bce52`. Shared file `skills/orchestrator/SKILL.md` sits at 140 of ~140: T1 then T2, replace not add (D2, D6).
promote-check: 13 pass, 0 fail (two Layers findings on prose mentions fixed first: T1 cites the A/B repo's business-notes file, T4's WHY reworded).

### 2026-11-02 | gate | G1 and G2 signed for T1-T4 by owner popup; rulings on T1's evidence, T3's outcome rule and T4
G1 (full checklist; every member is `origin: manual`): all size S, files as in each `Layers:`, out of scope as § Scope says, every
`Assumes` confirmed (TASK-587: invitation-issued-by fails its business judge in both A4b trials, `ab-measurements-a4b.md`; TASK-588:
A4a 1 park of 32, A4b 0; TASK-586: TASK-581 done; TASK-595: commit `94248e54` records the copy as scanned for `/council`).
G2 designs (scratch `g2/design-T1..T4.md`, settled after the builder check):
- T1: line 48 of `skills/orchestrator/SKILL.md` rewritten in place: the design opens the business-facts source (the profile's
  pointer, the requirements and business-notes files) and quotes, for each fact it honours, the fact's line, then says how it
  honours it (carried from TASK-585 on purpose); a design that names no fact says which sources it opened; a fact beats the
  neighbouring code. Ruling: box 2 means each run quotes its own task's fact, fact 6 in self-onboarding-guard (`BUSINESS-NOTES.md`
  line 62) and the en-GB fact in invitation-issued-by (fact 14, line 70).
- T2: line 126 rewritten in place after T1's commit (line re-derived at edit time): when the build cleans up, no delete command
  names a path outside the working tree, not even in the command that removes its own in-tree files; such a path is reported, not
  removed, and named in the report. Box 2 judges the build's own commands, not a repo test's teardown.
- T1+T2 evidence: one pinned clone at T2's commit, one parallel `run-dev.ts` batch of 5 (self-onboarding-guard x2, shared by both;
  invitation-issued-by x1; reissue-invitation x2), streams read. A miss allows one wording revision; only the missing runs re-run.
  Claude builds (one-line skill edits, decision-class, D5); one Codex read-only review of both diffs.
- T3: capacity check at N = 3 (6 slots) and N = 4 (8 slots), tasks A4a passed in both trials (Amendment 8 item 8: 24 of 24 slots on
  12 untouched tasks), A4a's arms and pin, scratch schedule and log, a free-RAM sampler beside the driver, PC otherwise idle (D4);
  the pilot stop restarts as at N = 2. Ruling: an outcome is unchanged when exit class, graders and business verdict all match A4a's
  serial trial of that slot; a difference makes that N unclean unless the owner rules it noise from the stream. Amendment 9 adopts
  the highest clean N, owner-signed before the release arm; if neither is clean, no amendment and box 2 goes to an owner ruling.
- T4: ruling, move it out with git history only: `git rm -r docs/research/storm/`; `council-improvements.md`, `loop-hygiene-prd.md`
  (inline, no line added) and `adopter-folder-audit.md` (F10) point to commit `94248e54`; knowledge index regenerated before the gate.
builder-check · T1 · 3 contradictions · 4 questions · settled: box 2 read by owner ruling; the carried clause stated; facts confirmed
builder-check · T2 · 1 contradiction · 3 questions · settled: "in the report" kept; line re-derived at edit; build's commands only
builder-check · T3 · 2 contradictions · 5 questions · settled: outcome rule by owner ruling; slot set and pilot restart from records
builder-check · T4 · 4 contradictions · 4 questions · settled: owner ruling; inline edit to the third citing doc; index before gate
Cost stated and accepted: dev batch about 8-10 USD and 15 minutes, non-blocking; T3 about 21 USD and 30-40 minutes, PC idle.
Order: T4, then T1, T2 and their batch, then T3.

### 2026-11-02 | scope-change | T4: `Layers:` drops `evals/`
What broke: the move-out ruling changes nothing under `evals/`; the research fixtures build their own `storm` folder in a temp
directory. Impact: an unused token would fail `layers observed` at close (L-240). T4's Plan line now reads `docs/research/`. No
Done-when changes. Re-confirm G2: covered by the signature above.

### 2026-11-02 | progress | T4 done: the storm copy left the repo; T1 and T2 skill text landed; their development batch running
T4 (TASK-595): `03289603` removes `docs/research/storm/` (git keeps it at `94248e54`) and points `council-improvements.md`,
`loop-hygiene-prd.md` (inline, still 140 lines) and `adopter-folder-audit.md` (F10 resolved) there. The knowledge index,
regenerated in a clean worktree, came out unchanged (its two "storm" hits are "brainstorming"). Gate: a local run in the main tree
read the untracked `docs/research/plugin-reference-delta.md` (not this sprint's; prose-density and a stale index) and ran past
the 520 s budget, so the verdict is the off-host one: `gate-remote.ts` on `03289603`, QA-CHECK 476 pass, 0 fail. Both boxes
ticked; moved to `done/`.
consequence · T4 · behaviour:low · governance:low
review · T4 · self-review (citation edits and a deletion; no shipped text) · behaviour:low · governance:low
T1 (`00cfff0b`) and T2 (`4c840af5`): lines 48 and 126 of `skills/orchestrator/SKILL.md` rewritten in place, 140 lines,
`check-doc-caps` PASS; one CHANGELOG `[Unreleased]` bullet each. Pin: clone at `4c840af5` in
`D:\Research\ab-pins\lean-flow-160-4c840af5`, content hash `83910f77…`; a scratch arm (A2's snapshot, A4b's manifest, this pin,
the measured inventory) and a scratch log under A4b's freeze line. Two launches failed before any trial started (an arm JSON
escape, then the missing inventory file): no spend. Batch A (self-onboarding-guard, invitation-issued-by, reissue-invitation)
and batch B (self-onboarding-guard, reissue-invitation) run at two workers on research copies `D:\Research\dev156\`.
consequence · T1 · behaviour:material · governance:low
consequence · T2 · behaviour:material · governance:low

### 2026-11-02 | progress | T2 done on real input; T1's first batch misses the target facts, one wording revision, re-run
Development batch on pin `4c840af5` (5 runs, two workers, 16:34-16:54 UTC, 8.08 USD): all `ok` and passed, 0 parks, 0 permission
denials. Streams read with a scratch extractor (design text, every delete command, denials).
- T2 (TASK-588) box 2 met: reissue-invitation `iso-2Yd7Wk`, `iso-4xA0A8` and self-onboarding-guard `iso-sISj5b`, `iso-wHKhSk`; the
  only delete was `Remove-Item scripts/probe-reissue.tmp.mjs`, inside the tree. Ticked; `done/`.
- T1 (TASK-587) box 2 not met: every design quoted fact lines verbatim and named its sources (SPRINT-158's opened none), but 0 of 3
  quoted the target fact. Self-onboarding-guard `iso-sISj5b` opened `BUSINESS-NOTES.md` and quoted four other facts, not fact 6;
  `iso-wHKhSk` opened only `docs/product/requirements.md` and `.claude/CONTEXT.md`; invitation-issued-by `iso-oVe5ky` quoted facts
  2, 3, 7 and R12, not the en-GB fact 14.
- The one wording revision G2 allows (`2249c701`): the design opens each facts source, reads every fact in them, and quotes every
  fact the change touches; still 140 lines, cap PASS. Box 1's words stay verbatim. Pin `D:\Research\ab-pins\lean-flow-160-2249c701`
  (hash `83f75809…`); only the three missing runs re-run.
review · T2 · scoped outside review (Codex, read-only, 1 round, CLEAR) · behaviour:material · governance:low

### 2026-11-03 | gate | T1 done by owner ruling on box 2; follow-up TASK-597 filed; T3 starts
Revision runs on pin `2249c701` (3 runs, 17:02-17:08 UTC 2026-11-02, 4.83 USD; development total 12.91 USD): all `ok` and passed,
0 parks, every delete inside the tree. Invitation-issued-by `iso-DQY8DN` quotes the en-GB fact verbatim (business rule 14) and
says it wins over the neighbouring `formatDate`; self-onboarding-guard `iso-sFQB2S` quotes fact 6 verbatim; `iso-gJqQ1a` searched
file contents for "business-notes", never matched `BUSINESS-NOTES.md` by name, and wrote that the repo had none.
Owner ruling (popup): TASK-587 box 2 met in substance; ticked, `done/`. Follow-up TASK-597 (backlog, EPIC-023, `origin: manual`):
the design finds the facts sources by file name before saying one is absent. Codex round 2 on the revision: CLEAR (6.0k tokens).
review · T1 · scoped outside review (Codex, read-only, 2 rounds, CLEAR both) · behaviour:material · governance:low

### 2026-11-03 | gate | T3 capacity check: no clean N above 2; owner rules N = 2 stands, no amendment; TD-289
Capacity check (TASK-586), A4a's arms and pin, scratch schedules and logs no analysis reads, a free-RAM sampler every 5 s, PC
otherwise idle (D4). Tasks A4a passed in both trials: workdoo access-activity-type-filter and shared-auth-failure, clinic
patient-cancel-all and confirmation-time. Each N stopped at its 2-slot pilot and was restarted.
- N = 3 (6 slots, 01:27-01:43 UTC, 8.54 USD): 0 timeouts; 1 infra attempt (patient-cancel-all #2, `provision-failed: pg_ctl start:
  exit 1`; its retry passed); 0 low-memory kills; lowest free RAM 375 MB, during the 2-slot pilot; 6 of 6 outcomes as A4a's serial
  trials (ok, graders pass, convention, business and scope PASS).
- N = 4 (8 slots, 01:43-01:57 UTC, 10.85 USD): 0 timeouts; 1 infra attempt (confirmation-time #1, same `pg_ctl start` failure;
  retry passed); 0 low-memory kills; lowest free RAM 1,971 MB; 2 changed outcomes: patient-cancel-all #2 `scope-breach` (a
  `.pgdata/` directory left in the tree) and access-activity-type-filter #2 business UNKNOWN (A4a PASS).
- Low-memory kills checked two ways: no exit without a scored attempt other than the two provisioning failures, and no
  `Resource-Exhaustion-Detector` event in the System log for the window. Free RAM was 2.27 GB before the first trial.
Both infra attempts came when two clinic slots began provisioning together; A4b at two workers had none in 32 slots. Owner
ruling (popup): TASK-586 box 1 read; box 2 ticked by ruling: no clean N above 2, so no Amendment 9 and Amendment 8's N = 2 stands
for the release arm. TD-289 filed (the concurrent clinic Postgres start). When the release arm's amendment is written, it
discloses this check as Amendment 8 disclosed the N = 2 one.
consequence · T3 · behaviour:low · governance:low
review · T3 · self-review (measurement and an owner ruling; no file in the Plan changed) · behaviour:low · governance:low

### 2026-11-03 | progress | system verify green after two close-time fixes; every member in done/
`check-sprint-by-reference.ts --close`: 10 pass, 0 fail (all four in `done/`, every `## Done when` unchanged since `3bacd634`).
System verify, off-host `QA_FULL=1` at `e54a60cd`: 477 pass, 2 fail. (1) prose-density: lines 48 and 126 of
`skills/orchestrator/SKILL.md` had passed 400 characters (15 dense lines against a baseline of 13); both trimmed with the same
rule (`e2058cae` T1, `3a0e377e` T2; 382 and 396 characters, 140 lines). The trims came after the development runs and the Codex
rounds, which saw the longer wording; no rule was dropped (open each source, read every fact, quote every fact the change
touches; no delete outside the tree, reported not removed). (2) layers completeness: TASK-595's tick evidence named the gate
script, read as a touched file; the evidence now names no script. Re-run at `e5d1d568`: QA-CHECK 479 pass, 0 fail.
