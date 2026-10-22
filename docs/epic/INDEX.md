---
owner: Maintainer
last_updated: 2026-10-22
update_trigger: An epic is opened, or closed and archived (STANDARD §11)
status: current
---

# lean-flow — Epic Index

One line per epic (newest first). Active epics live here; closed ones move to
[`archive/`](archive/) once every member sprint has closed and been archived (§11).

**What a row may hold** (TD-163). A live row, one whose epic file is in `docs/epic/` and not `archive/`, holds the epic's
status (e.g. proposed · parked · closed in place) and a pointer to its file. It never holds a member-sprint pointer or a
tick count: progress lives in the epic file, and nothing updates this index when a member sprint is promoted or closes. An
archived row is a record frozen at archive; a "moved to workdoo" row is a record frozen at transfer, so any sprint state it
names is history, not a live claim.

An **epic** is a multi-sprint outcome with its own decision set — too big for one 400-line Plan,
outliving any single sprint file. Work that fits in one sprint is a sprint, not an epic; work whose
destination cannot yet be named is fog (`/task-decomposer --fog`) until it can.

**Sequencing, lanes and the gated register** → [`docs/research/adlc-epic-sequencing.md`](../research/adlc-epic-sequencing.md).
It holds the lanes, the execution freeze and the admission condition for each remaining lean-flow epic. **EPIC-006 · 008 · 009 · 011 · 012
are closed — superseded → workdoo** (EPIC-010 · 013 closed earlier, merged into EPIC-016; the platform/runtime layer is built in the separate `workdoo` repo, ADR-041 · ADR-052; owner ruling 2026-10-18,
EPIC-022 D1), closed in place with their Closed-when unticked: not delivered here. Still open on lean-flow's roadmap: **EPIC-005** (Fleet), `proposed`. **EPIC-007** (Workflow Packs) closed
2026-10-20 (SPRINT-132 → SPRINT-134). The register, not the file, is the gate: a destination written down is not work admitted.

