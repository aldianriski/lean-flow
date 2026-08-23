---
owner: Maintainer
last_updated: 2026-08-23
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.52.0 (rotated)

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

