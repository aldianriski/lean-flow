---
sprint: 154
slug: a2-migrate-arm
owner: Maintainer
last_updated: 2026-11-01
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-154 — Execution Log

> Append-only companion to [`../SPRINT-154-a2-migrate-arm.md`](../SPRINT-154-a2-migrate-arm.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-01 | promote | plan locked, governance signed, one member: arm A2 through a real migrate, its own amendment and log
Promote governance checklist, signed by the owner by popup (one scan for SPRINT-154 and SPRINT-155, promoted together):
- ☑ L-promotion: none due. Census 253 headings = 225 promoted + 27 active + 1 superseded; no active entry at count 2 or more.
- ☑ TD aging: 102 open, 100 aged against sprint 154 (created at 151 or earlier); TD-283 and TD-284 are new (152). Second
  route: 102 matching lines; by severity 59 low + 24 minor + 14 medium + 5 trivial = 102. No `high` row, none resolved.
- ☑ doc-aging, §11: TASK-537..540 pruned (SPRINT-151, closed three sprints ago; no live citation by two queries, a scripted
  whole-word scan and `git grep -w`, with TASK-536 and 541 as positive controls). The other 46 closed files from sprint 151 or
  earlier keep a live citation. No CHANGELOG rotation (no new MINOR), no LEARNINGS collapse due. Commit `9b4fd30a`.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only); the token budget passed at `4a381b64`.
- ☑ epic rollup currency: EPIC-023 current (checker PASS). ☑ epic coverage: 3 open, all covered. ☑ roadmap: none.
  ☑ handoff ledger: none.
Composition by owner popup: TASK-555 alone, stream s1-discovery, beside stream codex-pilot (SPRINT-155). TASK-555 was set
`ready` by triage (`84fd3c1c`), both blockers in `done/`. Size M, no `L`. Origin: decomposer. Epic: EPIC-023 (S1).
Box 1 still reads `init`; the owner's ruling (migrate) is applied by a `scope-change` entry right after this lock.
promote-check: 4 pass, 0 fail.

### 2026-11-01 | scope-change | T1: TASK-555 box 1 sets A2 up through a real `migrate`, not `init`
What changed: owner ruling 2026-11-01 (D1). The A1 snapshots carry 2.x docs, so the upgrade an adopter would really run is
`migrate`; `init` would scaffold beside existing docs. Impact: box 1's verb and its subject change ("a real `migrate` on the
frozen A1 snapshots"); boxes 2 and 3, the trial count and the ruling are unchanged. G2 is re-confirmed with the design, which has
not been signed yet.

