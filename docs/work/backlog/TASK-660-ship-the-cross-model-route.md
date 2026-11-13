---
id: TASK-660
title: "Ship the cross-model route: from a Claude host, another provider's CLI reviews, builds or diagnoses"
type: feature
priority: P2
size: L
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-659]
---

# TASK-660 — Ship the cross-model route: from a Claude host, another provider's CLI reviews, builds or diagnoses

## Why

The owner's Codex reviews caught an ADR-034 break and an ADR-053 freeze breach that a same-provider reviewer
missed, and the owner already has Codex build in a worktree with Claude reviewing. Both practices live only
in session notes, so a consumer gets neither. Owner ruling 2026-11-13: "claude host, codex review, but
codex also can execute or other help process".

## Done when

**Review**
- [ ] A new reference file in `skills/orchestrator/references/` tells a Claude-host coordinator how to hand
      a review to another provider's CLI: the prompt goes in by stdin or a file, the reviewer runs with
      read-only project permissions, the model is named explicitly, the call runs to completion under a
      bounded timeout, and its output files sit outside the working tree.
- [ ] The file says what counts as a result: a completed turn with a verdict line plus TASK-659's coverage
      and limitations. Empty output, a timeout, a permission failure, or exit 0 with no verdict is never an
      approval. There is no silent retry on another model or provider. When the other CLI is missing or
      fails, the review falls back to the same-provider scoped reviewer and is recorded as that.
- [ ] Rounds follow the existing caps (drafts: two; code: one bounded retry), and the review is recorded
      as `scoped-reviewer`.

**Build and diagnosis**
- [ ] The file covers a delegated build: an isolated clean worktree, write permission scoped to it, the
      worker brief pasted verbatim, and the coordinator landing and committing the diff. The builder's own
      success report is not verification; the coordinator runs the checks.
- [ ] The builder never grades its own work: a diff built by the other provider is reviewed by a Claude
      reviewer, and mixed authorship is recorded per file or per commit.
- [ ] The file covers a read-only diagnosis handoff for work that has failed twice: the other provider gets
      the reproduction, the evidence and the failed approaches, and is asked for a testable alternative
      explanation.

**Opt-in and wiring**
- [ ] The route is off by default. It fires for intake drafts, G2 designs, the post-build code review, a
      delegated build and a diagnosis handoff only when the host repo's CONTEXT file declares it or the
      owner asks in the session.
- [ ] Wiring: the review routing in `review-scoping.md` (draft reviews and the skip table) and the dispatch
      routing in `dispatch.md` point at the file, and a cold reader starting from `/orchestrator` or
      `/task-decomposer` step 6 reaches it.

**Proof**
- [ ] Exercised with the opt-in on, by a fresh agent given only the shipped references: one real Codex
      review of a real draft; one of a real diff; one real task built by Codex in a worktree, reviewed by
      Claude and landed by the coordinator; and one diagnosis handoff that starts from the failed-twice
      trigger and reaches the other provider. All four results are recorded in this task.
- [ ] Consumer check: the file names no lean-flow-only script or path, and a repo with no second CLI and no
      declared policy sees no change in behaviour.
- [ ] Negative: with no policy and no request, no cross-model call is made; and when the other CLI returns
      empty output, the review is recorded as failed, not CLEAR.
- [ ] Negative: a permission the other CLI denies is reported and never answered by turning on a permission
      bypass; and a delegated build against a dirty checkout is refused.
- [ ] README, CHANGELOG and `.claude/CONTEXT.md` § Built-in leverage name the route.

## Touches

skills/orchestrator/references/ (new file) · skills/orchestrator/references/review-scoping.md ·
skills/orchestrator/references/dispatch.md · README.md · CHANGELOG.md · .claude/CONTEXT.md

## Assumes

- A1: CLI flags drift. The file keeps each provider's launch line in one block and tells the reader to
  check the CLI's own help first.
- A2: ADR-010 says lean-flow controls only the models it dispatches through the Agent tool. A CLI call to
  another provider extends that; G2 rules whether ADR-010 needs an amendment.
- A3: only a Claude host is in scope. Codex hosting with Claude reviewing is unproven and named out of scope.
- A4: no runner script ships; the procedure is prose (research note, Not adopted).
- A5: on Windows the other CLI may be unable to write `.git`, so the coordinator always lands the diff.
- A6: size L by owner ruling at intake (2026-11-13, "approve, merge 660+661"), merging the review half and
  the build-and-diagnosis half. G1 splits an L; if it does, the split is along the Review and
  Build-and-diagnosis headings above.

## Tracker

- `docs/research/claudex-loop-delta.md`, keeper 1
- Intake review: Codex round 1, 2026-11-13, no high finding; its medium on the diagnosis trigger is applied
  in the Proof box, and its low (merge the two route tasks) was taken by the owner.
