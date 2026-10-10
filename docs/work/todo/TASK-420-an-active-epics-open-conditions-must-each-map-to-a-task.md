---
id: TASK-420
title: "Make every open condition of an active epic map to a task or a named next slice"
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-420 — Make every open condition of an active epic map to a task or a named next slice

## Why

On 2026-10-10 EPIC-015 was `active` with 4 open Closed-when conditions and no task for any of them. `/triage` reads only the
backlog, so the work was invisible to grooming, and a full overview missed it until the owner asked about the epics. Owner ruling
2026-10-10: an **active** epic's open conditions must each be covered. **Proposed** epics are exempt, because they are plans
rather than admitted scope. Enforcement is in the skills and the spec, with no conformance-engine rule; a mechanical check comes
only if the miss recurs. Admissible under the interim governance restriction as the fix for a measured defect.

## Done when

- [ ] The spec states the rule. When an epic is `active`, every open Closed-when condition maps to at least one open task (any
      non-done store folder, `epic:` stamped) or to a named next slice recorded in the epic. The way a task names the condition
      it serves is defined in the spec, chosen at G2. The spec version is bumped with a CHANGELOG entry.
- [ ] `/lean-doc-generator` applies it: activating an epic, and promote, each list the uncovered conditions, and promote refuses
      to form a sprint while an active epic it touches has an uncovered condition, unless the owner records an override.
- [ ] `/triage` reads the active epics alongside the backlog and lists each uncovered condition with its epic. `/prime` reports a
      count of uncovered conditions.
- [ ] Exercised on real input: run against this repo, the procedure reports EPIC-015 as fully covered by TASK-414–417. A seeded
      copy with one of those tasks removed reports exactly that condition as uncovered.
- [ ] The consumer surface is checked: the changed skills stay within the SKILL.md cap (procedure detail moves to `references/`;
      `lean-doc-generator` is already at 138 lines) and stay self-contained, and README + CHANGELOG describe the change.

## Touches

- `spec/STANDARD.md` · `spec/CHANGELOG.md` · `skills/lean-doc-generator/` · `skills/triage/` · `skills/prime/` · README ·
  CHANGELOG

## Assumes

- A shipped skill change, so it gets the Codex review loop (owner rule for adopter-facing changes).
- Workdoo-built epics are covered in workdoo's own store after TASK-418. This rule applies to whichever repo holds the epic.

## Tracker

- Owner rulings 2026-10-10 (rule: active-epic coverage · mechanism: skills + spec, no engine check) · EPIC-015 miss · L-151
