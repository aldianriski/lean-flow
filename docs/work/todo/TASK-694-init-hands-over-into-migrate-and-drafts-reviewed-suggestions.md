---
id: TASK-694
title: "Init hands over into migrate when docs exist, and drafts reviewed suggestions for every open prompt"
type: feature
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-694 — Init hands over into migrate when docs exist, and drafts reviewed suggestions for every open prompt

## Why

Two owner notes on `/lean-doc-generator`. (1) When init finds existing docs and the owner picks migrate, init writes nothing and stops, so the owner re-types the command. (2) Init and migrate offer only "not decided yet" or "I'll describe it" when no evidence exists, so the owner gets no best-practice starting point. Owner: every topic, double-checked by a reviewer (Codex or another model).

## Done when

- [ ] Init step 1d: migrate chosen → migrate runs in the same session, reusing the common scan inputs (stack, business evidence, question sets) while completing migrate's own plan and approval; no init writes. Continue = today's behaviour.
- [ ] Every applicable unresolved prompt gets one drafted suggested option beside the evidence options, *not decided yet* and *I'll describe it*. Init (`init.md` step 3): First milestone ×3, the five business topics, conventions questions, Standards. Migrate (`migration-map.md` § Profile pass): business topics, conventions questions, Standards where it fires. Each is labelled a suggestion, carries a one-line why, and rides in the same frontier round. First milestone stays init-only.
- [ ] One batched independent reviewer pass per round runs before offering. Rejected → dropped, stays absent. Changed → re-reviewed and cleared before offering. Reviewer: a fresh same-provider subagent, Codex when the cross-model route is on. Reviewer unavailable → no suggestions, today's options.
- [ ] An accepted suggestion is cited `(owner, init; suggested)` / `(owner, migrate; suggested)`; an edited or described answer is the owner's own. Evidence-settled prompts are never replaced.
- [ ] Headless init/migrate park with no suggestions and no writes; the park record keeps the existing-docs and migrate-offer lines.
- [ ] Consumer proof in D:\Research\workdoo with a pre-run file-hash manifest compared after revert: (a) init on a repo with docs → migrate chosen → migrate's plan, no init writes, no second command; (b) an init round shows a reviewed suggestion on First milestone or Standards plus a business/conventions prompt; (c) a migrate round shows a reviewed suggestion on Standards plus a business/conventions prompt; accept writes the cite; a reviewer drop is visibly absent.
- [ ] Negative: migrate choice leaves no init-written files and touches nothing outside migrate's approved plan; a dropped/unaccepted suggestion is never written; workdoo matches baseline.
- [ ] `lean-doc-generator/SKILL.md` ≤ 140 lines; Codex review of the shipped diff clean within 2 rounds; the report returns proposed README/CHANGELOG lines (coordinator writes them once).

## Touches

`skills/lean-doc-generator/references/init.md`, `references/migration-map.md`, the SKILL.md Init/Migrate rows. Reads `orchestrator/references/cross-model-route.md` and `review-scoping.md` § Draft reviews (not edited). README, CHANGELOG, CONTEXT are coordinator-owned.

## Assumes

- No ADR governs init's "never generates candidate answers" (grep found only `init.md`); re-derive at G2 and name any ADR found in the option offered (L-220).
- Tier P, no script; re-tier at G2 if one is added.

## Tracker

Owner notes items 1 and 2, 2026-11-21. Owner answer: "every topic with double secure with reviewer i think if not makesure, with codex or any".
