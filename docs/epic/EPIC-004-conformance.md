---
epic: 004
slug: conformance
owner: Maintainer
last_updated: 2026-08-16
status: active
member_sprints: [072, 073]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-004 — Conformance

> **Outcome:** any repo can ask "am I conformant with the lean-flow standard, and at what level?" and
> get a named answer with named findings — including whether its human gates were actually signed.

## Why this, why now

This is the epic that converts a style guide into a standard. Eleven checkers
(`scripts/lib/check-*.sh`) and 24 eval harnesses already encode most of the rules, and every one of
them is maintainer-only:

<!-- CORRECTED at SPRINT-072 T4 — measured, not asserted. Two claims in this section are wrong and are
     left in place (an epic is edited, but the correction is more useful beside the original).
     (a) "already encode most of the rules" — they encode most of *lean-flow's project conventions*.
     Only 3 of the standard's 13 sections are referenced anywhere in scripts/lib/ (§2 ×30, §11 ×16,
     §7 ×1); ten sections have zero. Five of eleven checkers cite no section at all. Measured coverage
     is 8 rules covered of 96 classified.
     (b) "24 eval harnesses" / "~82 named findings across 16 retained fixture harnesses" (Open
     questions) — actual: 22 harnesses on disk, 17 asserting, 98 fixture cases, 46 distinct named
     finding strings. The ~82 conflated cases with findings.
     Baseline: docs/research/conformance-baseline.md. -->
 ADR-008 scoped them to this repo and `docs/architecture/overview.md` confirms
no consumer invokes them (`docs/research/platform-readiness-audit.md` F4). The machinery exists and
points inward. Turning it outward is a smaller build than it looks, and it is the highest-value
consumer-facing gap in the audit.

It spans sprints because the engine has to become **spec-driven** rather than a renamed pile of
scripts. Eleven bespoke checkers that each hard-code their own rule cannot answer "at what level" —
only a checker that reads the EPIC-003 spec as its rule source can, and only that version survives a
spec change without eleven edits.

**A gate's worst failure is the silent false negative.** Every check ships with at least one must-FAIL
fixture that fails with its *named* finding (L-058, proven twice live), and those fixtures are
retained (TD-012). L-108 binds too: a check anchors to a **position**, not a substring, because this
corpus is self-describing and a grep over it eventually matches prose about the search.

## Scope

**In:** one spec-driven conformance engine replacing the 11 bespoke checkers · consumer-facing
packaging (runs in a consumer repo, CI-friendly exit codes, named findings) · attestation
verification reading EPIC-003's git trailers · must-FAIL fixture per check · a ruling on ADR-008's
maintainer-only scope.

**Out (explicitly not):** enforcing conformance (ADR-011 stands — gates stay human discipline; this
reports, it does not block) · cross-repo aggregation (EPIC-005) · scoring or grading repos against
each other · any telemetry, ever (the README promises none).

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-072](../sprint/archive/SPRINT-072-conformance-baseline.md) | Conformance Baseline | closed 2026-08-16 · `87954f2` | **Overturned this epic's opening premise and replaced it with a measurement.** All **96** normative rules classified — 8 covered · 39 uncovered-mechanical · 45 judgment-only · 6 implementation-directed — and reconciled against the live corpus (11 checkers · 22 harnesses · 98 fixture cases · 46 distinct findings). The checkers do **not** encode the standard: 3 of 13 sections are referenced in `scripts/lib/`, ten have zero. Established the fourth bucket `implementation-directed` (6 rules an engine must never evaluate against an adopter), that a §2 row is a *parameter set* not a rule (6 families, not 37), and that **Gated is the hard level, not Attested**. Changed no checker and no execution architecture — verified by diff. |
| [SPRINT-073](../sprint/archive/SPRINT-073-spec-as-rule-source.md) | The Spec as Rule Source | closed 2026-08-16 · `[close_commit]` | **Made D1 mechanically true: the spec is now the rule source.** `spec/STANDARD.md` **0.4.0** carries every rule's level and mark in-file, keyed by stable ids a finding can name, plus **§14** stating the model — including the **no-percentage** ruling *normatively*, so it binds adopters' tools rather than this epic's notes. **98 classified + 2 unclassified**, re-derived from the spec after the frozen baseline proved unable to reproduce its own total (96 stated vs 99 and 98 by column). **54 dispositions** — 42 `build` each naming its finding, 12 `scope-out` each with its reason. Ruled the spec uncapped (**ADR-026**, closing TD-058). No checker, no engine, no execution-architecture change. |

