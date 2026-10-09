---
id: TASK-413
title: "Rule the ADR-044 and ADR-048 Decision edits so lean-flow can reach conformance level Gated"
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: needs-info
depends-on: []
---

# TASK-413 — Rule the ADR-044 and ADR-048 Decision edits so lean-flow can reach conformance level Gated

## Why

SPRINT-120 brought lean-flow to conformance level Structural on its own tree. The only findings left are two Gated-level
`adr-edited-after-decision` (S4.APPEND): ADR-044's and ADR-048's § Decision text differs from the text accepted at their decision commits.
§4 is append-only, and the engine's own message names the supported path: a post-decision marker in the header.

## Done when

- [ ] For each of ADR-044 and ADR-048, the owner has ruled on one path (revert § Decision to the accepted text, mark the ADR superseded by a
      new one, or record a post-decision header marker), and `sh conformance.sh .` reports 0 `S4.APPEND` findings.

## Touches

- `docs/adr/ADR-044-hooks-are-admissible.md` · `docs/adr/ADR-048-the-always-loaded-read-set-is-budgeted-in-tokens.md`

## Assumes

- needs-info: the owner's choice of path for each ADR. Unblock: read both diffs against their accepted commits (`f1efa36b`, `3e725ef4`)
  and rule.

## Tracker

- SPRINT-120 (deferred out of scope) · STANDARD §4 · S4.APPEND
