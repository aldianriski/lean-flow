---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: A candidate is measured, upstream changes the mechanism, or EPIC-023 rules on the remaining failures
status: current
id: plugin-reference-delta
tags: [process, tooling]
domain: skills
related: [learning-loop-architecture, lean-flow-3-specialist-roster, reference-rejudge, codex-run-project-pipeline, ADR-001, ADR-044, ADR-053]
---

# Research — What should lean-flow improve from pstack, ECC and Helix?

> **Question.** Which techniques improve reliability, efficiency and capabilities beyond lean-flow's current surface?
> **Verdict.** Finish the measured blocker fixes first. Then pilot reusable app verification and reference-based UI review; improve feedback placement and host portability within existing flows. Additional agents, hooks and gates need their own evidence.

## Why this matters

The owner asked for all three outcomes. Extra procedures could slow the plugin without improving its results, especially while observed failures remain unfixed. The comparison starts with the existing skills, prior experiments and consumer path, following ADR-001 and L-017.

## Options considered

- **A — Import reference bundles.** More capabilities immediately. *Trade-off:* duplicated procedures, host assumptions and recurring cost.
- **B — Adapt only unmatched techniques, with a proof vehicle each.** Recommended. *Trade-off:* pilots precede general availability.
- **C — Finish EPIC-023 and consider nothing else.** Protects the current experiment. *Trade-off:* leaves useful consumer-facing candidates unexplored.

## Findings

**Scope and provenance.** Desk research on 2026-11-02 covered local commit `29677d14` plus the active sprint's working state. Upstream trees came from GitHub's API; their main SHAs were independently checked with `git ls-remote`. Relevant skill bodies were read, but upstream runtimes were not executed. The sources document mechanisms; their gains for lean-flow remain unproven.

