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

### 2026-08-16 | scope-change | T1 — the frozen baseline does not reconcile with itself; DoD 2's "96" is not re-derivable

**T1's DoD 2 requires the annotated-rule count to be "re-derived against the baseline at execution
rather than copied from this Plan (L-130)". Re-derivation was run first, before a line was written,
and it does not reproduce the baseline's own total.** Three mutually inconsistent figures inside one
frozen artifact:

| source | figure |
|---|---|
| `conformance-baseline.md` § Coverage by section, stated total | **96** |
| the same table's `rules` column, summed | **99** |
| the same table's four bucket columns, summed | **98** |

Two per-section rows are internally inconsistent: **§2** lists 20 rules against 18 bucket cells, and
**§10** lists 11 rules against 12 cells. Computed mechanically, not by eye.

**Tracing to the source inventories does not settle it either — it moves the disagreement.** The four
inventory docs are the baseline's inputs, and their own reconciliations say: §2 **20** ·
structural group **26** · §12 **12** · gated-attested **38** = **96**, which agrees with the stated
total exactly. But two of those inputs disagree with their own tables:

- **`-gated-attested.md`** writes *"Rules identified: 39 — §9 10 · §10 11 · §11 12 · §13 7"*, and that
  list sums to **40**, not 39. Resolvable: its mark table carries 2 `data`/`rationale` entries that are
  not rules (§10's *doc-aging has two sources* and §11's *doc-aging is not bounded by this table*).
  Removing them gives §9 10 · §10 **10** · §11 **11** · §13 7 = **38**, which matches. This one closes.
- **`-structural.md`** writes *"§4 5"* in its reconciliation while its own §4 table carries **6 rows**.
  This one does **not** close, and it is the whole 96-vs-97 question.

**Reading §4 in the spec directly makes it worse, not better.** The section contains at least one
normative rule the inventory's table never lists — *"`DECISIONS.md` is a thin **index** linking
them"* — plus two judgement calls nobody recorded: whether *"WHY only, never HOW"* is a §4 rule or a
§5 restatement (§7 and §8 were ruled projections on exactly this ground), and whether the `/council`
pressure-test line is normative at all. So §4 yields **5, 6 or 7** depending on decisions that were
made once and never written down.

**Why this is a blocker rather than a rounding error.** D4 says T1 **transcribes** and does not
re-derive, precisely so the spec and the baseline cannot fork. But transcription presupposes a source
that reconciles, and this one does not. Every available move breaks something:

- Annotate to hit **96** → bakes a figure into `spec/STANDARD.md` that its own inputs contradict, in
  the one artifact every adopter pins.
- Annotate whatever §4 turns out to be → **re-derives**, which D4 forbids, and forks the spec from the
  baseline the engine is being designed against.
- Tick DoD 2 on a count that "matches if you squint" → the exact L-088 failure the criterion's own
  re-derivation clause exists to prevent, committed by the task holding the pen.

**Not resolved here.** Halting for an owner ruling per the first-blocker rule; the Plan is untouched
and no annotation has been written. The count is genuinely load-bearing: it is EPIC-004 § Closed-when
2's completeness test, T3's disposition denominator, and the number the engine's coverage report will
quote.

### 2026-08-16 | scope-change | Owner ruling on the count — re-derive from the spec, D4 relaxed at the margin

**Ruling (2026-08-16).** T1 counts each section **from `spec/STANDARD.md` itself** as it annotates,
and records the number it actually finds. **D4 is relaxed on one axis and holds on the other:**
transcribe the **marks** from the baseline — no rule gets reclassified from `mechanical` to
`judgment-only` or vice versa on T1's say-so — but **re-derive the count**. Every divergence from the
baseline is logged here and routed to **T3**, which owns `docs/research/conformance-baseline.md` and
corrects its table.

**Why this over transcribing 96.** The entire premise of EPIC-004 D1 is that the spec, not a derived
artifact, is the rule source. Discovering that the derived inventory cannot reproduce its own total
*is* the evidence that the indirection was the defect — the answer is to make the spec authoritative,
not to copy a contradicted figure into the one artifact every adopter pins.

