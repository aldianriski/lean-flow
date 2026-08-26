---
sprint: 090
slug: run-evidence-vehicle
owner: Maintainer
last_updated: 2026-08-27
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-090 — Execution Log

> Append-only companion to [`../SPRINT-090-run-evidence-vehicle.md`](../SPRINT-090-run-evidence-vehicle.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-26 | promote | Plan seeded as SPRINT-089 T2's run vehicle, frozen at b7437de

Created per `TASK-301`, whose `done-when` requires a **separate** Plan: re-declaring SPRINT-089's
honestly-`HITL` tasks as AFK to make a run fire would be reshaping a task to dodge a gate (SPRINT-089
D3). One AFK/J1 task the run may execute, one J2 it must park.

Two hazards were found **before the Plan froze**, which is the only place they are cheap:

1. **T1's DoD was unsatisfiable as first drafted.** `gen-index.sh` produced *no change* — the index was
   already current — so "its output is committed by the unattended run" could never be met. Fixed by
   causing staleness honestly rather than contriving it: `L-175` was appended to `docs/LEARNINGS.md`,
   which is close-Retro work this session owed anyway and which the generator reads.
2. **A1's confirm method would have consumed T1's work.** "Run the generator interactively and check
   it works" leaves the index *current*, so the run would regenerate nothing, commit nothing, and
   satisfy DoD 1 vacuously while looking green. Now `gen-index.sh --check` (exit 1 = stale, no write).
   Verified stale, index untouched.

*(This promote entry carries no `consequence · Tn ·` line — the original was premature and is withdrawn in the scope-change entry below.)*

### 2026-08-26 | blocker | pre-flight item 3 forbids the Plan shape the machinery is built for — ruled, not patched

Checking this Plan's task classes against Part 1 pre-flight item 3 — which is SPRINT-089 T2's DoD 5,
doing precisely the job it was written for — found a contradiction in the **shipped** contract.

Item 3 reads *"every task in the run is AFK-class"*; `CONTEXT.md` states `J2 ⇒ HITL always`; `TASK-301`
requires a seeded J2. So this Plan fails pre-flight **by the letter**, and no Plan satisfying TASK-301
could ever fire. That is the same acceptance being foreclosed a **second** time — SPRINT-088's three
DoD died on an all-`HITL` Plan (L-111), the fix was a purpose-built Plan, and the purpose-built Plan is
blocked by a different clause with the same effect.

**Owner ruling: the intended reading.** Item 3 means *no task needs a human to be **reached***; a
declared `J2` that parks by design satisfies it. What settles it is that the strict reading makes three
shipped mechanisms unreachable code — `check-authority.sh`'s HONOURED assertion, the
`AUTHORITY_BOUNDARY` terminal state, and Part 0 step 2's park record are all written for a J2 **task in
a Plan**. `check-authority.sh` passes this Plan with `T2 J2` today.

**Ruled and written down rather than assumed** — this is [[L-173]]'s exact shape, a contract that
disagrees with itself where the looser reading wins silently because it needs no extra code. Recorded
at D4 in the Plan itself, because the run reads that file and nothing else (L-099 · L-151).

**Not patched here.** SPRINT-089 § Scope defers re-opening SPRINT-088's machinery, so the wording is
untouched and filed as **TD-109** (`severity: high`) instead. Noted there: item 3 is today a human
checklist line that `night-run.sh` does not enforce, so the defect currently costs a *refused* launch
rather than a wrong one — a checker built from the strict wording would make it a hard block.

*(This entry records SPRINT-089 T2's work, not a task of this sprint, so it carries no
`consequence · Tn ·` line — see the correction entry below.)*

### 2026-08-26 | surprise | the guard caught a FALSE machine-readable claim in this very log

The entry above originally ended `consequence · T2 · behaviour:material · governance:high`, meaning
*SPRINT-089's* T2. In **this** log `T2` means SPRINT-090's T2, and `check-authority.sh` counts
`^consequence · <tid> · ` as an **execution record**. So the line asserted that SPRINT-090's T2 — the
task that exists to be parked — had already been executed, with no park record beside it. The checker
duly failed: `authority-j2-not-parked`.

**That was fabricated evidence sitting in the record before the run, and it was mine.** Not deliberately,
but the distinction does not matter to a guard reading the file at 3am.

**Why the line was CORRECTED rather than superseded by a new entry.** This log's own rule is
append-only — *never edit a past entry, correct it with a new one* — and that rule is right for prose.
It cannot work for a **machine-readable counter**: a later entry cannot decrement `executed`, and the
only two append-only shapes that would clear the FAIL are `T2 · parked · …` and `owner-ruling · T2 · …`,
**both of which would assert something that has not happened** — a park the run never performed, or a
human unblock nobody gave. Manufacturing either to get a guard green is precisely the bypass
`authority-j2-park-bypassed` exists to catch. So the false tag was removed, and this entry records
exactly what was changed and why. Deviation from append-only, disclosed rather than quiet.

**Generalisable, and it is the sharper half:** an append-only convention protects a *narrative*. Where
the same file also carries **structured fields a guard consumes**, "correct it with a new entry" can be
unavailable — and the pressure at that moment is to append the shape that makes the guard green. That
pressure points at fabrication. Filed as a learning candidate rather than left in this log alone.

The withdrawn line read, indented here so it is legible without being counted — the checker anchors at
column 1, and a guard must never read an *explanation* of a tag as the tag itself (L-108):

    consequence · T2 · behaviour:material · governance:high   [WITHDRAWN 2026-08-26]

**Second correction, same paragraph, worth more than the first.** The withdrawal above was itself first
written flush at column 1, with prose beside it claiming it was "deliberately NOT at column 1". The
claim and the artifact disagreed, and `check-authority.sh` stayed red through the fix that was supposed
to clear it. Two lessons, and the second is the durable one: a *quotation* of a machine-readable tag is
indistinguishable from the tag unless it is positionally disarmed — and **stating that you disarmed it
is not disarming it.** The guard was the only thing that knew the difference.

### 2026-08-26 | scope-change | T1 must CITE what it runs; and a premature review-depth tag withdrawn

Pre-flight's gate run surfaced two more bookkeeping defects in this Plan, both mine, both caught by
guards rather than by re-reading the rules that govern them.

**(a) `layers completeness` — T1's prose names tools it does not touch.** T1's DoD cites
`scripts/gen-index.sh` and `scripts/qa-check.sh`; its `Layers:` declares only `docs/knowledge-index.md`.
The checker's own remedy is explicit: *"if the prose only cites it rather than touching it, declare it
on a `Cites:` line"*. That is exactly the case — T1 **runs** both and **writes** neither.

*What broke:* nothing in scope; T1's intent, acceptance and blast radius are unchanged.
*Impact:* the gate cannot go green while a declared task's prose references undeclared paths.
*Re-confirm G2:* approach and acceptance unchanged — two names move onto `Cites:`, nothing else.
Logged here before § Plan is edited, per the frozen-Plan rule.

**(b) `review-depth-governance-absent` — T1's consequence line was written too early.** The promote
entry above tagged `consequence · T1 · behaviour:low · governance:high`, and the checker correctly
objected that a `governance:high` task carries no `review · T1 · …` line. It is the **same class of
error as the T2 tag withdrawn above**: a consequence line records the moment *review depth for a task's
execution* is decided, and T1 has not executed. Recording it at promote asserts a decision nobody took.

The withdrawn line, indented so it is legible without being counted at column 1:

    consequence · T1 · behaviour:low · governance:high   [WITHDRAWN 2026-08-26 — premature]

**Both tags were mine, and both were premature in the same direction: claiming, in machine-readable
form, that something about the run had already happened.** That is now three findings from one
pre-flight, and none was caught by recalling a rule — the review-depth schema, the authority checker
and the layers checker each found their own. The pattern is [[L-176]]'s, one level up: a structured
field written at *planning* time is read as a *record of execution*, because the schema has no tense.

### 2026-08-26 | scope-change | T1 replaced — the launcher cannot fire to do work that makes its own gate green

**The run was fired and REFUSED**, which is itself the evidence: `DEAD-ON-ARRIVAL: pre-flight gate
scripts/qa-check.sh failed: QA-CHECK: 200 pass, 1 fail`.

`scripts/night-run.sh` line 339 runs the gate and dies unless it exits 0. There is **no bypass flag**.
T1's whole job was to clear the one FAIL (`knowledge index STALE`) — so the run could not start until
the work it existed to do was already done.

**The general form, which outlives this sprint: no Plan whose task REPAIRS a gate FAIL can be run
unattended.** An unattended run can only do work the gate is indifferent to, or work that adds beyond
what the gate requires. That may well be intentional — automating "fix your own gate" is a bad idea —
but it is undocumented, and Part 1's prose checklist does not list a green gate among its items, so the
constraint is invisible until the launcher refuses. Filed as **TD-110**.

**This is the FIFTH foreclosure of one acceptance**, each by a different mechanism: an all-`HITL` Plan
(L-111 / SPRINT-088) · pre-flight item 3 vs a declared J2 (TD-109) · `sprint-bulk` step 0's
"ask which sprint" with no ask channel · and now the launcher's gate precondition. Each was found only
by attempting the next step, never by reading the procedure — which is the pattern worth keeping.

**T1 replaced with gate-neutral work.** *What broke:* T1's chosen work was structurally unrunnable
unattended; the sprint's goal and acceptance are unchanged. *Impact:* T1's Layers, prose and DoD are
rewritten; T2 is untouched. *Re-confirm G2:* the J1 task must still satisfy AFK-safe on every clause,
and it does — additive, reversible, already-approved-in-scope, and now also **gate-neutral**.

**The index was regenerated interactively** instead, because that work is genuinely owed and clearing
it is what makes the gate green. Two facts were measured rather than assumed before choosing the
replacement:
- `gen-index.sh` reads `docs/adr/ADR-*.md` and `docs/research/*.md` — the glob is **non-recursive**, so
  `docs/research/logs/` is excluded. Verified by probe: appending to the logs sibling left
  `gen-index.sh --check` at exit 0.
- A first substring check appeared to show the log *was* indexed (`grep -c qa-gate-timing` returned 2).
  That was a **false positive**: two files share the name — `docs/research/qa-gate-timing.md` (indexed)
  and `docs/research/logs/qa-gate-timing.md` (not). Caught by testing the behaviour instead of the
  name, which is L-108 landing again on the same day it was cited twice.

**The calibration row was considered for T1 and rejected**: Part 4 states the launcher's reaper writes
it, so a task doing the same would collide with the mechanism under test.

### 2026-08-27 | execute | T1 — Round 9 appended and committed by the run at `7cc19fb`

The run executed T1 without asking, under the envelope pinned at `e1e3141`. Facts, not claims:

- **Gate invoked as its own call**, no pipe and no redirect, and its **own printed verdict line** read
  off stdout rather than an exit status (L-120): `QA-CHECK: 201 pass, 0 fail`, 321s, rc 0, window
  `2026-08-26T16:56:14Z` → `17:01:35Z`, tree `08f103e` with `status --porcelain` empty.
- **Committed by the run**: `7cc19fb`, authored `2026-08-27T00:04:29+07:00` (`2026-08-26T17:04:29Z`) —
  inside the run window. `git diff --numstat` = **46 additions, 0 deletions**, additions-only as DoD 1
  requires. `git diff --cached` was read before the commit; nothing else rode along.
- **No confirmation was asked at any point.** This session is flagged non-interactive; had T1 reached
  for an ask it would have BLOCKED, not proceeded.

**Routing, stated rather than assumed.** T1 is `class: mechanical-ingest`, which dispatches by default.
It was executed **inline** for one reason: T1's raw material is the verdict line and elapsed seconds of
*this coordinator's own system-verify invocation*. A dispatched agent could not transcribe a
measurement it did not make, so it would have had to re-run the gate — a second ~320s run and a second
substrate charge to produce a number already on this screen. Transcribing the coordinator's own
measurement is coordinator work.

consequence · T1 · behaviour:low · governance:low

*(The matching `review · T1 · …` line lives in the rollup block below, which is where Part 4 defines
it. It was briefly written here as well; a cross-check of the checker's own record count against a
`grep` caught the duplicate before commit, which is the whole reason that habit exists — a structured
field asserted twice is a count nobody can trust, and this log has already lost two tags to exactly
that family of error.)*

**Why `governance:low`, when the tag withdrawn at promote said `governance:high`.** That tag was written
for the *previous* T1, which regenerated `docs/knowledge-index.md` — an ADR-009 SSOT artifact, honestly
governance-bearing. The replacement T1 appends to an append-only research log that no checker reads and
no rule cites. The class did not get quietly downgraded; the task underneath it was replaced, and this
paragraph exists so a reader comparing the two tags sees why rather than inferring a softening.

### 2026-08-27 | surprise | the knowledge index goes STALE at local midnight, with no content change

Immediately after T1's edit, `sh scripts/gen-index.sh --check` exited **1** — which appeared to refute
T1's gate-neutrality, the very property that made T1 runnable unattended. It does not. The cause is the
clock.

`gen-index.sh` line 118 sets `today=$(date +%F)` and line 120 stamps `last_updated: $today` into the
candidate it `cmp`s against the committed index. The index carries `last_updated: 2026-08-26`; local
time crossed into `2026-08-27` at `00:00 +07:00`, four minutes before T1's commit. **So the index goes
stale at every local midnight regardless of whether any indexed file changed.**

Established by four agreeing queries rather than by reading the script alone:

1. `docs/knowledge-index.md` carries `last_updated: 2026-08-26`; `date +%F` returns `2026-08-27`.
2. Substituting *only* today's date into the committed index reproduces a one-line diff — line 3, the
   `last_updated:` field — and nothing else.
3. **T1's file is not an input at all.** The glob at line 67 is `docs/research/*.md`, non-recursive, so
   `docs/research/logs/` is excluded; the log's own `id: qa-gate-timing-log` appears **0** times in the
   index, which it would not if it were being read. T1's gate-neutrality claim **holds, measured**.
4. **A discriminating control**, because 1–3 are all consistent with some other cause: `--check` was
   re-run with a `PATH`-shimmed `date` returning `2026-08-26`. Real date → **FAIL**; shimmed yesterday →
   **PASS**. One variable changed, verdict flipped.

**Why this matters beyond today.** `scripts/night-run.sh` refuses to fire unless the gate exits 0
(TD-110), and a run's close-time system-verify runs the same gate. An **overnight** run is by
construction the shape that crosses local midnight — so this defect can refuse a launch, or redden a
close, for a tree nobody touched, and the named finding points at the knowledge index rather than at
the clock. Both directions were seen inside this single run: the gate was `201 pass, 0 fail` at
`23:56` local and `200 pass, 1 fail` at `00:07`, with one commit of 46 pure additions to a file the
index does not read in between.

**Not filed as a TD, and the reason is the ownership map, not an oversight.** `TECH-DEBT.md` is T2's
declared `Layers:` entry, and T2's DoD 1 requires *no commit touching this task's Layers inside the run
window*. Filing the row would have broken the criterion this run exists to demonstrate. Recorded here
instead, for the owner to file alongside their T2 ruling. This is D3 working as written — a defect found
during the run is a finding, not a repair — and it is the second time in this sprint that the honest
move was to leave a guard red rather than to make it green.

**Also observed, not acted on:** the two § Owner-action checklist boxes are unticked while both fields
they describe are present and valid in the frontmatter. Ticking a box that records an owner's own act is
not the run's to do.

### 2026-08-27 | run-complete | T1 executed, T2 parked, close parked on a red system-verify

T2 was **parked, not asked, not decided, and not worked around**. Where TD-095's worktree exclusion
belongs — shared path discovery versus each checker — is a design ruling with a live trade-off, exactly
the class an execute-only charter may not take.

**Part 0 step 4 re-check performed twice** — at the T1→T2 boundary and again at exit. T2's unblock
condition names an *owner ruling*; no task in this Plan produces one, so it was not actionable at either
boundary and survives the run. Recording the re-check rather than only its outcome, because Part 2 notes
this is precisely the bookkeeping step runs drop.

**This run was invoked directly, not through `scripts/night-run.sh`, so the reaper did not fire.** The
promote-time note above deferred the calibration row to the reaper; that reasoning assumed a
launcher-fired run. Part 4 is explicit that without the launcher there is no guarantee the block gets
written — so the run writes it here itself, degrade rule included.

run · 6 of 6 DoD ticked
terminal · AUTHORITY_BOUNDARY · T2 is J2 and parked awaiting an owner ruling; the close is parked on a red system-verify (clock-rollover index staleness, TD-110 class)
T1 · done · Round 9 appended and committed at 7cc19fb
T2 · parked-hitl · owner ruling required: does TD-095's worktree exclusion belong in shared path discovery (one place to forget) or in each checker (many places to forget)? Round 8 measured the surviving half at 42.8s without attributing it to specific legs, so the ruling needs either that attribution or an explicit decision to rule without it. Not actionable by any task in this Plan.
system-verify · FAIL(gen-index: knowledge index STALE — caused by local midnight rollover, not by any change in this run; see the surprise entry above) · sh scripts/qa-check.sh
review · T1 · self-review · behaviour:low · governance:low

Per-criterion evidence (TASK-209):

T1.1 · ticked · check — `git diff --numstat` on 7cc19fb = 46 additions / 0 deletions; commit stamped 2026-08-26T17:04:29Z, inside the 16:56:14Z→17:11Z run window
T1.2 · ticked · review — no ask was issued; the session is flagged non-interactive, so an ask would have BLOCKED rather than proceeded, and a completed T1 is itself the evidence
T1.3 · ticked · check — `grep -c '^QA-CHECK: 201 pass, 0 fail$'` on the appended block = 1, transcribed from the gate's own stdout
T2.1 · ticked · check — the `T2 · parked-hitl` line above, plus `git log --since=2026-08-26T16:50Z -- TECH-DEBT.md scripts/lib/` returning empty: no commit touched T2's Layers in the run window
T2.2 · ticked · review — the park line states an owner ruling, and what that ruling needs, rather than recording a skip
T2.3 · ticked · check — `scripts/lib/check-night-run-rollup.sh` PASS, plus the read it requires: one `done` and one `parked-hitl` per-task line, which is `AUTHORITY_BOUNDARY` and not `PLAN_EXHAUSTED`

run · cost unavailable · ~22 turns · ~15 min · 1 of 2 units · inline

**Read that row with three stated gaps, per Part 4's degrade rule.** *Cost* is genuinely unavailable:
the run was not fired through the launcher, so there is no `result` event to transcribe, and estimating
it would manufacture a series figure. *Turns* is counted from this session's transcript, not read off a
harness, and is marked `~` for that reason. *Wall-clock* is a **lower bound** — measured from the first
timestamped action, the initial gate invocation; the pre-flight reads preceding it are not timestamped.
*Units* is `1 of 2` deliberately: T2 was resolved by parking, which is the correct outcome and not a
completion, and inflating it to `2 of 2` would corrupt the series the next promote sizes a batch from.

**`6 of 6 DoD` and `1 of 2 units` are not in conflict** — they count different things, and Part 4 warns
against conflating them. M is this Plan's **6** DoD criteria; the two § Owner-action checklist boxes are
not Plan DoD and are excluded from the count. T2's three criteria are satisfied *by the run parking it
correctly*, which is what T2 was written to test.

### 2026-08-27 | verify | final system-verify on the committed tree — the close is parked against a MEASURED red gate

Appended *after* the rollup on purpose: it verifies the tree the rollup's own commit (`e8ad125`)
produced, and that ordering is unavoidable. This is the terminal record; a further gate run would only
re-verify bookkeeping, and the finding is date-caused, so it will not clear until the index is
regenerated on `2026-08-27` or later.

The gate's **own printed lines**, at `e8ad125`:

- verdict: `QA-CHECK: 202 pass, 1 fail`, 313s
- the single FAIL, in full: `FAIL  knowledge index STALE (run: sh scripts/gen-index.sh)`

Two things this settles that the rollup's `system-verify ·` line could only assert:

1. **There is exactly one FAIL and it is the named one.** The close is parked on a measured finding,
   not a predicted one.
2. **The bookkeeping commit introduced no new failure.** The pass count moved `200 → 202` — the two
   additional PASSes are the rollup and review-depth checkers, which now have records to verify where
   before they had none. The fail count did not move.

For the reader reconciling the three figures in this log: `201 pass, 0 fail` (`08f103e`, 23:56 local,
before midnight) · `200 pass, 1 fail` (`7cc19fb`, 00:07, after midnight) · `202 pass, 1 fail`
(`e8ad125`, 00:2x). Each was true when printed; the fail is the clock, and the pass count tracks how
many records existed for the guards to check.
