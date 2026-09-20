#!/bin/sh
# run-layers-completeness-fixtures.sh -- must-FAIL fixtures for scripts/lib/check-layers-
# completeness.ts, the TS port qa-check.sh's leg 14 comment references (TD-020, L-071, SPRINT-042 T3;
# ported SPRINT-103).
#
# WHAT MOVED, AND WHAT DID NOT (SPRINT-103, mirrors SPRINT-092 T2's §4 swap exactly). This harness
# used to `sh`-spawn scripts/lib/check-layers-completeness.sh directly, 16 times for 10 distinct
# argument sets, at 55-70s on this host -- Windows fork() emulation cost (~40 grep/sort/tr/sed/awk
# subprocess spawns per task block), not the checking work itself (milliseconds of text matching).
# scripts/lib/check-layers-completeness.sh REMAINS THE ORACLE (owner ruling, mirroring EPIC-014 D2 --
# "Shell retains §4 authority"): it is UNCHANGED, still what qa-check.sh's own gate leg spawns, and
# still what evals/layers-completeness-differential.ts (opt-in, not run here) checks the TS port
# against, row by row, over every retained fixture AND every real sprint Plan in this repository.
# What moved is THIS harness: it now asserts against scripts/lib/check-layers-completeness.ts, the
# fork-free TS port, called in-process via evals/layers-completeness.test.ts -- the same "TS
# evaluator leg" shape run-s4-ts-evaluators.sh already established for §4, and the same "thin bun test
# wrapper" shape run-dod-delta-fixtures.sh already uses for check-dod-delta.ts.
#
# COVERAGE UNCHANGED, NOT MERELY RELOCATED (DoD 4's own bar). Every named finding, every retained
# must-FAIL fixture, every sibling control, and both population-selection fixtures (L-186: the
# archive/ path-segment case AND the filesystem-identity casing case) that this harness asserted via
# the Shell checker are re-asserted, unchanged in substance, against the TS port in
# evals/layers-completeness.test.ts -- see that file's own per-describe-block comments for which
# finding each one guards.
#
# THE OTHER FIX FOLDED IN (independent analysis, same sprint): the harness this file replaces invoked
# its own checker 16 times for only 10 distinct argument sets -- dir-token-prefix.md 2x, the substring
# fixture 4x, the archive-selection pair 3x -- because run_case_anywhere always re-invokes the command
# it asserts against. evals/layers-completeness.test.ts captures each distinct argument set exactly
# ONCE (in a `beforeAll`) and every assertion reads that ONE captured {exitCode, output}, verified
# (not assumed) not to be mutated between assertions -- these are all read-only capture-and-assert
# fixtures, none of the history-building-harness shape that legitimately mutates a shared path across
# repeated calls.
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

# A missing runtime FAILs rather than skips. A skip is indistinguishable from a pass, which is the
# exact false assurance this repo refuses elsewhere (TD-101 / ADR-037, the typecheck leg's own rule).
if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the layers-completeness TS port cannot run, and skipping"
  echo "              it silently would report this suite green with layers-completeness unexercised"
  exit 2
fi

checker="scripts/lib/check-layers-completeness.ts"
test_file="evals/layers-completeness.test.ts"
[ -f "$checker" ]   || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -f "$test_file" ] || { echo "FAIL harness: test file not found at $test_file"; exit 2; }

# A test-COUNT floor, not just an exit code -- `bun test` exits 0 on a file with zero live tests (a
# renamed test, a dropped describe) while still reporting PASS (same shape run-s4-ts-evaluators.sh and
# run-dod-delta-fixtures.sh both guard against). RAISE THIS when adding cases to the test file, in the
# same commit.
min_tests=19

