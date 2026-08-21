---
sprint: 077
slug: the-decisions-epic-004-is-waiting-on
owner: Maintainer
last_updated: 2026-08-21
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-077 — Execution Log

> Append-only companion to [`../SPRINT-077-the-decisions-epic-004-is-waiting-on.md`](../SPRINT-077-the-decisions-epic-004-is-waiting-on.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-21 | promote | Gates signed; the run was requested unattended and refused
The session opened with `/orchestrator sprint-bulk unattended`. **Pre-flight was red and the run was
not spawned.** The blocking finding is the Plan's own shape: both tasks are `class: decision · HITL`
and the sprint carries **zero `AFK]` markers**, so an unattended run's execute-only charter would have
parked 2 of 2 tasks and exited `run · 0 of 9 DoD ticked`. This is L-111's shape — SPRINT-060 promoted
TASK-188 alongside four HITL tasks and foreclosed the only vehicle it had. A partial run was checked
and rejected too: only T1's DoD 2 is additive, and it is inert until DoD 1's spec decision lands.
Re-run attended by owner choice; `gates_signed: G1,G2 @ d004526`.

Also recorded: the session's skills were **1.48.0 against a 1.50.0 repo** (`/prime` reported STALE).
Diffed rather than assumed — `orchestrator/SKILL.md` and all three references are byte-identical once
CRLF is normalised, so the version gap carried **no procedure drift** for this run. Procedures were
read from `skills/` in the repo regardless, not from the plugin cache (L-021).

### 2026-08-21 | surprise | T1's `Layers:` was missing two §2 parsers, one of which fails silent
G1 recon found §2's file tables have **three** positional parsers, not the one T1 declared, and all
three hard-code the same root/`.claude`-vs-`docs/` column offset:

| File | Line | Parse | Declared? |
|---|---|---|---|
| `scripts/lib/conformance-engine.sh` | 977 | `cre = (pfx=="docs/") ? c[6] : c[5]` | yes |
| `scripts/lib/check-doc-caps.sh` | 67 | `cap = (pfx=="docs/") ? c[5] : c[4]` | **no** |
| `evals/run-s2-placement-fixtures.sh` | 69 | `cre = (pfx=="docs/") ? c[6] : c[5]` | **no** |

This matters because the obvious implementation of T1 — giving the root/`.claude/` tables the `Tier`
column the `docs/` tree already has — shifts every column by one and breaks all three. Two of those
breaks are **silent in the L-058 sense**: `check-doc-caps.sh` would read `lean loop` as the Cap cell,
find no integer, and drop every root and `.claude/` row from cap checking *while reporting PASS*; and
`run-s2-placement-fixtures.sh`, the harness meant to guard this, re-derives the required set the same
way the engine does, so it breaks identically rather than catching the break — its only guard is
`n_req >= 5`, which the `docs/` rows alone satisfy.

Per L-100 `Layers:` is a live declaration, not a frozen prediction: **T1 gains
`scripts/lib/check-doc-caps.sh` and `evals/run-s2-placement-fixtures.sh`**. Size re-estimated
**S → M** at G1 (not L, so no split). TD-057's shared `read-spec-files.sh` extraction — three copies
being the actual root cause — was explicitly held **out of scope**, as `conformance-engine.sh`'s own
comment already anticipated.

### 2026-08-21 | progress | G2 ruled: T1 needs no code change at all
The engine's discriminator for "unconditional" is literally the word `always` in §2's `Create ←` cell
(`_s2_rows`: `(cre ~ /always/) ? 1 : 0`). So re-wording the four loop rows' Create cells changes engine
behaviour with **zero code edit and zero column shift** — satisfying DoD 1's *Verify* directly, and
leaving all three parsers correct. `qa-check.sh:577` had already anticipated this exact move in prose.
The `Tier`-column and appended-`Scope`-column designs were both considered and rejected at G2 (the
former for the silent cap hole above; the latter as a fourth field to synchronise where the `docs/`
tier column already expresses the idea).

Cost recorded rather than buried: a row that stops saying `always` becomes conditional, and §2 routes
conditional rows to `S2.F-TIER`, which is unimplemented. Exposure was measured, not assumed — caps
derive from the *Cap* cell so all four keep their cap checks, and `TODO.md` · `.claude/CLAUDE.md` ·
`.claude/CONTEXT.md` are each guarded by three-to-four other checkers. **Only `AGENTS.md` is
engine-only**, so the true loss is one file's existence check until `S2.F-TIER` ships.

Owner rulings taken at G2: T1 → re-word the Create cells; spec bump → **MINOR (0.5.0)**, on the
reading that four rows reclassified unconditional → conditional changes what an adopter satisfies
(§2's own `spec/STANDARD.md` row names *reclassified* as a bump trigger), unlike 0.4.2 which changed
nothing an adopter satisfies. T2 → (a) exclude the three invocation errors; (b) adopt the wider
property, recorded as an amendment naming the prior wording, Retro rather than ADR.

### 2026-08-21 | progress | T1 shipped: the spec moved, no code did
§2's four loop rows now name their substrate instead of saying `always`. **Zero code edit** — the
engine's discriminator already *was* that word, so the required set fell from 9 to 5 by re-wording a
table. Verified against a pristine baseline that no cap check was lost (63 PASS both sides); only
`AGENTS.md` was engine-only, so the temporary exposure is one file's existence check until
`S2.F-TIER` ships.

**Re-derived, not copied (L-130):** `core-file-missing` 8 → 4 · artefacts 4 → **0** · whole report
10 → 6. The four that vanished are exactly the four the register names, which is T1's acceptance.
Worth recording that SPRINT-076's "4 of 8" was checked and found **correct** — the 10 I first measured
is the whole-report total, a different denominator from the register's `S2.F-FILE`-scoped 8. The
register was not stale and was not "corrected".

**Both retained fixtures reddened as designed, and both were re-triaged rather than widened.**
`run-foreign-repo-fixtures.sh` went back to SPRINT-075's stronger empty-remainder assertion, which
cannot absorb a new artefact one row at a time. `run-s2-placement-fixtures.sh` exposed a second-order
defect: its must-FAIL seed hard-coded `TODO.md`, so once that row was reclassified `build_conformant`
stopped creating it, `rm -f` removed nothing, and the existence guard passed **vacuously** — a case
that tested nothing would have scored as a pass (L-142). Its victim is now derived from §2's own
unconditional set, and the seed asserts the target *existed* before removal. Discrimination proven by
seeding the defect back: the case reddens, the sibling control stays green, restored under checked sha.

Gate after T1: **153 pass, 1 fail** — and the fail was mine, `layers observed` reporting
`run-s2-placement-fixtures.sh` changed but undeclared. The G1 finding had been written into this Log
but never into the Plan's `Layers:`, which is what the checker reads. Declared per L-100; now PASS.

### 2026-08-21 | progress | T2 shipped: § Closed-when 3 ticked, EPIC-004 at 4 of 5
A3 re-derived before ruling on anything built from it (L-130): `ls scripts/lib/check-*.sh` → **11**,
`grep '^assert_'` → **13**, so **24 of 24** checks guarded, unchanged since SPRINT-076. T1 added no
assertion, which is what *no code edit* meant in practice.

**(a)** The three invocation errors are out of scope — they fire before any repository is evaluated,
carry no §14 rule id, and no adopter clears one by changing their tree. Identities read **16 of 16**:
the denominator was wrong, not the numerator short. Confirms A4, and the alternative was live.
**(b)** The condition adopts the wider property. The old wording was *unsatisfiable* for
`S9.GATESABSENT` — a defect in the sentence, not a gap in the corpus — and L-139 had established the
wider property at SPRINT-075, before this sprint wanted it.

**The L-088 exposure was handled by preserving the prior wording in place**, so the amendment is
auditable rather than invisible: the epic now says what the condition used to say, immediately above
what it says now. Ruled **Retro, not ADR** on §4's three-part bar — reversible, unsurprising, and a
one-sided trade-off (the old sentence excluded a case *stricter* than those it admitted). The audit's
own measurements were annotated rather than edited, per §2's rule for a verdict a decision was built on.

**Carried, not hidden:** `docs/epic/EPIC-004-conformance.md` is **212 lines against a 200 soft cap**.
It was already over at 201 before this sprint; recording the amendment with its prior text added 11.
Left for close to route to §11's stated remedy (prune at the next promote governance review) rather
than resolved here by deleting settled content this task did not author.

### 2026-08-21 | run-complete | the attended run that replaced the refused night run
run · 9 of 9 DoD ticked
run · cost unavailable from inside the session · turns unavailable · wall-clock unavailable · 2 of 2 units · inline

Attended `sprint-bulk`, after the requested unattended run was refused at pre-flight for having no
AFK-safe task in the Plan. Nothing parked, nothing unattempted, no blocker.

| Task | DoD | Commit | State |
|---|---|---|---|
| T1 — §2 loop-row distinction | 5 of 5 | `19bfa8d` | ticked |
| T2 — the two § Closed-when 3 rulings | 4 of 4 | `828e8fa` | ticked |

**System-verify: `QA-CHECK: 154 pass, 0 fail`** against the integrated tree — read from the gate's own
verdict line, run as its own call, not through a pipe (L-120).

**Two soft-cap notes carried to close, neither introduced by a task's own growth alone:**
`docs/epic/EPIC-004-conformance.md` 212 > 200 (was 201 pre-sprint; the amendment record added 11) and
`docs/research/conformance-dispositions.md` 206 > 130 (**unchanged** — § Artefacts was rewritten to
carry three result states in the space that previously held one, per T1 DoD 4's prune-don't-append).
Both route to §11's stated remedy at the next promote governance review; TD-069 already owns the
second. Not resolved here, because the register's cap decision is named in this sprint's § Out.

**EPIC-004 now stands at 4 of 5 § Closed-when.** The one open condition is 2 — ~32 rules with no
backlog tasks — which needs `/task-decomposer` before it can be planned, exactly as § Out predicted.
