---
sprint: 178
slug: lane-cost-fixes-and-ponytail-review
epic: EPIC-026
owner: Maintainer
last_updated: 2026-11-16
status: closed
plan_commit: 7edbe11c
gates_signed: G1,G2 @ b533a021
update_trigger: sprint execute/close events
---

# SPRINT-178 — Lane Cost Fixes and the Ponytail Delta Review

> **Theme:** The 2026-11-14/15 four-lane run showed lane cost follows session length: long Opus lanes, bulky output and `/loop` polling. Two coordinator.md fixes (rotate and launch lanes, then keep bulky output and polling out of lanes) ship now. EPIC-026's ponytail delta review runs beside them, since it is a reading that installs nothing and cannot touch EPIC-025's Sprint B.

## Scope

**In:** TASK-666 (lane rotation and coordinator launch) · TASK-667 (bulky outputs, message discipline, no polling) · TASK-669 (ponytail delta review, EPIC-026 slice 1).
**Out (deferred):** TASK-668 (re-measure lane cost; blocked until the next real multi-lane run) · EPIC-026's RTK trial and graphify trial (after Sprint B closes, D1) · EPIC-025 and its Sprint B (workdoo) · the v2.24.0 push (owner action).

## Members

- docs/work/todo/TASK-666-let-the-coordinator-rotate-and-launch-lane-sessions.md
- docs/work/todo/TASK-667-keep-bulky-outputs-out-of-lanes-with-message-discipline-and-no-polling.md
- docs/work/todo/TASK-669-ponytail-delta-review.md

## Plan

### T1 — Let the coordinator rotate and launch lane sessions `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `skills/handoff/SKILL.md` · `skills/flow/SKILL.md` · `.claude/CONTEXT.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-666, `skills/orchestrator/references/dispatch.md`, `docs/sprint/archive/SPRINT-176-coordinator-reference-for-lanes.md`
Lane cost tracks session length, and lean-flow names no lane lifetime or ceiling. The first box exercises the `claude --bg` route on a throwaway lane before any text is written. T1 is the single owner of coordinator.md until it commits (D3).

**Acceptance:** coordinator.md, handoff, flow and CONTEXT name the same ceiling and the same rotate route, and the four `--bg` results are recorded.

### T2 — Keep bulky outputs out of lanes, with message discipline and no polling `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/coordinator.md` · `skills/orchestrator/references/dispatch.md` · `CHANGELOG.md`
Depends-on: T1
Cites: TASK-667, TASK-666, `docs/research/router-mode.md`
Serialised after T1 because both edit coordinator.md and CHANGELOG.md (D3). Only bulky-output work goes to a worker; routine edits stay inline. The exercise may share T1's throwaway lane.

**Acceptance:** coordinator.md and dispatch.md state the narrow delegation rule, the message rule and the background-wait rule, with one bulky segment and one wait loop exercised.

### T3 — Ponytail delta review (EPIC-026 slice 1) `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-669, `docs/epic/EPIC-026-token-cost-per-box.md`, `docs/research/graphify-daily-value.md`
A first-hand reading of ponytail mapped against lean-flow's existing surface (L-017), nothing installed. It shares no file with the two lane tasks, so it runs in wave 1.

**Acceptance:** one new `docs/research/` file records the verdict and its first-hand-read basis, and nothing ships inside lean-flow on it.

## Decisions (pre-locked)

