---
owner: Maintainer
last_updated: 2026-06-22
update_trigger: prime/handoff read-order changes, or a loop-mechanics optimization lands
status: current
id: loop-mechanics-audit
tags: [process]
domain: skills
related: []
---

# Research — Where is token/friction cost hiding in the loop's mechanics? (SPRINT-010 T3)

> **Question.** In the session/loop machinery (prime read-order · handoff↔prime · CLAUDE/CONTEXT/README load overlap · gate re-grill), what is paid every session that doesn't earn its cost?
> **Verdict.** The loop is mostly tight. **One clear win: defer README at prime** (human-facing, overlaps the AI-context files). Two minor hardening items (handoff discipline · reverse-direction SSOT check). Gate re-grill is already optimized. All → follow-up tasks (D1).

## Why this matters

prime runs at every session start and re-runs after `/clear`; its read cost is paid constantly. Redundant reads are the cheapest tokens to reclaim.

## Findings

**1. prime reads README every start — lowest-value of the 6 slots.** prime reads CLAUDE.md · CONTEXT.md · **README** · MEMORY · TODO+sprint · ARCHITECTURE. README is the **human front-door**; for an AI *resuming work* it largely restates CLAUDE (shape) + CONTEXT (SSOT) + ARCHITECTURE (map) for a human audience. CLAUDE+CONTEXT+ARCHITECTURE already carry the durable facts prime needs. → **Defer README**: read it only as a *fallback* when CLAUDE.md or CONTEXT.md is missing; otherwise report its presence in the health check but skip the full read. Highest-value optimization here.

**2. handoff↔prime redundancy is low *by design*, but usage can break it.** handoff already "references durable artifacts" rather than restating them, and prime re-reads TODO/sprint for the live state — so a disciplined handoff adds only the *ephemeral* (in-flight reasoning, the immediate next action). The risk is a handoff that **restates** the sprint/TODO state prime will re-read anyway → double cost. → Hardening: a handoff red-flag — *reference durable state (TODO/sprint), never restate it.*

**3. CLAUDE/CONTEXT/README overlap — ADR-007 dedup claim now holds, in one direction.** SPRINT-009's T1 enforced CONTEXT→satellite dedup (built-in detail → ARCHITECTURE pointer; curated/loop/governance compressed), so CONTEXT no longer duplicates CLAUDE/README. The **reverse** isn't guaranteed: README (front-door) still restates CONTEXT's loop/gates for humans. That's acceptable for README's audience, but worth a periodic check that CLAUDE doesn't re-duplicate CONTEXT. → Hardening: extend the SSOT-dedup anti-pattern (L-008) to a reverse-direction spot-check at doc-aging.

**4. Gate re-grill cost — already optimized, no action.** The detailed grill lives at intake (`/task-decomposer`, per L-002); G2 re-grills *residuals only* (an open assumption blocks G2, nothing else); `sprint-bulk` runs batch-G1+G2 **once** for the whole sprint. There is no redundant re-grilling left to cut.

## Recommendation

Follow-up tasks (none applied this sprint — D1):
- **(highest value)** make prime's README read **lazy/fallback** — skip the full read when CLAUDE+CONTEXT are present; still health-check its presence.
- add a `/handoff` red-flag: *reference durable state, don't restate it.*
- *(optional)* add a reverse-direction SSOT spot-check (CLAUDE/README don't re-duplicate CONTEXT) to promote doc-aging.

Not hard-to-reverse → no ADR. The README-at-prime change touches prime's contract → confirm it still degrades gracefully (README missing is already non-fatal).

## Out of scope / open questions

- ARCHITECTURE could also be deferred at prime (needed when touching code, not every start) — lower confidence; left as an open question.
- No source edited this sprint; prime/handoff changes are follow-up tasks.
