---
epic: 009
slug: local-shadow-observability
owner: Maintainer
last_updated: 2026-08-25
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-009 — Local Shadow Observability

> **Outcome:** the evidence a run already leaves is **readable as a portfolio** — active Work Items,
> Runs, where human attention is owed, evidence refs and a conformance summary — projected locally
> and read-only from git-resident records, with no central database, no sync, no assignment and no
> control authority.

> **Admission — NOT met (gated register).** `adlc-epic-sequencing.md` admits this epic when
> **EPIC-006 produces records a reader consumes, and two real sprints of them exist**. EPIC-006 is
> `proposed` and has emitted nothing. This file exists because the owner asked for the roadmap written
> down; it is **not** a licence to promote a member sprint. `03-ADLC-ROADMAP.md`'s rule still binds —
> no new epic work until evidence identifies the real delta.

## Why this, why now

`08 § 16`'s **MVP0 is read-only emission** — the first dashboard milestone deliberately reads and
renders, and creates nothing. It is the cheapest possible proof that the domain model in `02` survives
contact with real records, and it is a **pre-gate** epic: the Platform Decision Gate cannot be argued
either way without a shadow projection to point at. Building the connected workspace first would decide
the gate by construction rather than by evidence, which `00 § 5.4` names as the failure — infrastructure
is *graduated*, not assumed.

It spans sprints because the projection has to survive two real sprints of records without the schema
being rewritten under it, and because "human attention is owed" is a derived view over parked gates,
not a field anyone writes.

## Scope

**In:** a read-only local projection over EPIC-006's records · portfolio summary · active Work Items ·
Run list with evidence refs · a human-attention view derived from parks and open gates · a conformance
summary reusing the existing engine's output · the **platform repository boundary ADR** its first G2
owes.

**Out (explicitly not):** any write path — create, assign, approve or dispatch · a central database or
any state living outside git · sync of any direction · identity or authority modelling (that is
EPIC-010's minimal contract) · a hosted service · control over a run · the gateway (EPIC-012). **If it
writes, it is not this epic.**

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-009-local-shadow-observability.md per ADR-030,
     created lazily at the first member close. -->

_None promoted, and none promotable_ — see § Admission above.

## Decisions

- **D1** — **Read-only is the boundary, not a phase.** The epic closes with zero write paths. A
  projection that can assign or approve has become MVP1 and belongs to EPIC-010; blurring the two is
  exactly what `06 § 3` warns against in as many words (*"do not jump directly to Managed Mode"*).
- **D2** — **No state outside git.** The projection is derived, never authoritative — deleting it and
  re-deriving must produce the same view. This keeps EPIC-005's *"no fleet state lives outside git"*
  reachable rather than pre-empted.
- **D3** — **The platform repository boundary is ruled at the first G2, as an ADR.** One `lean-flow/`
  growing `dashboard/ gateway/ database/ worker-runtime/` is the fastest route to dev-flow 2.0; the
  candidate split is **lean-flow** (Standard · plugin · conformance · protocol) vs **lean-platform**
  (gateway · control plane · dashboard · adapters · persistence). It is hard-to-reverse, surprising and
  a real trade-off — STANDARD §4's three conditions — so it is ADR-grade by construction.
- **D4** — **The shadow proof is an input to the Platform Decision Gate, not a bypass of it.** This
  epic produces the evidence the gate reads; it never asserts the gate passed.

## Open questions

- **What counts as "two real sprints of records"?** → a **documented behaviour, closed by reading**
  (L-094) once EPIC-006's schema exists: the answer is whichever span exercises every record kind the
  projection reads, not a sprint count. Do not gate on a measurable signal that never arrives.
- **Does the conformance summary re-run the engine or read its last result?** → ruled at the first G2;
  re-running makes the projection slow and authoritative, reading makes it stale — a real trade-off,
  and it touches EPIC-014's authority boundary, so it coordinates there rather than forking.
- **Platform repository boundary** → **ADR at first G2** (D3). Owed before EPIC-010 either way.

## Closed when

- [ ] A local projection renders portfolio · active Work Items · Runs · human attention · evidence
      refs · conformance summary, from records alone
- [ ] The projection is **derivable**: deleted and rebuilt from git, it produces an identical view
- [ ] It has **no write path** — proven by a retained must-FAIL fixture in which an attempted write
      fails with its named finding, while a read sibling still passes
- [ ] It survived **two real sprints** of records without a schema rewrite
- [ ] The **platform repository boundary ADR** is written and linked from `docs/architecture/`
