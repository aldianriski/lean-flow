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
