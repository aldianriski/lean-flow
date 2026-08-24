# Lean Flow — Pre-Epic Foundation Hardening V3

> **Status:** Authoritative development handoff for the next foundation-hardening pass.  
> **Supersedes:** `LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V2.md`.  
> **Reference-engine direction:** **TypeScript + Bun**.  
> **Architecture standard:** **Clean Architecture + SOLID + Feature-Driven Development + Test-Driven Development**.  
> **Purpose:** strengthen execution continuity, unattended autonomy, QA correctness/performance, and migrate the reference evaluator away from the growing Bash/Awk implementation before continuing the roadmap epics.  
> **Boundary:** this is foundation hardening, not a new Control Plane / Dashboard / Gateway epic.

---

# 0. North-Star

Lean Flow must remain:

```text
STANDARD
normative
model-agnostic
runtime-agnostic
tool-agnostic where practical
```

The TypeScript/Bun implementation is:

```text
REFERENCE IMPLEMENTATION
not the Standard itself
```

The implementation must be replaceable without changing Lean Flow's meaning.

The desired long-term relationship is:

```text
Lean Flow Standard
       │
       ▼
Typed Domain + Contracts
       │
       ├─────────────┬──────────────┬───────────────┐
       ▼             ▼              ▼               ▼
      CLI        Local Plugin    Dashboard       Gateway
       │             │              │               │
       └─────────────┴──────────────┴───────────────┘
                           │
                           ▼
                       same semantics
```

The dashboard must consume the same domain truth.

The dashboard must **never become a second hidden source of truth**.

---

# 1. Major Architecture Decision

The current Bash/Awk conformance + QA implementation has proven the rules, but it is no longer the preferred foundation for the next growth stage.

Current characteristics already observed in the repository:

```text
large shell driver
many independent scripts
repeated grep/awk/sed/git process spawning
fixture runners invoking the full engine repeatedly
serial QA orchestration
Markdown increasingly treated as semi-structured database text
```

The migration decision is:

> **Move semantic parsing, repository analysis, conformance evaluation, QA orchestration, structured results, and deterministic eval infrastructure into TypeScript running on Bun.**

Shell remains appropriate for thin operational glue:

```text
bootstrap
installer
launch wrappers
OS integration
night-run launcher where shell is the natural host surface
```

Shell should no longer own:

```text
Markdown semantic parsing
Standard semantic model
rule registry
repository fact model
conformance domain logic
QA scheduler
test-domain orchestration
structured result model
```

---

# 2. Non-Negotiable Engineering Principles

Every new TypeScript implementation in this hardening must obey these principles.

---

## 2.1 Clean Architecture

Dependency direction:

```text
External Systems / UI / CLI
          │
          ▼
      Adapters
          │
          ▼
     Application
          │
          ▼
        Domain
```

The Domain never imports:

```text
Bun
filesystem implementation
Git command implementation
remark implementation
CLI parser
dashboard framework
HTTP server
database
```

The outer layers depend inward.

Never the reverse.

---

## 2.2 SOLID

### S — Single Responsibility

Examples:

Bad:

```text
ConformanceEngine
- parses Markdown
- executes git
- scans files
- prints CLI output
- computes level
- writes JSON
```

Good:

```text
StandardParser
RepositoryScanner
GitHistoryReader
ConformanceEvaluator
ConformanceReporter
CliRenderer
JsonRenderer
```

---

### O — Open / Closed

New rule families should be added primarily by:

```text
new rule evaluator
+
registration
```

not by editing a giant central switch throughout the codebase.

---

### L — Liskov Substitution

Ports/adapters must behave consistently.

Example:

```ts
interface RepositoryReader {
  listFiles(): Promise<RepoFile[]>
  readText(path: RepoPath): Promise<string>
}
```

A local FS adapter and a fixture/in-memory adapter must satisfy the same contract.

Tests should be able to replace infrastructure without changing domain behavior.

---

### I — Interface Segregation

Do not create:

```ts
interface RepositoryEverything {
  read()
  write()
  git()
  network()
  delete()
  deploy()
  ...
}
```

Prefer small capability ports:

```text
DocumentReader
FileInventory
GitHistoryReader
Clock
ProcessRunner
```

A rule receives only the capability it needs.

---

### D — Dependency Inversion

Use cases depend on interfaces/contracts, not Bun APIs or concrete Git processes.

Example:

```text
Conformance Use Case
       │
       ▼
GitHistoryPort
       ▲
       │
BunGitAdapter
```

---

# 3. Feature-Driven Development Standard

Lean Flow must not migrate into a generic technical-layer project where work is planned as:

```text
"build parser"
"build repository layer"
"build service layer"
```

without a user-visible behavior.

Development should be organized around **vertical feature slices**.

Example feature:

```text
FEATURE:
Check one conformance rule by ID
```

The slice includes, as needed:

```text
domain behavior
application use case
parser support
repository adapter
CLI surface
tests
compatibility proof
```

Target shape:

```text
Feature
├── acceptance
├── domain behavior
├── use case
├── ports
├── adapter changes
├── CLI/API surface
└── tests
```

Not:

```text
Sprint 1: all domain classes
Sprint 2: all adapters
Sprint 3: all CLI
Sprint 4: maybe test it
```

---

# 4. Test-Driven Development Standard

Behavior must be proven before implementation is considered complete.

Use:

```text
RED
→ GREEN
→ REFACTOR
```

