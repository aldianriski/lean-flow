---
owner: Maintainer
last_updated: 2026-11-13
update_trigger: claudex-loop releases a change to its loop or runner, or a keeper below is built or rejected
status: current
id: claudex-loop-delta
tags: [process, docs]
domain: skills
related: [codex-run-project-pipeline, mattpocock, ADR-001, ADR-010, ADR-053]
---

# Research — what does claudex-loop carry that lean-flow lacks?

> **Question.** `chaseai-yt/claudex-loop` hardens a plan with a second AI provider, then has the provider
> that did not build inspect the code. Which of its techniques, judged on the delta over lean-flow's
> existing surface (L-017), should lean-flow adopt?
> **Verdict.** **Adopt four narrow deltas as skill prose; adopt neither the runner nor the routing skill.**
> Most of the loop is already lean-flow surface. What is missing is the cross-model route itself, which
> the maintainer runs by hand and no shipped skill describes.

## Why this matters

The owner already reviews intake drafts and execution with Codex, and has Codex build in a worktree. Those
reviews caught an ADR-034 break and an ADR-053 freeze breach that a same-provider reviewer missed. The
procedure and its launch facts live only in the maintainer's session notes, so a consumer gets none of it.

## What it is

Read 2026-11-13 at `53cddc42e39346fb8c6d5d612281a3b1add14e66` (MIT, about 87 KB across 11 files read):
`claudex-loop` (recon, requirements, cross-provider plan review, build and cross-provider inspection),
`claudex-route` (a model and role recommendation plus one handoff), two Codex alias skills, and a Python
runner that launches one CLI turn and validates its structured result.

## Findings — concept map

| claudex-loop technique | lean-flow equivalent | Verdict |
|---|---|---|
| Recon with a sourced assumptions ledger | G1, `Explore` recon, the decomposer's assumption registry | matched |
| Batch independent questions, serialise dependents, recommend each | frontier-round grill | matched |
| Lazy glossary; ADR only for a hard-to-reverse trade-off | STANDARD §4, §7 | matched |
| Plan with acceptance criteria and proof commands, proven on real output | `## Done when`, `Verify:`, L-007 | matched |
| Approval bound to the plan's SHA256; a changed plan needs a new review | `plan_commit`, `gates_signed @ <sha>`, `scope-change` | matched (git holds the hash) |
| Round caps; unresolved findings reported, not converged away | one bounded retry, the two-round review cap | matched |
| Fresh session for the reviewer; the builder never grades | isolated review pass, builder-check fresh reader | matched |
| Tests assert the criteria, not the implementation | `/tdd` tautological-test rule | matched |
| `claudex-route`: recommend a model and a role | ADR-010 tiers; the router role was no-go in EPIC-024 | matched, not adopted |
| The other provider reviews plans and code; it can also build or diagnose | one line in `review-scoping.md` naming an external reviewer | **gap (1)** |
| Review result states coverage (what was read) and limitations (what was not) | reviewer briefs ask for neither | **gap (2)** |
| A coordinator who takes over a fix has become a builder and needs a fresh review | the revise loop re-reviews a builder retry only | **gap (3)** |
| When a revision replaces a behaviour, change every passage that still states the old one | no rule found in skills or learnings | **gap (4)** |
| Inspection bound to a fingerprint of the inspected changes | the `review ·` line records no commit | gap, not adopted (below) |
| Python runner: validates the CLI turn, artifacts outside the checkout, no silent model fallback | none shipped | not adopted (below) |

## Keepers

1. **Cross-model route.** A reference file in `/orchestrator` for handing work to another provider's CLI
   from a Claude host: review of drafts and code, a build in a worktree, and a read-only diagnosis.
   Off by default; on by a declared repo policy or the owner's request (owner rulings, 2026-11-13).
2. **Coverage and limitations** in every review result.
3. **The fixer becomes the builder.**
4. **The replaced-behaviour sweep.**

## Not adopted

- **The Python runner.** New executable logic here is TypeScript on Bun, and a script a shipped skill names
  as the mechanism of an adopter-run step is consequential Tier G (ADR-050). The launch rules it encodes
  (empty output is never approval, exit 0 is not a verdict, no silent model or provider fallback) are
  taken as prose in keeper 1.
- **The review snapshot fingerprint.** A real gap, but it is a new record field, and ADR-053 needs a
  recorded defect first. None was found. Revisit if an edit made after a review ships unreviewed.
- **`claudex-route`.** ADR-010 already routes by nature of work, and EPIC-024 ruled the router role out.

## Open questions

- Codex hosting and Claude reviewing is unproven on this host. It stays out of keeper 1 until someone runs it.
