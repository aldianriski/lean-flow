---
epic: 013
slug: managed-adlc
owner: Maintainer
last_updated: 2026-08-25
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-013 — Managed ADLC

> **Outcome:** execution is **managed** — Runs are dispatched to registered workers on a schedule,
> inside declared budgets and capability policy, from a control plane an organisation operates — while
> local mode keeps working exactly as it does today.

> **Admission — NOT met, and furthest from met (gated register).** Admitted only when **all nine of
> `06 § 9`'s exit criteria are `[x]`** *and* **EPIC-010 · 011 · 012** have closed. Zero of the nine are
> met today. `06 § 9`'s own instruction is the epic's first rule: **do not enable full managed
> execution until** every box is ticked.

## Why this, why now

`08 § 16`'s **MVP2 — Managed Execution** is worker registry, Run dispatch, schedule, budgets and
capability policy. It is the point where lean-flow stops being a plugin someone runs and becomes a
system an organisation operates, which is why it sits behind the longest gate in the roadmap.

It spans sprints because managed execution is the **composition** of three other epics, and a
composition fails at its joins: dispatch (012) has to respect policy (011) and report into the workspace
(010) without any of the three becoming authoritative over the others.

**Why it is written down now rather than discovered later:** the nine exit criteria are a *checklist
other epics must satisfy*, and a checklist nobody can find is not a checklist (L-151). Recording it
here makes each criterion traceable to the epic that owes it — which is this file's real job, well
before any of its own work starts.

### The nine exit criteria, and who owes each

| `06 § 9` criterion | Owed by |
|---|---|
| Shadow mode event schema is stable | EPIC-006 · proven by EPIC-009 |
| ≥2 real users/workspaces ran connected | EPIC-010 |
| Local → dashboard sync works | EPIC-010 |
| Dashboard → local execution works | EPIC-010 |
| Run IDs and Work Item IDs are stable | EPIC-010 |
| Authority conflicts are explicitly handled | EPIC-010 D2 |
| Gateway loss does not block local mode | EPIC-012 D2 · EPIC-010 D3 |
| Budget + capability policy exists | EPIC-011 |
| HITL parking works end-to-end | **EPIC-015** — already in flight |

## Scope

**In:** Run dispatch to registered workers · scheduling as an operated surface · budget enforcement at
dispatch · capability policy applied per run · the control-plane operating model · the coexistence
guarantee that local mode is unaffected.

**Out (explicitly not):** multiple workflow families, outcome tracking, organisation policy and
cross-domain integration — that is **MVP3**, which reserves **no id** by design and is demand-gated ·
authoring capability policy (EPIC-011 owns it) · the adapter contract (EPIC-012 owns it) · replacing
local execution, ever.

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-013-managed-adlc.md per ADR-030, created lazily at
     the first member close. -->

_None promoted, and none promotable_ — see § Admission above.

## Decisions

- **D1** — **Coexistence, not replacement.** `06 § 9`'s closing line, and the hardest one to hold under
  pressure: every managed capability must leave the unmanaged path working. A managed mode that quietly
  becomes required has broken the promise the whole roadmap rests on.
- **D2** — **The nine criteria are checked at *this* epic's admission, individually and by name.** Never
  "most", never in aggregate — the same discipline EPIC-014 applies to rule families at cutover.
- **D3** — **Dispatch respects policy it did not author.** Budgets and capability come from EPIC-011,
  workers from EPIC-012, work items from EPIC-010. This epic composes; it does not re-define. Three
  competing definitions of "budget" is the failure this decision exists to prevent (LAW 4).
- **D4** — **ADR-029 Tier G, at the highest stakes in the roadmap.** A misdispatched run, a budget that
  fails open, or a capability granted beyond policy all produce a green run and a wrong outcome — with
  someone else's credentials, on someone else's machine.
- **D5** — **HITL parking is inherited, not rebuilt.** EPIC-015 ships it; this epic proves it end-to-end
  across the dispatch boundary and re-implements none of it.

## Open questions

- **Does "managed" imply multi-tenant?** → a **judgement call, closed by ruling** (L-094) at the first
  G2. Multi-tenancy is a different outcome with a different security model; if the answer is yes, this
  epic is too small and should be re-admitted, not stretched.
- **Who operates the control plane in the first real deployment?** → an **owner-action** at admission,
  not a design question. Without a named operator, `00 § 6`'s *"who owns the new state"* has no answer
  and the admission questions cannot be completed.
- **Where does scheduling live — gateway or control plane?** → ruled with EPIC-012's fresh-run question,
  since a scheduler that reuses run context contradicts it.

## Closed when

- [ ] **All nine `06 § 9` criteria are `[x]`**, each named individually with what proved it (D2)
- [ ] A Run is **dispatched to a registered worker** and completes, with its evidence readable in the
      workspace
- [ ] **Scheduling** runs work without a human present, and a scheduled run obeys the fresh-run
      principle
- [ ] **Budgets and capability policy are enforced at dispatch** — retained must-FAIL fixtures for an
      over-budget run and an over-granted capability, each with a sibling control
- [ ] **HITL parking works end-to-end** across the dispatch boundary, proven by a *seeded* J2 (D5)
- [ ] **Local mode is provably unaffected** — the full local loop runs with the control plane absent
