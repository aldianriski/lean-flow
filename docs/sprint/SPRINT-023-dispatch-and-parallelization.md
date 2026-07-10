---
sprint: 023
slug: dispatch-and-parallelization
owner: Maintainer
last_updated: 2026-07-10
status: active
plan_commit: 834cc7e
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-023 — Dispatch & Parallelization

> **Theme:** Make `/orchestrator` actually *operate* as the coordinator tier — dispatch execution to
> sub-agents by each task's classification (not do everything inline), and decide parallel-vs-sequential
> from the overlap map. The v1.9.0 skill-powered-dispatch doctrine exists but doesn't fire in practice;
> this closes that gap. Grounded in `model-purpose.md` (route by *nature*, not size).

## Scope

**In:** (A) `Agent`/`Task` in `allowed-tools` so dispatch auto-approves; (B) classification-driven default
dispatch; (C) an explicit parallel/sequential decision wired to the G2 overlap map; (D) an ADR-010 amendment.
**Out (deferred):** deterministic in-core orchestration (the prompt-driven ceiling stays — `/batch`·`/workflows`
remain the deterministic fan-out path); an auto-escalation ladder (ADR-010 rejected it); any agent *definition*
(agent-free-core intact — this dispatches built-ins).

## Plan

### T1 — Add `Agent`/`Task` to `allowed-tools` (orchestrator · council · flow) `[size: S · risk: low]`
Layers: `skills/{orchestrator,council,flow}/SKILL.md` (frontmatter)
`allowed-tools` grants auto-approval (it does not restrict — verified). Listing `Agent, Task` stops the
per-spawn permission prompt that currently stalls dispatch.

**Acceptance:** the three skills list `Agent, Task`; qa frontmatter passes; dispatch no longer prompts.

**DoD:**
- [ ] `Agent, Task` added to `allowed-tools` of orchestrator · council · flow (only these — they dispatch)
- [ ] other skills unchanged; `qa-check.sh` frontmatter check passes

### T2 — Classification-driven default dispatch `[size: M · risk: med]`
Layers: `skills/orchestrator/SKILL.md` + `skills/orchestrator/references/` (dispatch detail, uncounted L-012)
The orchestrator is the `decision` tier — it **coordinates** (plan/gate/merge), it does not execute inline.
Reword dispatch so a task's **classification drives it**: `execution`→Sonnet · `mechanical-ingest`→Haiku are
dispatched to a sub-agent handed their procedure skill (ADR-010 mech C) *by that classification*;
`decision`-nature/trivial stays inline only with a stated reason. Not a blanket "always-spawn" — the routing
rule is nature-not-size (`model-purpose.md`).

**Acceptance:** reading the Implement path, execution/mechanical work is dispatched by classification, not done inline by default.

**DoD:**
- [ ] dispatch reworded to classification-driven default (orchestrator coordinates; execution/mechanical → sub-agent; decision/trivial inline w/ reason)
- [ ] the routing basis cites `model-purpose.md` (nature-not-size) + ADR-010
- [ ] detail lands in `references/` (orchestrator SKILL ≤110, L-012)

### T3 — Parallel/sequential decision wired to the overlap map `[size: M · risk: med]`
Layers: `skills/orchestrator/SKILL.md` (sprint-bulk Sequence) + `references/`
Make the decision explicit and mechanical: from the G2 overlap-ownership map, tasks with **no shared file
AND no `depends-on`** dispatch in **parallel** (multiple Agent calls in one message); tasks sharing a file
or with a dependency run **sequential**. The overlap map (D2) is the input.

**Acceptance:** sprint-bulk states the parallel/sequential rule + the concrete mechanism (parallel = one message, multiple calls).

**DoD:**
- [ ] sprint-bulk Sequence step decides parallel (disjoint + no depends-on) vs sequential (shared/dependent) from the overlap map
- [ ] the mechanism is concrete (parallel = multiple Agent calls in one assistant message)
- [ ] `/batch`·`/workflows` named as the deterministic escalation for large disjoint fan-out (the ceiling)

### T4 — ADR-010 amendment `[size: S · risk: low]`
Layers: `docs/adr/ADR-010` · `.claude/CONTEXT.md` (iff wording)
Append-only amendment recording the doctrine: dispatch-by-classification (coordinator ≠ worker), the
parallel/sequential rule, and the **prompt-driven ceiling** (a prose skill nudges but can't guarantee spawn;
deterministic fan-out → `/batch`·`/workflows`).

**Acceptance:** ADR-010 carries the amendment; CONTEXT reflects any wording change.

**DoD:**
- [ ] ADR-010 amendment (append-only, §4) records (a) dispatch-by-classification, (b) parallel/sequential rule, (c) the ceiling
- [ ] CONTEXT tier note updated iff wording changed; caps hold

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)
- **D1** — dispatch is **classification-driven** (`model-purpose.md` baseline: route by nature not size; the
  orchestrator is the `decision`/coordinator tier, **not a worker**), **not** a blanket always-spawn (owner-confirmed).
- **D2 — overlap.** T2 + T3 both edit `orchestrator/SKILL.md` + `references/` → **sequence T2→T3**, per-hunk staging (L-042). T4 depends on T2+T3 (records their decisions).
- **D3** — the **prompt-driven ceiling** is documented, not solved: a skill nudges dispatch/parallelism, can't guarantee it; `/batch`·`/workflows` are the deterministic fan-out path (kept out of core, ADR-002).

## Assumptions
- **A1** — dispatching built-in agents is agent-free-consistent (ADR-002 — defines none). *Confirmed.*
- **A2** — dispatch follows the task's G1/decompose classification (the baseline). *Confirmed — model-purpose.md (owner steer).*
- **A3** — parallel = multiple Agent calls in one assistant message; no config knob. *Confirmed — claude-code-guide.*
- **A4** — `allowed-tools` grants auto-approval, does not restrict. *Confirmed — claude-code-guide.*

## Execution Log

### 2026-07-10 | promoted | plan locked
Rendered from TASK-069·070·071·072 (dispatch diagnosis → decompose). Governance: no unpromoted count≥2
learnings (L-016·L-020 promoted this session); TD-008 re-review flagged (minor); CHANGELOG rotation deferred
(PATCH landed, not a minor trigger). Plan frozen.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route buckets (§10). Then archive (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**

**Friction**

**Pattern candidate** (→ `docs/LEARNINGS.md`)
