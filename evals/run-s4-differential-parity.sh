#!/bin/sh
# run-s4-differential-parity.sh -- §4 TS-vs-Shell DIFFERENTIAL parity, OPT-IN (SPRINT-092 T3).
#
# WHAT MOVED, AND WHAT DID NOT. T2 took the §4 always-on slot off the Shell engine: rule semantics and
# the nine retained fixture directories now evaluate through the TS evaluators on every gate run
# (run-s4-ts-evaluators.sh, 0.37-0.98s, no subprocess). What could NOT follow is the part whose whole
# purpose is to disagree with itself -- the row-by-row comparison of TS against a LIVE Shell oracle.
# That needs a real `sh scripts/lib/conformance-engine.sh` spawn per row, which is the 20+s this
# sprint set out to take off the default profile.
#
# So this harness is the differential's new home: opt-in (QA_FULL=1), where the cost is paid
# deliberately. ADR-039 records the DRIFT WINDOW that opening it creates and names the moments parity
# is MANDATORY -- read it before assuming a green default gate says anything about TS/Shell agreement.
#
# SHELL RETAINS §4 AUTHORITY (EPIC-014 D2, sprint D3). This is NOT a cutover. Shell remains the
# oracle; TS is the migrated implementation being checked AGAINST it. A reader who takes the always-on
# TS leg as the authority has inverted the relationship this harness exists to police.
#
# WHY THESE TWO FILES. Both spawn the engine live and assert §4 row by row:
#   * adr-family-fixtures.test.ts -- S4.ONEFILE/INDEX/SECTIONS/NEGATIVE over the retained fixtures,
#     matched on the NAMED finding, plus the owner-ruled empty-slug divergence (both sides pinned
#     independently, because they deliberately disagree).
#   * s4-append-oracle.test.ts -- S4.APPEND's four git-history cases against real repositories.
#
# DELIBERATELY EXCLUDED, named rather than silently omitted: s4-append-shallow-reachability.test.ts.
# It is a §4 test and it does spawn the engine, but it clones this repo's REAL remote to prove the
# shallow branch is reachable on a live artifact (L-166). That makes it NETWORK-dependent, and a
# harness that reddens on a flaky connection teaches people to ignore it. It stays reachable through
# a plain `bun test`.
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the §4 differential cannot run, and skipping it"
  echo "              silently would report parity green while never comparing the two engines"
  exit 2
fi

engine="$repo_root/scripts/lib/conformance-engine.sh"
# The oracle's ABSENCE must be loud here specifically. These tests catch a failed spawn and fall back
# to empty stdout, so a missing engine would degrade every row to a `note` rather than an error --
# which reads as "nothing to compare" instead of "the comparison never happened."
[ -f "$engine" ] || { echo "FAIL harness: Shell oracle not found at $engine -- there is nothing to be differential AGAINST"; exit 2; }

files="
packages/standard/src/rules/adr-family-fixtures.test.ts
packages/standard/src/rules/s4-append-oracle.test.ts
"

missing=""
for f in $files; do
  [ -f "$f" ] || missing="$missing $f"
done
if [ -n "$missing" ]; then
  echo "FAIL harness: §4 differential test file(s) not found --$missing"
  exit 2
fi

# Same test-COUNT floor as the always-on leg, and for the same reason: `bun test` exits 0 on files that
# contain no live tests, so a skipped describe or a renamed file would report parity green while
# comparing the two engines on nothing at all. Here the false assurance is worse than on the always-on
# leg -- this is the ONLY thing that ever compares TS against Shell, so "green" with zero tests means
# the drift window ADR-039 documents is entirely unwatched.
#
# RAISE THIS when you add differential cases, deliberately, in the same commit.
min_tests=21

out=$(bun test $files 2>&1); code=$?
n_pass=$(printf '%s\n' "$out" | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(s4-differential-parity): §4 has DRIFTED between TS and Shell (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(s4-differential-parity): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              the differential SHRANK while bun still exited 0. Parity reported green having"
  echo "              compared the two engines on less than it claims, or on nothing."
  exit 1
fi

echo "PASS fixture(s4-differential-parity): TS matches the LIVE Shell oracle row by row -- $n_pass tests, 0 fail"
exit 0
