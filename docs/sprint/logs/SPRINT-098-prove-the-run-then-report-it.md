---
sprint: 098
slug: prove-the-run-then-report-it
owner: Maintainer
last_updated: 2026-09-11
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-098 — Execution Log

> Append-only companion to [`../SPRINT-098-prove-the-run-then-report-it.md`](../SPRINT-098-prove-the-run-then-report-it.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-11 | promote | Plan locked at `a341378`, five tasks, 27 DoD + 1 owner-action

Promoted from the Backlog under the epic-first ruling: EPIC-015 § Closed-when 1 · 5 · 6 lead, ahead of
the cheaper standalone guards. `TASK-188` was corrected `blocked` → `ready` at the promote on an owner
ruling — `blocked` had been standing in for "opportunistic, cannot be scheduled", which is not what the
state means, and it made the 2026-09-11 pairing ruling unexecutable. Governance checklist owner-signed;
`TD-143` and `TD-150` escalated to Backlog P1 as `TASK-344`/`TASK-345`.

### 2026-09-11 | progress | G2 fact-finding: A2 and A4 closed by derivation, not by asking

**A4 — CONFIRMED by reading.** ADR-022 § Decision item 2: the ceiling is **one retry per review pass,
total** (owner-ruled SPRINT-065 T3); still-open after it → `parked-hitl`, never a second firing. The
carve-out also requires a mechanical trigger and a declared repo policy, with absence of the policy
meaning never. This is a *documented behaviour*, so it is closed by reading rather than by ruling or by
waiting for a measurement (L-094). T2 ships the loop at this ceiling and does not re-decide it.

**A2 — TASK-336's `44 of 50` is wrong on both grains.** Derived by shape (`^### <date> | run-complete |`,
not a substring — L-108), with `.claude/worktrees/` excluded (L-170), each figure cross-checked by its
own inverse (L-130):

| Population | With | Without | Sum |
|---|---|---|---|
| sprint logs | 6 carry a `run-complete` entry | 45 do not | 6 + 45 = 51 |
| archived sprints | 37 carry open DoD | 60 fully ticked | 37 + 60 = 97 |
| archived sprints with open DoD | 1 has a rollup | **36 do not** | 1 + 36 = 37 |

The criterion's real population is **36 of 97**, not 44 of 50. The row's denominator counted logs
(51 today, not 50 — both then-active sprints have since archived) while its criterion is about sprints.

### 2026-09-11 | scope-change | T1 DoD 1 re-aimed: the premise was false in THIS repository

**What broke.** `TASK-336` DoD 1, frozen into the Plan, asserts that `check-night-run-rollup.sh` "is
reachable only through the reaper, which fires on unattended runs — so the mode this repo actually runs
in has no guard at all." It has a **second call site**: `scripts/qa-check.sh` **leg 2g**
(`qb_checkpoint "leg 2g: recorded-run rollup"`), present since `e864992`, 2026-08-25, and **not** behind
`QA_FULL` — so it runs on every attended gate run this repository makes. A builder handed DoD 1 as
written would go looking for a run-mode gate that the attended path does not have.

**Where the premise came from, and why it is not a mistake to be embarrassed about.** L-192 is dated
2026-09-09 and was observed on a **workdoo** `sprint-bulk` run. workdoo consumes lean-flow as a plugin
and has no `scripts/qa-check.sh`, so the learning is *true there and false here*. This is L-091's shape
arriving through a learning rather than a debt row: the row's Summary is the filer's hypothesis, and it
was re-derived before a DoD was built on it — which is the rule working, not failing.

**Impact — the hole is real, and it is one mechanism over.** Leg 2g builds its input from live Plans
that **already have a log**:

```
for nr_sp in $(ls docs/sprint/SPRINT-*.md); do
  nr_lg="docs/sprint/logs/$(basename "$nr_sp")"
  [ -f "$nr_lg" ] && nr_files="$nr_files $nr_lg"
done
if [ -z "$nr_files" ]; then note "night-run rollup: skip -- no Execution Log alongside an active sprint"
```

An **absent** log is a `note … skip`, not a FAIL. That is precisely the failing case: a run that dies
before writing anything writes no log, so the one state the guard exists to catch is the one it skips.
Archived logs are skipped by path besides. Same silent-false-negative class the task was filed against,
different mechanism.

**Re-confirm G2 — owner-ruled 2026-09-11.** DoD 1 is re-aimed at the skip. The three other DoD, the
motivating-population clause, the retained must-FAIL, the selection-varying fixture, the seeded-break
proof and the outside review all stand unchanged.

### 2026-09-11 | progress | G2 rulings on A1 and A3

