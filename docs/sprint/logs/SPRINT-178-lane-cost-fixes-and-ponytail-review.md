---
sprint: 178
slug: lane-cost-fixes-and-ponytail-review
owner: Maintainer
last_updated: 2026-11-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-178 — Execution Log

> Append-only companion to [`../SPRINT-178-lane-cost-fixes-and-ponytail-review.md`](../SPRINT-178-lane-cost-fixes-and-ponytail-review.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-16 | promote | plan locked, 3 members: TASK-666, TASK-667, TASK-669 (3 plan steps)
Owner rulings, verbatim: "Lane fix + ponytail now (Recommended)" (the lane-fix tasks plus ponytail's delta review now; RTK's measured trial and graphify wait for Sprint B to close, EPIC-026 D1); "Stamp EPIC-026 (Recommended)" (the sprint carries `epic: EPIC-026`; only TASK-669 advances it); "Keep the name (Recommended)" (SPRINT-178-lane-cost-fixes-and-ponytail-review).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign, promote (Recommended)".
- ☑ L-promotion: none. 71 entries are `promoted: no`, all count 1 (two selections agree: heading status not promoted with count of 2 or more gives 0; `promoted: no` with count other than 1 gives 0).
- ☑ TD aging: 119 open rows (75 low, 24 minor, 13 medium, 7 trivial, none high), 118 aged three sprints or more; the one younger row is TD-315. Nothing escalates. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 102 PASS, 0 FAIL, 0 WARN. CHANGELOG rotation not due. LEARNINGS pointer-collapse: long-standing, deferred to the close compaction sweep. Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `skills/orchestrator/SKILL.md` 140 of 140, `.claude/CLAUDE.md` 79 of 80; always-loaded token budget 12683 of 12691, so T1's CONTEXT edit is net-zero (D4).
- ☑ epic rollup currency: EPIC-025's rows for SPRINT-172 and SPRINT-173 carry their `close_commit`; header dated 2026-11-15; every ticked condition names its closing sprint. None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. EPIC-026, judged active now, has 4 open conditions, all marked, 0 uncovered (the ponytail line is re-marked `→ TASK-669`). No refusal, no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent). ☑ handoff ledger: none (no ledger file).
Sprint number: 178, the maximum in use plus one. Five selections all gave 177: archive plans, archive logs, `docs/sprint/INDEX.md`, `sprint(N)` commit subjects, `sprint:` stamps under `docs/work`.
Composition: 3 members, sizes M/M/S, T1 and T3 in wave 1, T2 in wave 2 after T1, epic EPIC-026, no stream. Filing commit `8c3c8b19`, status move `d8bde775`.
EPIC-026 is activated here: D7 amends D1's timing for the ponytail slice only.
Baseline gate: not run by the promote worker (its shell had no `LF_GATE_*` set). The coordinator runs the off-host gate and logs the verdict as a `progress` entry.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:low · governance:low

### 2026-11-16 | progress | baseline gate (QA_FULL, off-host) green at 99f85bb6
- **Gate:** `bun --no-env-file scripts/gate-remote.ts` run by the coordinator, verdict lines read from its own output: `gate-remote: ran 99f85bb6c9149fdb3d8689990dd349f5013005bd` · `bun test: 638 pass, 0 fail (rc 0)` · `QA-CHECK: 233 pass, 0 fail (rc 0)`.
- **Promote checks:** `promote-check: PASS -- 11 pass, 0 fail` on the real sprint file before the lock commit (promote worker).
- **Next:** G1/G2 for the three members in the owner session; `gates_signed` stays absent until then.

### 2026-11-16 | gates | batch G1 + G2 signed by the owner (popup)
- **G1** (fast-path, all members `origin: decomposer`): owner answered "Unchanged, G1 signed (Recommended)".
- **G2**: owner answered "Sign G2 (Recommended)" to the design summary. T1: the coordinator runs the real `claude --bg` exercise on a throwaway lane in a throwaway worktree first (the owner runs `claude attach <id>` once); Codex then writes the text; "task boundary" = a member task's commit; the coordinator may launch its own successor with `claude --bg` (a rotation, no popup). T2 after T1: Codex writes the §3 message rule, §6 one approval per task batch, a "Lane cost" section and the dispatch.md counterweight citing `docs/research/router-mode.md`; exercise = a Sonnet worker runs the full `bun test`, and a background loop waits on a real lock. T3 in parallel: a Sonnet worker reads ponytail first-hand (commit SHA recorded), the coordinator maps it and writes the verdict. Reviews: Codex on T1/T2 diffs (at most 2 rounds), self-review on T3.
- **CONTEXT fit** (T1): owner answered "Compress the same bullet (Recommended)": the Streams bullet is reworded with no meaning lost so the § Lane rotation pointer fits net-zero (~12683 of 12691 tokens, 150/150 lines).
- **Builders** (owner memory "Codex default builder"): T1/T2 text by Codex (`codex exec -s workspace-write` in a worktree, no git writes); T3 by the coordinator with a Sonnet fetch worker. Design record with the builder-check settlements: session scratchpad `g2-designs.md`.
builder-check · T1 · 1 contradictions · 5 questions · owner attach is a precondition for box 1; two greps (200k, Lane rotation); CONTEXT net-zero by token, owner-ruled compress; task boundary = member commit; successor via --bg
builder-check · T2 · 1 contradictions · 5 questions · one approval per task batch; figures sourced to router-mode.md:121; next free section number; no line count or size figure; wait loop in probe lane else coordinator
builder-check · T3 · 0 contradictions · 4 questions · knowledge-index regenerated not hand-edited; INDEX row not written; ponytail SHA recorded; no benchmark data -> inconclusive

### 2026-11-16 | progress | T1 (TASK-666) box 1 exercise run on real input, all four checks pass
- **Setup:** throwaway worktree `lean-flow-worktrees/s178-probe` (detached at HEAD); this session (`lean-flow-56`) as coordinator; lanes on `--model haiku`, Claude Code 2.1.325.
- **(a) launch: pass.** `claude --bg --name probe-1 ... "<brief>"` printed `backgrounded · 7d17a957 · probe-1`; ListAgents showed it as a peer `bg` session. `claude agents` needs a TTY; from a coordinator shell use `claude agents --json`.
- **(b) SendMessage to a `--bg` session: pass.** The coordinator's ping reached probe-1 and it replied "pong from probe-1". The message queued behind the lane's pending popup and was answered after it.
- **(c) popup after attach: pass, with a constraint.** The owner answered "Yes" after `claude attach 7d17a957` from a real terminal window. `claude attach` run from the coordinator's shell, or by the owner's `!` command in the coordinator session, prints "Attaching…" and exits: no TTY there.
- **(d) rotation: pass on the third launch.** probe-1 wrote `/handoff` (OS temp dir) and sent "rotate me <path> - popup answer: Yes"; `claude stop 7d17a957`. probe-2 (`acceptEdits`) blocked on a permission prompt to read the handoff outside its worktree. probe-3 started idle: `--add-dir` is variadic and swallowed the positional brief. probe-4 (`2821f58e`), launched with the brief first, then `--permission-mode auto --add-dir <temp dir>`, ran `/prime`, read the handoff and reported "probe-4 continuing from handoff-probe-1.md: ...". Names logged: probe-1 7d17a957 → probe-4 2821f58e. All probes stopped.
- **Text consequences for T1:** attach from a real terminal window only; give a rotated lane its predecessor's permission mode plus `--add-dir` for the handoff's directory; put the brief before variadic flags.

### 2026-11-16 | progress | T1 (TASK-666) built by Codex, reviewed, committed; T3 (TASK-669) committed
- **T1 build:** Codex (`codex exec -s workspace-write`, worktree `lean-flow-worktrees/s178-t1`), 5 Layers files, 32+/3-. Coordinator checks: `200k` and `Lane rotation` greps 4/4 each; doc-caps CONTEXT 150/150, token-budget ~12679 ≤ 12691; handoff 109, flow 65.
- **T1 review:** Codex cross-model, R1 `VERDICT: CLEAR` with one Med (box 2: lane boundary vs mid-task rotation). One bounded retry by the coordinator (one sentence: the lane initiates at a task boundary, the coordinator may rotate after a coherent step); R2 `VERDICT: CLEAR`. Blobs copied to main, hashes equal to the worktree's.
- **T3:** first-hand read of ponytail at `96608e07` (Sonnet fetch worker, coordinator re-read the quotes), verdict Drop, "-45% tokens" inconclusive; `docs/research/ponytail-delta-review.md`, knowledge-index regenerated, `gen-index --check` PASS. Self-review per the skip table. Commit 1c5239aa.
