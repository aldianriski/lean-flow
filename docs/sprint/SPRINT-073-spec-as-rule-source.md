---
sprint: 073
slug: spec-as-rule-source
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-16
gates_signed: G1,G2 @ 80b5eaa
plan_commit: b0fb721
close_commit: [sha — set at close]
status: active
update_trigger: sprint execute/close events
---

# SPRINT-073 — The Spec as Rule Source

> **Theme:** EPIC-004 D1 says the engine's rules come from the spec rather than from code. SPRINT-072
> measured that the spec cannot currently serve that role — it carries no conformance level, no
> mechanical/judgment mark and no finding name on any of its 96 normative rules, while the
> classification that supplies all three sits in a research doc no tool reads. This sprint moves the
> classification **into the spec**, then rules the cap question that the move finally makes decidable.
> Build the engine first and you hard-code the classification a second time, which is precisely the
> wrapper-over-eleven-checkers outcome D3 rules out.

## Scope

**In:** every normative rule in `spec/STANDARD.md` annotated in-place with its conformance level and
its `mechanical | judgment-only | implementation-directed` mark, in a form readable **without the
plugin installed** (T1) · a ruling on whether the spec gets a §2 cap row and what number, taken with
T1's growth measurement in hand (T2) · an explicit per-rule disposition for the 39 rules the baseline
marks mechanical-but-unchecked — build, or scoped out with its reason (T3).

**Out (deferred):** the conformance engine itself — this sprint produces its input, and building both
here would design it against a rule source written the same afternoon · the §13 attestation checker
(**TASK-228**, next member) · the ship-inside-the-plugin vs standalone packaging question, still the
**engine sprint's** G2 per EPIC-004 D2 — T1 produces evidence for it, and deliberately does not rule
it · ADR-008's scope amendment (EPIC-004 § Closed-when 5, engine sprint) · **any change to checker
architecture or the eleven checkers, their findings and their fixtures** · `/orchestrator` and the
single-repo execution loop, frozen absent measured evidence of a defect · EPIC-005 Fleet.

## Plan

### T1 — Annotate every normative rule in the spec with its level and mark `[size: M · risk: med · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md`
Depends-on: none
Cites: EPIC-004 § Closed-when 2 · EPIC-004 D1 (rules come from the spec) · SPRINT-072 D3 (a wrapper
       does not satisfy spec-driven) · `docs/research/conformance-baseline.md` · ADR-024 (the levels) ·
       ADR-025 (§13's claim-vs-proof boundary) · L-015 (the consumer reads this file) · **T3** (divergences
       are *routed to* it, not depended on — T3 owns the baseline file this task may not edit)
The classification exists and is frozen; what does not exist is any way for a tool — or an adopter — to
read it from the artifact they pin. **The annotation form is the real decision here**, not the
transcription: the spec is prose a human reads *and* the rule source a checker parses, and those two
readers want different things. Transcribe, do not re-derive — the baseline is the source of truth for
every mark.

**Acceptance:** someone holding only `spec/STANDARD.md` — no plugin, no `docs/`, no research tree — can
say of any normative rule what level it belongs to, whether it is mechanically checkable, and whether
it applies to their repo at all.

**DoD:**
- [x] The annotation form is chosen and its alternatives recorded — *Verify: at least inline markers ·
      a per-section table · a machine-readable sidecar are each priced, with the reason the loser lost;
      a form chosen without a rejected alternative has not been decided*
- [x] Every normative rule carries level + mark **in the spec** — *Verify: the count of annotated rules
      equals the count T1 derives **from the spec**, reconciled against the baseline with **every
      divergence named** and routed to T3. A rule left unannotated is a FAIL, and a divergence passed
      over in silence is a FAIL. **Amended 2026-08-16 by owner ruling** — this criterion read "equals
      **96**" at promote, and re-derivation found the baseline's own table stating 96 while its rules
      column sums to 99 and its bucket columns to 98 (Execution Log, two `scope-change` entries). The
      criterion keeps its force; it stops asserting a figure its own source contradicts (L-088)*
- [x] The **four** buckets survive as four — *Verify: `implementation-directed` appears as its own mark
      on all **6** rules that carry it, three of them in §13. Collapsing it into judgment-only loses the
      claim-vs-proof boundary ADR-025 exists to state, and collapsing it into a repo rule emits findings
      no adopter can ever clear*
