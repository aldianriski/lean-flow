#!/usr/bin/env sh
# read-spec-rules.sh -- the engine's rule source: read `(id, level, mark)` rows from the
# **Conformance table of any `## §N` section** of spec/STANDARD.md.
#
# Extracted from check-attestation.sh (SPRINT-074 T2), which proved the shape on §13 alone. That
# script is now this reader's first consumer rather than its own copy of the parse (SPRINT-075 T1).
#
# --- why the match is anchored the way it is ------------------------------------------------------
# Scoped to a `## §N` .. next-`## ` window and anchored to a ROW POSITION (a line starting `| ` then a
# backticked id whose section number equals the window's), never to the substring "SN." -- §14 names
# `S13.NOINFER` and `S13.NOTAUTHOR` in prose when it explains the implementation-directed category,
# and §8 names seven ids from other sections in prose when it explains that it restates them. A
# substring match ingests that prose as rules (L-108). The id must match the WINDOW's section for the
# same reason: §7's and §8's Conformance blocks both discuss other sections' rules by name.
#
# Rejected alternative: additionally gate on being inside the `**Conformance.**` block, terminated by
# `---`. It reconciles identically today (both variants return §14's exact per-section counts), and it
# adds a terminator that a `---` written inside a future Conformance block would trip. The section
# window is the same scope with less to go wrong; --reconcile is what actually guards drift.
#
# --- the failure this reader refuses to have ------------------------------------------------------
# A reader that returns nothing checks nothing and exits clean. That is the false negative the whole
# engine would inherit (L-058), so an unreadable table is a NAMED FINDING (`spec-table-unreadable`)
# on stderr with a non-zero exit, never an empty rule set. `--reconcile` extends the same refusal one
# level up: a section returning zero rows when §14's own counts table says it has some is a FAIL, not
# an empty result -- which is the only way a silently-dropped section is distinguishable from a
# section that legitimately has no rules (§8 has none, and §14 records that as 0).
#
# Usage:
#   sh read-spec-rules.sh <spec-path> [--section N] [--reconcile]
#
#   (no flag)     emit `<id> <level> <mark>` for every section, document order
#   --section N   emit only §N's rows
#   --reconcile   emit a per-section count table compared against §14's own; exit 1 on any mismatch
#
# Exit: 0 ok / 1 a named finding was printed.
# Dependency-free POSIX sh + awk -- no jq, no bashisms.
set -u

spec=""
section=""
reconcile=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --section) [ "$#" -ge 2 ] || { printf 'FAIL  read-spec-rules: --section needs a number\n' >&2; exit 1; }
               section="$2"; shift 2 ;;
    --reconcile) reconcile=1; shift ;;
    -*) printf 'FAIL  read-spec-rules: unknown option: %s\n' "$1" >&2; exit 1 ;;
    *)  [ -z "$spec" ] || { printf 'FAIL  read-spec-rules: more than one spec path given\n' >&2; exit 1; }
        spec="$1"; shift ;;
  esac
done

[ -n "$spec" ] || { printf 'FAIL  read-spec-rules: usage -- sh read-spec-rules.sh <spec-path> [--section N] [--reconcile]\n' >&2; exit 1; }
[ -f "$spec" ] || { printf 'FAIL  read-spec-rules: spec-not-found -- %s\n' "$spec" >&2; exit 1; }

case "$section" in
  ""|*[!0-9]*) [ -z "$section" ] || { printf 'FAIL  read-spec-rules: --section wants a number, got %s\n' "$section" >&2; exit 1; } ;;
esac

