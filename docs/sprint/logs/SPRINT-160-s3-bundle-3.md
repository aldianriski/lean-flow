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
