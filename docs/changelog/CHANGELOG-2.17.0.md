---
owner: Maintainer
last_updated: 2026-10-27
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.17.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.19.0 release** (2026-10-27). §11 keeps the
> current and previous minor inline (2.19.x and 2.18.x), so cutting v2.19.0 pushed v2.17.x out.

## v2.17.0 — a customer-review demo in `/prototype`, review findings that can close without a fix, and uncertain writes read back before retry (2026-10-26)

**MINOR** — ships SPRINT-143 (What the Codex Pipeline Taught), a feature sprint drawn from the owner's Codex
`run-project-pipeline` skill. No new skill; the roster stays at 15. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-143 — What the Codex Pipeline Taught (2026-10-26)

**Consumer-facing:**
- A write whose outcome is unknown is read back before it is retried. `/handoff` lists every write it started but did not
  see finish, `/prime` names it on the `Handoff:` row and the `Next:` line, and `/orchestrator` reads its target back before
  any retry, because a timeout does not prove a write failed (TASK-513).
- A review finding can close without a fix. The revise loop's outcomes are now `fixed`, `still-open`,
  `rejected (<evidence>)` and `deferred (<impact> → TASK/TD)`. When a human is present, the builder may reject a
  finding by citing a test, check, fixture or owner ruling, and the rejection shows in the review report. In an
  unattended run, rejecting or deferring is a judgement, so the task parks (TASK-514).
- A new repo's `requirements.md` records its first milestone: what the first slice must prove, when to stop, and
  the integration boundary (none, simulated or live, with its allowed side effects). `/lean-doc-generator init`
  asks for all three in its popup and leaves `[CUSTOMIZE]` for any answer you have not decided yet (TASK-516).
- A change to behaviour that already works starts by pinning it. `/orchestrator`'s first G2 micro-task captures what the
  behaviour does today, with a characterization test or a before/after record, and re-runs it after the change. Any
  difference the task did not ask for is reported to you rather than absorbed. A bug fix through `/diagnose` already
  writes its regression test first (TASK-519).
- `/prototype` has a third branch, a customer-review demo, for the question "will a customer understand and want this?"
  It writes a contract (audience, proof goal, depth, reset, integration boundary), labels every simulated action and
  sample record, and prepares a task script with non-leading questions. A demo counts as validated only after a recorded
  session with real target users; it is retired after that session (TASK-521).
- `/prototype`'s UI branch writes a short design-direction brief before any variant (subject idea, palette and type
  roles, density, operational or promotional), hands the brief and the critique to `frontend-design` or `anti-slop`
  when one is installed, and offers the winning direction for your `DESIGN.md` without ever creating it unasked
  (TASK-522).

**Maintainer-side:**
- The unattended reaper (`check_revise_ceiling` in `scripts/night-run.sh`) parks rejected and deferred outcomes, reads
  a rejection's evidence only inside its own parenthesis, and fails closed on a retry line it cannot read; twelve retained
  cases under `evals/fixtures/revise-loop-ceiling/`.
- Research `docs/research/codex-run-project-pipeline.md` maps the Codex skill against lean-flow; TASK-515, 517, 518,
  520 and 523 stay in the backlog.
- TASK-499…505 and TASK-508 pruned (§11); L-256 filed; L-251 to count 2; TD-276 · 277 · 278 filed; v2.15.x rotated to
  `docs/changelog/CHANGELOG-2.15.0.md`.
