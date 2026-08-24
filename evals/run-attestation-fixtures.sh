#!/bin/sh
# run-attestation-fixtures.sh -- must-FAIL fixtures for §13's five rules, now asserted by
# scripts/lib/conformance-engine.sh (SPRINT-074 T2, TASK-228; repointed off the deleted
# scripts/lib/check-attestation.sh at SPRINT-078 T1).
#
# One case per NAMED finding, because a gate's worst failure is the silent false negative and an
# unnamed FAIL tells a rollup nothing about which leg tripped (L-058). These are RETAINED, not
# scaffolding deleted with the prototype -- deleting them leaves the checker unguarded (TD-012).
#
# The five published §13 finding names, each with its own case:
#   attestation-trailers-incomplete · attestation-not-on-task-commit · evidence-path-unpinned ·
#   attestation-disagrees-with-sprint · attestation-unsigned-claim-only
#
# Plus the three that guard the RULE SOURCE itself, which is what makes "spec-driven" a fact rather
# than a claim in a header comment:
#   spec-table-unreadable  -- a checker that cannot parse its rules must say so, not check nothing
#                             and exit clean. Without this case the whole design degrades silently.
#   rule-unimplemented     -- a rule ADDED to §13 in a later spec version changes this checker's
#                             output with NO code edit. This case is D1's actual test.
#   mark-derived exclusion -- flipping a rule's Mark in the spec stops the checker asserting it.
#                             Proves the implementation-directed skip is DERIVED from the spec's Mark
#                             column, not remembered by the author (sprint D3).
#
# The doctored specs are built by editing a COPY OF THE REAL spec/STANDARD.md, never hand-written
# stubs -- a stub would test this harness's idea of the table rather than the shipped one, and would
# keep passing after the real table's shape drifted.
#
# `unsigned-claim-only` is deliberately the exit-0 case and doubles as the PASS control. Asserting on
# the OUTPUT rather than the status is the only way to tell "reported honestly as Gated" from
# "silently passed" (L-103), and its four PASS lines are what would catch a checker regressed into
# always-FAILing -- which the must-FAIL cases alone cannot show (L-058).
#
# Tier: OPT-IN, not always-on. It builds throwaway git repos via mktemp -d + git init, which is the
# exact cost qa-check.sh's declared rule gates behind QA_FULL ("cheap-and-git-free stays always-on;
# git-repo-building stays opt-in", SPRINT-043 T1 / TD-016). Real git history is not optional here:
# §13 is defined over git objects -- trailers, parents, %G? -- and faking them with hand-passed
# strings would test the harness, not the checker. Every repo built here lives under mktemp -d; this
# runner never writes to the repo under test.
#
# Dependency-free POSIX sh. Run bare: sh evals/run-attestation-fixtures.sh
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
trap 'chmod -R u+w "$work" 2>/dev/null; rm -rf "$work"' EXIT

# --- why a REDUCED spec, not the shipped one --------------------------------------------------------
# SPRINT-078 T1, repointing this suite off the deleted check-attestation.sh. That checker only ever
# evaluated §13, so pointing it at the real spec was safe. The ENGINE dispatches EVERY rule the spec
# publishes, so handing it spec/STANDARD.md would fire ~44 still-`rule-unimplemented` ids against these
# throwaway fixture repos and drown every assertion here in findings this family does not own. The
# spec handed to the engine is therefore a REDUCED COPY keeping only §13's rows -- derived from the
# shipped spec via awk, never hand-authored, so it cannot drift from the table it claims to be
# (run-gates-signed-fixtures.sh's discipline, and this suite now follows it for the same reason).
#
# The fixture repos are UNCHANGED from the checker era: each already builds a git repo with the
# trailers and sprint file the case needs, which is exactly what a repo-dir argument wants. What
# changed is the invocation -- `<repo> <rev>` became `<repo> --spec <reduced> --rev <rev>`.
s13_spec="$work/spec-s13-only.md"
awk '
  /^\| `S13\.[A-Z]/ { print; next }
  $0 !~ /^\| `S[0-9]/ { print }
' "$spec" > "$s13_spec"
# [|] not \| -- GNU grep's BRE reads \| as ALTERNATION, which would match nearly every line via the
# empty left branch rather than a literal pipe (read-spec-rules.sh's house technique, L-108's sibling).
n_kept=$(grep -c '^[|] *`S13\.' "$s13_spec")
[ "$n_kept" -eq 7 ] || { echo "FAIL harness: reduced spec carries $n_kept S13 rows, expected exactly 7 (5 mechanical + 2 implementation-directed)"; exit 2; }
n_other=$(grep -c '^[|] *`S\([0-9]\|1[0-24]\)\.' "$s13_spec")
[ "$n_other" -eq 0 ] || { echo "FAIL harness: reduced spec still carries $n_other non-§13 rule rows; the engine would dispatch rules this suite does not own"; exit 2; }

