---
sprint: 162
slug: ab-harness-follow-ups
owner: Maintainer
last_updated: 2026-11-03
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-162 — Execution Log

> Append-only companion to [`../SPRINT-162-ab-harness-follow-ups.md`](../SPRINT-162-ab-harness-follow-ups.md). Uncapped by
> design (STANDARD §9). **Never edit a past entry**; correct it with a new one.

### 2026-11-03 | promote | plan locked, governance signed, two members: the judge-failure fix and the three-worker re-check
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (19 learnings at count ≥ 2, all promoted).
- ☑ TD aging: 109 rows, 108 open (TD-291 new) and 1 resolved; none `high` (64 low, 24 minor, 15 medium, 5 trivial).
- ☑ doc-aging, §11: nothing due (the root CHANGELOG holds v2.20 and v2.19; rotation already done). ☑ doc-aging, §2: two
  findings, both closed by `.cap-dispositions` rows in this commit: `plugin-reference-delta.md` (147 > 130, soft) retained as
  TASK-601's intake source; `lean-flow-3-foundation.md`'s retain reason had expired with EPIC-023's close and now names its
  live citers.
- ☑ epic rollup currency: no active epic. ☑ epic coverage: none. ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup (2026-11-03): TASK-602 (ready, P1 bug) and TASK-603 (ready; TASK-600 done); single stream. Sizes S,
S; no `L`. Status moves in `e45d9790`.
Filed with this promote, by owner popup: TD-291 (EPIC-023 D20's backend-role watch) and a note on TASK-601 that D20's kept
candidate (invariant assertions with test anchors) is weighed at its intake.
promote-check: 7 pass, 0 fail.

### 2026-11-04 | progress | batch G1 and G2 signed by the owner (popup); T1 built by Codex
G1 (full checklist; both members `origin: manual`): goals, sizes S and S, touched files, out-of-scope and assumptions confirmed.
G2 rulings, by owner popup: the G2 signer (`policyCheck`) stays out of T1, so a failed signer call still refuses (`g2-refused`)
and goes to the Retro as a follow-up; a failed judge call is labelled with a new kind, `infra:judge-failed`; the two amendment
boxes close by carry-forward in the TD ledger (scope-change below); T1 is Codex-built in a worktree, test-first, Claude-reviewed,
coordinator-committed; T2 repeats TASK-586's N = 3 leg after T1 lands, with the PC idle (about 16 minutes, about 8.5 USD).
T1 design: `runJudges` reports which calls failed (a thrown call, or a reply with empty text); `buildMeasure` turns the attempt
into `infra:judge-failed` when any of the three failed; both callers take the class from the measure, so the retry loop, the
3-infra abort and the row's `attemptKind` all see it; `realJudge` adds the CLI's error text to its thrown message, so a
usage-limit judge failure pauses and voids like an agent one. A non-empty reply that does not parse stays a scored UNKNOWN.
builder-check · T1 · 4 contradictions · 3 questions · settled: deadline throw never reaches the measure judges (exception dropped); usage-limit text needs realJudge's error to carry the result text (added); guard on an already-infra class is vacuous (dropped); caller line ranges corrected; one failed call of three makes the attempt infra; empty-reply rule safe (no selftest stub sends empty text)
builder-check · T2 · 0 contradictions · 3 questions · settled: the last N = 3 run's provisioning failure is the race TASK-600 fixed, which this check tests; the slot list is rebuilt from TASK-586's and shown before launch; the spend was approved at G2; box 2 by the scope-change below

### 2026-11-04 | scope-change | T1, T2: T1 Layers widened to the judge callers and the retry kinds; the amendment boxes carry forward
What broke: the builder check found that fixing the measure alone never reaches the retry loop. The class is computed before the
judges run, in `evals/ab/lib/trial.ts` and `evals/ab/lib/protocol.ts`, and the new kind lives in `evals/ab/lib/retry.ts`. T1's
Layers gain all three, plus `TECH-DEBT.md` for its carry-forward.
Both "next arm's amendment" boxes (TASK-602 box 3, TASK-603 box 2) cannot be ticked inside this sprint: the pre-registration is
hash-frozen, and any edit to it is an amendment with a re-signature. By owner ruling they are reworded so that the record sits
where the next amendment's author reads it: TD-290 stays open until that amendment discloses the judge fix, and TD-289 likewise
for N = 3.
Impact: four more files in T1, no new behaviour; T2 unchanged in work. G2 re-confirmed by the same popup.

### 2026-11-04 | progress | T1 done: a failed judge call is infra (`626247d5`)
Built by Codex (`codex exec`, workspace-write, worktree `s162-t1`, 58k Codex tokens), test-first; landed by the coordinator with
blob hashes equal to the worktree's. Must-FAIL: S79 FAILs on the unfixed library (a throwaway worktree at `ebf6cfe6` with only
the new selftest), PASSes with the fix. Selftest: worktree 84 of 84; main before the change 83 of 83. Codex's own run showed S43
(the process-tree kill) failing inside its sandbox; it passes on the host, and T1 does not touch that code. Typecheck (`tsc
--noEmit`) passed in Codex's run, including the calibration consumer. TD-290 keeps a carry-forward line (box 3).
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped review by Claude of the Codex-built diff (a different model from the builder), 1 round, 0 blocking · behaviour:material · governance:low
Review notes (Low, for the Retro): `run-trial.ts` still exits 0 when the final attempt is a judge-infra failure (`r.valid`
reads the exit, a dev CLI outside T1's Layers); an empty reply from a wrong model now counts as infra, not as a model-pin UNKNOWN.

### 2026-11-04 | gate | T2 capacity check at N = 3: clean on capacity; two judge UNKNOWNs ruled noise; N = 3 carried to the next amendment
Capacity check (TASK-603), A4a's arms and pin, a scratch schedule and log no analysis reads (the Release log's freeze header, hash
unchanged), a free-RAM sampler every 5 s, PC otherwise idle. Slots: clinic patient-cancel-all #1 and #2, confirmation-time #1 and
#2; workdoo access-activity-type-filter #1, shared-auth-failure #1. A 2-slot pilot (stopped for the owner's review), then 4 slots
at three workers, 02:41-03:02 UTC.
- 6 of 6 scored on attempt 1; 0 provisioning failures, with three clinic starts overlapping (TASK-600's lock held); 0 infra
  attempts; 0 low-memory kills (no `Resource-Exhaustion-Detector` event in the window); lowest free RAM 362 MB in the pilot, 890 MB
  at three workers.
- All graders pass. Four of six outcomes as A4a's serial trials. Two differ, each a scored UNKNOWN reply, never a FAIL:
  access-activity-type-filter #1 business (the event writers are not in the files shown) and confirmation-time #1 convention
  (cannot tell whether a timezone helper exists). Owner ruling (popup): noise; N = 3 adopted for the next release arm.
- Cost 13.85 USD (12.54 agents, 1.31 judges), above the 8.5 USD estimated at G2.
TD-289 gains a carry-forward line: the next release arm's amendment adopts N = 3 and resolves it.
consequence · T2 · behaviour:low · governance:low
review · T2 · self-review (a measurement and an owner ruling; no code changed) · behaviour:low · governance:low
