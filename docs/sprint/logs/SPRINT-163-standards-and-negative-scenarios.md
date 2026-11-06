---
sprint: 163
slug: standards-and-negative-scenarios
owner: Maintainer
last_updated: 2026-11-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-163 — Execution Log

> Append-only companion to [`../SPRINT-163-standards-and-negative-scenarios.md`](../SPRINT-163-standards-and-negative-scenarios.md).
> Uncapped by design (STANDARD §9). **Never edit a past entry**; correct it with a new one.

### 2026-11-04 | promote | plan locked, governance signed, three members: the signer fix, adopted standards, negative scenarios
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (19 learnings at count ≥ 2, all promoted; L-289 at count 1).
- ☑ TD aging: 109 rows, all open; none `high` (64 low, 24 minor, 15 medium, 6 trivial).
- ☑ doc-aging, §11: nothing due. ☑ doc-aging, §2: no breach (`check-doc-caps`).
- ☑ epic rollup currency: no active epic. ☑ epic coverage: none. ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup (2026-11-04): TASK-604 (ready, P2 bug, `origin: close-retro`), TASK-605 and TASK-606 (ready, from
TASK-601's intake, Codex-reviewed in 2 rounds, CLEAR); single stream. Sizes S, M, M; no `L`. Status moves in `77ff3330`.
TASK-607 (the release arm) stays in the backlog, blocked on TASK-605 and TASK-606.
promote-check: 10 pass, 0 fail.

### 2026-11-04 | progress | batch G1 and G2 signed by the owner (popup); Codex builds T1, then T2 and T3 in parallel
G1: TASK-604 full checklist (`origin: close-retro`); TASK-605 and TASK-606 fast-path (`origin: decomposer`, scope unchanged
since the intake approve). G2 rulings, by owner popup: any failed signer call makes the attempt `infra:judge-failed`, even when the
revise round then signs (the failure changed the trial's path; the protocol itself is unchanged); T2's init/migrate proof extends
the A/B operator (a standards answer and the plan item), answers in a scratch answers directory so the frozen answers files stay
untouched; T3's exemption is an explicit `Negative: n/a: <reason>` box, never a silent judgement.
Settled facts: T1 keeps the `judge reply unusable: …` reason prefix (S44 and the deadline-to-timeout rule stay green); a
wrong-model or no-usage signer reply stays a refusal, as for the scoring judges. T2: an already-profiled repo reaches the question
through migrate's re-run delta (a doc missing a new template section, applied under plan, approve, apply); init asks it only when
it writes coding-standards; migrate's "all seven" topic count is updated. T3: the `Negative:` prefix is literal; the triage step 6
guard matches its step 3; fog-map tasks inherit the validation; the existing backlog is not revalidated.
builder-check · T1 · 2 contradictions · 2 questions · settled: reason prefix kept (S44, timeout regex); adoption inside the measure block; wrong-model replies stay refusals; recovered signer ruled infra by the owner
builder-check · T2 · 1 contradiction · 2 questions · settled: "all seven" count updated; re-run reaches profiled repos by its delta path; init asks only when it writes coding-standards; operator extension ruled by the owner
builder-check · T3 · 2 contradictions · 2 questions · settled: exemption marker ruled by the owner (explicit n/a box); Reachability clause names `Negative:` boxes with or without a Verify; BUG template and triage step 6 added; fog-map inherits

### 2026-11-04 | scope-change | T2, T3: T2 Layers gain the A/B operator; T3 Layers gain the bug template and fog-map; TASK-606's exemption boxes reworded
What broke: the builder check found that the operated migrate run cannot answer the new Standards question (the operator has no
answer key, and its plan ruling declines any profile item outside the known seven), and that a docs task is `type: feature`, so
nothing marked the exemption. Owner rulings (popup, 2026-11-04): extend the operator (`evals/ab/lib/classifier.ts`,
`evals/ab/lib/operator.ts`, with `evals/ab/selftest.ts` after T1, which owns it first); the exemption is an explicit
`Negative: n/a: <reason>` box. TASK-606 box 1's "not asked for one" and box 4's "carries no negative-scenario box" are reworded to
the n/a box, which is what that ruling means. T3 also adds `skills/lean-doc-generator/templates/BUG.md.template` and
`skills/task-decomposer/references/fog-map.md`.
Impact: T2 adds a small maintainer-only harness change; T3 two more files; no new mechanism. G2 re-confirmed by the same popup.

### 2026-11-04 | progress | T1 done: a failed G2 signer call is infra (`fe0c2f65`)
Built by Codex (`codex exec`, workspace-write, worktree `s163-t1`, 49k Codex tokens), test-first; landed with blob hashes equal to
the worktree's. Must-FAIL: S80 FAILs on the unfixed library (a throwaway worktree at `d99bbd28` with only the new selftest),
PASSes with the fix. Selftest in the worktree: 85 of 85 (S44 unchanged). Typecheck passed in Codex's run. TD-290 gains the signer.
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped review by Claude of the Codex-built diff (a different model from the builder), 1 round, 0 findings · behaviour:material · governance:low
Box 2 note: S44 and the fail-closed check needed no edit, because the rule they assert (sign stays false) still holds; S80 is the new check.

### 2026-11-04 | progress | T2 and T3 built by Codex and landed (`3ea9b762`, `3e2ea838`); the gate's three findings fixed (`ae92652c`)
T2: Codex in worktree `s163-t2` from `88b6856b` (64k Codex tokens); landed with blob hashes equal. Selftest 86 of 86; S81 FAILs on
the unfixed harness, PASSes with it. Template 67 lines.
T3: Codex in worktree `s163-t3` from `d99bbd28`, in parallel with T1 and T2; landed by a 3-way apply onto T2 (CHANGELOG conflict
resolved by keeping both lines, T2's first, as D1 says). Line counts held: orchestrator 140, task-decomposer 134, triage 131.
Off-host gate at `3e2ea838`: 493 pass, 3 fail, all T3's: the always-loaded token budget 19 over (the CONTEXT.md line), and
prose-density on task-decomposer and triage (step 6 lines grew past 400 characters). The bounded builder retry, made inline as a
mechanical fix: the rule moved to its own lines (task-decomposer 136, triage 132, both at their baseline dense counts), the
CONTEXT.md line shortened and a clause repeating "(optional, never a gate)" dropped (~12684 tokens, under budget). Off-host gate
at `ae92652c`: 496 pass, 0 fail; bun test 589 pass, 0 fail.
consequence · T2 · behaviour:material · governance:low
consequence · T3 · behaviour:material · governance:low
Review of both diffs by Claude (a different model from the builder), 1 round each, 0 blocking; the consumer proofs follow.

### 2026-11-04 | surprise | T2 proof: the operated migrate route cannot reach the Standards question
Two operated migrate runs (copies `s163-std-a` and `-b`, in parallel) were stopped by Claude Code when the PC ran critically low on
memory; nothing was written. Re-run alone, copy A stopped at migrate's first plan popup: four bundled questions (which of 8 plan
items, an `overview.md` cap fit, evidence placement, a tool block) that the operator's classifier has no answer for, and the session
reported Bash and PowerShell blocked, which migrate's apply step needs. Owner ruling (popup): prove boxes 3-5 by review runs now,
and box 2 by an interactive owner run on a git-initialised copy (`D:\Research\s163-std-c`, remote removed).

### 2026-11-04 | progress | T2 proofs: boxes 1 and 3-6 ticked by owner ruling; box 2 waits for the owner's migrate run
Review proofs: a scoped `claude -p` reviewer (sonnet, no tools) given the pinned clone's review procedure verbatim, the copy's whole
coding-standards as the comparand, and a diff on `server/companyProfile.ts`. Copy A carries two adopted standards (errors carry the
operation; a Mermaid diagram per main flow). Violating (`ApiError(500, 'INTERNAL', 'Something went wrong.')`): FAIL, reported as
`Errors carry context · … · server/companyProfile.ts:99`. Compliant (the error names the operation): PASS, no standard flagged.
Exception (a 400 with a field list): PASS, citing the exception. Copy B (no section) with the violating diff: FAIL on the
error-handling convention, no adopted standard named; the pre-T2 procedure on the same input gave the same findings and verdict.
Cost about 0.30 USD for the five runs. The killed and stopped migrate runs' cost was not reported by the harness.

### 2026-11-06 | scope-change | T3: TASK-606 boxes 1 and 4 reworded: a docs, config or spike task names a scenario when one applies, otherwise the n/a box
What broke: the consumer proof's docs task (TASK-089 on copy `s163-std-b`, plugin pin `d77e801b`) carried a real scenario ("the page does not claim the rehearsal restores production") instead of the `Negative: n/a: docs only` box 4 required. `skills/task-decomposer/SKILL.md` said docs tasks write n/a; `skills/task-decomposer/references/task-file.md` said n/a "when no scenario applies". Owner ruling (popup, 2026-11-06): the second rule holds. Never refused, never silent, which keeps the 2026-11-04 ruling's "never a silent judgement".
Impact: boxes 1 and 4 reworded; one line in `skills/task-decomposer/SKILL.md` and the README and CHANGELOG wording aligned; no new file. Owner also asked for a run with a docs task that has nothing to guard, and a triage run on a known-cause bug so the `ready` path's check fires. G2 re-confirmed by the same popup.

### 2026-11-06 | progress | T3 consumer proofs run in two rounds; the gate's three findings fixed
Round 1: copy `s163-std-b`, plugin pin `d77e801b`, Sonnet, six sessions, 1.04 USD; prompts never mentioned a negative scenario. Feature task carried `Negative: a non-admin member, an inactive admin, or an admin of another organization gets 403/404 and no file…`; its G2 listed the API cases for the box and marked the hidden-action check a judgment tick, and also refused `verify:workspace:api` as proof (no delivery coverage). Docs task carried a real scenario, not the n/a box (the scope-change above). Bug from the screenshot in the copy's `docs/bugs/` (report text written by the coordinator): `needs-info`, `next: /diagnose`, drafted Negative box. My script passed `TASK` instead of the id to the G2 run; it assumed the right task. G2 skipped its builder check and said so.
Round 2: pin `310d6164`, three sessions, 0.39 USD. Docs task with nothing to guard: `Negative: n/a: docs-only change, no behaviour affected…`. Known-cause bug (the dialog scroll report, on a worktree at `6556bda`, before its fix `1fab2fe`): `state: ready`, with `Negative: the other delivery dialogs and the People/Access dialogs keep their current layout and scrolling…`, and the run named that box as why it was ready. Each kind ran once. No run fed a draft without a scenario, so box 1's refusal rests on reading the skill (owner ruled a judgment tick).
Off-host gate at `310d6164`: 589 bun tests pass; qa-check 494 pass, 3 fail, all bookkeeping. The 2026-11-04 entry recorded the T2 and T3 reviews as prose and no `review ·` line (the lines below). The scope-change above shortened two paths in backticks (L-257): corrected in place to their full paths, the one edit of a past entry, made because the leg reads that entry and an appended correction would leave it red; meaning unchanged, unpushed.
review · T2 · scoped review by Claude of the Codex-built diff (a different model from the builder), 1 round, 0 blocking · behaviour:material · governance:low
review · T3 · scoped review by Claude of the Codex-built diff (a different model from the builder), 1 round, 0 blocking; the one-line alignment `310d6164` self-reviewed · behaviour:material · governance:low

### 2026-11-06 | progress | T3 done: all six TASK-606 boxes ticked by owner ruling (popups); off-host gate green at `04364572`
Off-host gate at `04364572`: 496 pass, 0 fail; bun test 589 pass, 0 fail. Boxes 1, 3, 5 and 6 ruled first, boxes 2 and 4 after round 2. T2 still waits on TASK-605 box 2, the owner's interactive migrate run; TASK-607 stays blocked on it.