out=$(bun test "$test_file" 2>&1); code=$?
# Bun colours its summary even when captured into a variable (an ESC/CSI byte precedes the digits),
# so the anchor below is stripped of ANSI first -- otherwise `^` binds to the escape byte and never
# matches, silently returning 0 (SPRINT-102 T2).
n_pass=$(printf '%s\n' "$out" | sed 's/\x1b\[[0-9;]*m//g' | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(layers-completeness): the layers-completeness TS port suite is red (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(layers-completeness): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              coverage SHRANK while bun still exited 0 (a skipped describe, a renamed file, or"
  echo "              a case dropped from evals/layers-completeness.test.ts all look exactly like this)"
  exit 1
fi

# --- ORACLE-SIDE GUARD: the IFS word-splitting fix (TASK-355) -------------------------------------
# Everything above exercises the TS PORT. It cannot catch a regression in the SHELL oracle -- proven
# by seeding the IFS fix out and watching this suite stay 19/19 green. The full shell/TS differential
# (evals/layers-completeness-differential.ts) DOES catch it, but it is opt-in and takes ~14 minutes,
# so it is not gate-reachable: an independent review found the oracle fix had NO automated coverage in
# either gate profile, which makes it a rule with no matcher (STANDARD Sec 10 -- wire it or admit it is
# documentation).
#
# This is the cheap gate-reachable half: ONE oracle invocation over ONE fixture, asserting the two
# findings that word-splitting used to swallow. ~1 shell spawn, not 102. A full-corpus parity sweep
# stays where it belongs, in the opt-in differential.
oracle="scripts/lib/check-layers-completeness.sh"
space_fx="evals/fixtures/layers-completeness/space-token-wordsplit.md"
if [ ! -f "$oracle" ] || [ ! -f "$space_fx" ]; then
  echo "FAIL harness: oracle ($oracle) or its space-token fixture ($space_fx) is missing -- the shell"
  echo "              side of the IFS fix would go unguarded, which is how it was unguarded before"
  exit 2
fi
o_out=$(sh "$oracle" "$space_fx" 2>&1)
o_missing=""
printf '%s\n' "$o_out" | grep -qF 'T1 Cites/Layers contradiction: my file.md declared as touched AND escaped as merely cited' \
  || o_missing="$o_missing T1-cites-contradiction"
printf '%s\n' "$o_out" | grep -qF 'T2 Layers completeness: DoD/Acceptance implies zzsomething.md, absent from Layers:' \
  || o_missing="$o_missing T2-dir-prefix-false-cover"
# Sibling control: an unrelated leg on the same fixture must stay green, so a demolition of the
# checker reads differently from a regression of the IFS fix specifically.
printf '%s\n' "$o_out" | grep -qF 'T2 Depends-on completeness (prose-referenced tasks all declared)' \
  || o_missing="$o_missing SIBLING-CONTROL-ALSO-LOST(not-an-IFS-regression-look-wider)"
if [ -n "$o_missing" ]; then
  echo "FAIL fixture(layers-completeness): the SHELL oracle no longer reports:$o_missing"
  echo "              These are the findings that unquoted \`for x in \$var\` used to word-split away --"
  echo "              a space-containing backtick token split into fragments that matched nothing, so"
  echo "              the finding vanished SILENTLY. If the IFS pinning in $oracle was reverted, that"
  echo "              is the cause. Oracle output was:"
  printf '%s\n' "$o_out"
  exit 1
fi

echo "PASS fixture(layers-completeness): TS port green -- $n_pass tests, 0 fail (retained: sprint-041-reconstructed, depends-on-omitted, sprint-048-citations sibling PASS, cites-contradiction, unindented-continuation, dir-token-prefix T1/T2, substring-declaration-not-declared T1/T2/T3, archive-path-excluded pair, archive-case-variant, file-not-found, space-token-wordsplit T1/T2+control)."
echo "PASS fixture(layers-completeness): SHELL oracle still reports both space-token findings (the IFS fix, guarded gate-reachably). Full-corpus shell/TS parity remains opt-in: evals/layers-completeness-differential.ts."
exit 0
