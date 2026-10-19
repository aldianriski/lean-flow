---
sprint: 129
slug: honest-review-and-tests
owner: Maintainer
last_updated: 2026-10-19
status: closed
plan_commit: b1712732
gates_signed: G1,G2 @ bed7b10f
close_commit: e3c8c90
update_trigger: sprint execute/close events
---

# SPRINT-129 — Honest Review and Tests

> **Theme:** four micro keepers from the 2026-10-19 reference re-scans (mattpocock/skills scan 5 · obra/superpowers re-scan).
> The reviewer judges against the host repo's real standards and says what it set aside; a forced red has to prove its
> mutation landed; and a `/tdd` slice is done only when the whole suite passes. Each closes a gap on the consumer path, where
> the rule existed only in the maintainer's CLAUDE.md or nowhere.

## Scope

**In:** standards docs in the review brief (`451`) · a declined-to-judge list and spec-silence rule (`452`) · forced-red proof in
`/diagnose` (`453`) · the whole suite green before a `/tdd` slice is done (`454`).
**Out (deferred):** TASK-366 · 367 · 402 (not ready) · TD-090 (re-routed to TASK-367 at this promote) · the held G2 builder check
and loop-ladder table (`docs/research/brainstorming-adaptation.md` § Re-scan · `docs/research/loopcraft-adaptation.md`).

## Members

- docs/work/todo/TASK-451-give-the-review-brief-the-host-repos-standards-docs.md
- docs/work/todo/TASK-452-make-the-reviewer-list-what-it-declined-to-judge.md
- docs/work/todo/TASK-453-in-diagnose-count-a-forced-red-only-once-proven-landed.md
- docs/work/todo/TASK-454-in-tdd-require-the-whole-suite-green-before-a-slice-is-done.md

## Plan

### T1 — Give the review brief the host repo's standards docs `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md`
  · `docs/work/todo/TASK-451-give-the-review-brief-the-host-repos-standards-docs.md`
  · `docs/work/in_progress/TASK-451-give-the-review-brief-the-host-repos-standards-docs.md`
Depends-on: none
Cites: `TASK-451` · `docs/research/mattpocock-scan5.md` K2 · L-015

The Standards axis already defers to documented repo standards; this makes the brief carry them, so the bounded-brief rule holds
and an adopter's CONTRIBUTING or style guide is actually read.

**Acceptance:** a real review brief built under the new wording names the host repo's standards docs, and the reviewer's
Standards axis cites them.

### T2 — Make the reviewer list what it declined to judge `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/review-scoping.md`
  · `docs/work/todo/TASK-452-make-the-reviewer-list-what-it-declined-to-judge.md`
  · `docs/work/in_progress/TASK-452-make-the-reviewer-list-what-it-declined-to-judge.md`
Depends-on: T1
Cites: `TASK-452` · `docs/research/brainstorming-adaptation.md` § Re-scan K3

What a reviewer sets aside is currently invisible; a stated list separates "checked and fine" from "not looked at". Runs after T1
because both edit the same file (D1).

**Acceptance:** a real review under the new wording returns a declined-to-judge list (empty stated, not omitted) beside the two
axes, and its Spec axis treats spec silence as no licence.

### T3 — In `/diagnose`, count a forced red only once proven landed `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/diagnose/SKILL.md`
  · `docs/work/todo/TASK-453-in-diagnose-count-a-forced-red-only-once-proven-landed.md`
  · `docs/work/in_progress/TASK-453-in-diagnose-count-a-forced-red-only-once-proven-landed.md`
Depends-on: none
Cites: `TASK-453` · `docs/research/mattpocock-scan5.md` K1 · L-187

Moves the maintainer's seeded-break rule onto the consumer path, in the one skill where reverting a fix to watch it go red is the
normal move.

**Acceptance:** `/diagnose` Phase 5 carries the landed-mutation rule, and one real forced red is shown landed by a diff against a
pristine copy before it is counted.

### T4 — In `/tdd`, require the whole suite green before a slice is done `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/tdd/SKILL.md` · `skills/tdd/references/test-standard.md`
  · `docs/work/todo/TASK-454-in-tdd-require-the-whole-suite-green-before-a-slice-is-done.md`
  · `docs/work/in_progress/TASK-454-in-tdd-require-the-whole-suite-green-before-a-slice-is-done.md`
Depends-on: none
Cites: `TASK-454` · `docs/research/brainstorming-adaptation.md` § Re-scan K4

`/tdd` never asks for the whole suite; only `/diagnose` and a Review-time suggestion do. Once per slice keeps big suites usable.

