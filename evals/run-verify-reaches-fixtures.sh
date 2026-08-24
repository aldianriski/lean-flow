#!/bin/sh
# run-verify-reaches-fixtures.sh -- fixtures for scripts/lib/check-verify-reaches.sh (SPRINT-082 T3).
#
# The checker exists because §9's existing rule (S9.VERIFYCLAUSE) asks whether a ticked criterion NAMES
# a verification method, and passes on a method that cannot examine its own subject. L-136's fourth
# sighting is the worked case: a `Verify:` naming check-doc-caps.sh for three docs/qa/ files, where §2
# states no cap for docs/qa/ -- so it could neither pass nor fail them, ran `66 PASS, 0 FAIL`, and said
# nothing about its named subject. Retained per L-058 and TD-012.
#
# Each FAIL case asserts on the checker's OWN NAMED FINDING (L-058). Cases 1 and 2 differ in exactly
# one token -- alpha vs beta -- which is what makes them a discrimination rather than two assertions.
#
# Case 2 carries weight beyond being a control: this REPOSITORY's own sprint file reports 0 confirmed
# targets, so its green is vacuous and could not distinguish a working checker from a broken one. The
# positive path exists here or nowhere (L-156, the SPRINT-080 shape).
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-verify-reaches-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
checker="$repo_root/scripts/lib/check-verify-reaches.sh"
fx="$here/fixtures/verify-reaches"
. "$here/lib/harness-common.sh"

fail=0

# --- case 1: criterion claims docs/beta/, method examines only docs/alpha/ -> FAIL, named --------
run_case_anywhere "unreachable-target-fails" 1 "verify-does-not-reach-target" -- \
  sh "$checker" "$fx/unreachable-target/docs/sprint/SPRINT-960-unreachable.md"

# --- case 2: criterion claims docs/alpha/, method examines docs/alpha/ -> PASS -------------------
# Asserts the DENOMINATOR too: a control reporting 0 examined would be vacuously green (L-156).
run_case_anywhere "reachable-target-passes" 0 "1 claimed target(s) confirmed reachable" -- \
  sh "$checker" "$fx/reachable-target/docs/sprint/SPRINT-961-reachable.md"

# --- case 3: the named method is not in the repo at all -> FAIL, named (the EXISTS half) ---------
run_case_anywhere "method-absent-fails" 1 "verify-method-absent" -- \
  sh "$checker" "$fx/method-absent/docs/sprint/SPRINT-962-absent.md"

# --- case 4: a judgment method (no script named) -> PASS, counted, never pressured ---------------
run_case_anywhere "judgment-only-passes" 0 "judgment-method clause(s) left to G2" -- \
  sh "$checker" "$fx/judgment-only/docs/sprint/SPRINT-963-judgment.md"

# --- case 5: one Plan, two clauses, one violation -> FAIL on that clause only --------------------
# Guards per-clause reading: a reachable target elsewhere must not vouch for an unreachable one here.
run_case_anywhere "mixed-one-bad-fails" 1 "verify-does-not-reach-target" -- \
  sh "$checker" "$fx/mixed-one-bad/docs/sprint/SPRINT-964-mixed.md"

# --- case 6: the method's PROSE names the target, its code does not -> FAIL, named ---------------
# The only case holding the comment-stripping line in place. Found by T3's own seeded-break proof:
# seeding that line away broke nothing any fixture could see, which is exactly how a stripped guard
# clause ships (L-058). Without this case, comment-blindness would let a script vouch for a path it
# never examines -- the self-describing-corpus failure (L-108) that turned this family's must-FAIL
# green on its first run.
run_case_anywhere "prose-mentions-path-fails" 1 "verify-does-not-reach-target" -- \
  sh "$checker" "$fx/prose-mentions-path/docs/sprint/SPRINT-966-prose.md"

# --- case 7: an ARCHIVED sprint carrying the violation -> skipped, exit 0 ------------------------
mkdir -p "$fx/archived/docs/sprint/archive"
cp "$fx/unreachable-target/docs/sprint/SPRINT-960-unreachable.md" \
   "$fx/archived/docs/sprint/archive/SPRINT-965-archived.md" 2>/dev/null
out=$(sh "$checker" "$fx/archived/docs/sprint/archive/SPRINT-965-archived.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && [ -z "$out" ]; then
  echo "PASS fixture(archived-out-of-scope): exit 0 with no output -- archived sprint not re-checked"
else
  echo "FAIL fixture(archived-out-of-scope): exit $rc, output: $out"; fail=1
fi

# --- case 7: no arguments -> the denominator note, never a silent pass ---------------------------
run_case_anywhere "no-input-reports-nothing-verified" 0 "nothing verified" -- \
  sh "$checker"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "VERIFY-REACHES FIXTURES: all green"; else echo "VERIFY-REACHES FIXTURES: at least one FAIL"; fi
exit $fail
