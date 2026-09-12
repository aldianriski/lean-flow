#!/usr/bin/env sh
# archive-path.sh -- the ONE archive-exclusion predicate, shared by every checker that must keep
# closed/archived material out of its examined set (SPRINT-099 T3, TD-145 · TD-151).
#
# WHY THIS FILE EXISTS AT ALL. Ten checkers each carried the same line:
#
#     case "$sp" in */archive/*) continue ;; esac
#
# That is a STRING predicate standing in for a FILESYSTEM question. On a case-insensitive filesystem
# -- which is every Windows checkout of this repo -- `docs/sprint/archive` and `docs/sprint/Archive`
# are ONE directory sharing ONE inode, and the glob excludes the first spelling while admitting the
# second. Feeding the admitted spelling to check-layers-completeness.sh produces real FAILs against a
# closed sprint's stale content: a guard reporting findings about material it was built to ignore.
#
# WHY NOT JUST LOWERCASE THE COMPARISON. Because that would be wrong on Linux, where `Archive/` IS a
# genuinely different directory and must NOT be excluded. Case is not the question; identity is. This
# predicate asks the filesystem (`test -ef`, same device + inode), so it is correct on BOTH platforms
# by construction rather than by choosing a side.
#
# WHY THE ANCESTOR WALK IS FORK-FREE. Callers run this inside loops over 98 archived sprints. `${d%/*}`
# is a shell parameter expansion; `dirname` would be a process per component per path. The measured
# cost of process spawning on this host is the whole subject of docs/research/qa-gate-timing.md.
#
# Sourced, not executed:  . "$(dirname "$0")/archive-path.sh"

# Probe once for `test -ef`. It is not in POSIX, though bash, dash and busybox ash all have it. Where
# it is absent we fall back to the literal match alone -- i.e. exactly the behaviour every caller had
# before this file existed. That is a conservative degrade: no regression, and no silent claim to a
# correctness this shell cannot deliver.
if [ . -ef . ] 2>/dev/null; then _lf_have_ef=1; else _lf_have_ef=0; fi

# lf_is_archived_path <path>
#   Returns 0 (archived, caller should skip) or 1 (not archived).
lf_is_archived_path() {
  _lf_p=$1
  [ -n "$_lf_p" ] || return 1

  # (a) The literal spelling. Kept first and unconditional: it is the common case, it costs nothing,
  #     and it works for paths that do not exist on disk -- which is most fixture input.
  case "$_lf_p" in
    */archive/*) return 0 ;;
  esac

  [ "$_lf_have_ef" -eq 1 ] || return 1

  # (b) Filesystem identity. Walk the ancestors; if any ancestor directory IS the same directory as
  #     its own sibling spelled exactly "archive", this path lives under the archive under another
  #     spelling. Only reached when (a) missed, and only for ancestors that exist on disk -- a
  #     synthetic path costs one `[ -d ]` per component and no more.
  _lf_d=$_lf_p
  while [ -n "$_lf_d" ]; do
    case "$_lf_d" in
      */*) _lf_parent=${_lf_d%/*} ;;
      *)   break ;;
    esac
    [ -n "$_lf_parent" ] || break
    if [ -d "$_lf_d" ] && [ -d "$_lf_parent/archive" ] && [ "$_lf_d" -ef "$_lf_parent/archive" ]; then
      return 0
    fi
    _lf_d=$_lf_parent
  done
  return 1
}
