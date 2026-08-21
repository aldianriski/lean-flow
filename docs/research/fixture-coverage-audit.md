---
id: fixture-coverage-audit
tags: [tooling, process]
domain: governance
owner: Maintainer
last_updated: 2026-08-21
update_trigger: A check is added or removed, or a fixture harness gains/loses a must-fire case
status: current
related: [conformance-dispositions]
---

# Fixture coverage — does every shipped check have a retained fixture firing its named finding?

**The question EPIC-004 § Closed-when 3 has been open on since the epic opened, answered as a list
rather than a number.** SPRINT-072 measured the corpus — 22 harnesses · 98 cases · 46 distinct named
findings — and none of those figures answers *"does **every** check have one"*. A count cannot: it
tells you how much guarding exists, never whether any particular check is guarded.

**Answer: 24 of 24 checks are guarded, and 16 of 19 finding identities.** One gap found by this audit
was **repository-facing and is closed here**; the three that remain are the engine's own
invocation-error class. The gap list is named in full below — "mostly covered" is not an outcome
(L-058).

## Method, and the two things it had to get right

Enumerated **from disk, never from memory** — `ls scripts/lib/check-*.sh` (11) plus
`grep '^assert_' scripts/lib/conformance-engine.sh` (13) = **24 checks**.

**A grep standing in for a structural claim fails green, twice over here.** Both sightings are
recorded because the audit is itself a query, and a query acted on without a second number is the
failure L-108 names:

1. **The first extraction reached 5 of 12 files.** Pulling finding names with
   `grep 'bad "<name>:'` matched only the checkers that happen to use that message shape; the other
   seven emit through `printf 'FAIL …'` or embed the name mid-message. The census looked clean and was
   examining under half the corpus. **The naming convention is not uniform across the 11 standalone
   checkers** — which is a finding about the corpus, not just about the query.
2. **`reader-missing` appeared "guarded" and is not.** A name-grep over `evals/` matched
   `run-conformance-engine-fixtures.sh` — at line 185, inside a **comment** explaining why a case for
   it would prove nothing. A markdown-and-shell corpus documents its own finding names, so any grep
   over it eventually matches prose *about* the thing. Caught by opening the hit instead of counting
   it.

## The cross-check (DoD 3)

Finding **identities**, not name prefixes — two prefixes cover several findings each, so counting
prefixes understates the total by five. Prefixes **14**; `conformance:` expands to 4 (**+3**);
`gates-signed:` carries 2 FAIL branches (**+1**) plus the note-only *NOT SIGNED* state (**+1**) →
**19 identities = 16 guarded + 3 unguarded** ✓. The two sums disagreed on the first pass (14 vs 19),
and the difference was exactly the five identities hiding behind two prefixes.

## Every check, classified

**All 11 standalone checkers are guarded**, each by its same-named harness, each with at least one
must-fire case: `attestation` (7) · `count-claims` (3) · `doc-caps` (7) · `ephemeral-intake` (1) ·
`epic-archive` (3) · `layers-completeness` (6) · `layers-observed` (14) · `manifest-lockstep` (3) ·
`night-run-rollup` (2) · `research-archive` (3) · `task-origin` (2).

**All 13 engine assertions are guarded** by `run-gates-signed` (2) · `run-ownership-header` (4) ·
`run-adr-family` (5) · `run-s2-placement` (2).

### Guarded — 16 identities

`adr-path-noncanonical` · `adr-edited-after-decision` · `decisions-index-missing-adr` ·
`adr-required-section-missing` · `adr-no-negative-consequence` · `ownership-header-missing` ·
`ownership-header-field-missing` · `owner-not-a-role` · `agents-ownership-footer-missing` ·
`update-trigger-absent` · `core-file-missing` · `file-outside-canonical-placement` ·
`gates-signed: malformed` · `conformance: spec-table-unreadable` — each with a retained must-FAIL
case asserting that exact string; plus `gates-signed: NOT SIGNED`, guarded by a **must-REPORT** case
(below).

