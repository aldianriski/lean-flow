# TASK-693 real-input runs (SPRINT-184 T10)

Share: 4.50 USD. Spent: **0.4499 USD** (2 runs). Model `claude-sonnet-5-5`. Route proven: promote, the only route whose text was moved or deleted (close, init, migrate, epic and prd bodies and references are unchanged; see the inventory). Before arm: plugin `lean-flow` at `D:\Research\s184-evals\t10\pre` (export of 12ccee23). After arm: plugin `lean-flow` at `D:\Project\lean-flow`, the live checkout with T10 landed. Both: `claude -p --plugin-dir <arm> --add-dir <arm> --add-dir <fixture> --setting-sources project,local --strict-mcp-config --allowedTools Skill Read Glob Grep --output-format stream-json --verbose --model sonnet --max-budget-usd 0.40`, prompt `/lean-flow:lean-doc-generator promote — start the next sprint from TASK-001 and TASK-002.`, identical non-git fixtures (README, package.json, src/label.ts, spec/STANDARD.md, two v2 backlog tasks sized S and L).

| Arm | Cost USD | Reads | Stop | Writes |
|---|---:|---|---|---|
| before | 0.3470 | promote-brief.md, SKILL.md, sprint-by-reference.md, STANDARD.md, both tasks (via a read-only worker) | stops at the pull-time size check: TASK-002 is L and must split before render; checklist unsigned; options offered | none |
| after | 0.1029 | promote-brief.md, both tasks, README.md (inline) | stops at the pull-time size check: TASK-002 is L, "The Plan freezes at promote, so a later split would cost a scope-change"; ☐ checklist awaiting sign-off; sprint draft only | none |

Same gates and stops: layout v2 detected, the L size-check fires before any move or render, no sign-off fabricated, no `gates_signed`, no sprint file, nothing moved. The before arm dispatched the scan to a worker and the after arm ran inline; the worker-route line is unchanged by T10, so that difference is run-to-run noise, not the trim.
