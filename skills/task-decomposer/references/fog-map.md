# Fog-map mode — planning work too foggy to slice

Companion to `/task-decomposer`. Use when the work is **too large/foggy to decompose into `TASK-NNN`
yet** — you can't write acceptance criteria because the *decisions aren't known*. Forcing premature
tasks here manufactures false precision; instead, map the fog and resolve it decision-by-decision until
the path is clear, then decompose normally. (Adapted from mattpocock/skills → wayfinder.)

## When it fires

- The grill (Procedure step 1) reveals the frontier is unknowable — every slice depends on an unmade decision.
- The work is bigger than one planning session can hold (a subsystem, a migration, an open research direction).
- Invoked explicitly with `--fog "<goal>"`, or **offered** when a normal decompose stalls on open decisions.

If the work *can* be sliced now, don't use this — go straight to the normal Procedure.

## The fog-map artifact

One living map (a scratch doc, or a `wayfinder:map`-style tracker issue). It is an **index**, not a plan:

```
DESTINATION       what "done" looks like — the one outcome the whole effort serves
NOTES             domain context, constraints, preferences that shape the decisions
DECISIONS SO FAR  resolved tickets, one line each (the path cleared)
NOT YET SPECIFIED the fog — emerging questions not yet sharp enough to ticket
OUT OF SCOPE      consciously excluded — the explicit no's
+ the open decision-tickets (below)
```

**Name tickets by their title, never a bare number** — names carry context; IDs are just metadata.

## Decision-tickets — resolve *decisions*, not deliverables

A fog-map ticket exists to **remove one uncertainty**, then close. Four types, each **routing to an
existing skill** (the fog-mode sequences what we already have — it never reimplements it):

| Ticket | Mode | Resolves via | Output |
|---|---|---|---|
| **Research** | AFK | research-spike · `Explore` | a markdown findings summary |
| **Prototype** | HITL | `/prototype` | a throwaway artifact answering one design question |
| **Grilling** | HITL | the intake grill (AskUserQuestion) | a pinned decision / definition |
| **Task** | HITL/AFK | normal decompose | a prerequisite that unblocks a decision |

Wire dependencies between tickets; the ones with no blockers start immediately.

## The loop

**Chart** → name the Destination · map the frontier breadth-first · create the map · create the initial
tickets · wire dependencies · stop.
**Work** → claim a ticket · resolve it via its routed skill · record the answer in DECISIONS SO FAR ·
close it · update the map · **graduate** any now-concrete buildable work into `TASK-NNN` (the normal
pipeline) and any newly-visible fog into fresh tickets.
**Stop** when NOT YET SPECIFIED is empty and no decision is uncertain — the way to the destination is
clear. Then decompose the cleared work with the normal Procedure.

## Worked example (graph-view + OKF — real, SPRINT-021 T1 exercise)

```
DESTINATION: a derived, on-demand graph VIEW over the doc metadata (supersedes lineage ·
             cross-sprint clusters · orphan detection), regenerated from SSOT, never hand-edited.
DECISION TICKETS:
  ▸ Research (AFK)   Does ADR-009 metadata + gen-index already cover the graph's node/edge needs?
  ▸ Research/scan(AFK) OKF adoption — align to OKF, or keep our richer typed model?  [→ done: okf-adoption.md]
  ▸ Prototype (HITL) Does a graph view beat the current generated index for comprehension?
  ▸ Grilling (HITL)  Strict-lint vs OKF-permissive: fail-loud on dangling links, or tolerate?
NOT YET SPECIFIED: generation mechanism (script vs graphify) · staleness-check shape
OUT OF SCOPE: a separately-maintained graph — council-REJECTED (unanimous, TASK-040)
```

Note how it routes (research-spike · `/prototype` · grill) and graduates (the OKF scan already closed one
ticket → `okf-adoption.md`; a resolved prototype signal would graduate the build into `TASK-NNN`).
