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

### 2026-11-21 | handoff | SPRINT-185 batch G2 and the build, fresh session
handoff-status: live
handoff-path: C:\Users\HYPEAM~1\AppData\Local\Temp\handoff-sprint-185-g2.md

### 2026-11-21 | g2 | batch G2 signed for T1 to T5 (owner popup, "Sign G2 + start W1 (Recommended)")
Resumed from the handoff above in a fresh session (`/prime` → `/orchestrator sprint-bulk`). G1 stands at 24299773. G2: the coordinator's design record (scratchpad `SPRINT-185-G2-design.md`, with its "Amendments after the builder checks" and "Owner rulings" sections), settled after five builder checks and a Codex design review (`cross-model-route.md`, `gpt-6-astra`, read-only): round 1 NOT CLEAR (T5 high: prime's Log fallback could be suppressed by a later entry; T5 medium: a park-time canonical line; T3 medium: `/triage` missing from the audit sources), all three fixed in place, round 2 `VERDICT: CLEAR`. No frozen box reworded. Owner answer verbatim: "Sign G2 + start W1 (Recommended)".
Owner rulings at the forks popup, verbatim: proof route "You run them (Recommended)": interactive legs are owner-run via `claude --plugin-dir D:/Project/lean-flow` in coordinator-staged workdoo copies, and headless legs are coordinator-launched, each launch owner-approved · T1 slot rule "No suggestion there (Recommended)": a prompt with three evidence options gets no suggestion · consequence "As proposed (Recommended)".
Coordinator rulings: A1 confirmed (grep of `docs/adr`, `skills`, `spec`: "never generates candidate answers" appears only in `init.md`; no ADR, L-220). No ADR governs the attended first-blocker halt (T5 Assumes). T1's suggestion reviewer is on the Codex route when CONTEXT declares `draft-review`, else a same-provider sub-agent, under a 300 s timeout; unavailable means no suggestions. T2's offers return `promote`, `stop` or `<mode>` to the caller; arriving from the chain means a named mode, so no second chooser. T4 scopes a still-blocked member out by pointer to dispatch.md's backlog-return steps 1–3; declining leaves G2 unsigned. T5's proof legs (b) to (f) and (e2) run through the unchanged `scripts/night-run.sh` launcher and reaper, and (a) is owner-run; the declared base is re-verified at each unit's spawn; every canonical `Tn · parked-hitl · ` line is written at exit only; prime's Log digest is retired only by a later `questions answered` entry or a newer digest. T3's research doc sits at `docs/research/loop-audit-2026-11.md` (STANDARD §2 root row, 130 soft cap) and cites `file § heading` read at 9478dec4.
Shared-file order unchanged from D2. Behaviour "med" in the owner's ruling is written `material`, the writer's two-value vocabulary (unclear ⇒ material).
builder-check · T1 · 2 contradictions · 7 questions · hand-off skips init steps 2-6; reviewer route on = draft-review; fixed-choice marks a choice; Verify and cite bullets touched; slot rule owner 'No suggestion there'
builder-check · T2 · 2 contradictions · 5 questions · result token promote/stop/mode and who invokes; facts plus size/risk, overnight only all AFK J0/J1; prime uses frontmatter facts; member choice; attended probe; headless leg f
builder-check · T3 · 0 contradictions · 3 questions · cap 130 per STANDARD; justification column and no-evidence list; two-scope recommendation; covered-by filter; snapshot cites; triage added after Codex r1
builder-check · T4 · 3 contradictions · 6 questions · scope-out by pointer to backlog-return steps 1-3; dependents by existing rule; open-assumes shape; decline leaves G2 unsigned; proof seed mapped
builder-check · T5 · 2 contradictions · 6 questions · launcher route for b-f and e2; base re-check at spawn; review findings park, block halts; canonical park line at exit only; prime digest retirement rule; rebase on clear
consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high
consequence · T5 · behaviour:material · governance:high
consequence · T3 · behaviour:low · governance:low

