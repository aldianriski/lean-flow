#!/bin/sh
# run-qa-budget-fixtures.sh -- fixtures for scripts/lib/qa-budget-check.sh (SPRINT-084 T1, TD-084).
#
# TD-084: qa-check.sh was killed three times by an EXTERNAL timeout with no verdict line printed at
# all. This suite guards the mechanism that keeps a FUTURE regression from reproducing that shape
# silently: qa_budget_check must actually detect an over-budget run and say so (case 2), must stay
# quiet on an ordinary in-budget run (case 1, the sibling control), and must not fire at all when a
# run has deliberately opted into the heavy legs via QA_FULL (case 3 -- the "heavy legs stay
# reachable" constraint depends on the budget NOT gating that path). Every case here runs the real
# function against a synthetic start time -- no sleeping, no real over-budget run needed to prove the
# detection fires.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-qa-budget-fixtures.sh

set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
lib="$repo_root/scripts/lib/qa-budget-check.sh"
. "$here/lib/harness-common.sh"

[ -f "$lib" ] || { echo "FAIL harness: lib not found at $lib"; exit 2; }

fail=0
now=$(date +%s)
far_past=$((now - 9999))

# --- case 1 (PASS control): an ordinary in-budget run reports OK, exit 0 -------------------------
# `start` is "now", budget is generous -- elapsed is ~0s, nowhere near the budget. This is the sibling
# control the must-FAIL case below is checked against: it must stay green when the mechanism is
# working AND stay green even when case 2's break is seeded (the break below only inverts the
# over-budget comparison, which this case's near-zero elapsed never reaches either way).
#
# NOT an exact "OK 0 300" match: `now` is captured once above, and qa_budget_check takes its OWN
# `date +%s` reading a moment later -- if a wall-clock second boundary falls between the two calls,
# elapsed reads 1, not 0. Caught live: this exact line flaked green-then-red across two otherwise
# identical runs of this file before the pattern below replaced the exact match (self-referential,
# but the fixture's own history is the evidence). A handful of seconds is still nowhere near a
# 300s budget, which is the property being proved.
out1=$(sh -c ". '$lib' && qa_budget_check $now 300 0" 2>&1); rc1=$?
if [ "$rc1" -eq 0 ] && printf '%s' "$out1" | grep -qE '^OK [0-9] 300$'; then
  echo "PASS fixture(in-budget-reports-ok): exit $rc1, $out1"
else
  echo "FAIL fixture(in-budget-reports-ok): exit $rc1 -- output: $out1"; fail=1
fi

# --- case 2 (must-FAIL of the SCENARIO / must-PASS of the fixture): a run whose start is far in the
# past against a tiny budget is detected as OVER, exit 1, and the elapsed/budget numbers are the ones
# named -- never silently reported as OK. This is TD-084's shape in miniature: a run that WOULD run
# past its budget must say so, not just keep going. If qa_budget_check's comparison is ever broken
# (see the discrimination proof this fixture's own history records), THIS case is the one that reddens.
out=$(sh -c ". '$lib' && qa_budget_check $far_past 1 0" 2>&1); rc=$?
# Elapsed is measured a second time INSIDE qa_budget_check (a fresh `date +%s`), so it can read one
# second higher than `far_past`'s own computation here -- exact-second matching would be flaky by
# construction. The budget figure and the OVER/rc=1 shape are what the case is actually proving.
if [ "$rc" -eq 1 ] && printf '%s' "$out" | grep -qE '^OVER [0-9]+ 1$'; then
  echo "PASS fixture(over-budget-reports-over): exit $rc, $out"
else
  echo "FAIL fixture(over-budget-reports-over): exit $rc -- output: $out"; fail=1
fi

# --- case 3 (PASS control): QA_FULL's bypass -- a run that opted into the heavy legs is NEVER
# reported as over-budget, however far in the past its start is. Constraint: heavy legs remain
# reachable under their explicit flag, not squeezed by this guard.
run_case_anywhere "qa-full-bypasses-budget" 0 "OK 0 1" -- \
  sh -c ". '$lib' && qa_budget_check $far_past 1 1"


