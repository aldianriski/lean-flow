---
owner: Maintainer
last_updated: 2026-08-18
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

> _No active sprint._ SPRINT-074 closed 2026-08-18 (15 of 15 DoD) — next sprint forms from the
> groomed Backlog below via `/lean-doc-generator promote`.
>
> **`spec/STANDARD.md` §14 is the rule source now — read it, not the research tree.** The spec carries
> every rule's level and mark in-file at **0.4.1**: **100 classified + 0 unclassified** — no rule carries
> `?` any more (SPRINT-074 T1). Dispositions → [`docs/research/conformance-dispositions.md`](docs/research/conformance-dispositions.md)
> (**43** `build` with named findings · 12 `scope-out` with reasons). **§13's five names are published**
> there and emitted by `scripts/lib/check-attestation.sh`, the first checker driven by the spec rather
> than by hard-coded rules (SPRINT-074 T2).
> [`conformance-baseline.md`](docs/research/conformance-baseline.md) is kept as the frozen record of
> what SPRINT-072 measured; its § Coverage by section is **superseded**. Counts, never a ratio — and
> §14 now states that normatively, so it binds adopters' tools too.
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room (closed 2026-08-15)** → **EPIC-003 The Standard (closed 2026-08-16** across
> SPRINT-069 · 070 · 071: spec extracted and independently versioned · conformance levels ruled ·
> attestation format specified · skills cite rather than restate · the spec made buildable-against**)**
> → **EPIC-004 Conformance** — *the head of the sequence*, **three members closed (SPRINT-072 · 073 ·
> 074)** and **1 of 5 § Closed-when conditions ticked** (attestation, at SPRINT-074). The engine it
> builds is what EPIC-003 made checkable → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-231 — Generalize the rule-source reader from §13 to any `## §N` Conformance table  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  a reader returns `(id, level, mark)` rows for **any** section's Conformance table,
                  and its output for §13 is identical to what `check-attestation.sh` derives today —
                  compared mechanically, not by eye. An absent or unparseable table is a **named
                  finding**, never a silent empty rule set: a reader that returns nothing checks
                  nothing and exits clean, which is the false negative the whole engine would inherit
      touches:    scripts/lib/ (the extracted reader) · `check-attestation.sh` (becomes its first
                  consumer) · evals/ (reader fixtures)
      depends-on: none
      assumes:    the §13 parse generalizes — it is already position-anchored to a table row inside a
                  section window (L-108) rather than matching a rule-id substring, and §14 defines one
                  table shape for every section. **Confirmed by reading the checker, not assumed.**
                  Risk if wrong: a section whose table diverges in shape is discovered here rather
                  than after 38 rules depend on it, which is why this is T1 and not folded into 232
      tracker:    EPIC-004 D1 · roadmap Phase A item 4 (docs/strategy/adlc/03-ADLC-ROADMAP.md)
      origin:     decomposer
      state:      ready

- [ ] TASK-232 — Build the engine core: rule registry, dispatch, and the report  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  `sh conformance.sh <repo-dir> [--spec <path>]` reads every section's table, dispatches
                  each `mechanical` rule to its assertion or reports `rule-unimplemented`, skips
                  `judgment-only` and `implementation-directed` **by mark**, and prints a **level** plus
                  the named findings preventing the next one. Exit 0 clean / 1 findings (CI-friendly).
                  **No score, grade or percentage appears anywhere in the output** — §14 forbids it
                  normatively, so a fixture asserts its absence rather than trusting the author
      touches:    scripts/lib/ (engine) · scripts/qa-check.sh (this repo becomes its own first consumer)
                  · evals/ (engine fixtures)
      depends-on: TASK-231
      assumes:    the standalone shape proven at SPRINT-074 carries — a repo-dir argument plus a spec
                  resolved relative to the script, so an adopter's repo needs no copy of the standard.
                  **Owner-ruled at intake: standalone-capable AND plugin-bundled, one implementation
                  with two entry points** (EPIC-004 D2, settled)
      tracker:    EPIC-004 D2 (settled at intake) · § Closed-when 2
      origin:     decomposer
      state:      ready

- [ ] TASK-233 — Run the engine against a repo that has never seen lean-flow  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  against a throwaway repo carrying none of our conventions, the engine emits a level
                  and named findings, and emits **nothing** for `judgment-only` or
                  `implementation-directed` rules. EPIC-004 § Closed-when 1 in one cell
      touches:    evals/ (a foreign-repo harness) · the engine, if the run exposes a defect
      depends-on: TASK-232
      assumes:    **this is the task that can fail informatively, and that is its point.** A report
                  full of findings a stranger cannot act on would mean the *dispositions* are wrong,
                  not the code — **43** rules were dispositioned `build` against *this* repo's shape (re-derived at
                  this intake, not copied — the epic still quotes 42), and
                  no one has yet pointed them at a repo that never agreed to any of it. Treat a large
                  finding count here as evidence about the register, and route it back there rather
                  than tuning the engine to look quiet
      tracker:    EPIC-004 § Closed-when 1 · L-015 (the consumer surface, not our dogfooding)
      origin:     decomposer
      state:      ready

