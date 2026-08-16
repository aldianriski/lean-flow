---
owner: Maintainer
last_updated: 2026-08-15
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

> _(none — SPRINT-072 closed 2026-08-16, archived → [`docs/sprint/archive/SPRINT-072-conformance-baseline.md`](docs/sprint/archive/SPRINT-072-conformance-baseline.md))_
>
> **Read the baseline before promoting EPIC-004's next member.**
> [`docs/research/conformance-baseline.md`](docs/research/conformance-baseline.md) is the frozen
> artifact the engine is designed *against*, and it overturns the epic's opening premise: the eleven
> checkers encode lean-flow's **project conventions**, not the standard — only 3 of the spec's 13
> sections are referenced anywhere in `scripts/lib/`. Measured coverage is **8 covered · 39
> uncovered-mechanical · 45 judgment-only · 6 implementation-directed across 96 rules** (counts, never
> a ratio — EPIC-004 D1).
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room (closed 2026-08-15)** → **EPIC-003 The Standard (closed 2026-08-16** across
> SPRINT-069 · 070 · 071: spec extracted and independently versioned · conformance levels ruled ·
> attestation format specified · skills cite rather than restate · the spec made buildable-against**)**
> → **EPIC-004 Conformance** — *now the head of the sequence*, one member closed (SPRINT-072), and the
> engine it builds is what EPIC-003 made checkable → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-227 — Carry the classification into `spec/STANDARD.md` so the spec is the rule source  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  every normative rule in `spec/STANDARD.md` carries its conformance level and its
                  mechanical | judgment-only | implementation-directed mark **in the spec itself**, in
                  a form a tool can read without the plugin present; EPIC-004 § Closed-when 2's
                  *"marked judgment-only in the spec"* half is then genuinely satisfiable
      touches:    spec/STANDARD.md · spec version (MINOR) · docs/adr/ if the annotation form is
                  hard-to-reverse
      depends-on: none
      assumes:    **this is the engine's input, not a tidy-up after it.** EPIC-004 D1 says rules come
                  from the spec rather than from code; SPRINT-072 measured that the spec currently
                  carries no level, no mark and no finding name on any rule, so a "spec-driven" engine
                  built first would hard-code the classification a second time — the wrapper-over-11-
                  checkers outcome D3 rules out. The classification exists and is frozen
                  (`docs/research/conformance-baseline.md`, 96 rules): this task *transcribes* it into
                  the spec, and re-deriving it is out of scope. **The annotation form is the real
                  decision** and is not pre-selected — price at least: inline markers vs a per-section
                  table vs a sidecar machine-readable file · what it costs a human reading the spec as
                  prose, since the spec is the artifact an adopter pins · whether an unannotated rule
                  must be an error rather than a silent skip. The 6 implementation-directed rules must
                  survive as a distinct mark: an engine that reads them as repo rules emits findings
                  **no adopter can ever clear**
      tracker:    EPIC-004 § Closed-when 2 (the unmet half) · EPIC-004 D1 · SPRINT-072 D3 ·
                  docs/research/conformance-baseline.md § What the engine inherits
      origin:     close-retro
      state:      ready

- [ ] TASK-228 — Build the §13 attestation checker  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  a checker verifies §13's attestation from git trailers on the task's own commit —
                  the three trailers present together, `Evidence:` carrying `@ <sha>`, the trailer
                  agreeing with the sprint-level `gates_signed:`, and signature state read from `%G?`
                  — each check failing with its own **named finding** against a **retained** must-FAIL
                  fixture, one fixture per check
      touches:    scripts/lib/ (new checker) · evals/ (fixture harness) · scripts/qa-check.sh
      depends-on: none
      assumes:    **§13 is the single largest covered-nothing block in the standard** — 7 rules, 0
                  covered, and the baseline puts it at **5 mechanical of 7**, the most mechanical
                  section in the spec. It is also EPIC-004 § Closed-when 4 in one cell. Two constraints
                  bind hard: an **unsigned trailer is a claim, not proof** (ADR-025) — a checker
                  concluding approval from one is wrong in the direction that matters — and the two
                  rules marked `implementation-directed` (*a verifier may not conclude approval from an
                  unsigned trailer* · *author identity is not the attestation*) constrain **this
                  checker's own inference** and are not repo rules to evaluate. This is checker
                  architecture, so it lands **after** TASK-227 settles what an engine reads, or is
                  built as a standalone check that the engine later absorbs — that ordering is the
                  first thing its design must rule on
      tracker:    EPIC-004 § Closed-when 4 · ADR-025 · spec/STANDARD.md §13 · L-058 · TD-012
      origin:     close-retro
      state:      ready

