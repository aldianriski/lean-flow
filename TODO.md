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

> **SPRINT-060 — Make Room** → [docs/sprint/SPRINT-060-make-room.md](docs/sprint/SPRINT-060-make-room.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-188 — Exercise the reaper on a genuinely partial Plan  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
                  as `unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via
                  `--reap`. The reaper's partial-Plan path is currently proven three ways that all
                  stop short of this: a real log replayed through `--reap`, a zero-ticked-box
                  regression, and an end-to-end run against a Plan that was already complete
      touches:    scripts/night-run.sh (only if the exercise finds a defect) · a sprint Execution Log
      depends-on: none
      assumes:    the gap is real but narrow — the wrapper→reaper path IS proven end-to-end, and the
                  unattempted-line logic IS proven on real input; what has never run together is both
                  at once. Re-derive before spending a run on it (L-091): if the next ordinary night
                  run stops mid-Plan for its own reasons, that IS this exercise and no separate run is
                  needed. Do not manufacture a partial sprint just to produce the evidence
      tracker:    SPRINT-059 close Retro · ADR-016
      origin:     close-retro
      state:      ready


- [ ] TASK-182 — Run the CONTEXT.md dedup pass; it is at 129/130  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  `.claude/CONTEXT.md` has real headroom again, with every removal being prose that
                  duplicated `CLAUDE.md` or `README.md` and is replaced by a pointer — never the
                  SSOT's own content compressed to make a number go green (§7, and L-106's shape one
                  level up)
      touches:    .claude/CONTEXT.md · .claude/CLAUDE.md and README.md if a pointer target needs one
      depends-on: none
      assumes:    the duplication is there to find. TD-006 and L-008 both describe this file
                  accreting its satellites' prose, and the dedup pass has run once in ~50 sprints —
                  but that is the *hypothesis*, not the finding (L-091). Re-derive by diffing the
                  three files' overlapping sections before deciding anything is removable; if the
                  overlap turns out to be small, the honest answer is an ADR moving the cap, exactly
                  as ADR-007 did to reach 130 in the first place
      tracker:    TD-006 · SPRINT-058 close sweep — L-105's promotion took it to 129/130
      origin:     close-retro
      state:      ready

- [ ] TASK-180 — Measure the QA gate's inline half (sections 1–11) directly  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  a per-section wall-clock breakdown of `scripts/qa-check.sh` sections 1–11 exists,
                  measured directly rather than by subtraction, ≥2 samples, appended to
                  `docs/research/qa-gate-timing.md`. The move/cheapen/keep decision for the gate is
                  then made against that table
      touches:    docs/research/qa-gate-timing.md · scripts/qa-check.sh (instrumentation only, if any)
      depends-on: none
      assumes:    SPRINT-058 T2 established the inline half is ~66% of the runtime, but **by
                  subtraction** — full-run minus standalone-harness totals, two separate process
                  invocations with their own cache state. Re-derive that share before acting on it
                  (L-097); the proportion is sound, the second-level figures are not. If direct
                  timing needs a script edit, that is a finding, not a workaround — T2's brief
                  refused the same trade and the refusal is what kept the measurement honest
      tracker:    TD-046 · docs/research/qa-gate-timing.md § Out of scope
      origin:     close-retro
      state:      ready

- [ ] TASK-181 — Rule on `loop-hygiene-prd.md`'s status: current vs superseded  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the doc carries a deliberate `status:`, and the reasoning is recorded wherever the
                  ruling lands. Either outcome is a result; what is not acceptable is the field
                  staying `current` because nobody looked
      touches:    docs/research/loop-hygiene-prd.md · skills/lean-doc-generator/references/DOCS_Guide.md
                  (only if the RESEARCH status rule needs sharpening)
      depends-on: none
      assumes:    every workstream in the doc has shipped, which is what the RESEARCH template says
                  triggers `superseded` — SPRINT-058 T1 corrected its "nothing here has been applied"
                  banner on exactly that evidence. Note this changes nothing mechanical: §11 archives
                  a superseded doc only once nothing live cites it, and three live surfaces cite this
                  one, so it stays put and keeps its cap coverage either way. The question is whether
                  the corpus should say true things about its own state, not whether a file moves
      tracker:    SPRINT-058 T1 Execution Log, 2026-08-10 surprise entry
      origin:     close-retro
      state:      ready

- [ ] TASK-179 — Guard ADR-015 rule 2: reject a soft-cap row in the grandfather file  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `check-doc-caps.sh` FAILs when `doc-caps-grandfathered.txt` names a path whose §2
                  cap is soft (`~N` / `N soft`), with a retained must-FAIL fixture holding exactly
                  that violation (L-058). Today the rule is prose in the file's header and in
                  ADR-015; nothing stops the next breach being recorded there
      touches:    scripts/lib/check-doc-caps.sh · scripts/lib/doc-caps-grandfathered.txt ·
                  evals/fixtures/doc-caps/ · evals/run-doc-caps-fixtures.sh
      depends-on: none
      assumes:    the checker already parses soft-vs-hard (it does — `soft = (cap ~ /~/ ||
                  cap ~ /soft/)`), so this is a comparison against a list it already reads, not new
                  parsing. Re-derive before building (L-091): ADR-015's Negative section names this
                  guard's absence as an accepted trade, so confirm it is still worth closing
      tracker:    ADR-015 § Consequences — "nothing enforces rule 2 yet"
      origin:     manual
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

_(no active sprint)_ — SPRINT-058's shipped changes are written up as **v1.32.0** in [`CHANGELOG.md`](CHANGELOG.md), SPRINT-057's as **v1.31.0** and SPRINT-056's as **v1.30.0**. All three await the MINOR version bump (feature sprint → by hand; `/release-patch` is PATCH-only) — `plugin.json` still reads 1.29.0. SPRINT-055's (v1.29.0) and SPRINT-054's (v1.28.0) blocks rotated → [`docs/changelog/CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md).

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

