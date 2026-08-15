---
id: ADR-021
tags: [process]
domain: skills
status: accepted
related: [ADR-011, ADR-016]
---

# ADR-021 — Mechanical evidence gates the silent path, never the owner

- **Status:** accepted (2026-08-15)
- **Deciders:** Maintainer
- **Context driver:** the missing layer the second gauntlet audit named — proving that what the loop
  produced satisfies the agreed outcome — without inverting the human-authority identity.

## Context

The "raise, never gate" spine (`review-scoping.md` § QA suggestion, descending from ADR-011's
no-enforcement ruling) conflated two different authorities. Its examples are all about the
**consumer's** QA surface: lean-flow suggests tests/lint/security and never runs the user's CI as a
blocker. But the same sentence was read as covering the coordinator's **own bookkeeping** — the DoD
tick and the close — where nothing mechanically prevented ticking past a red check. The guard there
was discipline alone ("surface the failure, don't bury it"), which protects the honest path and not
the silent one.

The silent path is the one that actually fails. Measured blast radius across the ledger: **L-120 (a)**
— a gate and a commit fused into one shell call, so the FAIL scrolled past and `08e9182` landed red;
**L-089** — a red gate committed because it was not re-run; **L-116** — a green gate describing an
incomplete commit; plus the five-sighting report-vs-artifact family in CLAUDE.md § Edit-safety (c),
now at 7×/5 sprints. Every one is a mechanical verdict that existed and did not reach the decision to
proceed. Meanwhile SPRINT-065 shipped the Spec-axis comparand ladder and the bounded revise loop —
external evidence now exists per task; what was unruled is whether it may *bind*.

## Decision

**Where a task's `done-when` names a mechanical check, that check's FAIL blocks the silent path.**
The coordinator may not tick the DoD box, or close over it, while the named check fails — it surfaces
the FAIL and gets a **recorded owner ruling**; the owner may always override, on the record. Two
boundaries hold the identity intact:

1. **The owner is never gated.** This blocks the *silent* tick, not the human decision — the exact
   inverse of a hard gate. Gates are owner-ruled; tools advise (ADR-011 unchanged).
2. **The consumer's CI is never run as a blocker on lean-flow's own authority.** What may gate is
   only what the task's own `done-when` named, run as written. Everything else — the tests / lint /
   security / perf suggestions — stays raised, never gating.

At **G2**, each micro-task's `done-when` notes its **verification method** where a mechanical one
exists (the DOCS_Guide completion-bound rule made explicit and just-in-time — never a file path
frozen into a Backlog entry weeks early). A `done-when` with no mechanical check remains a judgment
tick, and says so.

## Consequences

**Positive:** a silent false-green now requires a recorded human decision to exist — the failure mode
with the worst ledger history loses its quiet path. Each tick acquires the evidence pointer TASK-209
needs. G2's "verifiable micro-tasks" line stops being aspirational (the matcher rule: a named check
is the matcher).

**Negative (trade-offs accepted):** G2 costs one line per task. The boundary is only as strong as the
checks the `done-when` names — a task that names none is exactly as unguarded as before, and nothing
here forces naming one. A stale named check can block honestly-green work until the owner rules,
which is friction by design. Skill prose still has no fixture harness (TD-052), so this rule ships as
procedure with G2 as its named matcher, not as a scripted gate.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Spine stands unchanged (null answer) | Guards only the honest path; L-120 (a) showed the FAIL scrolling past a fused call — discipline did not reach the moment of the tick |
| Hard gate, no owner override | Inverts the human-authority identity (ADR-011); a stale check would then block work with no recorded escape |
| Full verification contract in Backlog entries (per-AC commands at decompose time) | Commands and paths go stale between filing and build — the audit's own caveat; G2 is the just-in-time point where the repo's current state is known |
