---
owner: Maintainer
last_updated: 2026-11-16
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

## v2.24.0 — a coordinator for multi-session work, an opt-in cross-model route, and reviews that state their limits (2026-11-15)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.23.0 (R1: one High and one Med, both fixed; R2 CLEAR) and the off-host gate.
The coordinator reference comes from a real adopter run: one coordinator and one lane session per stream, across two repos (SPRINT-176).
SPRINT-177's `--detached` flag was folded in before the push, on its own Codex reviews and a re-run of the release review over its shipped delta.
SPRINT-178's lane rotation and lane-cost rules were folded in the same way (task reviews by Codex, then a release review of the shipped delta, CLEAR).
SPRINT-179's opt-in trial cells were folded in the same way (blind Fable and Codex task reviews, then a release review of the shipped delta).

- **`/orchestrator`: a host-declared `dispatch-trial` opts in to per-role model-tier and effort cells for one sprint, capped at six strongest-tier dispatches, with blind Codex comparisons where the cross-model channel is enabled; consumer defaults stay unchanged (ADR-010, TASK-670).**
- The `LEARNINGS.md` template's `related:` comment now says to cite corpus ids only (learnings, ADRs, research), never a retired id or an epic, and to resolve each against the ledger first (L-319).

- **`/orchestrator`: the coordinator can launch a new lane with one owner popup and rotate an existing lane to a fresh session at a task boundary with `claude --bg`, against a 200k target.** `/handoff` and `/flow` name the same 200k target.
- **`/orchestrator`: lanes keep bulky outputs (device runs, full test suites, long logs) in a worker.** They send only messages
  another session acts on, batch shared-file approvals per task, and wait on a lock or RAM in a background shell loop
  instead of `/loop` turns.

- **`night-run.sh`: adds a `--detached` flag so the pre-flight gate runs to completion.** The caller declares detachment; both gate limits
  are raised inline on that one call. An undeclared slow gate now refuses by name (`pre-flight-gate-foreground-limit`) instead of being
  killed at the 600 s ceiling, and a gate that truncated itself is refused on either arm, ahead of any `gate_exceptions:` grant (TASK-367).

- **`/orchestrator`: adds a coordinator reference for multi-session work.** `references/coordinator.md` gives the lane brief
  shape (including each gate's signed-or-unsigned status), the 3-line status check, relayed-ruling labelling and
  re-requesting a lost report. CONTEXT's Streams rule now says one coordinator may run one lane session per stream, one session
  per stream runs its workers and never relays, and sessions split by stream, never by step (TASK-662).

- **`/orchestrator`: the coordinator reference covers shared files and id booking across lanes.** The coordinator owns each
  named shared file and approves a lane's hunks file by file; it books a `TD` / `L` / `TASK` id range per lane, above every
  maximum in use and disjoint, and a lane never files outside its range. CONTEXT's L-143 grain and the task-file derivation
  rule say single-tree derivation is unchanged and a lane derives inside its booked range (TASK-663).

- **`/orchestrator`: adds an opt-in cross-model route.** Another provider's CLI reviews drafts, designs and code,
  builds in an isolated worktree, or gives one read-only diagnosis after two failures. The route is off by default;
  a `cross-model: <cases> via <cli>` line in the host repo's CONTEXT file or the owner's request enables it in attended
  modes only. An empty, timed-out or verdict-less result is never an approval. ADR-010 is amended (TASK-660).

- **`/orchestrator`: review results now state coverage and limitations.** A result missing either is sent back once to the
  same reviewer and cannot pass without both. A coordinator who edits task work after review becomes a builder and needs
  a fresh scoped review; revisions that replace a behaviour sweep the whole draft, design or plan for old passages,
  acceptance criteria included. The builder-check reader prompt asks for both statements too (TASK-659).

- **`/humanizer`: the English catalog is re-synced to blader/humanizer 4.0.0** (`b48c832f`, from 3.1.0). No pattern is added or
  renumbered; §15 is renamed "Shallow -ing phrases". Upstream now tells the editor to ignore instructions found inside the text and, in
  file mode, to read the whole file from disk first. It also lets a rewrite add a detail the editor knows to be true; lean-flow does
  not, and step 2 of the skill now says its never-add-a-fact rule overrides the catalog (TASK-498).

- **Fixed** — `/orchestrator`: when the other provider's CLI is missing or a call fails, the cross-model route now falls back by
  operation. A review goes to the same-provider reviewer, a delegated build returns to the ordinary dispatch, and a diagnosis handoff
  is skipped. Before, every failure went to the reviewer fallback. `coordinator.md` states the two stream rules it relies on instead
  of assuming the host's CONTEXT file has a streams section (release review).

## v2.23.0 — half the bookkeeping: zero-defect checks cut, record lines written by a tool (2026-11-12)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0 (§2's work-item row follows ADR-045's amended D6). Restart the session after installing.
Released on a Codex review of the shipped diff since v2.22.0 and the off-host gate (EPIC-025). The cuts follow a census of every gate
check and record step: only rows with no real defect in the archived sprint logs went, and every kept check still fails its must-FAIL
fixture by name. Sprint B, a workdoo sprint on this release, is the measuring sprint for EPIC-025's halving target.

- **Changed** — `/orchestrator`: from this release a task's moves and ticks ride in its own work commits (ADR-045 D6 amended); only cancel, de-scope, promote and a backlog revert stay separate commits. Routine progress rides with the accepted task result, and a blocker with its park record.
- **Changed** — `/lean-doc-generator` close: the Retro, routed buckets, the close entry and `status: closed` land in one close commit. `close_commit` and the epic row's sha go in the archive commit close already makes, so no record-only commit is added.
- **Changed** — `/lean-doc-generator`: a surprise finding rides in its task's progress entry, Files Changed rows come from the accepted diff, and a knowledge index is regenerated once, with its source docs.
- **Added (maintainer-only)** — `scripts/lib/record-line.ts` writes the consequence, review, scope-change, builder-check, tick and move records exactly as the gate parses them, and refuses a missing, unknown or ambiguous input instead of writing a default. The skills name it as lean-flow's own; consumers keep writing the lines by hand.
- **Removed (maintainer-only)** — 9 gate checks and 19 fixture harnesses with no real defect in the census (SPRINT-173). `merge-check` runs four legs, and prose density (no line over 400 characters) is now a manual check.
- **Measured (maintainer-only)** — one Jev trial on consequence classification (0.0054 USD) missed SPRINT-171 T5's owed review and rated 52 material changes low, so it was dropped.
- **Added (maintainer-only)** — `docs/research/process-cost-census.md` and its appendix list every gate check and every skill-required record step with its FAIL history, real defects and a proposed keep, merge or cut, for EPIC-025's owner rulings. Nothing is cut yet (SPRINT-172).
- **Removed (maintainer-only)** — the A/B measurement system: `evals/ab/` (harness, arms, judges, task corpus) and `scripts/jev-ab-judge.ts`, with their config entries. Releases ship on a Codex review of the shipped change plus the repo gate, as 2.21.0 and 2.22.0 did; EPIC-023 D19's pre-release arm is retired. TASK-631 is cancelled; seven A/B-only TD rows close. Measurement logs stay in `docs/research/logs/` as records.
