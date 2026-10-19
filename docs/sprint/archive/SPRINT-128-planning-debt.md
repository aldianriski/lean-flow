---
sprint: 128
slug: planning-debt
epic: EPIC-022
owner: Maintainer
last_updated: 2026-10-18
status: closed
plan_commit: 03ec7bb1
close_commit: d9139c4
gates_signed: G1,G2 @ fc0043b1
update_trigger: sprint execute/close events
---

# SPRINT-128 — Planning Debt

> **Theme:** EPIC-022's fourth and last slice. A Plan's `Layers:` · `Cites:` · `### Tn` lines are read by about eight heading
> regexes, six `Cites:` readers and three token extractors that disagree, and the member resolver drops what it cannot resolve.
> This sprint gives the Plan one parser, moves every TS reader onto it, makes the resolver name its anomalies, retires the Shell
> twins the gate no longer runs, and closes the edge cases that have real occurrences. It closes EPIC-022.

## Scope

**In:** one shared Plan parser + the two Layers checkers (`443`) · the remaining readers onto it (`444`) · a resolver that names
anomalies (`445`) · the Shell twins and the reaper's v1 branch retired (`446`) · the live freeze and declaration edges (`447`).
**Out (deferred):** porting the shipped dispatch preflight to TS (TD-045, retained by design) · the dod-delta cluster (TD-166 · 192 ·
221 · 226 · 231) · gate cost (TD-090 · 165 · 171) · TD-191 · 204 · 125 · 099 · TASK-322 · 366 · 367 · 402.

## Members

- docs/work/todo/TASK-443-one-shared-plan-parser-for-the-layers-checkers.md
- docs/work/todo/TASK-444-move-the-remaining-plan-readers-onto-the-shared-parser.md
- docs/work/todo/TASK-445-member-resolver-names-anomalies.md
- docs/work/todo/TASK-446-retire-the-shell-twins-the-gate-no-longer-runs.md
- docs/work/todo/TASK-447-close-the-live-freeze-and-declaration-edge-cases.md

## Plan

### T1 — One shared Plan parser for the Layers checkers `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/sprint-members.ts` · `scripts/lib/check-layers-completeness.ts` · `scripts/lib/check-layers-observed.ts`
  · `evals/`
  · `docs/work/todo/TASK-443-one-shared-plan-parser-for-the-layers-checkers.md`
  · `docs/work/in_progress/TASK-443-one-shared-plan-parser-for-the-layers-checkers.md`
Depends-on: T4
Cites: `TASK-443` · EPIC-022 Closed-when 7 · ADR-050 (consequential: `conformance.sh` reaches the module) · TD-138 · TD-178 ·
  TD-215 · TD-248 · bare names as the member spells them: `sprint-members.ts` · `check-layers-completeness.ts` ·
  `check-layers-observed.ts`

The parser lives where the resolver already does, so every later reader imports one module.

**Acceptance:** both Layers checkers read Plans only through the shared parser, and give unchanged verdicts on the archived corpus
apart from the named anomalies.

### T2 — Move the remaining Plan readers onto the parser `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-authority.ts` · `scripts/lib/check-sprint-by-reference.ts` · `scripts/lib/sprint-members-cli.ts`
  · `scripts/lib/check-dod-delta.ts` · `evals/`
  · `scripts/lib/check-layers-completeness.ts` · `scripts/lib/check-layers-observed.ts`
  · `docs/work/todo/TASK-444-move-the-remaining-plan-readers-onto-the-shared-parser.md`
  · `docs/work/in_progress/TASK-444-move-the-remaining-plan-readers-onto-the-shared-parser.md`
Depends-on: T1
Cites: `TASK-444` · EPIC-022 Closed-when 7 · TD-199 · TD-189 · bare names as the member spells them: `check-authority.ts` ·
  `check-sprint-by-reference.ts` · `sprint-members-cli.ts` · `check-dod-delta.ts` · `conformance.sh`

Two of these readers are what `conformance.sh` runs, so the proof is the conformance differential, not the reading.

**Acceptance:** every TS Plan reader uses one parser, a `Cites:` mention no longer governs a member, and `conformance.sh .` is
verdict-identical.

### T3 — The member resolver names anomalies `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/sprint-members.ts` · `scripts/lib/check-authority.ts` · `scripts/lib/check-layers-completeness.ts`
  · `scripts/lib/check-layers-observed.ts` · `scripts/lib/check-verify-reaches.ts` · `scripts/lib/check-task-origin.sh`
  · `scripts/lib/sprint-members-cli.ts`
  · `evals/`
  · `docs/work/todo/TASK-445-member-resolver-names-anomalies.md`
  · `docs/work/in_progress/TASK-445-member-resolver-names-anomalies.md`
