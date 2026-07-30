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
nightrun="$here/../skills/orchestrator/references/night-run.md"
[ -f "$nightrun" ] || { echo "FAIL harness: night-run.md not found at $nightrun"; exit 2; }

script_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
trap 'rm -f "$script_tmp"' EXIT

awk '/<!-- skill-freshness-check:start -->/{f=1;next} /<!-- skill-freshness-check:end -->/{f=0} f' "$nightrun" \
  | grep -v '^```' > "$script_tmp"
[ -s "$script_tmp" ] || { echo "FAIL harness: no snippet extracted between the anchors in $nightrun"; exit 2; }

fail=0
run_case() { # <label> <repo-root> <installed-json> <expected-exit> <expected-finding-substring>
  label=$1; root=$2; ijson=$3; want_exit=$4; want_find=$5
  out=$(sh "$script_tmp" "$root" "$ijson" 2>&1)
  got_exit=$?
  first_line=$(printf '%s\n' "$out" | head -n1)
  if [ "$got_exit" != "$want_exit" ]; then
    echo "FAIL fixture($label): exit $got_exit, expected $want_exit -- output: $first_line"
    fail=1
    return
  fi
  case "$first_line" in
    *"$want_find"*) echo "PASS fixture($label): exit $got_exit, finding matches '$want_find' -- $first_line" ;;
    *)
      echo "FAIL fixture($label): exit matched but finding missing '$want_find' -- got: $first_line"
      fail=1
      ;;
  esac
}

# --- case 1: no local plugin repo -> SKIP (exit 0), finding: no-local-repo -----------------
run_case "no-local-repo" \
  "$here/fixtures/skill-freshness/no-local-repo" \
  "$here/fixtures/skill-freshness/no-local-repo/does-not-exist.json" \
  0 "SKIP no-local-repo"

# --- case 2: installed version != repo manifest version -> BLOCK, finding: stale-release ---
run_case "stale-release" \
  "$here/fixtures/skill-freshness/stale-release/repo" \
  "$here/fixtures/skill-freshness/stale-release/installed_plugins.json" \
  1 "BLOCK stale-release"

# --- case 3: cache skills/ differs from repo's -> BLOCK, finding: cache-differs -----------
# installPath is templated ("__CACHE_DIR__") because a committed fixture can't hardcode this
# machine's absolute checkout path -- substitute it into a throwaway copy before running.
cd_fixture="$here/fixtures/skill-freshness/cache-differs"
cd_json_tmp=$(mktemp) || { echo "FAIL harness: mktemp failed"; exit 2; }
sed "s#__CACHE_DIR__#$cd_fixture/cache#g" "$cd_fixture/installed_plugins.json" > "$cd_json_tmp"
run_case "cache-differs" "$cd_fixture/repo" "$cd_json_tmp" 1 "BLOCK cache-differs"
rm -f "$cd_json_tmp"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "SKILL-FRESHNESS FIXTURES: all green"; else echo "SKILL-FRESHNESS FIXTURES: at least one FAIL"; fi
exit $fail
