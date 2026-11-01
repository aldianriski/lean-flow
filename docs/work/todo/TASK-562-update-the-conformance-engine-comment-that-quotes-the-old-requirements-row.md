---
id: TASK-562
title: "Update the conformance-engine comment that still quotes the old requirements row of STANDARD §2"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-562 — Update the conformance-engine comment that still quotes the old requirements row of STANDARD §2

## Why
Spec 0.18.2 (SPRINT-153 T6) reworded §2's `product/requirements.md` row from "skipped on an existing repo whose AI-context
files already ARE the spec" to "cites them topic by topic". The comment in `scripts/lib/conformance-engine.sh` (about lines
520-526) still quotes the old cell, so a reader of the engine meets a rule the spec no longer states. Comment only, but the
file is consequential G (ADR-050), so the hash-restore discipline applies.

## Done when
- [ ] The comment quotes the current §2 cell; no executable line changes (`git diff` shows comment lines only).
- [ ] The conformance fixtures and the full gate pass unchanged on the VPS.

## Touches
`scripts/lib/conformance-engine.sh` (comment only)

## Tracker
SPRINT-153 close Retro · T6 review round 1
