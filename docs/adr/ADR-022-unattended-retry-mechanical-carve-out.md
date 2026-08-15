---
id: ADR-022
tags: [process]
domain: skills
status: accepted
related: [ADR-016, ADR-021]
---

# ADR-022 — Unattended retry: the mechanical-trigger carve-out

- **Status:** accepted (2026-08-15)
- **Deciders:** Maintainer
- **Context driver:** the revise loop's value is highest exactly where nobody is present to act on
  its findings — but the unattended charter is execute-only, and a critic ruling "retry" is a decision.

## Context

SPRINT-065 shipped the revise loop attended-only and deferred this fork rather than deciding it under
momentum. The collision is real on both faces: `night-run.md` Part 0's charter is **execute-only —
decide nothing**, absence ≠ consent, and its own text warns that an agent unable to ask will *reason
out the answer itself and carry on*. Meanwhile a night run that merely reports a fixable finding in
its rollup costs a full morning round-trip on something a single bounded retry fixes in minutes — the
one context where the loop pays most is the one where it was forbidden.

ADR-021 changed the terms. It split verdicts into two classes: a **critic's judgment** ("not good
enough") is a live decision; a **`done-when`-named mechanical check's FAIL** is a decision the human
already made — at G2, when they named the check. The charter question stops being "may the run
retry?" and becomes "is acting on a pre-made decision execution or decision?"

## Decision

**An unattended run may fire the revise loop's single bounded retry only when ALL three prior human
decisions exist** — it is then executing them, not making one:

1. **The trigger is mechanical** — a `done-when`-named check FAIL or a failed comparand rung (the
   ADR-021 class). A critic-judgment finding **always parks**, unchanged.
2. **The ceiling is the attended one** — one retry per review pass, total (owner-ruled, SPRINT-065
   T3). Still-open after the retry → `parked-hitl`, never a second firing.
3. **The repo's declared policy enables it** (the EPIC-005 D2 shape: policy declared per repo, read
   by the run, never held by a coordinator process). **Absence of the policy = never** — the
   default is off, consistent with absence ≠ consent. Pre-flight confirms the policy before spawn.

Every firing writes **one rollup line** in the Part 4 block (`ADR-016`): axis, finding, outcome
(`fixed | still-open`), so the morning reader sees each retry whether or not it succeeded.

## Consequences

**Positive:** a night run stops leaving mechanically-fixable findings for the morning; the charter's
boundary sharpens rather than erodes — judgment findings park exactly as before, and the carve-out is
inert unless a repo explicitly opts in.

**Negative (trade-offs accepted):** the run gains its first sanctioned write-after-verdict path, and
a mis-specified `done-when` check (stale, wrong, or flaky) can now burn an unattended retry on a
false FAIL — bounded to one firing per pass by the ceiling, but real. The policy mechanism is
declared here by contract and not yet concretized (EPIC-005 owns the format); until then the default
holds: no declaration, no unattended retry. Skill prose remains fixture-less (TD-052) — the must-FAIL
leg for this path lands with TASK-208/209's build, not here.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Attended only, full stop (uphold unchanged) | Leaves the loop's highest-value context permanently dark, on a distinction ADR-021 shows is coarser than the charter needs — parking a pre-decided mechanical fix is caution against the wrong risk |
| Critic-judgment retry allowed with a ceiling | Reads judgment as execution — the exact move the charter forbids; a ceiling bounds the cost of a decision, it does not make it not-a-decision |
| Decide per-run in the trigger prompt (flag, no policy) | A per-spawn flag is held by whoever types the trigger, not declared by the repo — the EPIC-005 D2 anti-pattern; policy must survive the person |
