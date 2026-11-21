---
id: TASK-695
title: "Offer promote and a recommended execute mode at each hand-off, and stop auto-picking one by one"
type: feature
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-185
depends-on: []
---

# TASK-695 — Offer promote and a recommended execute mode at each hand-off, and stop auto-picking one by one

## Why

After `/task-decomposer` writes tasks it ends with "Sprint formation happens later", so nothing suggests promote and execute. At execute time the orchestrator defaults to a mode silently (one by one) and never offers sprint-bulk, one by one, quick or overnight with a reason. Owner notes 3 and 4.

## Done when

- [ ] New `orchestrator/references/mode-choice.md`: each mode (quick · mvp one-by-one · sprint-bulk · overnight) with its picking facts (member count, shared-file overlap, open needs-info/assumes, HITL/AFK/J mix); entry-point facts only; pre-promote advice provisional; never an auto pick. Overnight is recommended only when every member in the run is declared J0/J1 (TD-109 STRICT) and is labelled "preparation" until full pre-flight passes.
- [ ] One offer per transition, the result passed through the chain: decomposer step 7 (attended) popup "Promote these N tasks now (recommended)" / "Stop here"; promote then a popup with the recommended mode (in `references/sprint-by-reference.md` § Promote by reference; `lean-doc-generator/SKILL.md` is not edited by this task). "Stop here" ends the chain; a selected or explicitly invoked mode goes through normal routing + gates with no second chooser. Unattended/headless: a `Next:` line only, runs nothing.
- [ ] `/flow` honours "Stop here": a guard at the Feed→Plan transition (flow stage 3) reads the returned stop result, and the intake coordinator returns that result on the delegated path; proof through `/flow`: declining after Feed creates no sprint.
- [ ] `/prime` only advises: its `Next:` and `/flow` stage 4 use the shared rule by pointer (prime's "≥1 AFK J0/J1" test replaced), no second copy.
- [ ] Orchestrator intake: an active-sprint task, no mode named, not arriving from the chain → popup, recommended first, replacing "default to the sprint mode (or quick for a single one)".
- [ ] quick/mvp on a promoted member: first check its frozen Plan `Depends-on:` + ownership order (an open predecessor keeps it queued), then reuse the member lifecycle (`dispatch.md` § Members by reference) + Execution Log and stop after that member.
- [ ] Consumer proof in D:\Research\workdoo (pre-run file-hash manifest compared after revert), through `/flow`: (a) decompose → promote popup → promote → mode popup → chosen mode runs with no second chooser; (b) "Stop here" ends the chain; (c) mvp on one promoted member → member in `done/`, visible to sprint close; (d) a mixed J1/J2 Plan gets an attended recommendation; (e) a promoted dependent stays queued while its predecessor is open.
- [ ] Negative: a Backlog task is never built unpromoted without the promote-vs-quick popup; no popup in an unattended run; a mixed J2 Plan is never recommended overnight; the chain never asks the same transition twice; workdoo matches baseline.
- [ ] Wiring by grep: all callers listed (decomposer, promote, prime, flow, orchestrator). `orchestrator/SKILL.md` ≤ 140. Codex review of the shipped diff clean within 2 rounds. The report returns proposed README/CHANGELOG/CONTEXT lines.

## Touches

`task-decomposer/SKILL.md` step 7 (+ `references/intake-brief.md` if the hand-off needs it), `orchestrator/SKILL.md` intake + pointer, new `orchestrator/references/mode-choice.md`, `lean-doc-generator/references/sprint-by-reference.md` § Promote by reference (+ `promote-brief.md` if needed; NOT `lean-doc-generator/SKILL.md`), `orchestrator/references/dispatch.md` § Members by reference pointer, `prime/SKILL.md`, `flow/SKILL.md` stage 4. README, CHANGELOG, CONTEXT are coordinator-owned. Shared-file commit order on `orchestrator/SKILL.md`: 695 → 696 → 698.

## Assumes

- G2 note: the mode chooser sits after a successful promotion in `sprint-by-reference.md` § Promote by reference, before step 8's report; on the delegated promote path the worker returns the completed promotion and the coordinator runs the chooser (workers never pop up); the `promote-brief.md` edit is explicit in Layers.
- Tier P, no script; re-tier at G2 if one is added.

## Tracker

Owner notes items 3 and 4 (mode-suggestion half), 2026-11-21.
