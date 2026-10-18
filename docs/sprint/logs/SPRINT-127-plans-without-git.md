---
sprint: 127
slug: plans-without-git
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-127 — Execution Log

> Append-only companion to [`../SPRINT-127-plans-without-git.md`](../SPRINT-127-plans-without-git.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-18 | promote | plan locked, governance signed, five members: EPIC-022 S3 plus the L-224 tick tool
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due; every active entry is at count 1.
- ☑ TD aging: 118 of 120 open rows, counted against sprint 127 (120 − 2 filed at 125). Newly aged: TD-249 · TD-250 (filed at 124).
  No open row is `high`.
- ☑ doc-aging: no cap breach. §11 deletion: TD-168 (resolved at 124), deleted with owner approval. The store prune is re-checked
  by the engine against this file below.
- ☑ epic rollup currency: EPIC-022's rows for 125 and 126 carry their close commits.
- ☑ epic coverage: EPIC-022 is fully covered (4 open). This promote re-marks #5 → TASK-439, #6 → TASK-440 · TASK-441 and
  #8 → TASK-442, and rewords #8 to the one-off form (owner ruling at intake). ☑ handoff ledger: none.
Size check: 3 M + 2 S, with no `L`. TASK-438 (`origin: close-retro`) was added by owner choice as T4; its G1 is the full checklist,
not the fast-path.
Engine re-check with this file present: S10.TDAGING PASS (118, the same as the ledger count) · S11.TDDELETE PASS (TD-168 is
gone). The store prune found `done/TASK-426` (closed at SPRINT-124) past retention; it was deleted with owner approval in `284502f1`.
promote-check 16/0 (two bare paths declared on Cites:) · dispatch preflight CLEAR (waves T1 · T2 → T3 · T5 → T4).

### 2026-10-18 | gate | G1 + G2 signed by the owner (two popup rounds); attended sprint-bulk, T1 ∥ T2 → T3 ∥ T5 → T4
G1: T1 · T2 · T3 · T5 are `origin: decomposer`, so each took the fast-path confirm (scope unchanged since promote, apart from the
Layers gaps below). T4 (`origin: close-retro`) took the full checklist: goal = a tick tool that runs the gate's own checkers; size S;
touches `scripts/lib/` (new `tick-box.ts`) · one `evals/` fixture · `dispatch.md` rule 5; out of scope = any adopter step naming it.
T5's write into workdoo still waits for its own G1 go-ahead (A5). Sizes M · M · M · S · S, with no split.
Recon before G2 (each a second query that agreed):
- **A3 holds for task files, not for the schema doc.** No checker rejects an extra task field, but
  `evals/run-v1-to-v2-fixtures.ts` diffs `docs/work/README.md` § Frontmatter fields against `KNOWN_OPTIONAL_FIELDS` both ways, so
  listing `gates_signed` in the README alone reddens it.
- **A git-less sprint signed per the planned spec FAILs the engine.** S9.GATESWELLFORMED takes a hex sha after `@`; run on
  `G1,G2 @ 2026-10-18` its sed returns empty, which is the `malformed gates_signed:` branch. The engine reads no task file, so a
  task-level date form is out of its reach.
- `README.md` states "`plan_commit` is the freeze", so T3 edits it. `skills/orchestrator/SKILL.md` is at 138 of ~140 lines, so
  T1 and T3 each add at most one net line there; detail goes to `references/dispatch.md`. ADR-053 is the highest ADR id by both
  `docs/adr/` and `DECISIONS.md`, so ADR-054 is free.
G2 design:
- **T1.** `gates_signed: G1[,G2] @ <HEAD sha at approval | YYYY-MM-DD>` on a task's frontmatter, absent = not signed; an optional
  `## Approved design` section holds the one-paragraph summary. `quick`/`mvp` write both on approval (popup or plan-mode exit).
  `plansDirectory` is a MAY, never written by lean-flow. Exercised on a scratch repo.
- **T2** (inline, decision tier). ADR-054 = the promote-entry snapshot as the git-less freeze (rejected: content hash · no freeze),
  and it records the S9.GATESWELLFORMED behaviour change ADR-034 requires (rule id, finding id and severity unchanged). Spec 0.18.0
  MINOR states the git-less records, including the §9 row's no-git date form. Proof: `conformance.sh .` verdict lines diffed.
- **T3.** Every `git mv` / `plan_commit` / `git show` step names its git case and gains a no-git form (switch: `git rev-parse
  --git-dir` fails). The S9.PLANFROZEN note names the snapshot. **Owner ruling (popup): S9.GATESWELLFORMED accepts `@ YYYY-MM-DD`
  only when the repo has no git**, so no git repo's verdict moves; that part is consequential G (ADR-050: full bar). Exercised on a
  scratch repo with no `.git`, including a seeded edit to a frozen box.
- **T4.** `bun scripts/lib/tick-box.ts <TASK> <box#> "<evidence>"` ticks, then runs `check-sprint-by-reference.ts` and
  `check-layers-completeness.ts`, printing their verdict lines; any FAIL exits non-zero with the box left ticked. Other G (ADR-050):
  must-FAIL fixture (`member-layers-incomplete`) + a passing sibling + one real run on this sprint's own ticks.
- **Run shape.** Wave 1: T1 (Sonnet, worktree) ∥ T2 (coordinator, main tree). Wave 2: T3 (Sonnet) ∥ T5 (coordinator, attended).
  Wave 3: T4 (Sonnet). Ownership: `orchestrator/SKILL.md` T1 → T3 · `README.md` T1 → T3 · `dispatch.md` T3 → T4. CHANGELOG,
  TECH-DEBT, the ticks, the member files and this log are coordinator-owned.
- **Review (owner ruling, popup).** Codex gauntlet on T1 · T2 · T3 (shipped surface), at most 2 rounds each; T4 takes the ADR-050
  Other-G bar plus self-review; T5 is findings-only.
- **Verification.** T2 box 3 and T4 boxes 1–2 are mechanical, and each method reaches its target. Every other box is a judgment tick
  with recorded evidence, and says so.
consequence · T1 · behaviour: low · governance: material (shipped template, store schema, orchestrator procedure)
consequence · T2 · behaviour: low · governance: material (spec 0.18.0, an implementation-binding ADR)
consequence · T3 · behaviour: med · governance: material (shipped lifecycle procedures, an engine rule)
consequence · T4 · behaviour: low · governance: low (maintainer tooling)
consequence · T5 · behaviour: low · governance: low (consumer exercise, findings only)

### 2026-10-18 | scope-change | T1 + T3 Layers, and TASK-441 gains the S9.GATESWELLFORMED box (owner, G2 popup)
**What broke.** The frozen Layers miss three files the work must touch: `evals/run-v1-to-v2-fixtures.ts` (T1, the schema
cross-check above), `README.md` (T3, its `plan_commit` sentence) and `evals/run-gates-signed-fixtures.sh` (T3, the widened rule's
fixtures). TASK-441's DoD has no box for the engine change the owner ruled at G2.
**Impact.** T1 Layers gains `evals/run-v1-to-v2-fixtures.ts`. T3 Layers gains `README.md` and `evals/run-gates-signed-fixtures.sh`,
and its engine note widens to the two changes. TASK-441 gains one box: S9.GATESWELLFORMED accepts the date form only without git,
with must-FAIL fixtures, and no git repo's verdict moves. TASK-441 is re-tiered P → G (consequential, ADR-050), on discovery.
**Re-confirm G2.** The owner signed G1 + G2 on this design, these changes included, in the same popup round.

### 2026-10-18 | dispatch | wave 1: T1 (Sonnet, worktree) ∥ T2 (coordinator); worktree-base guard PASS
Before dispatch, `git worktree list` showed 16 leftover agent worktrees. The 8 that were merged into `main`, clean and unlocked
were removed (their branches kept). Eight stay for the owner: two locked, and six holding unmerged commits or uncommitted files.
T1's worktree branched from `f996fa17`, equal to coordinator HEAD (worktree-base guard PASS, checked while the agent was live).

### 2026-10-18 | T2 | TASK-440 — ADR-054 + spec 0.18.0 (`b7d5ad0f`, R1 fix `c2aa9195`); done
ADR-054 sets the git-less freeze (promote-entry snapshot, dates for shas, detection by `git rev-parse --git-dir`) and records the
S9.GATESWELLFORMED behaviour change under ADR-034. STANDARD §9 gains the paragraph, the date form and two table cells; spec 0.18.0
MINOR. Box 3, mechanical: `conformance.sh .` verdict lines diffed before and after, and only the four S4 ADR counts moved
(53 → 54, all PASS); level Gated, the counts line and rc 0 are identical. Prose-density 28/0 (STANDARD 6 ≤ 6).
Review: Codex `gpt-6-astra` R1 found 3 items, all from one sentence. The task-level `gates_signed` read as mandatory in a git repo,
and the CHANGELOG said every new sentence was git-less only. Fixed in `c2aa9195` (MAY, with or without git); R2 CLEAR. The
default Codex model (`gpt-6.1-sol`) is rejected for this account, so every review passes `--model gpt-6-astra`.
Tick hygiene: the move commit first carried `sprint(127) T2:` and leg 15 reddened on `done/TASK-440`, a path T2 never declared.
It was re-subjected to bare `sprint(127):` (COORD), which is how SPRINT-126 committed its moves; leg 15 is clean.

### 2026-10-18 | T1 | TASK-439 — task-level `gates_signed` + `## Approved design`; merged `db8ced02` (`165780fc` + R1 fix `4420c141`); done
A task file may carry `gates_signed: <GATE>[,<GATE>] @ <sha>` (a date only without git) and an optional `## Approved design`
paragraph; absent or a `[` placeholder means NOT signed. Stated in the task template, the task-file reference and the store schema,
with `gates_signed` added to the v1→v2 harness's known-optional list. `quick` step 2 and the G2 intro line write it, at 0 net lines
(`orchestrator/SKILL.md` stays 138). README documents `plansDirectory` as a MAY.
Builder evidence: v1-to-v2 101/0, orchestrator-store 42/0, store-writers 29/0, work-store 21/0, ownership-header and sprint-family
green, doc-caps no FAIL, prose-density 28/0. Review: Codex `gpt-6-astra` R1 found 2 items. The template and schema offered the
date with no "no git only" qualifier, and the mvp line lacked the date fallback; the coordinator suspected the second before the
review. The coordinator fixed both in the worktree (`4420c141`, each replacement matched exactly once, CRLF kept, harnesses
re-run green); R2 CLEAR. Post-merge: tsc rc 0 with 0 errors, layers-observed / layers-completeness / freeze / doc-caps clean,
duplicate-id check empty.
Box 4, judgment: on a git-less scratch tree (`git rev-parse --git-dir` fails), the owner approved scratch TASK-001's G1 and G2 by
popup. It ended with `gates_signed: G1,G2 @ 2026-10-18` and an Approved design paragraph, written in procedure order (G1, then
G1,G2); the never-approved TASK-002 carries neither.

### 2026-10-18 | scope-change | T3 TASK-441 Layers gain the sprint template and the store README (owner, popup)
**What broke.** A census of shipped files naming `git mv` / `plan_commit` / `git show` found two that the git-less lifecycle
depends on outside T3's Layers. `SPRINT.md.template` frontmatter reads `plan_commit: [sha — set at promote]`, and its comments
describe `git mv` moves; a git-less promote fills in that template first. `docs/work/README.md` states that a status change is a
`git mv`. Out of scope, since they need git by nature: `night-run.md` (worktrees), `release-patch` (a sha range) and
`migration-map.md` (a relocation is a move plus link fixes, outside the sprint lifecycle).
**Impact.** T3 Layers gain `skills/lean-doc-generator/templates/SPRINT.md.template` and `docs/work/README.md`, so
`docs/work/README.md` goes T1 → T3. No DoD change: box 2 ("the git-required wording names the git case") already covers both.
**Re-confirm G2.** The owner approved by popup.

### 2026-10-18 | gate | T5 G1: owner go-ahead to write into workdoo, via workdoo TASK-046 (popup)
The vehicle is one real, docs-only workdoo task: TASK-046 carries `company-workspace-roadmap.md`'s delivery sequence (16 rows,
P0–P12) into `docs/product/roadmap.md` from the template, with Status and Covered-by cells; the source file is untouched. It goes
G1/G2 → done by popup with `gates_signed: G1,G2 @ 2026-10-18`, which covers TASK-442 boxes 1 and 2 in one task. Writes are limited
to workdoo's `docs/work/` and `docs/product/roadmap.md`. /prime and /triage then run read-only there for box 3.
