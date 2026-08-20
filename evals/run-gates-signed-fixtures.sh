#!/bin/sh
# run-gates-signed-fixtures.sh -- fixtures for the S9.GATESWELLFORMED / S9.GATESABSENT family, now
# evaluated by scripts/lib/conformance-engine.sh (SPRINT-075 T4). Migrated from
# scripts/lib/check-gates-signed.sh (deleted this task) -- repointed at the engine, not rewritten:
# every case below is the same case that guarded the standalone checker, retained per TD-012.
#
# The field exists because night-run Part 1 required batch G1/G2 to be "already signed off" and never
# said the sign-off had to live in the sprint artifact. The run reads the sprint file and nothing
# else, so a sign-off held only in the launching session's transcript is invisible to it -- L-099.
#
# The load-bearing case here is case 1, and it is deliberately NOT a FAIL. The failure being guarded
# is a MISSING field read as approval: that would ship an ungated Plan into a headless run where
# nothing can ask. So absence must be reported, visibly, as NOT SIGNED -- never as a gate failure
# either, since a sprint legitimately sits unsigned between promote and the gate pass. Asserting on
# the OUTPUT rather than the status is the only way to tell those apart (L-103).
#
# --- why a REDUCED spec, not the shipped one --------------------------------------------------------
# The engine takes a repo-dir and dispatches EVERY rule the spec publishes, not just this family's
# two. Running it with the real spec/STANDARD.md would also fire every other still-`rule-unimplemented`
# id (61 of them today) against these throwaway fixture dirs, which would make every "should exit 0"
# case here exit 1 for reasons this family does not own. So the spec handed to the engine is a REDUCED
# COPY keeping only S9.GATESWELLFORMED / S9.GATESABSENT's rows -- derived from the shipped spec via
# awk, never hand-authored, matching run-conformance-engine-fixtures.sh's own doctored-copy discipline.
#
# The fixture directory TREE is unchanged from the checker era: each case dir under fixtures/gates-
# signed/<case>/ already shapes a `docs/sprint/SPRINT-NNN-<case>.md` -- exactly the layout a repo-dir
# argument needs, so the fixtures did not need restructuring, only repointing.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-gates-signed-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"
fx="$here/fixtures/gates-signed"
. "$here/lib/harness-common.sh"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

gs_spec="$work/spec-gates-signed-only.md"
awk '
  /^\| `S9\.GATESWELLFORMED`/ || /^\| `S9\.GATESABSENT`/ { print; next }
  $0 !~ /^\| `S[0-9]/ { print }
' "$spec" > "$gs_spec"
# [|] not \| -- GNU grep's BRE reads \| as ALTERNATION (a non-POSIX extension), which would make this
# match nearly every line via the empty left branch, not a literal pipe (read-spec-rules.sh's own
# house technique, L-108's sibling trap, caught here by this very check disagreeing with itself).
n_kept=$(grep -c '^[|] *`S9\.' "$gs_spec")
[ "$n_kept" -eq 2 ] || { echo "FAIL harness: reduced spec carries $n_kept S9 rows, expected exactly 2 (GATESWELLFORMED, GATESABSENT)"; exit 2; }

# --- case 1: field absent -> reported NOT SIGNED, exit 0, never rendered as approval -------------
run_case_anywhere "absent-is-not-approval" 0 "NOT SIGNED (no gates_signed: field)" -- \
  sh "$engine" "$fx/absent" --spec "$gs_spec"

# --- case 1b: ...and "never rendered as approval" is asserted on the VERDICT LABEL, not just text --
# Case 1 checks the finding text and the exit code. Both survive a migration that relabels the line
# `PASS`, which is exactly what happened when this family moved into the engine: the text was
# reproduced verbatim while the verdict class flipped from a note to a pass, so an unsigned sprint
# read as `PASS  ... NOT SIGNED ...` and carried into the summary as a level it had not earned.
# §9's row states the rule as "field absent => NOT SIGNED, never approval" -- so the LABEL is part of
# the contract, and a substring assertion alone cannot see it (SPRINT-075 T4, coordinator review).
out=$(sh "$engine" "$fx/absent" --spec "$gs_spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   printf '%s\n' "$out" | grep -qE '^ +gates-signed: .* -- NOT SIGNED \(no gates_signed: field\)' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL) +gates-signed: .* -- NOT SIGNED' &&
   printf '%s\n' "$out" | grep -qE '^ +counts: 0 passed' &&
   printf '%s\n' "$out" | grep -q 'not evidence of conformance'; then
  echo "PASS fixture(absent-is-not-labelled-a-pass): reported as an unlabelled note; 0 passed, and the level line disclaims conformance rather than implying it"
else
  echo "FAIL fixture(absent-is-not-labelled-a-pass): exit $rc -- an absent gates_signed: field was rendered as a verdict or earned a level. §9 states 'never approval' -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 2: unfilled TEMPLATE PLACEHOLDER counts as absent, not as a value ----------------------
# Without this the shipped template's own placeholder would parse as "present" and bless a sprint
# nobody signed -- the guarded failure reintroduced through the artifact that creates every sprint.
run_case_anywhere "placeholder-counts-as-absent" 0 "NOT SIGNED (no gates_signed: field)" -- \
  sh "$engine" "$fx/placeholder" --spec "$gs_spec"

# --- case 3: present but unparseable -> FAIL ----------------------------------------------------
# A record nobody can parse is worse than none, because it LOOKS like evidence.
run_case_anywhere "malformed-fails" 1 "malformed gates_signed:" -- \
  sh "$engine" "$fx/malformed" --spec "$gs_spec"

# --- case 4: well-formed -> PASS naming the gates and the commit --------------------------------
run_case_anywhere "wellformed-passes" 0 "G1,G2 signed @ 1f0c012" -- \
  sh "$engine" "$fx/wellformed" --spec "$gs_spec"

# --- case 5: an ARCHIVED sprint is out of scope even carrying nonsense --------------------------
# Location-scoped, matching the checker's own rule: a closed sprint is history and its record is not
# re-litigated. The fixture carries a deliberately garbled value so a regression that started checking
# archives would fail loudly here rather than quietly re-opening settled sprints.
#
# The checker-era assertion was "exit 0 with NO output at all" -- the engine can no longer produce
# that literally: it always prints its own header/rule-source/level/counts boilerplate, regardless of
# whether this family found anything to check. What still MUST hold, and is what this case now checks,
# is the same guarantee under the new shape: the archived file's garbled value never surfaces as a
# GATESWELLFORMED/GATESABSENT verdict line, because the non-recursive docs/sprint/*.md glob (S9.LOGDIR)
# never reaches docs/sprint/archive/ in the first place.
out=$(sh "$engine" "$fx/archived" --spec "$gs_spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   ! printf '%s\n' "$out" | grep -q 'total nonsense' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  gates-signed:'; then
  echo "PASS fixture(archived-out-of-scope): exit 0, no GATESWELLFORMED/GATESABSENT verdict line and the archived sprint's garbled value never surfaced -- docs/sprint/archive/ stayed out of scope"
else
  echo "FAIL fixture(archived-out-of-scope): exit $rc, output:"
  printf '%s\n' "$out"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "GATES-SIGNED FIXTURES: all green"; else echo "GATES-SIGNED FIXTURES: at least one FAIL"; fi
exit $fail
