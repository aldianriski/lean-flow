---
id: TASK-490
title: "Ship /humanizer standalone with the vendored English catalog"
sprint: SPRINT-139
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-490 — Ship /humanizer standalone with the vendored English catalog

## Why
lean-flow has no writing-quality surface: no skill, spec or template carries rules against AI-writing tells. The owner needs one
for every writing job, in English and Indonesian. Upstream `blader/humanizer` (MIT, v3.1.0, commit `8c307f3`) is a 26-pattern
English catalog based on Wikipedia's "Signs of AI writing". The owner chose to vendor it in full plus an Indonesian layer
(TASK-491) rather than install it separately. ADR-001 still applies: nothing enters without a per-pattern review.

## Done when
- [ ] Per-pattern review table (26 rows: keep / adapt + reason against "useful + important + used") approved at G2 **before**
      the catalog is committed (ADR-001).
- [ ] `skills/humanizer/SKILL.md` ≤140 lines; its first step reads `skills/humanizer/references/patterns-en.md` in full; modes: pasted text
      (default) and file. Embedded mode is TASK-493's.
- [ ] `skills/humanizer/references/patterns-en.md` holds every approved upstream pattern with its examples verbatim; its header names the
      upstream repo, v3.1.0, commit `8c307f3`, and the MIT notice.
- [ ] Exercised on real input: pasted mode on one AI-drafted English text, and file mode on one real Markdown file (code,
      paths, YAML untouched); before/after in the sprint log; no fact added or dropped.
- [ ] Roster 14 → 15: `.claude/CONTEXT.md` roster + entry routing, README roster + capability section, `.claude/CLAUDE.md`
      count, `docs/architecture/overview.md` directory map, the skill list and "14 skills" prose in
      `evals/run-layout-fixtures.ts`; that eval passes.
- [ ] `/flow` decision recorded in CONTEXT.md: whether the conductor names humanizer (it is a utility, not a stage).
- [ ] Consumer check: self-contained, no repo-specific path; CHANGELOG `[Unreleased]` entry; Codex gauntlet review clean.

## Pattern review (ADR-001, drafted by the coordinator for owner approval)

Each upstream pattern (blader/humanizer v3.1.0 @ `8c307f36`) judged on the bar: useful, important, and actually used by a
lean-flow writing job (docs · CHANGELOG · handoff · commits · PR bodies) or by standalone use on the owner's prose. `keep` =
vendored verbatim. No pattern is adapted. Where lean-flow house style differs, the Voice rule upstream already has carries it
(owner ruling R3), so no upstream text changes.

| § | Pattern | Verdict | Reason |
|---|---|---|---|
| 1 | Not X but Y | keep | the strongest tell; common in agent-written docs and commit bodies |
| 2 | One-line closers, dramatic fragments | keep | frequent in Retro and handoff prose |
| 3 | Sayings that sound deep | keep | turns up in research docs and ADR context paragraphs |
| 4 | Staged run-up before the point | keep | "Here's what you need to know" openers in handoffs and PR bodies |
| 5 | Arguing with no one | keep | leftover defences from drafts; common in design notes |
| 6 | Forced triads | keep | list-of-three habit in README and CHANGELOG bullets |
| 7 | Repeated sentence openings | keep | weak alone; cheap to apply |
| 8 | Dashes as the universal connector | keep | standalone at full force; embedded, the host doc is the voice sample, so lean-flow's `—` survives (R3) |
| 9 | Stacked qualifiers | keep | weak alone; repaired over-hedging in reviews |
| 10 | Hyphenated pairs everywhere | keep | weak alone; affects prose only, never code or ids |
| 11 | Passive voice, missing subjects | keep | weak alone; the "No configuration needed." fragment style |
| 12 | Overused AI words | keep | the word list; technical uses ("gate", "robust") are already exempt upstream |
| 13 | Inflated significance | keep | README and release-note send-offs ("a pivotal step") |
| 14 | Vague connection or association | keep | general prose; low frequency here, zero cost |
| 15 | Shallow -ing riders | keep | "…, ensuring consistency" tails in commit bodies |
| 16 | Sales language | keep | README and marketing copy; standalone use on the owner's prose |
| 17 | Borrowed authority | keep | "experts argue" in research docs |
| 18 | Avoiding is / are / has | keep | "serves as", "boasts", "features" in docs |
| 19 | Bold as decoration | keep | standalone at full force; embedded, templates keep their bold labels (R3) |
| 20 | Decorative headings | keep | standalone at full force; embedded, templates keep their heading style and `→` (R3) |
| 21 | Curly quotation marks | keep | weak alone; matters in plain-text commits |
| 22 | Chatbot residue | keep | "I hope this helps", "Want me to…?"; the most certain tell |
| 23 | Knowledge-limit disclaimers | keep | "as of my last update" in research summaries |
| 24 | A heading repeated in the first sentence | keep | common in generated doc sections |
| 25 | Writing about the document | keep | upstream already exempts changelogs and release notes |
| 26 | Re-explaining what the reader knows | keep | the most useful one for commit/PR replies and handoffs |

## Touches
new `skills/humanizer/` · `.claude/CONTEXT.md` · README · `.claude/CLAUDE.md` · `docs/architecture/overview.md` ·
`evals/run-layout-fixtures.ts` · CHANGELOG

## Assumes
- Upstream is vendored as a snapshot; no auto-sync. A re-sync is a manual task when upstream releases.
- SKILL.md's cap counts procedure only; the catalogs in `references/` are uncounted (ADR-006) and read in full, so the cap cuts
  nothing (owner: no quality loss).
- Skill name `humanizer`. A consumer who also installs blader's plugin gets two namespaced skills, no collision.
- Tier X is provisional (the eval skill-list edit is executable). Re-tier at G2; the consequential-G bar applies only if the
  adopter/merge criterion (ADR-050) does.

## Tracker
Owner intake 2026-10-24 (humanizer + Indonesian slop). Codex intake review: 3 rounds, CLEAR.
