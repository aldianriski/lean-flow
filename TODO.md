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

> _None._ SPRINT-057 closed 2026-08-10.

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

_(no active sprint)_ — SPRINT-057's shipped changes are written up as **v1.31.0** in [`CHANGELOG.md`](CHANGELOG.md); SPRINT-056's as **v1.30.0** in [`CHANGELOG.md`](CHANGELOG.md) and await the MINOR version bump (feature sprint → by hand; `/release-patch` is PATCH-only). SPRINT-055's shipped as v1.29.0, SPRINT-054's as v1.28.0. Rotated archives → `docs/changelog/`.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

