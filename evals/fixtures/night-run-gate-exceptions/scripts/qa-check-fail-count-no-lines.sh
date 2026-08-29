#!/usr/bin/env sh
# qa-check-fail-count-no-lines.sh -- stub gate whose summary claims 2 FAILing checks but prints no
# 'FAIL  ...' line naming either one (SPRINT-093 T3 fixture). Pins the L-058 case one level down
# from qa-check-no-summary.sh: the summary line parses fine, but there is nothing to compare
# against gate_exceptions:, which must refuse rather than read "nothing found" as "nothing wrong".
printf 'QA-CHECK: 5 pass, 2 fail\n'
exit 1
