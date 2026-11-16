---
sprint: 180
slug: humanizer-keeps-infra-terms-english
owner: Maintainer
last_updated: 2026-11-16
status: active
plan_commit: 4579e335
update_trigger: sprint execute/close events
---

# SPRINT-180 — Humanizer Keeps Infra Terms in English

> **Theme:** The `/humanizer` Indonesian catalog leaves ordinary infra and process words (gate, branch, window, secret,
> container) open to word-for-word translation, and the bnpt-68 owner rejected a deck twice for it. This sprint widens
> the one existing domain-terms rule, adds an optional host-glossary override, and proves both on a synthetic fixture.
> It is skill work, so ADR-053's freeze does not apply. It is also the dispatch trial's named sprint.

## Scope

**In:** TASK-672.
**Out (deferred):** every other backlog item (TASK-402, 489, 668 and 671 are blocked; 507 and 523 need info). TASK-671
rules the trial cells on this sprint's numbers, so it follows this sprint's close. Also out: any new guard, checker or
ledger field, an `embedded.md` edit, and the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-672-indonesian-infra-text-uses-english-term-not-calque.md

## Plan

### T1 — Widen the domain-calque rule and add the optional host-glossary route `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/patterns-id.md` · `skills/humanizer/SKILL.md` · `README.md` · `CHANGELOG.md` · `evals/fixtures/humanizer/domain-calque/`
Depends-on: none
Cites: TASK-672, TASK-525, `skills/humanizer/references/embedded.md`, `skills/humanizer/references/patterns-lf.md`, `evals/fixtures/humanizer/term-of-art/`, `embedded.md`, `patterns-lf.md`, `.claude/CONTEXT.md`, `CONTEXT.md`, `lean-doc-generator/templates/CONTEXT.md.template`, `term-of-art/NOTES.md`
One rule in its one existing home covers infra and process words, with an optional host glossary that wins only for
terms it names. The fixture is synthetic and fails on the baseline.

**Acceptance:** the rule is in the Indonesian catalog and reaches every catalog path with no caller edit. Three of three runs
fix 8 of 8 seeds and both `kunci` seeds with zero leftovers, the baseline fails the sample, and the `term-of-art` fixture still passes 3 of 3.

## Owner-action checklist

- [ ] Push v2.24.0 (committed, unpushed; owner-reserved).

## Decisions (pre-locked)

- **D1** — TASK-672 is the only member; no other backlog item is ready.
- **D2** — This sprint is the dispatch trial's named sprint: every dispatch adds a Log row (at most 6 strongest-tier; 2 used before promote).
- **D3** — The task commits as `sprint(180) T1: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(180):`.
- **D4** — The build route, the baseline sha convention and the 11 G2 notes in the task's Assumes are settled at G2, in the member file.

## Assumptions

- **A1** — The fixture directory name `domain-calque/`. *Confirm: G2.*
- **A2** — `skills` is byte-identical between `3e31706d` and `plan_commit`. *Confirm: `git diff` at the build.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-180-humanizer-keeps-infra-terms-english.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. -->
