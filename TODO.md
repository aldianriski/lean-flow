---
owner: Maintainer
last_updated: 2026-08-10
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

> _None._ SPRINT-061 closed 2026-08-10 (3 of 3).
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

- [ ] TASK-192 — Rule `qa-gate-timing.md`'s cap: raise it, or split the doc  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the doc is no longer breaching a cap nobody intends it to meet — either the §2
                  research cap is raised for it by an ADR, or the doc is split per §6's cap-hit rule,
                  with the reasoning recorded either way
      touches:    docs/research/qa-gate-timing.md · skills/lean-doc-generator/references/DOCS_Guide.md §2
                  · possibly docs/adr/ · scripts/lib/doc-caps-grandfathered.txt
      depends-on: none
      assumes:    this is L-106's tell, not ordinary fat: the doc is **223 / 120** and is a longitudinal
                  measurement log accreting one round per sprint (three now), while the 120 cap is sized
                  for a write-once decision doc. It cannot be trimmed without deleting measurements that
                  are the whole point, which L-106 says means the number is wrong rather than the file.
                  Do NOT bulk this with the other two breaches — `graph-engineering.md` (122) and
                  `loop-hygiene-prd.md` (139) are ordinary drift and a different question. ADR-015 rules
                  that a soft cap cannot be grandfathered, so "add it to the list" is not available
      tracker:    SPRINT-061 Retro · L-106 · ADR-015 · SPRINT-058 T1 (the same tell, twice) · EPIC-002
      origin:     close-retro
      state:      ready

- [ ] TASK-193 — Give the §2 soft-cap report a consumer at promote  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a §2 soft-cap breach is visible to whoever signs the promote governance checklist,
                  rather than only to the gate's scrollback
      touches:    skills/lean-doc-generator/SKILL.md § Governance review ·
                  skills/lean-doc-generator/references/DOCS_Guide.md §10/§11
      depends-on: none
      assumes:    the failure is a **matcher with no consumer**, which is the exact inverse of the rule
                  SPRINT-061 T1 promoted, and neither caught it. `check-doc-caps.sh` has printed three
                  `OVER-CAP (soft)` rows on every run for sprints; SPRINT-061's promote scan reported
                  doc-aging clean because the checklist enumerates §11's four triggers and a §2 breach is
                  not one of them. Re-derive before writing (L-091): "add a fifth checklist line" is the
                  obvious move and may be wrong — the honest question is whether §11's trigger list or
                  §2's caps should own this, and a fifth line on a checklist read under time pressure is
                  how TD-047 describes items getting skipped
      tracker:    SPRINT-061 Retro · L-106 (count 2) · EPIC-002
      origin:     close-retro
      state:      ready

- [ ] TASK-194 — Establish whether LEARNINGS promotion is being stamped, then apply §11  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  it is known why 91 entries carry zero `promoted: yes`, and §11's collapse is applied
                  on that basis — with no durable rule losing the reader that stands on it
      touches:    docs/LEARNINGS.md · docs/knowledge-index.md · possibly DOCS_Guide §10/§11
      depends-on: none
      assumes:    **do not open this as a pruning task.** 91 entries and `grep -c "promoted: yes"` = 0
                  has two readings: the collapse already ran and left pointers (healthy), or promotion
                  happens without the field being stamped (a governance defect, and the count≥2
                  promotion rule is then running blind). Establish which BEFORE editing anything —
                  under the second reading, pruning destroys the evidence. EPIC-002's evidence rule
                  binds: nothing removed without showing it is not load-bearing
      tracker:    EPIC-002 · DOCS_Guide §11 · audit F7
      origin:     manual
      state:      ready

- [ ] TASK-196 — Rule the cap structure on all three governance files, don't trim to fit  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  CLAUDE.md, CONTEXT.md **and TODO.md** each carry ≥15% headroom by a recorded ruling —
                  a raised cap with an ADR, a §6 split, or content moved to a satellite behind a pointer
      touches:    .claude/CLAUDE.md · .claude/CONTEXT.md · TODO.md · docs/adr/ · DOCS_Guide §2
                  · scripts/lib/doc-caps-grandfathered.txt
      depends-on: TASK-192 (its cap-precision ruling sets the precedent this one applies)
      assumes:    ADR-017 already raised CONTEXT 130→150 once, so a second raise needs a *different*
                  argument or it is trimming-by-ADR — and ADR-015 forbids grandfathering a soft cap.
                  L-008/TD-006 name the actual mechanism (CONTEXT accreting duplication of its
                  satellites); test that hypothesis before raising any number, per L-091.
                  **TODO.md (206/150) is the clean case and is scoped in by the Sprint-062 promote
                  sign-off:** eight entries at the standard's own § Task entry shape is ~120 lines
                  before scaffolding, so cap and schema cannot both hold — arithmetic, not drift (L-106 ×3)
      tracker:    EPIC-002 · ADR-015 · ADR-017 · L-008 · L-106 · TD-006 · SPRINT-062 promote
      origin:     manual
      state:      blocked

### P2 — Quality / Polish

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

