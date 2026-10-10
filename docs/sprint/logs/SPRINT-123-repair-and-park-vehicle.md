---
sprint: 123
slug: repair-and-park-vehicle
owner: Maintainer
last_updated: 2026-10-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-123 — Execution Log

> Append-only companion to [`../SPRINT-123-repair-and-park-vehicle.md`](../SPRINT-123-repair-and-park-vehicle.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-10 | promote | drafted for the owner: two J1 members, the seeded vehicle for SPRINT-122 T2 (TASK-415)
Seeded per SPRINT-122's T2 G2 (owner, 2026-10-10). Both members are honest work carrying an openly declared seed (SPRINT-089 D3):
TASK-424 transcribes SPRINT-122 T1's `--wrap` wrapper on its first live input and meets a named-check FAIL; TASK-425 drafts TD-247's
two options and meets a judgment finding. No declared J2 (pre-flight item 3, STRICT). Both members were filed `origin: manual`, so
G1 takes the full checklist. Ids were derived with worktrees excluded: SPRINT max 122 and TASK max 423, by filename and by citation.
**Seed reachability (L-136), proven before promote:** `check-prose-density.ts` measures a table row by its longest cell
(`check-prose-density.ts:39-84`), so the seed is a 495-character Change (WHY) cell. Appended to this sprint file it printed
`prose-density: 29 pass, 1 fail` (`SPRINT-123 … 1 line(s) over 400 chars`); a shortened control row printed `29 pass, 0 fail`. The file
was restored to `git hash-object` 65d92dd both times. A first attempt with a long row of short cells passed (`0 fail`), which is how
the cell rule was found.
Promote governance (same day as SPRINT-122's promote):
- **L-promotion:** none due (no L-NNN filed since SPRINT-122's promote).
- **TD aging:** 6 open rows created at Sprint-120 newly reach 3 sprints at 123 (TD-237 to TD-242; second route: `created: Sprint-120`
  matches 6 in total, all open). None is in this vehicle's scope. TD-247 is new today and is routed to TASK-425's options.
- **doc-aging:** `check-doc-caps.ts` 81 PASS, 0 FAIL. §11: nothing new since SPRINT-122's pass.
- **epic rollup currency:** EPIC-015 gains the SPRINT-123 row and `member_sprints` entry.
- **handoff ledger:** none.
promote-check: `PASS -- 7 pass, 0 fail` (after naming `check-prose-density.ts` and `night-run.sh` on the Cites: lines; neither is touched).
G1+G2 signed and the ten-part envelope approved by the owner (one popup, 2026-10-10); both are pinned to this commit in the
follow-up entry.

### 2026-10-10 | progress | pins recorded: `plan_commit`, `gates_signed: G1,G2` and the ten-part `approval_envelope:` all @ `838e714`
The envelope as approved by the owner, one dimension per item:
- **goal · acceptance:** TASK-424 and TASK-425 `## Done when`.
- **scope:** writes only TASK-424/425's ticks, evidence and `git mv`, one § Files Changed row in this sprint file, and this log. No
  source file, no guard, no push.
- **design:** Plan T1 (ancestry; the seeded row; the check; one retry) · T2 (two options; one scoped reviewer; act per ADR-022).
- **verification:** `scripts/lib/check-prose-density.ts` (T1's named check) · the `ps` ancestry line verbatim · the reviewer's verdict
  verbatim · the reaper's rollup.
- **j1-delegation:** TASK-424's one ADR-022 retry (shorten the seeded row) and TASK-425's drafting. Nothing else.
- **capabilities:** the tracked `.claude/settings.json` plus clone-local exact-file rules for `check-prose-density.ts`,
  `check-authority.ts`, `check-sprint-by-reference.ts`, `check-night-run-rollup.ts` and `ps`; Agent for one reviewer; `dontAsk`;
  never `bypassPermissions`.
- **repair-policy:** ADR-022's mechanical carve-out only: one retry on a done-when-named check FAIL. Judgment findings park. No
  second retry.
- **budget:** $10 / 60 min.
- **stop-conditions:** the five terminal states; expected `AUTHORITY_BOUNDARY` (T2 parks). A denial of a required command means
  `HARD_FAILURE` with a clean halt.
`check-approval-envelope.sh`: `PASS … (all 10 dimensions covered, pinned @ 838e714)`. `check-authority.ts`: T1, T2, TASK-424 and
TASK-425 all J1 declared.

### 2026-10-10 | scope-change | TASK-424 DoD1: the ancestry command becomes the literal `ps -eo pid=,ppid=,args=`
What broke: the VPS allowlist probe (headless, `dontAsk`, `~/lf-run` at `07c8762d`; $0.06) DENIED `ps -o pid=,ppid=,args= -p $$` despite
`Bash(ps:*)`, because a `$`-expanding command does not match under `dontAsk`. The must-deny control `touch /tmp/lf-must-deny-123` was also
DENIED (file absent). `bun scripts/lib/check-prose-density.ts .`, `check-authority.ts` and `git commit --dry-run` were ALLOWED. A second
probe ($0.22) ALLOWED the literal `ps -eo pid=,ppid=,args=` (160 lines, 0 denials). Impact: DoD1 lists the process table literally and
traces the chain by ppid. The envelope is unchanged: its verification dimension already reads "the `ps` ancestry line verbatim". G2 is
unaffected.

### 2026-10-10 | scope-change | pre-run review: TASK-424 DoD2 names the retry line's shape; TASK-425 DoD2 briefs the reviewer with the seed alone; T1 Cites gains check-authority.ts
Isolated Sonnet pre-run review, read-only, 7 items: `REVIEW: 1 finding (soft)`. CLEAR on envelope/authority, every launcher refusal
traced for the exact command, bare `sprint(123):` attribution, the park path's line shape and the two-active wording.
What broke: (4) the reaper counts only a `T1 · retry ·` line at column 0 outside a fence (`night-run.sh:162-164`, :396), and Part 4's
examples sit inside fences, so a copied, fenced retry would read `repair-cycles · 0`. (5, a note) a reviewer shown TASK-425's "do NOT
pick" may return CLEAR, and the D5 control would never park. Impact: TASK-424 DoD2 gives the literal retry line and its placement;
TASK-425 DoD2 briefs the reviewer with § Review seed alone and states the rollup-line placement. Both are openly seeded controls, and
no criterion changes what it proves. Also logged here (it was logged only in SPRINT-122's log): T1's `Cites:` gained
`scripts/lib/check-authority.ts`, which the DoD1 scope-change above names (the gate's `scope-change-outside-layers`). Known, not a
blocker: `timeout 3600` and `--max-budget-usd` end as HARD_FAILURE, not BUDGET_STOP (SPRINT-118's TD note (a)). G2 is unaffected.

fired · 2026-10-10T10:05:33Z · overnight

### 2026-10-10 | progress | run start: G1 (full checklist, both members `origin: manual`) and G2 confirmed against the pins @ 838e714
G1 · T1 (TASK-424): done when DoD1's ancestry line is transcribed and `check-prose-density.ts` prints `0 fail` after exactly one
logged retry · size S · touches TASK-424's file and this sprint's § Files Changed · out: any source or guard edit, any push · assumes
none. G1 · T2 (TASK-425): done when § Options holds two unpicked options and one scoped reviewer's verdict is recorded and acted on
per ADR-022 · size S · touches TASK-425's file only · out: choosing TD-247's option. G2: the overlap map is disjoint (T1 owns the sprint
file's § Files Changed, T2 owns nothing shared). The coordinator owns this log and every `git mv`. Run sequentially, inline: both are
S, docs-only, and dispatch would add a worktree merge-back for one line of work each.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low
