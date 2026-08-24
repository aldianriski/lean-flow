---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: a measurement round is appended
status: active
id: conformance-coverage-log
tags: [tooling, process]
domain: governance
related: [conformance-coverage]
---

# Conformance coverage — foreign-repo artefact triage, measurement log

> Append-only companion to [`../conformance-coverage.md`](../conformance-coverage.md). Uncapped by
> design: this file grows by one round per triage, which is exactly why it is not inside the decision
> doc's 130-line budget (STANDARD §2 `research/logs/` row · §6 cap-hit rule · ADR-014's mechanism).
> **Never edit a past round** — a later measurement supersedes an earlier one by being appended, and
> the superseded figure stays visible. The series *is* the evidence.
>
> **Rounds 1–3 are not reproduced here.** They are written up in the parent under § Artefacts and are
> not copied, because a figure copied into a second place drifts from the one it copied (L-108). This
> log opens at Round 4, which is the first round taken after the parent neared its cap.

## Round 4 — is `0 artefacts` still true at 45 rules? (SPRINT-081 T3 · TASK-238 · 2026-08-24)

**The question, and why it was finally worth asking.** EPIC-004's first exit condition called its own
`0 artefacts` result *honest but early*: it was taken at **6 of 62** checkable rules, and none of the
six were the families most likely to encode lean-flow's own directory shape. TASK-238 was parked with a
**narrowed** condition rather than a schedule — unblock when §6's tier doc-sets **or** §11's ledger
rules are evaluated by the *engine* (L-094). Both landed (SPRINT-078, SPRINT-080), alongside §2's
placement pair (SPRINT-076).

**A3, re-derived from the engine source at the start of this round rather than read off a summary** —
the discipline SPRINT-079's promote used for the §6 disjunct. All three families are genuine
assertions, not registrations: `assert_S6_{BASE,BACKEND,MEDIUM,MULTISVC}` (4), `assert_S11_*` (8),
`assert_S2_F_FILE` + `assert_S2_R_PLACEMENT`. Cross-checked against the engine's own printed
`coverage:` line — **45 `assert_` functions defined, 45 reported**, two independent counts agreeing.

**The stranger.** Unchanged and rebuilt from nothing: a four-file JS library (`README.md`,
`src/index.js`, `docs/architecture.md`, `package.json`), no lean-flow convention anywhere. The
mechanical guard that no lean-flow file was copied in **still passes** — asserted before the run, not
assumed, because copying even a template in would measure our own shape wearing a stranger's name.

### The result

**9 findings across 5 rules. 9 actionable, 0 artefacts.**

| Rule | Findings | Naming | Classification |
|---|---|---|---|
| `S2.F-FILE` | 4 | `SECURITY.md` · `CHANGELOG.md` · `docs/architecture/overview.md` · `docs/development/setup.md` | **actionable** — §2 `always` rows, repository-universal, each a canonical path the standard publishes |
| `S6.BASE` | 2 | `docs/product/requirements.md` · `docs/product/acceptance-criteria.md` | **actionable** — and see below; their character changed this sprint |
| `S3.SCHEMA` | 1 | `docs/architecture.md` | **actionable** — names the stranger's own file |
| `S2.R-README` | 1 | `README.md` | **actionable** — names the stranger's own file |
| `S1.LAW3` | 1 | `docs/architecture.md` | **actionable** — names the stranger's own file |

**Reconciled three ways (L-108),** because a triage that returns the comfortable number is exactly the
one to distrust: per-rule tally 4+2+1+1+1 = **9** = the report's own FAIL count; distinct rules **5**,
agreeing with the harness's independently computed `5 failing rule(s) across 9 finding line(s)`; and
every finding attributed to a rule with **no unattributed remainder**. A first attempt at the rule
count returned **8** by grepping finding *slugs* rather than rule ids — the disagreement with the
harness is what caught it, not a re-reading.

Two harness assertions carry the same claim mechanically and both pass: every finding names a path the
target has or a §2 canonical path it owes, and **applying exactly what the report asked for takes the
stranger to no FAIL line**. An unclearable finding is the failure this triage exists to detect.

### The finding worth keeping

**The two `S6.BASE` rows are the pair SPRINT-081 T2 made answerable, and this round is what verifies
that on the consumer path (L-016).** Before T2, a stranger whose requirements live in a ticket tracker
or a product wiki collected two permanent findings with no declaration available to them — clearable
only by writing two docs they had judged unnecessary. They can now declare a reasoned exemption in
`.conformance-exempt` and have it named, with its reason, on every report. The finding did not go away
and should not: **what changed is that it became answerable by a decision rather than only by a
document.** lean-flow could not have learned this by dogfooding — it fixed its *own* two rows in the
same sprint, which is precisely the asymmetry L-016 warns about.

**`0 artefacts` now means something.** At 6 rules it was a number nobody had earned; at 45, across the
three families most likely to leak our shape, it is a measurement. That is the difference between this
round and Round 1, and it is the whole reason the row was parked on a *condition* rather than a date.

### What this round does not claim

- **6 rules remain unchecked** (engine gaps, each named on a `GAP` line). They are held off the level
  and off the exit code deliberately, and they are not evidence of anything about a stranger.
- **`S2.R-PLACEMENT` still cannot see a near-miss.** `docs/architecture.md` is plausibly
  `docs/architecture/overview.md`; only `S2.F-FILE` reports it, as an absence rather than a
  misplacement. A known limit carried forward from Round 3, not re-measured here.
- **The stranger has no git history**, so §13's five rules report `not evaluated` and SPRINT-081 T4's
  new `attestation-absent` hold never fires for it. A git-backed adopter carrying no trailers *does*
  now collect that line — held at Gated, never failed, exit code unmoved. Untested against a foreign
  repo *with* commits; that is Round 5's question if anyone asks it.
