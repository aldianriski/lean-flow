---
sprint: 010
slug: audits
owner: Maintainer
last_updated: 2026-06-21
status: active
plan_commit: 7b3728e
close_commit: [unset]
update_trigger: sprint execute/close events
---

# SPRINT-010 — Audits

> **Theme:** Close out the deferred investigations — the two internal skill audits (allowed-tools,
> description-trigger) and the loop-mechanics audit. Each **produces findings + proposed follow-ups;
> no fixes are applied in-sprint** — surfaced fixes become follow-up `TASK-NNN`. Audit, don't churn.

## Scope

**In:** an allowed-tools least-privilege report across the 14 skills · a description-trigger accuracy
report (mis/under-trigger) with proposed wording fixes · a session/loop mechanics audit with proposed
optimizations.
**Out (deferred):** *applying* any fix the audits surface (each spawns a follow-up task); TASK-006
(blocked — hooks research) · TASK-008 (`/insights`, built/unreleased).

## Plan

### T1 — Audit allowed-tools least-privilege across 14 skills (TASK-011)  `[size: S · risk: low]`
Layers: `skills/*/SKILL.md` (read), a findings report
Each skill declares `allowed-tools`; over-grants widen the blast radius an agent can cause. Compare
what each skill *declares* vs what its procedure *actually needs*, and flag the gaps — plus a
no-unsafe-instruction check (no skill telling an agent to do something destructive).

**Acceptance:** a report lists every skill's declared vs needed tools, flags over-grants as follow-up fixes, and records the no-unsafe-instruction pass.

**DoD:**
- [ ] per-skill table: declared `allowed-tools` vs needed; over-grants flagged
- [ ] no-unsafe-instruction check recorded (pass, or specific findings)
- [ ] over-grants → follow-up `TASK-NNN` (fixes are NOT applied this sprint)

### T2 — Audit description-trigger accuracy (TASK-012)  `[size: M · risk: low]`
Layers: `skills/*/SKILL.md` descriptions (read), eval output
A skill's `description:` decides when it fires. Audit for mis-triggers (fires on the wrong intent) and
under-triggers (misses the right one), using `skill-creator` eval tooling where available.

**Acceptance:** a report of mis/under-trigger cases with proposed wording fixes (proposals only, not applied).

**DoD:**
- [ ] trigger audit run (skill-creator eval, or documented manual fallback — see A1)
- [ ] mis/under-trigger cases reported with proposed `description:` wording fixes
- [ ] proposals only — no description edited this sprint (→ follow-up `TASK-NNN`)

### T3 — Audit session/loop mechanics (TASK-016)  `[size: M · risk: low]`
Layers: an audit/research doc only
Investigate friction + token cost in the loop's mechanics; output proposals for approval, no edits.

**Acceptance:** an audit doc reports prime read-order necessity, handoff→prime redundancy, CLAUDE/CONTEXT/README load overlap (ADR-007 dedup claim verified), and gate re-grill cost — each with a proposed optimization.

**DoD:**
- [ ] prime read-order (6 slots — all needed every start?) assessed
- [ ] handoff→prime round-trip redundancy + CLAUDE/CONTEXT/README load overlap assessed (ADR-007 claim verified)
- [ ] gate re-grill cost assessed; each finding carries a proposed optimization → follow-up `TASK-NNN`; NO source edits this sprint

## Owner-action checklist
- [ ] none — no secrets, env, or external dashboards this sprint

## Decisions (pre-locked)
- **D1** — this is an **audit sprint**: every task ends at *findings + proposals*; fixes are follow-up tasks, applied in a later sprint (avoids churning the whole skill set on un-reviewed proposals).
- **D2** — report location (one `docs/research/<slug>.md` each vs a single audit doc) — decided at G2.

## Assumptions
- **A1** — `skill-creator` eval tooling is reachable for T2; if not, fall back to a documented manual trigger review. *Confirm: at G1/T2.*
- **A2** — audits do not edit skills/templates this sprint (proposals only). *Confirm: D1.*

## Execution Log
<!-- Append-only, dated. Plan frozen at promote. -->

### 2026-06-21 | promote | SPRINT-010 plan locked
Promoted TASK-011 (T1) + TASK-012 (T2) + TASK-016 (T3) — the deferred audits. Governance: L-010 promoted
→ CLAUDE.md anti-pattern (edit repo source, never install cache) + collapsed; all TD resolved. Plan frozen.

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
