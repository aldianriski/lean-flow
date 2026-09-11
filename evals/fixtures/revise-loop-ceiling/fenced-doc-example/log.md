### 2026-09-11 | progress | T4 — a log that DOCUMENTS the retry format inside its own run window

This fixture is the self-describing-corpus case (L-108), and it is not hypothetical: `reap()` carries
a comment recording the identical incident one function up, where a T1 entry documenting the rollup
format contained `T5 · unattempted · …` at line start and a whole-file grep read that documentation
as the run's own output, silently dropping a task.

Windowing to `base` does not help here — the quoted example lives INSIDE this run's own window. The
format a retry line takes is:

```
T4 · retry · Spec: finding-a → fixed
T4 · retry · Spec: finding-a-again → fixed
```

Two lines at line start, same task, both inside the window. If the checker counts them, it reports
`revise-loop-ceiling-exceeded` for a run in which **no retry ever fired**. The real state of T4 is:

T4 · done
