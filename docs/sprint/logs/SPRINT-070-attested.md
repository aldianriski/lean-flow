---
sprint: 070
slug: attested
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-070 — Execution Log

> Append-only companion to [`../SPRINT-070-attested.md`](../SPRINT-070-attested.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | progress | G1+G2 signed @ `cac204b`; assumptions re-derived rather than trusted

Batch G1 ran the **full** checklist for both tasks, not the fast path: the Plan's `### Tn` entries
carry no `origin:` field, and a missing origin is treated as ungrilled by rule. Both `M`, both HITL,
no `L` to split. G2 confirmed D3's file-disjointness against the actual `Layers:` — T1 is `spec/` +
`docs/`, T2 is `skills/orchestrator/references/dispatch.md` + `evals/`, no shared file, no
`Depends-on:` edge.

A1 · A2 · A3 · A5 re-derived and hold. **A2 re-measured at execution as its own text instructs
(L-097):** `%G?` = `N` on 20 of 20 recent commits — this repo signs nothing, so T1's worked example
must demonstrate the unsigned case honestly rather than illustrate a signature that does not exist.

**A4 carries one stale figure, reported not silently corrected:** it states `TODO.md 178/320`; the
file is **118** lines, at HEAD *and* at `plan_commit` `76eb88a`, so the figure was never right rather
than having drifted. The assumption's *conclusion* — no cap blocks — is unaffected, and both the
`CLAUDE.md 63/80` and `CONTEXT.md 132/150` legs reconcile exactly. Recorded because a stated figure
that nobody re-derives is how L-088 sprints close green against numbers no one re-agreed to.

### 2026-08-16 | surprise | T2's mechanism was already in the repo — L-046, six sprints before TD-054 asked

TD-054 has been held open since SPRINT-063 on one question — *why* does a dispatched worktree branch
from a stale sha when the session is current — and its own text forbids writing the guard until that
cause is understood (L-091). The cause is **measured and confirmed**: `origin/main` is `622f420`,
which is exactly the sha all four worktrees across SPRINT-068 and SPRINT-069 pinned to, while local
`main` sits **31 commits ahead and unpushed**. Agent worktrees fork from the **remote default
branch**, not local HEAD. Nothing pinned them; `origin/main` simply stood still because push is
owner-reserved here.

The surprise is not the mechanism, it is where it was: **`L-046` (SPRINT-026, `status: active`)
states it verbatim**, and `dispatch.md` line 327 already carries it as the "base-ref caveat" —
inside the very file T2 was promoted to edit. Two independent records, both in context, and the
question stayed open for six sprints across three aging re-reviews. TD-054's cost accounting from
SPRINT-069 (a merge conflict, a task forced inline, union-verification on every merge) was paid
against an answer the repo already held. This is a candidate learning, not just a finding.

### 2026-08-16 | surprise | worktree dispatch is disqualified for this sprint; D3's order-indifference does not hold

Consequence of the above, established before any dispatch rather than at merge-back.
`spec/STANDARD.md`, `spec/CHANGELOG.md` and `ADR-024` are **absent at `origin/main`** — they were
created in SPRINT-069, which is inside the unpushed 31. T1 edits files that exist only in unpushed
commits, which `dispatch.md`'s own corollary forbids worktree-dispatching (the merge becomes add/add
on the task's primary file).

D3 pre-locked T1 and T2 as file-disjoint with "no ordering constraint". File-disjoint holds; **order-
indifferent does not** — T2's cure is the thing that would make T1 dispatchable at all. Not logged as
a `scope-change`: no scope moved, and the Plan is untouched. **Owner ruling at G2: both tasks run
inline, T2 first**, and T2's cure is the root-cause fix (`worktree.baseRef: "head"`) *plus* the
halting guard, per TD-054's own framing — the assertion catches it, the pin is the thing to fix.

Also observed, not acted on: two leftover branches `worktree-agent-a756b5b9e735387c6` and
`worktree-agent-af7c31821869c7fd1` with no registered worktrees. `dispatch.md`'s pre-dispatch
guardrail (harness issue #51596) says clean these before any dispatch.
