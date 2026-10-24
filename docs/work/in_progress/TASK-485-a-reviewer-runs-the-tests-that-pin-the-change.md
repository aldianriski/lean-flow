---
id: TASK-485
title: "a reviewer runs the existing tests that pin what the change touches"
sprint: SPRINT-138
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-485 — a reviewer runs the existing tests that pin what the change touches

## Why
TD-212 (medium) is a **measured defect**: SPRINT-111 shipped four breaks through green default gates, each found only by running by
hand the tests that pinned the changed spec or skill. Procedure only, with no automated test-discovery guard and no gate leg.
Unfrozen. It is a shipped skill, so the Codex review loop applies.
Consumer: every adopter's reviewer gets the step, and it reads the host's own tests.

## Done when
- [ ] `review-scoping.md`'s brief requires finding the host's existing tests and harnesses that reference each changed artifact (by
      path and by the names it exports or defines), running them, and reporting each result in the host's format, in a section
      separate from the Standards/Spec axes. Finding none is reported as "no pinning test found", never left silent. Host-generic.
- [ ] Exercised three ways. Applied to one SPRINT-111 break's diff, the procedure names the test that caught it by hand. One real
      SPRINT-138 review reports the section. Applied read-only to one workdoo diff, it names that repo's pinning tests (or reports
      that none were found).
- [ ] TD-212 resolved (or narrowed, naming what stays open); README and CHANGELOG describe the review change.

## Touches
`skills/orchestrator/references/review-scoping.md` · `TECH-DEBT.md` · README · CHANGELOG

## Assumes
- Shipped wording is host-generic: lean-flow's own test paths appear only as an example.
- workdoo is read, never written.

## Tracker
- TD-212 · owner selection 2026-10-24 (candidate G); intake draft reviewed by Codex 2026-10-24 (APPROVE WITH FIXES, folded in)
