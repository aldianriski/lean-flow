# TASK-690 routing runs (SPRINT-184 T7)

Share: 1.50 USD. Spent: 0.4725 USD (10 runs). Model `claude-sonnet-5-5`. After-arm runs: each `system/init` lists the plugin `lean-flow` at path `D:\Project\lean-flow` (inline, 2.26.0), the live checkout after merge-back (f09ce0b6). Pre-trim comparison runs use `git archive af7508b1 skills .claude-plugin` (the descriptions before T7). Flags: `claude -p --plugin-dir <arm> --setting-sources project,local --strict-mcp-config --output-format stream-json --verbose --model sonnet --max-turns 2 --max-budget-usd 0.30`, each from its own scratch folder outside the repo.

| Run | Arm | Prompt | Cost USD | First tool call | Verdict |
|---|---|---|---:|---|---|
| t7-1 | after | Council this: should we move billing from Postgres to DynamoDB or keep it? | 0.0503 | `Skill lean-flow:council` (blocked by the headless permission default, which is the routing evidence) | routes |
| t7-2 | after | Is 2 an even number? Answer yes or no. | 0.0382 | none ("Yes.") | Do-not case does not route |
| t7-3 | after | Write an ADR recording our decision to adopt Bun | 0.0534 | Glob, Bash, Write | no route |
| t7-3b, t7-3c | after | same | 0.0524, 0.0442 | Glob, Glob, Write/Read | no route |
| t7-3pre-a, t7-3pre-b | pre-trim | same | 0.0501, 0.0500 | Glob, Glob, Write | no route on the old description either |
| t7-4 | after | Document how this function works: function clamp(n, min, max) { … } | 0.0460 | none (answered inline) | Do-not (HOW) case does not route |
| t7-5 | after | Promote the ready backlog tasks into a new sprint for this repo. | 0.0437 | `Skill lean-flow:lean-doc-generator` | routes |
| t7-5pre | pre-trim | same | 0.0442 | `Skill lean-flow:lean-doc-generator` | routes |

Reading: the "Write an ADR" prompt does not route in this harness on either description (0 of 3 after, 0 of 2 before), so it is harness behaviour, not a trim regression; the sprint-lifecycle trigger from the same description routes on both arms. Each trimmed description therefore has one prompt that routes (t7-1, t7-5) and one Do-not case that does not (t7-2, t7-4).
