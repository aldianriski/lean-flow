#!/bin/sh
# run-git-availability-fixtures.sh -- fixtures for the conformance engine's GIT-AVAILABILITY branch
# (SPRINT-089 T1).
#
# WHY THIS EXISTS, so nobody re-derives it. Twelve assertions in scripts/lib/conformance-engine.sh
# gate on whether the target directory is a git repository. SPRINT-089 T1 memoised that probe
# (6 spawns per invocation -> 1). The change was proven output-equivalent -- and then TWO seeded
# breaks were run against the existing fixture set and NEITHER reddened:
#   - run-conformance-engine-fixtures.sh drives NON-git temp dirs, and both sides of the branch emit
#     `note` lines that no case asserts on, so the branch is invisible to it.
#   - run-attestation-fixtures.sh builds REAL git repos, so it never takes the negative path at all.
# By L-142 a break that does not redden its case has tested nothing. The branch was therefore shipping
# unguarded in BOTH directions, and that is a hole in the engine generally -- not merely in the commit
# that exposed it.
#
# THE DISCRIMINATION is two targets, identical content, one spec:
#   - a NON-git directory -> every §12 rule must report `not a git repository`, and must NOT PASS
#   - a `git init`ed one  -> every §12 rule must PASS, and must NOT report `not a git repository`
# A probe wedged at "is a repo" reddens cases 1-2; one wedged at "is not" reddens cases 3-4. Both
# directions are asserted because a guard that only catches one is half a guard (L-058).
#
# CASE 5 IS THE SIBLING CONTROL (L-142): S2.R-README consults no git state, so it must report
# IDENTICALLY on both targets. If a seeded break reddens everything including the control, the harness
# is detecting a demolition rather than discriminating a branch, and the proof is void.
#
# §12 is the chosen family because its four rules probe git FIRST, before any content precondition --
# so the branch is reached on an otherwise-empty target and the fixture stays cheap.
#
# COST, costed rather than assumed: one `git init` at ~95ms and NO commit (an inited-but-empty repo
# already answers `rev-parse --git-dir`, and the §12 rules then evaluate against zero tracked files,
# which is a PASS). Named because the always-on rule at qa-check.sh leg 12 is "cheap-and-git-free";
# this harness is cheap but not git-free, and the placement call is recorded in the sprint rather than
# assumed here.
#
# Retained deliberately: this outlives the task that wrote it (TD-012).

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$here/.." && pwd)
engine="$repo_root/scripts/lib/conformance-engine.sh"
spec="$repo_root/spec/STANDARD.md"

[ -f "$engine" ] || { echo "FAIL harness: engine not found at $engine"; exit 2; }
[ -f "$spec" ]   || { echo "FAIL harness: spec not found at $spec"; exit 2; }

work=$(mktemp -d) || { echo "FAIL harness: mktemp -d failed"; exit 2; }
trap 'rm -rf "$work"' EXIT INT TERM

fail=0

