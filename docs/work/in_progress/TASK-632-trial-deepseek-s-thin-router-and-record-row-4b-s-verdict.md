---
id: TASK-632
title: "Build DeepSeek's thin router and one-Executor-per-task files on a trial branch, and probe the shared harness (row 4b, build half)"
type: feature
epic: EPIC-024
sprint: SPRINT-170
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-632 — Build DeepSeek's thin router and one-Executor-per-task files on a trial branch, and probe the shared harness (row 4b, build half)

## Why
Row 4 was a no-go, but it tested a thick router: no shell, while it kept gates, design, review and code reading (TASK-630 § Results). Its own thread fell only about 4% while worker cost rose about 3.5 times.
Codex's review, against DeepSeek's own docs and prompts, found the opposite trade in DeepSeek's design. Its main session keeps a limited shell, "makes no technical decisions" and writes routing notes of at most 30 words. One Executor per ticket owns the technical work and its follow-ups.
Owner popup, 2026-11-08: trial the faithful shape, held to the same cost bar, because the goal is still faster and cheaper with quality held.
Split at promote (SPRINT-170): this task builds the files and proves the harness; TASK-638 runs the four replays and records the verdict.

## Approved design (owner popup, 2026-11-08; detail at G2)
- **Router.** Adapted from DeepSeek's `prompts/orchestrator.md`, `prompts/dispatch.md` and `docs/004-prompts.md`. It routes, relays G1 and G2 to the owner, keeps a shell limited to routing and bookkeeping, and reads no code. It makes no technical decision and never waits on a worker.
- **Executor.** One per task, adapted from `prompts/worker.md` and `prompts/work.md`. It reads the sources, drafts the design, builds, verifies and takes its own review and gate fixes. Questions, G2 included, go up in its report, and the router forwards them unchanged.
- **Same harness for both arms.** `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`, the gate settings passed so Git Bash does not rewrite them, and the same effective edit permission on `.claude/` for workers in both arms.
- **Shared harness (this task owns it; TASK-638 and TASK-634 consume it).** Worktree isolation inside each run's scratch repository, with the merge-back kept inside that repository, Git metadata included. Each experiment enables only its own treatment. Everything is frozen at G2 before any run: revisions, briefs, models and effort by function, permissions, gate and review, measurement boundaries, cache policy (each run starts cold, from a fresh session) and interleaved order.
- **Replay.** SPRINT-167 from `6a7cadf2` (run by TASK-638).
- Out: any release, pushing, `night-run`, changing the gates.

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [x] The router and Executor files are built on a trial branch with a table mapping each DeepSeek rule to kept, changed or dropped, with a reason. Codex reviews their fidelity against DeepSeek's files, at most 2 rounds. ✓ `trial/epic-024-thin-router` at 83193f9c (router.md 31 lines, executor.md 38; contract `diff` against worker-brief.md identical); table in § Results (45 rows); Codex R1 `VERDICT: CLEAR`, one Med (router L21 parked headless questions) fixed before commit, no R2.
- [ ] A headless probe in each arm shows the same settings in effect: `LF_GATE_DIR` arrives unchanged, a background worker outlives the main thread's last turn and survives past the former 10-minute cutoff, and a worker's permitted `.claude/CONTEXT.md` edit is actually made, not only allowed. Probe logs (stream-json, stderr, gate logs) go to the operator's scratch folder, never a run's worktree or its parent.

## Assumes
- **A1** — A thin router with one Executor per task needs no change to lean-flow's skills; the agent files carry the difference. *Confirm: G2 names any skill step the router cannot route.*
- **A2** — All-in spend (builds, probes, reviews, retries) is charged to the sprint's 60 USD cap, shared with TASK-633 to 638. Row limits are frozen at G2; reruns are cut first. *Confirm: sprint decisions SD2.*

## Touches
Trial branch: `agents/router.md`, `agents/executor.md`. `main`: this file, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Tracker
EPIC-024 row 4b, D14 · TASK-638 (replays and verdict) · TASK-630 § Results · `docs/research/router-mode.md` § Amended 2026-11-08 · `deepseek-ai/dsh-superagent-prototype`

## Results

