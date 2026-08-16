---
sprint: 073
slug: spec-as-rule-source
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-073 — Execution Log

> Append-only companion to [`../SPRINT-073-spec-as-rule-source.md`](../SPRINT-073-spec-as-rule-source.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | surprise | G2 found the annotation form has a consumer the Plan never named — T3

**The Plan assumed the annotation form was a presentation choice. It is not.** T3's second DoD
requires every rule dispositioned `build` to **name the finding its check will fire**, and a finding
name has to attach to something stable across spec versions. No rule in `spec/STANDARD.md` currently
carries an identifier of any kind. So T1 either mints rule IDs or T3 has nothing to hang its findings
on — and that dependency was invisible when the Plan was written, because the two tasks were sized
independently.

Recorded rather than absorbed: it does not shift scope (T1's DoD 1 already says "the annotation form
is chosen"), but it removes one option from the field and adds a requirement the form must satisfy.

**Recon that changed the recommendation.** §2's tables are already six columns wide, and T1's own
SPRINT-072 finding says a §2 row is a **parameter set, not a rule** — 37 rows resolve to 6 families.
Any row-level annotation would therefore emit 37 near-duplicate marks for 6 rules, hard-coding
precisely the drift EPIC-004 D1 exists to prevent. That rules out the inline-column form on evidence
rather than on taste.

**Owner ruling (2026-08-16) — per-section `Conformance.` table with rule IDs.** Each § gains a short
table (`Rule | Level | Mark`) keyed by a stable id (`S1.LAW2`, `S13.a`, …). Four reasons, in order of
weight:

1. It is the only form that annotates §2's **6 families** rather than its 37 rows.
2. Prose stays untouched, which is what T1's fourth DoD (still readable as prose) actually protects.
3. It stays in **one file** — no second SSOT for a checker and a human to disagree about (ADR-023;
   L-129 is what a two-artifact contract fails like).
4. The ids it mints are what T3 names findings against, so the cost is a requirement, not overhead.

**The cost, stated up front because T2 inherits it:** ~+130 lines, taking the spec from **624** to
roughly **755**. T2 rules the cap against the grown file, which is the point — but it also means the
sidecar option (which would have left the spec at 624) was the low-growth answer and was rejected on
SSOT grounds, not on size. T2's ruling should say so rather than rediscover it.

### 2026-08-16 | progress | G1+G2 signed @ `80b5eaa` — full checklist, and preflight halted once

**Batch G1 ran the full checklist, not the fast path.** All three tasks carry `origin: close-retro`,
which never passed the intake grill, so there is no prior scope agreement for a fast-path to
re-confirm — the same ruling held at SPRINT-070, 071 and 072. Three tasks, `M · S · M`, no `L`,
nothing to split.

**Assumptions, re-derived at G2:** A1 = **624 lines · 13 sections · spec 0.3.0**, measured directly
and matching TD-058's independent SPRINT-071 growth note · A2 read from the frozen baseline, **not**
re-measured (D4) · A3 governance owner-signed at promote · A4 skills **1.45.0 base-dir vs 1.46.0
repo**, nominally stale and **verified byte-identical on disk** (`diff -rq --strip-trailing-cr` over
the cached `skills/`, empty) rather than inferred from the version numbers · A5 ADR-023.

**Ownership map** (from `Layers:`): `spec/STANDARD.md` → **T1 then T2** · `spec/CHANGELOG.md` → T1 ·
`TECH-DEBT.md` → T2 · `docs/adr/` → **T2 then T3** · `docs/research/conformance-baseline.md` → T3.
The sprint file and this Log are **coordinator-owned** and declared by no task, as always.

**Preflight HALTED on first run — third consecutive sprint it has caught an overlap the Plan's author
did not see.** `FAIL shared-file-unowned: docs/adr/ in T2 and T3 has no Depends-on edge, direct or
transitive`. Both tasks declared the ADR directory conditionally and both sat in wave 1, so both could
have minted an ADR number against the same index.

The two declarations are not equally earned, and that asymmetry framed the fix: **T2 probably does
need an ADR** — capping the standard itself is hard-to-reverse, surprising, and every adopter inherits
the number, which clears §4's three-part bar — while **T3 probably does not**, a disposition list
being a scoping record rather than a decision with a real trade-off.

**Owner ruling: chain T3 after T2** (`Depends-on: T1, T2`). It costs nothing real — all three tasks
are `class: decision` and run inline sequentially regardless, so there is no parallelism to lose — and
it is honest about the ADR-numbering hazard instead of declaring it away. The alternative (narrowing
T3's `Layers:`) would have resolved a gate finding by **removing a declaration**, which is the shape
the "never reshape a task to dodge the gate" red flag exists for, even though the declaration really
was over-broad.

**Not filed as a `scope-change`:** scope is untouched — same three tasks, same acceptance, same files,
same order of work. What changed is a sequencing edge, taken at G2 before any execution rather than
discovered mid-task.

Re-run: `PREFLIGHT: CLEAR` — waves **T1=0 · T2=1 · T3=2**, every overlap owned, base-ref matching live
HEAD.

**Standing constraints carried into execution, restated so they bind at the point of work:** the
baseline is **transcribed, not re-derived** (D4) · the four buckets survive as four, with
`implementation-directed` first-class (D1) · **no percentage, no score, no completion ratio** anywhere
(EPIC-004 D1) · no checker, no fixture, no engine, no execution-architecture change (D2) · the
packaging question stays the engine sprint's (D3) · EPIC-005 out of scope.

**All three inline.** Every task is `class: decision`; a dispatched agent would need the whole
classification and the criteria restated in full to do what the coordinator can do directly, which is
the same reason SPRINT-072 ran inline.
