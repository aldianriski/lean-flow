---
sprint: 086
slug: guards-that-cannot-fire
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-086 — Execution Log

> Append-only companion to [`../SPRINT-086-guards-that-cannot-fire.md`](../SPRINT-086-guards-that-cannot-fire.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-25 | progress | Owner-action discharged first: the plugin is reinstalled, 1.58.0 == 1.58.0
Carried unaddressed through SPRINT-084 and SPRINT-085; done before any task started. Verified from
the **base-dir version `/orchestrator` prints in its own invocation header**
(`…/lean-flow/1.58.0/skills/orchestrator`) against `.claude-plugin/plugin.json` — **not** from
`/plugin`'s report, which L-021 names specifically as the thing not to trust. This is the first run
since SPRINT-083 executing procedures that match the repo; SPRINT-085 survived a 1.55.0/1.57.1 gap
only because its agents were briefed to read `skills/<name>/SKILL.md` from the repo, reaching *past*
the stale procedure rather than following it.

### 2026-08-25 | progress | Batch G1+G2 signed @ 835e744; wave 0 parallel, T2 sequenced behind T1
**G1 ran the full checklist for all four tasks — no fast-path.** Every task carries
`origin: close-retro`, and that origin never met the intake grill, so there is no prior scope
agreement for a fast-path to re-confirm. Sizes S · M · S · M; nothing to split.

**A1–A6 were each confirmed against a source, run rather than read:** `QA_BUDGET_SECONDS=900` at
`scripts/qa-check.sh:23` · the `^T[0-9]+ · ` anchor at `check-review-depth.sh:60` · Round 4's
271.5→23.6 figures present in the timing log · `sh evals/run-review-depth-fixtures.sh` as its own
call returning **9 cases green**, including the `low-self-reviewed-passes` control.

**A6 nearly went the wrong way, and the way it was caught is the point.** `grep 'size: L'` over the
Plan returned a hit — which, taken at face value, means an `L` task that G1 must split. The match was
**A6's own text**, the assumption asserting no `L` exists. Self-describing corpus, L-108 exactly. The
anchored second query over `^### T[0-9]+ .*\[size: [A-Z]+` disagreed (S·M·S·M), and the disagreement
is what surfaced it — not recall of the rule.

**Ownership map.** `scripts/qa-check.sh` is the only genuinely shared file (T2 conditionally, T3 at
its invocation point) → **single-owner chain, T3 commits before T2**, per-hunk staging, never a plain
`git add` over the other's WIP. T2/T3/T4 all touch `scripts/lib/` but different files in it. The
sprint file and this Log are **coordinator-owned** and assigned to no task — SPRINT-063 produced two
copies of one Log by assigning it.

**Waves.** 0 = {T1, T3, T4}, disjoint → parallel, worktree-isolated · 1 = {T2}, behind T1 for
evidence and behind T3 for `qa-check.sh` ownership.

**Reachability pre-screen: `0 claimed targets, 17 judgment-method clauses left to G2`.** All 17 DoD
`Verify:` clauses are judgment methods — none names a script+path pair the checker can pre-screen.
That was left as-is deliberately: the Plan froze at `5ada67e`, and rewriting frozen criteria so they
*look* mechanical is L-088, while inventing a checker merely to make a criterion look mechanical is
named by G2 itself as the failure rather than the fix. RUNS and PROVES stay the coordinator's job.

**Residual grill — one question, ruled by the owner rather than absorbed.** T2's `Layers:` declares
`conformance-engine.sh` and its rule families, but **TD-090's headline subject is leg 12 (eval
harnesses) at 396.3s of a 492s run** — a different leg from the conformance engine Round 5 profiled
at 281.2s. The two figures do not fit in one 492s run together, which is part of what T1 exists to
untangle. So T2's declared scope may be pointing at the wrong subsystem and nobody can know until T1
lands. **Owner ruling: T2 follows T1's verdict wherever it points, correcting `Layers:` and logging
it** — L-100's rule that `Layers:` is a live declaration corrected per task, not a frozen prediction
to defend. If T1 points at `evals/`, that is T4's tree and the ownership map is re-ruled here before
any edit.

**Noted against this run's own subject:** wave 0 dispatches three agents, and TD-090 *is* that the
gate cannot finish under accumulated session load. System-verify at close will likely need a fresh
process table — the same condition that beat the blocker at SPRINT-085's close.
