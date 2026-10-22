---
sprint: 136
slug: read-what-is-there
owner: Maintainer
last_updated: 2026-10-22
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-136 — Execution Log

> Append-only companion to [`../SPRINT-136-read-what-is-there.md`](../SPRINT-136-read-what-is-there.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-22 | promote | plan locked, governance signed, four members: TD burn-down #2
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. All 10 active entries are at count 1. Census, position-anchored: 10 active + 213 promoted + 1
  superseded = 224 headers.
- ☑ TD aging (recorded here, per L-242): 103 of 105 open rows aged against sprint 136. Nothing newly aged (TD-262 and 263,
  filed at 133, were resolved at 135). None is `high`. Re-review, applied in `9d9f4b10`:
  - TD-149, 125, 144 and 173 resolved, each with its code evidence.
  - TD-204 resolved by owner ruling. Its own condition was the consumer-parity tasks plus README § Upgrading, both met.
  - TD-194 and TD-099 narrowed to their remaining halves.
  - TD-128 stays open: an owner ruling keeps its Windows half.
- ☑ doc-aging, §11 (owner-approved, applied in `9d9f4b10`): TASK-438 (SPRINT-127) and TASK-466 (SPRINT-133) pruned. Neither
  has a live `.md` citation by two routes (a `git ls-files` scan of the live set, and a filesystem grep with worktrees
  excluded). TASK-438 became due once SPRINT-135, whose Plan cited it, was archived. The cancelled TASK-322, 347 and 461 stay
  (cited). No TD deletion, CHANGELOG rotation or LEARNINGS collapse is due.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0, and three over-cap files are already dispositioned.
- ☑ epic rollup currency and epic coverage: no active epic (EPIC-005 is parked). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: decomposed 2026-10-21 (`8ed37443`) from a two-route census of the 29 open medium rows. The read-only Codex review
returned APPROVE WITH FIXES, and its three blockers were folded in before `approve`.
Size check: 4 S, no `L`. All four are `origin: decomposer`. No epic.

### 2026-10-22 | gate | G1 + G2 signed by the owner by popup; four builder checks settled; two rulings
G1: fast path. All four members are `origin: decomposer` and their scope is unchanged since `approve` (`8ed37443`).
G2: designs as settled below. All four run in parallel, worktree-isolated (no `Depends-on:`, disjoint code files). Review cap
is 2 rounds each. Assumptions: A1 confirmed (epic-archive differential 34/0, doc-caps differential 26/26, and no differential
fixture uses a newly read form: every archived epic fixture has a non-empty member list, no guide fixture has a Cap cell whose
digits do not lead, and the doc-caps differential lists its cases explicitly). A2 confirmed (out of scope). A3 confirmed by
two routes: 426 starred `Verify:` clauses hold one TypeScript form, `bun scripts/lib/check-dod-delta.ts`, which is TD-191's own
quoted example; a case-insensitive `verify:` grep over tracked `.md` (21 lines) finds no other shape.
builder-check · T1 · 3 contradictions · 4 questions · design aligned: the regression fixtures are inline in the TS suite
(retained there, no new fixture directory); the finding says "no member sprint this checker can read", so a non-empty block
sequence is not called empty, and a truly empty block is tested too; an indented `[ ]` flushes like a column-0 one; the
`.sh char class` comment is updated. Facts: no live or archived epic has an indented or `[X]` Closed-when box, so real verdicts
cannot move; the empty-member FAIL is direction (a) only.
builder-check · T2 · 1 contradictions · 2 questions · owner ruling (scope-change below): strict grammar plus `each`. Facts: every
live §2 Cap cell carrying digits starts with them (dump of all 67 cells read), so the before/after row dump must be identical,
and check-prose-density's population cannot move.
builder-check · T3 · 0 contradictions · 4 questions · facts: the verbatim TD-191 clause counts as a mechanical clause once `.ts`
is recognised (the NOTE line's count is `clauseScripts(c).length > 0`), so no target is invented for the replay. The `.ts`
comment strip is line-start (`//`, `/*`, `*`, `*/`), the analogue of the `.sh` `#` strip, with a JSDoc-line control.
builder-check · T4 · 0 contradictions · 0 questions · nothing important left.
owner-ruling (G2 popup, 2026-10-22): the dispatch preflight's six `shared-file-unowned` FAILs, all on `TECH-DEBT.md`, are
accepted under D1. Builders must not touch `TECH-DEBT.md` (diff-checked at merge-back); the coordinator writes each resolution
serially as a bare `sprint(136):` commit. Base-ref PASS at `7cdc9d07`; waves T1=0 T2=0 T3=0 T4=0.

### 2026-10-22 | scope-change | T2 (TASK-475): the cap grammar admits `each`
What broke: TASK-475's first Done-when box allowed only `soft` or `hard` after the leading integer, but the live §2 cell for
`flows/<slug>.md` reads `100 each`. The strict grammar would have FAILed it, contradicting the second box (the real tables yield
today's rows). Impact: the grammar becomes `~`? integer, an optional `soft`, `hard` or `each`, and an optional parenthetical;
any other cell carrying digits is a named finding. T2 stays S. owner-ruling: G2 popup, 2026-10-22 — "Strict + `each`". G2
re-confirmed in the same popup.

### 2026-10-22 | progress | T3 (TASK-476) done: verify-reaches reads a TypeScript checker as mechanical
Built in an isolated worktree on base `40569940` (verified at spawn), cherry-picked as `fe5dc392`; TD-191 resolved in `87227227`.
`clauseScripts()` takes `.sh` and `.ts`, so `bun <path>.ts` needs no special case; a `.ts` method strips line-start `//`, `/*`,
`*` comments, and `.sh` keeps its `#` strip. RED: the old checker passed all five new fixtures as judgment ticks. Coordinator
re-ran on main: harness 27 PASS / 0 FAIL (22 prior cases unchanged). Replay of TD-191's verbatim clause in a non-archived temp
sprint: NOTE mechanical count 0 → 1.
consequence · T3 · behaviour:material · governance:low
review · T3 · scoped-reviewer · behaviour:material · governance:low
Review (scoped, one round): Spec worst = clear. Standards worst = should-fix: a target in a trailing `//` comment or on an
unprefixed block-comment line reads as reached, and a `.ts` named as a target beside a `.sh` method becomes a second method.
Census before any retry (ADR-053 §5): 0 live `Verify:` clauses name a `.ts` method, and the `.sh` strip has the same trailing gap,
so no retry: filed as TD-266 (`87227227`).

### 2026-10-22 | progress | T1 (TASK-474) done: epic checks read every box form; an empty member list is named at archive
Built in an isolated worktree on base `40569940`, cherry-picked as `6a51a673`; TD-130 resolved and TD-148 narrowed in `87227227`.
One shared box predicate serves the open, total and attribution readers (`[X]` closed, indented boxes counted, an indented box
starts its own attribution block). Direction (a) FAILs an archived epic with no member entry the parser can read. RED: 7 of the
new inline cases failed on the old code; GREEN 48/0; differential 34/0 (shell twin frozen, divergence documented in the code).
Real run: exit 0, 17 verdicts byte-identical before and after (9 archived epics, not the 7 the design stated: its census grep
was truncated by a `head`, and the builder's run covered all 9).
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped-reviewer · behaviour:material · governance:low
Review (scoped, one round): Spec worst = must-fix, TD-130/148 not yet marked, which is the coordinator's write (done in
`87227227`). Standards worst = nit: a nested ticked sub-box without its own SPRINT-NNN is now flagged, which is the intent.

### 2026-10-22 | progress | T2 (TASK-475) done: doc-caps reads the cap only from the start of the cell
Built in an isolated worktree on base `40569940`, cherry-picked as `d69ff70f`; TD-062 resolved in `39b7fa34`. `parseCapCell()`
implements the owner-ruled grammar; one table walk feeds `deriveRows` (unchanged type and rows) and `malformedCapCells`, which
FAILs `cap-cell-unparsed`. Behavioural RED, run by the coordinator: today's checker reads `see row 3; 120` as cap **3** and
passes; the fixed one FAILs it by name. `deriveRows(spec/STANDARD.md)` JSON identical before and after (28 rows); tests 63/0;
differential 26/26; prose-density 10/0; real run exit 0, no `cap-cell-unparsed` line.
consequence · T2 · behaviour:material · governance:low
review · T2 · scoped-reviewer · behaviour:material · governance:low
Review (scoped, one round): Spec worst = should-fix, TD-062 not yet marked (the coordinator's write). Standards worst = nit:
`~ 100` and `120soft` parse (harmless), and an all-malformed table hits the "derived 0 rows" FAIL first, so it FAILs without
naming the cell. That is unreachable on the real table (28 valid rows), so no retry and no TD.

### 2026-10-22 | progress | T4 (TASK-477) done: one name per helper in the sprint-family harness
Built in an isolated worktree on base `40569940`, cherry-picked as `f256c46f`; TD-172 resolved. The second `learn_entry()` is
`learn_entry_body()` at its definition and three calls; the first and its calls are byte-identical (4+/4-, one file). Census:
8 hits, all in the harness, none under `scripts/`. Runner output diff-empty before and after (137 lines each, exit 0, all
green). The harness re-runs at system verify.
consequence · T4 · behaviour:low · governance:low

### 2026-10-22 | gate | system verify PASS 301/0 (VPS, f2aa13c9)
system-verify · PASS · QA_FULL=1 sh scripts/qa-check.sh
Run on the VPS against `f2aa13c9` (git bundle, clean detached checkout): `QA-CHECK: 301 pass, 0 fail`, exit 0. The legs for every
touched checker ran and passed: run-epic-archive-fixtures.sh, run-doc-caps-fixtures.sh, run-doc-caps-differential.ts,
run-verify-reaches-fixtures.sh, run-sprint-family-fixtures.sh (T4's rename, re-run here rather than locally). The total is two
above SPRINT-135's 299; the two legs were not attributed, because that run's log is gone. No leg FAILed or dropped to silence
on this run. Plan exhausted: 4 of 4 members in done/, 14 of 14 DoD ticked, PLAN_EXHAUSTED.
