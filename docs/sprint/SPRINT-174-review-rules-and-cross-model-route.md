---
sprint: 174
slug: review-rules-and-cross-model-route
owner: Maintainer
last_updated: 2026-11-13
status: active
update_trigger: sprint execute/close events
---

# SPRINT-174 — Review Rules and the Cross-Model Route

> **Theme:** Workflow code only, nothing for workdoo (owner ruling, 2026-11-13). Three review rules from the claudex-loop delta land first: coverage and limitations statements, a fixer who becomes a builder, and the replaced-behaviour sweep.
> Then the opt-in cross-model route ships, so a Claude host can hand a review, a build or a diagnosis to another provider's CLI.

## Scope

**In:** the three review rules (TASK-659) · the cross-model route, review half then build-and-diagnosis half (TASK-660, one task file, two plan steps)
**Out (deferred):** any workdoo work, including TASK-489 · Codex hosting with Claude reviewing (TASK-660 A3) · a runner script for the route (TASK-660 A4) · EPIC-025's open release condition, an owner action (push v2.23.0)

## Members

- docs/work/todo/TASK-659-add-three-review-rules-from-claudex-loop.md
- docs/work/todo/TASK-660-ship-the-cross-model-route.md

## Plan

### T1 — Add the three review rules `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/builder-check.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-659, `docs/research/claudex-loop-delta.md` (keepers 2 to 4, read only)
The rules are reviewer-brief and procedure text, so they land in `references/`; `skills/orchestrator/references/builder-check.md` is touched only if its brief needs the two statements.

**Acceptance:** every review result states coverage and limitations, and a bare "CLEAR" with no coverage statement is not recorded as a passed review.

### T2 — Cross-model route, review half `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/orchestrator/references/cross-model-route.md`
Depends-on: T1
Cites: TASK-660 (the Review heading, and the negative for no policy and empty output), TASK-659, `docs/research/claudex-loop-delta.md` (keeper 1, read only), `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md` · `review-scoping.md` · `dispatch.md` (named by the member's Done when, owned by the later step)
Owner override of the size-L split rule, kept as one task with two plan steps; this step is reviewed on its own. The file is new and stays off by default, so nothing fires it until the later wiring step.

**Acceptance:** the new file lets a Claude host hand a review to another provider's CLI, off by default, and an empty, timed-out or verdict-less result is never an approval.

### T3 — Cross-model route, build and diagnosis half `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/orchestrator/references/cross-model-route.md` · `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/dispatch.md` · `README.md` · `CHANGELOG.md` · `.claude/CONTEXT.md`
Depends-on: T2
Cites: TASK-660 (Build and diagnosis, Opt-in and wiring, and the other Proof boxes), TASK-659, `docs/research/claudex-loop-delta.md` (read only)
Reviewed on its own. It owns the opt-in and wiring boxes, the four real exercises (T2's two review runs are cited as evidence), the consumer check, the permission and dirty-checkout negative, and the README, CHANGELOG and CONTEXT box. G2 rules whether ADR-010 needs an amendment (TASK-660 A2).

**Acceptance:** delegated build and diagnosis handoff are specified, wired from `/orchestrator` and `/task-decomposer`, and exercised on real input with the opt-in on.

## Owner-action checklist

- [ ] No owner action at promote. Pushing v2.23.0 and the `/triage` retarget of TASK-489 stay owner-reserved and outside this sprint.

## Decisions (pre-locked)

- **D1** — Shared files, one owner each in order: `CHANGELOG.md` T1 → T3, `skills/orchestrator/references/review-scoping.md` T1 → T3, and the new `cross-model-route.md` T2 → T3. The three steps run strictly in sequence, so no two build at once.
- **D2** — TASK-660 is size L by owner ruling at intake. At promote the owner chose "Keep one task, two plan steps (Recommended)": one task file, a Plan of T2 and T3 each reviewed on its own, no task file rewritten. The override covers TASK-660 only.
- **D3** — No release between T2 and T3: the route file is unreachable from `/orchestrator` until T3 wires it.

## Assumptions

- **A1** — Claude host only; the route fires on drafts and code, off by default, on by declared repo policy or owner request (owner popups at intake). *Confirm: G2.*
- **A2** — Codex CLI is installed on this host (`codex-cli 0.166.0` at promote) for T2 and T3's real exercises. *Confirm: T2's first real run.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-174-review-rules-and-cross-model-route.md`](logs/SPRINT-174-review-rules-and-cross-model-route.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
