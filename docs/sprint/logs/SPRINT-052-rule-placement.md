---
sprint: 052
slug: rule-placement
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-052 — Execution Log

> Append-only companion to [`../SPRINT-052-rule-placement.md`](../SPRINT-052-rule-placement.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | progress | G1 + G2 signed off; TECH-DEBT.md assigned a single owner
Batch G1 and G2 ran as one pass over both tasks. D1's file-disjointness held for the tasks **as
declared**, but the approved T1 design places an L-091 pointer in `TECH-DEBT.md`'s header — a file in
T2's `Layers:` and not T1's. Rather than widen T1's declaration, `TECH-DEBT.md` was given a single
owner (**T2**) with commit order T1 → T2: §10 alone satisfies every T1 DoD line as written, and the
`/triage`-facing pointer lands in T2's commit, whose subject matter is the same rule firing. No
scope-change entry — both tasks stay inside their declared Layers.

### 2026-08-09 | surprise | A1's enumeration found the interchangeable-homes menu on three surfaces, not one
T1. The sprint file assumed the fix was `DOCS_Guide` §10, and §10 is right — but the same "a CLAUDE.md
anti-pattern, a CONTEXT.md rule, **or** a skill red-flag" menu also sits in `.claude/CONTEXT.md`
§ Continuous learning governance and in `docs/LEARNINGS.md`'s own header. Amending only §10 would have
left two copies of the error L-092 was promoted to stop — the learning failing on its own promotion.
Both duplicates were rewritten to point at the test instead of restating the menu. This is the wiring
half of L-092 (a rule is placed *and* its stale copies retired), and it is why the DoD line "placed by
its own criterion" was not satisfiable by a single-file edit.

### 2026-08-09 | complete | T1 — L-091 and L-092 promoted; §10 now states a placement test
Both entries collapsed to pointer lines per §11, `status: promoted`, ids monotonic (next new id stays
L-095). §10 gained two rules: the **placement test** (enumerate the flows that can hit the failure →
place where all of them read; a skill red-flag is scoped to that skill's flow; duplicates get rewritten
to point at the one home) and **`Mitigation:` is a hypothesis** (cite the evidence for the problem,
re-derive the fix — at close when filing one, at promote before a DoD is built on one). `CLAUDE.md`
untouched at 80/80: neither failure is repo-wide, so the cap-displacement ruling A1 warned about was
not needed. `docs/knowledge-index.md` regenerated; `CONTEXT.md` held at 123/130 via a same-line rewrite.
