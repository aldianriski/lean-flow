---
sprint: 069
slug: first-extraction
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-069 — Execution Log

> Append-only companion to [`../SPRINT-069-first-extraction.md`](../SPRINT-069-first-extraction.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | scope-change | Plan amended pre-execution: three Depends-on edges added so the preflight can read D3's ownership ruling

**What broke.** The batch-G2 pre-dispatch preflight HALTed on **7 findings** before any task started,
run against `docs/sprint/SPRINT-069-first-extraction.md` at declared base `b53b8e2` (== live HEAD):

- `docs/epic/EPIC-003-the-standard.md` shared by **T1 and T2** with no `Depends-on` edge, direct or
  transitive.
- T3's directory-level `Layers:` (`docs/` · `scripts/lib/` · `evals/`) subsuming **T1**'s three
  specific doc paths (3 findings) and **T4**'s two checkers plus `evals/` (3 findings), no edge in
  either case.

The first is the load-bearing one. **§ Decisions D3 already ruled that ownership** — *"T1 owns the
file and commits first"* — so the decision was made, correctly, at promote. It was written as prose
in § Decisions, and the preflight derives ownership from `Depends-on:` edges, which is the one place
it was not written. **L-099's shape exactly: a rule placed where its checker cannot read it** — and
it was authored in the same session that re-reviewed TD-051, whose whole subject is a guard that
cannot see what it guards. Prose ruling, machine-read field, no bridge between them.

**Impact.** Nothing built yet, so the cost is this entry plus a two-line Plan edit — the cheapest
point in the sprint at which this could surface, and the reason the preflight runs before the first
dispatch rather than after the first merge. Had it been overridden instead, T1 and T2 could have been
dispatched in parallel against one epic file, which is SPRINT-041's corruption shape.

**The amendment** (owner-approved 2026-08-16, before § Plan was touched):

- **T2** `Depends-on: none` → `Depends-on: T1` — makes D3's prose ruling machine-readable; T1 commits
  the epic file first, T2 follows.
- **T3** `Depends-on: T2` → `Depends-on: T2 · T4` — makes "T3 runs last" explicit rather than implied.
  T3's `Layers:` are deliberately directory-level (its file set is re-derived at execution, since a
  path list written at promote goes stale before an AFK task is picked up), so the honest fix is an
  ordering edge, not a narrower declaration that would contradict the task's own design.

**Re-confirm G2.** Scope is unchanged — no task gained, lost or altered a DoD line, an acceptance
criterion or a file. What changed is execution *order*, from three parallel waves to two plus a
sequential tail. Batch G1 was signed before this entry (2026-08-16, all five tasks); G2 is signed
against the amended Plan, with the preflight re-run to CLEAR as its evidence.

### 2026-08-16 | progress | T1 — conformance levels ruled: Structural → Gated → Attested (ADR-024)

Ruled inline by the coordinator (`class: decision`; rulings are the coordination tier's job,
ADR-010), owner-decided by popup. Three levels, each checkable from a **different evidence class** —
the file tree, the planning records, git history alone — which is what makes them independently
checkable rather than three degrees of one measurement.

The deciding evidence was where the reference implementation actually sits: lean-flow records
`gates_signed: G1,G2 @ <sha>` but cannot yet emit ADR-018's per-task commit trailers (EPIC-003 D2,
"ADR pending"), so it falls strictly between having the structure and being provable from a clone.
A two-level ladder would have left the standard's own first conformant implementation at the bottom
rung. lean-flow is **Gated**, deliberately not the top.

Filed: ADR-024 · DECISIONS row · EPIC-003 open question 1 struck through · index regenerated.
3 of 3 DoD ticked.

### 2026-08-16 | surprise | TD-053 leg 1 fired for real — the gate walked into a live worktree

The full gate, run to verify T1, returned **150 pass / 1 fail**:

`FAIL ephemeral-intake: .claude/worktrees/agent-<id>/evals/fixtures/ephemeral-intake/committed-bug/
docs/BUG-stale-pointer.md is a committed BUG report`

That path is a **retained must-FAIL fixture inside T4's dispatched worktree**, reported as a live
violation — TD-053 leg 1 exactly as its row describes: `check-ephemeral-intake.sh` excludes fixture
trees with `grep -v '^evals/fixtures/'`, correctly position-anchored per L-108, and the nested repo
copy defeats the `^` anchor.

