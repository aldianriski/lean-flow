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

### 2026-10-24 | progress | T4 (TASK-485) built and merged; Codex CLEAR at round 2; waits in review/ for exercise B
Builder in a worktree (base `cf275631` verified at spawn) added one bullet to review-scoping.md § "Scope every pass to the diff";
the diff touched only that file. Cherry-picked as `329f4ca5`, Codex retry `a0a03bb2`. Exercise A: on SPRINT-111 T3's break
commit `d75d861` (S11.TODOCAP removed, 100 → 99 rules), the procedure names all three red test files the log lists. One of them,
`packages/standard/src/spec-reader.test.ts`, builds its path with `new URL(...)` and is found only by a file-name search. That
is why Codex required path + file name + names. The hit list ran about 20 files wide. Exercise C: on workdoo `180d5b7`
(read-only), a names search found 10 test files, 4 of them pre-existing consumers outside the diff; they were named, not run.
Exercise B (a real SPRINT-138 review reporting the section) is pending, so T4 waits in review/. Post-merge legs on `main`:
typecheck clean, prose-density 28/0, layers-completeness 0 FAIL, layers-observed PASS, scope-change 9/0.
consequence · T4 · behaviour:low · governance:high
review · T4 · codex · behaviour:low · governance:high
Codex round 1 (Spec): FIX, three wording changes (search by file name too; absence per file; excluded hits named). One bounded
retry applied all three. Round 2: CLEAR, no new blocking finding. Within the 2-round cap.

