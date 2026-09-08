---
sprint: 095
slug: guards-that-misreport
owner: Maintainer
last_updated: 2026-09-07
status: closed
gates_signed: G1,G2 @ 18b9a0b
plan_commit: 2453678
close_commit: 9782860
update_trigger: sprint execute/close events
---

# SPRINT-095 — Guards That Misreport

> **Theme:** SPRINT-094 shipped guards for properties that had **no reader at all**. This sprint is
> the adjacent failure: four guards that *do* read their subject and then **report something the
> artifact contradicts** — a closed sprint's commits attributed to a sibling, a dependency graph
> invented out of prose, a DoD claim nobody reconciles against the ticks, and a truncated run wearing
> the verdict shape of a completed one. A property with no reader cannot go red; a guard that
> misreports goes *green*, which is worse, because the green is evidence.

## Scope

**In:** the archived-sibling attribution fix that unblocks three parked sprint archivals · the
dispatch preflight's `Depends-on:` parser, which ships to consumers inside the plugin · a reconciler
for a commit's claimed DoD delta against the ticks it made · truncation as an outcome distinct from
failure, closing both remaining `severity: high` debt rows.

**Out (deferred):** the SPRINT-092/093/094 **archival itself** — `TASK-298` removes its blocker, the
move stays owner-gated (§11, re-proposed at the next close) · the gate's **speed** under concurrent
load — T4 fixes the report, not the runtime, and the cap-concurrency and raise-the-budget directions
were both rejected on evidence · EPIC-015's run-dependent tasks (`TASK-319`/`296`/`297`), which need
a real unattended run and are the next sprint's shape, not this one's · the three §2 soft-cap
breaches, routed to the next close.

## Plan

### T1 — Keep an archived sprint owning its own commits `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-layers-observed.sh` · `evals/fixtures/layers-observed/` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none
Cites: TD-125 · TASK-298 · TASK-299 (the shipped half) · L-166 · L-058

One list is answering two different questions — *is this sprint still active work?* (archive = yes,
exclude) and *does it own its commits?* (archive = irrelevant, a closed sprint owns its history
forever) — and they share one answer. First, because three sprint archivals are parked behind it.

<!-- STATED CAUSE CORRECTED (SPRINT-096 T2). This paragraph read: "`:397` drops `*/archive/*` when
     building `sibling_sprints`, and `:430` uses that list to skip another sprint's commits". Both
     the mechanism and both line numbers were wrong, and this text is one of the three artifacts that
     propagated the wrong mechanism into T1's three designs. MEASURED: deleting the `*/archive/*`
     filter alone changes nothing — 092 is blamed for 85 commit:path pairs with the line present AND
     deleted. The operative mechanism is upstream: qa-check.sh's layers-observed leg passes a
     NON-recursive `ls docs/sprint/SPRINT-*.md`, so an archived file never enters "$@" for that
     filter to reach — unreachable, not merely ineffective. The line numbers were stale too (`:430`
     here, `:429` in TD-125, for the same statement, so one was wrong before anyone looked — L-130).
     Ruled by ADR-040 and landed at SPRINT-096 T3 (`a333134`); re-derive any figure at the point of
     use rather than citing this note. -->


**Acceptance:** SPRINT-092 and SPRINT-093 can both be moved to `docs/sprint/archive/` with the gate
staying green, and a path declared by no sprint still FAILs by name.

