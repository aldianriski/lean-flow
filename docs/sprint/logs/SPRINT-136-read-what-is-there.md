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
