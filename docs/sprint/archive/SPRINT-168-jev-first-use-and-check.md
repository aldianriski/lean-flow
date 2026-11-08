---
sprint: 168
slug: jev-first-use-and-check
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-08
status: closed
plan_commit: 70eb5261
gates_signed: G1,G2 @ c201b8a9
close_commit: e164151e
update_trigger: sprint execute/close events
---

# SPRINT-168 — First Jev Use, and the EPIC-024 Check

> **Theme:** the first step of bringing Jev in (map the use cases, then one advisory script that judges Done-when boxes), plus review of the nine leftover agent worktrees. It is also the check D12 asks for: the first real sprint on `main` with rows 1 and 2 landed, read for any gate failure traced to them before row 4 starts.

## Scope

**In:** the Jev use-case map and API facts (TASK-625) · `scripts/jev-done-when.ts` with a retained fixture and one real run (TASK-626) · a ruling on each of the nine worktrees (TASK-624) · the D12 check read at close.
**Out (deferred):** Jev in `/triage`, `/insights`, A/B judging, router or watcher roles (TASK-627 to 629, blocked) · any release or push · putting the script in the gate.

## Members

- docs/work/todo/TASK-624-review-the-nine-leftover-agent-worktrees.md
- docs/work/todo/TASK-625-map-jev-use-cases-against-lean-flow-stages.md
- docs/work/todo/TASK-626-add-a-jev-done-when-judge-script.md

## Plan

### T1 — Map Jev use cases and settle the API facts `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/jev-use-cases.md`
Depends-on: none
Cites: TASK-625
The first Jev use needs its call facts confirmed and a ranked shortlist judged by the delta over what lean-flow already has (L-017).

**Acceptance:** the research doc maps every use to a stage and an existing surface, ranks the remainder, and records the API facts with a source URL each.

### T2 — Add the Done-when judge script `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `scripts/jev-done-when.ts`, `test/fixtures/`, `evals/run-emitter-column-fixtures.ts`
Depends-on: T1
Cites: TASK-626, TASK-625, `docs/research/jev-use-cases.md`
An advisory maintainer instrument outside the gate. Tier G (other): one must-FAIL fixture plus one run on the real task files; G2 review-round cap 2.

**Acceptance:** the fixture run exits non-zero naming UNOBSERVABLE and NEGATIVE-VAGUE with the control box passing, and one run over the real task files is recorded with its spend.

### T3 — Rule on the nine leftover worktrees `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/work/in_progress/TASK-624-review-the-nine-leftover-agent-worktrees.md`
Depends-on: none
Cites: TASK-624, `.gitignore`, `scripts/lib/check-layers-observed.ts`, `.claude/worktrees/qa-t4.out`, `.claude/worktrees/red.txt`
Nine agent worktrees hold uncommitted work; each sprint fan-out pays a ruling until someone reviews them. No tracked file changes.

**Acceptance:** each worktree has a recorded ruling and nothing uncommitted is discarded without one naming it.

## Decisions (pre-locked)

- **D1** — Every session in this sprint runs with `--plugin-dir D:\Project\lean-flow`, confirmed by the `/prime` `Skills:` row reading "live checkout". The installed cache holds the released 2.21.0, not `main`, and rows 1 and 2 of EPIC-024 are on `main` unreleased, so only a live checkout runs what the check is about. Owner ruling, 2026-11-08.
- **D2** — This sprint is the D12 check. It passes when no close-time gate failure traces to rows 1 and 2. The verdict goes in the close Retro and in this sprint's § Member sprints row on EPIC-024 ("gate failures traced to rows 1 and 2: N"). No extra task. Owner ruling, 2026-11-08.
- **D3** — Tier G (other) for T2: one must-FAIL fixture, a control box, one run on the real task files. G2 review-round cap 2. The 5 USD Jev cap is held by `--budget-usd` plus a by-hand note in TASK-626's Results.

## Assumptions