# att <repo-dir> [rev] [extra engine args...] -- the engine, scoped to §13, standing in for the old
# `sh "$checker" <repo> <rev>`. Trailing arguments are FORWARDED, which is load-bearing: cases 7-9
# override the spec, and an `att` that swallowed them would run all three against the §13 copy and
# report green for the wrong reason. The engine's parser takes the LAST --spec, so an override wins.
att() {
  _d=$1; shift
  if [ "$#" -gt 0 ]; then _r=$1; shift; else _r=HEAD; fi
  sh "$engine" "$_d" --spec "$s13_spec" --rev "$_r" "$@"
}

# Fixed fixture identity and signing explicitly OFF -- never the host's git config. A host with
# commit.gpgsign=true would otherwise sign the fixtures and silently invert the unsigned case, which
# is this suite's load-bearing assertion.
gitc() { git -C "$1" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
         -c commit.gpgsign=false -c gpg.format=openpgp "$@" ; }
commit_msg() {  # commit_msg <dir> <msgfile>
  d=$1; f=$2
  git -C "$d" add -A >/dev/null 2>&1
  git -C "$d" -c user.name='Fixture Bot' -c user.email='fixture@example.com' \
    -c commit.gpgsign=false commit -q -F "$f" >/dev/null 2>&1
}

sprint_file() {  # sprint_file <dir> <gates_signed-value-or-empty>
  mkdir -p "$1/docs/sprint"
  {
    echo '---'
    echo 'sprint: 900'
    echo 'slug: fixture'
    echo 'owner: Maintainer'
    [ -n "$2" ] && echo "gates_signed: $2"
    echo 'status: active'
    echo '---'
    echo ''
    echo '# SPRINT-900 -- fixture'
  } > "$1/docs/sprint/SPRINT-900-fixture.md"
}

# --- the base repo: a well-formed attestation over an unsigned commit ------------------------------
# This is the state §13d's own worked example describes, and the state this repository is actually in.
base="$work/base"
mkdir -p "$base" && git -C "$base" init -q >/dev/null 2>&1 || { echo "FAIL harness: git init failed"; exit 2; }
sprint_file "$base" ""
printf 'seed\n' > "$base/f.txt"
printf 'chore: seed the sprint record\n' > "$work/m0"
commit_msg "$base" "$work/m0"
sign_sha=$(git -C "$base" rev-parse HEAD 2>/dev/null)
[ -n "$sign_sha" ] || { echo "FAIL harness: could not build the seed commit"; exit 2; }

# The record naming the signing sha is written in a LATER commit -- as it must be, since the sha
# cannot be known before the commit exists. The checker's S13.AGREE fallback is what handles this.
sprint_file "$base" "G1,G2 @ $sign_sha"
printf 'one\n' >> "$base/f.txt"
{ printf 'sprint(900) T1: the task commit\n\n'
  printf 'Gate-Signed-By: Fixture Human <human@example.com>\n'
  printf 'Gate: G1,G2\n'
  printf 'Evidence: docs/sprint/SPRINT-900-fixture.md @ %s\n' "$sign_sha"
} > "$work/m1"
commit_msg "$base" "$work/m1"
good_sha=$(git -C "$base" rev-parse HEAD 2>/dev/null)

# --- case 1: unsigned trailers report Gated, NOT Attested, and exit 0 -----------------------------
# The DoD row that matters most: reporting otherwise is the theatre a conformance level exists to
# prevent (ADR-025 · §13c). Exit 0 is correct -- Gated is a level reached, not a defect.
run_case_anywhere "unsigned-reports-gated" 0 "attestation-unsigned-claim-only" -- \
  att "$base" "$good_sha"
# The level line still refuses to say Attested -- the assertion that had to survive the migration
# intact. check-attestation.sh phrased it `level: Gated (not Attested)` from a §13-only ladder of its
# own; the engine publishes one ladder for the whole sweep and phrases the same fact as a hold rung.
# The wording moved, the claim did not, and this case is what proves that rather than assuming it.
run_case_anywhere "unsigned-level-line-says-gated" 0 "level: Gated -- 1 finding(s) at Attested prevent Attested" -- \
  att "$base" "$good_sha"
run_case_anywhere "unsigned-hold-is-not-a-failure" 0 "None is a failure" -- \
  att "$base" "$good_sha"
