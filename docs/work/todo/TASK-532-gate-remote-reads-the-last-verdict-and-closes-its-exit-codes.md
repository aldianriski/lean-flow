---
id: TASK-532
title: "Make gate-remote read the last qa-check verdict, close its exit-code set, and warn on a dirty tree"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-148
depends-on: [TASK-531]
---

# TASK-532 — gate-remote reads the last verdict and closes its exit codes

## Why
TD-268, three defects in an existing tool (unfrozen, ADR-053): a nested harness printing a `QA-CHECK:` line before the real
one can mask the verdict; a remote rc of 2 or 5 is indistinguishable from gate-remote's own refusal and transport codes;
and a dirty tree is gated as HEAD with no word said. Depends on TASK-531, which separates the per-stage logs that make
"the last line of the qa-check log" the right reading, and owns the same file first. Owner rulings R2, R3. G2 cap: 2.

## Done when
- [ ] The qa-check verdict is the LAST `QA-CHECK: N pass, M fail` line of the qa-check output, in `judgeOutput()` (the one definition, so qa-verdict's CLI reads it the same way) and in gate-remote's own verdict print; a retained test with an earlier nested verdict line before the real one reads the real one, in both.
- [ ] Exit codes are a closed set — 0 pass · 1 the gate did not pass · 2 refused before any spawn · 5 transport or setup — stated in the script header; a remote rc of 2, 5 or 7 exits 1 and prints that rc. The "rc preserved exactly" test is replaced by one asserting the printed rc and exit 1.
- [ ] A dirty working tree prints one warning line (the count of uncommitted paths, and that HEAD, not the tree, is gated) and still runs; a clean tree prints none; a retained test for each.
- [ ] Every other existing gate-remote and qa-verdict test stays green.
- [ ] Run on the real artifact: one VPS run on a clean tree prints no warning and exits 0, and one run with an uncommitted file prints the warning.
- [ ] TD-268 resolved → TASK-532.

## Touches
`scripts/gate-remote.ts` · `scripts/qa-verdict.ts` · `evals/gate-remote.test.ts` · `evals/qa-verdict.test.ts` · `TECH-DEBT.md` · `CHANGELOG.md`

## Assumes
- Changing `judgeOutput()` to the last verdict line breaks no current caller: its callers are qa-verdict's own CLI path
  (`runAndJudge`, which judges qa-check stdout alone), gate-remote (which, after TASK-531, judges the qa-check log alone)
  and `evals/qa-verdict.test.ts` (grep of `scripts/` and `evals/`, 2026-10-28).

## Tracker
TECH-DEBT TD-268 (SPRINT-138 T1 review, capped) · owner rulings at intake 2026-10-28 · Codex intake review R1 CLEAR, R2 CLEAR with per-class reasons.
