---
sprint: 052
slug: rule-placement
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: 703373e
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-052 — Rule Placement

> **Theme:** Two tasks about the same question asked at two altitudes: *where does a rule have to live
> to actually fire?* L-092 says a promoted learning fires only inside the skill it was filed into, and
> it has already cost us twice. TD-036 is the same failure one level down — the `Cites:` escape works
> and is documented, but only inside the checker, so an author meets it by tripping the gate. Neither
> is about writing new content; both are about placing content where the reader who needs it will be.

## Scope

**In:** promote L-091 and L-092 into durable rules, placed by the test L-092 itself states · decide
which surface documents the `Cites:` convention, consumer question first.

**Out (deferred):** TD-037 — its 3-sprint re-review fired at this promote and was **reaffirmed as a
deliberate hold** (owner ruling, D3); its trigger is evidence of a real miss on the uncommitted path
and none has appeared. TD-038 is two sprints old and its own text says not to act before the next
re-scan. TASK-155 and TASK-159 stay `needs-info` — both wait on an evidence source that has never
materialised, and neither blocks anything. **No calibration-row task was filed** — see D4.

## Plan

### T1 — Promote L-091 and L-092, placed where every affected flow reads them `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/LEARNINGS.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` ·
    `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: `scripts/qa-check.sh` T2

Both reached `count: 2` at SPRINT-051's close. L-092 is the interesting one because it indicts the
promotion rule itself: DOCS_Guide §10 offers "a CLAUDE.md anti-pattern, a CONTEXT.md rule, **or** a
skill red-flag" as though the three were interchangeable homes. They are not — a skill red-flag is
scoped to that skill's flow. L-087 was filed into `/diagnose` and then failed to fire during a
`promote`; redaction lived in `/handoff` and never reached `/diagnose`. The fix is a placement test
applied at promotion time, which means §10 is where it belongs.

**Acceptance:** both entries read `promoted: yes → <where>` and are collapsed to pointers, and §10
carries a placement test that would have caught both prior misses.

**DoD:**
- [x] **L-092 placed by its own criterion** — ask *which flows can hit this failure*, then place the
      rule where all of them read. A rule about rules landing in one skill only must not itself land
      in one skill only; if the analysis says otherwise, that is a ruling, not a quiet override (L-088)
- [x] `DOCS_Guide` §10's promotion rule amended so the three homes are no longer presented as
      interchangeable — the choice gets a stated test rather than a menu
- [x] **L-091 placed by the same test** — a TD row's Mitigation line is the filer's hypothesis, and the
      flows that hit it are *promote* (a Mitigation carried into a DoD) and *close* (a Mitigation
      written under pressure), so a `/diagnose`-only home would be wrong for it too
- [x] Both entries collapsed to pointer lines per §11; ids stay monotonic
- [x] `docs/knowledge-index.md` regenerated (`sh scripts/gen-index.sh`)
- [x] Every file touched stays within its cap — `CLAUDE.md` is at its 80-line limit, so anything landing
      there displaces something rather than appending
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit, after the DoD ticks and the
      log entry (L-089)

### T2 — Decide which surface documents `Cites:` `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/lean-doc-generator/templates/SPRINT.md.template` · `docs/QA.md` · `TECH-DEBT.md`
Depends-on: none
Cites: `scripts/qa-check.sh` `scripts/lib/check-layers-completeness.sh` T1

TD-036. The escape works and is documented **inside the checker**, so the only way to learn it exists
is to trip the gate and read source comments — the behaviour TD-032 was filed to stop, reappearing one
level up. The consumer question comes first and may well decide the whole thing: the checker is
maintainer tooling (`scripts/`, ADR-008) that no consumer runs, so a line in the SPRINT template would
advertise a convention nothing enforces on their side (L-015).

**Acceptance:** `Cites:` is documented on whichever surface the consumer question selects, or TD-036
closes with a written reason it belongs on none.

**DoD:**
- [ ] The **consumer question answered first and in writing**: does a consumer writing a sprint file
      from the template benefit from a convention only our gate enforces? The answer drives placement
- [ ] The line lands on the chosen surface — template, maintainer-facing docs, or neither
- [ ] If "neither", TD-036 closes with that reasoning rather than staying open as a nag
- [ ] `TD-036` marked resolved (or closed-not-supported) in the ledger, with the outcome stated
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

## Decisions (pre-locked)

- **D1** — **T1 and T2 are file-disjoint**; no ownership map needed, no commit order enforced.
- **D2** — **the two promotions run as a task, not as a promote-time edit** *(owner ruling)* — the same
  shape as L-088 → SPRINT-049 T2. The governance checklist's L-promotion line is resolved by
  *scheduling*, so the rules get a DoD and a review pass instead of being written in passing.
- **D3** — **TD-037's re-review reaffirms the deferral** *(owner ruling)*. Recorded in the ledger with
  the reasoning: no evidence of a miss on the uncommitted path has appeared, and acting would mean
  guarding an unobserved failure by inferring the in-flight task — TD-031's pattern restarting.
- **D4** — **no calibration-row task filed.** The TASK-148 routing recommended one, but `night-run.md`
  § *The calibration row (one per run, always — green or not)* already mandates it unconditionally,
  with a degrade rule for unavailable fields. The series is thin because few runs happen, not because
  the instruction is missing — and a task that completes only when an uncontrolled event occurs is
  exactly what got TASK-148 routed out one sprint ago.
- **D5** — **§11 applied at this promote**: `TD-031`, `TD-032` and `TD-035` deleted (all resolved at
  SPRINT-049, three sprints ago). Ledger 226 → 113 lines. TD-035's residual was already split into
  TD-037 precisely so this deletion would lose nothing live.

## Assumptions

- **A1** — L-092's placement test resolves cleanly for both entries: the set of flows that can hit each
  failure is enumerable, so "place it where all of them read" names a specific file rather than
  "everywhere". *Confirm: T1's first step, by listing the flows for each. If the honest answer for
  either is "every flow", the rule belongs in `CLAUDE.md` — which is at its cap, so something must be
  displaced, and that is a ruling rather than a silent cap breach.*
- **A2** — TD-036's consumer question has a real answer rather than being a tie. *Confirm: T2's first
  step. If it is genuinely balanced, "neither surface" is a legitimate outcome and the DoD already
  admits it — this task is allowed to end by closing the row rather than writing a line.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-052-rule-placement.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §10 gains the placement test + the `Mitigation:`-is-a-hypothesis rule — the two promotions land where every promoting flow reads | low | `qa-check.sh` |
| `docs/LEARNINGS.md` | T1 | L-091 + L-092 collapsed to pointers (§11); the header's three-home menu replaced by a pointer at the test | low | `qa-check.sh` |
| `.claude/CONTEXT.md` | T1 | § Continuous learning governance menu → pointer at §10's test; same-line rewrite holds 123/130 | low | `qa-check.sh` |
| `docs/knowledge-index.md` | T1 | regenerated after the status changes | low | `gen-index.sh` |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->