Depends-on: T1, T2
Cites: `TASK-445` · EPIC-022 Closed-when 7 · TD-188 · TD-190 · TD-198 · `conformance.sh` (reaches the CLI; read only)

It follows the parser work because it edits the same files; the depends-on is ownership, not logic.

**Acceptance:** a duplicate, missing or misplaced member is named by every caller, and today's corpus moves no verdict.

### T4 — Retire the Shell twins the gate no longer runs `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-layers-observed.sh` · `scripts/lib/check-authority.sh` · `scripts/lib/check-layers-completeness.sh`
  · `scripts/night-run.sh` · `scripts/qa-check.sh` · `evals/` · `skills/orchestrator/references/dispatch.md`
  · `skills/orchestrator/references/night-run.md`
  · `docs/work/todo/TASK-446-retire-the-shell-twins-the-gate-no-longer-runs.md`
  · `docs/work/in_progress/TASK-446-retire-the-shell-twins-the-gate-no-longer-runs.md`
Depends-on: none
Cites: `TASK-446` · EPIC-022 Closed-when 7 · TD-049 · ADR-050 #3 · ADR-046 (v1 refused) · ADR-053 (a deletion is unfrozen) ·
  bare names as the member spells them: `check-layers-observed.sh` · `check-authority.sh` · `check-layers-completeness.sh` ·
  `dispatch.md` · `night-run.md`

It runs first: once the twins are gone, no later task has to mirror a Shell copy, and its eval edits overlap theirs.

**Acceptance:** the two Shell twins and the reaper's v1 branch are gone, no prose names them as live, and both gate profiles stay
green.

### T5 — Close the live freeze and declaration edge cases `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/conformance-engine.sh` · `scripts/lib/check-handoff-state.sh` · `scripts/lib/check-research-archive.sh`
  · `scripts/lib/check-sprint-by-reference.ts` · `scripts/lib/check-layers-observed.ts`
  · `skills/orchestrator/references/dispatch.md` · `evals/`
  · `docs/work/todo/TASK-447-close-the-live-freeze-and-declaration-edge-cases.md`
  · `docs/work/in_progress/TASK-447-close-the-live-freeze-and-declaration-edge-cases.md`
