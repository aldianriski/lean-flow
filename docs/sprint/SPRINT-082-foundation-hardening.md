---
sprint: 082
slug: foundation-hardening
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit:
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-082 — Foundation Hardening

> **Theme:** lean-flow's existing Gauntlet execution loop closes its remaining proof-boundary gaps:
> review depth follows risk rather than file type, mechanical verification must reach the claim it
> proves, and missing system verification cannot silently close material behavioural work. The core
> workflow is then frozen until Run Evidence supplies measured reasons to change it. This comes
> before EPIC-005 because a fleet standard multiplies whatever proof discipline it is built on — a
> boundary that leaks in one repository leaks in N.

## Scope

**In:** risk-aware `no-gate-discovered` semantics + a discovery rung a repo can declare · review depth
selected by consequence instead of file extension · a verification-reachability test at G2 · one
integrated dogfood across all three · the freeze, written where epic admission reads it.

**Out (deferred):** a CI runner · a hard-coded test command · a verification service · any new workflow
stage, agent, hook or reviewer role · a critic swarm · turning the bounded revise into an unbounded
loop · the 20 aged `TD-NNN` rows (noted and carried at this promote — none `severity: high`) ·
TASK-259 and TASK-260, which belong to unrelated lanes and stay in the Backlog.

## Plan

### T1 — Make `no-gate-discovered` risk-aware, and give gate discovery a declared rung `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/dispatch.md` (§ System verify) · `skills/orchestrator/references/night-run.md` (Part 0 boundary table · Part 4 rollup vocabulary) · `evals/run-system-verify-fixtures.sh` + `evals/fixtures/system-verify/` · the declared-gate file and its consumer-facing docs
Depends-on: none
Cites: ADR-021 (evidence boundary) · ADR-022 (bounded retry carve-out) · ADR-011 (no gate enforcement) · ADR-031 (a reasoned declaration is a file the tool parses)

Today the absence of a gate is treated as the absence of anything to block on, so a behavioural change
closes with no proof and leaves no trace that none existed. The correction is not new policy: Part 0's
execute-only charter already parks *decisions*, and "is this proven enough to close?" is one. The rung
is what makes the policy safe to ship — without a way for a repo to declare its gate, this repository
would park its own runs, because all three discovery rungs miss here.

**Acceptance:** a behavioural change with no discoverable gate cannot reach a silent close — attended it
draws a recorded owner ruling, unattended it parks — while a doc-only change with no discoverable gate
still records its finding and continues, unchanged from today.

**DoD:**
- [ ] The risk classifier is defined once, naming the classes that count as material (behaviour change · auth/permission · input validation · data write/migration · API contract · integration · deployment · security surface · financial or business calculation) — *Verify: a second definition of material risk anywhere in `skills/` is a fail*
- [ ] `no-gate-discovered` branches on that classifier in `dispatch.md` § System verify; low-risk non-behavioural keeps today's record-and-continue
- [ ] Attended asks for a ruling on *closing unproven*, distinct from today's "what gates this repo" discovery question; the recorded shape matches the existing `owner-ruling: system-verify — <ruling + reason>` line
- [ ] Unattended PARKs rather than continuing, and the Part 4 rollup vocabulary carries the new outcome — *Verify: `sh evals/run-night-run-rollup-fixtures.sh`*
- [ ] Discovery gains a rung for an explicitly declared gate command, after the existing three and without reordering them — *Verify: the three-rung precedence is asserted unchanged*
- [ ] Retained must-FAIL fixture: behavioural change + no discoverable gate must not close silently — *Verify: `sh evals/run-system-verify-fixtures.sh`*
- [ ] Retained control: doc-only change + no discoverable gate records a finding and continues, and the control reports its own denominator so a vacuous pass is visible (L-156) — *Verify: same harness*
- [ ] Seeded-break proof: reverting the branch reddens the must-FAIL case while the control stays green; the seeded file still parses and the break is targeted, not a demolition (L-142) — *Verify: `cmp` against the pristine copy before and after*
- [ ] `sh scripts/qa-check.sh` reports `0 fail` — *Verify: read the printed `N pass, M fail` line, not an exit code (L-120)*

### T2 — Route review depth by risk, not by file type `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/review-scoping.md` (skip table · scale-depth) · `skills/orchestrator/SKILL.md` (Review step) · `evals/fixtures/` (new, retained)
Depends-on: T1 (the risk classifier)
Cites: ADR-021 · ADR-022 · `spec/STANDARD.md` (the worked example of a high-consequence "docs" change)

