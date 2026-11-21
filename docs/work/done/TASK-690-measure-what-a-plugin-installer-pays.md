---
id: TASK-690
title: "Measure what a plugin installer pays per session and per skill call, and trim over-long skill descriptions"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-184
depends-on: []
---
# TASK-690 — Measure what a plugin installer pays per session and per skill call, and trim over-long skill descriptions

## Why
The consumer's always-loaded cost is the 16 descriptions: 6,771 characters (~1.7k tokens). `council` is 939 against a median of ~385. Per-call cost is the SKILL.md body (3.8k to 25.4k characters). The census sets the targets for TASK-691, 692 and 693.

## Done when
- [x] A census table at `docs/work/evidence/TASK-690/census.md`, at the gate's bytes-per-token ratio, lists per skill: description tokens, SKILL.md body tokens, reference tokens (bytes a typical call reads) and template tokens (bytes read by init); the Tracker names a trim target for each of the five named bodies. ✓ docs/work/evidence/TASK-690/census.md (16 skills, 4 cost columns at 2.991 B/token); Tracker names the five body targets
- [x] Each description over ~450 characters (`council` first) is shortened; a trigger inventory (every trigger phrase and "Do not use" routing clause) before and after is identical in meaning. ✓ council 944→777 B and lean-doc-generator 541→415 B; before/after trigger and Do-not inventory identical in meaning (census.md; reviewer rebuilt both)
- [x] Routing exercise for each trimmed description, via `claude -p --plugin-dir D:/Project/lean-flow` (transcript shows the repo base dir): one real-input prompt showing the trigger still routes to that skill, and one showing a "Do not use" case does not; spend is recorded against this task's 1.50 USD share in `docs/work/evidence/TASK-690/spend.md`. ✓ routes: council (t7-1), lean-doc-generator promote (t7-5); Do-not cases do not (t7-2, t7-4); live checkout in init; 0.4725 of 1.50 USD in spend.md
- [x] `qa-check` frontmatter, skill-freshness and manifest-lockstep stay green. ✓ off-host gate on c80a3860: leg 3 frontmatter, skill-freshness and manifest-lockstep pass (none among the 8 FAILs, all review-depth/layers bookkeeping)
- [x] Negative: no trigger phrase or "Do not use" routing clause is lost from a trimmed description, and no repo-specific path is added. ✓ Negative held: reviewer's rebuilt inventory finds every trigger and Do-NOT clause verbatim; diff adds no path or drive string

## Touches
The `description:` frontmatter of `skills/*/SKILL.md`; the evidence file. Not `.claude/CONTEXT.md` (TASK-685) and not README/CHANGELOG (TASK-693).

## Assumes
- Descriptions only; no body change.
- Run budget: this task's fixed share is 1.50 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- The body target starts at 15% fewer bytes (assumed from Q1) and the census may revise it.

## Tracker
Owner intake 2026-11-21, area 5; answer Q4.
- SPRINT-184 T7 body targets (census.md, basis: body after frontmatter, CRLF-normalised, ratio 2.991 B/token; set to what can be proven under the owner's "Safety wins" ruling): task-decomposer 14,273 → ≤13,707 B (T8) · prime 10,557 → ≤9,764 B (T8) · triage 10,540 → ≤9,546 B (T8) · orchestrator 25,223 → ≤24,838 B (T9) · lean-doc-generator 18,428 → ≤17,680 B (T10).
