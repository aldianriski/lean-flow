#!/usr/bin/env sh
# check-attestation.sh -- verify a commit's HITL attestation against spec/STANDARD.md §13
# (SPRINT-074 T2, TASK-228). The first checker in this repository that reads its rules from the
# specification instead of from its author (EPIC-004 D1).
#
# Usage: sh check-attestation.sh <repo-dir> <commit-ish> [--spec <path/to/STANDARD.md>]
#   e.g. sh scripts/lib/check-attestation.sh . HEAD
# Prints one line per §13 rule plus a closing `level:` line; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms. Needs git (it reads git objects; that is the point).
#
# --- WHERE THE RULES COME FROM (the design ruling this task was told to take, not assume) ---------
# Three candidates were priced. The chosen one is the FIRST:
#
#   (a) parse §13's Conformance table  -- CHOSEN. The table is the machine-readable form §14 defines,
#       and it is the only one of the three where the `implementation-directed` exclusion is DERIVED
#       rather than remembered: S13.NOINFER and S13.NOTAUTHOR are skipped because the spec's own Mark
#       column says to skip them (sprint D3). Two further properties fall out for free and are the
#       real payment: a rule ADDED to §13 in a later spec version is reported as `rule-unimplemented`
#       instead of silently vanishing, and a table this checker cannot parse is reported as
#       `spec-table-unreadable` instead of checking nothing and exiting clean (L-058).
#   (b) parse §13's prose -- REJECTED. Prose is not a machine format; §14 and the tables exist because
#       it isn't. A prose parser that matches too little returns FEWER rules and still exits 0, which
#       is a false negative wearing a pass (L-108).
#   (c) hard-code the five rules -- REJECTED. Cheapest and immune to spec reformatting, but a wrapper
#       that hard-codes does not satisfy spec-driven (SPRINT-073 D3 · EPIC-004 D1), and adopting it
#       would have made §13's checker the twelfth hard-coder while leaving D1's claim untested.
#
# What the spec CANNOT supply, and this file therefore does: the assertion bodies. "all three required
# together" and "the `Evidence:` value's shape" are different code. So the split is honest and stated:
# the RULE SET and its MARKS are read from §13's table at runtime; the assertion for each id lives
# here as `assert_<id>`. Saying which half is spec-driven is the point -- claiming both would be the
# theatre §13 itself warns about.
#
# --- WHICH FINDINGS FAIL, AND THE ONE THAT DELIBERATELY DOES NOT ----------------------------------
# §14 says a conformant report states a LEVEL and the named findings preventing the next one -- never
# a score. So `attestation-unsigned-claim-only` is reported, named, and exits 0: an unsigned commit
# with perfect trailers has genuinely reached Gated and genuinely has not reached Attested, and that
# is a level, not a defect. Its fixture asserts the OUTPUT, not the status, because that is the only
# way to tell "reported honestly" from "silently passed" (L-103). Every other finding exits 1.
#
# `evidence-path-unpinned` is a judgement call recorded rather than defaulted: §13a words `@ <sha>` as
# "strongly recommended", not required, yet the register published it as a `build` rule and §13's own
# worked example exists because a bare path in this very repository would already be dead. This
# checker treats an unpinned or unresolvable pointer as a finding preventing Attested (exit 1). An
# adopter can clear it by adding the sha -- which is what separates it from the findings §14 forbids.
set -u

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

# --- arguments ------------------------------------------------------------------------------------
repo=""; rev=""; spec=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --spec) shift; spec=${1:-} ;;
    -h|--help) printf 'usage: sh check-attestation.sh <repo-dir> <commit-ish> [--spec <STANDARD.md>]\n'; exit 0 ;;
    *) if [ -z "$repo" ]; then repo=$1; elif [ -z "$rev" ]; then rev=$1; fi ;;
  esac
  shift
done
[ -n "$repo" ] && [ -n "$rev" ] || {
  bad "attestation: usage -- sh check-attestation.sh <repo-dir> <commit-ish> [--spec <STANDARD.md>]"; exit 1; }

# The spec defaults to the copy shipped BESIDE this script, resolved relative to the script itself --
# not to the repository under test, which is an adopter's and has no reason to contain a copy of the
# standard it is being measured against. `--spec` overrides for a repo that vendors its own version.
if [ -z "$spec" ]; then
  here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
  spec="$here/../../spec/STANDARD.md"
fi

command -v git >/dev/null 2>&1 || { bad "attestation: git not found -- §13 reads git objects"; exit 1; }
[ -d "$repo" ] || { bad "attestation: repo directory not found: $repo"; exit 1; }
git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || { bad "attestation: not a git repository: $repo"; exit 1; }
sha=$(git -C "$repo" rev-parse --verify "$rev^{commit}" 2>/dev/null) || sha=""
[ -n "$sha" ] || { bad "attestation: no such commit in $repo: $rev"; exit 1; }
short=$(printf '%s' "$sha" | cut -c1-7)

