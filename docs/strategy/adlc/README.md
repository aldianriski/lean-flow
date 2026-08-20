---
governed: false   # exploratory input — §3 and LAW 3 do not apply to this tree (spec 0.4.2)
owner: Maintainer
last_updated: 2026-08-20
status: current
---

# Lean Flow ADLC — Development Handoff Pack

This pack captures the approved strategic direction for evolving Lean Flow from a proven agentic workflow plugin into an **ADLC — Agentic Development Life Cycle** standard and future operating platform.

ADLC is solution-driven and is **not limited to software development**.

## Read Order

1. `00-ADLC-NORTH-STAR.md`  
   Product purpose, ADLC definition, design philosophy, and infrastructure admission rules.

2. `01-ADLC-PLATFORM-ARCHITECTURE.md`  
   Separation between Standard, Conformance, Protocol, Runtime Adapters, Expert Workflow Packs, and Control Plane.

3. `02-ADLC-DOMAIN-MODEL.md`  
   Canonical vocabulary: Work Item, Run, Workflow, Agent/Worker, Gate, Decision, Evidence, Artifact, Effect, Outcome, Conformance.

4. `03-ADLC-ROADMAP.md`  
   Ordered development path. EPIC-004 and EPIC-005 remain first; platform work comes later.

5. `04-AGENT-DEVELOPMENT-HANDOFF.md`  
   Operational instruction for the development agent. Use this as the immediate continuation brief.

6. `05-HARNESS-RESEARCH-BRIEF.md`  
   Research-only direction inspired by harness architecture. It is not approval to create a custom runtime.

## Recommended Repository Placement

Keep strategic platform direction separate from the normative `spec/` until the ideas have been proven.

Suggested placement:

```text
docs/
└── strategy/
    └── adlc/
        ├── README.md
        ├── 00-ADLC-NORTH-STAR.md
        ├── 01-ADLC-PLATFORM-ARCHITECTURE.md
        ├── 02-ADLC-DOMAIN-MODEL.md
        ├── 03-ADLC-ROADMAP.md
        ├── 04-AGENT-DEVELOPMENT-HANDOFF.md
        └── 05-HARNESS-RESEARCH-BRIEF.md
```

Do not copy these directly into `spec/STANDARD.md`.

The Standard should change only through its existing governance and conformance process.

## Immediate Instruction

The development agent should continue in this order:

```text
EPIC-004 Conformance
        ↓
EPIC-005 Fleet
        ↓
evaluate measured results
        ↓
Platform Era
```

Harness work may proceed as **research only** in parallel.

The future platform must preserve this boundary:

```text
Standard
≠ Plugin
≠ Runtime
≠ Workflow Pack
≠ Control Plane
```

The Control Plane may eventually use databases, queues, schedulers, hooks, custom agents, and other infrastructure when repeated usage proves them necessary. Those implementation choices must not become mandatory requirements of the ADLC Standard by accident.


---

## Platform Extension Documents

After the original six documents, continue with:

7. `06-PLUGIN-CONTROL-PLANE-MIGRATION.md`  
   Permanent coexistence of Local Plugin, Connected Mode, and Managed Control Plane.

8. `07-ADLC-MEMORY-CONTEXT-COST-ARCHITECTURE.md`  
   Memory hierarchy, context retrieval, model routing, tool/skill loading, background cost, and autonomy guardrails.

9. `08-ADLC-DASHBOARD-DESIGN-USER-FLOWS.md`  
   Dashboard IA, command center, work/run/gate/memory/cost views, and end-to-end user flows.

10. `09-ADLC-RUNTIME-GATEWAY-OPERATING-MODEL.md`  
    Future gateway, worker registry, runtime adapter contract, scheduling, budget, capabilities, and Hermes/OpenClaw positioning.

### Updated Platform Sequence

```text
EPIC-004 Conformance
        ↓
EPIC-005 Fleet
        ↓
ADLC Run Protocol
        ↓
Connected Plugin + Shadow Gateway
        ↓
Memory / Context / Cost Controls
        ↓
Dashboard Observability
        ↓
Runtime Gateway + Multi-Worker
        ↓
Managed ADLC
```

Do not implement the full dashboard or native runtime before the protocol and connected-plugin phase prove their real event/data requirements.
