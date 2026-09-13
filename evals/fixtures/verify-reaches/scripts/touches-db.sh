#!/bin/sh
# Stand-in checker that genuinely touches src/db/ -- the sibling control for touches-dbtools.sh.
# Differs from it in exactly one path component (db vs dbtools), which is the whole point: a
# substring test cannot tell these apart, a path-boundary test must.
set -u
echo "examining src/db/migrate.sh -- 1 file examined, 0 findings"
