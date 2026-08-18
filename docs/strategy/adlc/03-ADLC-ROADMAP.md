# Lean Flow — ADLC Roadmap

> Status: Directional roadmap  
> Rule: Do not turn this roadmap into one giant implementation epic.

## 1. Current Position

Lean Flow already has a mature single-repository delivery foundation:

- ambiguity clearing,
- task decomposition,
- G1/G2 gates,
- dependency/wave planning,
- independent review,
- bounded revise loop,
- verification evidence,
- system verification,
- human authority,
- versioned standard direction.

The next goal is not to add more orchestration machinery indiscriminately.

The next goal is to convert the proven workflow into an **adoptable ADLC standard and platform foundation**.

---

## 2. Phase Sequence

```text
CURRENT CORE
    │
    ▼
EPIC-004 — CONFORMANCE
    │
    ▼
EPIC-005 — FLEET
    │
    ▼
PLATFORM ERA
    │
    ├── ADLC Run Protocol
    ├── Connected Plugin + Shadow Gateway
    ├── Memory / Context / Cost Controls
    ├── Expert Workflow Contract
    ├── Multi-runtime adapters
    ├── Control Plane Observability
    └── Managed Execution
```

Keep EPIC-004 and EPIC-005 focused.

Do not overload them with dashboard/platform work.

---

# Phase A — EPIC-004 Conformance

Objective:

> Any adopter can ask whether a repo/workspace conforms to the Lean Flow Standard and get a named answer.

Priority:

1. complete standard rule inventory,
2. mechanical vs judgment-only classification,
3. baseline current check coverage,
4. spec-driven conformance engine,
5. retained must-FAIL fixtures,
6. consumer-facing report,
7. attestation verification.

Exit before platform work depends on it:

```text
standard rules are independently readable
+
conformance can be independently measured
```

---

# Phase B — EPIC-005 Fleet

Keep this deliberately infrastructure-light.

Objective:

> Prove one standard version can govern multiple repositories without depending on a hosted service.

Prove:

- standard pinning,
- multi-repo upgrade,
- cross-repo conformance report,
- delegation policy,
- git-native fleet state.

Important:

Do not reinterpret the current "no dashboard / no database" scope as a permanent platform prohibition.

It is an experiment boundary:

> prove the Standard is not dependent on the future Control Plane.

---

# Phase C — Harness Delta Research

Run in parallel as research only while EPIC-004/005 proceed.

Question:

> Which harness mechanics are a real improvement at the Lean Flow layer, and which require ownership of the underlying model runtime?

Candidate keepers:

1. reconstructible Lean-controlled dispatch,
2. independent dispatch replay,
3. reversible effect lifecycle,
4. programmatic mechanical batching.

Reject or defer:

- provider-level prefix cache control,
- full session event sourcing,
- byte-identical full LLM request reconstruction,
- replacing host agent loops,
- copying a plugin runtime framework wholesale.

Deliverable:

```text
docs/research/harness-delta.md
```

No new epic until evidence identifies the real delta.

---

# Phase D — ADLC Protocol

Begin only after Standard + Conformance + Fleet have stable semantics.

Objective:

> Define portable contracts between a work system and an execution runtime.

Initial protocol objects:

```text
WorkItem
RunEnvelope
RunEvent
Evidence
Decision
Gate
Effect
ConformanceResult
```

First proof:

```text
same Work Item
same repo revision
same workflow contract
→ reconstruct same Lean-controlled dispatch
```

Do not claim complete model request reproducibility.

---

# Phase E — Expert Workflow Contract

Objective:

> Make expertise reusable independently from a specific model.

Start with 3–5 workflow packs that already have real internal use.

Recommended first families:

```text
solution-analysis
software-implementation
verification
security-review
proposal-development
```

Each pack must declare:

```text
purpose
input contract
procedure
capabilities
output contract
verification
escalation
risk
```

Do not create dozens of persona agents.

A custom agent is admitted only for a genuine capability/policy boundary.

---

# Phase F — Multi-Runtime Execution

Objective:

> Execute the same ADLC contract through multiple runtimes.

Start with existing environments already used by Lean Flow.

Possible adapters:

