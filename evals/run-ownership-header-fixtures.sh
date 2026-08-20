#!/bin/sh
# run-ownership-header-fixtures.sh -- fixtures for the §1/§3 ownership-header family evaluated by
# scripts/lib/conformance-engine.sh: S1.LAW2 · S1.LAW3 · S3.SCHEMA · S3.AGENTS (SPRINT-075 T6).
#
# These are the engine's first NEW coverage, so unlike the §9 family there is no prior checker whose
# fixtures could be repointed -- every case here is written fresh, and RETAINED (TD-012: deleting the
# fixtures with the prototype leaves the gate unguarded). The five finding names asserted below are
# the ones already published in docs/research/conformance-dispositions.md § build; this harness
# consumes that contract rather than inventing names to match the code (L-058).
#
#   ownership-header-missing · ownership-header-field-missing · update-trigger-absent ·
#   owner-not-a-role · agents-ownership-footer-missing
#
# --- why a REDUCED spec, not the shipped one --------------------------------------------------------
# Identical reasoning to run-gates-signed-fixtures.sh: the engine dispatches EVERY rule the spec
# publishes, so the real spec/STANDARD.md would fire ~58 still-unimplemented ids against these
# throwaway fixture dirs and make every "should exit 0" case exit 1 for reasons this family does not
# own. The spec handed to the engine is a REDUCED COPY keeping only this family's four rows, derived
# from the shipped spec by awk -- never hand-authored, so a row that changes shape upstream is a
# harness failure here rather than a silent divergence.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-ownership-header-fixtures.sh
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"
fx="$here/fixtures/ownership-header"
. "$here/lib/harness-common.sh"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }
[ -d "$fx" ]     || { echo "FAIL harness: fixtures not found at $fx"; exit 2; }

fail=0
work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

own_spec="$work/spec-ownership-only.md"
awk '
  /^\| `S1\.LAW2`/ || /^\| `S1\.LAW3`/ || /^\| `S3\.SCHEMA`/ || /^\| `S3\.AGENTS`/ { print; next }
  $0 !~ /^\| `S[0-9]/ { print }
' "$spec" > "$own_spec"
# [|] not \| -- GNU grep reads \| as ALTERNATION in a BRE, which would match nearly every line via the
# empty left branch (the house technique from read-spec-rules.sh, L-108's sibling trap).
n_kept=$(grep -c '^[|] *`S[13]\.' "$own_spec")
[ "$n_kept" -eq 4 ] || {
  echo "FAIL harness: reduced spec carries $n_kept S1/S3 rows, expected exactly 4 (LAW2, LAW3, SCHEMA, AGENTS)"
  exit 2
}

# --- one retained must-FAIL case per published finding name --------------------------------------

run_case_anywhere "header-missing-fires" 1 "ownership-header-missing: docs/no-header.md" -- \
  sh "$engine" "$fx/header-missing" --spec "$own_spec"

run_case_anywhere "field-missing-fires" 1 "ownership-header-field-missing: docs/no-status.md -- status" -- \
  sh "$engine" "$fx/field-missing" --spec "$own_spec"

run_case_anywhere "update-trigger-absent-fires" 1 "update-trigger-absent: docs/no-trigger.md" -- \
  sh "$engine" "$fx/trigger-absent" --spec "$own_spec"

run_case_anywhere "owner-not-a-role-fires" 1 "owner-not-a-role: docs/person-owner.md -- owner 'Alice Nguyen'" -- \
  sh "$engine" "$fx/owner-not-a-role" --spec "$own_spec"

run_case_anywhere "agents-footer-missing-fires" 1 "agents-ownership-footer-missing: AGENTS.md" -- \
  sh "$engine" "$fx/agents-footer-missing" --spec "$own_spec"

# --- PASS controls: the rules must stay SILENT on correct input -----------------------------------
# A must-FAIL fixture proves a rule can fire. It cannot prove the rule does not fire on everything,
# which is the failure mode that makes a checker unusable rather than merely wrong.

run_case_anywhere "clean-repo-passes" 0 "all 1 doc(s) carry a complete ownership header" -- \
  sh "$engine" "$fx/clean" --spec "$own_spec"

