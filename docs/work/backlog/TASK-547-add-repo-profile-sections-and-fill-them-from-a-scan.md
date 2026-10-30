---
id: TASK-547
title: "Add the repo-profile sections to the core templates and fill stack and conventions from a scan"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-547 — Add the repo-profile sections to the core templates and fill stack and conventions from a scan

## Why
The S1 tracer, and H1's premise: can `init` write conventions specific to a repo rather than a generic skeleton (symptom 1)?
The scan-only path is the fallback every unprofiled stack takes, so it comes first. Not frozen under ADR-053: skill and
template work (research §8). G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §6 S1 row and
the S1 intake rulings I-1..I-6 (2026-10-30).

## Done when
- [ ] The core templates carry the profile as stable headings a later pointer can address: stack (architecture overview),
  conventions in use (coding standards), and invariants · business goal · main flows · quality attributes · non-goals
  (requirements); each section says what belongs (facts a reader cannot get from the code) and what does not.
- [ ] `init` reads code samples per layer, not only manifests, and fills stack and conventions in use with conventions the
  repo actually follows, each citing a file it was seen in; a convention it cannot confirm is an open question, never invented.
- [ ] A real `init` through the installed plugin on a portfolio-sveltekit snapshot fills those two sections with
  SvelteKit/Drizzle-specific conventions that the owner reads as specific to that repo, with no lean-flow-internal path in the output.

## Touches
lean-doc-generator init reference · the architecture-overview, development-coding-standards and product-requirements templates

## Assumes
- Profile home = sections in existing core docs (I-1); no new core file, which would be a frozen STANDARD change.
- Exercises run on a snapshot copy in `D:\Research`, never the original and never an A/B repo (I-2, I-4).
- The business sections are created here but filled by TASK-548; in this run they stay as prompts.
- lean-doc-generator SKILL.md is at 139/140 lines: new procedure goes in `references/` (ADR-006).

## Tracker
EPIC-023 Closed-when S1 · research §6 S1 · S1 intake I-1, I-2, I-4 (2026-10-30, Codex 2 rounds)
