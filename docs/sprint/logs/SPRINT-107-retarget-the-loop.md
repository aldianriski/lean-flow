---
sprint: 107
slug: retarget-the-loop
owner: Maintainer
last_updated: 2026-09-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-107 — Execution Log

> Append-only companion to [`../SPRINT-107-retarget-the-loop.md`](../SPRINT-107-retarget-the-loop.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-24 | promote | plan locked at `3e0e710`, governance signed
Four tasks from `EPIC-017`: T1 `TASK-362` (+ `TASK-360`'s open half, resolves `TD-179`) · T2 `TASK-361` ·
T3 `TASK-376` · T4 `TASK-375` (with 362's dispatch merge-back half, D2). Members moved backlog → todo by
`git mv` in their own commit (`9a929c2`), then stamped `sprint: SPRINT-107`. Governance: L-promotion none ·
7 high TD open, TD-128 unowned · 5 soft cap breaches, 0 hard · epic rollups current · no handoff ledger.
Preflight CLEAR (T1 → T2 | T3 | T4); layers-completeness 8/0. G1/G2 not yet signed; A1 (no weaker
freeze) UNCONFIRMED → grilled at G2.

### 2026-09-24 | surprise | coordinator slip — the promote chain ran past a failed step
The promote script threw on its third anchor (the epic row reads "No §", written "no §"). The chain joined
the commit to the script with `&&` but everything after with `;`, so the member moves (`9a929c2`) and the
stamp commit (`3e0e710`, which also first committed this sprint file) still ran, and `plan_commit` was
recorded as **`f5ceae1` — SPRINT-106's last commit, not this Plan's**. No content was lost: the TODO pointer
and epic `member_sprints` edits were on disk, uncommitted. Repaired in the next commit: `plan_commit` →
`3e0e710` (where the Plan first entered history, verified by `git show --stat`), epic row added, pointer
committed. L-120's shape one level up — a chain's control flow is a gate too.

### 2026-09-24 | gate | batch G1 + G2 signed (attended) at `3b23f79`
All four members are `origin: manual` → full G1 checklist, no fast-path. Owner rulings at G2:
- **A1 → CONFIRMED as designed:** the freeze *is* `plan_commit`. A member is resolved by id in the
  `plan_commit` tree (`git show <plan_commit>:<path>`, so later folder moves do not matter) and its
  `## Done when` compared with the current file; any change without a `scope-change` Log entry naming
  that id FAILs. No hash field is added to the Members list (a second fact to keep right).
- **A2 → CONFIRMED, departing from EPIC-017 "Reference adopted":** a backlog is sequenced by
  `priority:` → topological order over `depends-on:` → task id. **No per-status order file**
  (laziness ladder; a second home for the list would drift).
- **scope-change (T1 Layers):** EPIC-017 D2's "→ ADR" is recorded inside T1 as **ADR-047**; T1 gains
  `docs/adr/` + `docs/DECISIONS.md` as layers. Impact: T1 stays M.
- **Tiers declared:** T1's post-promote-edit detector is **Tier G** (retained must-FAIL fixtures,
  seeded-break proof, worktree-isolated outside reviewer); T2–T4 are Tier X.
Sequence: T1 → {T2 ‖ T3, worktree-isolated} → T4 (J2: human present).

### 2026-09-24 | progress | T1 built — promote/close by reference, freeze checker (Tier G), ADR-047
Worktree commit `4f8ce2e`, cherry-picked to main. `promote` git-mv's members and stamps `sprint:`; the Plan carries
no DoD copy (`SPRINT.md.template` · `references/sprint-by-reference.md`); `close` requires members in
`done/`|`cancel/`. Freeze = `plan_commit`: `scripts/lib/check-sprint-by-reference.ts` resolves members by id
at `plan_commit` and compares `## Done when` (ticks, ` ✓ evidence` suffix, CRLF ignored; an unlogged change →
`FREEZE-EDIT`). **Re-run by the coordinator on main:** `by-reference-fixtures: 25 pass, 0 fail`; live SPRINT-107
freeze `5 pass, 0 fail`. Builder's 15-seed break proof reported ALL OK (`git hash-object` vs
`git rev-parse HEAD:<path>`, blob `b0aae826`). TD-179 resolved → TASK-362. Harness registered opt-in in
`qa-check.sh` (git-repo rule). **Ticks held** until the worktree-isolated outside review (Tier G bar ii) returns.
consequence · T1 · behaviour:material · governance:high → outside isolated reviewer

### 2026-09-24 | scope-change | T1 touched files outside its declared Layers
What broke: `layers observed` flags T1 files undeclared in the frozen Plan — `docs/adr/` + `docs/DECISIONS.md`
(G2 ruling, logged above but never written into Layers), `scripts/lib/check-sprint-by-reference.ts` (the
detector needs a home a consumer-free harness can call), `evals/run-layout-fixtures.ts` (its close-row anchor
quoted the replaced text `Verify all DoD`; retargeted, 33/0), `docs/knowledge-index.md` (regenerated; also
absorbed pre-existing drift L-213/L-214), `scripts/qa-check.sh` (coordinator registration, D3). Impact: none
on size or acceptance; § Plan stays frozen, this entry is the record. G2 re-confirm: covered by the owner's
G2 ruling for the ADR; the rest are mechanical consequences.

### 2026-09-24 | progress | T3 accepted — /handoff + /flow read the store; reconciliation files follow-ups as task files
Worktree commit `4b79bcc`, cherry-picked. handoff step 1 resolves the active sprint from top-level
`docs/sprint/SPRINT-*.md` `status: active` (logs/ + archive/ excluded) + members (Members ids ∪ `sprint:` stamp),
never TODO.md; flow's assess/feed/plan/build/close preconditions query `docs/work/`; handoff-reconciliation
routes a follow-up to `docs/work/backlog/` (`origin: close-retro`, numeric max id, worktrees excluded).
**Coordinator re-run on main:** `store-readers-fixtures: 21 pass, 0 fail`; `layout-fixtures: 33 pass, 0 fail`.
Harness mirrors the prose with a TS resolver — proves the rule, not agent compliance. Registered always-on (no git,
<1s). DoD ticked in Plan + TASK-376. No files outside Layers.
consequence · T3 · behaviour:med · governance:low → coordinator re-run + read of the diff
**Carried notes (not T3's scope):** (a) the id rule's legacy-`TODO.md` read was *my brief's* instruction and
conflicts with TASK-369's amendment ("reading TODO.md's content is migrate's job alone") — TASK-380 must drop or
allowlist it (T2 carries the same clause). (b) Stale TODO § Active Sprint readers outside this sprint's Layers:
`skills/prime/SKILL.md:41`, `skills/lean-doc-generator/SKILL.md:101,107`, `.claude/CONTEXT.md:82`,
`README.md:236` → TASK-379/380 at close-retro sweep. (c) T1's builder saw run-v1-to-v2 + typecheck-population
fail in its worktree; both pass on main (15/0, 1/0) — worktree lacks node_modules, not a regression.
