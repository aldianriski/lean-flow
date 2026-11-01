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
