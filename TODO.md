---
owner: Maintainer
last_updated: 2026-08-24
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

> **SPRINT-083 — TS/Bun Foundation** → [docs/sprint/SPRINT-083-ts-bun-foundation.md](docs/sprint/SPRINT-083-ts-bun-foundation.md)

_**EPIC-014**'s first member sprint (`epic: 014`). EPIC-005's first member sprint now follows
EPIC-014, not SPRINT-082 — owner ruling 2026-08-24, recorded in `docs/epic/INDEX.md`._

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

<!-- TASK-267…270 are SPRINT-083's T1…T4. Full detail lives in the sprint file; these are the
     Backlog rows promote pulled from. -->

- [ ] TASK-267 — Freeze the semantic compatibility contract  [size: M] [risk: med] [HITL]
      class:      decision
      tier:       P (ADR-029 — prose plus a generated snapshot; it ships no checker. Re-tier to G
                  if it adds a check that the snapshot is current)
      done-when:  the migration's semantic surface is frozen as an ADR — Rule ID · Finding ID ·
                  Severity · rule inclusion/exclusion · Hold semantics · full-run level · exit
                  meaning — with byte-exact stdout explicitly disclaimed, and a regenerable snapshot
                  of the frozen rule IDs committed under `evals/fixtures/compat/`
      touches:    docs/adr/ADR-034-semantic-compatibility-contract.md (new) ·
                  evals/fixtures/compat/ (new, retained) · docs/DECISIONS.md · docs/knowledge-index.md
      depends-on: none
      assumes:    **the denominator is derived here, never inherited.** Three sources disagree:
                  `scripts/lib/read-spec-rules.sh` emits **100** unique rule IDs, the `Sn.NAME` grep
                  shape matches **79**, EPIC-004 closed on **51 of 51**. At most one is the
                  contract's. A number frozen into an artifact is a query result read later by
                  someone who cannot re-derive it (L-130), and the 79 is the substring-shaped count
                  L-108 warns about. Out of scope: freezing stdout · migrating any rule
      tracker:    V3 §25 · V3 §44 · EPIC-014 D3 · ADR-023 · L-130 · L-108
      origin:     manual
      state:      ready

- [ ] TASK-268 — Stand up the TS/Bun workspace without disarming gate discovery  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — defaulted *up*: the workspace alone is X, but this changes what
                  System verify discovers, and a wrong discovery is silent by construction)
      done-when:  `bun test` runs, one CLI command executes, the dependency boundary is documented —
                  and after the manifest lands, gate discovery still resolves to a command that
                  actually gates this repository, proven by walking the rungs rather than assuming.
                  Retained must-FAIL fixture: a manifest whose discovered command does not run the
                  real gate is caught. Control: the pre-manifest rung-4 resolution still works
      touches:    package.json (new, root) · tsconfig.base.json · bunfig.toml · apps/cli/src/main.ts ·
                  .gitignore · docs/adr/ADR-035-typescript-bun-reference-engine.md (new) ·
                  docs/architecture/overview.md (§ Directory structure)
      depends-on: none
      assumes:    **the hazard is verified, not hypothetical.** `dispatch.md:488` states rung 4
                  (`.gate-command`) is last because "anything discoverable wins over it", and
                  `.gate-command`'s own comment predicts this failure by name — "it can go stale
                  against a repo that later grows a real manifest". A root `package.json` creates a
                  rung-1 hit that outranks the declaration and re-points System verify at a `bun
                  test` covering nothing. Out of scope: any Shell edit · dashboard code · a
                  framework CLI stack · npm publish
      tracker:    V3 §2 · V3 §7 · V3 §8 · ADR-033 · EPIC-014 D1/D6 · L-015
      origin:     manual
      state:      ready

