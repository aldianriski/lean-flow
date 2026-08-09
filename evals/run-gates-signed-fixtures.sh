#!/bin/sh
# run-gates-signed-fixtures.sh -- fixtures for scripts/lib/check-gates-signed.sh (SPRINT-057 T5).
#
# The field exists because night-run Part 1 required batch G1/G2 to be "already signed off" and never
# said the sign-off had to live in the sprint artifact. The run reads the sprint file and nothing
# else, so a sign-off held only in the launching session's transcript is invisible to it -- L-099.
#
# The load-bearing case here is case 1, and it is deliberately NOT a FAIL. The failure being guarded
# is a MISSING field read as approval: that would ship an ungated Plan into a headless run where
# nothing can ask. So absence must be reported, visibly, as NOT SIGNED -- never as a pass, and never
# as a gate failure either, since a sprint legitimately sits unsigned between promote and the gate
# pass. Asserting on the OUTPUT rather than the status is the only way to tell those apart (L-103).
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-gates-signed-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-gates-signed.sh"
fx="$here/fixtures/gates-signed"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: field absent -> reported NOT SIGNED, exit 0, never rendered as approval -------------
run_case_anywhere "absent-is-not-approval" 0 "NOT SIGNED (no gates_signed: field)" -- \
  sh "$checker" "$fx/absent/docs/sprint/SPRINT-910-absent.md"

# --- case 2: unfilled TEMPLATE PLACEHOLDER counts as absent, not as a value ----------------------
# Without this the shipped template's own placeholder would parse as "present" and bless a sprint
# nobody signed -- the guarded failure reintroduced through the artifact that creates every sprint.
run_case_anywhere "placeholder-counts-as-absent" 0 "NOT SIGNED (no gates_signed: field)" -- \
  sh "$checker" "$fx/placeholder/docs/sprint/SPRINT-911-placeholder.md"

# --- case 3: present but unparseable -> FAIL ----------------------------------------------------
# A record nobody can parse is worse than none, because it LOOKS like evidence.
run_case_anywhere "malformed-fails" 1 "malformed gates_signed:" -- \
  sh "$checker" "$fx/malformed/docs/sprint/SPRINT-912-malformed.md"

# --- case 4: well-formed -> PASS naming the gates and the commit --------------------------------
run_case_anywhere "wellformed-passes" 0 "G1,G2 signed @ 1f0c012" -- \
  sh "$checker" "$fx/wellformed/docs/sprint/SPRINT-913-wellformed.md"

# --- case 5: an ARCHIVED sprint is out of scope even carrying nonsense --------------------------
# Location-scoped, matching T4: a closed sprint is history and its record is not re-litigated. The
# fixture carries a deliberately garbled value so a regression that started checking archives would
# fail loudly here rather than quietly re-opening settled sprints.
out=$(sh "$checker" "$fx/archived/docs/sprint/archive/SPRINT-914-archived.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && [ -z "$out" ]; then
  echo "PASS fixture(archived-out-of-scope): exit 0 with no output -- archived sprint not re-checked"
else
  echo "FAIL fixture(archived-out-of-scope): exit $rc, output: $out"; fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "GATES-SIGNED FIXTURES: all green"; else echo "GATES-SIGNED FIXTURES: at least one FAIL"; fi
exit $fail
