#!/bin/sh
# run-authority-fixtures.sh -- retained fixtures for scripts/lib/check-authority.sh
# (SPRINT-088 T1, TASK-292, EPIC-015 § Closed-when 3). Tier G per ADR-029 and this sprint's D4: a
# false negative in an authority classification is silent by construction -- the run reports success,
# the DoD is ticked, and nothing anywhere records that a human was skipped.
#
# Retained, not scaffolding (TD-012): deleting these with the prototype leaves the guard unguarded.
#
# --- why each case has a SIBLING inside the same fixture file -----------------------------------
# A must-FAIL case that reddens proves the checker can emit a finding; it does not prove the checker
# DISCRIMINATES. A demolition reddens too. So every must-FAIL fixture below pairs the offending task
# with a well-formed sibling in the SAME file, and the assertion demands the sibling's PASS line in
# the same output as the offender's FAIL. A regression that reddens everything fails these cases just
# as loudly as one that reddens nothing (L-142).
#
# --- why the fixture directories are not named after the findings -------------------------------
# `missing-class/`, `j2-executed/` -- never `authority-undeclared/`. A markdown corpus is
# self-describing and the finding text embeds the fixture PATH, so a directory named after the token
# its own assertion greps for would match on the path alone and pass with the check torn out
# (L-108). The assertion strings below all carry the `authority-` prefix, which appears only on a
# real finding label.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-authority-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-authority.sh"
fx="$here/fixtures/authority"
. "$here/lib/harness-common.sh"

[ -f "$checker" ] || { echo "FAIL harness: checker not found at $checker"; exit 2; }
[ -d "$fx" ]      || { echo "FAIL harness: fixture tree not found at $fx"; exit 2; }

fail=0

# --- case 1 (must-FAIL): a task with no authority class is REFUSED, never defaulted -------------
# The load-bearing direction. Part 0's invariant is that an unasked question is a BLOCK, so an
# undeclared class must read as J2 (the safe end) and be reported -- a checker that silently
# defaulted it to J0 would hand an unclassified task to an unattended run as if approved.
run_case_anywhere "undeclared-is-refused" 1 "authority-undeclared:" -- \
  sh "$checker" "$fx/missing-class/SPRINT-901-fx.md"

