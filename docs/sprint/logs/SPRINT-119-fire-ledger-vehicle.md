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
