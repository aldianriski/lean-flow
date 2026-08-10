---
epic: 002
slug: make-room
owner: Maintainer
last_updated: 2026-08-10
status: active
member_sprints: [SPRINT-062]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-002 — Make Room

> **Outcome:** the repo has room to absorb a standard — both SSOT files carry real headroom, no doc
> sits over a soft cap without an ADR saying why, and every guard that survives the pass is one
> somebody can name a reason for.

## Why this, why now

`CLAUDE.md` is at 80/80 and `CONTEXT.md` at 132/150. Every new rule already costs an old one, and
EPIC-003…005 are three epics' worth of incoming rules. This is not housekeeping deferred until it
feels tidy — it is the prerequisite that makes the other three writable, which is why it runs first.

The driver is measured, not felt: the last 15 sprints spent 10.9 lines of doc churn per line of
product churn, against 91 learnings, 17 ADRs, 31 research docs, 11 checkers and 24 eval harnesses
(`docs/research/platform-readiness-audit.md` F1 · F7). It spans sprints because the corpus cannot be
cut in one pass without breaking the evidence rule below.

**The evidence rule binds every task here.** Nothing is deleted because it is old, long or
inconvenient — only because it can be shown not to be load-bearing. The guards find real defects
(F2: SPRINT-056 found five gates green over input they never read), and TD-012 already records what
happens when fixtures are deleted with the prototype that created them. A removal without evidence is
this epic failing, not this epic succeeding.

## Scope

**In:** rule the three over-cap docs (raise by ADR, or split per §6) · give the §2 soft-cap report a
consumer at promote · collapse the LEARNINGS corpus per §11 · archive spent research per §11 ·
restructure the SSOT caps with an ADR · consolidate overlapping logic across the 11 `check-*.sh`
checkers.

**Out (explicitly not):** deleting eval fixtures (TD-012 binds — a must-FAIL fixture is the guard) ·
retiring any *rule* that a promoted `L-NNN` stands behind · touching the sprint archive (61 closed
records are history, and history is not corpus) · relaxing a gate to reduce work.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-062](../sprint/archive/SPRINT-062-room-to-write.md) | Room to Write — three governance signals, and whether anything is listening | closed · `f0f72c0` | Ruled the first cap by **splitting** rather than moving a number, and generalised it: §2's Growth rule now sorts a breach into drift vs a cap that was never reachable, so the remaining three have a procedure instead of a hypothesis. Gave the §2 cap report a consumer at promote — the review had been reporting doc-aging clean over three standing breaches. Established that the LEARNINGS corpus is healthy and that the count suggesting otherwise was measuring its own query. **Headroom delivered: none** — that is TASK-196's, now unblocked. |

## Decisions

- **D1** — Subtraction is scoped as a first-class epic rather than a recurring background chore,
  because the caps are a hard blocker for the roadmap and a chore never gets a Closed-when. **→ no ADR**
  (not surprising, and reversible).
- **D2** — The SSOT cap question is settled by ADR, not by trimming to fit. ADR-015 rules that a soft
  cap cannot be grandfathered, so "add it to the list" is unavailable and the number itself must be
  argued. **→ ADR pending, EPIC-002 sprint 2.**

## Open questions

- Does §11's trigger list or §2's caps own the soft-cap report? → TASK-193's G2; re-derive before
  writing (L-091) — "add a fifth checklist line" is the obvious move and may be wrong.
- Can 11 checkers consolidate without losing per-check named findings? → a `/prototype` if it cannot
  be settled on paper; the named finding is the contract (L-058), not the file count.

## Closed when

- [ ] `CLAUDE.md` and `CONTEXT.md` each carry ≥ 15% headroom against their caps
- [ ] No doc sits over a soft cap without an ADR recording the ruling
- [ ] Every surviving `check-*.sh` is either consolidated or has a one-line reason it stands alone
- [ ] LEARNINGS and `docs/research/` have had one §11 pass applied, with the evidence rule honoured
