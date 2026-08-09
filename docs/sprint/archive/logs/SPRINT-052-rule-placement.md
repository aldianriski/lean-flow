---
sprint: 052
slug: rule-placement
owner: Maintainer
last_updated: 2026-08-09
status: closed
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

### 2026-08-09 | surprise | TD-036's Summary was false the day it was filed
T2. The row says the `Cites:` escape is documented "only inside the checker". `docs/QA.md`'s
layers-completeness row documents it in full — exemption, absence-changes-nothing, and the
`Cites:`/`Layers:` contradiction — and `git log -S` puts that text in `75e61a8`, **the SPRINT-049 close
that filed the row**. So the premise the task was sent to act on had never been true. This is L-091 one
level up from the Mitigation lines it was promoted about: the rule fired against the very row T2 was
opened to serve, in the same sprint that promoted it. A2 resolves cleanly and not as a tie.

### 2026-08-09 | complete | T2 — TD-036 closed not-supported; the residual is TD-039
The consumer question decides it: `check-layers-completeness.sh` is `scripts/` maintainer tooling
(ADR-008) that ships to nobody, so a `Cites:` line in `SPRINT.md.template` would advertise to every
consumer a convention nothing on their side enforces (L-015). Neither surface takes the line; the
template and `docs/QA.md` are untouched. What survives is a gap on a surface neither the row nor
TASK-161 named — `check-layers-completeness.sh:135`/`:149`, the two FAILs an author actually trips,
name what is missing from `Layers:` but never the escape, so the obvious repair is to declare a touch
that is not one. Filed as **TD-039** rather than fixed here: that file sits in T2's `Cites:`, not its
`Layers:`, and widening the task to reach it is the L-088 trap. Per the owner ruling at G2, it goes to
the next promote. `TECH-DEBT.md`'s header also takes L-091's pointer line under this task, which owns
the file (see the G1/G2 entry above).

### 2026-08-09 | close | 12/12 DoD, four buckets routed, one new learning
Retro written into § Plan's sibling. Buckets: **Shipped** → `DOCS_Guide` §10's two new rules, which
ship inside the plugin and so are consumer-facing — held for `/release-patch` rather than written to
`CHANGELOG.md` here, the same call SPRINT-051 made. **Tech debt** → TD-039, filed during T2 rather than
at close. **Follow-ups** → none; TD-039's own Mitigation says re-derive before building, and it enters
at the next promote's TD scan, so a TASK now would be the shape D4 rejected. **Learnings** → L-095
(a red freshness row is a diff, not a mystery). Deliberately *no* entry for TD-036's stale Summary:
that is L-091's third firing and "cite the evidence for the problem" already covers it — a fresh id
would duplicate a promoted rule. §11 retention and the doc-freshness refresh go to the owner as one
propose→approve pass; nothing lossy was applied unilaterally.
