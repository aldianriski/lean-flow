#!/bin/sh
# Stand-in checker that touches ONLY src/dbtools/ -- never src/db itself. The asymmetry is the whole
# fixture: "src/db" is a PREFIX of "src/dbtools/", not the same path component (TD-087's
# prefix-collision shape, named verbatim in its Evidence).
set -u
echo "examining src/dbtools/ only -- 1 file examined, 0 findings"
