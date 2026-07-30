---
id: ADR-013
tags: [process, tooling]
domain: skills
related: [ADR-009, ADR-010, ADR-011]
status: accepted
---

# ADR-013 — Machine-state artifacts: adopt a conditioned execution-graph check, defer run-state, reject run events

- **Status:** accepted (2026-07-30)
- **Deciders:** Maintainer (council-pressure-tested: `docs/research/verdict-machine-state-artifacts.md`, SPRINT-035 T6)
- **Context driver:** an external review proposed lean-flow's first machine-readable state files; a live incident the same session (worktrees branched from stale session-start HEAD, undetected until merge) forced the question of whether prose conventions suffice for parallel dispatch.

## Context

lean-flow's identity is markdown-first: all state human-readable, no daemon, the model executes all
bookkeeping per skill prose. The review proposed three JSON/JSONL runtime artifacts: (a) a compiled
per-sprint execution-graph DAG, (b) a checkpointed run-state file for idempotent resume, (c) a
structured run-event log. Council-2 precedent (ADR-009 § derived views · TASK-040): no derived
machine views without a firing trigger. Blast radius of the live incident: one 6-task sprint,
4-way parallel dispatch, 4 cherry-pick merges forced, one agent confused by missing files — wave
membership and branch points existed only implicitly in prose.

## Decision

Per artifact, as councilled:

- **(a) Execution-graph validation — ADOPT, three hard conditions.** (1) The check MUST carry a
  per-task/per-wave `base_ref` validated against live HEAD at dispatch **and re-validated at every
  wave boundary** — the incident fix, not just DAG shape. (2) Any generated artifact stays
  disposable: compiled from the frozen sprint Plan, gitignored, regenerated every run, never a
  source of truth; malformed/missing → visible halt + re-compile from markdown, never silent
  proceed. (3) One step in the existing dispatch procedure (compile → validate → spawn).
  **Laziness-ladder precondition:** prototype the checks as a bash/prose preflight with NO JSON
  first (TASK-119); the JSON format is admitted only if the no-JSON rung proves insufficient.
  The one-line branching rule ships in prose regardless (TASK-118) — the rule is the cure, the
  artifact is enforcement.
- **(b) Checkpointed run-state — DEFER with a graduation contract.** Promotion trigger: one real
  unattended run that the Execution Log + `/handoff` could not cleanly resume. Precondition to
  build: the reconciliation rule written first — *run-state is a cache of the Execution Log; the
  log always wins; rebuildable from the log alone.* **Expiry: trigger unfired within 5 sprints
  (by SPRINT-040 promote) → auto-close as rejected**, noted in LEARNINGS. Tracked as a `blocked`
  Backlog entry so promote-time governance ages it.
- **(c) Run-event log (JSONL) — REJECT.** Derived machine view, no firing trigger, no first
  consumer; the sprint Execution Log already is the event log at 4–8-task scale. Revisit-if →
  `.out-of-scope/run-event-log.md`.

## Consequences

**Positive:** the schema/runtime gap closes where prose demonstrably fails (cycle/ownership/base-ref
checks at 6+ tasks) without surrendering markdown-as-SSOT; defer carries a kill-switch so it cannot
rot into "never" or accrete into adoption; the precedent axis (no derived views without a firing
trigger) is reaffirmed and now has a written graduation pattern.
**Negative (trade-offs accepted):** a real risk the DAG-by-drift pre-mortem fires — (a)'s artifact
quietly growing `status`/`attempts` fields until it becomes (b) ungoverned; mitigated by the
reconciliation rule being a build-precondition and by review. If a night run dies unresumably
before TASK-119 matures, recovery is still manual prose re-derivation — accepted at current
single-digit-hour scale.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Adopt all three (external review / Expansionist) | Argues from a scale lean-flow isn't (multi-day fleets); named the blind spot by all 5 peer reviews; violates curated-not-copied ("actually used" ≠ imagination) |
| Reject (b) outright (Contrarian) | Discards a costless spec'd graduation path; the 5-sprint expiry gives reject-by-default anyway if the trigger never fires |
| JSON DAG immediately, skip the no-JSON rung | Laziness ladder: nobody verified markdown+script can't already do the checks; format decision stays honest only after the cheaper rung is tested |

## Addendum — rung result: SUFFICIENT, JSON DAG rejected (2026-07-30 · SPRINT-036 T2 / TASK-119)

The pre-locked rule resolved mechanically: a 163-line throwaway POSIX-sh preflight derived all
three checks (cycle · shared-file single-owner · base-ref-vs-HEAD) **plus wave computation** from
the three markup tokens qa-check.sh §11 already lints as mandatory (`### Tn` · `Layers:` ·
`Depends-on:`) — positive on the real SPRINT-036 Plan, three negative fixtures each failing with
the named finding. The drift surface a JSON schema would guard is already closed by the existing
lint; a compiled DAG would add a second source of truth against a risk the plugin mechanically
prevents today. **Artifact (a) is therefore a preflight *step*, not a file format** — productionize
per condition (3) (follow-up task filed at SPRINT-036 close). The one defect found en route was a
POSIX idiom (`while read` on an unterminated stream silently drops the last token — a gate
degrading to silent false-negative), caught only by the negative fixtures. Revisit-if: the
production preflight hits a real markdown-parsing limit in use — JSON re-enters as serialization
of the already-proven checks, never as a new source of truth. Prototype deleted (scratch-dir only,
never entered the repo).
