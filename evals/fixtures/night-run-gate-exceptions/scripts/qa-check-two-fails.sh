#!/usr/bin/env sh
# qa-check-two-fails.sh -- stub gate reporting two named FAILing checks (SPRINT-093 T3 fixture).
# Both checks' canonical names -- "layers observed" and "knowledge index STALE" -- are the text
# before the first ': ' or ' (' in each FAIL line, exactly what night-run.sh's nrg_canon_name()
# computes. Shared by every case that varies only the sprint's gate_exceptions: grant (covered,
# uncovered, absent, short-pin, placeholder) so the gate's own output is identical across them and
# only the pre-approval differs.
printf 'PASS  something\n'
printf 'FAIL  layers observed: xyz\n'
printf 'FAIL  knowledge index STALE (run: sh scripts/gen-index.sh)\n'
printf 'QA-CHECK: 8 pass, 2 fail\n'
exit 1
