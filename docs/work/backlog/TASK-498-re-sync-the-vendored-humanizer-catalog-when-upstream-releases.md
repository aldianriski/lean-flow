---
id: TASK-498
title: "Re-sync the vendored humanizer catalog when blader/humanizer releases past 3.1.0"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-498 — Re-sync the vendored humanizer catalog when blader/humanizer releases past 3.1.0

## Why
`skills/humanizer/references/patterns-en.md` is a verbatim snapshot of blader/humanizer 3.1.0 at `8c307f36`, with no
auto-sync (SPRINT-139, ADR-001 review). Keeping it verbatim is what makes a re-sync a clean file replacement, but only if
someone notices a new upstream release.

## Done when
- [x] The catalog body is `cmp`-identical to the new upstream release's SKILL.md from `## Why AI text sounds the way it does`
      to the end, and the header names the new version and full commit sha. ✓ `cmp` against v4.0.0 from line 17, 2026-11-13; header names 4.0.0 and `b48c832f0f809c1b5658edbb838c2521b72f2413`
- [x] Every pattern that is new or changed upstream gets an ADR-001 review row (keep / adapt + reason), approved by the
      owner before the catalog commit. ✓ seven review rows, owner popup 2026-11-13: "Approve, keep our rule" (six keep, one adapt: SKILL.md step 2 overrides the catalog's draft step)
- [x] The Indonesian catalog's § mapping is re-checked against any renumbered upstream sections. ✓ no section renumbered; §15 renamed only, `ID-7 (§15)` still maps
- [x] CHANGELOG line. ✓ under Unreleased

## Assumes

## Tracker
SPRINT-139 Retro (follow-up).
