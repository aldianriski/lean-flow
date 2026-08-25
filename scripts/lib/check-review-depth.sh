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
#   no `review ·` line at all            -> see TD-085 below: FAIL if a task's own rollup line names
#                                           governance:high/behaviour:material, else nothing to verify.
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
# --- TD-085: the absence branch itself was the blind spot -----------------------------------------
# The block above only ever grades a `review ·` line that EXISTS. A governance:high/behaviour:material
# task that closes with no `review ·` line at all used to fall straight through to "nothing to verify"
# and exit 0 -- SPRINT-082 closed 38 of 38 that way, and SPRINT-084's own live log reproduced it on
# itself. "No review line" is not evidence of "nothing owed"; it is silence, and silence about a
# governance/material task is exactly the shape `review-depth-unclassified` already refuses one line
# up (a missing marker is not a claim of low impact).
#
# The one other place a task's consequence class gets written down, independent of a `review ·` line,
# is its own rollup/state line -- `Tn · <state> · <unblock condition / next action>`, the format
# night-run.md Part 4 already defines and freezes. Real precedent for exactly this shape recording a
# classification while review was owed and not yet done:
#   docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md:283
#     T5 · parked-hitl · review parked: `governance:high`, no independent reviewer available this session
#
#   no `review ·` line anywhere for Tn, but a `Tn · <state> · ...` line for Tn backtick-quotes
#   `governance:high`                    -> FAIL review-depth-governance-absent.
#   no `review ·` line anywhere for Tn, but a `Tn · <state> · ...` line for Tn backtick-quotes
#   `behaviour:material`                 -> FAIL review-depth-material-absent.
#   no `review ·` line and no rollup line naming either class, for any Tn
#                                         -> nothing to verify (genuinely no evidence to act on).
#
# The rollup line is matched anchored at column 1 (`^T[0-9]+ · `), same discipline as `^review · `,
# because sprint logs discuss both markers in prose constantly -- a paragraph explaining *why* a task
# is governance:high is not a record that it IS, and must not match. The backtick-quoting requirement
# is a second anchor on top of the line anchor: real usage always writes the literal value quoted
# (`` `governance:high` ``), never bare, when recording it as data rather than discussing the concept.
#
# This is a heuristic, not an oracle -- a task can be governance:high with neither a review line nor a
# rollup line ever saying so, and no dependency-free shell script can see that. What this closes is the
# blind spot TD-085 named: when the record DOES say so, the checker no longer looks away.
#
# --- TD-092: the rollup line above is the UNATTENDED carrier only ---------------------------------
# `^T[0-9]+ · <state> · ...` is night-run.md Part 4's frozen contract, written by an unattended run.
# Every sprint this repository actually runs is attended, and attended entries are
# `### DATE | event | Tn -- summary` headers with the classification stated in prose -- so the rollup
# check above was proven correct and unreachable in the same session (SPRINT-085 T6's own surprise
# entry; SPRINT-084's live log reproduced the miss on itself). Tested directly, not assumed: copying
# SPRINT-084's archived log to a live path still printed `no review line -- nothing to verify`, exit 0,
# with real `governance:high` work in the file.
#
# The fix is a schema, not a better pattern (matching the classification stated in prose is the exact
# substring-heuristic shape that produced TD-085's siblings and fails green -- L-108). Attended entries
# now carry a second structured carrier, defined once in `review-scoping.md` § Two dimensions and
# written at the moment review depth is decided -- independent of whether a review then fires, which is
# what makes it reachable even when the review itself is never logged:
#
#   consequence · Tn · behaviour:low|material · governance:low|high
#
# Unlike the rollup line, this schema needs no backtick-quoting discipline to stay un-matchable by
# prose -- its own fixed field positions ARE the anchor. It is matched as a *whole line*
# (`^consequence · T[0-9]+ · behaviour:(low|material) · governance:(low|high)$`), not a prefix, so a
# sentence that happens to start a line with the word "consequence" still cannot trip it.
#
#   no `review ·` line anywhere for Tn, but a `consequence · Tn · ...` line for Tn records
#   `governance:high`                    -> FAIL review-depth-governance-absent (same named finding
#                                            as the rollup branch -- one failure class, two carriers).
#   no `review ·` line anywhere for Tn, but a `consequence · Tn · ...` line for Tn records
#   `behaviour:material`                 -> FAIL review-depth-material-absent.
#   consequence line records low/low and no review line                -> nothing to verify (correct;
#                                                                          the cheap path earned it).
#
# --- Ruling: the archive-skip half (TD-085's other named gap) -------------------------------------
# RULED: archived paths stay unread by this checker; recording a review INTO an archived log is what's
# forbidden, not the skip itself. `*/archive/*` is a shared convention across three checkers
# (check-system-verify-block.sh, check-night-run-rollup.sh, this one) -- making archived paths readable
# by name would be a convention change touching all three, out of this task's Layers, and would still
# leave the other two blind to whatever this one newly reads. The cheaper, sufficient fix: a review
# owed on a task belongs on the LIVE log, appended before the sprint archives -- never appended to the
# archive copy afterward, which is what put SPRINT-082's four review lines somewhere this checker (by
# design, matching its siblings) will never look. Filed here rather than left implicit.
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

  filefail=0

  # TD-085 absence check: a task's own rollup line can record `governance:high` /
  # `behaviour:material` while no `review ·` line was ever appended for it -- review owed, and the
  # record is silent rather than clean. Runs for every task with a rollup line, whether or not the
  # file holds review lines for OTHER tasks, so a partially-reviewed log can't hide the one task that
  # wasn't.
  while IFS= read -r rline; do
    [ -n "$rline" ] || continue
    rtid=$(printf '%s' "$rline" | sed -E 's/^(T[0-9]+) ·.*/\1/')
    grep -qE "^review · $rtid · " "$lg" 2>/dev/null && continue
    case "$rline" in
      *'`governance:high`'*)
        bad "review-depth-governance-absent: $lg $rtid's rollup line records \`governance:high\` and no review · line was ever appended for $rtid -- review was owed and silence is not a clean record"
        filefail=1 ;;
    esac
    case "$rline" in
      *'`behaviour:material`'*)
        bad "review-depth-material-absent: $lg $rtid's rollup line records \`behaviour:material\` and no review · line was ever appended for $rtid -- review was owed and silence is not a clean record"
        filefail=1 ;;
    esac
  done <<EOF
