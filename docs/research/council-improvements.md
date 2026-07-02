---
owner: Maintainer
last_updated: 2026-07-02
update_trigger: A new deliberation technique or source changes the recommended council changes
status: current
id: council-improvements
tags: [process, tooling]
domain: skills
related: [ADR-004]
---

# Research — What should `/council` borrow from STORM and multi-agent-deliberation prior art?

> **Question.** `/council` runs 5 fixed opinion lenses → anonymized peer review → chairman verdict.
> Comparing it to the `storm-research` skill (`docs/research/storm/`) and the deliberation literature,
> which mechanisms are worth adding — and at what token cost?
> **Verdict.** Adopt the **near-free bundle** (pre-mortem line · dialectical Contrarian · calibrated
> confidence+dissent in the verdict · perspective-guided questions · name the single-model ceiling) now;
> add a **gated adversarial fact-verification pass** and an **unknown-unknowns moderator** as conditional
> steps; **defer** multi-model diversity; **reject** multi-round debate.

## Why this matters

`/council` is the opt-in pressure-test before an ADR or a G2 fork — being wrong there is expensive by
definition. The core structural risk the research exposes: **5 personas on one model share that model's
weights, so they share its blind spots** — peer review can't catch an error all five inherit. Cheap
hardening buys real decision quality; the wrong additions just burn tokens (council is already ~11 calls).

## The mismatch (frames the whole answer)

