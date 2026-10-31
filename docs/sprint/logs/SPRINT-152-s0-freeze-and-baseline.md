---
sprint: 152
slug: s0-freeze-and-baseline
owner: Maintainer
last_updated: 2026-10-31
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-152 — Execution Log

> Append-only companion to [`../SPRINT-152-s0-freeze-and-baseline.md`](../SPRINT-152-s0-freeze-and-baseline.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-10-31 | promote | plan locked, governance signed, four members in two waves: S0's freeze and paid baseline, the review-depth fix, and the promote rule's first use
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: L-267 due (count 2) and promoted: merged into the edit-safety run-every-check line, pointer on the entry.
  Census before: 22 active + 224 promoted + 1 superseded = 247, equal to the heading count; after, 21 + 225 + 1.
- ☑ TD aging: all 100 open rows aged against sprint 152 (newest created at 148). Second route: 102 matching lines − 2 prose
  lines = 100; by severity 59 low + 24 minor + 12 medium + 5 trivial = 100. Nothing newly aged, no `high` row, none resolved.
- ☑ doc-aging, §11: TASK-546 pruned (SPRINT-149; no live citation on git grep or ripgrep). Every other done or cancelled file
  from sprint 149 or earlier keeps a live citation. No CHANGELOG rotation, no LEARNINGS collapse. Commit `cbb869f9`.
- ☑ doc-aging, §2: no breach (`check-doc-caps` PASS); token budget ~12688 of 12691.
- ☑ epic rollup currency: EPIC-023 current. ☑ epic coverage: 5 of 5. ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: all four, two waves. Size check: three S and one M, no `L`. Origins: two decomposer (TASK-544,
545), one manual (TASK-558), one close-retro (TASK-559). Epic: EPIC-023 (TASK-544, 545; TASK-558 and 559 carry none).
Dependent pull (TASK-558's third box): TASK-545 joins in wave 1 beside its only blocker TASK-544 under the promote rule, with
no owner state ruling; its `blocked` state is unchanged. TASK-544 joins with zero open blockers (TASK-537..543 all in
`done/`). The installed plugin copy predates `07a75451` at the same version, so this promote ran the repo's procedure.
Pre-dispatch preflight by inspection: no cycle; wave 0 paths disjoint (T2 in the review-depth checker and its fixtures, T3
under `evals/ab/` and `docs/research/logs/`); T3 and T4 share those two paths in sequence only.

### 2026-10-31 | progress | batch G1 signed for T1-T4; G2 signed for T1 and T2; T3 G2 in round 2, T4 G2 after T3 freezes
Batch G1, signed by the owner by popup: T3 and T4 by fast-path (`origin: decomposer`, scope unchanged); T1 and T2 by the
full checklist. T1: tick box 3 only, no rule or skill text changes. T2: grade only the latest `review · Tn` line per task;
touches the checker, its fixture runner and its fixtures; no depth-token validation, no doc change. Sizes: T1 S, T2 S, T3
re-sized S to M (calibration re-run, inventory and allow-list changes, corpus hash), T4 M; no `L`.
Pre-dispatch preflight (the dispatch.md snippet, base `b5f1089d`): CLEAR. Waves T1=0, T2=0, T3=0, T4=1; the two shared
paths ordered T3 then T4.
G2 for T1 and T2 signed by popup. T2's archive-skip trap is in the design: the checker skips archived paths, so the real-
artifact run uses non-archive copies of the archived logs, old and new checker side by side.
builder-check · T1 · 0 contradictions · 0 questions · nothing important left
builder-check · T2 · 0 contradictions · 1 questions · factual (an unknown depth token counts as superseding): settled as designed, depth tokens are not validated today and that is outside TASK-559
T3 rulings taken by popup ahead of its G2: measured arms run an Opus 5.5 session with Sonnet 5.5 subagents at default
effort (the Haiku tier cannot be enforced, recorded as a limit); permission mode stays `acceptEdits` with one shared
allow-list for both arms; calibration fixes its data and the business prompt's locale check, then runs again in full under
a new lock. T4's G2 waits for T3's freeze, because its spend ceiling, validity and stop rules are what T3 writes (L-111).
`gates_signed` stays unset until every task's G2 is signed.
