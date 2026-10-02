---
id: TASK-366
title: "Rebuild the `ask-dont-tell` Stop hook against the real transcript corpus"
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: close-retro
state: needs-info
---

# TASK-366 — Rebuild the `ask-dont-tell` Stop hook against the real transcript corpus

## Why

tier note: a hook is mandatory for every consumer (no per-hook disable), so a false positive is imposed, not offered

origin note: withdrawn at SPRINT-105 T1's outside review, re-filed rather than patched

state note: the pattern set must be DERIVED from the corpus before it can be specified

## Done when

A `Stop` hook that makes `L-002` fire without imposing noise. **Measured on the real corpus, not asserted**: the first attempt blocked ~35 of 746 real turns with **~22 false positives (≈60%)** and missed ≥9 genuine inline decisions. Required:

- [ ] (a) patterns **derived from the corpus** — drop `would you like` / `let me know` / `option a` (0 real hits), narrow `your call` and `which…would` (16 and 9 hits, almost pure noise: *"per your call"*, *"…which would confirm green"*); keep and extend `want me to` (10 hits, the only reliable one).
- [ ] (b) **Bilingual** — the maintainer writes mixed ID/EN and `Mau saya …?` *is* `want me to …?`; English-only patterns miss the majority of the real cases.
- [ ] (c) Anchor to the **final sentence**, not the last three *lines* — the same words reflowed to one paragraph flipped a must-NOT-catch fixture to BLOCKED.
- [ ] (d) Strip fenced code, `>` blockquotes and headings before matching.
- [ ] (e) `main()` wrapped in try/catch → allow, and entries null-guarded: three inputs currently exit 1 with a stack trace, against ADR-044's fail-open constraint.
- [ ] (f) **Fixtures drawn verbatim from real transcripts**, including the seven recorded false positives, plus a selection-varying case (Indonesian tail · single-paragraph tail · fenced-code tail).

## Touches

- hooks/ (re-created) · evals/ · scripts/qa-check.sh · README.md · ADR-044

## Assumes

- that a measured false-positive rate low enough to impose on every consumer is reachable at all. UNCONFIRMED — if it is not, the honest outcome is `.out-of-scope/` and L-002 stays a written rule. ADR-044's bar is "a consumer would not want to switch this off", and they cannot switch it off selectively.
- **open:** the pattern set must be DERIVED from the corpus before it can be specified.

## Tracker

- ADR-044 · ADR-011 (option B) · L-002 · L-186 · SPRINT-105 T1 review
