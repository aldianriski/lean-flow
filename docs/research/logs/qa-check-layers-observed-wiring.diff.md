# Wiring diff — leg 15 dispatches to the TS port (SPRINT-103 T2)

**Status: NOT APPLIED.** Committed as a reviewable file first, per D3 (`scripts/qa-check.sh` is
coordinator-owned) and the shape of `docs/research/logs/qa-check-ts-harness-dispatch-wiring.diff.md`
(SPRINT-103 T1's own wiring diff, unapplied for the same reason). Apply only after review.

## Why this exists

SPRINT-103 T2 ports `scripts/lib/check-layers-observed.sh` to `scripts/lib/check-layers-observed.ts`
(run by Bun) to remove leg 15's subprocess cost from the always-on gate — measured in
`docs/research/logs/qa-gate-timing.md` Round 20 at 11.1–12.2s for one real sprint file, ~10 git calls
inside 8 loops, on a harness (`evals/run-layers-observed-fixtures.sh`) that itself runs 182.9–185.7s
wall with a third of that blocked on subprocesses rather than computing anything.

The shell checker (`scripts/lib/check-layers-observed.sh`) **remains the oracle and is unmodified**
(D5). `evals/run-layers-observed-differential.ts` is the retained proof the TS port agrees with it —
byte-for-byte, exit code and stdout, across ~19 TS-built git fixtures (one per distinct branch) plus
the full real sprint corpus in this repository (active + archived, 103 files as of this sprint).

Leg 15 today still calls the `.sh` file directly (`sh "$lo_script" $lo_files`). The change below makes
it call the `.ts` port instead, **mirroring leg 14's own wiring exactly** — leg 14 already dispatches
to `check-layers-completeness.ts` via `bun`, with a "bun not found" FAIL-not-skip guard (TD-101 -
ADR-037: a skip is indistinguishable from a pass). Leg 15 gets the identical shape, one file over.

## The one change

### Leg 15 — dispatch to the TS port, mirroring leg 14's guard shape exactly (`scripts/qa-check.sh` ~:1415)

Current (unchanged, for reference):

```sh
lo_script="scripts/lib/check-layers-observed.sh"
if [ ! -f "$lo_script" ]; then
  bad "layers observed: checker not found at $lo_script"
else
  lo_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
  if [ -z "$lo_files" ]; then
    note "layers observed: skip (missing): docs/sprint/SPRINT-*.md"
  else
    lo_out=$(sh "$lo_script" $lo_files 2>&1); lo_code=$?
    ...
```

Proposed:

```diff
-lo_script="scripts/lib/check-layers-observed.sh"
-if [ ! -f "$lo_script" ]; then
+lo_script="scripts/lib/check-layers-observed.ts"
+if ! command -v bun >/dev/null 2>&1; then
+  bad "layers observed: bun not found on PATH -- cannot run $lo_script. This FAILS rather than skipping on purpose, same rule as the layers-completeness leg (TD-101 - ADR-037): a skip is indistinguishable from a pass"
+elif [ ! -f "$lo_script" ]; then
   bad "layers observed: checker not found at $lo_script"
 else
   lo_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
   if [ -z "$lo_files" ]; then
     note "layers observed: skip (missing): docs/sprint/SPRINT-*.md"
   else
-    lo_out=$(sh "$lo_script" $lo_files 2>&1); lo_code=$?
+    lo_out=$(bun "$lo_script" $lo_files 2>&1); lo_code=$?
```

Everything after the `lo_out=`/`lo_code=` line (the PASS/SKIP/FAIL counting and message formatting,
`scripts/qa-check.sh` ~:1424–1440) reads `lo_out`/`lo_code` exactly as before and needs no change:
the TS port's stdout is byte-identical to the shell oracle's over every input the differential
covers, so every downstream `grep -cE '^PASS'` / `grep -cE '^SKIP'` / `grep -E '^FAIL'` continues to
match the same lines.

**No second change is needed for the eval-harness census** (unlike SPRINT-103 T1's diff, which had to
widen a `.sh`-only glob): `evals/run-layers-observed-fixtures.sh` stays the retained, opt-in must-FAIL
suite for the shell oracle and is untouched; `evals/run-layers-observed-differential.ts` is new but,
like `evals/run-doc-caps-differential.ts` and `evals/layers-completeness-differential.ts` before it,
is deliberately **not** registered as a gate leg — it is acceptance evidence for the port, re-run by a
maintainer when either file changes, not a permanent subprocess cost on every gate run. A future
reviewer wiring it into the opt-in set follows the same `evals/run-*.ts` dispatch-by-extension change
T1's diff already describes; this diff does not repeat it since T1's is still unapplied and would need
to land first.

## Verification before applying

```
bun evals/run-layers-observed-differential.ts     # expect: identical/N and PASS on both totals
sh scripts/qa-check.sh 2>&1 | grep 'layers observed'   # before/after: identical wording, likely faster
```

Compare wall time of the `layers observed` leg specifically before and after (the timing log's own
method, Round 20) to confirm the expected speedup materializes on the reviewer's host, not just this
one.
