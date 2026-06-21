---
sprint: 009
slug: external-face-ssot-diet
owner: Maintainer
last_updated: 2026-06-21
status: closed
plan_commit: ea03a54
close_commit: 74fa6f6
update_trigger: sprint execute/close events
---

# SPRINT-009 — External face + SSOT diet

> **Theme:** Deliver the QA discipline's *external* (advisory) face — soft test/QA prompts and a
> test-strategy reference for the user's own projects — and pay down the SSOT debt (TD-006) that is
> now blocking further CONTEXT edits. Make room first, then advise.

## Scope

**In:** a `CONTEXT.md` dedup back under cap (TD-006) · soft, non-blocking test/QA prompts in the SPRINT
+ task templates and the orchestrator Review step · a test-strategy reference that guides choosing the
test *type* (unit/integ/e2e/perf/load) for the user's real code.
**Out (deferred → SPRINT-010):** allowed-tools least-privilege audit (TASK-011) · description-trigger
audit (TASK-012) · loop mechanics audit (TASK-016).

## Plan

### T1 — Dedup CONTEXT.md back under cap (TD-006)  `[size: M · risk: med]`
Layers: `.claude/CONTEXT.md`
`CONTEXT.md` is at 129/130 — effectively full (L-008, count 2, promoted this promote). A dedup pass
turns prose that merely re-states CLAUDE.md/README into pointers, recovering headroom **with no info
lost** — and unblocks T2, which must edit the task-entry shape that lives here.