- [ ] TASK-229 — Rule on the 39 uncovered-mechanical rules: close each or scope it out  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  each of the 39 rules the baseline marks **mechanical but unchecked** carries an
                  explicit disposition — a check to build, or a recorded ruling that it is out of scope
                  for the engine with its reason — so that "uncovered" stops being one undifferentiated
                  number
      touches:    docs/research/conformance-baseline.md (dispositions) · docs/adr/ if the scoping is
                  hard-to-reverse
      depends-on: TASK-227
      assumes:    **39 is a backlog, not a verdict**, and some of it should never be built: 7 of the 11
                  existing checkers guard lean-flow's own conventions rather than the standard, and
                  folding that instinct into the engine emits findings an adopter cannot act on. The
                  ruling is per rule, not en bloc. **Do not convert this into a percentage or a
                  completion score** (EPIC-004 D1) — the output stays counts plus dispositions, because
                  a ratio that improves when the standard declines to automate something is backwards
      tracker:    EPIC-004 § Closed-when 2 (the second unmet half) ·
                  docs/research/conformance-baseline.md § Coverage by section
      origin:     close-retro
      state:      ready

- [ ] TASK-218 — Stop the uncommitted-WIP path accepting a sibling task's declaration  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a coordinator running the gate over uncommitted work no longer reads a PASS that
                  the committed run would fail; whichever cure is chosen is recorded with its
                  reasoning, and the behaviour is proven by a fixture driving the same tree through
                  both paths
      touches:    scripts/lib/check-layers-observed.sh · evals/
      depends-on: none
      assumes:    TD-037's trigger fired at SPRINT-069 (T3's sweep passed 151/0 uncommitted, then
                  FAILed on three files once committed — the union accepting T2's declaration on
                  T3's behalf). **The row's standing warning binds the cure: do not close this by
                  inferring the in-flight task from open-DoD state** — that was a guess when the row
                  was filed and one observation of masking is not evidence the guess would be right.
                  Candidates to price first, none pre-selected: report the WIP leg as a named SKIP
                  rather than a PASS (TD-051 candidate-(c) shape) · attribute WIP by staged-vs-
                  unstaged · accept the boundary and document it where a coordinator reads it
      tracker:    TD-037 (trigger fired, 2026-08-16) · SPRINT-069 Execution Log · TD-035 lineage
      origin:     close-retro
      state:      ready

<!-- EPIC-003 The Standard is CLOSED (2026-08-16, archived → docs/epic/archive/). ADR-018 sequences
     what follows; ADR-023 (extraction commits are move+cite atomic, spec/ is SSOT), ADR-024
     (conformance levels) and ADR-025 (the attestation format) are its durable output, and spec/ at
     0.3.0 is the artifact. EPIC-004 Conformance is now the head of the sequence — decompose it per
     member sprint, never the whole epic, which spans sprints by definition. -->

### P2 — Quality / Polish

- [ ] TASK-219 — Rule whether `spec/STANDARD.md` gets a §2 cap row, and which  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `spec/STANDARD.md` either carries a §2 row whose cap `check-doc-caps.sh` derives and
                  enforces, or an explicit recorded ruling that the spec is deliberately uncapped —
                  either way the absence stops reading as an oversight, and the reasoning is written
                  where the next reader of §2 finds it
      touches:    spec/STANDARD.md (§2 table) · docs/adr/ if the ruling is hard-to-reverse
      depends-on: none
      assumes:    **the number is not derivable from this repo's history and that is the whole
                  difficulty** — the file has never been capped, so there is no growth curve under a
                  ceiling to reason from, while ADR-015 requires a stated cap to be a real number
                  rather than a gesture. It is also self-referential: the standard would be capping
                  itself, and whatever is chosen becomes a rule every adopter inherits with their pin.
                  Candidates to price, none pre-selected: a soft cap with §6's tier-split escape
                  (for a spec, that means numbered section files) · a hard cap, since an adopter's
                  pin makes surprise growth expensive · an explicit "deliberately uncapped" ruling.
                  Measured at filing: 587 lines, the largest governed doc in the repo, and
                  `check-doc-caps.sh` reports zero rows for `spec/` because it derives coverage
                  from §2 rather than hand-listing
      tracker:    TD-058 · SPRINT-070 T1 Execution Log · A4 (flagged at promote; G1 scoped it out)
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

_(no active sprint)_ — SPRINT-072's shipped changes are written up as **v1.46.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.46.0 + v1.45.0** inline, with **v1.44.0 rotated** → [`docs/changelog/CHANGELOG-1.44.0.md`](docs/changelog/CHANGELOG-1.44.0.md) in the same commit. **The spec did not move** — 0.3.0 stands. That is the sprint's own D4 holding: SPRINT-072 measured the standard and changed nothing in it, which is why EPIC-004 § Closed-when 2 is recorded PARTIAL rather than ticked.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