# The spec is a REDUCED COPY of the shipped spec/STANDARD.md, never a hand-written stub -- a stub
# would test this harness's idea of the table rather than the shipped one (house discipline, same as
# run-conformance-engine-fixtures.sh). Section-preserving: rule ROWS outside the keep-list are
# dropped, every non-rule line is left untouched.
rspec="$work/spec-git-availability.md"
awk '
  /^\| `(S12\.SECRETS|S12\.BACKUPS|S12\.DESIGNSRC|S12\.GENERATED|S2\.R-README)`/ { print; next }
  /^\| `S[0-9]/ { next }
  { print }
' "$spec" > "$rspec"

# Anchor guard: if a rule id in the keep-list drifts out of the shipped spec, this harness would
# silently assert nothing at all. Fail loudly instead of going green on an empty reduction.
for _id in 'S12\.SECRETS' 'S12\.BACKUPS' 'S12\.DESIGNSRC' 'S12\.GENERATED' 'S2\.R-README'; do
  grep -qE "^\| \`$_id\`" "$rspec" || {
    echo "FAIL harness: reduced spec lost $_id -- keep-list drifted from the shipped spec"
    fail=1
  }
done

# Two targets, IDENTICAL content. The README carries a compliant ownership footer so the control
# (case 5) is green on both sides rather than merely equal.
readme='# fixture

<sub>Doc owner: Maintainer · last updated: 2026-08-26 · status: current</sub>
'
mkdir -p "$work/nongit" "$work/gitrepo"
printf '%s' "$readme" > "$work/nongit/README.md"
printf '%s' "$readme" > "$work/gitrepo/README.md"
git -C "$work/gitrepo" init -q >/dev/null 2>&1 || { echo "FAIL harness: git init failed"; exit 2; }

out_nongit=$(sh "$engine" "$work/nongit"  --spec "$rspec" 2>&1)
out_git=$(sh   "$engine" "$work/gitrepo" --spec "$rspec" 2>&1)

# assert_has <label> <substring> <output>   -- the substring MUST appear
assert_has() {
  case "$3" in
    *"$2"*) echo "PASS fixture($1): found '$2'" ;;
    *) echo "FAIL fixture($1): expected '$2' and it is absent -- got:"; printf '%s\n' "$3"; fail=1 ;;
  esac
}
# assert_lacks <label> <substring> <output> -- the substring must NOT appear
assert_lacks() {
  case "$3" in
    *"$2"*) echo "FAIL fixture($1): '$2' must not appear on this target -- got:"; printf '%s\n' "$3"; fail=1 ;;
    *) echo "PASS fixture($1): absent as required -- '$2'" ;;
  esac
}

# --- case 1: non-git target REPORTS unavailability, per rule ------------------------------------
# Per rule, not once: a probe that fails for only some callers is the shape a single spot-check
# misses. Each of the four §12 rules calls it independently.
assert_has "nongit-secrets-reports-unavailable"   "S12.SECRETS         -- not a git repository"   "$out_nongit"
assert_has "nongit-backups-reports-unavailable"   "S12.BACKUPS         -- not a git repository"   "$out_nongit"
assert_has "nongit-designsrc-reports-unavailable" "S12.DESIGNSRC       -- not a git repository"   "$out_nongit"
assert_has "nongit-generated-reports-unavailable" "S12.GENERATED       -- not a git repository"   "$out_nongit"

# --- case 2: non-git target does NOT report a pass it cannot have earned -------------------------
# The silent-false-negative direction: a probe wedged at "is a repo" would run §12's real checks
# against a tree with no git objects, find nothing, and PASS. Reporting compliance for a question
# that was never asked is worse than reporting the gap (L-058).
assert_lacks "nongit-secrets-does-not-pass"   "PASS  S12.SECRETS"   "$out_nongit"
assert_lacks "nongit-generated-does-not-pass" "PASS  S12.GENERATED" "$out_nongit"

# --- case 3: a git target EVALUATES the rules for real -------------------------------------------
assert_has "git-secrets-evaluates"   "PASS  S12.SECRETS"   "$out_git"
assert_has "git-backups-evaluates"   "PASS  S12.BACKUPS"   "$out_git"
assert_has "git-designsrc-evaluates" "PASS  S12.DESIGNSRC" "$out_git"
assert_has "git-generated-evaluates" "PASS  S12.GENERATED" "$out_git"

# --- case 4: a git target never claims unavailability ---------------------------------------------
# The other direction: a probe wedged at "is not a repo" would silently downgrade every §12 rule on a
# real repository to a note, and the gate would go green having checked nothing.
assert_lacks "git-claims-no-unavailability" "not a git repository" "$out_git"

# --- case 5: SIBLING CONTROL -- a git-independent rule reports identically on both --------------
# If a seeded break reddens this too, the harness is detecting a demolition rather than
# discriminating the git branch, and cases 1-4 carry no weight (L-142).
assert_has "control-readme-passes-nongit" "PASS  S2.R-README" "$out_nongit"
assert_has "control-readme-passes-git"    "PASS  S2.R-README" "$out_git"

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then echo "GIT-AVAILABILITY FIXTURES: all green"; else echo "GIT-AVAILABILITY FIXTURES: FAILURES ABOVE"; fi
exit $fail
