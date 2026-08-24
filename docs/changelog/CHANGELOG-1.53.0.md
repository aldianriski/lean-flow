---
owner: Maintainer
last_updated: 2026-08-24
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.53.0 (rotated)

## v1.53.0 — The Undifferentiated Middle (2026-08-23)

MINOR — SPRINT-079, **34 of 34 DoD**, EPIC-004's eighth member. Engine coverage **24 → 33**; the
checkable set **62 → 51**, because eleven rules that were never checkable against an adopter finally
say so. Spec **0.5.0 → 0.8.0** across three entries.

**The eleven rules that satisfied neither half of anything.** Since SPRINT-073 a research register had
classified eleven rules `scope-out` with sound reasons, in two clean classes — and the engine could not
see a word of it, because it dispatches on `spec/STANDARD.md`'s Mark column. So every conformance
report, including runs against repositories that never installed lean-flow, listed all eleven as
`rule-unimplemented`: *checks the standard owes you and has not written yet*. §14 gains **`restated`**
(7 rules whose constraint another rule already carries, each naming it — §8's own answer applied one
level down) and **`standard-directed`** (4 that govern this document or the plugin shipping it, never a
repository). Classification is unchanged at **100**; what moved is the set a tool evaluates against a
tree. [ADR-028](docs/adr/ADR-028-two-marks-for-rules-no-adopter-can-clear.md) records it, including the
cost: a smaller denominator makes EPIC-004's own exit condition easier to satisfy.

**§2 can now be addressed where §6 points.** Multi-service gains two rows and loses a claim — the
"global decisions index" §6 named as a third document is Medium's `DECISIONS.md` at umbrella scope, and
tier doc sets are exact-rank increments, so naming it there owed it twice. `DECISIONS.md` becomes a
literal §2 path (it was reachable only inside a pattern row, so five parsers discarded it) and is marked
substrate-conditional in §6 — §2 says don't pre-create it before the first entry, so an unconditional
row would have demanded it from a Medium repo that correctly has none.

**Every finding now names the rule that raised it.** 23 of 54 verdict lines carried a finding with no
rule id, and a failing assertion returns before its PASS line — so a *failing* rule could be entirely
un-attributable in a report. The id is **appended**, not prefixed: three retained fixtures assert the
absence of a finding *at line start*, and a prefix would have satisfied all of them unconditionally.

**Two rule families answered.** §9's sprint-file family (5 rules, 6 findings — the Plan's hard cap, the
Execution Log's existence and location, whether § Plan moved after its freeze and whether the
scope-change entry was written first) and §10's learning-governance family (4 rules — Retro routing,
the promotion threshold, tech-debt aging, the promote checklist). Every threshold is read from the spec
rather than written into the checker.

**For adopters, three things are visibly different:** eleven fewer `GAP` lines and eleven named
exclusions in their place; every `FAIL` line traceable to a rule id; and a repository declaring
`multi-service` or `medium` gets a doc set derived where none was before. Nothing about any repository's
actual conformance changed — the reference implementation's finding count is unchanged at 34.

**Found by running the new checks on real input, which is what that is for:** `S9.PLANFROZEN`
contradicted `S9.SCOPECHANGE` on this sprint's own Plan and had to be re-split along the line §9 draws;
the engine exited mid-report on `sprint: 079`, because a zero-padded integer is an octal literal and
`079` has no octal reading; and the gate caught a new fixture harness shipped without being registered.

