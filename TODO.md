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

> **SPRINT-034 — Night-Run Entry Path** → [`docs/sprint/SPRINT-034-night-run-entry-path.md`](docs/sprint/SPRINT-034-night-run-entry-path.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-107 — Clear SSOT headroom in both capped files (resolves TD-009)  [size: M] [risk: med] [HITL]
      done-when: .claude/CONTEXT.md and skills/orchestrator/SKILL.md each sit ≥10 lines under their
                 qa-check hard caps (130 / 110) with zero rules lost — prose duplicating CLAUDE.md/README
                 collapsed to pointers, procedure depth relocated into references/ per the L-012 pattern;
                 `sh scripts/qa-check.sh` green including its roster/claim checks; TECH-DEBT.md TD-009 →
                 status: resolved → TASK-107
      touches:   .claude/CONTEXT.md · skills/orchestrator/SKILL.md · skills/orchestrator/references/ · TECH-DEBT.md
      assumes:   every deletion is propose→approve, never silent (CLAUDE.md: don't delete content you
                 didn't touch); relocation target for orchestrator depth is an existing references/ file,
                 not a new one — confirm at G2
      tracker:   none — TD-009, the L-008/TD-006 accretion signal firing a second time
      state:     ready

- [ ] TASK-108 — Wire the night-run interactive launcher: prepare before spawn  [size: M] [risk: med] [HITL]
      done-when: given "run a night run for <un-promoted intent>" the interactive session runs
                 feed → plan → pre-flight (decompose → triage → promote → G1/G2 pre-sign) BEFORE any
                 background spawn, and refuses to fire the Part 2 trigger while pre-flight is red; the
                 rule is present and fires at all four wiring sites — orchestrator mode dispatch (a mode
                 keyword never bypasses the feed pipeline) · a named red flag (never spawn an unattended
                 run on an unpromoted Plan) · night-run.md Part 1a Entry path · CONTEXT.md § Unattended ·
                 /flow stage-4 entry clause — and the whole path is exercised once end-to-end on real
                 input (L-007), not spec-only
      touches:   skills/orchestrator/SKILL.md · skills/orchestrator/references/night-run.md ·
                 skills/flow/SKILL.md · .claude/CONTEXT.md
      assumes:   A4 — /flow needs an entry clause, not a stage-4 restructure (:38 already parks the
                 conducted headless case correctly); A5 — the rule is general ("a mode keyword never
                 bypasses the feed pipeline") with the unattended launcher as its sharp case, overlapping
                 but not replacing sprint-bulk step 0's guard. Both resolve at G2.
      depends-on: TASK-107 (both target files are at hard cap today)
      tracker:   none — L-020 "shipped ≠ wired" on the entry side of the SPRINT-033 contract
      state:     ready

### P2 — Quality / Polish

- [ ] TASK-106 — Verify the unattended contract from the installed plugin, not repo source  [size: S] [risk: low] [HITL]
      done-when: with v1.17.0 installed to the plugin cache, a headless `claude -p "/lean-flow:orchestrator sprint-bulk unattended" --permission-mode dontAsk` run meets a HITL step and parks — proving the contract ships, not just that it exists in the repo
      touches: (verification — no source change)
      assumes: SPRINT-033 T6 verified against repo source only; the cache held 1.16.1 at test time, so packaged behaviour is unverified (L-016: verify on the consumer path)
      tracker: none — closes the last unverified edge of SPRINT-033
      state:   ready

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
