#!/bin/sh
# Stand-in checker whose PROSE names docs/gamma/ while its code never touches it.
#
# This comment is the fixture. The checker under test strips comments before matching precisely so a
# script cannot vouch for a path it does not examine -- the self-describing-corpus failure (L-108),
# which fired for real on this family's first run and turned a must-FAIL green. Without this case the
# comment-stripping line would be an unguarded guard clause (L-058): removing it broke nothing that
# any fixture could see, which is how a stripped guard ships.
set -u
echo "checked one directory -- 2 files examined, 0 findings"
