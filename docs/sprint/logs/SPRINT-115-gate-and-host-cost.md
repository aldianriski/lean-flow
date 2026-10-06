---
sprint: 115
slug: gate-and-host-cost
owner: Maintainer
last_updated: 2026-10-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-115 — Execution Log

> Append-only companion to [`../SPRINT-115-gate-and-host-cost.md`](../SPRINT-115-gate-and-host-cost.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-06 | promote | plan locked, governance signed, five members: the gate's cost measured off-host and ruled
The owner picked scope "Gate + host cost" over three alternatives (all P1s · the hygiene smalls · defer). The size check at pull found no L
(one M, four S). `TASK-403` was filed at this promote for TD-224/225 (`5834cbb`). The members moved backlog → todo in their own
commit (`9a0997a`) and were stamped `sprint: SPRINT-115` in `cede84c`. The owner signed the governance checklist as is:
- **L-promotion:** none. No `promoted: no` row has count ≥ 2. Second route (number of `seen:` lines per active row): none. Census: 58 active +
  151 promoted + 1 superseded.
- **TD aging:** 130 of 141 open rows have aged against sprint 115 (created ≤ 112). Second route: 141 − 11 filed at 113/114 = 130. 6 `high` rows are
  open (4 of them written `**high**`, which a plain `severity: high` selector misses), all owned: TD-143 → 348 · TD-150 → 345 ·
  TD-090/117/128/168 → 357. No new escalation.
- **doc-aging:** §11: TD-174, resolved at SPRINT-112, has passed its 3-sprint clock, so its row is deleted in `5834cbb`. The ledger now holds 143 rows (141
  open + 2 resolved). CHANGELOG was rotated at 2.0.0, so nothing is due. §2: 0 OVER-CAP; 3 soft breaches, all with recorded `retain` dispositions.
- **epic rollup currency:** EPIC-014 and EPIC-015 are current (every `epic:`-stamped sprint has a row). EPIC-016 tracks workdoo's sprints only.
- **handoff ledger:** none.
**Drift flagged:** `TASK-345` may already be delivered. workdoo's supervisor checks the lean-flow pin (`supervisor.ts:176-181`), so it
is re-checked before any pull, not pulled here. **Promote-time per-file checks (TASK-368, by hand):** layers-completeness found T4's
Layers missing the bare `check-dod-delta.ts` the member names; fixed before the freeze, now 15 PASS / 0 FAIL. `check-sprint-by-reference` read
NO-PLAN-COMMIT before the commit existed, which is expected.
**Open for G2:** A1 (VPS as T2's measurement host) · A2 (where T5's promote hook lives) · whether T1 and T4 are *consequential* G (ADR-050).

### 2026-10-06 | progress | plan_commit recorded: cede84c
The `plan locked` commit is `cede84c`; this entry and the frontmatter field land in the next commit.

### 2026-10-06 | progress | batch G1 + G2 signed by the owner at `9bbc8be`; A1 and A2 ruled; tiers declared; wave plan set
**G1** ran the full checklist on all five members (none is `origin: decomposer`, so no fast-path). Goals, sizes and out-of-scope are as in
§ Plan; no L. **G2 rulings (owner, popup):** A1: T2's Round is measured on the VPS (Ubuntu 24.04, 2 vCPU, 7 GB), naming the host and stating
that a Linux total cannot speak for the Windows host. A2: T5's home is a new `scripts/promote-check.ts <sprint>`, named in `.claude/CONTEXT.md`,
never in the shipped skill. Tiers: T1 is *other* G (ADR-050: maintainer-only; `qa-check.sh` is the sole consumer of both harnesses). T4 is
**frozen** G (`guard-audit-legs.md` G20: R4 → freeze; sole consumer `qa-check.sh`). Neither is consequential, so the Codex gauntlet does not
apply (SPRINT-113 re-ruling) and review is the ADR-050 bar plus coordinator self-review. **G2 reachability finding:** `check-prose-density.ts`
never examines `docs/sprint/`. Over the repo root it covers `.claude`, `docs/epic`, `docs/research`, `skills/` and `spec/`, and against one
sprint file it prints `SKIP … nothing examined`, so TASK-368's 400-char half was unreachable as planned. The fix is the scope change below.
**Waves:** wave 1 runs in parallel, worktree-isolated: T1 · T4 · T5 (disjoint `Layers:`, every `Depends-on: none` or satisfied). Then T2
(3 VPS runs, after T1 merges), then T3 (after T2). D1 holds for `TECH-DEBT.md` (T1 before T3).

### 2026-10-06 | scope-change | T5 (TASK-368): Layers widened to reach the sprint file
**What broke:** at G2, the Plan's `Layers:` ("lean-flow's own promote procedure") named no file, and the prose-density half of TASK-368's
Done-when cannot reach a sprint file through the existing checker. **Change:** T5's Layers become `scripts/promote-check.ts` (new, TypeScript —
no new `.sh`) · `scripts/lib/check-prose-density.ts` (a single-file mode) · `evals/` fixtures for both seeded findings · `.claude/CONTEXT.md`
(the promote note naming the entry point). **Impact:** files only; TASK-368's `## Done when` text is unchanged. **G2 re-confirmed** by the
owner's A2 ruling above.

