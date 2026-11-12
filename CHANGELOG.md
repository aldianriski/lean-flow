---
owner: Maintainer
last_updated: 2026-11-11
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

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

## v2.21.0 — a repo declares the standards it adopts, and a task names what must not happen (2026-11-06)

**MINOR** — no new skill; the roster stays at 15 and the standard stays at spec 0.19.0. Restart the session after installing.
**Not measured by an arm.** EPIC-023 D19 runs one before a release that changes `/orchestrator` or gate behaviour, and this one changes
a G2 line. The owner ruled a one-time exception (2026-11-06): about 50 USD and a measuring run are not worth it for a change this size;
D19 otherwise stands. A Codex review of the whole change stood in: four Med findings and no High, all fixed, then CLEAR. It rated arm
risk Medium for the Standards setup and review, negative-scenario decomposition, bug readiness and G2 enforcement, since reading cannot
show how often they add turns, cost or rejections. Consumer proofs ran on copies of one real repo, each kind once. Three branches have
never run (TD-294). TD-289 and TD-290 stay open for the next arm's amendment.

- **Changed** — An interactive `migrate` now shows its plan as text and raises the approval and each ruling as a popup, instead of waiting in prose; a headless run still parks to `/handoff` (TASK-608).
- **Changed** — coding-standards gains an optional `## Standards adopted` section; `init` and `migrate` ask once what the repo adopts (default `none`), and review applies its checks and exceptions, naming each failed check and location (TASK-605).
- **Changed** — Feature/bug tasks and behaviour-changing debt now need a `Negative:` scenario in Done-when; docs, config and spike tasks name one when it applies, else carry `Negative: n/a: <reason>`. Triage keeps new bugs `needs-info` until they name what must keep working after the fix, and `/diagnose` adds that box from its regression test. G2 names the test that would fail if the behaviour broke, or records a judgment tick when none exists (TASK-606).
- **Fixed (maintainer-only)** — `evals/ab/`: a judge call that fails or returns an empty reply now marks the attempt `infra:judge-failed`, so its slot retries or counts toward the 3-infra abort instead of scoring as not-passed, and a usage-limit judge failure pauses the run (TASK-602; root cause: the attempt class was computed before the judges ran, and the caught failure became an UNKNOWN verdict; TD-290 stays open until the next arm's amendment discloses it).
- **Fixed (maintainer-only)** — `evals/ab/`: a G2 signer call that throws now makes the attempt `infra:judge-failed`, even when the revise round then signs; a real `refuse` still refuses (TASK-604; root cause: the caught failure was returned as a refusal, so a login lapse could lower a protocol arm's score; TD-290 gains the signer).
- **Measured (maintainer-only)** — three workers re-checked after the provisioning lock: 6 slots, no provisioning failure, no infra attempt (TASK-603); the next release arm adopts N = 3 (TD-289).