Depends-on: T2, T3, T4
Cites: `TASK-447` · EPIC-022 Closed-when 7 · TD-131 · TD-205 · TD-177 · TD-138 (preflight side) · ADR-053 (TD-177's finding) ·
  bare names as the member spells them: `dispatch.md`

Each case has real occurrences; the shipped preflight wording also takes the Codex review.

**Acceptance:** no frontmatter verdict depends on the host's awk, a late member-edit scope-change is caught, a dead `Layers:`
token is named, and the preflight names a column-0 wrap.

## Decisions (pre-locked)

- **D1** — Shared files and their order: `sprint-members.ts`, `check-layers-completeness.ts` go T1 → T3; `check-authority.ts`
  T2 → T3; `check-layers-observed.ts` T1 → T3 → T5; `check-sprint-by-reference.ts` T2 → T5; `dispatch.md` T4 → T5; the waves run T4 → T1 → T2 → T3 → T5, since every task edits `evals/`. New fixtures
  extend existing harnesses; only T4 edits `scripts/qa-check.sh`. `CHANGELOG.md`, `TECH-DEBT.md`, this file, its log and the
  member files are coordinator-owned.
- **D2** — Owner rulings at intake (2026-10-18): the parser covers every TS reader, with the full Tier G bar on the conformance-
  reached parts · retire the observed and authority Shell twins, keep the completeness one as the preflight's parity oracle ·
  TD-045 retained by design · fixed and census-zero rows closed at this promote.

## Assumptions

- **A1** — The consolidation preserves behaviour: today's verdicts are reproduced on all 127 archived plans and every fixture, apart
  from the cases that gain a named finding. *Confirm: T1's and T2's differential runs.*
- **A2** — `check-layers-completeness.sh` sources `layers_tokens` from the observed twin, so it moves before the delete. *Confirm: T4.*
- **A3** — The reaper's v1 branch is unreachable, since v1 trees are refused (ADR-046). *Confirm: T4's G1, before any delete.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-128-planning-debt.md`, created at promote with its `promote` entry first.
> Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `check-layers-observed.sh`, `check-authority.sh`, two opt-in harnesses (deleted) · `check-layers-completeness.sh` · `night-run.sh` · `qa-check.sh` · reaper harnesses | T4 | retire the Shell twins the gate no longer runs, and the reaper's v1 counting | Low | QA_FULL 304/0 · retained v1 must-FAIL |
| `sprint-members.ts` (`parsePlan`) · `check-layers-completeness.ts` · `check-layers-observed.ts` · their tests and fixtures | T1 | one Plan parser; column-0 anomaly; basename rule; own-sprint attribution | **Med** (a module conformance.sh reaches) | 145-Plan differential 0 diffs · seeds + re-seed · Codex R1→R2 |
| `check-authority.ts` · `check-sprint-by-reference.ts` · `sprint-members-cli.ts` · `check-dod-delta.ts` (+ both Layers checkers) | T2 | the remaining readers on the parser; `Cites:` governs by leading run | **Med** (conformance-reached readers) | conformance A/B identical · 283-Plan agreement · Codex R1→R2 |
| `sprint-members.ts` (resolver) · the five callers incl. the CLI · `check-task-origin.sh` | T3 | the resolver names every anomaly; plain `resolveMembers` deleted | **Med** (conformance-reached resolver) | zero-line old-vs-new · conformance identical · Codex R1→R2 |
| `conformance-engine.sh` · `check-handoff-state.sh` · `check-research-archive.sh` · `check-sprint-by-reference.ts` · `check-layers-observed.ts` · `dispatch.md` preflight | T5 | CRLF-safe readers; member-edit ordering; dead tokens; preflight names a wrap | **Med** (engine + shipped preflight) | CRLF twins via awk shim · census 0 late of 127 · Codex R1→R2 |
| `TECH-DEBT.md` (15 deleted, 8 closed at promote) | promote | §11 retention + owner-approved closures | Low | S10.TDAGING · S11.TDDELETE PASS |
| `docs/QA.md` · 4 manifests · README footer · `CHANGELOG.md` · `docs/changelog/CHANGELOG-2.7.0.md` | close | doc-freshness; release 2.9.0 | Low | lockstep · rotation diffed verbatim |

## Retro

**Retrieval check** — yes. **L-224** recurred in its log-write mode: a scope-change entry named `conformance.sh`, and the immediate
`--scope-change` re-run caught it in seconds, so the habit held where the tool (tick-box) does not reach. **L-186** recurred
three times: Codex caught a non-task `###` heading (T1, T2) and a merge-commit path (T5). The 145–283-Plan differentials could not,
because the real corpus contains none of those shapes. A differential proves preservation over the shapes that exist, never over
the ones that might.

**Cost** — coordinator + 5 builders, each with one bounded retry, + 1 recon + 1 Codex reviewer over 10 rounds (`gpt-6-astra`).
Sub-agent spend ≈ 1.5M tokens (T4 170k · T1 233k · T2 298k · T3 243k · T5 290k · recon 194k · Codex ~60k) for 5 members ≈ 300k per
member. That is above the 1.0–1.4M estimate, mostly the second rounds on T1–T3 and T2's long harness runs. Five `QA_FULL` runs on the
VPS (304/0 each); every member's consequential part was re-seeded independently by the coordinator.

**Worked**
- Running the deletion (T4) first meant no later task mirrored a Shell copy; the preflight's HALT at promote forced that order.
- Every builder proved behaviour preservation by an old-vs-new differential over the archived corpus. Every seed was checked to have
  LANDED (`cmp`), which caught two of the coordinator's own seeds that had not, before they could pass for proof.
- Census-first rulings kept scope honest: 7 TD rows closed at promote as fixed or census-zero, and one Codex point (multi-`Cites:`
  lines, 0 of 505 blocks) went to TD instead of a third round.

**Friction**
- A "byte-equivalent" move wrote a literal newline inside a `printf` format (T4). Only the coordinator's byte check caught it.
- The T3 builder deleted another project's `/tmp/edit1.py` before reusing the name; it is unrecoverable from here.
- A bare `cd` into a worktree had already bitten at SPRINT-127; this sprint every worktree was inspected with `git -C` and absolute
  paths, and no session move recurred.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- L-236 (new, count 1): dispatched builders share `/tmp` with other projects, so a brief must name a unique temp prefix and forbid
  deleting anything the agent did not create. Sightings bumped: L-224 · L-186.

**Owner actions**
- Push `main` (releases 2.8.0 and 2.9.0 are committed, not pushed).
- workdoo: bump its pinned lean-flow to 2.9.0 / spec 0.18.0 (finding F2 of SPRINT-127).
- Agent worktrees left under `.claude/worktrees/`: this sprint's T2 · T3 · T4 · T5 (locked by the harness, or holding line-ending
  noise only, all merged), plus the 8 older ones kept for review at SPRINT-127.
