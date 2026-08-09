#!/bin/sh
# run-sprint-close-fixtures.sh -- must-FAIL fixtures for the close-commit coverage fix (TD-042).
#
# The sprint checks used to gate on `status: active`, so writing `status: closed` disarmed them in
# the SAME commit that makes the largest edit to the file -- the Retro, the four-bucket routing and
# close_commit all landed unvalidated. Measured twice: 72 -> 68 pass at SPRINT-054's close and
# 94 -> 87 at SPRINT-055's, both reporting "0 fail". A close that broke the schema would have
# reported exactly the same green.
#
# T4 keyed the skip on LOCATION instead: §11's retention pass moves a closed sprint to archive/ in a
# separate, later commit, so a close commit is still in docs/sprint/ and still covered, while
# archived history stays out of scope. These fixtures hold both ends of that.
#
# Dependency-free POSIX sh, no git needed -- pure text over fixture files. Run bare:
#   sh evals/run-sprint-close-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-layers-completeness.sh"
fx="$here/fixtures/sprint-close"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: a CLOSED sprint carrying a schema violation, still in docs/sprint/ -> FAIL -----------
# This is the case that used to pass silently. The file is closed, the Retro is written, and T1's
# prose names a file its Layers: never declares. Pre-T4 the checker skipped it on sight of
# `status: closed` and the gate went green.
run_case_anywhere "closed-not-archived-still-checked" 1 "absent from Layers:" -- \
  sh "$checker" "$fx/closed-not-archived/docs/sprint/SPRINT-901-closing.md"

# --- case 2: the SAME file, once §11 has moved it to archive/ -> skipped, exit 0 -----------------
# The must-NOT-catch half (L-076): archived history is deliberately out of scope, and this shows
# exactly where the boundary now sits. Identical content, different directory, opposite verdict --
# which is the whole point of keying on location rather than on a status flip.
run_case_anywhere "archived-is-out-of-scope" 0 "" -- \
  sh "$checker" "$fx/archived/docs/sprint/archive/SPRINT-902-archived.md"

# --- case 3: zero verified must report as a SKIP, not a PASS -------------------------------------
# The reporting half of TD-042. Handing the checker only an archived file means nothing is in scope;
# it must exit 0 having printed no PASS line, so qa-check.sh's wrapper renders a SKIP. A green
# summary line over an empty input set is indistinguishable from real coverage, which is how a
# 7-check drop went unnoticed at SPRINT-055's close.
out=$(sh "$checker" "$fx/archived/docs/sprint/archive/SPRINT-902-archived.md" 2>&1); rc=$?
npass=$(printf '%s\n' "$out" | grep -cE '^PASS')
if [ "$rc" -eq 0 ] && [ "$npass" -eq 0 ]; then
  echo "PASS fixture(zero-verified-emits-no-PASS): exit 0 with 0 PASS lines -- wrapper renders SKIP"
else
  echo "FAIL fixture(zero-verified-emits-no-PASS): exit $rc with $npass PASS line(s); expected exit 0 and 0"
  printf '%s\n' "$out"; fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "SPRINT-CLOSE FIXTURES: all green"; else echo "SPRINT-CLOSE FIXTURES: at least one FAIL"; fi
exit $fail
