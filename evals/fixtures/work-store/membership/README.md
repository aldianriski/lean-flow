# work-store membership fixture

A mini v2 tree (`docs/work/`) with three synthetic task files (reserved 900-block ids), used by
`evals/run-work-store-fixtures.ts` (SPRINT-106 T2) to prove `/prime`'s v2 open-DoD derivation
(`skills/prime/SKILL.md` § Resolution) matches a hand count and that a foreign-sprint member is
excluded (T2 DoD, L-186).

## Members

| File | Status folder | `sprint:` | `## Done when` boxes | Open (`- [ ]`) |
|---|---|---|---|---|
| `TASK-910-membership-alpha.md` | `todo/` | `SPRINT-901` | 1 closed, 2 open (+1 open **outside** `## Done when`, under `## Touches`) | 2 |
| `TASK-911-membership-beta.md` | `in_progress/` | `SPRINT-901` | 2 closed, 1 open | 1 |
| `TASK-912-membership-decoy.md` | `todo/` | `SPRINT-902` | 4 open | 4 (excluded — foreign sprint) |

## Hand-counted expected figure

**`SPRINT-901` open DoD = 3** (TASK-910's 2 + TASK-911's 1).

Why not more, why not less:
- TASK-910's stray `- [ ]` under `## Touches` does **not** count — the rule scopes to lines under
  `## Done when` only, not any `- [ ]` anywhere in the file.
- TASK-912's four open boxes do **not** count — its `sprint:` is `SPRINT-902`, not `SPRINT-901`;
  the match is exact, not "any task file under `docs/work/`" (T2 DoD: "A fixture member whose
  `sprint:` names another sprint is not counted").
- Status folder is irrelevant to the count — TASK-910 (`todo/`) and TASK-911 (`in_progress/`) both
  count, because membership (`sprint:`) and status (folder) are orthogonal axes (ADR-045 D1).

If a broken implementation ignored the `sprint:` filter (or included the decoy), the figure would
read **7** (3 + TASK-912's 4) instead of **3** — a different number, which is what proves the
filter matters (the selection-varying must-FAIL, `evals/run-work-store-fixtures.ts`).
