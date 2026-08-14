---
owner: Maintainer
last_updated: 2026-08-14
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

> **SPRINT-063 — Headroom** → [`docs/sprint/SPRINT-063-headroom.md`](docs/sprint/SPRINT-063-headroom.md)
>
> Second member sprint of EPIC-002. Every one of its four tasks maps to one of the epic's four
> Closed-when conditions, so the epic is answerable at close. SPRINT-062 built the procedure for ruling
> a cap and delivered no headroom; this one spends it.
>
> **Roadmap** → [`docs/epic/INDEX.md`](docs/epic/INDEX.md). Four sequenced epics (ADR-018):
> **EPIC-002 Make Room** (runs first — the caps block everything after it) → **EPIC-003 The Standard**
> → **EPIC-004 Conformance** → **EPIC-005 Fleet**. Evidence base:
> [`docs/research/platform-readiness-audit.md`](docs/research/platform-readiness-audit.md).
> Backlog below is ranked against that sequence, not by age.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- EPIC-002 Make Room — the critical path. These block EPIC-003/004/005, which have nowhere to
     write their rules while both SSOT files sit at cap. -->

- [ ] TASK-196 — Rule the cap structure on all three governance files, don't trim to fit  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  CLAUDE.md, CONTEXT.md **and TODO.md** each carry ≥15% headroom by a recorded ruling —
                  a raised cap with an ADR, a §6 split, or content moved to a satellite behind a pointer
      touches:    .claude/CLAUDE.md · .claude/CONTEXT.md · TODO.md · docs/adr/ · DOCS_Guide §2
                  · scripts/lib/doc-caps-grandfathered.txt
      depends-on: none — **unblocked**: TASK-192 shipped in SPRINT-062, and the precedent it set is
                  now `DOCS_Guide` §2's Growth rule (drift vs a cap that was never reachable). Apply
                  that rule here rather than re-deriving one
      assumes:    ADR-017 already raised CONTEXT 130→150 once, so a second raise needs a *different*
                  argument or it is trimming-by-ADR — and ADR-015 forbids grandfathering a soft cap.
                  L-008/TD-006 name the actual mechanism (CONTEXT accreting duplication of its
                  satellites); test that hypothesis before raising any number, per L-091.
                  **TODO.md is the clean case and is scoped in by the Sprint-062 promote sign-off:**
                  entries written to the standard's own § Task entry shape run ~15 lines each, so a
                  backlog of eight needs ~120 lines before any scaffolding — cap and schema cannot
                  both hold. Arithmetic, not drift (L-106 ×3). The figure moves with the backlog;
                  measure it at start rather than trusting a number written here
      tracker:    EPIC-002 · ADR-015 · ADR-017 · L-008 · L-106 · TD-006 · SPRINT-062 promote
      origin:     manual
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-199 — Re-sort the two remaining §2 breaches against the new Growth rule  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `graph-engineering.md` (122) and `loop-hygiene-prd.md` (139) are each sorted into
                  drift or never-reachable per §2's Growth rule, and ruled accordingly
      touches:    docs/research/graph-engineering.md · docs/research/loop-hygiene-prd.md · possibly
                  DOCS_Guide §2 · possibly docs/adr/
      depends-on: none
      assumes:    **do not inherit "ordinary drift" from TASK-192's text — that phrase is the error.**
                  L-106's own body records `graph-engineering.md` as having "no movable section and no
                  whitespace slack", and says both docs "had been carried as *drift* for sprints"; the
                  mislabelling is what L-106 was written to correct, and TASK-192 repeated it while
                  citing it. Sort each doc fresh against the Growth rule §2 now carries. `loop-hygiene-prd.md`
                  has not been examined at all and may genuinely be drift — the point is that neither
                  diagnosis is currently evidence-backed
      tracker:    SPRINT-062 T1 Retrieval check · L-106 · DOCS_Guide §2 Growth rule
      origin:     close-retro
      state:      ready

- [ ] TASK-200 — Widen L-108's placement to reach verification, not just authoring  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  a promoted rule about matcher shape is reachable from the moment someone is running
                  an ad-hoc verification query, not only when authoring a checker or naming a fixture
      touches:    .claude/CONTEXT.md § Gates · possibly .claude/CLAUDE.md · docs/LEARNINGS.md
      depends-on: none
      assumes:    L-108 was promoted, correctly placed, **and loaded in context** for all of SPRINT-062,
                  and still reached none of three fresh violations — two of them produced while
                  verifying the first (L-113). Its placement enumeration lists only *authoring* flows;
                  every failure was a verification grep inside a gate pass, where the result is acted
                  on immediately with no review between query and conclusion. **`CLAUDE.md` is at
                  80/80 and `CONTEXT.md` at 132/150, so this may be blocked behind TASK-196** — check
                  before designing. Re-derive: "add another sentence to § Gates" is the obvious move
                  and is what already failed to fire
      tracker:    SPRINT-062 Retro · L-113 · L-108 (count 4)
      origin:     close-retro
      state:      ready

