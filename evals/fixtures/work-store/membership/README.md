# work-store membership fixture

A mini v2 tree (`docs/work/` + one sprint file) with three synthetic task files (reserved 900-block ids),
used by `evals/run-work-store-fixtures.ts` (SPRINT-106 T2, retargeted SPRINT-111 T5) to prove `/prime`'s v2
open-DoD derivation (`skills/prime/SKILL.md` § Resolution) matches a hand count: membership is the
sprint's `## Members` list, each member's task file found **by id** in any status folder -- never by the
listed path, never by the task's `sprint:` stamp (L-186: the fixtures vary the SELECTION).

## Population

| Item | Where | In `## Members`? | `sprint:` stamp | `## Done when` boxes | Open (`- [ ]`) |
|---|---|---|---|---|---|
| `SPRINT-901-membership.md` | `docs/sprint/` | -- | -- | -- | lists TASK-910 and TASK-911 |
| `TASK-910-membership-alpha.md` | `todo/` | yes, path current | `SPRINT-901` | 1 closed, 2 open (+1 open **outside** `## Done when`, under `## Touches`) | 2 |
| `TASK-911-membership-beta.md` | `in_progress/` | yes, path **stale** (listed as `todo/`) | `SPRINT-901` | 2 closed, 1 open | 1 |
| `TASK-912-membership-decoy.md` | `todo/` | **no** | `SPRINT-901` | 4 open | 4 (excluded -- unlisted) |

## Hand-counted expected figure

**`SPRINT-901` open DoD = 3** (TASK-910's 2 + TASK-911's 1).

Why not more, why not less:
- TASK-910's stray `- [ ]` under `## Touches` does **not** count -- the rule scopes to lines under
  `## Done when` only.
- TASK-912's four open boxes do **not** count -- it is stamped `sprint: SPRINT-901` but not listed in
  `## Members`. The old `sprint:`-field rule would read **7** (3 + 4); this is the case that
  discriminates old rule from new.
- TASK-911 **does** count although its listed path (`docs/work/todo/...`) no longer exists -- it moved
  to `in_progress/`; the id is what is looked up. Reading the listed path would read **2**.
- The count is the same on a CRLF copy of this tree (a fresh Windows checkout), which the harness
  checks against a temp copy.
