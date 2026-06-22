---
sprint: 010
slug: audits
owner: Maintainer
last_updated: 2026-06-21
status: closed
plan_commit: 7b3728e
close_commit: [pending]
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
- [x] per-skill table: declared vs needed → `docs/research/allowed-tools-audit.md`; 9 clean, issues on diagnose/council/flow + a sub-agent-dispatch semantics question
- [x] no-unsafe-instruction check recorded — **PASS** (no destructive instruction in any skill)
- [x] over-grants → follow-up tasks proposed in the report; filed to Backlog at close

### T2 — Audit description-trigger accuracy (TASK-012)  `[size: M · risk: low]`
Layers: `skills/*/SKILL.md` descriptions (read), eval output
A skill's `description:` decides when it fires. Audit for mis-triggers (fires on the wrong intent) and
under-triggers (misses the right one), using `skill-creator` eval tooling where available.

**Acceptance:** a report of mis/under-trigger cases with proposed wording fixes (proposals only, not applied).

**DoD:**
- [x] trigger audit run — **analytical/manual** (A1 fallback; skill-creator eval = deeper follow-up) → `docs/research/trigger-accuracy-audit.md`
- [x] findings reported — set is healthy; key insight: 13/14 are explicit-invoke (low-stakes), `/council` is the implicit-trigger one (well-built); minor overlap-polish noted
- [x] proposals only — no description edited (→ follow-up `TASK` if the polish is wanted)

### T3 — Audit session/loop mechanics (TASK-016)  `[size: M · risk: low]`
Layers: an audit/research doc only
Investigate friction + token cost in the loop's mechanics; output proposals for approval, no edits.

**Acceptance:** an audit doc reports prime read-order necessity, handoff→prime redundancy, CLAUDE/CONTEXT/README load overlap (ADR-007 dedup claim verified), and gate re-grill cost — each with a proposed optimization.

**DoD:**
- [x] prime read-order assessed → `docs/research/loop-mechanics-audit.md`; **README is the lowest-value slot** (defer it)
- [x] handoff→prime redundancy (low by design; usage risk) + CLAUDE/CONTEXT/README overlap (ADR-007 dedup now holds CONTEXT→satellite after SPRINT-009; reverse-direction unguaranteed) assessed
- [x] gate re-grill cost assessed — **already optimized** (intake-grill L-002 + residual-only G2 + batch-once); proposals → follow-up tasks; NO source edits

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

### 2026-06-22 | T1 done | allowed-tools least-privilege audit
Recon via a `sonnet` subagent (declared vs needed across 14 skills); synthesized on the session model →
`docs/research/allowed-tools-audit.md`. 9 skills clean. Findings: **diagnose** under-grants `Write`
(Phase 5 writes a new regression test) [high] · **council** over-grants `Bash` (no shell) · **flow**
likely over-grants `Write`/`Edit` (it only sequences) [verify]. **Semantics question:** council ran 11
sub-agents in SPRINT-003 with no `Agent` declared → `allowed-tools` likely does NOT gate sub-agent
dispatch; verify before touching council/task-decomposer/orchestrator. No-unsafe-instruction check: PASS.
Fixes → follow-up tasks at close (D1).

### 2026-06-22 | T2 done | description-trigger accuracy audit
Analytical review (A1 manual fallback) → `docs/research/trigger-accuracy-audit.md`. Key insight: 13/14
skills are **explicit-invoke** (you type the name), so trigger-accuracy is low-stakes for them — their
descriptions already carry strong "Do not use … use /X" boundaries. `/council` is the one implicit-trigger
skill and is well-engineered (MANDATORY/STRONG triggers + a negative guard). `/insights` ("anytime") will
under-fire implicitly by nature. No critical defect; minor overlap-polish is optional follow-up. Deeper
skill-creator eval reserved for `/council` if implicit accuracy ever matters.

### 2026-06-22 | T3 done | session/loop mechanics audit
Analysis → `docs/research/loop-mechanics-audit.md`. The loop is mostly tight. **Clearest win: defer
README at prime** — it's the human front-door, overlapping CLAUDE+CONTEXT+ARCHITECTURE; read it only as a
fallback when those are missing. Minor hardening: a handoff red-flag (reference durable state, don't
restate) + a reverse-direction SSOT check. Gate re-grill is already optimized (intake-grill L-002 +
residual-only G2 + batch-once) — no action. All SPRINT-010 DoD met; proposals → follow-up tasks at close.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/allowed-tools-audit.md` (NEW) | T1 | least-privilege findings | Low | self-review |
| `docs/research/trigger-accuracy-audit.md` (NEW) | T2 | trigger findings | Low | self-review |
| `docs/research/loop-mechanics-audit.md` (NEW) | T3 | loop-cost findings | Low | self-review |

## Retro

**Worked**
- Tier-routing paid off: T1's mechanical extraction ran on a `sonnet` subagent, freeing the session model for synthesis + the adversarial calibration that caught the false "Agent under-grant" cluster.
- The audit-sprint discipline (D1: findings → follow-ups, no in-sprint fixes) kept a read-only sprint from churning all 14 skills on un-reviewed proposals.
- Real signal surfaced: a confirmed `diagnose` under-grant, the README-at-prime token win, and a genuine open question (sub-agent-dispatch gating) worth verifying.

**Friction**
- The recon agent over-claimed under-grants (the `Agent` cluster) — a reminder that subagent output is raw data to verify, not a verdict to ship. Session-model judgment was load-bearing.
- "Audit → report doc" leans on the RESEARCH template, which fits findings→recommendation only loosely; acceptable, but a dedicated audit shape could be cleaner if audits recur.

**Pattern candidate**
- *Adversarially verify a recon subagent's claims before acting* — the `Agent`-cluster over-claim. One occurrence; watch for recurrence (would promote to a tier-dispatch red-flag). Not filed as a learning yet (count 1).

Buckets routed (§10): Shipped → CHANGELOG · Follow-ups → TASK-018 · 019 · 020 · Tech debt → none · Learnings → none (the verify-recon pattern is count 1, watched).
