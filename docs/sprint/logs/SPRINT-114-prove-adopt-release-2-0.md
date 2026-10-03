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