- [ ] TASK-269 — Make the dependency direction mechanically enforced  [size: M] [risk: med] [HITL]
      class:      execution
      tier:       G (ADR-029 — a guard; a false negative lets every later sprint cross the
                  Clean-Architecture boundary silently, and the whole epic rests on it)
      done-when:  each rule in V3 §8's allowed direction has a named assertion; a retained must-FAIL
                  fixture per rule reddens with that rule's own identifier; a control passes and
                  reports how many edges it examined; and the suite is shown to **discriminate** by
                  a seeded break that reddens its case while a sibling control stays green
      touches:    test/architecture/dependency-direction.test.ts (new) ·
                  test/fixtures/architecture/ (new, retained) · package.json (test script)
      depends-on: TASK-268 (intra-batch — Plan order, not an external blocker)
      assumes:    **a suite green on its first run has not been shown to discriminate.** Fixtures and
                  code written in one session agree by construction, so the seed must be verified to
                  land (`cmp` against pristine, restored under a checked hash), must still parse, and
                  must be targeted — a demolition is not a discrimination (L-137 · L-142).
                  Out of scope: a general-purpose linter · scoring SOLID mechanically
      tracker:    V3 §2.1 · V3 §8 · V3 §35 · V3 §50 · EPIC-014 D4 · L-058 · L-137 · L-142
      origin:     manual
      state:      ready

