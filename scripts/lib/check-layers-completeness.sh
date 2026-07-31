#!/usr/bin/env sh
# check-layers-completeness.sh -- derives a second, independently-sourced touched-file/dependency
# set from each task block's own DoD+Acceptance prose and diffs it against that block's
# hand-written `Layers:`/`Depends-on:` declaration (TD-020, L-071, SPRINT-042 T3).
#
# The dispatch preflight's shared-file check reads `Layers:` -- sound logic, unvalidated input.
# A mechanical check over a hand-written manifest validates that manifest's internal consistency,
# never its completeness: an omission from Layers:/Depends-on: looks identical to absence, so only
# a second, independently-derived source can catch it (L-071). This derives one from the same
# prose a human wrote the manifest from. Fails toward over-reporting by design (TD-020): a false
# positive costs a glance, the SPRINT-041 false negative cost a corrupted merge.
#
# Two independent checks per task block:
#   (a) a backtick-quoted, file-shaped token (has a "." extension) named in the block's DoD or
#       Acceptance prose but absent from its Layers: line
#   (b) "TD-NNN" co-occurring with "resolved" anywhere in the block's prose implies the debt
#       ledger TECH-DEBT.md must be in Layers: (the exact SPRINT-041 shape: prose says "TD-019
#       marked ... resolved", never names the file it lives in)
#   (c) another task's id (T<N>) named in the block's prose but absent from its Depends-on: line
#
# Usage: sh check-layers-completeness.sh <sprint-plan.md> [<sprint-plan.md> ...]
# Only files whose frontmatter `status:` is `active` are checked; a non-active, malformed, or
# missing file is silently skipped (not a FAIL) -- safe to run unconditionally over every
# docs/sprint/SPRINT-*.md. Prints one PASS/FAIL line per check per task block; exits 1 if any FAIL
# line was printed, 0 otherwise. Dependency-free POSIX sh -- no jq, no bashisms.
set -u

fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

fail=0
ok()  { printf 'PASS  %s\n' "$1"; }
bad() { fail=1; printf 'FAIL  %s\n' "$1"; }

check_block() {
  # $1=sprint-file $2=tid (e.g. "### T1") $3=block-text (header line through the next header)
  sp=$1; tid=$2; blk=$3
  tshort=$(printf '%s' "$tid" | grep -oE 'T[0-9]+')
  layers_line=$(printf '%s' "$blk" | grep -E '^Layers:')
  deps_line=$(printf '%s' "$blk" | grep -E '^Depends-on:')
  # prose = the whole block minus its own header/Layers:/Depends-on: lines, so the declaration is
  # never diffed against itself.
  prose=$(printf '%s' "$blk" | grep -vE '^(### |Layers:|Depends-on:)')

  # -- (a)+(b): file-shaped tokens named in prose, absent from Layers: -----------------------
  miss_f=""
  toks=$(printf '%s' "$prose" | grep -oE '`[A-Za-z0-9_./-]+\.[A-Za-z]+`' | tr -d '`' | sort -u)
  for t in $toks; do
    printf '%s' "$layers_line" | grep -qF "$t" || miss_f="$miss_f $t"
  done
  if printf '%s' "$prose" | grep -qE 'TD-[0-9]+' && printf '%s' "$prose" | grep -qi 'resolved'; then
    printf '%s' "$layers_line" | grep -qF 'TECH-DEBT.md' || miss_f="$miss_f TECH-DEBT.md(TD-marked-resolved)"
  fi
  if [ -n "$miss_f" ]
  then bad "$sp $tid Layers completeness: DoD/Acceptance implies$miss_f, absent from Layers:"
  else ok  "$sp $tid Layers completeness (DoD-implied files all declared)"
  fi

  # -- (c): other task ids named in prose, absent from Depends-on: ---------------------------
  miss_d=""
  oids=$(printf '%s' "$prose" | grep -oE '\bT[0-9]+\b' | sort -u)
  for o in $oids; do
    [ "$o" = "$tshort" ] && continue
    printf '%s' "$deps_line" | grep -qE "\b$o\b" || miss_d="$miss_d $o"
  done
  if [ -n "$miss_d" ]
  then bad "$sp $tid Depends-on completeness: DoD/Acceptance references$miss_d, absent from Depends-on:"
  else ok  "$sp $tid Depends-on completeness (prose-referenced tasks all declared)"
  fi
}

for sp in "$@"; do
  [ -f "$sp" ] || { printf 'FAIL  %s\n' "layers-completeness: file not found: $sp"; fail=1; continue; }
  st=$(fmv "$sp" status)
  [ "$st" = "active" ] || continue
  plan=$(awk '/^## Plan/{f=1;next} /^## /{f=0} f' "$sp")
  tid=""; blk=""
  while IFS= read -r line; do
    case "$line" in
      "### "*)
        [ -n "$tid" ] && check_block "$sp" "$tid" "$blk"
        tid=$(printf '%s' "$line" | grep -oE '^### T[0-9]+')
        blk="$line"
        ;;
      *)
        blk="$blk
$line"
        ;;
    esac
  done <<PLANEOF
$plan
PLANEOF
  [ -n "$tid" ] && check_block "$sp" "$tid" "$blk"
done

exit $fail