### 2026-11-21 | progress | W1 landed: T3 (TASK-697) done; T1 (TASK-694) and T2 (TASK-695) built, reviewed and merged, proofs and shipped-diff Codex reviews pending
Dispatch preflight on 1ccc8bd4, run as its own call: `PREFLIGHT: CLEAR` (waves T1=0 T2=0 T3=0 T4=1 T5=2; every shared file owned by a Depends-on chain).
T3 (TASK-697), inline on the session model: `docs/research/loop-audit-2026-11.md` (77 of 130 lines, `check-doc-caps` PASS) ranks 8 weak points from three Explore recon passes plus coordinator reads at 9478dec4. First is the coordinator writing guarded fields that the gate catches only late (first gate pass red in 4 of 6 sprints). Codex review (`gpt-6-astra`, read-only) round 1 `VERDICT: CLEAR` with 7 medium/low corrections, all applied; no round 2. `gen-index.sh --check` PASS. Commit 914408bf, all 6 boxes ticked.
T1 (TASK-694): Codex built it in worktree `s185-t1` off 1ccc8bd4 (`ready`; leg-13 pins 4/4; layout fixtures 41/0; SKILL.md 138 lines). Scoped Sonnet reviewer `VERDICT: CLEAR`, two low notes; the proofs must exercise the popup's built-in free-text path. Landed with blob-hash equality on all 3 files, commit 8e441077; boxes 1-5 ticked; 6-8 wait for proofs and the shipped-diff Codex review.
T2 (TASK-695): Codex built it in worktree `s185-t2` off 1ccc8bd4 (`ready`; orchestrator-store 42/0, store-readers 21/0, dispatch-preflight and worktree-base fixtures green, both executed fences equal to HEAD). Scoped Sonnet reviewer `VERDICT: CLEAR`, five low notes: `orchestrator/SKILL.md` has no spare line for T4/T5; prime now never recommends overnight from frontmatter alone (a CHANGELOG line). Landed with blob-hash equality on all 9 files, fixtures re-run on main 42/0 and 21/0, commit bee6fbcc; boxes 1-6 ticked; 7-9 wait for proofs and the shipped-diff Codex review.
Coordinator slip: one `cd` into the T1 worktree briefly made it the session's working directory (L-219 shape). No isolated dispatch ran while it lasted, and every later command ran from an absolute path on main.
review · T3 · self-review · behaviour:low · governance:low
review · T1 · scoped-reviewer · behaviour:material · governance:high
review · T2 · scoped-reviewer · behaviour:material · governance:high
### 2026-11-21 | scope-change | T1/TASK-694 Layers: add skills/lean-doc-generator/templates/product-requirements.md.template and skills/lean-doc-generator/templates/development-coding-standards.md.template — the shipped-diff Codex review (round 1, medium) found the templates' source lists exclude the new (owner, init; suggested) cite, and SKILL.md says the template wins on divergence, so box 4 could not hold for a quality row; bounded retry by the coordinator, no Done-when change

### 2026-11-21 | progress | shipped-diff Codex reviews for T1 and T2 cleared; T4 (TASK-696) built, reviewed and merged
T1 shipped-diff Codex review (`gpt-6-astra`, read-only, `cross-model-route.md`): round 1 `VERDICT: NOT CLEAR` with one medium Spec finding. `product-requirements.md.template` listed no `(owner, init; suggested)` source, and SKILL.md says the template wins on divergence. Layers scope-change fa76e8f3 added both templates; the coordinator fixed it as one bounded retry (8541976a; the coordinator is the builder of that fix). Round 2 `VERDICT: CLEAR`, no new finding. Box 8 ticked.
T2 shipped-diff Codex review round 1 `VERDICT: CLEAR`, no findings. Box 9 ticked (wiring grep lists all five callers).
T4 (TASK-696): Codex built it in worktree `s185-t4` off e43827df (`ready`; orchestrator-store 42/0, store-readers 21/0, run-mode fixtures green; SKILL.md 140 lines). Scoped Sonnet reviewer `VERDICT: CLEAR`. Its lows: the conformance engine (S9) accepts an interim `gates_signed: G1 @ <sha>` and never reads it as G2, but `lean-doc-generator/SKILL.md` and `SPRINT.md.template` still say omit until both gates are signed; `**blocked-by:**` Assumes lines are not named in Sweep step 2 (step 5 still catches them). Landed with blob-hash equality on all 4 files, commit 709d01ec; boxes 1-3 ticked; 4-6 wait for the proof and the shipped-diff Codex review.
run · 22 of 36 DoD ticked (T3 6/6 · T1 6/8 · T2 7/9 · T4 3/6 · T5 0/7)
review · T4 · scoped-reviewer · behaviour:material · governance:high

