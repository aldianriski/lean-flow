---
sprint: 012
slug: process-hardening
owner: Maintainer
last_updated: 2026-07-02
status: active
plan_commit: f6c11ed
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-012 — Process Hardening

> **Theme:** Harden the skills from real usage feedback + the bmad-adaptation keepers (TASK-039).
> Five small, self-contained skill/doc changes that close process gaps surfaced in use — before the
> larger knowledge-metadata work (TASK-036/041) lands in the next sprint.

## Scope

**In:** open-question guardrail (035) · host-project test-quality standard (037) · Ponytail simplicity
ladder (038) · mid-sprint scope-change log convention (042) · anti-sycophancy Review (043).
**Out (deferred):** TASK-036 + TASK-041 (knowledge-metadata SSOT + retrieval-miss signal → SPRINT-013) ·
TASK-040 (derived graph view — blocked behind the 041 signal) · TASK-006 (gate-guard hook — blocked) ·
ADR-008 for the knowledge-structure decision (offered separately, not this sprint).

## Plan

### T1 — Guardrail: surface flow-blocking open questions, never park them `[size: M · risk: med]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/orchestrator/SKILL.md` · `.claude/CLAUDE.md` · `CONTEXT.md` (gates, if wording changes)
A question that BLOCKS progress must be asked (one-at-a-time grill) or recorded as an explicit
`blocked`/owner-action with an unblock condition — never written as a passive placeholder (`TBD` /
silent `assumes:`) that stalls dev. Borrow bmad's explicit halt-contract wording (K-halt: state the
blocking condition).

**Acceptance:** the gate-bearing skills carry the rule + a new CLAUDE anti-pattern; exercised once on a real intent.

**DoD:**
- [ ] task-decomposer grill: a blocking question is asked one-at-a-time, never parked as a silent `assumes:`
- [ ] orchestrator G1/G2: an unconfirmed blocking question → explicit `blocked`/owner-action + unblock condition (not a passive note)
- [ ] `.claude/CLAUDE.md` anti-pattern added (parking a flow-blocking open question in a doc)
- [ ] exercised once on a real intent (the "exercise-on-real-input" rule, L-007)
<!-- QA: doc-only edits → self-review floor + the one real exercise. -->

### T2 — Host-project test-quality standard, wired to the loop points that fire `[size: M · risk: low]`
Layers: `skills/tdd/references/test-standard.md` (new) · `skills/task-decomposer/references/prd-and-slices.md` · `skills/orchestrator/references/review-scoping.md` · `skills/tdd/SKILL.md`
lean-flow has no test suite of its own, so this is guidance the skills EMIT to host projects. Because
the loop rarely invokes `/tdd` directly, cite the standard from the points that DO fire: decompose's
Testing Decisions + orchestrator Review.

**Acceptance:** `test-standard.md` exists (12-pt checklist + 70/20/10 pyramid + risk-tier→depth + regression gate) and is cited from decompose + Review; never a lean-flow gate.

**DoD:**
- [ ] `test-standard.md`: 12-point checklist + 70/20/10 pyramid (unit-API-integ / component-UI / E2E)
- [ ] risk-tier P0–P3 → pyramid-depth mapping (bmad K2) in the standard
- [ ] task-decomposer "Testing Decisions" cites it (pick the mix per pyramid + risk tier)
- [ ] orchestrator Review cites the 12-pt checklist + regression gate (K3: tests match tier + zero regressions) via the `qa:` hint
- [ ] framed as HOST-project guidance, never a lean-flow gate
<!-- QA: reference doc → self-review. -->

### T3 — Fold the Ponytail simplicity ladder into behavioral principles `[size: S · risk: low]`
Layers: `.claude/CLAUDE.md` (Behavioral Guidelines) · `skills/orchestrator` · `skills/tdd` · `skills/refactor-advisor` (light cross-ref)
Fold the anti-over-engineering ladder into existing principles — no new skill (curated, not copied).

**Acceptance:** the ladder is a CLAUDE behavioral guideline + referenced where build skills act; skill count stays 14.

