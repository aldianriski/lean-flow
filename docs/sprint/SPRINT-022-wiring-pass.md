---
sprint: 022
slug: wiring-pass
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: [pending]
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-022 — Wiring Pass

> **Theme:** Make the v1.9.0/v1.10.0 additions actually *fire and chain* across the loop. A wiring audit
> found three shipped-but-half-connected features: skill-powered dispatch is orphaned from the Implement
> steps, the Standards-vs-Spec split is never injected into the reviewer brief, and nothing routes foggy
> intent to fog-mode. Fixes only — no new capability → **PATCH v1.10.1**.

## Scope

**In:** wire the dispatch note into the Implement steps; inject the two-axis split into the reviewer
brief (+ record in CONTEXT); route foggy intent to fog-mode from orchestrator + flow + CONTEXT.
**Out (deferred):** expand–contract cross-refs (by design — scan scoped it to `/refactor-advisor` only);
the CHANGELOG v1.8.0-block rotation (file is lean); any new capability.

## Plan

### T1 — Wire skill-powered dispatch into the Implement steps `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md`
The "Dispatch by role" note (`:62-64`) is orphaned — quick/mvp/sprint-bulk Implement steps reference the
*Implement-routing* note (pick the skill) but never *dispatch*. Give the dispatch note an "at any Implement
step" hook (parallel to the routing note) and/or link the steps to it, so dispatch-with-skill actually fires.

**Acceptance:** reading any Implement step leads to "dispatch execution to a sub-agent handed its procedure skill."

**DoD:**
- [ ] "Dispatch by role" note carries an "at any Implement step" hook (parallel to the Implement-routing note)
- [ ] at least one explicit link from the Implement steps / routing note to dispatch-with-skill
- [ ] `orchestrator/SKILL.md` ≤110

### T2 — Inject Standards-vs-Spec into the reviewer brief + record in CONTEXT `[size: S · risk: low]`
Layers: `skills/orchestrator/references/review-scoping.md` · `.claude/CONTEXT.md`
The two-axis principle (`review-scoping.md:17-28`) is never in the *dispatched* reviewer's brief. Add it to
the brief-injection ("Scope every pass to the diff" / "When a pass fires"); record the split in CONTEXT's
gates/review prose (currently absent from the SSOT).

**Acceptance:** a dispatched reviewer is instructed to report Standards vs Spec separately; CONTEXT records it.

**DoD:**
- [ ] reviewer brief instructs: report Standards vs Spec separately, never merged (review-scoping.md dispatch/brief section)
- [ ] CONTEXT.md gates/review note records the two-axis split
- [ ] `CONTEXT.md` ≤130

### T3 — Route foggy intent to fog-mode (orchestrator + flow + CONTEXT) `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` (freeform routing) · `skills/flow/SKILL.md` (Feed) · `.claude/CONTEXT.md` (feed-pipeline)
Neither upstream router points foggy intent at fog-mode; the `/flow` conductor is unaware of it.

**Acceptance:** a foggy intent is routed toward fog-mode from both the conductor and the build loop.

**DoD:**
- [ ] orchestrator freeform routing mentions foggy / un-sliceable → `/task-decomposer` fog-mode
- [ ] `/flow` Feed step (step 2) offers fog-mode for foggy intent
- [ ] CONTEXT feed-pipeline line acknowledges fog-map
- [ ] caps: orchestrator ≤110 · flow ≤110 · CONTEXT ≤130; qa skills 14=14

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)
- **D1 — overlap-ownership.** `orchestrator/SKILL.md`: T1 (Implement/dispatch, ~L54-64) + T3 (freeform, ~L24-27) — *disjoint hunks*; **T1 before T3**, `git add -p`. `.claude/CONTEXT.md`: T2 (gates/review) + T3 (feed-pipeline, ~L51-52) — *disjoint hunks*; **T2 before T3**, per-hunk (L-042/L-037).
- **D2** — fixes only (wiring/reword), no new behaviour → close as **PATCH v1.10.1** (`/release-patch` eligible).

## Assumptions
- **A1** — all three are wiring/reword edits within caps; no new capability, no roster change (stays 14). *Confirm: cap check at each task.*

## Execution Log

### 2026-07-10 | promoted | plan locked
Rendered from the wiring audit (3 tasks, audit-derived). Governance: no unpromoted count≥2 learnings
(L-016 promoted earlier this session); TD-008 re-review flagged (minor); CHANGELOG v1.8.0-block rotation
deferred (file lean). Plan frozen.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route buckets (§10). Then archive (§11). PATCH → /release-patch. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**

**Friction**

**Pattern candidate** (→ `docs/LEARNINGS.md`)
