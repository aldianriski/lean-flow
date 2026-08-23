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

### 2026-08-23 | scope-change | T1's ruling needs an engine edit its `Layers:` does not declare

Logged **before** § Plan is touched, and before any DoD is ticked. The scope holds; a *criterion*
went stale against what execution found (L-088's shape, the orchestrator's second edit-safety
red flag).

**What broke.** T1's DoD item 4 verifies a re-mark by *"`sh conformance.sh .` stops asserting it with
**no engine code edit**"* — the spec-driven property SPRINT-074 established and proved for
`judgment-only`. The owner's steer is to rule (a) and (b) **separately**, which means at least one
mark value the spec does not have today. That half of the property was never tested.

**Measured, not reasoned.** Copied the spec to a scratch path, re-marked exactly one rule
(`S2.R-DESIGN`, line 283: `mechanical —` → `standard-directed —`; seed verified landed with `cmp`,
line delta 0, so it is a targeted break and not a demolition — L-137/L-142), and ran the engine
against it with `--spec`:

```
      S2.R-DESIGN     -- unrecognized mark 'standard-directed' (level: Structural), not evaluated
GAP   S2.R-CAPEXACT   -- rule-unimplemented: ... (sibling control, unchanged)
```

So the property is **half true**. The rule does leave the GAP list with no code edit — the engine's
`case "$mark"` has a `*)` arm and degrades gracefully rather than mis-evaluating. But it reports
**`unrecognized mark`**, which reads to an adopter as a defect *in the standard*, not as a deliberate
exclusion. For eleven rules at once, that is a worse consumer-facing surface than today's
`rule-unimplemented` (L-015), and shipping it would be the spec-only trap: a ruling that is correct
in the document and invisible-to-wrong in the tool (TD-001 · L-007).

**Impact.** A named exclusion line needs a `case` arm per new mark in
`scripts/lib/conformance-engine.sh` — a small, contained edit, and one T1's `Layers:` does **not**
declare (`spec/STANDARD.md` · `spec/CHANGELOG.md` · the register · the epic · `docs/adr/`). Ruling
this inside T1 without amending `Layers:` would also trip `check-layers-observed.sh`.

**Re-confirm G2 required** — surfaced to the owner rather than absorbed. Not ticked, not worked
around, and § Plan is unchanged pending the ruling.

### 2026-08-23 | scope-change | owner ruling: split the property, declare the engine — § Plan amended

**Ruled:** the criterion becomes two claims rather than one. *The rule stops being **asserted** with no
engine code edit* is the spec-driven property SPRINT-074 established, it is true, and it stays. *The
engine **names** the exclusion* is a second, separate claim that needs one `case` arm per new mark
value. Saying which half is which is the finding — the same form SPRINT-074 itself ruled when it
split "reads its rule set from the spec" from "assertion bodies stay in code".

**Applied to § Plan** (the amendment the scope-change above authorises):
- T1 `[size: S]` → `[size: M]`.
- T1 `Layers:` gains `scripts/lib/conformance-engine.sh` — a live declaration corrected per task, which
  L-100 names as the expected cost of declaring before the work: log it, declare it, continue.
- DoD item 4 becomes three: the re-mark + changelog level, the no-code-edit half, and the
  named-exclusion half with a retained fixture per new mark. Sprint DoD total 26 → 28.
- The changelog-level clause now names the spec's **own** test — *PATCH iff nothing an adopter
  satisfies today changes, else MINOR*, which 0.5.0 states for itself — instead of the Plan's vaguer
  "at least MINOR". A5 was confirmed at G2 by reading that test rather than by assuming a floor.

Nothing was ticked before this ruling, and § Plan was not edited before it.
