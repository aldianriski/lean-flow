---
owner: Maintainer
last_updated: 2026-08-25
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

> **One active sprint.** Single stream — SPRINT-087/088's `stream:` keys stay on those closed files as
> the record of the repo's first parallel pairing, but this sprint is not part of a stream and omits
> the field (CONTEXT.md § Sprint model).

> **SPRINT-089 — Prove the Unattended Run** → [docs/sprint/SPRINT-089-prove-the-unattended-run.md](docs/sprint/SPRINT-089-prove-the-unattended-run.md)

EPIC-015's **second member sprint** (`epic: EPIC-015`), targeting § Closed-when **1, 3, 4**. SPRINT-088
built the whole autonomy apparatus and proved none of it end to end; this closes that gap in the only
order that works. **T1 first** — the gate must be able to finish before a run that runs the gate can be
trusted to finish (TD-090, `high` since Sprint-084, and SPRINT-088 took observed runs to 634s against a
450s budget). **T2 then supplies the evidence** SPRINT-088's three carried DoD require: a J1 executing
unattended inside the recorded envelope, and a **seeded** J2 that parks. The proof vehicle's shape is
deliberately **left to G2** — freezing it here would repeat L-111 in the sprint written to escape it.
**G1/G2 are NOT yet signed** — `gates_signed:` is absent from that file and its absence means not
signed, never approval.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P1 — Next Phase Required

