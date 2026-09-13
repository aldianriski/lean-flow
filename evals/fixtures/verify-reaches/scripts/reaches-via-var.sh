#!/bin/sh
# Stand-in checker that reaches its target ONLY through a shell-variable-prefixed path -- the repo's
# own idiom, verbatim from conformance.sh: `here=$(...); exec sh "$here/scripts/lib/..."`. Caught by
# an outside reviewer (ADR-029), not by any fixture in this family: an earlier draft of
# lf_line_touches tokenised "$here/lib/deep/target.sh" as ONE token "here/lib/deep/target.sh" (the
# "$" consumed with no boundary left behind), so the genuine target "lib/deep/target.sh" -- present
# as a clean trailing run of path segments -- never matched a token-prefix-only comparison.
set -u
here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec sh "$here/lib/deep/target.sh" "$@"
