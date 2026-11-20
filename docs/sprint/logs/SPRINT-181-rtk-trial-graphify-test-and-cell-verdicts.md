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
