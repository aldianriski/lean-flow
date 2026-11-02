---
id: TASK-589
title: "Organise docs/research into topic folders, with the standard and the index generator updated first"
sprint: SPRINT-159
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: G
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-589 — Organise docs/research into topic folders, with the standard and the index generator updated first

## Why
Owner, 2026-11-02: `docs/research/` is too messy to use, one flat folder of 59 files. A read-only audit (SPRINT-158) found every
file conformant (headers, template fields) but four series that read as one topic each: `conformance-*` (7), `guard-audit*` (4),
`mattpocock*` (4), `loop-hygiene-*` (3). STANDARD §2 defines only `research/<slug>.md` and `research/logs/`, and
`scripts/gen-index.sh` globs `docs/research/*.md` only, so a moved doc would silently leave the knowledge index. The generator also
drops entries from CRLF files. Elsewhere: `docs/development/Lean-Flow-Governance-Roadmap-2026-2027.md` is a roadmap outside
`product/` (0 citations), and six docs carry headers over 60 days old.

## Done when
- [x] An ADR and a STANDARD §2 amendment define research topic folders (a series of three or more docs sharing a prefix), with ✓ 2026-11-02: ADR-057 and spec 0.19.0 rows for the three topic folders plus archive/, qa/, QA.md, the knowledge index, log data files and the sibling-doc rule (`6f81890c`); outside review 2 rounds, PASS
      `logs/` and `archive/` unchanged, and also place per-feature sibling docs beside a core file, `docs/archive/` (migrate's
      history), `docs/qa/` with `QA.md`, the generated knowledge index and data files under `research/logs/` (scope-change
      2026-11-02).
- [x] `scripts/gen-index.sh` and the cap check read topic folders (the CR fix is SPRINT-157 T1's; scope-change 2026-11-02); each ✓ 2026-11-02: gen-index, the qa-check research corpus and the archive check read topic folders; fixtures fail on the old code (gen-index 11/11, archive 12/12); the cap check derives exact per-folder globs unchanged
      change has a must-FAIL fixture (a doc in a topic folder) that fails on the current code.
- [x] `conformance/`, `guard-audit/` and `mattpocock/` hold their series, every live link updated (citation counts re-derived ✓ 2026-11-02: 15 docs moved by git mv, 13 live links updated (scripts, harnesses, ledger, learnings), history kept; the regenerated index lists every moved doc; VPS gate 479/0
      before the move); `loop-hygiene-*` and high-citation docs stay flat; the knowledge index lists every moved doc.
- [x] The governance roadmap moves under `docs/product/` per §2; the six stale headers are refreshed or re-dated with a reason. ✓ 2026-11-02: moved to docs/product/governance-roadmap-2026-2027.md; the deployment guide, rollback guide and QA-001 corrected against the repo; qa/README, QA-002 and QA-003 verified and re-dated

## Touches
`spec/STANDARD.md` · `docs/adr/` · `scripts/gen-index.sh` · cap check · `docs/research/` · `docs/product/` · `docs/knowledge-index.md`

## Assumes
- `docs/research/plugin-reference-delta.md` belongs to the SPRINT-157 stream (untracked on main); it stays flat and is not moved here.
- `docs/research/storm/` (a skill-shaped file) is out of scope; an owner decision under ADR-001's curation bar.

## Tracker
SPRINT-158 research audit (owner request, 2026-11-02) · `docs/research/adopter-folder-audit.md` (F4, F5, F7-F9, F12)
