#!/bin/sh
# run-doc-caps-fixtures.sh -- must-FAIL fixtures for scripts/lib/check-doc-caps.ts (TD-041, TASK-355).
#
# check-doc-caps.ts is TypeScript run by Bun (TASK-355 -- ported off scripts/lib/check-doc-caps.sh,
# which stays UNCHANGED as the live ORACLE, never deleted), so this harness is a thin `bun test`
# wrapper -- the same shape run-dod-delta-fixtures.sh already uses. Where the shell-oracle harness
# spawned `sh scripts/lib/check-doc-caps.sh` once per case (~2.75s each under Windows fork()
# emulation), evals/doc-caps.test.ts calls the checker's exported `runCheckDocCaps()` directly,
# in-process, for every case in ONE Bun process. A missing runtime FAILs rather than skips
# (TD-101/ADR-037): a skip is indistinguishable from a pass.
#
# Retained fixtures (TD-012 -- never deleted with the prototype that built them), same files, same
# named findings evals/doc-caps.test.ts's cases assert on:
#   over-cap, unparseable-row (L-058 -- a derivation that silently drops an unparseable row is
#   hand-listing again with the hand-list hidden inside the parser), grandfather-grew/-held (L-076's
#   must-catch/must-NOT-catch pair for the grandfather clause), soft-cap/-hard-breach (SOFT reports,
#   HARD still fails beside it), soft-cap-grandfathered (ADR-015 rule 2: a soft cap must not be
#   grandfathered, a hard cap may be), frozen-spent (ADR-020: a superseded verdict is FROZEN, a live
#   doc beside it in the same fixture still fails), the live repo's own §2 deriving real rows,
#   stress-names (TASK-355 revise, outside review: mixed case, `_`/`.`-led/-internal, digit-leading,
#   accented latin, CJK, dot-prefixed non-match, space-containing-name shared-bug reproduction --
#   the population that broke an earlier hand-rolled collation formula, retained so the class cannot
#   recur silently), and empty-string CLI argument fallback (`${1:-default}` semantics).
#
# Differential parity against the shell oracle lives in evals/run-doc-caps-differential.ts (opt-in,
# spawns the real `sh` checker) -- never here; this harness's whole point is that it does NOT spawn.
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the doc-caps checker cannot run, and skipping it"
  echo "              silently would report this suite green with doc-caps unexercised on every gate run"
  exit 2
fi

checker="scripts/lib/check-doc-caps.ts"
test_file="evals/doc-caps.test.ts"
[ -f "$checker" ]   || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -f "$test_file" ] || { echo "FAIL harness: test file not found at $test_file"; exit 2; }

# A test-COUNT floor, not just an exit code -- `bun test` exits 0 on a file with zero live tests
# (a renamed test, a dropped describe) while still reporting PASS. RAISE THIS when adding cases to
# evals/doc-caps.test.ts, in the same commit.
min_tests=14

out=$(bun test "$test_file" 2>&1); code=$?
# Bun colours its summary even when captured into a variable (an ESC/CSI byte precedes the digits),
# so the anchor below is stripped of ANSI first -- otherwise `^` binds to the escape byte and never
# matches, silently returning 0 (SPRINT-102 T2).
n_pass=$(printf '%s\n' "$out" | sed 's/\x1b\[[0-9;]*m//g' | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(doc-caps): the doc-caps checker suite is red (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(doc-caps): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              coverage SHRANK while bun still exited 0 (a skipped describe, a renamed file,"
  echo "              or a case dropped from evals/doc-caps.test.ts all look exactly like this)"
  exit 1
fi

echo "PASS fixture(doc-caps): checker green -- $n_pass tests, 0 fail (retained: over-cap, unparseable-row, grandfather-grew/-held, soft-cap/-hard-breach, soft-cap-grandfathered, frozen-spent, live-standard-derives, stress-names, empty-arg-fallback)"
exit 0
