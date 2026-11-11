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
| 169 | e5219eef (`Get-Content -Encoding UTF8 $file \| Select-Object -First 12`) | 121b89a8 (`Get-Content -Encoding UTF8 $file \| Select-Object -First 12`) | 1 (`$m`) | 13 (`$subjects.Count`) | 1 (`$work`) | 12 (`$nonWork`) | 12.0 (`'{0:F1}' -f ($nonWork/$m)`) | 1 (`Get-Content -Encoding UTF8 $log \| Select-Object -Skip 56 -First 22`) |
| 170 | 25fa20ac (`Get-Content -Encoding UTF8 $file \| Select-Object -First 12`) | ed530d27 (`Get-Content -Encoding UTF8 $file \| Select-Object -First 12`) | 7 (`$m`) | 48 (`$subjects.Count`) | 10 (`$work`) | 38 (`$nonWork`) | 5.4 (`'{0:F1}' -f ($nonWork/$m)`) | 3 (`Get-Content -Encoding UTF8 $log \| Select-Object -Skip 552`) |
| 171 | 18148168 (`Get-Content -Encoding UTF8 $file \| Select-Object -First 12`) | ea460465 (`Get-Content -Encoding UTF8 $file \| Select-Object -First 12`) | 7 (`$m`) | 59 (`$subjects.Count`) | 16 (`$work`) | 43 (`$nonWork`) | 6.1 (`'{0:F1}' -f ($nonWork/$m)`) | unknown under the approved timing rule; observed close-time reading 12 (`Get-Content -Encoding UTF8 $log \| Select-Object -Skip 215`) |

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

The timing rule selects the first close-time integrated gate after the last member reached `done/`, excluding trials and controls. Set `$log = $file -replace 'archive/', 'archive/logs/'`; the table names each log-read command. [Full excerpts and tree queries](logs/process-cost-census.md#baseline-evidence-task-647) are in the appendix.
SPRINT-171 has no qualifying full gate after TASK-644 moved from `review/` to `done/`: its post-`done/` **16 pass, 0 fail** is only `--close`, so that metric is **unknown**, not zero. **Re-measure:** 59 total / 43 non-work reproduce exactly; the logged 12 FAILs reproduce but precede that move. The owner accepted that timing exception below.

### Differences and PROPOSAL

Difference is `100 * abs(x - x171) / x171`; compare the unrounded fraction with `1/3`. The FAIL percentages below use the observed 12 **conditionally**, not an approved replacement for `unknown`.

| Sprint | Non-work/member difference from 171 | Above one third? | FAIL difference if 12 is accepted | Above one third? |
|---|---:|---|---:|---|
| 169 | 95.35% | yes | 91.67% | yes, conditional |
| 170 | 11.63% | no | 75.00% | yes, conditional |
| 171 | 0.00% | no | 0.00% | no, conditional |

[Arithmetic commands](logs/process-cost-census.md#baseline-arithmetic) retain the exact percentage and median calculations.


**PROPOSAL, not a ruling:** adopt the per-metric medians: **43/7 non-work commits/member** (6.1 displayed), half-target **43/14** (about 3.0714); and, only if the owner accepts 171's pre-`done/` close-time observation, **3 FAILs**, half-target **1.5 FAILs** (an integer result must be at most 1). Without that exception the three-sprint FAIL median remains unknown.
**Owner ruling, 2026-11-11, by popup, verbatim:** "Median of three (Recommended)". The option read: "D4 as frozen: the median of each measure across the three sprints. Non-work 6.1 per member gives a target of at most 3.1, and FAILs 3 gives at most 1. Stricter on FAILs; SPRINT-171's run counts as its first close run."
So the baseline is **43/7 non-work commits per member** (target: at most 43/14, about 3.07, per member) and **3 first-run close-gate FAILs** (target: at most 1). SPRINT-171's close-time 12 counts as its first run, with the timing exception visible above; SPRINT-169 stays in with its one-member warning.

## Gate check inventory

Pin: `e29815a9ad0cbd660fd80d3d2d9c827c4dd03215`, docs-only after `ec4ee660`; protected source trees are unchanged. **103 rows**: 41 gate blocks and 62 harnesses (52 always-on, 10 opt-in); all 37 headers and 21 checkpoints covered.
**570 observed names**, **620 source expressions / 236 templates** reconcile: **0 unmapped, 0 double-mapped, 0 extra, 0 unseen-not-conditional**. Consumer guards: **23 yes / 80 no**, including the engine and manifest lockstep.
The [measurement appendix](logs/process-cost-census.md#gate-check-inventory) holds all rows, fixtures, consumer evidence, reconciliation commands/results and helper rules. [FAIL history and proposed rulings](logs/process-cost-census.md#fail-history-and-proposed-rulings-task-649) are recorded by T3.

## FAIL history summary

T3 proposes **25 keep / 19 keep (fixture) / 17 keep (unknown) / 21 cut / 8 cut (with) / 6 cut (borderline) / 7 n/a** across 103 rows (61 kept, 35 proposed cuts, 7 without a ruling); 0 merge.
All 23 consumer guards stay. No check is changed.
Fixture rulings follow their checks; pre-SPRINT-045 zero-defect checks stay unknown by the owner's age ruling, including those with embedded logs. The seven n/a rows print no check verdict and carry no ruling.
H01, H02, H22, H45 and H46 are also **cut (borderline, owner rules)**: each is the only proof of a rule shipped skills state, and whether that makes it a consumer guard is for the owner (appendix, coordinator rulings). G1597 is **cut (borderline, owner rules)** for T4: SPRINT-102 claimed 2 ticks against 3 actual in a commit subject, a misstated record line rather than a wrong artifact.
SPRINT-171's consequence-line failure is real: it exposed missing review records and an unreviewed T5 whose review found a dropped screen-out rule.
The [appendix](logs/process-cost-census.md#fail-history-and-proposed-rulings-task-649) holds all row searches, introductions, fixture mapping, cited judgments and the empty negative check. These are judgment ticks; the coordinator reviews every cut before T4's ruling.

## Recommendation

For T1, option B, ruled by the owner: per-metric medians, with SPRINT-171's recorded close-time 12 accepted although TASK-644 still awaited its Retro evidence. The document-level keep/merge/cut recommendation remains pending T4.

## Out of scope / open questions

- Gate inventory, defect classification and skill-record rulings belong to TASK-648, TASK-649 and TASK-650. The coordinator owns index regeneration, review and the full gate after commit.
