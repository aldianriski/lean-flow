#!/usr/bin/env sh
# check-count-claims.sh -- verifies every hand-written count claim against what is actually on disk
# (SPRINT-055 T1, TASK-166; extracted from qa-check.sh leg 2 so the check itself can be negative-
# tested against fixtures -- an inline block bound to the live repo's paths cannot be).
#
# The failure this exists to stop is drift, not error: a number written into prose is correct on the
# day it is written and silently wrong forever after. README.md is the recorded case -- it claimed
# "30 canonical doc templates ... = 32 total" while .claude/CLAUDE.md and docs/architecture/
# overview.md both read 32 core / 34 total, because leg 2 guarded those two surfaces and never the
# README. The claim nothing checks is the claim that drifts (same family as TD-041).
#
# Both halves of every claim are checked. Guarding the core count alone would have left "= 32 total"
# -- the half that actually drifted -- unwatched.
#
# Usage: sh check-count-claims.sh <repo-root>
# Prints one PASS/FAIL line per claim; exits 1 if any FAIL line was printed, 0 otherwise.
# A missing claim file is a skip, not a FAIL (a consumer repo need not carry all three surfaces);
# a file that exists but carries no matching claim IS a FAIL -- that is how a silently deleted or
# reworded claim gets caught rather than passing as "nothing to check".
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

root=${1:?usage: check-count-claims.sh <repo-root>}
[ -d "$root" ] || { echo "FAIL count-claims: repo root not found at $root"; exit 2; }

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

# Extract the first integer matching <pattern> in <file>.
num() { grep -oE "$2" "$1" 2>/dev/null | grep -oE '[0-9]+' | head -n1; }

skills_actual=$(ls -d "$root"/skills/*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
tmpl_files=$(ls "$root"/skills/lean-doc-generator/templates/*.md.template 2>/dev/null | wc -l | tr -d ' ')
noncore=2   # canonical-but-non-core templates (outside the doc-generation loop): DESIGN, QA-TESTCASE
tmpl_core=$((tmpl_files - noncore))

check_claim() { # <label> <actual> <file-relative-to-root> <pattern>
  lbl=$1; act=$2; rel=$3; pat=$4; file="$root/$rel"
  [ -f "$file" ] || { note "skip (missing): $rel"; return; }
  claim=$(num "$file" "$pat")
  if   [ -z "$claim" ];       then bad "$lbl: no claim found in $rel"
  elif [ "$claim" = "$act" ]; then ok  "$lbl: $rel claims $claim = disk $act"
  else                             bad "$lbl: $rel claims $claim != disk $act"
  fi
}

check_claim "skills"     "$skills_actual" .claude/CONTEXT.md             'Skill roster \(([0-9]+)'
check_claim "skills"     "$skills_actual" docs/architecture/overview.md  '([0-9]+) skills'
check_claim "skills"     "$skills_actual" .claude/CLAUDE.md              '([0-9]+) SKILL\.md'

check_claim "tmpl-core"  "$tmpl_core"     .claude/CLAUDE.md              '([0-9]+) canonical doc templates'
check_claim "tmpl-core"  "$tmpl_core"     docs/architecture/overview.md  '([0-9]+) canonical doc templates'
check_claim "tmpl-core"  "$tmpl_core"     README.md                      '([0-9]+) canonical doc templates'

check_claim "tmpl-total" "$tmpl_files"    .claude/CLAUDE.md              '= ([0-9]+) total'
check_claim "tmpl-total" "$tmpl_files"    docs/architecture/overview.md  '= ([0-9]+) total'
check_claim "tmpl-total" "$tmpl_files"    README.md                      '= ([0-9]+) total'

note "templates: $tmpl_files files = $tmpl_core core + $noncore non-core (DESIGN, QA-TESTCASE)"

# doc-vs-script drift guard: docs/QA.md's stated non-core count must match $noncore above, else the
# script and its own doc can silently disagree (TASK-112).
if [ -f "$root/docs/QA.md" ]; then
  qa_noncore=$(num "$root/docs/QA.md" '[0-9]+ non-core \(DESIGN, QA-TESTCASE\)')
  if   [ -z "$qa_noncore" ];           then bad "qa.md non-core claim: no claim found in docs/QA.md"
  elif [ "$qa_noncore" = "$noncore" ]; then ok "qa.md non-core claim: docs/QA.md claims $qa_noncore = script $noncore"
  else                                      bad "qa.md non-core claim: docs/QA.md claims $qa_noncore != script $noncore"
  fi
else
  note "skip (missing): docs/QA.md"
fi

exit $fail
