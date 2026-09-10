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