# --- case 1b: ...and the DECLARED sibling in that same file still PASSES -------------------------
# This is what separates a discriminating checker from one that reddens on sight.
out=$(sh "$checker" "$fx/missing-class/SPRINT-901-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] &&
   printf '%s\n' "$out" | grep -qE '^FAIL  authority-undeclared: .* T2 ' &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-declared: .* T1 J1$'; then
  echo "PASS fixture(undeclared-discriminates): T2 reddened while its declared sibling T1 stayed green in the same run"
else
  echo "FAIL fixture(undeclared-discriminates): exit $rc -- the checker did not separate the undeclared task from its declared sibling; a break that reddens everything is not a discrimination (L-142) -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 2 (control): every class the standard defines is accepted ------------------------------
# The cheap path, correctly earned. Without this, a checker that rejected J0 outright would still
# pass every must-FAIL case above.
run_case_anywhere "all-classes-accepted" 0 "authority-declared:" -- \
  sh "$checker" "$fx/control-classed/SPRINT-902-fx.md"

# --- case 3 (must-FAIL): a J2 task EXECUTED instead of held ---------------------------------------
# The half only checkable after a run, and the one a false negative hides completely.
run_case_anywhere "j2-executed-is-refused" 1 "authority-j2-not-parked:" -- \
  sh "$checker" "$fx/j2-executed/SPRINT-903-fx.md"

# --- case 3b: ...and the J1 sibling that legitimately ran still PASSES ---------------------------
out=$(sh "$checker" "$fx/j2-executed/SPRINT-903-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] &&
   printf '%s\n' "$out" | grep -qE '^FAIL  authority-j2-not-parked: .* T2 ' &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-declared: .* T1 J1$'; then
  echo "PASS fixture(j2-executed-discriminates): the human-reserved task reddened while the J1 task that legitimately ran stayed green"
else
  echo "FAIL fixture(j2-executed-discriminates): exit $rc -- the checker did not separate an unauthorised execution from a legitimate one -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 3c (TD-123, control): a J2 task EXECUTED ATTENDED -- no park, no `terminal · ` line -----
# anywhere in the log -- is ACCEPTED, not refused. Parking is what an UNATTENDED run does instead of
# asking; an attended run has a live ask channel and never invokes the park protocol, so demanding a
# park record from it inverts the rule. Load-bearing on its own terms (this is the false-FAIL TD-123
# names, reproduced live against this repo's own SPRINT-093 T1/T2 -- see the builder's report), and
# it is case 3's sibling under seeding: a break that makes the checker treat every log as unattended
# reddens THIS case while case 3 (already FAIL) stays exactly as it was, and a break that makes it
# treat every log as attended greens case 3 while this one stays exactly as it was -- two seeds, two
# independent needles (L-142).
run_case_anywhere "j2-attended-executed-is-accepted" 0 "authority-j2-honoured:" -- \
  sh "$checker" "$fx/attended-j2-executed/SPRINT-908-fx.md"

# --- case 3d: ...and the J1 sibling in that same file stays green too -----------------------------
out=$(sh "$checker" "$fx/attended-j2-executed/SPRINT-908-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-j2-honoured: .* T2 executed with no park record' &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-declared: .* T1 J1$' &&
   ! printf '%s\n' "$out" | grep -q '^FAIL'; then
  echo "PASS fixture(attended-j2-executed-discriminates): the attended human-reserved task and its J1 sibling both stayed green, and no FAIL line appeared"
else
  echo "FAIL fixture(attended-j2-executed-discriminates): exit $rc -- an attended J2 completion with no park record should be accepted, not refused -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 3e (TD-124, must-FAIL): the envelope backstop catches what the terminal-line signal alone
# ---  misses -- a reap-gate-class defect leaves NO `terminal · ` line, but a pinned `approval_envelope:`
# recorded before the run fired is independent evidence the checker must still act on. Reproduces the
# exact gap an independent reviewer found in the first cut of this fix: a real committed unattended
# run, unparked J2, zero `terminal · ` lines anywhere, `authority-j2-honoured` PASS.
run_case_anywhere "j2-envelope-backstop-is-refused" 1 "authority-j2-not-parked:" -- \
  sh "$checker" "$fx/envelope-backstop-unattended/SPRINT-909-fx.md"

# --- case 3f: ...and the J1 sibling in that same file stays green -------------------------------
out=$(sh "$checker" "$fx/envelope-backstop-unattended/SPRINT-909-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 1 ] &&
   printf '%s\n' "$out" | grep -qE '^FAIL  authority-j2-not-parked: .* T2 ' &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-declared: .* T1 J1$'; then
  echo "PASS fixture(envelope-backstop-discriminates): the envelope-only unattended violation reddened while the J1 sibling stayed green"
else
  echo "FAIL fixture(envelope-backstop-discriminates): exit $rc -- the envelope backstop did not separate the violation from its sibling -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 3g (TD-124, control): a bare, unindented ``` fence quoting a REAL example `terminal · `
# ---  line -- for illustration only -- does NOT get read as a live rollup. This is case 3c/3d's
# sibling from the other direction: 3c/3d proves "no signal at all -> attended", this proves "a
# signal-SHAPED quote inside a fence -> still attended", which is the specific gap an independent
# reviewer reproduced (a genuine attended case flipped to `authority-j2-not-parked` purely from a
# quoted example). j2-executed (case 3, its log now carries a REAL un-fenced `terminal · ` line)
# already proves the other half of "prove it both ways": a real rollup is still seen after this fix.
run_case_anywhere "j2-fenced-quote-is-accepted" 0 "authority-j2-honoured:" -- \
  sh "$checker" "$fx/attended-fenced-example/SPRINT-910-fx.md"

# --- case 3h: ...and the J1 sibling in that same file stays green, with no FAIL line at all -------
out=$(sh "$checker" "$fx/attended-fenced-example/SPRINT-910-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-j2-honoured: .* T2 executed with no park record' &&
   printf '%s\n' "$out" | grep -qE '^PASS  authority-declared: .* T1 J1$' &&
   ! printf '%s\n' "$out" | grep -q '^FAIL'; then
  echo "PASS fixture(fenced-quote-discriminates): the fenced quote was ignored, T2 and its J1 sibling both stayed green, and no FAIL line appeared"
else
  echo "FAIL fixture(fenced-quote-discriminates): exit $rc -- a quoted example inside a bare fence should not be read as a live rollup -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 4 (control): a J2 task that HELD is accepted -------------------------------------------
# The case that is wrong today if the honoured-half logic inverts. Load-bearing for the same reason
# case 2 is: it is the only case that reddens if the checker starts refusing correct behaviour.
run_case_anywhere "j2-held-is-accepted" 0 "authority-j2-honoured:" -- \
  sh "$checker" "$fx/control-j2-parked/SPRINT-904-fx.md"

# --- case 5: no run yet -> the honoured half is NOT evaluated, and that is not a pass -------------
# A J2 task in a sprint whose Execution Log does not exist has not been violated -- nothing has run.
# Asserting this explicitly stops a future "absent log => honoured" shortcut from scoring a green on
# a sprint where the guarded event simply has not happened yet (the zero-verified-is-a-SKIP shape,
# TD-042).
out=$(sh "$checker" "$fx/control-classed/SPRINT-902-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -q 'authority-j2-honoured'; then
  echo "PASS fixture(no-log-is-not-an-honoured-verdict): a sprint with no Execution Log emitted no honoured/violated verdict"
else
  echo "FAIL fixture(no-log-is-not-an-honoured-verdict): exit $rc -- a sprint that has not run produced an honoured verdict, which is a green over an unexamined case -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 6: a CLOSED sprint is out of scope, and the skip is NOT a pass ------------------------
# The class is declared at promote/G2, both of which sit behind a closed sprint -- enforcing it there
# emits a finding nobody can clear (§14), the same ruling the gates-signed family already made for
# docs/sprint/archive/. Two halves, because only the second is load-bearing: exit 0 alone would also
# be produced by a checker that had silently stopped examining anything, so the skip must be visible
# in the output AND must not wear a PASS label that would let it count as a verified task-check
# (the zero-verified-is-a-SKIP discipline, TD-042).
out=$(sh "$checker" "$fx/closed-out-of-scope/SPRINT-905-fx.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] &&
   printf '%s\n' "$out" | grep -qE '^ +authority: skip \(status: closed' &&
   ! printf '%s\n' "$out" | grep -qE '^(PASS|FAIL) '; then
  echo "PASS fixture(closed-is-out-of-scope): reported as an unlabelled skip, with no PASS/FAIL verdict to be counted as a task-check"
else
  echo "FAIL fixture(closed-is-out-of-scope): exit $rc -- a closed sprint was either enforced against or silently blessed with a verdict label -- output:"
  printf '%s\n' "$out"
  fail=1
fi

# --- case 6b: ...and an ACTIVE sprint with the same defect is still caught -----------------------
# The control that stops case 6 from being satisfied by a checker that skips everything.
run_case_anywhere "active-still-enforced" 1 "authority-undeclared:" -- \
  sh "$checker" "$fx/missing-class/SPRINT-901-fx.md"

# --- case 7 (must-FAIL): a J2 PARKED and then EXECUTED anyway, with no ruling --------------------
# The silent bypass, and the case the first version of this checker could not see: it tested only for
# an ABSENT park record, so any park record -- however stale, however ignored -- read as proof of
# legitimacy. Parking a step and then working it is exactly what Part 0 step 6 forbids. Found by an
# INDEPENDENT reviewer, not by the eight fixtures that already guarded this file (L-165).
run_case_anywhere "j2-park-bypass-is-refused" 1 "authority-j2-park-bypassed:" -- \
  sh "$checker" "$fx/j2-bypassed/SPRINT-906-fx.md"

# --- case 7b (control): a park a human actually RESOLVED is accepted -----------------------------
# Load-bearing: without it, case 7 would also be satisfied by a checker that refused every J2
# execution outright, which would make a legitimate unblock unrepresentable and get the check switched
# off within a week. The `owner-ruling · Tn · ` line is what makes the difference visible at all.
run_case_anywhere "j2-park-ruled-is-accepted" 0 "authority-j2-honoured:" -- \
  sh "$checker" "$fx/control-j2-ruled/SPRINT-907-fx.md"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "AUTHORITY FIXTURES: all green"
else
  echo "AUTHORITY FIXTURES: FAILURES above"
fi
exit $fail
