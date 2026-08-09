#!/bin/sh
# run-count-claims-fixtures.sh -- must-FAIL/must-PASS fixtures for scripts/lib/check-count-claims.sh,
# the checker qa-check.sh's leg 2 delegates to (SPRINT-055 T1, TASK-166).
#
# Leg 2 guarded the template count on .claude/CLAUDE.md and docs/architecture/overview.md and never
# on README.md, so the README drifted alone -- "30 canonical doc templates ... = 32 total" against a
# disk truth of 32 core / 34 total. T1 added the README to the check and added the TOTAL half, which
# had been claimed on all three surfaces and guarded on none. Both halves get their own fixture: a
# check that only ever runs on correct input reports CLEAR by construction, and the half nobody
# tested is the half that drifts (L-058).
#
# Each fixture is a miniature repo whose disk truth is four *.md.template files = 2 core + 2
# non-core = 4 total. Rationale for each lives in its NOTES.md rather than its README.md, because the
# checker reads the FIRST pattern match in a file -- count-shaped text in prose becomes the claim
# under test, which is a trap this suite fell into while being written.
#
# Calls the checker directly against retained fixtures under evals/fixtures/count-claims/ (L-058:
# retain the fixtures, never delete them with the scaffolding that built them -- TD-012's lesson).
# Dependency-free POSIX sh. Run bare: sh evals/run-count-claims-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-count-claims.sh"
fx="$here/fixtures/count-claims"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture dir not found at $fx"; exit 2; }

fail=0

# --- case 1: total claim drifts, core claim correct -> FAIL on the total half only ---------------
# The recorded README shape. Proves the total is checked independently rather than riding on core.
run_case_anywhere "total-drift" 1 \
  "FAIL  tmpl-total: README.md claims 99 != disk 4" -- \
  sh "$checker" "$fx/total-drift"

# --- case 2: core claim drifts, total claim correct -> FAIL on the core half only ----------------
# The mirror. Proves neither half stands in for the other.
run_case_anywhere "core-drift" 1 \
  "FAIL  tmpl-core: README.md claims 7 != disk 2" -- \
  sh "$checker" "$fx/core-drift"

# --- case 3: file present, claim absent -> FAIL, not a silent pass -------------------------------
# A deleted or reworded claim must not read as "nothing to check". Distinct from a MISSING file,
# which is a legitimate skip (a consumer repo need not carry all three surfaces).
run_case_anywhere "claim-missing" 1 \
  "FAIL  tmpl-core: no claim found in README.md" -- \
  sh "$checker" "$fx/claim-missing"

# --- case 4: green control -- both halves agree with disk -> exit 0 ------------------------------
# Without this, a checker that FAILed unconditionally would satisfy every case above.
run_case_anywhere "lockstep" 0 \
  "PASS  tmpl-total: README.md claims 4 = disk 4" -- \
  sh "$checker" "$fx/lockstep"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "COUNT-CLAIMS FIXTURES: all green"; else echo "COUNT-CLAIMS FIXTURES: at least one FAIL"; fi
exit $fail
