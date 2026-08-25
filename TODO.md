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

> **SPRINT-087 — The First Rule Through the Engine** → [docs/sprint/SPRINT-087-first-rule-through-the-engine.md](docs/sprint/SPRINT-087-first-rule-through-the-engine.md)

EPIC-014's **third member sprint** (`epic: EPIC-014`) — V3 Sprint C, targeting the epic's **second
§ Closed-when condition**: targeted and full conformance running in TS, with a partial invocation never
emitting a global level. **Feature-first, and the Plan's shape is that rule**: H07 (result domain),
H08 (registry) and H09 (ports) are *layers*, so none is a task — every task crosses all three (D5).
Carries the three carry-forwards that unblock the moment the CLI exists (`ok:false → exit 1` ·
permission-denied ≠ `spec-not-found` · N findings, not one) and the gate's worktree-scanning defect
(TD-095). **The first rule family is chosen at G2, not here** — cheap + representative per H10, with
V3 §43's expensive-first ranking governing families 2..n.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P1 — Next Phase Required

- [ ] TASK-287 — Stop the QA gate scanning agent worktrees  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (ADR-029 — a change to the gate's own path discovery; getting it wrong either
                  re-admits the noise or silently excludes real repo content)
      done-when:  a full `sh scripts/qa-check.sh` run with at least one live agent worktree present
                  reports **no findings whose path lies under `.claude/worktrees/`**, and a retained
                  fixture proves the exclusion does not also swallow a real finding at a similar path.
                  The exclusion is placed in the gate's path discovery, alongside the existing
                  `*/archive/*` convention, not bolted onto individual checkers
      touches:    scripts/qa-check.sh (path discovery) · possibly scripts/lib/ checkers that glob
                  independently · a retained fixture
      depends-on: none
      assumes:    **the defect is measured, not inferred.** SPRINT-086's under-load run reported 7
                  FAILs, **5 of them `ephemeral-intake` findings on fixture files inside
                  `.claude/worktrees/agent-*`** — not repo content. That same run tripped the budget
                  guard at 461s > 450s; with the worktrees removed and nothing else changed the next
                  run came in **under budget and clean at 183 pass / 0 fail**. So this costs both
                  correctness and time. Out of scope: changing where worktrees live, or whether to use
                  them — `dispatch.md` prescribes worktree-isolated parallel builds and that stands;
                  the gate is what must stop charging for it
      tracker:    TD-095 · L-168 · SPRINT-086 close · `dispatch.md` § Worktree dispatch protocol
      origin:     close-retro
      state:      ready

- [ ] TASK-288 — Evaluate one rule end-to-end, TS agreeing with Shell  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — the conformance engine; a rule that silently evaluates to nothing
                  is a false negative the whole engine inherits)
      done-when:  one mechanical rule run through the TS path produces the **same named finding and
                  the same exit meaning** as the Shell engine, with the Shell engine spawned as a
                  **live oracle inside the test** rather than its output copied in as a literal. The
                  path crosses every layer: a `Finding` / `RuleEvaluation` / `ConformanceResult`
                  domain, a registry holding exactly one evaluator, one repository port with a real
                  Bun adapter *and* an in-memory fake, and `--rule <id>` on the CLI. **No CLI strings
                  inside the domain** (H07), enforced by the existing dependency-direction fitness test
      touches:    packages/standard (result domain · registry · first port) · apps/cli (`--rule`) ·
                  colocated tests · test/architecture
      depends-on: none
      assumes:    **the workspace exists and was checked on disk, not read off the epic** —
                  `packages/standard/src/` carries model · tokenizer · spec-reader from SPRINT-083/085,
                  `apps/cli/src/main.ts` exists, and `test/architecture/` already enforces the
                  dependency direction over `packages/standard` and `packages/contracts`. Zero
                  dependencies stays binding (ADR-035). **The Shell engine keeps authority** — this is
                  strangler, not cutover (EPIC-014 D2); nothing here deletes or demotes Shell. Out of
                  scope: more than one rule, and any global conformance level
      origin:     decomposer
      state:      ready

- [ ] TASK-289 — Resolve every rule class to GAP, excluded, or judgment-required  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — a misclassified rule reports as checked when nothing checked it)
      done-when:  an **unknown mechanical** rule resolves to `GAP`; a **judgment-only** rule to
                  `excluded/judgment-required`; an **implementation-directed** rule to `excluded` —
                  each with its own named outcome and a retained must-FAIL fixture. An unknown rule id
                  must neither crash nor silently pass, and the Tier G discrimination proof shows each
                  class reddening its own case while the siblings stay green
      touches:    packages/standard (result domain · registry classification) · colocated tests ·
                  test/fixtures
      depends-on: TASK-288
      assumes:    **the vocabulary is already typed and must not be re-derived** — ADR-036 fixed the
                  Standard's marks at **six**, not V3's four (`restated` and `standard-directed` were
                  the two ADR-028 added to stop eleven rules reporting as "unchecked gaps someone can
                  close"). This task maps those marks to outcomes; it does not invent a vocabulary.
                  Out of scope: changing what any mark means, and the `Hold` semantics that land with
                  the QA profiles later in the epic
      origin:     decomposer
      state:      ready

- [ ] TASK-290 — Migrate the first rule family whole, rule by rule  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8)
      done-when:  every rule in the chosen family agrees with the Shell engine **rule-by-rule, never
                  in aggregate** — the assertion names the differing rule when it fails — with a
                  retained must-FAIL and a sibling control per rule. Any TS/Shell difference is
                  **ruled, never absorbed** (EPIC-014 D2), and the family is **named individually** at
                  the end, never "most of it". This is the reference pattern later families copy
      touches:    packages/standard (evaluators for the chosen family · any ports they need) ·
                  colocated tests · evals fixtures
      depends-on: TASK-288 · TASK-289
      assumes:    **the family is chosen at G2, not here, and the criterion was ruled at intake.**
                  H10 asks for a *representative cheap* family because this is the pattern-proving
                  slice; V3 §43 ranks by *expensive-today / high-spawn*, which the Round 5/6 profile
                  says is F11 §11 retention (84.7s) · F6 §4 ADR (72.1s) · F5 §1 ownership (56.0s) ·
                  F9 §10 (37.4s) — also the most complex. **Owner ruling: cheap + representative
                  governs THIS family; §43's expensive-first governs families 2..n**, where the cost
                  actually recovers. The profile is in hand, so the L-130 bar (do not freeze an order
                  before evidence) is satisfied either way. Out of scope: migrating a second family,
                  and any authority cutover
      origin:     decomposer
      state:      ready

