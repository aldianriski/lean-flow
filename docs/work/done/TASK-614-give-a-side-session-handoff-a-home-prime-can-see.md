---
id: TASK-614
title: "Give a side-session handoff a home that /prime can see"
type: debt
epic: EPIC-024
sprint: SPRINT-165
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-614 — Give a side-session handoff a home that /prime can see

## Why
TD-298. With a second session running a sprint, a side session's handoff either lands in a log that is not its own, where a `live` entry can fail that sprint's close check, or gets no stub, so `/prime` cannot report it. On 2026-11-06 the owner had to name the path by hand.

## Done when
- [x] A handoff unrelated to the active sprint leaves a stub that `/prime` reports in its `Handoff:` row, without the owner naming the path. ✓ proof run A on pin 8d099eda: stub in root HANDOFF-LEDGER.md, Log untouched; fresh /prime run A2 printed the ledger entry in its Handoff row, no path named in either prompt
- [x] A handoff belonging to the active sprint behaves as before: its stub stays in that sprint's Log. ✓ proof run B on pin 8d099eda: stub in the SPRINT-001 Log, ledger untouched
- [x] Shown on real input through a pinned clone, on a scratch repo with an active sprint. ✓ pinned clone D:/Research/t1-proof/plugin at 8d099eda, scratch repo with an active sprint, runs A, A2, B, session init shows the inline plugin; the later fix 750963c0 changes step 2 and the spec version, not re-run
- [x] CHANGELOG `[Unreleased]` names the change, and TD-298 reads `status: resolved → TASK-614`. ✓ CHANGELOG Unreleased bullet in 8d099eda and 750963c0; TD-298 flipped in 750963c0
- [x] Negative: a committed side-session stub does not redden the active sprint's checks; `sh scripts/lib/check-handoff-state.sh` and its fixtures still fail a sprint's own `live` entry at close. ✓ committed side stub on the scratch repo: checker PASS, rc 0; evals/run-handoff-state-fixtures.sh 31 PASS, 0 FAIL incl. side-stub-beside-sprints-own-live

## Touches
`skills/handoff/SKILL.md` · `skills/prime/SKILL.md` · `scripts/lib/check-handoff-state.sh` · `evals/run-handoff-state-fixtures.sh` · `CHANGELOG.md` · `TECH-DEBT.md`

## Assumes
- **Deliberately open, by owner ruling 2026-11-07:** where the stub lives is not ruled at G2, so the builder returns `blocked` with one question and a recommendation (EPIC-024 row 1's return-path check, TASK-613). TD-298's `HANDOFF-LEDGER.md` direction is a suggestion, not a ruling. This is not a passive placeholder: the question is raised by the builder, in the sprint.
- `check-handoff-state.sh` already reads a root `HANDOFF-LEDGER.md`, gated on the no-sprint path; the builder confirms what it does with an active sprint.

## Tracker
TD-298 · host sprint for EPIC-024 row 1
