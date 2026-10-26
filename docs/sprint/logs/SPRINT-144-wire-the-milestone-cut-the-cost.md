---
sprint: 144
slug: wire-the-milestone-cut-the-cost
owner: Maintainer
last_updated: 2026-10-26
status: active
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