**Why the marks stay frozen.** Re-classifying and re-counting at once would fork the spec from the
baseline in two dimensions and leave nothing to reconcile against. The count is arithmetic and can be
checked; a mark is a judgement and cannot. So the judgement stays where SPRINT-072 made it.

**Consequent Plan amendments** (made after this entry, per the frozen-Plan rule):
- **DoD 2** — "equals **96**" → equals the count T1 derives, **reconciled against the baseline with
  every divergence named**. The criterion keeps its force: an unannotated rule is still a FAIL, and a
  divergence passed over in silence is still a FAIL. What it stops asserting is a figure that its own
  source contradicts.
- **D4** — gains the transcribe-marks / re-derive-count split above.

**The three §4 ambiguities are ruled as they are reached, in this Log, each with its reason** — they
are classification decisions that were made once and never written down, and writing them down is
within T1's remit now that the count is its own.

### 2026-08-16 | progress | T1 — the spec is the rule source; and the count is 98, not 96

**Done.** All 13 sections carry a `**Conformance.**` table; a new **§14** defines the model. Spec
**0.3.0 → 0.4.0**. `+300 / −1` on `spec/STANDARD.md`, and **the single deletion is the version line** —
not one word of existing prose was edited, which proves DoD 4's readability constraint mechanically
rather than by the judgment tick it asked for.

**The count, re-derived from the spec per the owner ruling: 98 classified rules + 2 unclassified = 100
candidates.** Extracted by id, not by eye — `100 rule rows, 100 unique ids`.

| § | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| classified | 4 | **21** | 3 | 6 | 1 | 4 | 9 | 0 | 10 | **10** | **11** | 12 | 7 |
| unclassified | | | | 1 | 1 | | | | | | | | |

**Five divergences from the frozen baseline, each routed to T3** (which owns
`docs/research/conformance-baseline.md`; T1 may not edit it):

1. **§2 is 21, not 20.** `S2.R-PLACEMENT` carries the **legacy-path second-match** rule, which
   `S2.F-FILE` does not — a repo on a legacy layout satisfies one and not the other, so they are
   separable rather than one rule stated twice.
2. **§10 is 10, not 11.** *"Doc-aging has two sources"* is **data** about where the doc-aging line
   reads from; no repository can violate it.
3. **§11 is 11, not 12.** *"Doc-aging is not bounded by this table"* and *"git is the full audit
   trail"* are **rationale**; against that, `S11.WHENITRUNS` (close-time vs promote-time triggers) is a
   real rule the inventory folded away, so the section lost two and gained one.
4. **`S4.INDEX` is a rule the inventory never saw** — *"`DECISIONS.md` is a thin index linking them"*,
   stated plainly in §4 and absent from the SPRINT-072 table. Annotated `?` rather than given a mark:
   D4's surviving half says marks are **transcribed, never invented**.
5. **`S5.DISCARDLOG` likewise** — the discard-log line binds a *generator's* output, not a repository.
   A strong `implementation-directed` candidate and unruled, so `?`.

**The `implementation-directed` count does not hold either, and this one matters most.** The Plan's DoD
3 says *"all **6** rules that carry it, **three** of them in §13"*. Re-derived: **five** carry it —
`S9.GATESMALFORMED` · `S10.MATCHER` · `S12.WIRING` · `S13.NOINFER` · `S13.NOTAUTHOR` — with
`S5.DISCARDLOG` pending as a sixth, and **two** in §13, not three. Tracing it back,
`-gated-attested.md` states "six" in its prose and its own table shows four for that group; the "three
in §13" has two rows behind it. **The bucket itself survives as its own first-class mark, which is what
DoD 3 exists to protect** — what fails is the arithmetic it inherited from the same unreconciled source
the owner ruling already addressed. Ticked with the divergence named, per that ruling.

**Two §4 statements ruled non-normative, with reasons, because nobody had written them down:**
*"WHY only, never HOW"* restates `S5.FILTER` — the same ground on which §7 and §8 are ruled projections
— and the `/council` pressure-test line is advice for a high-stakes call, not an obligation. Recorded
in §4 itself so the next reader does not re-litigate them.

