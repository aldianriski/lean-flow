---
id: TASK-678
title: "Run RTK posthook + terse x2 against the plain runs, score blind, and rule on RTK"
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

# TASK-678 — Run RTK posthook + terse x2 against the plain runs, score blind, and rule on RTK

## Why

The earlier RTK trial used the OSS edition, which has no pipeline engine, and an inconclusive per-box figure; the README's cost claims sit in pipelines (compress Read/Grep output, make the agent write less). The comparison reuses TASK-677's plain runs on the same frozen snapshot.

## Done when

- [ ] The full RTK edition (newest release at least 14 days old that has pipelines, checksum verified, version and age recorded; BUSL-1.1 noted) is installed in a separate folder and called by absolute path; the OSS v1.1.0 install is untouched.
- [ ] `rtk init` (project, no -g) registers the posthook and terse hooks with `extends = ["rtk:terse", "rtk:posthook"]`; Read and Grep outputs are shown compressed in the run log, and at least one `rtk recall` returns the full output of a cut result.
- [ ] RTK runs twice, each a fresh `claude -p` with the same allowlist and model as the plain runs, the snapshot reset to baseline before each, using only the budget TASK-677 left.
- [ ] The 12 RTK answers (6 questions x 2 runs) are scored blind by a fresh Sonnet together with 677's plain answers under run labels; the results are appended to docs/research/graphify-rtk-retest-results.md.
- [ ] `docs/research/rtk-trial-verdict.md` states the RTK verdict against the bar: keep only if correctness equals plain on the key, mean total USD is below plain's mean, Read/Grep output is shown compressed with `rtk recall` working, and no information is lost.
- [ ] Read-through of the note: every figure traces to the results file.
- [ ] The snapshot's HEAD and `git status --porcelain --ignored` equal the baseline, RTK project files are removed, no global hook was added (`rtk init -g` never run), the throwaway probe is deleted and D:\Project\workdoo is untouched.
- [ ] Negative: if the remaining budget cannot cover both RTK runs, no RTK run starts, the note records the arm as inconclusive, and no verdict is extrapolated.
- [ ] Negative: a USD gap smaller than the spread between RTK's own two runs is written as inconclusive, never as keep or drop.
- [ ] Negative: no skill, hook, manifest or README is changed by this task, and RTK stays maintainer-environment only.

## Touches

D:\Research\workdoo (temporary files, reverted); a separate RTK folder outside the repo; docs/research/rtk-trial-verdict.md; docs/research/graphify-rtk-retest-results.md; the throwaway probe (deleted). If `rtk init` has no project mode, stop and ask; never use -g.

## Assumes

- The pipeline engine exists in a release at least 14 days old (else the arm reports "not run" with the reason).
- The RTK runs happen after the plain runs, so they are not interleaved; the note states this limit and uses the spread to judge it.

## Tracker

Owner popups 2026-11-20 (Test pipelines too, posthook + terse, RTK bar, RTK release, Split, Budget); Codex review FAIR RE-TEST (RTK).
