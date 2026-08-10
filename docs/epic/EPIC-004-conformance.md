---
epic: 004
slug: conformance
owner: Maintainer
last_updated: 2026-08-10
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-004 — Conformance

> **Outcome:** any repo can ask "am I conformant with the lean-flow standard, and at what level?" and
> get a named answer with named findings — including whether its human gates were actually signed.

## Why this, why now

This is the epic that converts a style guide into a standard. Eleven checkers
(`scripts/lib/check-*.sh`) and 24 eval harnesses already encode most of the rules, and every one of
them is maintainer-only: ADR-008 scoped them to this repo and `docs/architecture/overview.md` confirms
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
| _(appended at promote)_ | | | |

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
  installing lean-flow? → the second is more useful and more work; settle at the first member G2.
- Can 11 checkers' named findings survive consolidation? → shares EPIC-002's open question; if the
  answer there is no, this epic inherits the constraint rather than re-deciding it.
- What does a partially-conformant repo see — a level, a percentage, or a list? → a percentage invites
  gaming and a bare list gives no direction; likely a level plus the named gap to the next one.

## Closed when

- [ ] A repo that has never run lean-flow gets a conformance report naming its level
- [ ] Every spec rule maps to a check, or is explicitly marked judgment-only in the spec
- [ ] Each check has a retained must-FAIL fixture that fails with its named finding
- [ ] Attestation is verified from git trailers, per task, without trusting a self-report
- [ ] ADR-008's scope is formally amended or superseded, not silently outgrown
