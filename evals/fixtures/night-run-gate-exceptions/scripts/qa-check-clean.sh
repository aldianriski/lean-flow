#!/usr/bin/env sh
# qa-check-clean.sh -- stub gate that reports a fully clean run (SPRINT-093 T3 fixture).
# Stands in for the real scripts/qa-check.sh (~200-390s, TD-117) so the launcher's gate-parsing
# logic can be exercised without ever invoking the real gate from a harness.
printf 'PASS  something\n'
printf 'QA-CHECK: 1 pass, 0 fail\n'
exit 0