**A1 — grandfather, by scoping the guard to live sprints.** Owner-ruled per ADR-021. The check fires at
**close**, while the sprint is still in `docs/sprint/` — the only moment a rollup can still be written.
The 36 archived sprints carrying open DoD fall out of scope *by construction* rather than by a
maintained list, and no history is reconstructed. **Caveat recorded rather than discovered later:** this
leans on the `*/archive/*` exclusion that `TASK-342` documents as a case-sensitive string glob, so the
ruling inherits that defect until 342 lands.

**A3 — EPIC-015 ships a local run outcome now; EPIC-008 keeps the portable protocol.** EPIC-008 is
`status: proposed` with no member sprints, and its object set (`WorkItem` · `RunEnvelope` · `RunEvent` ·
`Evidence` …) is explicitly a *portable* contract that refuses to assume a repository at all. T3 needs a
local report written into a sprint Execution Log, and V3 §11 says build only what hardening needs.
**Binding condition: T3 does not mint the name `RunSummary`** — it names the thing for the Part 4 rollup
it types, and records that EPIC-008 may subsume or map it. Deferring instead would have parked § Closed-when 6
on a judgement call dressed as a dependency (L-094).

### 2026-09-11 | progress | G2 corrections to the Plan's declarations

- **T3 `Layers:` corrected.** It named `templates/sprint-log.md.template`; there is no root `templates/`
  in this repository — the file is `skills/lean-doc-generator/templates/sprint-log.md.template`. A
  `Layers:` is a live declaration corrected per task, not a frozen prediction to defend (L-100).
- **D1 extended to T5.** The ownership map ordered `scripts/night-run.sh` as T1 → T2 → T3, but T5's own
  `Layers:` claims that file conditionally ("only if the exercise finds a defect"). An unowned
  conditional write is still a shared-file write, so T5 is appended as the last owner.
- **Reachability screen, recorded per criterion** (EXISTS · RUNS · REACHES · PROVES):
  T1 DoD 1's `check-night-run-rollup.sh` is EXISTS ✓ RUNS ✓ REACHES ✓ but **PROVES ✗** — running it
  shows the checker ran, never that it is ungated; the proof of that is DoD 4's must-FAIL plus its
  sibling control, and DoD 1 is marked a judgment tick against the named check rather than a mechanical
  one. T4 DoD 4 is ✓ on all four — the run's own committed log is exactly the method's input.
  `check-verify-reaches.sh` returned `PASS … 0 claimed target(s) confirmed reachable`: neither clause
  names a *target path*, so the pre-screen had nothing to cross-check. A PASS that says nothing is not
  evidence, and the four questions were answered by hand (L-136).

### 2026-09-11 | progress | G1+G2 signed at `4116b2b`; Theme and § Scope In 1 corrected with them

