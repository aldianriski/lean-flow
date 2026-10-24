---
id: TASK-496
title: "Release the /humanizer set and verify it on the consumer path"
sprint: SPRINT-139
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-495]
---

# TASK-496 — Release the /humanizer set and verify it on the consumer path

## Why
Shipping is not wiring: the set is done only when an installed copy fires in a repo that is not lean-flow (L-015, L-020).

## Done when
- [ ] Version bumped (one MINOR) in every manifest that `grep -l '"version"' .*-plugin/*.json` lists, all equal, plus the
      README footer; CHANGELOG `[Unreleased]` becomes that version.
- [ ] Consumer path: on a fresh install (prime's `Skills:` row reads fresh) in a non-lean-flow repo, `/humanizer` standalone
      and one embedded caller both fire, and no repo-specific path leaks.
- [ ] `/flow` chain demonstrated per the TASK-490 decision: one `/flow` run on the installed copy shows humanizer firing where
      that decision says it fires (a named step, or through the wired writing stages).
- [ ] README capability section and CONTEXT.md re-checked against the shipped roster.
- [ ] The MINOR is bumped by hand (release-patch is PATCH-only); nothing is pushed; the owner pushes.

## Touches
`.*-plugin/*.json` manifests · README footer · CHANGELOG

## Assumes
- One MINOR release covers TASK-490..495.

## Tracker
Owner intake 2026-10-24.
