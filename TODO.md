---
owner: Maintainer
last_updated: 2026-08-21
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

> _None._ SPRINT-076 closed 2026-08-21 (EPIC-004's fifth member; 20 of 20 DoD).
> Next: `/lean-doc-generator promote` from the groomed Backlog — EPIC-004 has two exit conditions open
> and ~32 rules left to build, so the next member sprint is coverage work unless the epic is re-scoped.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-239 — Audit whether every shipped check has a retained must-FAIL fixture firing its named finding  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  a written pass over **every** check in `scripts/lib/` and every `assert_*` in the
                  engine, classifying each as *has a retained must-FAIL fixture asserting its named
                  finding* or *does not* — with the gap list named, not summarised. EPIC-004 §
                  Closed-when 3 is then ticked with that evidence, or the reason it cannot be is
                  written down. **A count is not the deliverable**: SPRINT-072 measured 22 harnesses ·
                  98 cases · 46 findings and that told nobody whether *every* check has one
      touches:    docs/research/ (the audit record) · evals/ (only if the audit finds a gap worth
                  closing in this task) · docs/epic/EPIC-004-conformance.md (§ Closed-when 3)
      depends-on: none
      assumes:    the published named-findings set is the contract to audit against, not a list to
                  re-derive (L-058 · TD-012). **The audit is a query over the corpus, so it gets a
                  cross-check**: reconcile findings-with-fixtures + findings-without against the
                  register's total, and expect the first number to be wrong (L-108 has eight sightings,
                  every one caught by a second number disagreeing)
      tracker:    EPIC-004 § Closed-when 3 · SPRINT-072 (the 22/98/46 measurement) · L-058 · TD-012
      origin:     decomposer
      state:      ready

