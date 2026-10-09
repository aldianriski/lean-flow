---
sprint: 119
slug: fire-ledger-vehicle
owner: Maintainer
last_updated: 2026-10-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-119 — Execution Log

> Append-only companion to [`../SPRINT-119-fire-ledger-vehicle.md`](../SPRINT-119-fire-ledger-vehicle.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-07 | promote | plan locked, governance signed, G1+G2 signed, envelope approved; one J0 member, the seeded vehicle for SPRINT-118 T2
Seeded per SPRINT-118's T2 G2 (owner): the vehicle's member is honest verification work, T1's fire-time ledger on its first live input.
It is not HITL work re-declared AFK (SPRINT-089 D3), and the only AFK backlog tasks (TASK-322 · TASK-347) are `needs-info`, which
pre-flight forbids. TASK-405 was filed `origin: manual`, so G1 took the full checklist. Ids were derived with worktrees excluded:
TASK max 404 (by filename and by `id:` field, with no id above 404 cited anywhere) and SPRINT max 118 (by filename and by frontmatter).
The owner signed the checklist:
- **L-promotion:** none due (same day as SPRINT-118's promote; no L-NNN filed since).
- **TD aging:** 116 of 118 open rows aged against sprint 119 (created ≤ 116). Second route: 118 − 2 filed at 117/118 = 116.
  Census: 143 rows = 118 open + 25 not open, matching SPRINT-118's 142 + TD-231. One `high` row (TD-168), already routed to TASK-404.
- **doc-aging:** `check-doc-caps.ts` 0 FAIL of 85 lines. §11: nothing new since SPRINT-118's pass.
- **epic rollup currency:** current (`check-epic-archive` 0 FAIL); EPIC-015 gains the SPRINT-119 row and `member_sprints` entry.
- **handoff ledger:** none.
promote-check: `PASS -- 4 pass, 0 fail`. TASK-405 prose-density: `1 pass, 0 fail` after splitting its Done-when box (467 → 4 lines).
G1+G2 signed and the ten-dimension envelope approved by the owner, both pinned to this commit in the follow-up entry.

### 2026-10-07 | progress | pins recorded: `plan_commit`, `gates_signed: G1,G2` and the ten-dimension `approval_envelope:` all @ `85b3ffc`
The envelope as approved by the owner, one dimension per item:
- **goal · acceptance:** TASK-405 `## Done when`.
- **scope:** writes only TASK-405's tick and its `git mv`, plus this log; no source file, no push.
- **design:** transcription only (Plan T1).
- **verification:** the verbatim fired line and `check-authority.ts` output line.
- **j1-delegation:** none (J0 only).
- **capabilities:** the tracked `.claude/settings.json` plus three exact-file `bun scripts/lib/check-*.ts` rules in the clone's gitignored
  `settings.local.json`; `dontAsk`; never `bypassPermissions`.
- **repair-policy:** none. Any FAIL parks or halts, and guards are never edited.
- **budget:** $10 / 60 min.
- **stop-conditions:** the five terminal states. A denial of a required command means `HARD_FAILURE` with a clean halt.
`check-approval-envelope.sh`: `PASS … (all 10 dimensions covered, pinned @ 85b3ffc)`. `check-authority.ts`: T1 J0 and TASK-405 J0 declared.

fired · 2026-10-07T03:09:34Z · overnight

### 2026-10-07 | progress | T1 (TASK-405) ticked — fired line and checker verdict transcribed by the run
consequence · T1 · behaviour: none (verification, no source change) · governance: none → self-review only.
Fired line (one column-1 match; the second query, bare `fired`, hits only line 39's envelope prose): `fired · 2026-10-07T03:09:34Z · overnight`,
present uncommitted at run start and committed as the run's first commit (48345dbd6). `bun scripts/lib/check-authority.ts` on this sprint:
exit 0, both rows `PASS` (T1 J0 · TASK-405 J0). No confirmation asked; no source file touched; no push.

### 2026-10-07 | rollup | run exit — Plan exhausted, 1 of 1 DoD ticked, no confirmation asked
Written by the run itself on a clean finish (Part 4). Close and system-verify are out of this envelope's scope (writes: TASK-405's tick
and `git mv` plus this log only); they belong to SPRINT-118 T2's interactive post-run checks, so `verification` is honestly none.
`check-sprint-by-reference.ts --close` before this entry: 3 pass, 1 fail — `CLOSE-FIRED-UNREAPED`, the expected pre-rollup state this
entry's `terminal ·` line resolves.

run · 1 of 1 DoD ticked
outcome · DELIVERED · derived from terminal PLAN_EXHAUSTED
terminal · PLAN_EXHAUSTED · T1 (TASK-405) done; the only Plan task, J0, no park, no denial
tasks · 1 attempted / 1 completed / 1 total
parks · 0
repair-cycles · 0
verification · none logged
warnings · none
review · T1 · self-review · behaviour:none · governance:none

run · ~$0.57 (harness budget meter, read mid-turn before this entry) · ~12 turns · ~1 min (fired 03:09:34Z → last task commit 03:10:05Z) · 1 of 1 units · inline

### 2026-10-07 | run-complete | corrects the entry above: its header said `rollup`, so `check-night-run-rollup.ts` never read the block
The block is the same. The only change is this header's `run-complete` event (`RUN_COMPLETE_HEADER_RE`). The checker read the entry above
and printed `has no completed-run entry yet -- nothing to verify`, which is the not-reached signal and not a PASS. The block is restated
here and the entry above is left as written (append-only).

run · 1 of 1 DoD ticked
outcome · DELIVERED · derived from terminal PLAN_EXHAUSTED
terminal · PLAN_EXHAUSTED · T1 (TASK-405) done; the only Plan task, J0, no park, no denial
tasks · 1 attempted / 1 completed / 1 total
parks · 0
repair-cycles · 0
verification · none logged
warnings · none
review · T1 · self-review · behaviour:none · governance:none

run · ~$0.69 (harness budget meter, read mid-turn before this entry) · ~17 turns · ~2 min (fired 03:09:34Z → this entry) · 1 of 1 units · inline

### 2026-10-07 | progress | rollup checker reached: it takes the Execution Log path, not the sprint file
Both runs above passed the sprint file, so the checker read a file with no `run-complete` header. The entry above is still needed: with the
log path and only the `rollup`-headed entry, the window would be empty for the same reason.
`bun scripts/lib/check-night-run-rollup.ts docs/sprint/logs/SPRINT-119-fire-ledger-vehicle.md` exited 0 and printed
`PASS  night-run rollup docs/sprint/logs/SPRINT-119-fire-ledger-vehicle.md (DoD header + terminal state + calibration row present, and agrees with its per-task lines)`.
`check-sprint-by-reference.ts --close` printed `4 pass, 0 fail`. Sprint close and `/lean-doc-generator close` are left to SPRINT-118 T2, which is outside this envelope.

### 2026-10-07 | run-complete | run exited — rollup emitted by the launcher

Evidence provenance: mechanical = counted directly from the Plan/log text; model-reported = written by the run, trusted like any other Part 4 state line (TD-152); derived = a function of the fields below it, never more certain than what it reads.

```
run · 1 of 1 DoD ticked  [mechanical]
outcome · DELIVERED · derived from terminal PLAN_EXHAUSTED  [derived]
terminal · PLAN_EXHAUSTED · every task reached a resolved state  [derived]
tasks · 1 attempted / 1 completed / 1 total  [mechanical]
parks · 0  [model-reported]
repair-cycles · 0  [model-reported]
verification · none logged  [model-reported]
warnings · none  [mechanical]
```

Calibration row (Part 4), transcribed from the harness result event:

```
run · $0.8329009999999998 · 23 turns · 2 min · 1 of 1 units · inline
```