# --- the rows -------------------------------------------------------------------------------------
# Level and mark are cells 3 and 4 of the row. Each may carry emphasis or a qualifier -- §13 writes
# "mechanical *on the fact*", §2 writes "mechanical -- the file exists at its canonical path". The
# value is the FIRST token; the rest is commentary for a human and must never become a distinct
# category (a mark of "mechanical --" would match no dispatch arm and silently skip the rule).
rows=$(awk -v want="$section" '
  /^## / { h = $0; sub(/^## [^0-9]*/, "", h); sec = h + 0 }
  sec > 0 && (want == "" || sec == want + 0) &&
  $0 ~ ("^[|] *`S" sec "[.][A-Z0-9-]+` *[|]") {
    line = $0
    sub(/^[|] *`/, "", line); id = line; sub(/`.*$/, "", id)
    n = split($0, f, "|")
    level = (n >= 3) ? f[3] : ""
    mark  = (n >= 4) ? f[4] : ""
    gsub(/[*`]/, " ", level); gsub(/[*`]/, " ", mark)
    nm = split(mark, m, " "); mark = "?"
    for (i = 1; i <= nm; i++) if (m[i] != "") { mark = m[i]; break }
    nl = split(level, l, " "); level = "--"
    for (i = 1; i <= nl; i++) if (l[i] != "") { level = l[i]; break }
    printf "%s %s %s\n", id, level, mark
  }
' "$spec" 2>/dev/null)

# --- §14's own counts table -------------------------------------------------------------------------
# §14 publishes `| classified | 4 | 21 | ... | 7 | **100** |`. Cells 3..15 are §1..§13. Reading the
# expectation from the spec rather than hard-coding it is the point: a rule added to a later version
# moves both numbers together, and only a genuine parse gap makes them disagree.
#
# It is read in EVERY mode, not just --reconcile, because zero rows is ambiguous without it: §8
# legitimately has no rules (§14 records that as 0), so a bare "no rows -> unreadable" rule reports a
# named finding against a perfectly good spec, and the engine hits it on every full sweep. The count
# is what separates "this section has none" from "this section was dropped".
expected=$(awk '
  /^## / { h = $0; sub(/^## [^0-9]*/, "", h); sec = h + 0 }
  sec == 14 && /^[|] *classified *[|]/ {
    n = split($0, f, "|")
    for (i = 1; i <= 13; i++) {
      v = (n >= i + 2) ? f[i + 2] : ""
      gsub(/[*` ]/, "", v)
      printf "%d %s\n", i, (v == "" ? "0" : v)
    }
    exit
  }
' "$spec" 2>/dev/null)

exp_for() { printf '%s\n' "$expected" | awk -v s="$1" '$1 == s { print $2 }'; }
# For a message: a section §14 says nothing about at all (out of the §1..§13 range it publishes).
exp_say() { v=$(exp_for "$1"); [ -n "$v" ] && printf '%s' "$v" || printf 'no published count'; }

# --- emit mode --------------------------------------------------------------------------------------
if [ "$reconcile" -eq 0 ]; then
  if [ -n "$rows" ]; then
    printf '%s\n' "$rows"
    exit 0
  fi

  # Zero rows. Only §14's count can say whether that is correct.
  if [ -n "$section" ] && [ -n "$expected" ] && [ "$(exp_for "$section")" = "0" ]; then
    exit 0    # §8 today: the section really has no rules, and saying so silently is the honest answer
  fi

  if [ -n "$section" ]; then
    printf 'FAIL  read-spec-rules: spec-table-unreadable -- no §%s Conformance rows parsed from %s, but §14 publishes %s for it. A reader that returns nothing checks nothing and exits clean; that is reported here instead (L-058)\n' \
      "$section" "$spec" "$(exp_say "$section")" >&2
  else
    printf 'FAIL  read-spec-rules: spec-table-unreadable -- no Conformance rows parsed from %s. A reader that returns nothing checks nothing and exits clean; that is reported here instead (L-058)\n' "$spec" >&2
  fi
  exit 1
fi

# --- reconcile mode ---------------------------------------------------------------------------------
if [ -z "$expected" ]; then
  printf 'FAIL  read-spec-rules: spec-counts-unreadable -- §14 has no `classified` counts row in %s. Without it a dropped section is indistinguishable from a section with no rules\n' "$spec" >&2
  exit 1
fi

fail=0
total_got=0
total_exp=0
printf '=== rule-source reconciliation -- %s ===\n' "$spec"
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
  exp=$(exp_for "$i")
  got=$(printf '%s\n' "$rows" | awk -v s="$i" 'index($1, "S" s ".") == 1 { c++ } END { print c + 0 }')
  total_got=$((total_got + got))
  total_exp=$((total_exp + exp))
  if [ "$got" -eq "$exp" ]; then
    printf 'PASS  §%-2d %3d rules\n' "$i" "$got"
  else
    fail=1
    printf 'FAIL  §%-2d section-rows-mismatch -- read %d, §14 says %d. A section short of its own published count is a dropped rule set, not an empty one (L-058)\n' "$i" "$got" "$exp"
  fi
done

# The per-section figures above are bucketed by id prefix, so a row that lands in NO bucket -- an id
# whose section does not match any of §1..§13 -- is invisible to every line of the loop and to their
# sum. That is precisely what a loosened row anchor produces: prose mentions inside a section's window
# parse as rules with ids that bucket nowhere. Counting the rows actually emitted, independently of
# the buckets, is what makes such a row surface (found by seeding this exact break, SPRINT-075 T1).
# Counted as LINES EMITTED, not as lines matching `^S<digit>`: a loosened anchor matches prose lines
# that never start with `|`, so the id extraction yields raw prose and the row does not even have the
# shape of an id. Counting by shape here would miss exactly the rows this check exists to find -- the
# same "match by shape, not substring" trap one level down (L-108).
if [ -z "$rows" ]; then raw_rows=0; else raw_rows=$(printf '%s\n' "$rows" | wc -l | tr -d ' '); fi
if [ "$raw_rows" -ne "$total_got" ]; then
  fail=1
  printf 'FAIL  unbucketed-rows -- %d rows read but only %d fall in §1..§13. A row matching no section is a row the anchor should never have matched (L-108)\n' "$raw_rows" "$total_got"
fi

if [ "$total_got" -eq "$total_exp" ] && [ "$raw_rows" -eq "$total_exp" ]; then
  printf '      total %d rules read, §14 total %d -- reconciled\n' "$total_got" "$total_exp"
else
  fail=1
  printf 'FAIL  total-mismatch -- read %d (%d bucketed), §14 says %d\n' "$raw_rows" "$total_got" "$total_exp"
fi

exit $fail