### 2026-10-24 | scope-change | T1, T3: `Layers:` gain the emitter-column harness, which the real run proved both must touch
What broke: T1's real full-gate run through its own command (commit `cf48041e`, VPS) returned `QA-CHECK: 307 pass, 2 fail`.
(1) `emitter-column(POPULATION-scope)`: every `.sh`/`.ts` under `scripts/` must be scanned or matched by a documented rule in
`evals/run-emitter-column-fixtures.ts`'s out-of-scope list, and `scripts/gate-remote.ts` is neither. T3's `scripts/merge-check.ts`
will hit the same rule. (2) `cap .claude/CONTEXT.md (151 > 150)`: T1's added continuation line crossed the cap. Neither leg is
in a per-task check, so both were invisible until the real run (L-218's class, caught this time before merge).
Impact: T1 and T3 `Layers:` gain `evals/run-emitter-column-fixtures.ts` (one rule entry each, on the precedent of
`scripts/qa-verdict.ts` and `scripts/promote-check.ts`, which consume findings). The CONTEXT sentence is folded into the existing
QA_FULL bullet without adding a line. No member Done-when changes. A Layers correction, logged before the Plan edit (L-100 · L-229).

### 2026-10-24 | progress | T1 (TASK-482) done: the off-host gate runs in one command; accepted on its real run, 310/0
Builder in a worktree (base `cf275631` verified at spawn); every commit touched only its declared files. Merged as `8ad4169c`
(build), `69d33787` (review retry), `d62eb03b` (real-run fixes). Retained tests: 38 through a stubbed transport, gated by
`evals/run-workflow-command-fixtures.ts` (floor 38, registered always-on).
The real run was the step that found the defects. Run 1 exited 5 at remote setup with no cause shown, because the transport
discarded stderr; that was fixed in the retry. Run 2 printed the cause: Git Bash rewrote `LF_GATE_DIR=/home/ubuntu/lf-gate` into
`C:/Program Files/Git/home/ubuntu/lf-gate` before Bun saw it. Run 3 (path conversion disabled for that one call) returned
`QA-CHECK: 307 pass, 2 fail`: `emitter-column(POPULATION-scope)` did not cover `scripts/gate-remote.ts`, and `.claude/CONTEXT.md`
was at 151 of 150. Both were fixed in `d62eb03b`, which also makes a drive-letter `LF_GATE_DIR` a named refusal. Neither leg is in
a per-task check or in T3's five-leg set; recorded for T7.
gate-remote · d62eb03b · accepted — remote rc 0, `QA-CHECK: 310 pass, 0 fail`, the same line read separately from the remote log
over ssh. T2 and T3 may rely on the command from here.
A3 data point: in the T1 worktree, `bun install --frozen-lockfile` took about 1 s (6 packages), and `tsc --noEmit` completed and
was not killed (T2 measures it).
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped-reviewer · behaviour:material · governance:low
Round 1 (scoped sonnet): Spec worst = should-fix (rc-file and 255 gaps, shared fixed paths, no timeouts); Standards nit. One bounded
retry (`69d33787`). Round 2: Spec none, Standards nit; the leftover nits are filed as TD-268 (review cap, not a third round).

### 2026-10-24 | progress | T5 (TASK-486) built and merged; Codex CLEAR at round 1; both R1 probes score a literal hit
Builder in a worktree (base `06765938` verified at spawn) touched only its two files. Cherry-picked as `e90f1ec2`. It extended
CONTEXT's § Task entry shape sentence in place (150/150 lines kept) and added one host-generic line to CLAUDE.md.template's
§ Session Workflow (not a [CUSTOMIZE] section). Probe R1, by the EPIC-017 method: fresh Haiku readers with FILES READ lines. Over
lean-flow's CLAUDE.md + CONTEXT.md: `docs/work/backlog/`, quoting the new CONTEXT line. Over a verbatim template copy as `.claude/CLAUDE.md`
(what `init` writes): `docs/work/backlog/`, quoting the new template line. Both literal hits. TD-222 resolved (`ade27483`).
The CHANGELOG line (box 3) is written with the sprint's other shipped changes. Post-merge legs on `main` are all green.
consequence · T5 · behaviour:low · governance:high
review · T5 · codex · behaviour:low · governance:high
Codex round 1: CLEAR on all four items (answers R1 unambiguously; host-generic; Session Workflow is the right section; 150 kept).

### 2026-10-24 | progress | T2 (TASK-483) built and merged; Codex CLEAR at round 2; exercise passed on branch (a)
Builder in a worktree (base `06765938` verified) touched only `dispatch.md`. Cherry-picked as `b64dde5b`, Codex retry `77fe54b8`.
Exercise: a real worktree probe briefed with the paragraph verbatim. It installed in 0.9 s (6 packages) and ran tsc clean. TypeScript 7
is a native `tsc.exe`, which peaked at 122 MB in 0.3 s with 0.57 GB free, so A3 is answered: a worktree can typecheck on this host.
It reported a seeded `error TS2322` before merge-back, removed it, and left `git status` empty. Consumer (workdoo, read-only): resolves
to `bun install --frozen-lockfile` + `bun run typecheck`. TD-194 resolved. README/CHANGELOG (box 5) go with the sprint's other
shipped changes. A tick check caught box 4's evidence naming workdoo's lockfile as a T2 file; the evidence was reworded (L-224's
class, caught by `tick-box.ts` in seconds). Post-merge legs on `main` are green.
consequence · T2 · behaviour:low · governance:high
review · T2 · codex · behaviour:low · governance:high
Codex round 1 (VERDICT-T2): FIX, four wording changes (install before dependent work under the timing rule; the host's
dependency-install procedure; failure and blocker reporting; no install or leg overlapping any task's wall-clock run). One retry;
round 2 CLEAR.

### 2026-10-24 | gate | T7: owner authorises one narrow third Codex round past the 2-round cap (item 5 + two nits)
Codex round 2 (final under the cap) on T7's research doc: items 1–4 and 6–9 APPLIED, no new blocking finding. Item 5 remains
BLOCKING: C1's next-promote selector re-reads only newer sightings, so an assigned change with no later sighting drops out, and no
existing reader of outstanding assigned work is named. Two nits: R2c's 16-event enumeration should visibly exclude the S128 L-224
hold, and F2's "effective unknown everywhere" should acknowledge that one hold was observed. Box 6 requires the second round to
leave no blocking finding, so it is unmet.
owner-ruling (popup, 2026-10-24): "One narrow extra round". A third builder retry limited to item 5 and the two nits; Codex
re-reviews only those. An owner-authorised exception to ADR-053 §5's default cap, not a new default.

### 2026-10-24 | progress | T3 (TASK-484): local cost measured on this host before `dispatch.md` names the command on main
Measured in T3's worktree (`9244c056`, not yet merged), three runs each, each process measured directly with PowerShell polling
of PeakWorkingSet64 (native `tsc.exe`, real `bun.exe`, not the scoop shim). Whole `bun scripts/merge-check.ts`: 23.0 · 17.5 ·
18.2 s, exit 0 each, `merge-check: 5 green · 0 skipped · 0 failed`. The wrapper holds about 60 MB while legs run one at a time
under it. Typecheck is about 124 MB; prose-density 64–70, layers-completeness 64, layers-observed 74, scope-change 80–81 MB.
Peak concurrent is about 185 MB, with 0.46–1.23 GB free.
Surprise, recorded for debt: the first measurement ran from a PowerShell PATH without Git's `usr/bin` tools. There,
prose-density reported 25 misleading baseline FAILs ("… not in the examined population") and layers-completeness crashed Bun.
Neither said that a tool was missing. With Git's tools on PATH for that call only (edit-safety (d): diff the environments before
the code), all five legs passed. Those first-run checker figures are void; the typecheck figure stands.

### 2026-10-24 | scope-change | T7 (TASK-488): `Layers:` gain the research measurement log the brief allowed
What broke: the post-merge legs on `main` after T7's merge: `layers observed` FAILs, "changed by a task that never declared it:
T7:docs/research/logs/learning-loop-architecture.md". The coordinator's brief allowed bulky evidence in that §2 `research/logs/`
sibling, but the Plan's T7 `Layers:` named only the doc and the index.
Impact: T7 `Layers:` gain `docs/research/logs/learning-loop-architecture.md`. No member Done-when changes. A Layers correction,
logged before the Plan edit (L-100 · L-229), and caught by the post-merge legs rather than at close.

### 2026-10-24 | progress | T7 (TASK-488) done: the learning loop mapped end to end; five ranked candidates; Codex CLEAR at an owner-authorised round 3
Research builder in a worktree (base `cf275631` verified) touched only its research files and the generated index. Merged as `c365670f`
→ `17c8b8b7` → `7de0784f` (cherry-picked through `acb95272`), plus the round-3 nit `86ad67e8`. Doc 125/130 lines; measurement log 534
lines. Headline findings: the loop breaks after placement (18 promoted rules recurred, a lower bound; Retros name 15 recurrences,
the ledger holds 10). 98 promoted pointers are one pasted line from one bulk edit. First-run system verify was red in 7 of 10 sprints.
16 of 114 known-home promotions target adopter-visible surfaces. workdoo runs lean-flow 2.0.0 against 2.13.2; its bump action was
listed at S127/S128 and then dropped. Ranked candidates (owner ruling, recurrence × consequence): C1 recurrence-as-event (45) ·
C3 delete prose a tool now carries (30) · C2 effect test (21) · C4 repair the 98 pointers (2, executes before C1) · C5 adopter
route and pin (1). No ADR candidate. The coordinator cross-checked F1, F6, F7 and F9 by other routes. One query of the
coordinator's own (log headings) fell into the substring trap (`red` inside `undeclared`); it was caught when the routes
disagreed: L-108's nineteenth sighting. Post-merge legs found T7's undeclared measurement log; Layers corrected (scope-change above).
consequence · T7 · behaviour:low · governance:high
review · T7 · codex · behaviour:low · governance:high
Codex round 1: FIX (7 items). Round 2: 8 of 9 applied, item 5 still blocking (no named reader of open assigned work). The owner
authorised a narrow round 3, which came back CLEAR (VERDICT-T7); its one nit was applied at merge.

### 2026-10-24 | progress | T3 (TASK-484) built and merged; scoped review and Codex both CLEAR at round 2; merge-check's first real run green
Builder in a worktree (base `c0c904e2` verified; it installed dev dependencies and typechecked per T2's new rule) touched only its
five declared files. Merged as `3ccfa36f` (command + tests + harness + emitter rule), `1efdd16e` (dispatch.md), `f7a642be` (review
retry). Its own merge-back is the command's first use, replacing the five hand-run legs:
merge-check · f7a642be · 5/5 green (0 skipped, 0 failed), 23 s, 1.16 GB free.
Consumer (workdoo, read-only): no merge-back check is documented, so the wording falls to the discovered gate, and "repo-wide over
unit-only" picks `verify` over `test`. The unranked rung itself is filed as TD-271. T3's scoped review was the sprint's first to
report a Pinning tests section, which satisfies T4's exercise B (box 2 ticked, TD-212 resolved). Boxes 5 (every merge-back through
close, investigated against system verify) and 7 (README/CHANGELOG) stay open until the close steps.
consequence · T3 · behaviour:material · governance:high
review · T3 · scoped-reviewer · behaviour:material · governance:high
review · T3 · codex · behaviour:material · governance:high
Scoped round 1: Spec should-fix (a checker's SKIP counted green; layers-observed and tsc arguments unpinned), Standards should-fix (the
post-merge sentence lost its connective). Codex round 1 on dispatch.md: FIX (connective; repo-wide over unit-only fallback; who
agrees the fixed set). One bounded retry, then round 2: scoped Spec nit (TD-269), Codex CLEAR.
