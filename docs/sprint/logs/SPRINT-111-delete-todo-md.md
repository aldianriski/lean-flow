---
sprint: 111
slug: delete-todo-md
owner: Maintainer
last_updated: 2026-09-30
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-111 — Execution Log

> Append-only companion to [`../SPRINT-111-delete-todo-md.md`](../SPRINT-111-delete-todo-md.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-30 | promote | plan locked, governance signed, four EPIC-017 members aimed at Closed-when 2
Scope ruled by the owner as "370 ∥ 381 → 394 → 380": T1 `TASK-370` · T2 `TASK-381` · T3 `TASK-394` · T4 `TASK-380`. Size check
before rendering: `TASK-380` was L at pull time, carrying 15 legacy tasks, 22 + 17 files mentioning TODO.md and a spec retirement.
It was split into `380` (migrate + delete) and `TASK-394` (readers + S11.TODOCAP), owner ruling, `9466686`. TASK-394's id was derived
from the store's max (TASK-393) and checked against `git log --all` (0 hits). Members were moved backlog → todo by `git mv` in their
own commit (`4a24854`), then stamped `sprint: SPRINT-111`. `plan_commit` is this Plan's first commit, recorded in the next commit.
The signed governance checklist, line by line (owner-signed; applied in `5e0d75b`):
- **L-promotion:** none (50 at count 1; L-218/219/220 are new).
- **TD aging:** 106 of 128 open rows aged against sprint 111: the 105 named before, plus TD-186 (Sprint-108, low). Second route:
  128 − 22 filed at 109/110 = 106. All 7 `high` rows are owned, three by legacy TODO.md tasks that T4 migrates.
- **doc-aging:** §2 has 0 hard and 5 soft OVER-CAP (the set is unchanged; TODO.md is standing until T4, the other four belong to TASK-384).
  The token budget sits at ~16087 <= 16087. §11: no resolved TD to delete. The store prune (359/360/374) is held for TD-206.
- **epic rollup currency:** EPIC-017 current (`035508b`). EPIC-014/015 unchanged. EPIC-016 has foreign WIP in the checkout.
- **handoff ledger:** none.
G1/G2 are not signed yet.

### 2026-09-30 | surprise | the layers guards SPRINT-110 built caught two findings on this Plan at render
On their first live input, check-layers-completeness flagged T1: prose naming T4 without `Depends-on`, and TASK-370's own
`## Done when` naming `TODO.md` absent from T1's Layers (`member-layers-incomplete`, TASK-390's new rule). Both were fixed before
the lock: the prose reworded, and `TODO.md` declared on T1's `Cites:` (named, not touched). Re-run: 12 PASS, 0 FAIL. Preflight
CLEAR, waves T1=0 T2=0 T3=1 T4=2, shared `evals/run-sprint-family-fixtures.sh` owned T2 → T3.

### 2026-09-30 | progress | plan_commit recorded: ab0c748
The `plan locked` commit is `ab0c748`; this entry and the frontmatter field land in the next commit.

