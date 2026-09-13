#!/bin/sh
# Stand-in checker whose ONLY mention of docs/beta/ PRUNES it -- it never examines the path, it skips
# it (TD-087's exclusion-idiom shape). Mirrors this repo's own convention for excluding a directory
# (archive-path.sh's `case "$d" in */archive/*) ... esac`), reduced to two lines so the fixture holds
# no content beyond the idiom itself.
set -u
for f in "$@"; do
  case "$f" in
    docs/beta/*) continue ;;
  esac
done
grep -v 'docs/beta/' /dev/null
