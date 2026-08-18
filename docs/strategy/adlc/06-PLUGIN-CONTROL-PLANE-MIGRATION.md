# Lean Flow — Plugin ↔ Control Plane Migration & Coexistence

> Status: Directional architecture  
> Goal: Preserve the current plugin workflow while introducing a future ADLC dashboard, gateway, and managed execution layer without forcing a destructive migration.

## 1. Core Decision

Do **not** migrate users from the Lean Flow plugin to the dashboard as a one-way cut-over.

Run both permanently.

```text
                    LEAN FLOW ADLC STANDARD
                              │
                ┌─────────────┴─────────────┐
                │                           │
          LOCAL / EDGE MODE             MANAGED MODE
                │                           │
         Lean Flow Plugin              Control Plane
                │                           │
        Claude / Codex / Kimi            Gateway
                                            │
                                 Hermes / OpenClaw /
                                  custom runtime /
                                  future workers
```

The plugin is not a legacy client.

It becomes the first **edge/runtime adapter** for the ADLC protocol.

---

## 2. Supported Operating Modes

### Mode A — Local

```text
User
 ↓
Lean Flow Plugin
 ↓
Local runtime
 ↓
Local/project artifacts
```

Characteristics:

- no dashboard required,
- no central gateway required,
- can work offline,
- standard/conformance still applies,
- suitable for individuals and lightweight work.

### Mode B — Connected

```text
User
 ↓
Lean Flow Plugin
 ↕
ADLC Gateway
 ↕
Control Plane
```

Characteristics:

- user still works from Claude/Codex/Kimi,
- work can originate locally or from the dashboard,
- run events and evidence sync to the Control Plane,
- human approvals can be requested centrally,
- central visibility without surrendering local execution.

### Mode C — Managed

```text
Dashboard / Trigger / Schedule
          ↓
       Gateway
          ↓
    Worker Registry
     /     |      \
Plugin   Hermes  OpenClaw
          ↓
      Run Events
          ↓
     Control Plane
```

Characteristics:

- runs can start without an active local user session,
- scheduling and background work become possible,
- capability/budget policy is mandatory,
- human judgment still parks work where required.

---

## 3. Migration Stages

Do not jump directly to Managed Mode.

### M1 — Observability / Shadow Mode

Plugin behavior remains unchanged.

Add optional event emission:

```text
WorkItemCreated
RunStarted
GateSigned
VerificationPassed
RunCompleted
```

The dashboard is read-only.

Goal:

> learn what the real dashboard needs from real Lean Flow usage.

No workflow authority moves to the dashboard yet.

---

### M2 — Connected Workspace

The dashboard can create or assign Work Items.

Execution still happens through the existing plugin.

```text
Dashboard
  ↓
WorkItem / Run Request
  ↓
Plugin
  ↓
existing Lean Flow procedure
  ↓
Evidence / events
  ↓
Dashboard
```

Local work must remain valid:

```text
/flow "investigate warehouse capacity issue"
```

When connected, the plugin can register the new local Work Item with the Control Plane.

Thus both directions are supported:

```text
Dashboard → Plugin
Plugin → Dashboard
```

---

### M3 — Canonical Run Protocol

Introduce stable concepts:

```text
RunEnvelope
RunEvent
Evidence
Decision
Gate
Effect
```

The plugin becomes a formal runtime adapter.

Target:

```text
Canonical RunEnvelope
      ↓
Claude/Codex/Kimi Adapter
      ↓
Canonical RunEvents
```

---

### M4 — Worker Gateway

Gateway can dispatch compatible RunEnvelopes to multiple workers:

```text
Claude Plugin
Codex Plugin
Kimi Plugin
Hermes
OpenClaw
Custom Runtime
Human Worker
```

Runtime selection is policy.

The Standard does not change when a worker changes.

---

### M5 — Managed ADLC

Introduce only after real repeated use proves the need:

- scheduler,
- triggers,
- worker pool,
- queues,
- retries,
- budgets,
- credentials,
- notifications,
- background runs,
- central HITL inbox.

---

## 4. Authority Model

Avoid dual source of truth.

ADLC is broader than SDLC, so Git must not become the universal authority for every workflow.

Use authority by domain.

### Git / Repository Authority

Good for:

- source code,
- commits,
- repository ADRs,
- versioned standard pins,
- repository evidence,
- releases.

### Control Plane Authority

Good for:

- Work Item operational state,
- Run state,
- scheduling,
- worker assignment,
- live queue status,
- cost,
- notifications,
- central Gate requests.

### External Domain Authority

Examples:

```text
Drive / Docs → proposal or business document
Figma        → design artifact
CRM          → opportunity/customer state
Cloud        → deployed resource state
Git          → source-controlled implementation
```

The ADLC layer stores references and provenance instead of copying every artifact.

---

## 5. Existing Repositories

Do not bulk-import all historical Lean Flow state into a new database.

Preferred path:

```text
Existing Repository
       ↓
Indexer
       ↓
Read-only Projection
       ↓
Dashboard
```

Historical items stay sourced from Git.

New connected Runs start using canonical IDs.

Example:

```text
SPRINT-071
source: git

ADR-025
source: git

run_01H...
source: adlc-ledger
work_item: TASK-142
artifact_ref: git://...@sha
```

This avoids a high-risk migration before the new model is proven.

---

## 6. Compatibility Invariant

> **Connected mode must be additive. Disconnecting the Control Plane must not make the Lean Flow plugin unusable.**

If the Gateway is unavailable:

```text
plugin execution → continues
sync → delayed
```

Use a small local event buffer if needed.

Do not turn the dashboard into a hard dependency for normal local development.

---

## 7. Offline / Reconnect

Candidate local buffer:

```text
event_id
workspace_id
run_id
sequence
timestamp
event_type
payload_digest
sync_state
```

On reconnect:

```text
buffer
 ↓
ordered sync
 ↓
gateway ack
 ↓
mark delivered
```

Do not build a complex offline database until real usage proves it is necessary.

---

## 8. User Migration Experience

Existing user:

```text
Today:
/flow

Future:
/flow
```

No forced learning curve.

Optional connection:

```text
lean-flow connect <workspace>
```

or equivalent host-specific flow.

After connection:

- `/prime` can show connected workspace/run state,
- `/flow` can register a new Work Item or attach to an assigned one,
- Gate requests can appear centrally,
- completion/evidence sync automatically.

The plugin interface stays familiar.

---

## 9. Exit Criteria Before Managed Mode

Do not enable full managed execution until:

```text
[ ] Shadow mode event schema is stable
[ ] >=2 real users/workspaces ran connected
[ ] Local → dashboard sync works
[ ] Dashboard → local execution works
[ ] Run IDs and Work Item IDs are stable
[ ] authority conflicts are explicitly handled
[ ] gateway loss does not block local mode
[ ] budget + capability policy exists
[ ] HITL parking works end-to-end
```

The goal is coexistence, not replacement.