- [ ] TASK-234 — Migrate the §9 gates-signed family into the engine  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  `S9.GATESWELLFORMED` and `S9.GATESABSENT` are evaluated by the engine and reproduce
                  `check-gates-signed.sh`'s named findings **exactly**; the standalone checker is
                  deleted; its fixture harness is **retained and repointed at the engine**, still green
                  — including the load-bearing case where a *missing* field reads as NOT SIGNED rather
                  than as approval
      touches:    scripts/lib/check-gates-signed.sh (deleted) · the engine · evals/run-gates-signed-fixtures.sh
                  (repointed, not rewritten) · scripts/qa-check.sh
      depends-on: TASK-232
      assumes:    EPIC-002 D3 deferred consolidation to this epic with the unblock condition *"the spec
                  exists in a form a checker can read as its rule source"* — **met at SPRINT-074**.
                  Owner-ruled at intake: subsume **one** family now, migrate the rest per-family later.
                  §9 chosen for being the smallest surface at the **hardest level** — §14 states Gated
                  is harder to check than Attested, so proving the engine there beats proving it on an
                  easy family. **Retain the fixtures** — deleting them with the old checker leaves the
                  rule unguarded (TD-012 · L-058)
      tracker:    EPIC-002 D3 · EPIC-004 § Scope (consolidation)
      origin:     decomposer
      state:      ready

- [ ] TASK-235 — Amend or supersede ADR-008's maintainer-only scope  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  an ADR records that executable code in this repo is now **consumer-facing**, and
                  rules explicitly on the conflict rather than leaving it implicit: ADR-008 says
                  *"wiring it into CI stays out of scope (lean-flow does not own CI/CD)"* while
                  EPIC-004 § Scope promises adopters *"CI-friendly exit codes"*. A row is added to
                  `docs/DECISIONS.md` and ADR-008 is marked amended/superseded per STANDARD §4 —
                  never edited in place
      touches:    docs/adr/ (new ADR) · docs/DECISIONS.md · docs/adr/ADR-008-*.md (status marker only)
      depends-on: TASK-232
      assumes:    the two are reconcilable and the ADR says how — emitting a CI-usable exit code is not
                  the same as owning a consumer's pipeline, but ADR-008's sentence is broad enough to
                  read either way, and an unstated reading is what a later sprint will trip over.
                  EPIC-004 § Closed-when 5 requires this be *formally* amended, "not silently outgrown"
      tracker:    EPIC-004 § Closed-when 5 · D2 · ADR-008
      origin:     decomposer
      state:      ready

- [ ] TASK-236 — Cover the ownership-header family: `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS`  [size: M] [risk: med] [AFK]
      class:      execution
      done-when:  four rules and their five **already-published** finding names — `owner-not-a-role` ·
                  `update-trigger-absent` · `ownership-header-missing` · `ownership-header-field-missing`
                  · `agents-ownership-footer-missing` — are evaluated by the engine, each with its own
                  **retained** must-FAIL fixture that fails with that exact string, plus a PASS control
      touches:    the engine (assertions) · evals/ (one fixture per named finding)
      depends-on: TASK-232
      assumes:    **AFK is deliberate here, not a default.** Acceptance is fully mechanical (each named
                  string either fires or does not), the finding names are a published contract this
                  task consumes rather than chooses, nothing is irreversible, and no product judgment
                  is involved — which is the stated AFK bar. Chosen as the first *new* coverage family
                  because it applies to any repository with documents in it, so it is what makes
                  TASK-233's report say something substantive rather than nothing
      tracker:    EPIC-004 § Closed-when 2 · docs/research/conformance-dispositions.md § build
      origin:     decomposer
      state:      ready

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

_(no active sprint)_ — SPRINT-074's shipped changes are written up as **v1.48.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.48.0 + v1.47.0** inline, with **v1.46.0 rotated** → [`docs/changelog/CHANGELOG-1.46.0.md`](docs/changelog/CHANGELOG-1.46.0.md) in the same commit. **The spec moved and the plugin did not drive it, for the fourth time**: `spec/STANDARD.md` **0.4.0 → 0.4.1** — a PATCH, because marking two already-stated rules adds nothing an adopter must satisfy, and calling it MINOR would tell them to re-read a spec that gained no obligation (ADR-023's independent versioning earning its keep again). **The plugin MINOR is for the checker, not the spec**: `scripts/lib/check-attestation.sh` is a new capability, the first to read the standard as its rule source rather than hard-coding it.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

