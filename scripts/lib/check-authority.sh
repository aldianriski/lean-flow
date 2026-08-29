#!/usr/bin/env sh
# check-authority.sh -- every sprint task declares an authority class, and a J2 task is not executed
# in place of being parked (SPRINT-088 T1, TASK-292, EPIC-015 § Closed-when 3).
#
# night-run.md Part 0 § Authority classes names three: J0 needs no approval, J1 is delegated in
# advance by a recorded pre-launch approval and runs unattended inside that envelope only, and J2 is
# human-reserved and PARKS. The classes describe behaviour the loop already had; what was missing was
# any place a run could READ them, and any check that they were written down at all.
#
# Two assertions, deliberately different in kind:
#
#   DECLARED -- every `### Tn` block carries J0|J1|J2 in its header meta. A MISSING class is a FAIL,
#   never a default-to-J0: Part 0's invariant is that an unasked question is a BLOCK, so the safe end
#   is J2 and an undeclared task is exactly the state that cannot be distinguished from an unread
#   one. This is the half that is checkable at promote, before anything runs.
#
#   HONOURED -- a J2 task that carries an EXECUTION record in the sprint's Execution Log while
#   carrying no PARK record has been run on authority it never had. This is the half that is only
#   checkable after a run, and it is the one a false negative hides completely: the run reports
#   success, the DoD is ticked, and nothing anywhere says a human was skipped.
#
# Matching is by POSITION, not substring (L-108). A markdown corpus is self-describing -- this very
# comment names `J2` and `parked` -- so every pattern below is anchored at column 1 or inside an
# extracted header-meta field, and never grepped loose over the file. A rule keyed to a shape the
# system never emits is an absent guard (L-166), so both shapes here are the ones the SPRINT template
# and night-run.md Part 4 actually write.
#
# --- TD-123: HONOURED's first branch was mode-blind -------------------------------------------------
# Parking is what an UNATTENDED run does *instead of* asking -- it exists because a headless session
# has no ask channel at all (night-run.md Part 0: "Absence != consent"). An ATTENDED run has a live
# channel and uses it directly; there is no park step to perform, so demanding a park record from one
# inverts the rule it is trying to enforce. The `consequence · Tn · behaviour:… · governance:…` line
# this checker reads as "executed" is written at every task's completion in EITHER mode (night-run.md
# Part 4's review-depth schema, TD-092) -- so on its own it never told the two apart, and every
# attended J2 completion misread as an unauthorised one (live on this repo's own tree: SPRINT-093 T1
# and T2, executed attended under signed G1/G2, both reported `authority-j2-not-parked`).
#
# The fix adds one FILE-LEVEL mode signal, `unattended_touch`, computed once per sprint file: does its
# Execution Log carry a `^terminal · <STATE> · ` line anywhere? That line is night-run.md Part 0b/Part
# 4's frozen contract -- "required on every completed-run rollup" and "emitted at every exit ... even
# by the watchdog on a stall" -- written by the process wrapper that outlives the run, never by the
# model's own turn (the same split ADR-016 already made for the DoD count, ADR-016's rationale: "a
# run's own sense of 'I am finished' is exactly what is unreliable"). The executing agent cannot
# suppress it to make itself read as attended, which is what makes this signal usable for a governed
# check: the thing it governs (an unattended run skirting the park) has no path to write, or omit, the
# very artifact its own launcher is contracted to leave on every exit path. Verified against this
# repo's real committed logs: SPRINT-090 (genuinely unattended) carries `terminal · AUTHORITY_BOUNDARY
# · …` at column 1; SPRINT-093 (never run unattended -- its own Plan text says so) carries the string
# `terminal` only inside back-tick-quoted prose discussing OTHER sprints' lines, never at column 1, so
# `unattended_touch` reads correctly as 0 for it without any special-casing.
#
# Fail-safe direction: absence of the marker is not read as ambiguity, it is read as the system's own
# guarantee working in the other direction -- an unattended run that reached ANY exit (clean, stalled,
# or hard-failed) would have left one, so "none anywhere in this log" is the strongest evidence
# available that no unattended run has touched this file. Where that guarantee could still be defeated
# (an instantaneous process kill the watchdog never gets to react to) the gap is night-run.sh's own
# Part 0b contract, not something this checker can see past without touching a file outside its
# Layers -- named here rather than left implicit. The bypass branch below is UNCHANGED by any of this:
# its own precondition (`parked>0`) already only ever fires on the `^Tn · parked…` line, which is
# itself unattended-only by the same TD-092 precedent, so it was never reachable from an attended log
# in the first place and needed no gate.
#
# Usage: sh check-authority.sh <sprint-file>...
# Prints one PASS/FAIL line per assertion; exits 1 if any FAIL line was printed, 0 otherwise.
# Dependency-free POSIX sh.
set -u

