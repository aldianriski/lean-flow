---
sprint: 082
slug: foundation-hardening
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-082 — Execution Log

> Append-only companion to [`../SPRINT-082-foundation-hardening.md`](../SPRINT-082-foundation-hardening.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-08-24 | promote | Plan locked, gates signed

T1–T5 promoted from TASK-261…265. `plan_commit: 45d510b`; G1+G2 signed at `4d3274a`. D6 rules the run
mode **attended**, which is what makes T4's unattended-PARK branch unreachable by the dogfood — proven
by T1's retained fixture instead (L-111 discharged at G2 rather than discovered at T4).

### 2026-08-24 | progress | T1 — D3's trigger fired; the rung needs an ADR

D3 was pre-locked as a conditional: an ADR only *if* the declared gate rung introduces a new
consumer-facing declaration file. It does — `.gate-command` at the repo root — so **ADR-033** is
written rather than skipped. Recording the trigger firing, not just its outcome: the condition was the
decision, and a later reader needs to see which way it went and why.

### 2026-08-24 | scope-change | T1 — `Layers:` corrected mid-task (L-100)

**What broke:** `check-layers-observed.sh` failed the gate with `changed but undeclared in any task's
Layers:: .gate-command`. T1's `Layers:` said "the declared-gate file and its consumer-facing docs" —
prose, where the checker needs a literal path.

**Impact:** none to scope. The Plan's task set, acceptance criteria and DoD are unchanged; only the
declaration of which files T1 touches was incomplete. Promote could not have named `.gate-command`,
`evals/lib/check-system-verify-block.sh`, `docs/adr/ADR-033-*.md` or `docs/DECISIONS.md`, because
D3's trigger had not yet fired and the rung's shape was undecided.

**Re-confirm G2:** not required — this is the expected cost of declaring before the work (L-100:
`Layers:` is a live declaration, not a frozen prediction to defend). Logged, declared, continued.

Worth keeping: the finding came from the repo's own guard, on a file created minutes earlier. That is
the guard working exactly as intended, and it is the first time this sprint's own machinery caught this
sprint.

### 2026-08-24 | surprise | T1 — the checker asserted on wording, and the rewording broke it

`run-system-verify-fixtures.sh` case 4 (`wellformed-pass-passes`) asserted the substring
`nothing to block on`. That phrase was the *old* short-circuit's message — the very reasoning ADR-033
rejects — so rewording the PASS branch reddened a case that was testing nothing about the PASS path.
Updated to `the gate ran and was green`.

This is L-158 in miniature (a fixture asserting what a finding SAYS rather than what it DOES), caught
here for free because the wording changed. Noted rather than filed: the assertion is legitimate for a
PASS-verdict log, and the family's new cases assert on findings that carry consequence.

### 2026-08-24 | progress | T1 — the no-gate family shipped, with its discrimination proven

`no-gate-discovered` no longer short-circuits to PASS. The rollup line carries the risk class
(`no-gate-discovered(low|material)`), and `check-system-verify-block.sh` routes on it. Five fixtures
added — two must-FAIL, three controls:

| Fixture | Shape | Verdict |
|---|---|---|
| `no-gate-material-closed` | material + close, no ruling | **FAIL** `system-verify-no-gate-material-silently-closed` |
| `no-gate-unmarked-closed` | bare marker + close | **FAIL** `no-gate-risk-unmarked` |
| `no-gate-low-closed` | low + close | PASS — the cheap path, preserved |
| `no-gate-material-parked` | material, no close | PASS — correctly parked |
| `no-gate-material-ruled` | material + close + ruling | PASS — attended, recorded |

**Discrimination proof (Tier G).** Two targeted single-line seeds (`bad` → `ok`), each guarded: the
seed landed (`cmp` vs pristine), the seeded file still parsed (`sh -n`), the break stayed targeted
(114 → 114 lines, so a demolition could not masquerade as a discrimination), the named case reddened,
and the sibling control stayed green in both runs. Restore verified against the pristine `sha256`.
Seeding the material branch reddened only `no-gate-material-closed-fails`; seeding the unmarked branch
reddened only `no-gate-unmarked-closed-fails`. `no-gate-low-closed-passes` stayed green under both —
which is the evidence that the correction stopped the silent close *without* becoming a blanket block
on every repo that legitimately has no gate.

### 2026-08-24 | scope-change | T2 — the routing needed a record before it could be checked

**What broke:** T2's DoD demands a must-FAIL fixture proving a high-governance `.md` cannot pass as
trivial. T1 was enforceable because `check-system-verify-block.sh` reads a line the run writes into the
Execution Log. Review depth has no such record — the routing decision is an agent's judgement over
prose, and nothing writes down which pass actually fired. So the fixture had nothing to read, and the
DoD as promoted was unsatisfiable by any amount of prose editing. Found while writing the fixture, not
while writing the rule.

**Impact:** T2 grows past its declared `Layers:`. It now also touches `night-run.md` (a `review ·` line
added to the Part 4 rollup vocabulary), a new `evals/lib/check-review-depth.sh`, a new
`evals/run-review-depth-fixtures.sh`, and `scripts/qa-check.sh` for the wiring. No change to T2's
acceptance, to any other task, or to the sprint's Scope.

**Re-confirm G2:** owner ruled the recorded-outcome option over two cheaper alternatives — a
prose-reversion guard (would test what the skill SAYS, never that a review fired — L-158's criticism) and
re-tiering T2 down to P (honest, but leaves the rule unguarded). The Tier **G** declaration from A5 is
re-confirmed and is now attachable to a real mechanism, which is what it was missing.

**Why this is the same failure T3 exists to prevent, found one task early:** the promoted criterion
named a proof method — "a retained must-FAIL fixture" — that could not reach its subject, because the
subject left no trace to assert on. That is L-136's shape arriving through a frozen DoD, and T3's
EXISTS · RUNS · REACHES · PROVES test would have caught it at G2 had it already shipped. Recorded here
rather than only in the Retro, because it is the sprint's own strongest evidence for T3.

### 2026-08-24 | progress | T2 — routing re-keyed onto consequence, with a record behind it

`review-scoping.md`'s skip table no longer exempts `docs / config / trivial`. Depth is chosen from two
dimensions — **behaviour impact** (the material classes, consumed from `dispatch.md` § System verify,
not restated) and **governance impact** (does this change a rule, contract or decision other work is
measured against). A diff needs *both* low to earn the self-review floor. Unclear ⇒ material, same
default as T1 and for the same reason.

`scripts/lib/check-review-depth.sh` reads the new Part 4 `review ·` line and is wired into `qa-check.sh`
against **live** logs, not only fixtures — a guard that only ever sees `evals/fixtures/` has not been
shown to reach this repository at all. Seven fixtures, three must-FAIL:

| Fixture | Shape | Verdict |
|---|---|---|
| `governance-self-reviewed` | `behaviour:low · governance:high` + self-review | **FAIL** `review-depth-governance-self-reviewed` |
| `material-self-reviewed` | `behaviour:material · governance:low` + self-review | **FAIL** `review-depth-material-self-reviewed` |
| `unclassified-self-reviewed` | no classes + self-review | **FAIL** `review-depth-unclassified` |
| `low-self-reviewed` | both low + self-review | PASS — the cheap path, preserved |
| `multi-task-mixed` | 3 tasks, 1 violation | **FAIL** on that task only |
| `archived` | violation, archived | skipped — closed history |
| *(no args)* | — | the denominator note, never a silent pass |

`multi-task-mixed` exists because the obvious implementation — grep the file for `self-review`, grep it
for `governance:high` — is wrong in **both** directions: it flags a file where the two never meet on one
line, and it lets an honest self-review mask a real violation elsewhere. The checker reads line by line
and this fixture is what holds it there.

**Discrimination proof (Tier G).** Three targeted single-line seeds, each guarded as in T1 (landed ·
parses · 99 → 99 lines · restored under a checked hash). Each seed reddened **only** its own case, and
`low-self-reviewed-passes` stayed green under all three — the evidence that the cheap path survived.

### 2026-08-24 | blocker | T1 and T2 are governance:high and now owe themselves an independent review

The rule shipped in T2 applies to the diff that shipped it. T1 and T2 both change rules other work is
measured against — `behaviour:material · governance:high` — so under § Two dimensions neither earns the
self-review floor, and recording `review · T1 · self-review · …` would fail the checker T2 just added.

No `review ·` line is therefore written for T1 or T2 yet: the record states what actually fired, and an
independent pass has not. This session cannot dispatch one (the operating instruction for this session
forbids calling the Agent tool unless the owner asks), so the Review step is **owed and owner-triggered**.
Recorded as a blocker rather than resolved by writing a line that would be false — the first thing this
rule protects is the honesty of its own record.

### 2026-08-24 | progress | T3 — reachability, and it caught this sprint on first contact

G2 now asks four questions of every mechanical `Verify:` — **EXISTS · RUNS · REACHES · PROVES**. Two are
mechanical and are screened by `scripts/lib/check-verify-reaches.sh` (EXISTS: the named script is in the
repo; REACHES: it textually references the target the criterion claims). RUNS and PROVES stay human, and
the checker's header says so — a checker implying it settled all four would be the same over-claim it
exists to catch, one level up.

Manual verification stays legitimate. A criterion with no mechanical method is a judgment tick that says
so, and `judgment-only` is the fixture that keeps it that way: manufacturing a checker to make a
criterion *look* mechanical is the failure this rule names, not its remedy.

**It found a live defect in this sprint's own Plan on its first run.** T2's DoD read
*"Verify: `sh evals/run-dispatch-preflight-fixtures.sh` and the retained `evals/fixtures/revise-loop/`
case still pass"*. That harness never references `revise-loop`, and nothing does — the fixture is a
**manual attended exercise** by design ("not run by any script", its README). So a manual method had
been dressed as a mechanical one, in a box ticked one commit earlier. Split into a mechanical clause and
an explicit judgment tick.

Worth separating two things I briefly conflated: `revise-loop` is **not** an orphaned or unguarded
fixture — it is correctly filed in the paid/manual class. The defect was the claim about it, not its
status.

**Discrimination proof (Tier G), and the gap it exposed.** Seeding the REACHES branch reddened only
`unreachable-target-fails`; seeding EXISTS reddened only `method-absent-fails`; the control held under
both. A third seed removed the **comment-stripping** line — and the suite stayed green, because I had
just removed the offending token from the fixture's own comments. A load-bearing guard clause with no
fixture behind it is L-058 exactly, and it would have shipped looking proven. Added
`prose-mentions-path`: a stand-in checker whose *prose* names the target while its code never touches
it. With it, the third seed reddens.

That failure fired for real first: the family's original must-FAIL went **green** because the fixture
script's explanatory comment mentioned the unreachable path, so the checker matched prose *about* the
target instead of code reaching it (L-108, the self-describing-corpus shape). The checker now strips
comments; the fixtures keep the no-token discipline anyway, so they stay honest if that stripping is
ever relaxed.

Live-wired against `docs/sprint/SPRINT-*.md`, not fixtures alone. This repository's own Plan reports
**0 confirmed targets** — a vacuous green — which is precisely why the positive path lives in
`reachable-target` and why the denominator is printed rather than assumed (L-156).

### 2026-08-24 | surprise | T3 — an unrestricted `sed` ticked three tasks that had not been done

While ticking T3's DoD I ran a `sed` whose pattern matched the gate criterion in **T3, T4 and T5** —
their text is identical — with no line range. All three took the evidence line from the T1+T2 gate run:
`✓ printed verdict QA-CHECK: 173 pass, 0 fail`. T4 and T5 had not been started.

Three boxes claiming completion, each citing a real run that was not theirs. Caught by arithmetic, not
by reading: T3 reported `ticked 7, open 0` when its own gate had not run yet, and that number could not
be right.

Reverted all three; T3's was re-ticked only after its own gate. Worth recording rather than quietly
fixing, for two reasons. It is the **exact failure this sprint is about** — a ticked box whose evidence
does not belong to it, indistinguishable from a satisfied one by anyone reading later — produced by the
author of the rule, in the artifact the rule governs, minutes after shipping it. And the mechanism is
narrower than "be careful": a whole-file `sed` on a **repeated** criterion line is a cross-task edit
wearing the shape of a single-task one, which is L-009's family (a structure-adjacent edit that looks
clean and fuses neighbours) arriving through the checkbox rather than the table row.

The guard that caught it is one the sprint already relies on: **read the count back and reconcile it
against what you know happened.** No new rule proposed — the existing cross-check clause covers this,
and it fired.

### 2026-08-24 | scope-change | T4 — the dogfood's vehicle is T5's change, and T1 closed one of its branches

**Two changes, both discovered by asking what T4 can actually reach.**

**(a) The vehicle.** T4 needs "one representative change — small diff, behavioural or governance
impact". Inventing a synthetic diff would dogfood the flow against something nobody would otherwise
ship, which is the weaker test. T5's change — compress the gated register, add the freeze — is real,
small, and `governance:high`. So T4 runs T5 through the flow under observation. The Plan declares
`T5 depends-on T4`; in practice they are one pass, T4 being the observation of T5's execution.
No acceptance changes on either task, and no D-row is affected.

**(b) T1 closed the branch T4 was written to exercise.** T4's `assumes:` recorded that the
`no-gate-discovered` path "IS dogfoodable here, contrary to first expectation", because this repository
had no discoverable gate. **T1 added `.gate-command`, and rung 4 now discovers `sh scripts/qa-check.sh`.**
Rungs 1–3 still miss (0 hits), but the repo is no longer gate-less — so the dogfood reaches
`system-verify · PASS`, never `no-gate-discovered`.

That is the fix working, not a problem: the branch closed because the defect it guarded was repaired.
But the criterion resting on it was written three tasks ago against a state this sprint then changed —
**L-111's shape with the polarity reversed.** L-111 is a criterion foreclosed by a decision taken later;
this is a criterion foreclosed by a *repair* taken later, and it is just as invisible. The diagnostic
generalises: at G2, ask not only *"does this acceptance depend on a decision I am about to take"* but
*"does it depend on a broken state an earlier task in this same Plan is about to fix?"*

**Re-confirm G2:** not required. The `no-gate-discovered` family stays proven where it always was —
T1's five retained fixtures, which is where an unattended-PARK branch was already going to be proven
under D6's attended ruling. T4 names the branches it actually reaches and does not claim that one.

### 2026-08-24 | progress | T4 — the dogfood run, branch by branch

One representative change: T5's — compress the gated register, add the freeze. Small diff, real
governance impact, and a change that was going to be made anyway rather than a synthetic one.

| Step | Reached | What proved it |
|---|---|---|
| **G1 Scope** | yes | goal restated · size S · blast radius one file · out-of-scope named (no new epic, no roadmap resequencing) |
| **G2 Design** | yes | approach + WHY recorded; the §2 cap was the design constraint, not an afterthought |
| **G2 reachability (T3)** | yes | T5's criterion names `check-doc-caps.sh` for `adlc-epic-sequencing.md`; the checker derives its caps from §2 and §2 **does** state a `docs/research/` cap, so the method REACHES its target — the opposite of L-136's case, confirmed rather than assumed |
| **Implement** | yes | register compressed 130 → 130 with the freeze added; `PASS cap (130 <= 130)` |
| **Risk-based review (T2)** | **PARKED** | classified `behaviour:low · governance:high` — an admission condition other work is measured against. Under § Two dimensions that cannot take the self-review floor, and this session cannot dispatch an independent reviewer. Parked, not self-certified |
| **Bounded revise** | not reached | no review fired, so no finding to revise. Correctly not exercised rather than faked |
| **System verify** | yes | discovery ran all four rungs live: 1–3 returned 0 hits, rung 4 read `.gate-command` → `sh scripts/qa-check.sh`. First end-to-end proof that T1's rung works as a *discovery step*, not just as prose |
| **`no-gate-discovered`** | **not reachable** | T1 closed it — see the scope-change above. Proven by T1's five retained fixtures instead |
| **Close / park** | park | the run does not close: the review branch is parked and the sprint stays `active` |

**T5 · parked-hitl** — review parked: `governance:high` requires an independent scoped reviewer, and none
is available in this session. Unblock condition: the owner dispatches a scoped reviewer, runs
`/code-review`, or records a ruling accepting self-review for this change.

**No `review ·` line is written for T5**, and that is the point rather than an omission. The line records
what actually fired; nothing did. Writing `self-review` would be false *and* would fail
`check-review-depth.sh` — the checker and the honest record agree, which is the first evidence that T2's
two halves compose rather than merely coexisting.

**What this run actually demonstrated.** Two of the three corrections fired on a real change: T3's
reachability question was answerable at G2 and came back *reachable* (a case the fixtures could not
supply, since this repository's own Plan reports 0 confirmed targets), and T1's discovery rung resolved a
real gate command through the documented order. T2's correction fired by **refusing** — it declined to
let a governance change self-certify, which is the behaviour it was built for, and the refusal is the
evidence. A run where every branch goes green would have proved less.

### 2026-08-24 | run-complete | T4/T5 pass finished

run · 2 of 2 DoD-bearing tasks executed (T4 observation · T5 change)

system-verify · PASS · sh scripts/qa-check.sh

The gate command was **discovered**, not assumed: rungs 1–3 returned 0 hits and rung 4 read
`.gate-command`. Verdict read from the line the gate prints (`QA-CHECK: 175 pass, 0 fail`) and
cross-read against FAIL rows anywhere in the output, because this repository's conformance leg is
informational in the tally and a clean tally alone would not show its findings (L-120).

T5 · parked-hitl · review parked: `governance:high`, no independent reviewer available this session

**The run does not close.** One branch is parked, so the sprint stays `active` and the close is the
owner's. That is the designed outcome, not a stall.

### 2026-08-24 | run-complete | rollup corrected to the Part 4 shape

The previous entry wrote `run · 2 of 2 DoD-bearing tasks executed`, which is not the shape Part 4
defines — so `check-night-run-rollup.sh` reported the run as having no header at all. Corrected here
rather than edited above: this log is append-only, and a corrected entry is the mechanism (ADR-014).

Caught by the gate, not by review. The wording read fine and counted the right things; it simply was
not the format a checker can assert on — which is the same lesson as T2's, arriving through the
bookkeeping instead of the routing.

run · 38 of 38 DoD ticked

system-verify · PASS · sh scripts/qa-check.sh

run · cost n/a · turns n/a · wall n/a · 5 of 5 units · inline

**The three `n/a`s are stated, not omitted** (ADR-016). This was an attended interactive session with no
per-run metering available to it, so cost, turns and wall-clock cannot be recovered honestly. Writing a
plausible number would corrupt the very series the calibration row exists to build — the one a future
promote reads to size a batch. `5 of 5 units · inline` is real and is the part that carries information.

### 2026-08-24 | park | T5 review parked, and the owner ruled on the remaining gate finding

**owner-ruling: qa-check — the `layers-observed` finding against
`docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` is accepted and the file stays untracked.**
It is an owner-authored 3,039-line handoff that entered the tree during this sprint, belongs to no task
here, and declaring it under T5 would mis-attribute it to the freeze — the exact mis-attribution these
five tasks were built to prevent. Ruled rather than absorbed.

**owner-ruling: process — QA and evals gating is skipped for the remainder of this sprint**, on the
owner's stated intent to replace the QA/evals process wholesale (V3 proposes moving the reference
evaluator off Bash/Awk to TypeScript + Bun). Recorded with its cost, because a ruling without its
downside is a decision nobody can re-examine: the replacement is an intent with no scope, date or ADR
yet, so between now and then the guards this sprint just built are the ones running, and skipping their
gate is how a guard gap outlives the plan that was going to close it. The owner is never gated (ADR-021);
what the rule requires is that the override be *recorded*, and this is that record.

**What was actually verified before the skip.** The final full gate (gate8) printed
`QA-CHECK: 173 pass, 4 fail`. Three were fixed and each re-verified by running its own checker directly:
`check-night-run-rollup.sh` → PASS (both findings), `check-layers-completeness.sh` → clean. The fourth is
the V3 file above, ruled. No full-gate re-run was completed after the fixes; that is stated rather than
implied, and it is why T4/T5's gate criteria are amended to cite the ruling instead of a green tally they
no longer have.

**T5 · parked-hitl** — the independent review of `governance:high` work remains owed and unblocked only
by the owner. Carried into the Retro as an open follow-up rather than closed silently.
