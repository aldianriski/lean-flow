---
owner: Maintainer
last_updated: 2026-08-24
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.54.0 (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at v1.56.0 (STANDARD §11 keeps current + previous).

## v1.54.0 — The Last Twelve Rules (2026-08-23)

MINOR — SPRINT-080, **35 of 35 DoD**, EPIC-004's ninth and final member. **EPIC-004 is closed.**

The standard is now checkable end to end: **51 of 51** rules either map to a check or carry an
explicit non-evaluated mark, and the disposition register's § `build` bucket is **empty**. Engine
coverage **33 → 45** in-engine, with the remaining 6 covered by standalone checkers.

**Twelve rules shipped.** §11's ledger retention — `S11.TDDELETE` · `S11.TODOCAP` · `S11.LEARNINGS` ·
`S11.BACKLOG`. §11's archival — `S11.SPRINT` (two findings) · `S11.LOGPAIR` · `S11.CHANGELOG` ·
`S11.WHENITRUNS`. §12's git boundary — `S12.SECRETS` · `S12.BACKUPS` · `S12.DESIGNSRC` ·
`S12.GENERATED`. Every threshold is **read from the spec**, never written into a checker: change §11's
retention delay in a scratch spec and the same repository changes verdict with no code edit.

**§12's four need two signals that agree** — a shape (extension · filename · path) *and* a
confirmation from content or git state. Size thresholds were **refused on the record**: §12 says
"large" and "small" and states no number, so the discriminators are a dump-tool preamble and the asset
directories §12 names. The register warns that a filename heuristic flagging `contract.md` in a
contract-testing repo is *worse than no scan*, and the six benign lookalikes were built **before** any
detector so each was designed to clear a real file.

**Four defects fixed in checks this repository already shipped.** `S9.VERIFYCLAUSE` fired on **every**
sprint between promote and its first tick — an empty command substitution inside a heredoc yields one
empty line, not nothing. `check-epic-archive.sh` read `member_sprints` **zero times**, enforcing one
half of what §11 calls a *genuine two-part test*. Root `CHANGELOG.md` had **38 rotated files and no
link line** to them. And `TD-073`'s stated cause was wrong: the engine's runtime was its own per-rule
bookkeeping — two command substitutions and an external `tr` per rule — not the shipped spec it was
blamed on. Fixing it took the fixture harness **9m24s → 3m20s** while growing it 38 → 67 cases.

**Retained fixtures 24 → 67**, with every §12 rule reporting its own denominator so a control that was
never *reached* is visibly untested rather than quietly green.

