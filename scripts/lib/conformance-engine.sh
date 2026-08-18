#!/usr/bin/env sh
# conformance-engine.sh -- the engine core: mark-driven dispatch across EVERY `## §N` section's
# Conformance rules, producing a report that states a LEVEL and named findings -- never a score
# (SPRINT-075 T2). Generalises check-attestation.sh's §13-only dispatch loop (SPRINT-074 T2) from one
# section's five rules to all 13 sections' 100 (EPIC-004 D1/D2).
#
# --- what this file is, and what it deliberately is not --------------------------------------------
# The DRIVER lives here: read every rule via read-spec-rules.sh, decide from its MARK column whether
# to evaluate it, dispatch mechanical/split rules to an `assert_<id>` function if one is registered,
# and report. It ships with NO registered assertions of its own -- SPRINT-075 T4 folds in
# `S9.GATESWELLFORMED`/`S9.GATESABSENT` (replacing check-gates-signed.sh), T6 folds in the
# ownership-header family, and every later family follows the same shape: append `assert_<ID>`
# functions below the marker, never re-implement the loop. A mechanical (or split) rule with none
# registered is a GAP, reported as `rule-unimplemented` -- never silently skipped (L-058). With 43
# `build` dispositions and only what later tasks add actually wired, this fires often at first; that
# is the report's most useful content while coverage grows, not a defect in the driver.
#
# --- the correctness claim, and how it is proven ----------------------------------------------------
# Inclusion is driven by the spec's MARK COLUMN, never by an id list this file remembers. Proof: copy
# the spec, flip one rule's mark, run again with --spec pointing at the copy -- behaviour changes with
# no code edit (evals/run-conformance-engine-fixtures.sh, the same shape SPRINT-074 used for §13).
# `judgment-only` and `implementation-directed` rules are NEVER evaluated against a repository -- §14
# is explicit that doing so produces findings no adopter can ever clear. They are reported as excluded,
# named by mark, and never appear as a PASS/FAIL verdict line.
#
# --- levels, and what "the next one" means -----------------------------------------------------------
# §14 defines three levels in increasing strictness of evidence: Structural < Gated < Attested. This
# engine's aggregate level is the highest one fully cleared: every DISPATCHED (mechanical/split) rule
# at that level or below passed. judgment-only/implementation-directed rules never enter this
# arithmetic -- they are not debt (§14). The closing line names the level reached and points at the
# FAIL lines above that block the next one; it never computes or prints a ratio, score, grade or
# percentage anywhere (§14 forbids this normatively -- a ratio improves whenever the standard declines
# to automate something, which is exactly backwards).
#
# --- packaging (D1: standalone-capable AND plugin-bundled, one implementation, two entry points) ----
# The spec defaults to the copy shipped BESIDE this script, resolved relative to the script itself --
# not to the repository under test, which is an adopter's and has no reason to vendor a copy of the
# standard it is being measured against (copied from check-attestation.sh's proven approach). The two
# entry points are conformance.sh (repo root, for a standalone/adopter invocation) and
# scripts/qa-check.sh (this repo's own gate) -- both call this same file. `--spec` overrides for a
# repo that vendors its own version.
#
# Usage: sh conformance-engine.sh <repo-dir> [--spec <path/to/STANDARD.md>]
# Prints one line per rule (PASS/FAIL/note) plus a closing `level:` line; exits 1 if any FAIL line was
# printed, 0 otherwise. Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
last_bad=0
ok()   { printf 'PASS  %s\n' "$1"; }
# `last_bad` is reset before each dispatch call and read right after -- `fail` alone cannot tell a
# caller whether THIS call failed once a prior call has already set it (a boolean flag has no memory
# of which call flipped it), which is what the per-level counters below need to know.
bad()  { fail=1; last_bad=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

# --- arguments ---------------------------------------------------------------------------------
repo=""; spec=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --spec) shift; spec=${1:-} ;;
    -h|--help) printf 'usage: sh conformance-engine.sh <repo-dir> [--spec <STANDARD.md>]\n'; exit 0 ;;
    *) [ -n "$repo" ] || repo=$1 ;;
  esac
  shift
done
[ -n "$repo" ] || { bad "conformance: usage -- sh conformance-engine.sh <repo-dir> [--spec <STANDARD.md>]"; exit 1; }
[ -d "$repo" ] || { bad "conformance: repo directory not found: $repo"; exit 1; }
repo_abs=$(CDPATH= cd -- "$repo" && pwd)

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
[ -n "$spec" ] || spec="$here/../../spec/STANDARD.md"
reader="$here/read-spec-rules.sh"

# Checked explicitly rather than left to fail through, matching check-attestation.sh: a MISSING
# reader must not be misread as a bad spec.
[ -f "$reader" ] || { bad "conformance: reader-missing -- $reader not found beside this script; the rule set is read through read-spec-rules.sh and this engine does not carry its own copy of the parse"; exit 1; }

