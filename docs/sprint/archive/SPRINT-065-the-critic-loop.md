---
sprint: 065
slug: the-critic-loop
epic: EPIC-002
owner: Maintainer
last_updated: 2026-08-15
status: closed
plan_commit: a94d19b
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-065 — The Critic Loop

> **Theme:** the first build from `docs/research/gauntlet-loop-delta.md`. That scan found six of eight
> gauntlet-loop mechanics already matched — four of them more tightly specified here than in the source —
> and exactly two keepers. This sprint takes both: what the critic measures against (T1), and feeding
> its worst finding back to the builder (T3). T2 is unrelated by subject and closes EPIC-002's last
> condition, which is a one-line ruling rather than a build.

## Scope

**In:** rule what the Spec axis compares against (T1) · rule EPIC-002's headroom condition and close the
epic if it holds (T2) · wire the worst-finding-per-axis into a bounded retry, attended modes only (T3).

**Out (deferred):** **TASK-203** — whether the retry may run **unattended**. That is the ADR-grade
charter fork (a critic ruling "not good enough, retry" is a *decision*, and the unattended charter is
execute-only), and the research doc marks it a `/council` candidate. Promoting it alongside its own
prerequisites would invite deciding it under momentum. · TASK-198 (EPIC-003) · TASK-188 (still
`blocked`; opportunistic trigger, L-111).

**Epic note:** only **T2** is EPIC-002-tracked. T1 and T3 are EPIC-004-shaped, from the gauntlet
research. Named so the close-time rollup does not over-claim.

## Plan

### T1 — Rule what the critic's Spec axis compares against `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/orchestrator/references/review-scoping.md` · `.claude/CONTEXT.md` ·
        `skills/lean-doc-generator/templates/SPRINT.md.template`
Depends-on: none
Cites: `docs/research/gauntlet-loop-delta.md` · `scripts/qa-check.sh`
Today the Spec axis measures work against the task's own `done-when` — written by the same pipeline that
built it. External comparands already exist, but only for **gates** (a retained must-FAIL fixture failing
with its named finding, L-058) and for **behaviour** (`/run` + `/verify`). The Spec axis is the unmatched
one.

**Acceptance:** a recorded ruling on whether a task gains an external `reference:` comparand, or whether
`done-when` plus the retained must-FAIL fixtures already supply one.

**DoD:**
- [x] **The null answer tested first, not last** — "add a field" is the tidy move and L-091 says test the
      hypothesis before building on it
- [x] The doc-vs-template hypothesis checked against this repo's actual substrate: a doc rendered by
      `/lean-doc-generator` against its own template may already *be* the external comparand (L-016)
- [x] Ruling recorded; if it adds a field, § Task entry shape is edited and the CONTEXT.md cost is
      stated (132/150 measured at promote — 18 lines free, no cap blocker)
- [x] Whatever is ruled, `review-scoping.md`'s Spec-axis paragraph says what the axis compares against

### T2 — Rule EPIC-002's headroom condition, the last thing holding the epic open `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/epic/EPIC-002-make-room.md` · `.claude/CONTEXT.md` · `docs/epic/INDEX.md`
Depends-on: T1 (owns `.claude/CONTEXT.md` — see D1)
Cites: `.claude/CLAUDE.md`
Conditions 2, 3 and 4 are met. Condition 1 reads "`.claude/CLAUDE.md` and `.claude/CONTEXT.md` each carry
≥15% headroom": `.claude/CLAUDE.md` is **63/80 (21%) ✓**, `.claude/CONTEXT.md` **132/150 (12%)**, held at
150 by the SPRINT-063 T1 ruling
that a flat percentage is the wrong instrument for a file whose growth is measured at 0.83 lines/sprint
and whose diet pass already found nothing removable (ADR-017).

**Acceptance:** condition 1 is either ticked with its reasoning, or re-worded to express what the epic
actually wants and then judged against that — recorded either way, never left as a silent hold.

**DoD:**
- [x] **Do not close the gap by trimming `CONTEXT.md` five lines to make a number go green** — §2's
      Growth rule names that as the tell, and ADR-017 already ran that pass
