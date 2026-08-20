#!/bin/sh
# run-s2-placement-fixtures.sh -- fixtures for §2's placement pair evaluated by
# scripts/lib/conformance-engine.sh: S2.F-FILE · S2.R-PLACEMENT (SPRINT-076 T3).
#
# The two published names this harness consumes as a contract (L-058):
#
#   S2.F-FILE      -> core-file-missing
#   S2.R-PLACEMENT -> file-outside-canonical-placement
#
# --- why the fixture repos are BUILT, not stored ----------------------------------------------------
# Isolating either rule needs a repo holding all NINE unconditional §2 core files, so that the case
# under test is the only thing wrong. Stored on disk that is 9 stub files per case, four times over,
# and each one is a file some other checker in this repo then walks. Built here with printf instead --
# the shape run-foreign-repo-fixtures.sh already uses, for the same reason. The cases are retained
# (TD-012); what is not retained is 36 stubs.
#
# The required set is read from the SPEC at runtime, exactly as the engine reads it, so a §2 row whose
# `Create ←` cell stops saying "always" changes both sides together and this harness cannot drift from
# the rule it guards.
#
# Dependency-free POSIX sh, no git needed. Run bare: sh evals/run-s2-placement-fixtures.sh
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

s2_spec="$work/spec-s2-only.md"
awk '
  /^\| `S2\.F-FILE`/ || /^\| `S2\.R-PLACEMENT`/ { print; next }
  $0 !~ /^\| `S[0-9]+\.[A-Z]/ { print }
' "$spec" > "$s2_spec"
n_kept=$(grep -c '^[|] *`S2\.\(F-FILE\|R-PLACEMENT\)`' "$s2_spec")
[ "$n_kept" -eq 2 ] || {
  echo "FAIL harness: reduced spec carries $n_kept of the 2 rules under test"
  exit 2
}
# The §2 DATA tables must survive the reduction -- they are what the rules are parameterised by, and a
# reduction that ate them would leave both rules checking an empty set and reporting every repo clean.
n_rows=$(grep -c '^| `README\.md`\|^| `TODO\.md`\|^| `CLAUDE\.md`' "$s2_spec")
[ "$n_rows" -ge 3 ] || {
  echo "FAIL harness: the §2 file tables did not survive the spec reduction ($n_rows probe rows, want >= 3) --"
  echo "              both rules would then check an empty required set and pass everything"
  exit 2
}

# required <spec> -- the unconditional core paths, derived the same way the engine derives them.
required() {
  awk '
    /^## §2/ { in2 = 1; next }
    /^## §/  { in2 = 0 }
    !in2     { next }
    /^\*\*Conformance/        { in2 = 0; next }
    /^\*\*Root files/         { pfx = "";         next }
    /^\*\*AI context/         { pfx = ".claude/"; next }
    /^\*\*`docs\/` tree\*\*/  { pfx = "docs/";    next }
    /^\|/ {
      if ($0 ~ /^\|[ ]*File[ ]*\|/) next
      if ($0 ~ /^\|[-| ]*\|$/)      next
      n = split($0, c, "|"); if (n < 5) next
      file = c[2]; cre = (pfx == "docs/") ? c[6] : c[5]
      if (match(file, /`[^`]+`/)) path = substr(file, RSTART + 1, RLENGTH - 2); else next
      if (path ~ /[<>*]/) next
      if (cre ~ /always/) print pfx path
    }' "$1"
}

REQ=$(required "$spec")
n_req=$(printf '%s\n' "$REQ" | grep -c .)
[ "$n_req" -ge 5 ] || { echo "FAIL harness: derived only $n_req unconditional core files from §2"; exit 2; }
echo "PASS fixture(required-set-derived): $n_req unconditional core file(s) derived from §2's Create cells, not hard-coded"

# build_conformant <dir> -- a repo holding every unconditional core file, each with the §3 ownership
# header so that this family's rules are the only thing under test.
build_conformant() {
  d=$1
  for p in $REQ; do
    mkdir -p "$d/$(dirname "$p")" 2>/dev/null
    printf -- '---\nowner: Maintainer\nlast_updated: 2026-08-20\nupdate_trigger: When it changes\nstatus: current\n---\n\n# %s\n\nBody.\n' "${p##*/}" > "$d/$p"
  done
}

# --- must-FAIL: a missing unconditional core file -------------------------------------------------
miss="$work/core-missing"
build_conformant "$miss"
rm -f "$miss/TODO.md"
[ -e "$miss/TODO.md" ] && { echo "FAIL harness: the core-missing seed did not apply"; exit 2; }

