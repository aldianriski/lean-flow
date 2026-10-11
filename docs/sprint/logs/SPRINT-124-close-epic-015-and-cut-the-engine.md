---
sprint: 124
slug: close-epic-015-and-cut-the-engine
owner: Maintainer
last_updated: 2026-10-11
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-124 — Execution Log

> Append-only companion to [`../SPRINT-124-close-epic-015-and-cut-the-engine.md`](../SPRINT-124-close-epic-015-and-cut-the-engine.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-11 | promote | plan locked, governance signed, three members: the run-id stop marker, the engine cut, then EPIC-015's close
Promote governance checklist, signed by the owner by popup, and written here at promote (S10.PROMOTEREVIEW):
- ☑ L-promotion (count≥2, promoted:no): none due. L-210 is the only active entry (count 1). Two routes agree: the heading
  census and the engine's S10.PROMOTION PASS.
- ☑ TD aging (≥3 sprints unaddressed): 130 of 132 open rows, counted against sprint 124 (132 − 2 filed at 122). Newly aged and
  named for re-review: TD-237..242 (filed at 120) and TD-243..246 (filed at 121). TD-168 (`high`) is a member here, via TASK-404
  (`2a4111bc`).
- ☑ doc-aging (§11 retention + §2 caps): no cap breach (`check-doc-caps.ts`, rc 0; the three over-cap research files carry
  `retain`/FROZEN dispositions). The store prune deletes `done/TASK-406..412`, closed at 120; the engine flags each as
  `closed-task-past-retention` (`4d4e2d97`). §11 deletion: TD-206, resolved at 120 (`2a4111bc`). The tasks closed at 121 come due
  under this sprint's scale, and are re-checked by the engine once this file exists.
- ☑ epic coverage: EPIC-015's one open condition, CW8, maps to TASK-417, a member here. ☑ epic rollup currency: current
  (`check-epic-archive.ts`, epic-state PASS). ☑ handoff ledger: none.
Size check: M + S + M, no `L`. TASK-417 was stale-blocked, since all four blockers were done. The owner added it to the sprint,
and it was flipped to `ready` in its own commit (`583b8da1`) before the move.

### 2026-10-11 | gate | G1 + G2 signed by the owner (one popup round), sequential attended sprint-bulk
Recon: three read-only `Explore` passes (sonnet), one per task. G1: goals are the Plan's Acceptance lines. Sizes S · M · M, no split.
Out of scope as in § Scope. Run shape: **sequential T1 → T2 → T3, attended**, no overnight envelope. T2 measures wall clock on this
host, so a parallel build would skew its before/after.
- **T1 (TASK-426), design signed:** the trap writes `<sig> <wr_start>` (epoch, launcher `$started`). reap() splits the marker and
  reports USER_STOP only when the id is non-empty **and** equals `rp_started`. A foreign or missing id is ignored and named in
  `warnings ·`. Strict: if `date` failed, there is no id, so no USER_STOP, and a warning instead. Fixtures: `case_wrap` passes a real
  epoch. `fire-site-wrapper-catches-term` asserts `TERM <epoch>`. `stop-plus-unresolved-member` writes a matching id. Two new
  must-FAIL cases: a foreign id, and a bare `TERM`. Verify: `evals/run-reap-terminal-fixtures.sh` (EXISTS/RUNS on this host;
  REACHES `night-run.sh` reap/wrap through the real `--wrap`/`--reap`).
- **T2 (TASK-404), design signed:** batch all five Round-23 loops (S10.TDAGING · S1.LAW2's `_own_scan` · S4.APPEND · S11.LOGPAIR +
  S11.WHENITRUNS on one shared archived-at map). POSIX sh, no bun (ADR-043). Bar: the full `sh conformance.sh .` report is
  **byte-identical** before vs after on the same tree (ADR-043 report-text parity, stricter than ADR-034's floor), and the exit is
  equal. The per-rule fixtures pass: ownership-header and adr-family always-on; sprint-family is QA_FULL, so it runs on the VPS.
  There is one seeded break per changed evaluator, and each must redden its fixture. Timing: `time sh conformance.sh .`, before and
  after on this host with free RAM noted, ±10% band. A reading near the line is re-run, never rounded (Round 23 rule).
- **T3 (TASK-417), design signed:** the ADR (ADR-053; the max is ADR-052 by filename and by DECISIONS.md, two routes) makes **the
  five** binding: measured defect · measured cost · repeated failure (≥2, `L-NNN`) · security issue · consumer evidence. V3 §58's
  six map onto them. The stop rule (L-217) is a declared review-round cap per item (default 2, with cumulative spend shown each
  round), and a census-zero finding shape routes to TD. **Placement: one Anti-Patterns line in `.claude/CLAUDE.md`.** The freeze
  governs lean-flow's own development, so shipped skills would leak it to consumers (L-015). CLAUDE.md is repo-only and read by
  every flow here, including promote and decomposer intake.
- consequence · T1 · behaviour: changes when the launcher reports USER_STOP · governance: workflow-contract (Consequential G,
  ADR-050) → seeded breaks + worktree-isolated Codex review.
- consequence · T2 · behaviour: material (`conformance.sh` is the adopter-facing engine) · governance: none (output contract held
  byte-identical) → seeded breaks + worktree-isolated Codex review + system verify on the VPS.
- consequence · T3 · behaviour: none · governance: high (a binding ADR on what work is admitted) → Tier P: G1 + an owner
  read-through of the ADR.
Ownership: `TECH-DEBT.md` is shared by T1 (TD-247) and T2 (TD-168). Plan order holds, and it is staged per hunk (D1). No other
overlap.

### 2026-10-11 | scope-change | T3 Layers follow the G2 placement ruling
What broke: T3's Layers named `skills/lean-doc-generator/SKILL.md` and `skills/task-decomposer/SKILL.md` as placement targets.
G2 placed the rule in `.claude/CLAUDE.md` instead, to keep lean-flow's own freeze out of the shipped skills. Impact: T3 Layers
drop both SKILL.md files and add `.claude/CLAUDE.md` and `docs/LEARNINGS.md` (L-217's `retain` pointer is re-disposed once the ADR
lands, which that pointer requires). TASK-417's `## Done when` is unchanged. Re-confirm G2: done in the same popup round.