# --- rule source: §13's Conformance table ---------------------------------------------------------
# Scoped to the §13..§14 window and anchored to a ROW POSITION (a line starting `| ` then a backticked
# id), not to the substring "S13." -- §14 names S13.NOINFER and S13.NOTAUTHOR in prose when it
# explains the implementation-directed category, and a substring match would ingest that prose as
# rules (L-108). Cross-checked at build time: 7 rows in-window, 7 row-shaped file-wide, against 10
# total "S13." mentions -- the three excluded are exactly §14's prose.
rules=$(awk '
  /^## §13 /            { inwin = 1 }
  inwin && /^## §14 /   { exit }
  inwin && /^\| *`S13\.[A-Z]+` *\|/ {
    line = $0
    sub(/^\| *`/, "", line); id = line; sub(/`.*$/, "", id)
    n = split($0, f, "|")
    level = (n >= 3) ? f[3] : ""
    mark  = (n >= 4) ? f[4] : ""
    gsub(/\*|`/, " ", level); gsub(/\*|`/, " ", mark)
    # The mark cell may carry a qualifier -- §13 writes "mechanical *on the fact*". The mark is the
    # first token; the qualifier is commentary for a human and must not become a distinct category.
    nm = split(mark, m, " "); mark = "?"
    for (i = 1; i <= nm; i++) if (m[i] != "") { mark = m[i]; break }
    nl = split(level, l, " "); level = "--"
    for (i = 1; i <= nl; i++) if (l[i] != "") { level = l[i]; break }
    printf "%s %s %s\n", id, level, mark
  }
' "$spec" 2>/dev/null)

if [ -z "$rules" ]; then
  bad "attestation: spec-table-unreadable -- no §13 Conformance rows parsed from $spec. A checker that cannot read its rule source checks NOTHING; that is reported here rather than exiting clean (L-058)"
  exit 1
fi
n_rules=$(printf '%s\n' "$rules" | wc -l | tr -d ' ')
n_mech=$(printf '%s\n' "$rules" | awk '$3=="mechanical"' | wc -l | tr -d ' ')
n_impl=$(printf '%s\n' "$rules" | awk '$3=="implementation-directed"' | wc -l | tr -d ' ')

printf '=== §13 attestation -- %s @ %s ===\n' "$repo" "$short"
note "rule source: $spec §13 Conformance table -- $n_rules rules read ($n_mech mechanical, $n_impl implementation-directed). Rule set and marks are the spec's; assertion bodies are this script's"

# --- git facts, gathered once ---------------------------------------------------------------------
# Deliberately absent from this block: %an %ae %cn %ce. Author and committer identity are never read,
# because §13e says they are not the attestation -- S13.NOTAUTHOR is honoured by construction here,
# never evaluated against the repository under test.
tr_signer=$(git -C "$repo" log -1 --format='%(trailers:key=Gate-Signed-By,valueonly)' "$sha" | sed '/^[[:space:]]*$/d')
tr_gate=$(git   -C "$repo" log -1 --format='%(trailers:key=Gate,valueonly)'           "$sha" | sed '/^[[:space:]]*$/d')
tr_ev=$(git     -C "$repo" log -1 --format='%(trailers:key=Evidence,valueonly)'       "$sha" | sed '/^[[:space:]]*$/d')
gsig=$(git      -C "$repo" log -1 --format='%G?' "$sha")
parents=$(git   -C "$repo" log -1 --format='%P'  "$sha")
n_parents=$(printf '%s' "$parents" | wc -w | tr -d ' ')

# `Evidence: <path> @ <sha>` -- split once, reused by S13.EVIDENCESHA and S13.AGREE.
ev_path=$(printf '%s' "$tr_ev" | sed -n 's/^[[:space:]]*\(.*[^[:space:]]\)[[:space:]]*@.*/\1/p')
ev_pin=$(printf  '%s' "$tr_ev" | sed -n 's/.*@[[:space:]]*\([0-9a-f]\{7,40\}\).*/\1/p')
[ -n "$ev_path" ] || ev_path=$(printf '%s' "$tr_ev" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')

# How many of the three trailers are present -- S13.TRAILERS decides on this, and the other
# assertions consult it so they never report a second finding about a trailer that simply is not there.
present=0
[ -n "$tr_signer" ] && present=$((present + 1))
[ -n "$tr_gate" ]   && present=$((present + 1))
[ -n "$tr_ev" ]     && present=$((present + 1))
unsigned=0

fmv_stdin() { awk -v k="$1" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}'; }
norm_gates() { printf '%s' "$1" | tr -d '[:space:]' | tr ',' '\n' | sed '/^$/d' | sort | tr '\n' ',' | sed 's/,$//'; }

# --- assertion bodies, one per mechanical rule id --------------------------------------------------
# Named `assert_<id with . as _>` so the driver below can find them from the parsed table. There is
# deliberately no assert_S13_NOINFER and no assert_S13_NOTAUTHOR: those two constrain THIS CHECKER's
# inference, and an engine that emitted them as findings would hand adopters something they can never
# clear (§14 · sprint D3). They are demonstrated instead -- see S13.UNSIGNEDCLAIM's wording, which
# reports what the repository STATES and refuses to conclude that anyone approved anything.

assert_S13_TRAILERS() {
  if [ "$present" -eq 0 ]; then
    note "S13.TRAILERS      -- no attestation claimed (none of the three trailers present). Reported, never read as approval"
    return
  fi
  if [ "$present" -lt 3 ]; then
    missing=""
    [ -n "$tr_signer" ] || missing="$missing Gate-Signed-By:"
    [ -n "$tr_gate" ]   || missing="$missing Gate:"
    [ -n "$tr_ev" ]     || missing="$missing Evidence:"
    bad "S13.TRAILERS      -- attestation-trailers-incomplete: missing$missing. §13a requires all three together; a Gate: without a Gate-Signed-By: asserts a gate applied and declines to say who approved it, which is weaker than saying nothing"
    return
  fi
  ok "S13.TRAILERS      -- all three trailers present together"
}

assert_S13_OWNCOMMIT() {
  [ "$present" -gt 0 ] || { note "S13.OWNCOMMIT     -- not evaluated: no attestation claimed on $short"; return; }
  if [ "$n_parents" -gt 1 ]; then
    bad "S13.OWNCOMMIT     -- attestation-not-on-task-commit: $short is a merge commit ($n_parents parents). §13a puts the trailers on the task's own commit, not the merge"
    return
  fi
  touched=$(git -C "$repo" show --format= --name-only "$sha" 2>/dev/null | sed '/^[[:space:]]*$/d' | wc -l | tr -d ' ')
  if [ "$touched" -eq 0 ]; then
    bad "S13.OWNCOMMIT     -- attestation-not-on-task-commit: $short changes no files, so it is a separate approval commit rather than the commit that implements the work (§13a)"
    return
  fi
  ok "S13.OWNCOMMIT     -- task's own commit ($n_parents parent, $touched file(s) changed)"
}

assert_S13_EVIDENCESHA() {
  [ -n "$tr_ev" ] || { note "S13.EVIDENCESHA   -- not evaluated: no Evidence: trailer to read"; return; }
  if [ -z "$ev_pin" ]; then
    bad "S13.EVIDENCESHA   -- evidence-path-unpinned: 'Evidence: $tr_ev' carries no '@ <sha>'. The path is not immutable even though the trailer is; planning records get archived and renamed, and a bare path silently stops resolving (§13a)"
    return
  fi
  if ! git -C "$repo" cat-file -e "$ev_pin:$ev_path" 2>/dev/null; then
    bad "S13.EVIDENCESHA   -- evidence-path-unpinned: '$ev_path' does not resolve at $ev_pin ('git show $ev_pin:$ev_path' fails). A pin that does not resolve is not a pin"
    return
  fi
  ok "S13.EVIDENCESHA   -- Evidence: pinned and resolving ($ev_path @ $ev_pin)"
}

# Where the sprint-level record is READ, and why it is two places rather than one. `gates_signed:
# <GATES> @ <sha>` names the commit the gates were signed AT, so the field naming that sha is
# necessarily written in a LATER commit than the one it names. An Evidence: pin at the signing sha
# therefore resolves to a version of the sprint file that does not yet carry the record -- which is
# the normal, correct state of the first attested commit of every sprint, not a violation. Demanding
# the record at the pin would make that commit impossible to comply with, and a finding no adopter
# can clear is exactly what §14 forbids. So: read at the pin, fall back to the attesting commit's own
# tree (the repository state when the claim was made), and NAME which one answered. Absent from both
# is still a FAIL -- the trailer would be carrying a fact nothing in the repository records.
# Found by running this checker against this repository's own T1 commit rather than reasoned out.
assert_S13_AGREE() {
  { [ -n "$tr_gate" ] && [ -n "$tr_ev" ]; } || { note "S13.AGREE         -- not evaluated: needs both Gate: and Evidence: to compare"; return; }
  if [ -n "$ev_pin" ]; then at=$ev_pin; else at=$sha; fi
  blob=$(git -C "$repo" show "$at:$ev_path" 2>/dev/null) || blob=""
  if [ -z "$blob" ]; then
    note "S13.AGREE         -- not evaluated: the Evidence: target is unreadable at $at; that is S13.EVIDENCESHA's finding, not a disagreement"
    return
  fi
  recorded=$(printf '%s\n' "$blob" | fmv_stdin gates_signed)
  case "$recorded" in "["*) recorded="" ;; esac   # an unfilled template placeholder is absence, not a value
  read_at="the Evidence: pin $at"
  if [ -z "$recorded" ] && [ "$at" != "$sha" ]; then
    blob=$(git -C "$repo" show "$sha:$ev_path" 2>/dev/null) || blob=""
    recorded=$(printf '%s\n' "$blob" | fmv_stdin gates_signed)
    case "$recorded" in "["*) recorded="" ;; esac
    read_at="the attesting commit $short (the pin $at predates the record, as it must)"
  fi
  if [ -z "$recorded" ]; then
    bad "S13.AGREE         -- attestation-disagrees-with-sprint: '$ev_path' records no gates_signed: at the Evidence: pin $at nor at the attesting commit $short, so the commit carries a sprint-level fact nothing in the repository records (§13b)"
    return
  fi
  rec_gates=$(norm_gates "$(printf '%s' "$recorded" | sed -n 's/^\([^@]*\)@.*/\1/p')")
  [ -n "$rec_gates" ] || rec_gates=$(norm_gates "$recorded")
  tr_gates=$(norm_gates "$tr_gate")
  if [ "$rec_gates" != "$tr_gates" ]; then
    bad "S13.AGREE         -- attestation-disagrees-with-sprint: trailer says 'Gate: $tr_gates', the record at '$ev_path' says '$rec_gates' (read at $read_at). §13b requires the two to agree -- the trailer carries the sprint-level fact, it does not restate it differently"
    return
  fi
  ok "S13.AGREE         -- trailer and sprint record agree ($tr_gates), read at $read_at"
}

