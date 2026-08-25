---
owner: Maintainer
last_updated: 2026-08-25
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.56.0 (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at v1.58.0 (STANDARD §11 keeps current + previous).

---
## v1.56.0 — Foundation Hardening (2026-08-24)

MINOR — SPRINT-082, **38 of 38 DoD**. Three proof boundaries where lean-flow read *absence of evidence*
as *evidence of absence*, closed as one shape. Consumer-facing: a new root `.gate-command` declaration,
and review depth that no longer keys on file extension.

**`no-gate-discovered` routes on risk** ([ADR-033](docs/adr/ADR-033-gate-discovery-declared-rung.md)).
It used to continue to close on the reasoning "nothing to block on", so a behavioural change could close
having proved nothing and leave no trace that nothing was proved. Low/non-behavioural work is unchanged;
**material work draws a recorded owner ruling attended and parks unattended** — not new policy, but
night-run Part 0's existing execute-only charter applied to a case that slipped past it. The rollup line
now carries the class (`no-gate-discovered(low|material)`), because a verdict a checker cannot read is
not enforceable; an unmarked line followed by a close is `no-gate-risk-unmarked`.

**Gate discovery gains a fourth rung — `.gate-command`, ranked last.** A declaration is the weakest
evidence available, so anything discoverable beats it. It exists because *this* repository had no
discoverable gate at all — no manifest, Makefile, justfile or CI — while `dispatch.md` claimed it
dogfooded discovery as `sh scripts/qa-check.sh`: true of the repo, false of the procedure.

**Review depth follows consequence, not file type.** The skip table no longer exempts
`docs / config / trivial`. Depth is chosen from **behaviour impact + governance impact**, and a diff
needs both low to earn the self-review floor — so spec/STANDARD semantics, an implementation-binding
ADR, or a workflow contract draw an independent reviewer whatever their extension. The material classes
are defined once and consumed, never restated.

**G2 asks whether a check REACHES what it claims.** Four questions per mechanical `Verify:` —
EXISTS · RUNS · REACHES · PROVES. The first two are screened by `scripts/lib/check-verify-reaches.sh`;
the rest stay human, and the checker says so. It found a live defect in this sprint's own Plan on its
first run.

**The freeze.** The core execution architecture is declared frozen in
`docs/research/adlc-epic-sequencing.md`'s gated register — the file read when an epic is proposed.
Further workflow change is admitted only on a measured defect, a measured cost, a repeated workflow
failure, a security issue, or consumer evidence.

**Verification:** 3 new checkers wired against live artifacts (not fixtures alone) · 25 fixtures across
3 families · 9 must-FAIL · 8 seeded breaks, each verified landed, parsing, targeted and hash-restored.

**Known open:** the independent review of this sprint's own `governance:high` changes is **owed**
(TASK-266) — its own routing refused to let the work self-certify. TD-081 filed: `qa-check` prints two
verdicts and only the tally is read.

