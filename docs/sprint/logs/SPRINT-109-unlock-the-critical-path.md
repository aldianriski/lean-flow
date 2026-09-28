---
sprint: 109
slug: unlock-the-critical-path
owner: Maintainer
last_updated: 2026-09-28
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-109 — Execution Log

> Append-only companion to [`../SPRINT-109-unlock-the-critical-path.md`](../SPRINT-109-unlock-the-critical-path.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-28 | promote | plan locked, governance signed, four EPIC-017 members on the critical path
Scope ruled by the owner as "critical-path unlock": T1 `TASK-377` · T2 `TASK-364` · T3 `TASK-382` ·
T4 `TASK-387`. Size check before rendering: `TASK-363` (L) was split into `TASK-390` and `TASK-391`,
one per guard (`f1ea00c`), and then moved to `cancel/` (`de5afa6`). Both stay in the backlog. The
members were moved backlog → todo by `git mv` in their own commit (`eb1a072`) and then stamped
`sprint: SPRINT-109`. `plan_commit` is this Plan's first commit, recorded in the next commit.
Governance (owner-signed, `a0f37ee`): L-promotion none (47 unpromoted, all count 1) · TD aging 99 of
107 open, 30 newly named in a SPRINT-109 sweep · TD-090/117/128 (high, no live owner) → `TASK-357` ·
TD-157/169/170/175 deleted under §11 · `TD-187` filed (S11.TDDELETE judges no real resolved row) ·
epic rollups current (EPIC-016 can't be checked from here) · no handoff ledger.
Promote checks on this file: layers-completeness and authority PASS · prose-density 32/0 ·
by-reference NO-PLAN-COMMIT, expected until the next commit. G1/G2 are not signed yet. A1 (spec
`1.0.0`) and A2 (a zero-dep tokenizer) go to G2.

### 2026-09-28 | surprise | the signed checklist under-counted the soft cap breaches: 5, not 4
The checklist reported four soft OVER-CAP files. The cap check prints **five**: `TODO.md` (528 > 320)
was already over before this promote, and my first cap run cut it off with `tail -15`, so the breach
never reached the checklist. SPRINT-107's promote had counted it (5). The disposition is unchanged,
because deleting `TODO.md` is `TASK-380` (EPIC-017 Closed-when 2), so no new work follows. It was
caught by re-running the check on the rendered file, a second route, and not by the rule. L-198's
shape: the first query cut its own population short.

### 2026-09-28 | promote | the governance record, restated with every checklist line named
The first promote entry named four of the five checklist lines, but not doc-aging, so
`S10.PROMOTEREVIEW` read it as `promote-checklist-absent`. The signed checklist, line by line:
- **L-promotion:** none (47 unpromoted, all count 1).
- **TD aging:** 99 of 107 open rows aged, 30 newly named in the SPRINT-109 sweep (`a0f37ee`). TD-090/117/128 → `TASK-357`.
- **doc-aging:** §2 caps, 5 soft OVER-CAP files (the four signed + `TODO.md`, see the entry above), 0 hard.
  §11 retention: TD-157/169/170/175 deleted, and `TD-187` filed. `S11.TODOCAP` (`todo-over-cap-at-promote`, 531 > 320)
  fires on size alone. Its disposition is **open, pending an owner ruling**: it was never on the signed checklist.
- **epic rollup currency:** EPIC-014/015/017 current. EPIC-016 can't be checked from here.
- **handoff ledger:** none.
Other conformance FAILs at this commit predate the promote: 32 `update-trigger-absent` / 28 `ownership-header-field-missing`
on store task files (the engine doesn't yet know the store, `TASK-383`) · ADR-043/044 · the CHANGELOG rotation · 2 tracked fixture logs.
Verdict, not exit code: `S10.TDAGING` PASS (99 named) · `S11.TDDELETE` PASS, which is TD-187's blind spot and not a real clearance.

### 2026-09-28 | promote | owner ruling: TODO.md's cap breach is accepted until TASK-380
`S11.TODOCAP` (`todo-over-cap-at-promote`, 531 > 320) is a **ruled standing breach** (owner, 2026-09-28).
`TASK-380` deletes `TODO.md` (EPIC-017 Closed-when 2), and trimming a file that is about to be deleted would be
the diet EPIC-017 exists to stop. The FAIL stays visible on every run until 380 lands. It is not a pass.

### 2026-09-28 | progress | preflight HALT on brace-shorthand Layers → paths written out, CLEAR
The dispatch preflight read `scripts/lib/check-doc-caps.{sh,ts}` (T2) and `scripts/lib/check-authority.{sh,ts}` (T3)
as the bare directory `scripts/lib/`, which then "overlapped" every other `scripts/lib/` file: 7 `shared-file-unowned`
FAILs across T2/T3/T4, none of them real. The paths are now written out (a live declaration, L-100; `## Done when`
is untouched). Re-run: `PREFLIGHT: CLEAR`. Waves are T1 · T3 · T4 at rank 0 and T2 at rank 1 (after T1, on `spec/STANDARD.md`).

### 2026-09-28 | scope-change | G2 rulings: T4 now depends on T3, and Layers widened for T1–T4
**What broke:** A3 was false. No exported member lookup exists (the `## Members` ∪ `sprint:` union is private to
`check-sprint-by-reference.ts`), and T3 and T4 both need it. `check-verify-reaches` is shell-only, and reading
member files would mean rewriting most of it. Removing §2's `TODO.md` row would hard-FAIL `S11.TODOCAP`
(`spec-table-unreadable`) until TASK-383.
**Impact / owner rulings (2026-09-28, G2 popups):**
- A1 → spec `1.0.0`. T1 keeps §2's `TODO.md` row, with its cap, labelled *v1 layout, retired at 1.0, read only by migrate*,
  and adds a `docs/work/` row. TASK-383's hand-off list names every rule to retarget. `overview.md:22` states the version.
- A2 → T2's named tokenizer is Claude's, sampled once via the `count_tokens` API (owner action: the key). The gate uses
  bytes ÷ the measured ratio, with the ratio and error band recorded in `docs/research/logs/token-calibration.md`. The budget
  **ratchets at adoption**: growth past it FAILs unless a disposition is recorded, and TASK-384 lowers it.
- T3 extracts the member lookup into `scripts/lib/sprint-members.ts`, and `check-sprint-by-reference.ts` re-points at it
  (its harness stays green). The authority guard reads the member's `authority:` and FAILs `authority-plan-member-mismatch`
  when a Plan block's J-class differs from the member its `Cites:` names. task-origin covers every `docs/work/*/TASK-*.md`.
- T4 **depends on T3** (rank 1). verify-reaches is ported to `check-verify-reaches.ts`, the `.sh` is deleted, and the runner and
  the `qa-check.sh` leg are re-pointed. There's no differential oracle, since the `.sh` can't read members. Motivating artifact: SPRINT-109
  itself, whose members carry 0 `*Verify:*` clauses. Silence on that is the vacuous pass to close (L-166 (i)).
**Re-confirm G2:** preflight re-run below. Waves: rank 0 = T1 ∥ T3, rank 1 = T2 (after T1) ∥ T4 (after T3). No member `## Done when` edited.

### 2026-09-28 | progress | G1 + G2 signed by the owner at `56dc057`; rank 0 dispatched (T1 ∥ T3, worktree-isolated)
The owner signed the batch G1 table and the G2 design and rulings (entry above) in one popup: "Sign, dispatch T1 ∥ T3". Review depth,
read from the skip table now:
consequence · T1 · behaviour:low · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high
T1 → one scoped sonnet reviewer (spec semantics). T2–T4 → Tier G: a worktree-isolated outside reviewer each, with a
threat model and a stop rule (L-165 · L-168 · L-217).

### 2026-09-28 | progress | rank 0 dispatched; worktree-base guard PASS ×2
Declared base `b9d06a8`, the TASK-377/382 todo → in_progress move. `worktree-base` PASS for T1 (`agent-a1b2aab…`) and for T3
(`agent-a5773151…`), both branched from `b9d06a8`. Seven worktrees left over from SPRINT-106/107 are still present
and were not removed: they are not this sprint's, and three hold commits or uncommitted files (reported to the owner).

### 2026-09-28 | progress | T1 TASK-377 merged at `3c85e84`. Review NOT CLEAR → one revise → verified
Builder (opus, worktree): `616a373` · `1f0843b`. Scoped sonnet review: Spec CLEAR, Standards NOT CLEAR. Findings: the highest-id guard
was not in the prune condition; the fate of a deleted task's citations went unstated; §10 still spoke of a single-file Backlog.
**Owner re-ruled A1 → 0.12.0.** §15 makes 1.0.0 wait for ≥2 pinned repositories. I missed that at recon, and the builder
had rewritten §15 as waived. Owner accepted the §11 trigger. Revise `f8027d8`: 0.12.0, §15 byte-identical to `b9d06a8`, guard in the condition,
citations resolve through git (the TECH-DEBT precedent), Backlog wording → task files. Coordinator re-check: all four confirmed on the branch.
Reconcile 100/100 · doc-caps output identical (TODO.md 531>320 soft, cap still derived) · prose-density 32/0 · engine 73 FAIL before and after.
Hand-off list written into TASK-383. Skipped: the review's minor note that the CHANGELOG cites repo tooling (earlier entries do the same).

### 2026-09-28 | progress | T2 dispatched (phase 1). Layers adds spec/CHANGELOG.md and scripts/lib/token-budget.txt
T1 has landed, so T2's `spec/STANDARD.md` dependency is met. Its cap-semantics change folds into the unreleased 0.12.0 entry,
so `spec/CHANGELOG.md` joins its Layers. The ratchet needs a recorded adoption value, so a new `scripts/lib/token-budget.txt` does too.
Next ADR id derived two ways: `docs/adr/` max = ADR-047 = `DECISIONS.md` max, so the new one is ADR-048. `ANTHROPIC_API_KEY` is
absent from the session environment. Calibration is therefore an **owner action**: phase 1 builds everything plus `--calibrate`
and stops; the owner runs one command; phase 2 records the measured ratio and the adoption budget.
