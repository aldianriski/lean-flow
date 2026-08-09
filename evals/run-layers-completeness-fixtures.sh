#!/bin/sh
# run-layers-completeness-fixtures.sh -- must-FAIL fixtures for scripts/lib/check-layers-
# completeness.sh, the checker qa-check.sh's leg 14 delegates to (TD-020, L-071, SPRINT-042 T3).
#
# The dispatch preflight's shared-file check is sound and negative-tested; its input is a
# hand-written `Layers:`/`Depends-on:` declaration, and a check over a manifest cannot detect an
# omission from that manifest (L-071: omission looks identical to absence). Case 1 below
# reconstructs SPRINT-041's real Plan verbatim -- both T1 and T2's DoDs required marking a TD
# resolved, neither declared TECH-DEBT.md in Layers:, the preflight passed, and two agents edited
# the file concurrently, merging clean only by ~19 lines of luck. That is a recorded miss, not an
# invented one. Case 2 (the Depends-on: half) has no equivalent recorded incident, so its fixture is
# a small constructed Plan -- labeled as such in the fixture file itself, never claimed as real.
#
# Calls scripts/lib/check-layers-completeness.sh directly against retained fixtures under
# evals/fixtures/layers-completeness/ (L-058: retain the fixtures, don't delete them with the
# scaffolding that built them -- TD-012's lesson). Dependency-free POSIX sh.
# Run bare: sh evals/run-layers-completeness-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-layers-completeness.sh"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }

fail=0

# --- case 1: SPRINT-041 reconstructed -- TD marked resolved implies TECH-DEBT.md, undeclared -----
run_case_anywhere "sprint-041-reconstructed" 1 \
  "Layers completeness: DoD/Acceptance implies TECH-DEBT.md(TD-marked-resolved), absent from Layers:" -- \
  sh "$checker" "$here/fixtures/layers-completeness/sprint-041-reconstructed.md"

# --- case 2: Depends-on omission (constructed) -- T2's prose references T1, Depends-on: none -----
run_case_anywhere "depends-on-omitted" 1 \
  "Depends-on completeness: DoD/Acceptance references T1, absent from Depends-on:" -- \
  sh "$checker" "$here/fixtures/layers-completeness/depends-on-omitted.md"

# --- cases 3-5: the `Cites:` escape and the wrapped-declaration rule (SPRINT-049 T3) -------------
# Case 3 is the only must-PASS fixture in this harness, and it is the one that guards against the
# regression TD-032 actually recorded: the gate quietly reshaping documentation. Its three blocks are
# the real SPRINT-048 false positives (commits 45ff548 / 68bdc7e / c401a0e). Cases 4 and 5 are the
# escape's own must-FAIL bar -- an escape with no abuse case is a silencer (L-058).

run_case_anywhere "sprint-048-citations-escaped" 0 \
  "Layers completeness (DoD-implied files all declared)" -- \
  sh "$checker" "$here/fixtures/layers-completeness/sprint-048-citations.md"

run_case_anywhere "cites-contradiction" 1 \
  "Cites/Layers contradiction: docs/QA.md declared as touched AND escaped as merely cited" -- \
  sh "$checker" "$here/fixtures/layers-completeness/cites-contradiction.md"

run_case_anywhere "unindented-continuation" 1 \
  "declaration continuation: a wrapped Layers line must be indented to continue" -- \
  sh "$checker" "$here/fixtures/layers-completeness/unindented-continuation.md"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "LAYERS-COMPLETENESS FIXTURES: all green"; else echo "LAYERS-COMPLETENESS FIXTURES: at least one FAIL"; fi
exit $fail
