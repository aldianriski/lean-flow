---
epic: 016
slug: agentic-governance-dashboard-pilot
owner: Maintainer
last_updated: 2026-09-21
status: active
member_sprints: [workdoo SPRINT-001 (closed), workdoo SPRINT-002 (closed), workdoo SPRINT-003 (closed), workdoo SPRINT-004 (closed), workdoo SPRINT-005 (closed), workdoo SPRINT-006 (closed), workdoo SPRINT-007 (closed), workdoo SPRINT-008 (active)]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-016 — Agentic Governance Dashboard Pilot

> **Outcome:** an operator can create, run, monitor, decide on, stop and accept real agent work
> across two repositories **entirely from a dashboard** — with every approval bound to an identity, a
> revision and a scope, every run ending in a named terminal state, and failed or incomplete
> verification blocking acceptance.

## Why this, why now

Every prior epic in this repository improves the *work-system* for someone already sitting at a
terminal. None of them let the owner **use, watch and control** agent work from anywhere else, which
is the capability actually being asked for. The roadmap
(`docs/development/Lean-Flow-Governance-Roadmap-2026-2027.md`, 2026-09-09) reprioritises delivery
around exactly that, and supersedes the ordering in which platform investment was previously
sequenced.

It spans sprints because the outcome is not one artifact. It needs a runtime adapter proven against a
live runtime, a control service that holds authority, a durable queue with real worker isolation, an
approval model where absence of an answer is never consent, and a pilot long enough to observe
failure and recovery rather than only the happy path. The roadmap budgets **20 working days** across
seven phases; each phase ends in something demonstrable, which is what makes them sprints rather than
milestones on one plan.

The window matters. The pilot's value is the *evidence* it produces — which bottleneck is real, what
a run actually costs, where a human is genuinely needed. Every week it slips is a week the epics
queued behind it are estimated from assumption instead of measurement.

## Scope

**In:** a runtime adapter contract with a live Claude Code implementation and a deterministic fake ·
a control API + supervisor holding authority over status and grants · a durable store for work items,
runs/attempts, approvals and events · a dashboard covering Command Center, Work & Queue, Run Detail,
Approval Inbox, Workers & Policy and System & Services (read-only process health; host mutation
stays out — that is the deployment tasks’ territory, not the dashboard’s) · bounded concurrency with worker isolation, lease/heartbeat and
budget limits · a two-repository pilot exercising success, revision, escalation and recovery.

