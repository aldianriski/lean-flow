---
sprint: 185
slug: handoff-offers-pre-run-sweep-and-park-rule
owner: Maintainer
last_updated: 2026-11-21
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-185 — Execution Log

> Append-only companion to [`../SPRINT-185-handoff-offers-pre-run-sweep-and-park-rule.md`](../SPRINT-185-handoff-offers-pre-run-sweep-and-park-rule.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-21 | promote | plan locked, 5 members: TASK-694, TASK-695, TASK-697, TASK-696, TASK-698 (5 plan steps)
Owner rulings, verbatim. Intake: "Commit + promote now (Recommended)" (one `backlog:` commit, then promote; it approved starting promote only). Governance popup round: L-293 "Place it now (Recommended)" · L-255 "Retain (Recommended)" · TASK-698 size "Keep M, G2 cap 2 rounds (Recommended)" · proof spend cap "15 USD (Recommended)". Checklist sign-off: "Sign + render (Recommended)", on the question "Sign the SPRINT-185 governance checklist and render the sprint?" It is not the G1 or G2 sign-off.
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: two candidates with count 2 or more and `promoted: no`, L-293 (count 3) and L-255 (count 2); the entry-block parser and a second selector on `status: active` agree. L-293: placed as a durable rule, § Durable rules › headless-proof-launcher, disposition move-to-reference, commit cc5325b6 (its SPRINT-184 end condition). L-255: retain, covered by L-246, L-007 and CLAUDE.md's must-FAIL rule, no sighting since SPRINT-180; re-open on a third.
- ☑ TD aging: 118 open rows, 116 aged against 185; TD-320 (Sprint-184) and TD-321 (filed 2026-11-21, no sprint) are not. None is `severity: high`, nothing escalates. Disposition: keep all open, no separate sweep. TASK-697's audit may mark TD-321 covered.
- ☑ TD deletion, §11: none due; the 7 resolved rows closed at Sprint-184 and are due at Sprint-187.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 106 PASS, 1 FROZEN, 7 retained, no FAIL or WARN. At the edge: `.claude/CONTEXT.md` 150 of 150 (coordinator edits net to zero), `orchestrator/SKILL.md` 140 of 140 (pointer edits net to zero), `lean-doc-generator/SKILL.md` 138 of 140, CLAUDE.md 79 of 80. T3's new research doc has a soft cap of 130. CHANGELOG rotation not due. No compression at promote.
- ☑ epic rollup currency: none. EPIC-025 is the only active epic; its SPRINT-172 and SPRINT-173 rows carry `close_commit` and its header is not older than its newest member close.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`; 0 uncovered, no override. None of TASK-694 to 698 advances it, so this sprint touches no active epic.
- ☑ roadmap coverage: none (no roadmap file).
- ☑ handoff ledger: none live; the one path's latest entry is `spent`.
Sprint number: 185, the maximum in use plus one. Derived from `docs/sprint/`, `docs/sprint/archive/`, the INDEX lines and git paths (newest SPRINT-184, archived); `.claude/worktrees/` is absent.
Composition: 5 members (all size M), no epic, no stream. W1 T1 (TASK-694), T2 (TASK-695), T3 (TASK-697); W2 T4 (TASK-696, `Depends-on: T2`); W3 T5 (TASK-698, `Depends-on: T4`). Every blocker joins the sprint, so no state change. Commits: status move 07135d68. `promote-check` run on the real file before `plan locked`.
Baseline gate (off-host, run by the coordinator on cc5325b6, its own call):
```
gate-remote: ran cc5325b6edd0f00fb0bd42eba3baef1281d318ef
bun test rc: 0
bun test: 643 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 227 pass, 0 fail (rc 0)
```
G2 notes: (1) Proofs: a 15 USD spend cap for the sprint; the coordinator launches every nested `claude -p`, serialised, one workdoo copy at a time, after merge-back; the owner approves each launch; the launcher and the child's tool route are named at G2 (L-293, headless-proof-launcher); a before-run whose `Skill` call was blocked is void. (2) Merge first, then run, with the transcript showing the repo base dir. (3) T5 stays size M with a G2 review-round cap of 2. (4) Before each build, grep `evals/` for text contracts pinning the touched wording (L-316): `qa-check.sh` leg 13 needs `ToolSearch select:AskUserQuestion` and the `/handoff` doc cue to stay in init.md and migration-map.md; the boundary-rows init-park and migrate-park fixtures; `run-layout-fixtures.ts` and `run-work-store-fixtures.ts` name sprint-by-reference.md. (5) T5's Layers add sprint-by-reference.md (its G2 note edits the wave procedure there). (6) T3 audits at the `plan_commit` snapshot and marks TASK-694 to 698 and TD-321 "covered by". (7) README, CHANGELOG and CONTEXT are coordinator-owned, written once in a bare `sprint(185):` commit; each task's report returns its proposed lines. (8) Shared-file order: orchestrator/SKILL.md T2, T4, T5; sprint-bulk-run.md and night-run.md T4, T5; dispatch.md, sprint-by-reference.md, prime and flow T2, T5.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.

### 2026-11-21 | gate | batch G1 signed (fast-path), T1–T5
Owner popup, verbatim: "Scope unchanged — sign G1 (Recommended)" to "Batch G1 (fast-path, all five origin: decomposer): is the scope of TASK-694..698 unchanged since your approve? Since then only G2 notes were folded in (L-293 cited, 15 USD proof cap, T5 review cap 2, sprint-by-reference.md added to T5 Layers)."
G1 passes for T1–T5 at 24299773. G2 is not signed; `gates_signed` stays omitted until batch G2 is signed. Owner ruled batch G2 and the build run in a fresh session ("Fresh session (Recommended)"), resumed via `/handoff` → `/prime` → `/orchestrator sprint-bulk`.
