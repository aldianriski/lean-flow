#!/bin/sh
# run-s4-ts-evaluators.sh -- the ALWAYS-ON §4 leg (SPRINT-092 T2).
#
# WHY THIS HARNESS EXISTS. T2 removes run-adr-family-fixtures.sh from the always-on eval set: it
# spawns the Shell conformance engine 12 times and costs 23.4-28.2 s (T4 Round 13), and its differential-against-Shell
# job moves to the opt-in profile (T3, EPIC-014 D2). Removing it ALONE would not have relocated §4
# coverage -- it would have DELETED §4 from every default gate run. Measured, not assumed:
#
#   * scripts/qa-check.sh reduces its own spec on a bare run to S9.GATESWELLFORMED/S9.GATESABSENT +
#     S13.* -- 0 of §4's 7 rows survive that filter.
#   * run-adr-family-fixtures.sh was the ONLY harness in eval_harnesses_always mentioning S4.
#   * qa-check.sh never invokes `bun test`, so the TS evaluators SPRINT-091 T12 wired do not run
#     on a gate run at all.
#
# So this harness is what keeps DoD 4 true ("semantic coverage unchanged, not merely relocated"):
# it runs the §4 evaluators that DON'T spawn the oracle, on every default gate run. The whole leg is
# 0.37-0.98 s against the 23.4-28.2 s it replaces -- very nearly free, which is what made this
# the option worth taking over simply recording the loss.
#
# WHY AN EXPLICIT FILE LIST rather than a glob. The budget leg (TD-084) is sensitive to a slow test
# creeping into an always-on harness, and every file named below is oracle-free BY INSPECTION -- a
# glob would silently adopt the next oracle-spawning §4 test someone adds and quietly hand this leg
# a 20 s subprocess. The cost of the explicit list is that a NEW fast §4 test is not gated until it
# is added here; that trade is deliberate, and the case-equivalence guard
# (test/adr-family-harness-parity.test.ts) is what catches drift on the side that actually matters --
# a Shell case losing its TS counterpart.
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
cd "$repo_root" || { echo "FAIL harness: cannot cd to repo root $repo_root"; exit 2; }

# A missing runtime FAILs rather than skips. A skip is indistinguishable from a pass, which is the
# exact false assurance this repo refuses elsewhere (TD-101 / ADR-037, the typecheck leg's own rule).
if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL harness: bun not found on PATH -- the §4 TS evaluators cannot run, and skipping them"
  echo "              silently would report this suite green with §4 unexercised on every gate run"
  exit 2
fi

# Oracle-free §4 coverage, in two layers:
#   (1) rule semantics against the in-memory fakes;
#   (2) the same rules against the NINE RETAINED fixture directories on disk (TD-012), plus the
#       case-for-case equivalence guard that keeps the Shell harness's removal honest.
files="
packages/standard/src/rules/adr-family.test.ts
packages/standard/src/rules/adr-fixture-factory-guardrail.test.ts
packages/standard/src/rules/f4-registry.test.ts
packages/standard/src/rules/s4-onefile.test.ts
packages/standard/src/rules/s4-index.test.ts
packages/standard/src/rules/s4-sections.test.ts
packages/standard/src/rules/s4-negative.test.ts
packages/standard/src/rules/s4-append.test.ts
packages/standard/src/rules/s4-append-registry.test.ts
test/s4-retained-fixtures.test.ts
test/adr-family-harness-parity.test.ts
"

missing=""
for f in $files; do
  [ -f "$f" ] || missing="$missing $f"
done
if [ -n "$missing" ]; then
  # A renamed-away test file must redden here rather than shrink the leg in silence: bun exits 0
  # when it is handed only files that exist, so an absent file would otherwise pass as coverage.
  echo "FAIL harness: §4 test file(s) not found --$missing"
  exit 2
fi

# A test-COUNT floor, not just an exit code. `bun test` exits 0 when handed files that contain no live
# tests, so a `describe.skip`, a renamed test, or an entry dropped from the list above all collapse this
# leg to "0 pass" while it still reports PASS. Same false-assurance shape the missing-file guard above
# refuses, one rung down: an exit code attests to the RUNNER, never to the coverage. Proven live during
# SPRINT-092's independent review -- seeding `describe.skip` removed 15 tests and this harness still
# printed PASS, because the summary was captured and echoed but never ASSERTED.
#
# RAISE THIS when you add §4 tests, deliberately, in the same commit. A floor left below the real count
# silently re-opens the hole it closes.
min_tests=87

out=$(bun test $files 2>&1); code=$?
n_pass=$(printf '%s\n' "$out" | grep -oE '^ *[0-9]+ pass' | grep -oE '[0-9]+' | head -1)
[ -n "$n_pass" ] || n_pass=0

if [ "$code" -ne 0 ]; then
  echo "FAIL fixture(s4-ts-evaluators): the §4 TS evaluator leg is red (bun test exit $code) -- output:"
  printf '%s\n' "$out"
  exit 1
fi

if [ "$n_pass" -lt "$min_tests" ]; then
  echo "FAIL fixture(s4-ts-evaluators): only $n_pass test(s) ran, expected at least $min_tests --"
  echo "              §4 coverage SHRANK while bun still exited 0. A skipped describe, a renamed file,"
  echo "              or an entry dropped from this harness's own file list all look exactly like this."
  exit 1
fi

echo "PASS fixture(s4-ts-evaluators): §4 evaluators green without an oracle spawn -- $n_pass tests, 0 fail"
exit 0
