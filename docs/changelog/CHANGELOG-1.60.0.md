---
owner: Maintainer
last_updated: 2026-09-08
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.60.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **SPRINT-096 promote** (2026-09-08).
> Late: §11 keeps current + previous minor inline and **five** had accumulated (v1.58–v1.62), so
> v1.58.0 · v1.59.0 · v1.60.0 were rotated in one pass rather than one per release. Reachable only
> from the root changelog's link line (STANDARD §11).

---

## v1.60.0 — The First Rule Through the Engine (2026-08-26)

MINOR — SPRINT-087, **29 of 29 DoD** — closed at `QA-CHECK: 210 pass, 2 fail`, both counted failures
ruled and neither this sprint's (a known false positive, and another stream's commits). A rule now runs
end-to-end in TypeScript and is **proven equal to the Shell engine that still holds authority**.

**Consumer-facing — this changes what your gate reports.** Two checkers stopped scanning agent
worktrees under `.claude/worktrees/`, which are full repo copies created by the worktree-isolated
dispatch this project itself prescribes:
- `check-ephemeral-intake.sh` was walking them and reporting fixture files inside them as committed BUG
  reports — six live worktrees produced five false FAILs and pushed a run over its own budget.
- `check-research-archive.sh` was counting a worktree copy as a *live citer*, so a superseded research
  doc cited by nothing real reported **PASS**. That one is a silent false negative, the worse direction,
  and it was found by independent review rather than by the fix's author.
Both exclusions are anchored to path-start shape, not substring, and each retains a lookalike control
proving a genuinely resembling path is still reported. **A third site remains** — the conformance engine
still walks worktrees (`TD-100`), deliberately untouched because it is the live oracle every parity test
spawns.

**The TS engine** (internal; Shell keeps authority throughout — no cutover here): a result domain, a
switch-free registry, a repository port with a real adapter and an in-memory fake, and `--rule` /
`--section` targeting. All six of `spec/STANDARD.md` §14's marks resolve to their own outcome, driven by
a parser that reads §14 itself rather than a re-derived list. The §12 git-boundary family is migrated
whole — four rules, each with a retained must-FAIL **and** a sibling control. **A partial invocation
carries no global conformance level at all**, as a property of a frozen result rather than of the
printer. Three carry-forwards closed: `ok:false → exit 1` at the process boundary, permission-denied
distinguished from `spec-not-found`, and `--reconcile` carrying every mismatch rather than the first.

**Filed, not fixed:** ten `TD-` rows and four learnings, including three capabilities shipped with no
consumer (`TD-103`) — which no per-task DoD could see, because the gap was *between* tasks (`L-172`).

