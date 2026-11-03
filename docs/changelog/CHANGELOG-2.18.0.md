---
owner: Maintainer
last_updated: 2026-11-03
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.18.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.20.0 release** (2026-11-03). §11 keeps the
> current and previous minor inline (2.20.x and 2.19.x), so cutting v2.20.0 pushed v2.18.x out.

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
