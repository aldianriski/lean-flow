---
sprint: 167
slug: grant-scope-and-token-room
owner: Maintainer
last_updated: 2026-11-08
status: active
plan_commit: none
update_trigger: sprint execute/close events
---

# SPRINT-167 — Grant Scope and Token Room

> **Theme:** two small debts left by SPRINT-166. `/diagram` asks for plain `Bash` though it needs only read-only git, and the always-loaded context has 3 tokens of headroom. Both are fixed without a release, a push or a budget raise.

## Scope

**In:** narrow `/diagram`'s Bash grant and move its SECURITY.md row (TASK-622, TD-301); replace CONTEXT.md text its satellites already hold with pointers (TASK-623, TD-302).
**Out (deferred):** any release or push; raising the token budget; changing CONTEXT.md § Gates; TASK-621, which sits outside the sprint.

## Members

- docs/work/todo/TASK-622-scope-diagram-bash-grant-to-read-only-git.md
- docs/work/todo/TASK-623-win-back-token-budget-by-deduping-context-md.md

## Plan

### T1 — Scope /diagram's Bash grant to read-only git `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/diagram/SKILL.md` · `SECURITY.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-622 · TD-301
A prose "read-only git only" is not a grant, and SECURITY.md lists the skill as unscoped. Scoping to the two git commands the skill names makes the limit real and moves its row.

**Acceptance:** under only the scoped grant, `git rev-parse HEAD` and `git status --short` run, a `git commit` is not pre-approved, and SECURITY.md lists `diagram` as scoped.

### T2 — Replace CONTEXT.md duplicates with pointers `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `.claude/CONTEXT.md`
Depends-on: none
Cites: TASK-623 · TD-302 · TD-006 · L-008
Three passages (`overnight` name, Continuation contract, Authority) restate facts that `orchestrator/SKILL.md` and `night-run.md` already hold. Pointers return room without touching the budget file or § Gates, which keeps TASK-621's measuring basis stable.

**Acceptance:** `check-doc-caps.ts` prints token-budget N ≤ 12440 against 12691, the budget file is unchanged, § Gates has no diff, and each removed passage's phrase greps to the section its pointer cites.

## Owner-action checklist
none

## Decisions (pre-locked)
- **D1** — Order T1 then T2; no dependency. Disjoint files, so no shared-file rule.
- **D2** — No release, no push (owner constraint). The CHANGELOG-visible change goes under `[Unreleased]`.
- **D3** — TASK-623 must not change CONTEXT.md § Gates, and `scripts/lib/token-budget.txt` stays untouched.
- **D4** — TASK-623 review cap is 2 rounds. A candidate outside § Gates beyond the three passages goes back to the owner.

## Assumptions
- **A1** — A scoped `Bash(git rev-parse *), Bash(git status *)` pair parses in frontmatter, as release-patch's `Bash(git diff *)` entries show (`skills/release-patch/SKILL.md:5`). *Confirm: T1's real-input box.*
- **A2** — The three CONTEXT.md passages are about 830 tokens, so a 250-token win is reachable. *Confirm: T2's check-doc-caps run.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-167-grant-scope-and-token-room.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

Written at close.