- **A1** — Jev Box fits both judgments at thresholds 0.7 and 0.3. *Confirm: TASK-625's API facts.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-168-jev-first-use-and-check.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/jev-use-cases.md` · `docs/knowledge-index.md` | T1 | Jev use cases ranked by delta over lean-flow's surface; API facts with a source URL each; A1 refuted (Box is image-only, Noul used) | low | doc-caps PASS; coordinator read |
| `scripts/jev-done-when.ts` | T2 | maintainer-only advisory judge of Done-when boxes: dry run by default, budget and key guards before any fetch, run failure exits 3 | low | paid fixture run (exit 1, `UNOBSERVABLE=2; NEGATIVE-VAGUE=1`, control box 0.97); real run over 108 files; scoped review, 2 rounds |
| `test/fixtures/jev-done-when/sample-task.md` | T2 | retained must-FAIL fixture with a control box | low | the paid fixture run |
| `evals/run-emitter-column-fixtures.ts` | T2 | one OUT_OF_SCOPE row so the population scan lists the new script | low | first close gate FAILed without it; green after |
| `docs/work/**/TASK-624-*` | T3 | rulings on twelve leftover items, recorded; no tracked file besides the task changed | low | `git worktree list` shows 0 `.claude/worktrees/` entries |
| `CHANGELOG.md` · `docs/LEARNINGS.md` · `docs/epic/EPIC-024-*` · `TECH-DEBT.md` | close | Retro routing: Unreleased entry, L-296 plus two sightings, rollup row, TD-246 sighting | low | doc-caps; by-reference close check |

## Retro

**Retrieval check:** two misses, both a rule that existed and was not applied. Cross-check (L-130): G2 claimed "no gate leg inventories scripts/" after grepping one file. Scope-change paths (L-151, L-229): the Log's own header states the rule, and two T3 entries broke it. Both surfaced only at the first close gate.

**D12 verdict (D2):** gate failures traced to EPIC-024 rows 1 and 2: **0**. The first close gate was red with 3 FAILs (493 pass), all from this sprint's own work:
- prose density on the research doc.
- the new script missing from the emitter-column population scope.
- scope-change entries naming paths outside T3's Layers/Cites.

After the fixes the gate ran green, 495 pass, 0 fail, with `bun test` 589/0. Row 4 may start.

**Cost:** coordinator on Opus. One Sonnet worker built T1, Codex built T2 in a worktree with no network, and a Sonnet reviewer took two rounds. Two off-host QA_FULL runs. Jev spend was 0.007052 USD of the 5 USD cap. USD per box is not available at close.

**Worked**
- T1 refuted A1 before any code existed (Box is image-only), so T2 was built on Noul with no rework.
- The paid fixture run passed the first time (`UNOBSERVABLE=2; NEGATIVE-VAGUE=1`, control 0.97); the single allowed retune was not needed.
- Review round 1 caught two real defects (run failure sharing exit 1 with a finding, an untrimmed key); round 2 was clean.
- Reading the dead-token checker at G2 caught T3's git-ignored Layers token before it reddened the gate.

**Friction**
- Real run: 108 files, 395 boxes: 166 pass, 229 unsure, 9 UNOBSERVABLE, 0 NEGATIVE-VAGUE. 58% of boxes land in the 0.3 to 0.7 band at the vendor-default thresholds, so the judge is mostly undecided on this corpus. This is input for TASK-627's design.
- T1's ranking puts the cheap A/B judge (TASK-628) above concept match (TASK-627), the reverse of the backlog chain. Owner ruled "Leave it for /triage"; nothing filed.
- Nine leftover agent worktrees, one empty folder and two stray files were ruled removed by the owner (branches kept). TD-246's mechanism that creates them is unchanged.

**Pattern candidate:** L-130 (cross-check, count +14) and L-151 (a record placed where its reader cannot reach it, count +17) each gained a sighting. L-296 is new (a git-ignored Layers token), count 1.