### 2026-10-06 | scope-change | T5 (TASK-368): Layers add `scripts/qa-check.sh` (register the new runner)
**What broke:** `qa-check.sh`'s completeness loop fails every `evals/run-*` harness that is in none of its three lists. T5 shipped
`evals/run-promote-check-fixtures.ts`, and `qa-check.sh` was outside T5's Layers. **Change:** the coordinator adds it to `eval_harnesses_always`
(about 1–2 s, no git) with a one-line cost note. **Impact:** one list entry plus one comment line; TASK-368's `## Done when` is unchanged. D1 analogue: T2 also
owns `scripts/qa-check.sh` (`eval_harnesses_optin`), so this edit lands before T2 starts.

### 2026-10-06 | progress | wave 1 merged: T1 · T4 · T5 (three Sonnet worktree builders, base `77d1c0d`); coordinator re-verified each, then merged `--no-ff`
T4's first spawn failed (`failed to read …/commondir`, a concurrent worktree-creation race); its orphan branch, which pointed at base, was deleted and the task re-dispatched.
**Review depth (skip-table lookups):**
- `consequence · T1 · behaviour: low (fixture assertions only) · governance: low (maintainer-only harnesses; other G)` → ADR-050 bar + coordinator self-review.
- `consequence · T4 · behaviour: low-med (new exemption path in a frozen guard) · governance: low (maintainer gate only; frozen G)` → retained fixtures + coordinator self-review.
- `consequence · T5 · behaviour: low (new maintainer entry point; prose-density root mode unchanged) · governance: low (Tier X; nothing in skills/)` → self-review.
No Codex loop: none of the three is consequential G or a shipped skill/template change (SPRINT-113 re-ruling).
- **T1 (TASK-403)** `6184fd2` + `a096397` → merge `8b780fa`. TD-224: the probe, case (ii) and its sanity seed spawn `bash`; the no-leak cases keep `sh`, which is
  qa-check's real shape. TD-225: case 2 asserts that the first finding is leg 12's loop-internal check, never `-early`, with the hang bounded by `LEG12_BOUND=900`. Builder
  proof: locale 5/0 and budget PASS on Windows and the VPS; both seeds redden on both hosts; blobs restored. **Coordinator:** locale 5/0 re-run on the merged tree;
  the TD diff touches the two status fields only. **Cost note:** case 2 must now reach leg 12, about 2 min on the Windows host (opt-in set) — T2's Round
  will include it.
- **T4 (TASK-354)** `1c14cdc` → merge `274e41f`. New `.dod-delta-exempt` (header only; no real row; `b89d6f0` stays an owner ruling). Rows read
  `<sha> -- <ruling> -- <reason>`. A declared tick → `PASS  dod-delta: EXEMPT …`; a malformed row → FAIL; an undeclared sibling → FAIL.
  `min_tests` 84 → 89. **Coordinator:** bun 89/0 and harness PASS, both in the worktree and on the merged tree. **Surface limit:** `qa-check.sh` prints FAIL lines and a PASS count, so the EXEMPT line
  shows in the checker's own output but not in the gate summary.
- **T5 (TASK-368)** `aa2b35c` → merge `c0be807`; runner registered in `7cb548ed`. The builder corrected one G2 detail: the repo-root
  prose-density run *does* reach the one active sprint file, but only through its baseline ratchet, so a new file still needs the single-file mode.
  Root-mode output is byte-identical before and after. **Coordinator:** fixtures 8/8, seeded exit 1, real SPRINT-115 file 16/0.
**Post-merge cross-cutting legs (merged tree):** tsc 0 · doc-caps 0 FAIL · prose-density 31/0 · freeze 6/0 · harness-list completeness clean · dod-delta harness PASS.
The full gate runs as T2's three VPS runs, and as system-verify at close.

