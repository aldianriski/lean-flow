---
sprint: 177
slug: spec-fix-and-detached-preflight
owner: Maintainer
last_updated: 2026-11-15
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-177 — Execution Log

> Append-only companion to [`../SPRINT-177-spec-fix-and-detached-preflight.md`](../SPRINT-177-spec-fix-and-detached-preflight.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-15 | promote | plan locked, 2 members: TASK-665, TASK-367 (2 plan steps)
Owner rulings, verbatim: "Promote now (Recommended)" (promote in parallel with workdoo Sprint B); "Both, in order (Recommended)" (wave 1 TASK-665, wave 2 TASK-367, one sprint); "Claude builds, Codex reviews (Recommended)"; "Other G (Recommended)" (T2 takes the other-G bar; supersedes the packet's isolated outside review); "T2's G2 after T1 lands (Recommended)"; "Add a box to TASK-665 (Recommended)" (done before promote, `5ad18c48`). Fixture form settled under the 2026-09-09 no-new-shell ruling: a Bun TypeScript test (D3).
Freeze plan: TASK-367's Done-when is edited by T1 only after a `scope-change` entry naming TASK-367 and T1 is logged. The checker reads it as covered when the entry is new since `plan_commit` and precedes or shares the first edit's commit.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign off".
- ☑ L-promotion: none. 69 entries are `promoted: no`, all count 1; a second selection (not promoted and count not 1) finds only L-235, which is `merged`.
- ☑ TD aging: 119 open rows (75 low, 24 minor, 13 medium, 7 trivial, none high), 118 aged three sprints or more; nothing escalates. TD-090, TD-117 and TD-171 name the gate cost; TD-315 records the token budget. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: none; no row is due.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 102 PASS, 0 FAIL, 0 WARN. CHANGELOG rotation not due (v2.24.0 and v2.23.0 inline). LEARNINGS pointer-collapse: long-standing, deferred to the close compaction sweep. Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `skills/orchestrator/SKILL.md` 140 of 140, `.claude/CLAUDE.md` 79 of 80; always-loaded token budget 12683 of 12691, so T2 touches neither CONTEXT nor CLAUDE.md (D4).
- ☑ epic rollup currency: EPIC-025's rows for SPRINT-172 and SPRINT-173 carry their `close_commit`; SPRINT-174 to 176 carry no `epic:`; header dated 2026-11-15; every ticked condition names its closing sprint. None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)` (1 open = 1 covered + 0 uncovered). EPIC-026 is `proposed` and exempt. No member carries `epic:`, so no refusal and no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent). ☑ handoff ledger: none (no ledger file).
Sprint number: 177, the maximum in use plus one. Five selections all gave 176: archive plans, archive logs, `docs/sprint/INDEX.md`, `sprint(N)` commit subjects, `sprint:` stamps under `docs/work`.
Composition: 2 members, sizes S/M, serial T1 then T2, no epic, no stream. Status move at `115f4258`.
Baseline gate: off-host `gate-remote.ts` on `5ad18c48`: `QA-CHECK: 223 pass, 0 fail` (rc 0); `bun test: 621 pass, 0 fail` (rc 0). The commits since are the status move, the stamps and this sprint's files.
Not yet signed: G1 is signed for both members and G2 for T1 in the coordinator's session; T2's G2 follows T1 (D6). `gates_signed` is omitted until both are signed and relayed verbatim.
builder-check · T1 · 3 contradictions · 3 questions · all factual: the log path is the logs/ file, the preamble drops the stale distance too, the new test path is exempt from test -e, TD-084/175 are confirmed deleted; none to owner
consequence · T1 · behaviour:low · governance:low

### 2026-11-15 | gates | G1 signed for T1 and T2, G2 signed for T1 only
- Owner popup, verbatim. G1: "Scope confirmed". G2 for T1: "Sign G2 for T1".
- G2 for T2 is signed after T1 lands, on the fixed Done-when (D6). `gates_signed` stays out of the frontmatter until both are signed.
- The T1 design record and builder-check settlements are in the coordinator scratchpad (s177-t1-design.md).

### 2026-11-15 | scope-change | T1 edits TASK-367's frozen Done-when (preamble, box (a), box (d))
- **What broke:** TASK-367's `## Done when`, frozen at plan_commit 0ba7c901, still carries stale text. Its preamble cites the gate call by a line number and a distance (`:589`, "144 lines below") that no longer hold. Box (a) says "a flag or an env var", but the owner ruled the `--detached` flag on 2026-11-14 ("set inline, never exported"). Box (d) does not record whether its fixtures are TypeScript or `.sh`.
- **Impact:** exactly three edits to TASK-367's Done-when, all made by T1 (TASK-665).
  - The preamble cites the gate call by symbol, with no line number or distance.
  - Box (a) names the `--detached` flag, set inline on the one pre-flight gate call and never exported.
  - Box (d) names a Bun TypeScript test (sprint D3).
  - No scope widens, and no other box changes.
- **Re-confirm G2:** for T2, on the fixed text, before T2 builds (D6).