For migrated behavior, add one additional step:

```text
PARITY
```

So migration becomes:

```text
RED
new TS test proves expected contract does not yet exist

GREEN
minimal TS behavior passes

PARITY
TS result matches retained Shell semantic contract

REFACTOR
improve structure without changing behavior
```

---

# 5. Definition of "Test First"

Test-first does not mean every private helper needs a unit test before typing it.

The required unit is **observable behavior**.

Examples:

```text
Given a frozen sprint plan edited without a scope-change record
When S9.PLANFROZEN is evaluated
Then finding `plan-edited-after-freeze` is returned
```

or:

```text
Given a soft document target of 150
When actual lines are 151
Then severity is WARN
And QA does not fail
```

The test should express:

```text
business/rule behavior
```

not implementation details.

---

# 6. Testing Pyramid for Lean Flow

Use five layers.

---

## Layer 1 — Domain Unit Tests

Fastest.

No filesystem where avoidable.

No Git process.

No subprocess.

Example:

```text
rule classification
severity policy
level arithmetic
authority classification
run terminal-state rules
document budget classification
```

Target:

```text
milliseconds
```

---

## Layer 2 — Component Tests

Use a real parser or real repository scanner against isolated fixture data.

Examples:

```text
Markdown AST → StandardModel
frontmatter → DocumentMetadata
file tree → RepositoryFacts
```

Still deterministic.

---

## Layer 3 — Adapter Integration Tests

Use actual:

```text
temporary filesystem
temporary Git repo
Bun subprocess where necessary
```

Examples:

```text
Git history semantics
shallow clone behavior
worktree behavior
actual compiled CLI invocation
```

These can be slower.

---

## Layer 4 — Contract / Differential Tests

During migration:

```text
Shell
vs
TypeScript
```

Compare semantic contract:

```text
Rule ID
Finding ID
Severity
Level/Hold semantics
selected scope
exit meaning
```

Do not require byte-identical stdout.

---

## Layer 5 — End-to-End / Dogfood

Examples:

```text
real sprint-bulk
real overnight
real full QA
real compiled CLI
```

Used at the correct workflow boundary.

Not after every source edit.

---

# 7. Clean Target Repository Architecture

Target conceptual shape:

```text
lean-flow/
│
├── apps/
│   └── cli/
│       ├── src/
│       │   ├── main.ts
│       │   ├── commands/
│       │   │   ├── qa.ts
│       │   │   └── conformance.ts
│       │   └── renderers/
│       │       ├── text.ts
│       │       └── json.ts
│       └── tests/
│
├── packages/
│   │
│   ├── domain/
│   │   ├── src/
│   │   │   ├── conformance/
│   │   │   ├── qa/
│   │   │   ├── workflow/
│   │   │   ├── authority/
│   │   │   └── common/
│   │   └── tests/
│   │
│   ├── standard/
│   │   ├── src/
│   │   │   ├── parser.ts
│   │   │   ├── model.ts
│   │   │   └── validation.ts
│   │   └── tests/
│   │
│   ├── conformance/
│   │   ├── src/
│   │   │   ├── evaluate.ts
│   │   │   ├── registry.ts
│   │   │   └── rules/
│   │   └── tests/
│   │
│   ├── repository/
│   │   ├── src/
│   │   │   ├── ports/
│   │   │   ├── scanner.ts
│   │   │   ├── facts.ts
│   │   │   └── adapters/
│   │   └── tests/
│   │
│   ├── qa/
│   │   ├── src/
│   │   │   ├── runner.ts
│   │   │   ├── profile.ts
│   │   │   ├── scheduler.ts
│   │   │   └── result.ts
│   │   └── tests/
│   │
│   └── contracts/
│       ├── src/
│       │   ├── conformance-result.ts
│       │   ├── qa-result.ts
│       │   ├── run-result.ts
│       │   ├── evidence.ts
│       │   └── events.ts
│       └── tests/
│
├── test/
│   ├── fixtures/
│   ├── differential/
│   └── e2e/
│
├── skills/
├── spec/
├── docs/
├── scripts/
└── ...
```

Exact package naming may change after implementation reconnaissance.

The dependency rule must not.

---

# 8. Dependency Boundaries

Allowed direction:

```text
contracts
   ↑
domain
   ↑
application packages
   ↑
adapters
   ↑
apps/cli
```

Example:

```text
packages/domain
```

must never import:

```text
apps/cli
Bun.spawn
remark
filesystem adapters
```

`packages/standard` may use Markdown parsing infrastructure internally, but should return domain-friendly typed models.

The domain should not care how Markdown was parsed.

---

# 9. Domain Model for Conformance

Example conceptual types:

```ts
type RuleId = string
type FindingId = string

type Severity =
  | "note"
  | "warn"
  | "hold"
  | "fail"

type ConformanceLevel =
  | "structural"
  | "gated"
  | "attested"

type RuleMark =
  | "mechanical"
  | "split"
  | "judgment-only"
  | "implementation-directed"

interface StandardRule {
  id: RuleId
  section: number
  level: ConformanceLevel
  mark: RuleMark
  source: SourceLocation
}

interface Finding {
  ruleId: RuleId
  findingId: FindingId
  severity: Severity
  message: string
  evidence: EvidenceRef[]
}

interface RuleEvaluation {
  ruleId: RuleId
  status:
    | "pass"
    | "finding"
    | "gap"
    | "excluded"
    | "hold"
  findings: Finding[]
}

interface ConformanceResult {
  scope: "full" | "section" | "rule"
  evaluations: RuleEvaluation[]
  achievedLevel?: ConformanceLevel
  durationMs: number
}
```

