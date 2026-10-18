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

run_case_anywhere "no-negative-consequence-fires" 1 "adr-no-negative-consequence: docs/adr/ADR-001-a-real-decision.md -- § Consequences names no Negative" -- \
  sh "$engine" "$fx/no-negative" --spec "$adr_spec"

# S4.NEGATIVE DENIAL (SPRINT-125 T7, TD-118): a § Consequences whose every Negative mention is a denial fails under the
# SAME finding id (ADR-034 freezes ids) with the DENIES message. One must-FAIL per denial phrasing family, then a
# borderline control that must PASS: real Negatives in the ADR-001 / ADR-039 shapes, plus a denial-looking phrase.
for fam in denied-prose denied-label-none denied-na denied-next-line denied-none-identified denied-none-noted; do
  run_case_anywhere "negative-denial-$fam-fires" 1 "adr-no-negative-consequence: docs/adr/ADR-001-a-real-decision.md -- § Consequences DENIES a Negative" -- \
    sh "$engine" "$fx/$fam" --spec "$adr_spec"
done
# Must-PASS siblings, ONE shape per fixture so neither masks the other: the ADR-001 and ADR-039 Negative shapes,
# a denial-looking opener that goes on to name a real cost ("No negatives except …", "… beyond …"), and a bare
# `**Negative:**` label whose next line is a real cost.
for fam in borderline-adr001 borderline-adr039 real-no-negatives-except real-no-negatives-beyond pending-label-real-cost; do
  run_case_anywhere "negative-$fam-passes" 0 "PASS  S4.NEGATIVE" -- \
    sh "$engine" "$fx/$fam" --spec "$adr_spec"
done

# --- S4.ONEFILE's other two sub-cases -------------------------------------------------------------
# "One file per ADR at docs/adr/ADR-NNN-<slug>.md" is three separate claims, and a rule that only
# checks the filename pattern silently passes the two that actually corrupt an index.

# Each fixture whose output carries more than one claim is run ONCE and replayed per claim (`replay`),
# so a per-rule assertion costs no extra engine spawn. These per-rule checks were the TS evaluators'
# until ADR-051 cut them (SPRINT-116 T1, Codex R2).
replay() { printf '%s\n' "$1"; exit "$2"; }
dup_out=$(sh "$engine" "$fx/duplicate-number" --spec "$adr_spec" 2>&1); dup_rc=$?

run_case_anywhere "duplicate-number-fires" 1 "adr-path-noncanonical: docs/adr/ADR-001-the-same-number-again.md -- ADR-001 is already claimed by" -- \
  replay "$dup_out" "$dup_rc"
# A second file under a claimed number is also an ADR the index never names: S4.INDEX must say so too.
run_case_anywhere "duplicate-number-index-fires" 1 "decisions-index-missing-adr: docs/adr/ADR-001-the-same-number-again.md" -- \
  replay "$dup_out" "$dup_rc"

run_case_anywhere "adr-outside-dir-fires" 1 "adr-path-noncanonical: docs/ADR-002-in-the-wrong-place.md" -- \
  sh "$engine" "$fx/adr-outside-dir" --spec "$adr_spec"

# An EMPTY slug (`ADR-001-.md`): S4.ONEFILE's glob needs one or more slug characters, so it rejects the file.
# The TS evaluators asserted this until ADR-051 cut them (SPRINT-116 T1, Codex R1); this case keeps it.
# S4.INDEX/SECTIONS/NEGATIVE still PASS on the same file (their glob admits an empty slug) -- the engine's
# own inconsistency, recorded as debt rather than asserted here.
run_case_anywhere "empty-slug-fires" 1 "adr-path-noncanonical: docs/adr/ADR-001-.md -- " -- \
  sh "$engine" "$fx/empty-slug" --spec "$adr_spec"

# A MISSING index is a different sub-case from an index with a gap, and the finding must name which.
run_case_anywhere "index-absent-fires" 1 "decisions-index-missing-adr: no decision index found" -- \
  sh "$engine" "$fx/index-absent" --spec "$adr_spec"

# --- PASS control: the rules must stay SILENT on correct input ------------------------------------
# A must-FAIL fixture proves a rule CAN fire. It cannot prove the rule does not fire on everything,
# which is the failure mode that makes a checker unusable rather than merely wrong.

