---
sprint: 019
slug: model-tiers
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: 8c3fb0f
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-019 — Model Tiers

> **Theme:** Implement ADR-010 — refactor the model-tier doctrine into a role-based, remappable,
> dispatch-only map. The `/council` did the hard design; this is the (small) build. Ships as a
> consumer-facing MINOR.

## Scope

**In:** CONTEXT's tier table → role-named + remappable (decision→Opus · execution→Sonnet ·
mechanical/ingest→Haiku, undefined→next-strongest); dispatch-vs-session (enforceable-vs-advisory) split;
Fable = manual-escalation clause (no dispatch row); no ladder; orchestrator + council dispatch notes
updated to the role vocabulary.

**Out (deferred):** the automated escalation ladder (rejected by ADR-010) · any new skill/hook · TD-008.

## Plan

### T1 — Implement ADR-010 role-based dispatch tiers `[size: M · risk: med]`  *(TASK-056)*
Layers: `.claude/CONTEXT.md` (Model tiers) · `skills/orchestrator/SKILL.md` (Dispatch note) ·
`skills/council/SKILL.md` (Tier note)
Refactor per ADR-010: role-named tiers with a remappable default map, dispatch tiers enforceable +
session tier advisory, Fable as a manual-escalation clause (no row), no automated ladder, keep "route by
ambiguity & consequence, not size". Update orchestrator + council to reference the role vocabulary.

**Acceptance:** CONTEXT tier section is role-based + remappable with the enforceable/advisory split and
the manual-Fable clause; orchestrator + council dispatch notes use the role names; consistent, caps held.

**DoD:**
- [x] CONTEXT tier table → role-named (`decision`/`execution`/`mechanical-ingest`) + remappable default map (undefined → next-strongest)
- [x] enforceable (dispatch) vs advisory (session) split stated; Fable = manual-escalation clause, no dispatch row; no ladder
- [x] orchestrator + council dispatch notes reference the role vocabulary (consistent with the map)
- [x] exercised — this session's `/council` (advisors→execution/Sonnet · chairman→decision/session) + SPRINT-016 recon (execution/Sonnet) match the map (L-007)
- [x] caps: CONTEXT 124→127/130 · orchestrator held 107/110 · council held 70/110

## Owner-action checklist
- (none)

## Decisions (pre-locked)
- **D1 — ADR-010 is the spec.** No re-litigation of the doctrine; this sprint implements the accepted
  decision. Design forks were resolved by the `/council` verdict.
- **D2 — Cap landing.** CONTEXT at 124/130 and orchestrator at 107/110 are tight — keep the tier table
  lean (a 3-row map + a short escalation line); reword notes in place (L-012). Depth already lives in ADR-010.
- **D3 — Consumer-facing MINOR.** New tier doctrine is user-visible → **v1.8.0 by hand at close**
  (manifests lockstep + CHANGELOG). README enumerates no tier detail → check, likely no change.

## Assumptions
- **A1** — dispatch happens via the Agent-tool `model:` override (lean-flow's only enforcement surface);
  the session tier is advisory. *Confirm: ADR-010 (the enforceable/advisory split).*

## Execution Log

### 2026-07-10 | promote | plan locked
Formed after the `/council` verdict → ADR-010 (user chose to build). Single task; ADR is the spec (D1).

### 2026-07-10 | T1 done | ADR-010 role-based tiers implemented
Refactored CONTEXT's Model-tiers section to a **role-based, remappable** map (`decision`→Opus ·
`execution`→Sonnet · `mechanical-ingest`→Haiku; undefined → next-strongest) with the enforceable-dispatch
vs advisory-session split and the manual-Fable clause (no dispatch row, no ladder). orchestrator "Dispatch
by role" + council "Tier" notes now speak the role vocabulary. Caps: CONTEXT 124→127/130; orchestrator +
council held. **L-007 exercise:** the map correctly classifies real dispatches performed this session
(council advisors/reviewers→execution·Sonnet, chairman→decision·session; SPRINT-016 recon→execution) — not
inert prose. All per ADR-010; no re-litigation (D1).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive → docs/sprint/archive/ + INDEX line. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
