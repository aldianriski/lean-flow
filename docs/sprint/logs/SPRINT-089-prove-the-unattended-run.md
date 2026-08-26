---
sprint: 089
slug: prove-the-unattended-run
owner: Maintainer
last_updated: 2026-08-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-089 — Execution Log

> Append-only companion to [`../SPRINT-089-prove-the-unattended-run.md`](../SPRINT-089-prove-the-unattended-run.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-26 | promote | Batch G1 + G2 signed for T1–T2, recorded in frontmatter

Owner signed both gates. Recorded as `gates_signed: G1,G2 @ db656ff` in the Plan's frontmatter, not
left in the launching transcript — an unattended run reads that file and nothing else, and an absent
field means NOT signed (L-099). `approval_envelope:` deliberately stays absent; it is the second
Owner-action item and is not due until T2 fires.

G2 rulings taken at the gate, all three recorded here because a decision filed where its reader
cannot reach it is not a decision (L-151):
- **Stale plugin** — installed 1.59.0 vs repo 1.60.0. Reinstall before T2. The delta is 120 of 132
  changed lines in `orchestrator/references/night-run.md`, the exact contract T2 must execute.
- **T2's seeded J1** — `scripts/gen-index.sh` regenerating `docs/knowledge-index.md`: additive,
  reversible, already-approved-in-scope, and mechanically checked by the gate itself.
- **"Under load"** — same-session after substantial agent work, matching the log's own prior method.

D2 needed no ruling: TASK-301's `done-when` already requires a separate seeded Plan, and D3 forbids
re-declaring T1/T2 as AFK. Both are honestly HITL.

consequence · T1 · behaviour:low · governance:high

### 2026-08-26 | surprise | the gate's cost is host-dependent; A1 confirmed in share, refuted in absolute

T1 DoD 1, recorded as Round 8 in `docs/research/logs/qa-gate-timing.md` (`282e363`). Nothing was
changed before the measurement — TD-084's instruction applied literally.

Three full runs and a 30-harness sweep said the gate completes in **288.0s against a 450s budget with
zero harnesses skipped**, which reads as "TD-090 is cured". It is not. `run-conformance-engine-
fixtures.sh` and `conformance-engine.sh` are **byte-identical** to `2c8ae21`, the commit Round 7
measured post-fix, yet run **1.92–2.20× faster** here. Normalized, this tree is **553–632s** — and
SPRINT-088 independently observed **634s**. Two numbers from different data agreeing to within a
second is what makes this a measurement rather than a hypothesis.

**The criterion, not the tree, is what failed.** DoD 2 and DoD 3 are stated in absolute seconds
against a host that varies ~2× on identical bytes, so they passed *before any work was done*. That is
the G2 reachability **PROVES** question failing. Surfaced for an owner ruling rather than ticked
quietly — re-reading a frozen DoD to fit the measurement is the L-088 move.

**Owner ruling:** do the cut anyway (normalized, the gate is still 19–29% over), and restate TD-090's
re-raise condition in host-normalized terms against a named calibration anchor.

Secondary: TD-095 splits. Its false-FAIL half is **fixed** (193 pass / 0 fail with 12 worktrees
present, where SPRINT-086 saw 5 false `ephemeral-intake` FAILs); its **cost half is not** — 42.8s
here, 82–94s normalized. The 12 worktrees were measured before pruning, then removed: all fully
merged, verified by two agreeing queries.

consequence · T1 · behaviour:material · governance:high

### 2026-08-26 | scope-change | Layers corrected — the dominant cost sits in the engine, not a harness

T1's `Layers:` was written at promote as `qa-check.sh` · `evals/` · the timing log. The profile then
located the dominant term **inside `scripts/lib/conformance-engine.sh`** — twelve assertions each
spawning the same `git rev-parse --git-dir` against 98 engine invocations across the always-on set.

**What broke:** nothing in scope; the Plan's intent is unchanged. A declaration written before the
work could not name the file the measurement would point at.
**Impact:** `check-layers-completeness.sh` correctly reported `commit attributable to no task` on a
real gate run. The guard was right and caught its own motivating case.
**Re-confirm G2:** approach and acceptance unchanged — same task, same target, one more declared file.

Declared per L-100: a mid-sprint `Layers:` edit is the expected cost of declaring before the work.

consequence · T1 · behaviour:material · governance:low

### 2026-08-26 | progress | engine memoised, and the branch it touches turned out to be unguarded

`8fd5c4f` cut the git probe from 6 spawns per invocation to 1, proven output-equivalent (byte-identical
harness output, 43 PASS / 0 FAIL). **The wall-clock benefit is NOT claimed**: 4.7s sits inside ~17s of
host variance and one sample cannot resolve it. The deterministic 6→1 spawn count is the evidence.

The larger finding was accidental. Two seeded breaks were run against the existing fixture set and
**neither reddened** — the engine's git-availability branch, which twelve assertions gate on, had zero
discriminating coverage **in either direction**. By L-142 a break that does not redden has tested
nothing. `1f387e4` adds `evals/run-git-availability-fixtures.sh` (always-on, ~3.2s), whose seeds redden
in disjoint sets with sibling controls green under both.

Placed always-on as a deliberate exception to the cheap-**and-git-free** rule, reasoning recorded at
the list in `qa-check.sh`: a guard for an always-on code path that itself runs only under `QA_FULL`
would not catch the defect it exists for.

Inventory 30 → 31: **zero removed, one added.** Coverage increased, not traded (DoD 4).

consequence · T1 · behaviour:material · governance:high

### 2026-08-26 | progress | independent Tier G review found a defect the author did not

Dispatched worktree-isolated per L-165/L-168 over `8fd5c4f`. Cleared every reachable path; found one
latent defect and one wrong rationale.

**Defect:** `_is_git_repo ""` as the first call returned "not a repository" **without invoking git** —
the empty argument compared equal to the empty initial key and read as a cache hit on a value nothing
computed. Silent direction. Unreachable today; fixed anyway in `54cd86d` via a `_SEEN` flag that
separates "cache is cold" from "key matches".

**Wrong rationale, and this is the more useful half:** `8fd5c4f`'s comment justified path-keying on
`$_att_repo` and `$repo` being different trees. The reviewer traced both to one `"$fn" "$repo_abs"`
dispatch call — they are *always* identical within a process. Corrected in place; a wrong rationale
outlives the line it explains.

The reviewer also contributed a **harm case** stronger than the author's: a repo with a real
`PRIVATE KEY` block committed, where a wedged probe downgrades `FAIL secret-committed` to a `note` and
a leaked key passes the gate. Added as case 6; it reddens under seed B.

review · T1 · isolated-subagent · behaviour:material · governance:high

consequence · T1 · behaviour:material · governance:high

### 2026-08-26 | progress | T1 complete — gate green at 195 pass, 0 fail, and the guard caught its own author

All five T1 DoD ticked. Final verification run: **289.3s**, 31 harnesses, **zero skipped**, zero budget
trips, verdict read from the line the gate prints (L-120).

**What T1 actually delivered, stated without rounding.** The headline cut did NOT reach its 83s target
and is not presented as though it did. What landed: a deterministic 6→1 spawn reduction in the engine's
git probe whose *wall-clock* share is unresolvable against ~17s of host variance; a new always-on guard
costing back roughly what the memoisation saved, leaving net gate time flat at ~288s. The durable wins
are elsewhere — a Tier G coverage hole closed, a latent silent-direction defect fixed, and a debt row
that can no longer be cleared by running it on a fast machine.

**The guard caught its own motivating case, on real input.** `check-layers-observed.sh` reported
`commit attributable to no task` against this session's own commits — not a fixture. Two real
corrections followed: `conformance-engine.sh` was undeclared (L-100), and three commits carried no task
attribution at all, which would have left this sprint's history unauditable at close. Messages were
rewritten to carry `Task: T1` trailers; content verified untouched (tree diff against the pre-rewrite
HEAD is empty).

**Unclaimed headroom, named rather than exhausted:** ~36 forks per engine call remain; TD-095's cost
half (42.8s here, 82–94s normalized) is measured but unattributed to specific legs; `TASK-287` unbuilt.

consequence · T1 · behaviour:material · governance:high

### 2026-08-27 | run-complete | T2 complete — the unattended run happened, and every claim was verified against artifacts

**SPRINT-090 ran headless and delivered the evidence SPRINT-088 could not.** Two commits by the run
itself: `7cc19fb` (T1's Round 9 append, 00:04) and `e8ad125` (rollup + DoD ticks, 00:14). Terminal state
`AUTHORITY_BOUNDARY`. Rollup: `run · 6 of 6 DoD ticked`, `T1 · done`, `T2 · parked-hitl`.

**Verified against artifacts, never against the run's own report** — the run is a reporter, and an
exit code or a ticked box is evidence about the reporter (L-045 · L-057):

| SPRINT-089 T2 DoD | Independent check |
|---|---|
| J1 executes unattended, no confirmation | `7cc19fb`, 46 additions / 0 deletions, inside the window; **0 `AskUserQuestion` tool_use events** in 41 tool calls |
| Seeded J2 parks with an unblock condition | `T2 · parked-hitl` naming the ruling required; `check-authority.sh`: **1 park, 0 execution, 0 owner-ruling** |
| Run consumes the envelope, no J0/J1 re-confirm | envelope read from frontmatter (13 references in the run log); no confirmation sought for T1 |
| Rollup's terminal state matches its per-task lines | `AUTHORITY_BOUNDARY` over one `done` + one `parked-hitl` — **not** `PLAN_EXHAUSTED`; `check-night-run-rollup.sh` PASS |
| DoD checked against task classes before firing | done at pre-flight; it is what surfaced **TD-109** |

Scope was honoured in both directions: **0** commits touched T2's Layers (`TECH-DEBT.md`,
`scripts/lib/`), and **0** touched SPRINT-089, which the trigger forbade.

**The run found a defect nobody had anticipated, and handled it correctly.** It parked its own close on
a red system-verify and named the cause. The cause is real: `gen-index.sh` writes `last_updated:` into
the index frontmatter, so the index goes stale **at every midnight regardless of content** — the sole
diff was `2026-08-26` → `2026-08-27`. Filed as **TD-111**. With TD-110's green-gate precondition that
means *an unattended run can be refused by the clock alone*, and the mode most likely to cross midnight
is the one this whole epic is about. The autonomy contract behaved exactly as written on a case its
authors never considered: `repair-policy` granted nothing, so it parked instead of repairing.

**Two corrections to what this session reported earlier, both the same error.** First, "pre-flight does
not require a green gate" — Part 1's prose does not, `night-run.sh:339` does; I read the checklist
instead of the code that enforces it. Second, "the run ticked its DoD without committing them" — that
was a **mid-flight snapshot**; the bookkeeping commit landed ten minutes later. Both were snapshots
mistaken for final states, which is the same shape as the defects the guards caught all day.

**Five foreclosures, one acceptance.** All-`HITL` Plan (L-111) · pre-flight item 3 vs a declared J2
(TD-109) · `sprint-bulk` step 0's unanswerable "which sprint" · the launcher's green-gate precondition
(TD-110) · midnight staleness (TD-111). **Not one was found by reading the procedure** — every one
surfaced by attempting the next step. That is the sprint's real result.

consequence · T2 · behaviour:material · governance:high
