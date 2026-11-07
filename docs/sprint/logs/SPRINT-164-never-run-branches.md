---
sprint: 164
slug: never-run-branches
owner: Maintainer
last_updated: 2026-11-07
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-164 — Execution Log

> Append-only companion to [`../SPRINT-164-never-run-branches.md`](../SPRINT-164-never-run-branches.md).
> Uncapped by design (STANDARD §9). **Never edit a past entry**; correct it with a new one.

### 2026-11-06 | promote | plan locked, governance signed, three members: the three branches TD-294 says never ran
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (19 learnings at count ≥ 2, all promoted; all 44 `promoted: no` entries at count 1).
- ☑ TD aging: 112 rows, all open; none `high` (66 low, 24 minor, 15 medium, 7 trivial). 107 are aged ≥ 3 sprints and were held; nothing auto-escalates to P1.
- ☑ doc-aging, §11: nothing due. ☑ doc-aging, §2: no breach (`check-doc-caps`).
- ☑ epic rollup currency: no active epic. ☑ epic coverage: none. ☑ roadmap: none. ☑ handoff ledger: none.
Composition: TASK-610, TASK-611 and TASK-612 (ready, P2, from the TD-294 intake, Codex-reviewed in 1 round, CLEAR); single stream. Sizes M, S, S; no `L`.
TASK-612 depends on the other two for shared-file order and the TD-294 flip, and all three join here, so it sits in the second wave. Status moves in `85bcb960`.
G1 and G2 are not signed; `/orchestrator` signs them.
promote-check: 10 pass, 0 fail.

### 2026-11-06 | progress | opt-in gate green off-host at the recorded plan_commit
`gate-remote.ts` ran `45707062`: `QA-CHECK: 507 pass, 0 fail`, `bun test` 589 pass, 0 fail.

### 2026-11-06 | progress | builder check run on the three G2 designs before sign-off
builder-check · T1 · 0 contradictions · 4 questions · settled: the mixed answer moved off migrate, so box 2's label has one reading (R1 init keeps it for box 5, and box 3's second entry is added on the copy by the coordinator); bullet shape read from `setupBullets` and printed before any paid run; a third ask counts as a defect; a fix may land in `skills/lean-doc-generator/references/migration-map.md`
builder-check · T2 · 2 contradictions · 5 questions · settled: the rule goes in the task-file guidance bullet; the no-write check covers all of `docs/work/`; the shown box is matched as a whole line (`grep -Fx`) from the decoded result; D2 and D3 re-run as controls; a scenario is step 6's own definition; up to two added lines (138)
builder-check · T3 · 0 contradictions · 2 questions · settled: step 3 already holds a bug with no box and only lacks the evidence condition, so the text changes whatever the before-run shows and a clean before-run is recorded as that; box 2 runs through the report, with the code path not run and stated

### 2026-11-06 | progress | batch G1 and G2 signed by the owner (popup) on `a535b273`
G1 fast path: scope unchanged since approval. G2 design, all three tasks J2, HITL, each `consequence · behaviour:material · governance:low`:
- Shared files: `CHANGELOG.md`, `README.md`, `TECH-DEBT.md` in T1, T2, T3 order on main (D1); preflight: no cycle, no parallel wave, so no worktree. The coordinator owns the sprint file, this log, ticks and moves.
- Fix route (owner ruling, this sprint only): Claude writes the few lines of rule text and Codex reviews it (D4), rather than Codex building. The before-run is each behaviour fix's pin, the after-run on a new pin its green.
- T1 runs: R1 init on a code-only copy with SOLID plus one standard with checks; R2 migrate with SOLID only; R3 migrate re-run; R4 init answering `none`; R5 a scoped review of a violating diff. Box 3's second entry is added on the migrate copy by the coordinator. Not run: a mixed answer on migrate, for which `skills/lean-doc-generator/references/migration-map.md` names no report label.
- T2 runs: D1 no scenario, D1b fresh approve, D2 scenario named, D3 docs with nothing to guard. A1 confirmed: 136 lines today, at most 138.
- T3 runs: B1 known cause outside the checkout (A4's pick: the copy's code can always suggest a neighbour for a bug inside it); B2 one session with an evidenced bug, an unknown cause and a seeded `ready` bug. A1 confirmed: 132 lines, edits inside existing lines. Box 2 runs through the report; the code path is not run.
Every box is a judgment tick or a stated query on a run's artifact (`check-verify-reaches`: 0 mechanical `Verify:` clauses). The owner rules each result when shown.