- [x] The annotated spec is still **readable as prose** — *Verify: judgment tick. Read §1 and §13 end to
      end as an adopter with no lean-flow context; if the annotation now dominates the rule it annotates,
      the form is wrong regardless of how well it parses*
- [x] `spec/CHANGELOG.md` records the version bump and what an adopter pinning the old version does not
      get — *Verify: the file; the spec versions independently of the plugin (ADR-023) and this is a
      MINOR, additive change*

### T2 — Rule whether `spec/STANDARD.md` gets a §2 cap row, and which `[size: S · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` (§2 table) · `TECH-DEBT.md` (TD-058's row) · `docs/adr/` (only if the
        ruling qualifies)
Depends-on: T1
Cites: TD-058 · TASK-219 · ADR-015 (a stated cap is a real number, and a soft cap cannot be
       grandfathered) · §6 (cap-hit → split into a tree) · §2's growth rule (split, never squeeze) ·
       L-131 (what squeezing looks like from inside) · `check-doc-caps.sh` (**run, not edited** — the
       third DoD asserts against its output; changing it is D2-excluded) · TD-061 (the subdirectory
       hole a §6 split would fall into)
TASK-219 has been unactionable since SPRINT-070 for one stated reason: *the number is not derivable
from this repo's history, because the file has never been capped and there is no growth curve under a
ceiling to reason from.* T1 is the largest single edit this file will ever have taken, so the missing
data point arrives immediately before this task. Ordered second for exactly that reason, not by
priority.

**Acceptance:** the spec either carries a §2 row whose cap `check-doc-caps.sh` derives and enforces, or
a recorded ruling that it is deliberately uncapped — and either way the absence stops reading as an
oversight to the next person who greps §2.

**DoD:**
- [x] The post-T1 line count is measured and stated — *Verify: `wc -l spec/STANDARD.md` at execution
      against the **624** recorded at this promote; the delta T1 produced is the evidence this ruling
      turns on and is stated as a number, not as "grew substantially"*
- [x] The ruling is made and recorded where the next reader of §2 finds it — *Verify: §2 itself, not a
      research doc; a ruling that lives outside the table it concerns will not be read by anyone
      checking the table*
- [x] If a cap is chosen, `check-doc-caps.sh` actually reports on the spec — *Verify: run it; a row
      appears for `spec/STANDARD.md`. Today it reports **zero** rows for `spec/` because it derives
      coverage from §2 rather than hand-listing, so "added a row" and "the checker sees it" are two
      claims and only the second one matters (L-057)*
- [x] The §6 tier-split escape is priced explicitly, not assumed away — *Verify: the ruling states what
      a cap-hit would mean for a spec — numbered section files — and whether that is acceptable for an
      artifact adopters pin by path. **TD-061 binds here**: a split into a subdirectory is exactly the
      remedy that escapes the checker*
- [x] TD-058 is closed or its status updated to match the ruling — *Verify: the row*

### T3 — Give each of the 39 uncovered-mechanical rules an explicit disposition `[size: M · risk: low · class: decision · HITL]`
Layers: `docs/research/conformance-baseline.md` · `docs/adr/` (only if the scoping qualifies)
Depends-on: T1, T2
Cites: EPIC-004 § Closed-when 2 (second unmet half) · EPIC-004 D1 (no percentage, no score) ·
       ADR-024 · L-058 · TD-012 (a check ships with a retained must-FAIL fixture, and the fixture is
       kept) — *the baseline is on `Layers:` because this task **writes** its disposition column; it is
       deliberately not also cited here*
39 is a backlog, not a verdict, and some of it should never be built: the baseline already found that
seven of the eleven existing checkers guard lean-flow's own conventions rather than the standard, and
folding that instinct into the engine emits findings an adopter cannot act on. The ruling is per rule.

**Acceptance:** a reader can point at any of the 39 and say either *"a check is planned, and here is
the finding it will name"* or *"deliberately out of scope, because —"*, with no rule left in the
undifferentiated middle.

**DoD:**
- [ ] All **39** carry a disposition — *Verify: count the dispositions against the 39 re-derived from
      the baseline at execution; "none yet" is not a disposition and an empty cell is a FAIL*
- [ ] Every rule dispositioned **build** names the finding its check will fire — *Verify: a named
      finding string per rule. A check specified without its finding name is the half-shipped gate L-058
      describes, decided one sprint before anyone writes it*
