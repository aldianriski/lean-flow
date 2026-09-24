---
name: triage
description: Use when the existing backlog needs grooming — re-prioritising tasks, flagging stale/duplicate/conflicting items, marking what is ready vs blocked vs needs-info, and routing rejected work out of scope. Operates on task files in docs/work/backlog/ only, never a sprint's members. Do not use to create new tasks (use /task-decomposer) or to form a sprint from the groomed backlog (use /lean-doc-generator promote).
argument-hint: "[ | TASK-id | \"focus — e.g. what's ready for agents\"]"
allowed-tools: Read, Write, Edit, Bash(git *), Glob, Grep
user-invocable: true
version: "0.1.0"
---

# triage

Groom the existing backlog: re-rank, flag, state, and route. **Backlog only** — the task files in
`docs/work/backlog/`; never touches a sprint's members (`todo/` · `in_progress/` · `review/`), which
are locked. Re-prioritisation and state changes are **HITL**: propose with reasons, get a
`y`, then apply.

Pipeline: `/task-decomposer` (intake) → **`/triage`** (groom + re-prioritise) → `/lean-doc-generator promote` (form sprint) → `/orchestrator` (build).

`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).
On v1 or mixed, name it and refuse to groom — point to `/lean-doc-generator migrate`, the only 2.x path for a v1 tree.

## When to invoke

- The backlog has grown and priorities have drifted from reality.
- Before a Sprint Promote, to surface what is genuinely ready.
- A specific task needs a state or priority decision.
- A bug report (`BUG.md.template`-shaped) needs intake routing.

## Task states (light)

A backlog task file carries `state:` in its frontmatter — orthogonal to the `autonomy:` `HITL`/`AFK`
label (which says *who* acts, not *whether it's ready*) and to the folder (which says *status*).
**Readiness is never a folder**: a `blocked` or `needs-info` task stays in `backlog/`, and no state
change is ever a `git mv`.

| state | meaning |
|---|---|
| `ready` | fully specified, has a done-when — promotable |
| `needs-info` | missing detail or an unanswered question — not promotable yet |
| `blocked` | waiting on a dependency or another task (`depends-on`) |

Rejected work is not a state — it leaves the backlog (see `.out-of-scope/`). Default when unset:
`ready` if it has a done-when, else `needs-info`.

## Flow

1. **Scan `.out-of-scope/` first** — if a backlog task resembles a prior rejection, surface it and ask before keeping it.
2. **Load** — after the layout check above (v1/mixed stops here): read every `docs/work/backlog/TASK-*.md` — frontmatter + `## Done when` + `## Assumes` (+ root `TECH-DEBT.md`). Read other folders only to resolve a `depends-on:` id; never groom them.
3. **Bug intake** — a BUG.md-shaped item (or bug-flavored backlog entry) is routed, not ranked like a feature:
   - known cause + trivial fix → a new task file in `backlog/` (`state: ready`, **`origin: triage-bug`**) — same shape and id rule as `/task-decomposer` writes (id = max over `docs/work/*/TASK-*.md`, all six folders, + 1)
   - unknown cause / needs investigation → record as a task, `next: /diagnose` (**`origin: triage-bug`**)
   - systemic / architectural → file as `TD-NNN` in root `TECH-DEBT.md`
   - **stamp `origin:` on every task you file here** — a bug converted at triage never met the intake
     grill, and the stamp is what stops G1 fast-pathing it on the strength of looking well-formed
   - **then the report itself is done.** A `BUG-<slug>.md` is temp-dir intake scaffolding, never a
     committed doc (STANDARD §2): once its repro and verdict live in the destination, the file has
     no durable home to be moved to. Carry anything still load-bearing — repro steps especially —
     **into** the `TASK`/`TD`/`/diagnose` brief rather than pointing back at a file that will vanish.
