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

> _(none — SPRINT-073 closed 2026-08-16, archived → [`docs/sprint/archive/SPRINT-073-spec-as-rule-source.md`](docs/sprint/archive/SPRINT-073-spec-as-rule-source.md))_
>
> **`spec/STANDARD.md` §14 is the rule source now — read it, not the research tree.** The spec carries
> every rule's level and mark in-file at **0.4.0**: **98 classified + 2 unclassified**, 62 checkable, 8
> covered. Dispositions → [`docs/research/conformance-dispositions.md`](docs/research/conformance-dispositions.md)
> (42 `build` with named findings · 12 `scope-out` with reasons).
> [`conformance-baseline.md`](docs/research/conformance-baseline.md) is kept as the frozen record of
> what SPRINT-072 measured; its § Coverage by section is **superseded**. Counts, never a ratio — and
> §14 now states that normatively, so it binds adopters' tools too.
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

- [ ] TASK-230 — Rule the two unclassified spec rules (`S4.INDEX` · `S5.DISCARDLOG`)  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  both rules carry a real mark in `spec/STANDARD.md` instead of `?`, and §14's counts
                  are updated to match; if either is ruled `implementation-directed` the §14 count
                  moves from "five carried, one pending" to six
      touches:    spec/STANDARD.md (§4, §5, §14) · spec/CHANGELOG.md (PATCH — a mark is not a new rule) ·
                  docs/research/conformance-dispositions.md (each gains a disposition once marked)
      depends-on: none
      assumes:    **both are rules the SPRINT-072 inventory never saw**, found by SPRINT-073 T1 reading
                  the spec directly. `S4.INDEX` — *"`DECISIONS.md` is a thin index linking them"* — is
                  almost certainly Structural/mechanical and is left `?` only because D4 forbade
                  inventing a mark. `S5.DISCARDLOG` is the harder one: the discard-log line binds a
                  *generator's* output rather than a repository, making it a strong
                  `implementation-directed` candidate — and that bucket is the one an engine must never
                  evaluate against an adopter, so guessing it wrong emits findings nobody can clear.
                  **A `?` is a real state and is reported as one**, so this is not urgent; it is
                  unfinished. Do not bulk-rule them — the whole point of the mark is that it was judged
      tracker:    spec/STANDARD.md §14 · docs/research/conformance-dispositions.md § Divergences ·
                  SPRINT-073 T1 Execution Log · EPIC-004 § Closed-when 2
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

_(no active sprint)_ — SPRINT-073's shipped changes are written up as **v1.47.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.47.0 + v1.46.0** inline, with **v1.45.0 rotated** → [`docs/changelog/CHANGELOG-1.45.0.md`](docs/changelog/CHANGELOG-1.45.0.md) in the same commit. **The spec moved and the plugin did not drive it**: `spec/STANDARD.md` **0.3.0 → 0.4.0** for the per-section Conformance tables and §14 — ADR-023's independent-versioning property doing its job for the third time.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

