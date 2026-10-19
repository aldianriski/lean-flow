---
epic: 022
slug: plans-that-work-for-any-consumer
owner: Maintainer
last_updated: 2026-10-19
status: closed
member_sprints: [SPRINT-125, SPRINT-126, SPRINT-127, SPRINT-128]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-022 — Plans That Work for Any Consumer

> **Outcome:** a repository that installs lean-flow — with or without git — plans from a phased
> delivery roadmap down to sprint tasks, every open roadmap row traceable to a task or a named next
> slice, every G2 sign-off recorded where the next reader finds it, and no shipped instruction
> pointing at a file the consumer does not have.

## Why this, why now

The first real consumer outside this repository, workdoo (`D:\Research\workdoo`, pinned to plugin
2.5.0), had to hand-roll what lean-flow does not ship: a phased delivery plan
(`docs/product/company-workspace-roadmap.md`, slices P0–P16) and an agent-execution plan, neither
with a template, a STANDARD row, or a traceability rule. It also has **no `.git`**, so the sprint
freeze (`plan_commit`, read back with `git show`) cannot run there — it uses tasks only, no sprints.
That is the consumer evidence ADR-053 admits new machinery on. G2 already says "draft in `/plan`",
but the approval leaves no record outside the transcript (L-099 · L-151). And the debt census at
SPRINT-124's close (133 open rows) holds 28 consumer-facing defects and 40 in the planning
lifecycle. Four sprints' worth, sequenced cheap-and-shipping first.

## Scope

**In:** consumer-surface fixes + a patch release · retiring the ADLC platform epics workdoo now owns
· a roadmap / delivery-plan doc with plan→task traceability · a persisted plan-mode G2 record · a
sprint lifecycle that runs without git · the planning-checker debt clusters.
**Out (explicitly not):** the 61 maintainer-only TD rows (gate cost, eval harness, reaper guards) ·
EPIC-005 Fleet and EPIC-007 Workflow Packs (they stay `proposed`) · any workdoo application work
(ADR-041 · ADR-052) · the parked TASK-322 · 366 · 367 · 402.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-125](../../sprint/archive/SPRINT-125-consumer-maturity-and-cleanup.md) | Consumer Maturity and Cleanup | closed · `ff04f84` | Closed-when 1–3: the shipped surface stops naming lean-flow's scripts, two false-green conformance rules fixed (spec 0.16.0), migrate/prime/release-patch/templates fixed, platform epics retired; released as **2.6.0** |
| [SPRINT-126](../../sprint/archive/SPRINT-126-roadmap-and-traceability.md) | Roadmap and Traceability | closed · `4ff484b` | Closed-when 4: roadmap template + §2 row + coverage rule (spec 0.17.0), coverage reported by /prime · /triage · promote, `--roadmap <row>`; released as **2.7.0** |
| [SPRINT-127](../../sprint/archive/SPRINT-127-plans-without-git.md) | Plans Without Git | closed · `2c34f34` | Closed-when 5, 6, 8: task-level `gates_signed`; the git-less freeze (ADR-054, spec 0.18.0) through every lifecycle step; exercised on workdoo itself (its roadmap from the template, TASK-046 signed without git); the tick tool |
| [SPRINT-128](../../sprint/archive/SPRINT-128-planning-debt.md) | Planning Debt | closed · `d9139c4` | Closed-when 7: one shared Plan parser every TS reader uses, `Cites:` governed by its leading run, a resolver that names every store anomaly, the Shell twins and the reaper's v1 counting retired, CRLF-safe engine readers; closes the epic (8 of 8) |

## Decisions

- **D1** — Platform/runtime epics (006 · 008 · 009 · 011 · 012) close as superseded by workdoo;
  plugin-scoped 005 · 007 stay in lean-flow. Owner ruling 2026-10-18.
- **D2** — Sprint order S1 consumer maturity → S2 roadmap → S3 plan mode + git-less → S4 planning
  debt. Owner ruling 2026-10-18.
- **D3** — How a git-less repo freezes a Plan is hard-to-reverse (it changes what `plan_commit`
  means in STANDARD §2). **→ ADR at S3's G2.**

## Open questions

- Git-less freeze shape: a stored snapshot copy · a content hash · or no freeze with a named
  warning? → S3 G2, `/council` if the fork stays close, then the ADR (D3). → **answered:** a verbatim snapshot in the promote entry (ADR-054, SPRINT-127).

## Closed when

- [x] No shipped skill names a repo-only `scripts/…` path as the mechanism of a step an adopter runs,
      and `/prime` reports correctly under `--plugin-dir` and for an all-HITL sprint
      (TD-137 · TD-214 · TD-220 · TD-230). → TASK-428, TASK-429 — closed SPRINT-125
- [x] The consumer defects in the shipped release, template and conformance surfaces are resolved:
      footer bump (TD-093) · template ownership headers (TD-078) · `S11.TDDELETE` false PASS (TD-187)
      · `S4.NEGATIVE` substring (TD-118) · `migrate` withhold rule (TD-217) · the sprint template's lazy
      log vs the rollup gate (TD-160) · the tick-tail wording vs the freeze checker (TD-229) — and
      released as a patch. → TASK-430, TASK-431, TASK-432, TASK-433, TASK-422, TASK-427 — closed SPRINT-125; released as
      **2.6.0 MINOR**, not a patch (owner ruling at close: spec 0.16.0 moves adopter verdicts).
- [x] lean-flow's epic index holds only outcomes lean-flow executes: 006 · 008 · 009 · 011 · 012
      closed in place as superseded → workdoo (§11 cannot archive them), with the stale rows TD-100 · TD-161 · TD-176 · TD-243 closed.
      → TASK-434 — closed SPRINT-125
- [x] A repo writes a phased delivery plan from a shipped template with a STANDARD row, each open
      row ends `→ TASK-NNN` or `→ next slice:`, and `/prime` + `/triage` report uncovered rows.
      → TASK-435, TASK-436, TASK-437 — closed SPRINT-126
- [x] Approving a G2 design in plan mode leaves a persisted sign-off in the sprint or task file.
      → TASK-439 — closed SPRINT-127
- [x] A repo without git can promote, freeze and close a sprint, under an ADR.
      → TASK-440, TASK-441 — closed SPRINT-127
- [x] The planning-checker clusters are retired: one shared `Layers:` parser, a member resolver
      that names anomalies instead of dropping them, and the freeze-checker edge cases.
      → TASK-443, TASK-444, TASK-445, TASK-446, TASK-447 — closed SPRINT-128
- [x] Exercised on the real consumer: workdoo writes its roadmap from the template and runs one task
      through G1/G2 → done with a persisted gate record, without git (L-007); a git-less sprint is proven on a
      scratch repo (reworded at SPRINT-127 promote, owner ruling 2026-10-18 — workdoo runs one-off tasks, not sprints). → TASK-442 — closed SPRINT-127
