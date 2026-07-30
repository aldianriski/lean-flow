---
sprint: 038
slug: probes-evals-layout
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: add96ff
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-038 — Probes, Evals, and Layout

> **Theme:** Turn SPRINT-037's two specs into things that actually fire, then clear the decks. The
> capability checks are prose; the eval harness is a validated prototype with no suite behind it.
> Both graduate here. Alongside them, the repo finally dogfoods its own canonical layout and the
> ledgers get the overdue collapse the SPRINT-038 governance scan surfaced. Foundations first: the
> probes guard every future unattended run, and the eval suite is what stops the guards rotting.

## Scope

**In:** the three capability probes implemented and firing · the behavioural eval suite decomposed,
with a *real* violating fixture · this repo migrated to the ADR-012 canonical layout · ledger
housekeeping (3 overdue TD collapses + TD-011's ADR-010 sweep).

**Out (deferred):** TASK-120 run-state (still `blocked`; **expiry now 2 sprints away — SPRINT-040
promote closes it as rejected if the trigger hasn't fired**) · any new gate mechanism beyond what
TASK-123 specifies · CI wiring for the eval suite (ARCHITECTURE boundary: lean-flow doesn't own CI).

**Standing constraint (owner directive, 2026-07-30 promote).** Every task's output must be usable by
a consumer **immediately on `plugin update`** — no repo-specific path in a shipped skill or template
(L-015), README + CHANGELOG reflecting anything user-visible, and any consumer-affecting change
called out at close so the release carries it. Where a task can't be dogfooded here, verify on the
consumer path rather than reading "didn't fire in our repo" as either broken or fine (L-016).

## Plan

### T1 — Implement the night-run capability probes `[size: S · risk: low · class: execution · HITL]` (TASK-123)
Layers: skills/orchestrator/references/night-run.md (Part 1 § Capability checks)
Depends-on: none
SPRINT-037 T4 specified three checks behaviour-first and deliberately built no mechanism. This makes
them fire. The **installed-version vs repo-manifest** check is the load-bearing one — it *blocks*
rather than degrades, and it caught a live mismatch during SPRINT-037 (a headless run served v1.19.0
against a v1.20.0 repo). Ship it first; it stands alone if the other two prove not worth probing.

**Acceptance:** the three checks are probed at pre-flight rather than read as prose, each emitting
its named finding, and fired once on a real pre-flight before an unattended run.

**DoD:**
- [ ] version check probes installed-vs-repo and **blocks** unattended on mismatch, named finding
- [ ] dispatch + worktree checks probe availability and **degrade** per their spec'd rules
- [ ] negative-tested per L-058 — one must-FAIL fixture per check, each failing with its own finding
- [ ] **fixtures retained**, not deleted with the scaffolding (the TD-012 mistake, now an anti-pattern)
- [ ] fired once on a real pre-flight (L-007); consumer-runnable, no repo-specific path (L-015)

### T2 — Decompose the behavioural eval suite `[size: M · risk: low · class: execution · HITL]` (TASK-124)
Layers: harness home decided at G2 · docs/research/behavioral-eval-feasibility.md (status update)
Depends-on: T4
TASK-116 proved one fixture feasible at $0.797 and adopted the approach, but its must-FAIL leg was a
*synthetic* end-state — so what exists is validated assertion logic, not a proven regression gate.
The suite closes that gap and becomes the carrier for TD-012's orphaned preflight fixtures (same
fixture shape, so it should cost a row rather than a mechanism).

**Acceptance:** a suite of fixtures covering the Part 0 boundary table runs on demand, including one
fixture where a genuinely violating run is caught, at a cost measured at the tier it will really run.

**DoD:**
- [ ] one fixture per Part 0 boundary-table row, reusing the prototype's skeleton + assertion script
- [ ] **a real violating fixture** — an actual run that misbehaves is detected, not just a hand-built
      end-state (this is the leg TASK-116 explicitly did not cover)
- [ ] `--model` pinned; suite cost re-measured at that tier (the $0.797 figure is an Opus upper bound)
- [ ] TD-012's retained preflight fixtures adopted into the harness, or an explicit reason they aren't
- [ ] harness home + fixture-maintenance ownership decided and recorded; capture doc's status updated

### T3 — Migrate this repo to the ADR-012 canonical layout `[size: S · risk: med · class: execution · HITL]` (TASK-074)
Layers: docs/ARCHITECTURE.md → docs/architecture/overview.md · docs/CHANGELOG.md → root · README.md ·
.claude/CONTEXT.md · scripts/qa-check.sh (path expectations) · repo-wide inbound links
Depends-on: T1, T2, T4
Deferred since SPRINT-032 (consumer surface shipped first). Runs **last on purpose**: its job is a
repo-wide inbound-link sweep, which is only correct once every other task's content is frozen —
otherwise a link written this sprint gets missed. Dogfoods the migrate skill's Legacy-lean relocation
path, which is itself the consumer-facing value (L-016: we verify migrate by being its own consumer).

**Acceptance:** `/lean-doc-generator migrate` relocates this repo's legacy-lean docs via the
Legacy-lean mapping block (propose→approve), and `/prime` + qa-check both pass on the new layout.

**DoD:**
- [ ] relocations applied via migrate's propose→approve path, not by hand
- [ ] every inbound link fixed repo-wide — including links written earlier this sprint
- [ ] `scripts/qa-check.sh` path expectations updated; qa-check green on the new layout
- [ ] `/prime` reads the new layout cleanly (its read-order table resolves)
- [ ] risk noted: this moves the CHANGELOG the v1.21.0 release just rotated — verify the archive chain
      and rotation links still resolve from the new location

### T4 — Clear the overdue ledger housekeeping `[size: S · risk: low · class: mechanical-ingest · HITL]` (governance)
Layers: TECH-DEBT.md · docs/adr/ADR-010-model-dispatch-role-tiers.md
Depends-on: none
Filed by SPRINT-038's own governance scan, which found the §11 TD collapse overdue by three rows —
two of them for several sprints. Also sweeps TD-011, whose mitigation was always "on the next touch
of ADR-010" and which has now hit the 3-sprint aging threshold.

**Acceptance:** the TD ledger carries no row past its collapse threshold, and ADR-010 no longer reads
as though intake classification is binding.

**DoD:**
- [ ] TD-008 · TD-009 · TD-010 collapsed to one-line entries in § Resolved (§11; bodies live in git)
- [ ] TD-011 resolved — ADR-010 amendment note points at ADR-013's advisory-default clause
- [ ] TD-011 marked `status: resolved → SPRINT-038 T4`; no row deleted (audit trail preserved)

## Decisions (pre-locked)

- **D1** — Release cadence: **v1.21.0 shipped SPRINT-037 before this sprint opened**, so consumers
  already have the preflight. SPRINT-038 gets its own MINOR at close. Chosen over one bundled release
  because the owner's standing constraint is consumer delivery *on update*, not at some later date.
- **D2** — Overlap map. `night-run.md` → T1 only · `TECH-DEBT.md` → **T4 single owner** (T2 reports its
  TD-012 outcome, T4 records it) · `docs/CHANGELOG.md` + `docs/ARCHITECTURE.md` + `README.md` +
  `CONTEXT.md` + `qa-check.sh` → T3 only · `docs/knowledge-index.md` → **coordinator-owned** (generated,
  never hand-edited). T2's harness home must not land on a path T3 relocates — settled at G2.
- **D3** — Sequence: **T1 ∥ T4** (disjoint) → **T2** (after T4, for TECH-DEBT ownership) → **T3 last**
  (repo-wide link sweep needs frozen content). T3's `Depends-on` is therefore real, not defensive.
- **D4** — §11 CHANGELOG rotation and the LEARNINGS pointer-collapse were **absorbed by the v1.21.0
  release** and are not tasks here; only the TD legs remain (T4).

## Assumptions

- **A1** — T4-037's spec transfers to a probe without redesign; the version check is implementable from
  the installed-plugin metadata a consumer actually has. *Confirm: T1 G2 — and if the metadata isn't
  consumer-reachable, that is a finding, not a workaround.*
- **A2** — A real violating fixture is constructible without shipping a deliberately broken skill.
  *Confirm: T2 G2; if it can't be done safely, T2 says so and the suite ships labelled as
  assertion-validation only — repeating TASK-116's limit knowingly rather than by omission.*
- **A3** — migrate's Legacy-lean mapping covers every relocation this repo needs. *Confirm: T3's
  propose step — an unmapped file is an owner decision, never a silent hand-move.*
- **A4** — T2's harness home can be chosen without a new ADR. *Confirm: T2 G2; if it turns out to set
  a precedent for shipping executable code in the plugin surface (the question T1-037 dodged by
  choosing a procedure step), it earns an ADR before it ships.*

## Execution Log

### 2026-07-30 | promote | plan locked
Four tasks (TASK-123/124/074 → T1–T3; T4 is governance-filed, no Backlog id). Governance scan was
**not clean** and is recorded rather than waved through: L-058 promoted (count 2 → CLAUDE.md
anti-pattern, body collapsed), TD-011 aged into T4, and §11 doc-aging found the TD collapse overdue by
three rows plus a CHANGELOG rotation overdue by two blocks — the latter absorbed by the v1.21.0
release cut immediately before this promote. Owner selected all four candidate buckets and added the
standing consumer-delivery constraint now recorded in § Scope. TASK-120 expiry: 2 sprints to
SPRINT-040. TODO.md 115 lines, under the soft cap after SPRINT-037's retention pass.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