**DoD:**
- [ ] CLAUDE.md Behavioral Guidelines: the ladder (YAGNI → reuse existing → stdlib → native → installed dep → one line → minimal code; stop at first working rung; delete > add; root-cause > symptom)
- [ ] light cross-ref from orchestrator / tdd / refactor-advisor where build skills act
- [ ] skill count stays 14 (no new skill)
<!-- QA: doc edits → self-review. -->

### T4 — Mid-sprint scope-change convention in the Execution Log `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` (sprint-bulk / Execution Log) · `CONTEXT.md` (§ sprint-model, if documented there)
A mid-sprint pivot currently gets silently absorbed. Add a lightweight scope-change Execution-Log
entry — what broke · impact · re-confirm G2 if scope shifted — logged BEFORE editing the frozen Plan.
bmad keeper K4 (correct-course), slimmed to a convention, not a new skill.

**Acceptance:** orchestrator carries the scope-change log format + a red-flag; CONTEXT notes it if the log format is documented there.

**DoD:**
- [ ] orchestrator: scope-change Execution-Log entry format (what broke · impact · re-confirm G2)
- [ ] rule: log the scope change BEFORE editing the frozen § Plan
- [ ] red-flag added (silently absorbing a mid-sprint scope change)
<!-- QA: doc edits → self-review. -->

### T5 — Anti-sycophancy Review: 0-findings → re-run assume-guilty `[size: S · risk: low]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/SKILL.md` (Review) · optionally `skills/tdd/SKILL.md` (edge-case lens)
LLM reviewers under-report. If a scoped reviewer returns 0 findings, re-run once with an
"assume a flaw exists, find it" framing before accepting a clean pass. bmad keepers K5
(adversarial-general + edge-case-hunter), slimmed.

**Acceptance:** Review scoping carries the 0-findings → assume-guilty re-run rule; the edge-case-lens placement is decided at G2.

**DoD:**
- [ ] review-scoping: 0 findings from a scoped reviewer → re-run once with an assume-guilty framing before accepting
- [ ] orchestrator Review references the rule
- [ ] G2 decision recorded: Review-only vs also a `/tdd` branch/boundary enumeration lens
<!-- QA: doc edits → self-review. -->

## Owner-action checklist
<!-- None — all tasks are dev/doc edits. -->

## Decisions (pre-locked)
- **D1 — Shared-file commit order (L-042 / L-037).** Overlapping files → single owner + commit order,
  staged per-hunk (`git add -p` + verify `git diff --cached`), never a plain `git add` over another
  task's WIP:
  - `skills/orchestrator/SKILL.md` → **T1 → T4 → T5** (distinct sections: gate rule · Execution Log · Review)
  - `.claude/CLAUDE.md` → **T1 → T3** (anti-pattern · behavioral guideline)
  - `skills/orchestrator/references/review-scoping.md` → **T2 → T5** (checklist cite · anti-sycophancy rule)
  - `CONTEXT.md` → **T1 → T4** (gates · sprint-model)
  - (task-decomposer: T1 edits `SKILL.md`, T2 edits `references/prd-and-slices.md` — different files, no overlap.)
  Not an ADR — a coordination lock, resolved here at promote per the SPRINT template.

## Assumptions
- **A1** — 035: the PRD template needs no edit (it has no Open-Questions section); RESEARCH/handoff open-question sections stay (legit there). *Confirmed this session (templates read).*
- **A2** — 037: guidance-only, not a hard Review/DoD gate. *Confirmed by the maintainer this session.*
- **A3** — 043: the branch/boundary edge-case lens placement (Review-only vs also `/tdd`) is open. *Confirm: G2 at sprint-bulk.*

## Execution Log
<!-- Append-only, dated. Log scope changes here (T4 convention once it lands) — never edit § Plan. -->

### 2026-07-02 | promote | Sprint planned + locked
Formed from Backlog ready tasks TASK-035/037/038/042/043 (usage-feedback + bmad-adaptation keepers).
036/041 deferred to SPRINT-013. Governance review clean (no L-promotions, no TD aging, no doc-aging).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(none yet — planned)_ | | | | |

## Retro
<!-- Written at close. Route buckets to durable homes (DOCS_Guide §10). -->

**Worked**
-

**Friction**
-

**Pattern candidate** (surface → `docs/LEARNINGS.md`)
-