`gates_signed: G1,G2 @ 4116b2b` recorded in the sprint frontmatter — the signature covers the Plan **as
it will be executed** (T1 DoD 1 re-aimed, A1/A3 ruled, T3's `Layers:` corrected, D1 extended to T5), not
as promoted. `approval_envelope:` stays **absent, which reads as NOT approved**: the gates say the Plan
is sound, the envelope says a run may proceed unattended inside stated bounds, and they are different
grants. T1–T3 are `J1` and need none; **T4 blocks at pre-flight until all ten dimensions are recorded**,
which is the owner-action on the Plan's checklist.

**Two lines of frozen prose corrected under the same scope-change.** The Theme and § Scope In item 1 both
repeated the falsified premise — *"today's checker is reachable only through the reaper, so the mode this
repository actually runs in has no guard at all"*. The `scope-change` entry above ruled that false for
this repository, and DoD 1 was re-aimed; leaving the Theme and Scope saying it would have left the sprint
file asserting something its own Log disproves, which is the report-and-artifact-disagree trap in the
one document a reader opens first. Corrected rather than annotated: a standing claim that is false is
worse than one that is absent.

### 2026-09-11 | consequence | T1 · behaviour: material · governance: high

T1 changes a gate leg's verdict semantics (a skip becomes a FAIL) and edits `orchestrator/SKILL.md`'s
step 4 — a workflow contract. Both arms are material, so the skip table routes this to a scoped reviewer
at minimum, and ADR-029 Tier G adds the worktree-isolated outside pass on top. Recorded at the moment
the table was consulted, not after the depth was chosen (TD-092).

### 2026-09-11 | surprise | The promote gate run is INCONCLUSIVE, and the cause is this session's own orchestration

`QA_FULL=1 bun scripts/qa-verdict.ts sh scripts/qa-check.sh` ran ~40 minutes and ended without printing
`QA-CHECK: N pass, M fail`. What it printed instead:

```
FAIL  qa-check-budget-exceeded: 0s elapsed exceeds the 520s default-profile budget, reached at
      eval harness 'run-qa-budget-position-fixtures.sh'...
scripts/qa-check.sh: line 1040: syntax error near unexpected token `;;'
qa-verdict: no QA-CHECK line found in output -- the run ended before printing its own verdict
      (TD-143). A verdict-less run is reported as a failure, never inferred as 0 fail.
```

**This is not TD-143's memory kill, and `qa-check.sh` is not broken.** Both the committed HEAD version
and the current working tree parse clean (`sh -n`, rc=0 on each). The sequence was: the gate was
launched first and held `scripts/qa-check.sh` open, executing it incrementally; T1's subagent was then
dispatched and rewrote that same file at **18:27:43**, inserting 18 lines at 378–400 (the leg 2g region)
— and the running shell, holding a byte offset into the pre-edit file, resumed past the shift and landed
mid-construct. An orphaned `;;` at line 1040 is exactly that signature, and the file it was reading no
longer existed as a coherent script.

**The gap this exposes, and it is a real one.** The G2 shared-file ownership map orders writers
*task-against-task* — D1 gives `scripts/night-run.sh` to T1 → T2 → T3 → T5. It has no concept of a
**long-running process that is READING a file no task has declared it reads**. `scripts/qa-check.sh` was
not in any task's `Layers:` at promote (it was added to T1's scope at G2), and the gate is not a task at
all, so nothing in the preflight could have seen the collision. The coordinator created it by launching
a 40-minute reader and then dispatching a writer to the same path.

**Consequences, stated rather than smoothed:**
- The promote-gate verdict for SPRINT-098 **does not exist**. It must be re-run clean after T1 lands,
  against a quiet tree. Reporting the 36 green harnesses as a pass would be reading a partial run as a
  verdict, which is the precise failure `qa-verdict.ts` exists to prevent (L-120).
- The `0s elapsed exceeds the 520s default-profile budget` line is **not filed as a defect**, despite
  looking like one twice over (nonsense arithmetic; "default-profile" under `QA_FULL=1`). Its variables
  came from the same corrupted read, so it is evidence about the corruption, not about the budget guard.
  Re-examine it on the clean run — if it survives, *then* it is a finding.
- `qa-verdict.ts` (SPRINT-097 T4) **did its job on live input**, refusing to infer `0 fail` from a
  verdict-less run — its first exercise on a real run rather than a fixture, and it was correct.
  **Open question for the clean re-run:** the wrapper's own exit code is still unknown here, because
  the invocation piped it into `tail` and therefore read *tail's* status (L-120, committed by the
  coordinator in the very message that had just cited the rule). A guard that reports a failure but
  exits 0 would report without gating. Verify unpiped before trusting or accusing it.

### 2026-09-11 | surprise | A2's own figure was wrong, by the exact error A2 was written to catch

T1's builder returned a **disagreeing second number** and it is correct. The coordinator's A2 derivation
is corrected here by a new entry, never by editing the frozen one.

| Selection rule | open | closed | sum |
|---|---|---|---|
| any `- [ ] ` anywhere in the file (**what A2 used**) | 37 | 60 | 97 |
| `- [ ] ` **inside the `## Plan` section** (what "DoD" means) | **5** | 92 | 97 |

The 32-sprint gap is almost entirely `## Owner-action checklist` items — "bump the version at close" and
similar — which are not Plan DoD. This repository's own vocabulary already separates them: this sprint's
promote entry says *"27 DoD **+ 1 owner-action**"*. **Corrected motivating population: of the 5 archived
sprints with genuinely open Plan DoD, 4 carry no rollup** (`SPRINT-038` · `SPRINT-060` · `SPRINT-086` ·
`SPRINT-095`; `SPRINT-088` has one). Not 36 of 97.

**What is worth recording is the shape of the mistake, because it is this sprint's own theme.** A2 was
written *specifically* to stop a stale population figure being carried into execution, and it repeated
the error one level down. Two named rules were live on screen and neither fired:

- **L-108 — matched by shape, not substring.** A2 anchored the `run-complete` half correctly
  (`^### <date> | run-complete |`) and then selected sprints with a bare whole-file `grep -lE '^- \[ \] '`.
  Half the query was structural and half was positional-by-accident, in one derivation.
- **L-186 — fixtures discriminate the verdict, nothing discriminates the SET.** A2's cross-check was its
  own inverse (`37 + 60 = 97`), which is a *verdict* check: both halves shared the same wrong selection
  rule, so they agreed perfectly and agreed on the wrong population. An inverse can only ever confirm
  that the rows were partitioned; it can say nothing about whether the right rows entered the partition.
  That is precisely L-186's "the set is the one property with no reader" — and the coordinator cited
  L-186 in T1's own dispatch brief while its own number was failing it.

**No consequence for T1's build**, which is why it was caught only by an independent reader: archived
sprints leave scope through the non-recursive glob whichever count is right, so every fixture stayed
green and every assertion held. The figure was decorative to the code and load-bearing only to the
record — the shape L-184 names, one rung over.

**Ruling: A1 stands unchanged.** Grandfathering is still correct, and is in fact *cheaper* than it
looked — the guard would strand 4 sprints, not 36.

### 2026-09-11 | progress | T1 DoD 8 — outside review returned two findings, both verified, both actioned

Worktree-isolated reviewer, dispatched on the committed `804e92a` (adversarial verification *writes*,
so it cannot share this tree — L-168). Not CLEAR. Both findings independently reproduced by the
coordinator before being acted on; a reviewer's claim is evidence, not a verdict.

**Finding 2 (fixed here) — the harness's own drift guard could not fire.** `run-night-run-rollup-fixtures.sh`
extracted leg 2g's body between `qb_checkpoint` markers and then asserted `[ -s "$leg2g_wrapper" ]`.
The wrapper is `HARNESS_HEAD` + body + `HARNESS_TAIL`, and both heredocs are written unconditionally —
so `-s` can never be false however completely the extraction failed. The named diagnostic ("*the leg's
shape or its `qb_checkpoint` marker text changed*") was structurally unreachable. **L-166's shape inside
the retained proof itself**: a guard keyed to a condition it cannot observe.

Proven by seeding exactly the drift it names (`leg 2g` → `Leg 2g` in the marker): landed (2 content
lines), parsed, targeted (0 line delta) — all three fixtures went red **and the named diagnostic never
appeared**, so a maintainer would have seen three generic "expected X, got exit 0" lines and no cause.
Fixed by capturing the extracted body to its own file and asserting emptiness on **that**, before
concatenation. Re-seeded after the fix: the named diagnostic now fires. Restored to `57866ab3` =
`git rev-parse HEAD:scripts/qa-check.sh`. Convention throughout this entry: `git hash-object` on the
working tree, cross-checked against the HEAD blob — one convention, no `sha256sum` pipe mixed in (L-169).

**Finding 1 (filed as `TD-151`, not fixed here) — the shared `## Plan` derivation is a prefix match
that also reads fenced code.** `/^## Plan/` opens on `## Planning notes`, and the formula does not
track fences, so an illustrative `- [ ]` inside a ``` block counts as an open DoD. Both reproduced:
`nr_open=1` where 0 is correct, twice. The formula is shared verbatim with
`check-layers-observed.sh:399` and `:580` — T1 reused it deliberately rather than inventing a second
derivation, which was the right call and is also why the fix does not belong inside T1: repairing one
of three call sites would leave two behind and create a fourth variant.

**The escalation is the part worth recording.** The direction of failure is a false *positive*, which
Tier G ranks below a silent false negative — but T1 changed its blast radius, from driving `at_close`
(an advisory toggle) to gating a hard FAIL. A gate that cries wolf gets switched off, which converts a
false positive into a false negative by a slower route. Routed to `TD-151` with `TASK-339`/`TASK-342`,
which already cluster on this family.

**Reviewer's DoD assessment, and where the coordinator differs.** It called DoD 2 *partially* met: the
design-time population sizing was cross-checked (and caught its own error), but the shipped runtime
selection logic was never cross-checked against a second derivation. That is a fair reading and it is
now exactly what `TD-151` records — the shipped formula does have a selection defect, found by a reader
rather than by the sizing exercise. DoD 2 is ticked on the derivation it asks for, with the runtime-logic
gap carried as debt rather than folded silently into a tick.

### 2026-09-11 | surprise | Ticking T1's DoD flipped THREE boxes where eight were intended — TASK-326's exact defect, live

Ticking T1's 8 DoD with an `awk` pass left the file at **10** ticked. Two extra: T2's and T3's
`**Outside reviewer, dispatched worktree-isolated** (L-165 · L-168).` lines, which are **byte-identical**
to T1's, so the pattern matched all three siblings.

**This is `TASK-326`'s motivating case reproduced, by the coordinator, in the sprint whose own Backlog
carries that task.** SPRINT-094's `6a6aeac` claimed "5 of 6 DoD" and flipped three boxes sharing an
identical bold lead; `TASK-326` was filed to catch exactly that and sits in P1 today, deferred at this
promote as "the cheaper standalone guard". The recurrence is the argument for it, and it is now a second
recorded sighting rather than a hypothetical.

**Every downstream signal stayed clean.** The file parsed, the five `### Tn` headings were intact, the
line count moved only by the annotations, and no grep tripped. The only thing that disagreed was the
**count** — 10 against an intended 8 — which is the single signal `TASK-326` proposes to automate. It was
caught because the tick count was checked against the number of DoD the task actually has, not because
anything went red.

**Repair, and a second mistake inside it worth recording.** The first revert attempt discriminated T1's
line from its siblings by grepping for the evidence text — but that annotation had been appended to all
three lines by the same bad pass, so the discriminator matched all three and reverted nothing ("keep
line 72 · keep line 90 · keep line 109"). *A discriminator drawn from the damage cannot separate the
damaged from the intact.* The working repair restored lines 90 and 109 from the **pre-edit copy** taken
before the pass, then verified the T2/T3 region byte-identical to it — a positive witness, not an absence
of complaint.

**Also corrected:** DoD 3's frozen text still asserted the wrong "36 of 97". The figure is left in the
criterion and corrected in its tick annotation, rather than rewritten — the Plan is frozen, and silently
editing a criterion to match what was built is the failure this repository names separately from the
scope-change it permits.

Final state: **T1 8 of 8, sprint 8 of 27 task DoD + 1 owner-action open.**

### 2026-09-11 | surprise | T2's ceiling guard reads a line nothing emits — and its own doc claims otherwise

Coordinator verification of T2, before dispatching its outside review. The wiring is real:
`check_revise_ceiling()` is called from `reap()` at line 260, ranked directly under the exit-code arm
and above `stalled`/`parked`/`exhausted`, so a breach forces `HARD_FAILURE` instead of a silent
`PLAN_EXHAUSTED`. The motivating artifact checks out — `SPRINT-067`'s log carries two real
`Tn · retry ·` lines, one per task, each within ceiling, and the checker PASSes it. Run across the
whole archived population: **51 logs examined, 0 failing**, no false positive anywhere.

**But only 2 of those 51 logs carry a retry line at all** (`SPRINT-066`, `SPRINT-067`), and an emitter
search explains why. `reap()` mechanically writes `run ·`, `terminal ·` and `Tn · unattempted ·`. It
does **not** write `Tn · retry ·`. Nothing in `scripts/`, `skills/` or `evals/` writes it. The line
exists only as an instruction in `night-run.md`: *"A revise-loop retry (ADR-022) adds one line per
firing beneath its task's state line."* The writer is the model.

**So the guard cannot distinguish "no retries fired" from "retries fired and never logged."** Both
present as zero `Tn · retry ·` lines in the window, and both return
`PASS revise-loop-ceiling: within ADR-022 § Decision item 2`. A run that fired three retries and logged
none passes the ceiling check — the silent false negative, in a Tier G guard, arriving through the same
door T1 just closed one file over: **absence reads as compliance.** ADR-016 already names this exact
risk in these exact words — *"a bookkeeping step nothing depends on is the first an agent drops"* — and
the dropped bookkeeping here is the guard's only input.

**The sharper half is that the documentation T2 added asserts the opposite.** `night-run.md` now reads
**"The ceiling is not left to the writer's own bookkeeping"** — immediately above the passage
establishing that the writer's bookkeeping is the only source. That sentence is false as written, and
it is the kind of false that survives review because it describes an intention accurately.

This is **L-166** (a guard keyed to a shape the system does not reliably emit) and **L-174** (a
validated field whose emitter has no cases) meeting in one change. Not filed as debt yet and not
repaired unilaterally: it goes to T2's outside review as its primary aim, because the coordinator
found it by asking a population question and an independent reader may well find the design answer.
Recorded now so the finding is not discovered twice.

### 2026-09-11 | consequence | T2 · behaviour: material · governance: high

T2 changes the reaper's terminal-state derivation (a run-protocol contract) and edits two
`references/` files that the unattended charter is written in. Both arms material → scoped reviewer
floor, and ADR-029 Tier G adds the worktree-isolated outside pass. Recorded at consultation (TD-092).

### 2026-09-11 | progress | T2 outside review — emitter gap ruled INHERENT, two new defects fixed

Worktree-isolated reviewer on `2d09fdb`. Not CLEAR.

**Primary aim ruled (b): inherent limitation, not a cheap defect — and the reasoning is the value.**
The reviewer confirmed the coordinator's fact (no mechanical emitter, 2 of 51 logs) and then supplied
what the coordinator had not: *every other* Part 4 state line — `done` · `blocked` · `parked-hitl` ·
`denied-tool` · `stalled` — is equally model-written and equally trusted. `unattempted` is the sole
exception **because it has absence-based ground truth**: an open DoD with no line at all proves a task
was never reached. A retry has none — retried-and-fixed is textually identical to never-needed-a-retry.
So T2 did not dig a new hole; it built inside the trust boundary the whole rollup already occupies.
ADR-016's remedy (move the write into the launcher's wrapper) is unavailable here because a retry fires
**inside one continuous model turn**, with no external process boundary for a wrapper to observe.
Filed as **`TD-152`** with a fix direction that changes the retry-firing *mechanism*, not the checker.

**The false sentence is gone.** Part 4 read *"The ceiling is not left to the writer's own
bookkeeping"* directly above the passage establishing that it is. The reviewer ruled it false
independently rather than inheriting the claim. It now states the limit plainly — a guard whose
documentation overclaims is worse than one whose limits are written down.

**New finding, and it is this repository's own recorded incident recurring one function over.**
`reap()` carries a comment about being bitten when a log *documented* the rollup format and a
whole-file grep read `T5 · unattempted · …` inside that documentation as the run's own output.
`check_revise_ceiling()` inherited the windowing and **not** the hardening: a fenced example quoting
two `T4 · retry ·` lines returned `FAIL revise-loop-ceiling-exceeded: T4 fired 2 retries` for a run in
which no retry fired. Reproduced verbatim by the coordinator, then fixed by stripping fenced regions
before matching (L-108). **Windowing does not help when the documentation lives inside the window.**

**Second new finding: the standalone entry failed OPEN.** `--check-revise-loop <log> abc` printed a
shell error to stderr and then `PASS` at exit 0. For a guard that is the one direction that must never
happen. Now a named FAIL, using the same numeric-safety shape `reap()` already applies to
`rp_parked`/`rp_hard` a few lines below — the pattern was in the same file and unread.

Both fixes carry **retained** fixtures (`fenced-doc-example-does-not-fire`, `non-numeric-base-fails-closed`),
11 green. Discrimination proved per fix under one convention (`git hash-object` vs checkpoint
`3503dd2e`): seed A reddened only the fenced case; **seed B did not land on the first attempt and was
reported as untested rather than scored as a pass**, and the landing retry reddened only its own case.
Both restored to the checkpoint.

**DoD 3 is NOT ticked, pending an owner ruling.** The reviewer assessed it *not reliably met*: "the
escalation path is named and reachable" holds, but "the run does not continue past it" holds **only if
the retry was logged**. That is a criterion execution has qualified rather than satisfied, so it is
surfaced for a ruling instead of being re-read to fit what was built.

### 2026-09-11 | progress | T2 closes 6 of 6 — DoD 3 ticked QUALIFIED by owner ruling

Owner-ruled 2026-09-11. DoD 3's first half ("the escalation path is named and reachable") holds
unconditionally; its second ("the run does not continue past it") holds only for a **logged** retry.
Ticked to the limit of what a checker over model-written records can reach, with the condition stated
in the tick itself and the residue carried by **`TD-152`** — not absorbed into a clean-looking pass,
and not fixed by re-reading the criterion to match what was built.

**T2: 6 of 6. Sprint: 14 of 27 task DoD.**

### 2026-09-11 | progress | T3's approach ruled at G2 — provenance stated per evidence field

Owner-ruled 2026-09-11. T3 emits `DELIVERED`/`PARTIAL`/`FAILED` plus its nine evidence fields, and
**each field records whether it is mechanically derived or model-reported.**

The reason is `TD-152` one level up. That row exists because a guard read a model-written line as
though it were machine output, and the documentation around it asserted a mechanical guarantee the
code could not give. T3 is the artifact where that distinction becomes *visible to the morning reader*
rather than living in a debt row they will not open: `run · N of M DoD ticked` is counted from the
Plan's own checkboxes and is mechanical; `Tn · retry ·` is written by the model and is not; a verdict
that presents both at the same confidence repeats TD-152's overclaim in the one artifact whose whole
job is to say what the run did.

This is also the straightest reading of § Closed-when 6, which asks for the outcome **plus the evidence
behind it** — provenance is part of what makes evidence evidence. The alternative (defer T3 until
TD-152 has a fix) was rejected: that fix changes the retry-firing mechanism, a separate piece of work,
and holding CW 6 behind it would park a judgement call as though it were a dependency (L-094).

### 2026-09-11 | consequence | T3 · behaviour: material · governance: high

T3 changes the rollup's emitted content and extends the gate's rollup checker — a run-protocol
contract on both sides. Material both ways → scoped reviewer floor, Tier G adds the worktree-isolated
pass. Recorded at consultation (TD-092).

### 2026-09-11 | progress | T3 — typed outcome + nine evidence fields, each tagged by provenance

`reap()` emits `outcome · DELIVERED|PARTIAL|FAILED` from `outcome_for_terminal()`, a **fail-closed**
pure function of `terminal` (an unrecognised state maps to `FAILED`, never to `DELIVERED`), beside the
remaining evidence fields. Per the G2 ruling, each line carries its provenance **in the artifact
itself**, not only in documentation, under a one-line legend:

```
run · 2 of 2 DoD ticked  [mechanical]
outcome · DELIVERED · derived from terminal PLAN_EXHAUSTED  [derived]
parks · 0  [model-reported]
```

`mechanical` = counted directly; `model-reported` = written by the run and trusted like any other Part 4
state line (TD-152's own limit); `derived` = a function of the fields above it, never more certain than
what it reads. That last rule is the point: a verdict that presented a counted DoD figure and a
model-written retry count at equal confidence would repeat TD-152's overclaim in the one artifact whose
job is to say what the run did.

**A3 honoured:** `RunSummary` is not minted; the shape is named for the rollup field it types, with
EPIC-008's possible future subsumption recorded at each site.

**Two deliberate scope decisions, stated rather than discovered later.** (1) The new
`outcome-delivered-with-open-dod` rule is **grandfathered**: `outcome ·` is new, so no pre-existing
log — every retained fixture and the real `SPRINT-067/082/089/090` archives — carries one, and
requiring it unconditionally would retroactively FAIL that correct history. Same shape as A1's ruling.
(2) `tasks`/`parks`/`repair-cycles`/`verification`/`warnings` are emitted but carry **no independent
consumer check**, because there is no second source of truth to contradict them without inventing one.
Named as a decision, not left to read as full wiring.

**`Layers:` corrected at execution (L-100):** T3 also edited `scripts/lib/check-night-run-rollup.sh`,
which its promoted declaration did not name — that file is T1's. T1 is committed (`804e92a`) with no
outstanding WIP, so there is no L-042 staging hazard; recorded because the ownership map should say so
rather than the commit being the only evidence.

### 2026-09-11 | surprise | A latent silent false negative in T3's new check — routed, not patched blind

Coordinator population check before dispatching T3's review. The new outcome/DoD rule selects its
evidence with `head -n1` over the window. T3's comment argues that is safe by **emission order**:
`reap()` writes the real lines first, atomically, and the append-only rule means a later illustrative
aside can only land *after* them. That argument is sound for an aside appended after the reaper's
block — and it does not cover a **hand-written `run-complete` entry**, which becomes the last window
and can carry an example *before* its real evidence. Reproduced:

```
### 2026-09-11 | run-complete | a hand-written entry documenting the format
  ```  outcome · DELIVERED …   /   run · 9 of 9 DoD ticked  ```   <- the EXAMPLE
  ```  run · 1 of 5 DoD ticked / outcome · DELIVERED …      ```   <- what the run DID
→ PASS
```

`head -n1` picks `9 of 9`, the real `1 of 5` is never compared, and a mid-Plan stop reporting itself
`DELIVERED` passes — the exact silent false negative this block exists to catch. `head -n1` is a
**selection** rule and it selects the wrong occurrence (L-186 · L-108).

**Zero real logs carry the shape today**, so this is latent, not active.

**A fix was attempted and it was wrong — recorded because the wrong turn is the useful part.** Scoping
the evidence to the *first fenced block* fails for the same reason the original does: in a hand-written
entry, the example **is** the first block. It also reddened T3's retained fixtures. So the discriminator
cannot be **ordering** at all; it has to be something only the reaper emits — and T3's own provenance
tags are the obvious candidate, which is a design question for a second reader rather than a patch to
make now. Reverted to T3's shipped behaviour, with the gap documented at the site, and routed to the
outside review as its primary aim. A guard shipped with a wrong fix is worse than one shipped with a
named gap.

### 2026-09-11 | progress | T3 outside review — the headline feature had no assertions at all

Worktree-isolated reviewer on `36b92e7`. Not CLEAR. **It confirmed the coordinator's revert was
correct** and then found the more serious thing.

**Primary aim ruled INHERENT → `TD-153`.** The reviewer reproduced the `head -n1` bypass independently
and then did what neither the builder nor the coordinator had: it **measured** the candidate fixes
against the retained suite. The decisive number — the required-PASS control
`illustrative-aside-after-real` and the adversarial counterexample are **identical in raw count and
content-shape, 2 and 2**. Only *position* separates them, and a hand-authored entry controls position.
So an "ambiguity ⇒ UNKNOWN" rule would redden the control the suite must keep green; first-fenced-block
anchoring fails for the reason already found; and anchoring on the reaper's literal header text is
*strictly worse*, because it stops firing on anything that omits the text — easier to defeat than the
ordering trick it replaces. The real fix binds evidence to something outside composable text (a
machine-only sidecar plus a cross-file guard), which is its own Tier G surface. Filed as `TD-153`.

**The severe finding: T3's provenance tags — the whole point of the task — had ZERO assertions.**
`grep` for any tag across both harnesses returned **0**. The reviewer seeded
`parks · %s  [model-reported]` → `[mechanical]`, which is **TD-152's exact overclaim direction,
reproduced one level down inside the fix for it**, and both suites stayed **green**. Reproduced by the
coordinator: landed 2 content lines, parsed, 840→840, nothing reddened — a landed, targeted seed that
reddens nothing has tested nothing (L-142 · L-187).

Fixed: **eight per-field tag assertions**, expected values taken from the G2 provenance ruling rather
than copied from the emitted output — an assertion copied from what it checks would ratify a mislabel
instead of catching it. Proven in **both** directions, each naming the drifted field:
`[model-reported]`→`[mechanical]` on `parks` reddens `provenance-tag-parks` alone;
`[mechanical]`→`[model-reported]` on `tasks` reddens `provenance-tag-tasks` alone.

**Third finding: the author's own comment named the wrong failure mode.** `verification ·` used
`sed -E 's/^system-verify · ([^ ]+) ·.*/\1/'`, flagged as "truncates on a spaced token". It does not
truncate — **a sed whose pattern does not match passes the whole line through**, so the field emitted
the entire raw line duplicated. Dormant (every finding name this repo emits is kebab-case) and fixed
anyway, with three retained token-shape fixtures, because "unreachable today" is how a guard becomes
reachable tomorrow — and a comment naming the wrong failure sends the next reader hunting a truncation
that never happens.

**Coordinator seed honesty:** two of this session's seeds **failed to land** (a `perl` regex and a
`sed` back-reference) and are recorded as **untested**, not scored as passes. The landing retries are
what the evidence above rests on. One further caveat stated rather than glossed: the verification seed
approximates the original expression rather than reproducing it byte-exactly, which is why two sibling
cases returned empty instead of their former values — the discrimination is still decisive, and the
`spaced-token` case reproduces the pass-through verbatim.

**T3: 6 of 6, DoD 4 QUALIFIED (limit named, `TD-153`). Sprint: 20 of 27 task DoD.**

### 2026-09-11 | blocker | The gate still has no verdict — two runs killed, and two of my own readings corrected

After T3 landed, the gate was re-run **unpiped** on a clean tree (the first attempt's flaw). It was
killed for memory at 131 lines, 0 FAIL, no `QA-CHECK:` line. A second run on the **default** profile
died identically. SPRINT-098 has produced **no gate verdict at all**, across three attempts and three
distinct causes.

**Correction 1 — "deterministic positional kill" was wrong.** Both runs produced byte-identical output
(apart from my own echo), and I read that as a reproducible stop at one leg. Then
`sh scripts/lib/check-handoff-state.sh .` — the next leg — ran **instantly and clean**. The identical
output is explained without a positional theory: the captured lines cover only through **leg 2b**, and
the profile-sensitive conformance leg never appears at all, so two profiles producing the same prefix
is exactly what should happen. I had a theory before I had the cheap check that refutes it.

**Correction 2 — calling it "TD-143's fourth instance" was premature.** TD-143 describes the *gate*
being killed by the host for memory. What is actually established here is that **the host was under
memory pressure this session created**: 8 agent worktrees totalling **109M**, from my own
worktree-isolated review dispatches, plus the subagents themselves. The gate is the process that got
killed; that does not make the gate the cause. Attributing it to TD-143 would have filed evidence
against the wrong row — the failure the ledger's own header warns about (L-091).

**What IS newly established, and it is about the fix rather than the failure.** SPRINT-097 T4 shipped
`qa-verdict.ts` so a verdict-less run reports as a failure instead of reading as zero failures. On the
first inconclusive run it did exactly that — the child died, the wrapper survived, and it printed
*"no QA-CHECK line found in output."* On both of these runs the wrapper was killed **alongside** the
child and printed nothing at all. **Its guarantee is conditional on outliving what it wraps**, and no
fixture could surface that, because a fixture cannot kill the harness. That belongs on `TD-143`'s row
as a limit on its own remedy, and is recorded here rather than filed unilaterally while the tree is
mid-sprint.

**What is NOT claimed:** that the gate is broken, that the budget guard is wrong, or that leg 2b-bis is
expensive. Three attempts have produced zero verdicts and therefore zero evidence about the repository.
**0 FAIL lines from a partial run is not a pass** — that is TD-143's whole point, and it applies to my
own reading of these runs exactly as it applies to anyone else's.

**Blocked on an owner decision.** The cheapest thing that would plausibly let the gate finish is
removing the 8 worktrees — but that is not mine to take: `agent-a051e70aa1ed4ce12` carries **2 commits
not on `main`** and predates this session (it is the copy `TD-149` cites), and three others hold
uncommitted changes from review dispatches. Deleting them would discard work nobody has looked at.