**DoD:**
- [ ] The two questions are separated — archival no longer removes a sprint from the commit-ownership list — *Verify: `sh scripts/lib/check-layers-observed.sh` over a tree with 092/093 archived*
- [ ] Reproduced on the **real 092/093 pair**, not fixtures alone (L-166): archiving 093 **alone**, with 092 left active, must leave 092's blamed `commit:path` count **unchanged** (3 → 3). Measured 2026-09-07 at G2, controlled — both legs invoke the checker with `ls docs/sprint/SPRINT-*.md` exactly as `qa-check.sh:1013` does, so the archive move is the only variable — and it is today **3 → 85**. The four pre-existing TD-107-class FAILs must be unchanged; this task does not fix those. **PASS and FAIL line counts do NOT discriminate this defect** — both were identical (1 PASS / 4 FAIL) across the two legs while 82 files were misattributed, so a green/red criterion proves nothing here. TD-125's "the pass count is the second signal" holds for the whole `qa-check` gate, where twelve checks stopped being invoked, and is **false at the checker level**, which is where this task works — *Verify: the two-leg comparison above; the blamed-pair count is the verdict* — **restated at G2 on owner ruling, `scope-change` logged; the frozen wording was unsatisfiable at freeze (L-088 · L-185)***
- [ ] Retained fixture: an archived sprint's commits do not land on an active sibling — *Verify: `sh evals/run-layers-observed-fixtures.sh`*
- [ ] Sibling control in the same run: a path declared by NO sprint still FAILs with its named finding
- [ ] Seeded-break discrimination proof — seed verified landed, artifact still parses, break targeted not demolition, and a landed seed reddening nothing reported as untested (L-137 · L-142 · L-187), all under ONE stated hash convention (L-169)
- [ ] Worktree-isolated outside reviewer (L-165 · L-168 — Tier G, and the reviewer *writes*, so it must not share this tree)

### T2 — Anchor the dispatch preflight's `Depends-on:` parser to the id list `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `evals/run-dispatch-preflight-fixtures.sh` · `evals/fixtures/dispatch-preflight/`
Depends-on: none
Cites: TD-132 · TD-043 · TASK-328 · L-058 · L-166

The parser greps `T[0-9]+` as a bare substring over the whole line, so it harvests ids out of the
field's own explanatory prose and ignores the literal `none`. The false HALT is the harmless half;
the false `PASS shared-file-owned` issued off a phantom edge is the one that green-lights a wave with
no ownership order. It ships to consumers, and `orchestrator/SKILL.md` § sprint-bulk step 3 tells
every run to execute it.

**Acceptance:** SPRINT-094's own sprint file — where all four tasks declare `Depends-on: none` —
computes clean waves instead of an unresolvable self-edge.

**DoD:**
- [x] Against SPRINT-094's sprint file the snippet yields `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and no `FAIL cycle-detected` — *Verify: run the anchor-extracted snippet against that file; today it yields `FAIL cycle-detected: tasks unresolved -> T2 T3`* — ✓ run at `60fdf1b`, and again at `82eb0cd`
- [x] A literal `none` short-circuits the field, and no id is harvested from it or from any line continuing it — ✓ by position, not by a branch: `none` is a token that is neither an id nor an annotation, so the scan ends on it. The explicit branch design 2 carried was deleted after seeding its removal reddened nothing
- [x] **Both call sites fixed, each with its own fixture** — the field arm and the indented `D)` continuation arm run the same bare grep, and SPRINT-094's prose ran onto continuation lines, so fixing one leaves the other leaking (L-058) — ✓ proven, not asserted: seeding call site 1 reddens only `deps-prose-field`, seeding call site 2 only `deps-prose-continuation`
- [x] Declared ids still parse: `Depends-on: T1 · T2 — but see **D1** (…)` yields exactly `[T1,T2]` — ✓ `deps-ids-with-prose`, asserting RANK so an unparsed T3 (rank 0) is distinguishable from a parsed one
- [x] Retained must-FAIL + sibling control added to the existing 8-case harness — *Verify: `sh evals/run-dispatch-preflight-fixtures.sh`* — ✓ 8 → **25 cases / 27 assertions**, the 3×2 mechanism×call-site matrix complete
- [x] Seeded-break discrimination proof under ONE stated hash convention (L-137 · L-142 · L-169 · L-187) — ✓ `git hash-object` on the working file throughout; 9 seeds, each reddening only its own fixture with a control green; one weak seed DISCARDED for reddening nothing (L-142/L-187), and the guards refused 5 malformed seeds rather than scoring them
- [x] Worktree-isolated outside reviewer (L-165 · L-168) — ✓ **five rounds**, four of which rejected: 6 CRITICALs found, every one by review and none by the seeded proofs that had just run clean. Round 5 clean: no CRITICAL, 250-line corpus re-sweep clean, snippet RUN not merely parsed