run_case_anywhere "core-file-missing-fires" 1 "core-file-missing: TODO.md" -- \
  sh "$engine" "$miss" --spec "$s2_spec"

# --- must-FAIL: a core doc the repo HAS, filed where §2 does not name -----------------------------
# The distinction from the case above is the whole point of two rules: the document exists, so this is
# not an absence -- it is in the wrong place, and a reader following the standard will not find it.
mis="$work/misplaced"
build_conformant "$mis"
mkdir -p "$mis/documentation"
mv "$mis/docs/architecture/overview.md" "$mis/documentation/overview.md"
[ -e "$mis/docs/architecture/overview.md" ] && { echo "FAIL harness: the misplaced seed did not apply"; exit 2; }

run_case_anywhere "outside-canonical-placement-fires" 1 "file-outside-canonical-placement: docs/architecture/overview.md" -- \
  sh "$engine" "$mis" --spec "$s2_spec"

# --- the legacy path is matched SECOND: tolerated, and NAMED --------------------------------------
# §2 records `docs/ARCHITECTURE.md` as the legacy path for `docs/architecture/overview.md`, and says
# legacy paths are matched second. So R-PLACEMENT must not report it -- but an accepted fallback
# applied silently is indistinguishable from a rule that never ran (L-103), so the report has to say
# it happened.
leg="$work/legacy"
build_conformant "$leg"
mv "$leg/docs/architecture/overview.md" "$leg/docs/ARCHITECTURE.md"

out=$(sh "$engine" "$leg" --spec "$s2_spec" 2>&1)
if ! printf '%s\n' "$out" | grep -qE '^FAIL +file-outside-canonical-placement' &&
   printf '%s\n' "$out" | grep -q 'matched second'; then
  echo "PASS fixture(legacy-path-matched-second-and-named): the legacy path raised no placement finding AND the report says it was matched second"
else
  echo "FAIL fixture(legacy-path-matched-second-and-named): expected no placement finding and a named second match -- got:"
  printf '%s\n' "$out" | grep -E 'S2\.R-PLACEMENT|file-outside-canonical'
  fail=1
fi

# A legacy layout must still FAIL S2.F-FILE. §2 states the two rules are separable precisely here --
# "a repo on a legacy layout satisfies one and not the other" -- so a run where both agree has
# collapsed two rules into one and lost the distinction the standard drew.
if printf '%s\n' "$out" | grep -qE '^FAIL +core-file-missing: docs/architecture/overview\.md'; then
  echo "PASS fixture(legacy-layout-separates-the-two-rules): F-FILE reports the canonical path missing while R-PLACEMENT tolerates the legacy one"
else
  echo "FAIL fixture(legacy-layout-separates-the-two-rules): F-FILE did not report the canonical path -- the two rules have collapsed into one:"
  printf '%s\n' "$out" | grep -E 'S2\.F-FILE|core-file-missing'
  fail=1
fi

# --- PASS control ---------------------------------------------------------------------------------
clean="$work/clean"
build_conformant "$clean"
run_case_anywhere "conformant-repo-passes" 0 "unconditional core file(s) present at their canonical §2 path" -- \
  sh "$engine" "$clean" --spec "$s2_spec"

# --- the quiet-on-a-stranger control --------------------------------------------------------------
# R-PLACEMENT matches by BASENAME, and this is the case that makes that a tested decision rather than
# a stylistic one: a repository full of documents §2 never named must raise no placement finding at
# all. Without the basename bound the rule reaches for any doc it can pattern-match and becomes the
# artefact generator this task was written to measure.
stranger="$work/stranger"
mkdir -p "$stranger/lib" "$stranger/notes"
printf '# acme\n' > "$stranger/README.md"
printf 'x\n' > "$stranger/lib/index.js"
printf '# design notes\n' > "$stranger/notes/design-notes.md"
printf '# meeting\n'      > "$stranger/notes/2026-01-standup.md"
out2=$(sh "$engine" "$stranger" --spec "$s2_spec" 2>&1)
if ! printf '%s\n' "$out2" | grep -qE '^FAIL +file-outside-canonical-placement'; then
  echo "PASS fixture(no-placement-finding-on-documents-s2-never-named): a stranger's own docs raise no placement finding"
else
  echo "FAIL fixture(no-placement-finding-on-documents-s2-never-named): R-PLACEMENT reached past §2's own filenames:"
  printf '%s\n' "$out2" | grep -E '^FAIL +file-outside-canonical-placement'
  fail=1
fi

echo "----------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "S2-PLACEMENT FIXTURES: all green"
else
  echo "S2-PLACEMENT FIXTURES: FAILURES ABOVE"
fi
exit $fail
