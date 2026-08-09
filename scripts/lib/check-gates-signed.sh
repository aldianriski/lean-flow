#!/usr/bin/env sh
# check-gates-signed.sh -- the sprint file's `gates_signed:` record is well-formed, and its ABSENCE
# is never readable as approval (SPRINT-057 T5).
#
# Why the field exists: night-run Part 1 required batch G1/G2 to be "already signed off by the human"
# and never said the sign-off had to live in the sprint artifact. The run reads the sprint file and
# nothing else, so a sign-off held only in the launching session's transcript is invisible to it --
# the run re-runs both gates, reaches for AskUserQuestion (unregistered headless), and parks every
# task having done zero work. That is L-099 exactly: a rule written where its reader does not read it.
#
# --- the thing this check actually guards ---------------------------------------------------------
# The dangerous failure is NOT a malformed value; it is a MISSING field being treated as a pass. A new
# field whose absence reads as approval is the L-058 false negative shipped straight into a headless
# run, where nothing can ask and the whole Plan executes ungated. So:
#
#   field absent            -> reported as NOT SIGNED. Not a FAIL of this gate (a sprint may legitimately
#                              sit unsigned between promote and the gate pass) but never a silent pass,
#                              and never rendered as approval.
#   field present, garbled  -> FAIL. A record nobody can parse is worse than none, because it LOOKS
#                              like evidence -- the reporter's own class of failure.
#   field present, well-formed -> PASS, naming the gates and the commit it was signed at.
#
# Format: `gates_signed: <GATE>[,<GATE>...] @ <sha>` e.g. `gates_signed: G1,G2 @ 1f0c012`.
# The template ships the field COMMENTED-OUT-BY-PLACEHOLDER, so an unfilled template placeholder must
# read as absent rather than as a value -- that case has its own fixture.
#
# Usage: sh check-gates-signed.sh <sprint-plan.md> [<sprint-plan.md> ...]
# Archived sprints are skipped by path (docs/sprint/archive/), matching the location-scoping T4
# introduced -- a closed sprint is history, and its record is not re-litigated.
# Prints one PASS/FAIL/note line per file; exits 1 if any FAIL line was printed.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

[ "$#" -gt 0 ] || { note "gates-signed: no sprint files given -- nothing verified"; exit 0; }

for sp in "$@"; do
  [ -f "$sp" ] || { bad "gates-signed: file not found: $sp"; continue; }
  case "$sp" in */archive/*) continue ;; esac

  gs=$(fmv "$sp" gates_signed)

  # An unfilled template placeholder is ABSENCE, not a value. Left unhandled, `gates_signed: [G1,G2 @
  # <sha> ...]` would parse as "present" and the check would bless a sprint nobody ever signed --
  # which is the exact failure mode being guarded, reintroduced through the template.
  case "$gs" in "["*) gs="" ;; esac

  if [ -z "$gs" ]; then
    note "gates-signed: $sp -- NOT SIGNED (no gates_signed: field). An unattended run must treat this as unsigned, never as approval"
    continue
  fi

  gates=$(printf '%s' "$gs" | sed -n 's/^\([^@]*\)@.*/\1/p' | tr -d ' ')
  sha=$(printf '%s' "$gs" | sed -n 's/^[^@]*@[ ]*\([0-9a-f]\{7,40\}\).*/\1/p')

  if [ -z "$gates" ] || [ -z "$sha" ]; then
    bad "gates-signed: $sp -- malformed gates_signed: '$gs' (want '<GATE>[,<GATE>] @ <sha>'); a record nobody can parse looks like evidence and is worse than none"
    continue
  fi
  case "$gates" in
    *[!G0-9,]*) bad "gates-signed: $sp -- unrecognised gate token in '$gates' (want G1 / G2, comma-separated)"; continue ;;
  esac

  ok "gates-signed: $sp -- $gates signed @ $sha"
done

exit $fail
