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

_(no active sprint)_ — SPRINT-075 closed at **26 of 26 DoD**; the next sprint is formed by `/lean-doc-generator promote` from the Backlog below.

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

### P2 — Quality / Polish

- [ ] TASK-237 — Give §3 an explicit ADR row, the way it already names README and AGENTS.md  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `spec/STANDARD.md` §3 states that ADRs carry ADR-009 knowledge metadata instead of
                  the four-field ownership header, alongside its existing README and AGENTS.md
                  exceptions — and `conformance-engine.sh` cites that row rather than carrying the
                  ruling only in its own comment. Spec PATCH, not MINOR: it writes down an exception
                  adopters were already relying on, so nothing they satisfy today changes
      touches:    spec/STANDARD.md (§3) · spec/CHANGELOG.md · scripts/lib/conformance-engine.sh (the
                  comment citing the ruling) · docs/research/conformance-dispositions.md if the note
                  there needs re-pointing
      depends-on: none
      assumes:    the exemption itself is settled — it was ruled at SPRINT-075 T6 and is already
                  enforced and named in the engine's report. What is open is only *where it is
                  written*: today it lives in code plus a report line, which is the wrong home for a
                  statement about what the standard requires. **§4 ships the template that creates the
                  conflict**, so re-read §4's frontmatter block before wording §3's row
      tracker:    SPRINT-075 T6 · spec/STANDARD.md §3 · §4 · ADR-009
      origin:     close-retro
      state:      ready

- [ ] TASK-238 — Re-run the foreign-repo artefact triage once coverage is past the shape-bound rules  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the T3 triage is repeated against a from-scratch repo with §2's placement rules, §6's
                  tier doc-sets and §11's ledger rules implemented, and each finding is classified
                  *actionable by that repo's owner* or *an artefact of dispositions written against our
                  shape* — with the verdict recorded. A high artefact count is a finding about
                  `docs/research/conformance-dispositions.md` and routes back there; the engine is not
                  tuned to look quiet
      touches:    evals/run-foreign-repo-fixtures.sh (extend the target if the new rules need one) ·
                  docs/research/conformance-dispositions.md (only if artefacts are found) · the
                  sprint Execution Log that runs it
      depends-on: none
      assumes:    **SPRINT-075 T3's "0 artefacts" is honest but early, and re-promoting this on the
                  strength of that number would be reading it backwards.** Only 6 of 62 checkable
                  rules had assertions, and none of them were the rules most likely to encode our own
                  directory shape — so the question was barely asked, not answered. The trigger is
                  coverage reaching those families, not a schedule
      tracker:    SPRINT-075 T3 · EPIC-004 § Closed-when 1 · L-015 · L-016
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

_(no active sprint)_ — SPRINT-075's shipped changes are written up as **v1.49.0** in [`CHANGELOG.md`](CHANGELOG.md), and the MINOR bump landed with the close (all four manifests + README footer). §11's keep-current-plus-previous rule is satisfied: **v1.49.0 + v1.48.0** inline, with **v1.47.0 rotated** → [`docs/changelog/CHANGELOG-1.47.0.md`](docs/changelog/CHANGELOG-1.47.0.md) in the same commit. **The spec did not move this time** — `spec/STANDARD.md` stays at **0.4.1**, because the engine reads the standard rather than changing it; the one spec obligation this sprint surfaced (§3 owes an explicit ADR row) is filed as **TASK-237** rather than slipped in at close. **The plugin MINOR is for the engine**: `conformance.sh` + `scripts/lib/conformance-engine.sh` are a new consumer-facing capability, and `rule-unimplemented` becoming a `GAP` changes what an adopter's exit code means — which is why ADR-027 carries a refinement marker rather than a silent edit.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