## Decisions

- **D1** — The engine is spec-driven: rules come from the EPIC-003 spec, not from code. A checker that
  hard-codes its rule cannot report a *level*, and drifts from the spec silently.
- **D2** — ADR-008's maintainer-only scope is amended or superseded here. **→ ADR pending**; the
  original reasoning (first executable code, aimed at this repo) is sound and simply predates the
  standard having consumers.
- **D3** — Conformance reports; it never blocks. ADR-011 already ruled that gates are human
  discipline, and a standard that fails a stranger's build on adoption is a standard nobody adopts.

## Open questions

- Does the engine ship inside the plugin, or as a standalone script an adopter can run without
  installing lean-flow? → the second is more useful and more work; ~~settle at the first member G2~~
  **deferred at SPRINT-072's promote to the *engine* sprint's G2 (its D2)**. The first member turned
  out to be the inventory-and-baseline sprint, and the answer depends on which rules prove mechanically
  checkable *without the plugin present* — which is what that sprint measures. Deferred to the evidence
  that decides it, which is not the same as parked (L-094).
- ~~Can 11 checkers' named findings survive consolidation?~~ **Answered in EPIC-002 D3 (SPRINT-063 T4)
  — cited, not re-decided**, as this row always said it would be. The 11 stand alone for now because
  they share no input model; consolidation was **deferred to this epic**, and its unblock condition is
  a documented behaviour rather than a signal to wait for: **D1's spec existing in a form a checker can
  read as its rule source.** So this epic inherits a live constraint — the ~82 named findings asserted
  across 16 retained fixture harnesses are the contract any engine here must preserve (L-058).
- ~~What does a partially-conformant repo see — a level, a percentage, or a list?~~ **Answered
  2026-08-16 (SPRINT-072 promote, owner ruling → its D1):** a **conformance level + the named findings
  preventing the next level + the judgment-required items**. Explicitly **no percentage, no score, no
  grade** — the row's own instinct was right, and the decisive argument is the third element: a
  percentage averages a *deliberate judgment-only boundary* together with a *real gap*, so the number
  goes up when the standard declines to automate something, which is exactly backwards. The engine's
  ADR records this; it is not re-decided there.

## Closed when

- [ ] A repo that has never run lean-flow gets a conformance report naming its level
- [ ] Every spec rule maps to a check, or is explicitly marked judgment-only in the spec
      — **SUBSTANTIALLY ADVANCED at SPRINT-073, still not ticked, and the remaining gap is now small
      and named.** The *"in the spec"* half is **done**: `spec/STANDARD.md` 0.4.0 marks every rule
      in-file (§14), so the judgment-only rules satisfy this condition outright. What is left is the
      other clause — *maps to a check* — for the **42** rules dispositioned `build`
      (`docs/research/conformance-dispositions.md`). A disposition is a decision to build, not a check;
      those land with the engine and with **TASK-228** for §13's five.
      **Two smaller residuals, both explicit:** the **12** rules dispositioned `scope-out` neither map
      to a check nor are marked judgment-only, so this condition may need re-reading once the engine
      exists — flagged rather than quietly satisfied; and **2** rules (`S4.INDEX`, `S5.DISCARDLOG`)
      carry `?` and have no mark at all → **TASK-230**
- [ ] Each check has a retained must-FAIL fixture that fails with its named finding
      — measured at SPRINT-072: the corpus is **22 harnesses (17 asserting) · 98 fixture cases · 46
      distinct named findings**, and that set is the **contract any engine must preserve**, not a
      target to re-derive (L-058 · TD-012). Whether *every* check has one is not yet established
- [ ] Attestation is verified from git trailers, per task, without trusting a self-report
      — **§13 is entirely unchecked**: 7 rules, 0 covered, no attestation checker exists. The baseline
      also puts §13 at 5 mechanical of 7, so this is more tractable than it reads → **TASK-228**
- [ ] ADR-008's scope is formally amended or superseded, not silently outgrown
      — unchanged; belongs with the engine sprint's design, where the packaging question (§ Open
      questions) is also settled
