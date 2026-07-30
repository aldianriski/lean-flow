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

> **SPRINT-035 — contract-hardening** → docs/sprint/SPRINT-035-contract-hardening.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-110 — Harden the task schema with formal depends-on and class fields  [size: M] [risk: med] [HITL]
      done-when: the task entry shape (CONTEXT.md § Task entry shape · /task-decomposer · TODO.md
                 header · SPRINT.md.template) carries `depends-on:` and `class:` (decision |
                 execution | mechanical-ingest); /orchestrator dispatch reads both (parallel-wave
                 check uses depends-on · tier routing reads class); qa-check.sh fails an active-
                 sprint task missing a mandatory field (done-when · touches · state · class ·
                 depends-on-or-none · HITL/AFK tag)
      touches: .claude/CONTEXT.md · skills/task-decomposer · skills/orchestrator (+ references/dispatch.md) ·
               skills/lean-doc-generator/templates/SPRINT.md.template · TODO.md header · scripts/qa-check.sh · docs/QA.md
      assumes: [HITL|AFK] already covers autonomy — no new field, lint only; persisting class at
               intake shifts classification earlier than ADR-010's dispatch-time model — reconcile
               at G2; the review's YAML shape is illustrative — markdown shape stays; SKILL line
               caps hold (overflow → references/ per ADR-006)
      tracker: none — external review item 1 (schema/runtime mismatch)
      state:   ready

- [ ] TASK-111 — Decide the machine-state-artifact fork (execution graph · run-state · run events)  [size: M] [risk: med] [HITL]
      done-when: a /council verdict + ADR records adopt/defer/reject for each of (a) compiled
                 sprint DAG artifact, (b) checkpointed run-state file, (c) structured run-event
                 log — with revisit-if conditions; accepted items graduate to TASK-NNN, rejected
                 route to .out-of-scope/
      touches: docs/adr/ · docs/ (verdict) — decision only, no runtime code
      assumes: all three share one fork — first machine-readable state files in a markdown-first
               plugin (same axis council-2 held on TASK-040); night-run + fleet recovery is the
               strongest motivating use case
      tracker: none — external review items 2·3·6, folded per delta map
      state:   ready

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

- [ ] TASK-112 — Fix the QA template-count claim and lint QA.md against qa-check.sh  [size: S] [risk: low] [AFK]
      done-when: docs/QA.md claims 2 non-core templates (DESIGN, QA-TESTCASE) matching
                 qa-check.sh's noncore constant, and the script's claim-consistency checks
                 include docs/QA.md's own counts (future drift fails the run); qa-check passes
      touches: docs/QA.md · scripts/qa-check.sh
      assumes: the script (noncore=2) is correct and QA.md is stale — verified 2026-07-30
      tracker: none — external review, verified doc defect
      state:   ready

- [ ] TASK-113 — Align agent-review terminology across surfaces  [size: S] [risk: low] [HITL]
      done-when: CONTEXT.md no longer both claims isolated /code-review passes and "no review
                 agent" — replaced by one precise statement (gates = inline human-approved
                 checklists · code review may dispatch built-in/ad-hoc isolated subagents · no
                 custom agent definitions shipped); every "ships no agents" phrasing (CLAUDE.md ·
                 CONTEXT.md · README · ARCHITECTURE.md) reads "no custom agent definitions";
                 qa-check passes
      touches: .claude/CONTEXT.md · .claude/CLAUDE.md · README.md · docs/ARCHITECTURE.md
      assumes: merges two review items (review-agent contradiction + "ships no agents" wording) —
               same wording sweep over the same four files
      tracker: none — external review, verified doc defect
      state:   ready

- [ ] TASK-114 — Resolve TD-010: remove repo-local paths from the shipped night-run reference  [size: S] [risk: low] [HITL]
      done-when: skills/orchestrator/references/night-run.md contains no repo-local docs/… path;
                 both citations are replaced with consumer-legible self-contained wording; TD-010
                 closed in TECH-DEBT.md
      touches: skills/orchestrator/references/night-run.md · TECH-DEBT.md
      assumes: none
      tracker: TD-010
      state:   ready

- [ ] TASK-115 — Revise the harness-engineering verdict to name operational keepers  [size: S] [risk: low] [HITL]
      done-when: docs/research/harness-engineering-adaptation.md's verdict reads "no new core
                 stages, but operational keepers" (or equivalent), listing behavioral evals ·
                 machine-readable scheduling/recovery state · maintenance recipe as keepers with
                 pointers to TASK-111 / TASK-116
      touches: docs/research/harness-engineering-adaptation.md
      assumes: conceptual equivalence ≠ operational equivalence — the original "no keepers"
               verdict conflated the two
      tracker: none — external review, verified against the research doc
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
                 dispatch", and the rule is traced once against SPRINT-035's stale-HEAD incident
                 (would it have caught it?) — ADR-013's prose-cure leg
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
