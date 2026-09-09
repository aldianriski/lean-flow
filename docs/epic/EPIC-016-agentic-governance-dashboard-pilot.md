---
epic: 016
slug: agentic-governance-dashboard-pilot
owner: Maintainer
last_updated: 2026-09-09
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-016 — Agentic Governance Dashboard Pilot

> **Outcome:** an operator can create, run, monitor, decide on, stop and accept real agent work
> across two repositories **entirely from a dashboard** — with every approval bound to an identity, a
> revision and a scope, every run ending in a named terminal state, and failed or incomplete
> verification blocking acceptance.

## Why this, why now

Every prior epic in this repository improves the *work-system* for someone already sitting at a
terminal. None of them let the owner **use, watch and control** agent work from anywhere else, which
is the capability actually being asked for. The roadmap
(`docs/development/Lean-Flow-Governance-Roadmap-2026-2027.md`, 2026-09-09) reprioritises delivery
around exactly that, and supersedes the ordering in which platform investment was previously
sequenced.

It spans sprints because the outcome is not one artifact. It needs a runtime adapter proven against a
live runtime, a control service that holds authority, a durable queue with real worker isolation, an
approval model where absence of an answer is never consent, and a pilot long enough to observe
failure and recovery rather than only the happy path. The roadmap budgets **20 working days** across
seven phases; each phase ends in something demonstrable, which is what makes them sprints rather than
milestones on one plan.

The window matters. The pilot's value is the *evidence* it produces — which bottleneck is real, what
a run actually costs, where a human is genuinely needed. Every week it slips is a week the epics
queued behind it are estimated from assumption instead of measurement.

## Scope

**In:** a runtime adapter contract with a live Claude Code implementation and a deterministic fake ·
a control API + supervisor holding authority over status and grants · a durable store for work items,
runs/attempts, approvals and events · a dashboard covering Command Center, Work & Queue, Run Detail,
Approval Inbox and Workers & Policy · bounded concurrency with worker isolation, lease/heartbeat and
budget limits · a two-repository pilot exercising success, revision, escalation and recovery.

**Out (explicitly not):** a second real runtime — Codex, Kimi, Hermes and OpenClaw are scheduled
*after* the pilot, and the adapter contract exists to keep that space open, not to fill it ·
multi-tenant organisations · platform memory · cross-domain workflows · automatic production
deployment · a scheduler or queue *service* as a separable product · the reference-engine cutover
(**EPIC-014**, explicitly off the pilot's critical path) · formal closure of any existing epic, which
keeps its own § Closed-when.

## Member sprints
<!-- Rows are appended at promote. NOTE: member sprints live in the `workdoo` repository (ADR-041),
     so each row links out rather than to ../sprint/. The v1.63.0 epic-rollup-currency check reads
     THIS repository only and cannot see a workdoo sprint that closed without a row here — the row is
     therefore a manual obligation at each member close, not a checked one. -->

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| _(none yet — first member promotes from `workdoo` once ADR-042/043 land)_ | | | |

## Decisions

- **D1** — The platform is built in a separate repository (`workdoo`) with lean-flow consumed as a
  pinned plugin; governance splits outcome-here / execution-there. **→ ADR-041** (accepted).
- **D2** — Stack locked at Day 1: Next.js dashboard · Bun/Hono control API + supervisor as a
  long-running Linux service · Postgres. The supervisor **cannot** be serverless — it holds leases and
  heartbeats across worker lifetimes, which no request-scoped runtime can express.
- **D3** — One real runtime (Claude Code) plus a **deterministic fake adapter** shipped in the same
  sprint. A contract with exactly one implementation is undiscriminated: nothing distinguishes a real
  seam from a Claude-Code-shaped hole (L-186). The fake doubles as the test double for every suite
  above the adapter, so its cost is repaid immediately.
- **D4** — Deployment reuses the proven `temidev-agent-platform` pattern on the shared VPS — systemd
  units per process, Caddy reverse proxy, a dedicated service user. Reused as a **pattern**, copied
  deliberately; the two platforms share a host, not a codebase.
- **D5** — The pilot absorbs *operational subsets* of EPIC-006, 009, 010 and 012 and consumes
  EPIC-015's authority vocabulary. It closes **none** of them; each keeps its own § Closed-when, per
  roadmap §10.

## Open questions

- **Does the run-outcome vocabulary minted here bind EPIC-008's portable protocol, or is it internal
  to the pilot?** Minting two competing `RunSummary` shapes is the failure to avoid. → ruled at the
  G2 of the sprint that ships typed outcomes, jointly with `TASK-297`, which carries the same question
  on the lean-flow side.
- **What does Git own versus the durable store?** Artifacts and source are Git-authoritative; live
  queue state is not. The boundary needs stating before the first write path. → **ADR-042**, owed at
  the first member sprint's G2.
- **What exactly does the runtime adapter contract promise?** → **ADR-043**, owed with D3's fake
  adapter, since the fake is what makes the promise testable.
- **How is an approval bound to identity, revision and scope such that a worker cannot forge one?**
  Closes audit findings F01 and F02. → **ADR-044**, owed before the Approval Inbox ships.
- **Is Postgres provisioned on the shared VPS?** The reference platform runs SQLite WAL, so this is
  new host state, not an inherited one. → a measurement, resolved in the first member sprint's
  environment validation, not by ruling (L-094).

## Closed when
<!-- Sourced from roadmap §9. Each is observable on the pilot deployment, not on a fixture. -->

- [ ] A normal task can be created, run, monitored, decided and inspected **end-to-end from the
      dashboard**, without opening a terminal for the normal path
- [ ] An approval carrying the wrong identity, revision or scope is **rejected**, and a `J2` task
      takes no new action before authority exists
- [ ] Tool and resource scope is genuinely enforced: a worker cannot alter its own grant, forge
      verification evidence, or reach controller credentials
- [ ] Failed **or incomplete** verification prevents automatic acceptance — an absent verdict is not
      read as zero failures
- [ ] Stop and stop-all terminate managed processes and record the matching status; effects already
      committed remain traceable
- [ ] Two independent runs proceed concurrently while conflicting work waits, and no double-dispatch
      occurs under duplicate events
- [ ] Restart or disconnect never silently duplicates work or leaves a run *appearing* successful;
      unknown status is flagged and reconciled before retry
- [ ] Queue, approvals, results and material events survive a service restart, and an operator can
      follow the recovery runbook unaided
- [ ] **At least 10 real tasks across two repositories**, covering success, revision and human
      escalation, plus the negative tests above run separately
