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
