---
sprint: 155
slug: consumer-docs-codex-built
owner: Maintainer
last_updated: 2026-11-01
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-155 — Execution Log

> Append-only companion to [`../SPRINT-155-consumer-docs-codex-built.md`](../SPRINT-155-consumer-docs-codex-built.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-01 | promote | plan locked, governance signed, five members: three Codex-built template and comment fixes, two Claude-run
Promote governance checklist, signed by the owner by popup (one scan for SPRINT-154 and SPRINT-155, promoted together):
- ☑ L-promotion: none due. Census 253 headings = 225 promoted + 27 active + 1 superseded; no active entry at count 2 or more.
- ☑ TD aging: 102 open, 100 aged against sprint 154 (created at 151 or earlier); TD-283 and TD-284 are new (152). Second
  route: 102 matching lines; by severity 59 low + 24 minor + 14 medium + 5 trivial = 102. No `high` row, none resolved.
- ☑ doc-aging, §11: TASK-537..540 pruned (SPRINT-151, closed three sprints ago; no live citation by two queries, a scripted
  whole-word scan and `git grep -w`, with TASK-536 and 541 as positive controls). The other 46 closed files from sprint 151 or
  earlier keep a live citation. No CHANGELOG rotation (no new MINOR), no LEARNINGS collapse due. Commit `9b4fd30a`.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only); the token budget passed at `4a381b64`.
- ☑ epic rollup currency: EPIC-023 current (checker PASS). ☑ epic coverage: 3 open, all covered. ☑ roadmap: none.
  ☑ handoff ledger: none.
Composition by owner popups: TASK-563, 564 and 562 built by Codex (D1), TASK-565 and 561 Claude-run; stream codex-pilot,
beside stream s1-discovery (SPRINT-154). All five `ready`, all size S, no `L`. Origins: all close-retro, so G1 runs the full
checklist for each (no fast-path). Epic: none. Before the lock, TASK-563's first box names init's reference by its full path
(`skills/lean-doc-generator/references/init.md`), since promote-check matches a partial path only exactly. promote-check:
16 pass, 0 fail. Pre-dispatch preflight by inspection: no cycle; T2 follows T1 (README template, CHANGELOG); T3, T4 and T5
are disjoint from T1 and T2 and from each other.

### 2026-11-01 | progress | batch G1 signed for T1-T5 (full checklist, every origin close-retro); G2 signed for every task
G1 per task: goal, size (all S), files, blast radius, out-of-scope and assumptions written in the G2 design (session scratchpad
`s155-designs.md`); no task is `L`. G2 designs went to one fresh reader each before sign-off: five read-only Codex readers, run
in parallel (pilot D1), 147k Codex tokens in all and no Claude reader tokens.
builder-check · T1 · 2 contradictions · 1 questions · settled: the census grep is recursive and also catches lean-flow file paths (init.md links a lean-flow research doc), generic placements stay; real-init procedure named (owner-run on the VPS after T2, one run for T1 box 2 and T2 box 3)
builder-check · T2 · 0 contradictions · 0 questions · nothing important left
builder-check · T3 · 0 contradictions · 1 questions · settled: the full gate is gate-remote.ts on the merged HEAD, whose qa-check runs the conformance fixtures; the builder runs the fixtures locally
builder-check · T4 · 2 contradictions · 2 questions · settled: cleanup works from a before/after process snapshot and covers the timed-out reproduction; the cause names the blocking call and why; the exec reviews ran on this host; intent ruled by owner: a timeout diagnostic plus the blocking call stands as the error text
builder-check · T5 · 0 contradictions · 2 questions · settled: the product exemptions conflict with a pointer-only requirements file (spec 0.18.2); intent ruled by owner: full profile with both exemptions dropped, and an owner-approved trim of the overview, its own commit, to fit `## Stack` under the hard cap
Owner rulings by popup: T1-T3 signed as settled; T4 signed with the error-text ruling; T5 full profile and the overview trim.

