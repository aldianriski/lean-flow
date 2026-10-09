---
sprint: 120
slug: conform-to-our-own-standard
owner: Maintainer
last_updated: 2026-10-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-120 — Execution Log

> Append-only companion to [`../SPRINT-120-conform-to-our-own-standard.md`](../SPRINT-120-conform-to-our-own-standard.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-09 | promote | plan locked, governance signed, seven members: lean-flow passes its own conformance check at Structural
The backlog held nothing `ready` (5 `needs-info`, 1 `blocked`), so the owner chose the shape "Conform to our own standard" and the work was
decomposed in this session (TASK-406–412, `85587948`). `sh conformance.sh .` on lean-flow reported **level: none** with 57 findings, and no
promote since 2.0 had reported it. Ids were derived with worktrees and fixtures excluded: filename max 405; cited tokens ≥ 777 are prose
examples. The owner signed the checklist:
- **L-promotion:** none due. **L-229** (promoted, count 3, recurred after promotion) gets disposition `automate-into-check` → TASK-411.
- **TD aging:** 115 of 121 open rows aged against sprint 120. Second route: 121 − 6 filed at 118 = 115. One `high` row (TD-168) stays
  routed to TASK-404.
- **doc-aging:** §11 prune applied (`dc0fa344`, owner-approved):
  - **25 TD rows** resolved at SPRINT-116 deleted. Census: 148 − 25 = 123 = 121 open + 2 resolved.
  - **36 closed task files** removed. 42 were retention-due by the engine; second route: 42 files stamped sprint ≤ 116.
  - **6 kept:** live-cited TASK-357/360/368/374/386/392, which confirms TD-206 → TASK-410.
  - Conformance FAILs after the prune: 57 → 21. §2 caps: 0 FAIL. CHANGELOG rotated in 2.2.0.
- **epic rollup currency:** current (`check-epic-archive` 0 FAIL; workdoo NOTEs only).
- **handoff ledger:** none.
Size check at pull: 4 S + 3 M, no L. Shared engine file: T4 → T5 (D1).

### 2026-10-09 | progress | pins recorded: `plan_commit` @ `c226d3a`
The freeze point is the `plan locked` commit, the first in which the Plan and the seven stamped members both exist. `gates_signed:` is
omitted until G1+G2 are signed at `/orchestrator sprint-bulk` (absence means NOT signed). No `approval_envelope:`, because this sprint is
attended (T5 is J2).

### 2026-10-09 | g2 | G1 + G2 signed (owner); four rulings, two of them ADR-034 behaviour-change rulings
G1 fast-path (all seven members `origin: decomposer`): scope unchanged since approval. Owner rulings:
- **Waves:** wave 1 has T1, T2 and T3 inline as coordinator (a mechanical delete, two short ADR sections the owner reads, and a fixture
  rename), plus T4 and T6 dispatched in parallel to worktree-isolated Sonnet builders. Wave 2 is T5 on the merged T4 (D1). Wave 3 is T7.
- **T4 (ADR-034 behaviour-change ruling):** every engine file walk skips `.claude/worktrees/`. Findings sourced inside a worktree
  disappear; nothing outside changes.
- **T5 (ADR-034 behaviour-change + §11 spec ruling, J2):** a live citation is a whole-word id match in any tracked `.md` that is not
  history. History means done/cancel task files, every `archive/`, `docs/changelog/`, `CHANGELOG.md`, ADRs, `LEARNINGS.md` and `TECH-DEBT.md`.
- **T6:** the check lives in `check-sprint-by-reference.ts`. A path named in a scope-change entry must appear in that Tn's `Layers:`
  or `Cites:`. The layers-completeness paths leave T6's `Layers:` (scope-change below).
- **Review depth:** T4 and T5 are consequential G (seeded breaks, a worktree-isolated Sonnet reviewer, a Codex gauntlet). T6 is other G
  (fixture plus a real-artifact run, and one scoped reviewer). T1–T3 get self-review.

### 2026-10-09 | scope-change | T6 Layers narrowed to the by-reference checker (G2 ruling)
**What broke:** § Plan T6 named both candidate checkers pending G2. **Impact:** `scripts/lib/check-layers-completeness.ts` and
`evals/run-layers-completeness-fixtures.sh` leave T6's `Layers:`; the by-reference checker, its harness and `evals/fixtures/` stay.
**Re-confirm G2:** this entry is the G2 ruling itself.

### 2026-10-09 | scope-change | T4, T5 and T6 `evals/fixtures/` narrowed to the subdirectory each writes (pre-dispatch preflight)
**What broke:** the pre-dispatch preflight HALTed with 5 `shared-file-unowned` findings. T3–T6 each declared the bare `evals/fixtures/`
directory, so it could not see D2's disjoint subdirectories. **Impact:** T4 and T5 declare `evals/fixtures/conformance-engine/` (the
engine harness builds most fixtures in a temp dir; retained trees go here). T6 declares `evals/fixtures/by-reference/`. T3 already
declared `evals/fixtures/night-run-reaper/`. No work moves. **Re-confirm G2:** none needed, as the D2 ownership is unchanged.
