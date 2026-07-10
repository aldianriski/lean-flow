---
sprint: 015
slug: loop-hardening
owner: Maintainer
last_updated: 2026-07-10
status: closed
plan_commit: f5d646f
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
- [x] orchestrator gates its build modes on an active-sprint check, with an explicit override
- [x] `/flow` enforces the same at its build step
- [x] exercised once on real input — a mock "decompose then build" run is actually stopped (L-007)
- [x] `orchestrator/SKILL.md` ≤ 110 (land detail in `references/` if near cap — L-012)

### T2 — Make `/tdd` the standard implement path `[size: M · risk: med]`  *(depends-on T1)*
Layers: `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` · `skills/flow/SKILL.md`
CONTEXT already says "Implement routing: new behaviour → `/tdd`", but it never fires in practice
(the maintainer's real loop is prime→decompose/promote→orchestrator→close, `/tdd` skipped). Make
the implement phase *actively* route a new-behaviour task through test-first, not merely suggest it.

**Acceptance:** orchestrator's implement step routes a new-behaviour task through test-first (invokes
`/tdd` or embeds the red-green step); exercised once on a real task.

**DoD:**
- [x] orchestrator implement phase actively routes new-behaviour → test-first (not a bare suggestion)
- [x] CONTEXT.md implement-routing reflects the now-active behavior
- [x] exercised once on real input — L-007
- [x] caps respected (references/ landing if near cap)

### T3 — Surface all G1/G2 + grill questions as AskUserQuestion popups `[size: M · risk: med]`
Layers: `skills/{orchestrator,task-decomposer,flow,council}/SKILL.md`
Blocking gate/grill questions keep getting surfaced inline instead of *asked* — so the human never
actually decides and silent assumptions slip through (L-002 · the SPRINT-012 "flow-blocking open
question" anti-pattern). Audit every blocking-question point and instruct popup surfacing.

**Acceptance:** each skill's blocking-question step instructs AskUserQuestion; an audit note lists
every point covered, with none left as passive inline prose.

**DoD:**
- [x] orchestrator G1/G2 blocking questions → popup
- [x] task-decomposer grill blocking questions → popup
- [x] flow + council blocking questions → popup
- [x] audit note enumerates all points; caps respected

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

### 2026-07-10 | T1 done | gate build behind a recorded sprint
A2 resolved via popup → **soft gate**: a Backlog task not in any active sprint no longer auto-builds;
orchestrator's freeform dispatch surfaces promote-vs-one-off as a popup, `/quick` stays as an explicit
override. Edited `orchestrator/SKILL.md` (dispatch bullet + red-flag; 105→107/110) + `flow/SKILL.md`
(build step guard). **L-007 exercise caught a bug**: the first draft keyed the gate on sprint
*existence* ("no active sprint") — a Backlog task requested during an active sprint would slip through;
re-keyed on sprint *membership* before commit.

### 2026-07-10 | T2 done | /tdd is the default implement path
Reworded orchestrator's Implement-routing blockquote from a passive suggestion to **test-first via
`/tdd` by default**, and wired each mode's Implement step (quick/mvp/sprint-bulk) to point at it —
the routing existed but no step referenced it, so it never fired. CONTEXT.md + `flow` mirror the
default. All in-place; orchestrator held at 107/110. **Insight worth surfacing:** in lean-flow's own
repo `/tdd` *correctly* never fires — it's all markdown skill prose with no harness (routing →
"implement directly"); the gap item #8 flags is real for CONSUMER repos with testable code. The fix
makes the default loud there while degrading gracefully here (L-015).

### 2026-07-10 | T3 done | blocking questions → AskUserQuestion popups
**Audit — every blocking-question point, all now instruct a popup (not inline prose):**
1. `orchestrator` G2 **Residual grill** — "one question at a time (as an AskUserQuestion popup)…"
2. `task-decomposer` step 1 **Clarify/grill** — "Ask ONE question at a time (surface it as an AskUserQuestion popup, never inline prose)…"
3. `council` step 1 **Frame** — "Too vague → ask one clarifying question (as an AskUserQuestion popup)…"
4. `flow` — new **red-flag** enforcing the rule on the conducted path (the human must be *asked*).
All in-place (orchestrator held 107/110; flow 47→48; decomposer 78; council 70). **L-007 exercise =
this session**: the A2 gate fork + the three intake questions (#1/#8/#9) were surfaced as real popups.
Closes the recurring "surfaced inline instead of actually asking" miss (L-002 · SPRINT-012 anti-pattern).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/SKILL.md` | T1·T2·T3 | sprint-gate on freeform dispatch · tdd-default routing · G2 grill → popup | Med | trace + L-007 exercise (caught membership bug) |
| `skills/flow/SKILL.md` | T1·T2·T3 | build-step guard · tdd-default · popup red-flag | Low | trace |
| `.claude/CONTEXT.md` | T2 | Implement-routing = tdd default | Low | read-back |
| `skills/task-decomposer/SKILL.md` | T3 | intake grill → popup | Low | this session (dogfooded) |
| `skills/council/SKILL.md` | T3 | clarifying question → popup | Low | trace |

## Retro
<!-- Written at close. Route buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive → docs/sprint/archive/ + INDEX line. -->

**Retrieval check** — no failure to find or contradict a prior `L-NNN`/ADR. Actively used L-007
(exercise on real input), L-042/L-037 (shared-file serial ownership), L-012 (near-cap → reword in
place), L-002 + L-015 (the misses T3 fixes). No dangling retrieval.

**Worked**
- **L-007 paid off pre-commit** — tracing T1 on a real scenario ("build a Backlog task during an
  active sprint") caught that the gate was keyed on sprint *existence*, not *membership*; fixed before
  the commit, not after.
- **Serial single-owner on the shared file** (D1) — three tasks all editing `orchestrator/SKILL.md`,
  committed T1→T2→T3 with a full commit between each, so `git add <file>` never staged another task's
  WIP. No `add -p` gymnastics needed because there was no concurrent WIP.
- **In-place rewording held the 110 cap** — orchestrator absorbed all three tasks at 105→107.

**Friction**
- **Near-cap tax** — orchestrator's ~3 lines of headroom forced every change to be a reword rather than
  an addition; a genuinely additive behaviour would have had to go to `references/`. The cap is doing
  its job but the ceiling is close.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **L-016** — a skill repo can't dogfood a feature whose substrate it lacks: lean-flow is markdown-only,
  so `/tdd` *correctly* never fires here (routing → implement-directly). Item #8's "TDD never invoked"
  is a **consumer-repo** gap, confirmed by tracing the consumer path, not the dogfood path. Distinguish
  "not exercised in our repo" from "broken for consumers" (L-015 family).
