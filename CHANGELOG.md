---
owner: Maintainer
last_updated: 2026-10-27
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

- **Fixed** — the night-run reaper no longer ends `PLAN_EXHAUSTED` over a member's open `## Done when` box that no Plan `Tn` cites (TD-201): it writes a `TASK-NNN · uncovered · …` rollup line and the terminal becomes `HARD_FAILURE`, replacing only the clean ending. `sprint-members-cli.ts` gains an `uncovered` mode; `counts` output is unchanged.
- **Fixed** — the revise-loop ceiling verdict no longer overclaims (TD-152): its `PASS` line keeps its prefix and now states how many `Tn · retry ·` lines it read, that they are model-reported, and that an unlogged retry is undetectable. FAIL paths are unchanged.

## v2.19.0 — English terms of art kept in Indonesian domain text, and a working list recast as requests (2026-10-27)

**MINOR** — ships SPRINT-145 (Keep the Terms, Recast the List), a feature sprint drawn from an owner's corrections to a
real Indonesian request memo. No new skill; the roster stays at 15. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-145 — Keep the Terms, Recast the List (2026-10-27)

**Consumer-facing:**
- The Indonesian humanizer catalog keeps English terms of art in domain text: a spec name, column header, capacity term
  or test name stays English even when a plain Indonesian phrase exists (concurrent user, acceptance test, write
  penalty, free space, fault tolerance), and the Keep Indonesian list now says it covers general vocabulary only.
  Measured on a new retained fixture of a synthetic Indonesian request memo (TASK-525).
- A sixth overlay pattern, LF-6: an internal list of open decisions inside text addressed to someone else is recast as
  numbered requests or questions to the recipient, every item kept and none decided for them. The Indonesian catalog
  gains ID-18 (hedges such as "di atas kertas" go, while the claim's basis, "menurut perhitungan", and any testing
  obligation stay) and a label-first fragment example under ID-2 (TASK-526).

**Maintainer-side:**
- A retained fixture, `evals/fixtures/humanizer/term-of-art/`: a synthetic memo that fails on the 2.17.0 pass (0 of 3)
  and passes after (3 of 3), with every run recorded and judged by a reader that did not write the brief.
- L-257 promoted; L-258 to count 2; TASK-512 pruned (§11); v2.17.x rotated to `docs/changelog/CHANGELOG-2.17.0.md`.

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
