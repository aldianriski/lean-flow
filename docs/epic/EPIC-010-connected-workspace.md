---
epic: 010
slug: connected-workspace
owner: Maintainer
last_updated: 2026-08-25
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-010 — Connected Workspace

> **Outcome:** work flows **both ways** — a Work Item created or assigned in the dashboard reaches the
> local plugin, the plugin syncs its state back, and a Human Inbox collects every decision owed to a
> person, with a Run Inspector showing what a run actually did.

> **Admission — NOT met (gated register).** Admitted only on **Platform Decision Gate PASSED** +
> **EPIC-008 stable** + **EPIC-009's shadow proof** + a **minimal identity/authority contract**. The
> gate has not run, EPIC-008 is `proposed`, EPIC-009 is `proposed` and unadmitted. This file records
> the destination; it does not open the work.

## Why this, why now

`08 § 16`'s **MVP1 is bidirectional** — create/assign a Work Item, plugin sync, a Human Inbox, a Run
Inspector — and it is a genuinely different outcome from MVP0, not a bigger version of it. An earlier
draft folded the two; `06 § 3` warns against precisely that (*"do not jump directly to Managed Mode"*),
which is why they are two epics.

It spans sprints because bidirectional sync forces three things that read-only never does: a **stable
id space** for Runs and Work Items, an **explicit authority conflict rule** for when both sides changed,
and a **degradation contract** — gateway loss must not block local mode. Each is an integration
boundary, not a step inside a task.

**The identity contract is a first-sprint ADR, not its own epic.** A dashboard cannot *assign to Aldi*
or *approve G2* without knowing actor and authority — but modelling identity fully before one assignment
has ever flowed is the imagination move `00 § 5.4` forbids. Minimal means: enough to name an actor and
their authority, no more.

## Scope

**In:** Work Item create + assign from the dashboard · plugin sync in both directions · the Human Inbox
· the Run Inspector · a **minimal identity/authority contract** (first-sprint ADR) · stable Run and Work
Item ids · an explicit authority-conflict rule · local mode surviving gateway loss.

**Out (explicitly not):** managed execution — worker registry, Run dispatch, scheduling, budgets
(EPIC-013 via EPIC-012) · the gateway itself (EPIC-012) · context/cost policy (EPIC-011) · organisation
policy or cross-domain integration (MVP3, no id reserved) · replacing local mode. **The goal is
coexistence, not replacement** (`06 § 9`).

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-010-connected-workspace.md per ADR-030, created
     lazily at the first member close. -->

_None promoted, and none promotable_ — see § Admission above.

## Decisions

- **D1** — **Identity is minimal and ADR'd in the first sprint.** Actor + authority, nothing more.
  Anything richer waits for a second workflow family to demand it.
- **D2** — **Authority conflicts are handled explicitly, never last-write-wins.** `06 § 9` lists this
  as an exit criterion for managed mode; a silent overwrite is the failure mode that makes the whole
  control plane untrustworthy, and it is silent by construction — ADR-029 **Tier G** applies.
- **D3** — **Gateway loss degrades to local mode, and that is tested, not asserted.** Also a `06 § 9`
  exit criterion. A retained must-FAIL fixture proves a run blocked by gateway loss fails with its
  named finding.
- **D4** — **Ids are stable across the boundary.** A Run id that changes on sync makes every evidence
  ref in EPIC-009's projection a dangling pointer.
- **D5** — **`AskUserQuestion` semantics carry over unchanged.** The Human Inbox is a *destination* for
  decisions owed, never a new authority: EPIC-015 D3 binds here too — absence is never consent, and a
  timeout is a BLOCK.

## Open questions

- **Does the Human Inbox own decisions, or only display them?** → a **judgement call, closed by
  ruling** (L-094) at the first G2. Owning them creates a second authority beside the local gate — the
  second SSOT LAW 4 forbids — so the default answer is *display*, and departing from it needs the ADR.
- **What is the sync unit — a Work Item, a Run, or an event?** → routes to **EPIC-008's Run Protocol**,
  which owns the portable contract. Ruling here would mint a competing shape.
- **Where does the dashboard live as source?** → answered by **EPIC-009 D3's platform repository
  boundary ADR**, which is owed before this epic starts.

## Closed when

- [ ] A Work Item created **and** assigned in the dashboard reaches the local plugin, and its state
      syncs back — proven by a real round trip, not a mock
- [ ] **≥2 real users or workspaces** ran connected (`06 § 9`)
- [ ] A **Human Inbox** collects every decision owed to a person, and a **Run Inspector** shows what a
      run did, from evidence rather than prose
- [ ] **Authority conflicts are explicitly handled** — retained must-FAIL fixture, sibling control
- [ ] **Gateway loss does not block local mode** — retained must-FAIL fixture, sibling control
- [ ] Run ids and Work Item ids are **stable** across the boundary
- [ ] The **minimal identity/authority ADR** is written and linked
