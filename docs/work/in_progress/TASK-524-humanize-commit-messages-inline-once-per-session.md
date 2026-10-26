---
id: TASK-524
title: "Humanize commit messages inline, reading the catalogs once per session instead of spawning a child per commit"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-144
depends-on: []
---

# TASK-524 — Humanize commit messages inline, reading the catalogs once per session

## Why
TD-278: the embedded humanizer child reads ~49 KB of pattern catalogs per call, about 73k sub-agent tokens per commit
message, and in SPRINT-143 15 of 15 passes returned "unchanged" (~1.1M tokens, no edit). ADR-053 reason: measured cost.
Owner ruling at intake: commit messages move to the existing inline path, catalogs read once per session; PR bodies and
documents keep the child pass.

## Done when
- [x] `embedded.md` § Commit messages and PR bodies routes commit messages through the inline path: the caller reads the ✓ 9ece808f: embedded.md § Inline path + Route bullet; callers defer (grep); Codex R1 item 1-2 CLEAR
      three catalogs once per session (again after a compaction) and keeps the fact list and check; PR bodies and
      documents keep the child pass.
- [x] The retained `evals/fixtures/humanizer/fact-keep` sample keeps every fact over 3 inline runs (L-252). ✓ 3 inline runs at 9ece808f kept 11/11 facts each; run 1 added an actor (TD-274, owner ruling); NOTES f3ead434, 7c3da633
- [ ] The next sprint's commit messages spawn no humanizer child; the cost per commit is recorded against the ~73k
      baseline and TD-278 is resolved with that number.
- [x] CHANGELOG `[Unreleased]` line. ✓ 9ece808f: CHANGELOG [Unreleased] SPRINT-144 bullet

## Touches
`skills/humanizer/references/embedded.md` · `CHANGELOG.md` · `TECH-DEBT.md` (TD-278 resolution)

## Assumes
- Every caller (diagnose, lean-doc-generator, orchestrator dispatch.md, prototype, triage) defers to embedded.md's
  section, so none needs an edit; G2 confirms by grep.

## Tracker
TD-278 (SPRINT-143 close Retro).