- [x] Ruling recorded in EPIC-002 § Closed when, with its reasoning inline
- [x] All four conditions end `[x]` — **archival delegated to `/lean-doc-generator close`** (§11
      archives only when every member sprint has closed, and this sprint is itself an EPIC-002 member;
      scope-change logged 2026-08-14, owner-ruled)
- [x] Else-branch (epic stays open) — antecedent false under the same ruling: all four conditions are
      `[x]`, nothing stays open to state a condition for

### T3 — Wire the worst-finding-per-axis into a bounded builder retry `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/SKILL.md` · `evals/`
Depends-on: T1 (owns `review-scoping.md`, and rules what the retry measures against — see D1)
Cites: `docs/research/gauntlet-loop-delta.md`
**Wiring, not a new capability.** `review-scoping.md` line 30 already ends a pass with "the single worst
finding **per axis**, kept apart" — measured at promote, and **nothing consumes it**. Review is terminal:
findings go to the owner. That is the L-020 shape, a computed value never wired to a consumer.

**Acceptance:** a scoped reviewer's single worst finding per axis is handed back to the builder for a
bounded retry, re-reviewed, and the outcome logged.

**DoD:**
- [x] Retry is **bounded** and the ceiling is stated, not implied — **one retry per review pass,
      total** (owner-ruled at the residual grill)
- [x] **Attended modes only** (`quick` · `mvp` · `sprint-bulk` with a human present) — unattended is
      TASK-203 and must not be smuggled in here — the section says "unattended: never" and defers
      the question to TASK-203 by name
- [x] Exercised once on **real input** (T3's own diff — both axes' violations handed back, fixed,
      re-review cleared) and once on input that **must FAIL** with its named finding
      (L-058); fixtures **retained** (TD-012) — `evals/fixtures/revise-loop/`
- [x] Home is `references/` (uncounted, ADR-006) with a hook from SKILL.md § Review — 102/140 at promote,
      83/140 measured after the edit

## Owner-action checklist
- [x] Reinstall the plugin — session skills have run at **1.34.0** against a repo now at **1.38.0**
      across three sprints (L-021). Every skill has been diffed against repo source before use and no
      stale procedure was followed, but that is a workaround holding, not the gap closing.
      *Done: the close session's `/prime` freshness row reads `1.38.0 base-dir == 1.38.0 repo → fresh`
      (2026-08-15); the close ran on fresh procedure as the deferral ruling required.*

## Decisions (pre-locked)

- **D1 — Ownership: T1 owns `review-scoping.md` *and* `.claude/CONTEXT.md`.** T3 shares the first, T2 may
  touch the second, so both sequence after T1. Commit order T1 → T2 → T3 is also dependency order; if it
  changes, stage shared files with `git add -p` and verify `git diff --cached` (L-042). **→ no ADR.**
- **D2 — T1 gates T3's content, not just its order.** What the retry measures against is T1's ruling, so
  building T3 first would hard-code an answer T1 has not made. **→ no ADR.**
- **D3 — The unattended question is out of scope by decision, not by oversight.** TASK-203 stays in the
  Backlog. A critic ruling "retry" is a decision and the unattended charter is execute-only; that fork
  is ADR-grade and gets its own sprint. **→ ADR expected there, not here.**

## Assumptions

- **A1** — `review-scoping.md` computes "the single worst finding per axis" (line 30) and **nothing
  consumes it**. *Confirm: measured at promote 2026-08-14 — one occurrence, in the Standards-vs-Spec
  section; zero occurrences of retry/comparand/`reference:` in the file.*
- **A2** — Destinations have room: `CONTEXT.md` **132/150**, `orchestrator/SKILL.md` **102/140**,
  `review-scoping.md` 99 lines (a reference — uncounted, ADR-006). **No cap blocks any task here**, and
  TASK-196's cap work shipped in SPRINT-063, so its old caveat is discharged. *Confirm: measured at
  promote 2026-08-14.*
- **A3** — EPIC-002 conditions 2, 3 and 4 are `[x]`; only condition 1 is open. *Confirm:
  `check-epic-archive.sh` reports "correctly live (status 'active', 1 of 4 condition(s) open)".*
