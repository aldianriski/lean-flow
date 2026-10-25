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
- [x] Version bumped (one MINOR) in every manifest that `grep -l '"version"' .*-plugin/*.json` lists, all equal, plus the ✓ 4 manifests + README footer at 2.15.0, lockstep 4/4 PASS; [Unreleased] -> v2.15.0 block; spec 0.18.1 (b8c4b9e6)
      README footer; CHANGELOG `[Unreleased]` becomes that version.
- [x] Consumer path: on a fresh install (prime's `Skills:` row reads fresh) in a non-lean-flow repo, `/humanizer` standalone ✓ real repo (research workdoo, git-less), 2.15.0 zip via --plugin-dir: Skills row fresh; /humanizer standalone; lean-doc-generator ADR written with the pass; no leaks
      and one embedded caller both fire, and no repo-specific path leaks.
- [x] `/flow` chain demonstrated per the TASK-490 decision: one `/flow` run on the installed copy shows humanizer firing where ✓ /flow: prime -> task-decomposer (parked at grill) -> handoff, pass in a child sub-agent (TASK-490 decision: through wired stages)
      that decision says it fires (a named step, or through the wired writing stages).
- [x] README capability section and CONTEXT.md re-checked against the shipped roster. ✓ 15 skills agree three ways; README + CONTEXT humanizer rows fixed (696b225c)
- [x] The MINOR is bumped by hand (release-patch is PATCH-only); nothing is pushed; the owner pushes. ✓ MINOR bumped by hand; nothing pushed; push left to the owner

## Touches
`.*-plugin/*.json` manifests · README footer · CHANGELOG

## Assumes
- One MINOR release covers TASK-490..495.

## Tracker
Owner intake 2026-10-24.
