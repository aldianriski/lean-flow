---
sprint: 029
slug: dispatch-cost-note
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: c1ef89a
close_commit: —
update_trigger: sprint execute/close events
---

# SPRINT-029 — Dispatch-Cost Note

> **Theme:** Land the adhd scan's single micro-keeper (TASK-099) — make dispatch-cost awareness
> durable: parallel sub-agent dispatch re-pays the full base substrate (CLAUDE.md + tool context)
> per branch, so cost scales with branch-count × substrate-size, not call-count alone.

## Scope

**In:** a one-line cost-awareness note in ADR-010 and/or `orchestrator/references/dispatch.md`
(and `/council`'s cost line if it genuinely fits).
**Out (deferred):** any dispatch *behaviour* change · TASK-006 / TASK-040 / TASK-047 (blocked) ·
new research scans.

## Plan

### T1 — Add the N×substrate dispatch-cost note `[size: S · risk: low]`
Layers: `docs/adr/ADR-010-*.md` · `skills/orchestrator/references/dispatch.md` · `skills/council/SKILL.md`
The adhd delta scan's one keeper: dispatch decisions should weigh that every parallel branch
re-pays the full base substrate — cost scales with branch-count × substrate-size, not call-count.
ADR-010 is decided/append-only, so the note lands as an addendum, never a rewrite of decided text.

**Acceptance:** the cost-awareness note landed in ADR-010 and/or dispatch.md, consumer-clean
(no repo-specific path leaked); `/council`'s cost line extended only if it fits.

**DoD:**
- [x] Cost-awareness note landed in ADR-010 (addendum) and/or `orchestrator/references/dispatch.md`
- [x] `/council` cost line checked — extended if it fits, else the skip noted in the Execution Log
- [x] Consumer-surface check (L-015) + line caps respected (SKILL.md ≤ ~110)

## Decisions (pre-locked)
- **D1** — Doc-only addendum; no dispatch behaviour change (scan verdict: micro-keeper). ADR-010 is
  append-only — addendum section/line, never an edit of decided content. No new ADR.

## Assumptions
- **A1** — none (doc-only addendum; TASK-099 filed `assumes: none`).

## Execution Log

### 2026-07-29 | promote | plan locked
Governance at promote: L-009 promoted → CLAUDE.md anti-pattern (edit-safety bullet, cap held at
80/80 by merging with L-042's bullet) · TASK-006's fused TODO.md heading restored (the promotion's
3rd family occurrence) · TD-008 unchanged (re-reviewed at 028) · no §11 rotation due.

### 2026-07-29 | T1 complete | N×substrate cost note landed in all three targets
Batch G1+G2 approved (single task, no overlap map needed). Implemented inline — stated reason: three
trivial doc edits; an execution dispatch would itself re-pay the substrate the note warns about.
`/council`'s cost line fit and was extended (73→74/110). ADR-010 append-only respected (amendment,
no decided text edited).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/adr/ADR-010-model-dispatch-role-tiers.md` | T1 | appended cost-term amendment (N×substrate) | Low | qa-check corpus lint |
| `skills/orchestrator/references/dispatch.md` | T1 | cost-term line in Parallel vs sequential | Low | qa-check + self-review |
| `skills/council/SKILL.md` | T1 | cost line extended (spawn ≈ full substrate) | Low | qa-check cap 74/110 |

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
