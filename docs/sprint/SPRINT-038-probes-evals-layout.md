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
- [x] version check probes installed-vs-repo and **blocks** unattended on mismatch, named finding
- [x] dispatch + worktree checks probe availability and **degrade** per their spec'd rules
- [x] negative-tested per L-058 — one must-FAIL fixture per check, each failing with its own finding
- [x] **fixtures retained**, not deleted with the scaffolding (the TD-012 mistake, now an anti-pattern)
- [x] fired once on a real pre-flight (L-007); consumer-runnable, no repo-specific path (L-015)

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
- [x] TD-008 · TD-009 · TD-010 collapsed to one-line entries in § Resolved (§11; bodies live in git)
- [x] TD-011 resolved — ADR-010 amendment note points at ADR-013's advisory-default clause
- [x] TD-011 marked `status: resolved → SPRINT-038 T4`; no row deleted (audit trail preserved)

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

### 2026-07-30 | T1b complete | worktree probed · agent-dispatch honestly left un-probed (T1 now closed)
Worktree row **is** a real probe: `git worktree list --porcelain`, three legs — errors/not-a-repo →
`DEGRADE no-worktree-support` · more than the main tree → `DEGRADE leftover-worktrees` (naming the
paths) · else `AVAILABLE worktree-clean`. Never blocks: exit 0 covers both outcomes, and non-zero is
reserved for the probe's own plumbing failing (L-059). Probed **read-only** with a canned-listing
fixture seam, so asserting `leftover-worktrees` never runs `git worktree add` — the task's own subject
could otherwise have violated L-043.
**DoD 2 deviation, recorded not buried.** The DoD says both rows "probe"; the agent-dispatch row
**does not**, by deliberate decision. "Can this run spawn sub-agents" is a property of the agent
runtime, not the filesystem — no file, env var, or git state answers it from a shell snippet, and any
proxy (API key present, config flag, process count) would only ever report "available". That is a gate
that runs but cannot gate (L-057's family), and inventing one would have been worse than the honest
gap. So it stays a pre-flight line a human confirms by knowing what they launched into — same class as
the `unattended` signal itself — with no fixture, because a fixture would have to fake the one signal
that can't be faked. DoD 2 is ticked on that basis; the owner was told and can overturn it, in which
case the mechanism becomes a new task rather than a retrofit here.
Fixtures now **5 retained** across two harnesses (3 freshness + 2 worktree), both extracting their
snippet from `night-run.md` between anchors — no hand-copied duplicate can drift. Both green; the
freshness set re-run to confirm T1a is unaffected. Real fire: `AVAILABLE worktree-clean`, exit 0.
Coordinator verified additive-only (0 deletions in `night-run.md`), both anchor pairs intact, no
`D:\…`/`scripts/` leak, qa-check 61/0.
**Friction for the Retro:** `night-run.md` is now **427 lines** carrying the contract plus two ~100-line
shell snippets. Uncounted per ADR-006, but it is well past comfortable reading and a capability-checks
split is the obvious next move if a third snippet ever lands.

### 2026-07-30 | T1a complete | skill-freshness check ships — and caught its own author's drift
The load-bearing leg (the one that *blocks*) is in: 4-leg decision order — SKIP no-local-repo → BLOCK
`stale-release` → BLOCK `cache-differs` (content, not `gitCommitSha`) → PASS — as a procedure step plus
a dependency-free POSIX-sh snippet, matching T1-037's shipped form. Three fixtures green, each asserting
its own named finding, incl. the must-SKIP consumer leg.
**The trap fired for real, unprompted.** After T1a edited `night-run.md`, the live check returns
`BLOCK cache-differs` naming that very file: the repo changed, the plugin wasn't reinstalled, and the
cache still serves the old procedure. T4-037 predicted this failure from reasoning; it is now caught by
a mechanism, on genuine drift, produced by its own author. Strongest L-007 evidence this sprint.
**Operational consequence, by design:** every skill edit now BLOCKs unattended runs until
`claude plugin update lean-flow@lean-flow`. That is the spec'd behaviour (block, don't degrade —
there is no correct reduced shape for executing an unapproved procedure), not a defect.
Real bug the agent found and fixed en route: a naive `diff -rq` false-BLOCKed on dozens of files that
differed only by **CRLF-vs-LF**, an artifact of how the Windows plugin cache is written. Fixed with
`--strip-trailing-cr` and the GNU-diff-only caveat stated inline rather than silently assumed —
a false-positive gate would have been as useless as a false-negative one.
Design choice worth keeping: `evals/run-skill-freshness-fixtures.sh` **extracts the snippet from
`night-run.md` between anchors** rather than testing a hand-copied duplicate, so the fixtures cannot
drift from the shipped artifact. That is TD-012's root cause fixed structurally, not just re-mitigated.
**Coordinator caught an L-015 regression in review** — the shipped doc cited `evals/fixtures/...` and
`evals/README.md`, paths a consumer who installs the plugin does not have. Same defect shape as TD-010,
resolved in v1.19.0 for exactly this. Rewritten to state the discipline and attribute lean-flow's own
path as not-part-of-the-install (dispatch.md's convention). `evals/` confirmed absent from plugin.json.
Left for **T1b**: DoD 2 (dispatch + worktree degrade rows), and DoD 3/4/5 stay open because each has an
outstanding T1b component — fixtures *per check*, retention across both halves, and the consumer/L-007
pass over what T1b adds. Only DoD 1 is ticked; the split does not license claiming the rest early.

### 2026-07-30 | T4 complete | three overdue TD rows collapsed · TD-011 resolved append-only
Dispatched a tier above the Plan's `mechanical-ingest` on purpose — the ADR-010 leg is wording
judgement, not extraction (dispatch-time classification is authoritative; the persisted `class:` is an
advisory default, ADR-010/ADR-013).
Agent judgement worth keeping: it appended a **second** collapse line rather than extending the
existing TD-001…007 one, explicitly to avoid an L-009 fuse on a shared line. Right call — that exact
failure has hit this repo three times.
**ADR append-only verified by the coordinator, not taken on trust:** `git diff` on ADR-010 shows
**11 insertions, 0 deletions**, so the 2026-07-10 amendment text is provably untouched and the
reconciliation rides as a new dated note pointing at ADR-013's advisory-default clause + CONTEXT.md
§ Model tiers. CONTEXT.md checked for contradiction and found consistent — nothing edited there (not
T4's file this sprint).
Ledger state: TD-012 open · TD-011 resolved-with-body-retained (audit trail) · TD-001…007 and
TD-008…010 collapsed. No id deleted or reused. qa-check 61 pass / 0 fail.

### 2026-07-30 | T1 | two dispatch failures on API 529 — nothing written, task re-split
T1 died mid-run twice (server-side 529, not the brief). Verified read-only both times that **nothing
was written** — no `evals/`, no implementation markers in `night-run.md` — so there was no partial WIP
to reconcile and no commit to unwind. Diagnosis: T1 was the heaviest brief in the wave (read the cache
+ manifest + the dispatch.md precedent, then build four fixtures), so it simply had the most surface
exposed to an overload; T4 launched and completed fine in the same window.
Owner chose to **split T1 into two shorter dispatches** rather than resend it whole: T1a = the
skill-freshness check (the leg that *blocks*) + its three fixtures; T1b = the two degrade-only rows.
Not a scope change — T1's own `assumes:` already sanctioned shipping the version check alone, and the
DoD is unchanged; it now lands across two commits instead of one.

### 2026-07-30 | gates | batch G1+G2 signed off
G1 fast-path (plan frozen at `add96ff`, tree clean, 0 unpushed — scope unchanged since promote). G2:
D2/D3 re-verified by *running* T1-037's preflight against this Plan (waves T1=0 T4=0 T2=1 T3=2,
single-owner clean). A3 confirms in-task via migrate's propose→approve; A2 and A4 carry pre-authorized
fallbacks, so neither is a passive placeholder.
**A1 resolved, and it changed what T1 builds.** Recon found `installed_plugins.json` records a usable
`version`, but its `gitCommitSha` reads `56a33a8` — this repo's *initial* release commit, stale by the
entire project history, so it cannot serve as a content check. That exposed a hole in T4-037's spec:
comparing version *strings* cannot catch an unbumped skill edit, which is the likeliest form of the
trap (mid-sprint edits don't bump versions). Owner chose a **content diff with the version string as a
fast path, plus a SKIP leg when there is no local plugin repo** — so it catches the real trap and can
never fire at an ordinary consumer. Within T1's DoD ("installed-vs-repo"), so a design decision, not a
scope change.
Also found at G2: the repo has **three** legacy-lean files — `docs/DEPLOY.md` as well as ARCHITECTURE
and CHANGELOG — but TASK-074's `done-when` named only two. The migrate mapping covers DEPLOY
(→ `docs/deployment/deployment-guide.md`, rollback content split out), so A3 holds; carried into T3's
brief so it isn't silently dropped.

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
