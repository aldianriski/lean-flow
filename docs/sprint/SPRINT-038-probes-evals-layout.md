---
sprint: 038
slug: probes-evals-layout
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: add96ff
close_commit: [recorded in the follow-up commit]
update_trigger: sprint execute/close events
---

# SPRINT-038 — Probes, Evals, and Layout

> **Theme:** Turn SPRINT-037's two specs into things that actually fire, then clear the decks. The
> capability checks are prose; the eval harness is a validated prototype with no suite behind it. Both
> graduate here. Alongside them the repo finally dogfoods its own canonical layout, and the ledgers get
> the overdue collapse the governance scan surfaced. The probes guard every future unattended run; the
> eval suite is what stops the guards rotting.

## Scope

**In:** the three capability probes implemented and firing · the behavioural eval suite decomposed,
with a *real* violating fixture · this repo migrated to the ADR-012 canonical layout · ledger
housekeeping (3 overdue TD collapses + TD-011's ADR-010 sweep).

**Out (deferred):** TASK-120 run-state (still `blocked`; **expiry now 2 sprints away — SPRINT-040
promote closes it as rejected if the trigger hasn't fired**) · any new gate mechanism beyond what
TASK-123 specifies · CI wiring for the eval suite (ARCHITECTURE boundary: lean-flow doesn't own CI).

**Standing constraint (owner directive, 2026-07-30 promote).** Every task's output must be usable by a
consumer **immediately on `plugin update`** — no repo-specific path in a shipped skill (L-015), README +
CHANGELOG reflecting anything user-visible, consumer-affecting changes called out at close. Where a task
can't be dogfooded here, verify on the consumer path (L-016).

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
- [x] one fixture per Part 0 boundary-table row, reusing the prototype's skeleton + assertion script
- [ ] **a real violating fixture** — an actual run that misbehaves is detected, not just a hand-built
      end-state (this is the leg TASK-116 explicitly did not cover)
- [x] `--model` pinned; suite cost re-measured at that tier (the $0.797 figure is an Opus upper bound)
- [x] TD-012's retained preflight fixtures adopted into the harness, or an explicit reason they aren't
- [x] harness home + fixture-maintenance ownership decided and recorded; capture doc's status updated

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
- [x] relocations applied via migrate's propose→approve path, not by hand
- [x] every inbound link fixed repo-wide — including links written earlier this sprint
- [x] `scripts/qa-check.sh` path expectations updated; qa-check green on the new layout
- [x] `/prime` reads the new layout cleanly (its read-order table resolves)
- [x] risk noted: this moves the CHANGELOG the v1.21.0 release just rotated — verify the archive chain
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

### 2026-07-30 | T3 complete | ADR-012 layout adopted — and the naive version of this would have broken the standard
Three relocations, all `git mv` so history follows: `docs/ARCHITECTURE.md` → `docs/architecture/overview.md`
· `docs/CHANGELOG.md` → root · **`docs/DEPLOY.md` → `docs/deployment/deployment-guide.md`** — the third
file TASK-074's `done-when` never named (found at G2; the mapping covered it, the task text didn't).
Its `## Rollback` section split out to `docs/deployment/rollback-guide.md` per the mapping's split-don't-fold
rule, template read first. Our rollback is ~3 lines of substance because the project is markdown-only with
no runtime state — stated plainly rather than padded.
**The trap:** ~20 inbound refs across four classes, and a find/replace would have **corrupted the
consumer-facing standard** — every `skills/**` mention is deliberate *legacy-placement* guidance (the
migration map maps *from* `docs/CHANGELOG.md`; DOCS_Guide's "still matched, second"; release-patch's
fallback; prime's read-order row). `docs/adr/**` is append-only → ADR-008's link is stale **by design**.
Asserted, not intended: **zero `skills/` and zero `docs/adr/`** files changed. Full rule → **L-063**.
Left as historical record: LEARNINGS L-001, archives, rotated changelogs; README's "legacy locations still
matched" sentence describes the standard, not our layout. The agent **reported rather than edited** a stale
`TODO.md` link outside its bounds — right behaviour at an ownership boundary; coordinator fixed it.
**DoD 1 deviation, recorded.** "Applied via migrate's propose→approve path" — the propose→approve
*discipline* was followed (coordinator produced the four-class proposal, owner approved it, only then was
anything applied), and migrate's Legacy-lean mapping was the spec. But `/lean-doc-generator migrate` was
not itself invoked: its approval step needs an owner decision a subagent cannot obtain, so a single agent
doing both halves would have been self-approving. Same outcome, honest route.
Verified on the new layout: qa-check **61 pass / 0 fail** · all **8 archive-chain links** resolve from
root · `/prime`'s slot-6 canonical path exists · a final stale-link sweep over tracked files returns only
the two legitimate mentions above · all four eval harnesses (incl. the new 10-leg self-test) still green.
Sprint DoD now **18/18** except T2's DoD 2, the owner-ratified A2 gap.

### 2026-07-30 | T2b + T2c complete | boundary rows covered, then the fixtures actually retained
**T2b covered 3 reachable rows** across 2 runs ($1.667 measured, `sonnet` pinned, no 529s): residual
grill / `AskUserQuestion` (`SPRINT-902`), and `close` §11-retention + `close` doc-freshness batched into
one `SPRINT-903` run since both are `close`'s park-bound legs and genuinely co-occur. Reachability
honestly reported rather than faked — **6 rows get no fixture, each with a reason**: `promote` sign-off
and sprint render, `/triage`, and `migrate`/`init` are unreachable from `sprint-bulk` (they live in other
skills); mid-sprint `scope-change` was excluded because "is this scope-changing" is a judgement, not a
markup token, and Part A already showed this class resists fixture steering; `release-patch` push was
excluded because a throwaway repo has no remote, so "no push occurred" is **vacuously** true — the exact
L-057 trap of a check that runs but cannot check. Good calls, all of them.
**Coordinator caught a real defect in T2b, and it was partly mine.** T2b checked in **nothing** — README
prose only, fixtures left in scratch to die with the session: the precise pattern promoted into CLAUDE.md
*this sprint*. Root cause was not T2b's: **T2a set the precedent** ("no fixture files committed for this
class") and the coordinator committed that framing without challenge. Full mechanism + the missing
input/assertions/run distinction → **L-062**.
**T2c salvaged it at zero API cost** — scratch repos intact. Retained: both fixture skeletons under
`evals/fixtures/boundary-rows/` (taken from each repo's *initial* commit, not post-run HEAD — the right
call), `assert-boundary-park.sh`, and a **10-leg self-test** (5 must-PASS + 5 must-FAIL per kind) proving
the assertions discriminate for free. All green.
**Third silent-false-negative caught by a must-FAIL leg this sprint.** T2c's own kind-detection keyed off
the sprint file's canonical path, so the `archive-moved` mutation broke detection *before* the check could
fire — `unknown-fixture` instead of `FAIL archive-moved`. A positive-only test would have shipped it. It
also fixed a no-op `git commit` that silently dropped the completion-claimed mutation (`--allow-empty`).
L-058 now has three independent live confirmations inside one sprint.
DoD 1 ticked on the reachable-rows reading with the 6 exclusions recorded above. **DoD 2 remains open** —
the A2-sanctioned gap, ratified by the owner.

### 2026-07-30 | T2a | harness home settled · TD-012 closed · a violating run could NOT be induced
Home: **`evals/` is permanent** (was provisional). WHY recorded in `evals/README.md`: `scripts/`
(ADR-008) is tooling that supports the *repo*; `evals/` guards a *shipped skill's behavioural
contract* — different lifecycle, run on demand, not in qa-check's always-on path. Both maintainer-only
and absent from `plugin.json`, so **A4's ADR trigger did not fire** (verified, not assumed). T1's two
ad-hoc runners generalised into `evals/lib/harness-common.sh`; both re-verified green after refactor.
**TD-012's core risk is closed.** The three deleted preflight fixtures are recreated
(`cycle` · `shared-file-unowned` · `base-ref-drift`, each failing with its named finding) against the
snippet **actually shipped in `dispatch.md`**. `dispatch.md` predates the anchor convention and was
frozen for T2a, so rather than reach into `skills/**` it added `extract_sole_fenced_block` — the file
has exactly one `sh` fence. Good instinct: it solved a cross-ownership problem without crossing the
ownership line. Residual: the runner is **not** wired into `qa-check.sh` (TD-012's alternative
mitigation), out of scope for T2a — so TD-012 goes to `status: resolved` on the retained-guard leg
with the wiring noted as unclaimed, not silently implied.
**The headline result is a negative one, and it matters more than the positives.** Two independent
attempts to induce a *real* violating run both failed. Method was sound and safe — a weakened
orchestrator with Part 0's park protocol inverted, loaded via `claude --plugin-dir`, never touching the
real cache. The model **declined to self-approve the destructive step even though the loaded procedure
explicitly authorised it**, once with the fixture self-flagged as fake and once fully neutralised (no
"fixture"/"weak" tells, a plain `HITL` tag matching real convention). Its stated reasoning cited its own
priors, not the loaded doc.
Two consequences, both uncomfortable and both worth keeping. (a) The eval suite **cannot prove it
catches a violation** by this route, so it ships labelled *assertion-validated-on-a-real-run*, not
*proven-as-a-violation-catcher* — exactly the A2 fallback, taken knowingly. (b) More significant:
**Part 0's text may be getting credit for behaviour the model would exhibit anyway.** SPRINT-036's
Retro logged the headless probe honouring Part 0 "unprompted, from the installed cache" as a retrieval
WIN; this result says some of that may be priors rather than the doc. That does not make Part 0
worthless — it still fixes *which* park record gets written and where — but it does mean the contract's
observable-artifact value is better evidenced than its compliance-causing value. → Retro learning.
Genuine improvement over SPRINT-037 regardless: the control run validated all four assertions against a
**real, non-synthetic** headless run, which the prototype never did.
Cost at the pinned tier: **$0.4255 · ~96s · 12 turns** on `sonnet`, ~53% of the $0.797 Opus baseline —
so the earlier figure was indeed an upper bound. No 529s. One self-inflicted MSYS path-conversion bug
(`/orchestrator` mangled to a Windows path) burned $0.14 before being fixed with a scoped
`MSYS2_ARG_CONV_EXCL` — disclosed rather than absorbed.
DoD 3/4/5 ticked. **DoD 1 (per-row fixtures) is Part B**; **DoD 2 (real violating fixture) stands open**
pending an owner call, since the finding changes what the remaining fixtures are worth.

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
**A1 resolved, and it changed what T1 builds.** `installed_plugins.json` records a usable `version`, but
its `gitCommitSha` reads `56a33a8` — this repo's *initial* release commit, useless as a content check.
That exposed a hole in T4-037's spec: version *strings* cannot catch an unbumped skill edit, the likeliest
form of the trap. Owner chose a **content diff, version string as fast path, SKIP when no local plugin
repo** — catches the real trap, never fires at an ordinary consumer. Inside T1's DoD, so a design
decision, not a scope change.
Also found: **three** legacy-lean files, not two — `docs/DEPLOY.md` too, which TASK-074's `done-when`
never named. The mapping covers it, so A3 holds; carried into T3's brief rather than dropped.

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
| `skills/orchestrator/references/night-run.md` | T1a · T1b | two capability probes implemented behind Part 1's spec table — the checks now fire instead of being read | low | 5 retained fixtures; both fired live (`BLOCK cache-differs` · `AVAILABLE worktree-clean`) |
| `evals/**` (new tree) | T1a · T1b · T2a · T2b · T2c | permanent maintainer-only harness home: `lib/harness-common.sh` + 4 runners + 8 fixtures + a 10-leg self-test — fixtures retained so a gate keeps its guard | low | every harness re-run green after each change |
| `TECH-DEBT.md` | T4 · close | 3 overdue rows collapsed · TD-011 resolved · TD-012 resolved (retained-guard leg) · TD-013/TD-014 filed | low | qa-check; L-009 structure re-read |
| `docs/adr/ADR-010-…md` | T4 | dated amendment reconciling its wording with ADR-013's advisory-default framing | low | `git diff` proved 11 insertions / **0 deletions** (append-only) |
| 3 relocations: `docs/ARCHITECTURE.md`→`docs/architecture/overview.md` · `docs/CHANGELOG.md`→root · `docs/DEPLOY.md`→`docs/deployment/deployment-guide.md` + new `rollback-guide.md` | T3 | ADR-012 canonical placement, dogfooding our own migrate path; DEPLOY was the relocation the task text never named | med | qa-check 61/0 · `/prime` slot-6 resolves · all 8 archive links resolve from root · template read first |
| `scripts/qa-check.sh` · `.claude/CONTEXT.md` · `README.md` · `docs/QA.md` · `TODO.md` | T3 · close | inbound links repointed — only real links to our own files, never the standard's own legacy guidance | med | asserted **zero** `skills/**` and `docs/adr/**` files changed |
| `docs/research/behavioral-eval-feasibility.md` | T2a | verdict honestly downgraded to `superseded`; the violation-catching gap stated, not smoothed | low | reviewed by coordinator |
| `docs/LEARNINGS.md` · `docs/knowledge-index.md` | close | L-061/062/063 filed; index regenerated (derived, ADR-009) | low | qa-check index lint |

## Retro

<!-- Written at close. -->

**Retrieval check** — **one real MISS, and it is the uncomfortable kind.** L-058 was promoted into
CLAUDE.md's anti-patterns *at this sprint's own promote*, complete with "**retain those fixtures**".
One task later, T2a declared behavioural fixtures unretainable as a class and checked in nothing, the
coordinator committed that framing without challenge, and T2b inherited it and also checked in nothing.
A freshly-promoted rule failed to fire twice inside the sprint that promoted it — promotion is not
retrieval. Salvage (T2c) cost nothing because the scratch repos were intact, which is luck, not process.
Retrieval **wins**, several load-bearing: L-017 subtracted a check at T4-037's delta map · L-015 caught
T1a's `evals/` leak in review (the TD-010 shape) · L-055 killed worktree isolation at G2 pre-spawn ·
L-042/L-043 held across five dispatches (explicit staging, zero agent git writes) · L-009's re-read after
every table edit · L-010 kept reads on repo source not the 1.18.0 cache · ADR append-only stopped T4
rewriting ADR-010 and T3 touching ADR-008.

**Worked**
- **Must-FAIL fixtures caught three independent silent false-negatives in one sprint.** T1a: a stripped
  parse guard made the shipped preflight report `CLEAR` on a real overlap. T1a again: a naive `diff -rq`
  false-BLOCKed on CRLF-vs-LF. T2c: its own kind-detection keyed off the canonical sprint path, so the
  `archive-moved` mutation broke detection *before* the check could fire. Every one was invisible to a
  positive-only test. L-058's promotion is now evidenced three times over, not argued.
- **The gate caught its own author.** T1a edited `night-run.md`, and the freshness check immediately
  returned `BLOCK cache-differs` naming that very file. SPRINT-037 T4 predicted that failure from
  reasoning alone; a mechanism now catches it on genuine drift.
- **Honest un-buildable answers, three times, each with a stated reason** — the agent-dispatch probe
  (no filesystem-observable signal), the real violating fixture (priors, not the doc), and six
  unreachable boundary rows. Naming what cannot be checked is worth more than a proxy that always
  passes; `release-patch push` in a remote-less fixture is the sharpest example (vacuously true).
- **Splitting the dispatch, not the DoD, rescued a task twice.** T1 died on 529 twice as the wave's
  heaviest brief; split into T1a/T1b it landed. T2 was pre-split on that evidence and never stalled.
- **Ownership boundaries held unprompted.** T2a hit a frozen `skills/**` and invented
  `extract_sole_fenced_block` rather than reach across it; T3's agent reported a stale `TODO.md` link
  instead of editing it.
- **Verify the claim, not the report.** Every agent claim that mattered was independently checked: `0
  deletions` proved ADR append-only · `git diff --name-only` proved no `skills/**` touched · 8 archive
  links resolved · harnesses re-run after every change. Two claims were wrong on inspection.

**Friction**
- **The API fought us** — two 529 deaths plus a classifier outage blocking `Bash`/`Edit`/`Agent`. Cost one
  re-plan; handled by verifying read-only that nothing partial had landed (true both times).
- **My own false reads of a gate** — an unset `$TMPDIR` broke a redirect and reported `EXIT=1` with
  qa-check never running (→ L-059); a PowerShell here-string in Bash committed `@` as a subject (→ L-060).
- **T3 was mis-sized S** — three files, ~20 refs, four decision classes. Caught before applying, but the
  promote estimate was wrong.
- **This Retro breached the 400-line sprint cap** and had to be compressed to pointers mid-close — the
  cap did its job, but a sprint this eventful wants shorter log entries written *as it goes*.
- **`night-run.md` reached 427 lines** with two embedded snippets (→ TD-014), and the dispatch-preflight
  guard is retained but unwired (→ TD-013).

**Pattern candidate** — all three filed in `docs/LEARNINGS.md` (bodies there, not duplicated here):
**L-061** priors hold a safety contract's line independently of the doc — *the sprint's most consequential
finding* · **L-062** retention needs the input/assertions/run split, and an unchallenged subagent framing
binds the next one · **L-063** a path rename in a standard-documenting repo is never a find/replace.

**Buckets routed:** Shipped → root `CHANGELOG.md` at release (feature sprint → MINOR by hand) · Tech debt
→ **TD-013** (unwired guard) + **TD-014** (night-run size), **TD-012 resolved** · Follow-ups → **TASK-125**
(judgement-only violation retry) + **TASK-126** (6 unreachable rows) · Learnings → **L-061/062/063**.