if [ "$#" -eq 0 ]; then
  printf '      %s\n' "authority: no sprint files given -- nothing verified"
  exit 0
fi

out="${TMPDIR:-/tmp}/authority.$$"
: > "$out"

for sp in "$@"; do
  if [ ! -f "$sp" ]; then
    printf 'FAIL  %s\n' "authority: file not found: $sp" >> "$out"
    continue
  fi

  # A CLOSED sprint is out of scope, and this is a scoping rule rather than a leniency. The class is
  # declared at promote/G2 -- both of which are behind a closed sprint, whose Plan is history and
  # cannot be re-declared without rewriting the record the close attested to. Enforcing it there
  # would emit a finding nobody can clear, which is exactly what §14 forbids and what the
  # gates-signed family already settled for docs/sprint/archive/ (its `archived-out-of-scope` case).
  # Found by wiring this checker into qa-check.sh and reading what it did to SPRINT-087, not reasoned
  # out in advance.
  status=$(awk 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} /^status:[ \t]*/{sub(/^status:[ \t]*/,"");print;exit}' "$sp")
  if [ "$status" = "closed" ]; then
    printf '      %s\n' "authority: skip (status: closed -- the class is declared at promote/G2, both behind this sprint): $sp" >> "$out"
    continue
  fi

  # Execution Log sibling: docs/sprint/SPRINT-N.md -> docs/sprint/logs/SPRINT-N.md. Created lazily at
  # the first entry (ADR-014), so its ABSENCE means nothing has run yet -- a skip, never a FAIL.
  log="$(dirname "$sp")/logs/$(basename "$sp")"

  # TD-123 mode signal -- computed ONCE per sprint file, never per task: has night-run.sh's unattended
  # machinery touched this log at all? Anchored at column 1 against Part 0b's five named terminal
  # states, so a paragraph merely discussing "terminal · PLAN_EXHAUSTED" in back-ticked prose (this
  # very file's own SPRINT-093 log does exactly that, quoting a DIFFERENT sprint's line) cannot match.
  unattended_touch=0
  if [ -f "$log" ] && grep -Eq '^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) · ' "$log"; then
    unattended_touch=1
  fi

  # "<Tn>\t<class-or-empty>" per task block. The header meta is the backtick-quoted `[...]` field on
  # the `### Tn` line; the class is a standalone J0/J1/J2 token inside it, so a `J1` appearing in the
  # task's prose title cannot be read as a declaration.
  records=$(awk '
    /^### T[0-9]+ / {
      tid=$2
      meta=""
      if (match($0, /\[[^]]*\]/)) meta=substr($0, RSTART, RLENGTH)
      cls=""
      n=split(meta, parts, /[][ ]*·[ ]*/)
      for (i=1; i<=n; i++) {
        p=parts[i]
        gsub(/^[[ \t]+|[] \t`]+$/, "", p)
        if (p=="J0" || p=="J1" || p=="J2") cls=p
      }
      print tid "\t" cls
    }
  ' "$sp")

  if [ -z "$records" ]; then
    printf '      %s\n' "authority: skip (no ### Tn task blocks): $sp" >> "$out"
    continue
  fi

  printf '%s\n' "$records" | while IFS="$(printf '\t')" read -r tid cls; do
    [ -n "$tid" ] || continue

    if [ -z "$cls" ]; then
      printf 'FAIL  %s\n' "authority-undeclared: $sp $tid carries no J0/J1/J2 in its header meta. An undeclared class is an unasked question and an unasked question is a BLOCK (night-run.md Part 0), so this reads as J2 rather than defaulting to J0 -- declare it at promote/G2 beside class:" >> "$out"
      continue
    fi
    printf 'PASS  %s\n' "authority-declared: $sp $tid $cls" >> "$out"

    [ "$cls" = "J2" ] || continue
    [ -f "$log" ] || continue   # nothing has run; the honoured half is not yet checkable

    # All anchored at column 1, the shapes night-run.md Part 4 and the log template actually emit.
    parked=$(awk -v t="$tid" '$0 ~ "^"t" · parked" {n++} END{print n+0}' "$log")
    executed=$(awk -v t="$tid" '$0 ~ "^consequence · "t" · " {n++} END{print n+0}' "$log")
    # A human resolving a park says so, in one shape, on its own line. Without this there is NO way to
    # tell a legitimate unblock from a silent bypass, because both leave a park record and an
    # execution record side by side.
    ruled=$(awk -v t="$tid" '$0 ~ "^owner-ruling · "t" · " {n++} END{print n+0}' "$log")

    if [ "$parked" -eq 0 ] && [ "$executed" -gt 0 ] && [ "$unattended_touch" -eq 1 ]; then
      printf 'FAIL  %s\n' "authority-j2-not-parked: $sp $tid is declared J2 but its Execution Log carries an execution record and no park record, and this log's own \`terminal · \` line shows night-run.sh's unattended machinery reached it. A J2 step is human-reserved: it parks with its unblock condition, it is never asked, decided, or worked around (night-run.md Part 0 § Park protocol)" >> "$out"
    elif [ "$parked" -gt 0 ] && [ "$executed" -gt 0 ] && [ "$ruled" -eq 0 ]; then
      # The silent bypass. Parking and then doing it anyway is EXACTLY what Part 0 step 6 forbids, and
      # the first version of this check could not see it: it tested only for an ABSENT park record, so
      # any park record -- however stale, however ignored -- was taken as proof of legitimacy. Caught
      # by an independent reviewer, not by any of the nine fixtures guarding this file (L-165).
      printf 'FAIL  %s\n' "authority-j2-park-bypassed: $sp $tid is declared J2 and its Execution Log carries BOTH a park record and an execution record, with no \`owner-ruling · $tid · <ruling>\` line resolving the park. Parking a step and then working it anyway is the bypass Part 0 step 6 forbids; a stale park record is not authority. If a human did unblock it, record that ruling -- an unrecorded unblock is indistinguishable from a bypass" >> "$out"
    elif [ "$parked" -eq 0 ] && [ "$executed" -gt 0 ]; then
      # unattended_touch is 0 here (the FAIL branch above already claimed the ==1 case): an executed
      # J2 task with no park record, in a log no unattended run has ever touched, is an attended
      # completion -- the human WAS the ask channel, in person, and Part 0's park protocol has nothing
      # to record because it was never invoked. Not a silent pass: named so the reasoning is auditable.
      printf 'PASS  %s\n' "authority-j2-honoured: $sp $tid executed with no park record, but no \`terminal · \` line anywhere in this log shows night-run.sh's unattended machinery ever reached it -- read as an attended completion, where the human is the ask channel and Part 0's park protocol (built for a headless run with none) does not apply ($executed execution record(s), 0 park, $ruled owner ruling(s))" >> "$out"
    else
      printf 'PASS  %s\n' "authority-j2-honoured: $sp $tid ($parked park record(s), $executed execution record(s), $ruled owner ruling(s))" >> "$out"
    fi
  done
done

cat "$out"
fail=0
grep -q '^FAIL' "$out" && fail=1
rm -f "$out"
exit $fail