assert_S13_UNSIGNEDCLAIM() {
  [ "$present" -gt 0 ] || { note "S13.UNSIGNEDCLAIM -- not evaluated: no attestation claimed on $short"; return; }
  if [ "$gsig" = "G" ]; then
    ok "S13.UNSIGNEDCLAIM -- commit signature is good (%G? = G); the trailer's contents are covered by it"
    return
  fi
  # Named, reported, and NOT exit-1 on purpose: this is the finding that separates Gated from
  # Attested, which §14 says a report states as a level. The wording below is also where S13.NOINFER
  # is demonstrated -- it says what the repository STATES and stops there.
  note "S13.UNSIGNEDCLAIM -- attestation-unsigned-claim-only: %G? = $gsig (no good signature). The repository STATES that '$tr_signer' approved '$tr_gate' and points at '$ev_path'; a verifier may NOT conclude from this that the named person approved anything (§13c)"
  unsigned=1
}

# --- driver: the work list is the spec's, not this script's ----------------------------------------
# Iterated WITHOUT a pipe on purpose: `printf | while read` runs the loop in a subshell, where every
# bad() would increment a `fail` the parent never sees -- the checker would report FAIL lines and exit
# 0, which is this repository's own most-repeated failure (a report disagreeing with its artifact).
saved_ifs=$IFS
IFS='
'
for row in $rules; do
  IFS=$saved_ifs
  # shellcheck disable=SC2086
  set -- $row
  id=$1; level=$2; mark=$3
  fn="assert_$(printf '%s' "$id" | tr '.' '_')"
  pid=$(printf '%-17s' "$id")   # the report is the product; ids line up whichever branch prints them
  case "$mark" in
    implementation-directed)
      note "$pid -- excluded by mark: implementation-directed. It constrains a tool's inference, never a repository; evaluating it here would emit a finding no adopter can ever clear (§14)"
      ;;
    mechanical)
      if command -v "$fn" >/dev/null 2>&1; then
        "$fn"
      else
        bad "$pid -- rule-unimplemented: the spec marks this mechanical at level $level and this checker has no assertion for it. A rule the spec states and the checker skips is a GAP, reported here rather than silently absent"
      fi
      ;;
    *)
      note "$pid -- not evaluated (mark: $mark, level: $level). Only 'mechanical' rules are decidable by a tool (§14)"
      ;;
  esac
  IFS='
'
done
IFS=$saved_ifs

# --- the level line -------------------------------------------------------------------------------
# §14: a conformant report states a level, the named findings preventing the next one, and never a
# score, a grade, or a percentage.
if [ "$present" -eq 0 ]; then
  note "level: none claimed -- $short makes no §13 attestation. Absence is not a failure and is not approval"
elif [ "$fail" -ne 0 ]; then
  note "level: below Gated -- the FAIL findings above prevent the attestation from being read as recorded"
elif [ "$unsigned" -ne 0 ]; then
  note "level: Gated (not Attested) -- the format is in place and the signing is not, which is the honest statement (§13c). Preventing finding: attestation-unsigned-claim-only"
else
  note "level: Attested -- trailers complete on the task's own commit, pinned, agreeing with the record, and covered by a good signature"
fi

exit $fail
