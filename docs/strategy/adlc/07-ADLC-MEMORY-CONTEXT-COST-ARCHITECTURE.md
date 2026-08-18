# Lean Flow — ADLC Memory, Context & Cost Architecture

> Status: Directional design + research plan  
> Input basis: the Hermes cost-optimisation transcript summary supplied during planning.  
> Important: specific Hermes defaults/thresholds from that transcript are **not** adopted as Lean Flow defaults without measurement.

## 1. Why This Belongs in ADLC

A persistent or managed agent platform can become expensive even when individual tasks are cheap.

Useful mental model:

```text
Cost
≈
Model Cost
× Context Size
× Number of Calls
× Autonomous Activity
```

The cost problem is therefore not only "which model should we use?"

It is also:

- what enters context,
- how often it is sent,
- which tools/skills are exposed,
- how much memory is loaded,
- how many background runs exist,
- how long agents can loop,
- how many sub-agents are spawned.

This must be designed before the platform becomes 24/7.

---

# 2. Memory Architecture

Do not use one universal "agent memory".

Separate memory by purpose and lifetime.

```text
                         MEMORY
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       RUN MEMORY      WORK MEMORY      ORG KNOWLEDGE
     short-lived       durable scoped     durable broad
```

Recommended layers:

## L0 — Run Context

Lifetime:

```text
one Run
```

Contains:

- RunEnvelope,
- current instructions,
- relevant evidence,
- tool results,
- temporary reasoning context.

Disposed/compacted after the Run.

---

## L1 — Work Item Memory

Lifetime:

```text
Work Item / Epic / Initiative
```

Contains durable facts required for continuation:

- accepted decisions,
- unresolved constraints,
- relevant previous evidence,
- important outcomes,
- blockers.

Do not store the full conversation.

---

## L2 — Workspace / Project Memory

Contains stable working context:

- product/project conventions,
- architecture,
- stakeholders,
- domain vocabulary,
- durable operating rules.

Retrieve on demand.

Do not automatically inject all of it into every Run.

---

## L3 — Organisation Knowledge

Examples:

- company policies,
- brand guidelines,
- reusable business knowledge,
- approved standards,
- team practices.

This should behave like searchable knowledge, not a giant system prompt.

```text
Run
 ↓
knowledge search
 ↓
relevant chunks
 ↓
context
```

---

## L4 — Worker Profile

Keep minimal.

Contains only worker-specific execution configuration:

- capabilities,
- permission policy,
- preferred runtime/model class,
- cost limits,
- language/format preference if truly stable.

Do not treat worker profile as an ever-growing personality memory.

---

# 3. Memory Write Policy

Auto-memory is not automatically good or bad.

Use a value test.

A candidate memory should be written only when it is:

```text
durable
+
likely reusable
+
costly to rediscover
+
safe to retain
```

Possible classes:

```text
FACT
DECISION
PREFERENCE
CONSTRAINT
LEARNING
RELATIONSHIP
OUTCOME
```

Reject:

- one-off instructions,
- temporary output formatting,
- incorrect intermediate hypotheses,
- duplicated repository facts,
- tool output that already has an authoritative artifact.

---

# 4. Memory Promotion

Do not let every Run write permanent memory.

Use promotion:

```text
Run Context
    ↓ candidate
Work Memory
    ↓ repeated / approved
Workspace Memory
    ↓ broadly reusable
Organisation Knowledge
```

The higher the scope, the stronger the admission requirement.

Example:

```text
"Output this run as JSON"
→ L0 only

"Client requires Indonesian formal language"
→ Work/Workspace candidate

"All company proposals require legal review"
→ Organisation policy candidate
```

---

# 5. Memory Retrieval

Default:

> retrieve, do not preload.

Candidate retrieval flow:

```text
RunEnvelope
    ↓
context planner
    ↓
required knowledge classes
    ↓
search/filter
    ↓
small relevant memory pack
    ↓
worker
```

Measure:

```text
memory_tokens_loaded
memory_items_used
memory_items_unused
retrieval_latency
memory_hit_rate
```

A memory item repeatedly loaded but never used is a cost defect.

---

# 6. Conversation / Context Lifecycle

Do not equate a persistent worker with a persistent conversation.

Preferred architecture:

```text
Persistent Worker Identity
          +
Fresh / bounded Runs
          +
Durable ADLC Memory
```

rather than:

```text
one endless conversation
```

A new Run reconstructs required context from:

```text
Work Item
Decisions
Evidence
Memory
Artifacts
Workflow Contract
```

This is easier to audit and cheaper to operate.

---

# 7. Compaction

Context compaction should be policy-driven.

Candidate triggers:

- token pressure,
- number of turns,
- repeated low-value history,
- tool-output growth,
- Run boundary.

Compaction result should preserve:

```text
goal
accepted decisions
constraints
open questions
current state
evidence references
next action
```

Do not preserve every correction chain.

Do not copy a provider-specific threshold into the Standard.

Threshold belongs in runtime policy.

---

# 8. Correction / Undo Semantics

