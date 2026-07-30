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
- [x] the three checks + wave computation ship as a pre-dispatch step (form decided at G2)
- [x] negative-tested per L-058 — one must-FAIL fixture per check, each failing with its named finding
- [x] fired once on a real sprint before a parallel wave (L-007)

### T2 — Add /handoff to the night-run allowlist builder `[size: S · risk: low · class: execution · HITL]` (TASK-122)
Layers: skills/orchestrator/references/night-run.md (Part 1)
Depends-on: none
The T4-036 probe's clean halt was stopped one step short: `Skill(/handoff)` denied under
`dontAsk`. The halt-via-Execution-Log fallback held, but the protocol should complete.

**Acceptance:** Part 1's allowlist builder includes the `/handoff` invocation; the next headless
probe should reach it without a `denied-tool` record (full proof rides that future run).

**DoD:**
- [x] Part 1 allowlist builder includes the /handoff invocation, consumer-legible (L-015)
- [x] fallback (halt-record via Execution Log) stays documented — the allowlist add is belt, not replacement
- [x] verification note logged: proof completes on the next real headless run

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

### 2026-07-30 | T2 complete | /handoff allowlisted as a Part 1 pre-flight item
Kept inline (trivial doc edit; also avoids handing `night-run.md` between an agent and the
coordinator two steps before T4 edits the same file). Scope went one step past the task title on
purpose: allowlisting `Skill(/handoff)` alone is insufficient — the handoff **doc write to the OS
temp dir** is a separate tool call that `dontAsk` would also deny, so a run could clear the skill
gate and still fail to halt. Both are now named, and Part 3's watchdog recovery call is cited as the
second consumer of the same rule.
Deliberately **not** asserting a matcher string: the only evidence is one denial record
(`Skill(/handoff)`), so the item tells the reader to confirm what their builder emits rather than
fabricating rule syntax. That is what DoD 3's "proof completes on the next real headless run" means —
this task closes the *gap*, the next headless run closes the *proof*. Fallback (rollup line → Execution
Log) explicitly retained as belt-not-replacement, so an allowlisted `/handoff` never becomes the only exit.
T4 unblocked (`Depends-on: T2` satisfied).

### 2026-07-30 | T1 complete | preflight shipped as a procedure step — negative-tested, fired on this Plan
D3 resolved at G2: **procedure step in `dispatch.md` + optional inline POSIX-sh snippet, no new file**
(ADR-013's addendum wording — "a preflight *step*, not a file format" — decided it; a shipped
executable was rejected as an ADR-008-scale precedent, a host-owned script as an L-015 leak).
A1 corrected: the 163-line prototype was scratch-only and **deleted**, so T1 rebuilt from the
recorded derivation, not a port — design transfer, not artifact transfer.
L-058 leg: 3 must-FAIL fixtures, each failing with its own named finding (`cycle-detected` ·
`shared-file-unowned` · `base-ref-drift`). **Guard proven load-bearing** — the same snippet with
`|| [ -n "$line" ]` stripped exits **0/CLEAR** on the overlap fixture, reproducing SPRINT-036's
silent false-negative live.
L-007 leg: fired on this sprint's own Plan → waves T1/T2/T3=0, T4=1; `night-run.md` flagged shared
between T2/T4 but **PASS** with order T2→T4 derived from T4's `Depends-on:` — the PASS-vs-FAIL
nuance a positive-only run would never have surfaced. That output is the gate for wave C below.
Judgment call confirmed by the coordinator: declared base is an **argument**, never read from
`plan_commit:` — `plan_commit` marks the plan freeze, the wave base is live HEAD at spawn (reading
frontmatter would spuriously FAIL on ordinary post-promote bookkeeping, as it would here: 5e5bd95
vs HEAD 508f19e).
Wiring (L-020, coordinator — beyond T1's declared Layers, recorded not silent): `orchestrator/SKILL.md`
step 3 now runs the preflight *first*; `.claude/CONTEXT.md` § Model tiers pointer names it. Both as
in-line clauses — SKILL.md 100/110 and CONTEXT.md 119/130 have no headroom for new lines (L-008).
`night-run.md` pre-flight is the third surface — deferred to T4, which owns that file next.

### 2026-07-30 | gates | batch G1+G2 signed off
Fast-path G1 (promoted same session). G2: **no worktree isolation** — L-055 applied at design time,
but for a distinct reason from SPRINT-036's: worktrees fork from the *remote* default branch and
this sprint file exists only in two **unpushed** commits, so dispatch.md's own add/add corollary
fires. Fallback taken: shared-tree parallel dispatch — agents on disjoint files, **zero git writes
by agents**, coordinator owns all staging/commits. Declared base = 508f19e (verified = live HEAD).
Sequence corrected during G2: T1 cannot sit inside the wave it gates (its DoD 3 is "fired before a
parallel wave"), so T1 lands first, its output gates wave C. T2 stays inline (trivial, and avoids
handing `night-run.md` between an agent and the coordinator two steps before T4 edits it); T4 is
`class: decision` → inline per ADR-010.

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