# =================================================================================================
# SPRINT-099 T2 (TD-117 + TD-128): truncation is an OUTCOME, distinct from a failure.
#
# T1 reproduced the defect five times out of five: every completed gate run printed `N pass, 1 fail`
# while having skipped 13 harnesses -- two of them the guards of this very budget mechanism. The
# verdict was byte-indistinguishable from an ordinary red gate. These cases guard the three functions
# that make it distinguishable, at function level, because the alternative is a ~550s gate run that
# itself truncates -- a guard testable only by a run that reproduces the bug is not a guard.
# =================================================================================================

# --- case 4 (must-FAIL of the SCENARIO): the truncation line names elapsed, budget, where it stopped,
# and every unrun item BY NAME. A count alone is what T2's DoD explicitly rejects. If the naming is
# ever dropped -- or the elapsed figure hardcoded -- this case reddens.
out4=$(sh -c ". '$lib' && qa_truncation_line \"eval harness 'run-foo.sh'\" 526 520 \"run-foo.sh
run-bar.sh\"" 2>&1); rc4=$?
if [ "$rc4" -eq 0 ] \
  && printf '%s' "$out4" | grep -q 'TRUNCATED' \
  && printf '%s' "$out4" | grep -q '526s' \
  && printf '%s' "$out4" | grep -q '520s' \
  && printf '%s' "$out4" | grep -q 'run-foo.sh' \
  && printf '%s' "$out4" | grep -q 'run-bar.sh' \
  && printf '%s' "$out4" | grep -q '2 item(s) UNRUN'; then
  echo "PASS fixture(truncation-names-elapsed-and-every-unrun-item): $out4"
else
  echo "FAIL fixture(truncation-names-elapsed-and-every-unrun-item): exit $rc4 -- output: $out4"; fail=1
fi

# --- case 5 (must-FAIL of the SCENARIO): an EMPTY unrun set is reported as a defect, exit 1 -- never
# as a clean-looking truncation line. Truncating with nothing left to run is a contradiction, so a
# guard that cannot derive its own subject must say so rather than print something reassuring (L-058).
out5=$(sh -c ". '$lib' && qa_truncation_line \"checkpoint 'leg 9'\" 530 520 ''" 2>&1); rc5=$?
if [ "$rc5" -eq 1 ] && printf '%s' "$out5" | grep -q 'EMPTY'; then
  echo "PASS fixture(empty-unrun-set-is-a-defect-not-good-news): exit $rc5"
else
  echo "FAIL fixture(empty-unrun-set-is-a-defect-not-good-news): exit $rc5 -- output: $out5"; fail=1
fi

# --- case 6 (SELECTION axis, not verdict -- L-186): the unrun set is selected by EXACT member match,
# never by substring. This is drawn from the REAL registry, not invented: `eval_harnesses_always`
# contains BOTH `run-qa-budget-fixtures.sh` and `run-qa-budget-default-fixtures.sh`, and the first is
# a proper substring of the second. A substring-based selection would, on tripping at
# `run-qa-budget-default-fixtures.sh`, wrongly also match the shorter name and mis-report which
# guards were skipped. Every other case here varies the VERDICT; this one varies WHICH MEMBER IS
# REACHED, which is the property no verdict-varying fixture can see.
list6='run-a.sh
run-qa-budget-fixtures.sh
run-qa-budget-default-fixtures.sh
run-z.sh'
out6=$(printf '%s\n' "$list6" | sh -c ". '$lib' && qa_unreached_from run-qa-budget-default-fixtures.sh" | tr '\n' ' ')
if [ "$out6" = "run-qa-budget-default-fixtures.sh run-z.sh " ]; then
  echo "PASS fixture(selection-is-exact-match-not-substring): [$out6]"
else
  echo "FAIL fixture(selection-is-exact-match-not-substring): expected exactly the trip member and its successors -- got [$out6]"; fail=1
fi

