# Promote worker brief

Coordinator: paste everything from the `Worker contract (lean-flow):` line down as the start of one general-purpose Agent dispatch, then the packet below; keep its id for every resume.
Name the execution tier on the dispatch where the host takes a model (`sonnet` on Claude), so the worker never inherits the session's; the coordinator's review stays on the session model.
Packet: invocation/arguments, repo root, resolved skill install directory and source locators; do not assume preloaded context.
Include conversation-only intent, constraints, answers and approvals verbatim, with what each approval covers; a summary is not a substitute. The worker cannot see the conversation.
Keep source reads in the worker; the coordinator retains drafts, questions, evidence summaries and decisions, not raw reading dumps.

Worker contract (lean-flow):
Read this skill's SKILL.md yourself; follow its Execution flow and promote procedure, including the layout check, inline without redispatching promote.
Read the standard, required templates, manifests, selected task files and governance sources yourself, plus this skill's applicable references (including sprint-by-reference and epic-coverage); do not rely on a coordinator summary.
Run the governance scan before planning; preserve every checklist item, source, finding, disposition and refusal rule. Never silently clear a finding.
Never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret; report the missing fact or use a non-secret record.
Do not call AskUserQuestion. For each decision round, return `blocked` with one frontier round: questions whose prerequisites are settled, options/recommendations, evidence and the unblock condition; then stop. Resolve facts yourself.
The coordinator reviews judgment calls on the session model and asks the round via AskUserQuestion popups; it resumes this same worker via SendMessage with the owner's answers and new constraints/decisions verbatim.
A resumed worker knows only what it was given. Repeat for dependent rounds; no answer is not approval. All human sign-offs stay with the coordinator and owner.
If findings require repairs before checklist sign-off, return proposed corrections; the coordinator resolves them under the skill's existing approval rules, then resumes you to verify. Keep unresolved findings open.
After governance review, return `blocked` with the full checklist (findings or none, dispositions and evidence) and proposed sprint; name unresolved decisions and what unblocks them.
The draft includes proposed members/order, size/dependency checks, stream/epic decisions, freeze metadata and promote Log entry; use the required templates and by-reference shape. Draft in the report only, never a sprint file before sign-off.
The coordinator shows the checklist and draft, resolves remaining questions, and obtains explicit owner sign-off on the checklist; it never signs for the owner.
Only a SendMessage resume carrying that sign-off verbatim and the checklist/draft it covers authorizes worker writes. Earlier approvals cover only their stated scope.
Then complete the approved promote under the existing procedure: required writes, moves, stamps, signed checklist in the Log and plan freeze/commit; preserve the no-git path. Report the resulting files and evidence.
G1/G2 remain separate human sign-offs in the coordinator's session; record gates_signed only after their actual sign-off is relayed verbatim, never infer it from governance approval.
If new evidence changes what was signed, return `blocked` for the coordinator to resolve it before affected writes. Never turn a proposed repair into a completed checklist item.
Report changes, checks/results, evidence and anything remaining. Unattended or no Agent/resumption uses the original inline flow; unattended promote parks at the scan and records the park as the skill requires.

- `ready`: the task is complete and relevant checks passed; name checks and results.
- `blocked`: partial or needs input; name what remains and what unblocks it.
- `failed`: no usable result; name the failure and checks/retries attempted.
- `dropped`: nothing remains for a person; explain why.
These are worker report states, not task status moves or gate approvals. End each report with exactly one state on its own last line.
