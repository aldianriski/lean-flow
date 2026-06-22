---
sprint: 011
slug: audit-fixes
owner: Maintainer
last_updated: 2026-06-22
status: active
plan_commit: [pending]
close_commit: [unset]
update_trigger: sprint execute/close events
---

# SPRINT-011 — Audit fixes

> **Theme:** Apply the SPRINT-010 audit findings — tighten skill `allowed-tools` (and settle the
> sub-agent-dispatch question), trim prime's README read, harden handoff discipline. Small, surgical
> skill edits; the fixes the audit sprint deferred.

## Scope

**In:** least-privilege `allowed-tools` corrections across 5 skills + a recorded answer to the
dispatch-gating question · prime reads README lazily (fallback only) · a `/handoff` red-flag against
restating durable state.
**Out (deferred):** the optional trigger-wording polish + reverse-direction SSOT check (not filed);
TASK-006 (blocked).

## Plan

### T1 — Fix skill allowed-tools + settle dispatch-gating (TASK-018)  `[size: M · risk: low]`
Layers: `skills/{diagnose,council,flow,task-decomposer,orchestrator}/SKILL.md` frontmatter
From `docs/research/allowed-tools-audit.md`: apply the clear corrections and resolve the one open
semantics question first (it decides whether 3 skills need `Task`/`Agent` added — see D1).

**Acceptance:** the dispatch-gating question is answered + recorded; `diagnose` gains `Write`, `council` drops `Bash`, `flow` is confirmed and trimmed if it never writes; qa-check stays green.

**DoD:**
- [ ] dispatch-gating question answered + recorded (CONTEXT/ADR or the audit doc) — does `allowed-tools` block sub-agent dispatch?
- [ ] `diagnose` +`Write` (confirmed under-grant); `council` −`Bash` (over-grant)
- [ ] `flow` checked — drop `Write`/`Edit` if it never writes directly; `task-decomposer`/`orchestrator`/`council` get `Task`/`Agent` ONLY if gating is confirmed
- [ ] `sh scripts/qa-check.sh` green (frontmatter intact)

### T2 — Defer README at prime (TASK-019)  `[size: S · risk: low]`
Layers: `skills/prime/SKILL.md`
From `docs/research/loop-mechanics-audit.md`: README is the lowest-value slot at prime (overlaps
CLAUDE+CONTEXT+ARCHITECTURE). Make its full read a fallback; still health-check its presence.

**Acceptance:** prime reads README's full content only when CLAUDE.md or CONTEXT.md is missing; otherwise it reports README presence but skips the read; the missing-file path still degrades gracefully.

**DoD:**
- [ ] prime read-order makes README a fallback (read only if CLAUDE.md/CONTEXT.md absent)
- [ ] README presence still appears in the health report (`[OK]`/`[MISSING]`)
- [ ] graceful degradation preserved (no abort); prime SKILL stays ≤110

### T3 — Handoff red-flag: reference, don't restate (TASK-020)  `[size: S · risk: low]`
Layers: `skills/handoff/SKILL.md`
From `docs/research/loop-mechanics-audit.md`: a handoff that restates TODO/sprint state doubles the
cost prime pays re-reading it. Add a red-flag making the reference-not-restate discipline explicit.

**Acceptance:** the handoff SKILL carries a red-flag that handoff docs reference durable state (TODO/sprint) rather than restating it.

**DoD:**
- [ ] `/handoff` SKILL gains the red-flag (reference durable state, don't restate)
- [ ] handoff SKILL stays ≤110; qa-check green

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)
- **D1** — the sub-agent-dispatch gating question is resolved **at G2/T1 before editing**. Audit evidence (council ran 11 sub-agents in SPRINT-003 with no `Agent` declared) points to **not gated** → apply the clear fixes + record the fact, do NOT add `Task` to 3 skills. Confirm before acting.

## Assumptions
- **A1** — dispatch-gating resolved at G2 (T1). *Confirm: G2.*
- **A2** — these are surgical frontmatter/SKILL edits; behaviour of the skills is unchanged beyond the tool boundary. *Confirm: review.*

## Execution Log
<!-- Append-only, dated. Plan frozen at promote. -->

### 2026-06-22 | promote | SPRINT-011 plan locked
Promoted TASK-018 (T1) · 019 (T2) · 020 (T3) — the SPRINT-010 audit follow-ups. Governance clean
(nothing to promote/age). Plan frozen.

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
