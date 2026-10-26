---
owner: Maintainer
last_updated: 2026-10-26
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

### SPRINT-145 — Keep the Terms, Recast the List

**Consumer-facing:**
- The Indonesian humanizer catalog keeps English terms of art in domain text: a spec name, column header, capacity term
  or test name stays English even when a plain Indonesian phrase exists (concurrent user, acceptance test, write
  penalty, free space, fault tolerance), and the Keep Indonesian list now says it covers general vocabulary only.
  Measured on a new retained fixture of a synthetic Indonesian request memo (TASK-525).
- A sixth overlay pattern, LF-6: an internal list of open decisions inside text addressed to someone else is recast as
  numbered requests or questions to the recipient, every item kept and none decided for them. The Indonesian catalog
  gains ID-18 (hedges such as "di atas kertas" go while a testing obligation stays) and a label-first fragment example
  under ID-2 (TASK-526).

---

## v2.18.0 — commit messages humanized inline, the riskiest ready slice built first, and three template deltas (2026-10-26)

**MINOR** — ships SPRINT-144 (Wire the Milestone, Cut the Cost), a feature sprint. No new skill; the roster stays at 15.
Installing the release is enough; no upgrade step. The standard is unchanged (spec 0.18.1). Restart the session after
installing.

### SPRINT-144 — Wire the Milestone, Cut the Cost (2026-10-26)

**Consumer-facing:**
- Commit messages are humanized inline. The caller reads the three pattern catalogs once per session (again after a
  compaction) and runs the fact list and check itself, instead of starting a sub-agent per message that re-read about
  49 KB of catalogs each time. PR bodies and documents keep the sub-agent pass (TASK-524).
- `/task-decomposer` lists first the ready slice that removes the most uncertainty. It reads the Proof goal in
  `requirements.md` § First milestone and puts the slice that proves it (or the ready slice that unblocks it) first;
  without a proof goal it says so and ranks ready slices by risk likelihood. The order is a proposal, and the
  requirements template now names the decomposer as the proof goal's reader (TASK-520).
- The ADR template gains an optional **Revisit when:** header line beside Status and Deciders: the condition that
  would reopen the decision, never a date. The worked example fills it. It is not a required §4 section, so the
  conformance engine's ADR checks are unchanged (TASK-515).
- The flows template's Steps that matter is now a table: each step records the record it changes, its owner and the
  next owner (roles, never names), because business flows tend to break at the handover between steps (TASK-517).
- The authentication template's role table gains a Data scope column (own records, one tenant or site, all), and a line
  stating that permissions are enforced at the application boundary; hiding a control in the UI is not enforcement
  (TASK-518).

**Maintainer-side:**
- TD-278 resolved: 18 commit messages took the inline pass with no child, about 3.1k tokens each against ~73k. The
  fact-keep fixture records the inline recipe and three runs (all eleven facts kept in each; run 1 added an actor, a
  TD-274 sighting).
- L-257, L-258 and L-259 filed; v2.16.x rotated to `docs/changelog/CHANGELOG-2.16.0.md`.

---

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

---
