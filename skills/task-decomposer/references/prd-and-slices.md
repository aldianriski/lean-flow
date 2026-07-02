# PRD & tracer-bullet slices

Used by `task-decomposer` when an intent is large (a feature, epic, or `--prd`). Two stages —
synthesize a PRD, then cut it into tracer-bullet slices that become `TASK-NNN` Backlog entries.
Output is **local**: `TODO.md` Backlog, never an external tracker.

## Synthesize vs interview

If the conversation already contains the spec (a design discussion just happened), **synthesize the
PRD from context — do not re-interview**. Interview only to fill genuine gaps. Use the project's
domain glossary (`CONTEXT.md`) for vocabulary throughout, and respect ADRs in the area.

## PRD template

```
# <Feature> — PRD

## Problem Statement
The problem the user faces, from the user's perspective.

## Solution
The solution, from the user's perspective.

## User Stories
A LONG, exhaustive numbered list. Each: "As a <actor>, I want <feature>, so that <benefit>."
Cover every aspect of the feature.

## Implementation Decisions
Modules built/modified · interfaces changed · architectural decisions · schema changes · API
contracts · specific interactions. NO file paths or code snippets — they go stale.
Exception: a prototype-derived snippet that encodes a decision more precisely than prose
(state machine, reducer, schema, type shape) — inline only the decision-rich bits and note it
came from a prototype.

## Testing Decisions
What makes a good test here (external behaviour, not implementation — see /tdd) · which modules
get tested · prior art (similar tests already in the codebase) · the seams you'll test at.
Pick the test **mix** per the pyramid + risk tier (`/tdd` `references/test-standard.md`): tag each
testable slice P0–P3 → depth (P0-P1 → E2E+unit · P2 → unit/integ · P3 → unit or skip).

## Out of Scope
What this PRD does NOT cover.

## Further Notes
Anything else worth recording.
```

## Seams (the testing skeleton)

Before decomposing, sketch the seams you'll test the feature at. **Prefer existing seams; use the
highest seam possible.** If a new seam is needed, propose it at the highest point you can, and check
the seam choice with the user. (Seam detail → `/tdd` `references/testability.md`.)

## Tracer-bullet vertical slices

Cut the PRD into slices, each a **thin vertical path through EVERY layer** end-to-end
(schema → API → UI → tests), never a horizontal slice of one layer.

- Each slice is independently demoable / verifiable on its own.
- **Prefer many thin slices over few thick ones.**
- Mark each `HITL` or `AFK`; prefer `AFK` where safe.
- Record `depends-on` — which slices must land first.

## Breakdown quiz (before writing anything)

Present the slices as a numbered list — Title · HITL/AFK · Blocked-by · user-stories-covered — and ask:

- Does the granularity feel right (too coarse / too fine)?
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the right slices marked HITL vs AFK?

Iterate until the user approves. Then each approved slice → one `TASK-NNN` entry in `TODO.md` Backlog,
in **dependency order (blockers first)**, per the task entry shape in `SKILL.md`.
