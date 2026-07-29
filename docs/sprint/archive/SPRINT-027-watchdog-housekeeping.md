---
sprint: 027
slug: watchdog-housekeeping
owner: Maintainer
last_updated: 2026-07-29
status: closed
plan_commit: a58d31a
close_commit: pending
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
- [x] night-run.md: watchdog pattern (stall detection · SIGTERM → `/handoff` on timeout · resume via `/prime`)
- [x] night-run.md: morning "Blocked / needs-human" rollup format (rides the Execution Log, no new artifact)
- [x] handoff wiring checked — reword in place only if the stall path needs naming there (verdict: existing contract covers it; no edit)
- [x] exercised once on a simulated stall (kill a dry-run mid-flight → handoff doc lands → prime reads it)

### T2 — Streamline housekeeping: archival, rotation, doc growth (TASK-091) `[size: M · risk: low]` [HITL]
Layers: docs/ · lean-doc-generator close/§11 wiring (TD-008: that SKILL.md is at 104/110 —
mitigation pre-planned: relocate init detail to a reference if the cap is threatened)
The two frictions named by the owner: manual archival/rotation steps, and doc growth outpacing
the aging pass. Improves §11 + close-sweep; no new SSOT.

**Acceptance:** archival/rotation is one documented repeatable pass; a growth-compaction pass is
defined AND exercised once on the current corpus (docs/research/ · LEARNINGS) with a measured
line delta — compaction proposes deletions, human approves (never silent).

**DoD:**
- [x] archival/rotation documented as one repeatable close-time pass (sprint archive · CHANGELOG rotation · INDEX)
- [x] growth-compaction pass defined (what qualifies for collapse: promoted L-entries → pointers · superseded research → archive/supersede)
- [x] compaction exercised once on the real corpus — proposals presented, approved subset applied, line delta measured (−47: LEARNINGS 195→187 · CHANGELOG 161→122)
- [x] TD-008 respected: lean-doc-generator SKILL.md cap not busted (106/110, reword in place — mitigation not needed)

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
| `skills/orchestrator/references/night-run.md` | T1 | Parts 3–4: watchdog pattern + morning rollup (completes the night-run) | Low | full chain exercised: kill → exit 143 → --resume /handoff → doc verified |
| `skills/lean-doc-generator/SKILL.md` | T2 | close row: §11 retention as one propose→approve pass (archival + compaction sweep) | Low | 106/110, reword in place; qa-check green |
| `docs/LEARNINGS.md` · `docs/CHANGELOG.md` · `docs/changelog/CHANGELOG-1.9.0.md` | T2 | compaction sweep applied (owner-approved): 2 pointer-collapses + 2-minor rotation | Low | −47 lines measured; lint green |
| `skills/orchestrator/references/dispatch.md` | coord | base-ref corollary: never worktree-dispatch an edit to an unpushed-only file | Low | derived from this wave's own dispatch decision |

## Execution Log (wave)

### 2026-07-29 | execute | wave complete — stall chain proven, compaction applied
Worktree dispatch deliberately skipped this wave (L-046 corollary: both target files unpushed →
add/add risk); shared-tree parallel dispatch, coordinator commits. T1's simulated stall ran the
REAL chain: headless `claude -p` killed mid-flight → **exit 143 confirmed on Windows** → watchdog
recovery command (`--resume <sid> "/handoff"`) produced a genuine 54-line handoff doc in OS temp,
verified readable at the /prime path. handoff/SKILL.md needs no edit (existing contract covers
non-interactive invocation); optional explicit clause noted for a future task. T2: §11 pass
reworded (106/110) + compaction exercised propose→approve: −47 lines. All 8 DoD ticked.

## Retro

**Retrieval check** — no prior L/ADR contradicted; L-046 was *applied* pre-emptively (the wave
mode was chosen because of it) — retrieval worked exactly as intended.

**Worked**
- The stall exercise ran the real chain, not a mock — exit 143 and the `--resume "/handoff"`
  recovery both behaved exactly as the research predicted, on Windows.
- The compaction sweep's propose→approve shape worked first try: agent proposes (strict safety
  rules), owner approves, coordinator applies, delta measured — the §11 wording matches reality.
- Recognizing L-046's add/add corollary *before* dispatching saved a broken wave; the fallback
  (shared-tree parallel, no agent git) ran cleanly.

**Friction**
- None material. The corpus was already tidier than expected (7/9 promoted entries pre-collapsed;
  no superseded research) — the sweep's marginal value will grow with corpus age.

**Pattern candidate** (→ `docs/LEARNINGS.md`)
- None new filed — L-046's corollary was encoded directly in dispatch.md (its durable home) rather
  than as a separate ledger entry; the sprint validated existing learnings more than it minted new ones.

**Buckets routed** — Shipped → CHANGELOG v1.14.0 · Tech debt → none new (TD-008 headroom intact,
106/110) · Follow-ups → none (optional handoff clause noted in the Log, not task-worthy) ·
Learnings → none new (see above).
