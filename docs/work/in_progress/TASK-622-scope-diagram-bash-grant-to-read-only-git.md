---
id: TASK-622
title: "Scope /diagram's Bash grant to read-only git and move its SECURITY.md row (TD-301)"
type: debt
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-167
---

# TASK-622 — Scope /diagram's Bash grant to read-only git and move its SECURITY.md row (TD-301)

## Why
TD-301. `/diagram` grants plain `Bash` but needs only read-only git. SKILL.md's `allowed-tools` lists `Bash` and "read-only git only" is prose, so SECURITY.md lists it under unscoped Bash.

## Done when

- [x] `skills/diagram/SKILL.md` frontmatter `allowed-tools` lists `Bash(git rev-parse *), Bash(git status *)` and no plain `Bash`. ✓ `9a76742a`: line 5 reads `allowed-tools: Read, Glob, Grep, Write, Edit, Bash(git rev-parse *), Bash(git status *)`
- [x] SECURITY.md lists `diagram` in the scoped-Bash row, not the unscoped row, without the "(instructed read-only git only)" note; `last_updated` bumped. ✓ `9a76742a`: `diagram` first in the scoped row, gone from the unscoped row with its note; `last_updated: 2026-11-08`
- [x] Exercised on real input: under only that grant, `git rev-parse HEAD` and `git status --short` both run (transcript or output named). ✓ coordinator probe, Log `build` entry: headless `claude -p` with the T1 tree as plugin dir ran both commands and printed HEAD and `?? g.txt`
- [x] Negative: a `git commit` is not pre-approved by the grant — it falls to the session's permission mode rather than running unasked, showing the scope is real rather than prose. ✓ same probe: `permission_denials` = [`git commit --allow-empty -m probe`], no commit made; the control arm with plain `Bash` ran it (`[master 1b0f33c] probe`)
- [x] CHANGELOG `[Unreleased]` records the grant narrowing; `qa-check` and `bun test` stay green. ✓ `[Unreleased]` bullet in `9a76742a`; QA_FULL off-host 482 pass, 0 fail at `aac43990`; `bun test` 589 pass, 0 fail

## Touches

skills/diagram/SKILL.md · SECURITY.md · CHANGELOG.md (blast radius: one skill's tool grant; consumer sees a narrower grant)

## Assumes

- A scoped `Bash(...)` pair parses in frontmatter, as release-patch's scoped entries show.

## Tracker

TD-301 · SPRINT-166 Log T2 entry