### 2026-11-06 | progress | T1 before-run on pin `022ba994`: init passes, migrate misses the marker and the report label
R1 `init` (`s164-init`, SOLID plus one standard with checks): draft shown, one further ask naming SOLID, before the first Write; `checks: not decided yet (owner, init)` count 1; the entry with checks not asked again. R2 `migrate` (`s164-mig`, SOLID only): draft and one ask before any doc write, but all four fields read `not decided yet` with the citation at the line's end (`(owner, migrate)` marker count 0), and the report described the topic in prose. R3b re-run: SOLID `cmp` same, no Standards question. R4 `init` with `none`: no section. R5 and R5b scoped reviews: both failed `Errors carry context`, neither failed anything under SOLID, both said SOLID has no check to run.
A2 confirmed: every ask was answered through `--ruling`, no `evals/ab/` change. A3 disproved: review says so without a clause. A5 confirmed: copies from `cf41a20`, `D:\Research\workdoo` hashed before (1242 files).

### 2026-11-06 | surprise | R3's first attempt stopped on a multi-select popup the classifier had no entry for
Exit 3 on "Sections"; R3b added one more `--ruling` and ran through. Also: the classifier answered the overview cap popup with CLEANUP, so `## Stack` was not added on either migrate run. A harness side effect, not this branch.

