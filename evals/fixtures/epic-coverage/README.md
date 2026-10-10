# epic-coverage fixtures

Inputs for the **active-epic coverage** procedure (STANDARD § 2 *Epic coverage*; `skills/lean-doc-generator/references/epic-coverage.md`).
It is model-executed, so there is no runner: walk the procedure over each case and compare with the verdict below.
Every case holds a copy of EPIC-015 (as of SPRINT-121) whose four open § Closed-when lines are annotated
`→ TASK-415` (CW5) · `→ TASK-414` (CW6) · `→ TASK-415, TASK-416` (CW7) · `→ TASK-417` (CW8), plus a minimal `docs/work/` tree.
The task files are stand-ins (frontmatter + one open box).

| Case | Setup | Expected verdict |
|---|---|---|
| `a-covered` | 414/415/416 in `todo/`, 417 in `backlog/` | **fully covered** — 4 open, 4 mapped, 0 uncovered |
| `b-one-missing` | as `a`, `TASK-414` file removed | **exactly CW6 uncovered** (`missing: TASK-414`) |
| `c-proposed-exempt` | as `a` but `status: proposed`, **no** annotations, empty store | **exempt** — 0 reported, though 4 open lines are unmarked |
| `d-stale-done` | as `a`, `TASK-417` in `done/` while CW8 is still `[ ]` | **exactly CW8 uncovered** (`stale: TASK-417 done`) |
| `e-partial-overlap` | as `a`, `TASK-415` removed (416 remains) | **exactly CW5 uncovered** (`missing: TASK-415`); CW7 stays **covered** by `TASK-416` (≥1 open id suffices) |

Every case also satisfies the cross-check: open items scanned = covered + uncovered reported.
