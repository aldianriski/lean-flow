---
id: TASK-678
title: "Run RTK posthook + terse x2 (ABBA with its own plain pair), score blind, and rule on RTK"
sprint: SPRINT-182
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-677]
---

# TASK-678 — Run RTK posthook + terse x2 (ABBA with its own plain pair), score blind, and rule on RTK

## Why

The earlier RTK trial used the OSS edition, which has no pipeline engine, and an inconclusive per-box figure; the README's cost claims sit in pipelines (compress Read/Grep output, make the agent write less). The comparison uses its own 2 plain runs interleaved with the 2 RTK runs (plain, RTK, RTK, plain) on the same frozen snapshot, so 8 runs in total across 677 and 678.

## Done when

- [x] The full RTK edition (the newest stable, non-prerelease release at least 14 days old that has pipelines, checksum verified, version and age recorded; BUSL-1.1 noted) is installed in a separate folder and called by absolute path; the OSS v1.1.0 install is untouched. ✓ full edition v1.1.0 (newest stable non-prerelease >=14 days, 2026-10-25; sha256 c9a8f7a8...a6f matched checksums.txt; BUSL-1.1 in LICENSE-ENGINE) at D:\tools\rtk-full\1.1.0, called by absolute path; OSS v1.1.0 untouched
- [x] A PATH override scoped to the RTK runs only makes bare `rtk` resolve to the full edition, and `rtk --version` and `rtk init --show` are printed in-run. ✓ PATH prefix on the RTK child only; rtk --version (rtk 1.1.0) in-run in rtk-cap and rtk-cap2; rtk init --show in-run in rtk-cap2
- [x] The v1.1.0 surface is set up project-scoped: a trusted `.rtk/pipeline.toml` with `extends = ["rtk:terse", "rtk:posthook"]` plus an `[override]` turning on `strip-line-numbers` and `json-reads` (resolved by `rtk pipeline show`), `rtk init` in project mode (no -g), and the PreToolUse Bash rewrite hook wired into the snapshot's project settings; Read/Grep compression is recorded as untestable in v1.1.0 (no Claude Code PostToolUse processor), Bash rewrites are shown in the run log, and at least one `rtk recall` returns the full output of a cut Bash result. (scope-change 2026-11-20, owner: Test what v1.1.0 supports) ✓ trusted .rtk/pipeline.toml (terse+posthook, strip-line-numbers and json-reads overridden on; rtk pipeline show resolved), rtk init project mode, PreToolUse Bash hook in the snapshot's project settings; Read/Grep compression recorded untestable (no PostToolUse processor); Bash rewrites in the logs (rtk-1: 1, rtk-2: 3); rtk recall returned the 5 hidden lines of a cut rtk ls in rtk-cap
- [x] The runs go plain, RTK, RTK, plain, each a fresh `claude -p` with the same model and isolation flags as 677, the snapshot reset to baseline before each, using only the budget TASK-677 left; RTK is compared against this task's own 2 plain runs, not 677's. ✓ order plain-3, rtk-1, rtk-2, plain-4, fresh claude -p each, same model and isolation flags, snapshot reset before each; RTK compared with these two plain runs
- [x] The RTK arm's allowlist admits rewritten read-only `rtk <cmd>` calls, one mutating command is shown denied, and permission denials are logged per run. ✓ RTK allowlist admits Bash(rtk:*); rtk git add . shown denied in rtk-cap; denials logged per run in the probe stream
- [x] The 24 answers (6 questions x 4 runs) are scored blind by a fresh Sonnet under run labels; the results are appended to docs/research/graphify-rtk-retest-results.md. ✓ 24 answers scored blind by a fresh Sonnet (labels shuffled, tool names redacted): all 6/6; appended to graphify-rtk-retest-results.md T3
- [x] `docs/research/rtk-trial-verdict.md` states the RTK verdict against the bar: keep only if correctness equals plain on the key, mean total USD is below plain's mean, `rtk recall` works on a cut Bash output, and no information is lost (Read/Grep compression untestable in v1.1.0; scope-change 2026-11-20). ✓ rtk-trial-verdict.md re-test verdict: inconclusive (correctness tie; mean USD 1.02x plain, gap 0.005 < RTK spread 0.083; rtk recall works; no information lost)
- [x] Read-through of the note: every figure traces to the results file. ✓ read-through: 12/12, 1.02x, the gap and spread figures in the note trace to the results file T3 section
- [x] The snapshot's HEAD and `git status --porcelain --ignored` equal the baseline, RTK project files are removed, no global hook was added (`rtk init -g` never run), the throwaway probe is deleted (it is retired here) and D:\Project\workdoo is untouched. ✓ after the reverts HEAD 884d897 and --ignored status equal the baseline; .rtk, root CLAUDE.md, .claude/settings.local.json removed; rtk init -g never run, AppData rtk unchanged; retest-probe/ deleted; D:/Project/workdoo untouched
- [x] Negative: if the remaining budget cannot cover all 4 runs, or the cap is hit mid-set, the remaining runs do not start, the note records the arm as inconclusive, and no verdict is extrapolated. ✓ Negative: the pre-flight before plain-3 passed (5.93 USD >= 4 x 0.3171 + scorer); the cap was never hit (3.21 USD total)
- [x] Negative: a USD gap smaller than the spread between RTK's own two runs is written as inconclusive, never as keep or drop. ✓ Negative: USD gap +0.0054 is smaller than RTK's own spread 0.0828, so the verdict is inconclusive, not keep or drop
- [x] Negative: no skill, hook, manifest or README is changed by this task, and RTK stays maintainer-environment only. ✓ Negative: the task touched only docs/research and its task file; no skill, hook, manifest or README changed; RTK stays maintainer-environment only

## Touches

D:\Research\workdoo (temporary files, reverted); a separate RTK folder outside the repo; docs/research/rtk-trial-verdict.md; docs/research/graphify-rtk-retest-results.md; the throwaway probe (deleted). If `rtk init` has no project mode, stop and ask; never use -g.

## Assumes

- The pipeline engine exists in a stable release at least 14 days old (else the arm reports "not run" with the reason).
- Run order is ABBA (plain, RTK, RTK, plain), so order effects cancel; TASK-677's plain runs are not used.

## Tracker

Owner popups 2026-11-20 (Test pipelines too, posthook + terse, Enable built-in rules, Own ABBA, RTK bar, RTK release, Split, Budget); Codex review FAIR RE-TEST (RTK).

amended 2026-11-20 after blind draft check (Fable + Codex), owner approve
