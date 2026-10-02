#!/usr/bin/env sh
# check-doc-caps.sh -- DERIVES the line-cap coverage from STANDARD §2 instead of hand-listing a
# glob per cap in qa-check.sh (TD-041).
#
# Why derivation rather than "add docs/research/ to the list": the coverage got out of step with the
# standard precisely because it was hand-listed. `qa-check.sh` named four globs; §2 states a cap on
# far more rows than that, and every unlisted row was a cap with nothing behind it -- a comment.
# docs/research/mattpocock.md then absorbed 39 lines over its cap across four sprints with no signal,
# while an open TD row cited a line count that had been wrong since the sprint it was filed in
# (L-097). Adding one more glob by hand would have fixed that file and left the mechanism intact.
#
# --- what is derived, and what is deliberately not -----------------------------------------------
# §2's Cap column is semi-structured prose: "80", "~120", "130 (ADR-007)", "150 soft", "400 hard",
# and also "append-only", "no hard cap¹", "per file, append-only", "open rows only", "—". The rule is
# the cheapest one that cannot silently under-report: take the FIRST integer in the cell; a cell with
# no integer states no numeric cap and is skipped. The path is the FIRST backtick-quoted token in the
# File cell, which survives every annotation §2 actually uses -- `*(was docs/ARCHITECTURE.md)*`,
# `(Mermaid)`, `+ DECISIONS.md index`.
#
# A row whose Cap cell HAS an integer but whose File cell yields no path is a named FAIL, never a
# skip. That case is the whole point of the exercise: a derivation that silently drops a row it
# cannot parse is hand-listing again, with the hand-list hidden inside a parser (L-058 -- the guard
# whose failure mode is silence).
#
# --- the non-§2 allowlist -------------------------------------------------------------------------
# Not every cap this repo enforces comes from §2, so deriving ONLY from §2 would drop live coverage:
# a reduction shipped as an increase (L-076). Those caps are retained below as an EXPLICIT allowlist,
# each entry naming the authority it comes from -- an exclusion earns its place by a written reason,
# not by convenience (L-082). Losing one of them silently is the failure this checker must not cause.
#
# Usage: sh check-doc-caps.sh [<docs-guide.md> [<root-dir> [<grandfather-list>]]]
# Defaults to this repo's own STANDARD and repo root. Both are parameters so the checker can be
# pointed at a fixture -- a check that has only ever run on correct input has not been tested (L-102).
# Prints one PASS/FAIL/note line per cap; exits 1 if any FAIL line was printed, 0 otherwise.
# Dependency-free POSIX sh -- no jq, no bashisms.
set -u

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
guide=${1:-"$here/../../spec/STANDARD.md"}
root=${2:-"$here/../.."}

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }
note() { printf '      %s\n' "$1"; }

[ -f "$guide" ] || { bad "doc-caps: standard not readable: $guide"; exit 1; }

