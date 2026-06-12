---
sprint: 006
slug: review-depth-and-context-diet
owner: Maintainer
last_updated: 2026-06-12
status: active
plan_commit: 5f16897
close_commit: TBD
update_trigger: sprint execute/close events
---

# SPRINT-006 — Review Depth & Context Diet

> **Theme:** Two lean-discipline fixes that clear the road to v1.0 — scale review depth to diff size
> (end the `/code-review` finder fan-out waste on small diffs, the gap v0.3.1 left open) and put the
> SSOT (`CONTEXT.md`) back under its own cap (TD-005). After this, only TASK-017 (the v1.0 checklist)
> remains.

## Scope

**In:** TASK-026 (scale review depth) · TASK-027 (CONTEXT.md diet / resolve TD-005).
**Out (deferred):** TASK-017 (v1.0 checklist — the next step, after these land) · TASK-006/007/008
(P3 — blocked on learning hooks / needs-info; not actionable now).

## Plan

### T1 — Scale review depth `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/review-scoping.md`
v0.3.1 controls *whether* a review fires (skip table) but still routes non-trivial code diffs to the
built-in `/code-review`, whose internal 4-finder fan-out burns 20–64k tokens each — the waste the owner
observed. Lean lever: for **small/medium** diffs run **one** scoped cheap-tier reviewer; reserve the
full `/code-review` fan-out for **large / high-risk** diffs. (TASK-026)

**Acceptance:** the review-depth rule is stated and the imprecise skip-table row is fixed; orchestrator ≤ ~110.

**DoD:**
- [x] orchestrator Review + `review-scoping.md` state the depth rule — small/medium → **one** scoped cheap-tier (`sonnet`) reviewer (diff + blast-radius brief); `/code-review` fan-out reserved for **large / high-risk** (new "Scale depth to diff size" section + table)
- [x] the imprecise skip-table row corrected → "small / medium diff → one scoped `sonnet` reviewer — not `/code-review`'s fan-out"
- [x] `orchestrator/SKILL.md` ≤ ~110 (107; detail in the reference)

### T2 — CONTEXT.md diet (resolve TD-005) `[size: M · risk: med]`
Layers: `.claude/CONTEXT.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` (if cap revised)
The SSOT is **151 lines** against its own 100-line cap — the doc that anchors the standard violates it.
Either diet it (relocate the tier-map / roster detail to skill references) or formally revise the cap
with rationale. (TASK-027)

**Acceptance:** `CONTEXT.md` ≤ 100 **or** the cap is formally revised; no information lost; TD-005 resolved.

**DoD:**
- [ ] `.claude/CONTEXT.md` ≤ 100 via content diet (detail → references / trim) **OR** the cap formally revised in `DOCS_Guide §2` with rationale (→ ADR if it's a standard change)
- [ ] no information lost (moved, not deleted); the SSOT still reads coherently
- [ ] **TD-005 resolved** (mark in TODO at close)

## Owner-action checklist
- [ ] None — both tasks are dev/spec work.

## Decisions (pre-locked)
- **D1** — TASK-027 fork (diet vs revise-cap) is a **G2 design call**. Lean default: **diet** (relocate detail, keep the 100 cap credible). If instead the cap is revised, that's a standard-credibility change → record an **ADR** (like ADR-006 did for the SKILL cap).

## Assumptions
- **A1** — a single scoped cheap-tier reviewer gives adequate coverage for small/medium diffs; the full `/code-review` fan-out stays for large/high-risk. *Confirm: G2 (T1).*
- **A2** — the tier-map / roster detail can move to references without losing the SSOT's value. *Confirm: G2 (T2).*

## Execution Log

### 2026-06-12 | promote | plan locked
SPRINT-006 rendered from the Backlog (TASK-026 · TASK-027) via `/lean-doc-generator promote`.
Governance: no learnings at count ≥ 2 (L-007 already promoted); TD-005 overdue (≥3 sprints) → routed
into T2; CHANGELOG rotation deferred (0.3.1 was PATCH). Plan frozen.

### 2026-06-12 | T1 | review depth scaled to diff size (3/3 DoD)
Session model. review-scoping.md gains a "Scale depth to diff size" section + table (small/medium → one
scoped `sonnet` reviewer; `/code-review` fan-out reserved for large/high-risk) and the imprecise
skip-table row is fixed. orchestrator Review reflects it inline (107 ≤ 110). Closes the v0.3.1 gap the
owner's screenshot showed (4-finder fan-out on small diffs). Note: lean-flow can't shrink `/code-review`'s
internal fan-out — the lever is reserving it for diffs that justify the cost.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/review-scoping.md` | T1 | "Scale depth to diff size" section + fixed skip-table row | Low | 66 lines |
| `skills/orchestrator/SKILL.md` | T1 | Review section reflects the depth rule | Low | 107 ≤ 110 |

## Retro
<!-- Written at close. Route the buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive (§11). -->

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
