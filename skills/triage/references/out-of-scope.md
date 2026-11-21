# Out-of-scope record

Rejected enhancements are remembered, not forgotten — so they are not re-litigated next quarter.
Create lazily (only on the first rejection). **One file per *concept*, not per task** — repeat
requests for the same thing accumulate under one file's `prior-requests` list.

```
.out-of-scope/<concept-slug>.md
# <Concept name>
- date: YYYY-MM-DD
- decision: out of scope
- reason: <durable why — project scope/philosophy · technical constraint · strategic choice>
- revisit-if: <the condition that would change the answer, or "—">
- prior-requests: TASK-012, TASK-031, …
```

- **Durable reason, not a deferral** — "we're too busy right now" is a deferral, not a rejection; don't file it. The reason must still hold next year.
- **Match by concept, not keyword** — "night theme" matches `dark-mode.md`. On a match, surface it: *"resembles `.out-of-scope/<x>.md`, rejected because … — still true?"* → **confirm** (append to `prior-requests`, move the task to `cancel/` — `git mv`, or a plain move with no git) · **reconsider** (delete the file, task proceeds) · **disagree** (related but distinct, task proceeds).

