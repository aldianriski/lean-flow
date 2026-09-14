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
