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

_(none — SPRINT-086 closed 2026-08-25, 17 of 18, system-verify `183 pass, 0 fail`. All three guards now
reach their own subject: the budget guard **fired on live traffic** at 461s and named its skipped
harnesses instead of dying mute, and the review-depth guard caught a corrupted checker on `main` that
every other signal called clean. **TD-085 · TD-091 · TD-092 resolved.** **TD-090 was lowered to `medium`
and re-raised to `high` within the hour**, by its own written re-raise condition — the close's own
verification run hit **454s > 450s with no worktrees present**, so the gate sits ~1% under its budget
and a sprint's close output is enough to push it over. Next: **EPIC-014 Sprint C** (H07–H11), which needs
`/task-decomposer --epic` first — its tasks are undecomposed, and `TASK-280/281/282` stay gated on
them existing.)_

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

