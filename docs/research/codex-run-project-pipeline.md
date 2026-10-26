---
owner: Maintainer
last_updated: 2026-10-25
update_trigger: The owner's Codex pipeline skill changes, or a candidate below is built or rejected
status: current
id: codex-run-project-pipeline
tags: [process, docs]
domain: skills
related: [loopcraft-adaptation, behavioral-eval-feasibility, ADR-001, ADR-044, ADR-053]
---

# Research — what does the owner's Codex `run-project-pipeline` skill carry that lean-flow lacks?

> **Question.** The owner runs product milestones in Codex with a `run-project-pipeline` skill. Which of its
> techniques, judged on the delta over lean-flow's existing surface (L-017), should lean-flow adopt — for
> managing an existing system, for `init` on a fresh repo, and in skill or agent form?
> **Verdict.** **Adopt eleven narrow deltas and one learning; adopt neither the state file nor the design
> guides wholesale.** Most of the skill is already lean-flow surface, and its domain guides (brand, spatial, IoT) belong
> to the projects, not to the plugin. No new skill and no agent clears ADR-001's bar.

## Why this matters

The owner builds client prototypes (the skill's own lessons name Kawanan, Sela, Vigor, Teminfra and
Workdoo) and wants the same discipline in Claude. Importing the skill whole would duplicate lean-flow's
work store and gates. Ignoring it would leave gaps it has already closed in Codex.

## What it is

One Codex skill (read 2026-10-25, ~100 KB, 21 files): `SKILL.md` (modes Plan/Build/Improve/Audit/Handoff/Resume
routed by "what must be proved") · 12 reference guides · a JSON project-state schema plus a stdlib Python
validator · 6 isolated evaluation cases (F1–F6) · a pinned register of four adapted upstream design skills.
Source: `D:\Research\run-project-pipeline` (owner-local, not published).

## Findings — concept map

| Codex technique | lean-flow equivalent | Verdict |
|---|---|---|
| Modes by proof; small change gets no governance package | `/orchestrator` quick·mvp·sprint-bulk | matched |
| 1–3 questions with a recommendation; keep working past an optional one | frontier rule; park + continue disjoint AFK | matched |
| `next_action` needs an authorization ref | J0/J1/J2 authority | matched (stronger) |
| Execution vs review status kept apart | `review/` → `done/` folders | matched |
| Pass/Fail/Unverified/N-A; "a build is not a browser test" | EXISTS/RUNS/REACHES/PROVES · `UNVERIFIED (cannot run)` | matched |
| N/A only with an accepted decision | L-088: no reinterpreting a DoD without an owner ruling | matched |
| Dependencies, cycles, blocked-needs-reason (validator) | dispatch preflight · `depends-on` · flow-blocking rule | matched |
| Cross-project lessons | `LEARNINGS.md` | matched |
| JSON checkpoint + Python validator | `docs/work/` store + TS checks | **reject** — a second state store; no new non-TS scripts |
| Brand identity · spatial/IoT/AI · promo-site guides | — | **reject for lean-flow** — project-domain content |
| Source register pinned by commit | humanizer header pins a version | **fold into TASK-498**, no new register (one vendored source) |
| Effect `unknown_outcome` → readback before retry | none; edit-safety (c) is in-session only | **adopt (1)** |
| Finding resolved as fix · reject-with-evidence · defer-with-impact | revise loop is `fixed \| still-open` only (`review-scoping.md`) | **adopt (2)** |
| Decision records "reopen when" | ADR template has no revisit trigger | **adopt (3)** |
| Blind behavioural cases for skill changes | `evals/` behavioural run covers night-run parking only | **adopt (4)** — ADR-053 machinery, needs a named reason |
| Milestone contract: proof goal · stopping condition · integration boundary | `requirements.md` has none of the three | **adopt (5)** — init |
| Journey step: record · owner · next owner | `flows.md` has trigger, steps, failure branches | **adopt (6)** — init |
| Role × capability × **scope**; hidden UI is not enforcement | auth template: Role · Can do · Cannot do | **adopt (7)** — init |
| Improve mode: inspect, preserve valid behaviour, compare before/after | routing has new·bug·hard-to-change, no pin-existing step | **adopt (8)** — existing systems |
| First proof ranked by value · uncertainty · dependency · effort | decomposer scores risk (impact × likelihood), not build order | **adopt (9)** — narrow |
| Customer-review prototype: bounded simulation, task script, walkthrough ≠ validated | `/prototype` answers one internal question, throwaway | **adopt (10)** — new branch |
| Design direction brief; route to specialist design skills | `/prototype` UI has variants, no direction step, no `DESIGN.md` hand-off | **adopt (11)** — reuse review's `antislop` deferral shape |
| "A model critique is never customer or expert validation" | consumer-evidence reason in ADR-053, unguarded against model review | **learning (L-candidate)** |

## Recommendation

File (1)–(11) as backlog tasks through `/task-decomposer`, and the learning through `/insights`. (4) enters only with
one of ADR-053's five reasons named in its `## Why`; without one it stays in the backlog. No new design skill:
the owner's environment already has `frontend-design` and `anti-slop`, so (11) routes to them when installed
and keeps a floor when not, the same as review's UI-floor deferral. No agent: every candidate role (design critic,
product critic) is covered by `/run` + `/verify` + the UI floor or by `/council`.

## Out of scope / open questions

- The design, brand and spatial guides may suit the workdoo repo as project docs. That is a workdoo decision, not a plugin one.
- A `/council` lens set for product critique (operator · domain · UX · engineering · evidence) was considered and
  held: council advisors are thinking angles by design (`council/references/advisors.md`).
