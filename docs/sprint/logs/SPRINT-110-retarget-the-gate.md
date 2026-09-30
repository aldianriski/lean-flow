---
sprint: 110
slug: retarget-the-gate
owner: Maintainer
last_updated: 2026-09-29
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-110 — Execution Log

> Append-only companion to [`../SPRINT-110-retarget-the-gate.md`](../SPRINT-110-retarget-the-gate.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-29 | promote | plan locked, governance signed, four EPIC-017 members on the critical path
Scope ruled by the owner as "390 ∥ 391 → 383": T1 `TASK-390` · T2 `TASK-391` · T3 `TASK-383` · T4 `TASK-392`. Size check
before rendering: `TASK-383` carried about seven engine rules plus `qa-check.sh` and `night-run.sh`, so it was split
into `383` (engine) and `TASK-392` (qa-check, night-run), one per surface (owner; `0727b0d`). `380`/`381` now depend on both.
The next id was derived from the store and TODO.md (max `TASK-391`) and checked against `git log --all` (no `TASK-39[2-9]`).
The members were moved backlog → todo by `git mv` in their own commit (`928288a`), then stamped `sprint: SPRINT-110`.
`plan_commit` is this Plan's first commit, recorded in the next commit.
The signed governance checklist, line by line (owner-signed; applied in `642d23f`):
- **L-promotion:** none (47 at count 1; L-198 bumped to 3 at the SPRINT-109 close, already promoted).
- **TD aging:** 105 of 115 open rows aged against sprint 110, of which the 99 named in earlier sweeps plus 6 newly aged
  (TD-180…185, all low, Sprint-107). Second route: 115 open − 10 filed at 108/109 = 105. All 7 `high` rows are owned.
- **doc-aging:** §2 caps, 0 hard and 5 soft OVER-CAP. `TODO.md` is a standing ruling until `TASK-380`; the other four
  (EPIC-017 · adlc-epic-sequencing · epic-017-effectiveness · HARDENING-V3) belong to `TASK-384`. The token budget sits at
  ~16087 <= 16087, with 0 headroom. §11: TD-179 (resolved at SPRINT-107) deleted. Freshness: `docs/QA.md`'s caps row
  refreshed for ADR-048.
- **epic rollup currency:** EPIC-017 current (rolled up at `6761016`). EPIC-014/015 have had no member close since.
  EPIC-016 can't be checked from here.
- **handoff ledger:** none.
Owner rulings at this promote: D1 (`.ts` gates, carried from SPRINT-109) · D2 (the store is exempt from the ownership
header) · D4 (the 383 split). G1/G2 are not signed yet.

### 2026-09-29 | progress | plan_commit recorded: 4ddc80d
The `plan locked` commit is `4ddc80d`; this entry and the frontmatter field land in the next commit (the SPRINT-109 shape).

### 2026-09-29 | scope-change | G2 rulings after recon: A1 false, two missing rules, Layers widened, T3 now after T4
**What broke:** two read-only recon passes (Explore; about 92k and 132k tokens) refuted or widened four premises.
- **A1 false.** Nothing (ADR-047 · sprint-by-reference.md · dispatch.md:65-68) defines a member's Layers on a sprint with
  no `### Tn` blocks. `## Touches` is free prose that no script parses (brace shorthand, directories, "its eval harness").
- **A2 does not apply to T1/T2.** The 15 → 24 · 38 · 50 inventory counts `TODO.md` parsers (EPIC-017:79), not layers-guard
  files. It is `383`/`392`'s ground, and their recon re-derived it (below).
- **A3 holds only if S11.TODOCAP is not retired.** Retiring it touches `spec/STANDARD.md` §2/§11/§14 and 4 more files.
- **A4 confirmed.** qa-check.sh:1411-1437 and 1529-1537 need no change for T1/T2.
- **Missed by the hand-off:** `assert_S9_TWOFILES` (engine :2017, greps `^- \[x\]` in the sprint file) and qa-check **leg 2g**
  (:557, counts Plan `- [ ]`). Both are silent on a by-reference sprint.
- **Also found:** check-layers-observed.ts:483 `atClose` is always true on v2 (no Plan `- [ ]`), so close-time exclusions apply
  during execution. Its runner asserts only the `.sh` oracle, so a member fixture needs a TS home. `.conformance-exempt` cannot
  express a glob. The engine's S9–S11 fixtures live in `run-sprint-family-fixtures.sh`, and S3/LAW3's in
  `run-ownership-header-fixtures.sh`. `reap()` is driven by four harnesses beyond T4's Layers, and neither shell script can
  reach `resolveMembers` without a CLI.
**Owner rulings (2026-09-29, G2 popup):**
- **R1 (A1):** on a sprint with no governing Plan block for a member → a named FAIL `member-layers-undeclared` per member.
  With a Plan, the guard correlates members through `Cites:` (check-authority's pattern). `## Touches` stays prose.
- **R2 (TODOCAP):** scoped to v1/mixed trees (fires only while `TODO.md` exists, message → `migrate`), and retired by
  `TASK-380` with the file. No spec edit this sprint, so A3 holds.
- **R3 (CLI):** a new `scripts/lib/sprint-members-cli.ts` (a thin argv wrapper; `sprint-members.ts` stays read-only, D6) is
  **owned by T4**, and **T3 now depends on T4**. Waves: T1 ∥ T2 → T4 → T3.
**Impact on § Plan (Layers and Depends-on are live declarations; no member `## Done when` edited):**
- T2 Layers + `evals/layers-observed.test.ts` (new; the runner calls it the way the completeness runner does).
- T3 Layers: `.conformance-exempt` out; `evals/run-sprint-family-fixtures.sh` + `evals/run-ownership-header-fixtures.sh` in.
  Depends-on + T4.
- T4 Layers + `scripts/lib/sprint-members-cli.ts` (new) · `evals/run-reap-terminal-fixtures.sh` ·
  `evals/run-night-run-outcome-fixtures.sh` · `evals/fixtures/night-run-outcome/` · `evals/run-revise-loop-ceiling-fixtures.sh` ·
  `evals/fixtures/night-run-reaper/` · `skills/orchestrator/references/night-run.md` (:516 is stale).
**Re-confirm G2:** the preflight is re-run after the edit (next entry).

### 2026-09-29 | progress | preflight re-run after the scope-change: CLEAR, waves T1=0 T2=0 T4=1 T3=2
layers-completeness over the edited Plan: 8 PASS, 0 FAIL, after the `Cites:`/`Layers:` contradiction on T4 was resolved (night-run.md is
now touched, so it moves off the `Cites:` line). Pre-screen: verify-reaches NOTE, 4 members and 0 mechanical `Verify:` clauses, so every
criterion is a judgment tick evidenced by its harness verdict line.

### 2026-09-29 | progress | G1 + G2 signed by the owner at `04e517c`; rank 0 to be dispatched (T1 ∥ T2, worktree-isolated)
The owner signed the batch G1 table and the G2 design and rulings R1–R3 (entry above) in one popup: "Sign, dispatch T1 ∥ T2".
G1: every member ran the full checklist (`manual` origins, and TASK-383 was changed by the split). Review depth, read from the skip table now:
consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high
All four are Tier G: a worktree-isolated outside reviewer each, with a threat model and a stop rule (L-165 · L-168 · L-217).
Not staged: an uncommitted EPIC-016 edit from another session (the workdoo SPRINT-008/009 rollup), which currently FAILs prose-density
(9 > 8 dense lines). It isn't this sprint's (L-042).

### 2026-09-29 | progress | rank 0 dispatched (T1 ∥ T2, sonnet + /tdd); worktree-base guard PASS ×2
Declared base `0595043`, the TASK-390/391 todo → in_progress move. `worktree-base` PASS for T1 (`agent-a10d5993…`) and for T2
(`agent-aa04be0b…`), both branched from `0595043`. The briefs carry R1, D1, D6, the full Tier G bar (a must-FAIL per finding, a
selection-varying fixture, the motivating artifacts, seeded breaks under `git hash-object` = `rev-parse HEAD:path`), and a
typecheck route through the main checkout's `tsc` (TD-194's workaround). 14 worktrees left from SPRINT-106–109 are still present
and were not removed. Some hold commits, so the owner is asked.

### 2026-09-29 | progress | T2 TASK-391 merged at `ca162ec`. Outside review CLEAR, 3 census-zero gaps → TD-196/197/198
Builder (sonnet + /tdd, worktree `0595043`): `02eb691`. check-layers-observed.ts resolves members (`resolveMembers`, read-only)
and adds two findings. `member-layers-undeclared` covers R1: no governing `### Tn`, including a no-Tn sprint, so there is no
vacuous PASS. `member-out-of-layers` checks a `Task: TASK-NNN` trailer against its governing Tn blocks' Layers. On v2, "at close"
is now derived from members, which fixes the recon bug. `--no-members` keeps the `.sh` oracle's v1 parity in the differential (D1).
The new `evals/layers-observed.test.ts` (13 tests) is wired into the runner. Seeded breaks S1–S5 each reddened exactly their own
cases; restored `8ae2b75f` (`git hash-object` = `rev-parse HEAD:path`). Coordinator re-check: 4 files, all in Layers; runner
`13 tests, 0 fail`, `all green`.
Isolated review (sonnet, 9 probes, ~60k tokens): **CLEAR**. Gaps, each census 0: TD-196 (two `Task:` trailers are concatenated and
the commit PASSes) · TD-197 (a backtick-wrapped trailer value) · TD-198 (`--no-members` is silent when on). No fixture covers a
member cited by two Tn blocks (minor).
Post-merge on main (D5): tsc 0 errors · gen-index current · layers-completeness 0 FAIL · layers-observed FAIL on exactly one file:
the other session's uncommitted EPIC-016 edit (WIP no task declares, correctly flagged, not a T2 defect).
review · T2 · scoped-reviewer · behaviour:material · governance:high

### 2026-09-29 | scope-change | T4 Layers + `evals/run-qa-store-legs-fixtures.ts` (new): legs 3/5/7/8 have no harness
**What broke:** TASK-392's second box needs a retained must-FAIL fixture per changed leg. Recon found that qa-check legs 3 (:660),
5 (:825-835), 7 (:874-897) and 8 (:899-913) have no harness at all, so no file in T4's Layers can hold those fixtures.
**Impact:** T4 adds one new TypeScript harness (no new `.sh`, owner rule), registered in `qa-check.sh`'s always-run list. qa-check.sh
is already T4's file. The default profile already truncates at its budget, so the harness must stay fast (seconds, no git spawn
per case where avoidable). Coordinator-owned design constraint, not an owner ruling: substantive new logic (member counting for
`reap()` and leg 2g) lives in TypeScript (`sprint-members-cli.ts`), and the `.sh` edits are thin call sites. Legs whose subject is
`TODO.md` itself follow R2's principle: scoped to while `TODO.md` exists, and retired with it by `TASK-380`.
**Re-confirm G2:** within R2/R3 as signed. No member `## Done when` edited.

