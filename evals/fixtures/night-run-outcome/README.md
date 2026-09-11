# night-run-outcome — retained fixtures (SPRINT-098 T3)

Guards the outcome/DoD consistency check added to `scripts/lib/check-night-run-rollup.sh`
(EPIC-015 § Closed-when 6). `scripts/night-run.sh`'s `reap()` now emits a typed
`outcome · DELIVERED | PARTIAL | FAILED · ...` line beside the existing `run · N of M DoD ticked` /
`terminal · <STATE> · ...` lines — a deterministic function of `terminal` (see night-run.md Part 4).
This checker is the one place that reads it back and refuses the exact silent false negative T3
exists to close: a run that stopped mid-Plan reporting itself DELIVERED. Run the harness:
`sh evals/run-night-run-outcome-fixtures.sh`.

One named finding, asserted directly rather than on a bare exit code (L-058):

- `outcome-delivered-with-open-dod` — `outcome · DELIVERED` with `N < M` DoD boxes ticked.

## Cases

| Dir | Shape | Verdict |
|---|---|---|
| `delivered-open-dod/` | `outcome · DELIVERED`, `run · 1 of 2 DoD ticked`, no non-done per-task line | must-FAIL — `outcome-delivered-with-open-dod`, isolated from T1's own agreement rule (L-189) |
| `delivered-open-dod-sibling/` | same claim, `run · 2 of 2 DoD ticked` | control (L-142) — PASS |
| `window-second-block-outcome/` | first block: `DELIVERED` + `1 of 2` (would-FAIL if read); last block: `DELIVERED` + `2 of 2` | must-vary-**selection** (L-186) — only the LAST `run-complete` block may be read |
| `illustrative-aside-after-real/` | real, correct `outcome`/`run` lines, followed — in the SAME window, before the next `### ` header — by a reviewer's aside quoting the bad shape | self-describing-corpus control (L-108) — must stay PASS; the genuine, reaper-emitted lines are always written FIRST (append-only Execution Log), so `head -n1` selects them over any later illustrative text |

`outcome ·` is **grandfathered**, not required: it is a brand-new field, so no log written before this
task carries one — including every other fixture in `evals/fixtures/night-run-rollup/` and the real
committed SPRINT-067/082/089/090 archives used elsewhere in this suite. The check only fires when the
line IS present; requiring it unconditionally would retroactively FAIL that entire pre-existing,
still-correct history (the same grandfathering A1 already applied to the archived-sprint population one
task up).

## Motivating real artifact — none exists, stated plainly rather than fabricated

`outcome ·` is new in this task: `reap()` has never emitted it before this change, so no committed
Execution Log anywhere in this repository can carry a real one yet. The earliest run that could produce
one is SPRINT-098 T4 (a genuine unattended run against the repaired reaper), which had not happened at
the time this suite was written. `evals/run-night-run-outcome-fixtures.sh` prints this admission at run
time rather than silently omitting the motivating-artifact case other sibling suites carry.

## Seeded-break discrimination (one convention: `git hash-object` vs a stated checkpoint)

Checkpoint (pre-seed, working tree): `git hash-object scripts/lib/check-night-run-rollup.sh` =
`5d6d3baa1156939baa84ae014bcaab74f4f6cbc3` (278 lines).

- **Seed A** — inverted the comparison driving the named finding (`!=` → `=` on the DoD-count check).
  Landed (1 line changed), parsed (`sh -n`), targeted (single operator flip, 278→278 lines). Reddened
  all four fixtures in this suite (the comparison every one of them exercises) plus one collateral case
  in `evals/fixtures/night-run-rollup/` (`single-active-baseline-unaffected`, which drives the real
  `--reap` path and therefore genuinely carries an `outcome ·` line). Restored byte-identical under the
  stated hash.
- **Seed B** — changed the two `head -n1` selections (which occurrence of `outcome ·` / `run ·` wins
  when more than one exists in the window) to `tail -n1`. Landed (2 lines changed), parsed, targeted
  (278→278 lines). Reddened **only** `illustrative-aside-after-real-ok` — every other case in both
  suites stayed green, including the three siblings in this same suite. Restored byte-identical under
  the stated hash.

Both seeds verified independently; neither failed to land. Full narrative → the SPRINT-098 T3
report/log rather than duplicated here.
