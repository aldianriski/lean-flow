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
