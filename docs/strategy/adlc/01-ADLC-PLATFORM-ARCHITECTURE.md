# Lean Flow — ADLC Platform Architecture

> Status: Directional architecture  
> Goal: Separate the standard from execution infrastructure and the future control plane.

## 1. Architectural Rule

Do not build one giant Lean Flow plugin.

Use layered architecture:

```text
┌──────────────────────────────────────────────┐
│              LEAN FLOW STANDARD              │
│ normative · versioned · model-agnostic       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           CONFORMANCE + PROTOCOL             │
│ rules · run contract · evidence · gates      │
└──────────────────────┬───────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
      Claude          Codex        Other
      Adapter         Adapter      Runtime
         │             │             │
         └─────────────┼─────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│          EXPERT WORKFLOW PACKS               │
│ reusable procedures + contracts              │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│             ADLC CONTROL PLANE               │
│ portfolio · board · runs · gates · evidence  │
│ cost · risk · conformance · integrations     │
└──────────────────────────────────────────────┘
```

Only the **Standard** is normative authority.

Everything below it is an implementation, adapter, consumer, or projection.

---

## 2. Layer Responsibilities

### Layer A — Lean Flow Standard

Owns:

- lifecycle concepts,
- work hierarchy,
- gates,
- evidence rules,
- conformance levels,
- HITL rules,
- verification semantics,
- authority boundaries,
- lifecycle requirements.

Must not require:

- one model vendor,
- one dashboard,
- one database,
- one hosted service,
- one specific agent runtime.

### Layer B — Conformance

Answers:

```text
Does this repository/workspace/process conform?
At what level?
Which named gaps prevent the next level?
Which items require judgment?
```

Conformance reports state.

Conformance does not become an invisible workflow engine.

### Layer C — ADLC Protocol

Defines interoperable execution and reporting contracts.

Candidate primitives:

```text
WorkItem
RunEnvelope
RunEvent
Evidence
Decision
Gate
Artifact
Effect
ConformanceResult
```

This is where multi-runtime compatibility should converge.

### Layer D — Runtime Adapters

Examples:

- Claude Code,
- Codex,
- Kimi,
- future agent runtimes,
- human-operated execution.

Adapter responsibility:

```text
ADLC RunEnvelope
      ↓
runtime-specific execution
      ↓
canonical RunEvents + Evidence
```

### Layer E — Expert Workflow Packs

Own domain procedures.

Examples:

```text
requirements-analysis
solution-architecture
software-implementation
security-review
incident-analysis
proposal-development
content-research
business-process-design
recruitment-screening
```

A workflow pack defines:

```text
purpose
inputs
procedure
capabilities
output contract
verification
escalation
risk policy
```

It should not unnecessarily own model identity.

### Layer F — Control Plane

The future dashboard/operating system.

It may use:

- database,
- event bus,
- job queue,
- scheduler,
- realtime updates,
- authentication,
- organisation/team model,
- billing/cost storage.

But these are **product infrastructure**, not requirements of the ADLC standard.

---

## 3. Git vs Control Plane

Do not choose one universal source of truth for every type of information.

Use authority by domain.

### Git-authoritative candidates

- source-controlled implementation,
- standard pin,
- durable architecture decisions,
- repository-owned plan/evidence where required,
- release state,
- commit-bound attestations.

### Control-plane-authoritative candidates

- live run state,
- agent allocation,
- transient scheduling,
- cost accounting,
- queue state,
- UI preferences,
- notification state,
- cross-project projections.

### Shared / synchronised candidates

- task state,
- gate status,
- evidence index,
- conformance result,
- project metadata.

For shared data, define one explicit authority and projection direction.

Never allow:

```text
Git says A
Dashboard says B
Nobody knows which is correct
```

---

## 4. Event-Oriented Control Plane

Do not start from a Kanban database schema.

Start from the lifecycle facts that matter.

Candidate event vocabulary:

```text
IntentCaptured
WorkItemCreated
WorkItemRefined
WorkItemPromoted
GateRequested
GateSigned
GateRejected
DecisionRequired
DecisionRecorded

RunPlanned
RunStarted
RunProgressed
RunBlocked
RunParked
RunFailed
RunCompleted

EvidenceRecorded
VerificationStarted
VerificationFailed
VerificationPassed
EffectCreated
EffectDisposed
EffectLeaked

IntegrationStarted
IntegrationFailed
IntegrationPassed

ReleaseProposed
ReleaseCompleted
OutcomeRecorded
LearningRecorded
```

The dashboard should be a projection of durable facts.

This does not require event sourcing on day one.

It requires stable semantics before UI becomes authoritative.