The skip table's first row exempts `docs / config / trivial` from any agent pass on the strength of what
kind of file changed. One line of `spec/STANDARD.md`, an ADR that binds implementation, or a permission
config can carry more consequence than fifty lines of ordinary implementation, and each of them reads as
"docs" or "config" today. Depth should follow consequence along two dimensions — behaviour impact and
governance impact — while the cheap self-review floor survives for changes that genuinely are trivial.

**Acceptance:** a semantic change to `spec/STANDARD.md` draws an independent scoped reviewer, and a
README typo still resolves to self-review only.

**DoD:**
- [ ] The skip table and scale-depth rule select depth from behaviour impact + governance impact, consuming T1's classifier by reference
- [ ] `docs / config / trivial` is no longer an automatic exemption; spec/STANDARD semantics, an implementation-binding ADR, and a workflow or protocol contract each draw an independent scoped reviewer
- [ ] Auth and permission config still routes to `/security-review` as its own uncontaminated pass
- [ ] `/code-review`'s fan-out stays reserved for large or high-risk diffs
- [ ] The Standards-vs-Spec axes and the one-bounded-revise ceiling are unchanged — *Verify: `sh evals/run-dispatch-preflight-fixtures.sh` and the retained `evals/fixtures/revise-loop/` case still pass*
- [ ] Retained must-FAIL fixture: a high-governance-impact `.md` must not resolve as trivial on its extension
- [ ] Retained control: a README typo resolves to self-review only, reporting its denominator (L-156)
- [ ] Seeded-break proof as in T1 — the must-FAIL case reddens, the control stays green
- [ ] `sh scripts/qa-check.sh` reports `0 fail` — *Verify: the printed verdict line*

### T3 — Add a verification-reachability test to G2 `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/orchestrator/SKILL.md` (G2 checklist) · `skills/orchestrator/references/review-scoping.md` (§ ADR-021 evidence boundary) · `evals/fixtures/` (new, retained)
Depends-on: T2 (shared files — see D1)
Cites: L-136 · L-156 · L-157 · L-119 · ADR-021 · `check-doc-caps.sh` · `CLAUDE.md` (both cited as the worked example, neither touched)

This is placement, not invention. L-136 is already promoted with four sightings, and its fourth is this
failure exactly: SPRINT-081's first task froze a `Verify:` naming `check-doc-caps.sh` for three `docs/qa/` files,
but that checker derives its caps from §2 and §2 states no cap for `docs/qa/` — so it could neither pass
nor fail them, ran `66 PASS, 0 FAIL`, and said nothing whatever about its named subject. The rule lives
in `CLAUDE.md`'s cross-check clause; §10's placement test asks which flows can hit the failure, and the
one that can is G2, which does not read it there.

**Acceptance:** a criterion whose named checker runs clean but never examines the claimed target is
recorded as not-valid-proof at G2, while a correctly scoped checker passes unchanged.

**DoD:**
- [ ] G2 asks, for every mechanical `Verify:`, whether the mechanism EXISTS · RUNS in the target environment · REACHES the claimed artifact or behaviour · and whether its PASS actually PROVES the criterion
- [ ] A method whose scope excludes the claimed target is recorded as not-valid-proof rather than accepted
- [ ] Judgment verification stays legitimate where no mechanical method exists; the test never forces a checker into being merely to make a criterion mechanical
- [ ] Retained fixture: a criterion whose checker runs clean but never examines its named target is caught
- [ ] Retained control: a correctly scoped checker passes, reporting its denominator (L-156)
- [ ] Seeded-break proof: reverting the rule reddens the fixture while the control stays green; the seeded file still parses and the break is targeted, not a demolition (L-142)
- [ ] `sh scripts/qa-check.sh` reports `0 fail` — *Verify: the printed verdict line*

### T4 — Dogfood the three boundaries as one flow `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/sprint/logs/SPRINT-082-foundation-hardening.md` · whichever of T1–T3's artifacts the run exercises
Depends-on: T1, T2, T3
Cites: L-016 · L-111 · L-159

Three fixtures going green independently is not evidence that the three corrections compose. This runs
one representative change — small diff, real behavioural or governance impact — through the whole path
and records which branches it actually reached. The no-gate branch is genuinely reachable here: this
repository has no discoverable gate, so it sits permanently on that path.

**Acceptance:** one real change traverses G1 → G2 (including the reachability test) → implement →
risk-based review → bounded revise if a violation surfaces → system verify → the corrected no-gate
semantics → close or park, with every branch it reached named in the Execution Log alongside what
proved it.

