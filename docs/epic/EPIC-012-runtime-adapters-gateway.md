---
epic: 012
slug: runtime-adapters-gateway
owner: Maintainer
last_updated: 2026-08-25
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-012 — Runtime Adapters + Gateway

> **Outcome:** a **second runtime can execute a lean-flow workflow** — reached through a documented
> adapter contract and a gateway that selects a worker, grants per-run capability, routes human gates
> back, and breaks the circuit when a worker misbehaves — without the local plugin losing the ability to
> run alone.

> **Admission — NOT met (gated register).** Admitted on **Platform Decision Gate PASSED** + **EPIC-008
> stable** + **one concrete second-runtime use case** — a *named workflow a second worker must execute*.
> No such workflow has been named. The register states the discriminator outright: **a protocol existing
> is not a gateway being needed** (`00 § 5.4`, graduated infrastructure).

## Why this, why now

`09` specifies the operating model — gateway role, adapter contract, worker registry, worker selection,
per-run capability, the fresh-run principle, scheduling, circuit breakers, credentials, human gate
routing, and integration with the local plugin. It is the largest single piece of infrastructure the
roadmap contemplates, and therefore the one most exposed to being built before it is needed.

**This epic is deliberately demand-gated, and the gate is a workflow, not an opinion.** "We might want
another runtime" does not admit it; *"this named workflow must run on a worker that is not this
machine"* does. `00 § 6`'s ten admission questions are answered in the first sprint or the epic does not
start — in particular *what new failure mode does it introduce* and *how is it removed or migrated*.

It spans sprints because the adapter contract has to survive a **second** adapter to be a contract at
all: one implementation is a wrapper, and lean-flow already knows the difference — the same seam-not-a-
wrapper test EPIC-014 applies to its repository ports.

## Scope

**In:** the runtime adapter contract · a worker registry · worker selection · per-run capability grants
· the fresh-run principle · circuit breakers · credential handling · human gate routing back to the
owner · integration with the local plugin · the gateway MVP of `09 § 15` measured against `09 § 16`'s
success criteria.

**Out (explicitly not):** scheduling as a product surface (that is EPIC-013's managed execution) ·
budgets and capability *policy*, which **EPIC-011 defines** and this epic merely enforces · replacing
local execution · a queue service beyond the gateway MVP · Hermes/OpenClaw adoption as a dependency —
`09 § 13` positions them, and a position is not a commitment.

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-012-runtime-adapters-gateway.md per ADR-030, created
     lazily at the first member close. -->

_None promoted, and none promotable_ — see § Admission above.

## Decisions

- **D1** — **The contract is proven by a second adapter, not by the first.** One adapter demonstrates
  nothing about the seam. The second is the test.
- **D2** — **Gateway loss never blocks local mode.** Inherited from `06 § 9` and EPIC-010 D3; re-stated
  because this is the epic that could break it. Retained must-FAIL fixture.
- **D3** — **This epic enforces policy, it does not author it.** Capability and budget definitions come
  from EPIC-011. Authoring them here creates the second SSOT LAW 4 forbids.
- **D4** — **Human gates route to a person, never resolve themselves.** EPIC-015 D3 binds across the
  boundary: a remote worker hitting a J2 parks, and a missing channel or a timeout is a BLOCK. A gateway
  that answers a gate on the owner's behalf is the single worst failure this epic can ship.
- **D5** — **ADR-029 Tier G throughout.** Worker selection, capability grant and circuit breaking are
  all silent when wrong — a misgranted capability produces a successful-looking run.
- **D6** — **Credentials never enter git.** Their lifecycle and removal path are answered per `00 § 6`
  before the first adapter ships, not retrofitted.

## Open questions

- **What is the named second-runtime workflow?** → the **admission condition itself**. Until a real
  workflow names it, this stays a file and not work.
- **Native lean runtime, or adopt an existing one?** → `09 § 14` versus `09 § 13`. A genuine fork with
  expensive consequences — a **`/council` candidate**, then an ADR. Do not settle it inline.
- **Where does the gateway live as source?** → **EPIC-009 D3's platform repository boundary ADR**.
- **Does the fresh-run principle survive scheduling?** → ruled at the sprint that ships scheduling; a
  scheduled run that reuses context has quietly abandoned it.

## Closed when

- [ ] A **named workflow** executes on a second runtime through the adapter contract
- [ ] **Two adapters** exist against one unchanged contract — the seam proven, not asserted
- [ ] Worker registry + selection + **per-run capability grant** work, with a retained must-FAIL for an
      over-granted capability and a sibling control
- [ ] **Circuit breakers** trip on a misbehaving worker, proven by a seeded misbehaviour
- [ ] **Human gates route back to a person** — a seeded J2 on a remote worker parks (D4)
- [ ] **Gateway loss does not block local mode** — retained must-FAIL fixture
- [ ] `09 § 16`'s gateway success criteria are met and named **individually**, never "most"
