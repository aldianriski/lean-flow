---
sprint: 106
slug: the-store-and-the-way-in
owner: Maintainer
last_updated: 2026-09-23
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-106 — Execution Log

> Append-only companion to [`../SPRINT-106-the-store-and-the-way-in.md`](../SPRINT-106-the-store-and-the-way-in.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-23 | promote | plan locked at `4290781`, governance signed
Four tasks from `EPIC-017`: T1 `TASK-359` · T2 `TASK-360` · T3 `TASK-369` · T4 `TASK-370`. Governance:
L-promotion none · TD aging 91 of 99 open aged, 6 of 7 high owned, `TD-128` re-reviewed · caps 4 soft,
0 hard · epic rollups current · no handoff ledger. G1/G2 not yet signed (`gates_signed` absent).

### 2026-09-23 | scope-change | T0 added, T3 rescoped to a hard cut, T4 widened — all by owner ruling
**What broke.** The `/task-decomposer --epic EPIC-017` pass that followed the promote, reviewed by
Codex in three adversarial rounds, found the locked Plan wrong in three places:
- **No baseline.** Closed-when 7 compares before/after, and the "before" half can only be taken
  before T1 changes the layout. Nothing in the Plan took it.
- **D7 contradicted Closed-when 2.** Dual-layout support through `2.x` needs v1 readers alive; CW-2
  requires `TODO.md` deleted with zero readers. Owner ruled a **hard cut**: `2.0.0` is v2-only; a 2.x
  queue skill refuses a v1 tree by name and points to `migrate`, the only 2.x path accepting v1.
- **T4 migrated the Backlog only.** A v1 repo's active work lives in its sprint Plan, so a
  Backlog-only migrate loses in-flight tasks (Codex r1 F10).

**Impact on the Plan (the Plan text stays frozen; these entries govern where they disagree):**
- **T0 — `TASK-374`**, freeze the "before" effectiveness baseline. Runs before T1. `S · med · execution ·
  HITL · J1`. Layers: `docs/research/epic-017-effectiveness.md`. Spec: `docs/work/todo/TASK-374-freeze-effectiveness-baseline.md`.
- **T1** now depends on T0.
- **T3 — `TASK-369`** Acceptance becomes: each of the 7 skills names v1 or v2; on v1 or mixed it
  **refuses by name and points to `migrate`**, writing nothing. "Mixed is first-class" and "works with
  the one it found" are withdrawn. `ADR-046` records the hard cut, not dual support. Detection tests
  `TODO.md` for existence only. Spec: `docs/work/todo/TASK-369-queue-skills-detect-and-refuse-v1.md`.
- **T4 — `TASK-370`** migrates the **whole** queue in one run — Backlog and active-sprint Plan tasks,
  preserving membership, ticked boxes, authority and frozen references — idempotent and resumable.
  The "incremental, stop anywhere" design in the T4 prose is withdrawn (mixed is now refused). Added
  DoD: ticked-box counts equal before/after; an interrupted run resumes to the same tree.
  Spec: `docs/work/todo/TASK-370-migrate-v1-repo-onto-the-store.md`.
- **D3** stands, reworded by the ruling: v1-against-v2 safety comes from the migrated tree's shape;
  `TASK-372` proves it later.
- **A2** stays UNCONFIRMED and moves with it to `TASK-372`.

**Where the tasks live now.** By owner direction all 26 EPIC-017 tasks moved out of `TODO.md` into
`docs/work/<status>/TASK-NNN-<slug>.md` with `epic:` frontmatter; this sprint's five sit in `todo/` with
`sprint: SPRINT-106`. The files carry a provisional schema that T1 formalises.

**Re-confirm G2:** yes — T3's design changed from dual support to refusal, and T0 is new. G1/G2 are
signed together at the start of `/orchestrator`.

### 2026-09-23 | scope-change | G1 + G2 signed by the owner; Plan amended to match the signed design
**Signed:** batch G1 + G2 over T0–T4, recorded as `gates_signed: G1,G2 @ 81407ad`. Design:
`/orchestrator sprint-bulk` G2 pass (plan file `witty-chasing-gem.md`). Owner rulings at this G2:
**D6 = `git mv`, in a commit of its own** (content edits never share it) · **T0 measures** = first-pass
decomposition coverage, a 12-probe retrieval set scored by a fresh agent against a key committed first,
and learning count-bumps per sprint over 10 sprints · **execution** = one Sonnet subagent per task,
sequential, with an owner review stop after every task (all J2 ⇒ HITL).
**Plan amendments (precedent `7524c6a`):** T0 block added to § Plan so the preflight and checkers see it;
T1 now depends on T0; `Layers:` += `evals/run-work-store-fixtures.ts` (T1 → T2, owner T1) ·
`evals/run-layout-fixtures.ts` (T3) · `evals/run-v1-to-v2-fixtures.ts` · `README.md` · `CHANGELOG.md` (T4,
whose DoD already named the last two); ADR-046's path is now `docs/adr/ADR-046-the-2-0-hard-cut.md`,
since the dual-layout name contradicts the ruling it records.
**Pre-screens:** preflight CLEAR (waves T1→T2→T3→T4, five shared files each single-owned) ·
verify-reaches PASS (0 mechanical targets, 10 judgment clauses → RUNS/PROVES handled in the design) ·
cap risk found: `skills/lean-doc-generator/SKILL.md` at 138/140, so T3/T4 add ≤ 3 lines inline and put
detail in that skill's own `references/`.