- **D1** — Owner ruling 2026-11-16, verbatim "Lane fix + ponytail now (Recommended)": the lane-fix tasks plus ponytail's delta review run now; RTK's measured trial and graphify wait for Sprint B to close. Recorded as EPIC-026 D7 (amends D1's timing for the ponytail slice only).
- **D2** — EPIC-026 is activated by this promote. The sprint carries `epic: EPIC-026` because TASK-669 advances it; TASK-666 and TASK-667 carry no `epic:` and advance none of its conditions. The epic's § Member sprints row says so.
- **D3** — coordinator.md and CHANGELOG.md are edited by T1 then T2, in that order, never in parallel. T3 shares no file with either.
- **D4** — Net-zero rule: T1's edit to `.claude/CONTEXT.md` adds no net line (150 of 150; always-loaded token budget 12683 of 12691). `.claude/CLAUDE.md` is untouched (79 of 80). If a cap check fails mid-build, stop and ask.
- **D5** — Tasks commit as `sprint(178) Tn: …`; coordinator writes (status moves, Log, sprint file, epic and INDEX edits, ticks) commit as bare `sprint(178):`.
- **D6** — Parallel with EPIC-025 Sprint B (workdoo SPRINT-005) on a frozen 2.23.0 worktree (EPIC-025 D9). This sprint does not touch EPIC-025, its Sprint B or any workdoo file.

## Assumptions

- **A1** — `--bg` sessions accept `SendMessage` and support popups once attached. *Confirm: T1's first box, results (a) to (d).*
- **A2** — `claude --help` on the installed CLI still shows the `--bg`, `agents`, `attach`, `logs` and `stop` forms (2.1.325 read 2026-11-16). *Confirm: T1's exercise.*
- **A3** — ponytail's SKILL.md and benchmark are publicly readable. *Confirm: T3's first box.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-178-lane-cost-fixes-and-ponytail-review.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/coordinator.md` | T1, T2 | T1: the 200k lane ceiling, a rotate route and a launch route with `claude --bg`, and the exercise's findings (attach from a real terminal, brief before variadic flags, successor permission mode plus `--add-dir`). T2: the narrow delegation rule for bulky outputs, the message rule, one approval per task batch, a background-wait rule and a "Lane cost" section. | Med | T1 four `--bg` checks run live; T2 bulky segment and wait loop run live; Codex review CLEAR on both |
| `skills/orchestrator/references/dispatch.md` | T2 | The counterweight to the delegation rule, citing `docs/research/router-mode.md`. | Low | Codex review CLEAR |
| `skills/handoff/SKILL.md` · `skills/flow/SKILL.md` | T1 | Name the same 200k target and the same rotate route. | Low | `200k` and `Lane rotation` greps 4/4 each; caps held |
| `.claude/CONTEXT.md` | T1 | The § Lane rotation pointer, net-zero (Streams bullet reworded). | Low | `check-doc-caps.ts` 150/150, token budget ~12679 of 12691 |
| `CHANGELOG.md` | T1, T2 | Two `[Unreleased]` bullets. | Low | read against the diff |
| `docs/research/ponytail-delta-review.md` · `docs/knowledge-index.md` | T3 | The verdict (Drop) with the first-hand-read basis at ponytail `96608e07`; index regenerated. `related:` fixed to corpus ids. | Low | `gen-index --check` PASS; system verify green at `e5236150` |
| `docs/work/done/TASK-666…` · `TASK-667…` · `TASK-669…` | T1-T3 | Done-when ticked with evidence. | Low | `check-sprint-by-reference.ts --close` 8 pass, 0 fail |

## Retro

**Verdict.** TASK-666, TASK-667 and TASK-669 are done, 18 of 18 boxes ticked. The coordinator can launch a lane with `claude --bg` and rotate one at a task boundary against a 200k target; lanes keep bulky outputs in a worker, batch shared-file approvals and wait in a background shell loop instead of `/loop`. The ponytail delta review is recorded as Drop (every technique matched or excluded; "-45% tokens" inconclusive), nothing installed. System verify, off-host `QA_FULL=1` on `e5236150`: `bun test` 638 pass, 0 fail; `QA-CHECK: 235 pass, 0 fail`. A feature sprint: the release is a MINOR by hand, the owner's decision; no version was bumped here.

**Delivery.** Codex wrote the T1 and T2 text in worktrees; Claude spent on the G2 design, the live `--bg` exercise on a throwaway lane, and review. Codex reviewed both diffs: T1 R1 CLEAR with one Med (lane boundary vs mid-task rotation, fixed in one sentence), R2 CLEAR; T2 R1 CLEAR. T3 was a first-hand read by a Sonnet fetch worker with the coordinator re-reading the quotes, self-reviewed. No token or dollar figure is recorded in the Log, so none is stated. By commit count, `plan_commit..HEAD` before this close: 11 commits, 4 task work (`sprint(178) Tn:`, one a T3 fix) and 7 coordinator bookkeeping (`sprint(178):`), for 3 members.

**Retrieval check.** Yes, once: L-017 (judge a tool by its delta over the existing surface) shaped T3's mapping and its Drop verdict. L-306 and L-319 recurred and are bumped to count 2.

**Worked**
- The live exercise before any text caught three launch faults a read of `--help` would not have: attach needs a real terminal, `--add-dir` swallows a trailing brief, and a rotated lane needs its predecessor's permission mode.
- Serialising T1 then T2 on `coordinator.md` (D3) caused no merge work; T3 ran beside them in wave 1 with no shared file.
- D4 held: `.claude/CONTEXT.md` stayed at 150 of 150 and the token budget under 12691.
- The system-verify gate caught the `related:` fault before close.

**Friction**
- The promote brief claimed `LF_GATE_*` were configured in the environment; they are not, so the promote worker could not run its baseline gate and the coordinator did.
- A promote worker's background `python` heredoc hung and was stopped by the coordinator.
- `related: [EPIC-026]` in the research file failed the corpus dangling-refs leg; one extra off-host run.
- The Windows-local `bun test` is red on one differential-parity case that is green off-host (TD-316).
- `claude attach` run from the coordinator's shell or the owner's `!` command exits with no terminal; the owner had to attach from a separate window.

**Filed**
- Shipped: CHANGELOG `[Unreleased]` already holds the T1 and T2 bullets; T3 is a research file with nothing user-visible, so no line was added.
- Tech debt: TD-316 (Windows-host differential-parity failure, uninvestigated).
- Follow-ups: none new. TASK-668 (re-measure lane cost on the next real multi-lane run) already exists in the backlog, blocked. The owner action "mobile repo toolchain env script" belongs to the owner's bloodlinesfamilia-mobile repo, outside lean-flow; nothing filed.
- Learnings: L-322 (variadic flag swallows the `--bg` brief), L-323 (attach and agents need a real terminal), L-324 (a brief asserting environment state unchecked); L-306 and L-319 bumped to count 2. Both are now eligible for promotion at the next promote's doc-aging pass; not promoted here.

**Pattern candidate** (surface to user, `docs/LEARNINGS.md`)
- L-306 and L-319 reached count 2 this sprint. Neither is promoted; the owner decides at the next promote.