```text
Claude Code
Codex
Kimi
```

Adapter test:

```text
canonical RunEnvelope
→ runtime
→ canonical RunEvents / Evidence
```

The standard must not depend on one adapter.

---

# Phase G — Control Plane MVP

Do not start from a large dashboard.

Start from operational questions.

MVP should answer:

```text
What work exists?
What is active?
What is blocked?
What needs human judgment?
Which runs failed?
Which verification failed?
What evidence exists?
What did it cost?
Which repos/workspaces conform?
```

Minimum surfaces:

1. Portfolio
2. Work board
3. Human Gate Inbox
4. Run Inspector
5. Evidence / Verification
6. Conformance
7. Cost overview

Possible infrastructure now becomes acceptable because repeated use has proven the need:

- database,
- event stream,
- queue,
- scheduler,
- realtime,
- auth,
- organisation/team model.

But Control Plane state must have explicit authority boundaries against Git.

---

# Phase H — ADLC Beyond Software

Only after the platform model works on real SDLC usage.

Expand workflow families based on actual company demand.

Candidate order should come from repeated use, not product imagination.

Possible future families:

```text
business-process-development
proposal-development
research
marketing-content
recruitment
security-operations
compliance
finance-operations
```

For each new domain, ask:

> Does the existing ADLC abstraction fit naturally, or are we forcing software terminology into a different problem?

Change the core only if multiple real workflows prove the abstraction is wrong.

---

## 3. Metrics Required Before Platform Architecture Changes

Start collecting:

```text
first_pass_verification_rate
revise_loop_fire_rate
revise_loop_fix_rate
system_verify_unique_catch_rate
human_gate_rate
human_override_rate
parked_hitl_rate

runs_per_work_item
run_failure_rate
effect_leak_rate

tool_calls_per_run
model_roundtrips_per_run
tokens_per_run
cost_per_run
cost_per_delivered_work_item

lead_time
cycle_time
blocked_time
verification_time

conformance_findings_per_repo
standard_upgrade_failure_rate
```

Later add outcome metrics per workflow family.

---

## 4. Anti-Goals

Do not build:

```text
dev-flow 2.0
```

Avoid:

- agent zoo,
- giant prompt/persona library,
- mandatory scaffold for every repo,
- dashboard becoming undocumented authority,
- database replacing Git without explicit boundary,
- platform abstractions before real consumers exist,
- queue/service/event bus because they are fashionable,
- workflow engine before stable workflow semantics,
- percentage "AI productivity" metrics without operational meaning.

---

## 5. Decision Gate for Platform Era

Do not start Control Plane implementation merely because this roadmap exists.

Start when these are true:

```text
[ ] Standard is independently versioned
[ ] Conformance works for external/virgin consumer
[ ] Fleet proves >=2 repos under one standard
[ ] Actual repeated operation shows central visibility friction
[ ] Core Run / Evidence / Gate vocabulary is stable
[ ] At least 2 runtime/workflow variations prove abstraction pressure
```

At that point platform infrastructure is no longer speculative.


---

# Roadmap Adjustment — Connected / Managed Transition

The Platform Era must not begin with a full dashboard.

Preferred order:

```text
ADLC Run Protocol
      ↓
Plugin Event Emission
      ↓
Shadow / Read-Only Dashboard
      ↓
Connected Workspace
      ↓
Gateway + Runtime Adapter Contract
      ↓
Memory / Context / Cost Controls
      ↓
Managed Worker Execution
      ↓
Multiple ADLC Workflow Families
```

Reference:

- `06-PLUGIN-CONTROL-PLANE-MIGRATION.md`
- `07-ADLC-MEMORY-CONTEXT-COST-ARCHITECTURE.md`
- `08-ADLC-DASHBOARD-DESIGN-USER-FLOWS.md`
- `09-ADLC-RUNTIME-GATEWAY-OPERATING-MODEL.md`

This adjustment preserves the current plugin as a permanent Local/Edge mode while allowing the future platform to support always-on workers, background execution, and dashboard-led coordination.

The first dashboard milestone is **observability**, not orchestration.

The first gateway milestone is **protocol transport + bounded execution**, not a distributed autonomous company runtime.
