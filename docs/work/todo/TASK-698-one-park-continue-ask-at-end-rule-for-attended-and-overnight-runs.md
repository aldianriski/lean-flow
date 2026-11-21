---
id: TASK-698
title: "One park-continue-ask-at-end rule for attended and overnight sprint execution"
type: feature
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-185
depends-on: [TASK-696]
---

# TASK-698 — One park-continue-ask-at-end rule for attended and overnight sprint execution

## Why

Attended sprint-bulk halts at the first blocker, the worker-relay line asks a worker's question immediately, and `/flow` halts on the first blocker, while overnight already parks. The owner wants a new mid-run blocker parked, disjoint work continued, and all questions asked at the end, the same for a night run, as one process and not two (owner note 4 and "i dont want have 2 process").

The `depends-on: [TASK-696]` is a shared-file sequence only (`orchestrator/SKILL.md` and `sprint-bulk-run.md`), not a logical dependency.

## Done when

- [ ] `sprint-bulk-run.md` § Runtime: one rule, scoped to post-G2 sprint execution, for attended and overnight — a new blocker parks the affected work and anything sharing its ownership, files or dependencies; approved disjoint work continues; parks are re-checked at task boundaries. Explicit user stops, budget stops, hard failures and pre-execution gates still halt at once.
- [ ] The conflicting text is replaced, not forked: orchestrator step 5, the worker-relay line, `/flow` § Conductor first-blocker halt, `night-run.md` (:123 park protocol "record, then wait", :139 attended-halt fork, :163), `dispatch.md` merge-back (:693, and :722 so parked partial work stays in the sprint, outside the merge queue, until it clears — not sent to backlog), and the runtime wave barrier (`dispatch.md` :154, :501) so a unit whose own prerequisites and ownership have cleared advances even when a wave-mate parked.
- [ ] Park record: a temporary park goes in the existing `progress` entry; a canonical `Tn · parked-hitl|blocked · ` line is written only for a task still parked at exit (so the unchanged reaper reads it right).
- [ ] Final ask, only the delivery differs: attended opens one frontier round at exit (dependents wait for their prerequisites); overnight writes the ready frontier into the existing `/handoff` open-questions slot, with the Execution Log fallback when `/handoff` fails. `/prime` resolves the live handoff path from its stub, reconciles uncertain writes first, then surfaces the digest ahead of mode advice; when the latest run has no readable handoff, `/prime` surfaces that run's Execution Log digest instead.
- [ ] Consumer proof in D:\Research\workdoo (pre-run file-hash manifest compared after revert), against the UNCHANGED launcher/reaper: (a) attended run, seeded mid-run blocker → parks, disjoint work continues, one round at the end; (b) a park that clears mid-run → rollup PLAN_EXHAUSTED; (c) a park still open at exit → AUTHORITY_BOUNDARY; (d) unattended-style halt → digest in handoff, a fresh session's `/prime` leads with it; (e) `/handoff` denied → a fresh session's `/prime` surfaces the questions from the Execution Log digest; (f) T1 parks, T2 lands in the same wave, T3 (depends only on T2) proceeds.
- [ ] Negative: a parked blocker is never self-answered, worked around, reshaped or narrowed; an unattended run never asks; a hard failure, budget stop or user stop is never parked; `scripts/night-run.sh` is not changed; workdoo matches baseline.
- [ ] `orchestrator/SKILL.md` pointer only, ≤ 140; Codex review of the shipped diff clean within 2 rounds, with `night-run.md` + `coordinator.md` read for contradictions; ADR-016 (rollup at the exit path) honoured; the report returns proposed README/CHANGELOG/CONTEXT lines.

## Touches

`orchestrator/SKILL.md` step 5 + relay line, `references/sprint-bulk-run.md` § Runtime, `references/night-run.md` Part 0 (:139, :163) + Part 4 pointer, `references/dispatch.md` (:693 merge-back + pointer), `flow/SKILL.md` § Conductor, `prime/SKILL.md` (handoff digest), `handoff/SKILL.md` only if its open-questions slot needs a shape note. Not: `scripts/`, README, CHANGELOG, CONTEXT. Commit order on `orchestrator/SKILL.md`: 695 → 696 → 698.

## Assumes

- No ADR governs the attended first-blocker halt (Codex + coordinator grep); ADR-016 governs the rollup and is unchanged.
- G2 note (below the stop rule): always append the ready frontier to the run's Execution Log, not only when `/handoff` fails, so `/prime` recovers it after a successful handoff whose temp file later disappears; prove both (denied handoff, unreadable handoff).
- G2 note: two more whole-wave holds use the same readiness rule — merge-back (`dispatch.md`:674) and promote's wave procedure (`dispatch.md`:574, `sprint-by-reference.md`:27); proof (f) shows T2 merged and T3 dispatched from the verified base while T1 stays parked.
- G2 note: the record-and-wait text is at `night-run.md`:126; `dispatch.md`:722's backlog return keeps applying to hard failures only.
- Tier P, no script; re-tier at G2 if one is added.

## Tracker

Owner note item 4, answer "park, continue, ask at end, this also must be same for night run", and "i dont want have 2 process", 2026-11-21.
