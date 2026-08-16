---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: The checker corpus changes, or the inventory is re-classified
status: current
id: conformance-baseline
tags: [process, tooling]
domain: governance
related: [conformance-inventory-criteria, conformance-inventory-structural, conformance-inventory-gated-attested]
---

# Conformance baseline — the inventory reconciled against the checker corpus

SPRINT-072 T4. The frozen baseline EPIC-004's engine is designed **against**. Records findings; changes
nothing. Inventory: `conformance-inventory-criteria.md` (§2) · `-structural.md` (§1 §3–§8) ·
`-git-boundary.md` (§12) · `-gated-attested.md` (§9 §10 §11 §13).

## The corpus, re-derived (T4 DoD 2)

EPIC-004 states *"~82 named findings across 16 retained fixture harnesses"*. Measured 2026-08-16:

| | epic's text | measured |
|---|---|---|
| checkers (`scripts/lib/check-*.sh`) | 11 | **11** |
| harnesses on disk | 16 | **22** (17 assert cases) |
| fixture cases | — | **98** |
| distinct named finding strings | ~82 | **46** |

The epic's figure is stale in both directions — more harnesses, fewer distinct findings than claimed
(82 conflated cases with findings). Corrected in the epic by this task.

## The headline finding: the checkers do not check the standard

EPIC-004's *Why this, why now* says *"Eleven checkers … already encode most of the rules"*. **They do
not.** They encode most of **lean-flow's own project conventions**. Established two ways:

**By reference.** Only **3 of the standard's 13 sections** are named anywhere in `scripts/lib/`:
**§2** (30 refs) · **§11** (16) · **§7** (1). Ten sections — §1 §3 §4 §5 §6 §8 §9 §10 §12 §13 — have
**zero**.

**By checker.** Five of eleven cite no section at all and check project artifacts the standard never
mentions: `count-claims` · `manifest-lockstep` · `night-run-rollup` · `task-origin` · `gates-signed`.

`gates-signed` is the instructive one: it checks a real §9 rule, but §9 only *acquired* that rule at
SPRINT-071 (spec 0.3.0), **after** the checker was written. The checker predates its own
specification, and nothing connects the two. That is the shape of the whole corpus — checkers grown
from felt pain, not derived from the spec, which is exactly EPIC-004 D1's diagnosis and is now
measured rather than asserted.

## Coverage status — four values, never three (T4 DoD 3)

| Status | Meaning | Is it work? |
|---|---|---|
| `covered` | a checker asserts it, with a named finding and a retained must-FAIL fixture | no |
| `uncovered` | **mechanical**, but nothing checks it | **yes — this is the gap** |
| `judgment-only` | not checkable in principle; the standard chooses a human | **no — not debt** |
| `implementation-directed` | constrains a lean-flow implementation, not a repo | **no — must never be evaluated against an adopter** |

Collapsing the middle two into one "not covered" number is the error D1 rejected the percentage for:
it reports the standard's deliberate boundaries as debt.

## Coverage by section

| § | rules | covered | by which checker | uncovered (mech) | judgment | impl |
|---|---|---|---|---|---|---|
| §1 | 4 | 0 | — | 2 | 2 | 0 |
| §2 | 20 | **3** | `doc-caps` (R2 caps) · `ephemeral-intake` (temp-dir) | 5 | 10 | 0 |
| §3 | 3 | 0 | — | 3 | 0 | 0 |
| §4 | 6 | 0 | — | 4 | 2 | 0 |
| §5 | 1 | 0 | — | 0 | 1 | 0 |
| §6 | 4 | 0 | — | 0 | 4 | 0 |
| §7 | 9 | **2** | `doc-caps` (mega-doc · sprint > 400) | 4 | 3 | 0 |
| §8 | 0 | — | *(projection of §2/§3/§5/§7 — no rules of its own)* | — | — | — |
| §9 | 10 | **1** | `gates-signed` | 4 | 4 | 1 |
| §10 | 11 | 0 | — | 3 | 8 | 1 |
| §11 | 12 | **2** | `epic-archive` · `research-archive` | 6 | 4 | 0 |
| §12 | 12 | 0 | — | 4 | 7 | 1 |
| §13 | 7 | **0** | — | 4 | 0 | 3 |
| **total** | **96** | **8** | 4 of 11 checkers | **39** | **45** | **6** |

**§13 is entirely unchecked** — no attestation checker exists, which is EPIC-004 § Closed-when 4 in
one cell. And **four checkers do all the standard-facing work**; the other seven guard project
conventions that no adopter shares.

## What the engine inherits (recorded, not acted on — D4)

1. **The contract to preserve: 46 distinct named findings across 98 retained fixture cases.** Any
   engine must keep every finding *name* and every must-FAIL behaviour (L-058 · TD-012). This is the
   ceiling on consolidation, not a suggestion.
2. **Seven checkers are out of scope for a conformance engine.** They check lean-flow's conventions.
   Folding them in would emit findings an adopter cannot act on — the `implementation-directed`
   failure at corpus scale.
3. **A spec-driven engine reads rule *families*, not rules.** §2 is 6 families over 37 rows (T1); a
   per-rule engine would hard-code 37 near-duplicates and drift on the 38th.
4. **Four buckets, not a score.** Consumer output is level + named findings blocking the next level +
   judgment-required items (D1). §8 shows why: it restates seven rules the engine would otherwise
   double-count, inflating any denominator.
5. **`implementation-directed` rules must be excluded from evaluation, not skipped silently.** Six
   exist, three of them §13's inference constraints. Dropping them loses the claim-vs-proof boundary;
   evaluating them emits findings no adopter can clear.
6. **Gated is the hard level, not Attested.** §13 is 5-of-7 mechanical; §10 is 4-of-11. Anyone sizing
   the engine off "Attested sounds hard" mis-plans it.

## Findings recorded for later sprints (not fixed here)

- **`docs/research/` has a coverage hole.** `check-doc-caps.sh` expands §2's `research/<slug>.md` into
  a **non-recursive** glob, so any file in a subdirectory there is uncapped and unreported. Probed
  live at this sprint's G2. Nothing depends on it today because no such subdirectory exists.
- **The spec's normative surface cannot be counted by line shape.** Three shapes are invisible to the
  obvious pattern — `- [ ]` items, numbered items, and fenced schema blocks (§3's entire rule is one).
  Corrected gross census **170**, not the 156 assumed at promote.
- **§7 and §8 are views, not rule sources** — 16 restatements between them.

## Reconciliation

**96 rules** — §2 20 · structural 38 · gated/attested 38. *(T3's file states 39; recount at
reconciliation gives 38, since its mark table listed 2 data entries among the rules. The mark totals
were right; the rule count was one high.)*

**43 mechanical · 45 judgment-only · 13 split · 6 implementation-directed** — split counted under
judgment above where its judged half dominates. **Of the 43 mechanical, 8 are covered and 35 are
uncovered**; adding the 13 split's mechanical halves gives the 39 uncovered-mechanical in the table.

**The number that matters for EPIC-004:** not a ratio, but a fact — **8 covered, 39 uncovered
mechanical, 45 judgment-only.** Roughly half this standard is not automatable at all, and of the half
that is, most is unbuilt. Both halves were invisible before this baseline.
