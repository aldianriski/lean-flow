---
sprint: 118
slug: prove-the-run
owner: Maintainer
last_updated: 2026-10-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-118 — Execution Log

> Append-only companion to [`../SPRINT-118-prove-the-run.md`](../SPRINT-118-prove-the-run.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-07 | promote | plan locked, governance signed, four members: a fire-time ledger, then one real unattended run (EPIC-015)
The owner picked the shape "Prove the Run" (the run is in the Plan, L-111) and the VPS as run host, as `ubuntu`, after an owner
CLI install (D1). Size check at pull: two M, two S. Members moved backlog → todo (`916753c`) and were stamped in `901e7d6`.
TASK-319's prerequisite TASK-352 shipped at SPRINT-102 T3. The owner signed the checklist:
- **L-promotion:** none due.
- **TD aging:** 113 of 117 open rows aged against sprint 118 (created ≤ 115). Second route: 117 − 4 filed at 116/117 = 113. One `high` row
  (TD-168) → TASK-404.
- **doc-aging:** §11 deleted TD-143 · TD-150 · TD-224 · TD-225, all resolved at SPRINT-115 (`4a6d3b1`). A first selector, matching
  `SPRINT-11[45]` in the status text, found only 224/225. TD-143/150 record a date, not a sprint, and were caught by reading their
  resolving tasks. Census: 145 + TD-230 − 4 = **142 rows**, 117 open. That matched only after correcting an expectation of 141 that
  left out TD-230. §2: 0 over the cap.
- **epic rollup currency:** current (`check-epic-archive` 0 FAIL); EPIC-015 gains the SPRINT-118 row.
- **handoff ledger:** none.
promote-check: first run 3 findings (a T2 mention in T1 prose; two basename-vs-path forms), fixed; final `PASS -- 13 pass, 0 fail`.
Pre-dispatch preflight: CLEAR (waves T1=0 · T2=1 · T3/T4=2; `night-run.sh` owned T1 → T2 → T3).

### 2026-10-07 | progress | owner action (D1), part 1: CLI + plugin installed for `ubuntu` on the VPS; login pending (owner)
The owner believed the VPS was already logged in. A read-only check found the login belongs to the `workdoo` service user (CLI +
credentials present); `ubuntu` had no `claude` on any PATH and no `~/.claude/.credentials.json`. Owner ruling: keep D1 (run as `ubuntu`).
Installed user-local, no sudo: Claude CLI **2.1.291** (the version workdoo pins) at `~/.local/bin/claude`, plus the lean-flow marketplace
and plugin **2.1.0** (user scope, `~/.claude/plugins/cache/lean-flow/lean-flow/2.1.0`). Remaining: `claude login` as `ubuntu`, which needs
an interactive TTY, so the owner runs it from their own terminal, then a one-line `claude -p` smoke run (A1).

### 2026-10-07 | progress | owner action (D1) complete: `ubuntu` logged in on the VPS; A1 confirmed
Login ran in a detached tmux session (`claude auth login --claudeai`). The owner opened the URL and returned the one-time code, which
was typed into the session: `Login successful.` `claude auth status` reads `loggedIn: true`, `authMethod: claude.ai`. **A1 smoke
run:** `claude -p "Reply with exactly: SMOKE-OK"` in `~/lf-gate` → `SMOKE-OK`, rc 0; `lean-flow@lean-flow` is listed. Auto-update is
off for `ubuntu` (`env.DISABLE_AUTOUPDATER=1` merged into `~/.claude/settings.json`, backup `.bak-20261007`), so the CLI stays at
2.1.291 like workdoo's.
**Pre-flight item for T2 (found by the smoke run):** `~/lf-gate` is not a trusted workspace, so its `.claude/settings.json` 68
`permissions.allow` entries are ignored ("this workspace has not been trusted"). A `dontAsk` headless run there would be denied
the tools its allow-list grants. G2 rules the run's working directory and grants trust for exactly that path (`hasTrustDialogAccepted`
in `~/.claude.json`) at pre-flight, not before.

### 2026-10-07 | scope-change | T1 Layers corrected before build: the live checkers are TypeScript, and the TD-122 finding fires at close
**What broke:** § Plan T1 names `scripts/lib/check-authority.sh`, but the gate leg runs `scripts/lib/check-authority.ts` (`qa-check.sh:1392`,
TASK-355 port). The `.sh` is now a frozen differential oracle that ADR-050 §3 says must not grow. A fired-but-unreaped finding wired into an
always-on leg would also go red during every live run, including the run's own mid-run system-verify, because `terminal ·` is written
only after the run exits. **Impact:** T1 edits `check-authority.ts` and not the `.sh`. The TD-122 finding lives in the close gate
`scripts/lib/check-sprint-by-reference.ts --close`, where no run can still be in flight, with fixtures under `evals/fixtures/by-reference/`.
**Re-confirm G2:** owner-ruled in the entry below.

