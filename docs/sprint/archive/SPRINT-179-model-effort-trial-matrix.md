---
sprint: 179
slug: model-effort-trial-matrix
owner: Maintainer
last_updated: 2026-11-16
status: closed
plan_commit: c25c88ce
close_commit: b2713a0d
gates_signed: G1,G2 @ ab039283
update_trigger: sprint execute/close events
---

# SPRINT-179 — Model × Effort Trial Matrix in Dispatch

> **Theme:** Effort is unrouted: every worker in the 2026-11-16 session ran Sonnet at default effort, and the strongest tier is manual-only. This sprint ships the per-role matrix as an opt-in trial, gated by a `dispatch-trial` line in the host's CONTEXT, with a spending bound and a per-dispatch record. The measured verdict is a later task (TASK-671), after a real sprint has run the cells.

## Scope

**In:** TASK-670 (trial table in dispatch.md, the `dispatch-trial` line and record rule in CONTEXT, the ADR-010 addendum, CHANGELOG and README).
**Out (deferred):** TASK-671 (rule each cell on the trial's numbers; blocked until a real sprint has run the cells) · the trial run itself on the next real sprint · Codex's own effort setting · any new guard, checker or ledger field · the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-670-dispatch-names-a-workers-effort-per-role-as-a-trial.md

## Plan

### T1 — Dispatch names a worker's model tier and effort per role, as an opt-in trial `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md` · `docs/adr/ADR-010-model-dispatch-role-tiers.md` · `CHANGELOG.md` · `README.md`
Depends-on: none
Cites: TASK-670, `skills/orchestrator/references/cross-model-route.md`, TASK-671
The default three class rows stay the consumer default, and a trial table applies only where the host declares `dispatch-trial`. Strongest-tier dispatches are capped at 6 and booked on small inputs only. The one real dispatch under a trial cell that the DoD asks for is exercised at G2 or build time, with the repo-local record.

**Acceptance:** dispatch.md, CONTEXT and the ADR-010 addendum agree on the table, the cap and the escalation cell, and a host with no `dispatch-trial` line dispatches exactly as before.

## Decisions (pre-locked)

- **D1** — Owner rulings, 2026-11-16: "Measured trial" and the Fable cap, verbatim "makesure 6 allocate is just doit simple task, not heavy, my token will burn". The matrix ships as an opt-in trial; its verdict is TASK-671, not a box here.
- **D2** — TASK-671 stays in the backlog, `blocked` on TASK-670, because it needs a real sprint's numbers. It does not join this sprint.
- **D3** — Net-zero rule: the CONTEXT edit adds no net line (150 of 150 lines; always-loaded token budget 12679 of 12691) and `.claude/CLAUDE.md` stays 79 of 80. If a cap check fails mid-build, stop and ask.
- **D4** — Commits: the task commits as `sprint(179) T1: …`; coordinator writes (status moves, Log, sprint file, ticks) commit as bare `sprint(179):`.

## Assumptions

- **A1** — The Agent tool takes an `effort` parameter on the installed CLI. *Confirm: T1's exercised dispatch.*
- **A2** — `.claude/CONTEXT.md` can absorb the pointer and the `dispatch-trial` line net-zero. *Confirm: `check-doc-caps.ts` at T1's build.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-179-model-effort-trial-matrix.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/dispatch.md` | T1 | Opt-in `### Trial cells` keyed to a host's `dispatch-trial` line, the effort sentence and one Escalation sentence; the three class rows stay the consumer default. | Med | Fable then Codex blind review, CLEAR at R2; consumer grep of added lines = 0 |
| `.claude/CONTEXT.md` | T1 | Model-tiers line becomes a pointer, plus the repo's `dispatch-trial:` declaration and record rule; net-zero lines. | Low | `check-doc-caps.ts` PASS (~12680 of 12691) |
| `docs/adr/ADR-010-model-dispatch-role-tiers.md` | T1 | 2026-11-16 amendment reverses item 3 only; items 4 and 5 stand. | Low | read against the diff; both reviews |
| `CHANGELOG.md` | T1 | `[Unreleased]` line for the opt-in trial. | Low | read against the diff |
| `README.md` | T1 | One line pointing to the trial cells. | Low | read against the diff |

## Retro

**Verdict.** TASK-670 is done, 17 of 17 boxes. `dispatch.md` now carries opt-in trial cells keyed to a host's `dispatch-trial` line, with a named trial sprint, at most six strongest-tier dispatches booked on small inputs, and a repo-local per-dispatch record. A host without the line dispatches as before. System verify, off-host on `c27667dc`: `gate-remote: ran c27667dc6b4f1c07efa2e3287e8c56391c1b3beb`, `bun test: 638 pass, 0 fail (rc 0)`, `qa-check: QA-CHECK: 234 pass, 0 fail (rc 0)`. The trial itself has not run yet; TASK-671 rules each cell after a real sprint has run them.

**Delivery.** Codex built the text in a worktree (99,392 tokens, then one 85,393-token retry for the merged R1 fixes) and the coordinator landed it as `45edfbc0`. Review was blind and ordered, Fable (`decision-escalation`, effort high) first, then Codex, which never saw Fable's findings. R1 Fable: NOT CLEAR, 0 High, 3 Med, 4 Low, 92,807 tokens. R1 Codex: NOT CLEAR, 0 High, 2 Med, 60,216 tokens. R2 both CLEAR (Fable 109,682 cumulative, Codex 55,741). The Fable review is the recorded dispatch that ticked the exercised-on-real-input box; it is early data outside the next sprint's cap of 6.

**Cost.** Pre-rule baselines at default effort, harness-reported: intake worker 102.5k over 4 passes, intake draft review Fable 75.5k and Codex 7.2k + 16.0k, promote worker 161.8k, builder-check reader 61.4k. The close worker's figure is not recorded here. By commit count: 6 coordinator bookkeeping commits (`sprint(179):`) and 1 task commit (`sprint(179) T1:`), for 1 member.

**Retrieval check.** Yes. L-224 (re-run the gate's own checker after a tick) applied to the ticks. L-319 was promoted at the promote. No bump needed.

**Worked**
- The builder-check settled 2 contradictions and 4 questions before the build.
- Blind pairing found distinct issues: Fable that the trial had no end, Codex that the small-input rule read as a routing ban against ADR-010 item 5. The coordinator ruled all of them real.
- The net-zero CONTEXT budget held (150 of 150 lines, ~12680 of 12691 tokens).

**Friction**
- The first draft capped strongest-tier dispatches but named no sprint or end; only Fable flagged it at the code review.
- `record-line.ts tick` re-runs the downstream checkers on every call, so ticking 17 boxes in one loop overran the 120 s tool timeout.
- The promote worker wrote the Log frontmatter as `sprint: 178`; close corrected it. Its commit trailer also named its own model, not the briefed one (harmless, ruled needs-none).

**Pattern candidate** (surface to user, `docs/LEARNINGS.md`)
- L-325 and L-326, both count 1.

**Routing** (filed above, STANDARD §10)
- Shipped: CHANGELOG `[Unreleased]` and the README already carry TASK-670's line; no new entry.
- Tech debt: none new.
- Follow-ups: none new. Fable's R2 note went into TASK-671's Assumes (record whether the intake, promote and close cells fired on a consumer host).
- Learnings: L-325 new (a spending bound names its end), L-326 new (tick loop overruns a tool timeout).
- Handoff reconciliation: the ledger row for the model × effort routing matrix is set `spent` in `HANDOFF-LEDGER.md`; the Log holds no `handoff` entry. No `epic:` on this sprint, so no rollup.
