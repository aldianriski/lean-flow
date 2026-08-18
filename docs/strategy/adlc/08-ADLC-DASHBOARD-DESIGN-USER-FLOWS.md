# Lean Flow — ADLC Dashboard Design & User Flows

> Status: Product/UX direction  
> Rule: Dashboard is an operational control tower, not a Kanban clone.

## 1. Primary Dashboard Jobs

The dashboard should answer, in order:

1. What needs attention?
2. What is blocked?
3. What needs human judgment?
4. What work is running?
5. What failed verification?
6. What is consuming cost?
7. What outcomes were delivered?
8. Which workflows/projects do not conform?

Do not optimise the first version around "pretty boards".

---

# 2. Information Architecture

```text
ADLC
├── Home / Command Center
├── Work
│   ├── Initiatives
│   ├── Epics
│   ├── Work Items
│   └── Board
├── Runs
│   ├── Active
│   ├── Scheduled
│   ├── Failed / Parked
│   └── History
├── Human Inbox
│   ├── Gates
│   ├── Decisions
│   └── Exceptions
├── Evidence
├── Outcomes
├── Workflows
├── Workers
├── Memory
├── Conformance
├── Cost
├── Integrations
└── Settings / Policy
```

Do not expose every section in MVP.

---

# 3. Home / Command Center

Preferred first screen:

```text
┌─────────────────────────────────────────────────┐
│ NEED ATTENTION                                  │
│ 4 human decisions · 2 failed verify · 1 blocked │
├─────────────────────────────────────────────────┤
│ ACTIVE                                          │
│ 18 work items · 7 runs · 3 projects             │
├─────────────────────────────────────────────────┤
│ DELIVERY                                        │
│ 12 completed this week · 72% first-pass verify  │
├─────────────────────────────────────────────────┤
│ COST                                            │
│ Today · Week · Background spend · anomalies     │
├─────────────────────────────────────────────────┤
│ CONFORMANCE                                     │
│ repos/workspaces with named gaps                │
└─────────────────────────────────────────────────┘
```

Priority is attention management.

---

# 4. Work Board

Do not use only:

```text
TODO → DOING → DONE
```

Default generic ADLC states:

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

But workflow policy decides which states exist.

Examples:

### Simple Research

```text
READY
→ EXECUTING
→ VERIFYING
→ COMPLETED
```

### High-Risk Infrastructure Change

```text
INTAKE
→ CLARIFY
→ PLANNED
→ GATED
→ EXECUTING
→ VERIFYING
→ NEEDS HUMAN
→ INTEGRATING
→ COMPLETED
```

Board columns must be projections of workflow state, not the source of lifecycle semantics.

---

# 5. Work Item Detail

Recommended layout:

```text
┌──────────────────────────────────────────┐
│ Goal                                     │
│ Why this work exists                     │
├──────────────────────────────────────────┤
│ Scope / Constraints / Acceptance         │
├──────────────────────────────────────────┤
│ Current state                            │
│ Owner / Worker / Workflow                │
├──────────────────────────────────────────┤
│ Runs                                     │
│ #17 PASS                                 │
│ #16 FAIL verification                    │
├──────────────────────────────────────────┤
│ Evidence                                 │
├──────────────────────────────────────────┤
│ Decisions / Gates                        │
├──────────────────────────────────────────┤
│ Outcome                                  │
└──────────────────────────────────────────┘
```

The Work Item page should tell a story of intent → execution → proof.

---

# 6. Run Inspector

This is one of the most important pages.

Show:

```text
Run ID
Work Item
Workflow
Worker/runtime
Model class
Revision/input snapshot
Started / duration
Status

Capabilities
Budget
Context usage
Tool usage
Events
Evidence
Effects
Verification
Cost
Stop reason
```

Timeline example:

```text
10:04 RunStarted
10:05 ContextLoaded
10:06 ToolCalled
10:08 EvidenceRecorded
10:10 VerificationFailed
10:12 ReviseStarted
10:16 VerificationPassed
10:17 RunCompleted
```

Avoid showing raw chain-of-thought.

Show operational events and evidence.

---

# 7. Human Inbox

This should be a first-class product, not a notification afterthought.

Three queues:

```text
GATES
DECISIONS
EXCEPTIONS
```

Example card:

```text
GBU / TASK-231

Decision:
Choose integration approach

Recommended:
Option B

Why:
...

Risk:
...

Evidence:
3 references

Impact:
High / reversible with cost

[Approve]
[Choose Alternative]
[Request More Evidence]
[Defer]
```

The operator should not need to open the full agent transcript to make the decision.

---

# 8. Worker View

Do not treat workers as employees with persona biographies.

Show operational properties:

```text
Worker
Runtime
Model class
Capabilities
Permissions
Current Runs
Success rate
Cost
Last heartbeat
Health
```

Possible worker classes:

