---
sprint: 177
slug: spec-fix-and-detached-preflight
owner: Maintainer
last_updated: 2026-11-15
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-177 — Execution Log

> Append-only companion to [`../SPRINT-177-spec-fix-and-detached-preflight.md`](../SPRINT-177-spec-fix-and-detached-preflight.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-15 | promote | plan locked, 2 members: TASK-665, TASK-367 (2 plan steps)
Owner rulings, verbatim: "Promote now (Recommended)" (promote in parallel with workdoo Sprint B); "Both, in order (Recommended)" (wave 1 TASK-665, wave 2 TASK-367, one sprint); "Claude builds, Codex reviews (Recommended)"; "Other G (Recommended)" (T2 takes the other-G bar; supersedes the packet's isolated outside review); "T2's G2 after T1 lands (Recommended)"; "Add a box to TASK-665 (Recommended)" (done before promote, `5ad18c48`). Fixture form settled under the 2026-09-09 no-new-shell ruling: a Bun TypeScript test (D3).
Freeze plan: TASK-367's Done-when is edited by T1 only after a `scope-change` entry naming TASK-367 and T1 is logged. The checker reads it as covered when the entry is new since `plan_commit` and precedes or shares the first edit's commit.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign off".
- ☑ L-promotion: none. 69 entries are `promoted: no`, all count 1; a second selection (not promoted and count not 1) finds only L-235, which is `merged`.
- ☑ TD aging: 119 open rows (75 low, 24 minor, 13 medium, 7 trivial, none high), 118 aged three sprints or more; nothing escalates. TD-090, TD-117 and TD-171 name the gate cost; TD-315 records the token budget. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: none; no row is due.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 102 PASS, 0 FAIL, 0 WARN. CHANGELOG rotation not due (v2.24.0 and v2.23.0 inline). LEARNINGS pointer-collapse: long-standing, deferred to the close compaction sweep. Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `skills/orchestrator/SKILL.md` 140 of 140, `.claude/CLAUDE.md` 79 of 80; always-loaded token budget 12683 of 12691, so T2 touches neither CONTEXT nor CLAUDE.md (D4).
- ☑ epic rollup currency: EPIC-025's rows for SPRINT-172 and SPRINT-173 carry their `close_commit`; SPRINT-174 to 176 carry no `epic:`; header dated 2026-11-15; every ticked condition names its closing sprint. None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)` (1 open = 1 covered + 0 uncovered). EPIC-026 is `proposed` and exempt. No member carries `epic:`, so no refusal and no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent). ☑ handoff ledger: none (no ledger file).
Sprint number: 177, the maximum in use plus one. Five selections all gave 176: archive plans, archive logs, `docs/sprint/INDEX.md`, `sprint(N)` commit subjects, `sprint:` stamps under `docs/work`.
Composition: 2 members, sizes S/M, serial T1 then T2, no epic, no stream. Status move at `115f4258`.
Baseline gate: off-host `gate-remote.ts` on `5ad18c48`: `QA-CHECK: 223 pass, 0 fail` (rc 0); `bun test: 621 pass, 0 fail` (rc 0). The commits since are the status move, the stamps and this sprint's files.
Not yet signed: G1 is signed for both members and G2 for T1 in the coordinator's session; T2's G2 follows T1 (D6). `gates_signed` is omitted until both are signed and relayed verbatim.
builder-check · T1 · 3 contradictions · 3 questions · all factual: the log path is the logs/ file, the preamble drops the stale distance too, the new test path is exempt from test -e, TD-084/175 are confirmed deleted; none to owner
consequence · T1 · behaviour:low · governance:low

### 2026-11-15 | gates | G1 signed for T1 and T2, G2 signed for T1 only
- Owner popup, verbatim. G1: "Scope confirmed". G2 for T1: "Sign G2 for T1".
- G2 for T2 is signed after T1 lands, on the fixed Done-when (D6). `gates_signed` stays out of the frontmatter until both are signed.
- The T1 design record and builder-check settlements are in the coordinator scratchpad (s177-t1-design.md).

### 2026-11-15 | scope-change | T1 edits TASK-367's frozen Done-when (preamble, box (a), box (d))
- **What broke:** TASK-367's `## Done when`, frozen at plan_commit 0ba7c901, still carries stale text. Its preamble cites the gate call by a line number and a distance (`:589`, "144 lines below") that no longer hold. Box (a) says "a flag or an env var", but the owner ruled the `--detached` flag on 2026-11-14 ("set inline, never exported"). Box (d) does not record whether its fixtures are TypeScript or `.sh`.
- **Impact:** exactly three edits to TASK-367's Done-when, all made by T1 (TASK-665).
  - The preamble cites the gate call by symbol, with no line number or distance.
  - Box (a) names the `--detached` flag, set inline on the one pre-flight gate call and never exported.
  - Box (d) names a Bun TypeScript test (sprint D3).
  - No scope widens, and no other box changes.
- **Re-confirm G2:** for T2, on the fixed text, before T2 builds (D6).

### 2026-11-15 | progress | T1 (TASK-665) built and reviewed
- **Build:** Claude, a Sonnet worker. It edited only TASK-367's file.
  - Done-when preamble: the gate call is cited by symbol.
  - Box (a): the `--detached` flag, set inline and never exported.
  - Box (d): a Bun TypeScript test.
  - Free edits: Touches, the state note, `depends-on: []`, Assumes and Tracker.
- **Checks:** `check-sprint-by-reference --scope-change` 4 pass, 0 fail (`freeze TASK-367 -- ## Done when changed since 0ba7c90, covered by a scope-change entry`). `test -e` passes for every path in Touches.
- **Codex R1:** NOT CLEAR, one Med. The coordinator's G2 settlement had exempted the new test path from box 1's "only paths that exist", which loosened a frozen criterion. Fixed by dropping the test from Touches; box (d) still specifies it.
- **Codex R2:** CLEAR.
review · T1 · scoped-reviewer · behaviour:low · governance:low
builder-check · T2 · 2 contradictions · 5 questions · guard applies to both arms, bound covers the whole foreground path incl. the wait, timeout wraps sh with verification by fixture and real run, doc does not claim harness-background counts as detached; three value questions to owner
consequence · T2 · behaviour:material · governance:low

### 2026-11-15 | gates | G2 signed for T2 on the fixed Done-when (both tasks are now signed)
- Owner popup, verbatim:
  - Raise value: "1800 s both (Recommended)".
  - Bound: "570 s total (Recommended)". The gate bound is 570 minus `wait_seconds`, which is 420 s at the default wait.
  - Test knob: "Accept the knob (Recommended)" (`NIGHT_RUN_GATE_BOUND_SECONDS`, a test-only override).
  - G2 for T2: "Sign G2 for T2".
- The design record and settlements are in the coordinator scratchpad (s177-t2-design.md). The settlements are:
  - the truncated-gate guard covers both arms;
  - the bound covers the whole foreground path;
  - `timeout` wraps `sh`;
  - the doc claim is held back until the real exercise.
- `gates_signed` is recorded now that G1 and G2 are signed for both tasks.

### 2026-11-15 | progress | T2 (TASK-367) built test-first, owner-settled review, real exercise run
- **Build:** Claude, a Sonnet worker under `/tdd`.
  - The `--detached` flag raises QA_BUDGET_SECONDS and QA_CEILING_SECONDS to 1800, inline and never exported.
  - The undeclared arm is bounded at 570 s minus `--wait-seconds` through the real `timeout`, and refuses by name.
  - Both arms refuse a truncated or exit-124 gate before any `gate_exceptions:` grant.
  - Two qa-check.sh messages, night-run.md Part 2 and CHANGELOG are updated.
- **Tests:** evals/night-run-detached.test.ts, 17 pass, 0 fail. night-run-rollup.test.ts 46/0, run-mode fixtures green, caps 0 FAIL.
- **Seed proofs:**
  - Neutering the truncated-gate guard reddened the two truncated-gate cases; the sibling stayed green.
  - Neutering the 124 guard reddened the detached-124 case; its sibling stayed green.
  - Restores matched by `git hash-object`.
  - These ran on earlier hashes, before the lookup-only knob change, which touched only the timeout lookup.
- **Real exercise:** a `--detached` pre-flight on this Windows host, in a scratch worktree, with the round-1 code.
  - Result: 513 s, exit 1, refused by name `review-depth-material-absent`, a real red check, because T2's review line was still owed.
  - The gate completed with a verdict and no kill, and no gate processes were left behind.
  - Limit: the gate finished inside the old 520 s budget this run, so completion past the budget under load is not shown. The fixtures cover the timeout path.
- **Codex review:**
  - R1 NOT CLEAR: 3 High (no-timeout host unbounded; wait check skipped without qa-check.sh; detached exit 124 bypassed the guard) and 1 Med (real-exercise evidence). All fixed in the builder's one retry.
  - R2 confirmed those fixed, then raised 1 new High: the no-timeout fixture copied a Git-for-Windows /usr/bin and would throw on the Linux gate. Owner popup: "Overridable lookup (Recommended)".
  - A follow-up check found the knob also controlled execution, so a wrapper could skip the bound. Owner popup: "Lookup-only fix (Recommended)". The knob is renamed NIGHT_RUN_TIMEOUT_LOOKUP, and a fixture shows it cannot change execution.
  - The review closes **owner-settled**, not CLEAR (the review rounds were used up; the revise loop says still-open findings go to the owner).
review · T2 · scoped-reviewer · behaviour:material · governance:low

### 2026-11-15 | close | SPRINT-177 closed, 2 of 2 members done
Retro -> the sprint file § Retro. Filed: L-320 and L-321 new; L-237 bumped to count 3; a one-line route note on TD-117. No new TD (TD-090 and TD-117 own the gate-completion measurement), no follow-up task. Handoff reconciliation: no `handoff` entry in this log, so nothing to make `spent`. No epic. §11 retention and doc-freshness are proposals awaiting owner approval.
