---
id: ADR-026
tags: [process, docs]
domain: governance
status: accepted
related: ADR-015, ADR-020, ADR-023, ADR-024
---

# ADR-026 — `spec/STANDARD.md` carries no numeric line cap, and says so in §2

- **Status:** accepted (2026-08-16)
- **Deciders:** Maintainer
- **Context driver:** TD-058 (open since SPRINT-070) and TASK-219. The spec had no §2 row at all, so
  `check-doc-caps.sh` — which *derives* its coverage from §2 rather than hand-listing — reported zero
  rows for `spec/`, and the omission read as an oversight rather than a decision.

## Context

`spec/STANDARD.md` is the largest governed document in this repository and the only one whose growth
nothing reported. It is also the artifact an adopter **pins** (ADR-023), which makes any rule about its
shape a rule every consumer inherits. The file is self-referential in a way no other row is: the
standard would be capping itself, and §2's cap table is part of the standard doing the capping.

TASK-219 was unactionable for four sprints for one stated reason — *the number is not derivable from
this repo's history, because the file has never been capped and there is no growth curve under a ceiling
to reason from* — and ADR-015 forbids a stated cap that is a gesture rather than a real number. SPRINT-073
T1 produced the missing evidence by making the largest single edit the file will ever take.

**The measured growth curve**, re-derived from git at execution rather than remembered:

| commit | lines | what landed |
|---|---|---|
| `8ad178e` | 497 | extraction to `spec/` (SPRINT-069 T2) |
| `10b7ac0` | 587 | §13 attestation, +90 |
| `d164924` | 595 | close, +8 |
| `a83b450` | 624 | §9 `gates_signed:` + `*Verify:*`, +29 |
| `6adf910` | **923** | §14 + 13 per-section Conformance tables, **+299** |

Rule additions cost 30–90 lines. The +299 is a one-time structural layer, not the trend.

## Decision

**`spec/STANDARD.md` gets a §2 row, and that row's `Cap` cell reads `no numeric cap (ADR-026)`.** The
reasoning is written inline beneath the table, in §2 itself, so the next reader of the cap table finds
the ruling where the absence used to be. `spec/CHANGELOG.md` joins the same table as `append-only`.

**The governor for this file is §14's rule table, not a line count.** If the spec bloats it will be
prose accreting around a stable rule set, and the rule count is what makes that visible.

The deciding argument is that **§2's own escape hatch is unavailable to this file.** Every other capped
row resolves a cap-hit by splitting into a canonical tree. For this one, splitting fails three ways:

1. **Adopters pin it by path** (ADR-023). Splitting into numbered section files is a breaking change for
   every consumer — no other §2 row carries that cost.
2. **The split target escapes the checker.** A cap check deriving its file set from §2 expands a path
   into a **non-recursive** glob (TD-061, probed live at SPRINT-072's G2). Splitting into a subdirectory
   would move the spec *out of the cap checker's reach* — the remedy silently un-governing the file the
   cap was added to govern.
3. **The rule ids are cross-section.** §7's rows cite `S2`/`S3`/`S5`; §14 cites `S13`. A split fragments
   the rule source a conformance tool has to read as one document.

A cap whose only escape is unusable can be satisfied **only by squeezing** — which §2's Growth rule
forbids in as many words (*cap-hit → split, never squeeze*), §7 lists as a named anti-pattern, and L-131
recorded one sprint ago as a failure committed while reading the rule against it.

This is precisely the *"the cap was never reachable"* case §2 already names: the standard **mandates**
content the number never budgeted for. §2's prescribed response to that case is to fix the *number*, and
fixing it honestly means ruling that a line count is the wrong instrument here.

## Consequences

**Positive.** TD-058 closes on its actual complaint: the absence stops reading as an oversight, because
§2 now carries the row and the reasoning. §2 becomes complete — every governed file in the repository
appears in the table that governs it. Adopters inherit a rule that will not break their pin. And the
standard demonstrates its own honesty rule: it declines to state a number it cannot defend, rather than
stating one and grandfathering it later.

**Negative — and it is real.** *There is now no automated signal on this file's growth.* Nothing will
report if the spec doubles through prose bloat; the §14 rule count is a governor only if someone reads
it. This is a genuine loss against the status quo ante's intent, and it is accepted because the
alternative — a number resolvable only by an action the standard forbids — would produce a permanent
report that every promote re-litigates and eventually grandfathers, which ADR-015 rule 2 exists to
prevent.

**Negative.** A non-numeric `Cap` cell means `check-doc-caps.sh` will never emit a row for this file, so
"the spec is in §2 now" and "the checker sees it" remain two different statements. The first is true; the
second is deliberately false, and anyone reading the checker's output as complete coverage of §2 will be
wrong about this one row.

**Negative.** The ruling is self-referential in a way that resists review: the standard is the document
arguing that it should not be capped. The mitigation is that the argument rests on three checkable facts
(the pin, the non-recursive glob, the cross-section ids), not on preference.

## Alternatives considered

- **Soft cap at 1000** — a real number, derived as 923 + one §13-sized section. Rejected: 8% headroom
  against 30–90-line rule additions means it fires within a sprint or two, and its only available
  resolution is *restate by ADR*. That is a cap which exists to be raised, and §7 says a second raise on
  one file signals the file is doing too many jobs rather than a routine renewal.
- **Soft cap at 1200** — more headroom, roughly three more rule additions. Rejected on derivation: 1200
  is chosen for comfort rather than read off the curve, which is exactly the gesture ADR-015 forbids.
- **Hard cap** — rejected outright. An adopter's pin makes surprise growth expensive, but a hard cap on a
  file whose only escape hatch is a breaking change would block the standard from gaining a rule.
- **Leave it uncapped with no row** — the status quo, and what TD-058 filed against. Rejected: the
  absence keeps reading as an oversight to the next person who greps §2, which is the whole defect.
- **Split pre-emptively into `spec/` section files** — rejected on all three grounds in § Decision, and
  independently by TD-061: the split target is not visible to the cap check at all.