# --- derive `prefix<TAB>path<TAB>cap` rows out of §2 ----------------------------------------------
# The three tables carry different path prefixes, announced by the bold markers between them. A row
# is any table line starting with "| `" or "| " inside §2; the header/separator rows are dropped by
# requiring a backtick-quoted File cell OR reporting the row as unparseable when it states a cap.
rows=$(awk '
  /^## §2/      { in2=1; next }
  /^## §/       { in2=0 }
  !in2          { next }
  /^\*\*Root files/           { pfx="";         next }
  /^\*\*AI context/           { pfx=".claude/"; next }
  /^\*\*`docs\/` tree\*\*/    { pfx="docs/";    next }
  /^\|/ {
    if ($0 ~ /^\|[ ]*File[ ]*\|/) next          # header row
    if ($0 ~ /^\|[-| ]*\|$/)      next          # separator row
    n = split($0, c, "|")
    if (n < 4) next
    file = c[2]
    # the Cap column is 4th cell for root/.claude tables, 5th for the docs tree (it has a Tier col)
    cap = (pfx == "docs/") ? c[5] : c[4]
    # first integer in the Cap cell -- absent means the row states no numeric cap
    if (match(cap, /[0-9]+/)) capn = substr(cap, RSTART, RLENGTH); else capn = ""
    if (capn == "") next
    # SOFT vs HARD (SPRINT-057 promote). Section 2 marks its caps: "~150 soft", "~120", "400 hard",
    # "80", "130 (ADR-007)". The first parser took the integer and threw the marker away, so every
    # soft cap failed the gate like a hard one. Section 11 is explicit that the TODO cap trigger is
    # "flag in the governance review; prune with the user" -- a REPORT, by design -- and the first
    # time a soft cap was actually exceeded, the gate went red on a false positive. Note what is NOT
    # being done here: soft caps keep their coverage. TD-041 found that a soft cap with no check
    # behind it is a comment; the fix is to report it, not to stop looking.
    soft = (cap ~ /~/ || cap ~ /soft/) ? 1 : 0
    # first backtick-quoted token in the File cell
    if (match(file, /`[^`]+`/)) path = substr(file, RSTART+1, RLENGTH-2); else path = ""
    # "|" rather than a tab: the root-files table has an EMPTY prefix, and `read` with a whitespace
    # IFS strips leading empty fields -- which silently shifted every root row by one and dropped it.
    # Caught by the over-cap fixture; the live run looked entirely healthy without those rows.
    printf "%s|%s|%s|%s\n", pfx, path, capn, soft
  }
' "$guide")

[ -n "$rows" ] || { bad "doc-caps: derived 0 rows from §2 -- the table shape changed and this parser did not"; exit 1; }

# --- grandfathered breaches: VISIBLE, bounded, and self-retiring ---------------------------------
# Turning coverage on over a repo that was never covered surfaces pre-existing drift -- four files
# here, three of them research docs whose diet §7 says moves only by ADR after a measured pass, which
# is explicitly not this sprint's work. The wrong response is a silent exclusion list: that is how the
# coverage got hand-listed in the first place, and L-082's test ("would I add this exclusion if the
# change were someone else's?") answers no for anything undated and unreferenced.
#
# So each entry records the count AT ADOPTION and prints on every run. The check still bites:
#   actual >  recorded  -> FAIL, it got worse under a grandfather clause
#   cap <  actual <= recorded -> reported every run, named, with its follow-up
#   actual <= cap       -> PASS + told to delete its own row
# The list lives in its own file so it shows up as an artifact in review rather than buried in a
# script, and so it can be pointed at a fixture -- the clause itself needs a must-FAIL leg (L-076).
GFFILE=${3:-"$here/doc-caps-grandfathered.txt"}
GF=$([ -f "$GFFILE" ] && grep -v '^#' "$GFFILE" | grep -v '^[[:space:]]*$')

# --- recorded dispositions for SOFT over-cap rows (TASK-384, ADR-048 amendment) -------------------
# `<root>/.cap-dispositions`, mirroring `.conformance-exempt`: one row per line, `<path> -- <kind> --
# <reason>`, kind in the closed set below. A soft OVER-CAP whose path has a VALID row prints a NAMED
# `retained:` line instead of `OVER-CAP (soft)` -- never silent. Malformed rows are findings, not
# skips: kind unknown, reason missing, duplicate path, and a STALE row (the path is not an examined
# §2-capped file, or it is no longer over its cap, or it is FROZEN) -- a disposition that outlived its
# breach must not linger. A HARD cap and the token budget are NOT dispositionable: a row naming a
# hard-capped path is a named FAIL and the hard FAIL stands. Matching is EXACT: the row path is
# trimmed of surrounding blanks and compared byte for byte to the root-relative path §2 resolves --
# case-sensitive, no `./` prefix tolerance -- so a mis-cased or `./` row is reported stale, never
# silently honoured on a case-insensitive filesystem. No file means no dispositions: adopters who
# never create one see no change at all.
# The pre-pass emits `status<TAB>path<TAB>kind<TAB>reason`; status is ok | D(uplicate) | K(ind bad)
# and/or R(eason missing), or T (a TAB inside the path or kind: the pre-pass hands rows on as TSV, so
# a tab there would split the row and honour a DIFFERENT path than the one written -- the row is
# reported `disposition-malformed` and never honoured; both checkers agree). Duplicates: the first
# row wins, later ones are findings.
tmpb="${TMPDIR:-/tmp}/doc-caps.$$"
parsed="$tmpb.parsed"; seen="$tmpb.seen"
trap 'rm -f "$tmpb" "$seen" "$parsed"' EXIT
trap 'exit 1' INT TERM
: > "$seen"; : > "$parsed"
if [ -f "$root/.cap-dispositions" ]; then
  tr -d '\r' < "$root/.cap-dispositions" | awk '
    BEGIN { split("replace merge move-to-reference automate-into-check retain", K, " "); for (i in K) okk[K[i]] = 1 }
    /^#/ || /^[ \t]*$/ { next }
    {
      line = $0 " "
      p = index(line, " -- ")
      if (p == 0) { path = line; rest = "" } else { path = substr(line, 1, p - 1); rest = substr(line, p + 4) }
      q = index(rest, " -- ")
      if (q == 0) { kind = rest; reason = "" } else { kind = substr(rest, 1, q - 1); reason = substr(rest, q + 4) }
      gsub(/^[ \t]+|[ \t]+$/, "", path); gsub(/^[ \t]+|[ \t]+$/, "", kind); gsub(/^[ \t]+|[ \t]+$/, "", reason)
      gsub(/\t/, " ", reason)
      if (path ~ /\t/ || kind ~ /\t/) { st = "T"; gsub(/\t/, "<TAB>", path); gsub(/\t/, "<TAB>", kind) }
      else if (path in P) st = "D"
      else { P[path] = 1; st = ""; if (!(kind in okk)) st = st "K"; if (reason == "") st = st "R"; if (st == "") st = "ok" }
      printf "%s\t%s\t%s\t%s\n", st, path, kind, reason
    }' > "$parsed"
fi

gf_recorded() { printf '%s\n' "$GF" | awk -v p="$1" '$1==p{print $2}'; }
gf_reason()   { printf '%s\n' "$GF" | awk -v p="$1" '$1==p{print $3}'; }

cap_file() { # <file> <max> <source>
  n=$(wc -l < "$1" | tr -d ' ')
  if [ "$n" -le "$2" ]; then ok "cap $1 ($n <= $2) [$3]"; else bad "cap $1 ($n > $2) [$3]"; fi
}

# Frontmatter `status:`, position-anchored (L-108): line-start, inside the first 20 lines, first match
# only. A substring search would match prose about supersession further down -- this corpus documents
# its own formats, so `status: superseded` appears in STANDARD, in ADRs and in this file's comments.
fm_status() {
  sed -n '1,20{/^status:[[:space:]]/{s/^status:[[:space:]]*//;s/[[:space:]]*$//;p;q;};}' "$1" 2>/dev/null
}

printf '%s\n' "$rows" | while IFS='|' read -r pfx path capn soft; do
  [ -n "$capn" ] || continue
  if [ -z "$path" ]; then
    echo "FAIL  doc-caps: §2 row states cap $capn but no path could be derived from its File cell"
    continue
  fi
  # placeholder segments -> globs: NNN (a sprint/epic/ADR number) and <slug> (a free name)
  glob=$(printf '%s%s' "$pfx" "$path" | sed 's/NNN/*/g; s/<[^>]*>/*/g')
  matched=0
  for f in $(cd "$root" 2>/dev/null && ls -d $glob 2>/dev/null); do
    [ -f "$root/$f" ] || continue
    matched=1
    n=$(wc -l < "$root/$f" | tr -d ' ')
    # Cheap containment test BEFORE spawning awk. Coverage went 17 -> 47 files here, and two awk
    # subprocesses per file pushed the whole gate past its 120s budget on this host -- a gate slow
    # enough to be skipped is its own kind of silent pass. Only the handful of files actually on the
    # list pay for a lookup.
    rec=""
    case "$GF" in *"$f "*) rec=$(gf_recorded "$f") ;; esac

    # ADR-015 rule 2: the grandfather list records HARD-cap breaches only (SPRINT-060 T2).
    # A soft cap already has a route -- the soft branch below reports it every run and §11 sends it
    # to the promote governance review -- so recording it here as well buys only the growth ratchet,
    # at the price of a permanent row in a file whose whole purpose is to reach empty. Until now the
    # rule was prose in that file's header and in the ADR, which its own Consequences section flagged
    # as an accepted gap: "nothing enforces rule 2 yet".
    #
    # Fires on the ROW's existence, not on the line count: a soft-capped path is illegal here whether
    # or not it is currently over. The row is then treated as absent so the file still gets its
    # ordinary soft-cap verdict below -- failing the rule must not also suppress the report the rule
    # says is the correct route.
    if [ -n "$rec" ] && [ "$soft" = 1 ]; then
      printf 'FAIL  doc-caps: %s has a SOFT cap (%s) and must not be in the grandfather list [ADR-015 rule 2] -- a soft cap already reports every run and routes to the promote review; delete the row\n' "$f" "$capn"
      rec=""
    fi
    if [ "$n" -le "$capn" ]; then
      printf '%s\t%s\t%s\t%s\n' "$f" "$n" "$capn" under >> "$seen"
      if [ -n "$rec" ]; then
        printf 'PASS  cap %s (%s <= %s) [§2] -- back under cap: DELETE its grandfather row\n' "$f" "$n" "$capn"
      else
        printf 'PASS  cap %s (%s <= %s) [§2]\n' "$f" "$n" "$capn"
      fi
    elif [ "$(fm_status "$root/$f")" = "superseded" ]; then
      printf '%s\t%s\t%s\t%s\n' "$f" "$n" "$capn" frozen >> "$seen"
      # FROZEN (ADR-020, SPRINT-063 T3). §2's research row says a spent verdict is "marked
      # `status: superseded` **rather than edited**", and §11's only exit for it is archival once
      # nothing live cites it. So a cap here measures the one thing that can still legally grow on the
      # doc -- the annotation recording WHY it is spent. `loop-hygiene-prd.md` went 118 -> 139 on
      # exactly that, and SPRINT-060 T4's own note claimed it "stays inside its cap coverage" while
      # adding 18 of those lines. Trimming it would delete the supersession trail; that is not a diet.
      #
      # REPORTED, never silently skipped: a check that goes quiet is the silent false negative this
      # file exists to prevent (L-058). The line states the state AND the exit condition, so it can
      # never be read as a pass earned by shrinking.
      printf '      FROZEN (superseded): %s (%s lines, cap %s) [§2 · ADR-020] -- uncapped while spent; exits via §11 archive once nothing live cites it, never via a diet\n' "$f" "$n" "$capn"
    elif [ -n "$rec" ] && [ "$n" -le "$rec" ]; then
      printf '%s\t%s\t%s\t%s\n' "$f" "$n" "$capn" hard >> "$seen"
      printf '      OVER-CAP (grandfathered): %s (%s > %s, recorded %s) -- %s\n' "$f" "$n" "$capn" "$rec" "$(gf_reason "$f")"
    elif [ -n "$rec" ]; then
      printf '%s\t%s\t%s\t%s\n' "$f" "$n" "$capn" hard >> "$seen"
      printf 'FAIL  cap %s (%s > %s) [§2] -- grandfathered at %s and it GREW; a grandfather clause is not a licence to drift\n' "$f" "$n" "$capn" "$rec"
    elif [ "$soft" = 1 ]; then
      # A soft cap REPORTS. §11 routes its trigger to the governance review for a prune-with-the-owner,
      # so failing the gate here would block the very commit that does the pruning.
      #
      # TASK-384: a valid recorded disposition turns the report into a NAMED retained line (`parsed`
      # holds status=ok only for the FIRST row of a path).
      printf '%s\t%s\t%s\t%s\n' "$f" "$n" "$capn" soft >> "$seen"
      drow=$(awk -F'\t' -v p="$f" '$1 == "ok" && $2 == p { print $3 "|" $4; exit }' "$parsed")
      if [ -n "$drow" ]; then
        printf '      retained: %s (%s > %s) [%s] -- %s\n' "$f" "$n" "$capn" "${drow%%|*}" "${drow#*|}"
      else
        printf '      OVER-CAP (soft): %s (%s > %s) [§2 soft] -- prune at the next promote governance review (§11)\n' "$f" "$n" "$capn"
      fi
    else
      printf '%s\t%s\t%s\t%s\n' "$f" "$n" "$capn" hard >> "$seen"
      printf 'FAIL  cap %s (%s > %s) [§2]\n' "$f" "$n" "$capn"
    fi
  done
  [ "$matched" = 1 ] || printf '      skip (absent): %s [§2 cap %s]\n' "$glob" "$capn"
done > "$tmpb"

# Disposition-file findings, after every §2 row, in FILE order (TASK-384). Malformed rows get only
# their malformed finding; a valid row is judged against what the loop above actually examined.
if [ -s "$parsed" ]; then
  awk -F'\t' '
    FILENAME == ARGV[1] { if (!($1 in S)) { S[$1] = $4; N[$1] = $2; C[$1] = $3 } ; next }
    {
      st = $1; path = $2; kind = $3
      if (st == "T") print "FAIL  doc-caps: disposition-malformed: " path " -- a TAB inside the path or kind (" kind "); the row is not honoured, rewrite it with spaces [.cap-dispositions]"
      else if (st == "D") print "FAIL  doc-caps: disposition-duplicate: " path " -- a second row for the same path; the first wins, delete one [.cap-dispositions]"
      else if (st != "ok") {
        if (st ~ /K/) print "FAIL  doc-caps: disposition-kind-unknown: " path " -- kind \"" kind "\" is not one of replace|merge|move-to-reference|automate-into-check|retain [.cap-dispositions]"
        if (st ~ /R/) print "FAIL  doc-caps: disposition-reason-missing: " path " -- a disposition with no reason is the finding turned off, not a ruling [.cap-dispositions]"
      }
      else if (!(path in S)) print "FAIL  doc-caps: disposition-stale: " path " -- no §2-capped file at that exact path (absent, mis-cased or ./-prefixed); delete the row [.cap-dispositions]"
      else if (S[path] == "under") print "FAIL  doc-caps: disposition-stale: " path " -- no longer over its cap (" N[path] " <= " C[path] "); a disposition that outlived its breach must not linger, delete the row [.cap-dispositions]"
      else if (S[path] == "frozen") print "FAIL  doc-caps: disposition-stale: " path " -- FROZEN (superseded), not an active soft OVER-CAP; delete the row [.cap-dispositions]"
      else if (S[path] == "hard") print "FAIL  doc-caps: disposition-hard-cap: " path " -- a HARD cap (" C[path] ") is not dispositionable; the FAIL stands, fix the file or route a promoted rule per ADR-048 [.cap-dispositions]"
    }' "$seen" "$parsed" >> "$tmpb"
fi

cat "$tmpb"
grep -q '^FAIL' "$tmpb" && fail=1
rm -f "$tmpb" "$seen" "$parsed"

# --- non-§2 caps: an explicit allowlist, each naming its authority (L-082) ------------------------
# `skills/*/SKILL.md` is the one cap this repo enforces that §2 does not state, because §2 describes a
# documentation tree and this is a plugin component budget. Every other cap qa-check.sh used to
# hand-list -- .claude/CLAUDE.md 80, .claude/CONTEXT.md 150 (ADR-017), docs/sprint/SPRINT-*.md 400 -- IS a §2
# row and is now derived above rather than duplicated here.
for s in $(cd "$root" 2>/dev/null && ls -d skills/*/SKILL.md 2>/dev/null); do
  [ -f "$root/$s" ] || continue
  n=$(wc -l < "$root/$s" | tr -d ' ')
  if [ "$n" -le 140 ]; then ok "cap $s ($n <= 140) [ADR-006, not §2]"
  else bad "cap $s ($n > 140) [ADR-006, not §2]"; fi
done

exit $fail
