# Intake worker brief

Coordinator: paste everything from the `Worker contract (lean-flow):` line down as the start of one general-purpose Agent dispatch, then the packet below; keep its id for every resume.
Name the execution tier on the dispatch where the host takes a model (`sonnet` on Claude), so the worker never inherits the session's; the coordinator's review stays on the session model.
Packet: invocation/arguments, repo root, resolved skill install directory and source locators; do not assume preloaded context or an existing task file.
Include conversation-only intent, constraints, answers and approvals verbatim, with what each approval covers; a summary is not a substitute. The worker cannot see the conversation.
Keep source reads in the worker; the coordinator retains drafts, questions, evidence summaries and decisions, not raw reading dumps.

Worker contract (lean-flow):
Read this skill's SKILL.md and the selected input yourself (freeform, ticket, PRD, epic or roadmap); follow the applicable procedure and this skill's references inline, without redispatching intake.
Read repo context, relevant code/tests, requirements and task-id sources as that procedure requires; resolve facts yourself. Preserve its layout checks, PRD/fog branches, assumption registry, slicing, quiz and validation.
Never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret; report the missing fact or use a non-secret record.
Do not call AskUserQuestion. For each decision round, return `blocked` with one frontier round: all independent questions whose prerequisites are settled, options and a recommended answer for each, relevant evidence and remaining assumptions; then stop.
The coordinator reviews the frontier and draft on the session model (grill/design judgment stays there), asks the round via AskUserQuestion popups, and owns all human gates.
The coordinator resumes this same worker via SendMessage with the owner's answers and any new constraints or decisions verbatim; a resumed worker knows only what it was given.
Recompute the frontier from those answers; repeat until settled. No answer is not approval. PRD, fog-map and breakdown-quiz questions/approvals take this same route.

For task output, return the validated draft as `blocked`, pending the owner's typed `approve`: full proposed task contents, assumptions, risk/blast radius, dependencies/order, validation evidence and any unresolved decision with its unblock condition.
Keep that draft in the report; do not create task files yet. Include any working PRD or fog-map the selected branch requires, without changing its outputs or approval steps.
The coordinator reviews and presents the draft, obtains the owner's typed `approve`, then resumes this worker via SendMessage with that exact approval and the draft it covers.
Only that resume authorizes task-file writes; follow Step 7 and the hard rules: derive ids, write new backlog files only, never overwrite or write a sprint, roadmap or core doc.
If a new decision changes the approved draft, return `blocked` for the coordinator to resolve it; never extend an approval yourself. G1/G2 sign-off remains with the coordinator and owner.
Report files changed, checks/results, evidence and anything remaining; do not move task status or tick acceptance boxes for a future build.
After this resumed worker reports `ready`, the coordinator runs Step 7's offer per `orchestrator/references/mode-choice.md` and returns `promote` / `stop` to its caller (including flow's Feed→Plan guard); the worker never offers or launches promote. N = 0 or no attended ask channel → return `stop` with `Next:` only.

- `ready`: the task is complete and relevant checks passed; name checks and results.
- `blocked`: partial or needs input; name what remains and what unblocks it.
- `failed`: no usable result; name the failure and checks/retries attempted.
- `dropped`: nothing remains for a person; explain why.
These are worker report states, not task status moves or gate approvals. End each report with exactly one state on its own last line.
