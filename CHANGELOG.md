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

---
## v1.55.0 — Clean Slate (2026-08-24)

MINOR — SPRINT-081, **25 of 25 DoD**. **lean-flow now passes its own standard's Structural bar**:
`level: none` → **`Gated`**. The only thing between it and Attested is commit signing, which §13 says
in as many words.

**A repository can now declare a *reasoned* doc exemption.** §6's Base tier owes every dev repo
`docs/product/requirements.md` and `docs/product/acceptance-criteria.md`. An adopter whose requirements
live in a ticket tracker, a product wiki or an AI-context file collected two permanent findings with no
way to say so. The new root **`.conformance-exempt`** — one row per line, `<path> -- <reason>` — is that
way, joining `.conformance-roles` and `.conformance-tier` as the **third declared file**. A reason is
mandatory: a bare path fires `exemption-reason-missing` **and the doc stays owed**, so the declaration
cannot be used as an off-switch. Every accepted exemption is printed back with its reason, and the path
is matched whole so `docs/` cannot exempt a tree. Spec **0.8.0 → 0.9.0**; the decision is
**[ADR-031](docs/adr/ADR-031-reasoned-doc-exemptions-are-declared.md)**.

The alternative — condition-gating §6's Base rows — was **rejected on a measurement, not a preference**.
Seeded into a scratch spec it silences both findings for a repository that declares *nothing*, and the
engine then reports *"no unconditional doc is owed at Base"*: the whole tier goes vacuous. Every
substrate-conditional row gates on a **material** fact (has code · publishes an artifact · has a DB ·
has auth), and "has requirements" is not one.

**A conformance report no longer certifies `Attested` on a tree that claims no attestation.** The level
ladder held a repository at Gated when an attestation was *claimed and unsigned*, and held it nowhere at
all when **none was claimed** — so claiming nothing outranked claiming honestly, and any adopter with
zero findings was told they had reached the level the standard reserves for provable, signed human
approval. Now an absent attestation is a **hold**: named as `attestation-absent`, capping the level at
Gated, and never a failure — §14 says a report states a level honestly reached, and declining to attest
breaches nothing. **The exit code does not move.**

**Sixteen ownership headers**, and with them the two rules that had held this repository below
Structural: `S1.LAW3` and `S3.SCHEMA` both PASS across all 222 docs. Three `docs/qa/` cases gained a
full four-field header; thirteen `docs/research/` docs gained a real `update_trigger:` — each derived
from what would actually change that doc, because a trigger that can never fire is the doc ageing
silently under a header claiming otherwise.

**The foreign-repo artefact triage, asked properly at last.** EPIC-004 called its own `0 artefacts`
result *honest but early* — taken at 6 of 62 rules, none of them the families likeliest to encode
lean-flow's own directory shape. Re-run at **45**, across all three: **9 findings, 9 actionable, 0
artefacts**, reconciled three ways. The two `S6.BASE` rows on a stranger's report are exactly the pair
this release made answerable — the finding did not go away, it became answerable by a **decision**
rather than only by a document.

**Consumer-facing:** `.conformance-exempt` is new surface and is documented in the README. The README's
coverage figure was **stale at 33** against an engine printing 45; corrected.

Filed: TD-078 (the QA test-case template ships no ownership header, so every adopter who renders it
collects a finding), TD-080 (§2 states the standard's own version-bump trigger and nothing enforces it).
Resolved: TD-064, TD-077, TD-079. Learnings: **L-158** (a fixture that asserts a finding's *wording* is
not asserting its *consequence*), **L-159** (a defect can hide in a branch your own repository has never
been in a state to reach).

---
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

