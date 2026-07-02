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
