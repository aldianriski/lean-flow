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

