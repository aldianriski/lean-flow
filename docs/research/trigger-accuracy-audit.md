---
owner: Maintainer
last_updated: 2026-06-22
update_trigger: A skill description changes, or implicit triggering becomes a design goal
status: current
---

# Research — Do the skill `description:` fields trigger accurately? (SPRINT-010 T2)

> **Question.** Does each skill fire on the right intent (no under-trigger) and not on the wrong one (no mis-trigger)?
> **Verdict.** Healthy. The set is **predominantly explicit-invoke**, which makes trigger-accuracy low-stakes for 13 of 14; `/council` is the one engineered for *implicit* triggers and is well-built (watch for over-eagerness). A few minor overlap-sharpening opportunities, no critical defects. Method: analytical review (skill-creator eval = the deeper follow-up).

## Why this matters

A `description:` decides when a skill auto-fires from a described intent. A mis-trigger interrupts with the wrong tool; an under-trigger means the right tool never shows up.

## Findings

**1. Most lean-flow skills are explicit-invoke — trigger accuracy is low-stakes for them.** The loop is driven by *typing* `/prime`, `/orchestrator`, `/lean-doc-generator`, etc. For these, the `description:` mainly serves human disambiguation + routing, not auto-firing. Their descriptions already carry strong **"Do not use … use /X"** boundaries (orchestrator↔diagnose, tdd↔diagnose, prototype↔tdd, triage↔task-decomposer, handoff↔close) — clean separation.

**2. `/council` is the one implicit-trigger skill — and it's well-engineered.** It lists MANDATORY triggers ("council this", "war room this") + STRONG triggers ("should I X or Y", "which option", "validate this") **and** an explicit "Do NOT trigger on simple yes/no, factual lookups, casual should-I." Risk: the STRONG list is broad enough to over-fire on a casual "should I" — but the negative guard mitigates it. *Watch, don't change.*

**3. `/insights` ("anytime friction") is the under-trigger risk.** "Anytime" intent rarely surfaces a clear auto-trigger; in practice it relies on explicit `/insights`. Acceptable (it complements the Sprint-Close Retro), but it will under-fire implicitly by nature.

**4. Minor overlap surfaces (human-facing, not auto-fire):** "build feature X" sits near orchestrator / task-decomposer / tdd; mitigated by each description's "Do not use" routing. "file a learning" sits near insights / lean-doc-generator-close; mitigated by "anytime vs at-close."

## Recommendation

- **No critical fix.** The set is healthy; the explicit-invoke model makes description-trigger accuracy a minor lever here.
- **Low-priority polish (follow-up):** optionally tighten the insights↔retro and orchestrator↔task-decomposer↔tdd boundary phrases — cosmetic.
- **Deeper validation (follow-up, only if implicit triggering becomes a goal):** run `skill-creator`'s description-trigger eval to get quantitative mis/under-trigger rates — worth it for `/council` specifically (the one skill where implicit accuracy matters).

Not hard-to-reverse → no ADR.

## Out of scope / open questions

- No description edited this sprint (D1) → any polish = a follow-up `TASK`.
- Whether any *stage* skill should be made to fire implicitly (currently none do — by design) is a separate product question, not a trigger defect.
