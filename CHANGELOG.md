---
owner: Maintainer
last_updated: 2026-10-29
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

- **Added (maintainer-only)** — `evals/ab/`: an A/B measurement harness tracer for EPIC-023 (lean-flow 3.0). It runs one pinned (model ids, verified plugin hash), isolated (temp home, isolated config, outside reads denied) and measured trial on a fixture repo and appends a graded, costed row to `docs/research/logs/ab-measurements.md`. It is run by hand (`bun evals/ab/selftest.ts [--paid]`) and is never part of the gate. Nothing ships to consumers (SPRINT-147, TASK-533).
- **Changed (maintainer-only)** — `evals/run-emitter-column-fixtures.ts` treats `evals/ab/` as out of scope for its population census (SPRINT-147 scope-change).
- **Fixed (maintainer-only)** — `scripts/gate-remote.ts` runs and judges the declared gate's second stage: `bun test` now runs after `QA_FULL=1 sh scripts/qa-check.sh` in the same remote call, each stage to its own log and rc file, and the run exits 0 only when both pass (TD-279, TASK-531).
- **Fixed (maintainer-only)** — `scripts/gate-remote.ts` and `judgeOutput()` read the LAST `QA-CHECK` verdict line, `gate-remote` exits through a closed set (0 pass, 1 gate failed, 2 refused, 5 transport) with the remote rc printed, and a dirty working tree prints a one-line warning that HEAD is what is gated (TD-268, TASK-532).

## v2.19.1 — three guards report only what they saw (2026-10-28)

**PATCH** — ships SPRINT-146 (Say What They Saw), a fixes-only sprint. No new skill; the roster stays at 15. Installing the
release is enough; no upgrade step. The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-146 — Say What They Saw (2026-10-28)

**Consumer-facing:**
- `orchestrator/references/night-run.md` names a new rollup line, `TASK-NNN · uncovered · …`, for a member's open
  `## Done when` box that no Plan `Tn` cites. It also adds that case to the `HARD_FAILURE` row: such a run can no longer
  end `PLAN_EXHAUSTED`.

**Maintainer-side:**
- **Fixed** — the night-run reaper no longer ends `PLAN_EXHAUSTED` over a member's open `## Done when` box that no Plan `Tn` cites (TD-201): it writes a `TASK-NNN · uncovered · …` rollup line and the terminal becomes `HARD_FAILURE`, replacing only the clean ending. `sprint-members-cli.ts` gains an `uncovered` mode; `counts` output is unchanged.
- **Fixed** — the revise-loop ceiling verdict no longer overclaims (TD-152): its `PASS` line keeps its prefix and now states how many `Tn · retry ·` lines it read, that they are model-reported, and that an unlogged retry is undetectable. FAIL paths are unchanged.
- **Fixed** — `qa-verdict.ts` now says so when its non-zero exit skips a stage chained after it with `&&` (TD-155): under `bun run test` it prints that `bun test` will not run; nothing new prints on a pass, under `gate`, or on a direct run. Exit codes are unchanged.
- TD-128 and TD-166 closed (fixed in code earlier, rows never closed); TASK-527 cancelled under ADR-053; TASK-513…522
  (six files) pruned (§11); L-258 promoted to LEARNINGS § Durable rules › edit-safety; L-260 and TD-279 filed.

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
