#!/bin/sh
# Work-item type contract (SPRINT-159 T2 / TASK-591).
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-work-type.ts"
fx="$here/fixtures/work-type"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || fatal "harness: checker not found at $checker"
[ -d "$fx" ] || fatal "harness: fixture dir not found at $fx"

fail=0
run_case_anywhere "valid" 0 "WORK-TYPE: PASS (4 PASS, 0 FAIL)" -- bun "$checker" "$fx/valid"
run_case_anywhere "unknown-type" 1 "work-type-unknown" -- bun "$checker" "$fx/unknown-type"
run_case_anywhere "bug-no-repro" 1 "bug-item-missing-repro" -- bun "$checker" "$fx/bug-no-repro"
run_case_anywhere "debt-no-td" 1 "debt-item-missing-td" -- bun "$checker" "$fx/debt-no-td"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "WORK-TYPE FIXTURES: all green"; else echo "WORK-TYPE FIXTURES: at least one FAIL"; fi
exit $fail