**Out (explicitly not):** a second real runtime — Codex, Kimi, Hermes and OpenClaw are scheduled
*after* the pilot, and the adapter contract exists to keep that space open, not to fill it ·
multi-tenant organisations · platform memory · cross-domain workflows · automatic production
deployment · a scheduler or queue *service* as a separable product · the reference-engine cutover
(**EPIC-014**, explicitly off the pilot's critical path) · formal closure of any existing epic, which
keeps its own § Closed-when.

## Member sprints
<!-- Rows are appended at promote. NOTE: member sprints live in the `workdoo` repository (ADR-041),
     so each row links out rather than to ../sprint/. The v1.63.0 epic-rollup-currency check reads
     THIS repository only and cannot see a workdoo sprint that closed without a row here — the row is
     therefore a manual obligation at each member close, not a checked one. -->

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [workdoo SPRINT-008](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/SPRINT-008-where-an-approval-stops-something.md) | Where an Approval Finally Stops Something | **active** — promoted 2026-09-21 · `bc025e4` | _(completed at close)_ — **phase 3's interface half: the machinery SPRINT-007 built starts refusing things an operator can see.** Five tasks. `TASK-049` gives the real `claude-code` adapter a verdict to produce, which condition 4 currently has a writer for and no producer — the adapter must **observe** it, never infer it, and if the check cannot be made identifiable without interpreting its output the task stops and says so rather than reaching for an exit-code heuristic (`ADR-002`). `TASK-045` is the Inbox: the first caller `Approval`, `checkApproval` and `attempt_refs` have ever had, rendering from the **recorded sha** rather than the ref name, and **acceptance promotes the ref to a branch** (`ADR-003`) so approval is an observable Git event instead of a flipped column — that is condition 1's missing word, *decided*. `TASK-047` and `TASK-048` are condition 2's second half: a `J2` phase does not dispatch, ends in the named authority terminal state and surfaces what it needs, with **no answer, a timeout and an unreachable channel each recorded as a distinct waiting state and none of them a default yes**; approving it creates the *next* attempt chained to the parked one under exactly the capability the approval named, which is where SPRINT-007's digest-mismatch refusal finally acquires a caller and where the F01 line lives. `TASK-046` closes condition 4 at the acceptance point — `failed` **or null** refuses acceptance in the control plane rather than in the interface, each with its own named reason. **Sequencing is load-bearing and recorded as `D2`**: 046 shipped before 049 would refuse every real run, leaving an Inbox that lists and never accepts, with every test green. **Deliberately not pulled:** workdoo `TD-027`, the `high` row SPRINT-007 filed — a `verify`-phase agent holds `Bash` and can orphan the commit an approval names, after which git's default two-week prune deletes it. The isolated-clone fix is a provisioner redesign that wants a measurement pass first and goes to SPRINT-009; what this sprint owes it is assumption `A3`, that acceptance must refuse a recorded sha which no longer resolves, because that is reachable today |
| [workdoo SPRINT-007](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-007-something-to-bind-an-approval-to.md) | Something to Bind an Approval To | **closed** 2026-09-21 · `dd0d188` — 18 of 18 Plan DoD, `PLAN_EXHAUSTED` | **Built the three things an approval needs before it can refuse anything, and then found the hole in its own mitigation.** The Inbox had been blocked for three sprints on one fact — a run's work product was deleted with its worktree, so an approval had nothing to bind to (`TD-017`). It survives now: the control plane commits the attempt's changes to `refs/workdoo/attempts/<attempt-id>` in the seam between the worker exiting and the checkout being released, and records the resolved sha and nothing about its content (`ADR-001`) — proven by editing a file in a real git fixture, ending the attempt, and reading the commit back **after the worktree is gone**. Three outcomes are recorded where a nullable column would have had one absence (`written` · `empty` · `failed`), with a row's absence reserved for a fourth, *never asked*. **The commit is made control-plane side, not worker side** — a G2 ruling that *removed* assumption `A1` rather than answering it: an agent that never touches git has no grant to scope, so F01 is closed by construction instead of by policy. `attempts.verification_state` has its first writer since `0002` — the third capability-with-no-caller this repo has found — proven both directions plus a kill-mid-run case, with a retained must-FAIL reddening exactly four tests. And `ADR-004` settles what an approval binds to before `Approval` implements it: a **resolved content digest**, never a name, void on **either** a digest mismatch **or** a TTL, each refused under its own name, with the approver taken only from the control-plane session. The seeded F02 must-FAIL reddened exactly three tests while all four expiry tests and both controls stayed green — proving the two rejections are independent rather than one check wearing two names — and one of those three is **F01 at the digest level**: a request widened from `tools:Bash` to `tools:Bash,Edit` is refused, because a widened request is literally different content. **Two conditions of this epic are explicitly NOT advanced, and the sprint says so rather than implying otherwise.** Condition 3 (tool scope genuinely enforced) is *weakened* by a live demonstration: `verify` is issued `Bash`, `Bash` is git, and `git worktree` shares the parent's refs — a worktree-side `update-ref` moved the parent's attempt ref to a forged commit. Binding to the recorded sha defeats that, and does **not** defeat deletion: `refs/workdoo/**` gets no reflog, so after `gc --prune=now` the recorded sha stopped resolving at all, on a default two-week clock. An approval would be valid, recorded and unverifiable (`TD-027`, high; the fix is an isolated clone per attempt). Condition 4 (failed **or incomplete** verification blocks acceptance) has a writer but **no real producer**: `RuntimeRunRequest` carries no `phase`, so the `claude-code` adapter cannot tell it is running `verify`, and mapping an exit code would be the adapter deciding — which `ADR-002` forbids. Every real dispatch still leaves the column null; the safety property holds in the gap, the condition does not (`TASK-049`). Nothing built here has a caller outside its own tests, named up front rather than discovered at a later close. Filed there: `TD-027`…`TD-030` · `TASK-049` · `L-017` (a union is a contract with consumers in more than one language — a widened `RuntimeEvent` broke an exhaustive switch `tsc` caught and the report misattributed, **and** a SQL check constraint no type check could ever see) · `L-018`, with `L-002` at count 5, `L-010` at 4 and `L-014` at 2 |
| [workdoo SPRINT-006](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-006-a-lease-that-outlives-its-process.md) | A Lease That Outlives Its Process | **closed** 2026-09-20 · `0ca3551` — 17 of 17 Plan DoD, `PLAN_EXHAUSTED` | **Gave this epic's restart/reconcile condition a mechanism, and downgraded it from *unsupported* to merely *unbuilt*.** `worker_leases` was created and indexed in SPRINT-003 and never written to; it now has a writer, a reader and a proof — the row is written before the worker spawns, renewed on the heartbeat timer that already existed, released in the `finally` that already existed, and **a supervisor that cannot record a lease no longer starts a worker**, because swallowing that failure had silently reproduced the pre-sprint state and, since `attempt_id` is `unique`, swallowed the violation `0002` added expressly to make double-dispatch *"a write error instead of a race nobody notices"*. A lease is proven to outlive the process that issued it, **read back by a genuinely separate later process** — the first version of that proof killed a real process but read through a store in the test process, so deleting the restart changed nothing, and it dispatched through the route that hard-wires the real CLI with none of the `WORKDOO_LIVE_CLI` opt-in used elsewhere; both were replaced and the restart verified load-bearing by blinding the reader and watching the proof redden. **Reclaim remains deferred to phase 5** (`D2`): nothing acts on a lapsed lease — no sweep calls `findLapsed`, nothing sets `reconciled_at`, `Supervisor#reclaim` has no caller outside tests. Also closed the three holes SPRINT-005 named: Run Detail shows a real phase (proven by calling the running server, after shipping once as a route with no caller), Work Item status gained its own vocabulary and five measured colour tokens, and the `data-testid` hooks were ruled provisioning for `TASK-015`'s harness — the guard that claimed to enumerate them had never examined the twelfth. **Five tasks, five confirmed defects, every one found by an independent pass and none reachable by the suite its author had just run green** — `L-002` at count 4, no longer a warning. Resolved `TD-018` and `TD-020`; filed `TD-022`…`TD-026` · `TASK-040` · `L-014`…`L-016`. **`TD-017` is still unruled and still gates phase 3's design** — closes the three holes SPRINT-005 named and left, and the one it discovered: **`worker_leases` has never had a writer**, so the supervisor's leases die with the process holding them and this epic's restart/reconcile condition has no mechanism behind it. Five tasks, small first so the quick wins do not queue behind the lease chain: a real phase on Run Detail, a vocabulary ruling for Work Item status, a ruling on eleven test hooks nothing reads, then the lease write path and — the half most likely to be faked — a lease proven readable after the supervisor is **actually restarted**, not after a second instance is constructed in-process. Reclaim itself stays with the durable queue in phase 5; making a lapsed lease observable has to exist first, or that design is written against an empty table |
| [workdoo SPRINT-005](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-005-operator-command-center.md) | The Operator's Command Center | **closed** 2026-09-20 · `b148e73` — 29 of 29 DoD, `PLAN_EXHAUSTED` | **Turned the dashboard from a harness into a product, and made the pilot's own thesis visible in the interface.** `apps/web` had no CSS file at all; it now carries a token + primitive design system with `docs/DESIGN.md` as the contract phases 3–7 build against, a shell whose nav admits every area this epic names — including the unbuilt ones, which state which phase delivers them rather than 404ing or mocking — a Command Center sourced **only** from what the store actually holds, the existing screens rebuilt with their hooks intact, and a controls bar. **The rule it is organised around: a metric with no source renders `not measured`, never zero.** Nothing here records cost, so the spend tile shows a hatch and names phase 5; `MetricTile`'s `unmeasured` state carries no `value` field *at the type level*, so `tsc` refuses the call site that would coalesce absence into `0`. Three absence states are now named and distinct: `unmeasured`, `unwired`, `unavailable`. Stop-all reports per-attempt outcome and never a blanket success; pause-queue constructs no click handler at all, because there is no queue to pause until phase 5. **Eight confirmed defects, and eight were one sentence — it exists, it looks correct, nothing consumes it** — including `worker_leases`, created and indexed in SPRINT-003 and **never written to**, which means a supervisor restart drops every lease and this epic's restart/reconcile condition has no mechanism behind it (`TD-018`, high). No single instrument found more than three of the eight. Filed there: `TD-018`…`TD-021` · `TASK-034` · `TASK-035` · `L-011`…`L-013`, with `L-002` and `L-008` reaching count 3 |
| [workdoo SPRINT-004](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-004-starting-a-run-from-the-dashboard.md) | Starting a Run From the Dashboard | **closed** 2026-09-15 · `addada9` — 29 of 30 DoD, `PLAN_EXHAUSTED` | **The connection SPRINT-003's theme claimed and never had.** An operator clicks a Work Item and a real run starts: a Run and Attempt created, a real git worktree of the target repository provisioned, an isolated worker driving the real CLI, activity streaming live, and one named terminal state written back — **proven by the owner clicking the button**, not by a harness (`Glob` → `Read` → `Edit` against the target, `PLAN_EXHAUSTED` in 19.5s, eight events stored, against `claude` 2.1.271 on `win32` probed at run time). `USER_STOP` had no writer at all — a killed worker and a crashed one were identical on stdout — and `chk_runs_ended_together` fired against real code for the first time since it was written. Five tasks, one of them created mid-sprint because the independent pass found the F05 guard untested and the fake unable to reach it. Closed `TD-011`, `TD-012`, `TD-014`, and `TD-006` at the provisioner's call site. Filed there: `TD-013` · `TD-015`…`TD-017` — of which **`TD-017` gates phase 3's design**: a run's work product is deleted with its worktree, so the Approval Inbox has nothing to bind an approval to — plus `L-009` · `L-010` |
| [workdoo SPRINT-003](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-003-a-real-run-from-the-browser.md) | A Real Run From the Browser | **closed** 2026-09-14 · `f1830c2` — 30 of 33 DoD, `AUTHORITY_BOUNDARY` | Built phase 2's control plane, store and dashboard around SPRINT-002's runtime, and **amended ADR-002 on all three** of that sprint's findings: a Work Item surviving both processes restarting, an owner session on every route, plan→implement→verify under a per-phase capability, a supervisor dispatching a separate-process worker under lease and heartbeat, live activity replaying from the store, and a stop carrying the OS-confirmed `processGone`. **Seven of eight tasks; `T8` parked at 1 of 4 on `TASK-010`**, exactly as `A13` predicted — the deployment artifacts exist and have never been applied to a host. Two findings outrank the features: `bun run verify` reported green on a machine with no database while every persistence suite silently skipped — F05 inside the gate that disclaims it, and `HELD` is now a third gate outcome — and stripping a worker's environment **was not isolation**, because Bun re-reads `.env` from disk in the child. Caught at close: `T6` and `T7` had proven every component and wired none of them into `server.ts`. Filed there: `TD-009`…`TD-012` · `TASK-026` · `TASK-027` · `L-006`…`L-008` |
| [workdoo SPRINT-002](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-002-driving-the-real-runtime.md) | Driving the Real Runtime | **closed** 2026-09-14 · `c349c4a` — 16 of 16 DoD, `PLAN_EXHAUSTED` | **Settled both phase-1 assumptions and found a capability escape nobody planned for.** **A2 confirmed** — the `claude-code` adapter drives the real CLI headless, its stream parses into the port's vocabulary, and `stop()` terminates a real process confirmed by an OS liveness probe rather than by the stream closing. **A3 answered `no`**, at one scope: under this adapter's configuration a denial never reaches an approval callback, so the supervisor gets **no** simplification — it needs its own process control and phase checkpoints and must consume the `tool-denied` stream itself. Proven by building a working MCP permission-prompt tool, showing it armed and enforcing under `--permission-mode manual`, then silent under the shipped config. **The unplanned finding outranks both: `--allowedTools` alone was never a boundary** — the model reached the still-visible `Agent`/`Task` built-in and its subagent ran `Bash` for real with the parent's restriction never consulted, which is the F01 pattern this epic exists to prevent, found live and closed by schema removal. One blind spot is now named rather than assumed away: with an empty allow-list a denial is **unobservable**, so an absent `tool-denied` event is not evidence nothing was attempted. Worker filesystem confinement ships with a **demonstrated** check-then-open TOCTOU race disclosed in `SECURITY.md` rather than hidden; the network half deferred to phase 2, where host-level allow/deny can exist. **The sprint's most useful output is procedural**: four tasks, four green suites, four confirmed defects that only an independent review pass found — none reachable by the tests that were green at the time. That is `L-165` here, reproduced four times in one sprint, and it is what `workdoo TASK-016` exists to apply to SPRINT-001. Filed there: `TD-002`…`TD-007` · `TASK-017` (ADR-002 carries three claims now disputed on live evidence) · `TASK-018` · `L-001`…`L-005` |
| [workdoo SPRINT-001](https://github.com/aldianriski/workdoo/blob/main/docs/sprint/archive/SPRINT-001-the-contract-before-the-runtime.md) | The Contract Before the Runtime | **closed** 2026-09-09 · `eb3d9e7` — 21 of 21 DoD, `PLAN_EXHAUSTED` | **Established everything the pilot needs that does not depend on a working runtime, and drew the sprint boundary at an assumption rather than a date** — so a false **A2** costs SPRINT-002 and nothing already built. A Bun workspace whose gate was **proven able to go red** (clean → seeded hash-verified break → `1 pass, 2 fail` with `lint` green as the sibling control → restored byte-identical → clean); the **runtime adapter contract with two implementations from day one**, because a contract with exactly one cannot be distinguished from a transcription of it; version pinning whose probe sits behind a port and whose `unprobed` outcome carries no running version, so "could not check" cannot read as "checked and agreed"; **workdoo ADR-001** (Git owns content, the store owns operational state, neither mirrors the other — the ruling the approval-digest binding depends on) and **ADR-002**; and the five pilot phases with entry, exit and authority, where phase 2 has no time-based exit and phase 4 does not exit on an absent verdict. **The sprint's own defect is its most useful output**: the loop paused between tasks against `sprint-bulk`'s explicit instruction, which traced to a guard gated on run mode — filed here as **`L-192`** + **`TASK-336`**, with **44 of 50** of this repository's own sprint logs carrying no rollup. Filed there: `TD-001` (the gate has no harness of its own) · `TASK-016` (the independent review pass no task could run) |

## Decisions

- **D1** — The platform is built in a separate repository (`workdoo`) with lean-flow consumed as a
  pinned plugin; governance splits outcome-here / execution-there. **→ ADR-041** (accepted).
- **D2** — Stack locked at Day 1: Next.js dashboard · Bun/Hono control API + supervisor as a
  long-running Linux service · Postgres. The supervisor **cannot** be serverless — it holds leases and
  heartbeats across worker lifetimes, which no request-scoped runtime can express.
- **D3** — One real runtime (Claude Code) plus a **deterministic fake adapter** shipped in the same
  sprint. A contract with exactly one implementation is undiscriminated: nothing distinguishes a real
  seam from a Claude-Code-shaped hole (L-186). The fake doubles as the test double for every suite
  above the adapter, so its cost is repaid immediately.
- **D4** — Deployment reuses the proven `temidev-agent-platform` pattern on the shared VPS — systemd
  units per process, Caddy reverse proxy, a dedicated service user. Reused as a **pattern**, copied
  deliberately; the two platforms share a host, not a codebase.
- **D5** — The pilot absorbs *operational subsets* of EPIC-006, 009, 010 and 012 and consumes
  EPIC-015's authority vocabulary. It closes **none** of them; each keeps its own § Closed-when, per
  roadmap §10.

## Open questions

- **Does the run-outcome vocabulary minted here bind EPIC-008's portable protocol, or is it internal
  to the pilot?** Minting two competing `RunSummary` shapes is the failure to avoid. → ruled at the
  G2 of the sprint that ships typed outcomes, jointly with `TASK-297`, which carries the same question
  on the lean-flow side.
- ~~**What does Git own versus the durable store?**~~ — **CLOSED 2026-09-09, workdoo ADR-001**
  (SPRINT-001 T4). Git is authoritative for content; the store for operational state and every
  authority decision; the store holds **references**, never copies. The argument that settled it
  surfaced while writing rather than while planning: an approval binds to a resolved revision digest,
  and that binding means nothing unless Git is authoritative for what the digest resolves to.
- ~~**What exactly does the runtime adapter contract promise?**~~ — **CLOSED 2026-09-09, workdoo
  ADR-002** (SPRINT-001 T2). It normalises and decides nothing, and it ships with two implementations
  from day one. The ADR also records the cost: the fake agrees with the *contract*, not with Claude
  Code, so a suite green against it says nothing about whether the real runtime matches what the
  contract assumes — which is SPRINT-002's job.
- **How is an approval bound to identity, revision and scope such that a worker cannot forge one?**
  Closes audit findings F01 and F02. → **workdoo ADR-003**, owed before the Approval Inbox ships.
- **Is Postgres provisioned on the shared VPS?** The reference platform runs SQLite WAL, so this is
  new host state, not an inherited one. → a measurement, resolved in the first member sprint's
  environment validation, not by ruling (L-094).

## Closed when
<!-- Sourced from roadmap §9. Each is observable on the pilot deployment, not on a fixture. -->

- [ ] A normal task can be created, run, monitored, decided and inspected **end-to-end from the
      dashboard**, without opening a terminal for the normal path
- [ ] An approval carrying the wrong identity, revision or scope is **rejected**, and a `J2` task
      takes no new action before authority exists
- [ ] Tool and resource scope is genuinely enforced: a worker cannot alter its own grant, forge
      verification evidence, or reach controller credentials
- [ ] Failed **or incomplete** verification prevents automatic acceptance — an absent verdict is not
      read as zero failures
- [ ] Stop and stop-all terminate managed processes and record the matching status; effects already
      committed remain traceable
- [ ] Two independent runs proceed concurrently while conflicting work waits, and no double-dispatch
      occurs under duplicate events
- [ ] Restart or disconnect never silently duplicates work or leaves a run *appearing* successful;
      unknown status is flagged and reconciled before retry
- [ ] Queue, approvals, results and material events survive a service restart, and an operator can
      follow the recovery runbook unaided
- [ ] **At least 10 real tasks across two repositories**, covering success, revision and human
      escalation, plus the negative tests above run separately
