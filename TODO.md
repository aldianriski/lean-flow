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

_(none — SPRINT-081 closed 2026-08-24. Next: **SPRINT-082**, EPIC-005's first member sprint.)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

- [ ] TASK-261 — Make `no-gate-discovered` risk-aware, and give gate discovery a declared rung  [size: M] [risk: med] [HITL]
      class:      decision
      tier:       G (ADR-029 — a false negative here is silent by construction: a behavioural
                  change closes with no proof and leaves no trace)
      done-when:  System verify's `no-gate-discovered` outcome branches on the change's risk class
                  instead of always continuing to close. Low-risk / non-behavioural → finding recorded,
                  run continues (unchanged). Behavioural / material-risk → attended asks for a recorded
                  owner ruling on *closing unproven* (not merely "what gates this repo"); unattended
                  PARKs per Part 0's execute-only charter. The discovery order gains a rung for a repo
                  that declares its gate command explicitly, so a repo without a manifest, Makefile or
                  CI config is no longer indistinguishable from one that has no gate at all. Retained
                  must-FAIL fixture: behavioural change + no discoverable gate must not close silently.
                  Retained control: doc-only change + no discoverable gate still records a finding and
                  continues. Existing three-rung discovery order and its precedence are unchanged.
      touches:    skills/orchestrator/references/dispatch.md (§ System verify) ·
                  skills/orchestrator/references/night-run.md (Part 0 boundary table · Part 4 rollup
                  vocabulary) · evals/fixtures/ (new, retained) · the declared-gate file + its docs
      depends-on: none
      assumes:    **the permissive branch is verified, not assumed** — `dispatch.md` § System verify
                  says in as many words that unattended emits the line and continues "since there is
                  nothing to block on", and `night-run.md` Part 4 confirms `no-gate-discovered` lets
                  the run proceed to close. Risk is not consulted anywhere in that path.
                  **The 4th rung is not optional polish: this repository has no discoverable gate.**
                  No package.json · Makefile · justfile · pyproject.toml · Cargo.toml · .github/workflows;
                  `.claude-plugin/plugin.json` carries no `scripts` block. All three rungs miss, while
                  `dispatch.md` asserts lean-flow "dogfoods this as `sh scripts/qa-check.sh`" — the
                  command exists and every sprint runs it, but the procedure that claims to find it
                  cannot. Ship the risk policy without the rung and lean-flow parks its own runs.
                  Precedent for the declaration shape: `.conformance-exempt` (ADR-031) · `.conformance-tier`.
                  **Framing that likely avoids an ADR:** "is this proven enough to close?" is a
                  decision, and Part 0 already parks decisions — this applies the existing charter to a
                  case that slipped through, rather than inventing policy. Confirm at G2.
                  Out of scope: a CI runner · a hard-coded `npm test` · a verification service · a new
                  workflow layer.
      tracker:    dispatch.md:479 · night-run.md:486 · ADR-021 · ADR-022 · ADR-011 (no enforcement)
      origin:     decomposer
      state:      ready

- [ ] TASK-262 — Route review depth by risk, not by file type  [size: M] [risk: med] [HITL]
      class:      decision
      tier:       G (ADR-029 — same silent-by-construction exposure: a governance change waved
                  through as "docs" leaves no trace that review never happened)
      done-when:  The Review skip table and scale-depth rule select depth from behaviour impact +
                  governance/decision impact, consuming the risk classifier TASK-261 defines rather
                  than a second definition of risk. `docs / config / trivial` is no longer an automatic
                  exemption: a semantic change to spec / STANDARD / an ADR that binds implementation /
                  a workflow or protocol contract draws an independent scoped reviewer; auth and
                  permission config still draws the security pass; large/high-risk still reserves
                  `/code-review`'s fan-out. Genuinely low-risk non-behavioural diffs keep the cheap
                  self-review floor. Retained must-FAIL fixture: a `.md` with high governance impact
                  must not pass as trivial on its extension. Retained control: a README typo still
                  resolves to self-review only. The Standards-vs-Spec axes and the one-bounded-revise
                  ceiling are untouched.
      touches:    skills/orchestrator/references/review-scoping.md (skip table · scale-depth) ·
                  skills/orchestrator/SKILL.md (Review step) · evals/fixtures/ (new, retained)
      depends-on: TASK-261 (intra-batch — Plan order, not an external blocker)
      assumes:    **the extension-based rule is verified** — `review-scoping.md` skip table row 1 reads
                  `docs / config / trivial diff → self-review checklist only — no agent pass`, and
                  `SKILL.md`'s scale-depth line repeats it. Neither consults consequence.
                  **`depends-on` is the classifier, not the policy** — TASK-261 and this task each need
                  "is this change behavioural / material-risk?"; built independently they become two
                  definitions of risk in one repo, which is the second SSOT LAW 4 forbids. 261 defines
                  it, this consumes it. **File overlap with TASK-263** — both touch `review-scoping.md`
                  and `SKILL.md`, so they cannot parallel-build; G2 owes them a single owner + commit
                  order in the overlap map (they are safe under sequential sprint-bulk execution).
                  Out of scope: a new reviewer role · a critic swarm · unbounded retry.
      tracker:    review-scoping.md:86 · SKILL.md:88 · ADR-021 · ADR-022
      origin:     decomposer
      state:      ready

### P1 — Next Phase Required

- [ ] TASK-263 — Add a verification-reachability test to G2  [size: S] [risk: low] [HITL]
      class:      decision
      tier:       G (ADR-029 — a criterion whose checker never examines its subject passes green
                  and says nothing; the failure is silent by construction)
      done-when:  G2 asks, for every mechanical `Verify:`, whether the named mechanism EXISTS · RUNS in
                  the target environment · REACHES the artifact or behaviour claimed · and whether its
                  PASS actually PROVES the criterion. A method whose scope excludes the claimed target
                  is recorded as not-valid-proof rather than accepted. Judgment/manual verification
                  stays legitimate where no mechanical method exists — the test never forces a new
                  checker into being merely to make a criterion mechanical. Retained fixture: a
                  criterion whose checker runs clean but never examines the named target is caught.
                  Retained control: a correctly scoped checker still passes.
      touches:    skills/orchestrator/SKILL.md (G2 checklist) ·
                  skills/orchestrator/references/review-scoping.md (§ ADR-021 evidence boundary) ·
                  evals/fixtures/ (new, retained)
      depends-on: none
      assumes:    **this is placement of an existing learning, not a new rule** — L-136 is already
                  promoted with four sightings, and its fourth is this failure verbatim: SPRINT-081 T1
                  froze *"Verify: `sh scripts/lib/check-doc-caps.sh` still PASSes each"* for three
                  `docs/qa/` files, but that checker derives caps from §2 and §2 states no cap for
                  `docs/qa/` — so it could neither pass nor fail them, ran `66 PASS, 0 FAIL`, and said
                  nothing about its named subject. Siblings: L-156 (a control that never proved it was
                  reached) · L-157 (a two-part test implemented as one half) · L-119 (a guard whose
                  condition is computed from a source that structurally excludes the case). The rule
                  currently lives in CLAUDE.md's cross-check clause — §10's placement test asks which
                  flows can hit the failure, and the one that can is G2, which does not read it there.
                  **The current bar is verified**: `review-scoping.md` § ADR-021 requires only that
                  each `done-when` "notes its verification method **where a mechanical one exists**".
                  Existence, never reach. File overlap with TASK-262 — see its `assumes:`.
                  Out of scope: proving checkers mathematically · a universal static analyzer ·
                  replacing owner judgment.
      tracker:    L-136 · L-156 · L-157 · L-119 · ADR-021 · review-scoping.md § QA/evidence boundary
      origin:     decomposer
      state:      ready

- [ ] TASK-264 — Dogfood the three boundaries as one flow  [size: S] [risk: low] [HITL]
      class:      execution
      tier:       X (ADR-029 — this exercises shipped guards on real input; it adds none of its own)
      done-when:  one representative change — small diff, behavioural or governance impact — runs the
                  whole path end-to-end on this repository: G1 → G2 (incl. the reachability test) →
                  implement → risk-based review → bounded revise if a violation surfaces → system
                  verify → the corrected no-gate semantics → close or park. Each branch the change
                  actually reaches is named in the sprint's Execution Log with what proved it. No new
                  specialist agent, no new workflow stage, bounded revise still exactly one retry, the
                  external comparand ladder intact, System Verify still the final integrated gate.
                  `sh scripts/qa-check.sh` green after implementation. Any defect found is filed as its
                  own TD/TASK rather than absorbed into this sprint.
      touches:    a sprint Execution Log · whichever of TASK-261/262/263's artifacts the run exercises
      depends-on: TASK-261, TASK-262, TASK-263 (intra-batch — Plan order, not an external blocker)
      assumes:    **the no-gate branch IS dogfoodable here, contrary to first expectation** — because
                  this repository has no discoverable gate (see TASK-261's `assumes:`), it sits
                  permanently on the `no-gate-discovered` path, so that branch is this repo's default
                  rather than an unreachable case. That was checked, not assumed: the opposite would
                  have made this task's acceptance unsatisfiable the moment it froze (L-130), and a
                  branch a repository cannot enter is L-159, filed last sprint.
                  **A criterion that rests on an undecided call is unreachable (L-111)** — "one
                  representative change" is named at G2 together with the run mode; if G2 rules
                  interactive, the unattended-PARK branch cannot be exercised by this task and is
                  proven by TASK-261's retained fixture instead. Decide that at G2 and say which it is.
      tracker:    L-016 · L-111 · L-130 · L-159 · TASK-261 · TASK-262 · TASK-263
      origin:     decomposer
      state:      ready

- [ ] TASK-265 — Freeze the core execution architecture pending Run Evidence  [size: S] [risk: low] [HITL]
      class:      decision
      tier:       P (ADR-029 — prose stating an admission condition; G1 + a read-through)
      done-when:  the register is first compressed enough to hold the addition — it sits at 130/130
                  against §2's cap, so the freeze cannot be written until it has room, and the §11
                  compaction sweep is the sanctioned way to make it. Then
                  `docs/research/adlc-epic-sequencing.md`'s gated register carries the freeze as an
                  admission condition alongside the existing EPIC-009…013 rows: the core execution
                  architecture is frozen after this hardening, and a further workflow change is
                  admitted only on measured evidence — a measured defect · a measured cost · a repeated
                  workflow failure · a security issue · consumer evidence. The Gauntlet components are
                  named as existing architecture rather than future backlog, future optimisation routes
                  to EPIC-006's metrics, no "workflow optimisation" epic is opened, and a new idea
                  defaults to research/measurement until its evidence fires admission.
      touches:    docs/research/adlc-epic-sequencing.md (gated register + a compaction pass)
      depends-on: TASK-264 (intra-batch — Plan order, not an external blocker)
      assumes:    **the destination is the whole task (L-151, four sightings)** — a freeze declared in a
                  sprint Retro or a fresh doc is invisible to the decision it governs, which would make
                  this task the exact failure it exists to prevent. The gated register was chosen
                  because it already holds the admission condition for every epic deliberately not yet
                  a file (EPIC-009 · 010 · 011 · 012 · 013, plus Phase H and Outcome Feedback), and it
                  is what gets read when a new epic is proposed. **Naming the class of fact that
                  unfreezes is load-bearing (L-094)**: a *measurement* accumulates, a *documented
                  behaviour* is closed by reading and a *judgement call* by ruling — so "unblock when a
                  measurable signal appears" would park the latter two forever. The five admission
                  triggers above are written to keep all three classes reachable.
      tracker:    L-151 · L-094 · docs/research/adlc-epic-sequencing.md · EPIC-006
      origin:     decomposer
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

_(no active sprint)_ — SPRINT-081's shipped changes are written up as **v1.55.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). `level: none` → `Gated`; the one new consumer-facing surface is `.conformance-exempt` (ADR-031), and v1.53.0 rotated to `docs/changelog/`.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

