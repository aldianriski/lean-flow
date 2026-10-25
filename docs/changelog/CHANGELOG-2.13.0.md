---
owner: Maintainer
last_updated: 2026-10-25
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.13.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.15.0 release** (2026-10-25). §11 keeps the
> current and previous minor inline (2.15.x and 2.14.x), so cutting v2.15.0 pushed v2.13.x out.

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
