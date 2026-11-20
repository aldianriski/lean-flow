---
sprint: 181
slug: rtk-trial-graphify-test-and-cell-verdicts
epic: EPIC-026
owner: Maintainer
last_updated: 2026-11-20
status: closed
plan_commit: 22b9d5ec
gates_signed: G1,G2 @ 664e979a
update_trigger: sprint execute/close events
---

# SPRINT-181 — RTK Trial, graphify Test and the Cell Verdicts

> **Theme:** EPIC-026's two open trials run here, and the dispatch trial's verdict follows SPRINT-180's numbers. RTK is
> installed project-scoped and measured over this sprint's own USD per box. graphify is tested once on a workdoo
> snapshot against Explore. The three rulings are recorded as the sprint's last member. It adds no governance
> machinery, so ADR-053's freeze does not apply, and nothing ships without a separate owner ruling.

## Scope

**In:** TASK-671, TASK-673, TASK-674.
**Out (deferred):** TASK-675 (graphify wiring, blocked on a TASK-673 keep and owned by the next sprint, so the RTK
measurement stays clean) · TASK-402, 489, 507, 523 and 668 · any new guard, checker or ledger field · a global RTK hook
· shipping RTK or graphify (needs its own owner ruling).

## Members

- docs/work/todo/TASK-671-rule-each-model-effort-cell-keep-retune-or-drop.md
- docs/work/todo/TASK-673-test-graphify-on-a-workdoo-snapshot-against-explore.md
- docs/work/todo/TASK-674-rule-rtk-on-the-trial-sprint-s-usd-per-box.md

## Plan

### T1 — Rule each model × effort cell keep, retune or drop `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `.claude/CONTEXT.md` · `docs/adr/ADR-010-model-dispatch-role-tiers.md` · `docs/research/model-effort-trial-verdict.md` · `docs/knowledge-index.md` · `CHANGELOG.md` · `README.md`
Depends-on: none
Cites: TASK-671, TASK-670
The trial's numbers exist only from SPRINT-180, so the verdict is its own task. Cells with fewer than two dispatches are inconclusive.

**Acceptance:** each changed cell carries a keep, retune or drop ruling with its number, and dispatch.md and CONTEXT keep the kept cells only.

### T2 — Test graphify on a workdoo snapshot against Explore `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/graphify-workdoo-questions.md` · `docs/research/graphify-workdoo-test.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-673, `docs/research/graphify-reference-run.md`, `docs/research/graphify-daily-value.md`, `docs/epic/EPIC-026-token-cost-per-box.md`
Six fixed questions with an answer key built first, two Sonnet arms, a blind score and one verdict. The snapshot is left as found.

**Acceptance:** a keep, drop or inconclusive verdict with both arms' correct counts and tokens, graph build cost included, and workdoo reverted.

### T3 — Rule RTK on this sprint's USD per box and record all three verdicts `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/research/rtk-trial-verdict.md` · `docs/epic/INDEX.md` · `docs/knowledge-index.md`
Depends-on: T1, T2
Cites: TASK-674, TASK-669, `docs/epic/EPIC-026-token-cost-per-box.md`, `docs/research/ponytail-delta-review.md`
It runs last so its measure window (promote up to the commit before its own work) holds T1 and T2. It states the figure with and without T2's dispatches.

**Acceptance:** an RTK verdict with its measure basis and the bypass rule's record, and the INDEX row naming RTK, graphify and ponytail.

## Decisions (pre-locked)

- **D1** — Three members in two waves: T1 and T2 together, then T3. T3 is last by owner ruling 2026-11-20, so its window holds the rest.
- **D2** — This is the RTK trial sprint. RTK is on from promote; the measure window is promote to the commit before T3's own work.
- **D3** — Commits: a task commits as `sprint(181) Tn: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(181):`. T1 and T2 share only the generated `docs/knowledge-index.md`; regenerate it once after each merge.
- **D4** — The dispatch trial is not extended to this sprint (owner answer 2026-11-20). TASK-671 rules on SPRINT-180's record.
- **D5** — Trial rule for RTK: any count, id derivation or existence check uses the Glob or Grep tools or `rtk bypass`, never a compressed Bash listing. Each truncation is logged; a real miss counts against RTK.

## Assumptions

