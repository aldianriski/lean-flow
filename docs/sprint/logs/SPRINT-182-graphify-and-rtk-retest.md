---
sprint: 182
slug: graphify-and-rtk-retest
owner: Maintainer
last_updated: 2026-11-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-182 — Execution Log

> Append-only companion to [`../SPRINT-182-graphify-and-rtk-retest.md`](../SPRINT-182-graphify-and-rtk-retest.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-20 | promote | plan locked, 3 members: TASK-676, TASK-677, TASK-678 (3 plan steps)
Owner rulings, verbatim. Intake and draft check, earlier: popups "Harness", "Questions", "Budget", "Split", "Test pipelines too", "Own ABBA", "RTK bar", "RTK release"; the three tasks were amended after the blind draft check with owner approve. Promote popups: Q1 "Upgrade global to 0.9.103" (graphify upgraded to 0.9.103 by the coordinator; TASK-677 amended in `51b43832`, covering the install, cleanup, hook-evidence and version boxes) · Q2 "Promote to LEARNINGS rule (Recommended)" (L-326) · sign-off "Sign, write it" (the governance checklist and sprint draft below, the commit plan with the TASK-677 amendment first; it is not the G1 or G2 sign-off).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign, write it".
- ☑ L-promotion: three candidates with count 2 and `promoted: no`, L-326, L-293 and L-255 (an awk over the `- count:` and `- promoted:` lines, a count of 30 `count >= 2` lines of which 27 are already promoted or merged, and a next-line `promoted` grep agree). L-326: promoted into `docs/LEARNINGS.md` § Durable rules › host-tooling next to L-306, disposition move-to-reference, body collapsed to a pointer, no CLAUDE.md or CONTEXT line (both at their caps; `record-line.ts` is lean-flow-only). L-293: retain; it needs a rule in an always-loaded doc and CONTEXT is at its cap; this sprint's nested `claude -p` runs are its next exercise, so G2 names the launcher. L-255: retain; covered by L-246, L-007 and CLAUDE.md's must-FAIL rule, and T1's key-check pass is its next exercise.
- ☑ TD aging: 122 open rows (78 low, 24 minor, 13 medium, 7 trivial, none high); the row-start pattern and the `status: open` filter agree. 120 were created at Sprint-179 or earlier, so aged three sprints or more against 182; TD-317 (Sprint-180) and TD-318 (Sprint-181) are younger. Nothing escalates. Disposition: keep all open, no re-review sweep. TD-316 and TD-318 are host-specific harness failures, so the off-host gate is the verdict.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 106 PASS, 1 FROZEN, 4 retained, 16 skips (absent files), no FAIL or WARN. At the limit: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, token budget ~12634 of 12691; nothing here edits either. CHANGELOG rotation not due (`[Unreleased]` empty; v2.26.0 and v2.25.0 inline). Task-file prune: none eligible; TASK-670 is the only member of a sprint closed three or more sprints ago and `HANDOFF-LEDGER.md` cites it live, a `git grep -il` agrees. LEARNINGS pointer-collapse: L-326 only, per the promotion.
- ☑ epic rollup currency: EPIC-025 is the only active epic; its rows for SPRINT-172 and SPRINT-173 carry `close_commit` (`51b651fd`, `b114943b`) and its header is not older than its newest member close. None. EPIC-005 is proposed (exempt); EPIC-026 is closed and archived.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. 0 uncovered, no override. This sprint touches no active epic.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent).
- ☑ handoff ledger: none live; the latest entry for the one path is `spent`.
Sprint number: 182, the maximum in use plus one. Re-derived with the Glob tool and the INDEX lines (newest SPRINT-181, archived); `.claude/worktrees/` holds no repo copies.
Composition: 3 members, all size M, no epic, no stream. One wave each: W1 T1 (TASK-676), W2 T2 (TASK-677, `Depends-on: T1`), W3 T3 (TASK-678, `Depends-on: T2`); the blockers join the sprint, so no state change. Commits: amendment `51b43832`, status move `0dd5aab5`.
Baseline gate (off-host, run by the coordinator on `51b43832`, its own call, exit code 0):
```
gate-remote: ran 51b43832d757690728dbb49ae7bc538b1880b913
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 227 pass, 0 fail (rc 0)
```
G2 notes: (1) the launcher of the nested `claude -p` runs and its approval route are named at G2 (L-293); a builder stages only. (2) The probe lives in a root-level `retest-probe/`, uncommitted, staged around by explicit paths, not in `.gitignore`. (3) The 8.00 USD cap is shared; T2 must leave T3 enough for four runs and a scorer. (4) T3's first box finds the newest stable full RTK release at least 14 days old with pipelines, else the arm reports "not run".
Pre-lock rewording: TASK-677's cleanup box said `.claude/CLAUDE.md` (workdoo's file); promote-check read it as a lean-flow path missing from T2's Layers, so the box now says "workdoo's tracked project CLAUDE.md". Same meaning, done before `plan locked`.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:low · governance:low
