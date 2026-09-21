---
epic: 017
slug: work-items-that-fit
owner: Maintainer
last_updated: 2026-09-21
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-017 — Work Items That Do Not Outgrow Their File

> **Outcome:** decomposing an outcome of any size never hits a length limit, because no single file
> accumulates the work — status, title and membership each live in exactly one place, the board is
> derived rather than stored, and the rule against compressing a file to meet its cap becomes
> **enforced** rather than merely written.

## Why this, why now

The root cause is not a missing rule. **The rule exists and is unenforced, while the metric beside
it is enforced — so the metric wins.**

`spec/STANDARD.md` §157 already says: *"cap-hit → **split, never squeeze** … Move whole sections;
never compress signal away."* Nothing checks it. `check-doc-caps.sh` counts **newlines**, and that
check is wired into the gate. Given an enforced counter and an unenforced principle, the counter is
what behaviour follows.

Measured on `.claude/CLAUDE.md` (figures independently re-derived by an external reviewer;
corrections applied):

| Date | Lines | Words | Cap verdict |
|---|---|---|---|
| 2026-06-09 `d8b09c0` | 63 | 675 | PASS |
| 2026-07-29 `9961f82` | **80** | 1,354 | PASS (at the cap exactly) |
| 2026-08-14 `5b76a61` | 62 | 1,626 | PASS |
| 2026-09-21 HEAD | 63 | **3,551** | PASS |

Content grew **2.62× after the cap was reached** (5.26× since first release) while line count fell
and then flat-lined. The longest single line is 6,681 characters; nine exceed 400; three exceed
1,000. The file is 22,203 characters / 22,527 bytes.

Three confirmations that the squeeze is systemic, not local:

1. **The one documented anti-squeeze event is itself a squeeze.** Commit `825fac0` shortened
   `docs/LEARNINGS.md` by 310 lines (207 insertions / 517 deletions) while removing **72 words**
   (47,990 → 47,918). Lines left; content stayed. That is the rule at §157 being satisfied on paper
   by the behaviour it forbids.
2. **The soft-cap route reports and nobody acts.** The gate currently prints **3 OVER-CAP (soft)**
   rows every run — `TODO.md` 536 > 320, `docs/research/adlc-epic-sequencing.md` 140 > 130, and
   `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` **3,050 > 130 (23× over)**. The
   documented remedy is "prune at the next promote governance review." It has not fired. A soft cap
   with no forcing function is a log line.
3. **Checklist mass is growing.** DoD items per Plan task (Plan section only, owner-action
   checkboxes excluded): SPRINT-090…093 = **3.00 · 3.33 · 3.75 · 3.40**; SPRINT-095/097/103/104 =
   **6.75 · 6.00 · 6.80 · 6.25**. Roughly 1.9×. *This signal is confounded* — ADR-029 formalised
   tiered verification inside the same window, so requirements genuinely grew. It is a symptom worth
   watching, **not** proof that durable rules are being displaced into disposable sprint files. It
   is recorded here as a hypothesis to be tested by the exit criteria, not as a premise.

**The failure reproduces in the consumer repo, in a different form — which is what makes it
structural rather than local.** `workdoo` accepted its own **ADR-005 on 2026-09-21**, recording
that STANDARD *"directs a recurring, bounded growth into a file whose cap budgets none of it"* and
that **five promotions had been routed around the number** — `L-006`, `L-008`, `L-010`, `L-012`
placed in `CONTEXT.md` with the cap given as the reason rather than the placement test's answer,
which that ADR itself identifies as a rule landing where only some flows read. Same root cause, a
different escape valve: lean-flow displaced into **density**, workdoo into **wrong placement**.

ADR-005's remedy was to raise the cap 80 → 150. This repo has already run that experiment:
`ADR-017` raised `CONTEXT.md` to 150, and it now sits at **146 lines / 3,716 words with a
1,331-character longest line** — 97% full, and dense. Raising the number buys time and reproduces
the outcome, because it changes the threshold and not the thing being measured.

Separately, and driving the queue half: `TODO.md` is one file (536 lines · 5,781 words) holding the
whole backlog. Its 320 cap is **soft** — it reports, it does not block — so nothing mechanically
truncates a decomposition. The pressure is real and owner-reported; the mechanism is a container
that grows toward a reported breach, not a hard stop. Stated precisely so the fix is not oversold.

It spans sprints because it is not one artifact: the work-item store, the skills that read it, the
15 executable checkers that parse `TODO.md`, three ADRs to supersede, and a consumer repo already
mid-flight are five separable deliveries, each demonstrable alone.

## Scope

**In:**
1. **A work-item store** — one file per task; **status is the folder**
   (`docs/work/{backlog,todo,in_progress,review,done,cancel}/`); transition is a move.
2. **Membership as frontmatter** — `sprint:` / `epic:`, because a file has one directory and status
   already claimed it. The sprint file stops *containing* tasks and *references* them.
3. **Derived progress** — `/prime` and the rollup count `## Done when` boxes across member files.
4. **Retargeting** — `/triage`, `/task-decomposer`, `promote`, `close`, `/prime`, `/orchestrator`,
   and every checker that parses `TODO.md`, changed together in one delivery.
5. **An enforced information budget** — measure the resource actually consumed (tokens over the
   always-loaded read set, tokenizer named), warn on long prose lines so density gaming is
   detectable, keep line counts as a secondary signal, and require a **disposition** for every
   promoted rule: *replace · merge · move to an on-demand reference · automate into a check · retain
   with justification*. Not arbitrary deletion to turn a counter green.