# The control the Plan names explicitly: `Maintainer` is a legitimate role and must not be reported.
# S1.LAW2 is the one rule in this family that can produce a false positive on CORRECT input, because
# telling a role from a person is the judged half of the same distinction §7's S7.PERSON draws.
out=$(sh "$engine" "$fx/clean" --spec "$own_spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -q 'owner-not-a-role' &&
   printf '%s\n' "$out" | grep -q "PASS  S1.LAW2"; then
  echo "PASS fixture(maintainer-is-a-role): owner: Maintainer passed S1.LAW2 with no owner-not-a-role finding"
else
  echo "FAIL fixture(maintainer-is-a-role): expected exit 0, a PASS on S1.LAW2 and no owner-not-a-role -- got exit $rc:"
  printf '%s\n' "$out"
  fail=1
fi

# A person-shaped value that happens to CONTAIN a legitimate role is still not a role.
run_case_anywhere "owner-with-a-person-attached-fires" 1 "owner-not-a-role: docs/mixed-owner.md -- owner 'Alice, Maintainer'" -- \
  sh "$engine" "$fx/owner-role-substring" --spec "$own_spec"

# The match is WHOLE-VALUE (`grep -qix`), and this is the case that makes the `-x` a tested decision
# rather than a stylistic one: `Main` is a PREFIX of `Maintainer`, so without -x the vocabulary check
# accepts it and LAW 2 passes a value that is not in the vocabulary at all. That is a false negative
# in the substring direction that actually reaches -- the first draft of this case used
# `Alice, Maintainer`, which cannot see the break, because a longer string is never a substring of a
# shorter role line. The seeded-break pass caught that the case proved nothing (L-137 · L-108).
run_case_anywhere "owner-role-must-match-whole-value" 1 "owner-not-a-role: docs/prefix-owner.md -- owner 'Main'" -- \
  sh "$engine" "$fx/owner-role-prefix" --spec "$own_spec"

# A declared .conformance-roles REPLACES the default vocabulary, so a repo whose roles the engine has
# never heard of can clear the rule without the engine guessing on its behalf.
run_case_anywhere "declared-role-vocab-passes" 0 "matched against declared in .conformance-roles" -- \
  sh "$engine" "$fx/role-vocab-declared" --spec "$own_spec"

# --- the ADR exemption is NAMED, not silent -------------------------------------------------------
# §4 ships an ADR template carrying ADR-009 knowledge metadata instead of §3's header, so ADRs are
# exempt (SPRINT-075 T6 ruling). An exemption applied silently is indistinguishable from a rule that
# never ran, so the report has to say it happened and how many files it covered (L-103).
out=$(sh "$engine" "$fx/adr-exempt" --spec "$own_spec" 2>&1); rc=$?
# Anchored to the FINDING's shape, not to the bare substring "ownership-header". The fixture
# directory is itself named fixtures/ownership-header/, and the engine prints the repo path in its
# header line -- so a substring assertion matched the PATH and reported a finding that was never
# emitted. L-108's documented sub-case, verbatim: never name a fixture after a token its own
# assertion greps for; anchor the match to a position (here, a FAIL verdict at line start).
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -qE '^FAIL +ownership-header' &&
   printf '%s\n' "$out" | grep -q '1 docs/adr/ADR-\*\.md exempt'; then
  echo "PASS fixture(adr-exempt-and-named): the ADR raised no ownership finding AND the exemption is stated in the report"
else
  echo "FAIL fixture(adr-exempt-and-named): expected exit 0, no ownership finding, and a named exemption -- got exit $rc:"
  printf '%s\n' "$out"
  fail=1
fi

# --- regression: a NESTED README is a doc, not the front-door -------------------------------------
# §3 exempts the repo-root README because it carries a footer <sub> line instead of a YAML block. An
# earlier draft of _own_docs implemented that as `*/README.md`, which also excluded
# docs/strategy/adlc/README.md -- a nested doc with no header, silently dropped. Nothing in the suite
# reddened; it was caught only by an independent census disagreeing by exactly one (14 vs 15). A
# too-broad exclusion fails GREEN, which is precisely the shape L-058 exists for, so the case is
# retained rather than left as a fixed bug.
run_case_anywhere "nested-readme-is-not-exempt" 1 "ownership-header-missing: docs/sub/README.md" -- \
  sh "$engine" "$fx/nested-readme" --spec "$own_spec"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "OWNERSHIP-HEADER FIXTURES: all green"
else
  echo "OWNERSHIP-HEADER FIXTURES: FAILURES ABOVE"
fi
exit $fail
