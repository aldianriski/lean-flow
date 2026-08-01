---
owner: Maintainer
last_updated: 2026-08-01
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

> **SPRINT-043 — Proof Run** → docs/sprint/SPRINT-043-proof-run.md

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-135 — Add an observed third source to the declaration cross-check  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  the gate compares the **actually changed** file set for the active sprint against the
                  union of its tasks' declared `Layers:`, reporting any file changed but undeclared.
                  Unlike the two existing sources this one is *observed*, not authored, so it cannot be
                  forgotten — it reads what happened rather than what someone predicted at promote.
                  Negative-tested using SPRINT-042's own recorded miss as the must-FAIL fixture (a new
                  checker file was created during implementation and never declared, and the existing
                  prose-based check passes that Plan regardless); fixtures retained (L-058)
      touches:    the qa gate script and its extracted-checker directory · the gate's leg inventory doc ·
                  the retained eval fixture set
      depends-on: none
      assumes:    the comparison base is the sprint's recorded plan commit, so "changed this sprint" is
                  well-defined without a second source of truth; a file changed by the coordinator's own
                  close bookkeeping is expected noise and needs an explicit, reasoned exclusion rather
                  than a silent one
      tracker:    TD-022 · L-074
      state:      ready

- [ ] TASK-136 — Make the generated knowledge index survive a failed write  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  an interrupted or failed generation leaves the **previous** index intact instead of a
                  truncated one — write to a temporary file in the same directory, then move it into
                  place, so the swap is atomic. Verified by simulating a mid-write failure and
                  confirming the prior file survives byte-identical, not merely that a normal run works
      touches:    the index generator script
      depends-on: none
      assumes:    same-directory rename is atomic on the target filesystem; if it is not, the check
                  degrades to reporting rather than silently claiming a guarantee it cannot make
      tracker:    TD-021
      state:      ready

- [ ] TASK-134 — Fire an unattended proof run and record its calibration row  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  an unattended run executes a promoted Plan end-to-end and **lands** its work — the
                  claim SPRINT-042 shipped but could not itself test, since the sprint that fixes the
                  landing path cannot be the sprint that proves it. Its morning rollup carries the
                  calibration row (cost · turns · wall-clock · units · shape) as row two of the series,
                  and any denial it hits is recorded against which allowlist source failed to derive it
      touches:    the active sprint's execution log · the unattended reference's calibration table
      depends-on: none
      assumes:    the four-source derivation now covers the landing path; a denial at merge-back would
                  falsify that directly, which is the point of running it rather than reasoning about it
      tracker:    SPRINT-042 Retro · L-072 · L-073
      state:      blocked
      blocked-on: a promoted sprint whose tasks are all AFK-class and whose pre-flight passes green —
                  unblocks at the next promote that meets it; do not fire against an unpromoted Plan

### P2 — Quality / Polish

### P3 — Long-term

> TASK-120 (checkpointed run-state) → routed to `.out-of-scope/checkpointed-run-state.md` (2026-07-30) — ADR-013's kill-switch fired: the promotion trigger (a real unattended run the Execution Log + `/handoff` could not resume) stayed unfired through the 5-sprint window; revisit-if + the reconciliation-rule precondition recorded. Learning: L-068.
> TASK-040 (derived graph view) → routed to `.out-of-scope/derived-graph-view.md` (2026-07-29) — council-2 gate held; the TASK-041 retrieval-miss signal never fired; graphify serves the need ad-hoc (revisit-if + 3 guardrails recorded).
> TASK-047 (council multi-model backend) → routed to `.out-of-scope/council-multi-model-backend.md` (2026-07-29) — TASK-048 + TASK-065 probes found no exposed crack; revisit-if: a cross-provider test shows a real shared factual error (BYO-provider seam only).
> TASK-006 (gate-guard hook) → decided 2026-07-29, SPRINT-030 — **ADR-011: no gate enforcement** (in-core hook killed by platform fact; sibling plugin YAGNI) · trail: `.out-of-scope/gate-guard-hook.md` (revisit-if recorded) · facts: `docs/research/pretooluse-gate-guard.md`.
> TASK-007 (tuned recon agent) → routed to `.out-of-scope/tuned-recon-agent.md` (2026-06-12) — `Explore` is the universal recon agent and sufficient; the lever is *optimal usage* (already wired: tier-routing + scoped recon brief; ADR-002).

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — Sprint history → [`CHANGELOG.md`](CHANGELOG.md) (rotated archives → `docs/changelog/`).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```
