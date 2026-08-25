---
id: ADR-034
tags: [process, tooling]
domain: doc-standard
status: accepted
related: [ADR-028, ADR-036, ADR-024, ADR-027, ADR-023, ADR-015, ADR-021]
---

# ADR-034 — What the reference-engine migration must preserve, and what it must not

- **Status:** accepted (2026-08-24)
- **Deciders:** Maintainer
- **Context driver:** a migration with no frozen comparand is not a migration — it is a rewrite that
  discovers its own contract afterwards and calls the result parity.

## Context

EPIC-014 moves conformance and QA semantics from a 12,718-line Shell implementation to a TypeScript/Bun
reference engine, family by family, under a strangler (EPIC-014 D2). Each family is proven by
differential parity against the Shell comparand before authority moves. That proof is only meaningful
if *what must match* was written down **before** the new engine existed; decided afterwards, "parity"
collapses into whatever the new implementation happens to do.

The freeze must also be narrow. Freezing too much locks whitespace and turns every cosmetic improvement
into a compatibility break; freezing too little lets semantics drift silently under a green suite.

## Decision

**Frozen — the semantic surface.** These may not change without an explicit, recorded behaviour-change
ruling:

| Element | Why it is frozen |
|---|---|
| **Rule ID** | An adopter pins it; a report names it; `.conformance-exempt` and `.conformance-tier` reference it |
| **Finding ID** | The compatibility contract for a violation — a report consumer matches on it |
| **Severity** | `note` · `warn` · `hold` · `fail`, and which one a given violation carries |
| **Rule inclusion / exclusion** | Whether a rule is evaluated against a tree at all |
| **Hold semantics** | What prevents a close when proof or authority is incomplete |
| **Conformance level for a FULL run** | `Structural` · `Gated` · `Attested`, and the arithmetic reaching them |
| **Exit meaning** | What an exit code asserts about the tree |

**Not frozen — deliberately.** Whitespace · word wrapping · line order where not semantic ·
byte-identical stdout. **A parity test that compares bytes is out of contract**: it would fail on an
improvement and pass on a semantic regression that happened to preserve layout.

### The rule-ID denominator is 100, derived rather than inherited

Three numbers were in circulation and at most one could be the contract's. All three are now accounted
for, which is the point — an unexplained remainder is where the wrong denominator hides:

| Count | What it actually is | Reconciliation |
|---|---|---|
| **100** | the full classified rule set — **the contract's denominator** | `51 + 49 = 100` |
| **51** | *checkable* — rules mapping to a check | `mechanical 40 + split 11`; independently EPIC-004's `45 in-engine + 6 standalone` (ADR-028) |
| **49** | explicitly marked non-evaluated | `judgment-only 32 + restated 7 + implementation-directed 6 + standard-directed 4` |
| **79** | **not a denominator — a broken query** | the `S[0-9]+\.[A-Z][A-Z0-9]+` shape stops at a hyphen, missing exactly the 21 hyphenated §2 ids (`S2.F-ARCHIVE` · `S2.R-CAPEXACT` …); `79 + 21 = 100`, zero false positives |

**100, not 51**, because a rule that is `judgment-only` today may be mechanized tomorrow and its ID must
not move when it is. 51 is the *parity-testing scope*, not the frozen surface.

**Command of record** (its output is the snapshot, byte-for-byte):

```
sh scripts/lib/read-spec-rules.sh spec/STANDARD.md > evals/fixtures/compat/rule-ids-v0.10.0.txt
```

Retained at `evals/fixtures/compat/rule-ids-v0.10.0.txt` — 100 rows, 100 unique ids, stamped with
`spec/STANDARD.md` `version: 0.10.0`. It carries the reader's three columns (id · level · mark) rather
than ids alone, because level and mark are themselves frozen elements and a bare id list could not
detect a reclassification.

### The Finding-ID surface is a NAMED GAP, not an omission

