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

_(none active)_ — SPRINT-039 closed 2026-07-30. Next: `/lean-doc-generator promote` from the Backlog below.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-127 — Report installed-skill freshness in the /prime health line  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  /prime emits a `Skills:` row comparing the base-dir version from its own invocation
                  header against `.claude-plugin/plugin.json` — printing `fresh`, `STALE — reinstall
                  before trusting any procedure`, or `n/a (no local plugin repo)`; the STALE branch is
                  demonstrated actually firing against a manifest whose version differs (a freshness
                  row that can only print `fresh` is the silent false-negative L-058 names), and the
                  n/a branch against a repo with no plugin manifest
      touches:    skills/prime/SKILL.md (read order + Steps + Output format + version bump) · README
                  /prime blurb + CHANGELOG (user-visible) · TECH-DEBT.md TD-015 resolution
      depends-on: none
      assumes:    version-only by decision — the unbumped-content-edit blind spot is accepted here and
                  stays covered on the unattended path by night-run.md's content-first check; the
                  base-dir version is readable at runtime (verified live) and covers the whole roster
                  (one version-scoped install root); a consumer with no plugin checkout gets `n/a`,
                  never a false alarm (L-015)
      tracker:    TD-015
      state:      ready

- [ ] TASK-128 — Make migrate/init write a park record when they decline unattended  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  a headless `migrate` and a headless `init` that hit a per-item approval each produce
                  the Part 0 step-2 artifact — a park record in the `/handoff` doc naming the parked
                  item and its unblock condition — instead of declining in prose only; proven by
                  re-running the retained `migrate-park` and `init-park` fixtures and reading the
                  handoff doc at the path the run prints; `assert-noaction-park.sh`'s in-repo negative
                  half still passes unchanged, and each fixture's README stops recording the gap as
                  observed
      touches:    skills/lean-doc-generator/SKILL.md § Unattended (≈4 lines of cap headroom — overflow
                  goes to references/, ADR-006) · evals/fixtures/*-park READMEs · TECH-DEBT.md TD-017
                  resolution
      depends-on: none
      assumes:    the positive half is verified from the temp-dir handoff artifact, not asserted
                  in-repo (assert-noaction-park.sh deliberately covers only the deterministic in-repo
                  half); two real headless runs cost ≈$0.4–0.5 each (SPRINT-039 T1 measured)
      tracker:    TD-017
      state:      ready

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