**Why this matters beyond the false positive.** This morning's promote review re-reviewed TD-053 and
recorded leg 1 as *"untested, not clean — no full gate run is recorded while a worktree existed, so
its silence is absence of evidence and nothing else"*, with the unblock condition *"a gate run
observed against a live worktree"*. That condition was met the same day, by ordinary work rather
than by a scheduled experiment — the vehicle was T4's dispatch, and the observation came free.

No action taken mid-sprint: the row's own mitigation text routes the cure to EPIC-004's engine
question and warns against a one-checker fix to a family-shaped defect (L-091). The TD-053 row gets
this sighting at close, where TD updates belong; editing `TECH-DEBT.md` now would be an undeclared
touch during execution, which is the phase split TD-044 exists to enforce.

### 2026-08-16 | progress | T5 — .claude/worktrees/ ignored; TD-053 leg 2 closed

One line, verified against a **real dispatched worktree** rather than a `mkdir`'d stand-in — which
is what the DoD demanded and why T5 was sequenced to run while T4's worktree was live. Before:
`?? .claude/worktrees/`, meaning a plain `git add -A` at that moment would have staged a full second
copy of the repo. After: `check-ignore` resolves to `.gitignore:16`, status shows only the file
itself.

Scoped to leg 2 only, and the `.gitignore` comment says so — the obvious inference from "worktrees
are ignored now" is that the walking problem is solved too, and it is not: `find` walks the
filesystem, not the index. The surprise entry above is that same distinction observed live, minutes
apart. 3 of 3 DoD ticked.

### 2026-08-16 | progress | T4 — both Layers-family checkers guarded against bare invocation

Dispatched builder (worktree, base **622f420** — stale, see the next entry; merged `2654d31`).
TD-056's per-checker cure shipped: a `note()` helper plus `[ "$#" -gt 0 ] || { note "…nothing
verified"; exit 0; }` in `check-layers-completeness.sh` and `check-layers-observed.sh`, matching
`check-gates-signed.sh`'s note-line shape exactly (the builder read that sibling first, as briefed).
One must-note leg per harness, both wired and firing in-gate.

Guard proof run and reported: with the guard commented out the leg goes RED with its named finding,
restored → green. A fixture never seen to fail is not a proof (L-058).

Coordinator re-verified in the **integrated** tree rather than accepting the builder's report
(L-057): both checkers bare print their note at exit 0, and both harnesses are all-green *including*
SPRINT-068's close-time case 4e, which the builder's base did not contain. 3 of 3 DoD ticked.

### 2026-08-16 | surprise | TD-054 reproduced — every dispatched worktree branches from one stale sha

**Second sighting, and it makes the mechanism visible for the first time.**

Both of this sprint's worktrees — T4's and T2's — branched from **`622f420`**, which is 13 commits
behind the dispatching session's HEAD. `622f420` is not an arbitrary point: it is SPRINT-068's
`record plan_commit sha` commit, and the same sha *SPRINT-068's two builders used*. So across two
sprints and four worktrees, every dispatch has branched from the identical commit — which was
current during SPRINT-068 and is stale now.

That is not drift. It is a **pin**, and it answers the question TD-054 has been held open on since
SPRINT-063: *why* did a worktree branch three sprints behind a current session. The row's mitigation
text forbids writing a guard before the cause is understood; a systematic pin is a cause, where "it
was stale once" was not.

**What it cost here, concretely:**
- T4's base lacked SPRINT-068's close-time work on two of the four files it edited —
  `check-layers-observed.sh` (+13 lines: the `docs/changelog/*` exclusion) and
  `run-layers-observed-fixtures.sh` (+55 lines: case 4e). The three-way merge over `622f420`
  preserved both sides because the edits sat in different regions, and the coordinator verified the
  union rather than assuming it. Had either side rewritten a shared region, this merge would have
  silently reverted a guard shipped the day before.
- T4's own reported gate FAIL was an artifact of the same pin: its worktree had no
  `SPRINT-069-first-extraction.md`, so leg 15 checked its commit against SPRINT-068's Plan and
  correctly found the files undeclared there. The builder diagnosed this itself, proved it identical
  with pre-change code, and did **not** work around it — exactly the right call, and the reason it
  surfaced as a flag rather than as a mystery.