### 2026-09-30 | scope-change | recon + outside review reshape the Plan before wave 0; G1/G2 signed on the lean re-plan
**What broke.** Three read-only censuses (T1 · T2 · T3) found gaps in the frozen Plan. (1) `migrate` does not know
by-reference sprints: on this repo it maps SPRINT-111's four `### Tn` (no DoD boxes) as tasks, reports the four member
store files as conflicts, and so blocks TODO.md removal. Its harness paths are hard-coded. (2) A3 is false: `skills/`
holds real prose readers — prime (row 5 · Resolution), lean-doc-generator SKILL.md ("TODO.md is the Backlog pool"),
`references/init.md` (scaffolds a v1 TODO.md unconditionally), two templates. (3) A hidden gate breaker:
`prose-density-baseline.txt` carries `TODO.md 1`; deleting TODO.md without the row turns leg 2b-ter red. (4) One
unlisted v1 reader in evals/: `assert-judgement-retry.sh`. (5) A2: STANDARD §15 counts a removed rule id as MAJOR in
meaning. An outside review (Codex) then measured evals + scripts/**/*.sh at 45,076 lines against 6,854 for all of
`skills/` (6.6×), counted 5 of sprints 101–110 as predominantly guard maintenance, and corrected the draft: ADR-043
makes the conformance engine consumer-facing, so "nothing ships to consumers" was wrong.
**Owner rulings (popups).** Fix by-reference in T1 · split the skills prose into T5 = `TASK-395` (id: store max 394;
395 has 0 hits in the tree and `git log --all`; the 5xx/8xx/9xx hits are fixture tokens) · retire leg 7's TD-aging half
(TD-203) · S11.TODOCAP retired as spec 0.13.0 labelled **breaking** · **lean re-plan**: guards for the retired v1 shape
are retired or frozen, never retargeted · governance diet → ADR-050 under a backlog task (`TASK-396`), after this sprint.
**Impact on § Plan.** T1 re-tiered X → G (it changes an invariant-checking harness), with a preservation check and a
real interrupted run. T2 shrinks to a disposition inventory + freezing the 4 v1 park asserts and their 4 selftests; its
DoD box 2 ("each retargeted harness has a v2 fixture") holds vacuously because nothing is retargeted — that is this
ruling, not a re-read (L-088). T3 retires rather than retargets, and gains `run-s2-placement-fixtures.sh`, the compat
fixture and `check-task-origin`'s harness. T5 added (Depends-on T1). T4 gains the baseline row and depends on T5.
**Consequence lookups (TD-092):** T1 · behaviour: migrate procedure + harness · governance: workflow contract → Tier G
scoped reviewer, worktree-isolated · T2 · behaviour: none (freeze + opt-in list) · governance: gate composition → scoped
reviewer · T3 · behaviour: gate legs + engine rule · governance: spec semantics (MAJOR-meaning) → worktree-isolated
outside review · T5 · behaviour: skill procedure prose · governance: consumer-facing skill contract → one scoped sonnet
reviewer · T4 · behaviour: data migration · governance: none new → full gate + scoped reviewer.
**G1** full checklist (origins: 370/394 manual, 381/380 decomposer) — goal, size (all M, T2 S), files, out-of-scope,
assumptions — confirmed at the owner's plan sign-off. **G2** signed (plan approved, 2026-09-30).

### 2026-09-30 | progress | bookkeeping gate read; committed through 4 reds of known cause (owner ruling)
Layers completeness 10 PASS · 0 FAIL after the prose named full paths. Dispatch preflight CLEAR: waves T1=0 T2=0 T3=1 T5=1 T4=2;
shared files owned T1→T5 (lean-doc-generator SKILL.md, migration-map.md) · T2→T3 (qa-check.sh) · T3→T4 (prose-density
baseline) · T5→T4 (TECH-DEBT.md). The gate prints `QA-CHECK: 275 pass, 4 fail`, TRUNCATED at 547s against a 520s budget, with 17 harnesses unrun.
The four: prose-density and layers-observed both name `docs/epic/EPIC-016-…` (foreign WIP in the checkout, unstaged); `run-doc-caps-fixtures`
case 8 timed out at 5.0s against a 5s limit (it passes alone: 1 pass, 0 fail, 5.02s); and the budget. None is this commit's.
owner-ruling: bookkeeping-gate — overridden: four reds of known cause, none from this change; the full gate at raised budget runs at system-verify.

### 2026-09-30 | progress | T2 (TASK-381) inventory + freeze, commit 2cf71b9, merged 404dfc6
- Two-selector inventory of evals/ harnesses (fixtures excluded): total 81 · A (literal `TODO.md`) 16 · B (v1 concepts, `grep -F`) 33 ·
  A∩B 15 · A∖B 1 · B∖A 18 · A∪B 34. Cross-check: 34 + 47 = 81, and a third route (`git ls-files | grep -v '^evals/fixtures/'`) = 81,
  `cmp`-identical to the find list. A naive `grep -v fixtures` gave 27 because it drops every `run-*-fixtures.*` name (a wrong-selector trap).
