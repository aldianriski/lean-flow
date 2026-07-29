---
name: triage
description: Use when the existing backlog needs grooming — re-prioritising tasks, flagging stale/duplicate/conflicting items, marking what is ready vs blocked vs needs-info, and routing rejected work out of scope. Operates on TODO.md Backlog only, never the Active Sprint. Do not use to create new tasks (use /task-decomposer) or to form a sprint from the groomed backlog (use /lean-doc-generator promote).
argument-hint: "[ | TASK-id | \"focus — e.g. what's ready for agents\"]"
allowed-tools: Read, Write, Edit, Glob, Grep
user-invocable: true
version: "0.1.0"
---

# triage

Groom the existing backlog: re-rank, flag, state, and route. **Backlog only** — never re-orders a
locked Active Sprint. Re-prioritisation and state changes are **HITL**: propose with reasons, get a
`y`, then apply.

Pipeline: `/task-decomposer` (intake) → **`/triage`** (groom + re-prioritise) → `/lean-doc-generator promote` (form sprint) → `/orchestrator` (build).

## When to invoke

- The backlog has grown and priorities have drifted from reality.
- Before a Sprint Promote, to surface what is genuinely ready.
- A specific task needs a state or priority decision.
- A bug report (`BUG.md.template`-shaped) needs intake routing.

## Task states (light)

A Backlog task carries an optional `state:` — orthogonal to the `HITL`/`AFK` label (which says *who*
acts, not *whether it's ready*):

| state | meaning |
|---|---|
| `ready` | fully specified, has a done-when — promotable |
| `needs-info` | missing detail or an unanswered question — not promotable yet |
| `blocked` | waiting on a dependency or another task (`depends-on`) |

Rejected work is not a state — it leaves the backlog (see `.out-of-scope/`). Default when unset:
`ready` if it has a done-when, else `needs-info`.

## Flow

1. **Scan `.out-of-scope/` first** — if a backlog task resembles a prior rejection, surface it and ask before keeping it.
2. **Load** — read `TODO.md` § Backlog (+ root `TECH-DEBT.md`; legacy: TODO § Tech Debt). Ignore the Active Sprint.
3. **Bug intake** — a BUG.md-shaped item (or bug-flavored backlog entry) is routed, not ranked like a feature:
   - known cause + trivial fix → convert to `TASK-NNN` (`state: ready`)
   - unknown cause / needs investigation → record as a task, `next: /diagnose`
   - systemic / architectural → file as `TD-NNN` in root `TECH-DEBT.md`
4. **Re-rank** — re-evaluate each task's P0–P3 tier; propose moves with a one-line reason each. Order within a tier by dependency, then impact × urgency.
5. **Flag** — surface **stale** (no movement / superseded), **duplicate** (same concern → merge or differentiate), **conflict** (acceptance criteria that contradict another task).
6. **State** — set `ready` / `needs-info` / `blocked`; for `needs-info` list the specific questions; for `blocked` name the blocker.
7. **Route rejects** — for work that will not be done, write an `.out-of-scope/` entry, then remove the task from the backlog with a pointer.
8. **Output** — the groomed backlog + a **ready-to-promote shortlist** (P-order, `ready` only). Apply changes only after human `y`.

## `.out-of-scope/` knowledge base

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
- **Match by concept, not keyword** — "night theme" matches `dark-mode.md`. On a match, surface it: *"resembles `.out-of-scope/<x>.md`, rejected because … — still true?"* → **confirm** (append to `prior-requests`, drop the task) · **reconsider** (delete the file, task proceeds) · **disagree** (related but distinct, task proceeds).

## Hard rules

- **Backlog only** — never re-order or re-state the Active Sprint (a sprint in flight is locked).
- **HITL** — propose re-ranks, state changes, merges, and rejections; apply only after `y`.
- **Never silently delete** — a removed task goes to `.out-of-scope/` with a pointer, or is merged with a note. No task vanishes without a trail.
- **Don't re-decompose** — triage grooms existing tasks; new tasks come from `/task-decomposer`.

## Red flags

❌ **Re-prioritising the Active Sprint** — a sprint is locked; grooming is a Backlog activity.
❌ **Deleting a task with no trail** — route to `.out-of-scope/` or merge with a note.
❌ **Promoting a `needs-info` / `blocked` task** — only `ready` work is promotable.
❌ **Re-ranking without a reason** — every priority move carries a one-line justification.
❌ **Ignoring `.out-of-scope/`** — re-litigates settled rejections; always scan it first.
