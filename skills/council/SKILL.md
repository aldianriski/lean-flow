---
name: council
description: "Run a high-stakes, hard-to-reverse, or ambiguous decision through a council of 5 AI advisors who independently analyze it, peer-review each other anonymously, and synthesize a final verdict to a lean verdict-<slug>.md. The opt-in decision aid for genuinely hard forks — the pressure-test before an ADR (DOCS_Guide §4) or a G2 design call. Based on Karpathy's LLM Council. Uses sub-agents (≈11 model calls/run) — reserve for decisions where being wrong is expensive, NOT every choice. MANDATORY TRIGGERS: 'council this', 'run the council', 'war room this', 'pressure-test this', 'stress-test this', 'debate this'. STRONG TRIGGERS (with a real decision/tradeoff): 'should I X or Y', 'which option', 'what would you do', 'is this the right move', 'validate this', 'get multiple perspectives', 'I can't decide', 'I'm torn between'. Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff."
allowed-tools: Read, Write, Glob, Grep
user-invocable: true
version: "1.0.0"
---

# LLM Council

Ask one AI, get one answer — and you can't tell if it's great or mid, because you only saw one
perspective. The council runs your question through **5 independent advisors** (different thinking
lenses), has them **peer-review each other anonymously**, then a **chairman** synthesizes a final
recommendation: where they agree, where they clash, and what to actually do. Adapted from Andrej
Karpathy's LLM Council, run inside Claude via sub-agents with different lenses instead of different models.

> **Cap (ADR-006):** this SKILL is the **procedure only**. The executable artifacts — advisor
> definitions, prompt templates, the worked example — live in `references/` and are read on demand,
> so they don't count toward the ~110-line cap.

## When to run

For decisions where **being wrong is expensive** and there's genuine uncertainty — pricing,
positioning, pivots, hard architectural / scope forks, "am I crazy to do X?". NOT for one-right-answer
questions, creation tasks, or processing/summarizing tasks. If you already know the answer and just
want validation, expect the council to tell you things you don't want to hear — that's the point.
Triggers are in the description; reserve it (~11 model calls/run).

## The five advisors

Five thinking styles chosen for the tensions they create — Contrarian ↔ Expansionist (downside ↔
upside), First Principles ↔ Executor (rethink ↔ ship), with the Outsider in the middle keeping everyone
honest. **Full definitions → `references/advisors.md`** (read before step 2).

## Tier

Dispatched roles — advisors (step 2), peer reviewers (step 3), the research pass (step 1C) — run on
**cheap-tier `sonnet`** sub-agents (Agent-tool `model:` override); only the **chairman synthesis
(step 4) stays on the session model** (the high-judgment step). Tier map → `.claude/CONTEXT.md`.

## The 6 steps

All sub-agent prompt templates are in **`references/prompts.md`** — read it before spawning.

1. **Frame (+ context & research).** Scan the workspace for context (CLAUDE.md · `memory/` · referenced files — ≤30s). Decide if the call turns on *external current facts*; if so, run **one shared** research pass (template in prompts.md) and carry an evidence brief — say so in one line if you skip it. Reframe the raw question into one neutral prompt every advisor receives. Too vague → ask **one** clarifying question, then proceed.
2. **Convene (5 advisors, parallel).** Spawn all 5 as sub-agents (identities → advisors.md; template → prompts.md), 150–300 words each, leaning fully into their lens. Each **first emits its 1–2 decision-critical questions**, then its analysis (a question no advisor resolves becomes a chairman blind-spot). **Exception:** the Outsider does NOT get the evidence brief — keep it naive (that's the curse-of-knowledge detector).
3. **Peer review (5, parallel).** Anonymize the responses as A–E, **randomizing the mapping independently per reviewer** (not once). Each reviewer scores on a **rubric — reasoning · evidence · coverage, NOT length/fluency** — then answers: strongest? biggest blind spot? what did ALL miss? (template → prompts.md).
4. **Chairman synthesis (session model).** One agent gets the question + de-anonymized responses + all 5 reviews + the advisor questions → the verdict (template → prompts.md): agree · clash · blind spots · **recommendation (written before the score)** · **pre-mortem** · **calibrated confidence + dissent** · one-thing-first · the **single-model ceiling** caveat. The chairman MAY side with a lone dissenter if the reasoning is strongest.
5. **Write the verdict (lean).** Present in chat AND write **only the verdict** (sections per prompts.md) to `verdict-<slug>.md` — use the slug the ADR will use. Default to the OS temp dir; repo only if asked. Never dump the full transcript.
6. **Feed forward.** The verdict is a decision *input*, not a record. Hard-to-reverse + surprising + a real trade-off → fold the recommendation + alternatives into an **ADR** (`docs/adr/`, DOCS_Guide §4), then the verdict file can be deleted. Don't accumulate stale verdicts.

Worked example → `references/example.md`.

## Red flags

❌ **Spawning advisors sequentially** — always parallel; sequential lets earlier responses bleed in.
❌ **Skipping anonymization** for peer review — reviewers defer to thinking styles instead of judging merit.
❌ **Forcing the chairman to the majority** — it may side with the strongest reasoning, even a lone dissenter.
❌ **Counciling a trivial question** — one right answer → just answer it; the council is for genuine uncertainty.
❌ **Dumping the full transcript** into the verdict file — write only the verdict sections; the sprawl is what makes it un-lean.
❌ **Laundering disagreement into false consensus** — low advisor agreement is reported with a *lowered* confidence, never smoothed into a confident verdict.
❌ **Over-trusting unanimity** — 5 personas on one model share its knowledge gaps; the verdict says so (the ceiling caveat), so agreement isn't read as independent proof.