- Dispositions: FROZEN 8 · OWNED 382 ×3, 387 ×1, 390 ×2, 391 ×3, 392 ×2, 383 ×1 · T3-OWNS ×4 (sprint-family, s2-placement,
  task-origin, conformance-engine TODOCAP) · V2-ALREADY ×7 · TEXT-ONLY ×1 · CURRENT-SHAPE ×3 (dispatch-preflight, v1-to-v2,
  night-run-outcome). No READS-V1-UNOWNED file outside the frozen 8.
- Freeze: a `# FROZEN — v1 historical coverage` header on 8 files; the 4 selftests left qa-check's `eval_harnesses_optin`. `sh -n` OK.
  Stale doc mentions remain in evals/README.md (177 · 380–390 · 440–443) and docs/QA.md:48 → TASK-396's sweep.
- Review: consequence · T2 · behaviour: none (headers + opt-in list) · governance: gate composition → a scoped review by the non-author
  coordinator over the 9-file diff: CLEAR (in Layers only; the list edit removes exactly the 4 names). DoD 2/2 ticked; box 2 is vacuous by owner ruling.

### 2026-09-30 | progress | T1 (TASK-370) migrate proven on a real copy; commit 1146449, merged 9f82a28
- Harness `v1-to-v2-fixtures: 24 pass, 0 fail` (on the branch and again on main after the merge). The map gains a by-reference rule (a `## Members` sprint:
  its `Tn` are not mapped, members must exist and are never written) and a preservation invariant. The real run also forced four small rules:
  prose is carried verbatim, apostrophes are dropped from slugs, unmapped v1 fields go to `## Tracker` and free prose to `## Why`, and a missing
  done-when gets a flagged placeholder. A Plan-only `tier:` comes from the owner.
- Real input (`git archive` copies of 26929c4, outside the repo). Copy a, full run: 15 ids written, SPRINT-111 skipped as by-reference, 0 conflicts,
  TODO.md removed, 17 non-task prose blocks listed for the owner. Copy b, stopped after 5 files then resumed: `diff -r a b` identical. Harness
  `--before/--after`: ids 15 = 15 both ways, ticks 0 = 0, preservation 38/38. **Caveat:** the procedure was driven by a scratch Bun script
  written to the map, not by an agent reading the prose. T4 is the first agent-run on this repo.
- Flags the real run raised, which T4's plan step will put to the owner: 9 legacy tasks lack `tier`, 2 lack `class`/`authority`, and TASK-319 and
  TASK-188 have done-when/assumes gaps.
- Seeded breaks (preservation · resume · by-reference skip) each reddened exactly the targeted case. Hash convention: `git hash-object` against the
  HEAD blob `38c62cf8f8ab…`, restored and verified. Also fixed: `splitFrontmatter` was not CRLF-safe, so the harness had been red on an autocrlf
  checkout; the `expected/` 913–915 text is now verbatim.
- Review: consequence · T1 · behaviour: migrate procedure + harness · governance: workflow contract → a worktree-isolated outside review.
  **CLEAR**, 3 low notes: the tick count is a net sum (a pre-existing design), `isByReference` is exact-heading only (fails loud), and
  `docs/sprint/archive/` is out of scope by design. DoD 3/3.

### 2026-09-30 | progress | T5 (TASK-395) skills stop directing TODO.md reads/writes; commit eadd3a8, merged fb11c8f
- prime resolves from `docs/work/` and the `status: active` sprints' `## Members`. lean-doc-generator's promote/close/retro use store files and
  drop the pointer steps. init scaffolds the store lazily (STANDARD §2) and no longer creates TODO.md. The migration-map dev-flow/adlc rows now
  produce store task files. README, CHANGELOG `[Unreleased]` and two templates are updated. TD-209 is filed (max was TD-208, 0 git hits):
  `TODO.md.template` is kept and deleted in the 2.0 cleanup.