- [ ] TASK-188 — Exercise the reaper on a genuinely partial Plan  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
                  as `unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via
                  `--reap`
      touches:    scripts/night-run.sh (only if the exercise finds a defect) · a sprint Execution Log
      depends-on: none
      assumes:    **carried from SPRINT-060 T5, acceptance unmet — read the ruling before re-promoting.**
                  The trigger is OPPORTUNISTIC and that is the whole design: the next night run that
                  stops mid-Plan *for its own reasons* is the exercise. Do not schedule a run to produce
                  one, and do not promote this into a sprint whose shape cannot generate it — SPRINT-060
                  promoted it alongside four HITL tasks, the run mode was then ruled interactive at G2,
                  and that foreclosed the only vehicle it had (L-111). Its partial-Plan path is already
                  proven three ways that each stop short of the others: a real log through `--reap`, a
                  zero-ticked-box regression, and an end-to-end launcher run against a complete Plan
      tracker:    SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
      origin:     close-retro
      state:      blocked

- [ ] TASK-296 — Run bounded unattended repair on one J1 finding  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4 — an unbounded or silently-skipped repair both end in a green run)
      done-when:  a concrete J1 critic finding drives repair → re-review → continue, with the retry
                  ceiling **exactly** what ADR-022 admits and no more; a second failure escalates
                  rather than looping. Retained must-FAIL: a repair that exceeds the ceiling fails
                  with its named finding while a within-ceiling sibling passes
      touches:    skills/orchestrator/references/review-scoping.md § The revise loop ·
                  skills/orchestrator/references/night-run.md · scripts/night-run.sh
      depends-on: TASK-292 · TASK-293
      assumes:    the ceiling is **not** re-decided here. Whether unattended repair inherits ADR-022's
                  single retry or earns its own is a **measurement** that accumulates from EPIC-006's
                  records (L-094); freezing a number before those exist is L-130. This task ships the
                  loop at the ceiling ADR-022 already admits
      tracker:    EPIC-015 § Closed-when 5 · V3 H31 · ADR-022
      origin:     decomposer
      state:      blocked

- [ ] TASK-297 — Emit a typed run outcome with the evidence behind it  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4)
      done-when:  every run emits `DELIVERED` / `PARTIAL` / `FAILED` **plus** DoD counts, tasks
                  attempted/completed, parks, repair cycles, verification state, warnings and terminal
                  reason. Retained must-FAIL: a run ending mid-Plan that reports `DELIVERED` fails
                  with its named finding while a genuinely-exhausted sibling passes
      touches:    skills/orchestrator/references/night-run.md · scripts/night-run.sh ·
                  templates/sprint-log.md.template
      depends-on: TASK-293 — the outcome is a function of the terminal state
      assumes:    **open question, ruled at this task's G2, not assumed here:** whether the
                  run-outcome vocabulary belongs to EPIC-015 or to EPIC-008's Run Protocol. V3 §11
                  says build only what hardening needs and leaves EPIC-008 owning the portable
                  protocol — so the ruling must land before a `RunSummary` shape is minted, or the two
                  epics mint competing ones
      tracker:    EPIC-015 § Closed-when 6 · V3 H37 · EPIC-008
      origin:     decomposer
      state:      needs-info

- [ ] TASK-298 — Teach the layers checker that a sibling active sprint is not undeclared work  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — this IS the attribution guard. Widening an exclusion is exactly how a
                  guard acquires a silent false negative: too broad and real undeclared work walks
                  through under cover of "another sprint owns it")
      done-when:  with **two active sprint files present**, each sprint's attribution is scoped to
                  itself — a file or commit that a *sibling active sprint's* `Layers:` declares no
                  longer reports as `undeclared` / `attributable to no task` against this one, while
                  every genuinely undeclared path still does. Proven on a **real two-active-sprint
                  tree**, not fixtures alone (L-166: fixtures prove the branch works, only the real
                  artifact proves it is reachable). Retained must-FAIL + sibling control: a path
                  declared by NO sprint still fails with its named finding while the sibling-declared
                  path passes. Seeded-break discrimination proof, seed verified landed by `cmp` and
                  restored under a checked hash, artifact still parses, break targeted not demolition
      touches:    scripts/lib/check-layers-observed.sh (the `is_excluded` family + the per-sprint
                  loop) · possibly scripts/qa-check.sh (it passes every `docs/sprint/SPRINT-*.md`) ·
                  evals/fixtures/layers-observed/** (new retained fixture pair) ·
                  evals/run-layers-observed-fixtures.sh
      depends-on: none — it is the prerequisite for promoting any stream 2, so it cannot sit inside one
      assumes:    **measured, not inferred.** `qa-check.sh:1013` does `ls docs/sprint/SPRINT-*.md` and
                  hands all of them to a checker that loops `for sp in "$@"` with zero stream
                  awareness, so attribution is repo-wide per sprint. Demonstrated live: commit
                  `39eedb8` (governance work, no sprint) reds SPRINT-087 with `commit attributable to
                  no task and not coordinator bookkeeping`. Reproduced independently by the session
                  executing SPRINT-087. `.claude/CONTEXT.md` § Sprint model already specifies streams
                  — the SSOT describes what the gate never learned (L-020, shipped != wired)
      tracker:    L-020 · L-166 · L-165/L-168 (isolated reviewer) · CONTEXT.md § Sprint model ·
                  blocks promoting EPIC-015 as stream 2
      origin:     manual
      state:      needs-info   # SPRINT-088 promote: looks SUPERSEDED — TASK-299 shipped the
                  # commit-ownership approach and its tracker reads "reverted from TASK-298".
                  # Routed to /triage to rule kept-vs-out-of-scope rather than deleted silently.

- [ ] TASK-300 — Decide whether the five gate-accuracy defects are one task or five  [size: S] [risk: low] [HITL]
      class:      decision
      done-when: a recorded ruling says whether TD-086 · TD-087 · TD-089 · TD-097 · TD-105 are fixed
                  as one "gate accuracy" task or separately, and the chosen shape is filed — not a fix,
                  a decomposition call
      touches:   TECH-DEBT.md · TODO.md (no code)
      depends-on: none
      assumes:   **the cluster is real, not an artifact of one sprint noticing things.** All five are
                  accuracy defects in the checkers that gate this repo, and two of them —
                  TD-087 (REACHES half) and TD-097 (EXISTS half) — are the *same script*,
                  `check-verify-reaches.sh`, filed three sprints apart with neither aware of the other
                  until SPRINT-087's close sweep read both rows together. That pairing is the evidence
                  the cluster is a cluster; the rest is judgement.
      tracker:   SPRINT-087 close sweep · TD-086 · TD-087 · TD-089 · TD-097 · TD-105
      origin:    close-retro
      state:     ready
- [ ] TASK-301 — Seed a run-evidence sprint so the unattended DoD have a vehicle  [size: M] [risk: med] [AFK]
      class:      execution
      authority:  J1
      done-when:  a small purpose-built Plan carrying at least one **AFK / J1** task and one **seeded
                  J2** task is promoted and gate-signed, then run headless once — producing (a) a J1
                  task executed unattended inside the approved envelope with no confirmation, (b) a
                  seeded J2 that PARKS with its unblock condition recorded, and (c) a run that consumed
                  the `approval_envelope:` without re-confirming any J0/J1 mid-flight. Those three
                  artifacts close SPRINT-088 T1 DoD 2/3 and T4 DoD 3, which cannot close without them
      touches:    a new docs/sprint/SPRINT-NNN (the seeded Plan) · docs/sprint/logs/ · no skill or
                  guard code — the machinery already exists and shipped in SPRINT-088
      depends-on: SPRINT-088's guards (shipped: check-authority.sh · check-approval-envelope.sh ·
                  resolve-run-mode.sh · the terminal-state reaper) — none of which needs changing
      assumes:    none — every mechanism this exercises is already built and fixture-guarded. The only
                  thing missing is a Plan an unattended run is ALLOWED to execute
      tracker:    SPRINT-088 Execution Log 2026-08-26 (the pre-flight blocker) · L-111 · D5 ·
                  TASK-188 (the same failure one sprint earlier) · closes SPRINT-088 T1 DoD 2/3 + T4 DoD 3
      origin:     manual
      state:      ready

      **Why this exists, so nobody re-derives it.** SPRINT-088 wrote three DoD requiring a real
      unattended run into a Plan whose every task is `HITL`. Part 1 pre-flight item 3 requires every
      task to be AFK-class, so a run against that Plan parks 4 of 4 and delivers nothing — the criteria
      were unreachable the moment the Plan froze. The HITL declarations are correct for med-risk Tier G
      work; the error was pairing them with acceptance that requires their absence. **Do not "fix" this
      by re-declaring SPRINT-088's tasks AFK** — that would be reshaping a task to dodge a gate. Seed a
      separate Plan instead, which is what D5 already requires for the J2 park and is equally true of
      the J1 execution.


- [ ] TASK-302 — Cut the gate's dominant cost so a close stops tripping its own budget  [size: M] [risk: med] [HITL]
      class:      execution
      authority:  J1
      done-when:  a default `qa-check.sh` run completes inside the 450s budget with no
                  `qa-check-budget-exceeded` FAIL and no harness skipped, measured on a clean process
                  table AND under load; the measurement is recorded as a new Round in
                  `docs/research/logs/qa-gate-timing.md`, and TD-090's re-raise condition is either
                  cleared or restated against the new figure
      touches:    scripts/qa-check.sh (leg 12) · evals/ harnesses · docs/research/logs/qa-gate-timing.md
      depends-on: none
      assumes:    none — TD-090 already carries Round 4's measurement (leg 12 = 396.3s of 492s, ~81%)
                  and SPRINT-086 T2's 196.1s → 143.2s partial win. **Profile before fixing** is the
                  standing instruction on this row (TD-084's rule, which held twice); do not choose a
                  split before measuring which term dominates now
      tracker:    TD-090 (`severity: high`, created Sprint-084, twice re-raised) · TD-084 · SPRINT-086 T2 ·
                  auto-escalated to P1 at SPRINT-089 promote by the aging rule
      origin:     manual
      state:      ready

      **Escalated by rule, not by preference.** Promote-time TD aging says `severity: high` →
      auto-escalate to Backlog P1. TD-090 has been `high` since Sprint-084, was lowered to `medium` at
      086's close and **re-raised the same day by its own written re-raise condition**, and had never
      reached the Backlog at all — so the rule has been silently not firing for four sprints.
      **SPRINT-088 made it worse**: three new always-on harnesses were added and observed gate runs
      went 450s → 510s → 634s against a 450s budget, tripping `qa-check-budget-exceeded` on three of
      four runs. Every future sprint pays this before it does any work of its own.

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — SPRINT-086's shipped changes are written up as **v1.59.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Consumer-facing surfaces: the attended **consequence** schema (new field in `sprint-log.md.template` + `orchestrator/SKILL.md` + `review-scoping.md`), a **stricter** review-depth gate that now FAILs on a missing review line for `governance:high`/`behaviour:material` work, and the QA budget default lowered **900s → 450s** so an over-budget run reports and names its skipped harnesses instead of dying past an external timeout.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

