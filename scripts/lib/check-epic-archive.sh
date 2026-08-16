#!/usr/bin/env sh
# check-epic-archive.sh -- enforces STANDARD §11's epic retention row in BOTH directions
# (SPRINT-055 T2, TASK-167).
#
# §11 says an epic moves to docs/epic/archive/ when every member sprint has closed AND every
# § Closed when condition is `[x]`, and warns: "Never archive on member-sprint count alone -- an
# epic whose last sprint closed with exit conditions unmet is unfinished, not done, and archiving it
# hides that." That row shipped with the epic layer and `close` never executed it, so it had never
# run once. EPIC-001 sat closed and fully ticked in docs/epic/ for the whole of SPRINT-049..054.
#
# Two failures, opposite directions, both silent without a check:
#   (a) ARCHIVED TOO EARLY -- an epic under archive/ with an open condition or a non-closed status.
#       This is the one §11 warns about: archiving hides the unfinished work.
#   (b) ELIGIBLE BUT NOT ARCHIVED -- an epic still in docs/epic/ that meets every condition. This is
#       the drift that actually happened. A retention rule nothing enforces simply stops running,
#       and nothing anywhere reports that it stopped.
#
# Checking only (a) would pass the exact state this task was filed to fix.
#
# Usage: sh check-epic-archive.sh <repo-root>
# Prints one PASS/FAIL line per epic; exits 1 if any FAIL line was printed, 0 otherwise.
# No epics at all is a silent skip -- most repos have none. Dependency-free POSIX sh.
set -u

root=${1:?usage: check-epic-archive.sh <repo-root>}
[ -d "$root" ] || { echo "FAIL epic-archive: repo root not found at $root"; exit 2; }

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }

# Frontmatter value for <key>, first block only.
fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

# Count unticked "- [ ]" lines under the "## Closed when" heading, to the next "## " or EOF.
open_conditions() {
  awk '/^## Closed when/{f=1;next} f&&/^## /{exit} f&&/^- \[ \]/{n++} END{print n+0}' "$1"
}
# Total conditions under the same heading -- a section with none is itself a defect: an epic with no
# exit condition can never be shown to be finished, so "all ticked" would be vacuously true.
total_conditions() {
  awk '/^## Closed when/{f=1;next} f&&/^## /{exit} f&&/^- \[[ x]\]/{n++} END{print n+0}' "$1"
}

checked=0

# --- direction (a): epics already under archive/ must have earned it -----------------------------
for e in "$root"/docs/epic/archive/EPIC-*.md; do
  [ -f "$e" ] || continue
  checked=$((checked + 1))
  rel=${e#"$root"/}
  st=$(fmv "$e" status)
  opn=$(open_conditions "$e")
  tot=$(total_conditions "$e")
  if [ "$tot" -eq 0 ]; then
    bad "epic-archive: $rel archived with no § Closed when conditions at all -- nothing could have been verified"
  elif [ "$st" != "closed" ]; then
    bad "epic-archive: $rel archived while status is '$st', not 'closed'"
  elif [ "$opn" -ne 0 ]; then
    bad "epic-archive: $rel archived with $opn § Closed when condition(s) still open -- an epic whose exit conditions are unmet is unfinished, and archiving it hides that"
  else
    ok "epic-archive: $rel archived correctly ($tot condition(s), all met, status closed)"
  fi
done

# --- direction (b): live epics that already meet every condition must not linger -----------------
for e in "$root"/docs/epic/EPIC-*.md; do
  [ -f "$e" ] || continue
  checked=$((checked + 1))
  rel=${e#"$root"/}
  st=$(fmv "$e" status)
  opn=$(open_conditions "$e")
  tot=$(total_conditions "$e")
  if [ "$st" = "closed" ] && [ "$tot" -gt 0 ] && [ "$opn" -eq 0 ]; then
    bad "epic-archive: $rel is closed with every § Closed when condition met but still sits in docs/epic/ -- §11 says move it to docs/epic/archive/ and keep its INDEX.md row"
  else
    ok "epic-archive: $rel correctly live (status '$st', $opn of $tot condition(s) open)"
  fi
done

[ "$checked" -eq 0 ] && printf '      %s\n' "epic-archive: skip (no epics under docs/epic/)"
exit $fail