# --- rule source: every `## §N` Conformance table, document order --------------------------------
rules=$(sh "$reader" "$spec" 2>/dev/null); reader_rc=$?
if [ "$reader_rc" -ne 0 ] || [ -z "$rules" ]; then
  bad "conformance: spec-table-unreadable -- no Conformance rows parsed from $spec. An engine that cannot read its rule source checks NOTHING; that is reported here rather than exiting clean (L-058)"
  exit 1
fi
n_rules=$(printf '%s\n' "$rules" | wc -l | tr -d ' ')

printf '=== conformance -- %s ===\n' "$repo_abs"
note "rule source: $spec -- $n_rules rules read across every section. Rule set and marks are the spec's; assertion bodies are this engine's, registered per id below"

# ==================================================================================================
# ASSERTION REGISTRY -- assert_<id with . as _> functions. None shipped by T2 (the driver only);
# later tasks append theirs between this block and the DRIVER below (a function must be DEFINED
# before the loop that calls it runs, so it belongs here, never after). The line below is a stable
# insertion anchor a fixture can awk/sed after, the same convention as evals/lib/harness-common.sh's
# anchor extraction.
# registry:insert-point
# ==================================================================================================

# ==================================================================================================
# DRIVER -- iterated WITHOUT a pipe, matching check-attestation.sh's documented reason: `printf |
# while read` runs the loop in a subshell, where every bad() would set a `fail` the parent never sees
# (a report disagreeing with its artifact -- this repo's own most-repeated failure class).
# ==================================================================================================
n_pass=0; n_judgment=0; n_impl=0; n_unclassified=0
struct_fail=0; gated_fail=0; attested_fail=0

saved_ifs=$IFS
IFS='
'
for row in $rules; do
  IFS=$saved_ifs
  # shellcheck disable=SC2086
  set -- $row
  id=$1; level=$2; mark=$3
  fn="assert_$(printf '%s' "$id" | tr '.' '_')"
  pid=$(printf '%-20s' "$id")
  case "$mark" in
    implementation-directed)
      n_impl=$((n_impl + 1))
      note "$pid -- excluded by mark: implementation-directed (level: $level). Constrains a tool's inference, never a repository; evaluating it would emit a finding no adopter can ever clear (§14)"
      ;;
    judgment-only)
      n_judgment=$((n_judgment + 1))
      note "$pid -- judgment-required (mark: judgment-only, level: $level). Not checkable in principle -- the standard is choosing a human, and this is not debt (§14)"
      ;;
    mechanical|split)
      last_bad=0
      if command -v "$fn" >/dev/null 2>&1; then
        "$fn" "$repo_abs"
      else
        bad "$pid -- rule-unimplemented: the spec marks this $mark at level $level and this engine has no assertion for it yet. A rule the spec states and the engine skips is a GAP, reported here rather than silently absent"
      fi
      if [ "$last_bad" -eq 1 ]; then
        case "$level" in
          Structural) struct_fail=$((struct_fail + 1)) ;;
          Gated)      gated_fail=$((gated_fail + 1)) ;;
          Attested)   attested_fail=$((attested_fail + 1)) ;;
        esac
      else
        n_pass=$((n_pass + 1))
      fi
      ;;
    "?")
      n_unclassified=$((n_unclassified + 1))
      note "$pid -- unclassified (mark: ?, level: $level). Not a silent skip and not a pass -- §14 names this a real state for a rule added since this spec version"
      ;;
    *)
      note "$pid -- unrecognized mark '$mark' (level: $level), not evaluated"
      ;;
  esac
  IFS='
'
done
IFS=$saved_ifs

# --- the level line ------------------------------------------------------------------------------
# §14: a conformant report states a level, the named findings preventing the next level, and the
# judgment-required items -- never a score, a grade, or a percentage.
if [ "$struct_fail" -gt 0 ]; then
  note "level: none -- Structural not yet reached. $struct_fail finding(s) at Structural prevent it (see FAIL lines above)"
elif [ "$gated_fail" -gt 0 ]; then
  note "level: Structural -- $gated_fail finding(s) at Gated prevent Gated, the next level (see FAIL lines above)"
elif [ "$attested_fail" -gt 0 ]; then
  note "level: Gated -- $attested_fail finding(s) at Attested prevent Attested, the next level (see FAIL lines above)"
else
  note "level: Attested -- every dispatched rule passed"
fi
note "counts: $n_pass passed, $n_judgment judgment-required, $n_impl excluded (implementation-directed)$([ "$n_unclassified" -gt 0 ] && printf ', %s unclassified' "$n_unclassified")"

exit $fail
