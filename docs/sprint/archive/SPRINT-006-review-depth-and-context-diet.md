---
sprint: 006
slug: review-depth-and-context-diet
owner: Maintainer
last_updated: 2026-06-12
status: closed
plan_commit: 5f16897
close_commit: 656ac3c
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
- [x] hybrid: **diet 151 → 127** (removed prose duplicating CLAUDE.md/README → pointers) **+ cap revised 100 → 130** in `DOCS_Guide §2`, recorded as **ADR-007**
- [x] no information lost — dedup only; every unique fact kept (streams · task-states · tracker · tier contract · governance); SSOT reads coherently (127 ≤ 130)
- [x] **TD-005 resolved** (marked in TODO at close)

## Owner-action checklist
- [x] None — both tasks are dev/spec work.

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
| `.claude/CONTEXT.md` | T2 | dedup diet 151 → 127 (duplicated prose → pointers) | Med | 127 ≤ 130 |
| `docs/adr/ADR-007-context-cap-ssot-density.md` | T2 | new — cap 100 → 130 rationale | Low | indexed |
| `docs/DECISIONS.md` | T2 | ADR-007 index row | Low | resolves |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T2 | §2 CONTEXT cap 100 → 130 (ADR-007) | Low | reads cleanly |

### 2026-06-12 | T2 | CONTEXT diet + cap revise (3/3 DoD) — TD-005 resolved
Session model (SSOT, risk med). Hybrid per the G2 call: **dedup diet 151 → 127** (the loop diagram,
curated-not-copied rationale, built-in-command detail, graphify orientation all duplicated CLAUDE.md/
README → replaced with pointers; no unique fact lost) **+ modest cap revise 100 → 130** recorded as
**ADR-007** (same logic as ADR-006 — a cap miscalibrated for a special doc-kind). DOCS_Guide §2 + DECISIONS
index updated. TD-005 resolved.

## Retro
<!-- Written at close. Route the buckets (DOCS_Guide §10): shipped → CHANGELOG · tech debt → TD-NNN ·
     follow-ups → TASK-NNN · learnings → LEARNINGS. Then archive (§11). -->

**Worked**
- The owner's screenshot turned a vague "review wastes tokens" into a **precise** lever (reserve `/code-review` fan-out for large/high-risk; single scoped reviewer otherwise) — concrete evidence > abstract spec review.
- **Dedup-first** diet resolved TD-005 with zero info loss — CONTEXT was carrying *duplication*, not just length; ADR-007 then made the cap honest (the ADR-006 pattern reused cleanly).

**Friction**
- CONTEXT.md had drifted into duplicating CLAUDE.md/README prose over six sprints — the SSOT silently accretes copies of its satellite docs unless actively deduped.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **SSOT docs silently accumulate duplication of their satellite docs** (CONTEXT ↔ CLAUDE/README) — §11 doc-aging covers ledgers but not this. → **L-008** (count 1); if it recurs, promote to a periodic SSOT-dedup trigger.
