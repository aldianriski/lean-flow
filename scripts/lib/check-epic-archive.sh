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


# _members_scan <epic-file> <root> <want> -- member sprints in one of two states:
#   want=open    -- a Plan EXISTS and does not say status: closed
#   want=unknown -- no Plan for that id anywhere, so the fact cannot be read
#
# The split matters and the first draft did not have it. Treating an unfindable member as NOT
# closed is the conservative reading, but it blocks archival on a fact nobody can establish --
# an adopter who prunes old sprints could never archive an epic again -- and it broke two
# RETAINED fixtures whose epics name member sprints they never modelled. Unknown is therefore
# NAMED on the report and does not gate, which is how S11.WHENITRUNS already handles a sprint
# it cannot phase: reported as unread rather than passed (L-058 -- never silently skipped).
#
# §11's archival trigger is "every member sprint closed AND the epic's Closed-when conditions all
# [x]", and its Conformance row calls that "a genuine TWO-PART test" in those words. This checker
# implemented only the second half until SPRINT-080 T4, which is wrong in both directions: it demands
# archival of an epic whose conditions are met while a member sprint is still running (a false
# positive that fired on EPIC-004 itself), and it accepts an epic archived while a member sprint is
# open (the silent false negative §11 warns about -- "never archive on member-sprint count alone --
# an epic whose last sprint closed with exit conditions unmet is unfinished, not done").
#
# A member is closed if its Plan is under docs/sprint/archive/, or its live Plan says status: closed.
# A member with no Plan at all counts as NOT closed: an id naming nothing is a fact we cannot verify,
# and defaulting it to closed would let a typo authorise an archive.
_members_scan() {
  _ms=$(awk '/^member_sprints:/ { sub(/^member_sprints:[[:space:]]*/, ""); gsub(/[][,]/, " "); print; exit }' "$1")
  _out=""
  for _m in $_ms; do
    [ -n "$_m" ] || continue
    # TWO ID FORMATS ARE IN USE and both are legitimate: EPIC-001/002 write full ids
    # (`[SPRINT-025, SPRINT-026]`), EPIC-004 writes bare numbers (`[072, 073]`). Globbing the raw
    # token built `SPRINT-SPRINT-025-*` for the first shape and reported three correctly archived
    # epics as having open members. Normalise to the number, then glob once.
    _m=${_m#SPRINT-}; _m=${_m#sprint-}
    _found=0; _closed=0
    for _f in "$2"/docs/sprint/archive/SPRINT-"$_m"-*.md; do
      [ -f "$_f" ] && { _found=1; _closed=1; }
    done
    if [ "$_closed" -eq 0 ]; then
      for _f in "$2"/docs/sprint/SPRINT-"$_m"-*.md; do
        [ -f "$_f" ] || continue
        _found=1
        [ "$(fmv "$_f" status)" = "closed" ] && _closed=1
      done
    fi
    case "$3" in
      open)    [ "$_found" -eq 1 ] && [ "$_closed" -eq 0 ] && _out="$_out $_m" ;;
      unknown) [ "$_found" -eq 0 ] && _out="$_out $_m" ;;
    esac
  done
  printf '%s' "${_out# }"
}
open_members()    { _members_scan "$1" "$2" open; }
unknown_members() { _members_scan "$1" "$2" unknown; }
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
  elif [ -n "$(open_members "$e" "$root")" ]; then
    bad "epic-archive: $rel archived while member sprint(s) $(open_members "$e" "$root") are still open -- §11 makes this a TWO-PART test and is explicit that an epic is never archived on member-sprint count alone. An epic whose sprints are unfinished is unfinished, and archiving it hides that"
  else
    ok "epic-archive: $rel archived correctly ($tot condition(s), all met, status closed, every member sprint closed)"
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
  omem=$(open_members "$e" "$root")
  if [ "$st" = "closed" ] && [ "$tot" -gt 0 ] && [ "$opn" -eq 0 ] && [ -z "$omem" ]; then
    bad "epic-archive: $rel is closed with every § Closed when condition met and every member sprint closed, but still sits in docs/epic/ -- §11 says move it to docs/epic/archive/ and keep its INDEX.md row"
  elif [ "$st" = "closed" ] && [ "$tot" -gt 0 ] && [ "$opn" -eq 0 ]; then
    # BOTH halves of §11's trigger are required and only one has fired. This is a real, correct and
    # previously unrepresentable state: the epic is finished, the sprint that finished it is not.
    # Demanding the move here is the false positive that fired on EPIC-004 at SPRINT-080 T4.
    ok "epic-archive: $rel correctly NOT yet archived -- status closed and all $tot condition(s) met, but member sprint(s) $omem are still open. §11's trigger is a two-part test and the second half has not fired"
  else
    ok "epic-archive: $rel correctly live (status '$st', $opn of $tot condition(s) open)"
  fi