### 2026-11-06 | progress | T1 fix `f94bdef1`: owner ruled "fix both"; Codex 2 rounds; gate green; re-run passes
Two lines in `migration-map.md`, then a third after Codex round 1 found a standard with checks absent could still be labelled `asked (answered)`. Round 2 OK on all items. Gate on `f94bdef1`: 589 bun tests, qa-check 508 pass, 0 fail.
R2-after (`s164-mig2`, pin `f94bdef1`): the popup's preview showed the draft and one ask named SOLID's checks, before any doc edit (only migrate's inventory script was written first, in temp). `checks: not decided yet (owner, migrate)` count 1; report row `Standards adopted: SOLID | asked (not decided yet)`.
The fix changed the entry's shape, so one review re-ran on it (R5c, beyond the single re-run the ruling named, stated to the owner): failed `Errors carry context` at `server/companyProfile.ts:43`, nothing under SOLID, and "its checks are 'not decided yet', so there is nothing to check against". R3b's `cmp` stays on the old shape, stated to the owner.
The report said two rows fit no label; filed as TD-296 with the mixed-answer case, on the owner's ruling.
consequence · T1 · behaviour:material · governance:low
review · T1 · Codex read-only review of the rule text (a different model from the writer), 2 rounds, 1 finding fixed · behaviour:material · governance:low

### 2026-11-06 | scope-change | T1 drops three unused paths from its Layers (TASK-610 box 6 needed one skill file)
The runs exposed one defect, in `skills/lean-doc-generator/references/migration-map.md`. `skills/lean-doc-generator/references/init.md`, `skills/orchestrator/references/review-scoping.md` and `skills/lean-doc-generator/templates/development-coding-standards.md.template` were declared for a defect no run showed, so T1's `Layers:` drops them (L-240). No Done-when text changed.

### 2026-11-06 | progress | T1 done: owner accepted the result and ruled TD-296 filed
TASK-610's seven boxes ticked after that ruling.

### 2026-11-06 | progress | T2 before-run on pin `022ba994`: an unasked box is written on the first approve
D1 (feature draft, no scenario, `approve`) wrote TASK-088 with a box the owner never saw, the expected defect. D2 (names a scenario) wrote a box from the named line. D3 (docs) wrote `Negative: n/a`.

### 2026-11-06 | surprise | T2's first fix held the draft but wrote reworded lines, and the first line check proved nothing
On `9997af10` D1 wrote nothing and asked for a fresh approve, but it showed loose bullets and D1b wrote reworded `Negative:` lines, so box 2 failed. The check itself had first passed falsely: D1 printed no literal `- [ ] Negative:` line, so `grep -Fx` ran with an empty pattern and matched 11 blank lines. The re-run's check counted the shown lines first.

### 2026-11-07 | progress | T2 fix `61b2dcd3`: the exact line is shown and written unchanged
Codex round 1 on `9997af10` and round 2 on the tightened text: OK on all items. Gate on `61b2dcd3`: 589 bun tests, qa-check 509 pass, 0 fail. On that pin D1 wrote nothing (`status after D1: []`) and showed one `- [ ] Negative:` line, and D1b's file holds that line (`grep -Fx` count 1, one shown, one written). D2 and D3 keep their `9997af10` results, since the rule's condition did not change; the owner was told at the ruling.
consequence · T2 · behaviour:material · governance:low
review · T2 · Codex read-only review of the rule text (a different model from the writer), 2 rounds, 0 findings; the rewording came from the run · behaviour:material · governance:low

### 2026-11-07 | progress | T2 done: owner accepted the result
TASK-611's five boxes ticked after that ruling.

### 2026-11-07 | progress | T3 before-run on pin `022ba994`: the hold already worked, and an unknown-cause bug got a filler box
B1 (known cause outside the checkout, nothing named): `needs-info`, `open:` line, 0 boxes, so the expected invented box did not appear. B2: the dialog bug `ready` citing the report, the seeded `ready` bug unchanged, the unknown-cause bug `next: /diagnose` plus a filler `Negative:` box. The text changes anyway under the signed design, since no line said where a box comes from.

### 2026-11-07 | surprise | T3's first B2 after-run was void because of the fixture
Re-using the copy seeded a second copy of the bug, and the report's cause (a dialog wrapper with `overflow: visible`) was false for that code, so the agent merged the duplicates, committed, and sent the dialog bug down another path. Both were harness faults. B2 was rebuilt on fresh copies with a true seeded cause (`.body` in `src/ui/PreviewDialog.module.css`), one seed, and changes read against the seed commit, then run on both pins. A5's snapshot and revert were unaffected: `D:\Research\workdoo` was only read.

### 2026-11-07 | progress | T3 fix `c35613aa`: a box must cite the report or code that names the scenario
Codex round 1 found the template weaker than steps 3 and 6 (no citation, no word on omitting the box); both fixed. Round 2 OK on all items. Gate on `c35613aa`: 589 bun tests, qa-check 509 pass, 0 fail (one earlier attempt was a transport failure, not a gate result: the temp folder had gone). On that pin B1: `needs-info`, `open:` line, 0 boxes. B2: dialog bug `ready` with a box citing the report's sentence; seeded bug diff 0 lines; unknown-cause bug `next: /diagnose`, no box. The path where only the code names the scenario was not run, per the design.
The bug template has no `## Assumes` heading though steps 3 and 6 name it; agents add the section, so nothing failed. Filed at close.
consequence · T3 · behaviour:material · governance:low
review · T3 · Codex read-only review of the rule text (a different model from the writer), 2 rounds, 2 findings fixed · behaviour:material · governance:low

### 2026-11-07 | progress | T3 done: owner accepted the result and resolved TD-294
TASK-612's five boxes ticked after that ruling.

### 2026-11-07 | close | 3 of 3 members done, 17 of 17 boxes; Retro written; buckets filed
System verify before close: full gate off-host at `0f41d9f2`, qa-check 509 pass, 0 fail; bun test 589 pass, 0 fail. Close check: 8 pass, 0 fail.
The source repo was only read: all 1242 baseline hashes match, and no file outside `node_modules`, `dist` and `.git` is newer than the baseline.
Buckets: Shipped, three `[Unreleased]` Fixed lines (no release). Tech debt, TD-297 new, TD-296 filed in T1, TD-294 resolved. Follow-ups, none. Learnings, L-291 and L-292 new, L-290 at count 2. No epic, no handoff entry to reconcile.
