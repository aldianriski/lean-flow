# Ask-don't-tell Stop hook (detect a question buried in prose, force a popup)

- date: 2026-10-24
- decision: out of scope
- reason: a plugin hook is mandatory for every consumer (no per-hook disable), so its false positives are imposed, not offered. The first candidate was withdrawn at SPRINT-105 T1's outside review at a measured 60% false-positive rate on real transcripts, and its English-only patterns missed the owner's own bilingual cases. Its pattern set could not be specified without first deriving it from a corpus, and no route to an imposable rate was found in ~32 sprints. The rule stays prose (L-002, `.claude/CLAUDE.md` § Behavioral Guidelines).
- revisit-if: a pattern set derived from a real bilingual transcript corpus measures a false-positive rate low enough that a consumer would not want to switch it off (ADR-044's bar), or Claude Code ships per-hook opt-in for plugin hooks
- prior-requests: TASK-366