done

# --- direction (c): an ACTIVE epic must not drift out of date with its own members ----------------
# SPRINT-094 T1 (TASK-324), owner-requested. Directions (a) and (b) above answer "should this epic be
# archived?" -- a question that only goes live at the very end. Nothing anywhere asked "is this epic's
# rollup CURRENT?", so an epic could sit misreporting its own state indefinitely with every gate
# green. Not hypothetical: EPIC-014 carried `last_updated: 2026-08-29` over a body edited at
# SPRINT-092's close on 2026-08-31, through a fully green gate, and was found by hand at the
# SPRINT-094 promote rather than by any check.
#
# Why here rather than a second script: this file already parses § Closed-when ticks,
# `member_sprints:`, per-member closed-state and `status:` -- the majority of the machinery. TD-087
# and TD-097 are what two Shell checkers over one artifact turns into: two rows for one script, filed
# three sprints apart, neither aware of the other until a close sweep read them together (G2 ruling).
#
# Findings carry the `epic-state:` prefix, distinct from `epic-archive:` above, so a reader tells a
# retention violation from a rollup-drift one without parsing the sentence (L-058).
#
# Scoped to `status: active` deliberately: a closed-but-unarchived epic is (a)/(b)'s subject and
# re-reporting it here would double-count, and a `proposed` epic has no members to drift from.
#
# Every loop below is fed by a heredoc, NOT by `echo |`. A pipeline runs its loop body in a subshell,
# where `fail=1` and `drift=1` are set and then discarded -- the check would print its findings and
# still exit 0. That is the silent false negative this whole sprint exists to remove, and it is one
# character of syntax away at all times.

# Status cell (3rd column) of the § Member sprints row naming SPRINT-<num>; empty when no row exists.
# `| a | b | c | d |` splits on `|` into c[1]="" c[2]=a c[3]=b c[4]=c, so Status is c[4]. Read the
# CELL, never the row: contribution prose is dense with backticked tokens and matching a sha anywhere
# on the line would let one satisfy this from the wrong column (L-108).
member_status_cell() {
  awk -v want="$2" '
    /^## Member sprints/{f=1;next}
    f&&/^## /{exit}
    f&&/^\|/ {
      if ($0 ~ ("SPRINT-0*" want)) {
        n=split($0, c, "|")
        if (n >= 4) { s=c[4]; gsub(/^[ \t]+|[ \t]+$/, "", s); print s; exit }
      }
    }' "$1"
}

