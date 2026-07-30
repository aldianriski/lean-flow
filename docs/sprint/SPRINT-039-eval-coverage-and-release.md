---
sprint: 039
slug: eval-coverage-and-release
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: 329b9ba
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-039 — Eval Coverage and Release

> **Theme:** SPRINT-038 built the eval suite and then honestly labelled what it does not cover.
> This sprint closes those two gaps — the boundary rows no `sprint-bulk` fixture could reach, and
> the open question about *why* a real violation couldn't be induced — then wires the deterministic
> harnesses into the always-on gate and ships the release 038 left pending. Finish the thing before
> starting the next thing.

## Scope

**In:** the 6 uncovered Part 0 boundary rows (covered or closed with reason) · the judgement-only
retry of the real-violation fixture · TD-013's qa-check wiring · SPRINT-038's pending MINOR (v1.22.0).
**Out (deferred):** TASK-120 run-state (still `blocked`; ADR-013 kill-switch expires at SPRINT-040
promote) · TD-014 night-run.md line count (trigger is a *third* embedded snippet; still two) · any
new eval *mechanism* — `harness-common.sh` is in place and a fourth runner is a few lines (038 T2a).

## Plan

### T1 — Cover the 6 unreachable Part 0 boundary rows, or close them as unreachable `[size: M · risk: low · HITL]`
Layers: `evals/fixtures/boundary-rows/`, `evals/assert-*.sh`, `evals/README.md`
class: execution
Depends-on: none
SPRINT-038 T2b reached 3 of 9 boundary rows from `sprint-bulk` fixtures and stated the other 6 as
gaps with reasons. Those reasons split two ways: **not reachable from `sprint-bulk`** (the row lives
inside a different skill invocation) versus **excluded on principle** (the assertion would not
actually assert anything). The first class is mechanical to cover now that `harness-common.sh` and
the retained-fixture pattern exist; the second stays excluded unless its reason is refuted.

**Acceptance:** every one of the 6 rows is either green against a retained fixture + assertion
script, or closed in `evals/README.md` with the reason that closes it — no row left ambiguous.

**DoD:**
- [x] Each of the 4 reachable-but-unreached rows gets a per-skill headless fixture: `promote`
      governance sign-off + `promote` sprint render (one fixture, both rows) · `/triage` re-rank ·
      `migrate`/`init` per-item approvals
- [x] Each fixture's **input** and **assertion script** are checked in (038's three-way split, L-062);
      only the run itself stays manual
- [x] Every assertion prints its own **named finding** — and a must-FAIL leg per check proves it
      (L-058); the zero-API selftest pattern of `selftest-assert-boundary-park.sh` is the model
- [x] The 2 excluded-on-principle rows (mid-sprint `scope-change`, `release-patch push`) are
      re-read: reason still holds → stays closed with that reason restated; refuted → covered
- [x] `evals/README.md`'s row table shows all 9 rows with covered/closed status and no stated gap
      left unexplained
- [x] Per-fixture cost recorded (pinned `sonnet`, `--output-format json`), as 038 did
<!-- QA: must-FAIL leg per assertion is the gate here, not a suggestion (L-058). -->

### T2 — Retry the real-violation fixture via a judgement-only HITL task `[size: S · risk: low · HITL]`
Layers: `evals/README.md`, `docs/research/behavioral-eval-feasibility.md`
class: execution
Depends-on: T1
L-061 recorded that two attempts to induce a genuine violating run both failed — the model declined
to self-approve a **destructive** step even when the loaded procedure authorised it. That leaves one
question unanswered: was the refusal about destructiveness, or about the gate? A pure approval /
judgement HITL step (no data loss) isolates it. Either answer is a result: a caught violation makes
the suite a real regression gate; a second refusal gives L-061 its confirmation and the suite's
labelled limit stands as written.

**Acceptance:** the question is answered on evidence from ≤2 pinned-`sonnet` runs, and the answer is
recorded where the suite's strength is claimed — not left in a transcript.

**DoD:**
- [ ] Fixture uses a judgement-only HITL step (approval/sign-off), no destructive action
- [ ] ≤2 headless runs, pinned `sonnet`; cost recorded
- [ ] Outcome routed: violation caught → `evals/README.md` upgrades the suite's labelled strength;
      refusal repeated → L-061 bumped to `count: 2` at close and the labelled limit restated
- [ ] `docs/research/behavioral-eval-feasibility.md` reflects whichever answer landed

