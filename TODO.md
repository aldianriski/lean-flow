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

> _(none — SPRINT-077 closed 2026-08-21. Next: `/task-decomposer` on EPIC-004's ~32 remaining
> coverage rules (**TASK-245**), which is the epic's last open § Closed-when condition and has no
> backlog tasks yet — so it needs intake before it can be promoted, not another `promote`.)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [ ] TASK-245 — Decompose EPIC-004's remaining coverage rules into buildable tasks  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  the ~32 `build` rules in `docs/research/conformance-dispositions.md` exist as
                  `TASK-NNN` entries (or as a small number of grouped vertical slices), each with a
                  `done-when` naming **the finding string its check must fire** — a check specified
                  without its finding name is a half-shipped gate (L-058) — and enough are `state:
                  ready` to form the next coverage sprint
      touches:    TODO.md · docs/research/conformance-dispositions.md (only if a disposition changes
                  on contact) · no code
      depends-on: none
      assumes:    **the count is a query result and gets re-derived at intake, not copied from here**
                  (L-130). "~32" is SPRINT-076's figure for the `build` bucket and SPRINT-077 changed
                  no disposition, so it should still hold — but the register is the source, not this
                  row. Also: **grouping is a decision, not a formality.** 32 one-rule tasks would be
                  a worse backlog than 6 grouped slices, and §6's four tier rules are already
                  dispositioned as *one check, four tiers — the tier is a parameter, not four
                  checkers*, which is the shape to look for elsewhere
      tracker:    EPIC-004 § Closed-when 2 (the epic's last open condition) · SPRINT-076 T4's ruling
                  that the bar stands · SPRINT-077 § Out (which names this as the next entry, and
                  names `/task-decomposer` rather than `promote` as the skill that runs it)
      origin:     close-retro
      state:      ready

### P2 — Quality / Polish

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

_(no active sprint)_ — SPRINT-077's shipped changes are written up as **v1.51.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand at close (all four manifests + README footer). **The spec DID move this time**, which is the difference from SPRINT-075's close: `spec/STANDARD.md` goes to **0.5.0** because §2 reclassifies four rows from unconditional to substrate-conditional — an existing adopter's report loses up to four `core-file-missing` findings and their level can move without their tree changing, which is the line PATCH is not allowed to cross (§2's own row names *reclassified* as a bump trigger). The plugin MINOR is for the same reason on the consumer side: what `conformance.sh` reports about a stranger's repository changes. §11's keep-current-plus-previous rule wants **v1.51.0 + v1.50.0** inline with **v1.49.0 rotated** → `docs/changelog/CHANGELOG-1.49.0.md` — part of the retention pass, applied on owner approval.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

