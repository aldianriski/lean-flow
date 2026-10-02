# work-store membership fixture

A mini v2 tree (`docs/work/` + three sprint files) with seven synthetic task files (reserved 900-block
ids), used by `evals/run-work-store-fixtures.ts` (SPRINT-106 T2, retargeted SPRINT-111 T5) to prove
`/prime`'s v2 open-DoD derivation (`skills/prime/SKILL.md` § Resolution) matches a hand count.
Active sprints (`status: active`) are summed; a member is a list-item line under `## Members` that is
outside any HTML comment and names a `TASK-NNN-<slug>.md` path; its task file is found **by id** in
any status folder -- never by the listed path, never by the task's `sprint:` stamp (L-186: the
fixtures vary the SELECTION). The contract is written once in the harness header.

## Population

| Sprint file | `status:` | Members (as listed) |
|---|---|---|
| `SPRINT-901-membership.md` | `active` | TASK-910, 911, 913, 914 -- plus four lines that must NOT count (below) |
| `SPRINT-902-membership-closed.md` | `closed` | TASK-915 |
| `SPRINT-903-membership-active.md` | `active` | TASK-916 |

| Task | Folder | `sprint:` | In a `## Members` list? | Open (`- [ ]` under `## Done when`) |
|---|---|---|---|---|
| TASK-910 alpha | `todo/` | 901 | 901, path current | 2 (+1 open under `## Touches`, not counted) |
| TASK-911 beta | `in_progress/` | 901 | 901, path **stale** (listed as `todo/`) | 1 |
| TASK-912 decoy | `todo/` | 901 | **no** | 4 (never counted) |
| TASK-913 gamma | `done/` | 901 | 901 | 1 |
| TASK-914 delta | `cancel/` | 901 | 901 (listed in backticks) | 2 |
| TASK-915 epsilon | `todo/` | 902 | 902 (a closed sprint) | 5 (never counted) |
| TASK-916 zeta | `in_progress/` | 903 | 903 | 2 |

SPRINT-901's `## Members` also holds four lines that all name TASK-912 and must be excluded: a
single-line HTML comment, a multi-line HTML comment (with a list item inside), a prose line, and a list
item with no path.

## Hand-counted expected figures

- **`SPRINT-901` open DoD = 6** (910: 2, 911: 1, 913: 1, 914: 2).
- **Active total = 8** (SPRINT-901: 6 + SPRINT-903: 2). SPRINT-902 is closed and adds nothing.
- Task-file census = **7** (TASK-910 .. TASK-916), across `todo/ in_progress/ done/ cancel/`.

Why the wrong rules read differently:
- the old `sprint:`-stamp rule counts the unlisted decoy: SPRINT-901 reads **10** (6 + 4);
- reading the listed path drops the moved TASK-911 and the `cancel/` item written with backticks: **3**;
- ignoring `status:` also sums the closed sprint: **13** (8 + 5);
- a walker that skips `done/` or `cancel/` loses TASK-913 / TASK-914.
The count is the same on a CRLF copy of this tree (a fresh Windows checkout), which the harness checks.
