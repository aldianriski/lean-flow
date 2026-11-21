# TASK-688 real-input runs (SPRINT-184 T5)

Share: 1.50 USD. Spent: 0.3190 USD (2 runs). Model `claude-sonnet-5-5`; each run's `system/init` lists the plugin `lean-flow` at path `D:\Project\lean-flow` (inline, 2.26.0), the live checkout after merge-back (f09ce0b6).
Prompt: `embedded.md` § Inline path, § Child path item 4, § Never touched and § Commit messages and PR bodies, verbatim from the live file, then format `plain` and `evals/fixtures/humanizer/domain-calque/commit-message.txt` (Indonesian) as text and voice sample. Flags: `claude -p --setting-sources local --plugin-dir D:/Project/lean-flow --add-dir D:/Project/lean-flow --output-format stream-json --verbose --model sonnet --max-budget-usd 0.40`, each from its own scratch folder outside the repo.

| Run | Folder context | Cost USD | Tool calls on the host context | Result |
|---|---|---:|---|---|
| R1 | `.claude/CONTEXT.md` from `glossary-override/` (Dry run, avoid gladi and rehearsal) | 0.1639 | Glob `{.claude/CONTEXT.md,CONTEXT.md}`, then Grep `^## Domain Glossary` on `r1/.claude/CONTEXT.md` (result: the Dry run entry) | success: "seluruh VM sudah di-scan; dry run dijadwalkan Rabu"; no `rehearsal`, no `gladi` |
| R2 | none at either path | 0.1551 | Glob found nothing | success, no error, no `UNAVAILABLE`: "di-scan; rehearsal dijadwalkan Rabu" (the catalog form, no override) |

R1 against R2 isolates the glossary: the same prompt gives "dry run" only when the host file exists. Before the pointer, SPRINT-180 recorded "rehearsal" in 2 of 2 commit-inline runs with the same override folder.