# ... and never the other way round. A regression that rounded Gated up to Attested would pass both
# assertions above while failing this one.
out=$(att "$base" "$good_sha" 2>&1)
case "$out" in
  *"level: Attested"*) echo "FAIL fixture(unsigned-never-attested): reported Attested over an unsigned commit"; fail=1 ;;
  *) echo "PASS fixture(unsigned-never-attested): Attested never claimed without a good signature" ;;
esac
# The PASS control: four mechanical rules genuinely PASS here, so a checker regressed into
# always-FAILing is caught by this suite and not only by its must-FAIL cases (L-058).
n_pass=$(printf '%s\n' "$out" | grep -c '^PASS  S13\.')
if [ "$n_pass" -eq 4 ]; then
  echo "PASS fixture(pass-control): 4 of 5 mechanical rules PASS; the 5th is the honest Gated note"
else
  echo "FAIL fixture(pass-control): expected 4 PASS S13.* lines, got $n_pass -- output:"; printf '%s\n' "$out"; fail=1
fi
# D3, demonstrated rather than asserted: the two implementation-directed rules are excluded by mark
# and are never emitted as findings an adopter would have to clear.
case "$out" in
  *"S13.NOINFER"*"excluded by mark"*) echo "PASS fixture(impl-directed-excluded): S13.NOINFER excluded by mark, not evaluated" ;;
  *) echo "FAIL fixture(impl-directed-excluded): S13.NOINFER not reported as excluded -- output:"; printf '%s\n' "$out"; fail=1 ;;
esac
if printf '%s\n' "$out" | grep -qE '^(PASS|FAIL)  S13\.(NOINFER|NOTAUTHOR)'; then
  echo "FAIL fixture(impl-directed-not-asserted): an implementation-directed rule was evaluated against the repository"; fail=1
else
  echo "PASS fixture(impl-directed-not-asserted): neither S13.NOINFER nor S13.NOTAUTHOR produced a verdict line"
fi
# Structural sibling of the above, anchored to a DEFINITION position rather than the substring: both
# ids appear in the checker's comments (explaining the exclusion), and a substring grep would read
# that prose as an assertion (L-108).
if grep -qE '^assert_S13_(NOINFER|NOTAUTHOR)\(\)' "$engine"; then
  echo "FAIL fixture(no-impl-directed-assertion): the checker defines an assertion for an implementation-directed rule"; fail=1
else
  echo "PASS fixture(no-impl-directed-assertion): no assert_S13_NOINFER / assert_S13_NOTAUTHOR is defined"
fi

# --- case 2: a commit with no trailers at all -- reported, never read as approval -----------------
# SPRINT-081 T4 CHANGED WHAT THIS CASE ASSERTS, and the old string is the reason. It read
# `no attestation claimed`, which the engine emitted as a plain NOTE -- so a repository claiming
# nothing produced no hold at any level, fell through every rung, and printed `level: Attested` on an
# unsigned tree. §13 says the opposite in as many words: "Attested is not reachable by trailers alone"
# and reaching it "requires commit signing". The incentive was inverted -- claim honestly and unsigned
# -> held at Gated; claim NOTHING -> Attested. This case passed throughout, because asserting the
# finding's TEXT never asked what the finding did to the level.
run_case_anywhere "no-claim-is-not-approval" 0 "attestation-absent" -- \
  att "$base" "$sign_sha"
# The three assertions the old case was missing. Same shape as case 1's, deliberately: a repo that
# claims nothing and a repo that claims unsigned are different facts that must reach the SAME level.
run_case_anywhere "no-claim-level-line-says-gated" 0 "level: Gated -- 1 finding(s) at Attested prevent Attested" -- \
  att "$base" "$sign_sha"
run_case_anywhere "no-claim-hold-is-not-a-failure" 0 "None is a failure" -- \
  att "$base" "$sign_sha"
# ... and never the other way round, with the denominator stated so a case that was never reached is
# visibly untested rather than quietly green (L-156).
out=$(att "$base" "$sign_sha" 2>&1); rc=$?
n_lvl=$(printf '%s\n' "$out" | grep -c '^ *level:')
n_att=$(printf '%s\n' "$out" | grep -c 'level: Attested')
if [ "$rc" -eq 0 ] && [ "$n_lvl" -eq 1 ] && [ "$n_att" -eq 0 ]; then
  echo "PASS fixture(no-claim-never-attested): $n_lvl level line examined, $n_att of them Attested, exit $rc"
else
  echo "FAIL fixture(no-claim-never-attested): $n_lvl level line(s), $n_att Attested, exit $rc -- a tree claiming no attestation was certified at the top level -- output:"; printf '%s\n' "$out"; fail=1
