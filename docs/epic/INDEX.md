---
owner: Maintainer
last_updated: 2026-08-25
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
owner, and holds the admission condition for each future epic. **EPIC-009 · 010 · 011 · 012 · 013 were
written as files on 2026-08-25 at owner request**, having previously been register rows only — each one
carries its own **unmet** admission condition in a callout and states that it is not promotable. The
register, not the file, is still the gate: a destination written down is not work admitted. Phase H and
Outcome Feedback reserve no id and remain rows. The live
phase ordering it implements is `03-ADLC-ROADMAP.md` § **Roadmap Amendment** (2026-08-24), which
supersedes that document's earlier § Roadmap Adjustment block and the strategy README's sequence.

- [EPIC-015](EPIC-015-execution-autonomy.md) — Execution Autonomy: an approved Plan runs to a named terminal state without per-task confirmation — proposed 2026-08-24 · **supersedes SPRINT-082's execution-architecture freeze** — ruling now **in force**, written into the gated register 2026-08-24→**amended 2026-08-25** ([`adlc-epic-sequencing.md`](../research/adlc-epic-sequencing.md) § *The core execution architecture is FROZEN*); the freeze re-arms after V3 §56's dogfoods · **admissible now** — its two gates (freeze amendment · sequenced after SPRINT-083) are both met, so it may run as a **second stream alongside EPIC-014**, with `.claude/CONTEXT.md` single-owned at G2
- [EPIC-014](EPIC-014-reference-engine.md) — Reference Engine: conformance + QA evaluated by a typed TS/Bun implementation, Shell retired — **active** 2026-08-24 · **sequenced ahead of EPIC-005** (owner ruling 2026-08-24) · SPRINT-083 promoted
- [EPIC-013](EPIC-013-managed-adlc.md) — Managed ADLC: Runs dispatched to registered workers on a schedule, inside declared budgets and capability policy — proposed 2026-08-25 · **admission NOT met** (all nine `06 § 9` exit criteria `[x]` — currently 0 of 9 — plus 010 · 011 · 012 closed) · holds the who-owes-which table for those nine criteria
- [EPIC-012](EPIC-012-runtime-adapters-gateway.md) — Runtime Adapters + Gateway: a second runtime executes a lean-flow workflow — proposed 2026-08-25 · **admission NOT met** (Platform Decision Gate · EPIC-008 stable · **one named second-runtime workflow** — a protocol existing is not a gateway being needed, `00 § 5.4`)
- [EPIC-011](EPIC-011-context-cost-policy.md) — Context & Cost Policy: memory/context/cost governed by declared policy, enforced only where a runtime seam exists — proposed 2026-08-25 · **admission NOT met** (gate · 006 · 008) · **policy before the gateway** (owner alignment 2026-08-24)
- [EPIC-010](EPIC-010-connected-workspace.md) — Connected Workspace: work flows both ways, with a Human Inbox and a Run Inspector — proposed 2026-08-25 · **admission NOT met** (gate · 008 stable · 009 shadow proof · a minimal identity/authority contract as a first-sprint ADR)
- [EPIC-009](EPIC-009-local-shadow-observability.md) — Local Shadow Observability: read-only local projection of run evidence, no DB and no control authority — proposed 2026-08-25 · **pre-gate** · **admission NOT met** (EPIC-006 records consumed across two real sprints) · owes the **platform repository boundary ADR** at its first G2
- [EPIC-008](EPIC-008-run-protocol.md) — Run Protocol: portable work-system ↔ runtime contract, objects derived from recorded events — proposed 2026-08-24 · Lane 2 · gated on 006 (+ 005, Phase C)
- [EPIC-007](EPIC-007-workflow-packs.md) — Workflow Packs: expertise reusable without the plugin — proposed 2026-08-24 · Lane 2 · pulled ahead of Phase D; buys decision-gate condition 6
- [EPIC-006](EPIC-006-run-evidence.md) — Run Evidence: every run leaves machine-readable evidence — proposed 2026-08-23 · Lane 2 · re-enters ADR-013 (c) and must supersede it first
- [EPIC-005](EPIC-005-fleet.md) — Fleet: one standard governing N repos — proposed 2026-08-10 · **Lane 1** · depends on 003 + 004 (both now closed) · **admission condition (owner ruling 2026-08-25): EPIC-014 *and* EPIC-015 must both be closed** — every § Closed-when `[x]`, including 014's Shell-engine deletion and 015's re-armed freeze. Hardening precedes fleet scale-out. This supersedes the looser "follows EPIC-014" wording of the 2026-08-24 ruling, which did not say whether "follows" meant the epic closing or merely the sprint in flight
- [EPIC-004](archive/EPIC-004-conformance.md) — Conformance: the standard becomes checkable — closed 2026-08-23 · SPRINT-072 → SPRINT-080 (all five Closed-when `[x]`; 51 of 51 rules map to a check or carry a non-evaluated mark · ADR-027/028)
- [EPIC-003](archive/EPIC-003-the-standard.md) — The Standard: a versioned spec, separable from the plugin — closed 2026-08-16 · SPRINT-069 → SPRINT-071 (all five Closed-when `[x]`; spec/ v0.3.0 · ADR-023/024/025)
- [EPIC-002](archive/EPIC-002-make-room.md) — Make Room: subtraction that unblocks the roadmap — closed 2026-08-15 · SPRINT-062 → SPRINT-065 (all four Closed-when `[x]`)
- EPIC-001 — Parallel Worktree Fleet — closed 2026-08-09 · SPRINT-025 → SPRINT-026 (retro-fitted)