### 2026-11-01 | scope-change | T5: lean-flow's own profile drops both product exemptions, so `.conformance-exempt` joins T5's Layers
What changed: owner ruling at G2 (full profile). `migrate` writes `docs/product/requirements.md` and
`docs/product/acceptance-criteria.md` as pointer-only files that cite `.claude/CONTEXT.md` and `.claude/CLAUDE.md` topic by topic,
so the two reasoned exemptions in `.conformance-exempt` no longer hold and are removed. Impact: T5's Layers gain
`.conformance-exempt`; TASK-561's Done-when text is unchanged. G2 re-confirmed in the same popup.

### 2026-11-01 | progress | T1 and T3 Codex-built, reviewed and merged; T1 box 1 and T3 box 1 ticked
Both built in parallel by `codex exec -s workspace-write` in worktrees at `bab5b4bb`. Neither touched a file outside its list,
and both reported every box honestly (box 2 of each NOT-RUN, as designed). The coordinator verified scope, the census and the
comment-only diff before review, and landed each diff with blob hashes equal to the worktree's (T1 `5588f20d`, T3 `6265614a`).
A process snapshot taken before and after both runs shows no codex or node process left behind (T4's box 3, exec route).
Pilot figures (D2):
- T1: builder check 50.5k Codex tokens; build 72.6k Codex tokens; Claude review 60.8k tokens, 1 Low (CHANGELOG label,
  coordinator-fixed), 1 round.
- T3: builder check 26.7k Codex tokens; build 47.8k Codex tokens; worktree-isolated Claude review 52.9k tokens, 0 findings,
  1 round.
Coordinator tokens are not metered per task.
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped-reviewer · behaviour:material · governance:low
consequence · T3 · behaviour:low · governance:high
review · T3 · scoped-reviewer · behaviour:low · governance:high

### 2026-11-01 | progress | T4 done: Codex launches work on this host; the companion's broker is the leftover; owner rulings recorded
Reproduction: `codex-companion.mjs setup --json` now answers in 3 s (ready, ChatGPT login active), and a companion `task` ran
end to end in 8 s. The earlier hang, more than 2 minutes with no output, no longer reproduces. Cause from the code
(`lib/app-server.mjs`, `lib/codex.mjs`): `getCodexAuthStatus` awaits the app server's `initialize` and auth requests with no
timeout, so an account that could not answer (the owner's lapsed subscription, since renewed) blocked silently. Leftovers: the
companion keeps `app-server-broker.mjs` (with its `codex app-server` tree) alive after a launch, and seven brokers from 10-19 to
today were running; all were stopped with their descendants, and the Codex app daemon and the owner's interactive `codex` were left
alone. `codex exec` leaves nothing behind. Owner rulings by popup: box 1 ticked by ruling (not reproducible, cause named, silent
hang); the standing route is `codex exec` with the prompt on stdin. Owner ruling for T1 box 2 and T2 box 3: the real-init check
runs as the owner's `init` in `D:\Research\clinic-ab` (unprofiled) with `--plugin-dir` at the merged commit, instead of a VPS
snapshot with the installed plugin.
consequence · T4 · behaviour:low · governance:low

### 2026-11-01 | progress | T2 Codex-built, reviewed and merged; TASK-564 boxes 1 and 2 ticked
Built by `codex exec -s workspace-write` in a worktree at `728901f7`; three files, all on its list; landed with equal blob
hashes (`b27727ae`). Pilot figures (D2): build 44.8k Codex tokens (no separate builder check: T2's reader found nothing, 19.1k);
Claude review CLEAN, 0 findings, 1 round. Box 3 waits for the owner's clinic-ab init (owner ruling above).
consequence · T2 · behaviour:material · governance:low
review · T2 · scoped-reviewer · behaviour:material · governance:low

### 2026-11-01 | scope-change | T5: Cites gains `.claude/CONTEXT.md` and `.claude/CLAUDE.md`, the files the pointer-only requirements cite
What changed: the full-profile ruling has `docs/product/requirements.md` and `docs/product/acceptance-criteria.md` cite these two files topic by
topic. T5 reads them and never edits them, so they belong on `Cites:`, not `Layers:`. Found by the VPS gate's scope-change-layers
check at `0f78cb13`. TASK-561's Done-when text is unchanged. Same gate: TASK-564's tick evidence named a contract-file path the
task never touches, now reworded.