### Closed by this audit — 1 identity

| Identity | Reported by | What it was |
|---|---|---|
| `gates-signed: unrecognised gate token in '<x>'` | `S9.GATESWELLFORMED` | The only **repository-facing** gap the audit found. Its sibling branch (`malformed gates_signed:`) had a retained case; this one had none, so a regression that stopped rejecting bad gate tokens would have shipped green — the silent false-negative L-058 exists for. **Closed**: `run-gates-signed-fixtures.sh` now carries `unrecognised-gate-token-fails`. |

Writing that fixture found a **second** defect, which is why the case is worth more than the tick it
earns. The first attempt used `G1,G7`, expecting rejection — and the check **passed** it. The token
test is `case "$gates" in *[!G0-9,]*)`, which rejects characters *outside* `[G0-9,]` and therefore
accepts `G7`, `G99`, `G0`, while its own finding text promises *"want G1 / G2"*. The retained fixture
uses `X2`, which the branch genuinely does reject, so it guards the branch that exists; tightening the
test is a behaviour change and is filed as **TD-067**.

### NOT guarded — 3 identities, named

| Identity | Reported by | Why it is left |
|---|---|---|
| `conformance: usage` | argument parsing | Invocation error, not a repository finding. |
| `conformance: repo directory not found` | argument parsing | Invocation error. |
| `conformance: reader-missing` | reader resolution | Invocation error, and the only one with a written reason: a fixture would have to remove the reader, at which point the run fails for *that* reason rather than proving anything about dispatch. |
## Two distinctions the condition's wording does not make

**1. "must-FAIL" is not a uniform concept, and one check cannot satisfy it by design.**
`S9.GATESABSENT` reports *NOT SIGNED* as a **note** and never as a FAIL — deliberately, because a
sprint may legitimately sit unsigned between promote and the gate pass, and rendering that as either a
pass or a failure would be wrong. Its two retained cases assert the finding at **exit 0**.
`run-worktree-usability-fixtures.sh` is the same shape (`DEGRADE …` at exit 0). The property worth
requiring is therefore **"a retained case asserts the named finding on input that must produce it"**,
of which must-FAIL is the common case rather than the whole rule.

**2. Guarded is not the same as guarded on every run.** Two harnesses are **opt-in**, not always-on:
`run-attestation-fixtures.sh` (7 cases) and `run-layers-observed-fixtures.sh` (14) — 21 cases, the two
largest sets after the engine families, both building throwaway git repositories. Their checks are
guarded; they are simply not guarded by the gate unless someone runs them. `run-sprint-log-layout-
fixtures.sh` is a third shape again: it asserts **properties of a glob** rather than a named finding,
so it has no must-FAIL case and correctly should not.

## Verdict on § Closed-when 3

**Not ticked, and the reason is written into the epic rather than the condition being softened.** As
worded — *"each check has a retained must-FAIL fixture that fails with its named finding"* — the
honest answer is **24 of 24 checks yes; 16 of 19 finding identities yes**. What blocks a tick is not
volume:

1. **Three identities have no fixture**, all invocation errors rather than findings about a
   repository. Whether they are in scope for this condition at all is a **ruling nobody has made** —
   and making it here, inside the audit that would benefit from it, is exactly the drift L-088 names.
2. **One check cannot satisfy the condition as worded and should not.** `S9.GATESABSENT` never
   FAILs by design, so *"a must-FAIL fixture that fails with its named finding"* is unsatisfiable for
   it. The condition needs the wider property — *a retained case asserts the named finding on input
   that must produce it* — which is a wording change, not a measurement.

**What this audit changed.** The condition was **measured around** for four sprints — 22 harnesses,
98 cases, 46 findings, none of which answers *"every"*. It is now **established**: a reader can point
at any check and see its guard, and the remainder is three named invocation errors plus one wording
decision. That is the difference between an open condition and an unknown one.
