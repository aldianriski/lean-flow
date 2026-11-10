---
id: TASK-642
title: "Measure a reproducer helper for /diagnose Phase 2 inside /diagnose, not as a separate role"
type: feature
epic: EPIC-024
sprint: SPRINT-171
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-642 — Measure a reproducer helper for /diagnose Phase 2 inside /diagnose, not as a separate role

## Why
Row 9 passed: both arms reproduced the seeded bug in 2 of 2 runs, the reproducer at 0.039 USD mean against `/diagnose` Phases 1 to 2 at 0.114 (bar 0.086), and the clean-twin control read `reproduced: no`. The trial stopped `/diagnose` after Phase 2 and used one seed with n = 2, so the roughly 69 percent saving is not a saving for an integrated `/diagnose` run. Codex (CHANGE): a Phase-2 helper is a reasonable destination, but verify which `/diagnose` responsibilities remain and measure the marginal saving inside the workflow. The question is whether the helper earns its place inside the skill.

## Done when

- [x] A design note states what the helper takes and returns, which `/diagnose` Phase 1 and 2 duties stay with the skill, and the frozen verdict rule (cost and reproduction, a clean-twin control, at least two seeds). ✓ judgment tick: § Design note (takes, returns, what stays with the skill, the frozen verdict rule with a clean-twin control on 2 seeds), frozen in the Log at `1533e423` before the first paid run (05:02 UTC); written into this file afterwards, a coordinator miss noted in the note
- [x] The helper is run inside a full `/diagnose` pass on the seeds, and the marginal cost and time against the unchanged skill are recorded in EPIC-024 row 9. ✓ four valid full `/diagnose` passes, 2 seeds × 2 arms (kit audit PASS on each); EPIC-024 D19 and row 9 record the marginal cost and time per seed (+0.081 and +0.053 USD, +0.43 and +0.38 min), with a ratio of 1.58× cost and 1.65× time: no-go (`f1348e36`)
- [x] Negative: the helper never edits `src/` (a run that does is void), and `skills/diagnose/` is unchanged on `main` until the owner rules to ship (D5). ✓ the kit helper-write audit gives 0 findings on every H run (a shell write voids only outside `repro/`, 45 controls); `git diff --stat 18148168 main -- skills/diagnose` is empty, and `git log 18148168..main -- agents/ .claude/agents/` has 0 commits; the treatment lives only on `trial/epic-024-row9-inside`

## Touches
`docs/epic/EPIC-024-agent-roles-one-by-one.md`, `docs/work/`; the helper and any `/diagnose` edit live on a trial branch.

## Assumes
- A1: the seed and the twin from TASK-637 are reusable; re-derive that before relying on them.

## Tracker
SPRINT-170 close Retro · TASK-637 § Results · Codex recap review, candidate 5 (CHANGE)

## Design note
Frozen at G2-B (owner popup "Sign all as recommended", logged at `1533e423`, before the first paid run at 05:02 UTC). Written into this file after the runs; the design's M1 asked for it before them, which the coordinator missed.
- **Helper takes:** the bug report text, the repo root, Phase 1's loop shape if any, and the rule "write files only under `repro/`". **Returns**, in at most about 15 lines: the repro command and its exit contract (1 on the symptom, 0 otherwise), the symptom lines (redacted), runs and hits, and a `reproduced: yes|no` line.
- **Stays with `/diagnose`:** Phase 1's judgment, Phase 2's three confirmations (the skill reads the helper's report and re-runs the command once), the redaction rule, and Phases 3 to 6.
- **Treatment:** `agents/reproducer.md` (unchanged from row 9) plus a Phase 2 edit, on `trial/epic-024-row9-inside` only. Owner rulings before any main run: drop "last" from the `reproduced:` line request, and, after probe2 showed the helper not firing, open Phase 2 with "Do not build or run the repro yourself."
- **Verdict rule:** a run is valid if it finished inside its cap and 20 minutes, its repro exits 1 five times on the bug and 0 five times on the twin, the hidden oracle passes, the answer-key audit has 0 hits, and the helper wrote nothing outside `repro/`. Go needs all four main runs valid, both twin controls clean, H cheaper than U on both seeds, mean H cost ≤ 0.75 × U, and mean H time ≤ 1.10 × U. Otherwise no-go or inconclusive.

## Results
**Row 9 inside `/diagnose`: no-go** (2026-11-10, SPRINT-171 T2). The helper fires and reproduces correctly, but on both seeds it makes the full pass dearer and slower.

| Run | Seed | Arm | USD (headless / transcript) | Minutes | Valid |
|---|---|---|---|---|---|
| m1 | 1 (module `/g` regex) | U | 0.112 / 0.090 | 0.65 | yes |
| m2 | 1 | H | 0.193 / 0.173 | 1.08 | yes |
| m3 | 2 (off-by-one boundary) | H | 0.172 / 0.147 | 0.97 | yes |
| m4 | 2 | U | 0.119 / 0.096 | 0.59 | yes |
| control | 1 twin | H | 0.142 | | clean, `reproduced: no` |
| control | 2 twin | H | 0.122 | | clean, `reproduced: no` |

- Marginal per seed (H − U, headless): seed 1 +0.081 USD (+72%), +0.43 min; seed 2 +0.053 USD (+45%), +0.38 min. Means: H 0.183 against U 0.116 USD, a ratio of 1.58 (bar ≤ 0.75); time 1.03 against 0.62 min, a ratio of 1.65 (bar ≤ 1.10). On transcript pricing the ratio is 1.72. Every reading fails the bar.
- Every valid run fixed the bug through Phase 6, with a regression test, the hidden oracle passing and the repro at 5/5 against 0/5. The helper never wrote outside `repro/`. n = 1 per seed per arm, so this is direction only (D4).
- Voids and recoveries: probe1, `authentication_failed`, a launcher fault fixed in `c9fad5df` (D16 case 3); probe2, the helper did not fire (owner ruling: stronger wording). Kit audit corrections, each owner-ruled or design-aligned, with controls: shell writes void only outside `repro/`; default-only copy differences are ignored (case 3); the cost-source gap is flagged, not blocking (M4); dispatch prose is not scanned for answer-key words.
- Spend: 1.10 of the 4 USD row (probes 0.244, main runs 0.596, controls 0.264).
