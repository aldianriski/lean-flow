#!/bin/sh
# run-skill-freshness-fixtures.sh -- must-FAIL/must-SKIP/must-PASS fixtures for the
# skill-freshness check in skills/orchestrator/references/night-run.md (L-058: a gate's worst
# failure is the silent false-negative; retain one fixture per outcome, never delete them).
#
# Extracts the *actual shipped snippet* from night-run.md (between the skill-freshness-check
# anchors) so the fixtures test what a consumer really runs, not a hand-copied duplicate that can
# drift out of sync with it. Dependency-free POSIX sh. Run bare: sh evals/run-skill-freshness-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
nightrun="$here/../skills/orchestrator/references/night-run-checks.md"
. "$here/lib/harness-common.sh"

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
trap 'rm -f "$script_tmp"' EXIT
extract_between_anchors "$nightrun" "<!-- skill-freshness-check:start -->" "<!-- skill-freshness-check:end -->" "$script_tmp"

fail=0

# --- case 1: no local plugin repo -> SKIP (exit 0), finding: no-local-repo -----------------
run_case_firstline "no-local-repo" 0 "SKIP no-local-repo" -- \
  sh "$script_tmp" \
  "$here/fixtures/skill-freshness/no-local-repo" \
  "$here/fixtures/skill-freshness/no-local-repo/does-not-exist.json"

# --- case 2: installed version != repo manifest version -> BLOCK, finding: stale-release ---
run_case_firstline "stale-release" 1 "BLOCK stale-release" -- \
  sh "$script_tmp" \
  "$here/fixtures/skill-freshness/stale-release/repo" \
  "$here/fixtures/skill-freshness/stale-release/installed_plugins.json"

# --- case 3: cache skills/ differs from repo's -> BLOCK, finding: cache-differs -----------
# installPath is templated ("__CACHE_DIR__") because a committed fixture can't hardcode this
# machine's absolute checkout path -- substitute it into a throwaway copy before running.
cd_fixture="$here/fixtures/skill-freshness/cache-differs"
cd_json_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
sed "s#__CACHE_DIR__#$cd_fixture/cache#g" "$cd_fixture/installed_plugins.json" > "$cd_json_tmp"
run_case_firstline "cache-differs" 1 "BLOCK cache-differs" -- \
  sh "$script_tmp" "$cd_fixture/repo" "$cd_json_tmp"
rm -f "$cd_json_tmp"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "SKILL-FRESHNESS FIXTURES: all green"; else echo "SKILL-FRESHNESS FIXTURES: at least one FAIL"; fi
exit $fail