- [ ] TASK-195 — Apply one §11 archive pass to docs/research/  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  every research doc that is `status: superseded` **and** has no live citer sits in
                  `archive/`, marked in the generated index; the applied count is reported either way
      touches:    docs/research/* · docs/knowledge-index.md
      depends-on: none
      assumes:    31 docs, and §11 is explicit that supersession alone is not sufficient — a spent
                  verdict is usually the WHY-trail for whatever replaced it, and closed history plus
                  the generated index never count as citers. Expect **few** moves; the deliverable is
                  the applied pass and its count, not a reduction target. `platform-readiness-audit.md`
                  is `current` and cited by four epics — not a candidate
      tracker:    EPIC-002 · DOCS_Guide §11
      origin:     manual
      state:      ready

- [ ] TASK-197 — Decide whether the 11 checkers consolidate now, or wait for EPIC-004  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a recorded decision — one engine, split by concern, or stand alone — with a one-line
                  reason per survivor, or an explicit deferral to EPIC-004 with the reason
      touches:    scripts/lib/check-*.sh · scripts/qa-check.sh · EPIC-002 · EPIC-004
      depends-on: none
      assumes:    **deferral may be the right answer and must stay on the table.** EPIC-004 makes the
                  engine *spec-driven*; consolidating now into a non-spec-driven engine is work EPIC-004
                  would redo. Do not assume consolidation because it is the tidy move (L-091). The
                  contract being protected is the **named finding per check** (L-058), never the file count
      tracker:    EPIC-002 · EPIC-004 D1 · L-058
      origin:     manual
      state:      ready

- [ ] TASK-198 — Rule what CONTEXT.md becomes once the spec is extracted  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  a recorded ruling on whether `.claude/CONTEXT.md` stays an SSOT or becomes a consumer
                  of the extracted spec, with the migration-window risk named and its mitigation stated
      touches:    .claude/CONTEXT.md · docs/adr/ · EPIC-003
      depends-on: none
      assumes:    this is settled BEFORE the first extraction commit, not during it. Extraction that
                  leaves the same rule in two places mid-migration is precisely the second SSOT LAW 4
                  and the anti-SSOT rule forbid — ADR-018 accepts that risk explicitly and names this
                  task as how it gets retired. Blocking for EPIC-003, not for EPIC-002
      tracker:    EPIC-003 open question 3 · ADR-018
      origin:     manual
      state:      ready

- [ ] TASK-201 — Rule what the critic's Spec axis compares against  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a recorded ruling on whether a task gains an external `reference:` comparand, or
                  whether `done-when` plus the retained must-FAIL fixtures already supply one
      touches:    skills/orchestrator/references/review-scoping.md · .claude/CONTEXT.md § Task entry
                  shape (only if the ruling adds a field) · EPIC-004
      depends-on: none
      assumes:    **the null answer must stay genuinely on the table** — "add a field" is the tidy move
                  and L-091 says test the hypothesis first. External comparands already exist for
                  *gates* (a retained must-FAIL fixture failing with its named finding, L-058) and for
                  behaviour (`/run` + `/verify`); what is unmatched is only the **Spec** axis, which
                  today measures against a `done-when` written by the same pipeline that built the
                  work. For this repo's substrate a doc rendered against its own template may already
                  be the comparand (L-016) — check that before touching § Task entry shape, which
                  would also pull in the CONTEXT.md cap and TASK-196
      tracker:    docs/research/gauntlet-loop-delta.md · EPIC-004 · L-058 · L-091
      origin:     manual
      state:      ready

- [ ] TASK-202 — Wire the worst-finding-per-axis into a bounded builder retry  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  a scoped reviewer's single worst finding **per axis** is handed back to the builder
                  for a bounded retry, re-reviewed, and the outcome logged — exercised once on real
                  input **and** once on input that must FAIL with its named finding, fixtures retained
      touches:    skills/orchestrator/references/review-scoping.md · skills/orchestrator/SKILL.md
                  § Review · evals/fixtures/
      depends-on: TASK-201 — unblocks once the comparand is ruled
      assumes:    this is **wiring, not a new capability**: review-scoping.md already computes "the
                  single worst finding per axis" and nothing consumes it — the L-020 shape. Scope is
                  **attended modes only** (`quick`/`mvp`/`sprint-bulk` with a human present);
                  unattended is TASK-203 and must not be smuggled in here. Home is the reference file,
                  uncounted under ADR-006, so this is **not** blocked behind TASK-196 the way TASK-200
                  is — but new control flow is exactly where a silent false-negative hides, so L-058's
                  must-FAIL half is the acceptance bar, not a nice-to-have (TD-012: retain them)
      tracker:    docs/research/gauntlet-loop-delta.md · L-020 · L-058 · TD-012 · ADR-006
      origin:     manual
      state:      blocked

- [ ] TASK-203 — Rule whether the revise loop may run unattended, and on what budget  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  a recorded ruling — an ADR if it carves out the charter — on whether a critic-driven
                  retry may fire inside an unattended run, with a hard ceiling and a rollup line per
                  retry, or an explicit "attended only" with the reason stated
      touches:    skills/orchestrator/references/night-run.md · docs/adr/ · EPIC-005
      depends-on: TASK-202 — there is nothing to rule on until the attended loop exists
      assumes:    **a critic ruling "not good enough, retry" is a decision, and the unattended charter
                  is execute-only — decide nothing.** That collision is the whole task; do not resolve
                  it by reading the retry as mere execution. Hard-to-reverse **and** surprising **and**
                  a real trade-off → likely ADR-grade, and a `/council` candidate if it does not settle
                  at G2. The budget half is **EPIC-005 D2** shaped (delegation policy declared per repo,
                  read by the run, never held by a coordinator) — note the source article's "agent
                  fleet" is a false cognate for EPIC-005's fleet and does not import its design
      tracker:    docs/research/gauntlet-loop-delta.md · ADR-016 · EPIC-005 D2 · night-run.md Part 0
      origin:     manual
      state:      blocked

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

_(no active sprint)_ — SPRINT-061's shipped changes are written up as **v1.35.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.35.0 + v1.34.0** inline, with **v1.33.0 rotated** → [`docs/changelog/CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) in the same commit.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

