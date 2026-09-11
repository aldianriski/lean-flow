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
# A member this checker cannot resolve against THIS repository. Named on the report and does not
# gate -- the stance _members_scan's header already declared for the `unknown` state and which
# nothing had ever emitted (see § member entries below). Silence here is an unchecked row, which is
# the failure one level down from the false positive (TD-144, SPRINT-097 T5 owner ruling).
note() { printf 'NOTE  %s\n' "$1"; }

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
# --- § member entries: the ONE extractor every member-resolving leg reads ------------------------
#
# THREE ID FORMATS ARE IN USE and all three are legitimate: EPIC-001/002 write full ids
# (`[SPRINT-025, SPRINT-026]`), EPIC-004 writes bare numbers (`[072, 073]`), and EPIC-016 writes
# REPO-QUALIFIED ids (`[workdoo SPRINT-001 (closed), workdoo SPRINT-002 (active)]`) because its
# member sprints live in another repository entirely (ADR-041).
#
# Every previous parse split the field on whitespace as well as commas, which severs a qualifier
# from the id it qualifies: `workdoo SPRINT-001 (closed)` became the four independent tokens
# `workdoo` `001` `(closed)`. `workdoo` and `(closed)` globbed nothing and vanished silently, and
# `001` then resolved against THIS repository's own SPRINT-001 -- so EPIC-016's rows were validated
# against a lean-flow sprint that has nothing to do with them and reported a close_commit mismatch
# on a correct artifact (TD-144). The epic file's own comment anticipated the checker being BLIND to
# workdoo; nobody anticipated it would COLLIDE with same-numbered local sprints.
#
# Splitting on commas FIRST keeps each entry whole, so the qualifier is still attached when the id
# is read. Emits one "<scope> <num>" line per entry -- scope is `local`, or the qualifier for a
# member that lives in another repository. An entry naming no number at all is skipped, exactly as
# before -- no: an entry naming no number is emitted as `unparsed` and reported. Dropping it was
# review CRITICAL-2: a dropped entry is invisible to `unverified_count`, so an epic scored ZERO
# unresolvable members and earned the FULLY AFFIRMATIVE "every member sprint closed" -- the one
# member class provably not verified getting the strongest claim the checker can make. The
# motivating artifact is this plugin's OWN shipped template, whose default
# `member_sprints: [SPRINT-NNN, SPRINT-NNN — appended as each is promoted]` selects nothing at all,
# so every epic scaffolded from it and archived before its members are filled in reads as fully
# verified. `["SPRINT-931"]` (quoted) and `[SPRINT-931-hardening]` (slug) do the same (L-166).
_member_entries() {
  awk '
    /^member_sprints:/ {
      sub(/^member_sprints:[[:space:]]*/, ""); gsub(/[][]/, "")
      n = split($0, e, ",")
      for (i = 1; i <= n; i++) {
        entry = e[i]
        gsub(/^[ \t]+|[ \t]+$/, "", entry)
        if (entry == "") continue                    # nothing declared here at all
        raw = entry                                  # what the FILE says, before any stripping
        gsub(/\([^)]*\)/, "", entry)                 # drop (closed)/(active) state annotations
        gsub(/^[ \t]+|[ \t]+$/, "", entry)
        # Emptiness is tested TWICE, and the order is the point. The strip used to run first, so an
        # entry written entirely in parentheses -- `[(closed), (active)]` -- was reduced to "" and
        # dropped by the test above: no member, no NOTE, invisible to unverified_count, and the epic
        # earned "every member sprint closed" while visibly declaring two members. That is the exact
        # invariant the `unparsed` branch was added to establish, reopened one line higher up.
        if (entry == "") { gsub(/[ \t]+/, "_", raw); print "unparsed " raw; continue }
        m = split(entry, t, /[ \t]+/); num = ""; qual = ""
        for (j = 1; j <= m; j++) {
          tok = t[j]; sub(/^[Ss][Pp][Rr][Ii][Nn][Tt]-/, "", tok)
          if (tok ~ /^[0-9]+$/) { num = tok; break }
          qual = (qual == "" ? tok : qual "-" tok)
        }
        if (num != "") { print (qual == "" ? "local" : qual) " " num; continue }
        # NO number anywhere in this entry. It is emitted as `unparsed` rather than dropped: see the
        # block comment above the function for why, and note that NO APOSTROPHE may appear anywhere
        # in this awk program, which is single-quoted to the shell.
        gsub(/[ \t]+/, "_", entry)
        print "unparsed " entry
      }
      exit
    }' "$1"
}

