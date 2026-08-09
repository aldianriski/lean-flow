---
id: ADR-006
tags: [docs]
domain: doc-standard
status: accepted
related: [ADR-007, ADR-003]
---

<!-- One ADR per file · append-only · WHY only. Decision pressure-tested by /council (first live run,
     SPRINT-003 T2) — verdict-skill-cap-executable-artifacts.md, 5 advisors + 5 peer reviews. -->

# ADR-006 — SKILL cap counts procedure only; executable artifacts live in references/

- **Status:** accepted (2026-06-11)
- **Deciders:** Maintainer (chairman synthesis from the /council verdict)
- **Context driver:** standard credibility — the ~110-line SKILL cap read absolute while `/council` (~330 lines) silently violated it (TD-002 · TD-004); a rule with silent exceptions rots into suggestion.

## Context

The cap was calibrated for procedural stage-skills and for human cognitive load. `/council` is a
*method* skill: ~105 of its lines are **executable artifacts** (5 advisor definitions + 3 prompt
templates — invocation-critical, read mid-run) and ~55 are an illustrative worked example; the
remainder is procedure. The cap rule never distinguished these content kinds — measured blast
radius: 1 of 13 skills over cap, 2 open TD rows, and every future method-grade skill facing the
same fork. The council's peer-review round surfaced the deciding facts: the content is not
monolithic, and the skill's actual reader is the model (which Reads references on demand —
fragmentation cost ≈ zero).

## Decision

**Amend the cap rule, then conform — leaving no exception.** The rule becomes: *SKILL.md ≤ ~110
lines of procedure + scaffolding; executable artifacts (prompt templates, persona/advisor
definitions, schemas) live in the skill's own `references/` by convention and don't count toward
the cap.* `/council` is then brought into conformance (TASK-005): artifacts + worked example →
`skills/council/references/`, SKILL.md keeps when-to-use, the 6-step outline, red flags, and
per-step read pointers. Chosen because it resolves both TD rows in one move and replaces a
strict-but-violated rule with a precise one.

## Consequences

**Positive:** the standard is again credible (no silent or documented exceptions); future
method-grade skills have a principled home; TD-002 + TD-004 close together.
**Negative (trade-offs accepted):** the method is no longer single-file — maintainers edit
SKILL.md + references/ together, and template-vs-procedure drift becomes possible (mitigated by
per-step read pointers); the amended rule needs honest policing — "executable artifact" must not
stretch to cover ordinary prose.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Documented exception (cap rule annotated, council stays 330) | Legitimizes the pattern — the exception becomes the template for the next one; "a discipline tool with a documented exception is a suggestion with extra steps" |
| Slim under the *unchanged* rule | Treats the symptom; the next method skill re-fights the same battle; rule stays miscalibrated |
| Two-tier taxonomy (procedural vs method skills) | No admission criterion — itself speculative scaffolding, and the fuzzy boundary is the loophole the amended rule avoids |
| Status quo (silent violation, tracked as debt) | The worst state — all five advisors and all five reviewers agreed silence rots the standard fastest |

---

## Amendment — 2026-08-09 (SPRINT-048 T6): cap raised 110 → 140

**Decided text above is unchanged** (append-only). This records a later change to the *number*, not
to the rule's shape: `SKILL.md` ≤ **~140** lines of procedure + scaffolding; artifacts in
`references/` remain uncounted.

**Driver.** `/lean-doc-generator` is absorbing creation of every core doc — a `prd` verb alongside
`epic` (SPRINT-048 T7) — and its `SKILL.md` sat at exactly 110/110. The generator legitimately does
more than the other skills: it owns the standard, the templates, and the whole sprint lifecycle.

**Diet first, measured before the raise.** The Migrate and Init sections restated procedures that
already lived in `references/migration-map.md` and `references/init.md`; compressed to dispatch
entries they returned **110 → 103, a 7-line reclaim** — verified green against the *old* 110 cap
before the number moved. (An earlier estimate of ~15 lines was optimistic; the measured figure is 7,
recorded rather than rounded.) This follows **ADR-007**'s precedent exactly, which dieted `CONTEXT.md`
before raising it to 130.

**The argument against, recorded because it was overruled.** The cap is repo-wide across 14 skills,
so raising it loosens every one of them to solve a problem in a single file — and `prime` was already
at 107, `orchestrator` at 100. This ADR's own context driver is that *"a rule with silent exceptions
rots into suggestion"*, and DOCS_Guide §7 said flatly "never raise the limit". The reclaim alone had
already cleared the immediate need, so the raise was not forced. **Owner decision: do both** — take
the reclaim and lift the cap, on the grounds that the generator's scope has genuinely grown and the
headroom is worth having in advance rather than re-fought per task.

**Reconciled, not silently contradicted.** §7's row and §2's growth rule now read "never raise the
limit **to fit content** — a cap moves only by ADR, diet first", naming ADR-007 and this amendment as
the two instances. The blanket prohibition stands; what changed is that the escape hatch is written
down and costs an ADR, which is the opposite of a silent exception.

**Consequence accepted:** 13 other skills may now grow to 140 with no gate objection, and nothing but
review stops that. The trigger for revisiting is a second skill crossing ~120 without a comparable
scope story.
