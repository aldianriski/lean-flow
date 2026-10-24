---
sprint: 138
slug: validation-where-work-happens
owner: Maintainer
last_updated: 2026-10-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-138 — Execution Log

> Append-only companion to [`../SPRINT-138-validation-where-work-happens.md`](../SPRINT-138-validation-where-work-happens.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-24 | promote | plan locked, governance signed, seven members: validation where work happens
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. All 11 active entries are at count 1. Census, position-anchored: 11 active + 213 promoted + 1
  superseded = 225 headers (the active-status query returns 12, counting L-155's header, which quotes the status string).
- ☑ TD aging (recorded here, per L-242): 94 of 96 open rows aged against sprint 138. Second route: 94 aged + 2 young = 96, and
  107 rows − 11 resolved = 96. Not aged: TD-266 (filed at 136) and TD-267 (137). Newly aged: TD-264 · TD-265 (low, filed at
  135). None is `high`. The re-review is the owner-approved cohort pass over the 78 low/minor/trivial rows, after this promote.
- ☑ doc-aging, §11 (owner-approved, applied in `fb6b5d00`): TD-232 · 233 · 244 · 262 · 263 deleted (resolved at 135; TD-204's
  status field names SPRINT-114 but it was resolved at the SPRINT-136 promote, so it is not due). TASK-470, 471 and 472
  (SPRINT-135) pruned: no live `.md` citation by two routes (a pathspec-excluded `git grep` and a filtered file list over 1036
  live `.md` files), plus a varied-selector control whose only hits were numbers and one code comment. TASK-473 retained,
  cited by `spec/CHANGELOG.md`, which §11's history list does not exempt. No CHANGELOG rotation (no MINOR since the last).
  No LEARNINGS collapse: the same six `promoted: yes` lines as at SPRINT-137's sign-off (five with their pointer, and L-144's
  recorded deliberate non-collapse).
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0.
- ☑ epic rollup currency and epic coverage: no active epic (EPIC-005 is parked). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: triage 2026-10-24 (`eb8a2ced`, `41ae0b7d`: TASK-366 → `.out-of-scope/`, TASK-367 → blocked). A read-only Codex review
of the next-work candidates ranked C, B, G, A; the owner selected those plus research item R. Decomposed (`e28d236e`), with
owner rulings by popup (A = Bun wrapper with a fixed set · C = env vars, no defaults · B = install in each worktree · R =
research integrated end to end with the existing learning loop, a target architecture, two Codex rounds) and the owner's
direction to check every task from the adopter's side. The read-only Codex intake review returned APPROVE WITH FIXES; all
seven fix groups were folded in before `approve`, including the split of TD-246's cleanup into TASK-487.
Size check: 5 S, 2 M, no `L`. All seven are `origin: decomposer`. No epic.

### 2026-10-24 | gate | G1 + G2 signed by the owner by popup; seven builder checks settled; three rulings
G1: fast path. All seven members are `origin: decomposer`, and their scope is unchanged since `approve` (`e28d236e`); promote
added only the `sprint:` stamp. G2: designs settled as below. Order: T6 first, inline, before any dispatch (J2, owner picks per
row) → T1 · T4 · T7 in parallel worktrees → T2 (after T1) and T5 (after T1, `.claude/CONTEXT.md`) → T3 (after T2,
`dispatch.md`). `TECH-DEBT.md`, `README.md` and `CHANGELOG.md` stay with the coordinator (D1). Review cap 2 rounds each.
Assumptions: A1 confirmed (the VPS clone ran SPRINT-137's gate today, dev dependencies reinstalled). A6 confirmed (workdoo:
`bun.lock`, a `verify` script, 29 learnings, 13 archived sprints). A3 stays open by design (T2 measures it, either branch).
builder-check · T1 · 5 contradictions · 5 questions · design fixed: every exit case through the stubbed transport with a green
control; the verdict judged by `scripts/qa-verdict.ts`'s own `judgeOutput`; refuses unless launched `bun --no-env-file`; remote
setup is its own step and exit; the gate rc read from its file, never ssh's exit; real run accepted by a log line first.
builder-check · T2 · 5 contradictions · 4 questions · design fixed (probe briefed with the new wording verbatim; branch (b) runs
T1's command inside the worktree; memory on the working process, not a shim); actor wording → owner ruling, scope-change below.
builder-check · T3 · 5 contradictions · 5 questions · design fixed: the scope-change leg on `status: active` sprints only, with
the gate's skip text; repo root for prose-density; a missing checker FAILs; skips counted apart from green; the wiring test
compares path and argument expression against the gate; peak memory on every cost run; README and CHANGELOG cover the tick.
builder-check · T4 · 4 contradictions · 5 questions · settled: exercise B is a later SPRINT-138 review, so T4 waits in review/
until one reports; exercise A uses TD-212's TS-assertion break; evidence goes in this log; a static reviewer names the commands
and the coordinator runs them; TD-212 resolved only when all three exercises pass.
builder-check · T5 · 2 contradictions · 5 questions · settled: run 1 uses the EPIC-017 input set (CLAUDE.md + CONTEXT.md);
run 2 a verbatim CLAUDE.md.template copy, as init writes it; the line in § Session Workflow, never a [CUSTOMIZE] section; the
CONTEXT line extends the generic `docs/work/<status>/` sentence; a miss fails, one wording fix and one re-run allowed.
builder-check · T6 · 1 contradictions · 6 questions · settled: "merged" = `git cherry main <branch>` shows no `+` (merge-backs
are cherry-picked, so ancestry never holds); per-row approval; main and current worktrees excluded; `-D` only on cherry-clean
rows the owner approves; the disposition in this log and on TD-246, which stays open.
builder-check · T7 · 7 contradictions · 6 questions · settled: the coordinator cross-checks each recommendation-driving finding
by a different route; candidate fields verbatim from the Done when; inventory by every `## L-NNN` header reconciled to the
total; workdoo gate verdicts and the upstream path added; baseline archived SPRINT-128…137, boundary `ade5c5c3`; the
coordinator proposes any ADR after Codex round 2; ranking → owner ruling.
owner-ruling (G2 popup, 2026-10-24): R1 register one thin harness for T1/T3's retained tests (scope-change below) · T2's
Done-when reworded to the agent-installs-per-brief form (scope-change below) · T7 ranks candidates by evidenced recurrence ×
consequence, ties broken by the lower operating cost.

### 2026-10-24 | scope-change | T1, T3: one registered harness gates their retained tests; § Scope's Out line amended
What broke: a bare `*.test.ts` never reaches the gate; `scripts/qa-check.sh` runs a suite only through a harness listed in
`eval_harnesses_always` (the registration rule in `evals/run-typecheck-population-fixtures.ts`'s header). § Scope's Out line
excluded any change to `scripts/qa-check.sh`, which would have left T1's and T3's must-FAIL tests unrun.
Impact: one thin `evals/run-workflow-command-fixtures.ts` with a test-count floor runs both test files, registered always-on by
one token in `scripts/qa-check.sh`. T1 creates it; T3 adds its file (T1 then T3, already ordered). T1 and T3 `Layers:` gain both
paths. No member Done-when changes. Covered by T1's and T3's admissions, cap 2.
owner-ruling: popup, 2026-10-24 — "Register one harness", over hosting in an existing gated suite or `bun test` only. G2 stands.

### 2026-10-24 | scope-change | T2 (TASK-483): the first Done-when box says who installs, as dispatch can actually do it
What broke: TASK-483's first box says "the coordinator installs them in each builder/reviewer worktree", but a harness-created
worktree exists only once its agent starts, so the coordinator cannot install into it first.
Impact: box 1 now reads that the brief has each builder/reviewer install them first, by the host's own procedure, and the
coordinator checks that its report quotes the install and the leg's result. Same outcome; no other box changes. `dispatch.md`
is already in T2's `Layers:`.
owner-ruling: popup, 2026-10-24 — "Reword", over keeping the literal wording. G2 stands.

### 2026-10-24 | scope-change | T5 (TASK-486): its templates token narrows to the one file G2 chose
What broke: nothing; G2 ruled the deferred choice. `init` scaffolds `.claude/CLAUDE.md` (auto-loaded) and `.claude/CONTEXT.md`
(not auto-loaded, and the CLAUDE template does not import it), so the line goes in
`skills/lean-doc-generator/templates/CLAUDE.md.template`.
Impact: T5's `Layers:` directory token narrows to that file (L-240: a token for an undecided choice is pruned once G2 rules).
No member Done-when changes.

### 2026-10-24 | progress | T6 (TASK-487) done: 12 agent worktrees and 6 empty orphan directories removed, owner-approved
Inline by the coordinator before any dispatch (J2). Census by two routes: `git worktree list` showed 22 agent worktrees (24
entries, less main and `D:/Project/lean-flow-rc1`, which sits outside `.claude/worktrees/`), and 28 directories were on disk,
of which 6 were empty orphans git no longer tracked. The triage figure of 23 had counted rc1; this is the corrected one.
Classes: 12 clean, unlocked and fully applied (`git cherry main <branch>` shows no `+`) · 1 locked · 9 dirty, two of them with
one commit not in main. The owner approved per class by popup: the 12 removed (`git worktree remove`, no `--force`; branches
`-D` on the cherry proof, each re-checked just before removal) and the 6 empty orphans removed with `rmdir`. The two stray files
`qa-t4.out` and `red.txt` were left for the owner. After: 10 registered, 10 directories. TD-246 updated and still open, in
`9f1b2a4e`'s parent commit (`sprint(138): TECH-DEBT -- TD-246 …`). Ticks were re-checked with the gate's checkers
(by-reference 8/0, layers-observed PASS, prose-density 28/0).
consequence · T6 · behaviour:low · governance:low

### 2026-10-24 | progress | correction to the T6 entry: the TD-246 commit is `5d2bca69`
The T6 entry above cites "`9f1b2a4e`'s parent commit". That is a placeholder that was never substituted (the line wrapped, so
the replacement missed it), and no such commit exists. TD-246's one-time-cleanup record landed in `5d2bca69`.

### 2026-10-24 | gate | dispatch preflight HALT accepted under D1 (owner ruling); wave 0 = T1 · T4 · T7
Preflight at `a4ca93ee`: base-ref PASS; waves T1=0 T2=1 T3=2 T4=0 T5=0 T6=0 T7=0. 16 `shared-file-unowned` FAILs. 15 are on
`TECH-DEBT.md`, `README.md` and `CHANGELOG.md`, which D1 makes coordinator-only. 1 is `.claude/CONTEXT.md` in T1 and T5,
which the coordinator sequences: T5 dispatches only after T1 merges.
owner-ruling (popup, 2026-10-24): accepted under D1, as at SPRINT-137. Builders must not touch those three files; each
merge-back diff is checked against the builder's own declared files. 10 agent worktrees remain (1 locked and 9 dirty, kept at T6),
against dispatch.md's leftover guardrail (harness #51596, stale-branch reuse on an agent-id collision). Each spawn is
base-checked against the declared base, which catches a reused stale branch.