- [ ] Every rule dispositioned **out of scope** carries its reason — *Verify: the reason distinguishes
      "checks a lean-flow convention, not the standard" from "too expensive" from "subsumed by another
      rule"; a bare "out of scope" is a deferral wearing a decision's clothes*
- [ ] **No percentage, no score, no completion ratio appears in the output** — *Verify: grep the changed
      files for `%` used as a conformance figure. EPIC-004 D1; a ratio that improves when the standard
      declines to automate something is backwards*
- [ ] The 8 covered and 45 judgment-only rules are **not** re-litigated — *Verify: `git diff` shows no
      change to their marks. This task owns the middle column only; re-opening the classification would
      un-freeze the baseline the engine is being designed against*

## Decisions (pre-locked)

- **D1 — The four coverage buckets are load-bearing and survive into the spec as four.** Not three,
  not a single "not covered" count. `implementation-directed` in particular is a mark about **what a
  tool may infer**, and SPRINT-072 found six of them clustered where an engine leans hardest. **→ no
  ADR here**; the engine's ADR inherits it.
- **D2 — This sprint changes `spec/STANDARD.md` and the baseline's disposition column, and nothing
  else.** No checker, no fixture, no engine, no execution architecture — SPRINT-072's D4 carried
  forward, and the single-repo loop stays frozen absent measured evidence of a defect. **→ no ADR.**
- **D3 — The packaging question stays deferred to the engine sprint's G2.** T1's fourth DoD produces
  direct evidence for it (can a rule be read without the plugin present?) and deliberately stops short
  of ruling. Producing the evidence for a deferred decision is not the same as taking it. **→ no ADR.**
- **D4 — T1 transcribes the *marks*; it re-derives the *count*.** The baseline stays the source of
  truth for every `mechanical | judgment-only | implementation-directed` mark — no rule is
  reclassified on T1's say-so, because a mark is a judgement that cannot be re-checked, and
  re-classifying mid-transcription would fork the inventory from the artifact the engine is designed
  against. The **count** is different: it is arithmetic, and **amended 2026-08-16 by owner ruling**
  after re-derivation found the frozen baseline stating 96 against its own columns summing to 99 and
  98. T1 counts from `spec/STANDARD.md` and routes every divergence to T3, which owns the baseline
  file. Discovering that a derived inventory cannot reproduce its own total *is* the evidence EPIC-004
  D1's spec-as-rule-source premise was right. **→ no ADR.**

## Assumptions

- **A1** — `spec/STANDARD.md` is **624 lines · 13 sections · version 0.3.0**. *Confirm: measured
  2026-08-16 at this promote; matches TD-058's SPRINT-071 growth update independently. Re-derive at
  execution — this figure is the input to T2's ruling, and a figure entering a frozen artifact is a
  query result (L-130).*
- **A2** — The classification is **96 rules — 8 covered · 39 uncovered-mechanical · 45 judgment-only ·
  6 implementation-directed**. *Confirm: `docs/research/conformance-baseline.md`, frozen at SPRINT-072
  and **read, not re-measured** (D4). Its own § Reconciliation already corrects one off-by-one; the
  corrected figures are the ones above.*
- **A3** — Governance at this promote, owner-signed 2026-08-16: L-promotion **none** (112 entries, of
  which 79 active-with-count and 33 promoted-and-collapsed — the first query reached only the 79 and
  was corrected before use) · TD aging **seven rows** re-reviewed with ledger searches recorded, one
  **vehicled** (TD-058 → TASK-219, this sprint's T2) and six held · §11 retention **applied on owner
  approval**: TD-054 and TD-056 deleted outright · **zero §2 cap breaches** (62 PASS · 1 FROZEN by
  ADR-020). *Confirm: the checklist, and `TECH-DEBT.md`'s seven `SPRINT-073 promote` re-review rows.*
- **A4** — Skills are **1.45.0 base-dir vs 1.46.0 repo** — nominally one version stale, **verified
  byte-identical** modulo line endings. *Confirm: `diff -rq --strip-trailing-cr` over the cached
  1.45.0 `skills/` against the repo's, empty. v1.46.0 changed docs and manifests only. Checked on disk
  rather than inferred from the version numbers (L-021 · L-057).*
- **A5** — The spec is **the artifact an adopter pins**, so every annotation ships to every consumer.
  *Confirm: ADR-023. This is the L-015 surface for this sprint and T1's fourth DoD is where it is
  checked — a form that parses beautifully and buries the rule is a consumer regression.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-073-spec-as-rule-source.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
