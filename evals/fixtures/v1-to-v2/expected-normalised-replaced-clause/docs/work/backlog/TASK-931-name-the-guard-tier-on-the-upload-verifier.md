---
id: TASK-931
title: "Name the guard tier on the upload verifier"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: manual
state: ready
---

# TASK-931 — Name the guard tier on the upload verifier

## Why

the verifier is the only check that runs before upload

- class: # was "spike" before G2
- tier: (guard — the verifier gates the upload)

## Done when

- [ ] the verifier's tier is declared in its header

## Touches

- scripts/verify-upload.ts

## Assumes

none

## Tracker

none
