# TASK-691 — proof-run spend

Builder phase only. No claude -p invocation was launched by this worker. Actual builder proof-run
spend: $0.00. There are no transcripts or completed parity proofs yet.

Task share: $3.50, not transferable without owner approval. Planned eight runs at $0.40 each = $3.20;
this is an envelope, not measured spend, a reservation of pricing, or authorization to launch.

| Route | Before | After | Actual spend |
|---|---|---|---|
| R1 ordinary freeform intake | Pending | Pending | Not incurred by builder |
| R2 routine prime health report | Pending | Pending | Not incurred by builder |
| R3 new rejection | Pending | Pending | Not incurred by builder |
| R4 matched prior rejection | Pending | Pending | Not incurred by builder |

The coordinator records each run's transcript path, commit/plugin base directory, tool-read evidence,
gates/stops/outputs comparison, total_cost_usd and running total here after execution.
Prompt and cwd recipes: task-decomposer.md (R1), prime.md (R2), triage.md (R3/R4).
One before-run uses pre-trim export 3aacd3ebed802905c3b1342d68295678b96711a1;
one after-run uses merged D:/Project/lean-flow, with identical input per pair.
A stopped/invalid run still costs money and must be included. Stop before exceeding the remaining
share; no additional route or retry is implicitly approved.


## Coordinator runs (2026-11-21)

Share 3.50 USD; spent **1.4220 USD** (14 runs, 4 void). Model `claude-sonnet-5-5`. Before arm: plugin `lean-flow` at `D:\Research\s184-evals\t8\pre` (export of 3aacd3eb). After arm: plugin `lean-flow` at `D:\Project\lean-flow` (the live checkout after merge-back, 4cdfb3d5). Both arms: `claude -p --plugin-dir <arm> --add-dir <arm> --setting-sources project,local --strict-mcp-config --allowedTools Skill Read Glob Grep --output-format stream-json --verbose --model sonnet --max-budget-usd 0.45`, identical folders per pair.

| Run | Arm | Cost USD | Skill loaded | Moved/removed text read | Verdict |
|---|---|---:|---|---|---|
| void ×4 (intake, prime, reject, match) | before | 0.3997 | no: `Skill` blocked by the headless permission default; the model worked by hand | — | void, rerun with `--allowedTools Skill` |
| R1 intake | before | 0.0828 | task-decomposer | task-file.md | baseline |
| R1 intake | after | 0.0970 | task-decomposer | task-file.md | same schema, TASK-001, Negative box, stop at approve; skipped the context read |
| R1 intake (reruns) | after | 0.1043, 0.1126 | task-decomposer | task-file.md | both read CONTEXT.md and src/greet.ts: the first after-run's skip was run-to-run noise (the read instruction is unchanged by the trim) |
| R2 prime | before / after | 0.1529 / 0.1867 | prime | (no move) | same slots, loads, Tasks counts, handoff "none outstanding", Next |
| R3 new rejection | before / after | 0.0506 / 0.0967 | triage | after reads references/out-of-scope.md | same proposal: durable reason, revisit-if, `.out-of-scope/` record with prior-requests TASK-507, backlog→cancel, nothing applied without `y` |
| R4 matched rejection | before / after | 0.0518 / 0.0869 | triage | after reads references/out-of-scope.md | same match despite the filename, earlier reason surfaced, confirm/reconsider/disagree with effects, nothing applied without `y` |

Comparison judged by a fresh Claude reader (Sonnet) against the routes' "Compare:" criteria: R2, R3, R4 PASS; R1 flagged on the first after-run, cleared by the two reruns above. No run wrote a file.
