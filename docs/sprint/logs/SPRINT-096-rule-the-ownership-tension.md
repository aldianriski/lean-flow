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
