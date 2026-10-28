---
sprint: 146
slug: say-what-they-saw
owner: Maintainer
last_updated: 2026-10-28
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-146 — Execution Log

> Append-only companion to [`../SPRINT-146-say-what-they-saw.md`](../SPRINT-146-say-what-they-saw.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-28 | promote | plan locked, governance signed, three members: guards that say what they saw
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due, applied at this promote by owner ruling. L-258 (a tick on a member outside its task's declared
  folders commits as bare `sprint(N):`) at count 2 → merged into `.claude/CONTEXT.md` § Sprint model, appended to L-238's
  coordinator-write line, disposition merge (`40e92b16`). Census after: 15 active + 222 promoted + 1 superseded = 238,
  equal to the heading count.
- ☑ TD aging: 101 of 101 open rows aged against sprint 146; TD-276 and TD-277 (Sprint-143, low) newly aged. Second
  route, by severity: 57 + 15 + 24 + 5 = 101. None is `high`. TD-128 and TD-166 resolved the day before (fixed in code
  at SPRINT-099 T2 + ADR-042 and SPRINT-115 T4, rows never closed; `1635712b`).
- ☑ doc-aging, §11 (owner-approved): TASK-513, 514, 516, 519, 521, 522 (SPRINT-143, closed 3 sprints ago) pruned
  (`49b0b065`). No live `.md` citation by two routes (git grep and ripgrep, §11 history paths filtered out); the TASK-367
  control hits on both. None is the store's highest id. No TD deletion is due (TD-278 resolved two sprints ago);
  CHANGELOG already rotated at 2.19.0; no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` prints no FAIL line; `.claude/CLAUDE.md` 79/80, `.claude/CONTEXT.md`
  and `docs/architecture/overview.md` 149/150.
- ☑ epic rollup currency and epic coverage: no active epic. ☑ roadmap: none. ☑ handoff ledger: none.
Intake: the owner chose the false-green guard cluster from the /prime overview (TD-128, 155, 152, 201, 166). Recon found
TD-128 and TD-166 already fixed, so `/task-decomposer` drafted TASK-527..530 (owner `approve`). The intake Codex review
ran after `approve` rather than before it, a coordinator miss: R1 NOT CLEAR (527 is new machinery under ADR-053; 528, 529
and 530 lacked the Other-G real-artifact run; 529 claimed more than it removes), R2 CLEAR after the fixes (`f41b4d73`).
Owner rulings: TASK-527 cancelled (`c07b3006`); TD-152's detection limit resolves as accepted. Size check: three S, no
`L`. All three are `origin: decomposer`. No epic.

### 2026-10-28 | progress | batch G2 designs drafted; three builder checks run and settled; three owner rulings
Batch G1: fast path, all three `origin: decomposer`, scope unchanged since `approve`. G2 designs, one per Tn, each
quoting its member's Done-when verbatim. Routing: all three to /tdd (fixture first), each opening with its existing pins.
Shared-file order T1 → T2 → T3 in the main tree (D1).
- T1: a new `uncovered` mode in the members CLI (its `counts` output stays byte-identical, because the consumer-facing
  conformance engine parses it), read by `reap()`; each uncovered member writes a `TASK-NNN · uncovered ·` rollup line.
  Owner ruling R1: it maps to HARD_FAILURE and replaces only PLAN_EXHAUSTED (ranked last, just above the clean ending), so
  every other terminal keeps its meaning. HARD_FAILURE is unasserted by the rollup checker; both of its forms and the
  parity harness are run over the fixture log anyway (DoD 4).
- T2: the PASS line keeps its prefix `revise-loop-ceiling: within ADR-022` (all eight pins match it by substring through
  `run_case_anywhere`) and gains the scoped tail with N = retry lines in the fence-stripped window. Real-artifact runs use
  base 0, as the existing SPRINT-067 case does. Factual correction to TASK-529's real-artifact box: SPRINT-123's log also
  carries retry lines, so 066 and 067 are not "the only two"; the criterion stays checkable as written and T2 runs all
  three.
- T3: owner ruling R3: the notice is chain-aware. `qa-verdict.ts` prints it on a non-zero exit only when the running
  package.json script (`npm_lifecycle_script`, set by Bun; measured on 1.3.14) continues with `&&`, naming that stage.
  Silent under `gate` and on a direct run, where no chained stage exists. TASK-530's first box is read as conditional on
  a chain existing; `package.json` is untouched.
builder-check · T1 · 4 contradictions · 4 questions · rollup-accept step added; TD row and CHANGELOG step added; census scope and rank settled by owner rulings R1 and R2
builder-check · T2 · 2 contradictions · 6 questions · all factual, settled from the repo (base 0, substring pins, no doc quotes, fenced count assertion added, TD row format copied)
builder-check · T3 · 3 contradictions · 4 questions · TD row step added; false notice under `gate` settled by owner ruling R3; spawn convention and budget variable read from the repo
consequence · T1 · behaviour:material · governance:low
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:low · governance:low

### 2026-10-28 | scope-change | T1: Layers gain the members CLI and night-run.md; TASK-528's real-artifact box names its population
What broke: the T1 design needs two files the Plan did not declare, and TASK-528's real-artifact box asks that "every
archived real night-run log" keep its recorded terminal state, but one of the three, SPRINT-088, is a v1 sprint that no
reaper can count since ADR-046, so that box could not be met by any build.
Impact: T1's Layers add `scripts/lib/sprint-members-cli.ts` and `skills/orchestrator/references/night-run.md`; the
latter is shipped, so T1 takes the Codex loop (D2, cap 2). TASK-528's box is reworded (owner ruling R2) to run the
patched reaper over SPRINT-119 and SPRINT-123 at their close commits and to exclude SPRINT-088 by name.
Re-confirm G2: in the sign-off below.

### 2026-10-28 | progress | T1 done: an uncovered open member box no longer reads as PLAN_EXHAUSTED
T1 (TASK-528), built by a Sonnet builder on /tdd in the main tree: `55c899e5` (code, fixtures, docs, CHANGELOG) and
`00a84d65` (TD-201 resolved). Three must-FAIL reap-terminal cases went red on the old code and green after; both
controls stayed green throughout. Coordinator re-ran each check as itself: REAP-TERMINAL FIXTURES all green,
NIGHT-RUN-ROLLUP FIXTURES all green, DIFFERENTIAL PARITY all identical, tsc rc 0, and the new uncovered mode prints
nothing on this sprint. Real artifact: SPRINT-119 and SPRINT-123 at their close commits reproduced their recorded
terminal states. Codex R1 (shipped night-run.md, D2): CLEAR on all seven items, so no second round. Six boxes ticked
through the tick tool; both per-tick checkers passed after each.

### 2026-10-28 | progress | T2 done: the revise-ceiling PASS states its count is model-reported
T2 (TASK-529), built by a Sonnet builder on /tdd in the main tree: `6855ebd2` (`check_revise_ceiling()` only, four new
retained cases, two fixture dirs, README index) and `b10ad362` (TD-152 resolved as accepted, CHANGELOG). The four new
cases went red before the change and green after. Coordinator re-ran the harness (REVISE-LOOP-CEILING FIXTURES all green)
and the four real-artifact counts, matching the builder's: SPRINT-066 1, SPRINT-067 2, SPRINT-123 1, SPRINT-070 0.
Review: coordinator self-review (Other G, no shipped file); the diff is the counted line plus the scoped tail, with FAIL
paths untouched. Six boxes ticked through the tick tool; both per-tick checkers passed after each.

### 2026-10-28 | surprise | system verify red on the VPS: two coordinator misses, both fixed
`gate-remote` on `7a4cfb2d` (QA_FULL, VPS): `QA-CHECK: 312 pass, 2 fail`. An earlier background launch had been stopped
by low memory on the Windows host before printing a verdict; the rerun was in the foreground (owner ruling). Both FAILs
were the coordinator's, not the builds':
- `token-budget-exceeded` (~12752 > 12691): the L-258 clause merged into CONTEXT at promote cost ~61 tokens against 3 of
  headroom; the promote ran the cap check before that edit and never after. Owner ruling: CONTEXT restored byte-identical
  to `1635712b`, and L-258 moved to LEARNINGS § Durable rules › edit-safety as its own line. Local re-run: token budget
  ~12688 <= 12691, PASS.
- `review-depth-material-absent`: T1's consequence line is `behaviour:material`, and its Codex review was logged only as
  prose. The structured line it owed:
review · T1 · scoped-reviewer · behaviour:material · governance:low

### 2026-10-28 | progress | T3 done: a non-zero gate names the chained bun test it skips
T3 (TASK-530), built by a Sonnet builder on /tdd in the main tree: `41347cf2` (chain-aware notice, nine tests) and
`4b52c83e` (TD-155 resolved, CHANGELOG). Three of the new tests were red on a null stub and green after. A seeded removal
of the print reddened only the two notice-printing tests, and the file was restored byte-identical. Local real artifact:
`QA_BUDGET_SECONDS=5 bun run test` truncated with 17 checks unrun, printed the notice naming `bun test`, and exited 1
with no test output after it. System verify at `834e237d` on the VPS: `QA-CHECK: 314 pass, 0 fail`. On the same checkout
`bun run test` passed its outer verdict (304 pass, 0 fail) with no outer notice, then `bun test` ran 563 pass, 0 fail.
That run surfaced a defect of T3's own: three older CLI spawns in the qa-verdict tests inherited the outer
`npm_lifecycle_script` and printed two false notices into the test output (CLAUDE.md edit-safety (d)). The coordinator
fixed it inline as a trivial test-only change (`26500b71`); the tests show zero stray notices with and without the
inherited variable, 26 pass, 0 fail. Review: coordinator self-review (Other G, no shipped file). Six boxes ticked through
the tick tool.
