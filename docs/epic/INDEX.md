---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: An epic is opened, or closed and archived (STANDARD §11)
status: current
---

# lean-flow — Epic Index

One line per epic (newest first). Active epics live here; closed ones move to
[`archive/`](archive/) once every member sprint has closed and been archived (§11).

An **epic** is a multi-sprint outcome with its own decision set — too big for one 400-line Plan,
outliving any single sprint file. Work that fits in one sprint is a sprint, not an epic; work whose
destination cannot yet be named is fog (`/task-decomposer --fog`) until it can.

**Sequencing, lanes and the gated register** → [`docs/research/adlc-epic-sequencing.md`](../research/adlc-epic-sequencing.md).
It maps the remaining ADLC roadmap phases onto epics, assigns the two parallel lanes and their shared-file
owner, and holds the admission condition for each future epic that is deliberately *not* a file yet
(EPIC-009 · 010 · 011 · 012 · 013, and Phase H, which reserves no id).

- [EPIC-008](EPIC-008-run-protocol.md) — Run Protocol: portable work-system ↔ runtime contract, objects derived from recorded events — proposed 2026-08-24 · Lane 2 · gated on 006 (+ 005, Phase C)
- [EPIC-007](EPIC-007-workflow-packs.md) — Workflow Packs: expertise reusable without the plugin — proposed 2026-08-24 · Lane 2 · pulled ahead of Phase D; buys decision-gate condition 6
- [EPIC-006](EPIC-006-run-evidence.md) — Run Evidence: every run leaves machine-readable evidence — proposed 2026-08-23 · Lane 2 · re-enters ADR-013 (c) and must supersede it first
- [EPIC-005](EPIC-005-fleet.md) — Fleet: one standard governing N repos — proposed 2026-08-10 · **Lane 1** · depends on 003 + 004 (both now closed)
- [EPIC-004](archive/EPIC-004-conformance.md) — Conformance: the standard becomes checkable — closed 2026-08-23 · SPRINT-072 → SPRINT-080 (all five Closed-when `[x]`; 51 of 51 rules map to a check or carry a non-evaluated mark · ADR-027/028)
- [EPIC-003](archive/EPIC-003-the-standard.md) — The Standard: a versioned spec, separable from the plugin — closed 2026-08-16 · SPRINT-069 → SPRINT-071 (all five Closed-when `[x]`; spec/ v0.3.0 · ADR-023/024/025)
- [EPIC-002](archive/EPIC-002-make-room.md) — Make Room: subtraction that unblocks the roadmap — closed 2026-08-15 · SPRINT-062 → SPRINT-065 (all four Closed-when `[x]`)
- EPIC-001 — Parallel Worktree Fleet — closed 2026-08-09 · SPRINT-025 → SPRINT-026 (retro-fitted)
