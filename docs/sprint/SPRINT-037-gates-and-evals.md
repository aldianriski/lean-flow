---
sprint: 037
slug: gates-and-evals
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: 5e5bd95
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-037 — Gates and Evals

> **Theme:** Make the gates real. Productionize the preflight T2-036 proved feasible, close the
> allowlist gap the T4-036 probe found, prototype the first behavioral eval on that probe's own
> fixture, and spec the capability preflight into Part 0. Clears every still-live item from the
> external review except what ADR-013 deliberately deferred or killed.

## Scope

**In:** dispatch preflight productionized (checks + waves, negative-tested) · `/handoff` in the
night-run allowlist · one behavioral eval fixture end-to-end · capability-preflight spec (Part 0
extension, surface resolved at promote).
**Out (deferred):** the full eval suite (T3's captured answer decides it) · capability-preflight
*implementation* (T4 specs; a graduation TASK builds) · TASK-120 run-state (blocked, expiry
SPRINT-040) · TASK-074 layout migration (P3) · TD-011 rider (next ADR-010 touch).

## Plan

### T1 — Productionize the dispatch preflight `[size: S · risk: low · class: execution · HITL]` (TASK-121)
Layers: skills/orchestrator/references/dispatch.md · (script home per G2 — consumer surface open)
Depends-on: none
T2-036's prototype is the spec: cycles · shared-file single-owner · base-ref-vs-HEAD · wave
computation, all from the three lint-mandatory tokens. G2 decides the one open design point:
shipped-in-plugin script vs documented procedure the host repo owns (L-015/L-016 bind either way).

**Acceptance:** the pre-dispatch gate exists as a real step in the dispatch procedure,
negative-tested, and fired once on a real sprint before a parallel wave.

**DoD:**
- [ ] the three checks + wave computation ship as a pre-dispatch step (form decided at G2)
- [ ] negative-tested per L-058 — one must-FAIL fixture per check, each failing with its named finding
- [ ] fired once on a real sprint before a parallel wave (L-007)

### T2 — Add /handoff to the night-run allowlist builder `[size: S · risk: low · class: execution · HITL]` (TASK-122)
Layers: skills/orchestrator/references/night-run.md (Part 1)
Depends-on: none
The T4-036 probe's clean halt was stopped one step short: `Skill(/handoff)` denied under
`dontAsk`. The halt-via-Execution-Log fallback held, but the protocol should complete.

**Acceptance:** Part 1's allowlist builder includes the `/handoff` invocation; the next headless
probe should reach it without a `denied-tool` record (full proof rides that future run).

**DoD:**
- [ ] Part 1 allowlist builder includes the /handoff invocation, consumer-legible (L-015)
- [ ] fallback (halt-record via Execution Log) stays documented — the allowlist add is belt, not replacement
- [ ] verification note logged: proof completes on the next real headless run

### T3 — Prototype one behavioral eval fixture end-to-end `[size: S · risk: low · class: execution · HITL]` (TASK-116)
Layers: (throwaway per /prototype discipline · capture → docs/research/ or ADR)
Depends-on: none
One question: is a behavioral eval harness feasible and cheap? T4-036's fixture notes are the
seed: park-record shape · denied-tool pattern · `lean-flow@lean-flow` update quirk · WIP-refusal.

**Acceptance:** one safety eval (unattended run parks HITL work) runs headless against the
installed plugin and asserts behavior — files written · state transitions · exit status — never
prose; the captured answer decomposes the full suite or rejects it with a revisit-if.

**DoD:**
- [ ] the eval runs headless against the installed plugin, asserting behavior not prose (reuses the T4-036 fixture notes)
- [ ] must-FAIL leg included (L-058): a fixture where the contract is violated is detected as FAIL
- [ ] captured answer (harness shape · cost · worth-it) → decompose suite or reject with revisit-if; code deleted

### T4 — Spec the capability preflight into Part 0 `[size: S · risk: low · class: decision · HITL]` (TASK-117)
Layers: skills/orchestrator/references/night-run.md (Part 0 — after T2's Part 1 edit lands)
Depends-on: T2
Surface resolved at promote: extend the existing pre-flight, no `/prime` flag. Spec only —
implementation graduates to its own TASK.

**Acceptance:** capability checks specified behavior-first (agent dispatch · worktree · ask
channel · cache-vs-repo version) with degrade rules (no worktree → sequential · no ask channel →
park HITL · cache mismatch → block unattended), delta-mapped against Part 0's existing checks.

**DoD:**
- [ ] delta vs existing Part 0 pre-flight mapped first — only the unmatched remainder is spec'd (L-017)
- [ ] checks specified behavior-first with the three degrade rules
- [ ] spec lands as the Part 0 extension or a graduation TASK-NNN (G2 decides which)

## Decisions (pre-locked)

- **D1** — T4 surface: night-run Part 0 pre-flight extension, not a /prime flag (owner, 2026-07-30 promote).
- **D2** — Overlap map: `night-run.md` → T2 (Part 1) lands before T4 (Part 0); `dispatch.md` → T1 only. T3 touches no source.
- **D3** — T1's script-home question (shipped vs host-owned vs procedure-only) is THE G2 item; qa-check.sh stays maintainer-only regardless (ADR-008).

## Assumptions

- **A1** — T2-036's prototype design transfers as-is (163-line POSIX sh, all four derivations). *Confirm: T1 G2.*
- **A2** — T3 may reject the eval suite — valid outcome, revisit-if recorded. *Confirm: capture written either way.*
- **A3** — T4 stays spec-only even if the spec is small enough to implement — wiring is a separate verified step (L-020). *Confirm: G2 holds the line.*

## Execution Log

### 2026-07-30 | promote | plan locked
Four tasks (TASK-121/122/116/117 → T1–T4). Governance clean; TASK-117's needs-info resolved at
promote (owner: Part 0 surface). TASK-120 expiry countdown: 3 sprints to SPRINT-040.

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
