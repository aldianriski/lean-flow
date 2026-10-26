---
sprint: 144
slug: wire-the-milestone-cut-the-cost
owner: Maintainer
last_updated: 2026-10-26
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-144 — Execution Log

> Append-only companion to [`../SPRINT-144-wire-the-milestone-cut-the-cost.md`](../SPRINT-144-wire-the-milestone-cut-the-cost.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-26 | promote | plan locked, governance signed, five members: wire the milestone, cut the cost
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due, applied at this promote by owner ruling. L-251 (run every check that reads a touched shipped
  file before ticking) at count 2 → promoted into LEARNINGS § Durable rules › edit-safety, disposition move-to-reference:
  the check set includes gate legs (prose density, doc caps), not only `evals/` harnesses, and each runs as itself.
  Census after: 14 active + 220 promoted + 1 superseded = 235, equal to the heading count.
- ☑ TD aging: 101 of 104 open rows aged against sprint 144. Second route, by severity: 57 + 18 + 24 + 5 = 104. Newly aged:
  TD-275. Young: TD-276, 277, 278. None is `high`.
- ☑ doc-aging, §11 (owner-approved): TASK-510 (SPRINT-141, closed 3 sprints ago) pruned. No live `.md` citation by two
  routes (tracked-file grep with the §11 history paths filtered out, and ripgrep over the working tree); the TASK-473
  control hits `spec/CHANGELOG.md` on both. TASK-509 kept: cited in `evals/fixtures/count-claims/security-drift/NOTES.md`.
  No TD deletion is due (no resolved rows), no CHANGELOG rotation (no new minor), no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` prints no FAIL line; `.claude/CLAUDE.md` 79/80, `.claude/CONTEXT.md` and
  `docs/architecture/overview.md` 149/150; the token budget reads ~12691 of 12691.
- ☑ epic rollup currency and epic coverage: no active epic. ☑ roadmap: none. ☑ handoff ledger: none.
Intake: after SPRINT-143's close, `/triage` readied TASK-520 (TASK-516 done) at P2 and TD-278 became TASK-524 (owner
rulings: inline path for commit messages; PR bodies unchanged). The owner chose all five ready tasks. Size check: five S,
no `L`. All are `origin: decomposer`. No epic.

### 2026-10-26 | gate | G1 + G2 signed by the owner by popup; five builder checks settled; three owner rulings
G1: all five members are `origin: decomposer`; the owner confirmed scope unchanged since `approve` (fast-path). G2:
`CHANGELOG.md` is shared by all five, owned in T order (D1). Dispatch preflight CLEAR (T1=0 … T5=4, base-ref = HEAD
`f93bcdef`); sequential in the main tree. Each task changes a shipped file, so each takes the Codex loop, cap 2 rounds (D2,
the owner chose full D2 over a T1+T2-only option).
Owner rulings:
- **R1 (A1, T1):** "the next sprint's commit messages" means the commits after T1 lands, T2 to T5 and close included.
  TASK-524 waits in `review/` until then; box 3 ticks and TD-278 resolves inside this sprint.
- **R2 (T2 target):** the exercise runs in `D:\Research\workdoo` on `--roadmap P3`. Its `requirements.md` has no First
  milestone, so one is added to the research copy (snapshot, then revert) with the proof goal the owner accepted: "an
  internal project and a company-wide work row can be created with an owner and a dependency, and a dependency cycle is
  refused". Stopping condition and boundary keep their placeholders.
- **R3:** A2 and A3 confirmed. A3 by reading: S4.SECTIONS matches only the Status and Deciders bullets plus four `## `
  headings, so a new header bullet cannot change its verdict.
Settled facts and design fixes (coordinator, from the builder checks):
- T1: a new § Inline path in `embedded.md` (catalogs read once per session, again after a compaction; fact list and check
  kept; no status line); § Commit messages and PR bodies gains a Route bullet; the fallback stays for documents and PR
  bodies on a runtime with no sub-agent; a worktree builder is its own session. Box 2: three headless runs on the retained
  sample, format `markdown` as in the fixture's recorded runs, judged from each transcript. Box 3 is measured, not
  estimated: catalog tokens once plus the pass's output tokens, amortized over this sprint's inline commits, with the
  change rate TD-278's fix direction asks for. "No child spawned" is a judgment tick resting on this Log, since git
  cannot show a dispatch. `fact-keep/NOTES.md` gains the inline recipe and runs; `humanizer/SKILL.md`'s summary names the
  inline route (scope-change below).
- T2: the rule sits in step 4, where the risk scores exist, and orders ready slices only; when the proof slice is not
  ready, the ready slice that unblocks it goes first. `--roadmap` input skips the grill, so a headless run reaches the
  breakdown.
- T3: the line goes after `Context driver`. The S4 run places the example at `docs/adr/` in a scratch repo, with an
  unedited-example control.
- T4: the comment above the table is one line; the cap check is `wc -l` against §2's 100, since `check-doc-caps` does not
  scan templates. T5: the enforcement sentence copies the Done-when and drops "on every request".
- T4 and T5 readers found no `[Unreleased]` block: T1 creates it, shaped as SPRINT-143's `25a0a55b`. No checker parses
  any touched section (grep over `scripts/`, `evals/`, `test/`, `conformance.sh`: zero hits).
Deviation: commit messages from this entry on take the inline pass now (catalogs read once), per the owner's intake ruling
that T1 codifies; the current text would send each to a child.
builder-check · T1 · 3 contradictions · 5 questions · box 3 measured not estimated; worktree builder = own session; NOTES + SKILL.md by scope-change; A1 by ruling R1
builder-check · T2 · 2 contradictions · 3 questions · rule in step 4, ready slices only; `--roadmap` skips the grill; target by ruling R2
builder-check · T3 · 0 contradictions · 2 questions · placement after Context driver; qa-check covers other readers
builder-check · T4 · 1 contradictions · 4 questions · Unreleased created by T1; one-line comment; no parser of the section
builder-check · T5 · 1 contradictions · 4 questions · Unreleased created by T1; sentence copies the Done-when

### 2026-10-26 | scope-change | T1 adds skills/humanizer/SKILL.md and evals/fixtures/humanizer/fact-keep/NOTES.md to its Layers
What broke: `skills/humanizer/SKILL.md` § Embedded says the pass "runs in a child sub-agent (inline fallback)", which
T1 makes untrue for commit messages; and `evals/fixtures/humanizer/fact-keep/NOTES.md` defines the run recipe as the
child brief, so box 2's inline runs would leave it stale. Neither file was in T1's `Layers:`. Impact: both join T1's
`Layers:`; no Done-when changes. G2 confirmed by the owner in the same popup.

### 2026-10-26 | progress | T1 built: commit messages humanized inline; boxes 1, 2 and 4 ticked, box 3 waits on the later commits (TASK-524)
Built inline by the coordinator, not dispatched: small prose edits in two files it had already read, where a dispatch
would re-pay ~50k of substrate for a few lines. Commits `9ece808f` (the change), `f3ead434` (fixture NOTES), `7c3da633`
(round-1 fix). Checks that read the touched files: prose-density (no FAIL), layout harness, doc caps; the full gate on
`d9c05e66` ran remotely, 316 pass, 0 fail.
Box 2: three headless inline runs against an export of `9ece808f`, prompt assembled verbatim from `embedded.md`. All three
kept 11 of 11 facts and returned no fact list. Run 1 added a rollout actor ("Finance Ops rolled out"); the coordinator's
first read missed it and Codex caught it. Owner ruling at the T1 box 2 popup: box 2 ticks on its words ("keeps every
fact"); the addition is the pass's own variance (same item-4 instructions as the child) and is recorded under TD-274.
Measured cost: each run read the catalogs once at 20,028 to 22,342 tokens of new context and spent 1,454 to 1,857 output
tokens on the pass; the whole fresh-session run came to about 77k tokens, roughly the child's ~73k, so the saving comes
from paying the catalogs once per session, not from a cheaper single pass.
Humanizer route so far: `d9c05e66`, `9ece808f`, `f3ead434` and `7c3da633` took the inline pass with no child (catalogs
read once at the gate entry); the pass changed 0 of 4 drafts. Fixed-template moves skip.
consequence · T1 · behaviour:material · governance:high
review · T1 · codex · behaviour:CLEAR · governance:CLEAR
Codex R1 NOT CLEAR on item 3 only (run 1's added actor), items 1, 2 and 4 CLEAR; fix `7c3da633`; R2 CLEAR.

### 2026-10-26 | progress | T2 done: the decomposer lists the riskiest ready slice first, reading the proof goal (TASK-520)
Built inline by the coordinator (three prose lines in one skill and one template comment it had already read). Commit
`84c901c9`; `skills/task-decomposer/SKILL.md` 133/140. A first draft packed the rule into one line and reddened the
prose-density ratchet (4 dense lines, baseline 3); split into three lines before commit, then 3/3.
Box 2 exercise (owner ruling R2): `D:\Research\workdoo` snapshotted (3,781 file hashes, `node_modules`, `dist` and
`.env*` excluded), the owner's proof goal added to its `requirements.md` § First milestone, then a headless
`/lean-flow:task-decomposer --roadmap P3` in plan mode with the plugin pinned to an export of `84c901c9`. It found most
of P3 already delivered (TASK-051/052) and proposed three ready slices, all `depends-on: none`; it listed TASK-088 (the
two-browser proof of project, work, owner, dependency and refused cycle) first "because it proves the proof goal
directly", citing the goal and noting it came from an uncommitted edit. Nothing was written to `docs/work/`. Afterwards
`requirements.md` was restored and all 3,781 hashes match; the plan file the run left in `~/.claude/plans` was removed.
The absent-goal branch was not exercised (the Done-when asks for one decomposition).
consequence · T2 · behaviour:material · governance:low
review · T2 · codex · behaviour:CLEAR · governance:CLEAR
Codex R1 CLEAR on all four items (rule vs Done-when, exercise, template claim, CHANGELOG).

### 2026-10-26 | progress | T3 done: the ADR template carries an optional Revisit when line (TASK-515)
Built inline by the coordinator (one template line and one example line). Commit `12fad813`. Box 3: the edited example
and an unedited control, each placed at `docs/adr/ADR-001-migrate-orm-to-drizzle.md` in a scratch repo with a
`docs/DECISIONS.md` row, run through `sh conformance.sh`: S4.ONEFILE, S4.INDEX, S4.SECTIONS and S4.NEGATIVE PASS on both;
S4.APPEND reports history unavailable (no git) on both; BAR and NOINVENT are judgment-only. The ADR-family fixtures are
all green; prose-density no FAIL.
consequence · T3 · behaviour:material · governance:low
review · T3 · codex · behaviour:CLEAR · governance:CLEAR
Codex R1 NOT CLEAR on item 2 only because the review input omitted the example's body; R2 with the full example CLEAR.

### 2026-10-26 | progress | T4 and T5 done: flow steps name their owners; the role table records data scope (TASK-517, TASK-518)
Both built inline by the coordinator (a few template lines each). T4 `457e07a2`: § Steps that matter becomes a table of
step, record changed, owner and next owner, with a one-line comment (roles, never names); the file was re-read after the
edit and both tables stand apart; 49 lines against §2's 100 for `flows/<slug>.md` (`wc -l`; `check-doc-caps` does not scan
templates). T5 `507bd917`: a Data scope column (header, separator and both rows widened) and the enforcement line copied
from the Done-when. prose-density no FAIL for either. Reviewed together in one Codex call with a verdict per task.
consequence · T4 · behaviour:material · governance:low
review · T4 · codex · behaviour:CLEAR · governance:CLEAR
consequence · T5 · behaviour:material · governance:low
review · T5 · codex · behaviour:CLEAR · governance:CLEAR
Codex R1 CLEAR on all six items (three per task).

### 2026-10-26 | progress | T1 done: box 3 ticked and TD-278 resolved with the measured cost (TASK-524)
Under ruling R1, box 3 counts the commits after T1. From `d9c05e66` to `6e241add`, 18 free-prose commit messages took
the inline pass and none started a humanizer child (this Log is the record; git cannot show a dispatch); 11
fixed-template moves skipped it. Cost per commit, measured in the box 2 runs: catalogs 20,028 to 22,342 tokens once per
session plus 1,454 to 1,857 output tokens per pass, about 3.1k per commit over 18 against the ~73k child baseline. The
pass changed 0 of 18 drafts, all written with the catalogs loaded. TD-278 resolved in `6e241add`. The close commits
also take the inline pass. A joint T4/T5 tick commit was split per task before anything else landed, so each commit's
files sit inside one task's `Layers:`.

### 2026-10-26 | scope-change | T1 and T4 add their review/ member paths to Layers (system-verify finding)
What broke: system verify on `e36eca1d` (gate-remote, QA_FULL) FAILed `layers observed`: T1's box 3 tick commit edited
`docs/work/review/TASK-524-humanize-commit-messages-inline-once-per-session.md` and T4's tick commit edited
`docs/work/review/TASK-517-record-the-owner-and-next-owner-of-each-step-in-the-flows-template.md`, and neither task's
`Layers:` named a review path; both declared only the todo, in_progress and done paths. Impact: each path joins its
task's `Layers:`; no Done-when changes; the gate re-runs before close.
system-verify · FAIL(layers-observed: T1 and T4 review/ member paths undeclared) · e36eca1d · 316 pass, 1 fail
owner-ruling: system-verify — fixed-and-rerun: the T1 and T4 review/ member paths were declared by scope-change (bbf74f98); the rerun printed 317 pass, 0 fail
system-verify · PASS · bbf74f98 · 317 pass, 0 fail (gate-remote QA_FULL; the first attempt lost ssh mid-run, the remote run was read back and finished rc 0, not retried)

### 2026-10-26 | close | 5 of 5 delivered, 17 of 17 DoD; system verify 317/0 on the VPS after one fixed FAIL; Retro and buckets filed
Every member sits in `docs/work/done/` (close check 12/0, freeze held on all five). System verify: `gate-remote` FAILed
`layers observed` on `e36eca1d`, fixed by scope-change, PASS on `bbf74f98` with `QA-CHECK: 317 pass, 0 fail`, remote rc 0
(owner ruling: fixed-and-rerun). No handoff entry was ever logged, so nothing needs reconciling. No epic.
Buckets auto-filed: L-257 (count 2), L-258, L-259; no new TD (TD-278 resolved, TD-274 sighting, the gate overrun is
TD-117's); no follow-ups; CHANGELOG `[Unreleased]` already carries T1–T5. Owner-approved by popup: the §11 archival pass,
the doc-freshness fix to the humanizer rows in `.claude/CONTEXT.md` and `README.md` (commit messages now inline; the
token budget holds at ~12688 of 12691), the v2.16.x CHANGELOG rotation, and a MINOR release to 2.18.0 by hand (feature
sprint), no push.
