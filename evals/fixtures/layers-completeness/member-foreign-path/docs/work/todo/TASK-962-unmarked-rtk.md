---
id: TASK-962
sprint: SPRINT-926
---
<!-- docs/work/done/TASK-678-run-rtk-posthook-terse-against-plain-score-blind-and-rule-on-rtk.md, box 3 verbatim, unmarked control. -->

## Done when

- [x] The v1.1.0 surface is set up project-scoped: a trusted `.rtk/pipeline.toml` with `extends = ["rtk:terse", "rtk:posthook"]` plus an `[override]` turning on `strip-line-numbers` and `json-reads` (resolved by `rtk pipeline show`), `rtk init` in project mode (no -g), and the PreToolUse Bash rewrite hook wired into the snapshot's project settings; Read/Grep compression is recorded as untestable in v1.1.0 (no Claude Code PostToolUse processor), Bash rewrites are shown in the run log, and at least one `rtk recall` returns the full output of a cut Bash result. (scope-change 2026-11-20, owner: Test what v1.1.0 supports) ✓ trusted .rtk/pipeline.toml (terse+posthook, strip-line-numbers and json-reads overridden on; rtk pipeline show resolved), rtk init project mode, PreToolUse Bash hook in the snapshot's project settings; Read/Grep compression recorded untestable (no PostToolUse processor); Bash rewrites in the logs (rtk-1: 1, rtk-2: 3); rtk recall returned the 5 hidden lines of a cut rtk ls in rtk-cap