### 2026-11-01 | progress | G1 and G2 signed for T1 after a Codex builder check; three owner rulings for Amendment 6
G1: goal, size M, risk high, blast radius (`evals/ab/`, the new A2 log, and outside the repo `D:/Research/ab-pins/` and the A2
snapshot copies), out of scope (S0's log and freeze, the A0/A1 arms, tasks, judges and rules, S3). G2: the runbook's nine steps
(pin, snapshot copies, arm files, a generalised `setup-arm.ts`, the owner's migrate sessions, freeze, Amendment 6, run, analysis).
builder-check · T1 · 3 contradictions · 2 questions · settled: A2 passes the run-validity rule on its own 32 slots before any combined analysis (a loss share must not be diluted by S0's 96); deltaVsA1 already carries the pooled bootstrap interval section 4 needs; intent ruled by owner (below)
Owner rulings by popup: (1) the S1 pin loaded by `--plugin-dir` in an isolated config with no user plugins counts as "the
installed plugin at the pinned S1 revision", as at A1; (2) setup popups the frozen answers files do not cover: migrate's plan is
approved for the profile items only and anything else declined; any other unanswered popup stops the session for an owner ruling,
logged in the A2 log as a setup deviation; (3) the pilot is one slot per arm-repo pair, derived from the schedule (S0 stays 4, A2
becomes 2), a driver change with a selftest fixture. All three are stated in Amendment 6. G2 signed.

### 2026-11-01 | progress | T1 steps 1-4 built: pin, A2 snapshot copies and arm files, setup-arm.ts, derived pilot, schedule-a2.json
Steps 1-3 inline (`798a4f1c`): the S1 pin at `82990174` (hashDir `b8c3b484...`); the A2 copies of the frozen A1 snapshots with 0 drift
(workdoo 1244 files, clinic 66; pre-migrate manifests equal the A1 manifests key for key); arm files whose pin verifies. Step 4 by a
Sonnet builder in a worktree, test-first (`acfec0b9`, `0826d8b9`): `setup-arm.ts --arm <id>` replaces `setup-a1.ts` and runs init
or migrate according to the arm's pre-setup manifest, in the isolated config that keeps the installed plugin out; the pilot is
one slot per (arm, repo) pair (S0 4, A2 2); `schedule-a2.json` is the A1 slots with trial 1-2 renamed -a2 (32 slots), re-derived
by S59. Selftest 64/64 (S57-S59 each seen failing first), re-run by the coordinator. Codex review: R2-R5 OK, one Medium (a relative
plugin path could verify one checkout and launch another), fixed by refusing relative paths; 1 round.
consequence · T1 · behaviour:material · governance:high
review · T1 · scoped-reviewer · behaviour:material · governance:high

### 2026-11-01 | scope-change | T1: A2's setup popups are answered by an automatic operator in `evals/ab/`, not by the owner at the keyboard (D1)
What changed: owner ruling by popup ("too many manual steps"). `setup-arm.ts --auto` runs the setup session headless and answers
each `AskUserQuestion` itself, verbatim from the frozen answers files by a fixed topic-to-section table. migrate's plan is
approved for the profile items only, and any popup the files do not answer stops the run for an owner ruling. Every answer and
permission decision is logged. Spike (coordinator, 2026-11-01): `claude -p --input-format stream-json --output-format stream-json
--verbose --permission-prompt-tool stdio`, after an `initialize` control request, registers `AskUserQuestion` and routes it to the
host as a `can_use_tool` control request; an `allow` reply whose `updatedInput` carries `answers` reaches the model as answered.
Impact: TASK-555's Done-when is unchanged ("every popup answered verbatim from the frozen answers files" now holds mechanically);
D1's owner-driven sessions become operator-driven; Amendment 6 states it. G2 re-confirmed by the same ruling.

### 2026-11-01 | progress | T1: the setup operator is built, reviewed and merged (`deb763c6`, `f8220641`)
A Sonnet builder in a worktree, test-first against a fake CLI (no paid run): `lib/operator.ts` answers a popup only when exactly
one candidate matches across the run's rules, a fixed topic table and the Setup-answers bullets, and otherwise stops naming them
all; `lib/operated-session.ts` drives the headless session over the spiked protocol, allows a tool only by the arm's allow-list
(patterns honoured), stops on a repeated question text, logs every decision, and times out a stalled CLI; `setup-arm.ts --auto`
and `operated-session.ts` are the entry points, both in an isolated config. Selftest 68/68 (S60-S63). Codex review round 1: NOT
CLEAR (1 High: competing matches answered instead of stopping; 3 Med: repeated question texts, unpatterned Skill allow, a hang on
a stalled CLI; 1 Low: an allow-list probe). All fixed in one builder retry. The coordinator seeded each pre-fix file back in:
old `operator.ts` fails S60 only; old `operated-session.ts` fails S61 and S63; both restored by hash.

### 2026-11-01 | progress | T1: three live clinic-a2 runs stopped safely before writing; setup deviation 1 ruled; operator rules widened
Run 1 stopped at migrate's plan popup: its text quotes Stack and Main flows, so the plan rule and three topics all matched. Fixed by
an exclusive plan rule (`8fa6e1a4`). Run 2 stopped at a reworded plan popup ("which part of the plan should I apply?"); the rule now
matches the plan in either wording (`5b5e1b38`). Run 3 answered the plan with "profile pass only" and stopped at a new popup
asking what should happen to `BUSINESS-NOTES.md` (options: add a header, archive, leave untouched). Every arm's trial copy carries
that file, so changing it in A2 alone would confound the measurement. **Setup deviation 1 (owner ruling):** leave it untouched.
Owner standing rule: for A2's setup, a question about changing, archiving, moving, renaming or slimming an existing file is
answered "leave untouched", an exclusive operator rule that defers to the plan rule on plan questions. Each fix carries a fixture, and
seeding the previous version fails S60 or S63 alone. No run wrote anything: the snapshot is still the pre-migrate copy after each.

### 2026-11-01 | progress | T1: clinic-a2 runs 4-5 -- one wrong operator answer caught, no file written; the file rule rebuilt on a principle
Run 4 stopped at "README.md repeats ... Consolidate them into a link?", a change the standing rule covers but the verb list missed
(`78382149`). Run 5 answered the plan, then gave one WRONG answer: ".claude/CLAUDE.md repeats File Structure, Commands and stack
lines ... one-line pointers instead" mentions "stack", so the topic table returned operator § Stack. It stopped at the next popup
(overview.md duplicates integrations.md) before any write; the snapshot is still the pre-migrate copy. Fix: in a profile-only
migrate, a non-plan question that names an existing file or speaks of repeating, duplicating, "already in" or pointers is a cleanup
question, answered "leave untouched", unless the popup's header names a profile topic (the business and conventions rounds keep the
table). The live CLAUDE.md and overview.md questions are fixtures, with a Stack-headed control; seeding the previous rule fails S63.

### 2026-11-01 | progress | T1: run 6 gave three more wrong answers (no write); owner ruling: a model classifier replaces the keyword table
Run 6 answered three quality-attribute questions ("what is the Performance target for docs/product/requirements.md?") with "Leave
untouched", because the file rule matched the named file; it stopped at a Vue folder-layout question; the snapshot is still the
pre-migrate copy. Owner ruling by popup: a model only CLASSIFIES each popup (an answers-file section, a Setup bullet, PLAN, CLEANUP
or NONE); the text sent is the entry's own words or the fixed ruling text, never model-written; an unknown id, unparsable output or
NONE stops. Built test-first by a Sonnet builder (`8a81c8db`, S61-S64, selftest 69/69 re-run by the coordinator). One paid smoke
run of `claude-sonnet-5-5` classified the four live questions as the owner expected (CLEANUP, quality attributes, PLAN, CLEANUP).

### 2026-11-01 | progress | T1: clinic-a2 runs 7-8 with the classifier; setup deviation 2 ruled (dates on touched files)
Run 7 ended at a plan that migrate asked for in prose, not a popup; the operator now classifies a turn that ends asking the user and
replies with the chosen entry (`14dc9a85`, S65; the trigger no longer fires on "which", `251c5a93`). Run 8: the chat request was
classified CLEANUP (BUSINESS-NOTES.md untouched), the plan popup PLAN, then a popup asking whether to update `last_updated` on the
files that get a new section was classified NONE and stopped; nothing written. **Setup deviation 2 (owner ruling):** yes, on the
files that get a new section only. Added as the DATES ruling class for migrate arms, with CLEANUP's label excluding dates; a real
classification of the live question picked DATES.

### 2026-11-02 | progress | T1: clinic-a2 runs 9-10 stopped before writing; setup deviation 3 ruled (an unsettled convention is "Not decided yet")
Run 9 stopped at a closing chat request whose decisions sat above the last 2000 characters the classifier saw; the operator now
classifies the whole text (12000-char cap, first 4000 + last 8000) and answers a multi-part request one part per line
(`f4ea7c0e`, S66). Run 10 stopped at a popup asking which folder layout a Vue view belongs in, which the frozen Conventions file
does not settle; nothing written, the snapshot is still the pre-migrate copy. **Setup deviation 3 (owner ruling):** a coding
convention the Conventions file does not settle is answered "Not decided yet (owner, migrate)". Added as the UNDECIDED ruling class
for migrate arms; its label sends a question the Conventions file does settle to operator:conventions. A real classification of
two live questions picked UNDECIDED for the folder layout and operator:conventions for the error envelope. Selftest 71/71.

### 2026-11-02 | progress | T1: clinic-a2 migrated (run 11) and frozen; the chat trigger now matches whole words
Run 11 completed the migrate: popups and chat requests were classified PLAN ×4, CLEANUP ×4, quality attributes ×3, DATES and
UNDECIDED, all from the frozen catalog. Audit against the pre-migrate manifest: only `docs/architecture/overview.md`,
`docs/development/coding-standards.md` and `docs/product/requirements.md` changed (+52 lines); against the A1 snapshot the only
removed lines are their three `last_updated` dates (deviation 2); `BUSINESS-NOTES.md` and every other file are byte-identical. The
session's closing summary ("approved `last_updated` date", "Not confirmed") fired the chat trigger and the classifier returned no
parts, so the operator exited 3 after the work was done; nothing was left to answer. The trigger now matches whole words
(`approve`, `approval`, `confirm`), S67 holds the run-7/run-9 requests and run 11's summary; selftest 72/72. Arm frozen:
`clinic-a2.manifest.json` (66 files; differs from A1's in exactly the three files above). Transcript and operator log:
`D:\Research\ab-setup-clinic-a2\iso-IpCNU8\cfg`, `operator-clinic-a2.jsonl`.

### 2026-11-02 | progress | T1: workdoo-a2 migrated in one session and frozen; both A2 arms pinned in hash-prereg.ts
The first workdoo-a2 session completed the migrate: PLAN, the five business topics, CLEANUP ×3 (the `migration-guide.md` cap
breach, the overview table move, the requirements split) and UNDECIDED ×4 (component folders, component tests, env and config, UI
errors). Its closing turn offered to write `.cap-dispositions`; no entry covered it and the operator stopped (exit 3) with nothing
left to do. **Owner ruling:** declined under PLAN; the snapshot is frozen as migrate left it. Audit: only `overview.md` (150→158),
`coding-standards.md` (53→72) and `requirements.md` (150→211) changed; no existing line removed except two `last_updated` dates.
**Arm output recorded, not corrected (owner ruling):** `requirements.md` gained 61 lines but keeps `last_updated: 2026-10-25` (no
date popup was asked), and `overview.md` / `requirements.md` end over their caps (hard 150, soft 150). Session writes outside the
snapshot went to `%TEMP%` only (a plan handoff and an inventory script). Frozen: `workdoo-a2.manifest.json` (1244 files; differs
from A1's in exactly the three files). `hash-prereg.ts` now pins both A2 arms and `schedule-a2.json`; every S0 pin and the corpus
hash still match the pre-registration. Selftest 72/72. Amendment 6 drafted with the A2 hashes, awaiting Codex review.

### 2026-11-02 | review | T1: Codex R1 over the operator, Amendment 6 draft and both operator logs: T2-T4 CLEAR, T1 one Med, fixed
`codex exec` (gpt-6-astra, read-only, static; 41.9k tokens). T2 (setup validity), T3 (Amendment 6 vs the pre-registration) and T4
(freeze integrity) CLEAR. T1 Med: a multi-part chat reply carried the model's own `part` label to the session, and both parsers
mined an object out of surrounding prose. Fixed: a label must be one line of at most 80 characters found verbatim in the message,
else stop; the reply must be exactly one JSON value (fences allowed). S68 (fails on the old classifier); selftest 73/73. Effect on
the frozen arms: none. Every label the operator sent in either setup appears verbatim in its session's text (10 of 10, checked
against the transcripts), so no model-written words reached a session.