```text
Local Claude
Local Codex
Hermes Worker
OpenClaw Worker
Human Expert
Automation
```

---

# 9. Workflow Catalog

Each Expert Workflow card should show:

```text
Purpose
Inputs
Outputs
Capabilities
Risk class
Verification
Human gates
Supported workers
Cost profile
Usage
Success metrics
```

Workflow is reusable procedure.

Worker is executor.

Keep those concepts separate in UX.

---

# 10. Memory UX

Two core views:

## Memory Inspector

```text
Organisation
Workspace
Work Item
Worker
```

For each memory:

```text
source
scope
authority
last used
retrieval count
created by
status
```

Actions:

```text
promote
demote
supersede
archive
forget
```

## Run Context View

Visualise context composition:

```text
Contract
Memory
Tools
Tool Results
Conversation
Remaining
```

This is important for cost debugging.

---

# 11. Cost UX

Avoid one giant "tokens" number.

Show operational cost:

```text
By Project
By Workflow
By Work Item
By Worker
By Model Class
Background vs User-Initiated
Successful vs Failed
```

Highlight anomalies:

```text
Run cost 4× workflow median
Background cost +82% WoW
Worker looping detected
Tool-result context unusually high
```

---

# 12. Conformance UX

Show:

```text
Standard version
Current level
Named findings
Judgment-required items
Gap to next level
Evidence
```

Avoid meaningless scores such as:

```text
87% compliant
```

unless future research proves a meaningful scoring model.

---

# 13. Outcome UX

ADLC must not stop at "Done".

Work Item closure can capture:

```text
Delivered:
Proposal v2

Expected outcome:
Client approval

Observed:
Pending
```

Later:

```text
Observed outcome:
Approved

Impact:
Rp ...
```

This allows the platform to distinguish activity from solution value.

---

# 14. User Flows

## Flow A — Existing Plugin User, No Dashboard

```text
open repo
 ↓
/prime
 ↓
/flow
 ↓
local execution
 ↓
verify
 ↓
close
```

No change required.

---

## Flow B — Existing Plugin User Connects Dashboard

```text
open repo
 ↓
connect workspace
 ↓
/prime
 ↓
dashboard context visible
 ↓
/flow
 ↓
Run registered
 ↓
events/evidence sync
 ↓
dashboard updates
```

---

## Flow C — Dashboard Assigns Work to Local User

```text
Manager creates Work Item
 ↓
assigns owner
 ↓
user opens local runtime
 ↓
/prime sees assigned work
 ↓
user selects Work Item
 ↓
RunEnvelope loaded
 ↓
plugin executes
 ↓
results sync
```

---

## Flow D — Local User Creates Unplanned Work

```text
user:
/flow "investigate X"
 ↓
plugin creates local Work Item
 ↓
connected?
 ├─ no → local only
 └─ yes
      ↓
 register with Control Plane
      ↓
 dashboard gets new Work Item
```

---

## Flow E — Managed Agent Run

```text
Dashboard
 ↓
Create / approve Work Item
 ↓
Gateway
 ↓
select workflow
 ↓
select worker
 ↓
RunEnvelope
 ↓
Hermes/OpenClaw/etc
 ↓
Run events
 ↓
verify
 ↓
complete or park
```

---

## Flow F — Human Gate

```text
Run encounters judgment
 ↓
RunParked
 ↓
Human Inbox
 ↓
operator reviews recommendation + evidence
 ↓
Approve / Reject / More Evidence
 ↓
new Gate event
 ↓
Run resumes or terminates
```

---

## Flow G — Background Scheduled Workflow

```text
Schedule
 ↓
Gateway
 ↓
budget check
 ↓
worker
 ↓
Run
 ↓
stopping condition
 ↓
meaningful result?
 ├─ no → close silently
 └─ yes → notify / create Work Item / request gate
```

Do not notify merely because a background Run executed.

---

# 15. Mobile Priority

Mobile should optimise for:

```text
Human Inbox
Attention feed
Run status
Approve / reject / defer
Critical alerts
```

Do not try to reproduce the entire desktop control plane on mobile.

---

# 16. MVP Sequence

### Dashboard MVP 0 — Observability

- portfolio summary,
- active Work Items,
- Runs,
- human attention,
- evidence refs,
- conformance summary.

Read-only.

### MVP 1 — Connected Work

- create/assign Work Item,
- plugin sync,
- Human Inbox,
- Run Inspector.

### MVP 2 — Managed Execution

- worker registry,
- Run dispatch,
- schedule,
- budgets,
- capability policy.

### MVP 3 — Company Operating Layer

- multiple workflow families,
- outcome tracking,
- organisation policy,
- cross-domain integrations.

---

# 17. UX Guardrail

For every dashboard feature ask:

> Does this help a human understand, decide, intervene, or measure?

If not, it may be operational noise.

The dashboard exists to reduce management load created by autonomous systems, not to visualise every internal action they take.
