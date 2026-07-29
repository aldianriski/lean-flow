---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt lives in root **`TECH-DEBT.md`**: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> **SPRINT-033 — Unattended-Run Contract** → [docs/sprint/SPRINT-033-unattended-run-contract.md](docs/sprint/SPRINT-033-unattended-run-contract.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-100 — Encode the unattended-run contract (AFK/HITL boundary + park protocol)  [size: M] [risk: med] [HITL]
      done-when: night-run.md states the mode signal (unattended is declared, never inferred), the derivation rule (AFK-safe = additive + reversible + already-approved-in-scope; HITL = approval · judgement · lossy · scope-changing), the HITL boundary table, absence≠consent, and the park protocol (park record → continue disjoint AFK → clean halt)
      touches: skills/orchestrator/references/night-run.md
      assumes: charter = execute-only + park (owner call, this session); mechanism unchanged from docs/research/night-run.md
      tracker: none — safety fix found in a real overnight run
      state:   ready

- [ ] TASK-101 — Add the unattended contract to the CONTEXT.md SSOT  [size: S] [risk: low] [AFK]
      done-when: .claude/CONTEXT.md carries the charter + absence≠consent + park in ≤8 lines, pointing to night-run.md for the operational detail; no duplication of the table
      touches: .claude/CONTEXT.md
      assumes: CONTEXT stays under its cap (ADR-007)
      tracker: none
      state:   ready

- [ ] TASK-102 — Wire the park protocol into /orchestrator + /flow  [size: S] [risk: low] [AFK]
      done-when: sprint-bulk steps 4–5 park instead of asking under unattended; a red flag forbids reading a denied/unanswerable question as approval; /flow states that only stage 4 (Build) runs unattended — stages 2·3·5 park
      touches: skills/orchestrator/SKILL.md · skills/flow/SKILL.md
      assumes: line caps hold (≤110 procedure+scaffolding)
      tracker: none
      state:   ready

- [ ] TASK-103 — Wire the park protocol into /lean-doc-generator + /triage  [size: S] [risk: low] [AFK]
      done-when: promote's governance sign-off and close's §11 retention/doc-freshness each state the unattended park; /triage's HITL apply parks rather than waiting on a `y` that never comes
      touches: skills/lean-doc-generator/SKILL.md · skills/triage/SKILL.md
      assumes: these are the two steps the real overnight run actually hit
      tracker: none
      state:   ready

- [ ] TASK-104 — Surface night-run + the unattended contract on the consumer face  [size: S] [risk: low] [AFK]
      done-when: README documents the unattended path and its charter (today it says nothing about night-run); CHANGELOG entry + plugin.json/marketplace.json MINOR bump in lockstep
      touches: README.md · docs/CHANGELOG.md · .claude-plugin/plugin.json · .claude-plugin/marketplace.json
      assumes: feature sprint → MINOR by hand (release-patch is PATCH-only)
      tracker: none
      state:   ready

- [ ] TASK-105 — Exercise the park protocol on a real headless run  [size: S] [risk: med] [HITL]
      done-when: a real `claude -p --permission-mode dontAsk` run is fired at a HITL step and observed to park (log line + clean exit) rather than self-approve or stall; the transcript is recorded in the sprint Execution Log
      touches: (no source change — verification run)
      assumes: closes the spec-only-debt trap (L-007) — the contract must fire once on real input
      tracker: none
      state:   ready

### P2 — Quality / Polish

### P3 — Long-term

- [ ] TASK-074 — Migrate lean-flow's own repo to the ADR-012 canonical layout  [size: S] [risk: low] [HITL]
      done-when: /lean-doc-generator migrate re-run relocates this repo's legacy-lean docs (docs/ARCHITECTURE.md → docs/architecture/overview.md · docs/CHANGELOG.md → root · + inbound-link fixes) via the Legacy-lean mapping block, propose→approve; /prime + qa-check pass on the new layout
      touches: docs/ · README.md · .claude/CONTEXT.md · scripts/qa-check.sh (path expectations)
      assumes: deferred from SPRINT-032 (A1 — consumer surface shipped first); dogfoods the Legacy-lean relocation path
      tracker: none — internal housekeeping
      state: ready

> TASK-040 (derived graph view) → routed to `.out-of-scope/derived-graph-view.md` (2026-07-29) — council-2 gate held; the TASK-041 retrieval-miss signal never fired; graphify serves the need ad-hoc (revisit-if + 3 guardrails recorded).
> TASK-047 (council multi-model backend) → routed to `.out-of-scope/council-multi-model-backend.md` (2026-07-29) — TASK-048 + TASK-065 probes found no exposed crack; revisit-if: a cross-provider test shows a real shared factual error (BYO-provider seam only).
> TASK-006 (gate-guard hook) → decided 2026-07-29, SPRINT-030 — **ADR-011: no gate enforcement** (in-core hook killed by platform fact; sibling plugin YAGNI) · trail: `.out-of-scope/gate-guard-hook.md` (revisit-if recorded) · facts: `docs/research/pretooluse-gate-guard.md`.
> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to `docs/CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprint history → [`docs/CHANGELOG.md`](docs/CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