- pstack: [pinned tree](https://github.com/cursor/plugins/tree/ae5650febf4320793844c12c4adaa937f417f8da/pstack).
- ECC: [pinned tree](https://github.com/affaan-m/ecc/tree/b38be6a7f6350964d59328b52f0624e1d1d552d1).
- Helix: [Shopify's engineering account](https://shopify.engineering/helix), published 2026-09-21; a migration case study, not a controlled comparison.

**Our own measurements take precedence.** The [A2 report](logs/ab-measurements-a2.md) (Report 2026-11-02) records 78.1% first-pass
success versus A0's 89.6%; A2 versus A1 was −3.1 points, with an interval spanning zero. A2 used two trials per task, versus three
in A0/A1. Three A2 trials parked at popups. These results establish a problem in the studied workflow. They do not establish a
universal effect size or show that more reviewers would help.

[EPIC-023 D11–D13](../epic/EPIC-023-specific-not-short.md) already routes the popup and over-scoped design failures to
TASK-573/575, measured by TASK-574 in [SPRINT-156](../sprint/SPRINT-156-lean-flow-habits-a4a.md). D13 cancelled TASK-576: the
proposed small-task light path could not remove overhead imposed by the trial protocol's separate sessions. Do not revive it
without the [recorded revisit condition](../../.out-of-scope/light-path-small-tasks.md).

### Delta map

| Reference technique | Existing lean-flow surface | Unmatched remainder and disposition |
|---|---|---|
| Helix: small checkpoints | `task-decomposer` vertical slices; `tdd` tracer bullet; per-task review and commits | **Mostly matched.** Improve proof within the existing task; another checkpoint store would duplicate it. |
| Helix: independent adversarial review | Scoped isolated reviewer, Standards/Spec axes, zero-findings second look, bounded revise loop | **Mostly matched.** Two mandatory reviewers and unlimited retries are not justified by our results. |
| pstack: project-local app verification | `diagnose` builds feedback loops; review calls `/run` + `/verify`; `packs/verification.md` | **Pilot.** A reusable project-specific launch/drive contract and journey map, rather than reconstructing them for each task. |
| Helix: reference-based visual review | Review's UI floor checks controls, states, keyboard, width and contrast | **Pilot.** Same-state reference comparison, scoped to the built slice, including an INVALID verdict for incomparable captures. |
| pstack/ECC: learn from corrections | `insights`, close Retro, LEARNINGS promotion | **Adapt existing work.** Relevant accepted feedback must reach the next actor; another memory store does not close that gap. |
| ECC: iterative retrieval and context accounting | Prime's README deferral; on-demand references; scoped dispatch/review briefs | **Targeted experiment.** Retrieve missing task context on demand; measure actual usage and failures before adding context rules. |
| ECC: host compatibility | Claude, Codex and Kimi manifests; Kimi's explicit skillInstructions adapter | **Audit/pilot.** Installation and invocation instructions do not establish equivalent execution, review and reference resolution. |
| ECC/pstack: evals and blinding | Existing paid A/B harness, pinned arms, graders, pass@k/pass^k; retained contract fixtures | **Reuse.** Broader stage-boundary testing already has a deferred task; no second harness or automatic release gate. |
| ECC: search before building | Laziness ladder; recon; prototype and refactor-advisor | **Mostly matched.** Make external reuse explicit where a dependency is being chosen; no mandatory search agent. |
| ECC: skill stocktake | ADR-001 curation, doc aging, previous trigger and overlap research | **Optional audit.** Review changed skills for overlap and stale dependencies; missing usage observations are not evidence of disuse. |

Local comparands: [review scoping](../../skills/orchestrator/references/review-scoping.md), [dispatch](../../skills/orchestrator/references/dispatch.md), [prime](../../skills/prime/SKILL.md), [insights](../../skills/insights/SKILL.md), [verification pack](../../packs/verification.md). These are the existing capabilities against which the candidates were compared.

**App verification.** pstack records how to launch a usable app, check instance health, drive a real user path and retain
evidence. Its maintenance workflow distinguishes harness drift from product regressions. Reusing that operational knowledge would
add to our existing verification principles. Sources:
[creation](https://github.com/cursor/plugins/blob/ae5650febf4320793844c12c4adaa937f417f8da/pstack/skills/create-verification-skill/SKILL.md),
[maintenance](https://github.com/cursor/plugins/blob/ae5650febf4320793844c12c4adaa937f417f8da/pstack/skills/maintain-verification-skill/SKILL.md).

**Visual review requires two policies.** pstack requires zero image difference for its parity playbook; Helix describes
proportional review across frameworks and rejects captures in different states. Use image diff for deterministic same-renderer
regression and scoped visual judgement for cross-framework/reference equivalence. Neither comparison replaces behavior checks.
Sources: [pstack
parity](https://github.com/cursor/plugins/blob/ae5650febf4320793844c12c4adaa937f417f8da/pstack/skills/poteto-mode/playbooks/visual-parity.md),
[Helix](https://shopify.engineering/helix).

**Learning needs placement and outcomes.** ECC's instincts add triggers, evidence and project scope; pstack reflection routes
corrections into existing skills. Our [learning-loop research](learning-loop-architecture.md) already identifies the narrower
failure: capture and promotion do not prove a rule reached the actor or prevented recurrence. Its counts describe a historical
cohort, not a fresh census. Use that existing revise-or-retire route before adding an observer, confidence score or global memory
database. Sources: [ECC
learning](https://github.com/affaan-m/ecc/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/continuous-learning-v2/SKILL.md),
[pstack
reflection](https://github.com/cursor/plugins/blob/ae5650febf4320793844c12c4adaa937f417f8da/pstack/skills/reflect/SKILL.md).

**Portability needs its own evidence.** ECC explicitly checks host projections and host-specific substitutions. Our [Kimi
manifest](../../.kimi-plugin/plugin.json) supplies fallback guidance; the [Codex manifest](../../.codex-plugin/plugin.json) points
at the shared skills, while dispatch names Claude-specific commands, tools and model tiers. Audit those assumptions; this evidence
does not show that every other host fails. Source: [ECC
compatibility](https://github.com/affaan-m/ecc/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/skill-host-compat/SKILL.md).

**Efficiency needs measured scope.** ECC separates estimated installation overhead from live usage and bounds iterative retrieval.
A smaller file does not establish fewer billed tokens or better results. Prime already defers README, so another context-budget
skill would overlap. Compare relevant-context recall, task success, tokens and elapsed time on the same tasks. Sources: [context
budget](https://github.com/affaan-m/ecc/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/context-budget/SKILL.md),
[retrieval](https://github.com/affaan-m/ecc/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/iterative-retrieval/SKILL.md).

**Eval scope must stay honest.** ECC distinguishes first-attempt capability from repeated-run stability; pstack separates
candidate prompts from judge rubrics. Use these to check our existing experiments. They do not justify another framework.
[TASK-523](../work/backlog/TASK-523-behaviour-test-cases-for-stage-skill-boundaries.md) remains needs-info pending evidence of a
stage skill crossing its Do-not-use boundary. ECC's current eval framework also explicitly disables candidate execution pending
containment, so it cannot replace our runner as it stands. Sources: [ECC
evals](https://github.com/affaan-m/ecc/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/eval-harness/SKILL.md), [pstack
blinding](https://github.com/cursor/plugins/blob/ae5650febf4320793844c12c4adaa937f417f8da/pstack/skills/poteto-mode/playbooks/eval.md).

**Confirmed documentation drift.** [Setup](../development/setup.md) still says all scripts are POSIX shell and no package manager
exists, contradicted by [package.json](../../package.json) and the Bun/TypeScript tooling.
[evals/README.md](../../evals/README.md) says consumers never receive evals, while the current
[architecture](../architecture/overview.md) records that installs copy the whole repo. Setup's ownership date also exceeds the
standard's freshness window. Correct these claims: files can be present in an install while remaining maintainer-only in use.

**Confirmed Windows metadata loss.** Regenerating the knowledge index in this checkout dropped existing entries. The
[generator](../../scripts/gen-index.sh) matches frontmatter delimiters without stripping CR, and the affected source files use
CRLF. Running the unchanged generator on LF-normalized scratch copies restored the existing link set and added only this research
note. Fix the generator to read LF and CRLF metadata identically; that permanent parser fix remains outside this research change.

## Recommendation

The priorities set the order of attention; they do not approve implementation. The proof vehicles are proposed outcomes, not measurements or new release rules.

| Priority | Improvement | Benefit | Owner surface and proof vehicle |
|---|---|---|---|
| P0 | Finish and measure TASK-573/575 through TASK-574 | Reliability + efficiency | Existing SPRINT-156; use its frozen A4a protocol. This is already planned, not a new reference-derived feature. |
| P0 | Correct setup and eval-distribution claims | Usability + reliability | Existing setup and eval README; every changed statement agrees with the manifest, scripts and install evidence. |
| P0 | Repair CRLF metadata parsing in the index generator | Reliability | Existing generator; LF and CRLF versions of the same corpus retain the same entries. An observed defect, not new governance machinery. |
| P1 | Pilot reusable app verification | Capability + reliability | Existing consumer harness and review/diagnose entry points. A fresh session can verify one real journey; a deliberately broken journey fails; evidence survives cleanup. |
| P1 | Pilot matching-state visual comparison | Capability + reliability | Existing UI review floor, after app verification works. Matching unchanged captures pass, an introduced defect fails, and mismatched state is INVALID. Logic-only work skips it. |
| P1 | Exercise supported hosts end to end | Reliability + capability | Shared skill references and existing host manifests. Installed-host evidence covers reference loading, scope approval, execution and review, with unavailable capabilities named. Add an adapter only for an observed gap. |
| P2 | Carry relevant accepted feedback to its next use | Reliability + efficiency | Existing insights/promote/dispatch path and learning-loop research. Demonstrate retrieval on a repeated task and fewer repeat failures; keep approvals for durable rule changes. |
| P2 | Measure and trim unnecessary context | Efficiency | Prime and scoped briefs. An observed retrieval miss or repeated read motivates each change; success and relevant-context recall must hold alongside lower cost. |
| P2 / deferred | Change-only skill audit; broader blind behavioral cases | Maintainability + reliability | Existing QA/research surface and TASK-523. Stocktake is an occasional read-only report; a new checker/gate requires ADR-053 evidence. |

**First new experiment after the current study:** app verification on a real consumer repo, using its current runner. Retain one proven journey, its failure control and evidence location. Decide after the pilot whether reuse merits a shared reference or standalone skill. This project-local capability proposal gives no permission for docs-only `init` to generate runtime tools.

**Keep the current authority and cost boundaries.** Preserve human scope/design approval, the bounded retry, and the unattended approval envelope. Helix's growing autonomy is an explicit mode choice; prior success never implies consent. Review depth remains consequence-based. A new second reviewer must show additional defect catches for its cost.

**Do not adopt wholesale:** automatic hook-based observation, confidence-scored global instincts, more specialist definitions, a
second state/evidence ledger, unlimited retry-until-green, zero-pixel equality across different renderers, or a mandatory
external-search/stocktake stage. Each adds cost or changes authority before its incremental benefit is established. [ECC
stocktake](https://github.com/affaan-m/ecc/blob/b38be6a7f6350964d59328b52f0624e1d1d552d1/skills/skill-stocktake/SKILL.md) is
useful as an occasional audit; absent usage data must stay unmeasured.

## Out of scope / open questions

- No plugin behavior, task approval, active trial, release rule or roadmap is changed by this research.
- App-verification packaging and the visual-review rubric belong to a future pilot's design; neither blocks the findings here.
- Host workflow parity and incremental quality/cost gains remain unmeasured. Upstream adoption claims cannot answer them for us.
- Wider stage-boundary evals keep TASK-523's admission condition. A light path keeps TASK-576's recorded revisit condition.
- Any implementation follows the existing intake and design gates; this note does not pre-approve new governance machinery.