**Acceptance:** `CONTEXT.md` back to ~120 or below, no information lost (every dropped line's content still reachable via its pointer), `qa-check` cap passes with margin.

**DoD:**
- [x] `CONTEXT.md` 130 → **122** (8 under cap); built-in detail relocated to ARCHITECTURE § Key integration points, curated/loop/governance compressed to pointers
- [x] no information lost — all sections intact (roster · gates · modes · tiers · sprint model · glossary · task-shape); compression only, verified by diff
- [x] `sh scripts/qa-check.sh` cap passes with margin (122/130); TD-006 to be marked resolved at close

### T2 — Soft test/QA prompts in templates + Review (TASK-014)  `[size: S · risk: low]`
Layers: `templates/SPRINT.md.template`, the task-entry shape (`CONTEXT.md`), `orchestrator/references/review-scoping.md`
Add prompts that *raise* "tests? lint? security-review? perf budget?" as **suggestions** — never gates.
This is lean-flow advising a user's project, consistent with the suggestion-not-enforcement spine.

**Acceptance:** the SPRINT + task templates and the Review step surface the QA prompts as clearly-optional suggestions; wording verified non-blocking (no new gate introduced).

**DoD:**
- [x] SPRINT template carries a soft "QA check?" prompt (HTML comment after DoD) + the task-entry shape (CONTEXT) gains an optional `qa:` note
- [x] orchestrator Review (`review-scoping.md`) adds a "QA suggestion (raise, never gate)" subsection
- [x] wording reviewed: suggestion only, never a gate — all three are comments/optional notes, no new `[ ]` checkbox

### T3 — Test-strategy reference (TASK-015)  `[size: M · risk: low]`
Layers: `skills/tdd/references/test-strategy.md` (NEW), pointers from `tdd` + `orchestrator`
A reference (sibling to `testability.md`) that helps pick the right test *type* per task for the
**user's real code** — unit/integ/e2e/perf/load as guidance. NOT new skills (the dev-flow bloat trap).

**Acceptance:** the reference exists and guides test-type choice per task; `tdd` + `orchestrator` point to it; no new skills added.

**DoD:**
- [x] `skills/tdd/references/test-strategy.md` written — per-task test-type guide (unit/integ/e2e/perf/load) for the user's code
- [x] `tdd` (81 ≤110) + `orchestrator` (108 ≤110, pointer folded into the routing line) point to it
- [x] no new skills / no per-test-type skills added; `qa-check` clean

## Owner-action checklist
- [ ] none — no secrets, env, or external dashboards this sprint

## Decisions (pre-locked)
- **D1** — TASK-014's prompts stay **soft / non-blocking** (suggestions, not gates) — the hard constraint from the QA-discipline discussion; respects the no-hooks / suggestion-not-enforcement spine.
- **D2** — T1 dedup moves duplicated prose to **pointers**, never deletes unique content (L-008's fix is compression, not loss).

## Assumptions
- **A1** — T1 lands before T2 (T2 edits the task-entry shape inside CONTEXT.md). *Confirm: build order.*
- **A2** — the test taxonomy (unit/integ/e2e/perf/load) is delivered as one reference, not per-type skills. *Confirm: this session's hard constraint.*

## Execution Log
<!-- Append-only, dated. Surprises, scope additions, completions. Plan frozen at promote. -->

### 2026-06-21 | promote | SPRINT-009 plan locked
Promoted TD-006 (T1) + TASK-014 (T2) + TASK-015 (T3). Governance: L-008 promoted → CLAUDE.md
anti-pattern (periodic SSOT dedup) + collapsed; TD-005 collapsed (§11). T1 unblocks T2 (both touch
CONTEXT.md). Plan frozen; execution appends below.

### 2026-06-21 | T1 done | CONTEXT.md dedup (TD-006)
`.claude/CONTEXT.md` 130 → 122 (8 under cap). Compression only — built-in-leverage per-command detail
relocated to ARCHITECTURE § Key integration points (the pointer); curated-not-copied, the loop, doc
standard, orientation, and governance reworded to pointers/denser form. No section removed, no unique
fact lost (verified by diff). qa-check clean. Unblocks T2 (which edits the task-entry shape here).

### 2026-06-21 | T2 done | soft QA prompts (3 touch-points, non-blocking)
Added a soft, optional "QA check? (tests · lint · security-review · perf)" prompt in three places — all
suggestions, never gates (D1): `review-scoping.md` § "QA suggestion (raise, never gate)"; SPRINT template
(HTML comment after DoD); CONTEXT task-entry shape (optional `qa:` note). CONTEXT 122→123 (still 7 under cap).
**L-010 near-miss:** first applied the SPRINT-template edit to the install *cache* path, not the repo source —
caught immediately, re-applied to `D:\…\skills\…`. 2nd occurrence of L-010 → bump at close (count → 2, promote).

### 2026-06-21 | T3 done | test-strategy reference
`skills/tdd/references/test-strategy.md` — a per-task guide to choosing the test TYPE (unit/integ/e2e/
perf/load) for the host project's real code, as guidance (the taxonomy from the original ask, NOT new
skills). Pointers: `tdd/SKILL.md` (alongside testability.md) + `orchestrator/SKILL.md` (folded into the
Implement-routing line — no new line, stays 108/110). qa-check clean. All SPRINT-009 DoD met.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `.claude/CONTEXT.md` | T1/T2 | SSOT dedup 130→122 (TD-006) + optional `qa:` note | Med | qa-check + diff |
| `skills/orchestrator/references/review-scoping.md` | T2 | QA-suggestion subsection (non-gate) | Low | review |
| `skills/lean-doc-generator/templates/SPRINT.md.template` | T2 | soft QA prompt comment | Low | review |
| `skills/tdd/references/test-strategy.md` (NEW) | T3 | per-task test-type guidance | Low | review |
| `skills/tdd/SKILL.md` · `skills/orchestrator/SKILL.md` | T3 | pointers to test-strategy.md | Low | qa-check (caps) |

## Retro

**Worked**
- T1's dedup recovered 8 lines with zero info loss (compression → pointers), and the qa-check cap rule made the win measurable + safe.
- Sequencing T1 (make room) before T2 (which edits CONTEXT) was the right call — no cap breach, no L-042 contention.
- The external face landed lean: 3 soft touch-points + 1 reference, **no new skills** — the dev-flow bloat trap avoided as designed.

**Friction**
- **L-010 recurred** — I edited the SPRINT template in the install *cache* path before the repo source; caught by habit, not tooling. 2nd occurrence → promote.
- CONTEXT, even post-diet, is only at 123/130 — the SSOT runs structurally dense; future vocab additions will keep pressuring it (TD-006 bought headroom, didn't end the tension).

**Pattern candidate**
- L-010 bumped to count 2 (Sprint-007 + Sprint-009) → promote at next promote (a skill red-flag / CLAUDE.md anti-pattern: edit the repo source, never the install cache).

Buckets routed (§10): Shipped → CHANGELOG · Tech debt → **TD-006 resolved** → SPRINT-009 T1 · Learnings → L-010 bump · Follow-ups → none.