- [ ] TASK-291 — Target by section, and refuse to claim a level from a partial run  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — a partial run that reports a global level is a false *assurance*,
                  the most expensive shape of wrong answer this engine can produce)
      done-when:  `--section N` targets that section's rules; a **partial invocation emits no global
                  conformance level at all** (EPIC-014 § Closed-when 2, verbatim); and an unknown rule
                  or section **fails loudly** — a named finding and a non-zero exit, never an empty
                  result. One retained must-FAIL fixture per branch
      touches:    apps/cli (`--section`, partial-invocation guard, unknown-target handling) ·
                  packages/standard (whatever the guard reads) · colocated tests
      depends-on: TASK-288
      assumes:    **"no global level" is a property of the result, not of the printer** — if the guard
                  lives only in the renderer, a JSON consumer later reads a level nobody meant to
                  publish, and EPIC-014 § Closed-when 6 requires one domain result feeding both
                  renderers. The absence/emptiness discipline SPRINT-085 T3 established by TYPE
                  (`SpecReadFail` carries no `rows` field at all) is the shape to follow. Out of
                  scope: the full conformance orchestrator (H12) and the JSON renderer
      origin:     decomposer
      state:      ready

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

- [ ] TASK-280 — Map `ok:false` to exit 1 when H11's CLI lands  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — the exit meaning is ADR-034 D3's frozen surface)
      done-when:  the TS CLI exits **1** for every `SpecReadFail` and **0** for every `SpecReadOk`,
                  including the legitimate zero-row section, asserted against the Shell reader's exit
                  as an independent oracle rather than against a copied literal
      touches:    packages/standard (CLI entry, H11) · its colocated tests
      depends-on: none (blocked in practice until H11's CLI exists)
      assumes:    **the domain half is already correct and must not be re-litigated.** SPRINT-085 T3
                  ruled `ok:false` vs exit 0/1 *not* a TS/Shell difference: ADR-034 D3 freezes exit
                  *meaning*, and `ok:false` carries that meaning faithfully — but the domain layer has
                  **no process boundary**, so nothing has yet mapped it to an exit code. The mapping is
                  where the meaning is lost if it is skipped
      tracker:    SPRINT-085 T3 carry-forward 1 · ADR-034 D3 · EPIC-014 V3 H11
      origin:     close-retro
      state:      ready

- [ ] TASK-281 — Stop a permission-denied spec from reporting `spec-not-found`  [size: S] [risk: med] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8 — a wrongly *named* finding is the failure this repo prices highest)
      done-when:  an unreadable-but-present spec produces a finding distinct from `spec-not-found`,
                  matching whatever the Shell reader does, with a retained must-FAIL fixture per branch
      touches:    packages/standard (H11 CLI — the layer that touches the filesystem) · its tests
      depends-on: none (blocked in practice until H11's CLI exists)
      assumes:    **this is not a shipped defect and the task must not be written as if it were.**
                  `specNotFound()` in production is a *pure constructor with no filesystem access*, so
                  the domain never decides when to emit it; the over-broad catch lives only in T3's
                  test stand-in. What this task fixes is the decision H11 will otherwise make by
                  accident. Out of scope: changing the domain constructor
      tracker:    SPRINT-085 T3 carry-forward 2 · EPIC-014 V3 H11
      origin:     close-retro
      state:      ready

- [ ] TASK-282 — Carry every `--reconcile` finding, not just the first  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       G (EPIC-014 D8)
      done-when:  a `--reconcile` run over a spec with **two or more** mismatching sections surfaces
                  every mismatch, matching the Shell reader's enumeration, with a fixture that has
                  more than one mismatch — the case a single-finding shape cannot pass
      touches:    packages/standard (result shape, H07) · its colocated tests
      depends-on: none (lands naturally at H07, when findings become typed data)
      assumes:    **accepted deliberately at SPRINT-085 T4, not overlooked.** Shell prints several
                  findings per run; TS surfaces the first mismatching section. The **verdict and the
                  finding name are identical**, so ADR-034 D3's frozen surface is intact and this is
                  cosmetic *today*. It stops being cosmetic at H07, where a result carrying N findings
                  is the natural shape — the point of filing it is that Sprint C should not inherit
                  the collapse silently
      tracker:    SPRINT-085 T4 carry-forward · ADR-034 D3 · EPIC-014 V3 H07
      origin:     close-retro
      state:      ready

<!-- EPIC-015 — Execution Autonomy · first member sprint slice. Stream 2, parallel to EPIC-014.
     Admitted 2026-08-25: the freeze amendment closed and the after-SPRINT-083 sequencing gate is met
     (docs/epic/INDEX.md). Shared file with EPIC-014 is `.claude/CONTEXT.md` — single owner + commit
     order ruled at G2, never a parallel build. -->

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

