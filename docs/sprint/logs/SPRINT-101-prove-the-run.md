---
sprint: 101
slug: prove-the-run
owner: Maintainer
last_updated: 2026-09-14
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-101 — Execution Log

> Append-only companion to [`../SPRINT-101-prove-the-run.md`](../SPRINT-101-prove-the-run.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-14 | progress | G1 signed — full checklist, no fast-path
`origin: close-retro` on TASK-319/188 and `manual`-equivalent on the rest, so the decomposer
fast-path is not earned and the full G1 checklist ran. Goal restated: *done when § Closed-when 1 is
ticked on a real unattended run's own committed log, T3's DoD-delta guard is registered and
discriminating, and neither stale record still asserts something false.* Sizes M/S/S/S — no L to
split. Out-of-scope is named in § Scope. Blast radius derived from each task's `Layers:`.

### 2026-09-14 | progress | A3 confirmed by the coordinator, not deferred to the owner
All five scripts T1/T4 name exist and still verdict: `night-run.sh` (846) ·
`check-night-run-rollup.sh` (297) · `check-approval-envelope.sh` (105) · `qa-check.sh` (1427) ·
`check-layers-observed.sh` (644). `check-approval-envelope.sh` against the real sprint file returns
`NOT APPROVED (no approval_envelope: field)` at exit 0 — the documented unapproved-but-not-failing
state, which is the correct reading of this sprint right now.

### 2026-09-14 | progress | A2 re-derived by sampling, and the sample moved the number
T3's DoD 1 asks for this rather than trusting the Backlog row (L-097 · L-130). First query said 296
of 942 `sprint(` commits carry an `N of M` claim. The cross-check disagreed: that figure counted
body lines, not commits. **Subject-only: 72 of 942.** A2 is confirmed parseable but far rarer than
the row implies, and the *unattributed tick* half applies to every commit while the *claim* half
reaches ~8%.
**The selection finding matters more than the count (L-186).** Subject shapes split
`sprint(NNN):` = 692 · `sprint(NNN) <tok>` = 247, and the motivating case `6a6aeac` is
`sprint(094) T1: … 5 of 6 DoD` — in the **247** bucket. A checker keyed to `^sprint\([0-9]+\):`
would never examine its own motivating commit: L-166's reachability failure arriving at the
population level. Handed to T3 as a starting constraint, not a conclusion.

### 2026-09-14 | scope-change | T1's two mechanical `Verify:` clauses cannot reach their targets
**What broke.** Both clauses pass `.`: `check-approval-envelope.sh .` and
`check-night-run-rollup.sh .`. Both scripts take a *file*; both FAIL on `file not found` / `no
Execution Log found at .` whatever the criterion's truth value. This is L-136 — a criterion that
cannot pass is not proof, it is noise that gets dismissed.
**Impact.** T1 DoD rows 3 and 5 had no valid mechanical method. Owner ruling: log the change, run
the corrected invocations — `check-approval-envelope.sh docs/sprint/SPRINT-101-prove-the-run.md`
and `check-night-run-rollup.sh docs/sprint/logs/SPRINT-101-prove-the-run.md`. § Plan text is left
frozen; the correction lives here.
**Second route, and it corroborated by failing to fire.** `check-verify-reaches.sh` over the Plan
returns `PASS … 0 claimed target(s) confirmed reachable, 2 judgment-method clause(s) left to G2` —
it classified two clauses that name a script as *judgment methods* and passed them to G2. The
pre-screen is structurally blind to a mechanical method invoked with a wrong-typed argument. Noted,
not fixed: out of scope here, and worth a TD row at close rather than a widened T3.

### 2026-09-14 | scope-change | preflight HALT on a directory-prefix overlap, ruled by sequencing
**What broke.** `PREFLIGHT: HALT` —
`shared-file-unowned: docs/sprint/ ~ docs/sprint/archive/SPRINT-094-guards-for-what-nothing-reads.md
in T1 and T4 has no Depends-on edge`. T1 declares the prefix `docs/sprint/`; T4 edits one archived
file inside it. The files are distinct; the *declaration* is not.
**Impact.** Owner ruling: honour the finding by **sequencing T4 ahead of T1**, no edit to the frozen
`Layers:`. Not waved through as nominal — L-058 is precisely a preflight reporting CLEAR over a real
overlap. Base-ref leg passed (`24824cd` == live HEAD); waves computed `T1=0 T2=1 T3=0 T4=0`.

### 2026-09-14 | park | T1 and T2 park at the authority boundary
`approval_envelope:` is absent from frontmatter and absence is never read as approval
(`night-run.md` Part 1a step 4b). T1 is `J2`; T2 `Depends-on: T1` and is `J2`. Neither is reshaped
to dodge the gate — dodging is itself a scope change and itself HITL. **Unblock condition:** the
owner records all ten dimensions in this sprint's frontmatter, after which T1's pre-flight re-runs.
D2 holds — T1 was never gated on T3/T4, and parking it does not gate them on it.

### 2026-09-14 | progress | wave 1 dispatched — T3 ∥ T4, worktree-isolated
With T1 parked, the only preflight finding is moot for this wave: T3 (`scripts/lib/` ·
`scripts/qa-check.sh` · `evals/fixtures/`) and T4 (`TECH-DEBT.md` ·
`docs/sprint/archive/SPRINT-094-…md`) share no file and neither depends on the other. T4 is told
explicitly that `scripts/lib/check-layers-observed.sh` is **read-only** for it — T3 owns writes
under `scripts/lib/`. Execution Log entries are returned in each agent's report and appended here by
the coordinator, never written by the agent (SPRINT-063 produced two copies of one Log).
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:low · governance:low

### 2026-09-14 | progress | T4 merged — two stale records cleared, after one revise
`9b2640f` on main (cherry-picked from the isolated worktree to keep history linear).
**TD-051:** the stale `Line 225` citation is replaced not by a fresh line number but by the stable
predicate name `lf_is_archived_path` — the anchor cannot rot the way the number did, which is a
better read of L-130 than re-deriving a figure that will be wrong again next refactor. Derived at the
point of use (`grep -n is_archived_path` → the subject-sprint check), cross-checked by a
differently-shaped positive query.
**SPRINT-094:** the satisfied parked ruling is ticked. Both sprints confirmed genuinely archived in
`docs/sprint/archive/` before the tick, not taken on the Plan's word.
**One revise was required, and it is the entry worth keeping.** The first pass ticked the box *and
rewrote the bullet*, dropping `Parked by owner ruling`, the `or measure again` shape of the ruling,
and the measured `214 pass / 0 fail in place vs 202 pass / 1 fail archived` figures — irrecoverable,
since both sprints are now archived. The DoD said *ticked or withdrawn*; a tick must not cost the
record its evidence. Restored verbatim; net change to that file is now one character plus one
appended clause. The coordinator then fixed a dangling wrap the revise left in TECH-DEBT.md rather
than spending a second retry on cosmetics.
consequence · T4 · behaviour:low · governance:low

### 2026-09-14 | surprise | T4's tick makes SPRINT-094's own close figure stale
Ticking that box leaves the archived close summary reading *"Closed at 22 of 23 DoD. The single open
box is the owner-action ruling on archiving SPRINT-092/093"* — there is now no open box, so the
sentence is false in the present tense while remaining true as a statement about the close. **Not
fixed, deliberately:** editing an archived close figure is a governance call, not a mechanical
follow-on from T4's scope, and the two readings (historical record vs current-state claim) point
opposite ways. Surfaced for an owner ruling at close. Noted because it is *exactly* the class T3 is
building a guard for — a claimed DoD figure and the actual tick state disagreeing — arriving
unprompted, in the same sprint, from an unrelated task.

### 2026-09-14 | surprise | the gate is red by construction between promote and first log entry
The QA_FULL run launched at G2 reported one FAIL: `night-run rollup: no Execution Log found at
docs/sprint/logs/SPRINT-101-prove-the-run.md`. That was a race against the coordinator creating this
file, and the check passes against it now (`no completed-run entry yet -- nothing to verify`). But
the underlying shape is real: logs are created lazily at the first entry, while an **absent** log is
a named FAIL (SPRINT-098's deliberate change). A freshly promoted sprint is therefore red until
someone writes an entry. Possible false-positive class; out of scope here, proposed as a debt row at
close rather than chased.

### 2026-09-14 | surprise | A1 is false as written, true for the precondition it exists to serve
A1 assumed *"the gate can reach a green verdict on this host within the 600 s ceiling"*, citing
523–560 s from the SPRINT-099 close. Both halves were measured rather than assumed, and they
disagree — which is the whole reason the assumption carried a `Confirm:` clause.

| profile | invocation | budget | measured | verdict line |
|---|---|---|---|---|
| full sweep | `QA_FULL=1 sh scripts/qa-check.sh` | lifted | **1275 s** | `224 pass, 2 fail` |
| default | `sh scripts/qa-check.sh` | 520 s self-enforced | **530 s** | `214 pass, 2 fail` |

**A1 as literally written is FALSE.** A `QA_FULL` run takes 1275 s here — more than twice the 600 s
command ceiling — and the gate reports that against itself:
`qa-runtime-over-ceiling: … A run past the ceiling is killed from outside with no verdict line`
(TD-128's predicted shape, now measured rather than feared).

**A1 as it governs T1 is CONFIRMED.** The conflation is the finding: `night-run.sh:570` invokes
`unset MSYS_NO_PATHCONV; sh "$repo_root/scripts/qa-check.sh"` — **bare**. The pre-flight precondition
is the *default profile*, not the full sweep. `QA_FULL` lifts the budget and adds four opt-in
selftest harnesses by design, so its 1275 s says nothing about the gate T1 must pass. 530 s sits
inside the ceiling and inside SPRINT-099's measured range.

**Neither current FAIL is a defect.** Both are `review-depth-*-absent` for **T3**, which is still in
flight: the coordinator wrote `consequence · T3 · behaviour:material · governance:high` at dispatch,
and no `review · T3 ·` line exists yet because the review it demands has not happened. The gate is
correctly reporting a review it is owed — TD-092's mechanism working, caught on this sprint's own
work rather than on a fixture. Expected to clear when T3's outside review lands.

**Two things worth keeping.** L-067's fix is shipped and visible at the call site — the `unset` is
right there, guarding the env-inheritance trap that once produced a red gate on correct code through
two wrong diagnoses. And a red gate is not automatically fatal: `gate_exceptions:` admits named,
pinned, pre-recorded exceptions with no `--force` anywhere (night-run.md Part 1a step 4c), which is
the sanctioned route if a known-unrelated FAIL is still standing at launch.

### 2026-09-14 | progress | T3 merged at 825bb7a, then reviewed — six findings, all population-level
review · T3 · outside-reviewer-worktree-isolated · behaviour:material · governance:high
Guard: `scripts/lib/check-dod-delta.ts` (340 lines, TS/Bun per the owner ruling) + `dod-delta.test.ts`
+ `run-dod-delta-fixtures.sh` + four retained fixtures, registered in `eval_harnesses_always` and
`qa-check.sh` leg 16. Suite 18/18; harness green bare.

**Coordinator verification before the review, not on the builder's word.** Content assertion holds —
`attributeClaim("sprint(094) T1: … 5 of 6 DoD", null)` → `{kind:"task",sprint:"094",task:"T1"}`, which
is the motivating commit entering through the `sprint(NNN) T<n>:` arm the naive `^sprint\([0-9]+\):`
would have missed. DoD 5 re-proved with an **independent** break — inverting the foreign-tick filter
`!==`→`===` rather than the author's early-return — which reddened `must-fail-6a6aeac` *and*
`sibling-control` while both population fixtures stayed green: a verdict-logic break hitting verdict
cases and not selection cases, which is the correct signature. Pristine
`0addaf1a…d5f1e` restored byte-identical under `git show <ref>:<path> | sha256sum`, tree clean.

**The review found six defects and every one is in the SET, not the branches** — the distinction
L-186 exists for, arriving on its own first application here. Four CONFIRMED (all re-verified by the
coordinator): the `Task:` trailer is dropped unless the subject is `sprint(`/`merge(`-prefixed, so the
most explicit attribution signal available is the one discarded; leg 16 reads **HEAD only** while the
sibling it ports attribution from iterates `plan_commit..HEAD`, and **this sprint disproves the
premise its comment rests on** — four commits sit behind HEAD right now and none would be examined;
letter-suffixed subtasks (`T2a`, four real SPRINT-038 commits, one ticking three DoD boxes) fall
through to `unscoped` under a note that misattributes the skip to DoD 1's narrowing; and **5 of 5**
`checkDodDelta` calls pass `taskTrailer = null`, so rule 1 is never exercised end-to-end and rule 4
(64 real subjects) is untested at any level. Two PLAUSIBLE: line 277's archive preference is a
case-sensitive substring test on a Windows host — the un-normalized shape SPRINT-099 T3 removed from
ten checkers, and the builder's report said "no duplication made", which does not describe that line;
and `newContent` lacks the try/catch its `oldContent` sibling has.

**Not one of these was reachable from inside.** Fixtures are written against the shape the detector
reads and seeded breaks are drawn from branches that exist, so both instruments sat inside the set —
as did the coordinator, who had read the artifact closely enough by then to be nearer author than
reviewer. L-165 held exactly as written: the governing rule was loaded and on screen throughout, and
found none of it; an independent pass found all of it. One bounded retry dispatched.

### 2026-09-14 | progress | T3's six repairs verified; then a seventh found on the live artifact
`fa851a9` on main. All six review findings verified by the coordinator directly, not on the
builder's word: the `Task:` trailer is honoured with the no-trailer control still returning
`unscoped`; `T2a` attributes; trailer coverage went **0/5 → 10/11** and the fixture set 4 → 10 with a
must-fail/sibling pair per newly-covered arm; leg 16 now walks `plan_commit..HEAD` sourced from
frontmatter exactly as its sibling does — **7 commits examined on the live repo where HEAD-only
examined 1**. 40/40 green, `tsc` exit 0.

**Then the guard was pointed at the live repo rather than at fixtures, and a seventh defect appeared
— the same class, and the largest yet.** `sprint(NNN): Tn -- …` (colon *after* the paren) attributes
as `coord` and is never examined; only `sprint(NNN) Tn:` is. Partitioning all **951** `sprint(`
subjects through the checker's own `attributeClaim`:

| kind | count |
|---|---|
| `coord` | 701 — **137 of which explicitly name a task** |
| `task` | 235 |
| `unscoped` | 15 |

The guard reaches ~63% of its task-naming population and silently exempts 137 commits — **including
T4's own commit in this sprint**. Both spellings are live conventions here (225 vs 128), not one
current and one legacy.

**Why this one is worth more than its fix.** It was not found by a fixture, a seeded break, or the
adversarial review — all three had already passed. It was found by running the guard against the
**real corpus it will judge** and partitioning the result, which is L-166 read at the population
level: a fixture proves a branch works, the motivating artifact proves the branch is *reachable*, and
only the corpus proves it is reachable for every artifact of the same kind (L-186). The cheap
instrument was a table nobody had built, not a cleverer test.

**And the recurrence is the finding.** Four rounds have each turned up another subject shape. The
defect is not any single regex but that the examined set is derived by **enumerating shapes**, so
every unlisted shape is a silent exemption rather than a loud one. Owner ruled one more targeted
retry (the bounded retry was already spent, so this was surfaced rather than taken); the builder was
asked to report — not build — any cheap assertion that would make an unmatched subject shape **fail
loudly** instead of exempting itself.
