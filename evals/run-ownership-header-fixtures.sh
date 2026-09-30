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


# --- §3's exploratory-tree exception (spec 0.4.2, SPRINT-076 T5) ----------------------------------
# A tree the repository DECLARES exploratory is outside §3. Two properties make that safe to state
# rather than merely tolerate, and both are asserted here rather than assumed.
#
# (1) It works, and it says so. An exemption applied silently is indistinguishable from a rule that
# never ran (L-103), so the report must name the tree and the count it covers.
out=$(sh "$engine" "$fx/governed-off" --spec "$own_spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -qE '^FAIL +(ownership-header|update-trigger)' &&
   printf '%s\n' "$out" | grep -q 'exempt: the tree declares'; then
  echo "PASS fixture(governed-false-exempts-and-is-named): the declared tree raised no ownership finding AND the exemption is stated in the report"
else
  echo "FAIL fixture(governed-false-exempts-and-is-named): expected exit 0, no ownership finding, and a named exemption -- got exit $rc:"
  printf '%s\n' "$out" | grep -E '^FAIL |exempt'
  fail=1
fi

# (2) It cannot be triggered from PROSE. This is the case that makes the exception safe to ship: the
# declaration is a frontmatter field, so a doc merely DISCUSSING `governed: false` -- which any doc
# explaining the exception will do, including this standard's own §3 -- must not exempt its tree.
# Without this bound the exception is a phrase anyone can type into a paragraph to silence a finding,
# which is the over-exemption that would make §3 unenforceable.
run_case_anywhere "governed-false-in-prose-does-not-exempt" 1 "ownership-header-missing: docs/strategy/note.md" -- \
  sh "$engine" "$fx/governed-prose" --spec "$own_spec"

# (3) Opt-in: silence still means governed. Asserted by every other fixture in this file -- none of
# them declares anything and all are still checked -- and named here so the property is not merely
# incidental to how the fixtures happen to be written.
echo "PASS fixture(silence-means-governed): the remaining $(ls -d "$fx"/*/ | wc -l | tr -d ' ') fixture trees declare nothing and are all still evaluated above"

# --- the work-item store is exempt: task files carry their own schema (SPRINT-110 T3, owner ruling D2) ---
# docs/work/<status>/TASK-*.md is governed by work/README.md and ADR-045, and its status is its FOLDER, so
# the §3 ownership header is not owed there -- sweeping it produced ~28 S1.LAW3/S3.SCHEMA findings on a
# repository doing nothing wrong. The exemption is bounded to EXACTLY that shape, and each bound is a
# case: any other doc under docs/work/ is still checked (SELECTION -- L-186), a task file nested one
# level deeper than the store allows is still checked, and a `TASK-*.md` OUTSIDE docs/work/ is still checked.
mk_store() {   # <dir> -- one clean, headed doc plus the header-less task files under test
  mkdir -p "$1"; cp -R "$fx/clean/." "$1/"
  for _st in backlog todo in_progress review done cancel; do
    mkdir -p "$1/docs/work/$_st"
    printf -- '---\nid: TASK-00%s\ntitle: "t"\n---\n\n## Done when\n\n- [ ] x\n' "1" > "$1/docs/work/$_st/TASK-001-$_st.md"
  done
}
d="$work/store-exempt"; mk_store "$d"
out=$(sh "$engine" "$d" --spec "$own_spec" 2>&1); rc=$?
if [ "$rc" -eq 0 ] && ! printf '%s\n' "$out" | grep -qE '^FAIL +(ownership-header|update-trigger|owner-not)'; then
  echo "PASS fixture(store-task-files-exempt): a header-less task file in each of the six status folders raised no ownership finding, exit 0"
else
  echo "FAIL fixture(store-task-files-exempt): expected exit 0 and no ownership finding on six header-less docs/work/<status>/TASK-*.md -- got exit $rc:"
  printf '%s\n' "$out" | grep -E '^FAIL '; fail=1
fi
# the exemption does not touch the count of docs actually carrying a header
if printf '%s\n' "$out" | grep -q 'all 1 doc(s) carry a complete ownership header'; then
  echo "PASS fixture(store-task-files-exempt-control-count): only the 1 headed doc is counted -- the six task files left the swept set, not the report"
else
  echo "FAIL fixture(store-task-files-exempt-control-count): expected 'all 1 doc(s) carry a complete ownership header' -- got:"
  printf '%s\n' "$out" | grep -E 'S1\.LAW3|S3\.SCHEMA'; fail=1
fi
# SELECTION: a non-task doc under docs/work/ (its README) is a doc like any other.
d="$work/store-readme"; mk_store "$d"; printf '# work store README with no header\n' > "$d/docs/work/README.md"
run_case_anywhere "store-non-task-doc-still-checked" 1 "ownership-header-missing: docs/work/README.md" -- \
  sh "$engine" "$d" --spec "$own_spec"
# SELECTION: the other glob arm -- a non-TASK file INSIDE a status folder.
d="$work/store-notes"; mk_store "$d"; printf '# scratch notes\n' > "$d/docs/work/done/NOTES.md"
run_case_anywhere "store-non-task-file-in-status-folder-still-checked" 1 "ownership-header-missing: docs/work/done/NOTES.md" -- \
  sh "$engine" "$d" --spec "$own_spec"
# SELECTION: a task file nested deeper than docs/work/<status>/ is not the store's shape (work/README.md forbids nesting).
d="$work/store-nested"; mk_store "$d"; mkdir -p "$d/docs/work/done/sprint-9"; printf '# nested task\n' > "$d/docs/work/done/sprint-9/TASK-002-nested.md"
run_case_anywhere "store-nested-task-file-still-checked" 1 "ownership-header-missing: docs/work/done/sprint-9/TASK-002-nested.md" -- \
  sh "$engine" "$d" --spec "$own_spec"
# SELECTION: a TASK-*.md outside docs/work/ is an ordinary doc.
d="$work/store-outside"; mk_store "$d"; printf '# a task-shaped doc elsewhere\n' > "$d/docs/TASK-003-elsewhere.md"
run_case_anywhere "task-named-file-outside-the-store-still-checked" 1 "ownership-header-missing: docs/TASK-003-elsewhere.md" -- \
  sh "$engine" "$d" --spec "$own_spec"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "OWNERSHIP-HEADER FIXTURES: all green"
else
  echo "OWNERSHIP-HEADER FIXTURES: FAILURES ABOVE"
fi
exit $fail