STORM optimizes **breadth of a synthesized document**; a council optimizes **quality of one convergent
decision**. Only STORM's *input-shaping* mechanisms transfer (diverse questioning, coverage-tracking,
unknown-unknowns, grounding). Its *output-generation* machinery — writer↔expert simulation loops,
outline→article, perspective-discovery-by-surveying-articles — does **not**; a council converges, it
doesn't maximize coverage. *Source:* [STORM, arXiv:2402.14207](https://arxiv.org/abs/2402.14207) ·
[Co-STORM, arXiv:2408.15232](https://arxiv.org/abs/2408.15232).

## Options considered

- **A — Near-free bundle** — 5 changes folded into existing prompts, 0 extra agents. *Trade-off:* real quality lift, no cost; doesn't fix the shared-weights ceiling.
- **B — A + gated fact-verification + unknown-unknowns moderator** — 2 conditional passes (~1–4 extra calls, only when warranted). *Trade-off:* catches hallucinated facts + groupthink; opt-in cost.
- **C — B + multi-model backend** — route ≥2 personas to a different provider to recover architectural diversity. *Trade-off:* the only fix for shared blind spots, but heaviest — changes the single-model-persona design + adds a provider dependency.

## Findings

- **Pre-mortem is a distinct, near-free win.** "Assume this verdict failed in 6 months — what killed it?" surfaces *failure modes of the chosen path*, which the Contrarian's argue-the-opposite-position does not. Dialectical inquiry / devil's advocacy beat consensus on decision quality (lower *acceptance*, higher *quality*). → A. *Source:* [AMJ 10.5465/256567](https://journals.aom.org/doi/10.5465/256567) · [10.5465/255859](https://journals.aom.org/doi/10.5465/255859).
- **STORM's gain came from diverse *questions*, not answers.** Have each lens emit its top 1–2 decision-critical *questions* before verdicts; the chairman uses uncovered questions as the blind-spot checklist. → A. *Source:* [arXiv:2402.14207](https://arxiv.org/abs/2402.14207).
- **LLMs are systematically overconfident**; generating the recommendation *before* the confidence score, and reporting where lenses diverged, beats laundering disagreement into false consensus. → A. *Source:* [Tian et al., arXiv:2305.14975](https://arxiv.org/abs/2305.14975).
- **Single-model councils reduce *framing* blind spots, not *knowledge* ones.** Karpathy's original council exploited cross-*model* diversity (uncorrelated errors); 5 personas share one model's priors and factual gaps. State this ceiling in the verdict so users don't over-trust unanimity. → A (disclosure) / C (fix). *Source:* [karpathy/llm-council](https://github.com/karpathy/llm-council).
- **Reasoning peer-review does NOT catch hallucinated facts.** An *independent* critic beats self-critique; a refuter that extracts load-bearing factual claims and verifies cited URLs catches fabricated citations (invalid refs resolve to nonexistent URLs). Worth ~2–4 calls **only when the verdict rests on external facts/citations** — skip for pure judgment forks (the common case). → B. *Source:* [N-CRITICS, arXiv:2310.18679](https://arxiv.org/pdf/2310.18679) · [Self-Refine, arXiv:2303.17651](https://arxiv.org/abs/2303.17651).
- **An "unknown-unknowns" moderator breaks echo chambers.** One cheap agent surfacing a consideration *no lens raised* directly attacks groupthink in a fixed-lens panel (Co-STORM's moderator move). → B. *Source:* [arXiv:2408.15232](https://arxiv.org/abs/2408.15232).
- **Judge-bias mitigations are cheap hardening.** Position bias (council already randomizes A–E; add reviewer-order rotation + a two-pass/swap keeping only order-stable rankings), verbosity bias (cap persona length; score on a rubric, not prose volume), self-preference (author==judge here → lean on anonymization + a chairman that discounts fluency/familiarity). → A. *Source:* [Zheng et al., arXiv:2306.05685](https://arxiv.org/abs/2306.05685) · [arXiv:2410.21819](https://arxiv.org/abs/2410.21819).
- **Multi-round debate is not worth it.** "Should we be going MAD?" finds multi-agent debate does not reliably beat cheaper self-consistency/ensembling, is hyperparameter-sensitive, and costs more — and it targets factual QA, not decisions. Council's single anonymized round already captures the reliable part. → reject. *Source:* [Smit et al., arXiv:2311.17371](https://arxiv.org/abs/2311.17371) · (debate baseline: [Du et al., arXiv:2305.14325](https://arxiv.org/abs/2305.14325)).

## Recommendation

**Ship Option B, phased.** The **near-free bundle (A)** is a pure win with no cost story — do it first.
The **gated fact-verification pass** and **unknown-unknowns moderator** are the two additions that
justify their tokens, and both are *conditional* (fire only when the decision leans on external facts /
when groupthink risk is high), keeping council token-disciplined. **Defer C (multi-model)** — it is the
only real fix for shared-weights blind spots but changes the architecture and adds a provider dependency;
revisit if a high-stakes council is observably wrong from a shared prior. **Reject multi-round debate.**

Not surprising enough for its own ADR (it refines an existing skill, doesn't reverse a decision) — this
doc is the WHY-trail for the build task. **Landing-spot discipline (L-012):** `council/SKILL.md` is
capped (ADR-006); the near-free items are reworded lines in the existing 6 steps, and the two conditional
passes + all prompt templates land in `council/references/` — not new SKILL body sections.

## Out of scope / open questions

- **This is decide-only.** The build is a follow-up **TASK** (proposed: "Harden `/council` — pre-mortem · dialectical Contrarian · calibrated verdict · gated fact-verify · unknown-unknowns moderator") — decompose + G2 before editing the skill.
- **Multi-model backend (C)** — deferred; needs a separate call on whether lean-flow takes a provider dependency at all.
- **Verification integrity note.** The source sweep surfaced 3 arXiv IDs (`2604.*`, `2606.*`, `2508.*`) with citation-accuracy stats I couldn't place, so I dropped them rather than cite. **Update (SPRINT-014/T3 exercise):** the newly-built fact-verify pass checked `arXiv:2604.03173` — it *is* a real 2026 paper, but the figures cited to it were **misattributed** (its real finding: 3–13% of citation URLs hallucinated). So the risk was a misattributed stat, not a fabricated ID — precisely what an adversarial fact-verify pass catches that reasoning-review misses.
- **ADR-009 frontmatter** — applied to this doc in SPRINT-014/T1 (tags reused + the `domain` axis fixed at G2); it now appears in the generated `docs/knowledge-index.md`.