The supplied Hermes insight recommends avoiding long chains of correction when an earlier path was simply wrong.

Lean Flow adaptation:

### For mutable local Run context

Support:

```text
rewind / restart Run
```

when safe.

### For durable ADLC state

Never erase accepted facts silently.

Use:

```text
supersedes
corrects
invalidates
```

Example:

```text
Decision D12
status: superseded
superseded_by: D19
```

This combines cost efficiency with auditability.

---

# 9. Capability Loading

Context cost includes tool schemas and skill metadata.

Therefore use capability profiles.

Example:

```text
Research Workflow
├── web
├── documents
└── knowledge search

Software Implementation
├── repo
├── shell
├── test
└── git

Proposal Workflow
├── documents
├── CRM read
└── pricing data
```

Rule:

> expose only the capabilities relevant to the Run.

Do not give every worker every MCP/tool/skill.

---

# 10. Skill Loading

Large Expert Workflow libraries must not mean all workflow headers are injected into every Run.

Candidate pattern:

```text
Workflow Catalog
      ↓ search/classify
Selected Workflow(s)
      ↓
load full contract
```

Catalog metadata should be compact.

Full instructions load only after selection.

---

# 11. Tool / MCP Search

Prefer:

```text
small always-visible capability index
        ↓
search
        ↓
load needed tool schema
```

over:

```text
all MCP tools
all schemas
every request
```

This becomes increasingly important as the company connects:

- GitHub,
- Drive,
- Calendar,
- CRM,
- Figma,
- cloud,
- internal systems.

---

# 12. Tool Result Budget

Every runtime adapter should support a model-visible output budget.

Long results should be handled by:

```text
raw result → artifact/reference
          +
reduced model-visible projection
```

Example:

```text
100 MB logs
   ↓
store/reference full artifact
   ↓
return:
- error summary
- relevant 200 lines
- artifact ref
```

Do not destroy evidence merely to reduce context.

---

# 13. Model Routing

Use model class based on task complexity.

Conceptual classes:

```text
MECHANICAL
LOW_REASING
GENERAL
STRONG_REASONING
SPECIALIST
```

Possible routing:

| Work | Model Class |
|---|---|
| formatting / extraction | mechanical / cheap |
| metadata classification | low reasoning |
| summarisation | low–general |
| implementation | general |
| architecture | strong reasoning |
| ambiguous high-impact decision | strong reasoning |
| simple background maintenance | cheap |

Do not encode vendor model names in the Standard.

Runtime policy maps class → model.

---

# 14. Reasoning Budget

Reasoning effort is another budget dimension.

Candidate policy:

```text
rename / transform     → low
extract / classify     → low
summarise              → low-medium
implement              → medium
debug hard failure     → high
architecture decision  → high
```

Track whether higher reasoning actually improves success.

---

# 15. Autonomous Activity Guardrails

Every managed Run should have explicit ceilings.

Candidate Run policy:

```yaml
budget:
  max_cost:
  max_turns:
  max_duration:
  max_output_tokens:
  max_subagents:

stopping:
  no_progress_limit:
  hard_stop: true
```

Exact defaults must be measured.

The Standard should require bounded autonomy, not one universal number.

---

# 16. Scheduled / Background Work

Every scheduled Run requires:

```text
schedule
workflow
model class
capabilities
budget
stopping condition
notification policy
owner
```

Reject:

```text
"run every hour"
```

without a termination/cost policy.

Background work is where small inefficiencies multiply into continuous spend.

---

# 17. Cost Telemetry

Control Plane should eventually expose:

```text
cost per Run
cost per Work Item
cost per Workflow
cost per Project
cost per Worker
cost per model class
background cost
failed-run cost
verification cost
```

Also track efficiency:

```text
cost per accepted outcome
cost per verified deliverable
```

Raw token counts alone are not enough.

---

# 18. Dashboard Memory Surfaces

Recommended memory UI:

### Memory Inspector

Show:

```text
Scope
Source
Last used
Times retrieved
Cost impact
Authority
Status
```

Actions:

```text
Promote
Demote
Archive
Supersede
Forget
Pin
```

### Context Inspector

For one Run:

```text
Context Budget

Run Contract      8%
Work Memory       6%
Workspace Memory  5%
Tool Schemas      9%
Tool Results     22%
Conversation     31%
Remaining        19%
```

Goal: make context cost observable rather than mysterious.

---

# 19. Metrics

Start with:

```text
input_tokens_per_run
output_tokens_per_run
cached_tokens_if_available
memory_tokens_loaded
tool_schema_tokens
tool_result_tokens
turns_per_run
subagents_per_run
background_runs_per_day

cost_per_run
cost_per_verified_work_item
cost_per_outcome

context_compactions
restarts
hard_stops
no_progress_stops
```

Then use evidence to tune runtime policy.

---

# 20. Design Principle

> **Optimise away tokens that do not contribute to the solution, not quality that does.**

High-value memory may be worth its cost.

Expensive reasoning may be justified on high-impact decisions.

The objective is not "cheapest possible agent".

The objective is:

```text
minimum waste
for required quality
under explicit risk
```
