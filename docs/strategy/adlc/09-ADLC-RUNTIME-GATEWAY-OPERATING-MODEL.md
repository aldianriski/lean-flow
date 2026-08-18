# Lean Flow — ADLC Runtime Gateway Operating Model

> Status: Future platform design  
> Goal: Define how Lean Flow can evolve toward an OpenClaw/Hermes-like always-on agent operating model without coupling the ADLC Standard to one runtime.

## 1. Gateway Role

The future Gateway is an **execution coordinator**, not the ADLC Standard.

Candidate responsibilities:

```text
Run intake
Worker registry
Runtime routing
Scheduling
Queueing
Budget enforcement
Capability policy
Credential references
Event routing
Human gate routing
Heartbeat / health
Cancellation
Result collection
```

It must not become the hidden owner of domain decisions.

---

# 2. Runtime Adapter Contract

All runtimes should converge on a small conceptual contract:

```text
execute(RunEnvelope)
streamEvents()
submitEvidence()
requestGate()
complete()
cancel()
health()
```

Examples:

```text
Claude Code Plugin Adapter
Codex Plugin Adapter
Kimi Plugin Adapter
Hermes Adapter
OpenClaw Adapter
Human Adapter
```

---

# 3. Worker Registry

A worker describes capability, not personality.

Candidate record:

```yaml
worker_id:
runtime:
model_class:
capabilities:
permissions:
supported_workflows:
availability:
cost_profile:
context_policy:
health:
```

Runtime-specific fields stay behind the adapter.

---

# 4. Worker Selection

Candidate inputs:

```text
Workflow requirements
Capabilities
Risk
Permission needs
Model class
Budget
Availability
Data locality
Context locality
```

Routing should be explainable.

Example:

```text
Research Work Item
→ needs web + docs
→ low-medium reasoning
→ no repo write
→ select Research Worker
```

Do not route only by "cheapest model".

---

# 5. Per-Run Capability

Prefer:

```text
permission per Run
```

over:

```text
global permanent permission per worker
```

RunEnvelope can declare:

```text
allowed tools
allowed repositories
allowed documents
network policy
write policy
secrets/credential refs
human gates
budget
```

This limits the blast radius of long-running workers.

---

# 6. Fresh Run Principle

Preferred:

```text
Persistent worker process / identity
+
fresh bounded Run context
```

Each Run loads:

```text
RunEnvelope
relevant memory
workflow
required capabilities
evidence refs
```

Avoid unbounded lifetime conversations.

---

# 7. Scheduling

A schedule is insufficient by itself.

Every scheduled Work definition needs:

```text
schedule
owner
workflow
input source
worker policy
budget
stopping condition
notification rule
```

Example:

```yaml
schedule: daily
workflow: competitor-research
budget:
  max_cost: ...
  max_turns: ...
stop_when:
  - no_material_change
notify_when:
  - material_change
```

---

# 8. Circuit Breakers

Managed execution requires:

```text
max turns
max cost
max duration
max subagents
no-progress limit
tool error limit
hard stop
manual cancel
```

If stopped:

```text
RunStopped
reason: budget | no-progress | timeout | policy | human
```

The stop is evidence, not a silent disappearance.

---

# 9. Background Work

Background activity must be observable as a cost category.

Dashboard should distinguish:

```text
User-Initiated
Scheduled
Triggered
Maintenance
Auxiliary
Subagent
```

This makes hidden continuous cost visible.

---

# 10. Credentials

Gateway should hold credential **references/policy**, not expose broad secrets to workers.

Run receives only what its capability policy permits.

Target:

```text
RunEnvelope
 ↓
credential resolver
 ↓
scoped credential
 ↓
worker
```

Audit:

```text
which Run
which capability
which credential class
when
```

Never show secret values in Run events.

---

# 11. Human Gate Routing

When a worker reaches a judgment boundary:

```text
requestGate()
 ↓
RunParked
 ↓
Control Plane Human Inbox
 ↓
Gate decision
 ↓
Gateway
 ↓
resume / terminate
```

Missing human response is not consent.

---

# 12. Integration With Local Plugin

Local plugin can register as an active worker.

Example:

```text
worker:
  Aldi-Laptop-Claude

status:
  online

capabilities:
  repo.write
  shell
  browser?
```

But do not automatically dispatch work to a person's machine without explicit policy/consent.

Connected local execution should remain user-controlled by default.

---

# 13. Hermes / OpenClaw Position

Treat systems such as Hermes or OpenClaw as candidate runtime implementations/adapters.

Do not make them the Standard.

```text
ADLC Standard
     ↓
ADLC Protocol
     ↓
Runtime Adapter
     ↓
Hermes / OpenClaw
```

If another runtime becomes better, add or replace an adapter.

---

# 14. Native Lean Runtime

Do not build a native Lean runtime early.

Only consider it when:

```text
[ ] multiple adapters expose the same recurring limitation
[ ] host runtime prevents required protocol guarantees
[ ] usage is high enough to justify owning runtime infrastructure
[ ] security and lifecycle capabilities are understood
```

Until then, leverage mature runtimes.

---

# 15. Gateway MVP

First Gateway does not need a full distributed system.

Possible initial scope:

```text
single service
simple durable store
Run API
Event API
worker registry
human gate routing
budget policy
```

Only add:

```text
queue
event bus
distributed scheduler
worker orchestration cluster
```

when load and reliability needs prove them necessary.

---

# 16. Gateway Success Criteria

Gateway should improve:

```text
visibility
coordination
bounded autonomy
worker portability
human intervention
cost control
reliability
```

If it only adds another layer between the user and the agent, it failed.