# "<num> <last_updated>" per member sprint whose Plan says status: closed. Archive wins over a live
# path, matching _members_scan's precedence above.
closed_members() {
  _cm=$(awk '/^member_sprints:/ { sub(/^member_sprints:[[:space:]]*/, ""); gsub(/[][,]/, " "); print; exit }' "$1")
  for _c in $_cm; do
    [ -n "$_c" ] || continue
    _c=${_c#SPRINT-}; _c=${_c#sprint-}
    _cf=""
    for _p in "$2"/docs/sprint/archive/SPRINT-"$_c"-*.md "$2"/docs/sprint/SPRINT-"$_c"-*.md; do
      [ -f "$_p" ] && { _cf=$_p; break; }
    done
    [ -n "$_cf" ] || continue
    [ "$(fmv "$_cf" status)" = "closed" ] || continue
    printf '%s %s\n' "$_c" "$(fmv "$_cf" last_updated)"
  done
}

# Ticked § Closed-when conditions whose block names no SPRINT-NNN. The block is the `- [x]` line plus
# every following line up to the next checkbox: attribution is routinely on a continuation
# ("-- **SPRINT-085**: 100/100 rows"), so reading the first line alone would report every correctly
# attributed condition as unattributed -- a false positive severe enough to get the check ignored.
ticked_unattributed() {
  awk '
    function flush() { if (open && blk !~ /SPRINT-[0-9]/) { s=substr(blk,1,72); gsub(/\|/,"/",s); print s } open=0; blk="" }
    /^## Closed when/{f=1;next}
    f&&/^## /{flush(); exit}
    f&&/^- \[x\]/{ flush(); open=1; blk=$0; next }
    f&&/^- \[ \]/{ flush(); next }
    f&&open{ blk=blk " " $0 }
    END{ flush() }
  ' "$1"
}

for e in "$root"/docs/epic/EPIC-*.md; do
  [ -f "$e" ] || continue
  [ "$(fmv "$e" status)" = "active" ] || continue
  rel=${e#"$root"/}
  cmem=$(closed_members "$e" "$root")
  drift=0

  # (a) every closed member has a rollup row carrying its close_commit. The Status cell format is
  #     EPIC.md.template's own -- `closed · `<close_commit>`` -- so this encodes the template's rule
  #     rather than inventing one to make the criterion look mechanical.
  while read -r num _rest; do
    [ -n "$num" ] || continue
    cell=$(member_status_cell "$e" "$num")
    if [ -z "$cell" ]; then
      bad "epic-state: $rel SPRINT-$num is closed but has NO row in § Member sprints -- the rollup this table exists for never happened, so epic status is reconstructable only by reading the sprint archive"
      drift=1
    elif ! printf '%s' "$cell" | grep -qE '`[0-9a-f]{7,40}`'; then
      bad "epic-state: $rel SPRINT-$num's § Member sprints Status cell carries no close_commit -- reads '$cell'. EPIC.md.template states the cell as 'closed · \`<close_commit>\`', so this row cannot be traced to the commit that closed it"
      drift=1
    fi
  done <<CMEOF
$cmem
CMEOF

  # (b) the ownership header tracks its own update_trigger. For an epic that trigger is "a member
  #     sprint closes", so a last_updated older than the newest closed member's is a header that has
  #     stopped following its body. Invisible to S3.SCHEMA, which asserts the field is PRESENT and
  #     never that it is current -- which is why EPIC-014 passed every gate while stale.
  newest=$(printf '%s\n' "$cmem" | awk 'NF==2{print $2}' | sort | tail -1)
  elu=$(fmv "$e" last_updated)
  if [ -n "$newest" ] && [ -n "$elu" ] && [ "$elu" \< "$newest" ]; then
    bad "epic-state: $rel last_updated is $elu but its newest closed member sprint closed $newest -- its own update_trigger (a member sprint closes) fired and the header did not follow"
    drift=1
  fi

  # (c) a ticked exit condition names the sprint that closed it. An unattributed `[x]` records that
  #     something is done without recording what did it, so the evidence is unreachable.
  while IFS= read -r u; do
    [ -n "$u" ] || continue
    bad "epic-state: $rel has a ticked § Closed-when condition naming no closing sprint -- \"$u...\". A tick with no SPRINT-NNN behind it says something is done but not what did it, so its evidence cannot be found"
    drift=1
  done <<TUEOF
$(ticked_unattributed "$e")
TUEOF

  [ "$drift" -eq 0 ] && ok "epic-state: $rel rollup current (every closed member rolled up with its close_commit, header tracks its newest member close, every ticked condition attributed)"
done

[ "$checked" -eq 0 ] && printf '      %s\n' "epic-archive: skip (no epics under docs/epic/)"
exit $fail
