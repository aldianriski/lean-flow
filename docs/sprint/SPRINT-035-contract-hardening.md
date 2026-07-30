---
sprint: 035
slug: contract-hardening
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: [set at promote commit]
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-035 — Contract Hardening

> **Theme:** Turn prose conventions into machine-verifiable contracts (external-review keeper,
> curated per L-017 delta map). Fix the four verified doc defects first — a contract layer built
> on contradictory wording is sand — then harden the task schema the dispatcher already assumes,
> and decide (not build) the machine-state-artifact fork that gates v1.20. Version target: v1.19.0.

## Scope

**In:** QA count-claim fix + drift lint · agent-terminology alignment · TD-010 resolution ·
harness-verdict revision · task-schema hardening (`depends-on:` + `class:`) · council decision on
the machine-state fork (execution graph / run-state / run events).
**Out (deferred):** implementing any machine-state artifact (T6 decides only — accepted items
graduate to v1.20 tasks) · behavioral eval suite (TASK-116, Backlog) · capability preflight
(TASK-117, needs-info) · combining fleet width with night-run duration (review's own "do not add").

## Plan

### T1 — Fix the QA template-count claim and lint QA.md against qa-check.sh `[size: S · risk: low · AFK]` (TASK-112)
Layers: docs/QA.md · scripts/qa-check.sh
docs/QA.md claims 1 non-core template; the script defines 2 (DESIGN, QA-TESTCASE). The QA system
never checked its own doc — add QA.md to the claim-consistency surface so drift fails the run.

**Acceptance:** QA.md matches the script's counts and a future divergence fails `qa-check.sh`.

**DoD:**
- [ ] docs/QA.md template-count row claims 2 non-core (DESIGN, QA-TESTCASE), matching `noncore=2`
- [ ] qa-check.sh claim-consistency checks include docs/QA.md's own counts (mismatch → fail)
- [ ] `sh scripts/qa-check.sh` passes

### T2 — Align agent-review terminology across surfaces `[size: S · risk: low]` (TASK-113)
Layers: .claude/CONTEXT.md · .claude/CLAUDE.md · README.md · docs/ARCHITECTURE.md
CONTEXT.md both claims isolated `/code-review` passes and "no review agent"; "ships no agents"
reads as false to anyone watching subagents get dispatched. One wording sweep, four files.

**Acceptance:** one precise statement everywhere — gates are inline human-approved checklists;
code review may dispatch built-in/ad-hoc isolated subagents; no custom agent definitions shipped.

**DoD:**
- [ ] CONTEXT.md contradiction replaced by the single precise statement
- [ ] all four surfaces say "no custom agent definitions" — no bare "ships no agents" remains
- [ ] qa-check passes (line caps hold — CONTEXT.md at 116/130)

### T3 — Resolve TD-010: de-localize the shipped night-run reference `[size: S · risk: low]` (TASK-114)
Layers: skills/orchestrator/references/night-run.md · TECH-DEBT.md
Two citations point at `docs/research/night-run.md`, which doesn't exist in a consumer's repo —
the L-015 leak class. Apply the W5 treatment already used in `prime` and `dispatch.md`: inline the
one-line rationale, drop the pointer.

**Acceptance:** a consumer reading night-run.md cold hits zero unresolvable references.

**DoD:**
- [ ] both repo-local citations replaced by inline self-contained rationale
- [ ] grep for `docs/` repo-local paths in the file comes back clean
- [ ] TD-010 → `status: resolved → TASK-114` in TECH-DEBT.md

### T4 — Revise the harness-engineering verdict to name operational keepers `[size: S · risk: low]` (TASK-115)
Layers: docs/research/harness-engineering-adaptation.md
The "no keepers" verdict conflated conceptual equivalence with operational equivalence. The
techniques map to existing surfaces, but the operational gaps (evals · machine-readable
scheduling/recovery state · maintenance recipe) are real and now tracked.

**Acceptance:** the verdict reads "no new core stages, but operational keepers" with pointers.

**DoD:**
- [ ] verdict revised; keepers listed with pointers to TASK-111 / TASK-116
- [ ] `sh scripts/gen-index.sh` re-run if ADR-009 metadata changed

### T5 — Harden the task schema with formal `depends-on:` and `class:` fields `[size: M · risk: med]` (TASK-110)
Layers: .claude/CONTEXT.md · skills/task-decomposer · skills/orchestrator (+ references/dispatch.md) ·
skills/lean-doc-generator/templates/SPRINT.md.template · TODO.md header · scripts/qa-check.sh · docs/QA.md
Fleet scheduling and tier routing both assume per-task fields (`depends-on`, classification) that
no writer persists — the schema/runtime mismatch. Make the two fields canonical, wire every writer
and reader, and lint them mandatory on active-sprint tasks (L-020: wired, not just present).

**Acceptance:** a task written by `/task-decomposer` carries both fields; `/orchestrator` dispatch
consumes them; `qa-check.sh` fails an active-sprint task missing a mandatory field.

**DoD:**
- [ ] CONTEXT.md § Task entry shape carries `depends-on:` + `class:` (decision | execution | mechanical-ingest)
- [ ] writers updated: task-decomposer output shape · TODO.md header · SPRINT.md.template
- [ ] readers updated: dispatch parallel-wave check uses `depends-on` · tier routing reads `class`
- [ ] qa-check.sh fails an active-sprint task missing done-when · touches · state · class · depends-on-or-none · HITL/AFK
- [ ] line caps hold (overflow → references/, ADR-006) · consumer-surface check (L-015)

### T6 — Decide the machine-state-artifact fork `[size: M · risk: med]` (TASK-111)
Layers: docs/adr/ · docs/DECISIONS.md · (verdict doc) — decision only, no runtime code
Execution graph, checkpointed run-state, and structured run events are one fork: the first
machine-readable state files in a markdown-first plugin — the same axis council-2 held on
TASK-040. Council it once; the verdict gates the whole v1.20 phase.

**Acceptance:** an ADR records adopt/defer/reject per artifact (a: sprint DAG · b: run-state file ·
c: run-event log) with revisit-ifs; accepted items graduate to TASK-NNN, rejected → `.out-of-scope/`.

**DoD:**
- [ ] `/council` run on the fork; `verdict-<slug>.md` written
- [ ] ADR-NNN records the three per-artifact outcomes + revisit-ifs; DECISIONS.md row added
- [ ] accepted → new TASK-NNN in Backlog · rejected → `.out-of-scope/<slug>.md`

## Decisions (pre-locked)

- **D1** — Task schema stays human-readable markdown; the review's YAML shape is illustrative only.
- **D2** — T6 decides, never implements — no machine-state artifact lands in v1.19 regardless of verdict.
- **D3** — Shared-file ownership + commit order: `qa-check.sh`/`docs/QA.md` → T1 lands before T5
  extends them; `.claude/CONTEXT.md` → T2's wording sweep lands before T5's schema edit. Execution
  is sequential (sprint-bulk); at commit, shared files stage per-hunk (L-042).

## Assumptions

- **A1** — The external review is uncurated input; only delta-mapped keepers entered this sprint. *Confirm: decompose session 2026-07-30 (L-017 delta map).*
- **A2** — `[HITL|AFK]` already covers autonomy — lint only, no new field. *Confirm: T5 G1.*
- **A3** — Persisting `class:` at intake shifts classification earlier than ADR-010's dispatch-time model. *Confirm: T5 G2 must reconcile with ADR-010 before the edit.*
- **A4** — The three machine-state artifacts are one fork, councilled once. *Confirm: T6 council run — if the council splits the fork, log a scope-change.*

## Execution Log

### 2026-07-30 | promote | plan locked
Six tasks pulled from Backlog (TASK-110…115 → T1…T6 in dependency order). Governance scan clean
(no L-promotions due · no TD aging · TODO.md 182-line cap accepted: close's archival drains it).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
