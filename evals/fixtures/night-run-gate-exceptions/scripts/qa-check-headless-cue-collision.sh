#!/usr/bin/env sh
# qa-check-headless-cue-collision.sh -- reproduces qa-check.sh leg 13's REAL shape (SPRINT-093 T3
# retry, Finding 2): three semantically distinct FAILs about the SAME file, sharing the identical
# prefix "headless park-record cue <path>" before their first ': '. Verbatim leg-13 text (read from
# scripts/qa-check.sh, never modified -- this stub does not touch that file).
printf 'PASS  something\n'
printf 'FAIL  headless park-record cue skills/lean-doc-generator/references/init.md: file not found\n'
printf 'FAIL  headless park-record cue skills/lean-doc-generator/references/init.md: ask-channel probe (ToolSearch select:AskUserQuestion) missing\n'
printf 'FAIL  headless park-record cue skills/lean-doc-generator/references/init.md: park-record instruction naming the /handoff doc missing\n'
printf 'QA-CHECK: 5 pass, 3 fail\n'
exit 1
