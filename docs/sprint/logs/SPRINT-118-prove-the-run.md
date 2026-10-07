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
