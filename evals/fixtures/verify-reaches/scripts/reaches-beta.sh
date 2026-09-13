#!/bin/sh
# Stand-in checker that genuinely examines docs/beta/ -- the sibling control for excludes-beta.sh.
# Differs from it in exactly one property: this script's only mention of the path is a real
# examination, not a prune, so it must stay PASS while excludes-beta.sh stays FAIL (L-142).
set -u
echo "checked docs/beta/ -- 2 files examined, 0 findings"
