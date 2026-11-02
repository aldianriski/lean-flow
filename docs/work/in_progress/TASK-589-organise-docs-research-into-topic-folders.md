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
- [ ] An ADR and a STANDARD §2 amendment define research topic folders (a series of three or more docs sharing a prefix), with
      `logs/` and `archive/` unchanged, and also place per-feature sibling docs beside a core file, `docs/archive/` (migrate's
      history), `docs/qa/` with `QA.md`, the generated knowledge index and data files under `research/logs/` (scope-change
      2026-11-02).
- [ ] `scripts/gen-index.sh` and the cap check read topic folders (the CR fix is SPRINT-157 T1's; scope-change 2026-11-02); each
      change has a must-FAIL fixture (a doc in a topic folder) that fails on the current code.
- [ ] `conformance/`, `guard-audit/` and `mattpocock/` hold their series, every live link updated (citation counts re-derived
      before the move); `loop-hygiene-*` and high-citation docs stay flat; the knowledge index lists every moved doc.
- [ ] The governance roadmap moves under `docs/product/` per §2; the six stale headers are refreshed or re-dated with a reason.

## Touches
`spec/STANDARD.md` · `docs/adr/` · `scripts/gen-index.sh` · cap check · `docs/research/` · `docs/product/` · `docs/knowledge-index.md`

## Assumes
- `docs/research/plugin-reference-delta.md` belongs to the SPRINT-157 stream (untracked on main); it stays flat and is not moved here.
- `docs/research/storm/` (a skill-shaped file) is out of scope; an owner decision under ADR-001's curation bar.

## Tracker
SPRINT-158 research audit (owner request, 2026-11-02) · `docs/research/adopter-folder-audit.md` (F4, F5, F7-F9, F12)