---

## 5. Reconstructible Dispatch

Lean Flow does not own the complete LLM request.

Therefore the correct target is:

> **Lean-controlled dispatch reproducibility**

Given:

```text
repo / workspace revision
+
work item
+
workflow
+
governing decisions
+
constraints
+
verification contract
+
runtime policy
```

the system should be able to reconstruct the execution brief Lean Flow intentionally delegated.

Candidate `RunEnvelope`:

```yaml
run_id: run_001
work_item: TASK-142

source:
  repo: org/project
  revision: abc123

workflow: software-implementation

goal:
  ref: docs/...#task

inputs:
  - ref: docs/...

constraints:
  - ref: ADR-...

capabilities:
  - repo.read
  - repo.write
  - shell

budget:
  max_cost: 3
  max_duration_minutes: 30

verification:
  - command: npm test
  - command: npm run typecheck

human_gates:
  - production-release

effects:
  - worktree
```

Do not make this YAML mandatory until the derived representation has been proven necessary.

Prefer deriving from existing authoritative artifacts first.

---

## 6. Reversible Effect Principle

Adopt this platform invariant:

> **No successful execution leaves an unowned live effect behind.**

Every runtime effect should have:

```text
CREATE
OWNER
LIFETIME
INVERSE
FINAL STATE
```

Examples:

| Effect | Inverse |
|---|---|
| Worktree | remove + prune |
| Temporary branch | merge/archive/delete |
| Development server | terminate full process tree |
| Background job | stop/collect |
| Sandbox | dispose |
| Temp directory | delete |
| Lock | release |
| Port binding | terminate owning process |
| Prototype | salvage or discard |

A leaked effect should be visible as a named run finding.

---

## 7. Programmatic Mechanical Batching

Use models for decisions.

Use computation for volume.

```text
high ambiguity
    ↑
model reasoning

high mechanical volume
    ↓
local/programmatic batch
```

When work consists of many independent mechanical operations, execute them close to the data and return only decision-relevant evidence.

Example:

```text
30 reads + grep operations
        ↓
one local scan
        ↓
17 candidates
3 conflicts
2 missing
```

Measure:

```text
tool calls
model round trips
returned tokens
accuracy
wall time
cost
```

Do not hard-code a batching threshold until measured.

---

## 8. Dashboard Target

The dashboard should become an ADLC control tower, not only a task board.

Core surfaces:

### Portfolio

```text
Projects
Initiatives
Active Epics
Open Work
Risk
Conformance
Cost
```

### Work Board

Possible state model:

```text
INTAKE
NEEDS CLARIFICATION
READY
PLANNED
GATED
EXECUTING
VERIFYING
NEEDS HUMAN
INTEGRATING
COMPLETED
```

Workflow policy decides which states apply.

Do not force every task through the same pipeline.

### Human Gate Inbox

Show:

- required decision,
- recommendation,
- alternatives,
- risks,
- evidence,
- authority,
- approve/reject/defer/escalate.

### Run Inspector

Show:

- work item,
- runtime,
- workflow,
- input revision,
- status,
- budget,
- capabilities,
- tool usage,
- verification,
- evidence,
- effects,
- failure reason,
- cost.

### Conformance

Show:

```text
current level
named findings
gap to next level
judgment-only requirements
standard version
```

Avoid vanity percentage scores unless a future metric has clear operational meaning.

---

## 9. Architecture Guardrail

Before adding a platform component, ask:

```text
Is this part of the Standard?
Is this a Protocol concept?
Is this an Expert Workflow?
Is this a Runtime Adapter?
Is this Control Plane infrastructure?
```

If the answer is unclear, do not implement yet.

A large part of preventing another dev-flow outcome is making layer ownership explicit before code exists.


---

# Operating Surfaces

The platform must preserve multiple execution surfaces:

```text
ADLC STANDARD
     │
     ├── Local Plugin
     ├── Connected Plugin
     └── Managed Gateway
```

The dashboard does not replace the plugin.

The Gateway does not replace the Standard.

Hermes/OpenClaw-like runtimes do not replace Expert Workflow contracts.

See `06-PLUGIN-CONTROL-PLANE-MIGRATION.md` and `09-ADLC-RUNTIME-GATEWAY-OPERATING-MODEL.md`.

# Cost Architecture

Managed execution introduces a new architectural concern: continuous autonomous cost.

Context, memory, tools, skills, subagents, and schedules are all part of execution cost.

See `07-ADLC-MEMORY-CONTEXT-COST-ARCHITECTURE.md`.

Cost is a runtime/control-plane concern, while the Standard should require that autonomy be bounded and observable.
