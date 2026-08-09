#!/bin/sh
# run-manifest-lockstep-fixtures.sh -- must-FAIL fixtures for scripts/lib/check-manifest-lockstep.sh
# (SPRINT-056 T5, split out of T2 at G2).
#
# Four manifests carry the version and qa-check.sh compared the README FOOTER against one of them, so
# no two manifests were ever compared to each other. .codex-plugin/ and .kimi-plugin/ drifted five
# releases behind before v1.28.0 caught it by hand. Case 1 reproduces that exact shape.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-manifest-lockstep-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-manifest-lockstep.sh"
fx="$here/fixtures/manifest-lockstep"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: the real v1.28.0 finding -- two siblings five releases behind -> FAIL, by name -------
run_case_anywhere "drifted-siblings" 1 ".codex-plugin/plugin.json (1.23.0) != .claude-plugin/plugin.json (1.28.0)" -- \
  sh "$checker" "$fx/drifted"

# --- case 2: a manifest with no parseable version -> FAIL, never a silent skip --------------------
# A file the checker cannot read is not a file that passes. Silence here is precisely how three
# manifests drifted for five releases without anyone noticing (L-065: when a check cannot inspect its
# subject, that is a named FAIL).
run_case_anywhere "unreadable-version" 1 "carries no parseable version" -- \
  sh "$checker" "$fx/no-version"

# --- case 3: a single manifest compares against nothing -> FAIL, not a vacuous pass ---------------
# Lockstep over one file is not lockstep. A PASS over an empty comparison set is the same defect T4
# fixed in the sprint checks this same sprint, so it gets its own leg rather than being assumed.
run_case_anywhere "nothing-compared" 1 "nothing was compared" -- \
  sh "$checker" "$fx/single"

# --- case 4: the live repo must actually be in lockstep, and must compare >= 2 --------------------
# Guards the glob itself. The first live run of this checker found NOTHING, because every manifest
# here lives in a DOT directory and a shell glob does not match a leading dot -- a checker that
# silently matches zero files would otherwise exit 0 and read as coverage (L-102).
run_case_anywhere "live-repo-in-lockstep" 0 ".kimi-plugin/plugin.json" -- \
  sh "$checker" "$repo_root"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "MANIFEST-LOCKSTEP FIXTURES: all green"; else echo "MANIFEST-LOCKSTEP FIXTURES: at least one FAIL"; fi
exit $fail
