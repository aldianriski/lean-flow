#!/bin/sh
# run-adr-family-fixtures.sh -- fixtures for the §4 ADR family evaluated by
# scripts/lib/conformance-engine.sh: S4.ONEFILE · S4.APPEND · S4.INDEX · S4.SECTIONS · S4.NEGATIVE
# (SPRINT-076 T2).
#
# The five finding names asserted below are the ones ALREADY PUBLISHED in
# docs/research/conformance-dispositions.md § build. This harness CONSUMES that contract; it does not
# invent names to match the code (L-058 -- a check specified without its finding name is a
# half-shipped gate). Every case is RETAINED (TD-012: deleting the fixtures with the prototype leaves
# the gate unguarded).
#
#   adr-path-noncanonical · adr-edited-after-decision · decisions-index-missing-adr ·
#   adr-required-section-missing · adr-no-negative-consequence
#
# --- why a REDUCED spec ----------------------------------------------------------------------------
# Same reasoning as run-ownership-header-fixtures.sh: the engine dispatches EVERY rule the spec
# publishes, so the shipped spec would fire ~56 still-unimplemented ids against these throwaway
# fixture dirs and make every "should exit 0" case exit 1 for reasons this family does not own. The
# spec handed to the engine is a REDUCED COPY keeping only §4's rows, derived from the shipped spec by
# awk -- never hand-authored, so a row that changes shape upstream fails HERE rather than diverging
# silently.
#
# --- the one family member that needs git -----------------------------------------------------------
# S4.APPEND is the only Gated rule here and the only one that reads HISTORY rather than the tree, so
# its cases build throwaway repositories under mktemp -d. Three states are distinguished, and the
# middle one is the whole task: a post-decision MARKER passes, an edited § Decision FAILS, and a repo
# whose history cannot answer says so honestly instead of guessing (A3).
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"
fx="$here/fixtures/adr-family"
. "$here/lib/harness-common.sh"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }
[ -d "$fx" ]     || { echo "FAIL harness: fixtures not found at $fx"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

adr_spec="$work/spec-adr-only.md"
awk '
  /^\| `S4\./ { print; next }
  $0 !~ /^\| `S[0-9]/ { print }
' "$spec" > "$adr_spec"
# [|] not \| -- GNU grep reads \| as ALTERNATION in a BRE, which would match nearly every line via the
# empty left branch (the house technique from read-spec-rules.sh, L-108's sibling trap).
n_kept=$(grep -c '^[|] *`S4\.' "$adr_spec")
[ "$n_kept" -eq 7 ] || {
  echo "FAIL harness: reduced spec carries $n_kept S4 rows, expected exactly 7 (§4 publishes 7 rules)"
  exit 2
}

# --- one retained must-FAIL case per published finding name ---------------------------------------

run_case_anywhere "path-noncanonical-fires" 1 "adr-path-noncanonical: docs/adr/adr-1-loose-name.md" -- \
  sh "$engine" "$fx/path-noncanonical" --spec "$adr_spec"

run_case_anywhere "index-missing-adr-fires" 1 "decisions-index-missing-adr: docs/adr/ADR-001-a-real-decision.md" -- \
  sh "$engine" "$fx/index-missing-row" --spec "$adr_spec"

run_case_anywhere "required-section-missing-fires" 1 "adr-required-section-missing: docs/adr/ADR-001-a-real-decision.md -- Alternatives" -- \
  sh "$engine" "$fx/sections-missing" --spec "$adr_spec"

run_case_anywhere "no-negative-consequence-fires" 1 "adr-no-negative-consequence: docs/adr/ADR-001-a-real-decision.md" -- \
  sh "$engine" "$fx/no-negative" --spec "$adr_spec"

# --- S4.ONEFILE's other two sub-cases -------------------------------------------------------------
# "One file per ADR at docs/adr/ADR-NNN-<slug>.md" is three separate claims, and a rule that only
# checks the filename pattern silently passes the two that actually corrupt an index.

run_case_anywhere "duplicate-number-fires" 1 "adr-path-noncanonical: docs/adr/ADR-001-the-same-number-again.md -- ADR-001 is already claimed by" -- \
  sh "$engine" "$fx/duplicate-number" --spec "$adr_spec"

run_case_anywhere "adr-outside-dir-fires" 1 "adr-path-noncanonical: docs/ADR-002-in-the-wrong-place.md" -- \
  sh "$engine" "$fx/adr-outside-dir" --spec "$adr_spec"

# A MISSING index is a different sub-case from an index with a gap, and the finding must name which.
run_case_anywhere "index-absent-fires" 1 "decisions-index-missing-adr: no decision index found" -- \
  sh "$engine" "$fx/index-absent" --spec "$adr_spec"

# --- PASS control: the rules must stay SILENT on correct input ------------------------------------
# A must-FAIL fixture proves a rule CAN fire. It cannot prove the rule does not fire on everything,
# which is the failure mode that makes a checker unusable rather than merely wrong.

run_case_anywhere "clean-repo-passes" 0 "all 1 ADR(s) sit at a canonical one-file-per-ADR path" -- \
  sh "$engine" "$fx/clean" --spec "$adr_spec"

# --- S4.APPEND: history, not the tree -------------------------------------------------------------

git_repo_from() {   # git_repo_from <dest> <fixture-src>
  dest=$1; src=$2
  mkdir -p "$dest" && cp -R "$src/." "$dest/" || return 1
  git -C "$dest" init -q 2>/dev/null || return 1
  git -C "$dest" add -A >/dev/null 2>&1 || return 1
  git -C "$dest" -c user.name=Fixture -c user.email=fx@example.invalid \
      commit -q -m "the deciding commit" >/dev/null 2>&1 || return 1
}
git_commit_all() {  # git_commit_all <dest> <subject>
  git -C "$1" add -A >/dev/null 2>&1 || return 1
  git -C "$1" -c user.name=Fixture -c user.email=fx@example.invalid \
      commit -q -m "$2" >/dev/null 2>&1 || return 1
}

if ! git --version >/dev/null 2>&1; then
  echo "FAIL harness: git not available -- S4.APPEND's cases cannot be built, and skipping them"
  echo "              silently would report this suite green with its only Gated rule unexercised"
  exit 2
fi

# (a) MUST FAIL -- the § Decision body itself is rewritten after the deciding commit.
edited="$work/append-edited"
git_repo_from "$edited" "$fx/clean" || { echo "FAIL harness: could not build the append-edited repo"; exit 2; }
adr="$edited/docs/adr/ADR-001-a-real-decision.md"
sed 's/^We chose the first option\.$/We chose the second option after all./' "$adr" > "$adr.tmp" && mv "$adr.tmp" "$adr"
grep -q 'second option after all' "$adr" || { echo "FAIL harness: the append-edited seed did not apply"; exit 2; }
git_commit_all "$edited" "quietly rewrite the decision" || { echo "FAIL harness: could not commit the edit"; exit 2; }

run_case_anywhere "edited-after-decision-fires" 1 "adr-edited-after-decision: docs/adr/ADR-001-a-real-decision.md" -- \
  sh "$engine" "$edited" --spec "$adr_spec"

# (b) MUST PASS -- a post-decision MARKER in the header, § Decision untouched. This is the
# distinction the task exists to draw: this repo's own ADR-008 and ADR-027 both carry legitimate
# `Scope amended by:` / refinement markers, and a rule that reddens on them is unusable here before
# it is ever pointed at an adopter.
marked="$work/append-marker"
git_repo_from "$marked" "$fx/clean" || { echo "FAIL harness: could not build the append-marker repo"; exit 2; }
adr="$marked/docs/adr/ADR-001-a-real-decision.md"
awk '{ print }
     /^- \*\*Status:\*\*/ { print "- **Scope amended by:** [ADR-002](ADR-002-a-later-decision.md) (2026-08-21)" }
    ' "$adr" > "$adr.tmp" && mv "$adr.tmp" "$adr"
grep -q 'Scope amended by' "$adr" || { echo "FAIL harness: the append-marker seed did not apply"; exit 2; }
git_commit_all "$marked" "mark the ADR as amended in the open" || { echo "FAIL harness: could not commit the marker"; exit 2; }

run_case_anywhere "post-decision-marker-passes" 0 "1 ADR(s) unedited since their deciding commit" -- \
  sh "$engine" "$marked" --spec "$adr_spec"

# (c) The honest-report case: no history to read. Not a FAIL of the repository -- the rule cannot be
# answered, and saying so is the attestation-style behaviour A3 assumes.
nogit="$work/append-nogit"
mkdir -p "$nogit" && cp -R "$fx/clean/." "$nogit/"
run_case_anywhere "no-git-history-is-reported-not-guessed" 0 "-- history unavailable:" -- \
  sh "$engine" "$nogit" --spec "$adr_spec"

# (d) A SHALLOW clone has a .git but cannot see the deciding commit. Distinguished from (c) because
# "no history" and "truncated history" are different statements to an adopter, and reporting a
# truncated clone as clean is the false negative that matters.
shallow="$work/append-shallow"
if git clone -q --depth 1 "file://$edited" "$shallow" 2>/dev/null; then
  run_case_anywhere "shallow-clone-is-reported-not-guessed" 0 "-- history truncated:" -- \
    sh "$engine" "$shallow" --spec "$adr_spec"
else
  echo "FAIL fixture(shallow-clone-is-reported-not-guessed): could not build a shallow clone -- the case did not run"
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "ADR-FAMILY FIXTURES: all green"
else
  echo "ADR-FAMILY FIXTURES: FAILURES ABOVE"
fi
exit $fail
