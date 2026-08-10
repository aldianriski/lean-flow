---
sprint: 058
slug: measure-before-moving
owner: Maintainer
last_updated: 2026-08-10
status: active
gates_signed: G1,G2 @ 4ff33a7
plan_commit: 26fe6a0
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-058 — Measure Before Moving

> **Theme:** Two rows have been held for sprints on a figure nobody re-took. Four docs sit over their
> caps under a clause that says a cap moves only after a *measured* diet, and the gate's 126 seconds is
> a single sample from one run at one close, with no per-harness split behind it. Neither is a bug —
> both are decisions waiting on a number that was never measured a second time. This sprint takes the
> measurements and makes the two rulings they unblock; it moves nothing that the numbers do not carry.

## Scope

**In:** the four grandfathered cap breaches resolved, each by a recorded route (diet, or a cap moved by
ADR) until `doc-caps-grandfathered.txt` holds no data rows · a per-harness timing breakdown for a bare
`qa-check.sh` run, landed as a research doc that TD-046's eventual move/cheapen/keep decision can be
made against.

**Out (deferred):** moving any harness behind `QA_FULL=1` — that is a coverage reduction carrying
L-076's proof obligation (demonstrate what a bare run no longer catches) and is its own task; T2
produces the number that decision needs, it does not make the decision · TD-045 and TD-047, both
re-reviewed at this promote and not aged (2 sprints and 1) · TD-037, re-scoped and **held** at this
promote on a corrected basis — its trigger is a miss attributable to the all-task *union*, which
TD-044's phase-split fix did not touch · the pending MINOR bump: `plugin.json` sits at 1.29.0 while
`CHANGELOG.md` carries v1.30.0 and v1.31.0, which is release work done by hand, not sprint work
(`/release-patch` is PATCH-only).

## Plan

### T1 — Clear the four grandfathered cap breaches by diet or by ADR `[size: M · risk: low · class: decision · HITL]`
Layers: `docs/research/loop-hygiene-prd.md` · `docs/research/graphify-daily-value.md` · `docs/research/graph-engineering.md` · `AGENTS.md` · `scripts/lib/doc-caps-grandfathered.txt` · `docs/adr/` · `docs/DECISIONS.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` · `docs/research/loop-hygiene-workstreams.md` · `docs/research/loop-hygiene-findings.md` · `docs/research/graphify-reference-run.md` · `docs/knowledge-index.md` · `TODO.md`
Cites: `docs/research/mattpocock.md` and SPRINT-054 T4 — the worked precedent for a split, read as an example and not touched
<!-- Layers: corrected mid-task (L-100) — see the 2026-08-10 scope-change entry in the Execution Log.
     DOCS_Guide.md moved Cites: -> Layers: when the ADR route was ruled; the three sibling docs did
     not exist when the Plan was frozen. -->
Depends-on: none
The grandfather file is a **report, not an exclusion** — every row prints on every run, and a row that
prints forever stops being read, which is how the breach it names becomes permanent. Each row leaves by
one of exactly two routes and the route is the decision: the doc comes back under its stated cap, or
the cap moves by ADR *after* a measured diet (§7). What §7 forbids is the third route nobody writes
down — compressing a knowledge doc until the number goes green, which trades the signal for the metric.
AGENTS.md is the odd one and is a ruling rather than a diet: its cap is written `~10`, approximate, and
the file is a thin pointer one line over, so the honest fix may be to state a real number in §2.

**Acceptance:** `scripts/lib/doc-caps-grandfathered.txt` holds no data rows, and for each of the four
the route it took is legible from git — a doc back under cap, or an ADR recording a moved cap and the
diet that earned it.

**DoD:**
- [x] Each of the four counts **re-measured at task start** against the value recorded in the
      grandfather file before any of it is acted on (L-097 — a stated figure is re-derived, never carried)