_members_scan() {
  _out=""
  while read -r _scope _m; do
    [ -n "$_m" ] || continue
    # A member in another repository is not resolvable against these globs at all. Excluding it
    # here is the whole fix: it is NAMED by note() at the call sites instead, never silently
    # dropped and never matched to a local sprint that merely shares its number.
    [ "$_scope" = "local" ] || continue
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
    # Heredoc, never `echo |` -- a pipeline runs this loop in a subshell and `_out` would be built
    # and discarded, leaving every scan empty. Same trap the epic-state loops carry below.
  done <<MSEOF
$(_member_entries "$1")
MSEOF
  printf '%s' "${_out# }"
}
open_members()    { _members_scan "$1" "$2" open; }
unknown_members() { _members_scan "$1" "$2" unknown; }

# Name every member this checker could not resolve against THIS repository, once per epic.
#
# Two kinds, one stance. A FOREIGN member lives in another repository by design (EPIC-016 ->
# workdoo, ADR-041); an UNKNOWN member is a local id naming no Plan anywhere, which `_members_scan`
# has separated out since SPRINT-080 T4 with a header declaring it "NAMED on the report and does not
# gate ... never silently skipped (L-058)" -- and which, until now, NOTHING CALLED. `unknown_members`
# had zero callers in the entire repository, so for five sprints this file documented a reporting
# behaviour it did not have: the stance was written, and the reader it was written for never saw a
# line. Both kinds now print, and neither sets `fail` -- an unresolvable member is a fact about this
# checker's reach, not a defect in the artifact it is reading.
# The COLLISION half is the guard pointed at its own motivating case (L-166). Locality is declared
# in frontmatter and nothing cross-checks that declaration, so ONE stray qualifier token silently
# removes a member from the verified set while its Plan sits on disk -- a wrong close_commit in the
# row would never be reported. The checker cannot tell a correct qualifier from a mistaken one:
# EPIC-016's `workdoo SPRINT-001` is right, and this repository really does own an unrelated
# SPRINT-001. So the NOTE states the collision as a FACT and names what was not done, rather than
# accusing a correct artifact -- which is also exactly the TD-144 shape this task was filed for.
report_unresolvable() {
  _ru_e=$1; _ru_root=$2; _ru_rel=$3
  while read -r _ru_scope _ru_num; do
    [ -n "$_ru_num" ] || continue
    [ "$_ru_scope" = "local" ] && continue
    if [ "$_ru_scope" = "unparsed" ]; then
      # Printed with whitespace still collapsed, and SAID so. Un-squashing with `tr '_' ' '` also
      # rewrote underscores the file really contains, so the NOTE quoted text the entry did not hold
      # while claiming to say what it "reads" (review round 3 MINOR-4).
      note "epic-archive: $_ru_rel has a member_sprints entry naming no sprint number -- entry, whitespace collapsed: '$_ru_num'. It selects NO member, so nothing was verified for it; §11's member half cannot be read from this entry at all"
      continue
    fi
    _ru_hit=""
    for _ru_p in "$_ru_root"/docs/sprint/archive/SPRINT-"$_ru_num"-*.md "$_ru_root"/docs/sprint/SPRINT-"$_ru_num"-*.md; do
      [ -f "$_ru_p" ] && { _ru_hit=${_ru_p#"$_ru_root"/}; break; }
    done
    if [ -n "$_ru_hit" ]; then
      note "epic-archive: $_ru_rel member $_ru_scope SPRINT-$_ru_num lives outside this repository, and this repository ALSO has a same-numbered Plan at $_ru_hit. That local Plan is a different sprint and was deliberately NOT used to verify this row (TD-144). If the qualifier is wrong and the member is local, this row is going unverified -- check it"
    else
      note "epic-archive: $_ru_rel member $_ru_scope SPRINT-$_ru_num lives outside this repository -- its rollup row cannot be verified here, and §11's archival trigger cannot be read for it. Keeping the row current is a manual obligation at that sprint's close (ADR-041)"
    fi
  done <<FMEOF
$(_member_entries "$_ru_e")
FMEOF
  for _ru_u in $(unknown_members "$_ru_e" "$_ru_root"); do
    note "epic-archive: $_ru_rel member SPRINT-$_ru_u names no Plan anywhere in this repository -- neither docs/sprint/ nor docs/sprint/archive/ has it, so its state is unread rather than passed"
  done
}

# How many members this checker could not resolve locally -- foreign plus unknown. Used to keep the
# success lines below from CLAIMING a closure test they never ran (review CRITICAL-1: direction (a)
# asserted "every member sprint closed" two lines above a NOTE saying the trigger cannot be read).
unverified_count() {
  _uc_f=$(_member_entries "$1" | awk '$1 != "local"' | wc -l)
  _uc_u=$(unknown_members "$1" "$2" | wc -w)
  echo $((_uc_f + _uc_u))
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
  elif [ -n "$(open_members "$e" "$root")" ]; then
    bad "epic-archive: $rel archived while member sprint(s) $(open_members "$e" "$root") are still open -- §11 makes this a TWO-PART test and is explicit that an epic is never archived on member-sprint count alone. An epic whose sprints are unfinished is unfinished, and archiving it hides that"
  else
    # The claim is narrowed when any member was unresolvable. §11's trigger is "every member sprint
    # closed", and an epic whose members this checker cannot reach has not been shown to meet it --
    # saying so plainly is the difference between a verified PASS and an assumed one.
    unv=$(unverified_count "$e" "$root")
    if [ "$unv" -gt 0 ]; then
      ok "epic-archive: $rel archived with $tot condition(s) all met and status closed, and every LOCAL member sprint closed -- but $unv member(s) could not be resolved against this repository (see NOTE), so §11's member half was NOT verified for them"
    else
      ok "epic-archive: $rel archived correctly ($tot condition(s), all met, status closed, every member sprint closed)"
    fi
  fi
  report_unresolvable "$e" "$root" "$rel"
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
    # The narrowing belongs here MOST of all, and the first pass put it only on the `ok` lines
    # (review CRITICAL-1). This branch does not merely describe a state -- it DEMANDS an archive, on
    # a "every member sprint closed" premise the very next NOTE says could not be read. §11's own
    # words are "never archive on member-sprint count alone", and an epic with unresolvable members
    # has a member count of zero-verified. EPIC-016 reaches this branch the moment its conditions
    # tick: every member foreign, so `omem` is empty for want of anything to look at.
    unv=$(unverified_count "$e" "$root")
    # Gated on FOREIGN members alone, not on `unv`. Round 4 demoted this branch from `bad` to `ok`
    # because its remedies were unachievable -- true, but true only of a foreign member. `unv` also
    # counts `unknown` (a local id naming no Plan) and `unparsed` entries, and for BOTH of those the
    # remedy is achievable right here: fix the id, or fill the placeholder in. Gating the demotion on
    # the count rather than on the class the argument covers meant ONE typo'd member id exempted an
    # epic from direction (b) forever -- and direction (b) is the drift that actually happened
    # (EPIC-001, unmoved across five sprints). Verified: adding `SPRINT-9019` to an otherwise correct
    # epic flipped this from FAIL to PASS. The count still drives the SENTENCE; only the foreign
    # class drives the demotion.
    frn=$(_member_entries "$e" | awk '$1 != "local" && $1 != "unparsed"' | wc -l)
    if [ "$frn" -gt 0 ]; then
      # A finding whose own sentence says the move is NOT demanded has no business failing the gate:
      # a foreign member can never be resolved here and this checker can never learn it closed, so
      # the only action that cleared the FAIL was the very move the text disclaimed. Left as `bad` it
      # turns the gate RED on EPIC-016 once its nine conditions tick -- a red gate on a correct,
      # ADR-041-sanctioned artifact, which is TD-144's own harm one branch over.
      ok "epic-archive: $rel is closed with every § Closed when condition met and every LOCAL member sprint closed, but $unv member(s) could not be resolved against this repository (see NOTE) -- §11's move is not demanded on a member half that cannot be verified from here, so this is reported rather than required"
    else
      bad "epic-archive: $rel is closed with every § Closed when condition met and every member sprint closed, but still sits in docs/epic/ -- §11 says move it to docs/epic/archive/ and keep its INDEX.md row"
    fi
  elif [ "$st" = "closed" ] && [ "$tot" -gt 0 ] && [ "$opn" -eq 0 ]; then
    # BOTH halves of §11's trigger are required and only one has fired. This is a real, correct and
    # previously unrepresentable state: the epic is finished, the sprint that finished it is not.
    # Demanding the move here is the false positive that fired on EPIC-004 at SPRINT-080 T4.
    ok "epic-archive: $rel correctly NOT yet archived -- status closed and all $tot condition(s) met, but member sprint(s) $omem are still open. §11's trigger is a two-part test and the second half has not fired"
  else
    ok "epic-archive: $rel correctly live (status '$st', $opn of $tot condition(s) open)"
  fi
  # Emitted from (a) and (b) only, never from the epic-state loop below: (a) covers every archived
  # epic and (b) every epic under docs/epic/, so the two together are the whole population, while
  # the epic-state loop is a status-filtered SUBSET of (b) and would duplicate each active epic.
  report_unresolvable "$e" "$root" "$rel"
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
# Status cell (3rd column) of the § Member sprints row FOR SPRINT-<num>; empty when no such row.
# `| a | b | c | d |` splits on `|` into c[1]="" c[2]=a c[3]=b c[4]=c, so the id is c[2] and Status
# is c[4].
#
# The row is selected by its OWN id cell, never by matching the whole line. The first draft matched
# `$0 ~ "SPRINT-0*" want` against the entire row, so the first row whose *contribution prose* merely
# mentioned SPRINT-<want> won and its cell was returned as if it were want's. That was live on
# EPIC-014: SPRINT-091's row mentions SPRINT-092 in its contribution text, so member 092 was
# validated against 091's cell and 092's own `d43a7a1` was never read -- a PASS that was the right
# answer for the wrong reason, and a missing row or missing sha on 092 would have gone undetected.
# Found by the independent T1 review, not by the author (L-165). Same fix closes the prefix bug:
# `SPRINT-0*91` also matched `SPRINT-910`, so a shorter id bound to a longer row.
member_status_cell() {
  awk -v want="$2" '
    /^## Member sprints/{f=1;next}
    f&&/^## /{exit}
    f&&/^\|/ {
      n=split($0, c, "|")
      if (n < 4) next
      id=c[2]; gsub(/^[ \t]+|[ \t]+$/, "", id)
      if (id ~ ("SPRINT-0*" want "([^0-9]|$)")) {
        s=c[4]; gsub(/^[ \t]+|[ \t]+$/, "", s); print s; exit
      }
    }' "$1"
}

# "<num> <last_updated> <close_commit>" per CLOSED member sprint.
#
# "Closed" is defined EXACTLY as `_members_scan` above defines it -- under docs/sprint/archive/, OR a
# live Plan saying status: closed. The first draft required `status: closed` in both cases, so a
# sprint archived without its frontmatter flipped was closed for the retention directions and open
# for this one: two contradictory definitions in one file, and the disagreement made a stale header
# and an unrolled member vacuously green. A half-completed close is exactly the drift this direction
# exists to catch (T1 review, HIGH-2).
#
# Reads the SAME `_member_entries` extractor as `_members_scan`, and skips a foreign member for the
# same reason: this function's entire output is "<num> <sha> read from a LOCAL sprint file", and for
# a member that lives elsewhere every one of those values would belong to a different sprint that
# merely shares a number. That is the mismatch TD-144 reported on EPIC-016.
closed_members() {
  while read -r _cscope _c; do
    [ -n "$_c" ] || continue
    [ "$_cscope" = "local" ] || continue
    _cf=""; _arch=0
    for _p in "$2"/docs/sprint/archive/SPRINT-"$_c"-*.md; do
      [ -f "$_p" ] && { _cf=$_p; _arch=1; break; }
    done
    if [ -z "$_cf" ]; then
      for _p in "$2"/docs/sprint/SPRINT-"$_c"-*.md; do
        [ -f "$_p" ] && { _cf=$_p; break; }
      done
    fi
    [ -n "$_cf" ] || continue
    [ "$_arch" -eq 1 ] || [ "$(fmv "$_cf" status)" = "closed" ] || continue
    printf '%s %s %s\n' "$_c" "$(fmv "$_cf" last_updated)" "$(fmv "$_cf" close_commit)"
  done <<CLMEOF
$(_member_entries "$1")
CLMEOF
}

# Ticked § Closed-when conditions whose block names no SPRINT-NNN **that is a member of this epic**.
# $2 = space-separated member numbers.
#
# Three tightenings over the first draft, all from the T1 review:
#   * the named sprint must be a MEMBER. "originally sketched in SPRINT-001" satisfied the first
#     draft while attributing the tick to a sprint that closed nothing here (MEDIUM-4).
#   * fenced code and HTML comments are stripped before matching, so an attribution that no reader
#     sees cannot satisfy the check (MEDIUM-5, the half this task introduced).
#   * a block ends at the next checkbox OR at the section end -- and END{} flushes, so a trailing
#     prose paragraph no longer immunises the section's last tick (MEDIUM-4, sharper half).
ticked_unattributed() {
  awk -v members="$2" '
    function attributed(b,   i, n, arr) {
      n = split(members, arr, " ")
      for (i = 1; i <= n; i++) if (b ~ ("SPRINT-0*" arr[i] "([^0-9]|$)")) return 1
      return 0
    }
    function flush() { if (open && !attributed(blk)) { s=substr(blk,1,72); gsub(/\|/,"/",s); print s } open=0; blk="" }
    /^## Closed when/{f=1;fence=0;next}
    f&&/^## /{flush(); exit}
    f&&/^[ \t]*```/{ fence = !fence; next }
    f&&fence{ next }
    f&&/^[ \t]*<!--/{ next }
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
  # All member numbers, closed or not -- class (c) asks whether a tick names a sprint belonging to
  # THIS epic, and an open member can legitimately have contributed a completed condition.
  #
  # FOREIGN MEMBERS ARE INCLUDED HERE, and deliberately, unlike in the two legs above. Those legs
  # read a local FILE, which a foreign member does not have; this one matches TEXT, and a condition
  # ticked "delivered by workdoo SPRINT-001" is properly attributed to a member of this epic. The
  # whitespace split used to keep these numbers by accident -- dropping them now would trade a false
  # positive for a false negative and un-attribute every tick EPIC-016 has.
  # UNPARSED entries are excluded here and foreign ones are not, and the difference is what `$2`
  # HOLDS. For a local or foreign entry it is a sprint NUMBER; for an unparsed one it is arbitrary
  # prose out of the file, squashed. `ticked_unattributed` interpolates each of these into a dynamic
  # regex, so prose carrying `(` made awk abort with `invalid regexp` mid-file -- class (c) never
  # ran, the epic was reported PASS, and the run exited 0 with the diagnostic buried among the PASS
  # lines. A REAL unattributed tick went unreported at a green exit: the silent false negative this
  # sprint exists to remove, reintroduced by the very branch added to close review CRITICAL-2.
  # `b255f87` had incidentally FIXED this and `1e42c42` put it back (review round 3 CRITICAL-1).
  allmem=$(_member_entries "$e" | awk '$1 != "unparsed" { printf "%s ", $2 }')
  drift=0

  # (a) every closed member has a rollup row carrying its close_commit, AND that value AGREES with
  #     the sprint's own frontmatter. Shape alone is not enough: a row that copies the previous
  #     row's sha is the most likely real instance of this class and passes any hex-shaped test
  #     (T1 review, MEDIUM-6). The fact is in the file this checker already opens, so checking the
  #     shape and stopping there was checking the cheap half of a question it could answer fully.
  while read -r num mlu mcc; do
    [ -n "$num" ] || continue
    cell=$(member_status_cell "$e" "$num")
    if [ -z "$cell" ]; then
      bad "epic-state: $rel SPRINT-$num is closed but has NO row in § Member sprints -- the rollup this table exists for never happened, so epic status is reconstructable only by reading the sprint archive"
      drift=1
    elif ! printf '%s' "$cell" | grep -qE '`[0-9a-f]{7,40}`'; then
      bad "epic-state: $rel SPRINT-$num's § Member sprints Status cell carries no close_commit -- reads '$cell'. EPIC.md.template states the cell as 'closed · \`<close_commit>\`', so this row cannot be traced to the commit that closed it"
      drift=1
    elif [ -n "$mcc" ] && ! printf '%s' "$cell" | grep -qF "$mcc"; then
      bad "epic-state: $rel SPRINT-$num's § Member sprints Status cell names a close_commit that is not the sprint's own -- cell reads '$cell', SPRINT-$num's frontmatter says close_commit: $mcc. A row carrying a hex-shaped token that belongs to a different commit is traceable to the wrong place, which is worse than untraceable"
      drift=1
    fi
  done <<CMEOF
$cmem
CMEOF

  # (b) the ownership header tracks its own update_trigger. For an epic that trigger is "a member
  #     sprint closes", so a last_updated older than the newest closed member's is a header that has
  #     stopped following its body. Invisible to S3.SCHEMA, which asserts the field is PRESENT and
  #     never that it is current -- which is why EPIC-014 passed every gate while stale.
  newest=$(printf '%s\n' "$cmem" | awk 'NF>=2 && $2 != "" {print $2}' | sort | tail -1)
  elu=$(fmv "$e" last_updated)
  if [ -n "$newest" ] && [ -n "$elu" ] && [ "$elu" \< "$newest" ]; then
    bad "epic-state: $rel last_updated is $elu but its newest closed member sprint closed $newest -- its own update_trigger (a member sprint closes) fired and the header did not follow"
    drift=1
  fi

  # (c) a ticked exit condition names a MEMBER sprint. An unattributed `[x]` records that something
  #     is done without recording what did it, so the evidence is unreachable.
  while IFS= read -r u; do
    [ -n "$u" ] || continue
    bad "epic-state: $rel has a ticked § Closed-when condition naming no member sprint -- \"$u...\". A tick with no member SPRINT-NNN behind it says something is done but not what did it, so its evidence cannot be found"
    drift=1
  done <<TUEOF
$(ticked_unattributed "$e" "$allmem")
TUEOF

  # Same narrowing as direction (a): EPIC-016 examines ZERO members, and "rollup current" read as an
  # affirmative check on a rollup nothing had looked at (review CRITICAL-1, the epic-state half).
  if [ "$drift" -eq 0 ]; then
    unv=$(unverified_count "$e" "$root")
    if [ "$unv" -gt 0 ]; then
      ok "epic-state: $rel rollup current for every LOCAL member -- but $unv member(s) could not be resolved against this repository (see NOTE) and their rows were not checked at all"
    else
      ok "epic-state: $rel rollup current (every closed member rolled up with its own close_commit, header tracks its newest member close, every ticked condition attributed to a member)"
    fi
  fi
done

[ "$checked" -eq 0 ] && printf '      %s\n' "epic-archive: skip (no epics under docs/epic/)"
exit $fail