- Two-selector grep over skills/: every remaining hit is the allowlist, a "never read" statement, or the kept template. Largest SKILL.md is 138 lines.
- Review: consequence · T5 · behaviour: skill procedure prose · governance: consumer-facing skill contract → a scoped review by the non-author
  coordinator of the 9-file diff. One finding, fixed in a follow-up commit: prime counted open DoD from "each member's task file", which read as
  the listed path. Member paths are frozen at promote and go stale once a task moves folder (TASK-370/381 already sit in done/), so prime now finds
  members **by id**, as sprint-by-reference.md already did. Two items are left as they were: TECH-DEBT.md:10 and README's tree line still say
  TODO.md, and T4 owns both. DoD 3/3.

### 2026-10-02 | scope-change | T3: ADR-034 keeps S11.TODOCAP's id; DoD box 2 read as "reader removed" (owner rulings)
**What broke.** T3's first commit (`d75d861`) removed S11.TODOCAP from §11 (spec 100 → 99, 51 → 50 checkable, labelled breaking).
ADR-034 freezes the rule-ID surface at 100 ("the contract's denominator"), and 9 assertions in 4 TS test files pin it
(`apps/cli/src/main.test.ts` · `apps/cli/src/spec-file-reader.test.ts` · `packages/standard/src/spec-reader.test.ts`). They went red
(`spec-reader.test.ts` 33 pass, 4 fail). Neither the builder's harnesses nor the outside review caught it, because `qa-check.sh`
never runs `bun test`. It was found by a coordinator grep for stale count claims, a different route.
**Owner rulings (popups, 2026-10-01/02).** (1) Keep the id and retire only its reader: `assert_S11_TODOCAP` becomes a note stub that
touches no file, and the spec stays 100 / 51. 0.13.0 is a plain MINOR, the "breaking" label is withdrawn, and A2 is moot.
(2) TASK-394 DoD box 2 ("the engine rule removed") is satisfied by "reader removed, id kept as a note stub". This is a ruling, not a re-read (L-088).
**Impact.** T3 gains a second commit (`b324740`). One edit falls outside Layers: `evals/run-ownership-header-fixtures.sh` (+15), the direct test of
the retired `_own_docs` TODO.md read. A2 ("retiring is a MINOR") is resolved by the ruling instead of being confirmed.

### 2026-10-02 | progress | T3 (TASK-394) TODO.md readers retired, S11.TODOCAP kept as a reader-free note; d75d861 + b324740, merged 45961bc
- Census (A=`TODO\.md`, B=`Active Sprint|## Backlog|Backlog pool|TODOCAP|§ Backlog`; scripts+evals without fixtures): before A=30 B=8 A∩B=8
  A∪B=30, after 29/7/7/29, reconciled with the coordinator's pre-census (30). Zero retired-reader rows remain. skills/ was already clean after T5 (allowlist only).
- Retired, not retargeted: qa-check legs 3 (the TODO.md subject), 5, 7 (the whole leg, all of it TD-aging: closes TD-203, row closed at
  close) and 8. Engine: S11.BACKLOG's v1 breadcrumb scan and TODO.md from `_own_docs`. check-task-origin: population 2. Sibling checks stay.
- Spec 0.13.0 plain MINOR (§15: no verdict moves pass→fail, no id removed). `--reconcile` gives 100. Engine coverage is 45 of 51 checkable, so README:365 holds.
- Review: consequence · T3 · behaviour: gate legs + engine rule · governance: spec semantics. A worktree-isolated outside review
  (threat model: missed reader · collateral · vacuous fixtures · spec consistency · gate breakage) found 3 findings, none high. F1 (med):
  the retired-legs 5/7/8 case ran only leg 6's region and was vacuous. Fixed: the region now spans leg 5's old position to leg 9; restoring
  3fe3320's qa-check.sh reddens it (19 pass, 4 fail). F2/F3 (stale 51/eleven counts) were dissolved by ruling (1). The rework was re-reviewed
  by the non-author coordinator: CLEAR.
