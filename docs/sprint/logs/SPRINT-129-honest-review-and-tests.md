---
sprint: 129
slug: honest-review-and-tests
owner: Maintainer
last_updated: 2026-10-19
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-129 — Execution Log

> Append-only companion to [`../SPRINT-129-honest-review-and-tests.md`](../SPRINT-129-honest-review-and-tests.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line budget (STANDARD §9 ·
> ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry carrying the signed
> governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a `scope-change` entry — what broke ·
> impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-19 | promote | plan locked, governance signed, four members: the reference re-scan keepers
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Engine `S10.PROMOTION` PASS; second route: the three active entries (L-236 · L-234 · L-210) are each
  at count 1.
- ☑ TD aging: 100 of 106 open rows aged against sprint 129. Second route: 106 open + 20 resolved = 126 rows, the same total by a
  distinct-id count. None newly aged (no row filed at 126). No open row is `high`. TD-090 had lost its route (TASK-322 cancelled)
  → re-routed to TASK-367 by owner ruling at this promote.
- ☑ doc-aging: §11 store prune of `done/TASK-435` · `436` · `437` (closed SPRINT-126; no live citation found by a repo-wide scan
  excluding closed history), owner-approved, applied before this commit. TD deletion: none due (all 20 resolved rows resolved at
  128 → due at 131). CHANGELOG and LEARNINGS: engine `S11.CHANGELOG` · `S11.LEARNINGS` PASS. §2 caps: no breach; two soft
  overruns already retained in `.cap-dispositions` (`epic-017-effectiveness.md`, `LEAN-FLOW-PRE-EPIC-…-V3.md`).
- ☑ epic rollup currency · epic coverage: no active epic (two proposed, exempt). ☑ roadmap coverage: no roadmap in this repo.
  ☑ handoff ledger: none.
Size check: 4 S, no `L`. All four members are `origin: decomposer` (re-decomposed at intake from hand-filed TASK-448 · 449 · 450,
now in `cancel/`), so each G1 is the fast-path confirm.
Same-day context: the members' source research is `docs/research/mattpocock-scan5.md` and `brainstorming-adaptation.md` §
Re-scan, both Codex-reviewed to CLEAR before this promote.

### 2026-10-19 | gate | G1 + G2 signed by the owner (one popup round); attended sprint-bulk, waves T1 · T3 · T4 → T2
G1: batch fast-path confirm, all four members `origin: decomposer`, scope unchanged since `plan_commit` b1712732.
G2: design per task as presented (T1 a fifth brief bullet + the Standards axis names its docs · T2 a declined-to-judge list +
spec-silence rule · T3 a landed-mutation rule in Phase 5 · T4 whole-suite-passes before a slice is done + name-the-break
checklist line + a pointer from test-standard.md § Regression gate). Real exercises: T1 on the T3/T4 review briefs · T2 on one
scoped review of its own diff · T3 a seeded must-FAIL fixture in an isolated worktree, cmp landed and restored · T4 one genuine
red/green cycle in an isolated worktree with the full `bun test` run; nothing from the exercises is committed.
Verification: line caps → `bun scripts/lib/check-doc-caps.ts` (EXISTS · RUNS · REACHES skills/diagnose|tdd/SKILL.md · PROVES the
cap); wording boxes are judgment ticks backed by read-through + the Codex loop (D3); CHANGELOG boxes tick at the close release (D1).
Dispatch preflight: CLEAR (base-ref = HEAD bed7b10f · waves T1=0 T2=1 T3=0 T4=0 · review-scoping.md owned T1 → T2).

### 2026-10-19 | progress | wave 1 built (T1 · T3 · T4), worktree-base guard PASS ×3; pre-merge review next
Worktree-base guard: PASS for all three wave-1 worktrees (each branched from coordinator HEAD 41bc1040). Thirteen older agent
worktrees under `.claude/worktrees/` from earlier sessions are stale or divergent; not this sprint's, left untouched.
T1 → `24164aed` (review-scoping.md +7/−2; lean-flow-path grep on the diff: empty). T3 → `ca892ea5` (diagnose SKILL.md +4, 98
lines). Exercise: a `sed` mutation was caught by the `cmp` proof as having stripped every CR (collateral, discarded before the
harness ran); an Edit-tool one-line mutation of `tick-box.ts` landed (cmp: byte 4990, line 103), reddened exactly the claim case
(12 pass, 1 fail), restored with cmp-identical proof, 13/0. T4 → `20990007` (tdd SKILL.md +6, 104 lines; test-standard.md +1
pointer). Exercise: a new `frontmatterValue` test was green at once (behaviour existed), so the name-the-break check was applied
(removing the `---` stop failed it); whole `bun test` 429 pass · 1 fail · 2 errors, each named: the fail is TD-154 (reproduced on
main by the coordinator, pre-existing), the two errors are the worktree's missing `node_modules` (typescript present on main).
consequence · T1 · behaviour:low · governance:high
consequence · T3 · behaviour:material · governance:low
consequence · T4 · behaviour:material · governance:low

### 2026-10-19 | progress | wave 1 reviewed and merged: T1 · T3 CLEAR first pass; T4 one finding, fixed in its one retry, re-review CLEAR
Pre-merge review (Codex, scoped brief under T1's new wording — standards docs supplied as `.claude/CLAUDE.md` excerpts, each
Standards axis named them: T1's real exercise). T1 Standards CLEAR · Spec CLEAR. T3 Standards CLEAR · Spec CLEAR. T4 Standards
CLEAR · Spec FINDING: `test-standard.md` § Regression gate still restated the whole-suite pass rule beside the new pointer —
duplicated against the owner's single-location ruling. Revise loop: one builder retry → `43c029bf` (the gate now defers to `/tdd`);
re-review: CLEAR.
Merge-back on integration worktree `integ-129`, `--no-ff`, ownership order: T1 `c4e8f78b` · T3 `8923beec` · T4 `730a8e1d`; no
conflicts, no duplicate member id. Post-merge legs: doc-caps (diagnose 98 · tdd 104 ≤ 140) PASS, prose-density 28/0. main
fast-forwarded to `730a8e1d`. Ticked via tick-box (both checkers pass): TASK-451 boxes 1–3 · TASK-453 boxes 1–2 · TASK-454
boxes 1–3. Open: each member's exercise + CHANGELOG box, ticked at the close release (D1).
