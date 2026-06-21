---
sprint: 009
slug: external-face-ssot-diet
owner: Maintainer
last_updated: 2026-06-21
status: active
plan_commit: [pending]
close_commit: [unset]
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
- [ ] `CONTEXT.md` <= ~120 lines; each removed block replaced by a pointer to its canonical home (CLAUDE.md / README / DOCS_Guide)
- [ ] no information lost — spot-check the SSOT still answers loop/gates/modes/tiers/glossary
- [ ] `sh scripts/qa-check.sh` cap check passes with margin; TD-006 marked resolved at close

### T2 — Soft test/QA prompts in templates + Review (TASK-014)  `[size: S · risk: low]`
Layers: `templates/SPRINT.md.template`, the task-entry shape (`CONTEXT.md`), `orchestrator/references/review-scoping.md`
Add prompts that *raise* "tests? lint? security-review? perf budget?" as **suggestions** — never gates.
This is lean-flow advising a user's project, consistent with the suggestion-not-enforcement spine.

**Acceptance:** the SPRINT + task templates and the Review step surface the QA prompts as clearly-optional suggestions; wording verified non-blocking (no new gate introduced).

**DoD:**
- [ ] SPRINT + task templates carry a soft "QA check?" prompt (tests · lint · security-review · perf)
- [ ] orchestrator Review references the same soft prompt
- [ ] wording reviewed: suggestion only, never a gate (hard constraint)

### T3 — Test-strategy reference (TASK-015)  `[size: M · risk: low]`
Layers: `skills/tdd/references/test-strategy.md` (NEW), pointers from `tdd` + `orchestrator`
A reference (sibling to `testability.md`) that helps pick the right test *type* per task for the
**user's real code** — unit/integ/e2e/perf/load as guidance. NOT new skills (the dev-flow bloat trap).

**Acceptance:** the reference exists and guides test-type choice per task; `tdd` + `orchestrator` point to it; no new skills added.

**DoD:**
- [ ] `skills/tdd/references/test-strategy.md` written — when to reach for unit/integ/e2e/perf/load
- [ ] `tdd` + `orchestrator` SKILLs point to it (routing suggestion, not requirement)
- [ ] no new skills / no per-test-type skills added; `qa-check` stays green

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

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro
<!-- Written at close. Route buckets per §10; then archive → docs/sprint/archive/ + INDEX.md line (§11). -->

**Worked**
- _(at close)_

**Friction**
- _(at close)_

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- _(at close)_
