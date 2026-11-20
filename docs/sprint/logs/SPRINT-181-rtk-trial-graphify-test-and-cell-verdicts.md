---
sprint: 181
slug: rtk-trial-graphify-test-and-cell-verdicts
owner: Maintainer
last_updated: 2026-11-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-181 — Execution Log

> Append-only companion to [`../SPRINT-181-rtk-trial-graphify-test-and-cell-verdicts.md`](../SPRINT-181-rtk-trial-graphify-test-and-cell-verdicts.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-20 | promote | plan locked, 3 members: TASK-671, TASK-673, TASK-674 (3 plan steps)
Owner rulings, verbatim. Round 1: "One sprint, RTK on (Recommended)" · "workdoo snapshot (Recommended)" · "More correct, same cost (Recommended)" · "Ship in lean-flow". Round 2: "In sprint, last member (Recommended)" · "Next sprint, if kept (Recommended)" · "approve". After the hook was blocked: "continue, add i use manual mode and will approve" (it covers wiring the project-scoped hook and continuing, not the checklist, G1 or G2). Promote popups: "Keep, census via tools (Recommended)" (RTK stays on unchanged; see the trial rule below) · "Sign, write it" (the governance checklist and the sprint draft, with dispatch trial not extended, L-255 and L-293 retained, and the BUSL point recorded as not applicable).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign, write it".
- ☑ L-promotion: two candidates with count 2 and `promoted: no`, L-255 and L-293 (a line-anchored regex over the file and a structural parse of 306 entries agree). Disposition for both: retain. L-255 is already covered by L-246, L-007 and CLAUDE.md's must-FAIL rule, and T2 here is its next exercise. L-293 needs a rule in an always-loaded doc, and CONTEXT is at its cap; a third sighting would justify a promotion that leaves room.
- ☑ TD aging: 121 open rows (77 low, 24 minor, 13 medium, 7 trivial, none high); a row parse and a pattern count agree. 120 are aged three sprints or more against 181 (TD-316 crosses at this promote); TD-317, filed at 180, is the only younger row. Nothing escalates. Disposition: keep all open, no re-review sweep. TD-316 means a local `bun test` reads red on Windows, so the off-host gate is the verdict.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 103 PASS, 0 FAIL, 0 WARN (4 retained, 1 FROZEN, 16 skips). CHANGELOG rotation not due (v2.25.0 and v2.24.0 inline). Task-file prune: none eligible; 122 done and cancel files scanned against tracked `.md` citations, and a `git grep` on TASK-666, 667, 669, 670 and 671 agrees. Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, token budget ~12680 of 12691; T1 edits CONTEXT and dispatch.md and must not add net tokens.
- ☑ epic rollup currency: EPIC-025 (rows for SPRINT-172 and SPRINT-173 carry their `close_commit`) and EPIC-026 (row for SPRINT-178 carries `dfd668f7`); neither header predates its newest member close. None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. EPIC-026 had 3 open conditions, all `→ next slice`; after D8 they read `→ TASK-674`, `→ TASK-673` and `→ TASK-674`. 0 uncovered, no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent).
- ☑ handoff ledger: none live; the latest entry for the one path is `spent`.
Sprint number: 181, the maximum in use plus one. Re-derived with the Glob tool (only SPRINT-180 files exist under `docs/sprint/`) and the INDEX lines (newest SPRINT-180); `.claude/worktrees/` absent in lean-flow.
Composition: 3 members, sizes S, M and S, epic EPIC-026, no stream. Wave 1: T1 (TASK-671) and T2 (TASK-673). Wave 2: T3 (TASK-674), last by owner ruling, `Depends-on: T1, T2`, its RTK window holds both. Dispatch trial NOT extended to this sprint; TASK-671 rules on SPRINT-180's record. TASK-675 stays in the backlog, `blocked` on a TASK-673 keep. Commits: filing `c1ad28c1`, epic D8 and the INDEX row `9a36dbcf`, status move `03ed87bb`.
EPIC-026 D8 (owner popups 2026-11-20) moves the graphify test to a standalone test on the `D:\Research\workdoo` snapshot and lifts the D1 and D7 timing gate (workdoo SPRINT-005 is closed).
Baseline gate (off-host, run on HEAD `c1ad28c1`):
```
gate-remote: ran c1ad28c1fc662adfdbcfd4614327f3e61332b0d2
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 225 pass, 0 fail (rc 0)
exit 0
```
RTK trial rule (owner, "Keep, census via tools"): RTK stays on unchanged so the measurement is clean. Any count, id derivation or existence check uses the Glob or Grep tools or `rtk bypass`, never a compressed Bash listing. Each truncation is logged and a real miss counts against RTK.
RTK setup evidence (recorded for TASK-674's first Done-when box, which is not ticked here):
- rtk-oss v1.1.0, the Apache-2.0-only edition. The BUSL-1.1 engine and proxy are not installed, and the installed edition's `D:\tools\rtk\LICENSE` is Apache-2.0 only with no "Business Source" text (grep count 0), so the BUSL point is not applicable. It is the newest stable release at least 14 days old (v1.2.1 was 1 day old). sha256 `9b076379be9d86011ca3f3a0264d0be4851da5535453a47f67fa46b4e893fbb2` matched the release `checksums.txt`.
- Binary at `D:\tools\rtk\rtk.exe`, with a copy on PATH at `~/.local/bin/rtk.exe`.
- Hook: project-scoped, in the gitignored `.claude/settings.local.json`, PreToolUse matcher Bash running `D:/tools/rtk/rtk.exe hook claude`. No `rtk init -g`, no global hook. In v1.1.0 a local `rtk init` (no `-g`) installs no hook; it only injects instructions into CLAUDE.md, and `--hook-only` warns it only makes sense with `--global`, so the hook was wired by hand.
- Bypass rule: RTK config `C:\Users\HYPE AMD\AppData\Roaming\rtk\config.toml`, `[hooks] exclude_commands = ["git diff --cached", "git -C"]`. `rtk hook check` showed no rewrite for `git diff --cached` (with or without `--stat` or a path, and chained after `cd` or `&&`), for `git -C …`, for `sh scripts/qa-check.sh`, for `QA_FULL=1 … | tail`, for `bun scripts/promote-check.ts` and for `bun --no-env-file scripts/gate-remote.ts`. Proven live: `git add <3 task files> && git diff --cached | head` printed RTK's compressed "ok 3 files changed" for the add and a raw `diff --git a/… new file mode …` for the diff. A live `git status` came back compressed, which shows the hook fires. The baseline gate above is the live proof for gate-verdict output.
- Permissions: `rtk rewrite` exits 0 (auto-allow) only when the project allow list already covers the command (`git commit`, `git status`, `ls`); `curl` exited 3 and the hook emitted no permission decision; `rm -rf` was not rewritten.
- First truncation observed, during this scan: `ls` of `docs/work/backlog`, `docs/sprint/archive` and `docs/epic` came back cut ("... (133 more)", "[+135 hidden: rtk recall …]"). `ls` is outside the bypass rule, so no bypass failure is counted; the listings were re-derived with Glob and Grep. Logged per the trial rule.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:low · governance:low

### 2026-11-20 | g2 | G1 and G2 signed for T1 to T3 (owner popup, "Sign G1+G2")
G1: all three members are `origin: decomposer`; scope unchanged since the 2026-11-20 approve (fast-path confirm). G2: the coordinator's design record, amended after the builder check, with the owner's three answers applied verbatim:
- TASK-674 maintainer-environment box → "Reword (Recommended)" (scope-change below).
- T1 cells → "Revert; kept = opt-in (Recommended)": inconclusive cells revert to default routing (strongest tier back to manual-only), recorded as inconclusive; the kept intake draft check stays opt-in per host, not a consumer default.
- T3 RTK rule → "Band vs baselines (Recommended)": keep if USD per box is below the lowest of SPRINT-178/179/180 (same window method), drop if above the highest, inconclusive between; the bypass must have held, and a confounded workload means inconclusive.
Design, per task:
- T1: one worker (one agent id) is one dispatch, its cost the cumulative reported total across resumes and retries, as the baselines were taken. Drop intake 1.45×, promote 1.40×, close 1.34× (over 1.25×). Inconclusive (n=1): builder-check reader 1.06×, test runner 1.16×, G2 design check, review. Never fired: repo fetch, diagnose escalation (default, never kept). Keep: intake draft check, 2 of 2 blind pairs met (1.006×, 1.09×; SPRINT-180 Log rows 3/4 and 6/7). CONTEXT's `dispatch-trial:` line is replaced by one shorter line for the kept cell (net tokens ≤ 0); dispatch.md § Trial cells keeps the kept cell only, trial wording removed; ADR-010 addendum; verdict note `docs/research/model-effort-trial-verdict.md`; a CHANGELOG `[Unreleased]` line (A2: `CHANGELOG.md` added to T1's Layers, corrected on the Plan line in this commit). A Sonnet worker computes, the coordinator rules.
- T2: key worker writes 6 questions (2 where, 2 calls/depends, 2 what-breaks) with a key, coordinator verifies each key answer against the code, then arm A (fresh Explore, sonnet) before any graph exists, then `~/.local/bin/graphify update D:\Research\workdoo` (code-only, no LLM; stop if it refuses), then arm B (same, told to read graphify-out first), then a blind scorer (X/Y order recorded). Token unit: harness-reported subagent_tokens per Explore dispatch, build tokens added to B. Revert checked with `git status --porcelain --ignored` + HEAD + a `~/.graphify/` before/after. Confound = an arm errors, skips a question or reads outside the snapshot. The coordinator launches every arm (L-293) and records each agent id here.
- T3: per-turn timestamps in this project's transcripts (main + subagents), promote call to the last commit before T3's first commit, tokens × session-cost.ts's fitted prices, by a throwaway probe inside the working tree deleted before the report (session-cost.ts unchanged). Boxes = T1 + T2 Done-when boxes. Baselines SPRINT-178/179/180 by the same probe; TASK-613's figures as context. Without T2: subtract the agent ids T2 records. `rtk gain` recorded as a secondary signal. Box 1: the T3 worker reads the BUSL-1.1 text in the rtk repo and records it beside the promote ruling. D5 truncations are logged, not bypass failures; a miss they cause counts against RTK.
A1 confirmed: the three verdict-note slugs stand (`model-effort-trial-verdict`, `graphify-workdoo-questions` + `graphify-workdoo-test`, `rtk-trial-verdict`). A3 confirmed and folded into T2 above.
Run: wave 1 = T1 (Sonnet worker, main tree, its own Layers only) in parallel with T2 (coordinator-orchestrated; D:\Research\workdoo plus its two docs/research files); `docs/knowledge-index.md` is regenerated by the coordinator after each task commit (single owner). Wave 2 = T3.
builder-check · T1 · 2 contradictions · 5 questions · C1 counting rule fixed (one worker = one dispatch, cumulative cost); C2 CONTEXT keeps a short kept-cell line; Q1 pair 2 verified MET in the Log; Q2 no repo-fetch row; Q3 Q4 to owner popup
builder-check · T2 · 3 contradictions · 6 questions · build = graphify update (code-only, no LLM); token unit = subagent_tokens; revert via --ignored status + ~/.graphify diff; key verified by coordinator; mix fixed 2/2/2; confound defined; all factual, none to owner
builder-check · T3 · 7 contradictions · 5 questions · window by per-turn timestamps via throwaway probe; T2 split by recorded agent ids; BUSL text read literally; truncations not bypass failures; maintainer-env box to scope-change; keep threshold to owner popup
### 2026-11-20 | scope-change | T3/TASK-674 box 6 reworded before any work: 'Each verdict says maintainer-environment only' contradicted the owner's 2026-11-20 'Ship in lean-flow' ruling for graphify. New text: the RTK and ponytail verdicts say maintainer-environment only; the graphify verdict, if keep, names TASK-675 and the 2026-11-20 ship ruling. Impact: T3's verdict note only. G2 re-confirmed in the same owner popup (Reword).