clean_out=$(sh "$engine" "$fx/clean" --spec "$adr_spec" 2>&1); clean_rc=$?
run_case_anywhere "clean-repo-passes" 0 "all 1 ADR(s) sit at a canonical one-file-per-ADR path" -- \
  replay "$clean_out" "$clean_rc"
# Exit 0 alone would accept a NOTE; each rule's own PASS line is asserted (one engine run, replayed).
run_case_anywhere "clean-index-passes" 0 "PASS  S4.INDEX" -- replay "$clean_out" "$clean_rc"
run_case_anywhere "clean-sections-passes" 0 "PASS  S4.SECTIONS" -- replay "$clean_out" "$clean_rc"
run_case_anywhere "clean-negative-passes" 0 "PASS  S4.NEGATIVE" -- replay "$clean_out" "$clean_rc"

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

# (a2) MUST FAIL -- the same rewrite on an ADR whose name holds non-ASCII bytes. Retained for TASK-404
# (Codex review R1 T3): git's default `core.quotepath` prints such a path quoted and octal-escaped, so a
# history pass that matches names literally finds no commit for it and stays silent on the edit.
qp_src="$work/append-quoted-src"
mkdir -p "$qp_src" && cp -R "$fx/clean/." "$qp_src/" || { echo "FAIL harness: could not build the quoted-name source"; exit 2; }
qp_name=$(printf 'ADR-001-d\303\251cision.md')
mv "$qp_src/docs/adr/ADR-001-a-real-decision.md" "$qp_src/docs/adr/$qp_name" || { echo "FAIL harness: could not rename the quoted-name ADR"; exit 2; }
for f in $(grep -rl 'ADR-001-a-real-decision' "$qp_src"); do
  sed "s/ADR-001-a-real-decision\.md/$qp_name/g" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
quoted="$work/append-quoted"
git_repo_from "$quoted" "$qp_src" || { echo "FAIL harness: could not build the quoted-name repo"; exit 2; }
adr="$quoted/docs/adr/$qp_name"
sed 's/^We chose the first option\.$/We chose the second option after all./' "$adr" > "$adr.tmp" && mv "$adr.tmp" "$adr"
grep -q 'second option after all' "$adr" || { echo "FAIL harness: the quoted-name seed did not apply"; exit 2; }
git_commit_all "$quoted" "quietly rewrite the decision" || { echo "FAIL harness: could not commit the quoted-name edit"; exit 2; }

run_case_anywhere "non-ascii-name-edited-fires" 1 "adr-edited-after-decision: docs/adr/$qp_name" -- \
  sh "$engine" "$quoted" --spec "$adr_spec"

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

# (b2) MUST PASS -- proposed first, accepted later. The deciding revision is the ACCEPTANCE, so a
# § Decision rewritten while the ADR was still proposed is not an edit after the decision. Retained
# for TASK-404: the status match was the one part of the history walk no case reached -- an engine that
# measured from the first revision, accepted or not, stayed green on every other case here.
late_src="$work/append-late-src"
mkdir -p "$late_src" && cp -R "$fx/clean/." "$late_src/" || { echo "FAIL harness: could not build the late-accept source"; exit 2; }
adr="$late_src/docs/adr/ADR-001-a-real-decision.md"
sed -e 's/^status: accepted$/status: proposed/' -e 's/^- \*\*Status:\*\* accepted .*$/- **Status:** proposed/' \
    -e 's/^We chose the first option\.$/We are still weighing the options./' "$adr" > "$adr.tmp" && mv "$adr.tmp" "$adr"
grep -q 'still weighing' "$adr" || { echo "FAIL harness: the late-accept seed did not apply"; exit 2; }
late="$work/append-late-accept"
git_repo_from "$late" "$late_src" || { echo "FAIL harness: could not build the late-accept repo"; exit 2; }
cp "$fx/clean/docs/adr/ADR-001-a-real-decision.md" "$late/docs/adr/ADR-001-a-real-decision.md"
git_commit_all "$late" "accept it" || { echo "FAIL harness: could not commit the acceptance"; exit 2; }

run_case_anywhere "proposed-then-accepted-passes" 0 "1 ADR(s) unedited since their deciding commit" -- \
  sh "$engine" "$late" --spec "$adr_spec"

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
