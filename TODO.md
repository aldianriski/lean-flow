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

> **SPRINT-081 — Clean Slate** → [docs/sprint/SPRINT-081-clean-slate.md](docs/sprint/SPRINT-081-clean-slate.md)
>
> _Three tasks — **T1 TASK-257** (the sixteen ownership headers, TD-064) · **T2 TASK-258** (rule the
> reasoned Base-tier exemption, TD-077) · **T3 TASK-238** (foreign-repo artefact triage re-run,
> EPIC-004 § Closed-when 1's follow-through). **T3 depends on T2** — a dependency neither backlog row
> carried, found at promote: `S6.BASE` is shape-bound, so re-running the triage before the exemption
> ruling would measure a mechanism about to change (D1). T1 and T2 clear the two rules that hold this
> repository at `level: none` against its own standard. Spends EPIC-004's residue rather than carrying
> it into EPIC-005, whose first member sprint is **SPRINT-082**._

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

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
                  filed as TASK-243 — **delivered at SPRINT-077 T1 (spec 0.5.0); artefacts now 0 of 4**. So the
                  METHOD is proven and the finding is real; what is unproven
                  is the other two families
      touches:    evals/run-foreign-repo-fixtures.sh (extend the target if the new rules need one) ·
                  docs/research/conformance-coverage.md § Artefacts (only if artefacts are found — the
                  section moved there at SPRINT-079's promote, when the register was split) · the
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
      state:      ready
                  **UNBLOCKED at SPRINT-079's promote.** The condition read "§6's tier doc-sets **or**
                  §11's ledger rules are evaluated by the ENGINE" — SPRINT-078 T2 put the tier family
                  there (`assert_S6_BASE` … `assert_S6_MULTISVC`, one check with the tier a parameter),
                  so the first disjunct is met. Re-derived at promote from the engine source, not read
                  off SPRINT-078's summary. Not pulled into SPRINT-079: the triage wants coverage past
                  the shape-bound families, and §11's ledger rules land in SPRINT-080 (TASK-250/251) —
                  running it after those is the stronger measurement, and the trigger stays a condition
                  rather than a schedule (L-094)

- [ ] TASK-257 — Write the sixteen ownership headers this repo's own docs are missing  [size: S] [risk: low] [AFK]
      class:      mechanical-ingest
      done-when:  `sh conformance.sh .` reports **zero** `ownership-header-missing` ·
                  `ownership-header-field-missing` · `update-trigger-absent` findings, and `S1.LAW3`
                  and `S3.SCHEMA` no longer appear among the rules preventing Structural. Each trigger
                  written is the doc's **real** one — §1 LAW 3's mechanical half is mere presence, but
                  a trigger that can never fire is the doc ageing silently under a header claiming
                  otherwise, which is the failure LAW 3 exists to stop
      touches:    docs/qa/QA-001…QA-003 (no frontmatter at all — full four-field header) ·
                  docs/research/ ×13 (header present, `update_trigger:` absent) · TECH-DEBT.md
                  (TD-064 → resolved)
      depends-on: none
      assumes:    the counts are TD-064's and are **re-derived at execution, never carried from this
                  row**: 3 `ownership-header-missing` + 13 `ownership-header-field-missing` = 16
                  `update-trigger-absent`, the three reconciling against each other (L-108 · L-130 —
                  a figure frozen into a DoD is a query result). If the numbers have moved, the
                  movement is itself the finding
      tracker:    TD-064 · SPRINT-075 (filed) · SPRINT-076 T5 (halved by ruling, not by writing)
      origin:     manual
      state:      ready

- [ ] TASK-258 — Rule how a repository declares a *reasoned* Base-tier doc exemption  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  the ruling lives in the artifact the **engine** reads, and `sh conformance.sh .`
                  either stops emitting the two `tier-doc-set-incomplete` findings or names them as an
                  explicit exclusion — never silently dropped (L-058). If the ruling adds a declaration
                  file or a §2 row it is ADR-grade and the ADR lands with it
      touches:    spec/STANDARD.md §6 (and §2 if a row is added) · scripts/lib/conformance-engine.sh ·
                  evals/ fixtures for whichever arm is built · docs/architecture/overview.md
                  § Base-tier docs this repo deliberately does not have (which currently holds the
                  ruling alone, where no tool can reach it) · TECH-DEBT.md (TD-077)
      depends-on: none
      assumes:    the two candidate arms are TD-077's — **(a)** extend `.conformance-tier`'s
                  declaration pattern to per-doc exemptions carrying a reason string · **(b)** make
                  §6's Base rows condition-gated the way §2's team-gated rows already are. Neither is
                  pre-selected: this row exists to force the choice, not to record one already taken
      tracker:    TD-077 · ADR-028 (the precedent — a disposition moved into the artifact the tool
                  reads) · L-151 · SPRINT-054 T1 (where the two exemptions were ruled)
      origin:     manual
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

_(no active sprint)_ — SPRINT-078's shipped changes are written up as **v1.52.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Coverage 19 → 30 of 62; `.conformance-tier` is the one new consumer-facing surface.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

