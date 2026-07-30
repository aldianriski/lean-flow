---
sprint: 036
slug: preflight-and-verify
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: [set at promote commit]
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-036 — Preflight and Verify

> **Theme:** Build ADR-013's adopted leg — the prose cure first (base-ref rule), then the
> laziness-ladder rung that decides whether JSON ever enters the plugin (no-JSON preflight) —
> and close the two standing verification gaps (SPRINT-034's cold read · the unattended contract
> from the installed cache). v1.20 opener; T2's captured answer gates all further graph work.

## Scope

**In:** base-ref branching rule in dispatch + night-run · no-JSON preflight prototype + ADR-013
addendum · SPRINT-034 cold-read (L-006 leg) · headless unattended-contract verify from the plugin
cache (L-016 leg).
**Out (deferred):** the JSON DAG format itself (admitted only if T2's rung fails) · TASK-116 eval
fixture (next — wants T4's fixture) · TASK-117 preflight design (waits on T4's result) · TASK-120
run-state (blocked, ADR-013 expiry SPRINT-040).

## Plan

### T1 — Add the base-ref branching rule to dispatch `[size: S · risk: low · class: execution · HITL]` (TASK-118)
Layers: skills/orchestrator/references/dispatch.md · skills/orchestrator/references/night-run.md
Depends-on: none
The 2026-07-30 incident (L-055): worktrees branched from session-start HEAD, undetected until
merge. The rule is the root-cause fix; any artifact is enforcement only (ADR-013).

**Acceptance:** both references state the rule — worktrees branch from the wave's declared base
commit, verified against live HEAD at spawn, mismatch halts, re-verified at each wave boundary —
and the rule is traced once against the L-055 incident.

**DoD:**
- [ ] dispatch.md parallel/worktree section carries the rule (spawn-time verify + wave-boundary re-verify)
- [ ] night-run.md carries it at its dispatch step, consumer-legible (no repo-local refs — L-015)
- [ ] traced against the L-055 incident (would it have caught the stale branch point?) → Execution Log

### T2 — Prototype the no-JSON dispatch preflight `[size: S · risk: low · class: execution · HITL]` (TASK-119)
Layers: (throwaway prototype — /prototype discipline; capture → ADR-013 addendum)
Depends-on: T1
ADR-013's laziness-ladder precondition: nobody verified markdown+script can't already do the
checks. One question: does a bash/prose preflight over the markdown Plan suffice?

**Acceptance:** a preflight derives cycle + shared-file single-owner + base-ref-vs-HEAD checks
directly from a real active sprint's markdown Plan; the captured answer decides the JSON DAG's
fate in an ADR-013 addendum; the prototype is then deleted.

**DoD:**
- [ ] preflight derives all three checks from the active sprint's markdown Plan (this sprint = the real input, L-007)
- [ ] exercised once; output verified against the known structure (T2 depends-on T1 · disjoint T3/T4)
- [ ] ADR-013 addendum records: JSON DAG admitted (rung insufficient) or rejected (sufficient); prototype deleted

### T3 — Cold-read SPRINT-034's shipped wording from a fresh context `[size: S · risk: low · class: execution · HITL]` (TASK-109)
Layers: (review — correction only if the cold read finds a gap)
Depends-on: none
SPRINT-034's L-007 exercise was an author-run text trace; no independent reader checked the
wording (L-006). A fresh-context agent that wrote none of it closes that leg.

**Acceptance:** the four SPRINT-034 surfaces are read cold and each is confirmed unambiguous or
corrected.

**DoD:**
- [ ] fresh-context read of: orchestrator intake routing + spawn red flag · night-run Part 1a + Part 2 precondition · CONTEXT § Unattended clause · /flow launcher bullet
- [ ] each surface confirmed unambiguous or corrected (S-sized wording fixes only; larger → scope-change)
- [ ] findings → Execution Log; closes SPRINT-034's stated verification gap

### T4 — Verify the unattended contract from the installed plugin `[size: S · risk: low · class: execution · HITL]` (TASK-106)
Layers: (verification — no source change)
Depends-on: none
SPRINT-033 verified repo source only; the packaged consumer path is unverified (L-016). Version
deliberately unpinned (L-048) — verify whatever current release the cache holds.

**Acceptance:** with the current release in the plugin cache (verified first, never assumed), a
headless `claude -p "/lean-flow:orchestrator sprint-bulk unattended" --permission-mode dontAsk`
run meets a HITL step and parks — proving the contract ships.

**DoD:**
- [ ] cache version verified current before the run (owner-action below if stale)
- [ ] headless run meets a HITL step and parks, never self-approves (the SPRINT-033 contract, on the consumer path)
- [ ] result → Execution Log (fixture notes kept for TASK-116)

## Owner-action checklist
- [ ] Update the plugin cache to v1.19.0 before T4 (`claude plugin update lean-flow` or marketplace refresh)

## Decisions (pre-locked)

- **D1** — T2 is throwaway: only the captured answer + ADR-013 addendum persist; code deleted at capture.
- **D2** — Overlap map: dispatch.md + night-run.md are T1-owned (T2 reads, never edits); T3/T4 touch no source. Sequence: T1 → T2; T3 · T4 free.

## Assumptions

- **A1** — The cache can be brought to v1.19.0 before T4; if the marketplace lags, T4 verifies the current installed release instead (unpinned, L-048). *Confirm: owner-action tick.*
- **A2** — T2 may REJECT the JSON DAG outright — a valid ADR-013 outcome, not a failure. *Confirm: addendum written either way.*
- **A3** — T3 finds at most S-sized wording gaps. *Confirm: anything larger logs a scope-change before edits.*

## Execution Log

### 2026-07-30 | promote | plan locked
Four tasks pulled (TASK-118/119/109/106 → T1–T4). Governance scan clean (no L-promotions · no TD
aging · TODO at cap boundary accepted). First sprint rendered under the T5 schema — header meta
carries class + autonomy; Depends-on explicit.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
