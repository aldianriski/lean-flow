---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Question revisited, or a new measurement changes the recommendation
status: current
id: platform-readiness-audit
tags: [process, tooling, docs]
domain: governance
related: ADR-018
---

# Research — Can lean-flow become an adoptable software-delivery standard, and what is in the way?

> **Question.** The stated goal is for lean-flow to be a standard for software delivery in the AI
> era — adoptable across many repos, implementing agentic delegation under provable HITL quality.
> Is the current artifact on a path to that, and if not, what structurally blocks it?
> **Verdict.** Not on that path. The repo is converging on maintaining its own guarantees rather
> than growing its product, and three structural properties a standard requires are absent. Four
> sequenced epics (EPIC-002…005) close them; subtraction runs first because the SSOT files are full.

## Why this matters

61 sprints of investment sit behind a decision about what to build next. The failure mode being
tested for is not "the work was bad" — it was mostly good — but that the *allocation* drifted somewhere
nobody chose. Guessing wrong costs another era of sprints pointed at the wrong surface.

## Options considered

- **A — Extend the plugin** — keep growing lean-flow as a Claude Code plugin whose behaviour *is* the
  standard. *Trade-off:* cheapest, preserves shape; but an adopter can never take the standard without
  taking the tool, so "standard" stays a claim.
- **B — Extract a versioned spec, implementations conform to it** — the standard becomes a first-class
  artifact; the skill pack becomes its first conformant implementation. *Trade-off:* reshapes the repo
  and is hard to reverse; unlocks fleet adoption, conformance checking and non-Claude implementations.
- **C — Defer until adoption pressure exists** — wait for a second org, a fork or an issue.
  *Trade-off:* avoids a speculative refactor; but with 0 forks and 0 issues the pressure may never
  arrive, and the current trajectory (below) is not self-correcting.

## Findings

**F1 — Product share of change volume has declined monotonically across three eras.** Measured as
added+deleted lines per top-level directory between era boundary commits.

| Era | Sprints | skills | docs | evals | scripts | **product share** |
|---|---|---|---|---|---|---|
| E1 | 001–024 | 2,019 | 5,821 | 0 | 332 | **23.7%** |
| E2 | 025–046 | 2,225 | 8,494 | 4,293 | 694 | **13.5%** |
| E3 | 047–061 | 809 | 8,787 | 2,023 | 1,571 | **5.7%** |

In E3 that is **10.9 lines of doc churn per line of product churn**, or 15:1 counting evals and
scripts. *Source:* `git diff --numstat` across boundary commits `d8b09c0` · `5cd0b79` · `a3cc692` · HEAD.

**F2 — The trajectory is not a quality problem.** The guard machinery finds real defects: SPRINT-056
found five gates reporting green over input they never examined; L-058 caught a stripped guard clause
passing a real overlap. The guards are correct — they simply consume ~94% of capacity, and what they
guard stopped growing. → favours **B** over "cut the guards", and is why subtraction needs an evidence
rule rather than a target. *Source:* `docs/sprint/archive/SPRINT-056` · `SPRINT-057` · L-058.

**F3 — The standard is not a separable artifact.** The specification is
`skills/lean-doc-generator/references/DOCS_Guide.md` — 450 lines inside one skill's references folder.
It has no version of its own, no changelog, and cannot be cited or adopted independently of the
plugin. → **B**. *Source:* repo layout · `docs/architecture/overview.md`.

**F4 — There is no conformance check a consumer can run.** 11 checkers (`scripts/lib/check-*.sh`) and
24 eval harnesses exist; ADR-008 scopes all of them to this repo, and `docs/architecture/overview.md`
confirms no consumer invokes them. A standard whose rules cannot be checked by the people adopting it
is a style guide. → **B**, and the single highest-value consumer-facing gap.

**F5 — HITL is recorded but not attested.** `gates_signed: G1,G2 @ <sha>` records *which* gates at
*what commit* — not **who**, and only at sprint-batch granularity. *Source:*
`scripts/lib/check-gates-signed.sh` format spec. Git-native attestation (commit trailers on each
task's own commit, plus optional commit signing) is *stronger* than the status quo, not weaker: it
raises granularity from sprint to task, takes identity from the commit author/signature, and is
verifiable by anyone with a clone without infrastructure to run or trust.

**F6 — Every multi-repo and multi-human concept is absent.** Zero occurrences of multi-repo,
monorepo, org-level or cross-repo across `skills/`, `.claude/` and `README.md`. `CONTRIBUTING.md` and
`CODE_OF_CONDUCT.md` take documented exemptions because team = 1, so the standard's own team≥2 gate
has never fired and nothing behind it has been exercised for more than one human.

**F7 — The repo is at its rule budget.** `CLAUDE.md` 80/80 · `CONTEXT.md` 132/150 · three docs over
soft cap · 91 learnings · 17 ADRs · 31 research docs · 61 archived sprints. Every new rule now costs
an old one, which makes subtraction a prerequisite for the other epics rather than housekeeping.

**F8 — No external feedback loop exists.** Public since 2026-06-09: 5 stars, 0 forks, 0 issues. Every
quality signal driving the last 61 sprints was self-generated — which is a sufficient explanation for
F1 without anyone having made a bad call. → weakens **C**: waiting for pressure that has no channel
to arrive through.

## Recommendation

**Option B, sequenced, with subtraction first.** Extract a versioned, tool-agnostic specification and
make the skill pack its first conformant implementation; specify git-native attestation inside that
spec; ship a spec-driven conformance checker to consumers; then govern N repos from one standard
version. Run the subtraction epic first — F7 means the later epics have nowhere to write their rules
otherwise. Promoted to **ADR-018** (hard-to-reverse · surprising · a real trade-off).

Roadmap: [EPIC-002](../epic/EPIC-002-make-room.md) → [EPIC-003](../epic/EPIC-003-the-standard.md) →
[EPIC-004](../epic/EPIC-004-conformance.md) → [EPIC-005](../epic/EPIC-005-fleet.md).

## Out of scope / open questions

- What conformance *levels* the spec should define → EPIC-003, first sprint's G2.
- Whether non-Claude implementations are maintained here or by adopters → EPIC-003 open question.
- How fleet state stays git-native without a database → EPIC-005 open question; likely a `/prototype`.
- Whether ADR-008's maintainer-only scope is amended or superseded → EPIC-004 decision D2.
