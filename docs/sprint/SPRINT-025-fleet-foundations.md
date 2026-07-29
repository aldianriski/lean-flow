---
sprint: 025
slug: fleet-foundations
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: 3a90916
close_commit: —
update_trigger: sprint execute/close events
---

# SPRINT-025 — Fleet & Night-Run Foundations

> **Theme:** Decide-before-build for the two capability epics — the parallel worktree fleet and
> the unattended night-run — plus two small riders (the AGENTS.md scan that feeds the fleet seam,
> and the G2 threat prompt). Decisions cleared here unblock the build sprints that follow.

## Scope

**In:** AGENTS.md delta-scan (T1) · fleet fog-map driven to graduation (T2) · night-run research
doc (T3) · G2 design-time threat prompt wired + exercised (T4)
**Out (deferred):** building any fleet/worktree mechanism (graduated TASK-NNNs come later) ·
night-run implementation · the pooled scans (TASK-092 graphify · 094 harness-eng · 095 adhd —
094's findings feed the fog-map inventory ticket whenever it runs) · TASK-091 housekeeping.

## Plan

### T1 — Scan AGENTS.md standard for adoption (TASK-093) `[size: S · risk: low]` [AFK]
Layers: docs/research/
Unblocks T2's brief-carrier ticket; decides whether lean-doc-generator ships an AGENTS.md
template for consumer repos. Delta over existing surface (L-017), keepers as proposals only.

**Acceptance:** delta-scan doc with a verdict on (a) template emission and (b) AGENTS.md as the
non-Claude-agent brief carrier; keepers filed as proposals.

**DoD:**
- [x] `docs/research/agents-md-adoption.md` written (RESEARCH template) with per-candidate delta mapping
- [x] verdicts (a) + (b) recorded; keepers filed as proposals, not applied
- [x] fog-map AGENTS.md ticket closed → DECISIONS SO FAR updated

### T2 — Drive the fleet-orchestration fog-map to graduation (TASK-089) `[size: L · risk: med]` [HITL]
Layers: docs/research/fog-fleet-orchestration.md · TODO.md
The epic's decisions are unknown — resolve ticket-by-ticket (fog-map loop), then graduate the
cleared buildable work into TASK-NNN. Hard forks route /council → ADR.

**Acceptance:** NOT-YET-SPECIFIED empty; every ticket resolved & recorded in DECISIONS SO FAR;
graduated TASK-NNN entries in the Backlog.

**DoD:**
- [x] Research: harness worktree inventory resolved (what exists vs what lean-flow must add)
- [x] Research: merge-back strategy resolved (N worktrees → one branch · conflict path · G2 overlap-map relation)
- [x] Grill: dispatch unit pinned (popup)
- [x] Grill: external-agent consent gate pinned (/council if it forks hard)
- [x] AGENTS.md brief-carrier ticket resolved (← T1)
- [x] Prototype: one real task pair run end-to-end in parallel worktrees; answer captured, artifact deleted
- [x] Cleared work graduated → TASK-NNN; NOT-YET-SPECIFIED empty

### T3 — Research night-run: unattended overnight sprint-bulk (TASK-090) `[size: M · risk: low]` [AFK]
Layers: docs/research/
One trigger at night → done by morning, for sprint-bulk AFK with larger/longer tasks. All worry
front-loaded; zero mid-run confirmations *by design* — gates fire before the run, never skipped.

**Acceptance:** `docs/research/night-run.md` recommends a mechanism covering front-loaded gates ·
checkpoint/recovery (handoff on stall) · per-task quality loop (self-review/verify) · a morning
report format.

**DoD:**
- [x] `docs/research/night-run.md` written (RESEARCH template) covering all four areas
- [x] build tasks filed as proposals, not applied

### T4 — Add G2 design-time threat prompt for risk:high (TASK-088) `[size: S · risk: low]` [HITL]
Layers: skills/orchestrator/SKILL.md (at 110/110) or references/review-scoping.md
A `risk: high` task touching auth/input/secrets/data-exposure gets a one-line abuse-case sketch
at G2 — complements, never replaces, the Review-time /security-review row.

**Acceptance:** the prompt fires at G2 for a sample high-risk task; wiring exercised once, not
spec-only (L-007).

**DoD:**
- [x] placement decided — SKILL body displace/merge vs review-scoping.md (references-first, L-012)
- [x] prompt wired so it fires at G2
- [x] exercised once on a sample high-risk task

## Decisions (pre-locked)
- **D1** — Cut adjusted at promote: TASK-093 pulled in as T1 because T2's graduation depends on
  its verdict (fog Task-ticket). Not ADR-grade.

## Assumptions
- **A1** — External agents enter only via a BYO, opt-in, disabled-by-default seam (TASK-047 axiom). *Confirm: T2 consent-gate grill.*
- **A2** — Night-run never bypasses G1/G2 — everything front-loaded pre-trigger. *Confirm: night-run.md design.*
- **A3** — G2 threat prompt complements the /security-review skip-table row. *Confirm: TASK-088 tracker (architecture-baselines.md).*

## Execution Log

### 2026-07-29 | promote | plan locked (4 tasks: 093 · 089 · 090 · 088)
Governance checklist signed off (no L-promotions due · no aged TD · §11 clean). TD-008 relevance
note stays with pooled TASK-091. Cut approved as P1 pair + 088, then adjusted per D1.

### 2026-07-29 | execute | T2 complete — fog-map graduated (096–098 filed)
Wave-1 research folded (inventory · merge-queue); grills pinned dispatch-unit=Tn and
**Claude-only fleet v1** (external agents → out-of-scope until real signal); prototype felt the
merge end-to-end on Windows (works; handle-lock friction captured); owner approved graduating
TASK-096/097/098 to Backlog P1. All 13 sprint DoD ticked.

### 2026-07-29 | execute | batch G1+G2 approved · wave 1 dispatched · T4 done
Owner approved batch gates + T4 placement (merge into the G2 hard-to-reverse bullet, no line
growth). Wave 1 in flight: T1 scan · T3 research · T2's two research tickets, parallel sonnet
sub-agents per the disjoint map. T4 wired inline and exercised on TASK-047 (abuse-case sketch
produced at design time) — all three DoD ticked.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/SKILL.md` | T4 | G2 hard-to-reverse bullet now carries the risk:high abuse-case prompt (owner chose merge-in-place over reference) | Low | line count held at 110; prompt exercised on TASK-047 (sketch produced) |
| `docs/research/agents-md-adoption.md` | T1 | new — AGENTS.md delta-scan verdicts (a) no / (b) yes-conditional | Low | self-review vs RESEARCH template; qa-check lint |
| `docs/research/night-run.md` | T3 | new — night-run mechanism verdict (headless `claude -p` · dontAsk + allowlist) | Low | self-review; claims traced to official docs |
| `docs/research/fog-fleet-orchestration.md` | T2 | chart → all 6 tickets resolved → graduated (decision record) | Low | prototype exercised the merge path for real |
| `TODO.md` | T2 | TASK-096/097/098 graduated to Backlog P1 (owner-approved) | Low | entries match approved draft |

## Retro

_(written at close)_
