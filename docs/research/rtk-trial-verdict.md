---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: Question revisited, or a later sprint of similar size and shape gives a cleaner USD-per-box comparison
status: current
id: rtk-trial-verdict
tags: [tooling]
domain: knowledge
related: [graphify-workdoo-test, model-effort-trial-verdict]
---

# Research — Does RTK cut USD per box on a real sprint?

> **Question.** With RTK compressing Bash output for one sprint, is that sprint's USD per box below the lowest, or above the highest, of the three sprints before it?
> **Verdict (confirmed by the coordinator under the owner's band rule).** **Inconclusive on RTK OSS's effect on sprint cost.** SPRINT-181 cost 0.686 USD per box, inside the 0.474 to 2.023 band of SPRINT-178 to SPRINT-180. Global counters show estimated command-output compression, but neither sprint-specific savings nor net USD savings were established. Pipeline benefits (the README's cost claims) were not tested: they need the full edition. The bypass rule held. RTK stays maintainer-environment only; nothing ships. A pipeline test was ordered on 2026-11-20. — TASK-674, SPRINT-181; reworded after a Codex review.

## Why this matters
EPIC-026 asks whether RTK is worth keeping. A wrong keep adds a hook and a binary to a workflow that already works. A wrong drop throws away a saving that may be real.

## Options considered
- **Keep** — USD per box below the lowest of SPRINT-178, 179 and 180. *Trade-off:* needs a clear drop in cost.
- **Drop** — above the highest. *Trade-off:* needs a clear rise.
- **Inconclusive** — between the two, or the bypass failed, or the workload is confounded.

The owner chose this band rule on 2026-11-20 ("Band vs baselines (Recommended)").

## Findings
- **Method (direction, not proof).** A throwaway probe read every assistant turn in this project's transcripts, the main threads and every subagent transcript, deduped by message id. It priced each turn as tokens times the USD per million tokens that `scripts/session-cost.ts` fits from the harness cost rows. `session-cost.ts` itself was not changed.
- **Window.** Start is the main-thread Skill call that ran `promote` for that sprint. End is the sprint's last `sprint(NNN) Tn` commit, so close work is left out. SPRINT-178, 179 and 180 use the same rule. All four promote calls were found in the transcripts.
- **Fitted prices (USD per MTok, read / write / output).** Opus 5.5 0.20 / 8.15 / 19.92 · Sonnet 5.5 0.11 / 2.68 / 7.58 · Opus 5.5 1M 0.18 / 7.80 / 25.26 · Fable 5.2 0.25 / 9.95 / 39.00. This session has no cost row yet; prices from the other sessions apply.

| Sprint | Window start to end (UTC) | Turns | Tokens (read / write / out) | USD | Boxes | USD per box |
|---|---|---|---|---|---|---|
| 178 | 2026-11-16 02:50:40 to 03:34:28 | 171 | 41.26M / 0.58M / 0.11M | 11.85 | 18 | 0.659 |
| 179 | 2026-11-16 05:06:20 to 05:55:01 | 103 | 16.03M / 0.49M / 0.10M | 8.06 | 17 | 0.474 |
| 180 | 2026-11-16 07:26:12 to 10:19:05 | 214 | 50.42M / 1.01M / 0.24M | 20.23 | 10 | 2.023 |
| 181 (RTK on) | 2026-11-20 01:03:04 to 01:40:09 | 189 | 29.58M / 0.93M / 0.17M | 10.29 | 15 | 0.686 |
| 181 without T2 | same | 166 | not split | 9.56 | 15 | 0.638 |

- **Boxes** are the `## Done when` boxes of the members built in each window: 178 = 7 + 6 + 5, 179 = 17, 180 = 10, 181 = 9 + 6 (TASK-671 and TASK-673; TASK-674 is the verdict, so it is not counted).
- **Without T2.** The four graphify dispatches were matched by the `description` in each subagent's `.meta.json`: "T2 key worker: questions", "T2 arm A: Explore only", "T2 arm B: Explore + graphify", "T2 blind scorer". They hold 23 turns and 0.73 USD. This is a sensitivity figure only: it drops the work's cost but keeps its boxes, so it is not a comparable sprint without that work.
- **SPRINT-180 caveats.** 42 Haiku turns (about 2.1M cache-read tokens) have no fitted price and are left out; they add well under 0.5 USD. Its promote call came about an hour before its first sprint commit, which may add idle time.
- **Band ruling.** Lowest baseline 0.474, highest 2.023. SPRINT-181 at 0.686 (0.638 without T2) is neither below 0.474 nor above 2.023, so the rule gives inconclusive. The workloads also differ: sprint size runs from 10 to 18 boxes, SPRINT-180 ran many eval rounds, and SPRINT-181 carried the graphify test. That is a confound under the owner's rule, and it points to the same answer.
- **`rtk gain` (secondary signal, global scope, 2026-11-20).** 173 commands, 50.5K input tokens, 31.7K output tokens, 18.8K saved (37.2%). The biggest savings were `rtk ls` listings (94%, 88%, 81%). These are global counters, not this sprint's savings, and they are estimates (bytes ÷ 4); they cannot be set against the window's cache reads, which have a different scope and basis.
- **BUSL-1.1 text.** In `rtk-ai/rtk`, `engine/LICENSE` and `proxy/LICENSE` are BUSL-1.1 (Licensor RTK AI Labs). The Additional Use Grant allows production use without charge, but not offering the work to third parties as a paid or hosted product. Change Date 2030-09-09, then Apache-2.0. The installed rtk-oss v1.1.0 is Apache-2.0 only and has no BUSL text, which is the owner's promote ruling that BUSL does not apply.
- **Bypass record.** The promote entry in the SPRINT-181 Log proved the rule on real input: `git diff --cached` came back raw, and the baseline gate output came back raw. Every later Log entry (g2, scope-change, T1, T2) logs no bypass failure. The one logged truncation is the promote scan's `ls` of `docs/work/backlog`, `docs/sprint/archive` and `docs/epic`; `ls` is outside the bypass rule, so it is not a failure. A scan of this session's transcripts for truncation markers found hits only on `ls`, `head`, `tail`, `sed` and `wc` calls and on reads of the Log text itself; none on `git diff --cached`, `git -C` or gate output. The rule held throughout.

## Recommendation
**Inconclusive.** The cost figure does not separate RTK from the baselines, and the workloads differ too much to say more. RTK stays maintainer-environment only: project-scoped, no global hook, nothing added to the plugin or its consumers. Re-measure only if a later sprint of 15 to 18 boxes and a plain workload gives a cleaner comparison.

## Out of scope / open questions
- A paired run (matched tasks, RTK on and off) would improve attribution, not prove it: repetition and spread still matter, and boxes are not standard units of work. It was not run.
- The README's cost claims sit in pipelines (compress Read/Grep, hand big reads to a cheaper model; one pipeline reports −20.2% total cost in its author's benchmark). They need the full edition and were not tested. The owner ordered a pipeline test on 2026-11-20.
- The 37.2% from `rtk gain` is output compression, not cost; the RTK README's own caveat (90% less output is not 90% less cost) is the prior.