Important:

```text
partial rule execution
≠
global conformance certification
```

A rule-targeted invocation must not emit a misleading global level.

---

# 10. Domain Model for QA

```ts
type QaProfile =
  | "fast"
  | "standard"
  | "full"

interface QaCheckResult {
  id: string
  severity: Severity
  durationMs: number
  findings: Finding[]
}

interface QaRunResult {
  profile: QaProfile
  checks: QaCheckResult[]
  status:
    | "pass"
    | "hold"
    | "fail"
  durationMs: number
}
```

The domain result must exist independently from text rendering.

---

# 11. Domain Model for Execution Outcomes

Build now only what current hardening needs.

Do not implement the future full Run Protocol.

Conceptual:

```ts
type RunStatus =
  | "delivered"
  | "partial"
  | "failed"

type TerminalReason =
  | "plan-exhausted"
  | "authority-boundary"
  | "hard-failure"
  | "budget-stop"
  | "user-stop"

interface RunSummary {
  status: RunStatus
  terminalReason: TerminalReason

  tasksTotal: number
  tasksAttempted: number
  tasksCompleted: number

  j1Decisions: number
  j2Parks: number

  repairCycles: number

  verification:
    | "pass"
    | "hold"
    | "fail"
    | "not-eligible"
}
```

This is a reference implementation structure, not Protocol v1.

EPIC-008 still owns actual portable Run Protocol design.

---

# 12. Dashboard-Readiness Principle

The dashboard will eventually need:

```text
work state
runs
verification
evidence
conformance
cost
human gates
warnings
```

Do not make the CLI stdout the interface.

Build:

```text
Domain Result
     │
     ├── Text Renderer
     ├── JSON Renderer
     └── future Event/Control-Plane Adapter
```

Not:

```text
printf(...)
↓
dashboard parses CLI strings
```

---

# 13. Contracts Package Rule

`packages/contracts` exists only for cross-boundary stable data.

Do not move every internal interface there.

Candidate cross-boundary contracts:

```text
ConformanceResult
QaRunResult
RunSummary
EvidenceRef
future semantic event payloads
```

Internal implementation details stay internal.

This prevents a giant "shared" package.

---

# 14. Dashboard Authority Rule

Future dashboard:

```text
reads projections
issues permitted commands
displays status
```

It must not silently redefine:

```text
Standard rule semantics
Git-owned source truth
approved Plan
evidence
gate authority
```

The architecture must preserve:

```text
Standard
≠
Dashboard

Domain
≠
UI
```

---

# 15. Event-Ready, Not Event-Sourced

Do not build event sourcing now.

But important state transitions should have domain events available.

Examples:

```text
QaCompleted
ConformanceCompleted
RunCompleted
RunParked
VerificationPassed
VerificationFailed
```

Use typed events internally where useful.

Do not add:

```text
Kafka
queue
event DB
```

during this hardening.

---

# 16. Feature Folder Rule

Prefer cohesion.

Within a package, a feature may own:

```text
evaluate-rule.ts
evaluate-rule.test.ts
types.ts
```

rather than splitting tiny technical categories endlessly.

Use architecture boundaries at package/module level.

Use feature cohesion inside them.

Avoid:

```text
controllers/
services/
repositories/
utils/
helpers/
models/
```

as giant global dumping grounds.

---

# 17. No Generic `utils.ts`

A helper must live near the concept it supports.

Bad:

```text
packages/core/src/utils.ts
```

Good:

```text
packages/standard/src/table-parser.ts
packages/repository/src/path-normalization.ts
```

Shared code is earned by real duplication.

---

# 18. Side-Effect Boundary

Pure domain/application code should not directly call:

```text
Bun.file
Bun.spawn
process.cwd
Date.now
Math.random
```

where behavior needs deterministic testing.

Inject ports such as:

```text
Clock
FileReader
ProcessRunner
GitReader
```

only where a seam provides real value.

Do not interface every one-line pure helper.

---

# 19. Error Model

Avoid stringly-typed failures internally.

Example:

```ts
type EngineError =
  | { type: "SpecUnreadable"; path: string }
  | { type: "UnknownRule"; ruleId: string }
  | { type: "RepositoryUnavailable"; path: string }
```

CLI renderer turns them into human output.

Tests assert error types.

Not arbitrary stdout strings.

Named **Finding IDs** remain compatibility contracts for rule violations.

---

# 20. Markdown Parsing Standard

Target:

```text
Markdown
→ AST
→ semantic model
```

Do not reproduce the current behavior as:

```text
TypeScript regex port of every awk expression
```

That would migrate language but preserve the wrong architecture.

Use an AST parser for:

```text
headings
tables
task lists
source locations
structured sections
```

Frontmatter may use a dedicated parser if justified.

The Standard parser returns:

```text
StandardDocument
```

not arbitrary AST nodes to downstream rule evaluators.

---

# 21. Repository Fact Model

Scan once per repository evaluation where practical.

Conceptual:

```ts
interface RepositoryFacts {
  files: FileFact[]
  documents: DocumentFact[]
  manifests: ManifestFact[]
  sprints: SprintFact[]
  adrs: AdrFact[]
  research: ResearchFact[]
  git: GitFacts
}
```