- **A1** — The three verdict-note slugs above. *Confirm: G2.*
- **A2** — T1 needs a CHANGELOG `[Unreleased]` line for a shipped-reference change; it is absent from the task's Touches. *Confirm: G2 for T1.*
- **A3** — T2's arm A cannot read `graphify-out` (run it before the build or on a separate copy), and workdoo's pre-test state includes an untracked `.claude/worktrees/`. *Confirm: G2 for T2.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-181-rtk-trial-graphify-test-and-cell-verdicts.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/epic/EPIC-026-token-cost-per-box.md` | COORD | D8 amendment and the SPRINT-181 member row (WHY: the owner moved the graphify test to a standalone run) | Low | coverage re-read |
| `skills/orchestrator/references/dispatch.md`, `.claude/CONTEXT.md`, `docs/adr/ADR-010-model-dispatch-role-tiers.md`, `README.md`, `CHANGELOG.md` | T1 | One cell kept (intake draft check, opt-in per host); the trial wording and the other cells retired (WHY: the SPRINT-180 numbers ruled them) | Low | scoped review, check-doc-caps |
| `docs/research/model-effort-trial-verdict.md` | T1 | Verdict note for the cell rulings | Low | read-through |
| `docs/research/graphify-workdoo-questions.md`, `docs/research/graphify-workdoo-test.md` | T2 | Six fixed questions with the key, and the graphify drop verdict (WHY: 6 of 6 tie at 1.038x tokens) | Low | blind score, workdoo reverted |
| `docs/research/rtk-trial-verdict.md`, `docs/epic/INDEX.md` | T3 | RTK inconclusive, and the EPIC-026 row naming all three verdicts (WHY: 0.686 USD per box sits inside the 0.474 to 2.023 band) | Low | session-cost window probe |
| `docs/knowledge-index.md`, `docs/work/` task moves | COORD | Regenerated index and status moves (WHY: derived view and folder status) | Low | gen-index |

## Retro
**Retrieval check** — yes, a miss. L-319 (`related:` takes corpus ids only) is already promoted into the template, yet the graphify questions note carried `related: [TASK-673]`. The corpus dangling-ref check caught it at system verify (first run, fixed in 212f0c52). L-326 and L-045 were also hit again.

**Cost** — 3 members (S, M, S), coordinator plus Sonnet workers, no Codex builder. The RTK window is 10.29 USD over 15 boxes, 0.686 USD per box (0.638 without the four T2 dispatches); baselines SPRINT-178 0.659, SPRINT-179 0.474, SPRINT-180 2.023. Reported worker tokens sum to 446,475: T1 112,303; T2 key worker 96,941, arm A 41,375, arm B 42,932, scorer 56,975; T3 95,949. The graphify build cost 0 LLM tokens (a 9 s code-only update). The coordinator's own tokens are not recorded, so no per-sprint total is stated.

**Worked**
- The dispatch cells were ruled from the SPRINT-180 Log, one worker counted as one dispatch at its cumulative cost.
- The graphify key was fixed and checked before either arm ran, the scorer was blind, and workdoo was reverted exactly (HEAD, `--ignored` status and `~/.graphify` matched the pre-test record).
- T3's box wording was fixed by a scope-change entry and an owner popup before any work.

**Friction**
- Promote predicted `governance:low` for T1, but T1 changed a workflow contract and an implementation-binding ADR, so review logged `governance:high`.
- The first system-verify run piped the gate through `| tail`, so exit 0 was tail's; the VPS result files showed qa.rc 1.
- A research note's `related:` held a task id and reddened the corpus check.
- RTK v1.1.0's project-scoped `rtk init` installs no hook, so the hook was hand-wired into gitignored settings.local.json. RTK also truncated `ls`, `head`, `tail`, `sed` and `wc` output, so census queries went through Glob and Grep.
- The last `record-line tick` on TASK-674 ran its downstream checks past 120 s and finished green.
- graphify does not skip an untracked `.claude/worktrees/`, which needed a temporary `.graphifyignore` (workdoo-side, no lean-flow row).
- A local Windows bare gate showed a `run-spec-reader-fixtures.sh s13-rows-intact` FAIL with spec/ untouched; it passes off-host.

**Pattern candidate**
- L-328 new (predict a task's consequence from its Layers, not its class). Count bumps: L-045, L-326 (now 2) and L-319 (now 3).

**Routed**
- Shipped: the T1 CHANGELOG `[Unreleased]` line is already present; the RTK and graphify verdicts ship nothing. Tech debt: TD-318. Follow-ups: no new task file. TASK-675 is cancelled (graphify drop). EPIC-026 closes and is archived.
- Verdicts: one dispatch cell kept (intake draft check, opt-in per host), the rest default; graphify drop (6 of 6 tie, 1.038x tokens); RTK inconclusive (0.686 USD per box inside the 0.474 to 2.023 band), maintainer-environment only; ponytail Drop from SPRINT-178.
- RTK hook: the owner ruled it removed after close (the coordinator removes it from the gitignored `.claude/settings.local.json`; the binary stays in `D:\tools\rtk`).
- Release: a feature sprint, so a MINOR by hand with SPRINT-180's `[Unreleased]` line, owner-run later; nothing is bumped or pushed here.
