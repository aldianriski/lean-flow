---
owner: Maintainer
last_updated: 2026-11-08
update_trigger: Jev ships a new model or type, or a trial of a shortlisted use changes its delta
status: current
id: jev-use-cases
tags: [tooling, process]
domain: skills
related: [ADR-001]
---

# Research — Which Jev uses add something lean-flow does not already do?

> **Question.** Of the uses TypeSafe lists for Jev, which have a real delta over lean-flow's existing surface (L-017), and which one goes first?
> **Verdict.** Try the Done-when judge first (TASK-626). It is the only use that fills a gap no existing check reaches. A cheap A/B judge is second, concept match third. The router is covered already.

## Why this matters
The owner is bringing Jev in step by step, each use proven. Judged on standalone merit nearly every use sounds good. Judged on the delta over what lean-flow already has, most vanish.

## Options considered
Sources: [use-case map](https://docs.typesafe.ai/concepts/use-case-map) and the [System One post](https://typesafe.ai/blog/introducing-system-one-models-and-jev). Both read without login.
Businesses the map lists (recruiting, lead generation, insurance, finance, legal, e-commerce, advertising, gaming, support, demand forecasting, risk) touch no lean-flow stage, so they are one row.
The post's Doom, Wikiracing and side-by-side items are demos, not uses.

| Jev use (source) | lean-flow stage | Existing surface | Delta |
|---|---|---|---|
| Semantic code linting, LLM guardrails (map) | G1 scope check, `/lean-doc-generator` gates | G1 checklist read by a person or the model; `check-doc-caps`, `check-prose-density`, qa-check doc legs, which reach file metadata, not a box's claim | Whether a Done-when box is observable and a Negative names a concrete case |
| Verification, workflow evals (map, post) | A/B process (D16, EPIC-023) | Parallel dev runs, arms scored per task | A cheap per-item judge over a run's output |
| Search, retrieval, reranking (map) | `/triage` rejects, `/insights` bump | The running model matches by concept (`triage` § out-of-scope, `insights` step 2) | Cheap thresholded score in place of a model-tier read; small |
| Harness engineering: trace classification (map) | Overnight runs | `check-night-run-rollup`, five terminal states (`night-run.md`) | Classifying free-text traces; no measured need |
| Model routing (map) | Dispatch tiers | Static tier table in CONTEXT (`execution` Sonnet, `mechanical-ingest` Haiku) | None: covered by the tier table; Claude Code picks the model at dispatch |
| Paper screening, knowledge graphs (map) | `/council`, research docs | `Explore`, research workers, `graphify` | None: covered by `Explore` and `graphify` |
| Feature extraction, forecasting, real-time apps, big-data map-reduce (map, post) | none | n/a | None: no stage touched |

## Findings
- Done-when judge ranks first by delta: every other check reaches metadata or a person's eye. This agrees with the owner ruling, so no use outranks it. *Source:* table row 1.
- A cheap A/B judge is next: D16 needs many short runs scored, and a per-item judge cuts the model-tier read. The delta is cost, not capability.
- Concept match in `/triage` and `/insights` already works through the model. Jev would only make it cheaper and thresholded. Low value until backlog size makes the read costly.
- "Watcher" has no named use on either page. Closest is trace classification. Unmeasured, so it ranks last.
- Router is covered by the tier table; Jev routes per prompt, but lean-flow routes per dispatch.

### API facts
- **Endpoint.** `POST https://api.typesafe.ai/v1/systemone`. *Source:* [HTTP API](https://docs.typesafe.ai/go/api.md).
- **Auth.** `Authorization: Bearer <API_KEY>`. *Source:* same page.
- **Model param.** Request field `model`. `jev-1.14.0` is valid and `jev-latest` and `jev-preview` both alias it; pinning the version is advised. *Source:* [models](https://docs.typesafe.ai/go/models.md). So A2 holds on plain fetch (no SDK needed for this shape).
- **Price and limits.** 0.042 USD per Mtok input, output free; 64k tokens per request, 32k per question. A4 holds. *Source:* models page.
- **Box.** Box locates a region in an image: it needs header `TypeSafe-Danger-Zone-Images: true` and an `assets` image, and returns `box{top,bottom,left,right}` fractions plus `confidence`. *Source:* [HTTP API](https://docs.typesafe.ai/go/api.md), [primitives](https://docs.typesafe.ai/go/primitives.md).
- **A1 verdict: refuted as worded, fixed by switching type.** Box cannot answer a yes/no judgment on text. The fitting type is **Noul**.
  Request `{"model":"jev-1.14.0","state":"<text>","questions":{"id":{"type":"noul","instructions":"<question>"}}}`; response `answers.id.noul` is the probability of yes, 0 to 1. *Source:* HTTP API page.
  The 0.7/0.3 thresholds with a "not settled" band are the vendor's suggested start, from the installed `typesafe:typesafe-ai` skill (0.6.2); the primitives page gives no numeric cutoff, only "near 0.5 uncertain".
  The thresholds are unconfirmed on a docs page and need tuning in the trial. Pair each question as its own Noul, one judgment each.
- **Not found.** The post names no endpoint, auth or model id; the map names no types. Both point to the docs. Neither page states a data-retention policy; A3 stays an owner ruling.

## Recommendation
Shortlist, in order:
1. **Done-when judge** (TASK-626). Compared with: G1 checklist and the qa-check doc legs. Two Nouls per task file.
2. **Cheap A/B judge**. Compared with: D16 per-run scoring. Try after 1 proves the call path.
   Tried (TASK-628, SPRINT-169): 0.000384 against 0.0783 USD a call; on decided cells Jev agrees with the judge 93.3%, 66.7% and 93.9% over three runs, 37.5% unsure. Owner ruling: trial it as a pre-screen (TASK-631).
3. **Concept match in `/triage` and `/insights`**. Compared with: the running model's own match. Try only if backlog reads get costly.
4. **Watcher (trace classification)**. Compared with: night-run rollup check. Wait for a measured need.
5. **Router**. Covered by the tier table in CONTEXT. Not worth a trial.

Amend TASK-625's A1 to name Noul, not Box.

## Out of scope / open questions
- Retention and training use of data sent to the API: owner ruling A3 stands; not settled by the docs read.
- Whether 0.7/0.3 hold for these two judgments: a measurement, settled in TASK-626's trial.