- **T2 is worse and is still running:** its base predates T1, so the epic file it edits does not
  contain ADR-024. The `Depends-on: T1` edge that this morning's preflight HALT existed to enforce
  is void in the builder's tree — the ordering it guarantees is real only if the second task can
  *see* the first task's output.

No fix attempted mid-sprint: the cure is a dispatch-protocol change, which is nobody's task here.
Filed to TD-054 at close with this entry as its evidence.

### 2026-08-16 | progress | T2 — spec/STANDARD.md v0.1.0 extracted; the standard is now a separable artifact

Dispatched builder (worktree, base **622f420** — stale, TD-054; merged `6a69a8b` with one conflict,
resolved). `git mv` of the standard out of `skills/lean-doc-generator/references/` into
`spec/STANDARD.md`, content verbatim, plus an ownership header carrying `version: 0.1.0` and a new
`spec/CHANGELOG.md`. 12 path references repointed in the same commit; `check-doc-caps.sh`'s default
followed in one line; CLAUDE.md's Self-contained principle now says the skill *cites* the standard
rather than bundling it. **EPIC-003's first Closed-when condition is now materially met.**

**Nothing is stated twice** (ADR-023's per-sprint review check, asked and answered): `git mv` leaves
no content at the old path, so there is no old home left to restate from. Five references to the old
path survive and every one is a citation, not a copy — ADR-018 (append-only), `loop-hygiene-prd.md`
(frozen/superseded), `platform-readiness-audit.md` (its F3 evidence, flagged by the builder as a
judgment call), this Plan's own T2 `Layers:` line, and `spec/CHANGELOG.md`'s deliberate note of where
the document used to live. Coordinator re-derived that set independently rather than accepting the
builder's count (L-097).

**Two declaration corrections, per L-100 — declared, not defended:**
- **T2 `Layers:` += `SECURITY.md` · `docs/LEARNINGS.md`.** Both carried genuinely broken path
  references and neither was in the Plan's Layers text, because a declaration written at promote
  cannot name what a repo-wide search finds at execution. The builder fixed them anyway (correctly,
  per DoD 2's "every path reference") and flagged the gap rather than editing the Plan itself.
- **T5 `Cites:` += `T4`.** T5's own DoD evidence line names T4's worktree as the live subject it
  verified against, and `check-layers-completeness.sh` reads that prose. Cited, not depended on.

**The merge conflict is worth recording, because the stale base made it.** T2 rewrote the epic's
"Why this, why now" paragraph to describe the post-move state — and carried the **450**-line figure
forward, because its base predated the promote where that figure was re-measured to 489. Resolving by
picking either side would have shipped a wrong number: the true count is now **497**, the move having
added the ownership header the standard never had. So this paragraph has been wrong twice in two
days, both times by a figure being remembered rather than measured — L-097 demonstrated on itself.
The resolution states 497 and carries a comment telling the next editor to re-measure.

### 2026-08-16 | progress | worktrees removed; TD-053 leg 1's two false positives cleared with them

Both merged worktrees removed. The gate had been reporting two `ephemeral-intake` FAILs — one per
live worktree — which is leg 1 scaling with the number of concurrent agents, a detail the row did not
anticipate. Post-removal the gate is **151 pass / 0 fail**.

### 2026-08-16 | scope-change | T3's DoD named three exclusions; the repo freezes nine — exclusion clause amended, owner-ruled

**What broke.** T3's DoD reads *"no live surface cites the standard by its pre-extraction document
name"*, with an exclusion line naming **archived sprints · rotated changelogs · the generated index**.
Re-deriving the citation set at execution (as DoD 1 requires) produced **140 live mentions**, and
splitting them showed the exclusion list is incomplete by six categories:

| Frozen surface | Sites | The rule that freezes it |
|---|---|---|
| `docs/adr/` — 10 accepted ADRs | 14 | append-only; "never edit a decided ADR" (§4) |
| `docs/LEARNINGS.md` past entries | 10 | "never edit a past entry except to bump seen/count or set promoted" (§11) |
| `loop-hygiene-{prd,findings,workstreams}` | 9 | `status: superseded` ⇒ FROZEN (ADR-020) |
| `TECH-DEBT.md` past rows | 3 | the audit trail; rows are corrected by appending |
| this sprint's own Plan + Execution Log | 4 | Plan frozen at promote; Log append-only |
| `spec/CHANGELOG.md` · `sprint/INDEX.md` · a fixture | 2 | deliberate historical citation; fixture data |

**42 frozen + 98 sweepable = 140**, reconciled against the live total.

Taken literally the criterion is **unsatisfiable**: meeting it would require editing ten accepted
ADRs and rewriting past learning entries — breaking three standing rules to satisfy the wording of
one. This is L-088's shape with the fault at authoring rather than at drift: the scope was always
right, the criterion was incomplete the moment it was written, because "live" was assumed to mean
"not archived" when this repo also freezes append-only, superseded, and frozen-at-promote artifacts.

**Impact.** None on scope — the 98 sweepable sites are exactly the consumer-facing surface T3 exists
to fix (skills · templates · scripts · harness comments · README/AGENTS/SECURITY/CONTEXT/overview).
What changes is the criterion's exclusion clause, from three named categories to nine.

**Ruling (owner, 2026-08-16):** sweep the 98; record the 42 as explicitly out of scope, per class,
with the rule that freezes each. DoD amended before execution, not reinterpreted after it — the red
flag this avoids is re-reading a DoD's words to fit what was built.

**Re-confirm G2.** No task gained or lost work; T3's `Layers:` are unchanged. One checked detail that
could have gone wrong: `run-epic-archive-fixtures.sh`'s mention of the old name is a **comment**, not
an assertion, so sweeping it cannot break a fixture that greps its own token (L-108) — verified by
reading the line, not assumed from the filename.

### 2026-08-16 | progress | T3 — 86 citation sites swept to the new name; two reverted after the sweep made them false

Run **inline** by the coordinator, not dispatched — an owner-ruled deviation from the G2 dispatch
plan, forced by TD-054: a worktree branching from the stale pin would contain no `spec/` at all, so
the builder would have swept a tree where T2's move never happened. Wrong work, not merely a merge
hazard. Logged here because a deviation from a signed gate is not the coordinator's to make silently.

**Reconciliation, both directions.** Before: live 140 + history 276 = 416. After: live 54 + history
276 = 330. **86 swept** = 88 sweepable − 2 reverted. The Plan's estimate of 128 was never used — DoD 1
requires re-derivation, and the real number was 140.

**The sweep damaged two files, and the reconciliation is not what caught it — reading the diff was.**
A mechanical token replacement over a corpus that *documents its own history* rewrites history into
falsehood, and both cases were exactly that:
- `docs/research/platform-readiness-audit.md` — its F3 finding records the pre-move state, and the
  sweep turned it into `skills/lean-doc-generator/references/STANDARD.md — 450 lines`, **a path that
  has never existed at any point in this repo's history**. T2's builder had flagged this same file as
  a judgment call and left it alone; the coordinator swept it and made it wrong.
- `docs/research/logs/qa-gate-timing.md` — a measurement log, `append-only` by its §2 row. Editing a
  past entry there is the same violation as editing a past LEARNINGS entry; it belonged in the frozen
  set and the classification missed it.

Both reverted. This is L-108's family one level up: the rule says a *matcher* must be anchored by
shape because a self-describing corpus contains prose about its own formats — the same property makes
a self-describing corpus unsafe to *edit* by token, because some of its sentences are assertions about
the past that only stay true if left alone. The classification that drives a sweep needs a
"describes history" axis, not only a "frozen by rule" axis.

**L-009 discharged mechanically, not by eyeballing 54 files:** `git diff --numstat` shows added ==
deleted for every swept file. A fused table row or dropped list entry changes that balance, so equality
across all 54 is positive evidence rather than an absence of noticed problems.

**Third `Layers:` correction this sprint (L-100):** T3 gained `AGENTS.md` and `scripts/qa-check.sh` —
the sweep reaches root files and the gate script's own comments, which a directory-level declaration
written at promote does not cover. T2 gained two, T5's `Cites:` gained one. Three corrections across
five tasks is a rate worth a Retro line, not a shrug.

3 of 3 DoD ticked. Gate 151 pass / 0 fail.
