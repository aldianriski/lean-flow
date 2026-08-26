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

> **No active sprint.** `main`/SPRINT-087 and `autonomy`/SPRINT-088 both closed 2026-08-26. One active
> sprint per stream, one pointer each (CONTEXT.md § Sprint model); the `stream:` keys stay on both
> closed files as the record of the repo's first parallel pairing, which
> `check-layers-observed.sh` (TASK-299) scoped attribution for on real input.

_(no active sprint)_ — SPRINT-088's shipped changes are written up in [`CHANGELOG.md`](CHANGELOG.md)
as an unreleased block; it is a **feature** sprint, so the version bump is MINOR **by hand**, not
`/release-patch`. It closed at **13 of 16 Plan DoD**: three criteria (T1 DoD 2/3, T4 DoD 3) require a
real unattended run and are carried by **TASK-301**, not ticked — the Plan is entirely `HITL`, which
Part 1 pre-flight forbids a run against, so no run against *that* Plan could ever have supplied them.

Next: `/lean-doc-generator promote` to form a sprint from the groomed Backlog.

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

- [ ] TASK-292 — Declare J0/J1/J2 authority on every task, and prove a J2 parks  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · EPIC-015 D4 — a misclassified authority is silent by construction:
                  the run reports success, and a decision taken without asking leaves no trace)
      done-when:  every task in a promoted Plan carries a `J0` / `J1` / `J2` declaration; an unattended
                  run executes J1 inside the approved envelope without asking, and a **seeded** J2
                  parks with its unblock condition recorded. The seed is required, not a fallback
                  (D5) — a natural J2 cannot be scheduled, and waiting for one foreclosed this
                  criterion once already (TASK-188 · L-111). Retained must-FAIL fixture: a J2 task
                  that does **not** park, failing with its named finding while a sibling J1 control
                  stays green
      touches:    skills/orchestrator/references/night-run.md (Part 0 authority table) ·
                  skills/orchestrator/SKILL.md (G2 declaration) · templates/SPRINT.md.template ·
                  .claude/CONTEXT.md § Task entry shape (**shared with EPIC-014 — owner at G2**) ·
                  a retained fixture pair
      depends-on: none — the foundation the envelope, the repair loop and the run vocabulary all rest
                  on (epic § Why this)
      assumes:    the three classes already describe how the loop behaves (mechanical · delegated ·
                  human); this **declares** them, it does not invent them. D3 binds — J2 stays human
                  and absence is never consent: a missing ask channel, a denial or a timeout is a
                  BLOCK, never a default-yes
      tracker:    EPIC-015 § Closed-when 3 · D3 · D4 · D5 · V3 H29
      origin:     decomposer
      state:      ready

- [ ] TASK-293 — Stop sprint-bulk pausing between already-authorized tasks  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4 — a continuation contract that stops early reports the same
                  `success` as one that ran the Plan out; the omission is invisible)
      done-when:  a `sprint-bulk` run moves task to task without re-confirming work the owner already
                  approved, and ends **only** at one of `PLAN_EXHAUSTED` · `AUTHORITY_BOUNDARY` ·
                  `HARD_FAILURE` · `BUDGET_STOP` · `USER_STOP` — the terminal reason named in the
                  rollup. Retained must-FAIL fixture: a run that halts with no terminal state,
                  failing with its named finding while a sibling clean-exhaustion control passes
      touches:    skills/orchestrator/SKILL.md (the sprint-bulk loop) ·
                  skills/orchestrator/references/night-run.md · scripts/night-run.sh ·
                  .claude/CONTEXT.md § Modes (**shared with EPIC-014 — owner at G2**)
      depends-on: TASK-292 — a run may only continue past a task once that task's authority class is
                  declared; without J0/J1/J2 "already authorized" has no definition
      assumes:    ADR-016's rollup stays the launcher's job, not the run's — this task changes when
                  the run stops, never who writes the record of it
      tracker:    EPIC-015 § Closed-when 1 · V3 H27 · ADR-016
      origin:     decomposer
      state:      ready

