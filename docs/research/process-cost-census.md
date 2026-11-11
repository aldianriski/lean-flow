---
owner: Maintainer
last_updated: 2026-11-11
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
id: process-cost-census
tags: [process, tooling]
domain: governance
related: [ADR-053]
---

# Research — Which process checks and record steps can be cut or merged?

> **Question.** Which lean-flow gate checks and skill record steps can be cut or merged without losing a check that has caught a real defect?
> **Verdict.** pending T4

## Why this matters

[EPIC-025 D4](../epic/EPIC-025-half-the-bookkeeping.md) sets half-cost targets from SPRINT-171. A baseline distorted by one trial could reward bookkeeping cuts that do not hold across sprints.

## Options considered

- **A — Keep SPRINT-171** — retain the stated comparator. Its recorded close-time gate ran before every member reached `done/`, contrary to T1's approved timing rule.
- **B — Use per-metric medians** — reduce one sprint's influence. SPRINT-169 has only one member, and the FAIL median needs an explicit ruling on SPRINT-171's timing.

## Findings

The commit census reconciles for all three sprints. SPRINT-169 exceeds the one-third difference trigger, so the baseline is the per-metric median of the three sprints, by owner ruling (below). SPRINT-171's close-time 12 counts as its first run under that ruling. No check or record step is ruled on by T1.

## Baseline

Measured 2026-11-11 in branch `s172-t1`, HEAD `590c29dec750733d8b1aaf8c2ac8a5ccd4ae6e46` (`git rev-parse HEAD`). Commands below run in PowerShell from the repository root; no helper file is needed.
Ranges include the plan commit. Work subjects match `^sprint\(N\) T[0-9]+:|^fix\(`, case-sensitively; every other subject is non-work. Ratios and differences use exact counts before display rounding.

| Sprint | plan_commit | close_commit | Members | Total | Work | Non-work | Non-work/member | First-run close-gate FAILs |
|---|---|---|---:|---:|---:|---:|---:|---|
| 169 | e5219eef | 121b89a8 | 1 | 13 | 1 | 12 | 12.0 | 1 |
| 170 | 25fa20ac | ed530d27 | 7 | 48 | 10 | 38 | 5.4 | 3 |
| 171 | 18148168 | ea460465 | 7 | 59 | 16 | 43 | 6.1 | unknown under the approved timing rule; observed close-time reading 12 |

### Source reads and count commands

Choose one assignment below, then run the common block. `Get-Content` prints the actual frontmatter, including both range endpoints; the Members block is printed for inspection and counted separately. No non-task member rows occur. SPRINT-169 is **not directly comparable** to EPIC-025's outcome, which requires at least five members.

```powershell
$file, $range, $pattern = 'docs/sprint/archive/SPRINT-169-jev-as-a-cheap-ab-judge.md', 'e5219eef^..121b89a8', '^sprint\(169\) T[0-9]+:|^fix\('
$file, $range, $pattern = 'docs/sprint/archive/SPRINT-170-agent-roles-rows-4b-to-9.md', '25fa20ac^..ed530d27', '^sprint\(170\) T[0-9]+:|^fix\('
$file, $range, $pattern = 'docs/sprint/archive/SPRINT-171-finish-epic-024.md', '18148168^..ea460465', '^sprint\(171\) T[0-9]+:|^fix\('
```
```powershell
Get-Content -Encoding UTF8 $file | Select-Object -First 12
$members = [regex]::Match((Get-Content -Raw -Encoding UTF8 $file), '(?ms)^## Members\r?\n(.*?)(?=^## )').Groups[1].Value
$members
$m = @($members -split '\r?\n' | Where-Object { $_ -cmatch '^- docs/work/[^/]+/TASK-[0-9]+-.+\.md$' }).Count
$subjects = @(git log --format=%s $range)
$work = @($subjects | Where-Object { $_ -cmatch $pattern }).Count
$nonWork = @($subjects | Where-Object { $_ -cnotmatch $pattern }).Count
$grepWork = @(git log -E "--grep=$pattern" --format=%h $range).Count
[pscustomobject]@{Members=$m;Total=$subjects.Count;Work=$work;NonWork=$nonWork;GrepWork=$grepWork;Sum=$work+$nonWork;PerMember=('{0:F1}' -f ($nonWork/$m))}
```

Outputs, in sprint order: `1 / 13 / 1 / 12 / 1 / 13 / 12.0`; `7 / 48 / 10 / 38 / 10 / 48 / 5.4`; `7 / 59 / 16 / 43 / 16 / 59 / 6.1` (Members / Total / Work / NonWork / GrepWork / Sum / PerMember).
Cross-checks PASS: `1 + 12 = 13`, `10 + 38 = 48`, `16 + 43 = 59`; git's own ERE selection returns `1, 10, 16`, equal to the post-filtered work counts. Both selections use identical pattern text.

### Close-gate evidence and the SPRINT-171 mismatch

The approved timing rule selects the first close-time system-verify or gate entry on the integrated tree after the last member reached `done/`. Trial, replay and control results are excluded. Read these excerpts alongside the tree queries:

