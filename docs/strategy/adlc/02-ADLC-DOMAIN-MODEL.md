# Lean Flow — ADLC Domain Model

> Status: Working vocabulary  
> Purpose: Prevent dashboard, workflow, runtime, and standard from using conflicting concepts.

## 1. Core Hierarchy

Recommended conceptual hierarchy:

```text
Organisation / Workspace
        │
        ▼
Portfolio / Product / Project
        │
        ▼
Initiative
        │
        ▼
Epic
        │
        ▼
Work Package / Sprint / Change Set
        │
        ▼
Work Item
        │
        ├──────────────┬───────────────┐
        ▼              ▼               ▼
       Run          Decision          Gate
        │
        ▼
     Evidence
        │
        ▼
     Artifact
```

Not every workflow requires every level.

The model must support lightweight and heavyweight work.

---

## 2. Work Item

A Work Item is a unit of desired outcome.

It is not an agent run.

It may represent:

- software change,
- analysis,
- research,
- proposal,
- design,
- security remediation,
- operational action,
- hiring task,
- content package,
- business process improvement.

Minimum conceptual fields:

```text
id
type
goal
scope
owner
status
dependencies
constraints
acceptance / done-when
risk
references
```

---

## 3. Run

A Run is one execution attempt against a Work Item.

One Work Item may have many Runs.

Example:

```text
TASK-142
  Run 1 — builder — failed verification
  Run 2 — builder revise — passed
  Run 3 — verifier — passed
  Run 4 — security verifier — passed
```

A Run should capture:

```text
run_id
work_item_id
workflow_id
runtime
model / worker
revision / input snapshot
capabilities
budget
status
timestamps
events
evidence
effects
cost
result
```

This separation is critical.

Do not model:

```text
agent = task
```

Agents are execution resources.

Tasks are delivery objects.

---

## 4. Workflow

A Workflow is a reusable procedure for solving a class of problem.

Example:

```text
workflow: solution-analysis
```

A workflow defines:

```text
purpose
admission criteria
required inputs
procedure
capability needs
output contract
verification contract
escalation rules
risk policy
```

A workflow is not necessarily bound to an AI model.

Possible workers:

```text
AI runtime
human expert
hybrid
automation
```

---

## 5. Agent / Worker

Agent is one possible executor.

The platform should represent it as a worker with declared capabilities, not as organisational authority.

Candidate worker properties:

```text
worker_id
runtime
model
capabilities
permissions
cost profile
context profile
availability
policy
```

An Expert Workflow should normally be reusable across workers.

---

## 6. Decision

A Decision records a choice that changes direction.

It should answer:

```text
question
options
selected option
reason
authority
evidence
date
impact
reversibility
```

Not every decision requires an ADR.

ADR remains useful for durable/high-impact architectural or governance decisions.

The platform may represent smaller operational decisions without creating repository ADR files.

---

## 7. Gate

A Gate is an authority boundary.

Examples:

```text
scope approval
design approval
security approval
financial approval
production release
legal approval
client approval
```

Gate properties:

```text
gate_id
type
required authority
subject revision
status
decision
signer
evidence
timestamp
```

Gate semantics must distinguish:

```text
requested
approved
rejected
overridden
expired
superseded
```

---

## 8. Evidence

Evidence proves or supports a claim.

Examples:

- test result,
- command result,
- screenshot,
- document,
- diff,
- commit,
- benchmark,
- review result,
- approval signature,
- external source.

Evidence should identify:

```text
claim
source
producer
revision
timestamp
integrity reference where possible
```

Do not treat a narrative statement such as "tested successfully" as equivalent to retained evidence.

---

## 9. Artifact

Artifact is a produced object.

Examples:

- code,
- document,
- proposal,
- diagram,
- report,
- dataset,
- deployment,
- design,
- configuration,
- contract draft.

Artifact and Evidence are different.

An artifact may become evidence, but not every artifact proves acceptance.

---

## 10. Effect

Effect is a live environmental change caused by execution.

Examples:

```text
worktree
process
server
temporary file
lock
background job
sandbox
port
cloud resource
```

Effects require lifecycle ownership.

```text
created
active
disposed
leaked
transferred
```

---

## 11. Conformance

Conformance answers whether a workspace/repo/process follows a version of the ADLC standard.

Conceptual result:

```text
standard_version
level
mechanical_checks
judgment_only_checks
findings
gap_to_next_level
evidence
```

Conformance is different from task verification.

```text
Task verification:
Did this work satisfy its acceptance contract?

Conformance:
Did this process follow the standard?
```

Both matter.

---

## 12. Outcome

Outcome is the real-world result the work intended to create.

This is important for the solution-driven direction.

Examples:

```text
conversion increased
warehouse process improved
proposal submitted
incident resolved
customer requirement clarified
deployment completed
manual work reduced
risk removed
```

Completion of a task is not automatically proof of outcome.

The platform should eventually distinguish:

```text
DELIVERY
what was produced

OUTCOME
what changed because of it
```

---

## 13. Generic ADLC Flow

The default conceptual flow:

```text
Intent
→ Clarify
→ Decide
→ Define Solution
→ Define Evidence
→ Plan
→ Execute
→ Verify
→ Integrate
→ Human Judgment where needed
→ Deliver
→ Observe Outcome
→ Learn
```

Workflow packs can shorten, branch, or extend this flow under policy.
