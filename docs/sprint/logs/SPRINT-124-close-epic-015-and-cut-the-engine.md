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

### 2026-10-11 | task-done | T1 TASK-426 — the stop marker is bound to its run (3/3)
Builder: one `general-purpose` agent (sonnet) under `/tdd`. Red was 28 PASS / 3 FAIL against the old reaper. Green is 31 PASS. Commit
`7470f1a0` touches `scripts/night-run.sh` and `evals/run-reap-terminal-fixtures.sh` only.
Consequential G bar:
- **Seeded breaks** (builder, in place, restore hash `a2151e4e` each time). S1 accept-any-id reddens only the foreign-id case. S2
  accept-no-id reddens only the no-id case. S3 bare-signal trap reddens `wrapper-term-is-user-stop`, `ceiling-breach-outranks-stop`,
  `stop-keeps-child-exit-status` and `fire-site-wrapper-catches-term`. Each seed passed `cmp` against the pristine copy, parsed,
  and kept a 0-line delta.
- **Review round 1 of 2 (cap):** Codex static review, with the diff pasted in (the sandbox cannot read or run): **CLEAR**, one OK line
  per threat item (handoff identity · rank order · `SIG` text · warnings readers · fixture reach). Its qualifier: the edited
  rank/wrapper cases are compatibility controls, and only the two new cases plus the fire-site regex discriminate. This is accepted
  and matches the seed table.
- **Worktree-isolated run** (sonnet): the harness printed `all green` with 31 PASS at `7470f1a0`. One seed (equality → `true`)
  reddened exactly `stale-marker-foreign-id-is-not-user-stop`, the sibling `wrapper-term-is-user-stop` stayed PASS, and the restore
  was hash-equal (`a2151e4e` == `a2151e4e`).
- **Coordinator:** ran the harness on the main tree (31 PASS, `all green`). TD-247 is updated at `50a8fa54`. C6's census is 0
  line-start USER_STOP terminals, and a control query over the same logs reaches 10 terminals.
Spend: builder ~78k · Codex ~24k · isolated verify ~56k sub-agent tokens.

### 2026-10-11 | scope-change | T2 Layers gain the two fixture harnesses its seeded breaks must redden
What broke: the signed G2 bar needs one seeded break per changed evaluator, and each must redden its fixture. The builder's seeds on
S10.TDAGING, S11.LOGPAIR and S11.WHENITRUNS reddened nothing, because no case in `evals/run-sprint-family-fixtures.sh` reaches them
(age only 100/1 asserted · no re-added Plan path · no unreachable/placeholder/missing close_commit). The S4.APPEND status-match seed
was a fourth gap, and the builder closed it with one case in `evals/run-adr-family-fixtures.sh`. Neither file is in T2's Layers.
Impact: T2 Layers add `evals/run-adr-family-fixtures.sh` and `evals/run-sprint-family-fixtures.sh` (new cases only, no existing case
edited). TASK-404's `## Done when` is unchanged. Engine evidence so far: the report is byte-identical (`cmp` silent on 2 after-runs, rc 0
== 0), and the time went from 417.4 s to 136.3 s / 82.5 s. Re-confirm G2: the owner ruled "close the gaps" by popup.

### 2026-10-12 | task-done | T2 TASK-404 — the engine runs in a third of the time, report byte-identical (1/1)
Builder: one `general-purpose` agent (sonnet) batched the five Round-23 loops (`2d07c3f2`). A second builder added the sprint-family cases that its
seeds needed (`caf7276b`, after the scope-change above). Coordinator applied the Codex R1 fix (`b4ee69a6`) and the ledger (`449acf7f`).
- **Timing** (this host, `qa-gate-timing.md` Round 24): 417.4 s → **136.3 s** (−67.4%), a second run 82.5 s. Target ≤ 216.5 s. The before is 3.6%
  under Round 23's 433.1 s, inside ±10%, so A2 holds. A1 holds: the five loops alone reach the target.
- **Parity:** the full `sh conformance.sh .` report is byte-identical before vs after (`cmp` silent on both after-runs, rc 0 == 0). On the VPS
  (dash), old vs new is identical under gawk 5.2.1 and mawk 1.3.4, for `cdc8b7ef` and again for `b4ee69a6`.
- **Seeds** (one per changed evaluator; every one cmp-differs, parses and keeps its line count, with a hash-equal restore): LAW2 always-Y
  → 2 ownership cases red · `_own_scan` → `update-trigger-absent-fires` · APPEND newest-wins / compare-forced-clean → `edited-after-decision-fires` ·
  APPEND status-skip → `proposed-then-accepted-passes` (new) · TDAGING 3→4 → `s10-td-aged-edge-three-fires` + leading-zeros (new) · LOGPAIR newest-add →
  `s11-logpair-readd-still-one-pair` (new) · WHENITRUNS unreachable-as-reachable → both `s11-whenitruns-*` (new) · quotepath revert →
  `non-ascii-name-edited-fires` (new). A sibling stayed green in each. Harnesses at `b4ee69a6` on the VPS: ownership 23/0 · adr-family 19/0 ·
  sprint-family 114/0, each `all green`.
- **Review, round 1 of 2:** Codex NOT CLEAR, 4 items. T3 was **confirmed** by a probe: an ADR with a non-ASCII name, edited after its decision,
  read "no commit touching it" with rc 0, a false negative. Fixed with `-c core.quotepath=off`, plus a retained case. T2 (locale case folding) is
  fixed: awk answers only byte-exact hits (census 350/350 exact, so no added spawns). T1 (sprint > 2^53) and T4 (crafted merge
  simplification) are census-zero → TD-249.
- **Review, round 2 of 2 (cap):** R2 OK. R3 rejected on evidence: Codex read `\303\251` with its backslashes stripped by the paste, and the VPS
  seed shows the case reddens. R1 (a path with a double quote, backslash or control character is still quoted) is census-zero → TD-249.
- **Worktree-isolated verify** (sonnet, at `b4ee69a6`): **CONFIRMED**. Both harnesses were green unseeded. The LAW2 seed reddened exactly the 2
  role cases, with `maintainer-is-a-role` green. The quotepath seed reddened exactly `non-ascii-name-edited-fires`, with `edited-after-decision-fires`
  green. Restores were hash-equal (`63b40ba3`).
- A local post-R1 run on this host was killed by the memory reaper. The owner ruled by popup to verify on the VPS instead.
- TD-168 → resolved (TASK-404). TD-249 filed.
Spend: builder 1 ~254k · builder 2 ~107k · Codex ~20k + ~19k · isolated verify ~62k sub-agent tokens.
