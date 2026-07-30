---
owner: Maintainer
last_updated: 2026-07-30
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

> **SPRINT-036 — preflight-and-verify** → docs/sprint/SPRINT-036-preflight-and-verify.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-109 — Cold-read SPRINT-034's shipped wording from a fresh session  [size: S] [risk: low] [HITL]
      done-when: the four surfaces SPRINT-034 edited (orchestrator intake routing + spawn red flag ·
                 night-run Part 1a + Part 2 precondition · CONTEXT § Unattended clause · /flow launcher
                 bullet) are read in a session that did not write them, and either confirmed unambiguous
                 or corrected — closing the L-006 fresh-context leg that SPRINT-034 could not run
      touches: (review — correction only if the cold read finds a gap)
      assumes: SPRINT-034's L-007 exercise was an author-run text trace; AgentTool dispatch was disabled
               by owner policy that session, so no independent reader checked the wording (L-006)
      tracker: none — closes SPRINT-034's stated verification gap
      state:   ready

- [ ] TASK-106 — Verify the unattended contract from the installed plugin, not repo source  [size: S] [risk: low] [HITL]
      done-when: with the **current** release installed to the plugin cache (verify the cache version first — don't assume it matches the repo), a headless `claude -p "/lean-flow:orchestrator sprint-bulk unattended" --permission-mode dontAsk` run meets a HITL step and parks — proving the contract ships, not just that it exists in the repo
      touches: (verification — no source change)
      assumes: SPRINT-033 T6 verified against repo source only; the cache held 1.16.1 at test time, so packaged behaviour is unverified (L-016: verify on the consumer path). Version left unpinned deliberately — a pinned version goes stale at every release (L-048)
      tracker: none — closes the last unverified edge of SPRINT-033
      state:   ready

- [ ] TASK-116 — Prototype one behavioral eval fixture end-to-end  [size: S] [risk: low] [HITL]
      done-when: one safety eval (unattended run parks HITL work) runs headless against the
                 installed plugin and asserts behavior (files written · state transitions · exit
                 status), never prose; the captured answer (harness shape · cost · worth-it?)
                 either decomposes the full eval suite or rejects it with a revisit-if
      touches: evals/ (throwaway per /prototype discipline) · capture → docs/research/ or ADR
      assumes: answers ONE question — is a behavioral eval harness feasible and cheap?; can share
               TASK-106's headless fixture
      tracker: none — external review item 4, tracer bullet before committing to a suite
      state:   ready

- [ ] TASK-118 — Add the base-ref branching rule to dispatch  [size: S] [risk: low] [HITL]
      class:      execution
      depends-on: none
      done-when: dispatch/night-run procedure states "every worktree branches from the current
                 wave's declared base commit, verified against live HEAD at spawn; mismatch halts
                 dispatch", and the rule is traced once against the 2026-07-30 stale-HEAD incident
                 (L-055 — would it have caught it?) — ADR-013's prose-cure leg
      touches: skills/orchestrator/references/dispatch.md · night-run.md
      assumes: the rule is the root-cause fix; any DAG artifact is enforcement only (ADR-013)
      tracker: ADR-013
      state:   ready

- [ ] TASK-119 — Prototype the no-JSON dispatch preflight (cycles · single-owner · base-ref)  [size: S] [risk: low] [HITL]
      class:      execution
      depends-on: TASK-118
      done-when: a bash/prose preflight derives cycle check + shared-file single-owner check +
                 base-ref-vs-HEAD check directly from the active sprint's markdown Plan and is
                 exercised once against a real sprint; captured answer decides whether the JSON
                 DAG format is admitted (insufficient rung) or rejected (sufficient) — ADR-013's
                 laziness-ladder precondition for artifact (a)
      touches: (prototype — throwaway per /prototype discipline; capture → ADR-013 addendum)
      assumes: prose+script may already cover artifact (a)'s value; JSON only if this rung fails
      tracker: ADR-013
      state:   ready

- [ ] TASK-120 — Build the checkpointed run-state file (deferred by ADR-013)  [size: M] [risk: med] [HITL]
      class:      execution
      depends-on: none
      done-when: (deferred — do not build) run-state ships per ADR-013's graduation contract:
                 reconciliation rule first (run-state = cache of the Execution Log; the log always
                 wins; rebuildable from the log alone), then idempotent resume
      touches: (unbuilt — design at graduation)
      assumes: promotion trigger: one real unattended run the Execution Log + /handoff could not
               cleanly resume. EXPIRY: trigger unfired by SPRINT-040 promote → close as rejected,
               note in LEARNINGS (ADR-013 kill-switch)
      tracker: ADR-013
      state:   blocked (unblock: the promotion trigger fires — a real unresumable run)

- [ ] TASK-117 — Design the capability preflight  [size: S] [risk: low] [HITL]
      done-when: the preflight surface is decided (extend /prime vs night-run Part 0) and its
                 capability checks are specified behavior-first with degrade rules (no worktree →
                 sequential · no ask channel → park HITL · plugin-cache mismatch → block
                 unattended); graduates to an implementation TASK-NNN
      touches: (design only — surface TBD)
      assumes: partial overlap with night-run Part 0 pre-flight and TASK-106 — map the delta
               before adding anything
      tracker: none — external review item 5
      state:   needs-info (open: which surface owns it; whether TASK-106's result changes the need)

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