### 2026-09-29 | surprise | T4's first dispatch branched from T1's commit; the worktree-base guard caught it, re-dispatched clean
The first T4 worktree came up at `9910ec3` (T1's branch tip), 8 commits behind the declared base `20a8076`:
`FAIL worktree-base-stale`. Cause: the coordinator had run a command with `cd` into T1's worktree to re-check it, the harness
adopted that worktree as the session's working directory, and a new isolated worktree branches from the session checkout's
HEAD, not from `main`. The builder was stopped before doing any work (0 commits, clean, auto-removed). T1's worktree (merged,
clean) was fast-forwarded to `20a8076`, and T4 was re-dispatched: `PASS worktree-base` at `20a8076`. This is the guard doing
exactly its job (TD-054). The rule for the rest of the sprint: re-check a worktree through `git -C <path>`, never `cd` into it.

### 2026-09-29 | progress | T1 TASK-390 merged at `d23d8e2`. Outside review CLEAR; the differential re-run on main gives 16/16
Builder (sonnet + /tdd, worktree `0595043`): `9910ec3`. check-layers-completeness.ts resolves members (`resolveMembers`, read-only)
and applies the existing implied-file rule to each member's `## Done when` against the Layers of the Tn block that cites it:
`member-layers-incomplete`, and `member-layers-undeclared` for a member no block governs, including a sprint with zero `### Tn` (R1).
Fixture trees member-mixed / member-no-plan / member-clean vary the selection: a stamp-only member, a Tn citing two members, a
directory-covered file. Seeds A/B each reddened exactly their 2 tests; restored `d39554ff` (`git hash-object` = `rev-parse HEAD:path`).
Isolated review (sonnet, ~60k tokens): **CLEAR**. Stale `## Members` paths (390/391 listed under todo/) resolve by id. The
differential's filter is anchored, so it cannot hide a v1 line. Its own differential run did not finish (>25 min on this host), so
the coordinator re-ran it on main: `16/16 identical`, 12 member lines excluded by name (D1), `PASS: TS port matches the LIVE Shell
oracle byte-for-byte`. TD-199 filed (census 0): an id merely mentioned on a `Cites:` line governs. `taskIds` is shared, so
check-authority and check-dod-delta read it the same way (verified at sprint-members.ts:160).
Post-merge on main (D5): tsc 0 errors · gen-index current · layers-completeness 12 PASS / 0 FAIL, SPRINT-110's 4 members resolved.
review · T1 · scoped-reviewer · behaviour:material · governance:high