4. **Re-rank** — re-evaluate each task's `priority:` (P0–P3, by impact × urgency); propose moves with a one-line reason each. Sequence is then **derived** (§ Order), never hand-set.
5. **Flag** — surface **stale** (no movement / superseded), **duplicate** (same concern → merge or differentiate), **conflict** (acceptance criteria that contradict another task).
6. **State** — set `state:` `ready` / `needs-info` / `blocked`; for `needs-info` list the specific questions as `- **open:**` lines under `## Assumes`; for `blocked` name the blocker in `depends-on:` (a task) or a `- **blocked-by:**` line (anything else).
7. **Route rejects** — for work that will not be done, write an `.out-of-scope/` entry, then `git mv` the task file `backlog/ → cancel/` (§ Applying). A merged duplicate goes the same way, with a `## Amended <date>` line naming the survivor.
8. **Output** — the groomed backlog in derived order + a **ready-to-promote shortlist** (that order, `ready` only). Apply changes only after human `y`.

## Order (derived, never stored)

Folders cannot sequence, and there is **no order file** — a stored order is a second copy that
drifts from `priority:`. The backlog's order is computed each time:

1. **`priority:`** — P0 before P3.
2. **Topological over `depends-on:`** — a task never precedes a blocker still in the backlog. A
   lower-priority blocker is pulled forward: it sorts at the highest priority of anything waiting on
   it, directly or transitively (its own `priority:` is not rewritten). A dependency in
   `done/` or `cancel/` is satisfied; one in `todo/`–`review/` is in flight (the task stays `blocked`).
3. **Task id** — numeric, as the final tie-break (`TASK-99` before `TASK-100`).

A `depends-on` cycle is a finding — report its ids; never break it silently.

## Applying (after `y`)

- **Priority / state** — edit those two lines in place, and add or remove only the `open:` /
  `blocked-by:` lines under `## Assumes`; every other line stays byte-identical (`authority:` ·
  `origin:` · existing assumptions · the done-when are not triage's to rewrite).
- **Cancel** — `git mv docs/work/backlog/<file> docs/work/cancel/` in its **own commit**; any content
  edit (the `## Amended` note) lands in a separate commit before it. A status change never shares a
  commit with a content edit.

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
- **Match by concept, not keyword** — "night theme" matches `dark-mode.md`. On a match, surface it: *"resembles `.out-of-scope/<x>.md`, rejected because … — still true?"* → **confirm** (append to `prior-requests`, `git mv` the task to `cancel/`) · **reconsider** (delete the file, task proceeds) · **disagree** (related but distinct, task proceeds).

## Hard rules

- **Backlog only** — never re-order, re-state or move a file in `todo/` · `in_progress/` · `review/` (a sprint in flight is locked).
- **Readiness is a field** — `state:` changes are frontmatter edits; the only move triage makes is `backlog/ → cancel/`.
- **No order file** — order is derived (§ Order); never write a sequence anywhere.
- **HITL** — propose re-ranks, state changes, merges, and rejections; apply only after `y`. **Unattended** (headless): the `y` can never arrive — there is no ask channel at all (`AskUserQuestion` unregistered; `dontAsk` auto-denies). Emit the proposal and **park** it (`night-run.md` Part 0); a missing `y` is a no, never a yes.
- **Never silently delete** — a removed task is `git mv`-ed to `cancel/` (never `rm`), with an `.out-of-scope/` entry or a merge note. No task vanishes without a trail.
- **Don't re-decompose** — triage grooms existing tasks; new tasks come from `/task-decomposer`.

## Red flags

❌ **Re-prioritising the Active Sprint** — a sprint is locked; grooming is a Backlog activity.
❌ **Moving a file to say it is blocked** — readiness is `state:`; a folder is status only.
❌ **Hand-ordering the backlog** — a written order drifts from `priority:`; derive it.
❌ **Deleting a task with no trail** — route to `.out-of-scope/` or merge with a note.
❌ **Promoting a `needs-info` / `blocked` task** — only `ready` work is promotable.
❌ **Re-ranking without a reason** — every priority move carries a one-line justification.
❌ **Ignoring `.out-of-scope/`** — re-litigates settled rejections; always scan it first.
