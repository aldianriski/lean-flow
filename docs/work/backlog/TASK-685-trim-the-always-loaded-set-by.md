---
id: TASK-685
title: "Trim the always-loaded set by at least 15% of its tokens and ratchet the token budget"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-684]
---
# TASK-685 — Trim the always-loaded set by at least 15% of its tokens and ratchet the token budget

## Why
CLAUDE.md is 79 of 80 lines and CONTEXT.md 150 of 150. The gate reads ~12,634 of 12,691 tokens (57 headroom), and CONTEXT.md is ~70% of the bytes at ~176 bytes per line. The owner ruled at least 15% plus a ratchet. Duplicated prose becomes pointers (L-008, TD-006).

## Done when
- [ ] The `check-doc-caps` token-budget line reports ≤ floor(0.85 × the baseline the gate measures at build start) tokens (10,738 for the 12,634 measured at intake), with both files inside their line caps.
- [ ] `scripts/lib/token-budget.txt` is ratcheted to the measured value + 3%, with a new `adopted-at` and a reason naming this task, and nothing else in the file changes.
- [ ] A retained rule inventory (`docs/work/evidence/TASK-685/inventory.md`) classifies every trimmed line as universal (applies in every session) or branch-specific, and marks it kept, moved (home plus the pointer left behind) or deleted (reason: duplicate of a named surviving line). A universal action stays in the always-loaded set, shortened and not moved; only branch-specific text moves, to a home the flow that needs it already reads, and each moved row names that flow; every `L-`, `ADR-` and `TD-` id still cited in the trimmed set resolves; `qa-check` is green.
- [ ] Census before/after: every `→ promoted:` / `→ moved:` pointer in `docs/LEARNINGS.md`, and every pointer in CLAUDE.md that targets a `.claude/CONTEXT.md` or `.claude/CLAUDE.md` `§` heading, still resolves after the trim.
- [ ] Negative: no universal action leaves the always-loaded set, no moved row lacks a named flow that already reads its home, and a pointer left dangling by the trim fails the task.

## Touches
`.claude/CLAUDE.md`, `.claude/CONTEXT.md`, `scripts/lib/token-budget.txt`. Homes: `docs/architecture/overview.md`, `docs/LEARNINGS.md` § Durable rules (append only, after TASK-684), existing skill references. NOT README (owned by TASK-693). Consumer templates untouched.

## Assumes
- CONTEXT.md roster lines are owned here; no other task edits CONTEXT.md (a roster edit goes to this task).
- The ratchet is a value edit with measured cost as the reason, not new machinery.

## Tracker
Owner intake 2026-11-21, area 1; answers Q1 (15%) and Q2 (ratchet).