fi

# --- case 3: attestation-trailers-incomplete ------------------------------------------------------
inc="$work/incomplete"
mkdir -p "$inc" && git -C "$inc" init -q >/dev/null 2>&1
sprint_file "$inc" "G1,G2 @ 0000000"
printf 'x\n' > "$inc/f.txt"
{ printf 'sprint(900) T1: gate claimed, approver withheld\n\n'
  printf 'Gate: G1,G2\n'
  printf 'Evidence: docs/sprint/SPRINT-900-fixture.md @ 0000000\n'
} > "$work/m2"
commit_msg "$inc" "$work/m2"
run_case_anywhere "trailers-incomplete" 1 "attestation-trailers-incomplete" -- \
  att "$inc"

# --- case 4: attestation-not-on-task-commit (the merge) -------------------------------------------
mrg="$work/merge"
mkdir -p "$mrg" && git -C "$mrg" init -q >/dev/null 2>&1
sprint_file "$mrg" "G1,G2 @ 0000000"
printf 'a\n' > "$mrg/f.txt"; printf 'base\n' > "$work/m3"; commit_msg "$mrg" "$work/m3"
mrg_base=$(git -C "$mrg" rev-parse HEAD)
git -C "$mrg" checkout -q -b side >/dev/null 2>&1
printf 'b\n' > "$mrg/g.txt"; printf 'side\n' > "$work/m4"; commit_msg "$mrg" "$work/m4"
git -C "$mrg" checkout -q - >/dev/null 2>&1
printf 'c\n' > "$mrg/h.txt"; printf 'main\n' > "$work/m5"; commit_msg "$mrg" "$work/m5"
{ printf 'Merge side -- attestation on the wrong object\n\n'
  printf 'Gate-Signed-By: Fixture Human <human@example.com>\n'
  printf 'Gate: G1,G2\n'
  printf 'Evidence: docs/sprint/SPRINT-900-fixture.md @ %s\n' "$mrg_base"
} > "$work/m6"
git -C "$mrg" -c user.name='Fixture Bot' -c user.email='fixture@example.com' -c commit.gpgsign=false \
  merge --no-ff -q -F "$work/m6" side >/dev/null 2>&1
if [ "$(git -C "$mrg" log -1 --format=%P | wc -w | tr -d ' ')" -lt 2 ]; then
  echo "FAIL harness: could not build a merge commit in $mrg"; fail=1
else
  run_case_anywhere "not-on-task-commit" 1 "attestation-not-on-task-commit" -- \
    att "$mrg"
fi

# --- case 5: evidence-path-unpinned (bare path, no @ <sha>) ---------------------------------------
unp="$work/unpinned"
mkdir -p "$unp" && git -C "$unp" init -q >/dev/null 2>&1
sprint_file "$unp" "G1,G2 @ 0000000"
printf 'x\n' > "$unp/f.txt"
{ printf 'sprint(900) T1: a pointer that will rot\n\n'
  printf 'Gate-Signed-By: Fixture Human <human@example.com>\n'
  printf 'Gate: G1,G2\n'
  printf 'Evidence: docs/sprint/SPRINT-900-fixture.md\n'
} > "$work/m7"
commit_msg "$unp" "$work/m7"
run_case_anywhere "evidence-unpinned" 1 "evidence-path-unpinned" -- \
  att "$unp"

# --- case 5b: pinned, but the pin does not resolve -- a pin that does not resolve is not a pin -----
dead="$work/deadpin"
mkdir -p "$dead" && git -C "$dead" init -q >/dev/null 2>&1
sprint_file "$dead" "G1,G2 @ 0000000"
printf 'x\n' > "$dead/f.txt"
{ printf 'sprint(900) T1: a pin to a path that never existed there\n\n'
  printf 'Gate-Signed-By: Fixture Human <human@example.com>\n'
  printf 'Gate: G1,G2\n'
  printf 'Evidence: docs/sprint/SPRINT-999-gone.md @ 0123456\n'
} > "$work/m8"
commit_msg "$dead" "$work/m8"
run_case_anywhere "evidence-pin-dead" 1 "evidence-path-unpinned" -- \
  att "$dead"

