---
owner: Maintainer
last_updated: 2026-08-25
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---
## v1.58.0 — Standard Parser and Shell Parity (2026-08-25)

MINOR — SPRINT-085, **26 of 26 DoD** — closed at `QA-CHECK: 183 pass, 0 fail`. EPIC-014's **first
§ Closed-when condition, closed whole**. **Consumer-facing: one gate got stricter.**
`check-review-depth.sh` now FAILs with a named finding when a task records `governance:high` or
`behaviour:material` and carries **no** review line at all — previously that passed as
`no review line -- nothing to verify`, exit 0. A consumer repo that closed clean may now see a named
FAIL; that is the fix working. The TS engine below is **not** consumer-reachable — it has no CLI until
H11 and `package.json` still declares zero dependencies, so the no-toolchain install guarantee holds.

**The Standard is read by a parser now, not by a regex.** A hand-written block tokenizer (headings,
pipe tables, fenced code, paragraphs — each with a source location, zero imports, because ADR-035
leaves no Markdown library to reach for) feeds a reader that finds rules by asking *which table sits
inside which `## §N` window*. It emits all **100** rows in document order and agrees with
`scripts/lib/read-spec-rules.sh` **row-by-row, never in aggregate** — the assertion names the offending
row, and was demonstrated by perturbing one mark until exactly one test reddened. The discriminator
that proves a structural parse beat a substring match: `S13.NOINFER` appears **twice** in the Standard
and is admitted **once**. Given a denominator rather than a bare zero (L-156): **148** rule-id-shaped
tokens exist in the document, 100 admitted, 48 prose and duplicate mentions filtered.

**Absence and emptiness are now different answers, enforced by a type.** `SpecReadFail` carries no
`rows` field *at all*, so a caller cannot confuse "checked nothing and found a finding" with "checked
and found zero". An unreadable table is a named finding with a non-zero exit; §8 — which genuinely has
no rules — exits **0 silently**, because §14 publishes 0 for it. `--reconcile` reproduces the
per-section count table and the mismatch FAIL, which is the only thing that tells a silently-dropped
section apart from a legitimately empty one. Parity is held against the **9 retained fixtures the Shell
reader already answers to**, with the Shell reader spawned as a live oracle inside the TS tests rather
than its output frozen as a literal — so parity cannot rot silently.

**A guard was fixed, and then shown not to reach the case that motivated it.** `check-review-depth.sh`'s
absence branch is real — two named findings, two retained must-FAIL fixtures, and a seeded break that
reddens exactly those cases while seven siblings stay green. Pointed at the log that motivated it, it
still passes: the detector anchors on the *unattended* rollup contract, and every sprint here is
attended. Accepted for the branch it proves and the gap filed (TD-092 · L-166) rather than papered
over. Also: the conformance engine profiled per rule family (§ Round 5 — 281.2s, 89% in four families),
and `qa-gate-timing.md`'s recommendation **amended, not superseded**, with its coverage-reduction
ruling explicitly left standing.

## v1.57.1 — Gate Recovery and Owed Work (2026-08-25)

PATCH — SPRINT-084, **19 of 19 DoD** — closed at `QA-CHECK: 176 pass, 3 fail`, with two FAILs ruled
rather than edited away and both filed as debt. **Consumer-facing: nothing changed, and that is why
this is a PATCH.** No `skills/`, `spec/`, `conformance.sh` or manifest file moved — a consumer
installing 1.57.1 gets byte-identical behaviour to 1.57.0. Under ADR-032 a version reports moved
behaviour, not the author's sense of significance, so the new capability here (a QA-budget guard, a
second foreign-repo fixture target) is maintainer tooling and does not earn a MINOR.

**The gate runs again.** `qa-check.sh` had stopped completing — three runs killed without ever printing
a verdict line, which made every DoD naming it unverifiable and forced SPRINT-083 to close four of its
own on an owner ruling (TD-084, now resolved). It was profiled **before** it was fixed, as TD-084
demanded, and the measurement overturned the assumption everyone held: the dominant cost is
**process-spawn count on this host**, not corpus size or check count. A tiny-input isolation put the
bare process-creation floor at 21.1ms against 110–260ms at real scale; `gen-index.sh` alone was 523
spawns. Leg 4 went **271.5s → 23.6s**, the conformance sweep **176.6s → 1.9s**, the whole run **~900s
never finishing → 492s**. **No check was deleted and no coverage lowered** — every heavy leg is still
reachable under `QA_FULL=1`. New `scripts/lib/qa-budget-check.sh` means an over-budget run is now
*reported with its skipped harnesses named* rather than dying past an external timeout with no verdict.

**The owed reviews were run instead of ruled away, and found six defects.** SPRINT-082 shipped the rule
that `governance:high` work cannot take the self-review floor, then correctly *parked* its own reviews
because no independent reviewer could be dispatched. Discharging that debt turned up silent
false-negatives in three shipped guards — a checker that satisfies a later unresolved failure with an
earlier ruling and is never wired into the gate; one that grades only the review lines that exist, so
work with *no* review line passes; one that certifies a script which *excludes* the path it claims to
check — plus an architecture freeze unreachable by the flow meant to obey it. All filed as TD-085…090.

**Also:** ADR-034/036 realigned to the ADR template with § Decision byte-identical; the absent-attestation
hold exercised against a foreign repo with real git history (consumer-path coverage dogfooding cannot
provide); `docs/research/harness-delta.md` ruling Phase C's four candidates, where independent review
moved one from *reject* to *defer* after finding only 2 of 6 experiment classes actually covered.

**Learning (`L-165`):** six guard defects, one shape between them, and **not one caught by anyone
recalling the rule that governs it** — every one surfaced by an independent pass or by a second number
disagreeing, with those rules loaded and on screen throughout.

---
## v1.57.0 — TS/Bun Foundation (2026-08-24)

MINOR — SPRINT-083, **26 of 26 DoD** — 22 carried a gate verdict; the remaining four closed on an
owner ruling over partial evidence, because TD-084 stopped `qa-check.sh` printing one at all.
EPIC-014's first member sprint. The reference engine gets a
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