- Seeded breaks: 8, each reddening only its own cases; files parse; line delta ≤1. Restores were checked by `git hash-object` == `git rev-parse HEAD:<p>`.
  Stub seeds: a TODO.md read reddens only `s11-todocap-stub-reads-nothing`; an emitted finding reddens both over-cap-retired cases (now load-bearing).
- On main after the merge: sprint-family, conformance-engine, ownership-header, task-origin and spec-reader all green, plus qa-store-legs
  23/0 and s2-placement green. The 4 spec/cli TS files were 138/0 (re-run by the coordinator). The full `bun test` was 839 pass, 1 fail: the fail is
  `discovery-order.test.ts` rung-1 bypass, an existing row (TECH-DEBT.md:977), untouched by T3.
- Open, not T3's: check-doc-caps and check-prose-density still reach TODO.md through §2's `320 soft` cell until T4 deletes the file;
  evals/README.md:226 → TASK-396's sweep. DoD 3/3 (box 2 by ruling, box 3 vacuous because nothing was retargeted).

### 2026-10-02 | scope-change | T4 plan step done (agent-run migrate, no writes); owner rulings; Layers widened for stale docs; Codex gauntlet review
**Plan (first agent-run of the migrate prose on this repo).** 15 legacy tasks (row census `grep -c '^- \[.\] TASK-'` = parsed list = T1's 15),
all to `backlog/`, 0 conflicts (33 store files checked), SPRINT-111 skipped as by-reference. Every TECH-DEBT owner pointer resolves by id.
T1's flag count was imprecise: 3 lack `authority` (319 · 188 · 327), not 2. The plan found 10 places where the map's prose was ambiguous;
they go to a migration-map fix after this sprint.
**Owner rulings (popups).** (1) tiers: G for 346 · 347 · 320 · 322, P for 348 · 345 · 321, X for 319 · 188. (2) 319: execution · J2 · EPIC-015, with a written
done-when. 188: execution · J1, with a written done-when. 327: J1. (3) normalise: frontmatter is plain enums; comments and qualifiers go verbatim into
`## Why`/`## Assumes`; `none — but …` becomes an Assumes line; 366/367 split into one box per lettered clause; needs-info tasks get an `**open:**` line;
full slugs are kept. (4) 16 prose blocks are dropped and block 14 (L-111 "opportunistic") moves into the `## Why` of 188 and 327. (5) **Layers widened (Tier P):**
the stale "TODO.md present" lines in README.md · docs/architecture/overview.md · .claude/CONTEXT.md · docs/QA.md ·
docs/qa/QA-001 · QA-002 · evals/README.md are fixed in T4. TECH-DEBT.md:11/:41 and TD-203's status were already in Layers.
(6) **All execution is reviewed by Codex in a gauntlet loop** (review → fix → re-review until clean). That covers T4 and, retroactively, T3's merged range.

### 2026-10-02 | progress | T3 Codex gauntlet (retroactive, owner ruling): CLEAR in hybrid mode
- Codex's sandbox on this machine cannot spawn processes (`Win32 error 5`, `uv_spawn EPERM`) or write git index locks, in read-only or `--write` mode.
  Owner ruling: **hybrid**. Codex reviews statically and names the confirming commands; a Claude runner executes them in an isolated worktree;
  Codex gives the verdict on the verbatim output.
- Round 1 (static, 3fe3320..45961bc): 1 PLAUSIBLE. `check-research-archive.sh` `live_citer`'s generic `*.md` grep includes TODO.md. Ruled a
  generic population member, not a v1-shape reader, and moot at T4's delete. Threats 1, 3 and 5 could not be run.
- Round 2 (runner, then Codex verdict): collateral diff at both revisions. Every OLD∖NEW case is a retired TODO.md branch; leg 7 was confirmed
  wholly TODO.md-dependent at `3fe3320:scripts/qa-check.sh:901–932`. Swapping each old script back in reddens every retired-branch fixture
  (qa-store-legs 19/4 · sprint-family 6 FAIL · ownership 2 FAIL · task-origin 5 FAIL). Restores were hash-checked. `bun test` (4 spec/cli files) 138/0. **Codex: CLEAR.**
