---
epic: 006
slug: run-evidence
owner: Maintainer
last_updated: 2026-08-23
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-006 — Run Evidence

> **Outcome:** every lean-flow run leaves structured, machine-readable evidence in the repo it ran in,
> so the ADLC roadmap's operating metrics are computed from records rather than estimated, and the Run
> Protocol's event shapes are derived from events that actually happened.

## Why this, why now

`03-ADLC-ROADMAP.md § 3` opens with **"Start collecting:"** and lists ~25 operating metrics —
`tokens_per_run`, `cost_per_run`, `first_pass_verification_rate`, `revise_loop_fire_rate`,
`human_gate_rate`, `parked_hitl_rate`, `lead_time`, and the rest. It carries no phase gate: it sits
outside Phases A–H deliberately, because the metrics are meant to accumulate *while* the earlier
phases run.

**Measured: zero of them are collected.** A grep across `skills/`, `scripts/` and `evals/` for the
metric names returns nothing. The only per-run persistence is the hand-written markdown Execution Log
— SPRINT-080's has 12 prose rows. No tool can read it, and 79 sprints of run history exist in that
form.

Three things downstream are blocked on the absence, which is why this is an epic and not a nice-to-have:

- **§ 5's Decision Gate** for the Platform Era requires *"actual repeated operation shows central
  visibility friction."* That condition is unprovable by argument; it needs data or it stays a
  judgement nobody can audit.
- **Phase D's `RunEvent` / `Evidence` objects** must be designed from event shapes that occur. The
  roadmap warns against protocol before stable semantics; emission is how the semantics get observed.
- **The dashboard** (`08-ADLC-DASHBOARD-DESIGN-USER-FLOWS.md`) is observability-first by its own
  design. It renders exactly these records. Without them there is nothing to render.

It spans sprints because emission touches every skill that executes (`orchestrator`, `tdd`,
`diagnose`, `lean-doc-generator`, `flow`), because the record format must stabilise before Phase D
takes a dependency on it, and because the metric definitions cannot be validated until at least two
real sprints have produced data against them.

**This was rejected once, and that rejection has to be answered rather than stepped around.**
ADR-013 (accepted 2026-07-30, council-pressure-tested) ruled **(c) Run-event log (JSONL) — REJECT**:
*"derived machine view, no firing trigger, no first consumer; the sprint Execution Log already is the
event log at 4–8-task scale."* On July's evidence that was correct.

Its `.out-of-scope/run-event-log.md` revisit condition names the unblock: *a real consumer (`/insights`
or the Sprint-Close Retro) concretely asks for task-class timing / parking-rate data on two separate
occasions.* **That literal condition has not fired, and this epic does not claim it has.** What changed
is the *class* of consumer, which the condition could not have anticipated because the ADLC strategy
pack did not exist in July: four named consumers now ask for this data concretely — § 3's metric list,
§ 5's decision gate, Phase D's schema, and the dashboard. The condition's stated purpose was to prevent
**write-only exhaust**, and it names two examples of what a real consumer looks like rather than an
exhaustive list.

Reading a condition liberally to authorise what it blocked is the move refused at SPRINT-075 and
SPRINT-076 (L-088), so it is **not** made here by reading. **The first member sprint opens with a
superseding ADR that rules the re-entry on the record, ADR-013's prior wording preserved.** If that ADR
rules the other way, this epic does not proceed — a real possibility worth naming now, not a formality.

Every further sprint that runs without emitting is one the dashboard can never show.

## Scope

**In:** a git-native run-evidence record format · emission at the loop's execution points (run
start/end · gate decision · dispatch · review verdict · DoD tick · park/block) · a reader that computes
§ 3's metrics from records · two sprints of real data validating those definitions · §2 placement row
and §11 retention.

**Out (explicitly not):** **any transmission — this is not telemetry.** Records are written into the
repository and never sent anywhere; the README promises no telemetry and EPIC-004's scope reaffirmed
it, and that promise is load-bearing for adoption. Also out: the dashboard (Phase G) · the gateway and
runtime adapters (Phase F) · the Run Protocol's portable contracts (Phase D — this epic *feeds* their
design, it does not define them) · any database, service or queue · metrics the host runtime does not
expose, which are named as unreachable rather than approximated.
**ADR-013's standing guardrail is carried, not inherited quietly: these records must never become the
input to a run-state resume path** (its pre-mortem 1). That path is ADR-013 (b), which was *deferred*,
not adopted, and stays outside this epic.

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-006-run-evidence.md per ADR-030. -->

→ [`logs/EPIC-006-run-evidence.md`](logs/EPIC-006-run-evidence.md) — appended at each member close.

## Decisions

- **D1** — Records are local and git-native. Anything transmitted contradicts the no-telemetry promise;
  EPIC-005 D1 makes the identical call for fleet state, and for the same adoption reason.
- **D2** — The format is derived from events that actually occur, never from Phase D's object list.
  Designing the protocol first is the roadmap's own named anti-goal (*workflow engine before stable
  workflow semantics*).
- **D3** — Emission is **Tier X** under ADR-029: it does something rather than judges something, so the
  guard discipline does not apply to it. **→ depends on ADR-029 being accepted**; if it is not, this
  epic's cost roughly doubles and its sprint count should be re-estimated before promote.
- **D4** — This epic re-enters work ADR-013 (c) rejected, so it **starts** by superseding it, never by
  assuming it. The re-entry basis is a changed *consumer class*, stated as such; ADR-013's guardrail
  against a run-state resume path survives the supersession intact.

## Open questions

- Where do records live — `docs/sprint/logs/` beside the prose log, a new top-level tree, or the sprint
  file's own frontmatter? → the epic's first design fork; **ADR-grade if it adds a §2 row**, and
  ADR-030 is the live precedent for how a new tree gets admitted. Settle at the first member sprint's G2.
- One record per run, or per event? → decide *from the metric list*, not on taste: `revise_loop_fire_rate`
  needs event granularity, `cost_per_run` does not. Derive the answer from § 3 at decompose.
- What does a consumer with no sprint model emit? → the standalone contract says every skill completes
  its job invoked cold, so a run outside a sprint is still a run. Resolve before the format freezes, or
  the format silently assumes our loop (L-015).
- Which of the ~25 metrics are actually computable from inside a skill? → **a measurement, so it
  accumulates** (L-094): token and cost figures may not be reachable from the host. Measure first;
  promise second.

## Closed when

- [ ] **ADR-013 (c) is formally superseded by a member-sprint ADR** — or this epic is closed unbuilt, with the ruling recorded
- [ ] Every execution point in the loop emits a record — verified by one real run that produces them end to end
- [ ] Each of § 3's ~25 metrics is either computed from records or explicitly marked unreachable with its reason
- [ ] Two or more real sprints' records exist, and the metric definitions survived contact with them
- [ ] Nothing is transmitted — asserted mechanically, the way EPIC-004's foreign-repo harness asserts no lean-flow file was copied in
- [ ] Phase D can derive its `RunEvent` shape from recorded events rather than from imagination