Do not precompute every future possible fact.

Use measured need.

Initial facts should target the expensive duplicated scans already observed.

---

# 22. QA Profiles

Required:

```text
FAST
STANDARD
FULL
```

---

## FAST

Used:

```text
during active development
after small feature change
before scoped reviewer where useful
```

Contains:

```text
unit tests
relevant component tests
targeted rule checks
cheap deterministic checks
```

---

## STANDARD

Used:

```text
task/wave integration
normal System Verify
pre-merge
```

Contains:

```text
FAST
+
deterministic fixture families
+
moderate integration
+
full conformance where required by scope
```

---

## FULL

Used:

```text
core engine changes
Standard semantic changes
sprint close where policy requires it
release candidate
CI/nightly
explicit owner request
```

Contains:

```text
all deterministic regression suites
heavy Git/history fixtures
binary smoke
cross-family integration
```

Paid live-agent evals remain separate.

---

# 23. QA Execution Rule

Do not run FULL after every task.

Preferred:

```text
PER FEATURE/TASK
→ named Verify
→ relevant FAST tests

PER WAVE
→ integration relevant to wave

FINAL INTEGRATION
→ STANDARD System Verify

CORE ENGINE / STANDARD / RELEASE BOUNDARY
→ FULL
```

---

# 24. Parallelism Rule

With Bun/TypeScript:

```text
remove unnecessary work first
parallelize independent work second
```

Parallel tests require isolation.

Allowed:

```text
independent fixture directories
pure domain tests
read-only parser tests
isolated tmp Git repos
```

Keep serial:

```text
shared working tree mutation
single shared fixture state
tests whose contract depends on order
```

---

# 25. Compatibility Contract Before Migration

Freeze semantic compatibility:

```text
Rule ID
Finding ID
Severity
Rule inclusion/exclusion
Hold semantics
Conformance level for full runs
exit meaning
```

Do not freeze:

```text
whitespace
word wrapping
exact log order where not semantic
full byte-identical stdout
```

---

# 26. Strangler Migration

Do not delete Shell first.

Stages:

```text
SHELL
current authority

        +
        ↓

TS/BUN
shadow implementation

        ↓

DIFFERENTIAL PARITY

        ↓

TS/BUN
reference authority

        ↓

SHELL
thin wrapper / temporary fallback

        ↓

REMOVE OLD SHELL ENGINE
```

Do not maintain both semantic engines permanently.

---

# 27. Development Task Set

The following supersedes the V2 hardening task set.

---

## H01 — Freeze Semantic Compatibility Contract

**Priority:** P0

Document the compatibility surface for:

```text
conformance
QA
selected rule
full rule sweep
severity
exit behavior
```

Done when:

- [ ] Rule IDs frozen for migration.
- [ ] Finding IDs frozen.
- [ ] Semantic severity mapping frozen.
- [ ] Full-run level semantics documented.
- [ ] Partial-run semantics documented.
- [ ] Byte-exact stdout explicitly NOT required.

---

## H02 — Establish TS/Bun Workspace

**Priority:** P0  
**Depends on:** H01

Create the minimum TypeScript/Bun project foundation.

Requirements:

```text
strict TypeScript
Bun
bun:test
lint/format choice kept minimal
no framework-heavy CLI stack initially
```

Do not introduce dashboard code.

Done when:

- [ ] `bun test` works.
- [ ] one minimal CLI command runs.
- [ ] dependency boundary is documented.
- [ ] consumer/plugin behavior is unchanged.

---

## H03 — Architecture Fitness Tests

**Priority:** P0  
**Depends on:** H02

Add mechanical tests/rules that stop accidental dependency inversion.

Examples:

```text
domain must not import apps/
domain must not import Bun infrastructure
contracts must not import adapters
CLI may import application packages
```

Do not rely only on developer memory.

Done when:

- [ ] at least the critical inward-dependency rules are mechanically testable.
- [ ] must-FAIL fixture/test proves an illegal dependency is caught.
- [ ] correct dependency control passes.

---

## H04 — Standard Domain Model

**Priority:** P0  
**Depends on:** H02

Implement typed:

```text
StandardDocument
StandardSection
StandardRule
RuleId
Level
Mark
SourceLocation
```

No conformance behavior yet beyond what tests require.

Test-first.

---

## H05 — Markdown AST Standard Parser

**Priority:** P0  
**Depends on:** H04

Parse real `spec/STANDARD.md`.

Requirements:

```text
section identification
rule tables
rule id
level
mark
source location
published counts where still relevant
```

Tests:

```text
real Standard fixture
missing section
malformed row
zero-rule section
prose mention must not become rule
```

Done when TS parser reproduces the semantic rule set current Shell reader produces.

---

## H06 — Differential Standard Reader Parity

**Priority:** P0  
**Depends on:** H05

Compare:

```text
read-spec-rules.sh
vs
TypeScript parser
```

on the real Standard and retained malformed fixtures.

Compare semantic rows, not formatting.

---

## H07 — Conformance Result Domain

**Priority:** P0  
**Depends on:** H04

Implement:

```text
Finding
RuleEvaluation
ConformanceResult
Severity
Gap/Hold/Excluded
```

Tests first.

No CLI strings inside the domain.

---

## H08 — Rule Evaluator Registry

**Priority:** P0  
**Depends on:** H07

Design OCP-friendly registration.

Desired behavior:

```text
rule id
→ evaluator
```

Unknown mechanical rule:

```text
GAP
```

Judgment-only:

```text
excluded/judgment-required
```

Implementation-directed:

```text
excluded
```

No giant procedural switch with every rule's body.

---

## H09 — Repository Ports + First Fact Model

**Priority:** P0

Define only the capabilities first migrated rules need.

Examples:

```text
DocumentReader
FileInventory
GitHistoryReader
```

Build real Bun adapters outside domain.

Create fake/in-memory adapters for unit tests where useful.

---

## H10 — Migrate First Conformance Feature End-to-End

**Priority:** P0  
**Depends on:** H05/H07/H08/H09

Choose a representative cheap rule family.

The feature slice must include:

```text
rule evaluator
facts/port
tests
CLI selected-rule path
Shell differential parity
```

This is the reference pattern for later migration.

Do not migrate 100 rules first.

---

## H11 — Targeted Conformance CLI

**Priority:** P0

Support:

```text
leanflow conformance . --rule Sx.Y
leanflow conformance . --section N
```

Partial invocation:

```text
must not claim global conformance level
```

Unknown rule:

```text
fails loudly
```

---

## H12 — Full Conformance Orchestrator

**Priority:** P0  
**Depends on:** H10/H11

Implement:

```text
full Standard rule traversal
mark-driven dispatch
gap reporting
hold reporting
level arithmetic
```

Preserve semantic parity.

---

## H13 — Migrate Conformance Families Incrementally

**Priority:** P0/P1  
**Depends on:** H12

Migration order should prioritize:

```text
high-runtime
high-process-spawn
high-maintenance
```

rather than numerical section order.

Each family requires:

```text
RED
GREEN
PARITY
REFACTOR
```

Do not mark family migrated without retained must-FAIL + control proof.

---

## H14 — TypeScript Fixture Factories

**Priority:** P1

Create small feature-owned factories for repeated setup:

```text
temporary repo
sprint fixture
ADR fixture
Git commit helper
```

Tests must not duplicate hundreds of lines of shell fixture construction.

Guardrail:

```text
factory creates state
factory does not decide expected verdict
```

---

## H15 — QA Domain + Severity Model

**Priority:** P0

Implement:

```text
PASS
NOTE
WARN
HOLD
FAIL
```

Rules:

```text
WARN does not fail QA
FAIL does
HOLD prevents false close where proof/authority is incomplete
```

Test-first.

---

## H16 — Document Budget Policy

**Priority:** P0  
**Depends on:** H15

Replace binary line cliff with:

```text
TARGET
WARNING BAND
TRUE CEILING
```

Classify existing document types:

```text
SOFT TARGET
BOUNDED CONTEXT
TRUE HARD
NO CAP / APPEND-ONLY
```

General knowledge docs default soft unless a real technical consequence is demonstrated.

---

## H17 — QA Profiles

**Priority:** P0  
**Depends on:** H15

Implement:

```text
fast
standard
full
```

Do not preserve `QA_FULL` as the conceptual model.

Temporary backward compatibility is allowed.

---

## H18 — QA Scheduler

**Priority:** P1  
**Depends on:** H17

Implement bounded parallel execution for declared independent checks.

Stable output:

```text
execute parallel
collect structured results
render deterministically
```

Do not stream interleaved chaos.

---

## H19 — QA Timing

**Priority:** P0

Every check produces:

```text
durationMs
```

QA summary shows:

```text
total
slowest checks
profile
```

Performance optimization must use generated evidence, not comments.

---

## H20 — Differential QA Parity

**Priority:** P0

Compare old Shell QA and new TS QA on selected reference states.

Required comparison:

```text
blocking findings
warnings
holds
exit meaning
```

Known intentional behavior changes, such as document budget WARN instead of FAIL, must be explicitly listed.

---

## H21 — Migrate Deterministic Evals to bun:test

**Priority:** P1

Do not port shell syntax line-for-line.

Translate behavioral fixtures into:

```text
describe
test
table-driven cases
fixture factories
```

Prefer domain/component tests where shell previously needed full CLI execution.

Keep CLI smoke tests separately.

---

## H22 — Binary Build

**Priority:** P1

Build standalone CLI artifacts.

Candidate command:

```text
bun build ... --compile
```

Required release targets based on actual supported environments.

Do not add an unsupported architecture just for completeness.

---

## H23 — Binary Parity / Smoke

**Priority:** P1  
**Depends on:** H22

Run compiled binary on representative:

```text
qa fast
qa full
conformance rule
conformance full
```

at least on the primary supported development environment and CI.

---

## H24 — Cut QA Authority to TS/Bun

**Priority:** P0  
**Depends on:** H15–H23

New QA becomes authoritative only after parity and explicit behavior-change rulings.

Shell QA becomes:

```text
wrapper
or temporary fallback
```

not second truth.

---

## H25 — Cut Conformance Authority to TS/Bun

**Priority:** P0  
**Depends on:** migrated rule coverage

`conformance.sh` may temporarily remain a compatibility wrapper.

Reference semantic evaluator becomes TypeScript/Bun.

---

## H26 — Remove Superseded Shell Semantic Engine

**Priority:** P1  
**Depends on:** stable cutover

Delete:

```text
duplicate Shell rule implementations
duplicate Shell semantic parser
obsolete fixture runners
```

Do not preserve them "just in case" indefinitely.

Retain only operational shell glue that still has a real purpose.

---

# 28. Execution Workflow Hardening

