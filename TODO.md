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

> _None._ SPRINT-043 closed 2026-08-01.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-137 — Decide and apply the MINOR release for SPRINT-043  [size: S] [risk: low] [HITL]
      class:      decision
      state:      ready
      done-when:  the version reflecting SPRINT-043 is chosen and applied — `plugin.json` +
                  `marketplace.json` bumped in lockstep, and `CHANGELOG.md`'s Unreleased block
                  retitled to that version. **Owner-reserved:** SPRINT-043 shipped a new capability
                  (the observed-layers gate), so `/release-patch` does not apply — it is PATCH-only.
                  The unattended run parked this rather than bumping: no release task was in the
                  frozen Plan, and a version choice is judgement, not execution.
      notes:      raised by SPRINT-043 close. See also TD-023 · TD-024, either of which the owner may
                  want folded in before cutting the release.

- [ ] TASK-138 — Derive the night-run allowlist into the project settings file  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the unattended pre-flight says the four-source derivation lands in the project's
                  **settings permissions** rather than an inline CLI string, split the way a repo
                  already separates shared from personal config: repo-generic rules in the tracked
                  settings file, owner-reserved or machine-specific ones in the gitignored local file.
                  The permission-rule **syntax form is pinned and stated once** — a repo can otherwise
                  accumulate two spellings of the same rule and neither reader nor matcher flags it.
                  TD-023's caveat is carried across explicitly: a settings file changes ergonomics,
                  not form-sensitivity, so the matcher still reads the literal invocation
      touches:    the unattended-run reference's pre-flight section · this repo's tracked settings file
      depends-on: none
      assumes:    guidance only — no skill gains the ability to write a settings file; `init`'s
                  standing exclusion of it is unchanged, and a consumer may have no such file at all,
                  so the wording must say "derive into yours", never assume one exists (L-015)
      tracker:    SPRINT-043 follow-up · TD-023
      state:      ready

- [ ] TASK-139 — Ship a launcher that confirms the run is alive and survives terminal close  [size: M] [risk: med] [AFK]
      class:      execution
      done-when:  a dependency-free POSIX sh launcher runs the pre-flight checks, fires the trigger
                  **detached** so closing the launching terminal cannot signal the run dead, then
                  waits ~2-3 minutes and prints exactly one verdict: `ALIVE` — process up **and** first
                  observable progress (a log line or a commit, never merely a live PID) — or
                  `DEAD-ON-ARRIVAL` naming what failed. **Both verdicts exercised on real input**: a
                  genuine start, and a deliberately broken trigger. Detachment proven by actually
                  closing the parent shell and confirming the run continues — a liveness check that
                  dies with the terminal that printed it is worse than no check at all
      touches:    a new launcher script under the repo's script directory · the unattended-run
                  reference's trigger section
      depends-on: TASK-138
      assumes:    live-fire verification uses a trivial throwaway prompt (cents, not a full sprint) —
                  the launcher's correctness does not depend on a real Plan, and tying it to one would
                  make the task unaffordable to verify
      tracker:    SPRINT-043 follow-up
      state:      ready

- [ ] TASK-140 — Find and cut the dominant cost driver in an unattended run  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  the last unattended run's spend is decomposed into **named** drivers (coordinator
                  versus dispatched agents, and by phase) from the captured run data and recorded as a
                  research note; the single largest driver then has a named, applied change. Proof of
                  the reduction is deliberately **not** this task's acceptance — it is the next run's
                  calibration row, so the task cannot be blocked on a paid run it does not control
      touches:    a research note · whichever reference owns the driver the analysis identifies
      depends-on: none
      assumes:    wall-clock is not the constraint and is out of scope — a 22-minute run for 2 units
                  leaves a full night with capacity to spare, while cost per unit delivered is what
                  actually caps how much one night can carry
      tracker:    SPRINT-043 follow-up · L-073
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-141 — Erase resolved tech-debt rows instead of collapsing them  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the documentation standard's retention leg for the tech-debt ledger changes from
                  "collapse the row to a one-line § Resolved entry after 3 sprints" to **delete the row
                  outright** at that same 3-sprint mark; the § Resolved section and its existing
                  collapsed lines are removed from the ledger; and the promote governance doc-aging
                  scan is updated to match, so it stops looking for a section that no longer exists
      touches:    the doc standard's retention section · the tech-debt ledger · the promote governance
                  scan in the doc-generator skill
      depends-on: none
      assumes:    the 3-sprint delay is retained deliberately — a just-resolved debt is still useful
                  context at the next promote; only the permanent pointer goes. The substance already
                  lives in the changelog, the sprint archive, and git, so deleting the pointer loses a
                  breadcrumb rather than a record
      tracker:    SPRINT-043 follow-up
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
