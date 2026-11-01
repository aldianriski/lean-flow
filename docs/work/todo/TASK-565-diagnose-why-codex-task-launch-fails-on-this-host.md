---
id: TASK-565
title: "Diagnose why a Codex review task fails to launch on this host while setup reports it ready"
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
- [ ] The launch failure is reproduced and its cause named (with the error text).
- [ ] Either a Codex review runs end to end on this host, or the owner rules the stand-in as the standing reviewer.
- [ ] A finished or failed launch leaves no codex process behind.

## Touches
the local Codex install and companion (maintainer machine only)

## Tracker
SPRINT-153 close Retro
