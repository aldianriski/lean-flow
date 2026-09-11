---
sprint: 097
slug: guards-that-run-over-the-wrong-set
owner: Maintainer
last_updated: 2026-09-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-097 — Execution Log

> Append-only companion to [`../SPRINT-097-guards-that-run-over-the-wrong-set.md`](../SPRINT-097-guards-that-run-over-the-wrong-set.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-10 | promote | Plan locked at `2789dbd`, five tasks, 30 DoD

**Governance review — the §10 checklist, owner-signed before the Plan was rendered.**

`☑ L-promotion (count≥2, promoted:no): none.` Twenty-seven entries in `docs/LEARNINGS.md` still carry
a full metadata block; twenty-six are `promoted: no` and every one of those is at `count: 1`. The only
entry at `count ≥ 2` is `L-144` (count 5), already `promoted: yes`. Cross-checked: the grep for
`promoted: *no` returns 26 lines, and the per-entry extraction returns 26 + 1 promoted = 27 blocks.

`☑ TD aging (≥3 sprints unaddressed): 70 of 76 open rows.` Derived, then cross-checked against a
second query that agrees — 70 aged + 6 unaged = 76 open; and independently, S-096's 61 aged plus the
9 rows filed at Sprint-094 (which age to 3 here) = 70. **The first derivation was wrong and is
recorded rather than smoothed:** a `sed 's/[*-]//g'` in the extraction turned `Sprint-096` into
`Sprint096`, so every row parsed as age 0 and the query returned "76 of 76 aged". Caught by the
number disagreeing with the unaged list, not by re-reading the pipeline (L-108's family — the
disagreeing second number is what caught it, exactly as the rule predicts).

Two dispositions and one flag:
- **`TD-143` escalated P3 → P1.** It is `severity: high` and its tracker `TASK-334` was filed
  unranked at the SPRINT-096 close, because close routes follow-ups and does not rank them.
- **`TD-141` closed** as `resolved → accepted (no task)` under ADR-040, re-derived against the tree
  rather than inherited: its own unblock condition was *"stays open until T3 lands the code"*, and
  `scripts/lib/check-layers-observed.sh:501-508` now runs one ownership test whose comment names this
  row by number.
- **Flagged, not acted on:** `TD-090` → `TASK-322` and `TD-117`/`TD-128` → `TASK-329` are
  `severity: high` rows whose trackers sit at **P2**. Every sweep since S-084 has read "carries a
  Backlog entry" as satisfying the escalation rule; the rule says P1. That divergence is `/triage`'s
  to settle, not a promote's to silently re-rank.

`☑ doc-aging — §11 retention + every §2 cap breach: four triggers fired, all executed; three §2 soft
breaches, one partially cleared.`
- **§11 archival: SPRINT-094 and SPRINT-095 archived** with their logs, in the promote commit. Their
  own closes never ran the §11 pass, so two `status: closed` Plans sat in `docs/sprint/` for two
  sprints being schema-checked as *active* Plans by checkers that glob `docs/sprint/SPRINT-*.md`
  non-recursively — 33 of the 82 FAIL lines on the gate this promote read. INDEX rows added; 96
  archived files reconcile against 96 INDEX rows.
- **§11 deletion clock executed on schedule:** `TD-101` and `TD-113`, dated to this promote by the
  S-094 sweep because their clock runs from the sweep that verified them rather than the sprint that
  fixed them. Ledger 78 → 76 rows; id set diffed before and after showing exactly those two removed,
  and the `- Summary:` count fell 78 → 76 in step, so no neighbouring row was fused (L-009).
- **§2 caps (sourced from `check-doc-caps.sh`, never restated from a list):** 76 PASS · 0 FAIL · 3
  soft over-cap — `TODO.md`, `docs/research/adlc-epic-sequencing.md`, and
  `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` (the latter two are TD-082's reasoned
  carry). The `TODO.md` prune was offered at S-096 and declined; **taken this time**, 545 → 455, by
  collapsing the five promoted tasks' Backlog entries to pointers at the sprint file that now owns
  their specs (L-008). Still over the 320 soft cap — closing the remaining 135 lines means cutting
  the live specs of eleven un-promoted tasks, which is a content ruling for `/triage`.
- **Ownership header** added to `docs/development/Lean-Flow-Governance-Roadmap-2026-2027.md`, which
  had no frontmatter at all (S1.LAW3 + S3.SCHEMA). Body verified byte-identical after the insert.
- **`docs/LEARNINGS.md` id-policy line** corrected `L-191` → `L-192`; `L-192` had been filed while the
  policy line still named the previous maximum.

**Filed at this promote:** `TD-144` and `TASK-337` — the epic-state checker resolves a member sprint's
number against *this* repository's archive, so `EPIC-016`'s workdoo members (ADR-041) resolve to
lean-flow's own same-numbered sprints and produce two false `close_commit` mismatches on a correct
artifact. L-186's shape: the detection logic is sound, the member set it runs over is not. Promoted
straight into the Plan as T5.

**Gate at promote: `QA-CHECK: 225 pass, 33 fail`** (opt-in profile per ADR-039 — promote and close run
`QA_FULL=1`, and a green bare gate says nothing about TS/Shell §4 parity).

### 2026-09-10 | surprise | The promote's own governance record failed two checks it had just run

The post-promote gate re-run confirmed assumption **A4** in the part that mattered — every
SPRINT-094/095 FAIL cleared (33 → 0), as did the roadmap header pair, the two `layers` findings and
`verify-does-not-reach-target`. But two findings landed on the promote itself, and both are the same
failure the sprint is named after: **a record written where its reader cannot reach it (L-151).**

- **`S10.PROMOTEREVIEW` FAILed** because it greps the promote record for three literal tokens —
  `L-promotion`, `TD[ -]aging`, `doc[ -]aging` — and the plan-lock commit message named the first two
  and spelled the third out as its findings ("Deletion clock executed", "TODO.md pruned", "Ownership
  header added") without ever writing the words `doc-aging`. The checklist was run in full and
  recorded in full; the token its only mechanical reader looks for was absent. **This entry is the
  fix** — the checker accepts either the plan-lock commit message *or* this Execution Log, by explicit
  design, "because §10 fixes the checklist's content and not its location."
- **`S10.TDAGING` FAILed 33 times** because it reads the ledger header for each aged row's id **by
  name**, and the S-094 and S-096 sweeps both recorded the aging *count* without the *list* — so 33
  rows were aged and named by no sweep at all, and the re-review prompt §10 asks for was never raised
  for any of them. The count rose 19 → 33 across this promote for the same reason. Corrected by
  enumerating all 70 aged rows in the S-097 sweep note; the checker's own condition was then re-run
  by hand against the edited header and returns none unnamed.

Neither was caught by recalling the governing rule, which was loaded throughout. Both were caught by
running the gate again and reading its output — the same instrument that found everything else this
promote fixed.

consequence · promote · behaviour:low · governance:high

### 2026-09-10 | scope-change | T2's premise is dead; T4's `Layers:` narrowed; new executable code is TS/Bun

**Raised at the batch G1+G2 pass, before any Plan edit and before any dispatch.** Three findings, three
owner rulings. § Plan is edited only for the second; the first and third are recorded here.

**1. T2's motivating defect was already fixed at SPRINT-095 — what broke.** T2's Acceptance reads
*"the snippet extracted from `dispatch.md` by its own anchors, run against SPRINT-094's sprint file,
yields `PASS wave-computation: T1=0 T2=0 T3=0 T4=0` and no `FAIL cycle-detected`."* Run today against
`HEAD` (`d06edf8`), it yields exactly that:

```
PASS base-ref: declared base matches live HEAD (d06edf878c34662be47db974938b4e1bc4a5be70)
PASS wave-computation: T1=0 T2=0 T3=0 T4=0
FAIL shared-file-unowned: scripts/lib/check-epic-archive.sh ~ scripts/lib/ in T1 and T2 ...
FAIL shared-file-unowned: scripts/qa-check.sh in T1 and T2 ...
FAIL shared-file-unowned: skills/lean-doc-generator/SKILL.md in T1 and T2 ...
```

The three residual FAILs are genuine unowned overlaps in SPRINT-094's own Plan, not the phantom
`PASS shared-file-owned … order=T1->T2` rows T2's first DoD line predicts. TD-132 was closed in code
by `4cd494d` → `843ccdb` → `60fdf1b` → `82eb0cd` (SPRINT-095 T2, third design, two review rounds
rejected the first two). The retention half is present too: `evals/fixtures/dispatch-preflight/`
carries 25 fixtures including six `deps-cont-*` cases — the indented continuation arm T2's third DoD
line calls out as the untested one — plus a `parser-parity` case, and
`sh evals/run-dispatch-preflight-fixtures.sh` reports **all green**.

**This was predicted in writing and not acted on.** `TECH-DEBT.md:217` from this sprint's own promote
sweep: *"`TD-132` is still `status: open` although its tracker `TASK-328` shipped at … and this sweep
did not re-derive TD-132's claim."* The row was carried into a Plan on the strength of its Summary
line, which is precisely L-091's failure and precisely what T2's sibling T1 exists to prevent for
five other rows. A promote sweep that flags a claim as un-re-derived and then promotes it anyway has
found the defect and dropped it.

**Impact:** T2 is not executable as written — its first DoD line asserts a present-tense failure that
does not occur. **Ruling (owner, this session): T2 closes as already-satisfied.** No code change. The
reproduction above is the evidence; `TD-132` closes as resolved-by-`82eb0cd`.

**2. The pre-dispatch preflight HALTs on this sprint's own Plan.** Run against
`docs/sprint/SPRINT-097-guards-that-run-over-the-wrong-set.md` at `d06edf8`:

```
PASS wave-computation: T1=0 T2=0 T3=0 T4=0 T5=0
FAIL shared-file-unowned: evals/run-dispatch-preflight-fixtures.sh ~ evals/  in T2 and T4
FAIL shared-file-unowned: evals/fixtures/dispatch-preflight/ ~ evals/        in T2 and T4
FAIL shared-file-unowned: evals/run-layers-observed-fixtures.sh ~ evals/     in T3 and T4
FAIL shared-file-unowned: evals/run-layers-completeness-fixtures.sh ~ evals/ in T3 and T4
FAIL shared-file-unowned: evals/ ~ evals/run-epic-archive-fixtures.sh        in T4 and T5
FAIL shared-file-unowned: evals/ ~ evals/fixtures/epic-state/               in T4 and T5
PREFLIGHT: HALT
```

Six unowned overlaps, all one cause: T4's `Layers:` ends in the bare directory token `evals/`, which
by `TOK`'s directory arm (TD-043) subsumes every other task's fixture files, while all five tasks
declare `Depends-on: none`. D1 gave `scripts/qa-check.sh` an owner and said nothing about `evals/`.
The finding is correct — the checker is doing its job on a Plan that under-declares.

**Impact:** no wave can be dispatched. **Ruling (owner, this session): narrow T4's `Layers:` to the
paths it actually touches** rather than adding `Depends-on:` edges that would serialise T4 behind
three tasks it does not depend on. § Plan is edited for this, below.

**3. New executable code in this sprint is TypeScript run by Bun.** T4's stated subject —
*"reported as a failure by whatever invokes it"* — needed its invoker identified first.
`scripts/qa-check.sh` has no in-repo shell caller: `conformance.sh` mentions it only in a comment,
`.claude/settings.json:19,73` are permission entries, `apps/cli/src/main.ts:131` is help text. The
real callers are `package.json`'s `"gate": "sh scripts/qa-check.sh"` and
`"test": "sh scripts/qa-check.sh && bun test"` — the second being the L-120 shape exactly, a gate
whose verdict is read through `&&`.

**Impact:** T4's wrapper is a new file, so its language is a decision, not an inheritance.
**Ruling (owner, this session): new executable code is `.ts` run by Bun; existing `.sh` is patched in
place, never ported here.** Porting the 81 scripts / 18,164 LOC shell surface is EPIC-014's outcome
and is scoped there as a strangler with per-rule-family parity — a boundary that epic states cannot
be reached inside one 400-line Plan. This sprint carries no `epic:` stamp (D3) and no parity harness,
so it does not open that boundary. T3 and T5 extend their existing `.sh` harnesses in place.

**G2 re-confirmed** over the amended Plan: four tasks (T1 · T3 · T4 · T5), T2 closed, ownership
CLEAR. Gate signature is the owner's, still unrecorded — `gates_signed:` is absent.

consequence · scope-change · behaviour:low · governance:high

### 2026-09-10 | scope-change | A3 corrected: `member_plan()` does not exist

Amends the entry above rather than editing it. **A3 asserts** *"`member_plan()` is the only place the
epic-state leg resolves a member number"*, and T5's `Layers:` named that helper as its subject.
`grep -rn 'member_plan' scripts/ evals/` returns nothing: the symbol does not exist anywhere in the
tree. Resolution is **two inline globs** — `check-epic-archive.sh:79` and `:210` — which is A3's own
warning shape (*"TD-132's Location line named one arm of two"*) arriving one level earlier than
expected: not a helper with two callers, but no helper at all and two independent sites.

A `Layers:` line naming a symbol the repository does not contain is a structural claim about another
document that nothing checked (L-130's family). T5's `Layers:` is corrected to name the two real
sites; the declared file set is unchanged, so the ownership map is unaffected.

**The false positive itself reproduces exactly as the Plan predicts**, which is why T5 stands while T2
falls — `sh scripts/lib/check-epic-archive.sh .` (exit 1) names both rows: EPIC-016 SPRINT-001's cell
cites `eb3d9e7` against local `close_commit: b0f2695`, SPRINT-002's cites `28c5203` against `007869e`.

**Pre-dispatch preflight over the amended Plan** — `PASS base-ref` · `PASS wave-computation: T1=0 T2=0
T3=0 T4=0 T5=0` · **`PREFLIGHT: CLEAR`**, exit 0, replacing the six-FAIL HALT recorded above.

consequence · scope-change · behaviour:low · governance:med

### 2026-09-10 | T1 | Cluster ruled: four tasks, not one and not five. 12 of 32 DoD

**The ruling.** The five gate-accuracy defects the SPRINT-087 close sweep grouped as one cluster —
TD-086 · TD-087 · TD-089 · TD-097 · TD-105 — are **four tasks, grouped by artifact**. Owner ruling,
this session. Both losers are named because a ruling that names none has decided nothing:

- **The one-task side loses.** Bundling produces a single L task spanning three subsystems
  (`check-verify-reaches.sh`, `conformance-engine.sh`, `check-system-verify-block.sh`) plus a
  research round, and CLAUDE.md splits an L before proceeding. Worse, TD-089's subject is
  `docs/research/conformance-coverage.md` — a research round's prose, not a guard — so a Tier G
  "gate accuracy" task containing it would carry the whole ADR-029 ceremony for an artifact that
  earns Tier P.
- **The five-task side loses**, on the cluster's own founding evidence. TD-087 (REACHES) and TD-097
  (EXISTS) are the **same script**, filed three sprints apart with neither row aware of the other
  until SPRINT-087's close read them together, and each row's `Re-file fresh if` clause says fixing
  one alone re-files the other. Splitting them re-creates the coordination failure that took three
  sprints to notice.

One merge, because exactly one is forced. Filed as `TASK-338` (TD-087 + TD-097) · `TASK-339`
(TD-105) · `TASK-340` (TD-086), all Tier G in P1, and `TASK-341` (TD-089), Tier P in P2. Every TD row
carries a back-pointing `Tracker:` line.

**Every row was re-derived against the tree, and two clauses turned out stale.** This is the DoD's
first line and, after T2, the one that mattered:

| Row | Re-derived at `HEAD` | Verdict |
|---|---|---|
| TD-087 | `grep -qF` at `check-verify-reaches.sh:102`, plus a second substring test at `:96` | live verbatim |
| TD-097 | `[ ! -f "$scr" ]` at `:89`; archive exemption at `:55` | live verbatim |
| TD-105 | `plan-edited-after-freeze` at `conformance-engine.sh:2078`; no checkbox normalisation anywhere in the file | live verbatim |
| TD-089 | 195 `S<N>.<CODE>` occurrences vs 38 distinct kebab findings | live, **wider than filed** |
| TD-086 | masking bug at `evals/lib/check-system-verify-block.sh:75-76`; every harness invocation points at `$fx/…`, never `docs/sprint/logs/` | live — but **two Evidence clauses stale** |

TD-086's *"appears nowhere in `qa-check.sh`"* was fixed at SPRINT-068 T2, which registered
`run-system-verify-fixtures.sh` in `eval_harnesses_always`; and its Summary names `scripts/lib/`
while the checker lives at `evals/lib/`. The **substance** survives both corrections — the guard has
still never seen a real log — but a row whose Evidence names a resolved condition is one re-read away
from being dismissed wholesale. Both corrections are recorded on the row.

**`TD-132` closed as `resolved → TASK-328`** — resolved by SPRINT-095 T2's `82eb0cd`, not by work
here. It becomes deletable at the SPRINT-100 promote under §11's three-sprint clock; the deletion-clock
note in the ledger header still lists only the S-093 cohort and the two rows verified at this sprint,
and is now one row short. Not corrected here — that note is promote-sweep bookkeeping, not T1's.

**L-170 fired, exactly as written.** Deriving the next id, the raw sweep surfaced `TASK-905`–`908`.
They are `evals/fixtures/boundary-rows/` tokens, not rows. SPRINT-094's own log records the identical
contamination catching a previous sweep — *"caught by a second query, none by [recalling the rule]"* —
and that is how it was caught again here: the `TODO.md`-only query and the ledger sweep disagreed at
the top, and the disagreement was the signal. Real max `TASK-337`; next `TASK-338`.

**One cost, flagged not fixed.** `TODO.md` grew 455 → 576 lines against a **320 soft** cap (STANDARD §2,
ADR-019). Soft means reported, not failed — `check-doc-caps.sh` treats it as a governance-review flag
and the row is already a reasoned carry (TD-082) — but this ruling added 121 lines to a file already
42% over, and the §11 prune is owed at the next promote.

consequence · T1 · behaviour:none · governance:high

### 2026-09-10 | T3 | Ruled: backticks required, and an unbackticked token is NAMED

**The ruling.** One extractor, **backtick-delimited**, read by both checkers — and a live Plan
carrying a path-shaped token **outside** backticks becomes its own **named FAIL** rather than
silently reading as no declaration. Owner ruling, this session. The implementation is dispatched;
this entry records the decision and the basis it was taken on, which is the J2 half.

**The counted basis, derived before the ruling as DoD line 1 requires.** TD-142 says *"requiring
backticks is stricter and matches STANDARD's own examples, but every unbackticked Plan in the tree
then becomes undeclared. Count the affected sprints before choosing."* Counted:

- **51 unbackticked `Layers:` lines across 15 files — every one archived.** No live Plan carries one.
- **The cost against the set either checker examines is `0`**, because those files are excluded
  **twice over**: `scripts/qa-check.sh:1092` passes `ls docs/sprint/SPRINT-*.md`, which is
  **non-recursive**, and both scripts additionally guard `case "$sp" in */archive/*) continue`
  (`check-layers-observed.sh:344` · `check-layers-completeness.sh:183`).

That second finding is what turned the ruling from a trade into a free choice, and it is this
sprint's own subject arriving in the ruling for the sprint's own subject: **the question was never
which parser is stricter, it was which files the parsers run over** (L-186). TD-142 framed the cost
in terms of *the tree*; the number that decides it is the count against *the examined set*, and the
two differ by every archived Plan.

**Cross-checked (L-108).** The line census reconciles three ways: 5 live + 370 archived = 375, while
a recursive `grep -r` over `docs/sprint/` returns **380** — the 5-line gap being `Layers:` quoted
inside sprint **log** files, which the non-recursive caller never reaches either. A first pass at
**A2** also disagreed with the Plan — 13 against the recorded 14 — and the disagreement was the
signal, not noise: `scripts/qa-check.sh` is declared by **two** of SPRINT-095's tasks, and the
observed checker emits **per-task** lines, so 14 non-unique / 13 unique. **A2 confirmed**:
SPRINT-096's Plan yields **0** declared tokens, SPRINT-095's **14**.

**The loser, named.** The **backtick-agnostic** side loses — adopting the dispatch preflight's `TOK`
shape rule in both checkers. It is the tidier answer on its face (one semantics across all three
readers, no Plan retroactively undeclared) and it was rejected because `TOK` cannot distinguish a
declared path from a path *mentioned in the `Layers:` line's own annotation prose*. That is exactly
the failure the adjacent `Depends-on:` field needed **three designs and two review rejections** to fix
at SPRINT-095, on the same line of the same block. Taking the permissive reading here would have
re-imported it one field to the left.

**The boundary this ruling leaves open, stated rather than implied.** There is a **third** reader of
`Layers:` — the preflight's `TOK`, which stays backtick-agnostic. After this change the divergence is
narrower and runs in the **safe** direction: the preflight sees at least what the checkers see, so a
bare token is *owned* by the preflight while being *invisible* to the checkers, never the reverse.
The new named finding makes any live instance loud. `check-layers-observed.sh:480` already calls this
a "BOUNDARY, deliberate"; it is now a boundary with a reader.

consequence · T3 · behaviour:none · governance:high

### 2026-09-10 | T4 | A verdict-less gate run now FAILs loudly. 19 of 32 DoD

**Built `scripts/qa-verdict.ts`** (TypeScript run by Bun, per this session's ruling — no new `.sh`).
It wraps the gate, streams the child's output live, and judges **from the printed
`QA-CHECK: N pass, M fail` line**, never from the child's exit code. Wired into `package.json`'s two
real callers: `gate` and `test` now run `bun scripts/qa-verdict.ts sh scripts/qa-check.sh`.

**Identifying the caller was half the task.** T4's Acceptance says the run must be *"reported as a
failure by whatever invokes it"*, and at the gate pass that invoker turned out not to exist in the
shape the Plan assumed: `conformance.sh` mentions `qa-check.sh` only in a comment,
`.claude/settings.json` holds permission entries, `apps/cli/src/main.ts` holds help text. The only
programmatic callers are `package.json`'s two scripts — one of which,
`"test": "sh scripts/qa-check.sh && bun test"`, was **L-120's shape verbatim**: a gate whose verdict
was read through a shell operator instead of from the line the gate prints.

**Motivating case reproduced live, before anything was built on it.** `timeout 15s sh
scripts/qa-check.sh` printed `PASS qa-budget-default: 520s < 600s` and was then killed with **no**
`QA-CHECK:` line — so the wall-clock guard passes while the run still ends verdict-less, exactly as
SPRINT-096's memory kill did. DoD line 1 existed to stop a fix being built on a guard that already
covered the case; it did not cover it.

**Verified independently at merge, four probes, discriminating in both directions:**

| probe | result |
|---|---|
| no verdict line, child **exits 0** | **FAIL**, exit 1, named reason |
| clean verdict printed | green |
| red verdict printed | red, *for the stated reason* — not conflated with verdict-less |
| clean verdict printed, child **exits 3** | **green** |

The last is the load-bearing one. A wrapper that trusted the exit code would call it red; this one
calls it green, because the number that decides is the one the gate **prints**. That is what L-120
instructs, as opposed to what it is usually read to instruct.

**Two rounds of worktree-isolated outside review, and L-165 held again.** Round 1 found a
**CRITICAL** — a spawn failure left the wrapper hanging forever (the ENOENT-never-resolves shape),
which is *worse than the defect being fixed*, since a guard that hangs reports nothing at all — and a
**MAJOR**: stdout and stderr were merged into one judged buffer, so pipe interleaving could desync
the verdict regex and misreport a real pass as verdict-less. Both reproduced RED, fixed, committed
separately (`da7d139`). Round 2, an independent reviewer seeding its own break, returned **CLEAR**.
Neither defect was reachable by the author; both were found by an outside pass — the fifth and sixth
sighting of that pattern in three sprints.

**Seeded-break discrimination**, convention stated once and used throughout — `git hash-object <path>`
against `git rev-parse HEAD:<path>`, both git blob ids, so the LF/CRLF split cannot enter the
evidence trail at all (L-169's failure is the *unstated* method, and on this Windows checkout the
working-file hash is the trap). Seed `fail > 0` → `fail > 1` in `judgeOutput`: landed
(`a4ccfb6a…` → `b0ed72a4…`), targeted (117 lines before and after, single-line diff), still parses;
exactly **1 of 12** tests reddened with its own named finding while 11 stayed green, including both
review-driven regression fixtures. Restored to `a4ccfb6a…`, matching `HEAD:scripts/qa-verdict.ts`.

**Two things this task surfaced and did not fix — both disclosed rather than absorbed:**

1. **`.claude/settings.json`'s allowlist still names only `sh scripts/qa-check.sh`.** Every future
   session running `bun run gate` or `bun run test` hits a fresh permission prompt. Found by round-1
   review, confirmed by round-2, left alone because it is outside T4's declared `Layers:` — and
   correctly so: **it is outside every task's `Layers:`, which is exactly the seam CLAUDE.md says a
   per-task DoD cannot enforce** (L-172 → TASK-318). It is coordinator work, and it is a *permission*
   widening, so it is an owner call rather than a merge-time tidy. Not closed here.
2. **The gate's live red is 5, not the 33 assumption A4 anchors to.** A full `bun run gate` to
   completion reported `QA-CHECK: 200 pass, 5 fail`. A4 asks for the FAIL count to be reconciled
   against **33**; the 33 figure counts conformance-engine `S10` findings, which `qa-check.sh` treats
   as **informational** and which never enter its tally — the same conflation TD-105's own row records
   being made once already ("*first filed `high` on the belief that it blocked close; that was wrong*").
   A4 is **not** confirmed by this number and must not be read as confirmed by it. Left open for the
   close reconciliation, where the two populations can be counted separately.

consequence · T4 · behaviour:med · governance:low

### 2026-09-10 | T3 | One extractor, backticks required, both directions closed. 25 of 32 DoD

**What changed.** `check-layers-observed.sh` gains `layers_tokens()` — the single backtick-only
extractor — used by its own `task_decls()` and its `layers_all` union.
`check-layers-completeness.sh` now **sources** that file (`LAYERS_OBSERVED_SOURCED=1` suppressing the
sourced file's bare-invocation check and its `for sp in "$@"` main loop) instead of carrying a second
copy that can drift again. Every live membership test now runs `grep -qxF` — **exact** — against the
extractor's output. The comment both files carried, *"kept deliberately identical … a parsing rule
that differs between them would make one of the two lie"*, is now true **by construction**.

**The silent direction is the one that changed.** The completeness checker's `grep -qF` read a token
as declared if it appeared anywhere in the line — inside a longer path, or inside a trailing comment
— which is L-108's shape failing **green**. The observed checker's over-report on a bare path was
already correct under the ruling and needed no code change; it is now *pinned* by a must-FAIL and a
sibling control so the refactor cannot quietly loosen it. New named finding
`layers-unbackticked-token` makes the loud direction say what is wrong instead of silently reading a
bare token as no declaration.

**The fix immediately found a live instance of the bug it was built to find.** Run against this
sprint's own Plan, T2's DoD and Acceptance cite `dispatch.md` by short name while its `Layers:`
declares the full `skills/orchestrator/references/dispatch.md`. The old substring test masked that
green; the exact test flags it. The builder surfaced it rather than editing a Plan it had been told
not to touch — the right call, and the finding stands as evidence the guard reaches real artifacts
(L-166), not just fixtures.

**Verified at merge, independently of the builder's report.** `LAYERS-OBSERVED FIXTURES: all green`,
**62 PASS, 0 FAIL**, against a **main baseline of 60** — the +2 are exactly the must-FAIL and its
sibling control, so the delta is accounted for rather than assumed.
`LAYERS-COMPLETENESS FIXTURES: all green`, 14 cases. Both verdicts read from the harness's own
printed line.

**A false red, and it was the coordinator's.** An earlier run of the observed harness reported
`at least one FAIL` with 7 failing fixtures. It was a **race I created**: I resumed the builder — which
then seeded breaks in its worktree — while my background harness run was executing over that same
tree. The builder independently flagged the same contamination from its side. The clean re-run on a
settled tree and the main baseline both come back green, so the result is **void, not a finding**.
Recorded because the failure mode generalises: *a result is evidence about the conditions it ran
under, not only about the artifact*, and the background-run-versus-live-tree race has no guard in
this repo at all. Note the task notification for that run reported **exit code 0** while the harness
itself printed `at least one FAIL` — L-120 in the wild, and the reason the verdict was taken from the
printed line both times.

**Six seeds, three of them independent.** The reviewer's are load-bearing: breaking the extractor's
backtick anchor reddened the trailing-comment case; reverting `grep -qxF` → `grep -qF` reddened the
longer-path case; neutralising the unbackticked-token guard reddened only its own — each with four
named siblings green in the same run. One seed was **discarded for being a demolition rather than a
discrimination** after it over-fired across unrelated cases, and redone as a proper guard-clause
removal. Convention stated once and used throughout: `git hash-object <path>` against
`git rev-parse HEAD:<path>`, both git blob ids.

**Outside review: CLEAR on the core claim, three findings.**

- **`TD-145` filed** — the `*/archive/*` exclusion is a **case-sensitive string glob** on a
  **case-insensitive filesystem**. `docs/sprint/Archive/SPRINT-001-…md` and
  `docs/sprint/archive/SPRINT-001-…md` are the same inode (`5910974512661248`, verified at merge) and
  the first is not excluded. **Pre-existing, untouched by T3, and loud** (it over-reports on closed
  sprints rather than passing a live violation), so it is filed rather than fixed here. The reviewer
  named two sites; an independent grep at merge found **three** — `check-layers-observed.sh:344` and
  `:401`, `check-layers-completeness.sh:183`.
- The disclosed **bare-directory-token residual**: `layers-unbackticked-token` fires only for
  file-shaped tokens. Deliberate — widening it would also catch parenthetical prose ending in a
  path-like fragment, the over-eager-gate cost TD-032 exists to stop. Bounded: a bare token was never
  a valid declaration, so any file under such a directory still FAILs loudly through the unchanged
  legs. The reviewer probed for a net false negative and found none.
- A narrow **env-boundary footgun**: `LAYERS_OBSERVED_SOURCED` pre-set in the environment silently
  no-ops a *direct* invocation of the observed checker (exit 0, no output). Unreachable through
  `qa-check.sh`, which assigns it plainly and never exports it — CLAUDE.md's inherited-env trap class,
  logged rather than fixed.

**`TD-145` is this sprint's thesis one level down.** Every guard bar was satisfied for that exclusion
— it even gained its own dedicated selection fixture, `archive-path-excluded`, from T3 at this very
sprint. But that fixture validates the guard as a **string predicate**, while its real job is a
**filesystem-identity predicate**. The two agree on every case-sensitive host and diverge exactly on
the host this repo runs on. **No fixture in either harness varies path casing as a selection axis** —
every one uses lowercase `archive/` — so the class was invisible to the whole suite despite being a
one-line mechanical reproduction. That is L-186's cheap tell, found in the wild: a suite where every
fixture shares an incidental structural property nobody chose.

**Opt-in/always-on split re-examined and unchanged.** The always-on completeness harness now
exercises code defined in a file whose own harness is opt-in — but the third seed shows the always-on
harness independently catches a break in `layers_tokens()` itself, which is the only code the sourced
file contributes to a completeness run. No coverage hole.

**A4 correction, recorded rather than carried.** The T4 entry above states that A4's figure of 33
counts conformance-engine `S10` findings which never enter `qa-check.sh`'s tally. **That is wrong.**
This ledger's own promote header reads `Gate at this promote: QA-CHECK: 225 pass, 33 fail (opt-in
profile, ADR-039)` — 33 is qa-check's **own** FAIL count under the **opt-in** profile. T4's
`200 pass, 5 fail` came from the **default** profile. The two are different **profiles**, not
different populations, and are not comparable as written. A4 stays **unconfirmed** and its
reconciliation is owed at close, against the opt-in profile — where the header also notes 33 of the
82 FAIL lines traced to SPRINT-094 and SPRINT-095 not yet being archived, both of which *were*
archived at this promote, so the figure should have moved on its own.

consequence · T3 · behaviour:high · governance:med

### 2026-09-10 | owner-ruling | Three rulings: T5 second retry, allowlist widened, TD-145 tracked

**1. T5 gets one more bounded retry**, beyond the revise loop's normal single retry, by explicit
owner authorisation. The re-review returned **NOT CLEAR** with two new CRITICAL silent defects, both
verified against the real corpus before the ruling was put:

- **C1** — the row-link classifier introduced by the *first* retry is depth-hardcoded
  (`case "$_mlhref" in ../sprint/*)`), so it is wrong for **every archived epic in this repository**.
  An archived epic sits one directory deeper and links its local members two levels up. Verified at
  the ruling — and it is **four** epics, not the three the review named: EPIC-001 · 002 · 003 · 004 all
  link `](../../sprint/archive/SPRINT-NNN-…)`, while the live EPIC-014 links `](../sprint/…)`.
  `check-epic-archive.sh:228` confirms archived epics are examined and the live run names all four.
  Their local members therefore classify **external** and leave the verified set silently. **This
  reopens the exact harm F1 closed**, triggered by real directory depth rather than a typo, and it
  defeats direction (a) — *"ARCHIVED TOO EARLY … the one §11 warns about"*, the file's own words.
- **C2** — duplicate `§ Member sprints` rows: `member_row_href` exits on the first physical match, so
  a stale external row placed above a correct local still-open row wins on document order and the
  epic reports `PASS … archived correctly`. Lead 3 asked what validates the row; nothing does.

**Why the retry rather than a merge.** Merging as-is would trade a **loud false positive** (EPIC-016's
two visibly-wrong FAILs today) for a **silent false negative** (four archived epics' local members
unverified, including whether one was archived while a member was still open). This repo's doctrine
refuses that trade in every prior instance, and the silent side hides the more expensive failure.
Parking was the alternative and was rejected because the fix is now well understood: decide locality
by resolving the href **relative to the epic's own directory**, with the invariance that the same
epic must classify identically at `docs/epic/` and at `docs/epic/archive/`.

**The set property, third instance this sprint.** Every archived-epic fixture in T5's suite links its
sprint at **one** level — a depth the real archived corpus never uses — so the branch that resolves
real archived-epic rows was never a member of the tested set, and no seeded break could reach it,
because seeds are drawn from branches the fixtures exercise. **No fixture varies epic file depth.**
That is L-186's axis for this task, and it is now a required line in the retry.

**2. `.claude/settings.json`'s allowlist widened, narrowly.** `Bash(bun scripts/qa-verdict.ts:*)` and
its PowerShell twin added, mirroring the existing `sh scripts/qa-check.sh` entries exactly — two
lines, JSON re-validated. Without it every session running `bun run gate` or `bun run test` prompts,
because T4 re-pointed both scripts at the wrapper. **This is the L-172 seam made concrete:** the file
sits outside every task's `Layers:`, so no per-task DoD could have caught it, the preflight's
ownership map could not see it, and it was found only because T4's own reviewer looked past its
declared scope and disclosed it. Coordinator-owned by construction, and a permission widening, so it
was ruled rather than tidied.

**3. `TD-145` gets `TASK-342` now rather than ageing**, grouped with `TASK-338` — same family (a
checker-accuracy defect whose subject is the guard's *selection*, not its logic), different files, so
scheduled together rather than merged. The row's load-bearing line is a must-FAIL that varies path
**casing** as its selection axis, because the exclusion already has a passing selection fixture that
tests it as a string predicate when its real job is a filesystem-identity predicate.

**Flagged for close, not fixed here — stale Backlog trackers.** `TASK-328` sits open in P1 while
`TD-132` now reads `resolved → TASK-328`: a contradiction introduced by this morning's T2 closure and
left standing rather than patched mid-sprint. Likewise `TASK-300` (T1), `TASK-333` (T3) and
`TASK-334` (T4) are the Backlog trackers for tasks now complete, and `TASK-337` tracks T5, still open.
Routing completed trackers is `/lean-doc-generator close`'s job (STANDARD §10), so they are recorded
here where close will read them instead of being edited around now.

consequence · owner-ruling · behaviour:low · governance:high

### 2026-09-11 | T5 | Member set scoped to sprints this repo owns; four review rounds. 31 of 32 DoD

**The fix, and the owner ruling behind it.** `member_sprints:` was parsed by splitting on whitespace
as well as commas, which severs a repo qualifier from the id it qualifies: `workdoo SPRINT-001`
became the independent tokens `workdoo` · `001` · `(closed)`, the first and third globbed nothing and
vanished, and `001` then resolved against **this** repository's own SPRINT-001. EPIC-016's two rows
were validated against lean-flow sprints that have nothing to do with them. Reproduced first against
the real artifact, as A3 required: `b255f87^` exits 1 naming both cells (`eb3d9e7` vs `b0f2695`,
`28c5203` vs `007869e`).

One `_member_entries` extractor now splits on **commas first**, so the qualifier is still attached
when the id is read, and emits `<scope> <num>` per entry. `_members_scan` and `closed_members` both
read it and skip foreign members; class (c) attribution deliberately keeps them, because it matches
**text**, not files. **A3 confirmed and already corrected at promote**: there is no `member_plan()`;
resolution lived in two helpers across four globs.

**Owner ruling (DoD 2):** a foreign member is **named by a non-gating `NOTE`**, never silently
skipped — silence is an unchecked row, the failure one level down from the false positive. **Second
ruling, on a finding not in the Plan:** `unknown_members()` had **zero callers in the entire
repository** while its own header declared unknown members *"NAMED on the report … never silently
skipped (L-058)"*. For five sprints this file documented a reporting behaviour it did not have.
Wired to the same emitter; it fires on five retained fixtures.

**Why NOT the mechanism the earlier ruling prescribed.** The 2026-09-10 owner ruling said to decide
locality by resolving the member row's href **relative to the epic's own directory**. This does not
read the href at all. Surfaced before merging rather than taken silently, and approved on evidence:
classifying from frontmatter makes C1 **unreachable by construction** (the epic's path is never an
input), and the invariance the ruling demanded was proven directly — the same epic file, byte
identical (`git hash-object` equal), classifies `local 933` at `docs/epic/` and at
`docs/epic/archive/`. Old-vs-new resolution across all 16 epics: **EPIC-016 is the only one that
changes**; EPIC-001 · 002 · 003 · 004 keep their full local member sets, which is C1's exact subject.

**Four independent review rounds, all worktree-isolated. Every one returned NOT CLEAR.** L-165 held
five times out of five: not one of these was reachable from inside the work, and several were found
only by re-running a *previous* reviewer's own seed against the fix that claimed to close it.

- **Round 1** (5 findings) — direction (a) claimed *"every member sprint closed"* on members it
  resolved none of; frontmatter was sole authority on locality, so one stray qualifier silently
  unverified a member whose Plan sat on disk; the `_members_scan` guard was **deletable with the
  suite green**, because every selection fixture's collision partner was CLOSED; the unknown NOTE
  was emitted by five fixtures and asserted by none.
- **Round 2** (7, two CRITICAL) — round 1's narrowing landed on the two `ok` lines and missed the
  `bad` one, the only line that **demands** an archive; entries naming no sprint number were dropped,
  uncounted, and received the fully affirmative claim — with **this plugin's own shipped
  `EPIC.md.template`** as the motivating artifact, its default `member_sprints:` selecting nothing at
  all. Round 2 also re-seeded all five round-1 fixes and confirmed each held.
- **Round 3** (10) — **a CRITICAL that was a regression introduced in round 2**: the `unparsed`
  branch fed arbitrary file prose into `allmem`, which `ticked_unattributed` interpolates into a
  dynamic awk regex, so prose carrying `(` aborted awk mid-file — class (c) never ran, the epic
  reported PASS, and the run exited **0**. Dated across commits: present at `b255f87^`, **fixed
  incidentally by `b255f87`**, put back by `1e42c42`. Plus a MAJOR introduced by round 3 itself — the
  narrowed `bad` branch failed the gate on an epic it had just said nothing was demanded of, and both
  remedies it offered were unachievable by construction; verified to turn **EPIC-016 red** once its
  nine conditions tick, which is TD-144's own harm one branch over.
- **Round 4** — repaired by **subtracting**, on owner ruling, because every defect after the core fix
  came from logic added later: one awk clause excludes `unparsed` from `allmem`; the contradictory
  `bad` became an `ok`. Product logic shrank.

**The set property, four times over (L-186).** Each round found one axis the fixtures held constant
by accident: **id shape** (all 17 original fixtures wrote `[SPRINT-NNN]` while the live tree has
always used three shapes) · **epic file depth** (no archived-epic fixture had a `§ Member sprints`
table at all, while the real archived corpus links two levels up) · **all-local-or-all-foreign** (no
fixture mixed them) · **member order** (the one mixed fixture listed the foreign member first, which
is structurally blind to `report_unresolvable`'s own skip). Suite **17 → 34 cases**.

**Three fixes shipped without a reader, each caught only by re-seeding.** The repair for round 3's
CRITICAL left all 33 cases green whether applied or not; `unverified_count`'s unknown half was
unasserted; the collision glob's live arm was unasserted. A fix for a silent false negative that is
itself unguarded is the same defect one level along.

**Two fixtures were asserting a two-part test while supplying one part.** `properly-archived` and
`eligible-unarchived` have each named a member sprint since SPRINT-055 that the fixture never
modelled, so both exercised §11's member half against a member the checker could not resolve. Both
members are now modelled. This surfaced only because the narrowing made the gap visible.

**Seeded-break discrimination, one stated convention throughout** — `git hash-object <path>` against
`git rev-parse HEAD:<path>`, both git blob ids, so the working tree's CRLF cannot enter the evidence
(L-169). Every seed verified **landed** (blob differs), **parsing** (`sh -n`), and **targeted** (line
count within one), with the file restored to its HEAD blob after each. Eleven seeds discriminate,
each reddening only its own case with siblings green.

**Two of my own seeds were invalid and scored as results until checked.** One reported a clean green
while **never applying at all** — `sed 's///2'` matches the second occurrence *within a line*, not
the second line — so it proved nothing (L-137's verify-the-seed-landed rule firing for real). Two
others broke the script's **syntax** rather than its logic and reddened every case for the wrong
reason; a demolition is not a discrimination (L-142). All three were visible only because the seed
loop printed `landed=` and `parses=` beside the suite result rather than the suite result alone.

**Gate.** `QA_FULL=1` ran to completion on this host and **verdicted** — `QA-CHECK: 228 pass, 2 fail`
— which contradicts the standing Backlog note that it cannot verdict here; that note is stale and
should be corrected at close. T4's wrapper read it correctly as an ordinary red gate. **A4 cannot be
reconciled as written:** the promote's figure of 33 was never comparable to a FAIL-line count. See
TD-146.

**Filed, not fixed:** `TD-146` (medium) — the conformance engine's *informational* findings print
with the same `FAIL ` prefix as gating ones, so the verdict line and the visible FAIL lines disagree
with nothing marking which is which. Not a counting bug: leg 2f-ter keeps the engine informational
deliberately, since 27 of 43 dispositions are unbuilt. The first diagnosis in-session was wrong and
is corrected on the row. The same shape is already recorded **and misread** in this sprint's own
promote note, where `225 pass, 33 fail` against 82 FAIL lines was read as *"33 of the 82"* — a subset
rather than a different population. `TD-147` (minor) — `(closed)`/`(active)` member annotations are
parsed and discarded. Ids derived from the maximum in use with `.claude/worktrees/` excluded (L-170),
agreed by two differently shaped queries; both returned 145, so the exclusion did not change the
answer this time.

**Open at this entry:** review round 4 is running. Round 3's MAJOR-1 (`member_sprints: []`, an absent
key, and a YAML block sequence still receive the fully affirmative claim) and its MINOR-2/3 are open
and unfiled pending that verdict.

consequence · T5 · behaviour:high · governance:high