$(grep -E '^T[0-9]+ · ' "$lg" 2>/dev/null)
EOF

  # TD-092 absence check: the attended-mode carrier. Each `consequence ·` line is matched as a whole
  # line, not a prefix, so this cannot be tripped by a paragraph that merely opens with the word.
  while IFS= read -r cline; do
    [ -n "$cline" ] || continue
    ctid=$(printf '%s' "$cline" | sed -E 's/^consequence · (T[0-9]+) ·.*/\1/')
    grep -qE "^review · $ctid · " "$lg" 2>/dev/null && continue
    case "$cline" in
      *' governance:high'*)
        bad "review-depth-governance-absent: $lg $ctid's consequence line records governance:high and no review · line was ever appended for $ctid -- review was owed and silence is not a clean record"
        filefail=1 ;;
    esac
    case "$cline" in
      *' behaviour:material'*)
        bad "review-depth-material-absent: $lg $ctid's consequence line records behaviour:material and no review · line was ever appended for $ctid -- review was owed and silence is not a clean record"
        filefail=1 ;;
    esac
  done <<EOF
$(grep -E '^consequence · T[0-9]+ · behaviour:(low|material) · governance:(low|high)$' "$lg" 2>/dev/null)
EOF

  if ! grep -qE '^review · ' "$lg" 2>/dev/null; then
    [ "$filefail" -eq 0 ] && note "review depth: $lg has no review line -- nothing to verify"
    continue
  fi

  # Examine each self-review record on its own line: one log holds many tasks, and a governance
  # violation on T3 must not be masked by an honest self-review on T1 (the whole-file grep that would
  # do exactly that is the bug this loop exists to avoid).
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
