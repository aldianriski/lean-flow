---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: A structural-evidence section of spec/STANDARD.md changes
status: current
id: conformance-inventory-structural
tags: [process, docs]
domain: governance
related: [conformance-inventory-criteria]
---

# Conformance inventory — structural-evidence sections

SPRINT-072 T2. §1 · §3 · §4 · §5 · §6 · §7 · §8 — the sections whose evidence is the file tree,
classified under the test fixed in `conformance-inventory-criteria.md` (applied here, not re-derived).
**§12 is a sibling file**, `conformance-inventory-git-boundary.md`, split under §2's growth rule when
this one hit its cap — split, not squeezed. **Two gaps in the test were found and are routed back
rather than patched locally.**

## Criteria gaps found (T2 DoD 3 — routed back, not resolved ad hoc)

**Gap A — the census patterns cannot see three line shapes.** The promote census counted table rows +
bold statements + bold bullets. It misses **`- [ ]` checklist items** (8: §8 ×7, §9 ×1), **numbered
items** (6), and — sharpest — **fenced schema blocks**: §3's entire normative content is a ```yaml
block defining the ownership header, counted by *nothing*, so §3 registered as "2 candidates" when
both are mere *exceptions* to the rule the census never saw. Corrected gross census: **170, not 156**.
A1 called 156 an upper bound; it was both too high (rows are parameter sets, not rules — T1) and too
low (three invisible shapes).

**Gap B — some statements constrain the *implementation*, not the repo.** §12's `**Wiring.**` binds
`init` and `migrate`. *"This repo violates it"* is not decidable — only a lean-flow implementation can
violate it. T1's test has no bucket, and forcing one would either invent a repo obligation or discard
a real constraint. **Proposed fourth non-repo bucket: `implementation-directed`.** It matters here
specifically: an engine must *not* evaluate these against an adopter's repo, and mistaking one for a
repo rule emits a finding no adopter can ever clear.

## Classification

### §1 — The 4 Laws (4 rules + 1 header)

| Rule | Level | Mark | Note |
|---|---|---|---|
| LAW 1 — no doc unless its absence causes repeated interruptions | Structural | judgment-only | counterfactual; nothing observable distinguishes a needed doc from an unneeded one |
| LAW 2 — exactly one owner *role* per doc | Structural | mechanical | one `owner:` field, value in a role vocabulary |
| LAW 3 — defined create / update / archive triggers | Structural | **split** | `update_trigger:` *present* is mechanical; whether the trigger is the *right* one is not |
| LAW 4 — every line carries info not already in code | Structural | judgment-only | the §5 filter in law form |

`| Law | Name | Rule |` → structure.

### §3 — Ownership header (1 uncounted rule + 2 exceptions)

| Rule | Level | Mark |
|---|---|---|
| **the header schema itself** — `owner` · `last_updated` · `update_trigger` · `status`, mandatory on every doc | Structural | mechanical |
| README exception — front-door uses a footer line, not a YAML block | Structural | mechanical |
| AGENTS.md exception — thin pointer file, same treatment | Structural | mechanical |

### §4 — ADR format (6 rules)

| Rule | Level | Mark |
|---|---|---|
| offer an ADR only when hard-to-reverse **and** surprising **and** a real trade-off | Gated | judgment-only |
| one file per ADR at `docs/adr/ADR-NNN-<slug>.md` | Structural | mechanical |
| a decided ADR is append-only (mark deprecated/superseded, never edit) | Gated | mechanical *via git history* |
| required sections present (Status · Deciders · Context · Decision · Consequences · Alternatives) | Structural | mechanical |
| Consequences carries **at least one Negative** | Structural | mechanical |
| never invent a decision — record only what was confirmed | Gated | judgment-only |

`**Qualifies**` / `**Does not**` → data (they inform the judgement, they are not it).

### §5 — HOW filter (1 rule + 4 data rows)

One rule — **no HOW content; every line passes the KEEP/DISCARD filter** — Structural,
**judgment-only**. The four KEEP/DISCARD rows are **data** calibrating that judgement; the header is structure.

### §6 — Tiered scale model (4 rules, all split)

Each tier row is one rule with two halves, the shape of §2's `Tier` cell (T1's R6): **tier detection**
("multi-dev, sustained, or architecturally forked") is **judgment-only**; **tier satisfaction** (given
the tier, is its doc set present?) is **mechanical** and reduces to R1. Four tiers, four splits.

### §7 — Anti-patterns (8 rules + 1 embedded)

| Anti-pattern | Level | Mark |
|---|---|---|
| HOW documentation | Structural | judgment-only (= §5) |
| Orphan doc (no header) | Structural | mechanical (= §3) |
| Person ownership ("Alice") | Structural | **split** — mechanical against a role vocabulary, judgment without one |
| Mega doc over its line limit | Structural | mechanical (= §2 R2) |
| Sprint file > 400 lines | Structural | mechanical (hard cap) |
| Stale doc used as source | Gated | judgment-only |
| File outside the core set | Structural | mechanical (set membership vs §2) |
| Ledger past a §11 retention trigger | Structural | mechanical |
| *embedded:* a cap moves only by ADR, and only after a diet | Gated | judgment-only |

**§7 introduces almost no new rules** — seven of nine restate §2/§3/§5/§11 as prohibitions. It is a
*view*, not a rule source.

### §8 — Pre-delivery checklist (7 items, 0 new rules)

Every item restates a rule stated elsewhere: template-load (§2) · header (§3) · HOW (§5) · line limit
(§2) · person owners (§7) · `status` (§3) · referenced files exist (§2). **§8 is a projection, not a
rule source** — an engine ingesting it as rules double-counts seven constraints under two names.

## Reconciliation

**Candidates and rules are different units, and a table mixing them cannot sum.** A *candidate* is a
counted line; a *rule* may span several (§4's three-test), collapse many (§6's tiers), or have **no
candidate at all** (§5's HOW rule and §12a are prose; §3's schema is a fenced block). Reconciled
separately rather than forced into one table.

**Candidate census, T2's group (both files):** promote pattern gave **52**; corrected for Gap A it is
**63** (+7 §8 checkboxes, +3 §4 numbered, +1 §3 fenced schema). Every one is bucketed.

**Rules identified: 38** — here §1 4 · §3 3 · §4 5 · §5 1 · §6 4 · §7 9 · §8 **0 new** = **26**;
in the §12 sibling **12**.

| Mark | T2 | with §2 | running total |
|---|---|---|---|
| mechanical | 17 | 8 | **25** |
| judgment-only | 15 | 10 | **25** |
| split | 6 | 2 | **8** |

An even divide. And §8 shows part of any coverage figure is the same rule counted twice under a
second name — which is why a percentage would have been actively misleading (D1).