**DoD:**
- [ ] The representative change is named at G2 together with the run mode, and the Plan says which branches that mode makes reachable (L-111 — an unattended-PARK branch is unreachable under an interactive ruling and is then proven by T1's fixture instead)
- [ ] The run completes and each branch it reached is logged with its evidence, in the rollup's own vocabulary (`test | check | fixture | review | owner-ruling`)
- [ ] No new specialist agent, no new workflow stage, bounded revise still exactly one retry, the external comparand ladder intact, System Verify still the final integrated gate
- [ ] Any defect discovered is filed as its own `TD-NNN` or `TASK-NNN` rather than absorbed into this sprint
- [ ] `sh scripts/qa-check.sh` reports `0 fail` — *Verify: the printed verdict line*

### T5 — Freeze the core execution architecture pending Run Evidence `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/adlc-epic-sequencing.md` (gated register + a compaction pass)
Depends-on: T4
Cites: L-151 · L-094 · EPIC-006

A freeze recorded where the admission decision cannot read it is not a freeze (L-151, four sightings).
The gated register already holds the admission condition for every epic deliberately not yet a file, and
it is what gets read when a new epic is proposed — so the freeze belongs there as one more condition.
The file sits at 130/130 against its §2 cap, so it must be compressed before it can hold the addition.

**Acceptance:** the gated register states that the core execution architecture is frozen after this
hardening and names what admits a further change, and the file is within its §2 cap.

**DoD:**
- [ ] The register is compressed enough to hold the addition — *Verify: `sh scripts/lib/check-doc-caps.sh` reports `adlc-epic-sequencing.md` PASS after the edit*
- [ ] The freeze is written as an admission condition alongside the EPIC-009…013 rows
- [ ] The admission triggers name all three classes of fact so none is parked forever (L-094): a measured defect · a measured cost · a repeated workflow failure · a security issue · consumer evidence
- [ ] Gauntlet components are named as existing architecture, not future backlog; future optimisation routes to EPIC-006's metrics; no "workflow optimisation" epic is opened
- [ ] `sh scripts/qa-check.sh` reports `0 fail` — *Verify: the printed verdict line*

## Decisions (pre-locked)

- **D1** — **T2 and T3 share `review-scoping.md` and `orchestrator/SKILL.md`.** Single owner: T2 lands both files first, T3 commits after. No parallel worktree build for this pair; under sequential `sprint-bulk` execution the overlap is safe, and if they ever meet in one tree the shared file is staged per hunk with `git diff --cached` verified (L-042/L-037).
- **D2** — **One risk classifier, defined in T1 and consumed by T2.** Two independent definitions of "material risk" would be a second SSOT that drifts from the one it copied.
- **D3** — **The declared gate rung may be ADR-grade; rule it at G2.** Applying Part 0's existing charter to a case that slipped through needs no ADR. But if the rung introduces a *new consumer-facing declaration file*, that is precisely what ADR-031 was written for (`.conformance-exempt`), and the same reasoning applies. Decide once the rung's shape is fixed — do not default either way.
- **D4** — **No `epic:` stamp.** This sprint advances none of EPIC-005/006/007/008; it is a standalone hardening sprint that precedes EPIC-005's first member sprint.
- **D5** — **The 20 aged `TD-NNN` rows are noted and carried,** not re-reviewed here. None is `severity: high`, so nothing auto-escalates to Backlog P1. Owner ruling at this promote.

## Assumptions

- **A1** — The three current behaviours are as the Plan states them. *Confirm: verified at intake before filing — `dispatch.md:479` (unattended continues "since there is nothing to block on") · `night-run.md:486` (`no-gate-discovered` proceeds to close) · `review-scoping.md:86` (`docs / config / trivial diff → self-review checklist only`) · `review-scoping.md` § ADR-021 ("notes its verification method **where a mechanical one exists**").*
- **A2** — This repository has no discoverable gate. *Confirm: no `package.json`, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml` or `.github/workflows/` at root; `.claude-plugin/plugin.json` carries no `scripts` block. Re-run the check at T1 rather than trusting this line.*
- **A3** — `docs/research/adlc-epic-sequencing.md` is at 130/130. *Confirm: `sh scripts/lib/check-doc-caps.sh` — re-run at T5, since T1–T4 may touch it.*
- **A4** — T1's fixtures extend an existing harness rather than creating one. *Confirm: `evals/run-system-verify-fixtures.sh` and `evals/fixtures/system-verify/` both exist today.*
- **A5** — Tiers per ADR-029: **G** for T1/T2/T3 (a false negative in any of them is silent by construction), **X** for T4 (it exercises shipped guards and adds none), **P** for T5 (prose stating an admission condition). *Confirm: re-tier at G2 if any task turns out to guard something the declaration missed; default up when unsure.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-082-foundation-hardening.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

_(written at close)_