**Acceptance:** `/tdd` gates slice completion on the whole suite passing with every failure named, adds the name-the-break
check, and points to `skills/tdd/references/test-standard.md` § Regression gate instead of restating it.

## Decisions (pre-locked)

- **D1** — Shared files and their order: `review-scoping.md` is T1 → T2 (T1 owns it first). Waves: T1 · T3 · T4, then T2.
  `CHANGELOG.md`, `TECH-DEBT.md`, this file, its log and the member files are coordinator-owned; the CHANGELOG entry is written
  once, at the close release, and each member's CHANGELOG box ticks against that commit.
- **D2** — Owner rulings at intake (2026-10-19): the coordinator supplies standards docs in the brief, the reviewer never searches
  the repo · forced-red proof lands in `/diagnose` only · `/tdd` runs the whole suite once per slice, not every cycle.
- **D3** — Review: every task is a shipped skill change, so each runs the Codex review → fix → re-review loop until clean, on top
  of its Tier P read-through.

## Assumptions

- **A1** — Wording alone changes builder and reviewer behaviour. *Confirm: each task's one real exercise (L-007).*
- **A2** — `/diagnose` and `/tdd` SKILL.md stay within the ~140-line cap after the additions (94 and 98 lines today). *Confirm: the
  doc-caps leg.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-129-honest-review-and-tests.md`](logs/SPRINT-129-honest-review-and-tests.md), created at
> promote. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/review-scoping.md` | T1 · T2 | the brief carries the host's standards docs; the report adds a Declined-to-judge list; spec silence is no licence; all three ride in the injected reviewer prompt | Low | Codex scoped review + adversarial floor; real exercise on the wave-1 and T2 reviews |
| `skills/diagnose/SKILL.md` | T3 | a forced red counts only once a `cmp` against pristine proves it landed | Low | doc-caps 98 ≤ 140; a real seeded mutation on `tick-box.ts`, cmp-proven, restored |
| `skills/tdd/SKILL.md` · `skills/tdd/references/test-standard.md` | T4 | a slice is done only when the whole suite passes, failures named; name-the-break checklist line; the regression gate points to it | Low | doc-caps 104 ≤ 140; a real cycle + whole `bun test` run, every failure named |
| `CHANGELOG.md` · 4 manifests · `README.md` footer · `docs/changelog/CHANGELOG-2.8.0.md` | close | release 2.10.0 MINOR; v2.8.x rotated (§11) | Low | manifest lockstep 4/4; system verify 301/0 |

## Retro

**Retrieval check** — yes, a miss. **L-225** (merged into **L-151**) already recorded that a review logged in prose leaves no
`review · Tn` record and the gate reads that silence as "review owed" (SPRINT-114, 7 fails). This sprint repeated it exactly: four
Codex reviews logged in prose, and system verify went 300/4 until the structured lines were appended. The rule was promoted and
in reach; the review step still did not write the line, because the record is a separate act from the review.

**Cost** — coordinator + 5 Sonnet builder dispatches (T1 · T2 · T3 · T4, with one bounded retry each on T2 and T4) + 1 Codex reviewer
over 5 review rounds (`gpt-6-astra`). Builder spend ≈ 260k tokens (T1 57k · T2 57k · T3 67k · T4 73k) for 4 S members ≈ 65k per
member; the Codex rounds were small (a few k each). Two `QA_FULL` runs on the VPS (the first 300/4, the second 301/0, 111 s each)
after the local run was killed for low memory.

**Worked**
- The adversarial floor earned its place: T1 · T2 · T3 each passed first review with 0 findings, and the assume-guilty pass found the
  one real defect — the new reviewer rules were absent from the injected prompt (shipping ≠ wiring, L-020).
- The rule T3 ships caught a defect during its own exercise: a `sed` mutation "landed" but stripped every CR from the file, and the
  `cmp` proof exposed it before any harness ran (L-187).
- T4's rule surfaced real state when exercised: the whole `bun test` run named TD-154 (pre-existing, re-confirmed on main) instead of
  letting a focused green stand in for the suite.

**Friction**
- Review records written as prose (above) cost one extra VPS gate run.
- The local system verify was reaped for low memory; the VPS route via a git bundle worked without pushing.
- Thirteen older agent worktrees remain under `.claude/worktrees/` from earlier sessions (TD-246).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- No new entry. Sightings: L-151 (prose review records, its L-225 family) · L-020 (unwired prompt, caught by the floor) · L-187 (cmp
  caught a collateral mutation).

**Owner actions**
- Push `main` (release 2.10.0 and this sprint are committed, not pushed).
