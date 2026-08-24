#!/usr/bin/env sh
# check-review-depth.sh -- a sprint Execution Log must not record `self-review` against a change whose
# consequence demanded an independent pass (SPRINT-082 T2).
#
# Why this exists. Review depth used to be chosen by FILE TYPE: `review-scoping.md`'s skip table
# exempted "docs / config / trivial diff" from every agent pass. One line of spec/STANDARD semantics, an
# ADR that binds implementation, or a permission config can carry more consequence than fifty lines of
# implementation -- and each reads as "docs" or "config". So the cheap path was handed out by extension,
# and the changes least examined were sometimes the ones governing everything else. T2 re-keyed the
# routing onto consequence (§ Two dimensions: behaviour impact + governance impact).
#
# A rule alone would have been unenforceable. The routing decision is a judgement made while reviewing,
# and nothing wrote it down -- so no fixture could assert on it and the cheap path stayed
# self-certifying. night-run.md Part 4 now defines the record this checker reads:
#
#   review · Tn · <depth> · behaviour:<low|material> · governance:<low|high>
#
# The recorded shape is a CONTRACT, not a private guess -- this checker's regex and Part 4's documented
# line must stay in exact agreement (L-058). A checker asserting on a format no procedure tells anyone
# to write would false-positive every honest run the moment it is wired into qa-check.sh.
#
# --- the thing this check actually guards ---------------------------------------------------------
# NOT whether the review was any good, and not whether the classification was correct. The guarded
# failure is a review depth that contradicts the consequence recorded beside it:
#
#   no `review ·` line at all            -> nothing to verify (pre-dates this record, or not yet run).
#   depth other than self-review         -> PASS. An independent pass fired; this check has no opinion
#                                           on which one, that is § Scale depth's job.
#   self-review + behaviour:low
#     + governance:low                   -> PASS. The control: the cheap path, correctly earned.
#   self-review + governance:high        -> FAIL review-depth-governance-self-reviewed.
#   self-review + behaviour:material     -> FAIL review-depth-material-self-reviewed.
#   self-review + either class missing   -> FAIL review-depth-unclassified. A missing marker is not a
#     claim that the change was trivial -- same reasoning as `no-gate-risk-unmarked` (ADR-033): absence
#     read as consent is how the defect returns silently, for every run that simply forgot the marker.
#
# Usage: sh check-review-depth.sh <sprint-log.md> [<sprint-log.md> ...]
# Archived logs are skipped by path (docs/sprint/archive/) -- closed history is not re-litigated, same
# convention as check-system-verify-block.sh and check-night-run-rollup.sh.
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "review depth: no sprint logs given -- nothing verified"; exit 0; }

for lg in "$@"; do
  [ -f "$lg" ] || { bad "review depth: file not found: $lg"; continue; }
  case "$lg" in */archive/*) continue ;; esac

  if ! grep -qE '^review · ' "$lg" 2>/dev/null; then
    note "review depth: $lg has no review line -- nothing to verify"
    continue
  fi

  # Examine each self-review record on its own line: one log holds many tasks, and a governance
  # violation on T3 must not be masked by an honest self-review on T1 (the whole-file grep that would
  # do exactly that is the bug this loop exists to avoid).
  filefail=0
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    tid=$(printf '%s' "$line" | sed -E 's/^review · ([^ ]+) ·.*/\1/')

    case "$line" in
      *' · governance:high'*) gov=high ;;
      *' · governance:low'*)  gov=low ;;
      *)                      gov=missing ;;
    esac
    case "$line" in
      *' · behaviour:material'*) beh=material ;;
      *' · behaviour:low'*)      beh=low ;;
      *)                         beh=missing ;;
    esac

    if [ "$gov" = missing ] || [ "$beh" = missing ]; then
      bad "review-depth-unclassified: $lg $tid records 'self-review' without both consequence classes -- a missing marker is not a claim that the change was trivial, so it cannot buy the cheap path"; filefail=1
    elif [ "$gov" = high ]; then
      bad "review-depth-governance-self-reviewed: $lg $tid records 'self-review' against governance:high -- a change to a rule, contract or decision that other work is measured against does not earn the self-review floor, whatever its file extension"; filefail=1
    elif [ "$beh" = material ]; then
      bad "review-depth-material-self-reviewed: $lg $tid records 'self-review' against behaviour:material -- the running system does something different and no independent pass examined it"; filefail=1
    fi
  done <<EOF
$(grep -E '^review · [^ ]+ · self-review( |$)' "$lg" 2>/dev/null)
EOF

  # A negative assertion needs a positive witness (L-156): report the denominator, so a control that
  # examined nothing is visibly untested rather than quietly green.
  total=$(grep -cE '^review · ' "$lg" 2>/dev/null)
  selfn=$(grep -cE '^review · [^ ]+ · self-review( |$)' "$lg" 2>/dev/null)
  if [ "$filefail" -eq 0 ]; then
    ok "review depth $lg ($total review record(s), $selfn self-review examined and cleared on consequence)"
  fi
done

exit "$fail"
