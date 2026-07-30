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

> **SPRINT-037 — gates-and-evals** → docs/sprint/SPRINT-037-gates-and-evals.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

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

- [ ] TASK-121 — Productionize the dispatch preflight (cycles · single-owner · base-ref · waves)  [size: S] [risk: low] [HITL]
      class:      execution
      depends-on: none
      done-when: the pre-dispatch gate ships per the ADR-013 addendum — three checks + wave
                 computation as a step in the dispatch procedure, negative-tested per L-058, and
                 fired once on a real sprint before a parallel wave
      touches: skills/orchestrator/references/dispatch.md · (script home decided at G2 — consumer
               surface: shipped-in-plugin vs host-repo script is the open design question)
      assumes: T2's prototype design is the spec (163-line POSIX sh proved all four derivations);
               L-015/L-016 bind whatever ships
      tracker: ADR-013 addendum
      state:   ready

- [ ] TASK-122 — Add /handoff to the night-run allowlist builder  [size: S] [risk: low] [HITL]
      class:      execution
      depends-on: none
      done-when: night-run.md Part 1's allowlist builder includes the /handoff invocation so a
                 headless run can complete its clean-halt protocol; verified when the next headless
                 probe reaches /handoff without a denied-tool record
      touches: skills/orchestrator/references/night-run.md
      assumes: T4's probe denial is the trigger evidence; halt-via-Execution-Log stays the fallback
      tracker: none — SPRINT-036 T4 probe finding
      state:   ready

- [ ] TASK-117 — Design the capability preflight  [size: S] [risk: low] [HITL]
      done-when: the preflight surface is decided (extend /prime vs night-run Part 0) and its
                 capability checks are specified behavior-first with degrade rules (no worktree →
                 sequential · no ask channel → park HITL · plugin-cache mismatch → block
                 unattended); graduates to an implementation TASK-NNN
      touches: skills/orchestrator/references/night-run.md (Part 0 pre-flight — surface resolved
               at SPRINT-037 promote: extend the existing pre-flight, no /prime flag)
      assumes: TASK-106's probe answered the open question (checks work; the gap was the allowlist);
               map the delta vs existing Part 0 checks before adding anything
      tracker: none — external review item 5
      state:   ready (needs-info resolved 2026-07-30: owner picked night-run Part 0)

- [ ] TASK-123 — Implement the night-run capability probes (graduated from TASK-117's spec)  [size: S] [risk: low] [HITL]
      class:      execution
      depends-on: none
      done-when: the three live capability checks specified in night-run.md Part 1 § Capability checks
                 are actually probed at pre-flight rather than read as prose — agent-dispatch
                 availability · worktree usability + leftover sweep · installed-skill-version vs repo
                 manifest — each emitting its named finding, negative-tested per L-058, and fired
                 once on a real pre-flight before an unattended run (L-007)
      touches: skills/orchestrator/references/night-run.md (Part 1) · form per G2 — the T1 precedent
               (procedure step + optional inline snippet, no new shipped file) is the default
      assumes: the version check is the load-bearing one (it blocks; the other two degrade) — build it
               first and ship it alone if the other two prove not worth probing
      tracker: none — graduated from TASK-117 / SPRINT-037 T4 spec
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