- [ ] TASK-294 — Make `overnight` the canonical mode name, with the current names as aliases  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4 — an alias that silently resolves to the wrong mode runs the wrong
                  gate set, and the run looks normal either way)
      done-when:  `/orchestrator` and `/flow` both discover `overnight` as the mode name, and
                  `night-run` · `unattended` · `sprint-bulk unattended` each resolve to it — proven by
                  a fixture per alias, each reaching the same mode. Retained must-FAIL: an unknown
                  mode string fails loudly rather than falling through to a default
      touches:    skills/orchestrator/SKILL.md · skills/flow/SKILL.md ·
                  skills/orchestrator/references/night-run.md · .claude/CONTEXT.md § Modes
                  (**shared with EPIC-014 — owner at G2**) · README (consumer-visible rename, L-015)
      depends-on: TASK-293 — the mode is named after the contract it runs, not before it
      assumes:    the rename is additive for consumers: every existing trigger keeps working as an
                  alias, so no installed workflow breaks (L-015 consumer check)
      tracker:    EPIC-015 § Closed-when 2 · V3 H28 · open question — whether `overnight` also
                  becomes a `spec/STANDARD.md` §2 row is a **judgement call closed by ruling** at G2
                  (L-094), ADR-grade only if it adds a row
      origin:     decomposer
      state:      ready

- [ ] TASK-295 — Record one pre-launch approval that covers the whole envelope  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 · D4 — an envelope that silently widens is the failure mode; nothing in
                  the run reports having exceeded an approval it never re-read)
      done-when:  one recorded approval covers goal · scope · acceptance · design · verification · J1
                  delegation · capabilities · repair policy · budget · stop conditions, and a run
                  consuming it re-confirms **no** J0/J1 mid-flight. The approval is written where the
                  run reads it — the sprint frontmatter, not the launching transcript (L-099 · L-151).
                  Retained must-FAIL: an approval missing one of the ten dimensions is rejected at
                  pre-flight and names which one
      touches:    skills/orchestrator/references/night-run.md (Part 1a pre-flight) ·
                  templates/SPRINT.md.template (frontmatter) · skills/orchestrator/SKILL.md
      depends-on: TASK-292 — the envelope is expressed in J-classes, so it cannot be written before
                  they exist
      assumes:    pre-flight remains the gate that refuses an unpromoted Plan (Part 1a); this task
                  widens what pre-flight checks, never where it sits
      tracker:    EPIC-015 § Closed-when 4 · V3 H30 · L-099 · L-151
      origin:     decomposer
      state:      ready

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
      state:      ready

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
- [ ] TASK-299 — Scope layers attribution per stream, by commit ownership not by path  [size: M] [risk: high] [HITL]
      class:      execution
      tier:       G (ADR-029 — this IS the attribution guard, and the first attempt at it shipped a
                  false negative that an independent reviewer caught and the author did not)
      done-when:  with two active sprint files, each sprint's attribution is scoped to itself, AND a
                  commit belonging to THIS sprint that touches a path only a SIBLING declared still
                  FAILs — cross-stream overlap is what CONTEXT.md says must be coordinated, so hiding
                  it is worse than the noise it replaces. Proven on a real two-active-sprint tree
                  (L-166), retained must-FAIL + sibling control, seeded-break discrimination, and an
                  independent worktree-isolated reviewer dispatched against a COMMITTED branch
      touches:    scripts/lib/check-layers-observed.sh (attribution, not the exclusion list) ·
                  evals/run-layers-observed-fixtures.sh
      depends-on: none — but it BLOCKS promoting any stream 2
      assumes:    **the naive design is already refuted, do not rebuild it.** Attempt 1 excluded any
                  path a sibling sprint declared. An independent review produced three repros where
                  that silently swallowed real defects: (1) a commit by THIS sprint's own T1 touching
                  a sibling-declared path never reached the per-task `miss_attr` check; (2) a sibling
                  declaring a directory token (`scripts/`) swallowed every undeclared file beneath it,
                  unbounded; (3) the same on the WIP leg, where the skip landed before `n_wip` and
                  turned a dirty tree into a bare PASS. In each, main's checker correctly FAILs and
                  the new one PASSed. The fix direction: exclude only when the commit **belongs** to
                  the sibling — its sprint number is readable from the `sprint(NNN)` subject — never
                  from the path alone. And the **WIP leg likely gets no sibling scoping at all**:
                  uncommitted work carries no attribution, so there is no honest way to tell which
                  stream made it, and reporting it is correct
      tracker:    reverted from TASK-298 · L-165/L-168 (the review that caught it) · L-166 ·
                  CONTEXT.md § Sprint model · blocks EPIC-015 stream 2
      origin:     manual
      state:      ready


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