The following workflow work remains required in parallel with the engine migration.

---

## H27 — Sprint-Bulk Continuation Contract

**Priority:** P0

Invariant:

> **Task completion is not run completion.**

After task/wave:

```text
record
→ verify
→ DoD
→ log
→ recompute ready set
→ continue automatically
```

Only terminal states:

```text
PLAN_EXHAUSTED
AUTHORITY_BOUNDARY
HARD_FAILURE
BUDGET_STOP
USER_STOP
```

---

## H28 — Register Overnight Mode

**Priority:** P0

Canonical:

```text
overnight
```

Aliases:

```text
night-run
unattended
sprint-bulk unattended
```

Expose in orchestrator/flow discovery.

Preferred launcher:

```text
/flow overnight
```

---

## H29 — J0 / J1 / J2 Authority

**Priority:** P0

```text
J0 mechanical
→ execute

J1 delegated implementation judgment
→ execute within approved envelope

J2 authority decision
→ human
```

---

## H30 — AFK Readiness + Pre-Authorized Envelope

**Priority:** P0

Resolve before launch:

```text
goal
scope
acceptance
design
verification
J1 delegation
capabilities
repair policy
budget
stop conditions
```

One recorded approval.

No repeated J0/J1 confirmation.

---

## H31 — Unattended Gauntlet Repair

**Priority:** P0

```text
critic concrete J1 finding
→ repair
→ re-review
→ continue
```

Bounded.

J2 parks.

---

## H32 — Risk-Aware Missing Verification

**Priority:** P0

Low-risk nonbehavioral:

```text
WARN
continue
```

Material behavioral work:

```text
HOLD / owner ruling / unattended park
```

Never silently pretend proof exists.

---

## H33 — Risk-Based Review

**Priority:** P0

Review depth follows consequence.

Not file extension.

Keep:

```text
Standards axis
Spec axis
external comparand
fresh reviewer
bounded repair
```

---

## H34 — Verify Reachability

**Priority:** P1

Every mechanical Verify:

```text
EXISTS
RUNS
REACHES
PROVES
```

---

## H35 — Generator Budget Awareness

**Priority:** P1

Document generator reads target before writing.

Prefer:

```text
signal density
canonical split
soft warning
```

over artificial compression.

---

## H36 — Reusable Unattended Capability Profile

**Priority:** P1

Reuse known permissions.

Surface only delta.

Keep push/deploy/external destructive actions reserved unless separately authorized.

---

## H37 — Run Outcomes

**Priority:** P1

Every sprint-bulk / overnight run:

```text
DELIVERED
PARTIAL
FAILED
```

plus:

```text
DoD
attempted/completed tasks
parks
repair cycles
verification
warnings
terminal reason
```

---

# 29. Dashboard-Preparation Hardening

Do not build dashboard yet.

But make today's engine dashboard-consumable.

---

## H38 — JSON Renderer

**Priority:** P1

Structured output for:

```text
ConformanceResult
QaRunResult
RunSummary
```

Text and JSON must be renderers over the same result object.

Do not have separate evaluation paths.

---

## H39 — Stable Contract Tests

**Priority:** P1

Test serialized contract shape for cross-process consumers.

Avoid snapshotting volatile fields unnecessarily.

Stable:

```text
type
ruleId
findingId
severity
status
scope
```

Volatile:

```text
duration
temp paths
timestamps
```

---

## H40 — Dashboard Boundary ADR/Decision

**Priority:** P1 planning decision

Before future dashboard implementation, record:

```text
what the dashboard reads
what it commands
what remains authoritative in Git/Standard
what contracts it consumes
```

Do not implement Control Plane now.

This decision prevents UI-first architecture later.

---

# 30. Feature-Driven Acceptance Template

Every migration/development feature should be expressible like:

```text
FEATURE
Why does a user/operator need this?

ACCEPTANCE
What observable result must hold?

DOMAIN BEHAVIOR
What policy/decision exists independent of framework?

PORTS
What external capabilities are required?

ADAPTERS
How is the capability implemented now?

PROOF
Unit
Component
Integration
Differential
E2E where needed

COMPATIBILITY
What existing semantic contract must remain?

OUT
What is deliberately not solved?
```

---

# 31. Example Feature Slice

Feature:

```text
Evaluate S9.PLANFROZEN
```

Plan:

```text
Acceptance:
editing frozen Plan without prior scope-change
returns finding plan-edited-after-freeze.

Domain:
S9.PlanFrozenPolicy

Port:
GitHistoryReader
DocumentReader

Adapter:
BunGitHistoryReader
BunFileReader

Tests:
1. domain unit state cases
2. temp Git integration
3. Shell differential
4. selected CLI smoke
```

This is preferred over:

```text
"Implement Git layer"
```

as an isolated project task.

---

# 32. Branch / Module Size Discipline

Do not recreate shell monolith in TypeScript.

Signals for split:

```text
module has multiple reasons to change
tests require unrelated setup
feature addition repeatedly edits same large switch
domain and infrastructure code co-locate
```

Do not impose arbitrary 100-line limits.

Cohesion beats line count.

---

# 33. Test Naming Standard

Tests should name behavior.

Good:

```text
returns WARN when a soft document target is exceeded
parks an unattended run when a J2 decision is required
does not claim global level for a targeted rule execution
```

Bad:

```text
testCase1
works correctly
parser test
```

---

# 34. Fixture Discipline

Retain current Lean Flow strength:

> **A checker without a must-FAIL case is not proven.**

For each mechanical rule:

```text
must-FAIL
+
correct sibling control
```

Where there are multiple legitimate controls, test each meaningful branch.

---

# 35. Mutation/Seeded-Break Philosophy

Lean Flow has repeatedly found false-green harnesses by intentionally breaking the target.

Continue this.

For high-risk framework behavior:

```text
seed known defect
→ test must go red
```

This is especially important for:

```text
architecture boundary tests
rule registry
partial/full conformance distinction
severity
QA profiles
differential parity
```

---

# 36. Performance Standard

No optimization task closes from "it feels faster".

Record:

```text
before
after
same workload
same environment
same semantic coverage
```

Primary measurements:

```text
qa fast
qa standard
qa full
single selected rule
full conformance
slowest rule family
```

---

# 37. Performance Goal Philosophy

Do not put arbitrary universal seconds into the Standard yet.

The goal is:

```text
development feedback fast enough to run frequently
full proof reserved for correct boundaries
```

The sprint may adopt local performance budgets once measured.

---

# 38. No Premature Distributed Architecture

Do not add because dashboard is future:

```text
database
message queue
WebSocket broker
event store
distributed worker
RPC framework
```

Typed contracts now.

Infrastructure later when admitted.

---

# 39. No Premature Public Package Explosion

Packages are architecture boundaries, not npm marketing units.

They may live in one repository/workspace.

Only publish externally if another repository/runtime actually needs the package.

---

# 40. Future Dashboard Development Direction

When admitted, dashboard should ideally consume:

```text
@lean-flow/contracts
```

and API/projections produced from application results.

Possible later architecture:

```text
Lean Flow Core
      │
      ▼
Application Services
      │
 ┌────┴─────┐
 ▼          ▼
CLI      Control Plane API
             │
             ▼
          Dashboard
```

Not:

```text
Dashboard
→ imports random CLI internals
```

---

# 41. Future Gateway Direction

Same principle:

```text
RunEnvelope / events
```

eventually live in proper ADLC protocol/contracts.

Do not make today's QA engine invent EPIC-008 protocol early.

---

# 42. Recommended Hardening Sequence

The following is recommended.

---

## Sprint A — TS/Bun Foundation

```text
H01 Semantic contract
H02 Bun workspace
H03 architecture fitness
H04 Standard domain model
```

---

## Sprint B — Standard Parser

```text
H05 AST parser
H06 Shell parity
```

---

## Sprint C — First Conformance Vertical Slice

```text
H07 Result domain
H08 registry
H09 repository ports/facts
H10 first rule feature
H11 targeted CLI
```

---

## Sprint D — Full Engine

```text
H12 full orchestrator
H13 first migration families
H14 fixture factories
```

---

## Sprint E — QA Core

```text
H15 severity
H16 doc budgets
H17 profiles
H18 scheduler
H19 timing
H20 QA parity
```

---

## Sprint F — Eval Migration + Binary

```text
H21 bun:test migration
H22 binary
H23 binary smoke
```

---

## Sprint G — Authority Cutover

```text
H24 QA cutover
H25 conformance cutover
H26 old Shell semantic engine removal
```

---

## Parallel Workflow Hardening Stream

```text
H27 sprint-bulk continuation
H28 overnight discovery
H29 authority classes
H30 AFK envelope
H31 unattended repair
H32 no-gate policy
H33 review routing
H34 Verify reachability
H35 generator budget
H36 capability profile
H37 run outcome
```

Coordinate shared files.

---

## Final Dashboard-Ready Output Stream

```text
H38 JSON renderer
H39 contract tests
H40 dashboard boundary decision
```

---

# 43. Migration Order for Conformance Rules

Do not migrate sections 1→13 just for neatness.

Prioritize:

```text
1. expensive today
2. high defect risk
3. high repeated process spawning
4. high future dashboard relevance
5. representative architecture needs
```

Keep a migration matrix:

```text
Rule
Shell
TS
Parity
Authority
```

Example:

```text
S9.PLANFROZEN
current
shadow
pass
shell

...

S9.PLANFROZEN
retired
authority
pass
TS
```

---

# 44. Authority Cutover Rule

A rule family changes authority only when:

```text
all retained must-FAIL cases pass
all controls pass
differential parity passes
known intentional differences ruled
performance measured
```

Never "most tests look green."

---

# 45. Shell Removal Rule

Delete migrated semantic Shell code after TS authority stabilizes.

Do not leave:

```text
old
new
new2
legacy
fallback
```

permanently.

Git history is the archive.

---

# 46. CLI Compatibility

Keep a thin compatibility surface where valuable:

```text
sh conformance.sh .
```

may eventually:

```text
exec leanflow conformance .
```

This protects existing operator habits while removing duplicate implementation.

---

# 47. Source of Truth Boundaries

Remain explicit.

```text
STANDARD.md
→ normative rules

TypeScript domain
→ reference semantic representation

Git
→ source-controlled artifact truth

future Control Plane
→ operational live state where admitted

Dashboard
→ projection + command surface
```

---

# 48. TDD Gate for Implementation Tasks

For each behavior-bearing task, G2 should include:

```text
Test:
what goes red before implementation?

Control:
what valid state proves no false positive?

Integration:
what real adapter path must be proven?

Parity:
if migrated, what current semantic contract is compared?
```

A task that cannot answer those should not be considered design-ready unless the behavior is genuinely judgment/manual-only.