```powershell
Get-Content -Encoding UTF8 docs/sprint/archive/logs/SPRINT-169-jev-as-a-cheap-ab-judge.md | Select-Object -Skip 56 -First 22
Get-Content -Encoding UTF8 docs/sprint/archive/logs/SPRINT-170-agent-roles-rows-4b-to-9.md | Select-Object -Skip 552
Get-Content -Encoding UTF8 docs/sprint/archive/logs/SPRINT-171-finish-epic-024.md | Select-Object -Skip 215
git ls-tree -r --name-only 05c9fcbe -- docs/work/done | Select-String '/TASK-628-'
git ls-tree -r --name-only 67d3e5cd -- docs/work/done | Select-String '/TASK-(632|638|633|634|635|636|637)-'
git ls-tree -r --name-only da6c4dbd -- docs/work | Select-String '/TASK-(640|642|644|645|643|641|646)-'
git ls-tree -r --name-only 8a695d27 -- docs/work | Select-String '/TASK-644-'
git log --format='%h %s' --name-status '18148168^..ea460465' -- 'docs/work/*/TASK-644-*'
```

- **169:** the 2026-11-08 `surprise` entry names `05c9fcbe`, `QA-CHECK: 495 pass, 1 fail`. The sole member is in `done/` at that tree. The later `ceca166b` rerun is 496/0; `--close` is 4/0. First-run FAILs: **1**, a consequence-vocabulary record error.
- **170:** the 2026-11-10 `close-time record fixes` entry names `67d3e5cd`, qa-check **491 pass, 3 fail**; all seven members are in `done/`. The later `c4a4a7a0` rerun is 493/0. The earlier 299/1 at log line 553 belongs to T6's control/seed trial and is excluded.
- **171:** log line 217 states `da6c4dbd`, **504 pass, 12 fail**. Its tree contains six members in `done/` and TASK-644 in `review/`. TASK-644 is still in `review/` at the final system-verify tree `8a695d27` (509/1); its move to `done/` is `1a157d41`, after both runs.
- The 171 close entry reports all seven in `done/` and `check-sprint-by-reference --close` **16 pass, 0 fail**, but no system-verify after that move. This narrower check does not establish the full close-gate metric. The approved post-`done/` FAIL count is **unknown**, not zero; selecting a different timing or gate scope requires a ruling.

**Negative check:** 171's **59 total / 43 non-work** reproduce exactly, and **12 FAILs** reproduce as a logged close-time observation. The mismatch is eligibility: that run fails the approved post-`done/` condition. Neither the original 12 nor the missing qualifying result is silently replaced.

### Differences and PROPOSAL

Difference is `100 * abs(x - x171) / x171`; compare the unrounded fraction with `1/3`. The FAIL percentages below use the observed 12 **conditionally**, not an approved replacement for `unknown`.

| Sprint | Non-work/member difference from 171 | Above one third? | FAIL difference if 12 is accepted | Above one third? |
|---|---:|---|---:|---|
| 169 | 95.35% | yes | 91.67% | yes, conditional |
| 170 | 11.63% | no | 75.00% | yes, conditional |
| 171 | 0.00% | no | 0.00% | no, conditional |

```powershell
100 * [math]::Abs(12/1 - 43/7) / (43/7) # 95.3488372093023
100 * [math]::Abs(38/7 - 43/7) / (43/7) # 11.6279069767442
100 * [math]::Abs(1 - 12) / 12 # 91.6666666666667, conditional
100 * [math]::Abs(3 - 12) / 12 # 75, conditional
$medianWork = ((12/1), (38/7), (43/7) | Sort-Object)[1]
$medianWork # 6.14285714285714 = 43/7
$medianWork / 2 # 3.07142857142857 = 43/14
$medianFails = (1, 3, 12 | Sort-Object)[1] # conditional on accepting the observed 12
$medianFails # 3
$medianFails / 2 # 1.5
```

**PROPOSAL, not a ruling:** adopt the per-metric medians: **43/7 non-work commits/member** (6.1 displayed), half-target **43/14** (about 3.0714); and, only if the owner accepts 171's pre-`done/` close-time observation, **3 FAILs**, half-target **1.5 FAILs** (an integer result must be at most 1). Without that exception the three-sprint FAIL median remains unknown.
**Owner ruling, 2026-11-11, by popup, verbatim:** "Median of three (Recommended)". The option read: "D4 as frozen: the median of each measure across the three sprints. Non-work 6.1 per member gives a target of at most 3.1, and FAILs 3 gives at most 1. Stricter on FAILs; SPRINT-171's run counts as its first close run."
So the baseline is **43/7 non-work commits per member** (target: at most 43/14, about 3.07, per member) and **3 first-run close-gate FAILs** (target: at most 1). SPRINT-171's close-time 12 counts as its first run, with the timing exception visible above; SPRINT-169 stays in with its one-member warning.

## Recommendation

For T1, option B, ruled by the owner: per-metric medians, with SPRINT-171's recorded close-time 12 accepted although TASK-644 still awaited its Retro evidence. The document-level keep/merge/cut recommendation remains pending T4.

## Out of scope / open questions

- Gate inventory, defect classification and skill-record rulings belong to TASK-648, TASK-649 and TASK-650. The coordinator owns index regeneration, review and the full gate after commit.
