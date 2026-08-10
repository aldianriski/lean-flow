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

> _None._ SPRINT-058 closed 2026-08-10.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-177 — Put the four grandfathered cap breaches on a diet, or move their caps by ADR  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  `scripts/lib/doc-caps-grandfathered.txt` is empty, and each entry left it by one of
                  two routes recorded in the file's history: the doc came back under its stated cap,
                  or its cap moved by ADR after a measured diet (§7). The checker already prints
                  "back under cap: DELETE its grandfather row" when a row has earned removal
      touches:    docs/research/{loop-hygiene-prd,graphify-daily-value,graph-engineering}.md ·
                  AGENTS.md · scripts/lib/doc-caps-grandfathered.txt · docs/adr/ if a cap moves
      depends-on: none
      assumes:    the three research docs (214 · 157 · 122 against 120) split by moving whole
                  sections, never by compressing — §7 says knowledge docs split and ledgers compress,
                  and SPRINT-054 T4 has a worked precedent. AGENTS.md at 11 vs ~10 is the odd one:
                  the cap is written approximate and the file is a thin pointer, so the honest fix
                  may be to state a real number in §2 rather than to trim a line
      tracker:    SPRINT-056 T2 — the check that found them; three were known, AGENTS.md was not
      origin:     close-retro
      state:      ready

- [ ] TASK-178 — Measure where the gate's 126 seconds actually go before moving anything  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  a per-harness timing breakdown exists for a bare `qa-check.sh` run, and the
                  decision to move / cheapen / keep each always-on harness is made against that
                  table rather than against an impression
      touches:    scripts/qa-check.sh · evals/ (measurement only; changes are a separate task)
      depends-on: none
      assumes:    no harness is moved to `QA_FULL=1` inside this task. Moving one is a coverage
                  reduction and carries L-076's proof obligation — demonstrate what a bare run no
                  longer catches — which is its own work. This task produces the number that decision
                  needs, because there isn't one: 126s is the only figure anyone has, and the
                  per-harness split has never been taken (L-097)
      tracker:    TD-046
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