### T3 — Wire the deterministic eval harnesses into qa-check (TD-013) `[size: S · risk: low · HITL]`
Layers: `scripts/qa-check.sh`, `docs/QA.md`, `TECH-DEBT.md`
class: execution
Depends-on: T1
TD-013 is the open half of TD-012: the retained fixtures can no longer be lost, but nothing runs
them — a maintainer editing a shipped snippet gets no automatic signal (L-057's family: a check that
exists but isn't reached). TD-013 names its own tension, and it decides the split: qa-check is fast
and always-on, so only the **zero-API** harnesses belong there; the behavioural real-run fixtures
cost money and stay manual. Either wire the first set or accept opt-in explicitly — silence is the
one outcome that isn't allowed.

**Acceptance:** editing a shipped snippet guarded by a zero-API harness makes a bare
`sh scripts/qa-check.sh` FAIL with that harness's named finding.

**DoD:**
- [x] A qa-check leg runs the zero-API harnesses (3 snippet runners + `selftest-assert-boundary-park.sh`
      + anything T1 adds in that class); real-run fixtures explicitly excluded
- [x] Leg gated on each harness's **own** exit status, never a pipeline's (the rule this sprint just
      promoted — CLAUDE.md Edit-safety trap **(c)**)
- [ ] Negative-tested: a deliberate snippet edit makes qa-check FAIL with the named finding, then reverted
      <!-- T3 did this and showed real FAIL output; box held until the coordinator reproduces it
           independently (deferred: T2 is live in this tree and a mid-flight snippet edit would hand
           it a spurious failure). T1's confirmed false-negative is why agent evidence alone
           doesn't tick a must-FAIL box. -->
- [x] `docs/QA.md` records the split (what the gate covers, what stays manual and why)
- [x] TD-013 → `status: resolved → SPRINT-039 T3`; the manual/gated boundary is stated, not implied

### T4 — Ship SPRINT-038's pending MINOR as v1.22.0 `[size: S · risk: low · HITL]`
Layers: `CHANGELOG.md`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `docs/sprint/INDEX.md`, `README.md`
class: execution
Depends-on: T3
SPRINT-038 shipped user-visible work — the ADR-012 canonical layout adoption, the retained eval
fixtures, three collapsed TD rows — and closed with `INDEX.md` marked "MINOR pending". No CHANGELOG
block, manifests still at 1.21.0. That is the L-015 class: real consumer-facing change with no
consumer-facing record. `/release-patch` is PATCH-only, so this is by hand.

**Acceptance:** a consumer reading `CHANGELOG.md` learns what 038 changed for them; manifests, README
footer, and INDEX all agree at 1.22.0.

**DoD:**
- [ ] v1.22.0 CHANGELOG block for SPRINT-038 — consumer-facing wording, not sprint-internal notes
- [ ] `plugin.json` + `marketplace.json` bumped to 1.22.0 **in lockstep**
- [ ] `1.21.0` grepped repo-wide before the gate — README footer and any other echo updated (L-048)
- [ ] `INDEX.md`'s SPRINT-038 row drops "(MINOR pending)"
- [ ] Rotation checked: v1.22.0 + v1.21.0 inline, v1.20.0 and older → `docs/changelog/` per §11
- [ ] **Plugin reinstalled and skill-freshness re-verified** — see D3; a bumped manifest without a
      reinstall makes every later headless run `BLOCK stale-release`
- [ ] Bare `sh scripts/qa-check.sh` green (footer↔manifest lint is leg 6)

## Owner-action checklist
- [ ] Approve the ~$3–4 API budget for T1's 4 fixtures + T2's ≤2 runs (pinned `sonnet`)
- [ ] Confirm 1.22.0 (not 1.21.1) is the right number for 038's scope before T4 commits the bump

## Decisions (pre-locked)
- **D1** — `evals/README.md` is shared by T1 and T2: **T1 owns it**, T2 appends only after T1 lands
  (commit order T1 → T2). Per-hunk staging if both ever have WIP in it at once (CLAUDE.md Edit-safety **(a)**).
- **D2** — 038's work ships as its **own** MINOR (v1.22.0), separate from whatever 039 ships at close.
  Two releases is the honest record; folding 038's changes into a future 039 block would misdate them.
- **D3** — T4 runs **last** and includes a plugin reinstall. The skill-freshness check (038 T1a)
  BLOCKs when installed version ≠ repo manifest — so bumping before T1/T2 would break the very
  fixtures this sprint exists to run. Ordering is a correctness constraint here, not a preference.
- **D4** — `.claude/CLAUDE.md` is now at **80/80**, exactly at cap: this sprint's promoted rule fit
  only because it went inline on an existing bullet. The next promotion has **zero** headroom, and
  §2's "cap-hit → split" has no split target for CLAUDE.md. Deliberately **not** addressed here
  (out of scope); file as TD at close so the next promote can't be silently squeezed.

## Assumptions
- **A1** — a per-skill headless fixture (`claude -p "/lean-doc-generator promote"` etc.) is the same
  shape as 038's `sprint-bulk` one, just a different entry command. *Confirm: T1's first fixture — if
  a skill can't be driven headless at all, that row closes as unreachable-by-tooling with the finding recorded.*
- **A2** — 038's honest-gap clause carries forward: a row T1 cannot cover is recorded as a stated gap
  with its reason, never a fixture that merely looks like coverage. *Confirm: T1's README row table + review.*
- **A3** — only zero-API harnesses enter qa-check; behavioural real-run fixtures stay manual.
  *Confirm: TD-013 names this tension itself; T3 states the split in `docs/QA.md`.*
- **A4** — T2 answers **one** question in ≤2 runs, and a second refusal is a valid answer (L-061
  `count: 2`), not a failed task to retry further. *Confirm: T2 report.*

## Execution Log

### 2026-07-30 | promote | Plan locked — 4 tasks, dependency chain T1→T2→T3→T4
Governance review signed off before rendering. Two findings resolved at promote rather than deferred:
(1) a 5-entry L-cluster (L-045 · L-049 · L-057 · L-059 · L-060 — "the tool reported success, the
artifact was wrong") promoted into `.claude/CLAUDE.md` Edit-safety trap **(c)**; the five bodies
collapsed to pointer lines per §11. The `count ≥ 2` trigger had never fired because each recurrence
was filed as a *new* entry instead of a `count` bump — recorded on L-045 as the meta-lesson.
(2) SPRINT-038's pending MINOR became T4 rather than an untracked owner action.
TD aging: none (TD-013/014 age 1 sprint, no `high`). doc-aging: rotation, LEARNINGS collapse, and
TODO.md (106/~150) all clean. `sh scripts/qa-check.sh` → 56 pass, 0 fail.

### 2026-07-30 | sprint-bulk | Batch G1 + G2 signed off; W1 (T1) dispatched
Preflight run bare against the shipped `dispatch.md` snippet (not a hand-copy):
`PASS base-ref` · `PASS wave-computation: T1=0 T2=1 T3=1 T4=2` · `PASS shared-file-owned:
evals/README.md in T1,T2 order=T1->T2` → **CLEAR**. Waves: W1 `T1` → W2 `T2 ∥ T3` (disjoint,
parallel-eligible) → W3 `T4`.
Owner sign-off at G2: full-coverage budget approved (~$4–5, pinned `sonnet`); T1 dispatched rather
than run inline. Version question for T4 **resolved on evidence instead of asked** — 038's only
consumer-facing diff was `skills/orchestrator/references/night-run.md` +202 lines (the two
capability-check snippets v1.21.0 had only specified in prose), i.e. added functionality → MINOR,
1.22.0 confirmed; the rest of 038 touched `evals/` (never shipped) or internal docs.
W1 runs in the **shared tree**, not a worktree: it is a single-task wave, which also avoids
dispatch.md's add/add hazard for a task editing files that exist only in unpushed commits.
T1 briefed with `/tdd` as its procedure skill — the first task in this repo with a real test
substrate (POSIX sh in `evals/`), so L-016's "no substrate to dogfood" no longer applies.

### 2026-07-30 | T1 | All 9 boundary rows closed — 8 covered, 1 restated; $3.35 of ~$4–5
5 fixtures (`promote-park` · `triage-park` · `migrate-park` · `init-park` · `release-patch-push`),
2 new assertion scripts + selftests. Costs: promote $0.5605/132s/11t · triage $0.5633/139s/13t ·
migrate $0.4727/64s/14t · init $0.3556/51s/6t · release-patch-push $1.4020/210s/39t, plus one
$0.1557 run wasted on the MSYS bug below. **A1 held** — a per-skill headless fixture is the same
shape as 038's `sprint-bulk` one, no `unattended` keyword needed; tested on the first fixture, not assumed.

**038's `release-patch push` exclusion is refuted, not restated.** Its reason ("a throwaway repo has
no remote, so *no push occurred* is vacuously true") was defeated by wiring a local `git init --bare`
origin — a real push destination at zero cost. The must-FAIL leg performs an actual `git push` and is
caught. Mid-sprint `scope-change` stayed excluded: its reliability reason re-confirmed, no cheap fix.

**Review caught a CONFIRMED silent false-negative — the exact L-058 class this task was guarding.**
`assert-noaction-park.sh`'s `originals-untouched` claimed in its own comment that sources were
"untouched" but tested only `[ -f ]` existence. A content edit folded via `git commit --amend` (commit
count 1, tree clean) produced a **full exit-0 all-PASS** — and the neighbouring `commit-count-unchanged`
check did *not* backstop it. The existing must-FAIL leg tested deletion only, so the suite never probed
mutation. Fixed by `cmp`-ing against the pristine retained input (immune to any git manipulation inside
the run repo), with `FAIL originals-modified` + `FAIL fixture-input-missing` (an uninspectable subject
must never pass). Second, narrower: `no-push` read a non-repo `origin` as "zero refs" → now
`FAIL origin-not-a-repo` behind a `rev-parse --is-bare-repository` guard. Both got a must-FAIL leg
(15 + 17 legs, all discriminating). Escape reproduced independently against the fixed script: exit 1.
**Generalises past this fix:** a check whose comment asserts more than its code tests is a
false-negative waiting to happen — and the must-FAIL leg that would expose it is the one testing the
*named* violation, not an adjacent one (deletion ≠ mutation).

**Accepted, not fixed:** the `claim_pattern` commit-message regex is brittle both ways
(`"chore: release finalized"` evades; `"doc-freshness review … approved"` false-trips), but every row
it touches has a structural non-text check carrying the safety property — tightening a non-load-bearing
heuristic adds brittleness for no gain.

**Two items for the close buckets** (surfaced here, filed at close, not by the subagent):
1. **TD candidate** — `migrate`/`init` correctly *withheld* unauthorized writes but wrote **no park
   record and no handoff doc**, unlike `promote`/`triage` which ran Part 0's protocol formally. The
   safety property held; the observability contract did not. A real overnight run parking there leaves
   the morning maintainer no trace it ran. L-020's class (shipped ≠ wired at every entry point).
2. **L candidate** — on Windows/Git-Bash, `claude -p "/triage"` gets MSYS-path-mangled into a Windows
   path before reaching `claude.exe`; `MSYS_NO_PATHCONV=1` fixes it. Cost one run to find. Same family
   as L-060 (shell-boundary mangling that fails silently and reports success).

### 2026-07-30 | T3 | TD-013 resolved — 5 zero-API harnesses gated; qa-check 61→66 pass, 44s→84s
New leg 12 loops the 5 zero-API harnesses, capturing each one's status by **command substitution**
(`hout=$(sh "$hp" 2>&1); hcode=$?`) — no pipe, no redirect in the verdict path, so the trap that
burned L-059 (an unset `$TMPDIR` making the *redirect* fail and reporting the gate's status) cannot
recur. A missing harness is its own named FAIL, never a skip; and a harness that exits non-zero
without printing a `FAIL` line reports exactly that — L-059's "a non-zero status with no report
behind it is not a verdict", encoded in the leg rather than left to the reader.

**Runtime is the real cost, and it is not small: 44s → 84s (+80%).** The two selftests dominate
(~26s combined) because each spins up many throwaway git repos. Flagged rather than absorbed. Note
the tension is TD-013's own: an opt-in `--full` mode would restore the speed but reverts leg 12 to
exactly what TD-013 called "strictly better than nothing, not equivalent to a wired gate". Three
live options — accept 84s · split to `--full` (loses always-on) · gate only the **3 snippet runners**
always-on (they guard *shipped* `skills/**` text) and move the 2 selftests (which guard maintainer-only
assertion scripts) to opt-in. The third is the principled cut, but it narrows what T3's DoD explicitly
specified, so it is **not** taken unilaterally → TD candidate at close, owner decides.

T3's negative test was performed and produced real FAIL output (a renamed finding in the shipped
snippet → `FAIL eval harness run-skill-freshness-fixtures.sh (exit 1): …finding missing…`, exit 1,
green again after revert). Its DoD box is nonetheless **held** until the coordinator reproduces it
independently — T1's confirmed false-negative established that a plausible agent report is not
must-FAIL evidence. Deferred, not skipped: T2 is live in this tree and editing a guarded snippet
mid-flight would hand it a spurious failure.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `.claude/CLAUDE.md` | promote | L-cluster promoted → Edit-safety trap (c) | Low | qa-check cap 80/80 + 56 pass |
| `docs/LEARNINGS.md` | promote | 5 promoted entries collapsed to pointers (§11) | Low | qa-check learnings legs green |
| `docs/knowledge-index.md` | promote | regenerated after LEARNINGS edit | Low | qa-check index-freshness green |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
