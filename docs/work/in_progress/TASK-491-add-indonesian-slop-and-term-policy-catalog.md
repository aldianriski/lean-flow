---
id: TASK-491
title: "Add the Indonesian slop and term-policy catalog to /humanizer"
sprint: SPRINT-139
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-490]
---

# TASK-491 — Add the Indonesian slop and term-policy catalog to /humanizer

## Why
Upstream is English-only. Indonesian AI text has its own tells ("Mari kita selami", "Semoga membantu!") and over-translates
technical terms into KBBI coinages people do not use or that shift the meaning (galat for error). The owner writes in
developer code-mixed Indonesian and wants English terms kept where the Indonesian word is uncommon.

## Done when
- [x] `skills/humanizer/references/patterns-id.md` has: ✓ patterns-id.md: ID-1..17 mapped to EN § (+7 ID-only), 24-row term table + keep-list, italics rule with all four exclusions (13eee801, 5883e965, 97867184)
      (a) Indonesian slop patterns mapped to the upstream section they share ("Tidak hanya X, tetapi juga Y" → §1,
      "Mari kita selami" → §4, "Semoga membantu!" → §22, "memainkan peran penting" / "lanskap" / "krusial" → §12–13), plus
      Indonesian-only tells;
      (b) a term table: uncommon KBBI coinage → English term + reason (galat → error, peladen → server, tetikus → mouse,
      sangkil/mangkus → efficient/effective, …), and the common Indonesian terms that stay Indonesian (unduh, kata sandi,
      pengguna, basis data, …);
      (c) the italics rule: foreign terms italicized in rendered Markdown only (docs, PR bodies), never in plain-text commit
      messages, code, identifiers, paths or URLs.
- [x] SKILL.md detects Indonesian text and reads `patterns-id.md` in full in addition to the English catalog. ✓ SKILL.md step 1 reads patterns-id.md in full for Indonesian or mixed text (71/140)
- [x] The owner (native speaker) approves the term table and the slop list. ✓ owner reviewed by popup: 8 coinages to English, all rules kept, first-use italics (logged, d0b8a999)
- [x] Exercised: one AI-drafted Indonesian text containing galat-class terms is cleaned; before/after in the sprint log. ✓ DeployKit text: galat/peladen/sangkil -> error/server/efficient, 9 facts kept; before/after in the log
- [x] CHANGELOG line; Codex gauntlet review clean. ✓ CHANGELOG [Unreleased] bullet (13eee801); Codex CLEAR at round 2

## Touches
`skills/humanizer/references/patterns-id.md` · `skills/humanizer/SKILL.md` · CHANGELOG

## Assumes
- Register = developer code-mixed Indonesian with foreign terms italicized in rendered prose (owner, 2026-10-24).

## Tracker
Owner intake 2026-10-24.
