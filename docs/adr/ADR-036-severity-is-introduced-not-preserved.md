---
id: ADR-036
tags: [process, tooling]
domain: doc-standard
status: accepted
related: [ADR-034, ADR-024, ADR-027]
---

# ADR-036 — Severity is introduced by the migration, not preserved by it

- **Status:** accepted (2026-08-24)
- **Deciders:** Maintainer
- **Supersedes:** the **Severity** row of [ADR-034](ADR-034-semantic-compatibility-contract.md)
  § Decision. That ADR is append-only (§4 · `S4.APPEND`), so the row stands as decided and this file
  carries the correction. Read them together.
- **Context driver:** a compatibility contract froze a vocabulary the system being preserved does not
  have — caught by independent review before anything was built against it.

## Context

ADR-034 froze seven elements of the semantic surface that EPIC-014's strangler migration must preserve.
Six name something the current Shell engine actually does. **One did not.**

The **Severity** row read `note` · `warn` · `hold` · `fail`. That list is
`LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` §9's *target-state TypeScript type* — a sketch of what
the new engine should have. What the Shell engine emits today is:

| Emitter | Output |
|---|---|
| `ok()` | `PASS` |
| `bad()` | `FAIL` |
| `gap()` | `GAP` |
| `note()` | an untagged indented line — reused by `hold()` for its detail |

**There is no `warn` anywhere in the implementation, and the word "severity" does not occur in
`spec/STANDARD.md` at all.** Unlike Rule ID — which has a `cmp`-verified snapshot and a command of
record — the Severity row had no artifact and no referent.

This matters because that row is the one a differential-parity harness leans on hardest: comparing
severities is how a parity test distinguishes "same finding, different wording" from "same wording,
different verdict". Pointed at a vocabulary that does not exist, it would either be quietly skipped or
report every future `WARN` as a parity break.

## Decision

**Severity is not a frozen compatibility surface. It is new behaviour the migration introduces.**

1. **What ADR-034 should have frozen, and what is frozen from here:** the **verdict vocabulary** the
   engine emits today — `PASS` · `FAIL` · `GAP` — and which one a given rule evaluation carries.
2. **The four-level severity model (`note`/`warn`/`hold`/`fail`) arrives at H15**, with document
   budgets at H16 and profiles at H17. Its mapping onto today's `PASS`/`FAIL`/`GAP` is ruled there,
   against the real emitters, not against a sketch.
3. **`WARN` not failing the run is a deliberate divergence, listed here as V3 §20 requires** (*"Known
   intentional behavior changes, such as document budget WARN instead of FAIL, must be explicitly
   listed"*). **A parity harness reporting it as a regression has misread the contract.**

### The general rule this makes explicit

**Every row of a compatibility contract must name something the *current* system does.**

A compatibility contract is written while looking at the target design, so target vocabulary leaks in
and reads as though it were preserved — the author cannot feel the difference, because both lists sit
on the same page in the same tense. The test is mechanical and cheap: **point at the artifact.** Rule
ID, level and mark have a `cmp`-verified snapshot; verdict vocabulary has three emitter functions;
full-run level has ADR-024; exit meaning has ADR-027. **A row that can point at nothing is a design
intention wearing a contract's clothes**, and it fails in the worst direction — silently, and only at
cutover, when the harness built on it disagrees with reality.

## Consequences

**Positive.**

- The parity harness has a comparand that exists, so severity comparison can actually be implemented.
- The `WARN`-does-not-fail change is pre-listed rather than discovered as a parity failure at H20.
- ADR-034's history stays intact and auditable: what was decided, and what was later found wrong, are
  both on the record in the order they happened, which is exactly why §4 is append-only.

**Negative.**

- **Two ADRs now describe one contract, and a reader who finds only ADR-034 gets the wrong answer.**
  Mitigated by the marker in ADR-034 § Consequences and its `related:` entry — mitigated, not removed.
- **The correction is narrow and the class of defect is not.** Six rows were checked against real
  referents *after* review raised one; nothing prevents the same leak in a future contract except the
  rule stated above, which is prose, not a check.
- Severity being unfrozen means that until H15 there is **no** contract governing verdict granularity
  beyond `PASS`/`FAIL`/`GAP` — a genuine hole, accepted because inventing one now would repeat the
  exact error this ADR corrects.

## Alternatives considered

- **Edit ADR-034's Severity row in place.** Rejected — and attempted: it tripped
  `adr-edited-after-decision` (`S4.APPEND`), which is the rule working. A decided ADR is superseded,
  never rewritten, because the record of what was decided is what makes the reasoning auditable.
- **Mark ADR-034 `superseded` in full and reissue it.** Rejected as disproportionate: six of seven rows
  were verified correct by the same review. Superseding a whole contract to fix one row would discard
  the verified parts and the audit trail with them.
- **Freeze severity as `PASS`/`FAIL`/`GAP` and call the H15 model a breaking change.** Rejected: it is
  the same category error in the other direction — treating a vocabulary the migration is *designed* to
  replace as a contract it must preserve.
- **Leave severity out of the contract entirely, with no ruling.** Rejected: silence is what let the
  target-state list in unchallenged. An element deliberately not frozen must say so, or the next
  contract author freezes a sketch again.
