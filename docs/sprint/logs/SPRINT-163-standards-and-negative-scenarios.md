---
sprint: 163
slug: standards-and-negative-scenarios
owner: Maintainer
last_updated: 2026-11-04
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
