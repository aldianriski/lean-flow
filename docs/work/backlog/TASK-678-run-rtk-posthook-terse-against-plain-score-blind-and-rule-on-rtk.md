---
id: TASK-678
title: "Run RTK posthook + terse x2 (ABBA with its own plain pair), score blind, and rule on RTK"
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

- [ ] The full RTK edition (the newest stable, non-prerelease release at least 14 days old that has pipelines, checksum verified, version and age recorded; BUSL-1.1 noted) is installed in a separate folder and called by absolute path; the OSS v1.1.0 install is untouched.
- [ ] A PATH override scoped to the RTK runs only makes bare `rtk` resolve to the full edition, and `rtk --version` and `rtk init --show` are printed in-run.
- [ ] `rtk init` (project, no -g) registers the posthook and terse hooks with `extends = ["rtk:terse", "rtk:posthook"]` plus an `[override]` that turns on posthook's own `strip-line-numbers` and `json-reads` rules; Read and Grep outputs are shown compressed in the run log, and at least one `rtk recall` returns the full output of a cut result.
- [ ] The runs go plain, RTK, RTK, plain, each a fresh `claude -p` with the same model and isolation flags as 677, the snapshot reset to baseline before each, using only the budget TASK-677 left; RTK is compared against this task's own 2 plain runs, not 677's.
- [ ] The RTK arm's allowlist admits rewritten read-only `rtk <cmd>` calls, one mutating command is shown denied, and permission denials are logged per run.
- [ ] The 24 answers (6 questions x 4 runs) are scored blind by a fresh Sonnet under run labels; the results are appended to docs/research/graphify-rtk-retest-results.md.
- [ ] `docs/research/rtk-trial-verdict.md` states the RTK verdict against the bar: keep only if correctness equals plain on the key, mean total USD is below plain's mean, Read/Grep output is shown compressed with `rtk recall` working, and no information is lost.
- [ ] Read-through of the note: every figure traces to the results file.
- [ ] The snapshot's HEAD and `git status --porcelain --ignored` equal the baseline, RTK project files are removed, no global hook was added (`rtk init -g` never run), the throwaway probe is deleted (it is retired here) and D:\Project\workdoo is untouched.
- [ ] Negative: if the remaining budget cannot cover all 4 runs, or the cap is hit mid-set, the remaining runs do not start, the note records the arm as inconclusive, and no verdict is extrapolated.
- [ ] Negative: a USD gap smaller than the spread between RTK's own two runs is written as inconclusive, never as keep or drop.
- [ ] Negative: no skill, hook, manifest or README is changed by this task, and RTK stays maintainer-environment only.

## Touches

D:\Research\workdoo (temporary files, reverted); a separate RTK folder outside the repo; docs/research/rtk-trial-verdict.md; docs/research/graphify-rtk-retest-results.md; the throwaway probe (deleted). If `rtk init` has no project mode, stop and ask; never use -g.

## Assumes

- The pipeline engine exists in a stable release at least 14 days old (else the arm reports "not run" with the reason).
- Run order is ABBA (plain, RTK, RTK, plain), so order effects cancel; TASK-677's plain runs are not used.

## Tracker

Owner popups 2026-11-20 (Test pipelines too, posthook + terse, Enable built-in rules, Own ABBA, RTK bar, RTK release, Split, Budget); Codex review FAIR RE-TEST (RTK).

amended 2026-11-20 after blind draft check (Fable + Codex), owner approve
