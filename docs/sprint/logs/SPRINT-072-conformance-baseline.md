---
sprint: 072
slug: conformance-baseline
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-072 — Execution Log

> Append-only companion to [`../SPRINT-072-conformance-baseline.md`](../SPRINT-072-conformance-baseline.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | surprise | the tidy fix for a cap breach would have escaped the checker

**What G2 found.** All four tasks declared one artifact, `docs/research/conformance-inventory.md`.
That path sits under §2's **130 soft** cap, and ~156 classified rules rendered as a table will breach
it. Two measured facts decided the handling rather than instinct:

- A soft breach **reports, it does not fail**. The retained fixture `soft-cap-reports-not-fails`
  asserts exit **0** with `OVER-CAP (soft)`. So the gate would have stayed green.
- It **cannot be silenced**. `soft-cap-must-not-be-grandfathered` FAILs any attempt, per ADR-015
  rule 2, because a soft cap already has a route: it reports every run and §11 routes it to doc-aging.

So the cost of doing nothing is not a red gate — it is a permanent report that every future promote
re-litigates, which is worse in the way that is easy to accept and hard to remove.

**The surprise is what the obvious remedy would have done.** §6's cap-hit rule says split into a tree,
so `docs/research/conformance-inventory/` is the reflex. Probed rather than assumed: a file placed at
`docs/research/_captest/probe.md` produced **zero** rows from `check-doc-caps.sh`. The checker expands
§2's `research/<slug>.md` into a **non-recursive** glob, so **a subdirectory escapes the cap check
entirely**. The reflex fix would have "resolved" the breach by moving the artifact out of the
checker's reach — a green gate bought by hiding from it, which is precisely the false-negative L-058
exists to prevent, committed by the sprint whose whole subject is checker coverage.

Worth stating plainly because it generalises beyond this sprint: **`docs/research/` has a coverage
hole.** Anything under a subdirectory there is uncapped and unreported today. Not fixed here — D4
freezes checker architecture — but it is a finding this sprint is obliged to record rather than route
around, and T4 is the task that owns recording it.

**Owner ruling (2026-08-16).** Split into **four top-level research files**, one per task, each still
matched by the `docs/research/*.md` glob and each under 130:

| Task | Artifact |
|---|---|
| T1 | `docs/research/conformance-inventory-criteria.md` — the test + §2's classification |
| T2 | `docs/research/conformance-inventory-structural.md` |
| T3 | `docs/research/conformance-inventory-gated-attested.md` |
| T4 | `docs/research/conformance-baseline.md` — the reconciliation and the frozen baseline |

This applies §6's split rule *without* stepping outside the checker, which the subdirectory version
did not. **Not filed as a `scope-change`:** scope is untouched — the same rules are classified, by the
same tasks, in the same order, to the same acceptance. What changed is the artifact's shape, which is
a `Layers:` correction of exactly the kind L-100 calls expected, taken at G2 before any execution
rather than discovered mid-task.

**Second ruling — the chain stays strict.** Per-task files dissolve the shared-file overlap that
forced `T3 Depends-on: T2` at promote, so T2 and T3 *could* now run as a parallel wave. Declined:
T2 is the first application of T1's criteria at volume, and T3 should inherit what T2 learns about the
test rather than discovering it independently. A flaw in T1's test found twice, concurrently, is worse
than found once. `T1 → T2 → T3 → T4` holds.

### 2026-08-16 | progress | G1+G2 signed @ `1b2cdb4` — batch pass, full checklist

Batch G1 ran the **full** checklist, not the `origin: decomposer` fast path: the Plan's `### Tn` blocks
carry no `origin:` field and a missing origin is treated as ungrilled — the same ruling held at
SPRINT-070 and SPRINT-071. Four `M` tasks, no `L`, nothing to split.

**Assumptions, all re-derived at G2 and all exact for the first time this session:** A1 = **156**
gross candidates (rows 102 + bold 44 + bullets 10) · A2 = **11 checkers · 22 harnesses · 98 fixture
cases · 46 distinct finding strings** · A3 governance owner-signed at promote · A4 the three
EPIC-004-facing TD rows are read, not resolved, here · A5 **skills are fresh — 1.45.0 base-dir ==
1.45.0 repo**, the first sprint in four to start that way, after the reinstall verified on disk rather
than from the installer's report.

**Ownership map** — after the artifact split above: `conformance-inventory-criteria.md` → **T1** ·
`-structural.md` → **T2** · `-gated-attested.md` → **T3** · `conformance-baseline.md` and
`docs/epic/EPIC-004-conformance.md` → **T4**. No file is written by two tasks. The sprint file and this
Log are **coordinator-owned**, as always, and no task declares them.

**Sequencing.** Pre-dispatch preflight CLEAR at promote (`PASS base-ref`, waves `T1=0 T2=1 T3=2 T4=3`,
every overlap owned) and re-run after the Layers correction. All four tasks inline: T1 and T4 are
`class: decision`, and T2/T3 are classification work whose unit is a judgement per rule, where a
dispatched agent would need the criteria restated in full to do what the coordinator can do directly.

**Standing constraints carried into execution, restated so they bind at the point of work:** no checker
or execution architecture changes (D4, mechanically checked by T4's fourth DoD) · no percentage or
score in any output (D1) · a wrapper over the 11 checkers does not satisfy spec-driven (D3) · findings
are recorded, not acted on · EPIC-005 stays out of scope.

### 2026-08-16 | progress | T1 — the test is fixed, and §2 turns out to be ~half checkable

**§2's census re-derived at execution, per DoD 2: 59** — 40 table rows (37 data + 3 headers) + 17
bold-lead + 2 bullets. The promote estimate was also 59 and the two agree, which is the first time
this session a promote figure has survived re-derivation unchanged.

**The test** (in `conformance-inventory-criteria.md`): a candidate is a **rule** iff *"this repo
violates it"* is decidable of a repository. Everything else is **data** (a value a rule consumes),
**rationale** (deleting it changes no repo's conformance), or **structure** (the spec's own layout).
Exclusions were named rather than implied — 3 table headers and 2 sub-table labels as structure, the
exact-figure block and its two bullets as rationale — because a test that excludes nothing has not
been tested.

**The finding that reshapes the inventory: a §2 row is not a rule, it is a parameter set.** One row
carries six cells spanning three levels and both marks — `File` and `Cap` are Structural/mechanical,
`Create ←` and `Update ←` are Gated/judgment-only (a trigger is an event; no tool observes that it
happened), `Reader` is data, `Tier` is judgment. So §2 resolves into **6 rule families parameterised
by 37 rows**, not 37 rules. That distinction is the whole of EPIC-004 D1 in miniature: the families
are the rules and the table is their data, which is exactly what a spec-driven engine reads and what
eleven hard-coded checkers cannot express.

`Cap` and `Create ←` living in the same row is the case that motivated the test (DoD 4). A
classification whose unit was the row would have had to force one mark and been wrong either way.

**The number worth carrying to T4 and to the engine's design: §2 is at best half checkable.**
20 rules — 6 families + 14 standalone — split **8 clean mechanical · 10 clean judgment-only · 2
split**, counted exactly rather than rounded (8+10+2=20; the earlier draft said "8 mechanical and 12
judgment-only", which silently folded the two split cases into judgment and was corrected before the
tick). **§2 is the most mechanical section in the spec**, so this is the optimistic end of the range.
That sits against EPIC-004's framing that "the machinery exists and points inward" — the machinery
does exist, but the fraction of the standard it could ever cover is smaller than that reads, and the
gap is not a tooling gap. It is the standard deliberately caring about things a tool cannot see.

**Cap check on the new artifact, which is why the G2 split mattered:** 123 lines, `PASS cap
docs/research/conformance-inventory-criteria.md (123 <= 130) [§2]` — under the soft cap **and still
matched by the checker**, which the subdirectory variant would not have been. Gate 151/0.