### T3 — Reconcile a commit's claimed DoD delta against the ticks it made `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `scripts/lib/check-dod-delta.sh` · `scripts/qa-check.sh` · `evals/fixtures/dod-delta/` · `evals/run-dod-delta-fixtures.sh`
Depends-on: none — but **T3 commits to `scripts/qa-check.sh` before T4** (D1)
Cites: TASK-326 · SPRINT-094 Execution Log · L-009 · L-165

Nothing compares what a commit *claims* it did to what it *did*. `6a6aeac` claimed "5 of 6 DoD" and
flipped three boxes, two belonging to other tasks; every downstream signal stayed clean and it
survived a worktree-isolated review an hour later, because that reviewer read the script it was told
to read.

**Acceptance:** `6a6aeac` is reported by name, and a commit whose claim and ticks agree is not.

**DoD:**
- [ ] A `sprint(NNN)` commit's claimed DoD figure is reconciled against the `[ ] → [x]` transitions that commit made, FAILing by name on disagreement — *Verify: the new checker over this repo's history*
- [ ] The **unattributed-tick** case is covered: a commit flipping a DoD outside the tasks whose `Layers:` it touched. **If the claim proves unparseable, scope narrows to this half and says so** — it is the half carrying the real defect
- [ ] Retained must-FAIL: SPRINT-094's `6a6aeac`. Sibling control: an agreeing commit, green in the same run — *Verify: the fixture harness*
- [ ] The claim's parseability is **re-derived by sampling real `sprint(NNN)` subjects**, not assumed from the task's own line (L-097 · L-130)
- [ ] Seeded-break discrimination proof under ONE stated hash convention
- [ ] Worktree-isolated outside reviewer (L-165 · L-168)

### T4 — Make gate truncation a distinct outcome from gate failure `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` · `scripts/lib/qa-budget-check.sh` · `evals/run-qa-budget-fixtures.sh` · `evals/fixtures/qa-budget/`
Depends-on: T3 — **not for its logic, but for its harness** (D1): T4 must enumerate every harness it
fails to reach, and a harness T3 adds afterwards would be absent from that enumeration
Cites: TD-117 · TD-128 · TASK-329 · TD-084 · TD-091 · L-120 · L-166

`qb_checkpoint` calls `bad`, prints `QA-CHECK: <n> pass, <m> fail` — the same shape the Summary block
prints — and exits 1. Truncation and failure are therefore indistinguishable to any reader, and the
skipped legs are described in prose without one being named. Six harnesses went unnoticed that way,
two of them guards of the gate itself.

**Acceptance:** a budget-tripped run announces truncation, names every harness it did not reach, and
cannot be mistaken for either a pass or a fail.

