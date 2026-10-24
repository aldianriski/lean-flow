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