### 2026-09-30 | progress | T4 TASK-392 merged at `745bb86`. Outside review CLEAR; TD-200…203, TD-203 handed to TASK-380 (owner)
Builder (sonnet + /tdd, worktree `20a8076`): `b896800` · `dccdca1`. New `scripts/lib/sprint-members-cli.ts` (`kind · members · counts ·
active`; exit 2 `SPRINT-MEMBER-UNRESOLVED`/`SPRINT-FILE-MISSING`, 3 `NOT-BY-REFERENCE`, 64 usage), owned by T4 and consumed by T3 next
(R3). On v2, `reap()` counts member `## Done when` boxes and Cites-based units, and unreadable members end `HARD_FAILURE`. Leg 2g decides
"log owed" from members' open boxes. Leg 7 reads the active sprint from sprint files. Legs 3/5/8 apply only while TODO.md exists (R2).
The new `evals/run-qa-store-legs-fixtures.ts` is registered. 19 seeded breaks; one demolition seed (S13) replaced by a targeted one.
Restores `cbc3913`/`a474f67`/`4bb5ba3` (`git hash-object` = `rev-parse HEAD:path`). Coordinator re-check: 36 files, all in Layers;
store-legs `36 pass, 0 fail`; reap-terminal `all green`; hashes match.
Isolated review (sonnet, ~11 probes, ~60k tokens): **CLEAR**. On the real SPRINT-110, `counts` agrees with a hand count. TD-200 (a
zero-box member counts as delivered) · TD-201 (a Tn citing no current member drops out of the units, so a false `PLAN_EXHAUSTED` is
possible; medium) · TD-202 (two sites ignore `kind`'s exit status), each census 0. Owner ruling: TD-203 (leg 7's TD-aging half greps
a TODO.md holding 0 TD rows, which predates the store) is owned by TASK-380.
Post-merge on main (D5): tsc 0 errors · gen-index current · layers-completeness 0 FAIL · `sh -n` both scripts · store-legs 36/0 ·
live `counts`: `dod 4 4`, `units 4 2` (T1, T2 delivered), equal to a hand count.
review · T4 · scoped-reviewer · behaviour:material · governance:high