- [ ] TASK-270 — Type the Standard domain model, test-first  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X (ADR-029 — typed structure with tests; it guards nothing on its own. Its
                  enforcement is TASK-269's, which is G)
      done-when:  `StandardDocument` · `StandardSection` · `StandardRule` · `RuleId` ·
                  `ConformanceLevel` · `RuleMark` · `SourceLocation` exist, each introduced by a
                  behaviour-named test that went red first, with the red-before-green step recorded
                  per type; the model imports nothing from `apps/`, Bun or any adapter; and no
                  parser, evaluator or CLI rendering entered it
      touches:    packages/standard/src/model.ts (new) · packages/standard/src/model.test.ts (new) ·
                  test/architecture/dependency-direction.test.ts (register the package)
      depends-on: TASK-268, TASK-269 (intra-batch — Plan order, not an external blocker)
      assumes:    **the vocabulary is cross-checked against `spec/STANDARD.md` itself, not against
                  V3's summary of it** — V3 §9 is a conceptual sketch written outside this repo, and
                  a mark or level it names that the Standard does not carry would enter the domain
                  model as fact. Out of scope: parsing (SPRINT-084) · any conformance behaviour
      tracker:    V3 §4 · V3 §5 · V3 §9 · V3 §33 · V3 §48 · EPIC-014 D5
      origin:     manual
      state:      ready

### P1 — Next Phase Required

- [ ] TASK-271 — Align ADR-034 and ADR-036 to the ADR template  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       P (ADR-029 — prose formatting; G1 and a read-through)
      done-when:  both ADRs use `ADR.md.template`'s shapes — a single-paragraph
                  `**Positive:** / **Negative (trade-offs accepted):**` § Consequences and an
                  `| Option | Why rejected |` table for § Alternatives — matching ADR-033 and ADR-035.
                  **§ Decision in both must stay byte-identical** to the accepted text: both are
                  `status: accepted` and §4 is append-only, so a rewrite there trips S4.APPEND
      touches:    docs/adr/ADR-034-semantic-compatibility-contract.md ·
                  docs/adr/ADR-036-severity-is-introduced-not-preserved.md
      depends-on: none
      assumes:    **the deviation is confirmed, not suspected** — independent review flagged it on
                  ADR-035 and the same root cause covers all three: they were written without
                  re-reading the template, which CLAUDE.md names as an anti-pattern outright.
                  ADR-035 was realigned during SPRINT-083's T2 revise; these two were deliberately
                  left, because a bounded revise is one retry and cosmetic drift did not earn an
                  expansion of it. Out of scope: rewriting any § Decision · re-litigating either
                  decision's content
      tracker:    SPRINT-083 T2 revise · ADR.md.template · CLAUDE.md § Anti-Patterns
      origin:     close-retro
      state:      ready


- [ ] TASK-266 — Run the owed independent review of SPRINT-082's governance changes  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  T1, T2, T3 and T5's changes have had an independent scoped review pass recorded as a
                  `review · Tn · scoped-reviewer · behaviour:material · governance:high` line, or an
                  owner ruling accepting self-review is recorded in its place. Either outcome closes it;
                  an empty record does not
      touches:    docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md (or a successor log)
      depends-on: none
      assumes:    **the sprint's own rule generated this, and refusing to wave it through is the point.**
                  SPRINT-082 T2 shipped routing where `governance:high` cannot take the self-review
                  floor. T1/T2/T3/T5 are all `behaviour:material · governance:high` — they change rules
                  other work is measured against — so under that rule none of them earned the cheap
                  path. The session that built them could not dispatch an independent reviewer, so the
                  review **parked** and **no `review ·` line was written**: the line records what fired,
                  and writing `self-review` would have been false *and* would have reddened
                  `check-review-depth.sh`. Closing the sprint with the record honestly empty, and the
                  gap filed here, is the only reading consistent with having shipped the rule
      tracker:    SPRINT-082 T2 · T4 (parked branch) · review-scoping.md § Two dimensions
      origin:     close-retro
      state:      ready

- [ ] TASK-260 — Run Phase C: the harness delta research side-car  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  `docs/research/harness-delta.md` exists as a decision doc (ADR-009 frontmatter, ≤130)
                  ruling each of `05-HARNESS-RESEARCH-BRIEF.md`'s four candidates — reconstructible
                  Lean-controlled dispatch · independent dispatch replay · reversible effect lifecycle ·
                  programmatic mechanical batching — as **keep / reject / defer**, each against the
                  delta over lean-flow's existing surface rather than standalone merit (L-017), and
                  each naming which layer would own it. `05`'s explicit non-goals are re-asserted, not
                  re-litigated
      touches:    docs/research/harness-delta.md (new) · docs/knowledge-index.md (generated)
      depends-on: none
      assumes:    **unstarted and unblocked — verified, not assumed.** A census for the four candidate
                  names returns zero hits across `docs/`, `spec/` and `skills/`;
                  `harness-engineering-adaptation.md` is a different question and predates the strategy
                  pack. This is the **side-car lane**: research only, collides with no implementation
                  file, and `03` Phase C forbids opening an epic from it (*"No new epic until evidence
                  identifies the real delta"*). It is EPIC-008's named input (D4) — `RunEnvelope`,
                  `Dispatch` and `Effect` trace their provenance here — so it is the long pole for the
                  whole of Lane 2's tail
      tracker:    03-ADLC-ROADMAP.md Phase C · 05-HARNESS-RESEARCH-BRIEF.md · EPIC-008 D1/D4 ·
                  docs/research/adlc-epic-sequencing.md F4
      origin:     manual
      state:      ready

- [ ] TASK-259 — Exercise the absent-attestation hold against a foreign repo that has commits  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  the foreign-repo harness runs a target with real git history and no §13 trailers, and
                  the assertion records what an adopter actually sees — `attestation-absent` named,
                  `level: Gated`, exit code unmoved. Whichever way it falls is the result; a surprise
                  here is a finding about T4, not a nuisance
      touches:    evals/run-foreign-repo-fixtures.sh (the current stranger is git-less by construction,
                  so this needs a second target or an added `git init` + one commit) ·
                  docs/research/logs/conformance-coverage.md § Round 5
      depends-on: none
      assumes:    **the gap is real and was named at the moment it was created, not discovered later.**
                  SPRINT-081 T4 added the hold and T3 could not exercise it: the stranger is built from
                  four `printf`s with no `git init`, so §13 reports `not evaluated` and the new branch
                  never runs against a foreign tree. It IS exercised against this repository and by
                  `run-attestation-fixtures.sh`, so this is coverage of the *consumer path*, not of the
                  rule (L-016) — the one thing dogfooding structurally cannot check here
      tracker:    SPRINT-081 T4 · T3 · TD-079 · L-159 · docs/research/logs/conformance-coverage.md
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

_(no active sprint)_ — SPRINT-082's shipped changes are written up as **v1.56.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Consumer-facing surfaces: the root `.gate-command` declaration (ADR-033) and review depth keyed on consequence rather than file extension.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