**DoD:**
- [ ] A budget-tripped run no longer prints the verdict shape a genuinely-failing run prints — *Verify: the seeded-trip fixture's output vs a seeded-FAIL sibling*
- [ ] The truncation verdict names actual elapsed seconds **and enumerates every unreached leg/harness by name** — today the message names none
- [ ] Actual runtime is asserted against the ceiling (TD-128's half). **Out of scope: `check-qa-budget-default.sh` is correct within its declared scope** (configured default < ceiling) — this is a *missing reader*, not a broken checker, and widening that script is the wrong fix
- [ ] The three outcomes are distinguishable off the printed verdict line alone, never a wrapper's status (L-120)
- [ ] Retained must-FAIL + sibling control: a seeded trip reports truncation and names its unrun harnesses while a genuinely-failing run still reports FAIL — *Verify: `sh evals/run-qa-budget-fixtures.sh`*
- [ ] Pointed at the motivating condition, not fixtures alone (L-166): reproduce TD-117's measurement — concurrent load, or a checkpoint seeded to trip at `run-s2-placement-fixtures.sh` — and show the same six named
- [ ] Seeded-break discrimination proof under ONE stated hash convention
- [ ] Worktree-isolated outside reviewer (L-165 · L-168)

## Owner-action checklist

- [ ] Rule on the SPRINT-092/093/094 **archival** once T1 lands — parked at three consecutive closes, lossy, and close never self-approves it (§11). 092 and 093 share `plan_commit: c52496f`, so archive them **together** or measure again.

## Decisions (pre-locked)

- **D1 — `scripts/qa-check.sh` is shared by T3 and T4; T3 owns it first.** Not an arbitrary
  tie-break: T4's enumeration clause must name every harness, so it has to be written *after* T3 has
  added its leg — the reverse order ships T4 blind to a harness added minutes later, which is L-020's
  shape inside one sprint. Stage per hunk, never a plain `git add` over the other task's WIP
  (L-042 · L-037).
- **D2 — T4 fixes the report, not the runtime.** TD-117 offered three directions and ruled none;
  the other two were rejected on evidence at the 2026-09-07 decompose — capping dispatch concurrency
  slows the worktree-isolated review this repo mandates for Tier G and rests on an unmeasured figure,
  and raising the budget cannot work because the 600 s ceiling is external. Speed remains a separate,
  unfiled concern. **Not ADR-grade** — reversible, and it settles one debt row rather than a
  repo-wide trade-off.
- **D3 — the `Depends-on:` parser tolerates prose rather than the field being linted down to bare
  ids.** The field demonstrably carries reasoning; the alternative makes every existing sprint file
  non-conforming to buy a simpler grep.
- **D4 — all four tasks are Tier G (ADR-029), declared here, not inferred.** Each is a guard whose
  false negative is silent by construction, so each carries the retained fixture, the sibling
  control, the seeded-break discrimination proof, and the worktree-isolated outside reviewer.

## Assumptions

- **A1** — TD-125's reproduction still holds at this HEAD (214 pass/0 fail in place vs 202 pass/1
  fail archived). *Confirm: re-run the archive experiment at T1 before designing; both numbers, not
  the FAIL count alone.*
- **A2** — the `Depends-on:` defect has two call sites. *Confirm: already read at the 2026-09-07
  decompose — the field arm and the indented `D)` arm run the same bare `grep -oE 'T[0-9]+'`. Not
  inherited from TD-132, whose Location line names only the field arm.*
- **A3** — `6a6aeac` is a usable must-FAIL fixture, and the `N of M DoD` claim is parseable from
  subjects this repo already writes. *Confirm: sample real `sprint(NNN)` subjects at T3; if not
  reliably parseable, narrow to the unattributed-tick half and say so.*
- **A4** — TD-117's concurrency measurement is reproducible on this host. *Confirm: at T4. If it is
  not, the seeded-checkpoint path is the fallback vehicle and the DoD says which was used.*
- **A5** — no task here belongs to an open epic, so no `epic:` rollup is owed. *Confirm: checked at
  promote — T1–T4 trace to TD-125, TD-132, SPRINT-094's close-Retro and TD-117/TD-128, none of which
  is an EPIC-015 member.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-095-guards-that-misreport.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Closed EARLY at 7 of 27 DoD, by owner decision.** T2 shipped complete; T1 is held unticked on a
structural finding rather than a fourth defect; T3 and T4 were never started. This is a deliberate
stop, not a partial run that ran out of road — the sprint's cost per task turned out to be roughly an
order of magnitude above its `[size: S]`/`[size: M]` estimates, and that is itself the result.

