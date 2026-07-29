---
sprint: 027
slug: watchdog-housekeeping
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: pending
close_commit: —
update_trigger: sprint execute/close events
---

# SPRINT-027 — Night-Run Watchdog & Housekeeping

> **Theme:** Finish the night-run capability (resilience layer) and pay down the housekeeping
> friction from the original improvement list. After this sprint the three pooled scans become
> pure-AFK cargo for the first true overnight run.

## Scope

**In:** watchdog + morning rollup wired into night-run/handoff (T1) · archival/rotation
streamlining + a growth-compaction pass exercised on the real corpus (T2)
**Out (deferred):** the three P2 scans (092/094/095 — reserved as night-run cargo) · actually
scheduling an overnight run (owner-action, post-sprint) · P3 blocked items.

## Plan

### T1 — Night-run resilience: watchdog + morning rollup (TASK-098) `[size: S · risk: low]` [HITL]
Layers: skills/orchestrator/references/night-run.md · skills/handoff/SKILL.md
Completes the night-run: stall detection → `/handoff` doc → `/prime` resume, plus the morning
"Blocked / needs-human" rollup format. Mechanism pre-decided in `docs/research/night-run.md`.

**Acceptance:** handoff-on-stall watchdog pattern + morning rollup documented and wired into the
night-run reference (and handoff, if a line is needed); exercised on a simulated stall.

**DoD:**
- [ ] night-run.md: watchdog pattern (stall detection · SIGTERM → `/handoff` on timeout · resume via `/prime`)
- [ ] night-run.md: morning "Blocked / needs-human" rollup format (rides the Execution Log, no new artifact)
- [ ] handoff wiring checked — reword in place only if the stall path needs naming there
- [ ] exercised once on a simulated stall (kill a dry-run mid-flight → handoff doc lands → prime reads it)

### T2 — Streamline housekeeping: archival, rotation, doc growth (TASK-091) `[size: M · risk: low]` [HITL]
Layers: docs/ · lean-doc-generator close/§11 wiring (TD-008: that SKILL.md is at 104/110 —
mitigation pre-planned: relocate init detail to a reference if the cap is threatened)
The two frictions named by the owner: manual archival/rotation steps, and doc growth outpacing
the aging pass. Improves §11 + close-sweep; no new SSOT.

**Acceptance:** archival/rotation is one documented repeatable pass; a growth-compaction pass is
defined AND exercised once on the current corpus (docs/research/ · LEARNINGS) with a measured
line delta — compaction proposes deletions, human approves (never silent).

**DoD:**
- [ ] archival/rotation documented as one repeatable close-time pass (sprint archive · CHANGELOG rotation · INDEX)
- [ ] growth-compaction pass defined (what qualifies for collapse: promoted L-entries → pointers · superseded research → archive/supersede)
- [ ] compaction exercised once on the real corpus — proposals presented, approved subset applied, line delta measured (L-007)
- [ ] TD-008 respected: lean-doc-generator SKILL.md cap not busted (references-first if lines needed)

## Owner-action checklist
- [ ] (post-sprint) schedule the first real night-run over a scan sprint when ready — recipe in `night-run.md`.

## Decisions (pre-locked)
- **D1** — Scans stay out of this sprint by owner choice: they are the validation cargo for the
  first unattended run, not interactive work.

## Assumptions
- **A1** — Watchdog is documentation/pattern (OS-level wrapper), not a shipped hook/script — the
  no-hooks axiom stands. *Confirm: night-run.md verdict (OS watchdog outside plugin surface).*
- **A2** — Compaction never deletes unpromoted/active knowledge — only promoted-and-pointered or
  superseded content collapses. *Confirm: T2 proposal list at execution.*

## Execution Log

### 2026-07-29 | promote | plan locked (2 tasks: 098 · 091)
Governance: **L-044 promoted → dispatch.md § Merge-back queue** (count 2 rule); TD-008 due for
re-review next promote (T2 touches its file with the pre-planned mitigation); LEARNINGS/CHANGELOG
growth noted — T2 is the designated fix. Cut per owner: 098+091, scans reserved as night cargo.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

_(written at close)_
