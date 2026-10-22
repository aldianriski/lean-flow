---
owner: Maintainer
last_updated: 2026-10-22
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## v2.13.2 — three checkers read input they used to skip or misread (2026-10-22)

**PATCH** — ships SPRINT-136 (Read What Is There), a fixes-only sprint. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-136 — Read What Is There (2026-10-22)

**Consumer-facing:** none. Every change is in lean-flow's own checkers and fixture harnesses.

**Maintainer-side:**
- The epic-archive check reads `[X]` and indented boxes as boxes in all three of its readers, and FAILs an archived epic
  with no member sprint it can read (an empty list, a missing key, a block sequence) instead of calling every member
  closed (TD-130; TD-148 item 1).
- The doc-caps check reads a cap only from the start of its cell (`~`, an integer, then `soft`, `hard` or `each`, then one
  parenthetical). A cell whose digits do not lead, such as `see row 3; 120`, FAILs `cap-cell-unparsed` instead of being read
  as a cap of 3 (TD-062).
- The verify-reaches check reads a `Verify:` clause naming a `.ts` checker, or `bun <path>.ts`, as mechanical, and strips
  TypeScript comments before asking whether it reaches its target (TD-191).
- The sprint-family fixture harness no longer defines `learn_entry()` twice (TD-172).
- TD-130 · 062 · 191 · 172 resolved; TD-148 narrowed; TD-266 filed; L-246 filed; L-108's eighteenth sighting; L-136's fifth.

---

## v2.13.1 — three checks stop passing what they exist to catch; §11 says only `.md` files cite (2026-10-21)

**PATCH** — ships SPRINT-135 (Checks That Mean It), a fixes-only sprint. Installing the release is enough; no upgrade step.
The standard moves to spec **0.18.1** (PATCH: wording only, no verdict moves). Restart the session after installing.

### SPRINT-135 — Checks That Mean It (2026-10-21)

**Consumer-facing:**
- **`/orchestrator`'s unattended-run reference (night-run.md Part 4) names the rollup's entry header:**
  `### <YYYY-MM-DD> | run-complete | <summary>`, the only header the rollup checker reads. A run that wrote its rollup under
  another header had to restate it.
- **Spec 0.18.1, §11:** only tracked `.md` files count as live citations for pruning. A task id in a code comment, a script
  or a non-markdown fixture never keeps a closed task file, because the id still resolves through git history.

**Maintainer-side:**
- The close check counts a terminal line as the run's outcome only when it carries the reaper's `[derived]` tag, so a run's
  own rollup no longer satisfies it (TD-232).
- The review-depth check fails a consequence line whose class is outside the vocabulary (`governance:med`), naming the token,
  even when the task has a review record (TD-244).
- The scope-change check excuses a prose fragment such as `done/` when it resolves to no path and a full path in the same
  entry contains it; a real directory still fails (TD-263).
- EPIC-005 (Fleet) is parked under ADR-053's freeze until consumer evidence or a repeated learning admits its machinery.
- TD-232 · 233 · 244 · 262 · 263 resolved; TD-264 · 265 filed; L-244 · L-245 filed; L-108's seventeenth sighting.

---

## v2.13.0 — three workflow packs: verification and solution analysis join software implementation (2026-10-20)

**MINOR** — ships SPRINT-134 (Three Families), the final slice of EPIC-007, which closes with it. Installing the release is
enough; no upgrade step. The standard is unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-134 — Three Families (2026-10-20)

**Consumer-facing:**
- **`packs/verification.md`**, extracted from lean-flow's scoped review and its close-time whole check. It covers review depth
  chosen by consequence, Spec and Standards axes reported separately, a zero-finding pass re-run once, and one bounded retry
  on a concrete violation. A whole check runs once after integration and is judged by the verdict line it prints itself.
- **`packs/solution-analysis.md`**, extracted from the decision-research practice. It takes one decision-driving question
  through options, sourced findings and a recommendation, and produces a decision record only when the choice is hard to
  reverse, surprising and a real trade-off.
- Both follow `packs/CONTRACT.md` and name no model. README § Workflow packs lists all three packs.

**Maintainer-side:**
- EPIC-007 closed with all six conditions met. Condition 5 (does a second workflow family satisfy the roadmap's
  platform gate?) was ruled **not satisfied by packs alone**: three families fit one contract unchanged on a single runtime,
  which shows fit, not pressure.
- L-238 and L-242 promoted; L-243 filed; L-108's sixteenth sighting (a run census that counted mentions).

---

## v2.12.1 — an already-covered test names the one edit that would fail it (2026-10-20)

**PATCH** — ships SPRINT-133 (Name the Failing Edit), a follow-up to EPIC-007. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-133 — Name the Failing Edit (2026-10-20)

**Consumer-facing:**
- **`/tdd` and the `software-implementation` pack: an *already covered* note names one concrete edit, checked against the
  test's inputs, that would fail the test.** It must be a specific expression or value, not a class of edits. "Anything other
  than `Math.floor`" names a class, and some edits in it still pass: `Math.ceil` and `Math.round` both give 1 hour for 3600 s.
  The rule is worded the same at `/tdd` step 3 and at the pack's step 3 and output contract.

**Maintainer-side:**
- §11 promote retention: TD-135 · 154 · 167 deleted; 9 closed task files pruned; TASK-438 retained (cited from code, TD-262).
- EPIC-007: a condition-3 follow-up; conditions 2, 4 and 5 are still the next slice. L-242 filed.

---

## v2.12.0 — workflow packs: a proven procedure any agent can follow from one file, with nothing installed (2026-10-20)

**MINOR** — ships SPRINT-132 (Expertise Without the Plugin), the first slice of EPIC-007. Installing the release is enough; no
upgrade step. The standard is unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-132 — Expertise Without the Plugin (2026-10-20)

**Consumer-facing:**
- **`packs/`, a new top-level tree (ADR-055).** A workflow pack is one proven procedure, written so that any capable agent, or
  a person, can follow it from its single file. Nothing is installed and no model is assumed; you take one by copying its file.
  `packs/CONTRACT.md` sets out the eight fields every pack declares: purpose · inputs · procedure · capabilities · output
  contract · verification · escalation · risk policy. Each field has a checklist line a reader can tick. Routing is by role
  (decision · execution · mechanical-ingest), never by model.
- **The first pack, `packs/software-implementation.md`**, extracted from `/tdd`. It covers test-first behaviour in vertical
  slices, with the whole suite gated on the runner's exit code. A fresh agent with no lean-flow plugin loaded followed it in a
  scratch repository to its declared output.
- **`/tdd`: a new test that passes on its first run is not RED.** It is recorded as *already covered*, naming the production
  change that would fail it, and the next behaviour proceeds. This applies to the tracer bullet too. The no-plugin exercise
  found the gap.

**Maintainer-side:**
- The contract is domain-neutral by construction: a non-software skeleton (supplier shortlist) passes a strict fresh reader's
  checklist.
- The first pack was switched from `/diagnose` to `/tdd`: an EPIC-007 D1 census found no recorded run of `/diagnose`, and 10
  dispatched runs of `/tdd`.
- The G2 builder check ran on all three designs: 15 contradictions and 18 questions, all settled before sign-off.
- EPIC-007 conditions 1, 3 and 6 are delivered; conditions 2, 4 and 5 are the next slice.

---
