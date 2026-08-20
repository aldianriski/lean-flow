#!/bin/sh
# run-foreign-repo-fixtures.sh -- SPRINT-075 T3. The engine run against a repository that has never
# seen lean-flow, built here from scratch.
#
# EPIC-004's headline claim is that an adopter gets a named answer. Every other harness in this
# directory measures the engine against fixtures WE shaped, and all 43 `build` dispositions were
# judged against THIS repository by the people who wrote the standard. So the claim had never actually
# been tested against a tree that never agreed to any of it -- which is this file.
#
# --- the one rule this harness must not break -----------------------------------------------------
# NO lean-flow file is copied into the target. Every file below is written with printf, from nothing.
# Copying even a template in would quietly restore the conventions being tested for absence, and the
# run would measure our own shape wearing a stranger's name (L-015 · L-016: when the repo cannot
# dogfood a feature, verify on the CONSUMER path -- do not read "it works here" as either result).
# The spec is the exception and must be the real one: an adopter is measured against the shipped
# standard, not a reduced copy. That is also what makes this the suite's most honest run.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-foreign-repo-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"
. "$here/lib/harness-common.sh"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

# --- the stranger ---------------------------------------------------------------------------------
# A small JS library with a README, one source file, one doc, and a package.json. Nothing here follows
# any lean-flow convention: no TODO.md, no docs/sprint/, no ownership headers, no .claude/ directory.
foreign="$work/acme-widget"
mkdir -p "$foreign/src" "$foreign/docs"
printf '# acme-widget\n\nA small library that does one thing.\n\n## Install\n\n    npm i acme-widget\n' > "$foreign/README.md"
printf 'export const widget = () => 42;\n' > "$foreign/src/index.js"
printf '# Architecture\n\nThe widget talks to the store.\n' > "$foreign/docs/architecture.md"
printf '{"name":"acme-widget","version":"1.0.0"}\n' > "$foreign/package.json"

# Guard the rule above mechanically rather than trusting the code just above it to stay true: assert
# the target contains exactly the four files written here and nothing else. A future edit that copies
# a template in fails HERE, loudly, instead of quietly making the run meaningless (L-058).
n_files=$(find "$foreign" -type f | wc -l | tr -d ' ')
if [ "$n_files" -eq 4 ]; then
  echo "PASS fixture(built-from-scratch): the target holds exactly the 4 files this harness wrote; no lean-flow file was copied in"
else
  echo "FAIL fixture(built-from-scratch): target holds $n_files files, expected 4 -- something was copied in"
  find "$foreign" -type f
  fail=1
fi

out=$(sh "$engine" "$foreign" --spec "$spec" 2>&1); rc=$?

# --- DoD 2a: it emits a level, and named findings -------------------------------------------------
if printf '%s\n' "$out" | grep -qE '^ +level: ' &&
   printf '%s\n' "$out" | grep -qE '^FAIL  [a-z-]+: '; then
  echo "PASS fixture(level-and-named-findings): the report states a level and carries at least one named finding"
else
  echo "FAIL fixture(level-and-named-findings): expected a level line and a named finding -- got exit $rc:"
  printf '%s\n' "$out"; fail=1
fi

# --- DoD 2b: NOTHING for judgment-only / implementation-directed rules ----------------------------
# Read as "no VERDICT line", which is the reading §14 and EPIC-004 D1 both require: a conformant
# report names its judgment-required items, so emitting nothing at all about them would breach the
# epic's own definition while satisfying a literal reading of the word. What must never appear is a
# PASS/FAIL/GAP verdict against a rule no adopter could ever clear. Stated here rather than resolved
# silently, because reinterpreting a DoD to fit what was built is the failure L-088 names.
if printf '%s\n' "$out" | grep -qE '^(PASS|FAIL|GAP) +S[0-9]+\.[A-Z0-9]+ +-- +(judgment-required|excluded by mark)'; then
  echo "FAIL fixture(no-verdict-for-unevaluable-rules): a judgment-only / implementation-directed rule appeared as a verdict line:"
  printf '%s\n' "$out" | grep -E '^(PASS|FAIL|GAP) +S[0-9]+\.[A-Z0-9]+ +-- +(judgment-required|excluded by mark)'
  fail=1