### 2026-09-30 | scope-change | R3 met ADR-043 before T3 dispatch: owner rules `bun` required for v2 checks (ADR-049)
**What broke:** R3 (signed 2026-09-29) had the conformance engine call T4's `sprint-members-cli.ts`. `conformance.sh` is the
adopter-facing entry point, and ADR-043 records that it needs only `sh` and that adding a runtime is irreversible, a decision of
its own. The coordinator recommended R3 without reading ADR-043: a **retrieval miss**, caught while briefing T3 and before any build.
**Owner rulings (2026-09-30, popups):**
- **R4:** the owner asked for "the best, high performance" runtime rather than pure `sh`, pointing at kalasuara (Python). Recon:
  kalasuara runs Python only on machines it controls and ships no runtime to others, and its own ADR-010 rejects a second runtime.
  Per-call startup on this host: `sh` 33 ms · node 60 ms · `bun` 100 ms · python3 159 ms. The ruling is `bun`, required on a v2 tree,
  with a named `bun-required` FAIL when it is absent; a v1 tree stays `sh`-only. Recorded as **ADR-049**, with a README § Upgrading to
  2.x note and a `CHANGELOG [Unreleased]` note.
- **R5:** T4's merged `reap()` bun dependency is accepted and filed as **TD-204** for TASK-372/373 to confirm before release.
- **R6:** a TypeScript engine port (the TD-168 cost centre) is filed as **TASK-393**, backlog, after 2.0.0.
**Impact on § Plan:** none. T3 keeps its Layers and its T4 dependency. Its brief now includes the `bun-required` finding and a must-FAIL
fixture for it. The ADR, DECISIONS, README, CHANGELOG, TD-204 and TASK-393 are coordinator-owned governance writes.
**Re-confirm G2:** R3 stands as amended by R4. No member `## Done when` edited.

