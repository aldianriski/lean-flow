---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.45.0

> Rotated out of root `CHANGELOG.md` at v1.47.0 (§11: keep current + previous inline).

## v1.45.0 — Cite, Not Restate (2026-08-16)

MINOR — SPRINT-071, **14 of 14 DoD**, and the sprint that **completes EPIC-003**. The standard is now
something you can pin *and* build against: the skills defer to it instead of restating it, and the
spec defines the evidence each conformance level is checked on.

**What changed for you**

- **`spec/STANDARD.md` is at `0.3.0`, and §9 now defines what the Gated level is checked against.**
  Two things were missing and would have stopped you building a conformance tool from the spec alone:
  **`gates_signed: <GATE>[,<GATE>…] @ <sha>`** is now specified — including that its **absence means
  NOT SIGNED** and is never approval, that the record belongs in the sprint file rather than in the
  session that approved it, and that a malformed record is worse than none because it looks like
  evidence. And the **`*Verify: …*` clause** on a DoD criterion is now specified, so a criterion with a
  mechanical check is distinguishable from a judgment tick.
- **The skills cite the standard instead of restating it.** Six sites across `council`, `prototype`,
  `lean-doc-generator` and its `init` reference now point at §4 · §3 · §2 rather than repeating their
  rules. If you have been reading a rule out of a skill file, read it from `spec/` now — that is the
  copy that is maintained.
- **Nothing you rely on moved.** Every converted line still tells you a rule applies and where it
  lives; only the duplicated rule text is gone. Templates were deliberately left alone — a template is
  rendered output read by someone who may not hold the spec at all.

**Maintainer-facing**

- **A dangling cross-reference inside the spec, live for a full sprint.** §13 pointed at "§9" for
  `gates_signed:`; §9 never defined it. It survived authoring, review and a green gate, and was found
  only by auditing the spec as a reader with no `skills/` access — every other path finds the field
  documented in a skill and never notices the spec is silent. Filed as **L-129**, with **TD-060** for
  the absent check: nothing verifies that a `§N` reference resolves.
- **The sweep was 6 sites, not 15 files.** Inventorying first turned a plausible-sounding sweep into a
  small edit — 39 candidate sites classified as 6 restatements · 25 already-citations · 8
  legitimately-local. Four of the six *already cited* their section and restated it anyway, which is
  the case a citation-presence check cannot see.
- **A DoD frozen at promote was unsatisfiable as written** — its census came from summing eight
  overlapping greps (`~121`) when the real figure was 39. Caught at G2 by re-derivation before any
  task ran. Filed as **L-130**: a figure entering a frozen artifact is a query result and needs the
  same second-query treatment, at the moment it is written.

**EPIC-003 — The Standard: closed**, all five conditions met across SPRINT-069 · 070 · 071. Next in
the sequence is **EPIC-004 Conformance**, which builds the engine this spec was made checkable for.
