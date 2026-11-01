---
id: TASK-565
title: "Diagnose why a Codex review task fails to launch on this host while setup reports it ready"
sprint: SPRINT-155
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-565 — Diagnose why a Codex review task fails to launch on this host while setup reports it ready

## Why
Through SPRINT-152 and SPRINT-153 every Codex review launch failed while `codex:setup` reported ready, so each review ran on
a Claude stand-in instead of the owner's Codex review loop. At the close, eight orphaned codex processes (some from 10-19)
were still holding memory. Maintainer tooling, not shipped.

## Done when
- [x] The launch failure is reproduced and its cause named (with the error text). ✓ by owner ruling (SPRINT-155 G2 and T4): not reproducible since the subscription was renewed (setup ready in 3 s, a companion `task` READY in 8 s); cause named from the code, the app-server `initialize`/auth request has no timeout, so an account that could not answer blocked forever; a silent hang, no error text existed
- [x] Either a Codex review runs end to end on this host, or the owner rules the stand-in as the standing reviewer. ✓ `codex exec` (prompt on stdin) ran four reviews (SPRINT-152), five builder checks and three builds (SPRINT-155) end to end on this host; the companion `task` now runs too
- [x] A finished or failed launch leaves no codex process behind. ✓ the standing route `codex exec` leaves none (process snapshot before and after two builds: nothing new); the companion keeps its app-server broker alive after a launch, seven had piled up since 10-19, all stopped; the owner's Codex app and interactive session untouched

## Touches
the local Codex install and companion (maintainer machine only)

## Tracker
SPRINT-153 close Retro
