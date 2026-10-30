---
sprint: 149
slug: cap-the-intake-review-rounds
owner: Maintainer
last_updated: 2026-10-30
status: closed
close_commit: 40932740
plan_commit: 3c940554
gates_signed: G1,G2 @ 594f04c1
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
Layers: `skills/task-decomposer/` · `skills/orchestrator/references/review-scoping.md` · `skills/lean-doc-generator/SKILL.md`
  · `docs/work/backlog/` · `docs/LEARNINGS.md` · `CHANGELOG.md`
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
| `skills/orchestrator/references/review-scoping.md` | T1 | new § Draft reviews: the owner's five-rule rhythm for a draft reviewed before approval | Low | orchestrator-store 42/0; Codex R1 CLEAR |
| `skills/task-decomposer/SKILL.md` · `skills/lean-doc-generator/SKILL.md` | T1 | one pointer each (step 6 · § Epic) to the new section | Low | caps 134 and 139; prose-density ratchet green after a split |
| `docs/LEARNINGS.md` · `docs/knowledge-index.md` | promote · T1 · close | L-261 and L-262 promoted by merge; L-217 names its second home; L-263 filed; index regenerated | Low | merge-check 5/5 |
| `TECH-DEBT.md` · `docs/work/done/` · `docs/work/cancel/` | promote | §11: 5 resolved TD rows deleted, 4 SPRINT-146 task files pruned | Low | off-host gate 314/0 + 589/0 at `b1dea70a` |
| `CHANGELOG.md` | T1 | [Unreleased] Added line for the draft-review rhythm | Low | — |
| `docs/work/backlog/` (TASK-547..556) | T1 · close | the EPIC-023 S1 Discovery intake (547..555, 2 Codex rounds) and the close follow-up 556 | Low | task-origin 10/10 |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
**Outcome** — 1 of 1 member delivered (TASK-546); 3 of 3 DoD boxes ticked. The owner's draft-review rhythm now sits in the
shipped review-scoping reference, and the intake and epic skills point to it. Its first real use, the EPIC-023 S1 Discovery
intake, ended in 2 Codex rounds; the EPIC-023 proposal and S0 intake on 2026-10-29 had taken 4 and 5. Round 1 found one real
gap, an integrated acceptance no task owned. The intake filed TASK-547..555. System verify: VPS 332/0 + 589/0 at `5d7f421d`.

**Retrieval check** — no miss of a rule on record. Three rules fired where they were meant to: the prose-density ratchet caught
a pointer pushing a line past 400 characters (split, never squeeze); L-240 caught a declared `Layers:` token that nothing had
used, pruned by scope-change before close; and the § Draft reviews self-check caught a remembered fact before it froze (a
dry-run repo assumed to have business docs had none, L-130). One false hit: a case-insensitive grep for task ids matched the
`/task-decomposer` name, which is L-108's shape rule seen from the red side, caught on read.

**Cost** — coordinator plus sub-agents: builder check about 57k tokens; three Codex review passes about 49k (T1 review 16k,
S1 intake R1 17k, R2 16k). About 106k sub-agent tokens in all. Two VPS gate runs (promote and close), both green; one local
bare gate truncated at its 520 s budget (TASK-329's known host limit). The coordinator session is unmetered.

**Worked**
- The rhythm held on its first real intake: owner forks asked before R1 (three popups), the altitude stated in the brief, and
  R2 limited to closing R1's finding. R2 found nothing new.
- The builder check caught a scope widening the design had slipped in (G2 design reviews) before the owner signed it.

**Friction**
- The intake ran from the installed 2.19.1 copy, which predates the step-6 pointer, so the coordinator followed the repo's
  section directly (L-021's known lag between a same-sprint skill edit and the running copy).
- Two shipped SKILL.md files sit at 139 and 140 of 140 lines; any pointer there has to ride an existing line.

**Pattern candidate**
- L-263 (count 1): a breakdown split per component needs one task whose acceptance runs the whole flow on real input.

**Buckets routed** — Shipped: the CHANGELOG [Unreleased] line written in T1. Tech debt: none new. Follow-ups: TASK-556
(widen TASK-536 to the profile topics, `origin: close-retro`). Learnings: L-263.