**Retrieval check** — no prior `L-NNN` or ADR was contradicted. Several were *confirmed the hard way*:
`L-165` (independent review finds what the author cannot) fired six more times; `L-186` (fixtures
discriminate branches, not the input set) was reproduced **inside the sprint that cites it**;
`L-142`/`L-187` (a seeded break that reddens nothing has tested nothing) fired five times, catching
four malformed seeds and one weak one. Nothing was retrieved late or missed.

**Cost** — inline coordinator plus 6 dispatched review rounds, ~800k subagent tokens, 2 tasks
attempted. Cost per unit **delivered**: one task (T2). That is the number worth carrying forward —
a Tier G guard with a genuinely adversarial surface is not an `M`.

### Worked

- **The isolated-reviewer bar earned its entire cost and then some.** Eight CRITICALs, every one
  found by an independent pass, **none** by the author's own seeded-break proofs — each of which had
  run clean minutes before. Four review rounds rejected outright. Without them this sprint would have
  shipped a parser that silently drops declared dependencies and a guard that launders undeclared work.
- **Asserting on RANK rather than absence-of-FAIL.** When the defect *is* silence, a missing FAIL
  proves nothing; a wave rank distinguishes "the ids parsed" from "the ids vanished".
- **Pointing each review at the hole I most suspected.** Both times I named the likely remaining gap
  in the brief, the reviewer found it there. Cheap, and it front-loads the expensive rounds.
- **Recording negative results.** The `none` branch that reddened nothing, the weak seed that tested
  nothing, the disproved TD-125 cause — each is now in the log rather than quietly dropped.

### Friction

- **Refining a proxy felt like progress for three whole designs.** Every fix genuinely narrowed the
  hole, which is exactly why nobody stopped to ask whether the question was answerable. → `L-190`.
- **Fixture defects are indistinguishable from code defects at the assertion line.** Four in one
  case, `sh -n` clean each time, one sibling green for the wrong reason throughout. → `L-189`.
- **My own shell/awk mechanics caused five defects**, none caught by a test: an unwired flag; `awk -v`
  expanding `\t`/`\n` and splitting a line; a tab injected into a tab-delimited record; an
  **apostrophe inside a single-quoted awk program** that `sh -n` accepts while awk receives a
  truncated program; and a line-numbered edit landing on the wrong line after earlier edits shifted
  the numbering. The last is now a corollary in `L-189`.
- **The close cannot verify itself.** The opt-in profile exceeds the 600 s command ceiling — TD-128,
  which T4 existed to fix and which went unstarted. Recorded below rather than smoothed.

### Pattern candidate

- **`L-190`** (new) — a proxy for an unverifiable claim cannot be refined into correctness; the tell
  is reviews finding the same *class* of defect at a new depth. Re-scope instead.
- **`L-189`** (new) — a failing assertion never says whether the code or the fixture is wrong;
  reproduce outside the harness before touching the subject.
- **`L-186`** reaches **count 2 and is now promotable** at the next promote.
- **`L-165`** reaches **count 6**.

### Buckets routed (STANDARD §10)

| Bucket | Where |
|---|---|
| Shipped | `CHANGELOG.md` — T2 / TD-132 only |
| Tech debt | **`TD-138`** (column-0 `Layers:` continuation silently dropped) · **`TD-139`** · **`TD-140`** · **`TD-141`** (`high` — the structural one) |
| Follow-ups | **`TASK-331`** (rule the ownership tension, re-scope TASK-298) · **`TASK-332`** (correct TD-125's stated cause) |
| Learnings | **`L-189`** · **`L-190`** new; `L-165` → 6; `L-186` → 2, promotable |

**Not pruned, owner-gated (§11):** only `TASK-328` shipped and is a prune candidate. `TASK-298`,
`TASK-326`, `TASK-329` stay — unstarted or unfinished. Archival of SPRINT-092/093/094/095 stays
parked, and TD-125's blocker is **not** cleared: T1 did not ship.
