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

> **SPRINT-059 — Prove the Run Finished** → [docs/sprint/SPRINT-059-prove-the-run-finished.md](docs/sprint/SPRINT-059-prove-the-run-finished.md)

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

<!-- Field report from the first unattended run (lean-flow 1.29.0, a consumer's host): 12 findings,
     9 shipped in v1.31.0/SPRINT-057. These five close the remaining 3 — the class that survives a
     perfect allowlist, where the run reports success having done part of the work. -->

- [ ] TASK-183 — Define the unconditional exit rollup, with `unattempted`  [size: M] [risk: med] [HITL]
      class:      decision
      done-when:  Part 4 lists `unattempted` alongside done|blocked|parked-hitl|denied-tool|stalled,
                  and specifies a rollup block emitted at EVERY exit — headed by a `N of M DoD
                  ticked` line, so a short run is visible even when it hit no blocker. Part 2's
                  trigger recipe carries the continue-until-exhausted instruction (the work half,
                  which run 2 proved does hold). Orchestrator `sprint-bulk` steps 4 and 5 both route
                  to it. Traced once against run 1's real numbers (4 of 7 units, tree clean, exit
                  `success`): the trace shows what the morning reader would now see where they
                  previously saw nothing at all
      touches:    night-run.md Part 2 + Part 4 · orchestrator SKILL.md sprint-bulk 4–5 ·
                  CONTEXT.md § Gates unattended block, if the state list is quoted there
      depends-on: none
      assumes:    `done` tasks still need no per-task line — what becomes unconditional is the
                  BLOCK and its header count, not a line per green task. Findings 1–9 are already
                  closed at 1.32.0 (verified against night-run.md + the v1.31.0 changelog, not
                  inferred from the version number)
      tracker:    field report artifact b2718bc1 — finding 10
      origin:     decomposer
      state:      ready

- [ ] TASK-184 — Emit the rollup + calibration row from the launcher's exit path  [size: M] [risk: high] [HITL]
      class:      decision
      done-when:  after the fired command exits, the launcher counts DoD boxes in the active sprint
                  file, reads `total_cost_usd` / `num_turns` / `duration_api_ms` off the last
                  `result` event of the stream-json log, and appends both the TASK-183 rollup block
                  and the Part 4 calibration row to the Execution Log — with no `jq` dependency.
                  Exercised once on a real finished run, never a synthetic log. An ADR records WHERE
                  enforcement lives and names the trade: this reaches only consumers who use the
                  launcher, so the docs path must still serve everyone else
      touches:    scripts/night-run.sh · night-run.md Part 3 + Part 4 · docs/adr/ADR-NNN
      depends-on: TASK-183
      assumes:    the reaper fires only for a `sprint-bulk unattended` run and is skippable. A
                  script writing a committed doc is not new here — `gen-index.sh` already generates
                  one. The launcher is dependency-free POSIX sh and must stay that way, so the
                  `result` event is parsed without `jq`. F12's own evidence is that both calibration
                  rows in the field report were written by the human afterwards — this is the
                  finding closing itself
      tracker:    field report artifact b2718bc1 — finding 12 (governs 10 and 11)
      origin:     decomposer
      state:      ready

- [ ] TASK-185 — Gate the rollup: a recorded run without one FAILs the check  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  a new checker in the qa-check lib FAILs, with its own named finding, when a sprint
                  Execution Log records a completed unattended run and carries no rollup block or no
                  calibration row. Retained must-FAIL fixtures cover each check separately — one
                  missing-rollup, one missing-calibration-row, one well-formed pass (L-058, TD-012).
                  Wired into the always-on gate and its fixture runner, following the existing
                  checker + fixture-runner convention rather than inventing a new one
      touches:    the qa-check lib · the gate script · a new fixture directory + fixture runner
                  under evals
      depends-on: TASK-183
      assumes:    this is the half that makes the step gated-like-a-commit rather than merely
                  requested — the reaper emits, this refuses to let a missing one pass review.
                  Costs a fifteenth harness while TD-046 / TASK-180 is measuring gate runtime; that
                  is a stated trade, and this check reads one file rather than sweeping the repo
      tracker:    field report artifact b2718bc1 — finding 12, enforcement half
      origin:     decomposer
      state:      ready

- [ ] TASK-186 — Re-check open parks at task boundaries  [size: S] [risk: med] [HITL]
      class:      decision
      done-when:  Part 0's park protocol gains a step — when a park's unblock condition names a
                  later task in the same Plan, re-examine every open park as each subsequent task
                  takes ownership; if it is still not actionable at exit, it gets a rollup line
                  rather than silence. A sibling behavioural assertion joins the existing park
                  assertions, exercised on the field report's real case: a field parked for the
                  renderer, three later tasks owning that renderer, none revisiting it
      touches:    night-run.md Part 0 park protocol · orchestrator sprint-bulk step 5 pointer ·
                  an evals park assertion
      depends-on: TASK-183
      assumes:    the re-check binds the unattended protocol only — an interactive park reaches a
                  human at first-blocker halt. Also that this cannot be closed by asking more
                  clearly in the trigger: run 2 was asked in plain language to do exactly this and
                  did not
      tracker:    field report artifact b2718bc1 — finding 11
      origin:     decomposer
      state:      ready

- [ ] TASK-187 — Add the two field-report runs to the calibration table  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  Part 4's rows table carries run 1 ($23.04 · 178 turns · 64 min · 4 of 7 · inline)
                  and run 2 ($18.26 · 140 turns · 45 min · 3 of 3 · inline), with the honest reading
                  attached: $5.90 per unit delivered against the table's $8.27 and $5.42 — but those
                  are dispatched two-unit runs on a lighter repository, so the comparison is loose.
                  The figure that transfers is zero denials across 318 turns after $1.77 of probing,
                  against a predecessor run that lost roughly 40% of its turns to denials
      touches:    night-run.md Part 4 rows table
      depends-on: none
      assumes:    both rows were reconstructed by hand from the harness result payload, which is why
                  the table must say so — it is TASK-184's justification sitting in the data. These
                  are the first `inline` rows in a table whose three existing rows are all
                  coordinator-plus-agents, so the shape column carries real weight here
      tracker:    field report artifact b2718bc1 — evidence trail
      origin:     decomposer
      state:      ready

### P2 — Quality / Polish

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

