---
sprint: 135
slug: checks-that-mean-it
owner: Maintainer
last_updated: 2026-10-21
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-135 — Execution Log

> Append-only companion to [`../SPRINT-135-checks-that-mean-it.md`](../SPRINT-135-checks-that-mean-it.md). Uncapped by design
> (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-21 | promote | plan locked, governance signed, four members: a fixes-only TD burn-down
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. All 8 active entries are at count 1. Census: 8 active + 213 promoted + 1 superseded = 222 headers.
- ☑ TD aging (recorded here, per L-242): 106 of 108 open rows aged against sprint 135. Newly aged: TD-261 (filed at 132). Not
  aged: TD-262 · 263 (133). No row resolved; none is `high`. Severity census 49 low · 32 medium · 24 minor · 3 trivial = 108.
  Correction recorded: at intake the coordinator said three rows were `medium`. That came from the ledger's last 40 rows only
  (L-108's class). TD-232, 233 and 244 are the newest medium rows, not the only ones.
- ☑ doc-aging, §11 (owner-approved, applied in `1a303755`): TASK-463 and TASK-464 (SPRINT-132) pruned. No live `.md` citation by
  two routes (a `git ls-files` scan of the live `.md` set, and a filesystem grep with worktrees excluded). TASK-465 stays (a
  research log cites it). TASK-438 stays until T4 prunes it. No TD deletion, CHANGELOG rotation or LEARNINGS collapse is due.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0.
- ☑ epic rollup currency and epic coverage: no active epic. EPIC-005 is `proposed` and parked under ADR-053 (`67db3238`).
- ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Intake: decomposed 2026-10-21 (`383979a1`) after EPIC-005 was parked. The Codex review (read-only, `gpt-6-astra`) returned
APPROVE WITH FIXES, and all five fixes were folded in before `approve`. TD-262 was settled by an owner ruling first: only `.md`
files count as live citations.
Size check: 4 S, no `L`. All four are `origin: decomposer`. No epic.

### 2026-10-21 | gate | G1 + G2 signed by the owner by popup; four builder checks settled; one Done-when ruling
G1: fast path. All four members are `origin: decomposer` and their scope is unchanged since `approve` (`383979a1`).
G2: designs as settled below. T1 and T2 run in parallel, T3 runs after T1 (same checker, D1), and T4 is independent. Review
cap is 2 rounds each. T1 takes the full consequential-G bar and a worktree-isolated outside review.
builder-check · T1 · 1 contradictions · 3 questions · fixed: the full SPRINT-119 log is retained as a passing fixture beside the
truncated must-FAIL one. Facts: no fixture or archived log passes on an untagged terminal line (census of every `terminal ·`
line in by-reference fixtures and the SPRINT-119/123 logs: all tagged). The tag can still be typed by hand, which is the
residual TD-232's own mitigation accepts. TD-233's vocabulary half is met (review-scoping.md:167, night-run.md:806).
builder-check · T2 · 0 contradictions · 2 questions · nothing important left. The drift fixtures keep their verdicts (the new
check runs on the normalised lines). A malformed line with extra text is named by its first non-vocabulary token.
builder-check · T3 · 2 contradictions · 3 questions · design aligned to the Done-when: the same-entry full path need not itself
be declared (it is judged on its own); "resolves" means root-relative, tracked at HEAD or present on disk; each must-FAIL
control is built so that only its own condition blocks it. A fragment without a trailing slash is not a path shape for
`repoPath()`, so it is never flagged.
builder-check · T4 · 1 contradictions · 3 questions · owner ruling: the TASK-438 prune moves out of TASK-473 (scope-change
below). This sprint's own Plan and promote entry cite TASK-438, so it stays live until SPRINT-135 is archived.

### 2026-10-21 | scope-change | T4 (TASK-473): drop the TASK-438 prune box; the prune falls to SPRINT-136's promote
What broke: TASK-473's Done-when box "TASK-438 is pruned in its own commit" cannot be ticked inside this sprint. §11 counts a
whole-word id in any non-history `.md` file as a live citation, and this sprint's own Plan (T4 Layers) and promote entry name
TASK-438. Both stay live until SPRINT-135 is archived, and T4 must reach the done folder before the sprint can close.
Impact: T4 keeps the §11 sentence and TD-262. TASK-438 falls due at SPRINT-136's §11 doc-aging, once nothing live cites it. T4
stays S. owner-ruling: G2 popup, 2026-10-21 — "Move to next promote". G2 re-confirmed in the same popup.
