---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

## v1.52.0 — The Checks a Stranger Cannot See (2026-08-23)

MINOR — SPRINT-078, **15 of 15 DoD**, EPIC-004's seventh member. Coverage **19 → 30 of 62** checkable
rules, the largest single move the epic has made — and most of it was *reach*, not new assertion code.

### Five rules that worked and nobody could see

`scripts/lib/check-attestation.sh` is **deleted**. Its five §13 assertions have been correct and
fixture-guarded since SPRINT-074, and no adopter had ever seen one: the checker was wired into
`scripts/qa-check.sh` and nowhere else, while `conformance.sh` — the one entry point a stranger knows
about — execs the engine alone. Five working rules behind a door only this repository has are, from
outside, indistinguishable from five rules nobody wrote.

Migrated on the `gates_signed` precedent: bodies verbatim, finding text **byte-identical** (established
by diffing both tools' §13 lines *before* the old file was removed), the retained fixtures repointed at
the engine with an awk-derived §13-only spec. Verified on a repository that never installed lean-flow —
all five rules named, `attestation-trailers-incomplete` fired, the unsigned claim reported at exit 0.

Two things the migration needed that a pure move would have missed. **`hold`, a fourth verdict class:**
the engine's level ladder only demoted on failures, so carrying `attestation-unsigned-claim-only`
across as a plain note would have printed `level: Attested` over an attestation nobody signed — same
finding, same exit code, opposite headline. And **`--rev`**, because §13 is defined over a commit and
the deleted checker took one; without it the migration silently costs an adopter every commit but HEAD.

**It caught its own shipping commit.** T1's commit message ended `Gate: 164 pass, 0 fail.` — which git
parses as a *trailer*, so the commit claimed a §13 attestation with no `Gate-Signed-By:` and no
`Evidence:`. The newly-wired check reported it on the next gate run. Amended rather than fixed forward:
§13 reads HEAD, so a later commit would have gone green while leaving a false attestation in history.

### The tier is declared, not detected

`S2.F-TIER` · `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` · `S6.MULTISVC` — five rules, **one check, the
tier a parameter**. §6 marks all four tier rules `split — detection judged`, and the engine was already
on record refusing to guess a tier, so a repository now **declares** one.

**New file an adopter may write: `.conformance-tier`** — one token, `base` · `backend` · `medium` ·
`multi-service`, the same shape `.conformance-roles` already uses for §1's role vocabulary. Optional.
Undeclared, **Base is still checked** (§6's trigger for Base is *every dev repo*, which needs no
detection) and the other three report which fact is missing rather than guessing. An unreadable token
is a finding, never a silent fall back to Base.

Four finding strings, because the tiers genuinely differ: `tier-doc-set-incomplete` for Base and
Backend, which have literal-path rows; a named note for Medium, whose rows are all *families* and a
family cannot be missing; `tier-doc-set-underivable` for Multi-service, where §6 names three docs §2
carries no row for — deriving an empty required set there would pass every repository; and
`tier-declaration-unreadable`. Substrate-conditional rows are subtracted from **§6's own clause** and
printed on a `skipped not owed` line, because a skip nobody can see is indistinguishable from a pass.

### The front-door footer

`S2.R-README` fires `readme-ownership-footer-missing`, with the required field labels **parsed from
§3's own `<sub>` example** at runtime. That is what keeps `S3.README`'s scope-out honest — it is scoped
out *because* it restates this rule, so a check inventing its own footer shape would let §3 state one
shape while §2 enforced another. The rule's anti-SSOT half is a judgement about content and is
reported as judged, never faked.

### What an adopter sees

`sh conformance.sh <repo-dir>` now answers **24 rules in-engine** (up from 13) of 62 checkable; with
the four outboard checkers the standard's covered set is **30**. Two counts, never a ratio. `--rev`
accepts a commit-ish for the §13 family. `.conformance-tier` is read if present and never required.
Fourteen retained fixtures were added; every seeded break was guarded and each reddened only the cases
carrying its claim, with one seed **rejected by the guards** for rewriting three lines — a demolition
is not a discrimination.

---

