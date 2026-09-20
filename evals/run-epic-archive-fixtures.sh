#!/bin/sh
# run-epic-archive-fixtures.sh -- must-FAIL/must-PASS fixtures for
# scripts/lib/check-epic-archive.ts, the checker qa-check.sh delegates STANDARD §11's epic retention
# row to (SPRINT-055 T2, TASK-167).
#
# TASK-355 (P0, QA gate wall-clock): this leg used to run all 38 cases below by spawning
# `sh scripts/lib/check-epic-archive.sh` once per case (~2.75s each -- Windows fork() emulation
# launching a dozen+ grep/sort/awk subprocesses per invocation, not the checking work itself). The
# CASES did not change; where they run did. They now live in evals/epic-archive.test.ts as in-process
# calls against the TS port (scripts/lib/check-epic-archive.ts), so this file is a thin `bun test`
# wrapper -- the exact shape run-dod-delta-fixtures.sh already uses for its own TS checker. All 38
# cases, same fixture roots, same want-exit, same named-finding substrings; ~0.2s total instead of
# ~104s.
#
# THE SHELL CHECKER IS NOT DELETED. It remains the live oracle -- scripts/lib/check-epic-archive.ts's
# own header says so, and evals/epic-archive-differential.test.ts is the separate (opt-in, not run on
# every gate) proof that the TS port still agrees with it byte-for-byte, over every fixture here AND
# over this repository's own real docs/epic/ tree.
#
# A missing runtime FAILs rather than skips (TD-101/ADR-037's rule: a skip is indistinguishable from
# a pass).
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the epic-archive checker cannot run, and skipping it"
  echo "              silently would report this suite green with epic-archive unexercised on every gate run"
  exit 2
fi

checker="scripts/lib/check-epic-archive.ts"
test_file="evals/epic-archive.test.ts"
[ -f "$checker" ]   || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -f "$test_file" ] || { echo "FAIL harness: test file not found at $test_file"; exit 2; }

# A test-COUNT floor, not just an exit code -- `bun test` exits 0 on a file with zero live tests (a
# renamed test, a dropped describe) while still reporting PASS (same shape run-s4-ts-evaluators.sh and
# run-dod-delta-fixtures.sh guard against). RAISE THIS when adding cases to evals/epic-archive.test.ts,
# in the same commit.
min_tests=38

out=$(bun test "$test_file" 2>&1); code=$?
# Bun colours its summary even when captured into a variable (an ESC/CSI byte precedes the digits), so
# the anchor below is stripped of ANSI first -- otherwise `^` binds to the escape byte and never
# matches, silently returning 0 (SPRINT-102 T2).
n_pass=$(printf '%s\n' "$out" | sed 's/\x1b\[[0-9;]*m//g' | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(epic-archive): the epic-archive checker suite is red (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(epic-archive): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              coverage SHRANK while bun still exited 0 (a skipped describe, a renamed file, or"
  echo "              a case dropped from evals/epic-archive.test.ts all look exactly like this)"
  exit 1
fi

echo "PASS fixture(epic-archive): checker green -- $n_pass tests, 0 fail (all 38 retained cases: both"
echo "     archival directions, epic-state rollup currency, and every selection-axis/reachability case)"
exit 0
