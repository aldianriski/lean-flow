---
owner: Maintainer
last_updated: 2026-08-09
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

> _None._ SPRINT-055 closed 2026-08-09.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-173 — Stop the dispatch preflight silently passing what it cannot parse  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  the preflight reports the same shared-file ownership verdict as the full checker on
                  (a) a wrapped/indented `Layers:` declaration and (b) a directory token ending in `/`;
                  both proven by must-FAIL fixtures in which the preflight currently reports CLEAR on
                  a real overlap and afterwards HALTs with its named finding
      touches:    orchestrator/references/dispatch.md (the embedded snippet) · scripts/lib/ ·
                  evals/ (fixtures + harness) · scripts/qa-check.sh if the wiring changes
      depends-on: none
      assumes:    the snippet and check-layers-completeness.sh duplicate a parser, and TD-040's own
                  mitigation asks whether the snippet should CALL the real checker rather than be
                  patched a second time. Re-derive that first — patching twice is how the drift
                  happened. Consumer-facing surface: the snippet ships inside a reference doc
      tracker:    TD-040 (2 live silent false PASSes: SPRINT-053 + SPRINT-054 promotes) · TD-043
      origin:     decomposer
      state:      ready

- [ ] TASK-174 — Derive gate coverage from the standard instead of hand-listing it  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  a §2 row that states a cap is cap-checked without anyone adding a glob by hand, and
                  all four version manifests are compared to each other rather than one being compared
                  to the README; a must-FAIL fixture proves each half — a doc over its stated cap, and
                  one manifest out of lockstep with its siblings
      touches:    scripts/qa-check.sh · scripts/lib/ · DOCS_Guide §2 (as the source the coverage is
                  derived FROM, if that is the chosen shape) · evals/
      depends-on: none
      assumes:    the two halves are one concern — coverage hand-listed instead of derived — which is
                  why they are one task. If G2 rules that caps derive from §2 but manifests cannot,
                  split before implementing. `docs/research/` at 120 is the known-drifted case; §7 says
                  its figure moves only by ADR after a measured diet, and SPRINT-054 T4 did one
      tracker:    TD-041 (mattpocock.md drifted 39 lines over 4 sprints unreported) · the v1.29.0
                  release finding (4 manifests carry the version, 1 is guarded)
      origin:     decomposer
      state:      ready

- [ ] TASK-175 — Make an undeclared edit fail while it can still be fixed cheaply  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  an undeclared edit to a file that the WIP path excludes is reported BEFORE its task
                  commits, not after — demonstrated on the recorded case (a task editing `TODO.md` as
                  task work rather than close bookkeeping); a must-FAIL fixture holds the behaviour
      touches:    scripts/lib/check-layers-observed.sh · docs/QA.md (it documents the two paths) ·
                  evals/
      depends-on: none
      assumes:    the WIP/committed exclusion asymmetry is DELIBERATE and documented (attribution
                  answers by role) — this task must not flatten it. The open design question is whether
                  exclusion should key on the file or on the phase that touched it, and that is
                  unanswered on purpose. Narrowing either list on one observation is TD-031's pattern
      tracker:    TD-044 (SPRINT-055 T6/T7)
      origin:     decomposer
      state:      ready

- [ ] TASK-176 — Keep the sprint checks armed through the commit that closes the sprint  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  the commit that writes a Retro and flips `status: closed` is validated against the
                  sprint schema and caps before the flip is honoured, and a check that verified zero
                  inputs reports as a skip rather than a PASS; a must-FAIL fixture presents a close
                  commit carrying a schema violation and the gate goes red
      touches:    scripts/qa-check.sh (sprint checks + the two layers legs) · scripts/lib/ ·
                  docs/QA.md · evals/
      depends-on: none
      assumes:    two halves — reporting (zero-verified must not read as a pass) and ordering (the
                  close commit is validated before the status flip). TD-042 says the reporting half may
                  be the whole fix; re-derive before building, and split if G2 finds them separable.
                  Scoping a closed sprint out of validation is itself defensible — the defect is the
                  timing, not the scoping
      tracker:    TD-042 (2 instances: 72→68 at SPRINT-054 close, 94→87 at SPRINT-055 close)
      origin:     decomposer
      state:      ready

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

_(no active sprint)_ — SPRINT-055's shipped changes are written up as **v1.29.0** in [`CHANGELOG.md`](CHANGELOG.md) and await the MINOR version bump (feature sprint → by hand; `/release-patch` is PATCH-only). SPRINT-054's changes shipped in v1.28.0. Rotated archives → `docs/changelog/`.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