**It is not mechanically enumerable from the Shell engine today, and that fact is recorded rather than
worked around.** `conformance-engine.sh` emits findings through at least **four** distinct message
shapes:

```
bad "conformance: <id> -- …"        bad "$_rid-- <id>: …"
bad "S13.TRAILERS   -- <id>: …"     bad "<id>: $p -- …"
```

The id is free text inside a message string, in a position that varies by call site. Three successive
anchored extractions produced **4**, then **14**, then a wide net of **78** tokens mixing real ids
(`adr-edited-after-decision` · `changelog-not-rotated-at-minor` · `core-file-missing`) with prose
(`append-only` · `comma-separated` · `cost-free`). Each wrong answer was caught only by a second query
disagreeing — the first two would have frozen a confidently incomplete list.

**Ruled (owner, 2026-08-24):** freeze the rule-ID surface now; freeze the Finding-ID surface at
**H07/H08**, where findings become typed data in the registry rather than strings in a message.
Rejected here: editing the engine to self-report (SPRINT-083 D2 forbids touching Shell) and harvesting
from the fixture corpus (defers to a suite this sprint is not running).

**This gap is evidence for the migration, not an obstacle to it.** A compatibility contract that cannot
enumerate half its own surface is the stringly-typed failure V3 §19 names — and it is exactly what a
typed `FindingId` ends. Until H07/H08, parity work has a frozen rule surface and an unfrozen finding
surface, and **must say so** rather than implying both are pinned.

## Consequences

**Positive:** Differential parity work has an authoritative comparand for rules from today, and a dated
snapshot that `cmp` proves regenerable. A parity harness comparing stdout bytes is out of contract and
must be rejected at review. The snapshot is version-stamped, so a `spec/STANDARD.md` bump does not
silently invalidate it — a new version means a new snapshot and an explicit diff, which is ADR-023's
pinning logic applied to the rule set. And 79 is recorded as a *disproved* query, so the next reader who
greps that shape has the reconciliation rather than a fourth plausible number.

**Negative (trade-offs accepted):** The freeze can be wrong and will still be obeyed — a frozen surface
is read later by people who cannot cheaply re-derive it, and if `read-spec-rules.sh` itself misreads the
spec, this ADR launders that error into a contract that every parity test downstream agrees with by
construction; the snapshot makes the error *detectable* (regenerate and diff) but not *self-correcting*.
It privileges today's rule shape: freezing rule ID, level and mark commits the migration to the
Standard's current three-column model, so a future §-restructure that legitimately renames or merges
rules now costs a recorded behaviour-change ruling rather than an edit. **Between now and H07/H08 a
family can pass rule parity while a finding id drifts, undetected** — that is the accepted cost of the
ruling above, and the named Finding-ID gap is a real hole for two sprints, not a formality, since nothing
detects the drift. Version-stamping the snapshot adds a maintenance step that will be forgotten: nothing
enforces a new snapshot on a `spec/STANDARD.md` bump, so the first stale snapshot will look exactly like
a current one. And **the Severity row of § Decision is WRONG and is superseded by ADR-036** — it froze
V3 §9's target-state vocabulary rather than the engine's actual `PASS`/`FAIL`/`GAP`; §4 is append-only,
so the row stands as decided and ADR-036 carries the correction. Read them together.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Freeze 51 (the checkable set) instead of 100 | It ties the frozen surface to today's implementation coverage, so mechanizing a `judgment-only` rule would *enlarge* the contract, and a rule's ID could move as its mark changed. ADR-028 already separated classification (100, unchanged) from evaluation scope (51); this follows that split |
| Freeze byte-identical stdout | It fails on improvements and passes on layout-preserving regressions — the inverse of what a parity test is for (V3 §25) |
| Defer the whole contract until the TS engine exists | That is the failure this ADR exists to prevent. A comparand written after the fact is not a comparand |
| Block T1 until the Finding-ID surface is enumerable | It would hold the entire epic behind a Shell-engine change that D2 forbids, to pin a surface that becomes typed data two sprints from now |
