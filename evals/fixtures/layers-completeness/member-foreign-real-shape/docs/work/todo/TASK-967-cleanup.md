---
id: TASK-967
sprint: SPRINT-927
---
<!-- docs/work/done/TASK-677-run-plain-and-graphify-abba-score-blind-and-rule-on-graphify.md, current cleanup box verbatim (the pre-reword foreign token is absent). -->

## Done when

- [x] The snapshot's HEAD and `git status --porcelain --ignored` equal the baseline, workdoo's tracked project CLAUDE.md is restored with `git checkout`, the temporary `.graphifyignore`, the project skill, settings and graphify-out files are removed, no ~/.claude hook was added, the throwaway probe is left for TASK-678 and D:\Project\workdoo is untouched. ✓ after the reverts HEAD 884d897 and --ignored status equal the baseline; .claude/CLAUDE.md restored by git checkout; CLAUDE.md, .claude/settings.json, .claude/skills, .graphifyignore, graphify-out removed; ~/.claude CLAUDE.md and settings.json hashes unchanged, no hook added (global skill refresh logged); probe kept; D:\Project\workdoo untouched