### 2026-09-30 | progress | rank 2 dispatched: T3 (sonnet + /tdd); worktree-base guard PASS at `18d9ccc`
Declared base `18d9ccc`, the TASK-383 todo → in_progress move. The session checkout was fast-forwarded to `main` first, so the
worktree branches from the right base this time. `worktree-base` PASS (`agent-ab8e9dbc…`). The brief carries D2 (`_own_docs` exempts
task files), R2 (TODOCAP only while TODO.md exists), R4/ADR-049 (`bun-required`, the CLI's exit status read at every call site, zero
bun calls on a v1 tree), and ADR-043's v1 parity bar (exit code and report text), proven before and after over v1 fixtures, the
archive, and this repo with every diff line explained.

### 2026-09-30 | surprise | T3 builder stalled (stream watchdog, 600 s silent) mid seeded-break proof; work intact, resumed
The agent was reported `failed`, but the report is about the reporter, not the artifact (edit-safety (c)). Worktree inspected:
0 commits, 539 uncommitted lines across exactly the 4 Layers files, plus 31 temp seed/base copies. The working
`conformance-engine.sh` parses and is **not** a seeded copy: each of the 12 `engine-seed-*.sh` differs from it by exactly one line,
and `engine-base-tmp.sh` equals base `18d9ccc`. All three harnesses parse, and none equals a temp copy. The same agent was resumed
from its transcript with this order: verify, then commit the green work first, then run the remaining seeds against their one
target case in the background (a multi-minute foreground harness is the likely stall), delete every temp file, prove the restore
with `git hash-object` = `rev-parse HEAD:path`, then report.

### 2026-09-30 | progress | T3 TASK-383 merged at `dffbcb1`. Outside review CLEAR; owner accepts two departures; TD-205…208
Builder (sonnet + /tdd, worktree `18d9ccc`, resumed once after the watchdog stall): `cbc6464`. `_own_docs` exempts
`docs/work/<status>/TASK-*.md` (D2). TODOCAP applies only while TODO.md exists (R2). BACKLOG gains the §11 store prune
`closed-task-past-retention`. FOURBUCKETS counts an added backlog task. TWOFILES/VERIFYCLAUSE read members through the CLI, and
PLANFROZEN reuses check-sprint-by-reference.ts (ADR-049). `bun-required` is a named FAIL, the CLI's exit status is read everywhere,
and a v1 tree makes zero bun calls (observed through a shim). About 72 retained v2 cases; seeded breaks for every new branch
(S2c is an equivalent mutant). v1 parity: 354 fixture trees + 109 archived plans byte-identical. On this repo, 77 → 20 FAILs:
−60 task-file header lines, +3 prune findings. Restore `99552a5` (`git hash-object` = `rev-parse HEAD:path`). Coordinator re-check:
1 commit, 4 files in Layers, hash matches, `sh -n` ok.
Isolated review (sonnet, ~8 probes, ~90k tokens): **CLEAR**. The PLANFROZEN mapping, `CHECK-ERROR` and the bun paths are clean. A
parity sample of 13 trees is byte-identical (narrower than the builder's claim, and said so).
**Owner rulings (2026-09-30):** S9.SCOPECHANGE stays on § Plan, with the member freeze in PLANFROZEN (the split is accepted). TODOCAP's
migrate text only on a store tree (v1 text unchanged, per ADR-043; accepted). Filed: TD-205 (the ordering half is lost for member
edits) · TD-206 (the prune's "live-named" is narrower than the open-task and epic citations: TASK-359/374 are still cited by open
backlog DoDs, and all three by EPIC-017's Task map) · TD-207 (the exemption accepts any folder name) · TD-208 (VERIFYCLAUSE partial read-back).
**The prune ruling is conditional:** the owner's "delete at close" was pending the three being truly unnamed. TD-206 shows they
are not, so it goes back to the owner at the close.
Post-merge on main (D5): tsc 0 errors · gen-index current · layers-completeness 0 FAIL · `sh -n` ok · live `counts`: `dod 6 2`, `units 4 3`.
review · T3 · scoped-reviewer · behaviour:material · governance:high