# --- case 7 (PASS control, sibling): selection is INCLUSIVE of the member the trip fires on. T1
# confirmed this live -- the gate skipped 13 harnesses starting with the very one it tripped at, so
# an exclusive selection would under-report by exactly one every time.
out7=$(printf 'a\nb\nc\n' | sh -c ". '$lib' && qa_unreached_from b" | tr '\n' ' ')
if [ "$out7" = "b c " ]; then
  echo "PASS fixture(selection-includes-the-member-tripped-on): [$out7]"
else
  echo "FAIL fixture(selection-includes-the-member-tripped-on): expected [b c ] -- got [$out7]"; fail=1
fi

# --- case 8 (TD-128's missing READER): the ACTUAL runtime is asserted against the command ceiling.
# check-qa-budget-default.sh asserts the CONFIGURED budget and is correct within that scope; it is
# deliberately NOT widened (T2 DoD 3). This is the assertion that can go red when a run is genuinely
# too slow, rather than one that restates its own configuration -- the shape that let
# `PASS 520s < 600s command ceiling` print for a run that took 1450s.
now8=$(date +%s)
out8=$(sh -c ". '$lib' && qa_ceiling_check $((now8 - 1000)) 600" 2>&1); rc8=$?
if [ "$rc8" -eq 1 ] && printf '%s' "$out8" | grep -qE '^OVER-CEILING [0-9]+ 600$'; then
  echo "PASS fixture(actual-runtime-over-ceiling-is-detected): exit $rc8, $out8"
else
  echo "FAIL fixture(actual-runtime-over-ceiling-is-detected): exit $rc8 -- output: $out8"; fail=1
fi

# --- case 9 (PASS control, sibling): an ordinary in-ceiling run reports WITHIN-CEILING, exit 0, and
# stays green when case 8's break is seeded -- the pair is what makes case 8 a discrimination rather
# than a smoke test.
out9=$(sh -c ". '$lib' && qa_ceiling_check $(date +%s) 600" 2>&1); rc9=$?
if [ "$rc9" -eq 0 ] && printf '%s' "$out9" | grep -qE '^WITHIN-CEILING [0-9]+ 600$'; then
  echo "PASS fixture(in-ceiling-run-stays-green): exit $rc9, $out9"
else
  echo "FAIL fixture(in-ceiling-run-stays-green): exit $rc9 -- output: $out9"; fail=1
fi

# --- case 10 (SELECTION/FORMAT axis -- the case that was MISSING, and the reason this suite went
# green while the real gate was wrong): items whose names CONTAIN SPACES are counted as one item
# each, not as one item per word. Every other case in this file uses space-free names like
# `run-foo.sh`, an incidental property nobody chose -- and the gate's OTHER caller passes leg labels
# such as "leg 2: count consistency". Pointed at the real gate, the count read 94 while 21 legs were
# named (L-166: fixtures prove a branch works; only the motivating artifact proves the branch is
# reachable for the real input). This case varies that axis deliberately.
out10=$(sh -c ". '$lib' && qa_truncation_line \"checkpoint 'leg 2: count consistency'\" 530 520 \"leg 2: count consistency
leg 2b: epic retention + rollup currency
leg 3: frontmatter/ownership\"" 2>&1); rc10=$?
if [ "$rc10" -eq 0 ] \
  && printf '%s' "$out10" | grep -q '3 item(s) UNRUN' \
  && printf '%s' "$out10" | grep -q 'leg 2b: epic retention' \
  && printf '%s' "$out10" | grep -q 'leg 3: frontmatter/ownership'; then
  echo "PASS fixture(multi-word-items-counted-per-item-not-per-word): 3 counted, all named"
else
  echo "FAIL fixture(multi-word-items-counted-per-item-not-per-word): exit $rc10 -- output: $out10"; fail=1
fi
[ "$fail" -eq 0 ] && echo "PASS harness: qa-budget-check discriminates (case 2 reddens on an over-budget scenario; cases 1/3 stay green)"
exit $fail