**Growth is far larger than G2 estimated, and T2 inherits the real number: 624 → 923 lines, +299, not
the ~130 projected.** The projection assumed a mark per rule; what the form actually costs is a table
*plus* a per-section reconciliation note *plus* §14's model. **T2's cap ruling must use 923.** Stated
here rather than left for T2 to rediscover, and stated as a correction to my own G2 estimate — which
was a figure written into a decision without a second derivation, the exact L-130 shape.

**What the annotation makes true that was not true before:** a reader holding only `spec/STANDARD.md`
can now name any rule, its level, whether it is checkable, and whether it applies to their repo at all.
`S8` reports **0 rules** in the document itself, so an engine cannot double-count it. And §14 states
the no-percentage ruling **normatively**, so it binds adopters' tools rather than living in this
repository's epic notes.

### 2026-08-16 | progress | T2 — the spec is ruled uncapped, and the cap cell nearly capped it at 26

**The measurement TD-058 said was undiscoverable, re-derived from git rather than remembered:**
497 (extraction) → 587 (+90, §13) → 595 (+8) → 624 (+29, §9) → **923** (+299, T1). Rule additions cost
**30–90 lines**; T1's +299 is a one-time structural layer, not the trend. The promote figure of 624 was
correct and is now superseded by 923.

**Owner ruling → ADR-026: `spec/STANDARD.md` gets a §2 row whose `Cap` is `no numeric cap`.** The
reasoning sits inline in §2, which is what TD-058 actually asked for — the absence now reads as a
decision. `spec/CHANGELOG.md` joins as `append-only`.

**The deciding argument is that §2's own escape hatch does not work on this file** (DoD 4, priced rather
than assumed away). Every other capped row answers a cap-hit by splitting into a tree. Here that fails
three ways: adopters **pin the file by path** (ADR-023), so splitting is a breaking change no other row
carries · the split target is a subdirectory, and a cap check deriving its file set from §2 expands a
path into a **non-recursive** glob (**TD-061**), so splitting would move the spec *out of the checker's
reach* — the remedy un-governing the file the cap was added to govern, which is L-132's shape one sprint
after filing it · §14's rule ids are **cross-section**, so a split fragments the rule source a tool must
read as one document. A cap whose only escape is unusable can be met only by **squeezing** — forbidden
by §2's Growth rule, named as an anti-pattern by §7, and recorded as L-131 last sprint.

This is the *"cap was never reachable"* case §2 already names: the standard mandates content the number
never budgeted for. §2's prescribed response is to fix the number, and fixing it honestly means ruling a
line count the wrong instrument here.

**The trap, and it was live.** The first attempt wrote the cell as `no numeric cap (ADR-026)`. The
checker scraped the digits out of the citation: `FAIL cap spec/STANDARD.md (943 > 026)` — it takes the
**first digit run in the cell** as the cap, so the spec was momentarily capped at **26** lines against
943. Caught only because DoD 3 requires *running* the checker rather than asserting the row works
(L-057: "added a row" and "the checker sees it" are two claims). Cell now holds **no digits at all**;
the ADR is cited in the prose beneath. Recorded in §2 itself so the next person adding a non-numeric cap
does not rediscover it.

**DoD 3 answered honestly: the checker emits nothing for either new row, and that is the intended
outcome, not a success.** Verified by diffing `check-doc-caps.sh`'s full output before and after the §2
change — **byte-identical**. So "the spec is in §2" is true and "the cap checker sees it" is false, and
ADR-026 records that as a stated **negative** consequence alongside the loss of any automated growth
signal on this file. Two rejected alternatives are recorded with their numbers: soft caps at 1000 and
1200, rejected for firing within a sprint and for being chosen for comfort rather than read off the
curve (ADR-015's gesture test).

**TD-058 → `resolved → SPRINT-073 T2 (ADR-026)`**, four sprints and five re-reviews after filing. It
closed the moment the evidence it named arrived — which is the case for ordering T2 after T1 rather than
by priority.
