#!/usr/bin/env sh
# check-research-archive.sh -- enforces STANDARD §11's research retention row (SPRINT-055 T3,
# TASK-168).
#
# Before T3, `close`'s compaction sweep said "superseded/duplicated research -> supersede note or
# archive" while §11 carried no research row at all, so the "or archive" half resolved to nowhere.
# The supersede half already worked: `status: superseded` is a documented frontmatter state and the
# RESEARCH template tells the author to set it rather than edit a spent verdict. Only the retention
# leg was missing.
#
# The rule is deliberately conservative, because a superseded verdict is usually the WHY-trail for
# whatever replaced it. Archiving is gated on the doc being genuinely unreferenced:
#   (a) archived while not superseded -- a live verdict moved out of the way
#   (b) archived while a LIVE surface still cites it -- the trail is cut at the citing end
#   (c) superseded AND uncited AND still sitting in docs/research/ -- the retention leg not running,
#       which is exactly how the epic row went five sprints without executing (T2)
#
# A "live" citer is anything outside the historical record: docs/sprint/archive/ and docs/changelog/
# are closed history and cite by nature, and docs/knowledge-index.md is generated from frontmatter,
# so none of the three keeps a doc alive.
#
# Usage: sh check-research-archive.sh <repo-root>
# Prints one PASS/FAIL line per doc considered; exits 1 if any FAIL line was printed, 0 otherwise.
# Dependency-free POSIX sh.
set -u

root=${1:?usage: check-research-archive.sh <repo-root>}
[ -d "$root" ] || { echo "FAIL research-archive: repo root not found at $root"; exit 2; }

fail=0
ok()   { printf 'PASS  %s\n' "$1"; }
bad()  { fail=1; printf 'FAIL  %s\n' "$1"; }

fmv() { awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit} $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"; }

# First live citer of <basename>, or empty. Historical and generated surfaces never count.
live_citer() { # <basename> <self-relative-path>
  _base=$1; _self=$2
  grep -rl --include="*.md" -F "$_base" "$root" 2>/dev/null |
    sed "s#^$root/##" |
    grep -v "^docs/sprint/archive/" |
    grep -v "^docs/changelog/" |
    grep -v "^docs/knowledge-index.md$" |
    grep -v "^evals/fixtures/" |
    grep -vxF "$_self" |
    head -n1
}

considered=0

# --- (a)+(b): docs already under archive/ must have earned it and must be unreferenced -----------
for f in "$root"/docs/research/archive/*.md; do
  [ -f "$f" ] || continue
  considered=$((considered + 1))
  rel=${f#"$root"/}; base=$(basename "$f")
  st=$(fmv "$f" status)
  if [ "$st" != "superseded" ]; then
    bad "research-archive: $rel is archived while status is '$st' -- only a superseded verdict is archivable"
    continue
  fi
  citer=$(live_citer "$base" "$rel")
  if [ -n "$citer" ]; then
    bad "research-archive: $rel is archived but still cited by $citer -- a superseded verdict is usually the WHY-trail for what replaced it, so archiving it cuts the trail at the citing end"
  else
    ok "research-archive: $rel archived correctly (superseded, no live citer)"
  fi
done

# --- (c): superseded + uncited docs must not linger in docs/research/ ---------------------------
for f in "$root"/docs/research/*.md; do
  [ -f "$f" ] || continue
  st=$(fmv "$f" status)
  [ "$st" = "superseded" ] || continue
  considered=$((considered + 1))
  rel=${f#"$root"/}; base=$(basename "$f")
  citer=$(live_citer "$base" "$rel")
  if [ -n "$citer" ]; then
    ok "research-archive: $rel superseded but still cited by $citer -- correctly left in place"
  else
    bad "research-archive: $rel is superseded and cited by nothing live but still sits in docs/research/ -- §11 says move it to docs/research/archive/"
  fi
done

[ "$considered" -eq 0 ] && printf '      %s\n' "research-archive: skip (no superseded or archived research docs)"
exit $fail