else
  n_judg=$(printf '%s\n' "$out" | grep -c 'judgment-required')
  n_excl=$(printf '%s\n' "$out" | grep -c 'excluded by mark')
  echo "PASS fixture(no-verdict-for-unevaluable-rules): $n_judg judgment-required and $n_excl implementation-directed rule(s) reported as notes, none as a verdict"
fi

# --- the separation T3 bought: engine gaps are not the stranger's findings ------------------------
# Before this, the same run returned 58 FAIL lines -- 56 of them our own unimplemented rules -- under
# "level: none, 41 findings prevent Structural", against a repo with two actual defects. The assertion
# is not "few findings"; it is that the two axes are reported apart, which is what makes either
# number mean anything.
n_fail=$(printf '%s\n' "$out" | grep -c '^FAIL  ')
n_gap=$(printf '%s\n' "$out" | grep -c '^GAP   ')
if [ "$n_gap" -gt 0 ] && [ "$n_fail" -gt 0 ] &&
   printf '%s\n' "$out" | grep -qE '^ +level: none -- Structural not yet reached\. '"$n_fail"' finding' &&
   printf '%s\n' "$out" | grep -q 'coverage:'; then
  echo "PASS fixture(gaps-not-counted-against-the-stranger): $n_fail repository finding(s) drive the level; $n_gap engine gap(s) are reported on their own coverage axis"
else
  echo "FAIL fixture(gaps-not-counted-against-the-stranger): expected the level to count only the $n_fail FAIL line(s), with $n_gap gaps held separate -- got:"
  printf '%s\n' "$out"; fail=1
fi

# --- every finding is actionable BY THAT REPO'S OWNER ---------------------------------------------
# DoD 3's mechanical half. The written triage lives in the sprint's Execution Log; what is retained
# here is the property that triage established: every FAIL line names a file IN THE TARGET and a rule
# whose fix is stated in the finding itself. A finding naming a path the stranger does not have is an
# artefact of dispositions written against our shape -- and per the Plan it routes back to
# conformance-dispositions.md rather than being tuned away here.
unactionable=""
for f in $(printf '%s\n' "$out" | sed -n 's/^FAIL  [a-z-]*: \([^ ]*\) .*/\1/p'); do
  [ -e "$foreign/$f" ] || unactionable="$unactionable $f"
done
if [ -z "$unactionable" ]; then
  echo "PASS fixture(findings-name-files-that-exist): every named finding points at a file the target actually has"
else
  echo "FAIL fixture(findings-name-files-that-exist): finding(s) name paths absent from the target --$unactionable"
  echo "  (per the Plan this is evidence about docs/research/conformance-dispositions.md, not a reason to quieten the engine)"
  fail=1
fi

# --- a stranger with nothing wrong must come out clean --------------------------------------------
# The control for the case above: give the same repo the ownership header the two findings asked for
# and the report must go green, or the findings were not actionable in the only sense that matters.
printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When the architecture changes\nstatus: current\n---\n\n# Architecture\n\nThe widget talks to the store.\n' > "$foreign/docs/architecture.md"
out2=$(sh "$engine" "$foreign" --spec "$spec" 2>&1); rc2=$?
if [ "$rc2" -eq 0 ] && ! printf '%s\n' "$out2" | grep -q '^FAIL  '; then
  echo "PASS fixture(acting-on-the-findings-clears-them): applying exactly what the two findings asked for cleared both -- exit 0, no FAIL line"
else
  echo "FAIL fixture(acting-on-the-findings-clears-them): the fix the findings prescribed did not clear them -- exit $rc2:"
  printf '%s\n' "$out2" | grep '^FAIL  '
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "FOREIGN-REPO FIXTURES: all green"
else
  echo "FOREIGN-REPO FIXTURES: FAILURES ABOVE"
fi
exit $fail
