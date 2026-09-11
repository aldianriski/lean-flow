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
