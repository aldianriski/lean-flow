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
# so none of the three keeps a doc alive. `.claude/worktrees/` is excluded the same way (TD-095's
# false-negative sibling): it holds full repo checkouts from the dispatch protocol, and a bare
# `grep -rl` walks straight into them. Counting a worktree copy as a citer is a SILENT false
# negative, worse than TD-095's false positives -- a superseded doc genuinely cited by nothing live
# would misreport "still cited, correctly left in place" instead of the FAIL that says move it to
# archive/. Anchored with `^` at the repo-relative path start (shape, not a bare substring match on
# "worktrees") so a real citer at a path that merely CONTAINS that word -- e.g. docs/worktrees/ -- is
# still counted; see evals/fixtures/research-archive/worktree-*.
#
# Usage: sh check-research-archive.sh <repo-root>
# Prints one PASS/FAIL line per doc considered; exits 1 if any FAIL line was printed, 0 otherwise.
# Dependency-free POSIX sh.
set -u

# Shared archive predicate (SPRINT-099 T3, TD-145 · TD-151) -- see scripts/lib/archive-path.sh.
# Added after an independent review found this file carrying the SAME defect class as the ten sites
# converted in 9ef32bc, through a DIFFERENT mechanism: `grep -v "^docs/sprint/archive/"` rather than
# `case ... in */archive/*)`. The author's derivation searched for the case-glob SHAPE, so it could
# never have reached this one -- L-186's population blindness, a second time in the same task.
_lf_ap=$(dirname -- "$0")/archive-path.sh
[ -f "$_lf_ap" ] || { echo "FAIL research archive: shared archive predicate not found at $_lf_ap"; exit 2; }
. "$_lf_ap"

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
    while IFS= read -r _lc_p; do
      # Was `grep -v "^docs/sprint/archive/"`: a case-sensitive STRING exclusion over paths that
      # `grep -rl` reports with real on-disk casing, so `docs/sprint/Archive/...` walked straight
      # through. In direction (c) that produces a SILENT FALSE NEGATIVE -- a superseded doc cited
      # only by a closed sprint reports "correctly left in place" instead of demanding archival.
      # Broadened from `docs/sprint/archive/` to ANY archived path deliberately: this function's own
      # contract is "historical and generated surfaces never count", and an archived research doc is
      # exactly that. Verified a no-op on this tree (docs/research/archive/ does not exist), so the
      # broadening changes no current verdict.
      lf_is_archived_path "$_lc_p" && continue
      printf '%s\n' "$_lc_p"
    done |
    grep -v "^docs/changelog/" |
    grep -v "^docs/knowledge-index.md$" |
    grep -v "^evals/fixtures/" |
    grep -v "^\.claude/worktrees/" |
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