- **A4** — `L-113` was promoted at this promote (→ `CLAUDE.md` § Behavioral Guidelines) and collapsed;
  `TD-052` had its first aging re-review and is held with an unblock condition. No other `L-NNN` is
  promotable — every remaining active entry sits at `count: 1`, verified by two agreeing queries.
  *Confirm: governance review, 2026-08-14.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-065-the-critic-loop.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.
>
> **It is coordinator-owned** (SPRINT-064 T3): a dispatched agent returns its entry in its report and
> the coordinator appends. `complete` is a **reserved run-level event** — use `progress` for a task
> (TD-055).

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/review-scoping.md` | T1 | Spec axis gains a **comparand ladder** (template · must-FAIL fixture · `check-*.sh` named finding · `Cites:`), with `done-when` demoted to a fallback that must announce itself — the axis was measuring against a criterion its own pipeline wrote | low | `qa-check.sh` |
| `skills/lean-doc-generator/templates/SPRINT.md.template` | T1 | `Cites:` documented as optional-but-load-bearing (rung 4) — it was in real use across 17 of 65 sprints while defined nowhere; the preflight's deliberate exclusion is stated inline so a `Layers:` path is not parked there | low | `qa-check.sh` |
| `docs/sprint/logs/SPRINT-065-the-critic-loop.md` | T1 | Execution Log created lazily at first entry (ADR-014) | low | `check-sprint-log-layout` |
| `docs/epic/EPIC-002-make-room.md` | T2 | Condition 1 re-worded to **sprints of growth** (a percentage misreads a 0.83 lines/sprint file — ADR-017's prior ruling applied) and judged: both SSOT files ≈ 20–21 sprints of headroom, all four conditions `[x]`; archival deferred to close (§11 member-sprint rule) | low | `check-epic-archive.sh` |
| `skills/orchestrator/references/review-scoping.md` | T3 | § The revise loop — the worst finding per axis now feeds **one bounded builder retry** (one per pass, attended only, auto-fire on a concrete violation, outcome logged as a `progress` entry); closes the L-020 gap where the computed value had no consumer | med | fixture legs 1+2 (`evals/fixtures/revise-loop/`) |
| `skills/orchestrator/SKILL.md` | T3 | Two-line hook from § Review to the revise loop (83/140 after edit) | low | self-review |
| `evals/fixtures/revise-loop/` | T3 | Retained must-FAIL fixture — planted violation per axis, scripted-partial builder recipe; exercised in-session, both legs held (L-058 · TD-012) | low | the exercise itself |

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?
One miss: T2's box 3 was written at promote asserting the epic archival could happen *inside the
task*, contradicting §11's member-sprint rule — readable then, read only after the tick. Surfaced as
a `scope-change`, owner-ruled, filed as **L-121**. Against that, four promoted rules fired as
designed: the L-113 cross-check caught the bare-checker silence · CLAUDE.md (c) caught the wrapper's
exit-0 over `QA_EXIT=1` · L-100 handled the mid-task `Layers:` correction · L-091 moved T1 off the
tidy answer before anything was built on it.

**Cost** — inline, one coordinator session plus this deferred close session (owner-ruled: close on
fresh procedure after reinstall). Dispatches only for T3's exercises: two scoped `sonnet` reviews,
one scripted-partial `haiku` builder, one `sonnet` re-review. No worktrees — D1 ruled sequential.

**Worked** — null-answer-first (L-091) flipped T1's outcome: recon found `Cites:` in live use across
17 of 65 sprints, defined nowhere — the field the tidy answer would have added already existed. The
revise loop's first genuine firing caught two real violations in its own diff (TD-055's trap · the
L-057 family). Both fixture legs held (L-058), including catching an accidental third violation.

**Friction** — two silent-pass shapes inside one task: a background wrapper reporting exit 0 over
`QA_EXIT=1`, and a bare `check-layers-observed.sh` exiting 0 with no output having checked nothing
(→ **TD-056**). T2's structurally untickable DoD pair (→ **L-121**).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-121** filed: a DoD box that
performs a later phase's work is untickable by construction; never write two mutually exclusive
branches as two boxes — `/prime` counts both.
