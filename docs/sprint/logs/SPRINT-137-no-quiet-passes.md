---
sprint: 137
slug: no-quiet-passes
owner: Maintainer
last_updated: 2026-10-22
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-137 — Execution Log

> Append-only companion to [`../SPRINT-137-no-quiet-passes.md`](../SPRINT-137-no-quiet-passes.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-22 | promote | plan locked, governance signed, four members: TD burn-down #3
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. All 11 active entries are at count 1. Census, position-anchored: 11 active + 213 promoted + 1
  superseded = 225 headers (a substring query returned 12 active, counting L-155's header, which quotes the status string).
- ☑ TD aging (recorded here, per L-242): 94 of 97 open rows aged against sprint 137; TD-264, 265 and 266 are younger, so
  nothing is newly aged. None is `high`. No re-review this promote (SPRINT-136's was two days ago).
- ☑ doc-aging, §11 (owner-approved, applied in `3bf04fa5`): TASK-467, 468 and 469 (SPRINT-134) pruned. None has a live `.md`
  citation by two routes (a scan of 951 tracked non-history `.md` files, and a filesystem grep with worktrees excluded that
  found only archive, LEARNINGS and done-folder hits). No TD deletion is due (the 14 resolved rows date from sprints 135 and
  136), no CHANGELOG rotation (PATCH) and no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0.
- ☑ epic rollup currency and epic coverage: no active epic (EPIC-005 is parked). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: decomposed 2026-10-22 (`737af78a`). Owner rulings by popup: TD-163 by removing live-row sprint state, TD-099 FAILs
every non-`Tn` key, TD-148 items 2, 4, 5, TD-194 left out. The read-only Codex review returned APPROVE WITH FIXES. Four
blockers were folded in before `approve`; its fifth (TASK-480 as consequential G) was put to the owner, who kept other G as
TASK-471 was.
Size check: 4 S, no `L`. All four are `origin: decomposer`. No epic.

### 2026-10-22 | gate | G1 + G2 signed by the owner by popup; four builder checks settled; preflight ruling
G1: fast path. All four members are `origin: decomposer` and their scope is unchanged since `approve` (`737af78a`); promote
added only the `sprint:` stamp. G2: designs as settled below. T2–T4 run in parallel, worktree-isolated (no `Depends-on:`,
disjoint code files); T1 is a one-paragraph docs edit the coordinator makes inline. Review cap is 2 rounds each.
Assumptions: A1 confirmed (0 non-`Tn` consequence keys in live logs; the only live log is this one). A2 confirmed (the six
parse lines are one line once indentation is trimmed and `$nrr_out` is read as `$out`). A3 confirmed by a route that is not
the checker: all 17 epics carry exactly one `member_sprints:` line, inside frontmatter, with balanced parens; the checker's
own baseline is 17 verdict lines, exit 0.
builder-check · T1 · 1 contradictions · 3 questions · design fixed: the read-back targets the INDEX lines, not the epic files;
"live" is defined by file location (six of the eight are closed in place); transferred workdoo rows are described as records
frozen at transfer; the paragraph bans only member-sprint state and claims nothing wider.
builder-check · T2 · 0 contradictions · 2 questions · settled: the stripless control asserts "empty or not the true count"
(the `|| n_pass=0` fallback is a separate line); the seeded revert is restored before anything is staged.
builder-check · T3 · 0 contradictions · 5 questions · settled: the selector is `^consequence ·( |$)` over the normalised line,
the key runs to the next ` · ` or end of line, a bad key gives one finding and skips the token check, the live run covers
every non-archived log, and the 24-line census is reconciled line by line (never rounded). Changelog wording is the
coordinator's at release.
builder-check · T4 · 1 contradictions · 4 questions · design fixed: there is no block-sequence reader to keep (the zero-entry
FAIL from SPRINT-136 T1 names that case); no or unterminated frontmatter reads as no key; tests add the `)`-only case and
assert the foreign NOTE is absent; the two anchor sites are named for the seeded removal.
owner-ruling (G2 popup, 2026-10-22): the dispatch preflight's six `shared-file-unowned` FAILs, all on `TECH-DEBT.md`, are
accepted under D1. Builders must not touch `TECH-DEBT.md` (diff-checked at merge-back); the coordinator writes each resolution
serially as a bare `sprint(137):` commit. Base-ref PASS at `8bdbb627`; waves T1=0 T2=0 T3=0 T4=0.

### 2026-10-23 | scope-change | T3 (TASK-480): § Plan T3's Acceptance reworded so the layers-completeness leg stops reading `pre-T1` as task T1
What broke: `check-layers-completeness.ts` FAILs "### T3 Depends-on completeness: DoD/Acceptance references T1, absent from
Depends-on". T3's frozen Acceptance quotes the record key `pre-T1`, and the checker's task-reference match has no left boundary,
so it reads the `T1` inside `pre-T1` as a task. T3 neither depends on nor cites T1. Found while ticking T1 (tick-box re-runs
the check); the leg would have reddened system verify.
Impact: T3's Acceptance wording changes, its meaning does not: "TD-099's `pre-`-keyed consequence line FAILs by name, and every
well-formed record keeps its verdict." No member Done-when changes. The checker defect is filed as TD-267, not fixed here.
owner-ruling: popup, 2026-10-23 — "Reword, file TD", over adding T1 to T3's Cites (a citation that is not real). G2 stands.

### 2026-10-23 | progress | T1 (TASK-478) done: the epic index says what a live row may hold
Inline by the coordinator (one header paragraph, no code), `83882f79`; TD-163 resolved in `43023612`. A live row holds its
status and a pointer, never a member-sprint pointer or a tick count; archived and moved-to-workdoo rows are frozen records;
`update_trigger` unchanged. Read-back: 8 live row lines for the 8 files in `docs/epic/`, each with 0 sprint pointers and 0
"N of M" counts, so nothing was reworded. prose-density 28/0, doc-caps exit 0. Self-review: the paragraph claims nothing
beyond member-sprint state (builder check).
consequence · T1 · behaviour:low · governance:low

### 2026-10-23 | progress | T2, T3, T4 built in parallel worktrees and merged; review dispatched
All three verified base `68b34da9` at spawn and touched only their declared files (no `TECH-DEBT.md`, D1 held). Cherry-picked
as `e4eb536e` (T2), `7f56266e` (T3), `9d762603` (T4); TD rows written by the coordinator in `8f8b5425`. Coordinator re-ran on
main: dod-delta harness PASS at 111 tests; review-depth fixtures all green, live log green; epic-archive suite 60/0, real run
`cmp`-identical to the G2 baseline (17 lines, exit 0), fixture harness green.
consequence · T2 · behaviour:material · governance:low
consequence · T3 · behaviour:material · governance:low
consequence · T4 · behaviour:material · governance:low

### 2026-10-23 | progress | T2, T3, T4 reviewed (scoped, one round each); one retry, one nit folded
review · T2 · scoped-reviewer · behaviour:material · governance:low
review · T3 · scoped-reviewer · behaviour:material · governance:low
review · T4 · scoped-reviewer · behaviour:material · governance:low
T2: Spec clear (the two selectors are independent: a lost strip, a reworded parse or a changed invocation each fails
loudly). Standards worst = nit: the test-count floor trailed the real count by 8 (inherited), folded as `7fc4e154` (111).
T3: Spec clear (24 key findings over all archived logs, matched by a second route). Standards worst = nit: the key text in two
degenerate shapes (`consequence · T1 ·`, an empty slot) reads oddly; the verdict is right, so no retry and no TD.
T4: Spec worst = should-fix: the `)`-only case did not discriminate (the old code already read it as unparsed). One bounded
builder retry, `14b0b15c`: input `closed) 802`, which goes red with the guard removed; restored hash matches `ccc138a2`.
Standards worst = nit (BOM or `--- ` reads as no frontmatter, consistent with `frontmatterValue`). Suite 60/0 after merge.

### 2026-10-24 | progress | T2, T3, T4 (TASK-479, 480, 481) done: 13 boxes ticked against evidence re-run on main
Every box was re-verified on main before its tick (`b4d21ed5`), not taken from the build reports. Harnesses: dod-delta 111/0,
review-depth all green, epic-archive 60/0. Seeded reverts, each restored with `git hash-object` == `HEAD:<p>`: the ANSI strip
removed from `run-authority-fixtures.sh` fails exactly that harness's case (110/1); each epic-archive suffix anchor removed fails
only its own test (59/1 each). Real artifacts: SPRINT-087's archived log at a non-archived path PASSes the pre-fix checker and
FAILs the fixed one on `pre-T1` ×5 (its 5 lines) and `pre-close` ×3; the live log PASSes; the epic-archive real run before
`9d762603` and after is byte-identical (17 lines, exit 0). Population cross-check by a second route: 6 harnesses with a live
`bun test` call = 6 with a live `n_pass` parse. Moves in their own commits: `1a009e69`, `f158099d`, `5267a0f4`.
`check-sprint-by-reference --close`: 10 pass, 0 fail.

### 2026-10-24 | scope-change | T3 (TASK-480): § Plan T3 Cites: gains the layers-completeness checker the 2026-10-23 entry names
What broke: system verify on the VPS (`8bbf0229`, `QA_FULL=1`) FAILs `scope-change-outside-layers`: the 2026-10-23 T3 entry
names `scripts/lib/check-layers-completeness.ts`, which is in no T3 `Layers:`/`Cites:` (L-229). The file is genuinely read by
T3: its Acceptance was reworded to satisfy that checker. The same leg also tags that entry T1, reading the `T1` inside the
record key in its heading as a task (TD-267's defect, at a second site; TD-267 is widened, not fixed here).
Impact: T3's `Cites:` gains one path; no `Layers:`, Acceptance or member Done-when changes. G2 stands.
owner-ruling: popup, 2026-10-24 — "Cite it in T3", over an ADR-021 override or a checker change; TD-267 widened.
