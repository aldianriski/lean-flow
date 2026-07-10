---
sprint: 015
slug: loop-hardening
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: 52f7552
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-015 — Loop Hardening

> **Theme:** The daily loop has three holes the maintainer hits in real use — build starts
> without a recorded sprint, gate questions get buried inline instead of actually asked, and
> `/tdd` never fires. Harden the loop's spine before layering features (recon+tiers, migrate-sync)
> on top. Foundations before features.

## Scope

**In:**
- Build work gated behind a recorded sprint (no more decompose → straight-to-build).
- `/tdd` wired as the standard implement path (test-first actually fires in the loop).
- Every G1/G2 + grill blocking question surfaced as an AskUserQuestion popup, not inline prose.

**Out (deferred):** recon-delegation + per-phase model tiers (TASK-056, P2 — **shares
`orchestrator/SKILL.md`; serialized after this sprint**) · migrate re-run sync (TASK-052) ·
close-time TD/follow-up sweep (TASK-055) · research trio (TASK-049·050·051).

## Plan

### T1 — Gate build work behind a recorded sprint `[size: M · risk: high]`
Layers: `skills/orchestrator/SKILL.md` · `skills/flow/SKILL.md`
Today a decompose instruction can slide straight into build with no sprint recorded → untracked
work, no plan/DoD (the live broken-flow the maintainer hit this session). Orchestrator's build
modes (and `/flow`'s build step) must check that an active sprint exists before executing, and
direct to `/lean-doc-generator promote` first — with an explicit override for genuine one-off work.

**Acceptance:** given a `ready` task not in any active sprint, `/orchestrator` build modes refuse to
execute build work and route to promote; the override path is documented.

**DoD:**
- [ ] orchestrator gates its build modes on an active-sprint check, with an explicit override
- [ ] `/flow` enforces the same at its build step
- [ ] exercised once on real input — a mock "decompose then build" run is actually stopped (L-007)
- [ ] `orchestrator/SKILL.md` ≤ 110 (land detail in `references/` if near cap — L-012)

### T2 — Make `/tdd` the standard implement path `[size: M · risk: med]`  *(depends-on T1)*
Layers: `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` · `skills/flow/SKILL.md`
CONTEXT already says "Implement routing: new behaviour → `/tdd`", but it never fires in practice
(the maintainer's real loop is prime→decompose/promote→orchestrator→close, `/tdd` skipped). Make
the implement phase *actively* route a new-behaviour task through test-first, not merely suggest it.

**Acceptance:** orchestrator's implement step routes a new-behaviour task through test-first (invokes
`/tdd` or embeds the red-green step); exercised once on a real task.

**DoD:**
- [ ] orchestrator implement phase actively routes new-behaviour → test-first (not a bare suggestion)
- [ ] CONTEXT.md implement-routing reflects the now-active behavior
- [ ] exercised once on real input — L-007
- [ ] caps respected (references/ landing if near cap)

### T3 — Surface all G1/G2 + grill questions as AskUserQuestion popups `[size: M · risk: med]`
Layers: `skills/{orchestrator,task-decomposer,flow,council}/SKILL.md`
Blocking gate/grill questions keep getting surfaced inline instead of *asked* — so the human never
actually decides and silent assumptions slip through (L-002 · the SPRINT-012 "flow-blocking open
question" anti-pattern). Audit every blocking-question point and instruct popup surfacing.

**Acceptance:** each skill's blocking-question step instructs AskUserQuestion; an audit note lists
every point covered, with none left as passive inline prose.

**DoD:**
- [ ] orchestrator G1/G2 blocking questions → popup
- [ ] task-decomposer grill blocking questions → popup
- [ ] flow + council blocking questions → popup
- [ ] audit note enumerates all points; caps respected

## Owner-action checklist
- (none)

## Decisions (pre-locked)
- **D1 — Overlap ownership.** T1·T2·T3 all edit `skills/orchestrator/SKILL.md`; T1·T2 also edit
  `skills/flow/SKILL.md`. Single owner = this sprint (serial build); **commit order T1 → T2 → T3**;
  stage the shared files per-hunk (`git add -p` + verify `git diff --cached`), never a plain
  `git add` over another task's WIP (L-042 / L-037).
- **D2 — Near-cap landing.** `orchestrator/SKILL.md` sits close to the ≤110 cap; add behaviour via
  `references/` where possible, reword in place otherwise (L-012 · ADR-006). Never raise the cap.
- **D3 — TASK-056 deferred out on purpose** — it shares `orchestrator/SKILL.md`, so it serializes
  *after* this sprint rather than parallel-building the same file.

## Assumptions
- **A1** — "recorded sprint" = an active `SPRINT-NNN` (`status: active`) with a TODO § Active Sprint
  pointer. *Confirm: existing sprint model (CONTEXT § Sprint model).*
- **A2** — the override path (build without a sprint) stays available for quick single-task work.
  *Confirm: at G2 in the orchestrator build design.*

## Execution Log

### 2026-07-10 | promote | plan locked
Formed from the P1 backlog (TASK-053 · 057 · 054) after `/triage`. Shared-file overlap locked in D1
(single owner, commit order T1→T2→T3). TASK-056 held out of scope to keep `orchestrator/SKILL.md`
single-owned.

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