### 2026-10-07 | g2 | T1 design signed (owner): fired line in the Execution Log, close-time check, consequential G
G1 ran the full checklist for all four members (`origin: close-retro`). TASK-320's `assumes:` was re-derived from both rows rather than
inherited, and it holds. TD-122 ("a ledger `night-run.sh` writes unconditionally at fire time … not gated on `reap()`") and TD-124
("a signal the *launcher* writes at fire time, independent of `reap()`'s decision to append") name the same mechanism. Owner rulings:
- **Ledger:** `night-run.sh` appends one `fired · <ts> · <mode>` line to the resolved sprint's Execution Log before the wrapped command
  runs. If no sprint resolves, the launcher refuses to fire (DOA). No new file, which keeps it clear of the rejected run-event stream.
  ADR-013's guardrail is carried over: this line is never the input to a resume path.
- **TD-122 check:** close-time only (`check-sprint-by-reference.ts --close`). A `fired ·` line with no later `terminal ·` line FAILs.
- **TD-124:** `check-authority.ts` treats a `fired ·` line as the written fact of an unattended run. The two older signals stay as a
  backstop for logs written before the ledger existed.
- **Tier:** consequential G (ADR-050: `night-run.md` names `night-run.sh` as the mechanism of the adopter's run). Full bar: must-FAIL
  fixture plus control per check, seeded-break proof under one hash convention, worktree-isolated outside review, Codex gauntlet.
- **Residual named, not closed:** a run fired outside `night-run.sh` leaves no `fired ·` line. Pre-flight already forbids that path.
T2–T4 G2 is deferred until T1 lands (T2 is J2; its vehicle shape and the VPS working directory and trust grant are ruled then).

### 2026-10-07 | scope-change | T1 build surfaced three rulings; owner accepted all three recommendations
The builder (worktree, `bf93c92`) reported three points; the coordinator checked each against the tree before asking.
- **Close rule, deviation from the G2 ruling (accepted):** a strictly de-fenced close check would flag every properly reaped run,
  because `reap()` writes `terminal ·` inside a fence (`night-run.sh:414–416`). The rule is now: a terminal line after the last `fired ·`
  line counts if it is unfenced, or fenced under a `### … | run-complete |` entry. That matches how `check-night-run-rollup.ts` already
  windows the last run-complete block, which it does without stripping fences. A rollup quoted under any other entry does not count.
- **Frozen differential (exclude):** the opt-in `run-authority-differential.ts` went `14/15 identical`, because the frozen `.sh` oracle
  cannot read `fired ·`. `fired-*` fixture dirs are now excluded and named in their own printed EXCLUDED line (ADR-050 §3), in `7f3728e`
  (coordinator, inline: one mechanical edit). After it: `REAL-LOGIC 13/13 identical`, `TRIVIAL-PATH 118/118`. Second route: 11 non-fired
  fixture files + 1 live sprint + 1 combined = 13, and before the change 13 + 1 + 1 = 15.
- **Dead backstop (file, don't fix):** `check-authority.ts`'s `terminal ·` signal never matched real reaper output, for the same fence
  reason. Filed as **TD-231**. Id derived: max row TD-230, 142-row census matching the promote entry.
Review dispatched in parallel on `7acc79f..7f3728e`: one worktree-isolated Sonnet reviewer and one Codex static gauntlet round, each
bounded to 8 threat-model items with a stop rule (zero-occurrence shapes → TD).

### 2026-10-07 | progress | T1 reviewed CLEAR on both routes (isolated Sonnet + 2 Codex rounds), merged as `05cfcbe`
consequence · T1 · behaviour:material · governance:high
Skip table: a launcher an adopter fires, plus two gate checkers. Material behaviour and consequential G (ADR-050), so the depth is a
worktree-isolated outside reviewer plus the Codex gauntlet. Both were bounded to 8 threat-model items with a stop rule.
- **Sonnet, isolated** (detached at `7f3728e`): `REVIEW: CLEAR`, 8 of 8 items. Its own seed deleted the last-fired reset in
  `firedUnreaped`. Only `close-earlier-run-reaped-later-run-not` reddened; the six sibling fired fixtures stayed PASS. Restored hash
  `045ec8c` == HEAD. Full `run-by-reference-fixtures.ts`: `134 pass, 0 fail`. One wording gap (item 7) was fixed in `217019f`.
- **Codex round 1:** `CODEX: 1 findings`. Item 6: case 13 counted fired lines only after the launcher returned, so a write-after-command
  regression would pass. Fixed in `44e7ddf`: the wrapped command writes the log's fired-line count into the marker as it runs.
  The coordinator's seed moved the write to after the command, inside the wrapper. Case 13 went red (`seen-by-the-command='0' before=0
  after=1`) while the other 15 stayed PASS, including `fired-precedes-rollup`, the case that had missed it. Restored hash `c4a1fdb` == HEAD.
- **Codex round 2** (`7f3728e..217019f`, 2 items): `CODEX: CLEAR`.
review · T1 · scoped-reviewer · behaviour:material · governance:high
Seed census across the build and review: 5 claims seeded (A fired write · B authority OR · C close finding · D fence carve-out ·
E write-after-command), plus the reviewer's last-fired seed. Each reddened only its claim-bearing cases. Sub-agent spend: builder 236k ·
Sonnet review 82k · Codex 21k + 19k = **~358k**, under the 1–1.5M estimate. System verify: `QA_FULL=1` started on the VPS at `05cfcbe`.

### 2026-10-07 | scope-change | T1 Layers corrected to the files actually changed; three review commits re-worded with `Task: T1`
**What broke:** system verify on the VPS at `05cfcbe` returned `QA-CHECK: 315 pass, 1 fail`. The FAIL was `layers observed`, with two parts.
(a) T1 changed six paths its frozen `Layers:` never named: the `.ts` checkers and harnesses that the first scope-change entry above moved
the work to, plus `skills/orchestrator/references/night-run.md`, which the G2 brief assigned but no entry recorded. (b) The three
coordinator review-fix commits carried no T1 attribution. **Impact:** § Plan T1 `Layers:` now lists the real file set (the SPRINT-116
precedent). On owner ruling, the three unpushed commits gained a `Task: T1` trailer by a message-only rebase. Tree hash unchanged,
`d53cea5` both before and after. Old → new: `7f3728e` → `046067c` · `44e7ddf` → `4d6846e` · `217019f` → `70d6f0f`. The old merge
`05cfcbe` was undone (`reset --keep`, local only; origin/main is `0823764` and contains none of these commits) and is redone below.
Entries above that cite the old shas stand as written; this entry is the correction. **Re-confirm G2:** none needed, as no behaviour
changed.

### 2026-10-07 | progress | system verify at `9f42c01`: `QA-CHECK: 316 pass, 2 fail`, both from the Layers correction itself
`layers observed` now PASSes. Two new FAILs came from how the correction was written: `prose-density` (the one-line Layers was over 400
chars) and `member-layers-incomplete` (TASK-320's Done when names `check-authority.sh`, and the checker matches tokens exactly). Fixed:
Layers is split onto continuation lines in T2's style, and `check-authority.sh` moves to T1's `Cites:`, since T1 cites the frozen oracle
and does not edit it (the checker's own suggestion). Local re-run: layers-completeness 12 PASS / 0 FAIL (4 blocks × 2 + 4 members = 12),
prose-density PASS, layers-observed PASS, by-reference `5 pass, 0 fail`. Full gate re-run follows.

### 2026-10-07 | progress | T1 done: system verify GREEN `QA-CHECK: 317 pass, 0 fail` (rc 0) at `a75f3f2`, VPS `QA_FULL=1`; TASK-320 → done
TASK-320's one Done-when box is ticked with evidence, and the member moved in_progress → done. TD-122 and TD-124 are closed by this task.
Their ledger rows are marked resolved at close (§11), not here. Sub-agent spend for T1: ~358k. Next: T2–T4 G2 (vehicle shape, the VPS
working directory and its trust grant), then the owner fires T2 (J2).

### 2026-10-07 | g2 | T2 design signed (owner); vehicle SPRINT-119 promoted; T3/T4 stay opportunistic
consequence · T2 · behaviour:material · governance:high
Owner rulings: the vehicle member is a seeded J0 task that live-verifies T1's ledger (TASK-405, SPRINT-119). The run executes in a fresh
clone, `~/lf-run` on the VPS as `ubuntu`, trusted for exactly that path, with results returned by git bundle and nothing pushed. Budget
$10 / 60 min. T3 rides the run and, with a one-task Plan, will most likely close `unattempted` (D2/D5). T4 rides the run's `/handoff`,
if it takes one. SPRINT-119: governance signed, `plan locked` at `85b3ffc`, `gates_signed` and the ten-dimension envelope pinned
`@ 85b3ffc` (`19273b1`).
**Pre-flight (Part 1) on the VPS:**
- **Clone:** `~/lf-run` was cloned from `~/lf-gate` and is on branch `run-119` at `19273b1`. Its `origin` remote is removed, so a push has
  nowhere to go. Tree clean.
- **Allowlist:** the tracked `.claude/settings.json` plus three exact-file `bun scripts/lib/check-*.ts` rules in the gitignored
  `.claude/settings.local.json` (`.gitignore:8`).
- **Trust:** `~/.claude.json` had no `projects` record. Backed up to `~/.claude.json.bak-20261007-lfrun`, then
  `projects["/home/ubuntu/lf-run"].hasTrustDialogAccepted = true` (31 keys, parses).
- **Probe 1 ($0.21):** all 7 items ALLOWED, including `bun scripts/lib/check-authority.ts`, which only the local rule permits, and
  `git commit --dry-run`. **Its must-deny control was invalid.** `uname -a` ran because Claude Code auto-approves read-only commands, so a
  read-only command cannot be a negative control (→ worth an L-NNN at close).
- **Probe 2 ($0.18):** the one variable changed: `touch /tmp/lf-must-deny` → `DENIED … don't ask mode`, the file is absent, and
  `git status` is ALLOWED. Verdict: **the allowlist is live and scoped.** Probe spend $0.40, about 4% of the cap.
- **DoD commands run once on host:** the fired-line `grep -c` and `bun scripts/lib/check-authority.ts` both ran in probe 1.
- **Budget flag:** `claude --max-budget-usd` exists on CLI 2.1.291. The 60 min ceiling is `timeout 3600` around the command.
- **Tracked-allowlist debt:** it still names the `.sh` oracles, and it carries two directory-prefix rules (`Bash(sh evals/:*)`,
  `Bash(sh scripts/:*)`) that night-run.md measured as non-functional. To be filed at close.

### 2026-10-07 | scope-change | T1 Layers gains TASK-320's own member file; `~/lf-run` pre-flight gate `308 pass, 3 fail`, all three now fixed
The `~/lf-run` pre-flight gate (`QA_BUDGET_SECONDS=1200`) returned three FAILs:
- **`typecheck` and `typecheck-population`:** the fresh clone had no `node_modules`. Environment only; fixed with `bun install`.
- **`layers observed`:** the coordinator's tick and move commits for TASK-320 (`ecc5406`, `3c45a11`) carry `sprint(118) T1:`, so rule 2
  attributes them to T1. The precedent (SPRINT-116/117) is a bare `sprint(NNN):` subject, which rule 5 exempts as bookkeeping.
  Re-wording them now would rewrite four later commits, including SPRINT-119's `85b3ffc` pins, so instead T1 `Layers:` declares the
  member file at both locations. That is accurate: those commits did touch it.
**Re-confirm G2:** none needed, as no behaviour changed. Local re-run: layers-observed PASS, promote-check `13 pass, 0 fail`,
by-reference `5 pass, 0 fail`. Coordinator rule from here: member tick and move commits use a bare `sprint(NNN):` subject.

### 2026-10-07 | progress | T2 pre-run review: one fix before fire (commit-subject form), applied to the trigger text
Pre-flight gate in `~/lf-run` at `16505e1`: `QA-CHECK: 310 pass, 2 fail`. `bun install` cleared both typecheck legs and layers-observed
PASSes. The two FAILs were `review-depth-{governance,material}-absent` for T2: the coordinator logged T2's skip-table lookup at G2, before
any review existed. Owner ruling: review what exists now, rather than deleting the line.
**Isolated Sonnet reviewer, read-only, 7 items:** `REVIEW: 1 findings (1 → fix before fire)`. CLEAR on six:
- pre-flight item 3 (J0 only, box open);
- `gates_signed` and the envelope (`check-approval-envelope.sh` PASS; the dimension text matches what the Plan allows);
- every `night-run.sh` refusal, traced (`--permission-mode` is found past the `timeout` prefix; `--sprint` resolves; log present);
- the reaper's target;
- DoD achievability, simulated in scratch with a fired line present: `check-authority.ts` exit 0;
- budget and stop mapping.
**Finding (item 5):** nothing the run reads names its commit-subject form. A `sprint(119) T1:` subject attributes the tick and move of
TASK-405's file to T1, whose Layers is verification-only, so layers-observed FAILs. That is the same shape as `ecc5406`/`3c45a11`
above. **Fix:** the fire prompt carries `commit every change with the exact subject form "sprint(119): <what>" (no task id)`. That is
trigger text, so the frozen Plan and the pinned envelope are untouched. Known weakness (night-run.md Part 2): an instruction about
bookkeeping is the first thing a run drops. If it does, the post-run fix is the SPRINT-118 Layers route.
**TD notes for close:**
- **(a)** A budget or `timeout` stop exits non-zero, so the reaper derives `HARD_FAILURE`, not the `BUDGET_STOP` that SPRINT-119 D2 states.
- **(b)** The VPS plugin cache (2.1.0) predates T1's `night-run.md` paragraph. Immaterial to the run.
- **(c)** sprint-bulk step 0 and `/handoff` step 1 say "more than one active → ask", with no rule that a named target resolves it, so a
  headless run depends on the trigger naming its sprint.
review · T2 · scoped-reviewer · behaviour:material · governance:high
