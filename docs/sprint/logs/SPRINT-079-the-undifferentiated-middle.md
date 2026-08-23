---
sprint: 079
slug: the-undifferentiated-middle
owner: Maintainer
last_updated: 2026-08-23
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-079 — Execution Log

> Append-only companion to [`../SPRINT-079-the-undifferentiated-middle.md`](../SPRINT-079-the-undifferentiated-middle.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. -->

### 2026-08-23 | promote | Batch G1 + G2 signed; sequential execution, T1 first

Gates signed against `2aea242` and recorded as `gates_signed: G1,G2 @ 2aea242` in the Plan's
frontmatter — the field an unattended run reads, and the only place a sign-off is visible to one
(L-099). Verified read-back: `PASS gates-signed: … G1,G2 signed @ 2aea242`.

**G1.** Fast-path for T1/T4/T5 (`origin: decomposer`); full checklist for T2/T3, which are
`origin: close-retro` and so never met the intake grill. No `[size: L]`, no `risk: high` task on
auth/input/secrets/data, so no abuse-case sketch is owed.

**G2 — the overlap map is the finding.** Every task shares at least one file with every other
(`spec/STANDARD.md` ×3 · the register ×5 · the engine ×3 · the fixtures and coverage doc ×2), so the
sprint is **fully sequential** and no task is worktree-dispatchable. Order T1 → T2 → T3 → T4 → T5
matches the Plan's `Depends-on` exactly. Preflight: no cycle · ownership resolved · base-ref = HEAD
(`2aea242`) · one wave. Dispatch: T1/T2 inline (`class: decision`), T3 direct (a spec edit), T4/T5
to `/tdd` — a retained fixture per finding *is* the test-first shape.

### 2026-08-23 | surprise | all 11 `scope-out` rules report to adopters as `rule-unimplemented`

Found while discharging **A2** at G2, before T1 started. The register dispositions eleven rules
`scope-out` with documented reasons, in two classes — **(a) seven restate a rule checked elsewhere**
(`S7.ORPHAN` `S7.PERSON` `S7.OUTSIDE` `S7.LEDGER` `S2.F-ARCHIVE` `S9.GATESINFILE` `S3.README`, each
carrying an arrow to its covering rule) and **(b) four govern the standard document, not an adopter's
repository** (`S2.R-CAPEXACT` `S2.R-DESIGN` read §2's own table, which an adopter does not have;
`S2.R-SKILLCAP` `S2.R-SKELETON` govern `SKILL.md`, a plugin artifact). Class (c) is empty. 7 + 4 = 11.

**The engine does not know any of that.** A single `sh conformance.sh .` reports **all eleven** as
`rule-unimplemented` GAP — it reads the spec's Mark column, sees `mechanical`/`split`, finds no
assertion, and says so. So an adopter's report cannot distinguish a rule we **decided not to build**
from one we simply have not reached, and the eleven sit in the GAP list beside the twenty-one.

**Why this matters beyond cosmetics.** D1 makes the spec the rule source; a disposition recorded only
in `docs/research/` is invisible to the tool that publishes the report. This is the same shape as
`gates_signed` living only in a launching transcript (L-099), the L-144 collapse ruling living only
in SPRINT-078's commit message, and SPRINT-075's discovery that an adopter's level moved with *our*
roadmap. It is evidence for T1 that both classes want a **mark in the spec** rather than a note in the
register — (b) beside `implementation-directed`, which the register already names as its shape, and
(a) something that says *covered by `<rule>`* — because a mark is the only disposition the engine can
read.

Recorded before T1 rules, so the ruling answers evidence rather than producing it.
