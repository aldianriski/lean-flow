# qa-check.sh leg 2g wiring diff (TASK-355) -- NOT APPLIED

This file exists so the diff below is reviewable in the committed tree. It is **not applied** to
`scripts/qa-check.sh` -- that file is a hard-constraint file for this task (shared with 34 other
harnesses and three other agents working in parallel worktrees); this task ports the CHECKER only.
The coordinator applies this centrally, once, when all four agents' checkers are ready.

## What this changes

`scripts/qa-check.sh` leg 2g currently calls the shell oracle, `scripts/lib/check-night-run-rollup.sh`,
via `sh`. `scripts/lib/check-night-run-rollup.ts` (this task's port, bug-for-bug parity proven by
`evals/run-night-run-rollup-differential-parity.ts`) is what actually removes the ~2.75s-per-invocation
Windows `fork()` cost from the default gate -- until leg 2g is repointed at it, the TS port only
benefits ad-hoc/test invocations, not the gate qa-check.sh itself runs.

The `command -v bun` guard below is copied verbatim in spirit from the existing leg 16 (dod-delta)
pattern already shipped in this file (`scripts/qa-check.sh` lines ~1421-1444, SPRINT-101 T3): FAIL
rather than skip when bun is missing, same rule as the typecheck leg (TD-101 / ADR-037) -- a skip is
indistinguishable from a pass, which is exactly the false assurance this repo refuses elsewhere.

## The diff

```diff
--- a/scripts/qa-check.sh
+++ b/scripts/qa-check.sh
@@ leg 2g: recorded-run rollup
-nr_script="scripts/lib/check-night-run-rollup.sh"
-if [ ! -f "$nr_script" ]; then
-  bad "night-run rollup: checker not found at $nr_script"
-else
+nr_script="scripts/lib/check-night-run-rollup.ts"
+if ! command -v bun >/dev/null 2>&1; then
+  bad "night-run rollup: bun not found on PATH -- cannot run scripts/lib/check-night-run-rollup.ts. This FAILS rather than skipping on purpose, same rule as the typecheck/dod-delta legs (TD-101 - ADR-037): a skip is indistinguishable from a pass"
+elif [ ! -f "$nr_script" ]; then
+  bad "night-run rollup: checker not found at $nr_script"
+else
   # Each log is DERIVED from its Plan rather than globbed on its own. Two reasons, both
   # load-bearing: ADR-014 requires this file to carry exactly one sprint pattern (the
   # non-recursive one), enforced by run-sprint-log-layout-fixtures.sh case 1; and deriving
   # means the Plan and its log cannot drift apart -- the pair is one record (§11).
   #
   # An ABSENT log for a live sprint that still has open DoD is not "nothing to check" -- it is
   # exactly the state a run that died before writing anything leaves behind (SPRINT-098 T1 DoD 1,
   # scope-change 2026-09-11). Before this fix, a missing log silently dropped that sprint out of
   # nr_files instead of ever reaching the checker, so the one failure this leg exists to catch
   # never had a chance to surface -- the checker already FAILs on a nonexistent path
   # (check-night-run-rollup.sh's own file-not-found guard), it just never used to be handed one. A
   # sprint whose Plan is fully ticked (closed, awaiting archive -- a transient state, not a crash)
   # is not required to carry one for THIS leg; "open DoD" reuses the exact derivation
   # check-layers-observed.sh already uses for "is this sprint at close" (`## Plan` section,
   # `^- \[ \]` lines) rather than re-inventing it.
   nr_files=""
   for nr_sp in $(ls docs/sprint/SPRINT-*.md 2>/dev/null); do
     nr_lg="docs/sprint/logs/$(basename "$nr_sp")"
     if [ -f "$nr_lg" ]; then
       nr_files="$nr_files $nr_lg"
     else
       nr_open=$(awk '/^## Plan/{f=1;next} /^## /{f=0} f && /^- \[ \]/{n++} END{print n+0}' "$nr_sp")
       [ "$nr_open" -gt 0 ] && nr_files="$nr_files $nr_lg"
     fi
   done
   if [ -z "$nr_files" ]; then
     note "night-run rollup: skip -- no active sprint Plan found"
   else
-    nr_out=$(sh "$nr_script" $nr_files 2>&1); nr_code=$?
+    nr_out=$(bun "$nr_script" $nr_files 2>&1); nr_code=$?
     printf '%s\n' "$nr_out"
     nr_pass=$(printf '%s\n' "$nr_out" | grep -cE '^PASS')
     nr_fails=$(printf '%s\n' "$nr_out" | grep -cE '^FAIL')
     pass=$((pass + nr_pass))
     if [ "$nr_code" -ne 0 ]; then
       if [ "$nr_fails" -gt 0 ]; then
         fail=$((fail + nr_fails))
       else
         bad "night-run rollup: checker exited $nr_code without reporting a FAIL line"
       fi
     fi
   fi
 fi
```

## Why not applied here

`scripts/qa-check.sh` is a hard constraint for this task (see the porting brief): it is shared with
34 other harnesses, and three other agents are porting different checkers in parallel worktrees at
the same time. Any one of them editing this file risks clobbering another's in-flight change or
serializing all four agents on a single shared file. The coordinator applies the accumulated diffs
from all four checkers' final reports in one pass once they are all ready.

## Verification this diff is safe to apply

- `evals/run-night-run-rollup-differential-parity.ts`: the TS port matches the shell oracle's exit
  code and stdout on every input the widened population covers (fixture logs, real archived logs,
  a directory, an empty-string argument, a non-`.md` file, an unreadable file, and multi-arg
  mixtures of good+bad in every position) -- see this task's final report for the exact N.
- The `$nr_files` value passed to `$nr_script` is unchanged by this diff; only the interpreter
  (`sh` -> `bun`) and the script extension (`.sh` -> `.ts`) change.
- `nr_pass`/`nr_fails`/`nr_code` parsing below the invocation line is unchanged -- both engines emit
  the identical `PASS `/`FAIL ` line prefixes and exit codes, so nothing downstream of the
  substituted line needs to change.