# --- case 6: attestation-disagrees-with-sprint ----------------------------------------------------
dis="$work/disagree"
mkdir -p "$dis" && git -C "$dis" init -q >/dev/null 2>&1
sprint_file "$dis" ""
printf 'seed\n' > "$dis/f.txt"; printf 'seed\n' > "$work/m9"; commit_msg "$dis" "$work/m9"
dis_pin=$(git -C "$dis" rev-parse HEAD)
sprint_file "$dis" "G1 @ $dis_pin"          # the record says G1 only ...
printf 'one\n' >> "$dis/f.txt"
{ printf 'sprint(900) T1: the trailer claims more than the record holds\n\n'
  printf 'Gate-Signed-By: Fixture Human <human@example.com>\n'
  printf 'Gate: G1,G2\n'                    # ... the trailer claims G1,G2
  printf 'Evidence: docs/sprint/SPRINT-900-fixture.md @ %s\n' "$dis_pin"
} > "$work/m10"
commit_msg "$dis" "$work/m10"
run_case_anywhere "disagrees-with-sprint" 1 "attestation-disagrees-with-sprint" -- \
  att "$dis"

# --- case 7: spec-table-unreadable ----------------------------------------------------------------
# The case without which the whole spec-driven design degrades silently: a checker that cannot read
# its rule source would otherwise assert nothing and exit clean (L-058).
printf '# not a standard\n\nNo conformance tables here.\n' > "$work/empty-spec.md"
run_case_anywhere "spec-table-unreadable" 1 "spec-table-unreadable" -- \
  att "$base" "$good_sha" --spec "$work/empty-spec.md"

# --- case 8: rule-unimplemented -- D1's actual test -----------------------------------------------
# A SIXTH mechanical rule is added to §13's table in a copy of the reduced spec. No code changes. The
# engine must notice the rule it has no assertion for and report it. If this case fails, the engine is
# not reading the spec whatever its header claims.
#
# THE EXIT CODE CHANGED HERE, AND ONLY HERE (SPRINT-078 T1). check-attestation.sh reported an
# unimplemented rule as a FAIL and exited 1. The engine rules it a GAP that deliberately enters
# neither the level nor the exit code, because a `rule-unimplemented` is a statement about THIS ENGINE
# and never about the repository under test -- the ruling SPRINT-075 T3 was created to make, after a
# first run against a stranger's repo returned 58 FAIL lines of which 56 were our own missing
# assertions. The finding is still NAMED, every time, which is the part L-058 cares about; what it no
# longer does is set an adopter's exit code over our roadmap. So the assertion below moves from "exit
# 1" to "exit 0 AND the gap is named on a GAP line" -- strictly more specific than what it replaced,
# because it now also pins WHICH line class carries it.
awk '
  /^\| `S13\.UNSIGNEDCLAIM` \|/ {
    print
    print "| `S13.NEWRULE` | Attested | mechanical | a rule this engine has never heard of |"
    next
  }
  { print }
' "$s13_spec" > "$work/spec-plus-rule.md"
grep -q 'S13.NEWRULE' "$work/spec-plus-rule.md" || { echo "FAIL harness: could not inject a rule into the spec copy"; fail=1; }
out=$(att "$base" "$good_sha" --spec "$work/spec-plus-rule.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && printf '%s\n' "$out" | grep -qE '^GAP   S13\.NEWRULE .*rule-unimplemented'; then
  echo "PASS fixture(rule-unimplemented): a rule added to the spec is named as an engine gap -- no code change, and it does not set the adopter's exit code"
else
  echo "FAIL fixture(rule-unimplemented): exit $rc; expected 0 with a GAP line naming S13.NEWRULE -- output:"
  printf '%s\n' "$out"; fail=1
fi

# --- case 9: the exclusion is DERIVED from the Mark column, not remembered ------------------------
# S13.TRAILERS is re-marked implementation-directed in a copy of the real spec. The checker must stop
# asserting it -- with no code change. This is what separates (a) from (c) in the design ruling: a
# hard-coding checker would carry on evaluating it and pass this suite's other cases unchanged.
awk '
  /^\| `S13\.TRAILERS` \|/ { print "| `S13.TRAILERS` | — | **implementation-directed** | re-marked by the fixture |"; next }
  { print }
' "$s13_spec" > "$work/spec-remarked.md"
out=$(att "$base" "$good_sha" --spec "$work/spec-remarked.md" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && printf '%s\n' "$out" | grep -q 'S13.TRAILERS *-- excluded by mark' &&
   ! printf '%s\n' "$out" | grep -qE '^PASS  S13\.TRAILERS'; then
  echo "PASS fixture(mark-derived-exclusion): re-marking a rule in the spec stopped the checker asserting it -- no code change"
else
  echo "FAIL fixture(mark-derived-exclusion): exit $rc; the checker kept its own idea of the rule set -- output:"
  printf '%s\n' "$out"; fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "ATTESTATION FIXTURES: all green"; else echo "ATTESTATION FIXTURES: at least one FAIL"; fi
exit $fail