- [x] The three research docs are under 120 by **moving whole sections into a tree behind an index**, or
      their cap is moved by an ADR citing the measured diet — never by compressing prose (§7 ·
      SPRINT-054 T4's precedent, `docs/research/mattpocock.md` 159 → 110 with nothing compressed)
- [x] `AGENTS.md` resolved on its own terms — trimmed to its cap, **or** §2's approximate `~10` replaced
      with a real number by ADR. The approximate cap is what is being ruled on, not the file
- [x] `scripts/lib/doc-caps-grandfathered.txt` contains zero data rows; the header comment stays, since
      it documents the format the next breach will be recorded in
- [x] `sh scripts/qa-check.sh` green, and the cap check's **output** read per row — it already prints
      `back under cap: DELETE its grandfather row`, and that line is the per-row signal, not the exit
      status (L-103 — assert on content; all three of SPRINT-056's omissions exited 0)
<!-- QA: no tests here — docs + a config line. The gate is the check; read its report, not its code. -->

### T2 — Measure where the gate's 126 seconds actually go `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/qa-gate-timing.md` · `TECH-DEBT.md`
Cites: `scripts/qa-check.sh` · `qa-check.sh` · `evals/` — measured, not modified; any change to them is a separate task · `skills/lean-doc-generator/templates/RESEARCH.md.template` · `templates/RESEARCH.md.template` — the format the timing doc is rendered from, read not edited
Depends-on: none
126s is one sample, taken once at one close, and every argument about the gate being too slow to keep
running has been made against it. TD-046's own mitigation says the obvious lever — moving harnesses
behind `QA_FULL=1` — may be the wrong one, because several harnesses re-run their checker over the
entire live repo purely to guard a glob and a cheaper assertion may exist. That is a claim about *which*
harnesses, and nothing in the repo can answer it: the per-harness split has never been taken. This task
takes it and stops there. The value is the table, not a change made on the strength of it.

**Acceptance:** a per-harness wall-clock table for a bare `qa-check.sh` run exists in the repo, taken
more than once, and the move/cheapen/keep question can now be argued against rows rather than against
an impression.

**DoD:**
- [x] A per-harness wall-clock breakdown for a **bare** run (no `QA_FULL=1`), one row per always-on
      harness, measured on this host
- [x] The run is repeated and **at least two samples recorded per harness** — this task exists because a
      single sample was treated as settled, and reproducing that would be the same error one level down
- [x] The table marks which harnesses **re-run their checker against the whole live repo**, since that is
      TD-046's stated suspicion and the measurement is what confirms or kills it
- [x] It lands as `docs/research/qa-gate-timing.md` rendered from `templates/RESEARCH.md.template`,
      ≤120 lines, stating the decision question and **recommending without acting**
- [x] TD-046 points at the doc, and its `Mitigation:` line is either re-derived against the table or
      re-marked as still-a-hypothesis (L-091 — a Mitigation is the filer's guess, not a plan)
- [x] **No harness moved** to `QA_FULL=1`, and no harness edited — stated in the doc as the boundary,
      so the next reader does not mistake an unacted recommendation for a rejected one
<!-- QA: measurement only. The doc is the deliverable; the gate stays byte-identical. -->

## Owner-action checklist

_None._

## Decisions (pre-locked)

- **D1** — T1 and T2 share no file. Ordering is free and neither blocks the other, so no
  overlap-ownership row is needed and L-042's per-hunk staging rule is not engaged. Confirmed against
  the two `Layers:` declarations rather than assumed from the task titles.
- **D2** — T2's timing table lands as a **research doc**, not inside TD-046's ledger row. A ledger row
  records that a debt exists; it is not where evidence lives, and a table pasted into one is unreadable
  by the time it matters. The RESEARCH template exists for exactly this shape — a decision-driving
  question with evidence and a recommendation that feeds a later ruling.
- **D3** — T1 may produce an ADR (a cap move is hard-to-reverse and is a real trade-off — signal vs
  metric). T2 explicitly may not: it recommends and stops, because acting would be the coverage
  reduction this sprint has ruled out of scope.
- **D4** — governance applied at this promote, not deferred into the Plan: `L-105` promoted →
  `.claude/CONTEXT.md` § Gates and its ledger body collapsed (§11); `TD-037` re-scoped and held;
  `CHANGELOG.md` rotated (181 → 94 lines, v1.29.0 + v1.28.0 → `docs/changelog/CHANGELOG-1.29.0.md`).

## Assumptions

- **A1** — the four recorded counts are current: 214 · 157 · 122 · 11 against caps 120 · 120 · 120 · ~10.
  *Confirm: re-derived at promote 2026-08-10 — all four match the recorded values exactly. Re-derive
  again at T1 start; a figure confirmed at promote is not a figure confirmed at execution (L-097).*
- **A2** — the three research docs split by moving whole sections, never by compressing.
  *Confirm: DOCS_Guide §7 (knowledge docs split, ledgers compress) + SPRINT-054 T4's precedent.*
- **A3** — `AGENTS.md`'s cap is genuinely approximate in §2 (`~10`), which is why one line over is a
  ruling and not a breach. *Confirm: DOCS_Guide §2, AGENTS.md row.*
- **A4** — a bare `qa-check.sh` run is timeable per-harness without modifying the script.
  *Confirm: T2's first action; if it is not, the harness boundary is the finding and the DoD's
  "no harness edited" clause is what forces that to surface rather than be worked around.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-058-measure-before-moving.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/loop-hygiene-prd.md` | T1 | 214 → 118; two sections moved out (§7 diet) + a false "nothing here has been applied" banner corrected | Low | cap check PASS 118 ≤ 120 |
| `docs/research/loop-hygiene-workstreams.md` | T1 | new — W0–W6 moved verbatim | Low | cap check PASS 85 ≤ 120 |
| `docs/research/loop-hygiene-findings.md` | T1 | new — 29-row findings register moved verbatim | Low | cap check PASS 49 ≤ 120 |
| `docs/research/graphify-daily-value.md` | T1 | 157 → 107; reference run + consumer path moved out | Low | cap check PASS 107 ≤ 120 |
| `docs/research/graphify-reference-run.md` | T1 | new — the measured run and the rules derived from it | Low | cap check PASS 73 ≤ 120 |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2 `AGENTS.md` cap `~10` → `12` (ADR-015) — the cap never budgeted for the footer §3 mandates | Low | cap check PASS 11 ≤ 12 |
| `docs/adr/ADR-015-cap-precision-and-grandfathering.md` | T1 | new — records both cap rulings and the accepted loss of the soft-cap growth ratchet | Low | corpus metadata + refs lint |
| `docs/DECISIONS.md` | T1 | ADR-015 index row | Low | corpus refs resolve |
| `scripts/lib/doc-caps-grandfathered.txt` | T1 | emptied of data rows; header now states the hard-caps-only rule | Low | no grandfathered rows printed |
| `AGENTS.md` | T1 | unchanged — the cap moved, the file did not | Low | cap check PASS |
| `TODO.md` | T1 | TASK-179 filed (the guard ADR-015 names as missing) | Low | TODO hygiene check |
| `docs/knowledge-index.md` | T1 | regenerated (derived) after three new metadata-carrying docs | Low | knowledge index current |
| `docs/research/qa-gate-timing.md` | T2 | new — the per-harness table, two samples, recommending without acting | Low | cap check PASS 93 ≤ 120 |
| `TECH-DEBT.md` | T2 | TD-046's mitigation retired against the measurement; both its premises corrected | Low | TD aging check |
| `scripts/qa-check.sh` · `evals/` | T2 | **unchanged** — verified byte-identical vs `plan_commit` | None | empty `git diff --stat` |

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents).

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