---

# 49. Feature-Driven G2 Gate

For TS migration tasks, G2 should reject plans framed only as technical layers if no vertical outcome is demonstrated.

Ask:

```text
What working behavior exists when this task closes?
```

Not merely:

```text
What file/class exists?
```

---

# 50. Clean Architecture Review Axis

Add to Standards review for the TS codebase:

```text
Dependency Direction
```

Reviewer asks:

```text
Does domain depend on infrastructure?
Does application depend on CLI?
Are adapters leaking into policy?
Is shared/contracts becoming a dumping ground?
```

This is a Standards-axis concern.

---

# 51. SOLID Review Axis

Do not score all five mechanically.

Use as reviewer prompts:

```text
single reason to change?
extension requires central modification?
interface larger than consumer needs?
concrete infra dependency where a port is justified?
```

No vanity SOLID score.

---

# 52. Dashboard Readiness Review Axis

For shared domain/result changes:

```text
Is data structured?
Is rendering separated?
Is authority explicit?
Would a dashboard need to parse prose?
```

If yes to parsing prose, architecture is wrong.

---

# 53. Done-When — Engine Migration

The engine migration is complete when:

```text
real STANDARD parsed by AST
typed semantic model exists
targeted rule execution exists
full conformance exists
major current rule families migrated
retained fixtures pass
differential parity passes
TS/Bun is authoritative
old Shell semantic engine removed
```

---

# 54. Done-When — QA Migration

QA migration is complete when:

```text
FAST/STANDARD/FULL exist
WARN/HOLD/FAIL semantics exist
doc budget cliff removed
deterministic evals primarily run in-process
performance is measured
normal developer loop materially improves
full regression remains available
```

---

# 55. Done-When — Workflow Hardening

Workflow hardening is complete when:

```text
sprint-bulk does not pause per task
overnight is discoverable
J1 can proceed unattended
J2 parks
critic repair can run bounded unattended
missing material verification cannot silently close
risk drives review
Verify reachability exists
```

---

# 56. Required Dogfood

Before freeze:

## Dogfood 1

```text
continuous attended sprint-bulk
```

No per-task confirmation.

---

## Dogfood 2

```text
overnight
```

At least:

```text
one J1 decision
one repair
one J2 park or seeded J2 control
```

---

## Dogfood 3

```text
TS/Bun QA
```

Compare old/new workload.

---

## Dogfood 4

```text
compiled CLI
```

Real repository.

---

# 57. Performance Report Required

Final hardening evidence must include:

```text
OLD
qa normal
qa full
full conformance
selected family

NEW
qa fast
qa standard
qa full
full conformance
selected rule/family
```

Show:

```text
runtime
semantic coverage
known intentional differences
```

---

# 58. Freeze Rule

After all integrated proof passes:

> **Freeze the execution + QA + reference-engine foundation.**

New changes require:

```text
measured defect
repeated consumer friction
security issue
performance/cost evidence
new Standard requirement
Run Evidence
```

Then return to roadmap epics.

---

# 59. Explicitly Out of Scope

Do not build:

```text
Dashboard UI
Control Plane service
database
event store
message queue
gateway
runtime adapters
persistent memory
Fleet platform
full ADLC Run Protocol
managed execution
production auto-release
```

Architecture should prepare for these.

Hardening should not implement them.

---

# 60. Final Architecture

Target after this hardening:

```text
                    LEAN FLOW STANDARD
                          Markdown
                             │
                             ▼
                    TS STANDARD PARSER
                          AST → Model
                             │
                             ▼
                       DOMAIN CORE
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Conformance        QA          Run Summary
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                      Application Layer
                             │
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
                CLI       Plugin Use   Future API
                 │                       │
                 ▼                       ▼
            Text / JSON              Dashboard
```

And execution:

```text
HUMAN
clarify + decide + approve + delegate
                 │
                 ▼
        PRE-AUTHORIZED PLAN
                 │
                 ▼
             EXECUTE
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
     build     critic     verify
       │         │         │
       └────J1 repair──────┘
                 │
                 ▼
            NEXT TASK
                 │
                 ▼
           SYSTEM VERIFY
                 │
                 ▼
     DELIVERED / PARTIAL / FAILED
```

---

# 61. Development-Agent Instruction

When implementing this plan:

1. **Recon the live repository first.**
2. **Use current ADR/Standard authority.**
3. **Work feature-first, not layer-first.**
4. **Write behavioral tests before behavior-bearing implementation.**
5. **Preserve must-FAIL + control discipline.**
6. **Use Clean Architecture dependency direction.**
7. **Apply SOLID where it improves boundaries; do not create interface ceremony.**
8. **Do not port Bash regex architecture into TypeScript. Parse Markdown semantically.**
9. **Do not make CLI rendering the domain API.**
10. **Build structured results suitable for future dashboard consumption.**
11. **Do not make dashboard future needs create current infrastructure.**
12. **Differential-test migration behavior before cutover.**
13. **Measure performance before and after.**
14. **Delete superseded semantic Shell code after stable authority transfer.**
15. **Keep operational shell glue only where it remains the simplest correct tool.**
16. **Do not pause between already-authorized sprint-bulk tasks.**
17. **J1 is delegated authority; J2 is human authority.**
18. **WARN is not FAIL.**
19. **Partial verification is labeled partial.**
20. **After integrated dogfood passes, freeze and return to the roadmap.**