- [EPIC-022](archive/EPIC-022-plans-that-work-for-any-consumer.md) — Plans That Work for Any Consumer: plan from a phased roadmap down to sprint tasks, with or without git, every plan row traceable and every G2 sign-off recorded — closed 2026-10-19 · SPRINT-125 → SPRINT-128 (all eight Closed-when `[x]`) · consumer maturity, the roadmap, git-less plans (ADR-054) and the planning-checker debt
- EPIC-020 → **moved to workdoo** [`docs/epic/EPIC-020`](https://github.com/aldianriski/workdoo/blob/main/docs/epic/EPIC-020-governed-agents-follow-the-lean-flow-loop.md) (2026-10-10, ADR-052) — Governed Agents Follow the Lean-Flow Loop: one sentence → clarify rounds → approved proposals → build → independent review (Codex, read-only) → keep, with one policy table — **proposed** 2026-10-06 · member sprints are **workdoo** sprints · after EPIC-019, before EPIC-018
- EPIC-019 → **moved to workdoo** [`docs/epic/EPIC-019`](https://github.com/aldianriski/workdoo/blob/main/docs/epic/EPIC-019-workdoo-works-like-a-work-management-tool.md) (2026-10-10, ADR-052) — workdoo Works Like a Work-Management Tool: the whole loop runs from one work-item screen in the DESIGN.md v0.2.0 "Gate Track" design, both themes, no separate approvals page — **proposed** 2026-10-06 · member sprints are **workdoo** sprints · after workdoo SPRINT-009, ahead of EPIC-018
- EPIC-018 → **moved to workdoo** [`docs/epic/EPIC-018`](https://github.com/aldianriski/workdoo/blob/main/docs/epic/EPIC-018-projects-span-repositories.md) (2026-10-10, ADR-052) — Projects Span Repositories, End to End: an operator adds a GitHub repo to a Project from the workdoo dashboard, and one work item delivers across several repos, all-or-nothing — **proposed** 2026-10-06 · member sprints are **workdoo** sprints (like EPIC-016) · sequenced after workdoo SPRINT-009
- [EPIC-017](archive/EPIC-017-work-items-that-fit.md) — Work Items That Do Not Outgrow Their File: decomposition never hits a length limit, because no single file accumulates the work — closed 2026-10-04 · SPRINT-106 → SPRINT-114 (all ten Closed-when `[x]`; 7 measured, verdict NOT demonstrated · 10 green under owner ruling) · released as **`2.0.0`** (`5f62d0f`), the hard cut onto the `docs/work/` store
- EPIC-016 → **moved to workdoo** [`docs/epic/EPIC-016`](https://github.com/aldianriski/workdoo/blob/main/docs/epic/EPIC-016-agentic-governance-dashboard-pilot.md) (2026-10-10, ADR-052) — Agentic Governance Dashboard Pilot: an operator creates, runs, monitors, decides on and accepts real agent work across two repos **entirely from a dashboard** — **active** 2026-09-09 · `workdoo SPRINT-001`…`SPRINT-007` **closed**; `SPRINT-008` **active** — phase 3 interface half · **P0, the critical path** per the 2026-09-09 roadmap revision, which reprioritises delivery around a usable dashboard and supersedes the prior platform-investment ordering · built in a **separate repository** (`workdoo`) with lean-flow consumed as a pinned plugin ([ADR-041](../adr/ADR-041-platform-repo-service-boundary.md)) · **admissible now** — it inherits no unmet gate, because it deliberately absorbs only *operational subsets* of EPIC-006 · 009 · 010 · 012 and closes none of them (roadmap §10) · member sprints live in `workdoo` and start at its own `SPRINT-001`
- [EPIC-015](archive/EPIC-015-execution-autonomy.md) — Execution Autonomy: an approved Plan runs to a named terminal state without per-task confirmation — closed 2026-10-12 · SPRINT-088 → SPRINT-124 (all eight Closed-when `[x]`) · the freeze it superseded re-armed, widened to governance machinery (ADR-053)
- [EPIC-014](archive/EPIC-014-reference-engine.md) — Reference Engine: conformance + QA evaluated by a typed TS/Bun implementation, Shell retired — **closed — retired (ADR-051)** 2026-10-06 · 2 of 8 § Closed-when met, the other 6 dropped, not met · six member sprints closed, newest **SPRINT-116** (`9fa6356`), which ruled the port cut · the Shell engine is the only engine
- [EPIC-013](EPIC-013-managed-adlc.md) — Managed ADLC: Runs dispatched to registered workers on a schedule, inside declared budgets and capability policy — **closed — merged into EPIC-016** 2026-10-07 · holds the who-owes-which table for the nine `06 § 9` exit criteria
- [EPIC-012](EPIC-012-runtime-adapters-gateway.md) — Runtime Adapters + Gateway: a second runtime executes a lean-flow workflow — **closed — superseded → workdoo** 2026-10-18 (owner ruling, EPIC-022 D1; ADR-052) · Closed-when unticked, not delivered here · closed in place
- [EPIC-011](EPIC-011-context-cost-policy.md) — Context & Cost Policy: memory/context/cost governed by declared policy, enforced only where a runtime seam exists — **closed — superseded → workdoo** 2026-10-18 (owner ruling, EPIC-022 D1; ADR-052) · Closed-when unticked, not delivered here · closed in place
- [EPIC-010](EPIC-010-connected-workspace.md) — Connected Workspace: work flows both ways, with a Human Inbox and a Run Inspector — **closed — merged into EPIC-016** 2026-10-07
- [EPIC-009](EPIC-009-local-shadow-observability.md) — Local Shadow Observability: read-only local projection of run evidence, no DB and no control authority — **closed — superseded → workdoo** 2026-10-18 (owner ruling, EPIC-022 D1; ADR-052) · Closed-when unticked, not delivered here · closed in place
- [EPIC-008](EPIC-008-run-protocol.md) — Run Protocol: portable work-system ↔ runtime contract, objects derived from recorded events — **closed — superseded → workdoo** 2026-10-18 (owner ruling, EPIC-022 D1; ADR-052) · Closed-when unticked, not delivered here · closed in place
- [EPIC-007](archive/EPIC-007-workflow-packs.md) — Workflow Packs: expertise reusable without the plugin — closed 2026-10-20 · SPRINT-132 → SPRINT-134 (all six Closed-when `[x]`; three packs: software-implementation · verification · solution-analysis; condition 5 ruled not satisfied by packs alone, so the roadmap's platform gate item 6 stays open; Outcome reworded at close, owner ruling)
- [EPIC-006](EPIC-006-run-evidence.md) — Run Evidence: every run leaves machine-readable evidence — **closed — superseded → workdoo** 2026-10-18 (owner ruling, EPIC-022 D1; ADR-052) · Closed-when unticked, not delivered here · closed in place
- [EPIC-005](EPIC-005-fleet.md) — Fleet: one standard governing N repos — proposed 2026-08-10 · **Lane 1** · depends on 003 + 004 (both now closed) · **admission condition: EPIC-015 must be closed** — every § Closed-when `[x]`, including its re-armed freeze (owner ruling 2026-10-07; EPIC-014's clause dropped by ADR-051, which retired it). Hardening precedes fleet scale-out · **parked 2026-10-21** (owner ruling): admitted by EPIC-015's close, but every Closed-when needs machinery ADR-053 freezes; waits on consumer evidence from an adopter that is not us, or an `L-NNN` ×2
- [EPIC-004](archive/EPIC-004-conformance.md) — Conformance: the standard becomes checkable — closed 2026-08-23 · SPRINT-072 → SPRINT-080 (all five Closed-when `[x]`; 51 of 51 rules map to a check or carry a non-evaluated mark · ADR-027/028)
- [EPIC-003](archive/EPIC-003-the-standard.md) — The Standard: a versioned spec, separable from the plugin — closed 2026-08-16 · SPRINT-069 → SPRINT-071 (all five Closed-when `[x]`; spec/ v0.3.0 · ADR-023/024/025)
- [EPIC-002](archive/EPIC-002-make-room.md) — Make Room: subtraction that unblocks the roadmap — closed 2026-08-15 · SPRINT-062 → SPRINT-065 (all four Closed-when `[x]`)
- EPIC-001 — Parallel Worktree Fleet — closed 2026-08-09 · SPRINT-025 → SPRINT-026 (retro-fitted)
