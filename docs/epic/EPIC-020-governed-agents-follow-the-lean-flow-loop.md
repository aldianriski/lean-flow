---
epic: 020
slug: governed-agents-follow-the-lean-flow-loop
owner: Maintainer
last_updated: 2026-10-06
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-020 — Governed Agents Follow the Lean-Flow Loop

> **Outcome:** from one sentence, a decomposer agent clarifies with the operator through question cards and proposes work items the
> operator approves; each item is built, then independently reviewed (Codex, read-only), and nothing is kept without the operator's
> gate, with every agent's permissions shown in, and enforced by, one policy table in workdoo.

## Why this, why now

The first accepted loop on the VPS (2026-10-06) proved the run, gate and accept path, and showed what the owner works around by hand:
every work item is typed one by one, review is a person reading a diff, and three attempts missed their criteria (fixed by workdoo
TASK-065). The owner asked for governed agents that follow lean-flow's own loop: a decomposer that runs lean-flow's clarify-then-slice
process, an independent reviewer (Codex as a second opinion), and one place that says which agent may do what. Nothing in the
EPIC-008 to EPIC-016 register plans a roster, a decompose step or a review step (survey, 2026-10-06). EPIC-012 plans a worker registry and a
second runtime but is gated. Member sprints are **workdoo** sprints, as in EPIC-016, 018 and 019.

## Scope

**In:** named agent profiles · a `decompose` step with question cards and proposals the operator approves · a `review` step with an
independence rule · a Codex read-only reviewer adapter · one policy table (agent × step × authority × gate), shown and enforced.
**Out (explicitly not):** Codex or any second runtime as an **implementer** (EPIC-012) · auto-approved gates · agent chains that keep
results without a person · lean-flow plugin agent definitions (the roster lives in workdoo; lean-flow ships none, ADR-044) · policy
authoring beyond workdoo's own table (EPIC-011).

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|

## Decisions

- **D1** — An agent is a **named profile** (name, skills, steps it may run, model, runtime), resolved by workdoo's control plane. A
  profile can only **narrow** the tools a step is issued, never widen them (`resolveGrant` stays the sole issuer). Owner, 2026-10-06.
- **D2** — The decomposer **proposes**; nothing exists until the operator approves the set, after **clarify rounds** in the style of
  lean-flow's grill (frontier rounds, a recommended answer each). Owner, 2026-10-06.
- **D3** — **Codex is admitted as a read-only reviewer**. This amends EPIC-016's "a second real runtime — Codex … after the pilot" for
  this role only; Codex as an implementer stays with EPIC-012. Owner ruling, 2026-10-06.
- **D4** — **Human gates plus independent review**: every agent's output waits at a human gate unless the work item is J1 and that
  agent and step are pre-approved; a reviewer must differ from the implementer (agent, model or runtime); a missing or failed review
  blocks keeping the result, as a missing verdict does today. Owner, 2026-10-06.
- **D5** — workdoo's run gains **`decompose`** and **`review`** steps. The frozen core architecture (`adlc-epic-sequencing.md`) is
  opened **for exactly this scope**, as the V3 amendment did for EPIC-015. Owner ruling, 2026-10-06.
- **D6** — Order: workdoo SPRINT-009 → EPIC-019 (redesign) → **EPIC-020** → EPIC-018 (Projects). Owner, 2026-10-06.
- **D7** — Until EPIC-011 opens, the policy is a table **inside workdoo**; EPIC-011 later owns the authoring language. Default, owner-confirmed.

## Open questions

- **Governance ADR** (grill → workdoo ADR, next free id at writing): the steps, the roster, the independence rule, where policy lives,
  and how the J-classes apply per agent. Gates workdoo TASK-066.
- **Can a headless Claude run use lean-flow's decomposer skill reliably under the plugin version pin?** (Research.) Covers the Skill tool
  in `--allowedTools`, plugin discovery from the worker's directory, and the version probe. Gates workdoo TASK-067.
- **Codex CLI measured** (Research): headless invocation, sandbox and read-only mode, how a denied tool shows up, version pinning on
  Linux. The Claude findings (A3) do not transfer. Gates workdoo TASK-070.
- **Proposal shape and question cards in the v0.2.0 design** (Prototype): the proposal schema, and how a card holds several independent
  questions with recommended answers. Feeds workdoo TASK-067 and TASK-068.

## Closed when

- [ ] One sentence produces, after at least one clarify round, a set of proposals the operator edits and approves into linked work items.
- [ ] A built result is reviewed by an agent that differs from its implementer (Codex), and keeping is refused while that review is missing or failed.
- [ ] Every agent's allowed steps, tools and gates come from one table the UI shows, and a test proves an agent cannot exceed its row.
- [ ] A real feature, with at least two work items, runs decompose → build → review → keep on the VPS end to end.
