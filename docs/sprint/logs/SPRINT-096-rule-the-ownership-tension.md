---
sprint: 096
slug: rule-the-ownership-tension
owner: Maintainer
last_updated: 2026-09-08
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-096 — Execution Log

> Append-only companion to [`../SPRINT-096-rule-the-ownership-tension.md`](../SPRINT-096-rule-the-ownership-tension.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
> The Plan is frozen at promote; a mid-sprint scope shift is logged **here** before § Plan is edited.

---

### 2026-09-08 | progress | T1 G1 + G2 signed — full checklist, no fast-path

**Mode is `mvp` on T1 alone**, not `sprint-bulk`: the owner asked to start T1, and T1 is
`class: decision · HITL · J2 · risk high`, which the mode table puts above `quick`.

**G1 ran the full checklist.** `TASK-331` is `origin: close-retro` — filed from a Retro, never through
`/task-decomposer`'s intake grill, so there is no prior scope agreement for the fast-path to
re-confirm. The `origin:` field is what says so; it was read from the entry, not inferred from
`tracker:` or from how well the entry reads.

**A3 confirmed against the artifact, and it is sharper than `TASK-331` filed it.** The claim was that
the active-sibling skip trusts the cited sprint number with no test. Verified at `2335eab~1`
(`sibling_sprints` built at :393-401, consumed at :430) and in the current tree
(`check-layers-observed.sh:519`). The sharper fact: the current code does not merely *have* the
asymmetry, it **asserts it as deliberate** in the comment directly above the skip —
*"Two ownership tests, deliberately asymmetric (TD-125). An ACTIVE sibling is skipped on its NUMBER
alone … That is the pre-existing behaviour and is unchanged."* The asymmetry is stated in code and
was never ruled: nothing says why one arm gets declaration + window and the other gets a bare string
match. That is the tension TD-141 records, sitting in the tree with a comment claiming it is
intentional.

**A fact the Backlog entry does not carry, and it changed the fork.** SPRINT-095 T1's third design is
**on `main`, unticked** — `2335eab` · `f1fdf02` · `e4547b3`, **+94 lines, 0 removed** against the
checker, at **0 of 6 DoD**. So T1 is not ruling on a clean slate; it is ruling on a design an
independent review broke that is currently running in this repository. Derived rather than recalled:
`git merge-base --is-ancestor 2335eab HEAD` and `git diff --numstat 2453678..HEAD` on that one path.

**Two options outside `TASK-331`'s three were costed, as its DoD requires.**
*Make archival not change the checker's input set* — glob `archive/` into `qa-check.sh`'s
layers-observed leg. Checker subjects go **3 → 96** (3 live sprint files, 93 archived), a 32×
increase on a gate that already cannot finish: TD-090, TD-117, and this session's own attempt, which
was killed for host memory before emitting a single check. Rejected on cost, and the cost is
measured, not estimated.
*Change the signal* — a `Sprint: NNN` git trailer written at commit time and checked against the
Plan. The only option that **closes** the channel rather than narrowing it, and the only one whose
ownership claim is written by tooling rather than typed by a human. Rejected as out of size:
**0 of the last 60 commits carry any trailer**, so it is new protocol on every future commit, it
cannot retro-fit the 91 archived sprints, and it would re-scope T3 substantially.

consequence · T1 · behaviour:low · governance:high

---

### 2026-09-08 | scope-change | T1 gains `docs/adr/` + `docs/DECISIONS.md`; the ruling becomes ADR-040

**Logged before § Plan is edited**, per ADR-014 and the frozen-Plan rule.

**What broke:** T1's frozen `Layers:` is `TECH-DEBT.md · TODO.md`, on the assumption that a ruling is
recorded in the debt row that raised it. It is not sufficient here. The decision clears STANDARD §4's
three-part bar on all three counts — **hard to reverse** (it is a deliberate decision to leave a gap
open, and re-closing it later means re-opening the same three-design loop), **surprising** (*the
attribution guard knowingly accepts a laundering channel* is not what a reader expects of a guard,
and the next reader to find the asymmetry will re-litigate it exactly as three previous attempts
did), and a **real trade-off with a named loser** (false positives versus laundering; you cannot have
neither).

**Impact:** T1's `Layers:` becomes `TECH-DEBT.md · TODO.md · docs/adr/ · docs/DECISIONS.md`. No other
task's Layers change; T3 already owns the checker, and D2's serialisation of `TECH-DEBT.md` and
`TODO.md` between T1 and T2 is unaffected. Next id **derived, not incremented from memory** — the
maximum on file is `ADR-039`, so this is **ADR-040** (L-143).

**Re-confirm G2:** signed by the owner in the same round as the ruling, with the scope-change named
in the question rather than folded into an approval of something else.

consequence · T1 · behaviour:low · governance:high

---

### 2026-09-08 | progress | the ruling: accept the channel symmetrically, revert the window test

**Owner ruling (J2 — human-reserved, and taken by the owner, not by the coordinator).** A commit
citing another sprint's number belongs to that sprint, **archived or active, with no further test**,
and the repository accepts the laundering channel that follows rather than paying for a proxy that
cannot close it. SPRINT-095 T1's +94 unticked lines are reverted, because they hold **one** arm to a
bar the other arm does not meet — which is TD-141's finding, not a new objection.

**One consequence was surfaced and confirmed rather than assumed.** `sibling_sprints` is built from
`"$@"` and skips `*/archive/*`, and `qa-check.sh` passes only the live sprint files, so a *literal*
revert of all 94 lines would leave archived sprints out of the trusted set entirely — their commits
would be reported against an active sibling, TD-125's original defect would return, and the two arms
would end up asymmetric in the **opposite** direction. Symmetric acceptance requires archived numbers
to be *in* the set. Confirmed reading for T3: **revert the declaration + window machinery and the
temp-file map, but discover archived sprint numbers from their filenames** (no `git`, no `fmv`, no
window), so both arms skip on the number alone. That is design 1 — 93 numbers exempt anything —
adopted **deliberately** this time, which is precisely what the ruling accepts.

**Verification honesty, recorded at G2 rather than at the tick.** T1's frozen DoD names one mechanical
`Verify:` — *the ruling names `sibling_sprints`' active arm as well as the archive arm.* Against the
four questions: EXISTS ✓ · RUNS ✓ · REACHES ✓ · **PROVES ✗** — naming both arms is not the same as
ruling on both, so it is recorded as a **mechanical pre-screen over a judgment tick**. The remaining
five DoD are judgment ticks and say so. No checker was invented to make a criterion look mechanical
(L-136's failure is the unreachable criterion that reads exactly like a satisfied one).

**`gates_signed:` is NOT written to the sprint frontmatter.** That field records the **batch** G1/G2
pass over the whole Plan; only T1 has been gated. Writing it would tell an unattended run that T2 and
T3 are approved when they are not, and its absence is the only thing that says otherwise (L-099).

consequence · T1 · behaviour:low · governance:high

---

### 2026-09-08 | promote | the SPRINT-096 governance checklist, recorded where a reader parses it

Recorded here because it was emitted to the launching session's terminal and **nowhere else** — which
is L-151 exactly: a decision recorded outside the artifact its reader parses is not a decision.
`S10.PROMOTEREVIEW` reads the plan-lock commit body *or* this log, found neither carrying the three
lines, and reported `promote-checklist-absent`. The gate was right.

**☑ L-promotion (count ≥ 2, `promoted: no`) — 1 finding, resolved.** `L-186` (fixtures discriminate a
guard's BRANCHES; nothing discriminates the SET of artifacts those branches run over), `count: 2`.
Corpus: 169 entries · 126 active · 42 promoted · 1 superseded, reconciled to 169; exactly 7 rows carry
`count ≥ 2` and this was the only one unpromoted. Promoted → `.claude/CLAUDE.md` § Anti-Patterns
clause **(iv)** of the Tier-G bar, beside L-166 by §10's placement test. 103 entries then collapsed to
their §11 pointers (1226 → 916 lines); `S11.LEARNINGS` PASSes on the result.

**☑ TD-aging (≥ 3 sprints unaddressed) — 61 of 74 open rows.** Cross-checked: 74 open − 9 filed at
Sprint-094 − 4 at Sprint-095 = 61, anchored to the `^- **TD-NNN**` row header rather than a bare
`grep 'status: open'`, which over-counts on rows quoting their own status in prose (L-108). Five
`severity: high` rows are open and all five already carry a Backlog entry, so nothing new escalates.
`TD-132` flagged rather than closed: its tracker `TASK-328` shipped at SPRINT-095, but this sweep did
not re-derive its claim against the tree, and S-094's lesson was that a sweep closes a row by reading
the tree. Full sweep note lives in `TECH-DEBT.md`.

**☑ doc-aging — §2 caps + §11 retention.** Caps sourced from `check-doc-caps.sh`, never restated from
a list: 76 PASS · 0 FAIL · 3 soft over-cap (`TODO.md` · `docs/research/adlc-epic-sequencing.md` ·
`docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md`). §11 triggers fired and applied on owner
approval: `S11.SPRINT`+`S11.LOGPAIR` (092 and 093 archived as a pair with their logs, one commit),
`S11.CHANGELOG` (v1.58.0 · v1.59.0 · v1.60.0 rotated; root 416 → 310), `S11.TDDELETE` (five 093-cohort
rows; TD-101/TD-113 held to SPRINT-097 by the clock S-094 set), `S11.LEARNINGS` (103 collapsed). **Not
taken:** the `S11.TODOCAP` prune — `TODO.md` stays over its soft cap by owner decision.
`S11.EPIC` and `S11.RESEARCH` did not fire (no epic has all members closed with all Closed-when `[x]`;
all four superseded research docs are still cited, gate PASS).

consequence · T1 · behaviour:low · governance:high

---

### 2026-09-08 | surprise | the promote-time Plan repair is a permanent `S9.SCOPECHANGE` FAIL, and the trap is structural

`S9.SCOPECHANGE` reports § Plan changed at `054abcf` with no `scope-change` entry in this log **as of
that commit**. It is correct and it cannot be repaired in place: the check reads `git show
<commit>:<log>`, so writing the entry now cannot make it have existed then. Recorded rather than
smoothed.

**What happened:** the Plan froze at `896fc18`; `check-layers-completeness.sh` then returned 3 FAIL on
it (undeclared `Layers:`/`Depends-on:` tokens), and the repair at `054abcf` edited § Plan. The log did
not exist yet, because the template creates it *lazily at the first entry*.

**Why it is a trap and not just a slip.** Two rules meet here and neither mentions the other: §9 says
the `scope-change` entry is written **before** § Plan is edited, and the Plan template says the
Execution Log is **rendered lazily at the first entry**. A sprint whose first post-freeze action is a
Plan edit therefore starts with no log to write into, and the only way to satisfy §9 is to know to
create the log first — which nothing tells you at the moment you need it. Any sprint that repairs its
own Plan at promote hits this, and the repair is exactly what a promote-time schema gate is *for*.

**Candidate for the close Retro** (filed there, not here — this log is the sweep source §10 reads):
either the Plan template creates the log at promote rather than lazily, or `S9.SCOPECHANGE` exempts
the first post-freeze commit when no log exists at `plan_commit`. The first is preferable — the second
is an exclusion, and widening an exclusion is how a guard acquires a silent false negative (L-058).

consequence · T1 · behaviour:low · governance:high

---

### 2026-09-08 | progress | T1 self-review; the independent pass was NOT dispatched, and that is recorded not implied

**Review depth per the skip table: `governance:high` → one scoped independent reviewer, whatever the
file extension.** It was **not dispatched.** This session carries a standing instruction not to call
the Agent tool unless the owner asks, and that instruction wins over the routing table — but the
consequence is named rather than left implicit: **T1 has had a self-review only.** For a `decision`
task whose deliverable is prose, the floor catches less than usual precisely because there is no
mechanical surface to disagree with the author.

What the self-pass did check, each against an artifact rather than recollection: every changed file
traces to T1's (widened) `Layers:` · ledger and backlog integrity re-derived before and after every
structural edit · `check-layers-completeness.sh` 6 PASS / 0 FAIL on the amended Plan · the ADR carries
a Negative consequence, which its template requires and which a ruling of this shape could easily have
omitted · the DECISIONS index went 39 → 40 rows · no manifest or version touched, so the four-manifest
lockstep DoD does not apply · Plan at 188 lines against a 400 cap.

**Not checked by anything here:** whether the ruling is *right*. That is the half an outside reader
would have pushed on, and it is the half nobody pushed on.

consequence · T1 · behaviour:low · governance:high

---

### 2026-09-08 | progress | batch G1 + G2 signed over T2 and T3; four rulings taken

**Mode is `sprint-bulk`** — the owner asked for the remaining Plan, not a single task. T1 was gated
alone under `mvp`, so this is the first pass that covers the whole Plan and the first that may write
`gates_signed:`. Written now at `42ffbdd`; its absence until this moment was load-bearing (L-099).

**G1 ran the full checklist for both tasks, no fast-path.** `TASK-332` is `origin: close-retro` and
`TASK-298` is `origin: manual` — neither passed `/task-decomposer`'s intake grill, so there is no
prior scope agreement for a fast-path to re-confirm. Read from the `origin:` field in each entry,
not inferred from how the entries read.

**Shared-file ownership map: EMPTY, and that is the finding.** T2 declares `TECH-DEBT.md` ·
`TODO.md` · `SPRINT-095`; T3 declares the checker and its eval runner. **No file is touched by both**,
so nothing about files forces an order — which matters because the frozen Plan's order turns out to be
wrong for a different reason (below). D2's serialisation of `TECH-DEBT.md`/`TODO.md` was a T1↔T2
constraint and is discharged: T1 has committed.

**A2 re-derived, as the Assumption required, and by READING rather than by re-running the 85-pair
measurement — which is the stronger proof.** `qa-check.sh:1198` hands the checker
`ls docs/sprint/SPRINT-*.md`, non-recursive, so an archived sprint file never enters `"$@"`. The
`*/archive/*` filter at `check-layers-observed.sh:397` operates on `"$@"`. It is therefore not merely
ineffective for archived sprints, it is **unreachable** for them — a deductive result the 85-pair
count can only corroborate. A2 confirmed.

**Every line number re-derived at HEAD, and three of four cited figures are stale** (L-130 — a value
in a frozen artifact is a query result, re-queried at execution):

| Statement | Cited in artifacts | Derived at `42ffbdd` |
|---|---|---|
| sibling-loop `*/archive/*` filter | `:397` | `check-layers-observed.sh:397` — correct |
| the skip consuming `sibling_sprints` | `:429` (TD-125, SPRINT-094) · `:430` (SPRINT-095) | **`:519`** — both stale |
| the non-recursive `ls` upstream | `qa-check.sh:1013` (TASK-332) | **`qa-check.sh:1198`** — stale |

Cross-checked rather than taken from one query: `:519` agrees with T1's own entry above, which
recorded `check-layers-observed.sh:519` in the current tree against `:430` at `2335eab~1`.

consequence · T2,T3 · behaviour:low · governance:high

---

### 2026-09-08 | scope-change | four G2 rulings amend § Plan — logged BEFORE the Plan is edited

Per §9 and ADR-014. Four findings, all surfaced as one frontier round and all ruled by the owner.

**(1) Execution order swaps to T3 → T2.** *What broke:* the Plan lists T2 first and declares
`Depends-on: none`. True of T1's ruling — the cause is wrong either way — and **false of the figures**.
T2's entire deliverable is line numbers inside `check-layers-observed.sh`, and T3 rewrites that file;
in Plan order every figure T2 freezes is stale within one commit, which is L-130 in the same sprint
that just re-derived three stale ones. *Impact:* execution order only. The § Plan task numbering is
untouched — Tn is an identity, not a schedule — and no `Layers:` changes for this. The files are
disjoint, so nothing opposes the swap. **Ruled: T3 first.**

**(2) T2's `Layers:` gains `docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md`.** *What broke:*
T2's Acceptance says *no live artifact* still names the `*/archive/*` filter as the cause, but its
declared set names three files, and a corpus grep with `.claude/worktrees/` and `docs/sprint/archive/`
excluded (L-170) finds the identical claim carrying the identical stale `:429` at **SPRINT-094:190**.
This is **L-186 at the artifact-set level** — the detection is sound, the member set it runs over is
not — and it is worth naming as the promoted rule's first live catch outside a fixture. "It is a
closed sprint" does not discriminate: SPRINT-095 is `status: closed` too and was always in scope.
*Impact:* T2's `Layers:` gains one file; its Acceptance becomes reachable. **Ruled: widen.**

**(3) T2's DoD 3 is restated — TD-131 records the call site's life AND its removal.** *What broke:*
the criterion requires TD-131 to note that `fmv()` **gained** a call site on archived sprint files.
ADR-040 discovers archived sprints from their **filenames — no frontmatter read** — so T3's revert
deletes that call site. Ticking the wording as frozen would record a fact this same sprint erases,
which is the DoD-went-stale shape (L-088), distinct from a scope shift. *Impact:* TD-131 instead
records that SPRINT-095 T1 added an archived-file `fmv()` call site and SPRINT-096 T3 reverted it, so
the row's CRLF exposure is **unchanged** — honest against the end-state tree and still discharging the
row's intent. **Ruled: restate, not drop.**

**(4) T3's `Layers:` corrects `evals/fixtures/layers-observed/**` → the runner alone.** That directory
does not exist; the fixtures are generated inline by `evals/run-layers-observed-fixtures.sh`. A
declaration naming a path the tree does not have is a `Layers:` written as a prediction rather than
maintained as a live declaration (L-100). No owner ruling needed — corrected and logged.

**Also ruled in the same round, changing no Plan text:** T3's DoD 7 outside reviewer **is authorised**
— one worktree-isolated reviewer, pinned to the shipped ref, with no `git add -A` crossing it
(L-165 · L-168). This session's standing "no Agent dispatch unless asked" is what made T1 self-review
only; the owner lifted it for T3 specifically, on the ground that T3 *is* the guard and L-165's whole
finding is that no self-pass reaches this class.

**Re-confirm G2:** signed by the owner in the round that took all four rulings, each named in its own
question rather than folded into an approval of something else.

consequence · T2,T3 · behaviour:low · governance:high

---

### 2026-09-08 | progress | T3 — both arms ruled by the cited number; the proof is honest about which half is which

Ran FIRST, per the batch-G2 ordering ruling. Landed as `a333134`, checker **-86/+70**.

**Implemented inline rather than dispatched, and the reason is stated rather than left implicit.**
The routing table sends `class: execution` to a sub-agent carrying `/tdd`. This session's standing
instruction forbids Agent dispatch unless the owner asks; the owner lifted it for T3's **reviewer**
specifically, not for the builder. So the build is the coordinator's own work, and the isolation was
spent on the independent pass — which is the half L-165 says finds things.

**The change.** SPRINT-095 T1's declaration + window machinery and its temp-file map are reverted;
archived sprint numbers are discovered from their **filenames** and appended to `sibling_sprints`, so
one membership test decides both arms. Not a literal revert: dropping the machinery alone would leave
archived sprints out of the trusted set and **flip** the asymmetry rather than remove it.

**A blind spot found and closed in my own first draft.** The selection first required the `-<slug>`
segment STANDARD prescribes. The glob `archive/SPRINT-*.md` admits files that pattern rejects
(`SPRINT-960.md`), and a rejected member is **not a finding, it is an absence**: its commits land on
an active sibling with nothing reporting that a sprint was skipped. That is L-186's shape appearing
inside the very task that cites L-186. Population re-derived rather than assumed: 93 files admitted,
**93 selected, 0 rejected**, 93 distinct, filename and frontmatter agreeing on every one. The first
count of that population disagreed with its own inverse (93 admitted / "1 selected" / 0 rejected) —
a `printf` with no trailing newline had concatenated all 93 numbers onto one line. Caught by the
inverse failing to sum to the total, not by re-reading the query. The cross-check rule doing exactly
its job.

**Real 092/093 pair (L-166) — NO REGRESSION, and NO DISCRIMINATION. Recorded as the latter rather
than dressed up as the former.** 092 was made live again with 093 archived, the actual TD-125
scenario: **21 `sprint(093)` commits sit inside 092's window.** Result: 092's blamed pairs
**11 → 11**, and **zero `sprint(093)` commits are blamed on 092 under either checker** — the four
blamed commits are unattributed governance/retention commits, the pre-existing TD-107 class. The two
designs *agree* on this pair, because 093's commits are covered by 093's own declarations, so the old
declaration test already skipped them. They differ only at the accepted hole, and **the real tree
contains no instance of it**: no live sprint's window cites any archived number (derived — 094's
window cites 094/095/096 only). So the motivating artifact proves the branch is *reachable and
correct*, and cannot prove it *changed anything*. The hole is pinned by fixture instead, which is the
honest division of labour between the two.

**Fixtures 59 PASS / 0 FAIL / 0 NOTE.** The `archived-window` case is **INVERTED, not deleted** — it
now pins the accepted hole, so silently re-narrowing the rule fails loudly in either direction. An
accepted hole with no fixture is indistinguishable from an unnoticed one, and the next reader would
re-open the three-design loop. Every new case carries a **sibling control** that must still FAIL by
name in the same run: a fixture asserting only silence cannot tell *ruled correctly* from *checked
nothing*.

**Seeded-break discrimination — ONE hash convention throughout (`git hash-object`; the repo pins
`*.sh` to `eol=lf`, so blob and working-tree bytes coincide and these figures reproduce on any
checkout).** Pristine `d50f083bb72f50517896f73a542130c49410861b`, 592 lines.

| Seed | Hash | Suite | Red cases |
|---|---|---|---|
| 1 — archived numbers never appended | `0bf8537` | 55 PASS | the 4 archived cases; **all 3 sibling controls stayed green** |
| 2 — selection re-narrowed to require a slug | `a7ce778` | 58 PASS | **exactly one of 59** — the L-186 selection fixture |

Both landed (2 changed lines each), still parsed, targeted (line delta **0** — a demolition is not a
discrimination), and restored to `d50f083` verified. **Seed 2 is the load-bearing one:** it proves
the selection fixture earns its place, because nothing else in a 59-case suite catches a
selection-only break. L-186's claim demonstrated rather than asserted.

**A fixture caught its own vacuity, which is the whole reason that guard exists.** The first
selection fixture used a CRLF archived sprint file, on TD-131's ground that `fmv` empties on CRLF.
Its premise guard reported that **this host's awk translates CRLF on read** — `fmv` returned `951`,
both routes agreed, and the case would have gone green while discriminating nothing (L-142).
Replaced with a member carrying **no `sprint:` key at all**, which no awk build can rescue, plus a
slugless-filename member for the other direction of the same axis.

**Measured side effect, relevant to TD-090/TD-117:** the checker runs **3m32s to 1m01s** over the
live sprint set, because filename discovery replaces reading 93 archived files' frontmatter *and
Plan* once per subject sprint.

review · T3 · consequence · behaviour:high · governance:high — an outside worktree-isolated reviewer
was dispatched against the shipped ref `a333134` per DoD 7. **DoD 7 is NOT ticked in this entry**;
its result is recorded separately when it returns.

---

### 2026-09-08 | progress | T2 — the stated cause corrected, and the corpus verified positively

Landed as `fb1ac85`, after T3 by the G2 ordering ruling, so every figure was derived against the
settled file rather than against one about to change.

**A2 re-derived deductively, which is stronger than the measurement the row carries.** The
`*/archive/*` filter operates on the argument list; `qa-check.sh`'s layers-observed leg passes a
non-recursive `ls`, so an archived file never enters that list for the filter to reach. It is
**unreachable** for archived sprints, not merely ineffective — the 85-pair count corroborates rather
than establishes it.

**Four artifacts corrected**, including `SPRINT-094`, which sat outside the frozen `Layers:` and was
found by the corpus grep T2's own Acceptance implies.

**Every cited line number was stale except one.** `qa-check.sh:1198` (TASK-332 said `:1013`), the
filter now at `:401` (`:397` was correct before T3), discovery at `:457`, the single skip at `:508`
(TD-125 said `:429` and SPRINT-095 said `:430`, for the same statement — so one was wrong before
anyone looked). The corrected rows now say *re-derive, do not cite this line*, because a figure
frozen in prose goes stale silently and this family has now done it four times (L-130).

**The Verify was run as a classification, not a keyword grep.** A negative grep filtered by a
"CORRECTED|wrong|measured false" blacklist is L-108's own anti-pattern — a corpus that documents its
own corrections matches prose *about* the claim, and my first attempt at this check did exactly that
and returned eleven hits it could not classify. All 24 live hits were instead sorted by shape:
5 append-only log entries, 1 the ADR, 12 correction/refutation context, and **6 unrelated**
`*/archive/*` uses in other rows (TD-051's subject-sprint skip, the worktree-exclusion mitigation, a
file count) — each of the six read individually rather than pattern-matched. Zero live artifacts
still *assert* the old cause. The Acceptance's positive half was then checked **directly** rather
than inferred from the negative: all four artifacts name the upstream glob.

**Two findings recorded rather than fixed, both outside T2's scope:** `TD-051` cites `Line 225` for
the subject-sprint `*/archive/*` skip, stale in exactly the same way; and SPRINT-094's parked-ruling
checkbox is now satisfied (092/093 were archived at this promote) but left unticked, since closing a
closed sprint's item is a governance action rather than a correction. Both to the close Retro.

**Integrity re-derived after every structural edit, not assumed:** 76 TD rows before and after, 15
task rows / 13 `ready` unchanged, **0** task rows missing their blank-line separator (the fusion
check L-009 exists for), 094 and 095 open-DoD counts unchanged at 1 and 21.

consequence · T2 · behaviour:low · governance:med

---

### 2026-09-08 | surprise | SPRINT-096's own Layers: are invisible to the checker it is fixing

Found while attributing this sprint's own gate FAILs, and it is **pre-existing, not caused by T3** —
proven by the pristine-vs-patched A/B returning byte-identical output on the live sprint set.

**Two checkers that each claim to parse declarations identically do not.**
`check-layers-observed.sh`'s `task_decls` extracts only **backtick-quoted** tokens.
`check-layers-completeness.sh` tests membership with `grep -qF` against the raw `Layers:` line — a
plain substring match, **backtick-agnostic**. Both files carry the comment *"kept deliberately
identical … both checkers read the same declaration, so a parsing rule that differs between them
would make one of the two lie."* One of them is lying.

**Measured:** SPRINT-096's Plan yields **0** declared tokens to the observed checker; SPRINT-095's
(backticked) yields **14**. So every `Layers:` declaration in this sprint is invisible to the checker,
and two of the six gate FAILs on this tree are spurious — the T1 attribution finding and *changed but
undeclared: `scripts/lib/check-layers-observed.sh`* name files that ARE declared, just unbackticked.
It fails toward over-reporting, so it is loud rather than silent, which is why this is a Retro item
and not a stop.

**Candidate for the close Retro, deliberately not repaired here.** The cheap repair is to backtick
this sprint's own `Layers:`, which is a § Plan edit made while a gate is red — the shape L-088 warns
about, even though the declaration's *content* would not change. The durable question is which parser
is correct, and that is a ruling rather than an edit. Filed with the measurement attached.

consequence · T2,T3 · behaviour:low · governance:high

---

### 2026-09-09 | review | T3's outside reviewer found the one thing no self-pass reached — and it was a branch, not a population

**Dispatched worktree-isolated against the shipped ref `a333134`**, per DoD 7 and the owner's batch-G2
authorisation. Isolation verified after the fact rather than assumed: the working tree came back
clean and `git hash-object scripts/lib/check-layers-observed.sh` still equalled
`d50f083bb72f50517896f73a542130c49410861b`, so nothing the reviewer seeded crossed into this tree
(L-168 — adversarial verification *writes*, and a non-isolated reviewer plus any `git add -A` ships a
corrupted guard inside an unrelated commit).

**Verdict: no defect in the shipped code; one real, reproduced gap in the suite's defenses.**

**What it cleared, each against the artifact:** the commit's own numeric claims (`--numstat` really is
+70/-86; the stated pristine hash really is the file's); 59 PASS / 0 FAIL reproduced twice; no live
reference to the deleted `owns_commit` / `archived_decls`; and — the class this change was most at
risk from — **it could not construct a selection-level miss.** It re-derived the population
independently (93 filenames parse, all match their own frontmatter string-for-string including
zero-padding, no duplicates), checked `dirname`-relative discovery under an absolute invocation path
containing a space, and confirmed the non-recursive glob correctly excludes `archive/logs/` while
leaving no orphan. That is the L-186 axis independently re-derived and agreeing.

**The finding: the archived loop's self-sibling guard has no case.** T3 wrote it, commented it *"Same
self-sibling guard as the active loop"*, and believed it. The active loop's twin has been pinned
since TASK-299 by *ownership leg G*; the archived one, **newly load-bearing as of this commit**, had
nothing. The reviewer seeded its removal and **all 59 retained fixtures still reported "all green"**,
then reproduced the consequence live: an archived filename sharing the *active* subject's number
makes that sprint its own sibling, so every one of its own `sprint(NNN)` commits is skipped by its
own check and real undeclared work is swallowed at **exit 0**.

**Reproduced here before fixing, not taken on report.** Seed 3 removes *only* the archived guard,
leaving the active twin intact — 2 changed lines, parses, line delta **0**, hash `433b0a6…` — and
**exactly one of 61 cases reddens**: the new one, reporting *"exit 0, expected 1"*, which is the
silent PASS by name. Restored to `d50f083…` verified. Fixed in `ceb7924`; suite now **61 PASS / 0
FAIL**.

**Why this is worth a learning rather than just a fix.** Every bar in the Tier-G ladder was met and
none of them asks this question. L-166 asks whether the guard is reachable for its *motivating*
artifact — it was. L-186 asks whether it is reachable for every *other* artifact of the same kind —
it was, across all 93. Both instruments sit at the level of the artifact SET. This defect was one
level down: a **branch** of the guard, load-bearing, commented, and untested, in a file whose author
had just written a fixture for every other branch. The tell was available and unread — *the comment
says "same guard as the active loop", and the active loop's version has a named case while this one
does not.* A `git log`-visible asymmetry between a new branch and the sibling it claims parity with.

**L-165 observed again, exactly as stated:** the rule was loaded, the author had written the
discrimination proof for two other seeds in the same session, and the miss was still invisible from
the inside. Candidate for the close Retro.

review · T3 · consequence · behaviour:high · governance:high — one scoped independent reviewer,
worktree-isolated, one finding, fixed and re-proven. No builder retry was needed beyond it.

---

### 2026-09-09 | surprise | system-verify produced NO VERDICT — killed for host memory, and the budget guard passed on its way

Step 6's system-verify was run once against the integrated tree at `b031bda`. **It did not produce a
verdict line.** Recorded as inconclusive — neither green nor red — because a run with no
`QA-CHECK: N pass, M fail` has not said anything, and reporting 0 FAILs from a partial run as a pass
is precisely L-120's shape (the number to read is the one the gate *prints*).

**What it managed:** 147 lines, **0 FAIL**, from `qa-budget-default` through the §2 caps, the schema
legs and `task-origin`. It was killed by the host for memory before reaching the legs this sprint
actually touched — eval harnesses (leg 12) and layers-observed (leg 15) both sit later in the run.
So the 0 is real and it is also nearly uninformative about T2 and T3.

**The new fact, and it separates two debts that have been read as one.** The first line of the run is
`PASS qa-budget-default: 520s < 600s command ceiling`. The budget guard SPRINT-084 built for TD-084
watches **wall-clock**, and it passed — then the run died on **memory**. TD-084's failure mode (dying
past an external timeout with no verdict) is closed; **TD-090/TD-117's is not the same mechanism**,
and nothing in the gate reports it. A memory kill produces exactly the artifact TD-084 was built to
eliminate — a run with no verdict — through a door the guard does not watch. This is the third
recorded instance (SPRINT-096's own promote, ADR-040's cost table, and now this).

**What IS verified, targeted and each read from the tool's own verdict rather than a wrapper:**

| Check | Result |
|---|---|
| `check-layers-completeness.sh` on the Plan | **6 PASS / 0 FAIL**, exit 0 |
| `run-layers-observed-fixtures.sh` (T3's own harness, opt-in set) | **61 PASS / 0 FAIL**, exit 0 |
| `check-layers-observed.sh` over live sprints | 6 FAIL, **all pre-existing or spurious** — proven by a byte-identical pristine-vs-patched A/B and by the backtick finding below |
| partial `qa-check.sh` | 147 lines, 0 FAIL, **no verdict** |

Note that `run-layers-observed-fixtures.sh` is in the **opt-in** set, so even a completed bare gate
would not have run T3's fixtures. The targeted run is not a substitute for system-verify, but on this
sprint's own subject it is the stronger evidence.

**Two of the 6 live-sprint FAILs are spurious for the reason recorded above** — SPRINT-096's `Layers:`
are unbackticked, so `task_decls` yields **0** tokens for this sprint and every declared file reads as
undeclared. The other four are the pre-existing TD-107-class unattributed governance commits.

**Also observed:** `OVER-CAP (soft): TODO.md (560 > 320)` — up from 551 at promote, where the prune
was offered and declined by the owner. Soft cap, no action taken.

**Close is therefore an owner decision, not a coordinator one.** The Plan is exhausted at 17 of 17
and the tree is clean, but ADR-021's spirit is that a gate which cannot speak does not get read as
consent.

consequence · T2,T3 · behaviour:low · governance:high

---

### 2026-09-09 | progress | owner override: close proceeds on targeted evidence; the parser divergence is a Retro ruling

**Recorded here, not in the launching transcript**, because this is the artifact close reads and a
ruling filed anywhere else behaves as if it were never taken (L-151).

**Override 1 — close proceeds with system-verify INCONCLUSIVE (ADR-021).** The gate cannot print a
verdict on this host; it was killed for memory after 147 lines and 0 FAIL. The owner ruled close on
the targeted evidence instead, and the reasoning is recorded rather than assumed: on this sprint's
own subject the targeted runs are the **stronger** evidence, since `run-layers-observed-fixtures.sh`
sits in the **opt-in** set and a *completed* bare gate would not have executed T3's 61 fixtures
either. What the override forfeits is the legs this sprint did not touch — stated plainly rather than
implied, because an override that does not name what it gives up is a waiver, not a decision.

- `check-layers-completeness.sh` on the Plan — 6 PASS / 0 FAIL, exit 0
- `run-layers-observed-fixtures.sh` — 61 PASS / 0 FAIL, exit 0, including the reviewer's finding
- partial `qa-check.sh` — 147 lines, 0 FAIL, **no verdict**

**Not waved away:** the memory-kill mechanism is filed as evidence against TD-090/TD-117, with the
new distinction that separates it from TD-084 — the wall-clock guard **passed** (`520s < 600s`) on
the way down, so the two debts are different doors onto the same artifact.

**Override 2 — the `Layers:` parser divergence is ruled at the Retro, and SPRINT-096's Plan is left
alone.** Backticking this sprint's own declarations would clear two spurious FAILs cheaply, and the
owner declined it for the right reason: the durable question is *which of the two checkers is
correct*, and editing the Plan while its gate is red to make the gate quieter is L-088's shape even
when the declaration's content does not change. The divergence goes to the Retro with its
measurement attached (0 declared tokens for SPRINT-096 against 14 for SPRINT-095).

consequence · T2,T3 · behaviour:low · governance:high
