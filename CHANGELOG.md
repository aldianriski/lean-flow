---
owner: Maintainer
last_updated: 2026-11-12
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

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

## v2.22.0 — workers do the reading, briefed and resumable, and `/diagram` ties every arrow to a source line (2026-11-11)

**MINOR** — one new skill, `/diagram`; the roster grows from 15 to 16, and the standard is spec 0.20.0. Restart the session after installing.
**Not measured by an arm.** EPIC-023 D19 runs one before a release that changes `/orchestrator` or gate behaviour, and this one changes
`/orchestrator`'s dispatch. The owner ruled a one-time exception (2026-11-11), as for 2.21.0; D19 otherwise stands. EPIC-024 rows 1 and 2
landed by its D12 exception; the D12 check sprint (SPRINT-168) traced 0 gate failures to them. A Codex review of every change under
`skills/` and `spec/` stood in: one Med (the orchestrator's resume rule left out the later-process case), fixed, then CLEAR.
EPIC-024's own role trials (router, merger, watcher, checker, reproducer) ship nothing (D21).

- **Fixed (maintainer-only)** — `scripts/trials/agent-cost.ts` skips a zero-usage `<synthetic>` API-error turn instead of stopping, so a host-killed run can still be priced; a synthetic turn with any usage still stops it. The emitter-column census declares `scripts/trials/` maintainer-only. EPIC-024 closed with no role shipped (SPRINT-171).
- **Added (maintainer-only)** — `scripts/trials/` provides a Bun trial harness with local prep, dry-run launch, snapshots, caller-supplied checks, a merge oracle, preflight and cost reader; synthetic fixtures and an offline selftest cover the reusable tools (TASK-640).
- **Changed** — the worker contract tells a worker never to end its turn while a job it needs still runs, and `/orchestrator`'s dispatch rule resumes a worker with `SendMessage` from the session that dispatched it; on Claude Code 2.1.319 and 2.1.321 a later process could not reliably reach the worker, so it hands a fresh worker the context instead. Both came from paid trial runs that lost a report or a fix (SPRINT-170, TASK-639).
- **Added (maintainer-only)** — `scripts/jev-ab-judge.ts` replays TypeSafe's Jev against the A/B harness judge's three recorded calibration runs (96 cells each) and prints agreement, the unsure rate and cost; it is a dry run by default, and `--run` needs a budget and a key. A failed or empty Jev call is infra, never a not-passed slot. On the three runs Jev agrees with the judge on 56/96, 46/96 and 31/54 cells (93.3%, 66.7% and 93.9% with unsure scores left out; 37.5% are unsure), at 0.037 USD for 96 calls against the judge's 7.52 USD. The harness default is unchanged and the script is outside the gate (TASK-628).
- **Added (maintainer-only)** — `scripts/jev-done-when.ts` asks TypeSafe's Jev whether each Done-when box is observable and each Negative box concrete, and prints a finding per box (dry run by default; `--run` needs a budget and a key, and a run failure exits 3). `docs/research/jev-use-cases.md` maps where Jev could help and records the API facts. On the 108 task files it judged 395 boxes: 166 pass, 229 unsure, 9 unobservable. It is advisory and outside the gate; no skill changed (TASK-625, TASK-626).
- **Changed** — `/task-decomposer` and `/lean-doc-generator promote` do their reading in one worker on `sonnet`, which returns questions to the session as popups and resumes with the answers. Every build dispatch starts with a worker contract and names its model. `/prime` no longer reads the architecture map; the stage that needs it reads its section (EPIC-024 rows 1 and 2, TASK-621).
- **Changed** — /diagram's Bash grant is scoped to `git rev-parse` and `git status`, so the harness enforces the read-only-git limit the skill only stated in prose; any other git command, such as `git commit`, now falls to your session's permission mode (TASK-622).
- **Added** — `/diagram` draws architecture, workflow, sequence, data-flow, state and ERD diagrams as Mermaid with an evidence table that ties every box and arrow to a source line, each marked called, configured, proposed or unknown. The roster is now 16 skills; the data-flow and flows doc templates point to it (TASK-619).
- **Added (maintainer-only)** — `scripts/session-cost.ts` reports where a repo's Claude Code spend goes; `docs/research/router-mode.md` plans how to test a router against it (TASK-609). No skill changed.
- **Fixed** — `migrate` writes a named standard with no checks as `checks: not decided yet (owner, migrate)`, the form `init` already wrote, and its report uses the topic labels word for word. Before, it marked every field undecided and described the topic in its own prose, so a search for the marker found nothing (TASK-610).
- **Fixed** — `/task-decomposer` no longer writes a `Negative:` box the owner never saw. A draft that needs one and names no scenario is held at `approve`: it shows the exact line, writes nothing, and writes that line unchanged after a fresh `approve` (TASK-611).
- **Fixed** — `/triage` no longer lets a bug's `Negative:` box come from nowhere. A known-cause bug reaches `ready` only with a box citing the report or code that names what must keep working; otherwise it stays `needs-info` with an `open:` line and no box. The bug template says the same, so an unknown-cause bug no longer gets a filler box (TASK-612).
- **Added (maintainer-only)** — the gate prints `conformance: N informational finding(s), <full|reduced> spec, not in the tally` directly above its verdict, or `not run` when the sweep produced no count, so a `0 fail` no longer hides the conformance engine's findings. The verdict line and the tally are unchanged.
- **Fixed** — a handoff from a side session unrelated to the active sprint now leaves its stub in the root `HANDOFF-LEDGER.md`, and `/prime` reports the latest entry from both the sprint's Log and the ledger. Before, `/handoff` wrote every stub to the active sprint's Log, where a side `live` entry could fail that sprint's close, and `/prime` read the ledger only with no sprint active. A handoff of the sprint's own work (focus names a member task) still stays in its Log, and `/handoff` asks when unsure. The standard moves to spec 0.20.0 (MINOR: the ledger row's trigger widens on paper; no verdict moves). TD-298.
