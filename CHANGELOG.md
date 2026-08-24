---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---
## v1.57.0 — TS/Bun Foundation (2026-08-24)

MINOR — SPRINT-083, **22 of 26 DoD**, EPIC-014's first member sprint. The reference engine gets a
comparand and a home, before anything migrates. **Consumer-facing: nothing you must do.** The plugin
still needs no Bun, no install and no build step — but with no `files` manifest, `plugin install`
copies the whole repo, so your cache now also carries `package.json`, `tsconfig*.json`,
`bunfig.toml`, `apps/` and `test/`. Inert weight, stated rather than glossed.

**Two epics opened** from `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md`'s 40-task set,
split by substrate: **EPIC-014 Reference Engine** (TS/Bun, strangler migration, authority cutover) and
**EPIC-015 Execution Autonomy** (continuation contract, overnight, J0/J1/J2). EPIC-014 is sequenced
ahead of EPIC-005 by owner ruling.

**ADR-034 — the semantic compatibility contract.** What the migration must preserve (rule id · finding
id · verdict vocabulary · inclusion/exclusion · hold · full-run level · exit meaning) and what it must
not (byte-identical stdout). The rule surface is frozen at **100** ids with a retained, `cmp`-verified
snapshot; the three circulating counts are reconciled rather than picked between — 51 is *checkable*
(40 mechanical + 11 split), 49 is explicitly-marked non-evaluated, and **79 is a disproved query** whose
pattern stopped at a hyphen and missed exactly 21 §2 ids.

**The Finding-ID surface could not be frozen, and that is recorded as a named gap** — the Shell engine
emits findings through four-plus message shapes as free text, so it is not mechanically enumerable.
It closes at H07/H08 when findings become typed data. This is the sharpest argument for the migration.

**ADR-035 — TypeScript on Bun becomes the reference engine**, with `spec/STANDARD.md` unchanged and
normative. Zero dependencies, no `version` field (a fifth number beside the four lockstep manifests
would be a second SSOT), and `package.json`'s `test` script **must** invoke the repository gate — the
manifest is this repo's first rung-1 gate-discovery hit and outranks `.gate-command` (ADR-033), so a
script that skipped the gate would silently re-point System verify.

**ADR-036 — severity is *introduced* by the migration, not preserved by it.** Supersedes ADR-034's
Severity row, which had frozen a target-state vocabulary the current engine does not have. The general
rule it states: every row of a compatibility contract must point at an artifact the *current* system
has.

Also: the dependency direction is now five mechanical rules over six retained fixture trees; the
Standard's vocabulary is typed at **six** marks (V3's sketch had four — `restated` and
`standard-directed` were missing); and §11 retention ran — shipped tasks pruned, SPRINT-082 archived,
`v1.54.0` rotated — taking conformance from 6 FAIL to **0** and `level: none` back to **Gated**.

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

