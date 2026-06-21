---
owner: Maintainer
last_updated: 2026-06-21
update_trigger: A QA test case added/retired, or the naming convention changes
status: current
---

# lean-flow — QA test cases

Maintained, repeatable checks of lean-flow's own skills + loop. Each case is one file rendered from
`skills/lean-doc-generator/templates/QA-TESTCASE.md.template`. These cover **behaviour** — run them at
sprint close / release alongside `scripts/qa-check.sh` (mechanical) and `docs/QA.md` (judgment).

## Convention

- **One file per case:** `docs/qa/QA-NNN-<slug>.md` (NNN zero-padded, monotonic).
- **Area-under-test** names one skill/behaviour; keep the case small and agent-runnable.
- **Last run / Result** are updated in place each run (these instances are *not* append-only).
- A failing case → file a `BUG.md.template` report and route it (CONTEXT.md bug-intake rule).

## Index

<!-- One line per case; newest first. First cases land via SPRINT-008 T4 (golden-path exercise). -->
_(none yet — first cases land via SPRINT-008 T4)_
