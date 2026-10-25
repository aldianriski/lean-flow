---
owner: Maintainer
last_updated: 2026-10-25
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.14.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.16.0 release** (2026-10-25). §11 keeps the
> current and previous minor inline (2.16.x and 2.15.x), so cutting v2.16.0 pushed v2.14.x out.

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
