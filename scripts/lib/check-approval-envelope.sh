#!/usr/bin/env sh
# check-approval-envelope.sh -- the pre-launch approval an unattended run consumes must be recorded
# where that run can read it, and must cover every dimension of the envelope
# (SPRINT-088 T4, TASK-295, EPIC-015 § Closed-when 4).
#
# --- why the sprint frontmatter and nowhere else --------------------------------------------------
# An unattended run reads the sprint file. It does not read the launching transcript, the commit
# message, or the conversation where the owner said "yes, go ahead". A ruling filed outside the
# artifact its consumer parses leaves the system behaving exactly as if it had never been taken, and
# it fails SILENTLY, because the author watched themselves decide (L-099 · L-151). So the approval is
# frontmatter, checked here, and its absence is never read as approval -- the same rule
# `gates_signed:` already follows.
#
# --- why all ten dimensions, named individually ---------------------------------------------------
# The failure mode is an envelope that SILENTLY WIDENS: a run exceeds an approval it never re-read,
# and nothing reports having done so. A single "approved: yes" cannot detect that, because it records
# no boundary at all. Ten named dimensions make the boundary explicit and make a gap nameable -- this
# checker reports WHICH dimension is missing, never a bare "malformed", because "your approval is
# incomplete" is not actionable and "your approval does not state a budget" is.
#
# An UNFILLED TEMPLATE PLACEHOLDER counts as absent, exactly as it does for gates_signed: otherwise
# the shipped template would bless every sprint nobody approved -- the guarded failure reintroduced
# through the artifact that creates the thing being guarded.
#
# Usage: sh check-approval-envelope.sh <sprint-file>...
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed, 0 otherwise.
# A sprint with NO approval_envelope: field is reported as NOT APPROVED and is NOT a failure -- a
# sprint legitimately sits unapproved between promote and the pre-flight pass. Only a MALFORMED or
# INCOMPLETE one is a FAIL: a record nobody can act on looks like evidence and is worse than none.
# Dependency-free POSIX sh.
set -u

DIMENSIONS='goal scope acceptance design verification j1-delegation capabilities repair-policy budget stop-conditions'

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ "$#" -gt 0 ] || { note "approval envelope: no sprint files given -- nothing verified"; exit 0; }

for sp in "$@"; do
  [ -f "$sp" ] || { bad "approval envelope: file not found: $sp"; continue; }
  case "$sp" in */archive/*) continue ;; esac

  # Closed sprints are out of scope for the same reason the authority check skips them: the approval
  # is a PRE-launch artifact, and a closed sprint's launches are all behind it.
  status=$(awk 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} /^status:[ \t]*/{sub(/^status:[ \t]*/,"");print;exit}' "$sp")
  [ "$status" = "closed" ] && { note "approval envelope: skip (status: closed): $sp"; continue; }

  env_line=$(awk 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} /^approval_envelope:[ \t]*/{sub(/^approval_envelope:[ \t]*/,"");print;exit}' "$sp")

  # A bracketed value is the shipped template's placeholder, not a filled field.
  case "$env_line" in "["*) env_line="" ;; esac

  if [ -z "$env_line" ]; then
    note "approval envelope: $sp -- NOT APPROVED (no approval_envelope: field). An unattended run must treat this as unapproved, never as approval"
    continue
  fi

  # Shape: <dimension list> @ <sha>. The sha pins WHAT was approved; an approval with no pin approves
  # a moving target, which is the silent-widening failure in its purest form.
  case "$env_line" in
    *" @ "*) ;;
    *) bad "approval envelope: $sp -- malformed approval_envelope: '$env_line' (want '<dimensions> @ <sha>'). An approval with no commit pin approves a moving target"
       continue ;;
  esac
  env_dims=${env_line%% @ *}
  env_sha=${env_line##* @ }
  case "$env_sha" in
    ''|*[!0-9a-f]*) bad "approval envelope: $sp -- approval_envelope: pin '$env_sha' is not a hex sha; a pin that names nothing is not a pin"
                    continue ;;
  esac

  missing=""
  for d in $DIMENSIONS; do
    # Matched as a whole token between the standard separators, never as a substring: `budget` must
    # not be satisfied by `budget-policy`, and `scope` must not be satisfied by `out-of-scope`
    # (L-108 -- a keyword search standing in for a structural claim fails green).
    printf '%s' " $env_dims " | tr '·,' '  ' | tr -s ' ' | grep -qF " $d " || missing="$missing $d"
  done

  if [ -n "$missing" ]; then
    bad "approval envelope: $sp -- approval_envelope: does not cover:$missing. An envelope that omits a dimension is one that can silently widen along it, and nothing in a run reports having exceeded an approval it never re-read. Cover all ten: $DIMENSIONS"
  else
    ok "approval envelope $sp (all 10 dimensions covered, pinned @ $env_sha)"
  fi
done

exit "$fail"