### 2026-11-21 | handoff | SPRINT-185 batch G2 and the build, fresh session (resumed)
handoff-status: consumed
handoff-path: C:\Users\HYPEAM~1\AppData\Local\Temp\handoff-sprint-185-g2.md

### 2026-11-21 | handoff | SPRINT-185 T4 shipped-diff review, T5 build, proofs, system-verify and close
handoff-status: live
handoff-path: C:\Users\HYPEAM~1\AppData\Local\Temp\handoff-sprint-185-build.md

### 2026-11-21 | progress | T4 shipped-diff review cleared; T5 (TASK-698) built, reviewed and landed
Resumed from the live handoff above in a fresh session (`/prime` → `/orchestrator sprint-bulk`).
T4 shipped-diff Codex review (`gpt-6-astra`, read-only): round 1 `VERDICT: CLEAR`, one low Spec finding. Step 6 of `sprint-bulk-run.md` wrote an interim `gates_signed: G1 @ <sha>`, while lean-doc-generator's promote row says to omit the field until both gates are signed. The coordinator fixed it inside T4's Layers as the one bounded retry (b688abc1). Round 2, scoped to that fix, `VERDICT: CLEAR` with no findings. The `**blocked-by:**` low was judged not a separate violation. Box 6 ticked (87ec4dc8).
T5 (TASK-698): Codex built it in worktree `s185-t5` off b688abc1, re-verified at spawn (`ready`; orchestrator-store 42/0, store-readers 21/0, dispatch-preflight, worktree-base and run-mode fixtures green; both executed dispatch fences byte-identical; `git diff --stat scripts/` empty; SKILL.md 140 lines). Scoped Sonnet reviewer `VERDICT: CLEAR`, two lows needing no action. Landed with blob-hash equality on all 8 files, fixtures re-run on main (the five above plus work-store 21/0 and layout 41/0), commit 6be7fafd; boxes 1-4 ticked; 5-7 wait for the proofs and the shipped-diff Codex review.
Coordinator slip: one `cd` into the T5 worktree again made it the session's working directory (L-219 shape, second sighting this sprint). Nothing was dispatched from it, and the next command returned to main.
run · 27 of 36 DoD ticked (T3 6/6 · T1 6/8 · T2 7/9 · T4 4/6 · T5 4/7)
review · T5 · scoped-reviewer · behaviour:material · governance:high

