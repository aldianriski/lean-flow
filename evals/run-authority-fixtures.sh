#!/bin/sh
# run-authority-fixtures.sh -- retained fixtures for scripts/lib/check-authority.ts
# (SPRINT-088 T1, TASK-292, EPIC-015 § Closed-when 3; ported to TS at TASK-355). Tier G per
# ADR-029 and SPRINT-088 D4: a false negative in an authority classification is silent by
# construction -- the run reports success, the DoD is ticked, and nothing anywhere records that a
# human was skipped.
#
# check-authority.ts is TypeScript run by Bun (TASK-355 -- ported off scripts/lib/check-authority.sh,
# which stays UNCHANGED as the live ORACLE, never deleted), so this harness is a thin `bun test`
# wrapper -- the same shape run-dod-delta-fixtures.sh and run-doc-caps-fixtures.sh already use. Where
# the shell-oracle harness spawned `sh scripts/lib/check-authority.sh` once per case (~2.75s each
# under Windows fork() emulation), evals/authority.test.ts calls the checker's exported
# `runCheckAuthority()` directly, in-process, for every case in ONE Bun process. A missing runtime
# FAILs rather than skips (TD-101/ADR-037): a skip is indistinguishable from a pass.
#
# Retained fixtures (TD-012 -- never deleted with the prototype that built them), same files, same
# named findings, same sibling-discrimination pairing (L-142) evals/authority.test.ts's cases assert
# on: missing-class, control-classed, j2-executed, attended-j2-executed, envelope-backstop-unattended,
# attended-fenced-example, control-j2-parked, closed-out-of-scope, j2-bypassed, control-j2-ruled.
#
# Differential parity against the shell oracle lives in evals/run-authority-differential.ts (opt-in,
# spawns the real `sh` checker over every fixture PLUS every real archived/active sprint doc this
# repo has) -- never here; this harness's whole point is that it does NOT spawn.
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the authority checker cannot run, and skipping it"
  echo "              silently would report this suite green with authority unexercised on every gate run"
  exit 2
fi

checker="scripts/lib/check-authority.ts"
test_file="evals/authority.test.ts"
[ -f "$checker" ]   || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -f "$test_file" ] || { echo "FAIL harness: test file not found at $test_file"; exit 2; }

# A test-COUNT floor, not just an exit code -- `bun test` exits 0 on a file with zero live tests
# (a renamed test, a dropped describe) while still reporting PASS. RAISE THIS when adding cases to
# evals/authority.test.ts, in the same commit.
min_tests=19

out=$(bun test "$test_file" 2>&1); code=$?
# Bun colours its summary even when captured into a variable (an ESC/CSI byte precedes the digits),
# so the anchor below is stripped of ANSI first -- otherwise `^` binds to the escape byte and never
# matches, silently returning 0 (SPRINT-102 T2).
n_pass=$(printf '%s\n' "$out" | sed 's/\x1b\[[0-9;]*m//g' | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(authority): the authority checker suite is red (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(authority): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              coverage SHRANK while bun still exited 0 (a skipped describe, a renamed file,"
  echo "              or a case dropped from evals/authority.test.ts all look exactly like this)"
  exit 1
fi

echo "PASS fixture(authority): checker green -- $n_pass tests, 0 fail (retained: missing-class, control-classed, j2-executed, attended-j2-executed, envelope-backstop-unattended, attended-fenced-example, control-j2-parked, closed-out-of-scope, j2-bypassed, control-j2-ruled)"
exit 0
