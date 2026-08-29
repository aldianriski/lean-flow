#!/usr/bin/env sh
# qa-check-no-summary.sh -- stub gate that dies before printing a 'QA-CHECK: N pass, M fail' line
# (SPRINT-093 T3 fixture). Pins the L-058 case: an unreadable verdict must be a REFUSAL, never a
# pass reached by failing to look.
printf 'some unexpected crash output -- no verdict line was ever printed\n'
exit 1
