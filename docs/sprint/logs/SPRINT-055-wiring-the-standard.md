---
sprint: 055
slug: wiring-the-standard
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-055 — Execution Log

> Append-only companion to [`../SPRINT-055-wiring-the-standard.md`](../SPRINT-055-wiring-the-standard.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | promote | Plan locked at `c4eebef`; G1 + G2 signed at the first `sprint-bulk` pass

Seven tasks, sequential T1→T7 per D1. G1 ran as fast-path (all seven arrived via `/task-decomposer`
approve in the same session and promoted unchanged). G2 signed with one ruling: **A1 resolved —
the CODE_OF_CONDUCT template bases on Contributor Covenant 2.1**, chosen over a hand-written text
because a plugin should not push its own conduct policy onto consumers, and over a link-only stub
because that is not scaffolding. T7's DoD item "A1 ruled on before writing the template" is satisfied
by this entry.

Execution runs **inline on the session model**, not dispatched. ADR-010 would route T1/T2/T5/T7 to
briefed Sonnet subagents; the owner ruled inline for this sprint because the work is cross-file
consistency editing over a shared-file chain that D1 already forbids parallelising — the briefing
cost exceeds the benefit when nothing can run concurrently anyway. Recorded because it is a
deliberate deviation from the dispatch default, not an oversight.

### 2026-08-09 | surprise | pre-dispatch preflight HALTed on the Plan's own declaration gap

Running the preflight before the first task (base ref `0380f47`) returned **HALT** with two named
findings:

```
FAIL shared-file-unowned: scripts/qa-check.sh in T1 and T2 — no Depends-on edge, direct or transitive
FAIL shared-file-unowned: .claude/CONTEXT.md in T5 and T6 — no Depends-on edge, direct or transitive
```

Twelve other shared-file pairs resolved clean, four of them by transitive chain, so the checker was
working — the Plan was wrong. **Cause:** D1 states "strictly sequential T1→T7", but D1 is prose in
§ Decisions and the preflight derives ownership from the `Depends-on:` field. The decision was signed
and then not written where the checker reads. That is the same defect class the whole sprint exists
to fix (T2's §11 row, T6's G1 clause), found in the sprint's own Plan before a line of work was done.

Worth recording for the Retro: the preflight is *not* redundant with D1. A human-readable ownership
decision and a machine-checkable one are different artifacts, and only the second one halts a wave.

### 2026-08-09 | scope-change | two `Depends-on:` edges added to the frozen § Plan

**What broke:** nothing in scope — the ordering was already decided at G2 (D1) and signed. What
changed is the *declaration*: T2 and T6 under-declared their dependencies relative to that decision.

**Impact:** T2 gains `Depends-on: T1` (both touch `scripts/qa-check.sh`; T1 extends the count check,
T2 wires a fixture into the same file, so T1 owns it first). T6 gains `Depends-on: T5` alongside its
existing T4 (both touch `.claude/CONTEXT.md`; T5 may edit § Gates, T6 edits the task entry shape).
Wave ranks shift — T2 0→1, and everything downstream of it by one — but the execution order D1
mandates is unchanged, because D1 forbids parallel dispatch regardless of rank.

**Re-confirm G2:** the owner approved this correction explicitly at the G2 pass, choosing it over
narrowing the `Layers:` declarations (which would have hidden the overlap rather than owning it —
TD-031's pattern of narrowing a guard under no pressure) and over overriding the FAIL.

Logged here **before** § Plan is edited, per the freeze rule.

### 2026-08-09 | scope-change | T1 `Layers:` gains the two files implementation invented

**What broke:** the `layers observed` check FAILed —
`changed but undeclared in any task's Layers:: scripts/lib/check-count-claims.sh`. T1's `Layers:`
named `scripts/qa-check.sh`, because at promote time the plan was "extend the existing checker". It
turned out the count block was inline and bound to this repo's own paths, so it could not be pointed
at a fixture — and a check that cannot be run against input that must FAIL cannot satisfy T1's own
L-058 DoD item. Extracting it to `scripts/lib/check-count-claims.sh` was the enabling means, and
`evals/run-count-claims-fixtures.sh` came with it.

This is **TD-022's shape exactly**: a DoD written at promote cannot name a file invented during
implementation. Leg 15 exists because leg 14's prose-derived source shares an author and a moment
with the Layers line (L-074) and so cannot catch invention — only the observed-diff source can. It
caught this within one task of the sprint starting.

**Impact:** T1 `Layers:` gains `scripts/lib/check-count-claims.sh` and
`evals/run-count-claims-fixtures.sh`. No behaviour change and no new acceptance criterion — the
extraction is refactoring in service of a DoD item already written, not added scope. T1's stated
acceptance ("changing any one count claim out of lockstep makes `qa-check.sh` fail with a named
finding") is unchanged and now demonstrable.

**Re-confirm G2:** D1's sequential order is unaffected — the new files are touched by T1 alone, and
the preflight re-run confirms no new shared-file overlap.

*Also recorded, for the Retro:* the `python` heredoc used for the first attempt at this edit failed
outright (`Python was not found`) while the surrounding `sh` pipeline still printed a full green
count-claims report from the **unmodified** inline block. Read as a self-report it looked like the
edit had landed and passed. The artifact said otherwise. CLAUDE.md Edit-safety trap (c), live.

### 2026-08-09 | scope-change | `Layers:` directory tokens taught to both layers checkers (T1)

**What broke:** T1's fixture set is 24 files. `layers observed` matches whole paths exactly, so the
`evals/fixtures/` token already sitting in T1's `Layers:` matched **nothing** — it read as a
declaration while guarding zero files. Not a new defect introduced by this sprint: any directory
token ever written into a `Layers:` line has been silently inert. T1's fixture tree is simply the
first thing large enough to make it visible.

**Impact:** a `Layers:` token ending in `/` is now a directory prefix in both
`scripts/lib/check-layers-completeness.sh` and `scripts/lib/check-layers-observed.sh`. The two are
kept deliberately identical — they read the same declaration, so a parsing rule that differed
between them would make one of the two lie (the file's own existing comment says so). Covered by a
new fixture, `evals/fixtures/layers-completeness/dir-token-prefix.md`, asserted in **both**
directions: T1's block must PASS (implied paths beneath the declared tree) and T2's must FAIL naming
the path outside it. A prefix rule that swallowed everything would satisfy a PASS-only test.

**Known boundary, recorded not hidden:** the dispatch preflight extracts only dot-bearing tokens
from `Layers:`, so a directory token is invisible to its shared-file overlap check. Declaring a
directory is therefore safe only for a tree ONE task owns; a path two tasks could both touch must
still be named in full. Written into both checkers' comments. This asymmetry deserves a `TD-NNN` at
close — the feature is sound but its blind spot is currently guarded by a comment, not a check.

**Re-confirm G2:** owner ruled explicitly, choosing this over enumerating 24 paths, over excluding
fixture trees in `is_excluded()` (TD-031's narrow-a-guard-under-no-pressure pattern), and over
shrinking the fixture set. T1 `Layers:` additionally gains the two checker files.

### 2026-08-09 | progress | T2 — the §11 epic row executed for the first time, on EPIC-001

**A3 confirmed before wiring:** the §11 row is correct as written — two conditions (every member
sprint closed **and** every § Closed when `[x]`), move → `docs/epic/archive/`, keep the `INDEX.md`
row. No redesign, so no scope-change on that front.

`scripts/lib/check-epic-archive.sh` enforces the row in **both** directions, and the second one is
the reason this task exists: an epic archived without earning it (what §11's text warns about), and
an epic that earned it and never moved (what actually happened). Written against the live repo, the
checker's first run FAILed on `docs/epic/EPIC-001-parallel-worktree-fleet.md` — the real drift,
caught by the guard before the fix. Five fixtures: three must-FAIL (premature · eligible-unarchived ·
archived-with-no-conditions, since "all met" is vacuously true for an epic stating none) and two
must-PASS controls.

**Exercised on real input (L-007):** EPIC-001 moved via `git mv`, its two relative links re-based
`../sprint/archive/` → `../../sprint/archive/` and both verified to resolve, `INDEX.md` row left in
place per §11. The checker now PASSes on the live repo. The move surfaced something T2's DoD did not
anticipate — an archived epic sits one directory deeper, so its relative links break unless re-based.
That is now stated in the `close` procedure, not left for the next person to rediscover.

**§ Plan edit:** T2 `Layers:` gains `scripts/lib/check-epic-archive.sh` and swaps the EPIC-001 path
for the directory token `docs/epic/`, which covers the file on both sides of its own move. Logged
before the edit, per the freeze rule.

**Pattern worth carrying to the Retro:** this is the third `Layers:` correction in two tasks. Every
one had the same cause — a file invented during implementation that a promote-time declaration could
not have named (TD-022). Leg 15 is catching them all, which is the system working, but three in two
tasks suggests the cost is in writing `Layers:` at promote as though implementation were already
known, rather than in the checker.

### 2026-08-09 | surprise | T3's premise was half wrong, and the design got better for it

**A2 confirmed and sharpened.** The trigger is not a judgement call to invent: `status: superseded`
is already a documented frontmatter state, and `templates/RESEARCH.md.template` already instructs
*"Once a decision is built on it, mark `status: superseded` rather than editing it."* The supersede
half of `close`'s sweep line was real all along; only the retention leg was missing.

**The accumulation premise was wrong.** T3 was scoped against "25 research files and no trigger". The
real count is **27, of which 26 are `status: current` and exactly one is `superseded`**. Research docs
are not piling up in a spent state — almost nothing ever reaches one. Owner ruled: ship the retention
leg as scoped and record the fire-rate as a finding rather than re-scoping toward what drives a doc
to `superseded`. Recorded here as that finding.

**Archiving had a consequence nobody had priced.** `gen-index.sh` globs `docs/research/*.md`
non-recursively, so an archived doc would have silently dropped out of `docs/knowledge-index.md` —
and a superseded verdict is usually the WHY-trail for whatever replaced it. Owner chose to keep
archived docs in the index, marked `(archived)`. The generator now includes `research/archive/` and
suffixes the entry.

**The rule's verdict on real input is "don't archive anything."** `behavioral-eval-feasibility.md` is
superseded but still cited by `evals/README.md` and by `graph-engineering.md` (itself `status:
current`), so the conservative gate correctly leaves it in place. A retention rule that moves zero
files today is the right answer, not a gap — which is exactly why both must-PASS controls are
retained alongside the three must-FAIL cases.

**Verified rather than assumed (L-016).** The repo cannot dogfood the gen-index archive path, since
it has no archived research. Exercised directly instead: a temporary archived doc produced
`[temp-index-probe (archived)](research/archive/temp-index-probe.md)` in both the tag and domain
sections, then was removed and the index regenerated to a clean diff.

**§ Plan edit:** T3 `Layers:` gains `scripts/lib/check-research-archive.sh`, `scripts/gen-index.sh`
and `scripts/qa-check.sh`. Fourth `Layers:` correction in three tasks — same TD-022 cause each time.

### 2026-08-09 | progress | T4 — the two halves were not in the same state, and the DoD said what to do

T4's own final DoD item was "split this task instead of forcing it if the two disposal rules
diverge". They did not diverge — but they were not equally missing either, which is a third case the
item did not anticipate.

**The feature PRD already had its rule.** `prd-and-slices.md` line 59 states *"The raw PRD is intake
working material — no durable file of its own"*, and `/task-decomposer` already routes the approved
residue to `docs/product/requirements.md` via `/lean-doc-generator prd`. Nothing to invent. Owner
ruled verify-and-cross-link, so §2's temp-dir note now names it and states why §11 has no row for it.

**The BUG file had two gaps, not one.** §2 listed it as `BUG-<slug>.md` with **no directory prefix**
while every sibling row in that table carries one, and "routed away at `/triage`" described the
*content's* fate, never the file's. Committed, deleted, or archived was simply unanswered.

**The ruling made the failure expressible.** Owner chose temp-dir working material — the same shape as
the feature PRD, `/handoff` docs and council verdicts. That is what turned T4's fixture from vague
("undisposed") into mechanical: a **committed** `BUG-*.md` IS the failure. Before the ruling there was
no state a checker could name. Worth remembering next time a DoD asks for a fixture over an
undefined rule — the fixture was not hard to write, it was impossible until the rule existed.

The `clean` control fixture deliberately contains a `BUG.md.template`: the blank form is a legitimate
committed file that every consumer of this plugin ships, and a checker confusing it with a report
would fail all of them. The glob separates them without needing an exception.

**§ Plan edit:** T4 `Layers:` gains `scripts/lib/check-ephemeral-intake.sh`. Fifth correction, four
tasks.

### 2026-08-09 | scope-change | T4 DoD amendment — "Both mirrored in §11" (owner-ruled)

**The criterion, and why it could not be met as written.** T4's DoD required both artifacts to be
"mirrored in §11". The temp-dir ruling taken earlier in this task dissolved its premise: §11 is the
retention table, retention acts on **committed** files, and neither a `BUG-<slug>.md` report nor the
working feature PRD is ever committed. A §11 row would describe a case that cannot occur.

**Why this was escalated rather than annotated.** Ticking it with a note explaining why the row was
unnecessary would have been a DoD reinterpretation to match what was built — L-088's shape exactly,
and the orchestrator's own red flag against "quietly reinterpreting a DoD that execution
invalidated". The scope held; the *criterion* went stale. That is the case L-088 says must get an
owner ruling before the box is ticked, and in a sprint about rules that stop being enforced, applying
it loosely to our own Plan would have been the wrong place to start.

**Ruling:** amend. Absence from §11 IS the rule. `DOCS_Guide` §2's temp-dir note carries both
artifacts and states explicitly that §11 has no row for them *because* retention acts on committed
files — so a reader who checks the retention table and finds nothing has an answer waiting where they
were sent from, rather than a silence to interpret. DoD item ticked with the amendment recorded here.

### 2026-08-09 | progress | T5 — the awareness audit, and a defect this sprint's own T2 introduced

**Audit (the DoD item, recorded rather than described).** Counting night-run / unattended mentions
per entry point: `orchestrator` 4 · `.claude/CONTEXT.md` 3 · `flow` 2 · `lean-doc-generator` 2 ·
`triage` 1 · **`prime` 0** · **`task-decomposer` 0**. So the two skills a session actually *starts*
at were the two that had never heard of the mode. `/prime`'s `Next:` router now names
`sprint-bulk unattended` when open DoD sit in an active sprint — naming only; priming stays read-only
and launches nothing. `night-run.md` Part 1a step 1 now lists an epic slice beside intent / PRD /
ticket, with `--epic` spelled out.

**A defect T2 introduced, found by T5.** T2 archived EPIC-001 to `docs/epic/archive/`. The
decomposer's epic resolution globs `docs/epic/EPIC-NNN-<slug>.md` only, and its miss branch says *"it
is not an epic yet — offer `/lean-doc-generator epic`"*. So after T2, asking for `--epic EPIC-001`
would advise **opening a new epic for work that is finished**. Not a hypothetical: the glob returns
nothing today. Every archived epic acquires this the moment §11's rule (which T2 made executable for
the first time) runs on it — so T2 handed a live edge to a rule that had never fired before.

Fixed in T5 rather than filed, under "clean up your own mess": resolution now checks `archive/` too,
and a match there reports a **closed** epic, noting that new work toward that outcome opens a new
epic rather than reopening it — which is what EPIC-001's own closing note already says about its
Claude-only boundary. In T5's blast radius because Part 1a step 1 now advertises an epic slice as a
valid night-run input, and that advertisement depends on the resolution being sane.

**Fired end-to-end (L-020) — and exactly which legs were live.** Part 1a steps 2→5 ran *for real this
session*: SPRINT-055 itself went backlog → `/triage`-free promote → G1 + G2 → pre-flight CLEAR, which
is the same path a night-run launcher walks. Step 1's **epic** branch is the new leg, and the repo has
no open epic to slice (T2 archived the only one), so it was exercised directly instead of inferred
(L-016): the closed-epic path resolves to `docs/epic/archive/EPIC-001-parallel-worktree-fleet.md` with
`status: closed`, and a temporary `EPIC-902-probe.md` confirmed the open-epic path resolves and is
decomposable before being removed. Pre-flight re-run after every edit: CLEAR.

**Stated plainly:** `/prime`'s new `Next:` branch was verified **by inspection, not execution**. The
condition it fires on (active sprint, open DoD) is true right now, so running `/prime` would have
exercised it — but `/prime` mid-task is its own documented red flag ("mid-task use signals context
drift"), and firing a probe that the skill itself warns against is not verification worth having.

### 2026-08-09 | progress | T6 — `origin:` gives G1's fast-path clause something to read

**A4 held, and the owner chose the factual form.** The field records **where the task came from**
(`decomposer | close-retro | triage-bug | manual`), not a self-assessed "was it grilled?". Faking it
means misreporting the source, where `grilled: yes` would only mean typing a word. G1 derives
eligibility: `origin: decomposer` fast-paths, every other origin gets the full checklist, and a
**missing** `origin:` is treated as ungrilled rather than assumed fine — the fast-path is the
exception that must be earned.

**Both filers stamp.** `close`'s follow-up bucket writes `origin: close-retro`; `/triage` bug intake
writes `origin: triage-bug`; `/task-decomposer` writes `origin: decomposer` as part of its entry
shape. Those are the two paths that reach G1 without a grill, which is the whole hole.

**Split honestly between the two halves.** `check-task-origin.sh` is the *mechanical* half — no task
reaches G1 unstamped. G1's clause is the *procedural* half — what to do once the origin is known.
Only the first is checkable, and the fixture header says so rather than letting the suite imply it
verifies G1's behaviour. The `stamped` control deliberately includes a `triage-bug` entry that PASSes
the checker while still being denied the fast-path: the checker guards the field, not the decision.

**It failed on the live repo first, again.** All seven Backlog entries were unstamped, so the checker
reported seven FAILs before any of them were fixed. They came from `/task-decomposer` in this session,
so all seven are `decomposer` — but the point is that the state existed and nothing had ever been able
to name it.

**Cap watched, as the DoD required.** `.claude/CONTEXT.md` went 124 → **126 of 130** (ADR-007). Inside
cap, so no split; the DoD's "at cap, split rather than squeeze" branch did not fire. Recorded because
"it fit" is only meaningful next to the number.

**§ Plan edit:** T6 `Layers:` gains `scripts/lib/check-task-origin.sh`. Sixth correction, five tasks —
the count is now the sprint's clearest Retro candidate.

### 2026-08-09 | surprise | leg 15's two exclusion lists disagree, and the gap hides a violation until it is committed

Found during T7. `check-layers-observed.sh` runs two paths with **two different exclusion lists**:
`is_excluded()` for uncommitted WIP and `is_excluded_committed()` for history. `TODO.md` is on the
first and not the second.

T6 stamped `origin:` onto seven `TODO.md` Backlog entries — task work, not close bookkeeping — and
never declared `TODO.md` in its `Layers:`. While the edit sat uncommitted, the WIP path skipped it and
T6's gate ran green. Committing moved it onto the attributed path, where it surfaced as
`changed by a task that never declared it: T6:TODO.md` — reported against a task that was already
finished and pushed.

**The rationale behind the WIP exclusion is sound but too broad.** `TODO.md` is excluded there as
"backlog bookkeeping, written at close", and at close that is exactly right. It is wrong for a task
whose actual work is editing `TODO.md`, and T6 was one. The two lists diverging means the same file
can be simultaneously fine to leave undeclared and a violation, depending only on whether `git commit`
has run yet.

Corrected the honest way: T6's `Layers:` now declares `TODO.md`, since T6 genuinely edited it. Not
fixed here: the exclusion-list asymmetry itself. That is a checker design question, it touches a
guard shipped three sprints ago, and narrowing or widening either list on the strength of one
observation is TD-031's pattern. **Filed for the Retro as a TD candidate**, with this as the recorded
instance — a gate whose verdict depends on commit timing rather than on the artifact is the same
family as Edit-safety trap (c).

### 2026-08-09 | complete | T7 — CODE_OF_CONDUCT admitted to the standard; all seven DoD blocks closed

Contributor Covenant 2.1 (A1, ruled at G2), adapted with `[CUSTOMIZE]` tokens and the CC BY 4.0
attribution block intact — attribution is the licence condition, not decoration. §2 gates it exactly
as `CONTRIBUTING.md` is gated: **team ≥ 2, or on request**.

**One judgement written into both the template and `init`:** the enforcement contact is the only
load-bearing token. A code of conduct nobody can report to is decoration, so `init` is told not to
scaffold the file at all if the user cannot name a real monitored address. Shipping a CoC with an
unfilled contact would be worse than shipping none — it advertises a process that does not exist.

**lean-flow takes the exemption, and the distinction is the point.** Shipping the template is not the
same as owing the file: `init` scaffolds it for a consumer who has met the condition, while this repo
has one maintainer, no request, and nobody to route a report to. That reasoning is now a row in
`overview.md` § "Base-tier docs this repo deliberately does not have", beside CONTRIBUTING's, so a
future reader (or `init` run) can tell a deliberate absence from an oversight.

**T1's guard proved itself here, in the right order.** Adding the 33rd template made all six count
claims wrong at once, and the check went red on every one — `.claude/CLAUDE.md`, `overview.md` and
`README.md` × core and total — before the numbers were touched. Red first, then green. That is the
demonstration TASK-166 was filed for: the drift it was written about could not have recurred silently.

`.claude/CLAUDE.md` sits at exactly **80/80**. Not a problem today and not squeezed, but the next edit
to it has no room and must split rather than compress (§7 — a cap moves only by ADR, diet first).
