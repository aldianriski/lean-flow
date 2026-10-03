---
sprint: 114
slug: prove-adopt-release-2-0
owner: Maintainer
last_updated: 2026-10-03
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-114 — Execution Log

> Append-only companion to [`../SPRINT-114-prove-adopt-release-2-0.md`](../SPRINT-114-prove-adopt-release-2-0.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-03 | promote | plan locked, governance signed, six members: EPIC-017's remaining Closed-when 6–10 through the 2.0.0 release
Scope ruled by the owner: all six through release (371 · 365 · 372 · 385 · 386 · 373), over two smaller options. Size check at pull: none
is L (four M, two S). Members moved backlog → todo by `git mv` in their own commit (`ddb57bf`), then stamped `sprint: SPRINT-114`.
Dependency facts at pull: every prerequisite outside the sprint is in `done/` (364 · 374 · 378 · 379 · 380 · 384), so `371` is the only
member unblocked; the rest chain inside the sprint. The signed governance checklist (owner-signed; applied in `98d2c73`):
- **L-promotion:** L-224 (count 2) → `skills/orchestrator/references/dispatch.md` § Members by reference, rule 5 (Tick). L-182 (count 3) →
  the same file's § Worktree dispatch protocol, the builder-evidence line. Both `disposition: merge`; bodies collapsed to pointers. Census
  cross-check: count distribution over `promoted: no` rows was 50 × 1 + 1 × 2 + 1 × 3 = 52, equal to the `promoted: no` total; 50 after.
- **TD aging:** 130 of 133 open rows aged against sprint 114. Second route: 133 − 3 filed at 112/113 = 130. Net change since the 113 promote:
  +2 (TD-215, TD-216 at 113 close), −1 (TD-209 resolved by TASK-378). 6 `high` rows are open, all owned (TD-143 → 348 · TD-150 → 345 ·
  TD-090/117/128/168 → 357). No new escalation.
- **doc-aging:** §11: TD-203 (resolved SPRINT-111 by TASK-394) had passed its 3-sprint clock, so its row is deleted; the ledger now holds 135
  rows (133 open + 2 resolved). CHANGELOG rotation is due at `2.0.0`, which is T6. The store prune stays held (D5). §2: 0 OVER-CAP; the 4 soft
  breaches are recorded `retain` dispositions. Token budget ~13482 ≤ 16087.
- **epic rollup currency:** EPIC-017 current (SPRINT-113 row carries `4ee8c80`). EPIC-014 and EPIC-015 unchanged since the 113 promote.
  EPIC-016: uncommitted edits from another session, not assessed and not staged.
- **handoff ledger:** none.

**Drift found at promote, ruled before the freeze.** workdoo's SPRINT-008 had closed and a SPRINT-009 promote was in progress there,
uncommitted; workdoo's `TODO.md` was 288 lines. TASK-371's first Done-when still named "389-line TODO.md Backlog + the active SPRINT-008".
Owner ruling: the criterion names the queue at the branch base and records its counts at execution (member amended, 2026-10-03). Owner
ruling on timing: T1 branches only once workdoo's SPRINT-009 promote is committed, and T2/T4 write to workdoo main only inside a window the
owner opens (D2).
**Open for G2:** how the release candidate is cut (A1); whether T3 is *consequential* G (ADR-050).

### 2026-10-03 | progress | plan_commit recorded: cd8d355
The `plan locked` commit is `cd8d355`; this entry and the frontmatter field land in the next commit.

### 2026-10-03 | progress | G1/G2 signed (owner); RC = side branch + tag; T2 waits on workdoo SPRINT-009 T4
**G1:** full checklist for T1 (amended at promote) and T2 (`origin: manual`); fast-path confirm (scope unchanged) for T3–T6, all
`origin: decomposer`. None is L. Goals, files, out-of-scope and assumptions confirmed; recon recorded below.
**G2:** preflight CLEAR on `f4f128a` (no shared file; waves T1 = 0 · T2 = T3 = 1 · T4 = T5 = 2 · T6 = 3). Rulings:
- **A1 → ruled.** The candidate is cut on a side branch `release/2.0.0-rc.1`, tagged `v2.0.0-rc.1`, with every derived manifest at
  `2.0.0-rc.1` **on that branch only**. It is checked out to a folder outside the repo and loaded in workdoo sessions with
  `claude --plugin-dir <path>` (flag verified present, Claude Code 2.1.288), with the user-scope `lean-flow@lean-flow` disabled for that
  project so two copies never load. Why: this machine installs lean-flow at user scope from GitHub with `autoUpdate: true`, so an rc on
  `main` is one push away from every consumer. `main` stays 1.66.1 until T6. The rc commit never lands on `main`, so leg 15's
  `plan_commit..HEAD` range never sees it.
- **A2 → answered by recon, and it adds a dependency.** `readVersionPins`/`checkVersionPins` have no production caller and no real probe
  exists in workdoo. workdoo SPRINT-009 **T4** ("Give the version pin a production caller", cites lean-flow TASK-365) builds it. Owner
  ruling: **T2 is blocked on workdoo SPRINT-009 T4**, so "the running plugin verified to report it" uses the real probe. Unblock condition:
  that task's DoD ticked on workdoo `main`.
- **T3 tier:** other G per ADR-050 (no shipped skill names `run-layout-fixtures.ts`; it is a maintainer leg). Bar: a must-FAIL fixture per
  check plus one run on real artifacts, certified from a fresh checkout (L-182), under D3's Codex loop. No mutation campaign.
- **A3:** `codex-cli 0.158.0` and `kimi 0.27.0` are on PATH; T3(c) confirms they resolve the plugin.

### 2026-10-03 | scope-change | T3 (TASK-372): Done-when (b)'s "tombstone" state is n/a
**What broke:** the frozen criterion lists "tombstone, absent-TODO.md and stray-write states". The owner ruled on 2026-09-24 (amendment in
TASK-372 itself) that `migrate` leaves no tombstone. A tombstone state therefore cannot occur on any tree 2.x produces.
**Impact:** no fixture is built for it. The risk it stood for (a 1.x writer meeting a v2 tree) is covered by the stray-write case: a 1.x write
recreates `TODO.md` → mixed → refused → `migrate` re-ingests it. The box is ticked with the tombstone clause marked n/a and this entry
cited; the frozen text is not edited.
**Re-confirm G2:** owner ruled at G2 sign-off (2026-10-03): rule it n/a.

**Consequence lookups (TD-092):**
consequence · T1 · behaviour:material · governance:low
consequence · T2 · behaviour:material · governance:low
consequence · T3 · behaviour:low · governance:high
consequence · T4 · behaviour:material · governance:low
consequence · T5 · behaviour:low · governance:low
consequence · T6 · behaviour:material · governance:high
T1 · data migration in a consumer repo · Codex loop (D3) · T2 · deployment on a candidate · Codex loop · T3 · gate composition the release
rests on → other-G bar + Codex loop · T4 · consumer view reads a new source · Codex loop · T5 · research measurement, method unchanged ·
Codex loop · T6 · versioned manifests are the consumer contract → Codex loop + lockstep derived by `grep -l`.
**State at sign-off:** T1 is waiting on the owner action "commit workdoo's SPRINT-009 promote" (still uncommitted at 2026-10-03).

### 2026-10-03 | scope-change | T1's RC step runs first, so T3 can start before the workdoo half of T1
**What broke:** the Plan orders T3 after T1 whole, but T3's only real input from T1 is the release candidate. T1's workdoo half is blocked on
the owner action (workdoo's SPRINT-009 promote is uncommitted), which would idle T3 for no reason.
**Impact:** T1 splits into two steps on the same task: (1) cut `release/2.0.0-rc.1` + tag `v2.0.0-rc.1` in lean-flow (a side branch, never
`main`), once the promote full gate is green; (2) the workdoo branch migration, still waiting on the owner. T3 is dispatched after step 1,
worktree-isolated. No `Layers:` change (the rc commit stays off `main`), and no task or DoD is added or removed. T2 still follows T1 step 2.
**Re-confirm G2:** owner ruled 2026-10-03: "Cut RC, start T3".

### 2026-10-03 | progress | promote full gate (`QA_FULL=1`, detached, run as its own call): `QA-CHECK: 308 pass, 3 fail`, untruncated, 1983 s
Read from the gate's own verdict line. Each FAIL dispositioned, none introduced by this sprint:
- `prose-density` on EPIC-016 and `layers observed` naming EPIC-016 as undeclared: both read the **uncommitted EPIC-016 edit from another
  session** in the working tree. Re-run in a clean detached worktree of HEAD `d2c8721` (L-182; `core.longpaths` scoped to that one `git`
  call): prose-density 31 PASS / 0 FAIL, layers-observed 1 PASS / 0 FAIL, with EPIC-016 pristine there.
- `run-orchestrator-store-fixtures.ts` text-contract: **TD-211**, red since SPRINT-110 `dccdca1` and filed at SPRINT-111. The harness runs
  only in the opt-in profile, and the last three closes ran the truncated default profile, so it was carried, not seen.
**Owner ruling:** cut the RC now from the committed tree and carry TD-211; it must be green before T6 (D4).

### 2026-10-03 | progress | T1 step 1: `2.0.0-rc.1` cut -- `release/2.0.0-rc.1` @ `915385e`, annotated tag `v2.0.0-rc.1`
Manifests derived with `grep -l '"version"' .*-plugin/*.json` (4 files) plus the README footer: all five read `2.0.0-rc.1` on the side branch;
`main` still reads 1.66.1. Checked out detached at the tag to `D:/Project/lean-flow-rc1` (outside the repo, 0 dirty files);
`claude plugin validate` passes with 2 warnings, both pre-existing in `marketplace.json` (unknown `schema_version`, no description).
**Surprise:** `check-manifest-lockstep.sh` cannot read a pre-release version (`ver_of` matches only `X.Y.Z`), so on the rc branch it FAILs
`no parseable version`. Lockstep for the candidate was verified by reading all five values. It is maintainer-only (no shipped skill calls it)
and the final `2.0.0` parses. Retro TD candidate.

### 2026-10-03 | progress | T3 (TASK-372): builder reported; Codex round 1 FINDINGS 4, all confirmed, sent back to the builder
**Builder (Sonnet, worktree-isolated) reported** `25e6dde` (3 files, all inside T3's `Layers:`), 24 of 30 headless runs. (a) PASS: 7/7
rc skills refuse a real v1 export of workdoo HEAD, with `git status` 0 before and after each run, and the loaded copy proven from `system/init`.
(b) PASS with caveats: 1.66.1 writers wrote into the store on 2 of 3 v2 trees and recreated `TODO.md` on 1; the rc refused the mixed tree and
`migrate` re-ingested {001, 002} beside {901} losslessly once owner input supplied the withheld fields. (c) Codex install/prompt-level PASS
(isolated `CODEX_HOME`, all 14 skills resolved); Kimi STOPPED, because install needs an interactive session plus credentials. (d) PASS with
`--plugin-dir` standing in for install. Coordinator re-ran the harness on the branch: `layout-fixtures: 37 pass, 0 fail`.
**Codex round 1** (hybrid: the first dispatch could not read files and returned no verdict, which was not read as CLEAR; re-sent with every file
inlined): `CODEX: FINDINGS 4`. The coordinator ran each confirming command: (1) `[X]` hides a duplicate → `true`; (2) a body `id:` wins over a
quoted frontmatter id → `TASK-901`, passes; (3) a non-`TASK-*` store file is invisible to `find`; (4) no bash on PATH →
`ENOENT uv_spawn 'bash'`. All four sent back for one bounded retry with a must-FAIL plus a sibling control per fix, proven against the old harness.
**Open for the owner:** Kimi live install · the untested 1.x id collision (spec lines 254–282 cover it) · `migrate`'s withhold rule applied
inconsistently across runs (spec line 194: "never guessed, never defaulted") · "install 2.x" exercised via `--plugin-dir`, not a marketplace install.

### 2026-10-03 | progress | T3 (TASK-372): Codex r1 fixed in `d3a1476` (coordinator re-ran: `layout-fixtures: 41 pass, 0 fail`); four owner rulings
Builder fix round: `[ xX]`; frontmatter-only id (bare/double/single quoted, CRLF-safe); every store `*.md` except `README.md`, NOID fails;
`readdirSync(recursive)` walk, no subprocess. 3 must-FAIL fixtures (`census-dup-xbox`, `census-dup-quoted-id`, `census-noid-nontask-file`)
plus 2 controls, each shown old-green / new-caught. 3 mutations each redden only their own cases (restore verified by `git hash-object`). One
pre-existing `bash`/`find` call remains (~line 146, `selection-varying-v2-empty-work`), outside this fix. Codex round 2 is dispatched.
**Owner rulings on T3's open items (2026-10-03):** (c) Kimi: the owner runs the interactive install once (owner action) · (b) collision: add a
real run (dispatched, evidence only) · `migrate` withhold inconsistency: **TD-217** filed (next id derived from the ledger, `max = 216`; a broad
grep's `TD-961` traced to SPRINT-103's recorded fixture token, i.e. contamination, not a row), with T1 guarding the workdoo migration
mechanically · (d) the `--plugin-dir` stand-in is accepted, plus a post-push marketplace install check (owner action).

### 2026-10-03 | progress | T3 (TASK-372): 1.x id-collision, real run PASS (owner-ruled addition to (b)); coordinator re-verified
rc.1 `migrate` (loaded copy `D:\Project\lean-flow-rc1` 2.0.0-rc.1, from `system/init`) ran on a v2 store holding `TASK-901` plus a
`TODO.md` row that is also `TASK-901` with a different title and Done-when. It printed `CONFLICT — TASK-901 (unresolved; file left exactly as
it stood)` with a field-by-field diff and three owner choices; the plan pre-approval was not read as a choice. Coordinator re-check on
`D:/t114/v2e`: store file `0c450ae3…` and `TODO.md` `54a4795f…` both equal their pre-run hashes, `git status` 0 on a 1-commit repo, and
`docs/work/` holds the one original `TASK-901` file only. migration-map.md § Resume / conflict rule held as written. Headless runs: 25 of 30.

### 2026-10-03 | progress | T3 (TASK-372): Codex round 2 -- r1's 4 FIXED; 4 new: 1 fixed (sent back), 3 census-zero → TD-218
Codex re-review of `d3a1476` (all files inlined; 33 KB prompt): every round-1 finding FIXED with file:line evidence. Four new findings; the
coordinator ran the confirming commands: F1 (empty frontmatter lets a body `id:` through) → `TASK-777`, confirmed · F3 (must-FAIL oracles
assert counts, not identity, so `census-dup-xbox` passes on the wrong duplicate) → `passes: true, dups: ["TASK-001"]`, confirmed · F4 (BOM /
trailing `# comment` → `NOID`) → both `null`, confirmed · F2 (symlinked store file skipped) not run (symlink privilege on this host).
**Disposition (owner's bounded-review rule):** census of real store files, 73 across three trees: 0 BOM · 0 symlink · 0 commented id · 0 empty
frontmatter, each detector seed-proven (1/1/1). F1, F2, F4 → **TD-218** (id derived: ledger max 217). **F3 is not a population shape**: it is
the must-FAIL fixture's own oracle, so it is fixed (sent to the builder). Codex round 3 will be scoped to that one diff.

### 2026-10-03 | progress | T3 (TASK-372): Codex r3 CLEAR; merged `3f4b66c`; post-merge typecheck red → fixed `19670ac`; (a) (b) (d) ticked, (c) open
**Codex round 3** (scoped to `58ceec8`, the F3 fix: exact expected identity per census case, sorted comparison): `CODEX: CLEAR`. The wrapper
flagged that its excerpt was capped at 160 lines; the coordinator checked coverage: the excerpt ran from line 283 to EOF (380), and every
hunk sits at lines 325–343. Coordinator re-ran Codex's mutation: `identity [TASK-901] WRONG`, 40/1, unmutated 41/0.
**Merged** `--no-ff` as `3f4b66c` (16 files, all `evals/`). **Post-merge cross-cutting legs (L-218):** the layout harness on main's autocrlf
checkout reads 41/0; layers-completeness 18 PASS; by-reference 7/0; gen-index current; layers-observed only the foreign EPIC-016 WIP;
**`tsc --noEmit`: 4 errors** (TS2532/TS2322, strict-null) in the new census, invisible to the builder because worktrees have no `tsc`
(TD-194). That is L-218's own shape, caught by the post-merge leg it prescribes. Fixed inline by the coordinator (type-only, mechanical:
`fm[1] ?? ""`, `?? null`, `m[1] ?? ""`); tsc 0, harness 41/0, mutation still caught. `19670ac`.
**Ticked:** (a) · (b) (tombstone n/a per the scope-change; collision run included) · (d) (`--plugin-dir` stand-in, owner-accepted).
**Open:** (c) Kimi live install (owner action); Codex is resolved at install/prompt level. TASK-372 stays in `in_progress/` until (c).

### 2026-10-03 | progress | T1 (TASK-371): workdoo migrated on retained branch `lean-flow-2.0-migration` @ `629f91c`; 3/3 boxes ticked (verify under owner ruling)
**Unblocked by owner action:** workdoo's SPRINT-009 promote committed at the owner's request (`576e120` plan locked, `704c6be` records
`plan_commit`). The lean-flow EPIC-016 rollup that had sat uncommitted (`d600628`) was committed with its new row trimmed under the
prose-density ratchet (639 → 378 chars; 8 ≤ 8, baseline not raised).
**Base, recorded at execution (owner amendment):** TODO.md 288 lines · SPRINT-009 active · 11 row headers (2 ticked) + 5 Plan `Tn`, of which
T4 cites TASK-050, giving 15 ids. Cross-checked by a second selector (`TASK-NNN —` headers = 11). Sprint boxes: 18 Plan + 1 owner-action;
migrate's "18" and the coordinator's "19" reconciled.
**Run 1, plan-only** (`--permission-mode plan`, Opus, $1.87): wrote nothing, and **withheld all 15** for `tier:` (spec line 194, honoured
this time; contrast TD-217). It raised O1–O10 + P1–P13. **Owner rulings:** the field set (tier G = 050/052/053/054 by retained must-FAIL,
P = 018/033/051, X = rest; class/authority; P1/ready/manual for 051–054; 040 AFK) · mapping recommendations · sprint → `## Members` ·
P1–P13 as proposed.
**Run 2, apply** (`acceptEdits` + git/read allowlist, told not to commit; $1.99): 15/15 written, pending 0, `TODO.md` `git rm`'d. It
self-reported that P7a/c/e were blocked (`.claude/` writes are sensitive) and that verify was not run.
**Coordinator verification** (`store-check.ts`, seeded good/bad controls passed first): 15 files, 15 unique, 0 missing, 0 stray;
Done-when 33 boxes (18 Plan + 15 row), 0 ticked. **TD-217 guard caught 2 invalid enums** migrate carried verbatim: 033 `origin: owner`
(migrate did not flag it) and 050 `origin: promote` (flagged as C4). Owner ruling: both → `manual`, v1 word kept in `## Why`. The first
instrument was itself defective (values read with a leading space), so the rewrite with controls is what made the verdict trustworthy.
**Owner-ruled follow-ups applied by the coordinator:** P7a → workdoo CLAUDE.md (+3), P7c/P7e → CONTEXT.md (153 > 150, breach filed as
workdoo **TD-033**); the Windows SIGKILL test filed as workdoo **TD-034** (workdoo ids derived: max 032; a `TD-054` hit was a citation of
lean-flow's row).
**Verify:** `VERIFY: 3 pass, 1 fail -- test` (typecheck, typecheck:web and lint ok). The single failure, `command-check.test.ts`
(SIGKILL → `exited 1` on Windows), fails identically on untouched workdoo `main` `704c6be`; the migration diff touches no `packages/` or
`apps/` file. Ticked under owner ruling (ADR-021). A test-spawned `bun --eval setTimeout` orphan held the pipe open for 10 minutes; it was
killed by verified command line only.
**/prime (rc1, read-only):** "docs/work/ (v2 store…)", SPRINT-009 with 5 members, 18 open.
**Findings for the Retro:** under `--plugin-dir`, `/prime`'s `Skills:` row reads `n/a`, because the base-dir path has no version even though
`plugin.json` sits in it; TASK-018's verbatim `## Why` still points at "§ Standing facts above", which now lives in CONTEXT.md.
**Branch:** local only; pushing it to workdoo's remote is owner-reserved.

### 2026-10-03 | progress | T1 (TASK-371): Codex CLEAR on the workdoo migration diff; coordinator spot-check agrees → done
Codex static review of `704c6be..629f91c` (v1 TODO.md, full diff, approved plan and owner rulings inlined; ~101 KB, 1724 lines). Threat
model: content lost or altered · ruling not applied · sprint conversion broke · links broken. Result: `CODEX: CLEAR`. **The verdict came
back bare, with no per-class reasoning**, so the coordinator ran an independent check of the riskiest class (content loss) before accepting it:
every v1 row's `done-when:` searched for in its task file. 9 rows carry one and all 9 are found; the 3 rows split on `;` were checked part by
part (012 3/3 · 014 3/3 · 015 2/2). The other 2 (011, 018, superseded) carry none and got the procedure's `TODO: owner`. Review accepted.

### 2026-10-03 | scope-change | T3 (TASK-372): (c)'s Kimi half is skipped (owner ruling: focus on Claude Code)
**What broke:** the frozen (c) reads "the Codex and Kimi runtimes resolve the plugin's resources". The Kimi half needs an interactive Kimi
session with the owner's credentials, and the owner ruled it out of scope: "we just focus for claude now, kimi we can skip".
**Impact:** (c) is ticked on the Codex evidence (isolated `CODEX_HOME`, `codex plugin add` → installed, enabled 2.0.0-rc.1, all 14 skills
resolved) with the Kimi half marked **skipped by owner ruling, not proven**. The static manifest case (`runtime-manifest-kimi-resolves-skills`)
stays in the harness. The owner-action checklist's Kimi row is withdrawn. Nothing about Kimi is claimed in the release.
**Re-confirm G2:** owner ruled 2026-10-03.

### 2026-10-03 | scope-change | T5 (TASK-386): completeness is not re-run (no "after" event)
**What broke:** the frozen criterion says "TASK-374's method re-run unchanged". Its completeness measure is *first decomposition pass ÷
settled set* for one epic, and no epic has been decomposed since the store landed, so there is nothing to re-run it on.
**Impact:** completeness is recorded as **not measurable**; retrieval and recurrence are re-run unchanged. A synthetic re-decomposition was
offered and declined as an artificial, contaminated input. The gap is carried to the next real epic decomposition (Retro follow-up).
**Re-confirm G2:** owner ruled 2026-10-03 ("Record as not measurable").

### 2026-10-03 | progress | T5 (TASK-386): "after" measured; Codex loop 3 rounds → CLEAR; ticked → done
Results in `docs/research/logs/epic-017-effectiveness.md` (Rounds 1–4). Key committed before answers (`fb3a526`). **Retrieval:** a fresh
Haiku restricted to the two always-loaded files. Literal scoring: before 9/12 → after 5/12; the baseline's own conventions: 11 → 6. Falls
either way, though 3 of the 5 new misses are stated in CONTEXT.md (answerer misreads at n = 1), and R1 is a real doc ambiguity.
**Recurrence** (SPRINT-104…113): selector (a) 13 (before 22), selector (b) 16 (before 19): lower on both, on overlapping windows; (a)
blind at 113 because of L-224's collapse at this promote. **Verdict: effectiveness NOT demonstrated by this method.**
**Codex loop:** r1 FINDINGS 2 (retrieval not literal on either side → 9→5; an unsupported 109/110/112 attribution, the coordinator
confirmed against L78/L101/L220) · r2 FINDINGS 1 (Round 3 overclaimed that the correction worsened the drop; literal drop 4 < 5) · r3 CLEAR.
Coordinator instrument errors caught before any figure was used: selector (b)'s sprint-number extraction (fixed, re-run).

### 2026-10-03 | scope-change | T6 `Layers:` correction: `evals/run-orchestrator-store-fixtures.ts` (TD-211, a T6 prerequisite)
**What broke:** the owner ruled that TD-211 must be green before T6 (D4: the release gates on a clean gate), but its file belongs to no
task's `Layers:`, so a fix commit would be UNATTRIBUTED in leg 15. **Impact:** T6's `Layers:` gains the harness (a declared correction,
L-100); no DoD, task or criterion changes. The fix re-anchors the stale text-contract phrase on night-run.md's current wording.
**Re-confirm G2:** owner directed the fix now ("keep continue", 2026-10-03, after the TD-211 option was offered).

### 2026-10-03 | scope-change | T2 unblock: owner opens the workdoo-main window now; workdoo's D3 re-ruled ("pin first, merge early")
**What broke:** T2 waited on (i) workdoo SPRINT-009 T4 (the version probe) and (ii) workdoo SPRINT-009's D3 ("this repository stays v1 this
sprint"), which kept the migration branch unmerged until that sprint closed (O9). Neither was going to move inside this sprint.
**Owner ruling (2026-10-03):** merge the migration into workdoo `main` now, which opens D2's window and re-rules workdoo D3, then build
workdoo T4 (TASK-050) on the v2 layout, then complete T2's pin check. SPRINT-009 continues on v2. **Order is forced:** T4 built first on v1
would tick SPRINT-009 Plan boxes that the migration already moved into TASK-050.
**Impact:** T1's proof branch stays retained (merging keeps the ref). workdoo sessions must load the candidate (`--plugin-dir`), because
1.66.1 against a v2 tree is the inconsistent case T3 recorded. No lean-flow DoD changes.

### 2026-10-03 | progress | T2 design ruled: workers load the candidate via an env-driven plugin dir; workdoo targets a VPS
**Gap found before T2:** the version probe reuses the workers' own CLI arguments and runs in the worker's checkout, so it reports whatever
lean-flow *that directory* loads: the user-scope 1.66.1, or nothing under the local guard. Setting the pin to `2.0.0-rc.1` would then hold every
dispatch. The workers themselves must load the candidate, not only interactive sessions.
**Owner ruling (2026-10-03):** "workdoo that need to deploy in VPS, for leanflow follow your recommended". Hence an **env-driven plugin
dir**: when `LEANFLOW_PLUGIN_DIR` is set, the worker args add `--plugin-dir <dir>` and disable the user-scope lean-flow for that process.
The probe reuses those args, so the pin check observes exactly what workers load. That suits the VPS (set the variable and the pin in its
environment) and works in any checkout. VPS deployment itself is gated on workdoo `TASK-010`; T2 verifies locally with
`LEANFLOW_PLUGIN_DIR=D:/Project/lean-flow-rc1` and `LEANFLOW_PLUGIN_VERSION_PIN=2.0.0-rc.1`.
**Sequencing:** that change lands after workdoo T4 merges, because it touches the same `buildArgs` T4 builds on.
