---
sprint: 149
slug: cap-the-intake-review-rounds
owner: Maintainer
last_updated: 2026-10-30
status: active
plan_commit: 3c940554
update_trigger: sprint execute/close events
---

# SPRINT-149 — Cap the Intake Review Rounds

> **Theme:** The review-round cap from ADR-053 § Decision 5 fires at G2 only, so intake and proposal reviews run uncapped.
> On 2026-10-29 the EPIC-023 proposal took 4 Codex rounds and its S0 intake took 5, and each round after the first
> found a new High in the text the last fix had added. This sprint places the owner's review rhythm where those reviews
> read it, before the next EPIC-023 intake (S1 Discovery) runs.

## Scope

**In:** the review rhythm (self-check before R1 · owner forks asked before R1 · altitude in the brief · at most 2 rounds,
R2 blocking only on an outcome-changing High · the rest carried as G2 notes · fixes state what must be true), placed by
§10's placement test in the shipped skill or reference every intake and proposal review reads, with the L-217 pointer
line naming it (T1, TASK-546).
**Out (deferred):** TASK-367, 402, 489, 498, 536..541, 543..545 (blocked) · TASK-507, 523 (`needs-info`). No new guard,
gate leg or field: the rule ships as prose.

## Members

- docs/work/todo/TASK-546-place-the-review-round-cap-where-intake-reviews-read-it.md

## Plan

### T1 — Place the review-round cap where intake and proposal reviews read it `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `skills/task-decomposer/` · `docs/LEARNINGS.md` · `docs/knowledge-index.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-546-place-the-review-round-cap-where-intake-reviews-read-it.md`
  · `docs/work/in_progress/TASK-546-place-the-review-round-cap-where-intake-reviews-read-it.md`
  · `docs/work/done/TASK-546-place-the-review-round-cap-where-intake-reviews-read-it.md`
Depends-on: none
Cites: `TASK-546` · L-217 · ADR-053 (§ Decision 5)

L-217 is promoted, but its home fires at G2, and both of the 2026-10-29 overruns came before G2. Which flows run an
intake or proposal review is a §10 placement-test question, answered at G2; `skills/task-decomposer/` is the likely home
and the declared guess. A shipped-skill change, so it is written for the consumer, not for this repo's Codex loop.

**Acceptance:** a reader running an intake or proposal review meets the rhythm in the skill that runs it, and the next
real intake review here ends in at most 2 rounds.

## Decisions (pre-locked)

- **D1** — One task, main tree. Status moves, Log and sprint-file edits commit as bare `sprint(149):` (L-238), and so does a
  tick on the member in a folder its `Layers:` does not name (L-258). If G2's placement test picks another home, that
  path joins `Layers:` by scope-change first (L-229).
- **D2** — Tier P (shipped prose): G1 + a read-through. It is a shipped-skill change, so the owner's Codex review loop
  applies, run under the rhythm it places: at most 2 rounds, the rest carried as G2 notes. Consumer check: no
  maintainer-only path and no Codex-specific wording in the shipped text (L-015).
- **D3** — Owner ruling at promote: DoD 3's vehicle is the next real `/task-decomposer` intake run inside this sprint
  (e.g. EPIC-023 S1 Discovery). If none runs before close, the box stays open and T1 does not close on a substitute.
- **D4** — Not frozen under ADR-053: prose in an existing skill, no new machinery. Before ticking, run every check that
  reads a touched file (L-251), and name files in governed prose only when they are meant (L-261).

## Assumptions

- **A1** — §10's placement test lands in `skills/task-decomposer/`. *Confirm: T1 G2; a different home is a scope-change.*
- **A2** — A real intake review runs inside this sprint. *Confirm: owner, at T1 G2 (D3).*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-149-cap-the-intake-review-rounds.md`](logs/SPRINT-149-cap-the-intake-review-rounds.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