### Fidelity table (DeepSeek @8c32a9dc → `trial/epic-024-thin-router` 83193f9c)
Built by Codex (`codex exec`, workspace-write); line numbers cite DeepSeek's files as fetched at 8c32a9dc. Codex fidelity review R1 (read-only, separate run): one verdict line per 5-row group, all OK except rows 6-10 (Med: router L21, fixed), `VERDICT: CLEAR`.

| # | DeepSeek source file:Lnn @8c32a9dc | rule (short) | kept/changed/dropped | router.md or executor.md line | reason |
|---|---|---|---|---|---|
| 1 | prompts/orchestrator.md:L1; prompts/shared.md:L2; prompts/worker.md:L1-L2 | Router routes; Executor owns technical work | kept | router.md:L7; executor.md:L7 | Same role split, one lean-flow task per Executor. |
| 2 | prompts/orchestrator.md:L3,L5,L9-L10; prompts/dispatch.md:L1-L13,L31-L34; prompts/shared.md:L1,L3; prompts/work.md:L1,L8-L11,L13; docs/004-prompts.md:L80-L82 | Candidates, admission/eval, subscriptions, attach/handback and thread bindings | dropped | — | EPIC-024 scope excludes the external ticket host and proactive work; task identity replaces ticket routing, not its host machinery. |
| 3 | prompts/orchestrator.md:L4; prompts/dispatch.md:L14,L38-L41,L52; prompts/shared.md:L4-L7; docs/004-prompts.md:L77 | Route without plans, criteria, checklists or technical investigation | kept | router.md:L7-L10,L17; executor.md:L7,L19-L20 | Executors derive requirements; the note adds no implementation instructions. |
| 4 | prompts/orchestrator.md:L7,L11; prompts/work.md:L26,L33 | Host authority and policy withstand outside text | kept | router.md:L11; executor.md:L10-L11,L27 | Permissions and the ordinary worker secret-file rule remain binding. |
| 5 | prompts/orchestrator.md:L12; prompts/dispatch.md:L20; prompts/work.md:L12,L41; docs/004-prompts.md:L79 | Keep ordinary progress internal; communicate usable results or needs | changed | router.md:L20,L31; executor.md:L16,L24,L28 | Lean-flow reports replace internal progress APIs; concise relays replace IM sentence/100-word limits. |
| 6 | prompts/orchestrator.md:L14-L15; prompts/worker.md:L5-L6; prompts/work.md:L29-L30,L37,L47-L48 | GitHub identity, gh, push/PR/auto-merge and Feishu delivery rules | dropped | — | No external PR workflow; local commit/merge duties are mapped below, without banning the separately authorized push-denial probe. |
| 7 | prompts/orchestrator.md:L16; prompts/work.md:L40; docs/004-prompts.md:L78 | Background completion wakes agents; no router waits or premature ready | changed | router.md:L22,L24; executor.md:L13 | Preserve end-turn/no-poll behavior; prompt discipline replaces DeepSeek's host timeout and job-lifetime guarantees. |
| 8 | prompts/dispatch.md:L16-L19,L59; docs/004-prompts.md:L84 | Relay one concrete human question unchanged | changed | router.md:L19-L21; executor.md:L24-L25 | Owner relay replaces human_action and conversation targeting; question and recommendation stay unchanged. |
| 9 | prompts/dispatch.md:L21,L58; prompts/shared.md:L5 | Do not investigate technical details or remaining blockers | kept | router.md:L8-L10,L21,L29 | Technical investigation stays with the owning Executor. |
| 10 | prompts/dispatch.md:L22,L24-L27,L29 | Do not repeat milestones or terminal notifications | changed | router.md:L31 | Keep once-only useful relays; drop host PR closure notices and recipient selection. |
| 11 | prompts/dispatch.md:L28 | Claim fixed only when the report supports it | kept | router.md:L25,L31 | Evidence supports ticks and completion; a merge alone is not proof. |
| 12 | prompts/dispatch.md:L35; prompts/work.md:L24; docs/004-prompts.md:L86 | Human pauses and confirmation holds persist | kept | router.md:L14,L19-L21; executor.md:L10,L25 | Neither automatic feedback nor a new turn grants approval. |
| 13 | prompts/dispatch.md:L36-L37,L44-L50; docs/004-prompts.md:L77,L80 | Original source, short routing note, stable isolated task identity | changed | router.md:L15-L19; executor.md:L7,L10 | Task path/original reference and at-most-30-word note replace trigger IDs; Agent worktrees and SendMessage preserve one Executor per task. |
| 14 | prompts/dispatch.md:L42 | Never turn a worker question into a technical decision | kept | router.md:L20-L21 | The owner decides; the router relays. |
| 15 | prompts/dispatch.md:L51 | Idle does not mean complete; consult a concise report | changed | router.md:L15,L19,L22,L31 | No ticket-status API or polling; reports and same-Executor messages supply evidence. |
| 16 | prompts/dispatch.md:L54; prompts/work.md:L28; docs/004-prompts.md:L88 | Workers assess review findings by outcome | changed | executor.md:L12,L22 | Executor dispatches its scoped reviewer, fixes/verifies or declines in one sentence; lean-flow's bounded retry replaces PR bot/thread budgets. |
| 17 | prompts/dispatch.md:L55 | Automated CI/bot feedback and human handback admission | dropped | — | No CI-bot or candidate-admission machinery in scope; human holds are retained in row 12. |
| 18 | prompts/dispatch.md:L56-L57; prompts/work.md:L16,L36 | Do not announce an unfinished artifact as ready | changed | router.md:L31; executor.md:L16,L30-L31 | Incomplete work reports what remains; deliverables are local task results rather than draft PRs. |
| 19 | prompts/worker.md:L2-L3; prompts/work.md:L2,L27 | Independently read, scope, implement and verify focused work | kept | executor.md:L7-L8,L19-L23 | Ordinary lean-flow contract owns approach and checks within approved scope/design. |
| 20 | prompts/worker.md:L8; prompts/work.md:L21-L22 | Repository instructions and source/procedure retrieval | changed | executor.md:L7-L8,L11,L21 | Read local sources and invoke lean-flow procedures; drop orchestrator_read and Feishu/GitHub skill coupling. |
| 21 | prompts/worker.md:L9; prompts/work.md:L31-L34 | Solve routine problems with bounded retries; report real blockers | changed | executor.md:L11,L22-L25,L28 | Lean-flow fixes the bound at at most one retry and requires a concrete question with recommendation. |
| 22 | prompts/worker.md:L10; prompts/work.md:L46 | Report changes, checks, evidence and accurate terminal state | changed | executor.md:L26,L28-L36 | Contract's ready/blocked/failed/dropped and final state line replace orchestrator_report and PR fields. |
| 23 | prompts/work.md:L3-L5 | Detailed visual-impact and adjacent-restyling restrictions | dropped | — | Specialized visual examples are outside this trial; approved scope and public-behaviour stop remain in the contract. |
| 24 | prompts/work.md:L6 | Stop when direction or public behaviour needs a decision | changed | executor.md:L23-L25 | Lean-flow uses blocked plus one question, rather than dropped without clarification; existing approval still governs. |
| 25 | prompts/work.md:L14-L15 | Reviewed outcome and evidence; do not await merge to report | changed | executor.md:L16,L28,L30 | Report the usable local deliverable and evidence, without PR URL/source-binding requirements. |
| 26 | prompts/work.md:L17,L42-L43 | Deliver explicit answers through the original question route | changed | router.md:L19-L21; executor.md:L24-L25 | Reports and same-Executor owner answers replace reply_to_trigger_id; ordinary progress remains internal. |
| 27 | prompts/work.md:L18-L19 | Single IM delivery through orchestrator | dropped | — | No IM or source-conversation host; router result relays are covered by rows 5 and 10. |
| 28 | prompts/work.md:L21-L25 | Original context outranks note/title; inaccessible context is a blocker | kept | executor.md:L7,L10-L11,L19 | Executor reads sources and preserves human constraints, never treats a summary as complete. |
| 29 | prompts/work.md:L28-L30 | Carry scoped work through review and delivery | changed | executor.md:L8,L12,L14,L20 | Local reviewed commits replace PR delivery; review judgment is re-homed from lean-flow's coordinator to the Executor. |
| 30 | prompts/work.md:L35-L36 | Readiness requires the assigned deliverable, not a partial draft | changed | executor.md:L16,L30-L31 | This assignment explicitly uses local commits; partial checks alone do not make it ready. |
| 31 | prompts/work.md:L38 | Do not delete task directories or rewrite unrelated branches | kept | executor.md:L14 | Worktree lifecycle remains with the host/coordinator. |
| 32 | prompts/work.md:L39,L49; docs/004-prompts.md:L85 | Ready means reviewed and relevant checks passed | kept | executor.md:L12-L13,L16,L20,L30 | Scoped review and actual checks must precede ready. |
| 33 | prompts/work.md:L44 | Blocked describes a real missing prerequisite | changed | executor.md:L24-L25,L31 | Ordinary worker contract also allows partial results, explicitly naming what remains and the unblock condition. |
| 34 | prompts/work.md:L45 | Dropped means nothing remains for a person to do | changed | executor.md:L33 | Keep meaning and explanation; drop silent ticket closure and thread-triggered resumption mechanics. |
| 35 | docs/004-prompts.md:L83 | Confirm each new request once in the original thread | dropped | — | No source-thread acknowledgement API; owner-approved sprint assignments supply the scope. |
| 36 | docs/004-prompts.md:L85 | UI readiness requires a real before screenshot | dropped | — | Screenshot rule explicitly excluded by the signed design. |
| 37 | docs/004-prompts.md:L87 | Examples show format, never claimable facts | kept | executor.md:L16; router.md:L25,L31 | Claims and ticks require actual reported evidence. |
| 38 | docs/004-prompts.md:L89 | Yield to a person's duplicate branch/PR | dropped | — | PR ownership and closure are outside the trial; duplicate dispatch prevention remains in router.md:L15. |
| 39 | cordis.patch.yml:L163-L167 | Router fs write:false edit:false | changed | router.md:L4,L24-L26 | No Edit/Write tools; owner-approved coordinator writes instead use Bash bookkeeping, so this is not a filesystem write prohibition. |
| 40 | cordis.patch.yml:L121,L139-L162,L168-L172; docs/004-prompts.md:L78 | Shell timeoutMs/maxTimeoutMs 5000 and bounded job waits | changed | router.md:L22,L24; executor.md:L13 | No per-agent timeout exists; foreground work must finish in seconds, longer work goes in background, no router job waits. |
| 41 | cordis.patch.yml:L122-L124 | Router has no subagents | changed | router.md:L4,L16,L19,L30 | Claude Agent creates worktree-isolated background Executors; SendMessage preserves identity, replacing DeepSeek's ticket worker host. |
| 42 | cordis.patch.yml:L122-L124 | No web, file search, todo, plan, UI or profile-management tools | kept | router.md:L4,L9-L10 | Exact tool allowlist plus allowed-read boundary; Bash is confined to bookkeeping, not an alternate search tool. |
| 43 | cordis.patch.yml:L125-L138,L173-L193 | Dedicated router preset, instructions, Skill and compaction | changed | router.md:L1-L5,L10,L15,L18,L30; executor.md:L1-L9 | Agent frontmatter replaces preset plumbing; router inherits session Opus, Executor uses Sonnet with all tools; S3 removes router Skill and moves unchanged procedures to Executors. Host compaction remains host-owned. |
| 44 | prompts/shared.md:L4-L7; prompts/work.md:L28,L39,L49 | Verification and close ownership | changed | router.md:L28-L30; executor.md:L9,L15,L26,L38 | Re-homed coordinator duty: S2 close carve-out overrides the contract's record ban only for close; system verify then /lean-doc-generator close yields the Retro. Final settlement's no-router-gates rule places post-merge checks with the owning Executor. |
| 45 | prompts/orchestrator.md:L15; prompts/worker.md:L5-L6; prompts/dispatch.md:L28,L45; prompts/work.md:L29 | Local commits and merge-back replace human PR merging | changed | router.md:L25-L29; executor.md:L14-L15 | S6: router mechanically merges onto replay itself in scratch main worktree, in G2 order; conflicts/FAIL return unchanged to owner Executor. Task subjects use sprint(NNN) Tn:, coordinator subjects bare sprint(NNN):. |