- [ ] TASK-240 — Cover the §4 ADR family: `S4.ONEFILE` · `S4.APPEND` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE`  [size: M] [risk: med] [AFK]
      class:      execution
      done-when:  all five rules are evaluated by the engine, firing the five **already-published**
                  names — `adr-path-noncanonical` · `adr-edited-after-decision` ·
                  `decisions-index-missing-adr` · `adr-required-section-missing` ·
                  `adr-no-negative-consequence` — each with **one retained must-FAIL fixture plus a
                  PASS control**, and the suite shown to discriminate under seeded breaks with the seed
                  verified to have landed
      touches:    scripts/lib/conformance-engine.sh (assertions) · evals/run-adr-family-fixtures.sh +
                  evals/fixtures/ · scripts/qa-check.sh (register the harness — the completeness leg
                  fails an ungated one) · docs/research/conformance-dispositions.md (5 rules move
                  `build` → covered)
      depends-on: none
      assumes:    **`S4.APPEND` is the one that cannot be answered from the tree alone** — "never edit a
                  decided ADR" is a claim about history, so it reads `git log`, the way
                  `check-attestation.sh` does. It is also the only Gated rule here; the other four are
                  Structural. This repo's 27 ADRs are the test corpus, and **ADR-008 and ADR-027 both
                  carry legitimate post-decision markers**, so the rule must pass on a marker and fail
                  on an edited § Decision — that distinction is the task, not a detail
      tracker:    `docs/research/conformance-dispositions.md` § build · spec §4 · EPIC-004 § Closed-when 2
      origin:     decomposer
      state:      ready

- [ ] TASK-241 — Cover §2's placement pair (`S2.F-FILE` · `S2.R-PLACEMENT`) and re-run the foreign-repo artefact triage against it  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  both rules are evaluated, firing `core-file-missing` and
                  `file-outside-canonical-placement`, each with a retained must-FAIL fixture and a PASS
                  control — **and** the foreign-repo harness is re-run and every new finding is
                  triaged *actionable by that repo's owner* vs *artefact of dispositions written
                  against our shape*, with the verdict recorded. A high artefact count is a finding
                  about `conformance-dispositions.md` and routes back there; the engine is not tuned to
                  look quiet
      touches:    scripts/lib/conformance-engine.sh · evals/run-foreign-repo-fixtures.sh (extend the
                  target) · evals/ fixtures · scripts/qa-check.sh ·
                  docs/research/conformance-dispositions.md (only if artefacts are found)
      depends-on: none
      assumes:    **this pair was chosen because it is the most likely to produce artefacts, not the
                  least** — SPRINT-075 T3's log named §2 placement as a prime shape-bound suspect, and
                  its "0 artefacts" result was recorded as *barely asked* rather than answered. A
                  result of "several artefacts" is a **success** for this task: it is the evidence
                  TASK-242 needs. Closes TASK-238's trigger (coverage reaching the shape-bound rules)
      tracker:    SPRINT-075 T3 · TASK-238 · EPIC-004 § Closed-when 1 · L-015 · L-016
      origin:     decomposer
      state:      ready

- [ ] TASK-242 — Rule on EPIC-004's Closed-when 2 with the coverage evidence in hand  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  a written ruling on whether *"every spec rule maps to a check, or is explicitly marked
                  judgment-only"* stays as the epic's exit condition or is amended to the roadmap's
                  looser Phase A exit (*"rules independently readable + conformance independently
                  measurable"*). Either way it is **recorded, with its reason** — an ADR if the
                  condition is amended, a Retro ruling if it stands. The epic's § Closed-when reflects
                  the outcome
      touches:    docs/epic/EPIC-004-conformance.md · docs/adr/ (only if the condition is amended) ·
                  docs/DECISIONS.md (with an ADR)
      depends-on: TASK-239, TASK-240, TASK-241
      assumes:    **amending an exit condition to fit what was built is the failure L-088 names**, so
                  this task exists to make that decision deliberately rather than by drift. It runs
                  LAST and only with real numbers: coverage after this sprint, the artefact count from
                  TASK-241, and the fixture gap list from TASK-239. If the honest answer is "the bar
                  stands and EPIC-004 runs several more coverage sprints", that is a legitimate outcome
                  and the task records it
      tracker:    EPIC-004 § Closed-when 2 · docs/strategy/adlc/03-ADLC-ROADMAP.md Phase A · L-088
      origin:     decomposer
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-237 — Give §3 an explicit ADR row, the way it already names README and AGENTS.md  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `spec/STANDARD.md` §3 states TWO things it currently leaves unwritten: (a) ADRs carry
                  ADR-009 knowledge metadata instead of the four-field ownership header, alongside its
                  existing README and AGENTS.md exceptions; and (b) **a strategy/exploratory tree is
                  not a governed doc set** — input to decisions, not a doc under §3 — which is what
                  `docs/strategy/adlc/` is by its own README. `conformance-engine.sh` then cites those
                  rows rather than carrying either ruling only in a code comment, and stops reporting
                  12 findings nobody intends to act on. Spec PATCH, not MINOR: both write down
                  exceptions adopters already rely on, so nothing they satisfy today changes
      touches:    spec/STANDARD.md (§3) · spec/CHANGELOG.md · scripts/lib/conformance-engine.sh (the
                  comment citing the ruling) · docs/research/conformance-dispositions.md if the note
                  there needs re-pointing
      depends-on: none
      assumes:    the exemption itself is settled — it was ruled at SPRINT-075 T6 and is already
                  enforced and named in the engine's report. What is open is only *where it is
                  written*: today it lives in code plus a report line, which is the wrong home for a
                  statement about what the standard requires. **§4 ships the template that creates the
                  conflict**, so re-read §4's frontmatter block before wording §3's row
      tracker:    SPRINT-075 T6 · TD-064 (its docs/strategy/adlc/ half, ruled at SPRINT-076 promote) ·
                  spec/STANDARD.md §3 · §4 · ADR-009
      origin:     close-retro
      state:      ready

- [ ] TASK-238 — Re-run the foreign-repo artefact triage once coverage is past the shape-bound rules  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the T3 triage is repeated against a from-scratch repo with §2's placement rules, §6's
                  tier doc-sets and §11's ledger rules implemented, and each finding is classified
                  *actionable by that repo's owner* or *an artefact of dispositions written against our
                  shape* — with the verdict recorded. A high artefact count is a finding about
                  `docs/research/conformance-dispositions.md` and routes back there; the engine is not
                  tuned to look quiet
                  **§2's third is DONE (SPRINT-076 T3) and the remaining two are what this row now
                  waits on.** The re-run happened with `S2.F-FILE` · `S2.R-PLACEMENT` live and the
                  number moved off zero: **4 artefacts of 8 new findings** — `AGENTS.md` · `TODO.md` ·
                  `.claude/CLAUDE.md` · `.claude/CONTEXT.md`, all of them lean-flow's own loop surface
                  rather than repository structure. Routed back to the register (§ Artefacts) exactly as
                  this row requires, the engine left faithful rather than quietened, and the spec fix
                  filed as TASK-243. So the METHOD is proven and the finding is real; what is unproven
                  is the other two families
      touches:    evals/run-foreign-repo-fixtures.sh (extend the target if the new rules need one) ·
                  docs/research/conformance-dispositions.md (only if artefacts are found) · the
                  sprint Execution Log that runs it
      depends-on: none
      assumes:    **SPRINT-075 T3's "0 artefacts" is honest but early, and re-promoting this on the
                  strength of that number would be reading it backwards.** Only 6 of 62 checkable
                  rules had assertions, and none of them were the rules most likely to encode our own
                  directory shape — so the question was barely asked, not answered. The trigger is
                  coverage reaching those families, not a schedule.
                  **Re-parked at SPRINT-076 T3 with a NARROWED condition, not discharged** — §2 is in
                  and confirmed the suspicion; unblock when **§6's tier doc-sets** or **§11's ledger
                  rules** are evaluated by the ENGINE (§11's two are covered today by standalone
                  checkers, which never run against a foreign tree). Naming the remaining families is
                  what keeps this a condition rather than a standing wish (L-094: the class of fact
                  that closes it is a measurement, and it accumulates one family at a time)
      tracker:    SPRINT-075 T3 · SPRINT-076 T3 (the §2 third) · EPIC-004 § Closed-when 1 · L-015 · L-016
      origin:     close-retro
      state:      blocked

- [ ] TASK-243 — Mark which §2 rows are lean-flow-loop rows rather than repository-universal ones  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  §2 distinguishes, in a form a checker can READ, the rows every repository owes from
                  the rows only a lean-flow/Claude-Code repo owes — so `S2.F-FILE` can stop telling a
                  four-file JS library it needs `.claude/CONTEXT.md`. The engine reads that
                  distinction instead of inferring it, `docs/research/conformance-dispositions.md`
                  § Artefacts is updated with the new count, and
                  `evals/run-foreign-repo-fixtures.sh`'s retained artefact-set case is **re-triaged**
                  rather than merely widened
      touches:    spec/STANDARD.md (§2) · spec/CHANGELOG.md · scripts/lib/conformance-engine.sh ·
                  evals/run-foreign-repo-fixtures.sh · docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    the fix belongs in the SPEC, not the checker — narrowing a rule the standard states
                  is a checker deciding a question the standard owns, which is the inversion L-058
                  keeps naming. **Whether this is a MINOR bump is the open call**: it changes what a
                  conformant report says about an existing adopter, which is more than the PATCH
                  wording-only bar TASK-237 uses. Four of the nine unconditional rows are affected
                  (`AGENTS.md` · `TODO.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md`) — a figure
                  derived at SPRINT-076 T3 and to be **re-derived** when this runs, never trusted from
                  here (L-130)
      tracker:    SPRINT-076 T3 · docs/research/conformance-dispositions.md § Artefacts · TASK-238
      origin:     close-retro
      state:      ready


- [ ] TASK-244 — Rule on §Closed-when 3's two residuals: invocation-error scope, and the must-REPORT wording  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  both residuals SPRINT-076 T1 established are ruled and the epic's § Closed-when 3
                  reflects the outcome. **(a) Scope**: are the engine's three *invocation-error*
                  identities (`conformance: usage` · `repo directory not found` · `reader-missing`) in
                  scope for a condition about checks having fixtures, or are they explicitly excluded?
                  **(b) Wording**: `S9.GATESABSENT` reports *NOT SIGNED* as a note and never FAILs by
                  design, so *"a retained must-FAIL fixture that fails with its named finding"* is
                  **unsatisfiable** for it — the property that actually holds across the corpus is *a
                  retained case asserts the named finding on input that must produce it*. Either the
                  condition adopts that wording or it states its exception
      touches:    docs/epic/EPIC-004-conformance.md (§ Closed-when 3) ·
                  docs/research/fixture-coverage-audit.md (the record it rules on) ·
                  evals/run-conformance-engine-fixtures.sh (only if (a) rules the three IN scope)
      depends-on: none
      assumes:    **the measurement is already done and must not be redone** — 24 of 24 checks guarded,
                  16 of 19 finding identities, gap list named
                  (`docs/research/fixture-coverage-audit.md`). This task is *two rulings*, not an audit.
                  Deliberately NOT taken inside SPRINT-076 T1: making a scope ruling inside the audit
                  that benefits from it is the drift L-088 names, and T1 refused it for that reason
      tracker:    SPRINT-076 T1 · EPIC-004 § Closed-when 3 · L-088
      origin:     close-retro
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

_(no active sprint)_ — SPRINT-075's shipped changes are written up as **v1.49.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.49.0 + v1.48.0** inline, with **v1.47.0 rotated** → [`docs/changelog/CHANGELOG-1.47.0.md`](docs/changelog/CHANGELOG-1.47.0.md) in the same commit. **The spec did not move this time** — `spec/STANDARD.md` stays at **0.4.1**, because the engine reads the standard rather than changing it; the one spec obligation this sprint surfaced (§3 owes an explicit ADR row) is filed as **TASK-237** rather than slipped in at close. **The plugin MINOR is for the engine**: `conformance.sh` + `scripts/lib/conformance-engine.sh` are a new consumer-facing capability, and `rule-unimplemented` becoming a `GAP` changes what an adopter's exit code means — which is why ADR-027 carries a refinement marker rather than a silent edit.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