6. **Consumer parity** — `workdoo` adopts the same store; templates and the conformance engine ship
   it, so an installing consumer gets it and not only this repo.

**Out (explicitly not):**
- Changing **what** any gate checks.
- The dashboard UI — EPIC-016 owns Work & Queue and the Approval Inbox; this epic owns the store.
- **Approval and run state.** Who approved which revision at what scope, leases, attempts and
  terminal states stay in workdoo's durable store (workdoo ADR-001). A `review/` directory cannot
  carry an identity-bound approval, and must not become a competing status source.
- **The ledgers.** `TECH-DEBT.md` and `docs/LEARNINGS.md` keep their single-file shape — they are
  append-only reference corpora, not a queue with a lifecycle. They take D3's budget and disposition
  rule; they do **not** become per-item files. Ruled 2026-09-21 to keep this epic finishable.
- Rewriting archived sprints or back-filling historical tasks.
- Adopting kerjaan's shell scripts. Executable logic is **TypeScript on Bun** per standing
  convention — the reference is adopted for its *model*, not its implementation.
- Deleting any learning. Demotion is the outlet; deletion is not.

## Reference adopted

`github.com/mirzaakhena/kerjaan` — a markdown ticket tracker that is also a Claude Code plugin. What
is taken is its **invariant**, not its code:

> One fact lives in one place only — title in the filename, status in the folder.

Growth then goes *sideways* into more files instead of *downward* into a longer file, and a cap
cannot be hit by a container that never accumulates. Its status vocabulary
(`backlog · todo · in_progress · review · done · cancel`) is adopted verbatim.

**Three places lean-flow must diverge from it:**

- **Three axes, not one.** Status, sprint membership and epic membership are orthogonal — a
  SPRINT-104 task may be `in_progress` or `review`. Nesting membership under status forecloses the
  query the dashboard exists to answer ("what is in review, across all sprints?"). Status takes the
  folder; membership takes frontmatter.
- **Filenames carry no spaces.** kerjaan names files `<id> <title>.md`. This repo runs on Windows
  with concurrent `.claude/worktrees/` checkouts, where spaces, reserved characters and case-only
  renames are a live hazard. Use `TASK-NNN-kebab-slug.md`.
- **Folders cannot sequence.** kerjaan concedes this and adds `order.md`. Ordering stays explicit —
  `priority:` frontmatter plus a per-status order file — and `/triage` owns it.

## Decisions

- **D1** — Status is the directory; title is the filename; membership is frontmatter. **→ ADR**
- **D2** — `promote` stops copying task content into the sprint file; it stamps `sprint:` and moves
  the file. Removes a drift class (sprint copy vs backlog original). The sprint Plan remains an
  explicitly approved snapshot by **reference**. **→ ADR**
- **D3** — Budget the consumed resource, not newlines; add a long-line guard; require a disposition
  per promoted rule. **→ ADR, superseding ADR-015 · ADR-017 · ADR-019.**
- **D4** — **A repo task file and a store Work Item are different entities.** Not one fact split
  two ways: a task file is a *specification* (`backlog…cancel`, authored by a person, carrying
  `done-when`/`authority`/`assumes`), while workdoo's `WorkItem` is an *execution request*
  (`draft · ready · running · blocked · done`, carrying `goal`/`repository`/`acceptanceCriteria`/
  `limits`, moved by the supervisor). The store already holds a `repository` field and refers to
  repo content rather than restating it. So folders own editorial lifecycle, the store owns
  execution and every authority decision, and **workdoo ADR-001 is not amended** — it ruled on its
  own entity and simply predated this one. The two vocabularies are **not** mapped one-to-one;
  `done` means different things in each. **Ruled 2026-09-21 → workdoo ADR-006**, written in *that*
  repo because a reading filed only here is unreachable by the reader who needs it (L-151).
- **D5** — Tooling is TypeScript on Bun. Recorded because the reference implementation is shell and
  would otherwise be copied by reflex.
- **D6** — Transitions are **coordinator-owned**. Two isolated worktrees can each claim the same
  ticket from their own snapshot; the merge-back coordinator performs moves, and a duplicate-id
  check runs at merge.

## Open questions

- Does a transition commit as `git mv` (rename detection, `log --follow`) or move + `add -A`?
  → ruled at D6's sprint; move and content edits stay in separate commits either way.
- What disposes of `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` (3,050 lines, 23×
  its cap)? → it is the natural first test of D3's disposition rule.

## Closed when

- [ ] An epic breakdown of ≥ 30 tasks writes ≥ 30 files and **no cap check fires** — exercised on
      real input, not asserted.
- [ ] `TODO.md` is deleted and **no executable reads it** — derived mechanically (zero non-test
      references across `scripts/`, `evals/`, `skills/`), never asked of the author.
- [ ] The gate reports **zero OVER-CAP rows**, including the three standing today — each closed by a
      recorded disposition, not by a diet.
- [ ] `.claude/CLAUDE.md` is inside a **token** budget with a long-line guard, and at least one rule
      has been demoted through the disposition route with its destination recorded.
- [ ] A sprint's progress is **derived** from member files and matches a hand count.
- [ ] `workdoo` runs the same store, and the EPIC-016 Work & Queue view reads it without a second
      copy of status.
- [ ] **Effectiveness is measured, not assumed** — a before/after comparison of decomposition
      completeness, retrieval success and recurring-failure rate. Fewer lines and fewer checkboxes
      are explicitly **not** the success criterion.
