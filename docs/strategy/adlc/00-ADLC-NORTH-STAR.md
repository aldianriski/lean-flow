# Lean Flow — ADLC North Star

> Status: Directional / handoff reference  
> Scope: Product vision and design boundary  
> Meaning of ADLC: **Agentic Development Life Cycle**

## 1. Purpose

Lean Flow is evolving from a portable agentic workflow plugin into an **open standard and operating system for solution-driven agentic development**.

The target is **not limited to software development**.

ADLC treats "development" as the process of turning an intent, problem, opportunity, or desired outcome into a verified solution through structured human-agent collaboration.

A software feature is one possible solution.

Other examples include:

- business process design,
- operational improvement,
- infrastructure change,
- research and analysis,
- security remediation,
- content and communication workflows,
- sales and proposal preparation,
- recruitment,
- compliance work,
- product discovery,
- documentation,
- data analysis,
- automation,
- organisational change.

The core object is therefore **solution development**, not code production.

---

## 2. North Star

> **Lean Flow is an open, model-agnostic standard and operating system for provable agentic solution delivery.**

The platform should allow an organisation to:

1. receive intent or a problem,
2. remove ambiguity,
3. decide what solution is needed,
4. decompose work into governed units,
5. delegate work to the right expert workflow,
6. execute through one or many agents,
7. verify outputs against predetermined evidence,
8. escalate judgment to humans where required,
9. integrate results,
10. measure delivery, quality, cost, risk, and conformance,
11. operate many projects and workflows from one control plane.

---

## 3. ADLC Mental Model

```text
INTENT / PROBLEM / OPPORTUNITY
            │
            ▼
      DISCOVERY / FOG
            │
            ▼
      DECISION CLEARING
            │
            ▼
      SOLUTION DEFINITION
            │
            ▼
    VERIFICATION DESIGN
            │
            ▼
       WORK DECOMPOSITION
            │
            ▼
        GOVERNED PLAN
            │
            ▼
     EXPERT WORKFLOW ROUTING
            │
            ▼
          EXECUTION
            │
            ▼
        VERIFICATION
            │
            ▼
         INTEGRATION
            │
            ▼
      HUMAN JUDGMENT GATE
       where necessary
            │
            ▼
        OUTCOME / RELEASE
            │
            ▼
        LEARN / IMPROVE
```

This is intentionally broader than SDLC.

---

## 4. SDLC Position

SDLC is a **workflow family inside ADLC**, not the definition of ADLC.

```text
ADLC
├── Software Development
├── Infrastructure / DevOps
├── Security
├── Product / Research
├── Operations
├── Sales / Proposal
├── Marketing / Content
├── Recruitment
├── Compliance
├── Finance / Administration
└── future solution-development workflows
```

The initial implementation may remain strongest in software delivery because that is where Lean Flow currently has the most mature evidence and real usage.

Do not hard-code software assumptions into the core standard if the concept is actually generic.

---

## 5. Core Philosophy

### 5.1 Solution-driven, not agent-driven

Agents are workers.

The system must optimise for:

```text
problem
→ decision
→ solution
→ evidence
→ outcome
```

not:

```text
agent
→ activity
→ more agent activity
```

### 5.2 Evidence before autonomy

Higher autonomy is earned by stronger contracts, not granted by enthusiasm.

Every workflow should answer:

- What is the goal?
- What is the expected output?
- What proves the output is acceptable?
- Which decisions require a human?
- Which actions are reversible?
- Which actions are irreversible or high-risk?

### 5.3 Standard is independent from implementation

The normative ADLC standard must remain:

- model-agnostic,
- tool-agnostic where possible,
- versioned,
- portable,
- independently conformable.

Claude Code, Codex, future runtimes, dashboard, scheduler, and hosted services are implementations or consumers.

### 5.4 Infrastructure is graduated, not forbidden

Old lesson:

> Do not create infrastructure without demonstrated use.

New rule:

> **Start infrastructure-free. Graduate infrastructure only when repeated usage proves the need.**

Hooks, services, databases, queues, custom agents, dashboards, and schedulers are allowed when evidence proves that the simpler form is insufficient.

They are not default architecture.

---

## 6. Admission Rules for New Infrastructure

A new infrastructure component must answer all of these:

1. What repeated friction or failure does it solve?
2. What evidence proves the friction exists?
3. Why can the current simpler mechanism not solve it?
4. Who owns the new state?
5. What is its lifecycle?
6. How is it removed or migrated?
7. What becomes the new source of truth?
8. How is the behaviour verified?
9. What new failure mode does it introduce?
10. What metric will prove the investment improved the system?

### Custom Agent

Create a custom agent only when there is a real capability boundary such as:

- different permissions,
- different tool set,
- different model,
- different budget,
- isolated context,
- different security policy,
- different verification policy.

Do not create an agent merely to encode a persona.

### Hooks

Introduce hooks only for deterministic lifecycle observation or enforcement that cannot be reliably achieved through the current workflow.

Every hook must have:

```text
trigger
owner
effect
inverse / cleanup
failure semantics
evidence
```

### Scaffold / Durable State

Create durable scaffold only when information must survive across sessions, repos, or runtime instances.

Every durable artifact must have:

```text
owner
authority
create trigger
update trigger
archive trigger
delete / migrate rule
```

---

## 7. Expert Workflow, Not Agent Zoo

Do not organise the system around dozens of persona agents.

Prefer reusable **Expert Workflow Packs**.

Example:

```text
SYSTEM ANALYSIS WORKFLOW

Input
├── problem
├── business context
├── constraints
└── current system

Procedure
├── ambiguity analysis
├── requirement discovery
├── domain analysis
├── impact analysis
└── acceptance definition

Capabilities
├── repository read
├── document read
├── search
└── optional external research

Output
├── requirement map
├── impacted areas
├── assumptions
├── decisions required
├── solution options
└── downstream work candidates

Escalation
└── unresolved business judgment → human

Verification
└── completeness + consistency evidence
```

Any compatible runtime or model can execute the workflow.

```text
Expert Workflow
       │
       ├── Claude
       ├── Codex
       ├── future model
       └── human specialist
```

---

## 8. Success Condition

Lean Flow succeeds when an organisation can operate multiple types of solution-development work through one shared ADLC standard without requiring every workflow to become software development.

The system should be able to answer:

```text
What are we trying to solve?
What work exists?
Why does it exist?
Who or what is working on it?
What evidence exists?
What failed?
What needs human judgment?
What is blocked?
What changed?
What did it cost?
What outcome was achieved?
```

That is the target.
