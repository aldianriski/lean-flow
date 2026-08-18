# Lean Flow — ADLC Development Handoff

> Audience: Development agent working on the Lean Flow repository  
> Purpose: Preserve direction while preventing premature platform expansion.

## 1. New Strategic Direction

Lean Flow's scope is now **ADLC — Agentic Development Life Cycle**.

Do not interpret "development" as software-only.

The target is solution-driven agentic delivery across many forms of development work.

Software delivery remains the most mature first workflow family, not the conceptual boundary.

North star:

> **An open, model-agnostic standard and operating system for provable agentic solution delivery.**

Read first:

1. `00-ADLC-NORTH-STAR.md`
2. `01-ADLC-PLATFORM-ARCHITECTURE.md`
3. `02-ADLC-DOMAIN-MODEL.md`
4. `03-ADLC-ROADMAP.md`

These are directional documents.

They do **not** authorise immediate implementation of the whole platform.

---

## 2. Current Execution Priority

Do not interrupt the current standardisation sequence.

Priority remains:

```text
EPIC-004 Conformance
        ↓
EPIC-005 Fleet
```

The platform direction comes after these foundations are proven.

### EPIC-004

Build consumer-facing, spec-driven conformance.

Do not mix dashboard or control-plane concepts into EPIC-004.

### EPIC-005

Prove multi-repo governance without a hosted service.

Do not rewrite EPIC-005 merely because a future Control Plane is now desired.

Its infrastructure-light boundary is intentional:

> The Standard must work without the Control Plane.

---

## 3. Research Track Allowed Now

A parallel research track is allowed:

```text
Harness / execution delta
```

Do not implement a new runtime yet.

Research only.

Question:

> What can Lean Flow control and prove at the plugin/process layer, and what belongs to the host runtime?

Likely high-value candidates:

- reconstructible Lean-controlled dispatch,
- independent dispatch replay,
- reversible effects,
- programmatic mechanical batching.

Explicitly avoid claiming:

- complete LLM request replay,
- provider prefix-cache control,
- host session ownership.

---

## 4. Architecture Boundaries

Before proposing any new component, classify it:

```text
STANDARD
CONFORMANCE
PROTOCOL
WORKFLOW PACK
RUNTIME ADAPTER
CONTROL PLANE
```

If it fits none or multiple categories ambiguously, stop and research the boundary before implementation.

---

## 5. Standard vs Control Plane

### Standard

Must remain:

- portable,
- versioned,
- model-agnostic,
- independently conformable,
- usable without hosted infrastructure.

### Control Plane

May eventually contain:

- DB,
- event stream,
- queue,
- scheduler,
- dashboards,
- organisation/team state,
- cost tracking,
- realtime status,
- integrations.

Do not let Control Plane implementation redefine Standard semantics implicitly.

Standard changes go through the standard governance path.

---

## 6. Do Not Build an Agent Zoo

Default unit of expertise:

```text
Expert Workflow Pack
```

not:

```text
Persona Agent
```

A workflow declares:

```text
purpose
inputs
procedure
capabilities
outputs
verification
escalation
risk policy
```

A model/runtime is one possible executor.

Custom agent admission requires a real capability boundary:

- permissions,
- tools,
- model,
- budget,
- context isolation,
- security,
- verification policy.

"Senior X expert" is not sufficient reason.

---

## 7. Preserve the dev-flow Lesson

Old restriction:

```text
No hooks
No scaffold
No custom agents
```

was created because speculative infrastructure was being built without usage.

Do not simply delete that lesson.

Upgrade it into an admission policy:

```text
Repeated usage
→ measured friction
→ simplest solution
→ still insufficient?
→ graduate infrastructure
→ measure again
```

Any proposal for a new hook, service, DB, custom agent, scaffold, queue, scheduler, or runtime layer must show evidence and lifecycle ownership.

---

## 8. Canonical Work Model

Use this vocabulary in future design discussions:

```text
Work Item
Run
Workflow
Worker / Agent
Decision
Gate
Evidence
Artifact
Effect
Outcome
Conformance
```

Important distinctions:

```text
Work Item ≠ Run
Run ≠ Agent
Artifact ≠ Evidence
Verification ≠ Conformance
Delivery ≠ Outcome
Workflow ≠ Model
```

Do not allow UI/database implementation to collapse these distinctions.

---

## 9. Future Protocol Direction

Do not implement before semantics are stable, but preserve this target:

```text
Work Item
    ↓
canonical RunEnvelope
    ↓
Runtime Adapter
    ↓
RunEvents
    ↓
Evidence / Gate / Decision
```

The first reproducibility target is:

> same authoritative inputs + same revision → same Lean-controlled dispatch brief.

Do not call this full model-request reproducibility.

---

## 10. Future Control Plane Product Question

The Control Plane should not start as a Kanban clone.

Its first responsibility is operational visibility:

```text
What needs attention?
What is blocked?
What is failing?
What needs human judgment?
What evidence exists?
What did execution cost?
What standard version is in use?
Which repos/processes do not conform?
```

A task board is only one projection.

---

## 11. Change Discipline

When a new idea appears:

1. classify the layer,
2. record the problem,
3. measure current friction,
4. identify the smallest intervention,
5. define proof before implementation,
6. run against real use,
7. only then promote into Standard or Platform architecture.

Do not create an epic just because a design sounds strategically attractive.

---

## 12. Immediate Agent Instruction

Continue current repository development in this order:

```text
1. EPIC-004 Conformance
2. EPIC-005 Fleet
3. Harness delta research in parallel if capacity permits
4. Collect execution metrics
5. Do not build Control Plane yet
6. Do not create broad ADLC workflow packs yet
7. Use SDLC as the proving ground, not the permanent boundary
```

When EPIC-005 is proven, revisit these documents and design the Platform Era from measured results.

---

## 13. Definition of a Good Next Step

A good next step:

- strengthens independent standard adoption,
- improves measurability,
- reduces ambiguity,
- makes execution more reproducible,
- improves evidence,
- improves multi-repo operation,
- is proven against real usage.

A bad next step:

- adds infrastructure because another framework has it,
- creates another persona,
- creates a dashboard before stable semantics,
- creates another SSOT,
- introduces platform coupling into the standard,
- optimises for software-specific terminology in generic ADLC concepts.

Use this boundary aggressively.


---

## 14. Approved Platform Adjustment

The future platform must support three permanent operating modes:

```text
LOCAL
CONNECTED
MANAGED
```

The existing plugin remains supported.

Do not design a one-way migration from plugin to dashboard.

Read:

- `06-PLUGIN-CONTROL-PLANE-MIGRATION.md`
- `09-ADLC-RUNTIME-GATEWAY-OPERATING-MODEL.md`

The future Gateway may execute work through Hermes/OpenClaw-like runtimes, but those runtimes are adapters, not the ADLC Standard.

---

## 15. Memory / Context / Cost Requirement

Before enabling substantial background/managed execution, design explicit controls for:

```text
model routing
reasoning budget
memory scope
context retrieval
skill loading
tool/MCP loading
tool-result budget
max turns
max cost
max duration
hard stop
scheduled-run limits
```

Read `07-ADLC-MEMORY-CONTEXT-COST-ARCHITECTURE.md`.

Do not copy provider/runtime-specific default thresholds into the Standard.

The Standard should require bounded and observable autonomy; runtime policy owns exact numbers.

---

## 16. Dashboard Direction

Dashboard work begins as a projection of real events.

Do not begin from a Kanban clone.

Read `08-ADLC-DASHBOARD-DESIGN-USER-FLOWS.md`.

First product jobs:

```text
attention
human judgment
run status
verification failures
evidence
cost
conformance
```

Only later expand into full managed execution.