### 2026-10-06 | scope-change | T2 (TASK-357): the `layers-observed` ruling is moot — its subject was deleted at SPRINT-113 T1
**What broke:** TASK-357's Done-when asks for a ruling on whether `layers-observed`'s differential (189.3 s) joins `eval_harnesses_optin` or stays
excluded and named. That differential and its twin were **deleted** at SPRINT-113 T1 (`9a0bfaa`, ADR-050; `qa-check.sh` now reads "deleted, not
excluded", and `eval_harnesses_excluded` is empty), so neither branch of the ruling exists. **Owner ruling (popup, 2026-10-06):** record it as moot. The
box is ticked once the Round lands, and the tick names `9a0bfaa` + ADR-050 as what resolved the ruling half. The Done-when text stays frozen. **Impact:** the measurement half is
unchanged: 3 completed `QA_FULL=1` runs on the VPS (A1) at `2297345`, profiled (`QA_PROFILE=1`), launched 08:30Z, to give the total as a range
plus the current cost of the three opt-in differentials (authority · doc-caps · night-run-rollup). The VPS got `nodejs` 18.19 so the typecheck leg runs.

### 2026-10-06 | scope-change | T4 (TASK-354) and T5 (TASK-368): `Layers:` corrected to what was built; the gate found the gap
**What broke:** the first profiled `QA_FULL=1` runs on the VPS (`2297345`) each read **`313 pass, 3 fail`**, and all three FAILs were this sprint's own
wiring, not a host artifact: (1) `emitter-column(POPULATION-scope)`: the new `scripts/promote-check.ts` was neither scanned nor out of scope.
(2) layers-completeness: T5's Plan `Layers:` still read "lean-flow's own promote procedure", so the evidence the coordinator wrote into the
TASK-368 tick (`evals/run-promote-check-fixtures.ts`) was "implied, absent". (3) layers-observed: T4's `.dod-delta-exempt` and T5's
files were undeclared. The scope-change entries above had widened Layers **in the Log only**, never on the Plan's `Layers:` lines,
which is what both checkers read. That is L-020 by the coordinator, caught by the system gate as designed. **Change:** T4's Layers add
`.dod-delta-exempt`. T5's Layers become the built list (`promote-check.ts` · `check-prose-density.ts` · its runner + fixtures ·
`.claude/CONTEXT.md` · `scripts/qa-check.sh` · `evals/run-emitter-column-fixtures.ts`). `scripts/promote-check.ts` joins the emitter-column rule
"the gate and its tooling", beside `qa-verdict.ts`: it relays findings, and nothing column-keyed reads it (emitter-column 9/0). Two unpushed
TASK-345 commits outside any task's subject form were re-issued with `sprint(115):` subjects (identical trees, `0d8e5d9` · `2027f8b`), so
layers-observed attributes them as coordinator work. **Impact:** members' `## Done when` are unchanged; both layers checkers read 0 FAIL.
**Measurement note:** the full gate on this VPS completes in **~105–110 s**, not tens of minutes. T2's Round re-runs on the fixed tree.

### 2026-10-06 | progress | T2 (TASK-357) done: Round 22 — 105–109 s over three green `QA_FULL=1` runs on the VPS; the opt-in ruling is moot
Re-run on the fixed tree `5d9335a`: `316 pass, 0 fail` ×3 (exit 0), wall 109 · 107 · 105 s, eval-harness leg 81–84 s. The three opt-in
differentials cost 1 · 2 · 5–6 s on this host (Windows 2026-09-20: 21.2 · 38.8 · 44.0 s). The ruling half is moot per the owner's scope-change
(`9a0bfaa`, ADR-050), cited in Round 22. `consequence · T2 · behaviour: none (measurement + research log) · governance: low (J2 ruling recorded
as moot by the owner)` → self-review. TASK-357's tracker rows TD-090 · TD-117 · TD-128 · TD-168 are left for T3's ruling and the close: Round 22
is the evidence they were waiting on, and re-aiming or closing them is an owner call, not this measurement's.

### 2026-10-06 | progress | T3 (TASK-348) done: TD-143's cost half ruled closed by the owner; the reason is in the row
Owner ruling (popup), chosen over "re-aim at the Windows host envelope": the gate holds ~9.5 MB, the kill is the host's memory, and the
off-host route is a working mitigation (Round 22, 3/3 green in 105–109 s). Re-file fresh if a verdict-less run recurs with > 3 GB free.
`consequence · T3 · behaviour: none · governance: low (J2 ruling recorded as the owner gave it)` → self-review.
