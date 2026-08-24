#!/bin/sh
# Stand-in checker for the verify-reaches fixtures. It examines ONE directory and no other.
# The asymmetry is the whole fixture: a criterion claiming the other directory names a method whose
# scope cannot touch it, which is the L-136 shape reduced to two paths.
#
# Per L-108 this comment deliberately does NOT spell out the unreachable path: a fixture must not
# write the token its own assertion greps for. It did on the first draft, and the must-FAIL case went
# green because the checker matched prose about the target instead of code reaching it. The checker
# now strips comments -- this file keeps the discipline anyway, so the fixture stays honest even if
# that stripping is ever relaxed.
set -u
echo "checked docs/alpha/ -- 3 files examined, 0 findings"