### 2026-11-21 | progress | T1 and T4 consumer proofs passed in workdoo; both moved to done
Proofs ran in D:\Research\workdoo (HEAD 884d897a, 1253 tracked files). Each leg was compared to a pre-run `git hash-object` manifest plus `git status --porcelain` after revert: MATCH every time. The owner chose to have the coordinator drive the owner's own `workdoo-ed` session with SendMessage, starting from `/clear`, while the owner answered every popup there. The skill base dir was `D:\Project\lean-flow\skills\…` in every leg.
T1 (TASK-694): (a) init on the docs tree offered "Migrate (Recommended)", and migrate's own plan followed in the same session, with no init popup and no init write. (b) With the docs moved out, three reviewers ran before the first popup; reviewed First-milestone suggestions were accepted and cited `(owner, init; suggested)`; three dropped suggestions were never written; the free-text path stood in where no "I'll describe it" slot existed. (c) The owner ruled "Run (b), trim (c)". Leg (a)'s migrate rounds supplied the Standards suggestion and the business prompts and cites, and an injected contradicted Non-goals draft was rejected by migrate's reviewer and appeared in no popup and no file. All boxes ticked, done/ (07ee8499).
T4 (TASK-696): leg 1 asked the G1 scope question before G1 signed, the open assumes in G2 round 1 and the dependent question in round 2, all before the only dispatch, with no popup after it. The dispatched worker came back blocked: `Agent(isolation:"worktree")` branched from origin/HEAD, not the proof branch, and the worktree-base guard caught it. Leg 2 scoped out an unresolvable member and its dependent at G1 by owner ruling, through standalone scope-change entries and separate backlog-move commits, with no dispatch. The owner ruled "Accept both legs" for the single-sprint wording of the proof box. All boxes ticked, done/ (a16d6e84).
run · 32 of 36 DoD ticked (T3 6/6 · T1 8/8 · T4 6/6 · T2 7/9 · T5 4/7)
Correction to the line above: T5 stands at 5/7, since its review box was ticked at ad37278e; the 32 of 36 total is unchanged.

### 2026-11-22 | progress | T2 and T5 consumer proofs passed in workdoo; one T5 defect found and fixed; all members done
Proofs ran in D:\Research\workdoo (HEAD 884d897a) on throwaway proof branches, each compared after revert to the pre-run manifest plus porcelain: MATCH every time; the T5 runs also left the branch and worktree lists equal. Interactive legs were owner-run in the workdoo session; headless legs were coordinator-launched under the owner's batch approval.
T2 (TASK-695): (b) Stop here at the decomposer's offer ended /flow with Next only, no sprint. (a)+(c) promote, then one mode popup; the owner picked mvp; /orchestrator ran with the mode named, no second chooser; the member reached done/ and the close check gave 4 pass, 0 fail. (d) a mixed AFK J1 + HITL J2 Plan got sprint-bulk recommended, overnight shown only as blocked preparation; (e) `/orchestrator mvp TASK-002` stopped before G1, queued behind open TASK-001; (f) headless `/orchestrator` gave one attended Next with no popup, dispatch or write. Session 1 detoured through migrate because workdoo has no `## Stack`; later sessions were staged with that migrate result committed on the proof branch.
T5 (TASK-698), owner rulings: fold the seven staged legs into four runs plus /prime checks; G1, G2 and the approval envelope signed for the synthetic proof sprint at 2.5 USD per run. (a) attended: blocked T1 worker, T2 merged first, one exit popup, the answer went back by SendMessage to the same worker, PLAN_EXHAUSTED. (b) the hold cleared at the boundary re-check, reaper PLAN_EXHAUSTED. (c)+(f) T1 parked, T2 merged, T3 ran on the new base, reaper AUTHORITY_BOUNDARY. (d) failed at first: the run left out the canonical park line, so the unchanged reaper derived a false BUDGET_STOP, and the run deleted its own appended stub lines. Owner ruling: fix the exit order. 6c98f393 makes the exit pass ordered (digest, then the canonical line in its own entry, then /handoff) and keeps the Log append-only; Codex round 2 CLEAR. The re-run passed, and a fresh /prime led with the question from the live stub. (e) a real handoff denial (dontAsk Write to the temp dir) got no alternate-route retry, and /prime recovered the question from the Log digest. (e2) with the temp doc deleted, /prime used the Log digest.
Known limit: headless /handoff can write only when the child's TEMP and --add-dir use the long path (the 8.3 short name was denied twice), which is a TD candidate for the exit-path allowlist. Spend: 5.00 of the 15 USD cap. The workdoo session's `cd` into an integration worktree is a third L-219 sighting.
run · 36 of 36 DoD ticked (T3 6/6 · T1 8/8 · T4 6/6 · T2 9/9 · T5 7/7)
