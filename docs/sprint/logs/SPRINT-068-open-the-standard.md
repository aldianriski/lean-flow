---
sprint: 068
slug: open-the-standard
owner: Maintainer
last_updated: 2026-08-15
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-068 — Execution Log

> Append-only companion to [`../SPRINT-068-open-the-standard.md`](../SPRINT-068-open-the-standard.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-15 | progress | T1 ruled — CONTEXT.md becomes a consumer; ADR-023 + Layers correction
T1: gates approved (batch G1+G2, owner-signed via popup; T2/T3 parallel worktree dispatch, T2→T3
merge order, evals/README.md owned by T2). Fork ruled B — the extracted `spec/` tree is the SSOT
for standard-owned rules, `.claude/CONTEXT.md` becomes a consumer keeping only project-local facts;
migration window closed by move+cite atomic extraction commits. Recorded as ADR-023 (owner chose
ADR over an epic D4 note); EPIC-003 Q3 marked answered with the pointer; DECISIONS.md indexed;
knowledge index regenerated. CONTEXT.md measured 132/150 — the ruling spent 0 lines, as the DoD
required. **Layers correction (L-100):** recording an ADR entails its index row — `docs/DECISIONS.md`
added to T1's `Layers:` (flagged by the layers-observed gate leg, exactly its job; logged here
before the Plan edit).
