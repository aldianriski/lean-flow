---
owner: Maintainer
last_updated: 2026-11-12
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.21.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.23.0 release** (2026-11-12). §11 keeps the
> current and previous minor inline (2.23.x and 2.22.x), so cutting v2.23.0 pushed v2.21.x out.

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
