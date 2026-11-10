---
id: TASK-639
title: "Add two rules to the worker brief and dispatch standard: never end a turn while a needed job runs, and resume a worker in-process only"
type: feature
epic: EPIC-024
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
gates_signed: G1 @ 4c09c9e6
---

# TASK-639 — Add two rules to the worker brief and dispatch standard: never end a turn while a needed job runs, and resume a worker in-process only

## Why
Owner ruling at the SPRINT-170 close, verbatim: "Worker-brief rules (#6)", to implement after the close. Two host facts cost paid runs in SPRINT-170. In headless mode an agent that ends its turn while its own background job runs is never resumed and its report is lost (L-301; the thin-router probe P-thin2 stalled on it, and the trial Executor and merger files were fixed by hand). A worker resumed from a later process is unreliable on Claude Code 2.1.319 (L-302, TD-305): a forked session never found the transcript, and a plain resume opened a new session in real pairs. In-process `SendMessage` resume worked every time. Neither fact is in the shipped brief, so every consumer's worker can hit them. Codex's review of the recap asked for the wording "unreliable on the tested CLI", not "impossible", because one probe resumed.

## Done when

- [x] `skills/orchestrator/references/worker-brief.md` carries the rule that a worker never ends its turn while a job it needs is still running (it waits in the foreground), and `skills/orchestrator/references/dispatch.md` carries the resume rule: resume a worker with `SendMessage` inside the same process; across processes, hand a fresh worker the context. Both name the observation as "unreliable on Claude Code 2.1.319", not as a guarantee. ✓ 112035b9: worker-brief.md line 6 (wait in the foreground; "seen headless on Claude Code 2.1.319, an observation, not a guarantee"); dispatch.md § Hand the sub-agent its procedure skill (resume from the dispatching session; on 2.1.319 and 2.1.321 a later process is unreliable; a later process hands a fresh worker the context).
- [x] Exercised on real input (L-007): one headless dispatch of a worker that must wait on a background job reports back after the job finishes, and one in-process resume of a worker succeeds, each shown by the transcript or the run's output file. ✓ CLI 2.1.321 re-probe (A1): fork resume failed, plain --resume in place worked. Check 1: a background worker given the new contract stayed active 99 s over a 60 s job and reported exit 0 (`CHECK1 0`). Check 2: a same-session SendMessage resumed the worker ("Resuming agent"), note.txt reads one two. About 0.94 USD.
- [x] Wiring: `.claude/CONTEXT.md` and any copy of the contract that must stay byte-identical to `worker-brief.md` (the trial agent files embed it, on trial branches) are checked and noted; README and CHANGELOG `[Unreleased]` name the user-visible change; no repo-specific path leaks into the shipped wording; SKILL.md and reference line caps hold. ✓ `.claude/CONTEXT.md` does not cite the contract (checked, no change); promote-brief.md and intake-brief.md carry their own contracts by design and no check binds them; trial-branch agent files keep the old text on trial branches only; README (dispatch paragraph) and CHANGELOG `[Unreleased]` name the change; `check-doc-caps.ts` printed no breach for the touched files; gate on 112035b9: 589/0, 495/0.
- [x] Negative: the new text does not forbid in-process `SendMessage` resume, and does not say cross-process resume is impossible (a plain `--resume` succeeded in one probe). ✓ dispatch.md tells the coordinator to resume in the same session and records that a plain --resume once worked; nothing says cross-process resume is impossible. Codex review (read-only): `VERDICT: CLEAR`; its Med (version note missing from worker-brief.md) and two Lows (README fallback, wiring evidence) fixed before commit.

## Touches
`skills/orchestrator/references/worker-brief.md`, `skills/orchestrator/references/dispatch.md`, `.claude/CONTEXT.md` (roster note only if the contract is cited there), `CHANGELOG.md`.

## Assumes
- A1: the observations hold on the CLI version in use when this runs; re-check the version and re-run the probe described in L-302 first (a moving host fact is a query result, L-130).

## Tracker
SPRINT-170 close Retro · L-301 · L-302 · TD-305 · EPIC-024 row 1 (worker contract)
