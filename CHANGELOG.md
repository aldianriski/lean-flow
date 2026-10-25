---
owner: Maintainer
last_updated: 2026-10-24
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

**Consumer-facing** (shipped procedure; every repo that installs lean-flow gets these):
- **Every sub-agent brief now names secret files as off-limits.** The orchestrator's builder, worktree and reviewer briefs, the builder-check reader prompt, the task-decomposer `Explore` recon brief and the council's sub-agent prompts say: never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret, even when told read-only; report and ask, or read a non-secret record. Two SPRINT-138 agents briefed "read-only" had opened `.env` files (L-247).
- **New `/humanizer` skill rewrites AI-sounding prose so it reads human, without changing what it says.** Give it pasted text (you get the draft, the patterns still left, and the final) or name a prose file (only the final text is written; code, commands, paths, YAML and link targets stay untouched). It ships a 26-pattern English catalog vendored verbatim from blader/humanizer 3.1.0 (MIT, commit 8c307f3) and is standalone: `/flow` does not run it. The skill count is now 15.
- **`/humanizer` now cleans Indonesian and mixed Indonesian-English text.** A new `references/patterns-id.md` adds the Indonesian forms of the English tells ("Tidak hanya X, tetapi juga Y", "Mari kita selami", "Semoga membantu!"), Indonesian-only tells (stacked formal connectors, "Adapun"), a term table that keeps the English word where the KBBI coinage is uncommon (galat → error, peladen → server), and a first-use italics rule for rendered Markdown. The skill reads it in full whenever the text is Indonesian.
- **`/humanizer` can translate between English and Indonesian, on explicit request only.** Name a target language ("translate to English", "terjemahkan ke bahasa Indonesia") and it translates the meaning, then cleans the result in that language under its catalog; English to Indonesian also applies the term table and first-use italics. Without that request it never translates. Code, paths, YAML and link targets stay unchanged.
- **`/lean-doc-generator` now runs generated doc prose through `/humanizer` on every write.** The pass runs in a child sub-agent that reads the pattern catalogs in full, with the template (or the doc being edited) as the voice sample, so your house style (`—`, `→`, bold labels) survives. Where a runtime cannot start a sub-agent it runs inline and says so; if the pass fails or humanizer is not installed, the original text is written with a one-line notice and nothing is blocked. The contract is in the humanizer skill's `references/embedded.md`, reusable by your own skills.
- **`/release-patch` and `/handoff` now pass their prose through `/humanizer`.** The CHANGELOG entry `/release-patch` prepends (including in changelog-only mode) and the handoff document are cleaned in a child sub-agent before the hard stop or the save. Version strings and lines, headings, paths, commands, ids and status fields are never changed, the entry keeps its existing shape, and `/release-patch` still never pushes. If the pass fails, the original text is written with a one-line notice.
- **Commit messages and PR bodies written by the skills now pass through `/humanizer`.** The orchestrator (quick, mvp, sprint-bulk and its builders), `/lean-doc-generator`, `/diagnose`, `/prototype` and `/triage` clean the free prose of a commit message as plain text and a PR body as rendered Markdown. The `type(scope):` prefix, trailers, ids, shas and paths stay verbatim, fixed-template commits (status moves) skip the pass, and a failed pass commits the original message with a one-line notice.

---

## v2.14.0 — validation runs where the work happens: worktree builders typecheck, merge-backs run a fixed check, reviews run the pinning tests (2026-10-24)

**MINOR** — ships SPRINT-138 (Validation Where Work Happens), plus SPRINT-137's maintainer-side fixes, which closed unreleased.
Installing the release is enough; no upgrade step. The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-138 — Validation Where Work Happens (2026-10-24)

**Consumer-facing** (shipped procedure; every repo that installs lean-flow gets these):
- **Worktree builders and reviewers run the dependency-needing gate leg before they report.** A harness-created worktree has no
  installed dependencies, so a type error a task introduced stayed invisible until the final gate. The dispatch brief now has each
  builder and reviewer install them by your own dependency-install procedure before dependent work, run the leg (a typecheck,
  usually), quote its result, and report a failure or blocker if either cannot run. Neither may overlap any task's wall-clock
  measurement on the same host (TD-194).
- **After each merge, the coordinator runs your documented merge-back check.** That is a fixed set of cross-cutting legs, agreed
  by your maintainer and recorded in the check's documentation. Where none is documented, the coordinator runs your discovered
  gate, preferring the repo-wide gate over a unit-only script. Verified Done-when boxes are ticked at merge-back acceptance, in the
  same session, so a handoff inherits current records.
- **A review runs the existing tests that pin what the change touches.** It searches by path, file name and exported or defined
  names, runs every hit (naming any excluded hit with a reason), and reports a **Pinning tests** section of its own. A changed file
  with no pinning test is reported as "no pinning test found", with the searches run (TD-212).
- **A scaffolded `CLAUDE.md` says where a new task is born** (`docs/work/backlog/`), in its Session Workflow section. Before this,
  a fresh reader of an `init`-ed repo could not answer that question (TD-222).

**Maintainer-side:**
- `bun --no-env-file scripts/gate-remote.ts` runs the full QA_FULL gate on an off-host runner and passes only on the remote's own
  passing verdict (`LF_GATE_HOST` · `LF_GATE_KEY` · `LF_GATE_DIR`; an MSYS-rewritten remote dir is refused by name).
- `bun scripts/merge-check.ts` is lean-flow's own merge-back check: typecheck · prose-density · layers-completeness ·
  layers-observed · scope-change, each run with the gate's own checker and arguments.
- Research: `docs/research/learning-loop-architecture.md` maps the learning loop end to end and ranks five next-intake candidates.
- One-time cleanup of 12 merged agent worktrees. TD-194 · 212 · 222 resolved; TD-246 updated; TD-268 · 269 · 270 · 271 filed;
  learnings are filed in the sprint's Retro.

### SPRINT-137 — No Quiet Passes (2026-10-24, closed unreleased)

**Consumer-facing:** none. **Maintainer-side:** live epic index rows hold only status and a pointer; every harness's ANSI
pass-count parse has a retained must-FAIL; review-depth FAILs a consequence key that is not one task; epic-archive reads an
unbalanced annotation, both suffix anchors and a frontmatter-only member list (TD-163 · 099 resolved; TD-165 · 148 narrowed).

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
