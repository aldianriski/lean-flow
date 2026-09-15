#!/bin/sh
# run-dod-delta-fixtures.sh -- must-FAIL/sibling-control/population fixtures for
# scripts/lib/check-dod-delta.ts (SPRINT-101 T3, TASK-326).
#
# check-dod-delta.ts is TypeScript run by Bun (owner ruling, SPRINT-101 T3), not POSIX sh, so this
# harness is a thin `bun test` wrapper -- the same shape run-s4-ts-evaluators.sh already uses for a
# TS-evaluator leg in this gate. A missing runtime FAILs rather than skips (TD-101/ADR-037's rule:
# a skip is indistinguishable from a pass, which is the exact false assurance this repo refuses
# elsewhere).
#
# Retained fixtures live under evals/fixtures/dod-delta/ (TD-012 -- never deleted with the prototype
# that built them): must-fail-6a6aeac (the real motivating commit, extracted verbatim via git),
# sibling-control (claim and ticks agree), population-coord and population-unscoped (L-186 -- the
# OTHER arms of the subject-shape population this checker's attributeClaim() must classify, not just
# the T1: shape the motivating commit happens to be), plus trailer-arm/parenthetical-arm/letter-suffix
# must-fail+sibling pairs and two real throwaway-repo cases (a plan_commit..HEAD range walk; an
# archive-move-in-the-same-commit crash guard) added after an adversarial review of ca577e9 found six
# defects, all in the population this guard runs over (see check-dod-delta.ts's own header).
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the dod-delta checker cannot run, and skipping it"
  echo "              silently would report this suite green with DoD-delta unexercised on every gate run"
  exit 2
fi

checker="scripts/lib/check-dod-delta.ts"
test_file="evals/dod-delta.test.ts"
[ -f "$checker" ]   || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -f "$test_file" ] || { echo "FAIL harness: test file not found at $test_file"; exit 2; }

# A test-COUNT floor, not just an exit code -- `bun test` exits 0 on a file with zero live tests
# (a renamed test, a dropped describe) while still reporting PASS (same shape run-s4-ts-evaluators.sh
# guards against). RAISE THIS when adding cases to evals/dod-delta.test.ts, in the same commit.
min_tests=48

out=$(bun test "$test_file" 2>&1); code=$?
n_pass=$(printf '%s\n' "$out" | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(dod-delta): the dod-delta checker suite is red (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(dod-delta): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              coverage SHRANK while bun still exited 0 (a skipped describe, a renamed file,"
  echo "              or a case dropped from evals/dod-delta.test.ts all look exactly like this)"
  exit 1
fi

echo "PASS fixture(dod-delta): checker green -- $n_pass tests, 0 fail (retained: must-fail-6a6aeac, sibling-control, population-coord, population-unscoped, trailer/parenthetical/letter-suffix/colon-after-paren arms, range walk, archive-move guard)"
exit 0
