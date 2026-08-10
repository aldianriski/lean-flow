---
sprint: 060
slug: make-room
owner: Maintainer
last_updated: 2026-08-10
status: closed
gates_signed: G1,G2 @ 865f446
plan_commit: 9c1177d
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-060 — Make Room

> **Theme:** Five deferrals, and one of them has stopped being cosmetic. Both SSOT files sit exactly at
> their caps — `CONTEXT.md` 130/130, `CLAUDE.md` 80/80 — so `L-108` earned promotion at this promote
> and could not be written anywhere. The continuous-learning mechanism is blocked on headroom, which
> makes the dedup pass T1 rather than P2 housekeeping. The other four are things previous sprints
> deliberately left open: a rule with nothing enforcing it, a figure taken by subtraction, a status
> nobody ruled on, and a code path proven three ways that all stop just short of each other.

## Scope

**In:** headroom in the SSOT files, honestly obtained · an enforcement for ADR-015 rule 2 · a direct
per-section measurement of the QA gate's inline half · a deliberate `status:` on the loop-hygiene PRD ·
the reaper exercised on a genuinely partial Plan.

**Out (deferred):** promoting `L-108` itself — it is blocked on T1 and is recorded as an explicit
blocked governance item, to be promoted at the **next** promote once headroom exists, never squeezed in
by trimming the SSOT's own content · TD-045 · TD-046 · TD-047, all re-reviewed at this promote and held
with reasons · any change to what the QA gate checks (T3 measures, it does not cure).

## Plan

### T1 — Run the CONTEXT.md dedup pass; both SSOT files are at their caps `[size: M · risk: low · class: decision · HITL]`
Layers: `.claude/CONTEXT.md` · `.claude/CLAUDE.md` · `README.md` (only if a pointer target needs one) · `docs/adr/ADR-017-context-cap-150.md` · `docs/DECISIONS.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` (§2 cap row + §7 precedent) · `docs/knowledge-index.md` (generated)
Depends-on: none

This is the keystone. `L-108` earned promotion (`count: 3`) at this sprint's promote and had nowhere to
go, so the learning loop is stalled until one of these files can take a line. The honest target is prose
that duplicates a satellite, replaced by a pointer.

**Acceptance:** `.claude/CONTEXT.md` has real headroom, and every removal is traceable to prose that
duplicated `CLAUDE.md` or `README.md`.

**DoD:**
- [x] The three files' overlapping sections are diffed before anything is judged removable — the duplication is the *hypothesis* (TD-006, L-008), not the finding (L-091)
- [x] Every removal is prose duplicating a satellite, replaced by a pointer — **never the SSOT's own content compressed to make a number go green** (§7, L-106)
- [x] If the overlap turns out to be small, the honest outcome is an ADR moving the cap, exactly as ADR-007 did to reach 130 — that is a result, not a failure
- [x] `CLAUDE.md` at 80/80 is assessed the same way; say explicitly whether it gained room or not
- [x] The resulting headroom is stated as a number, so the next promote knows whether `L-108` can land
<!-- QA: docs change; the gate's doc-caps checker is the verification. -->

### T2 — Guard ADR-015 rule 2: reject a soft-cap row in the grandfather file `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-doc-caps.sh` · `scripts/lib/doc-caps-grandfathered.txt` · `evals/fixtures/doc-caps/` · `evals/run-doc-caps-fixtures.sh`
Depends-on: none

ADR-015 ruled that the grandfather file records hard-cap breaches only. Today that rule is prose in the
file's header and in the ADR, and nothing stops the next breach being recorded there — the ADR's own
Consequences section names this guard's absence as an accepted trade.

**Acceptance:** a grandfather entry naming a path whose §2 cap is soft FAILs the gate with its own
named finding.

**DoD:**
- [x] `check-doc-caps.sh` FAILs when `doc-caps-grandfathered.txt` names a path whose §2 cap is soft (`~N` / `N soft`)
- [x] A **retained** must-FAIL fixture holds exactly that violation, failing with its named finding (L-058, TD-012)
- [x] Re-derived before building (L-091): confirm ADR-015's accepted trade is still worth closing, and that the checker's existing soft/hard parse (`cap ~ /~/ || cap ~ /soft/`) is reused rather than reimplemented
- [x] The gate stays green overall
<!-- QA: the fixture IS the test; a guard with no must-FAIL fixture is L-058's silent false negative. -->

### T3 — Measure the QA gate's inline half (sections 1–11) directly `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/research/qa-gate-timing.md` (`scripts/qa-check.sh` NOT edited — an instrumented copy was used instead)
Depends-on: none
Cites: T2

SPRINT-058 established the inline half is ~66% of runtime, but **by subtraction** — full-run minus
standalone-harness totals, two process invocations with their own cache state. The proportion is sound;
the second-level figures are not. The gate has since grown to 141 checks and ~173 s.

**Acceptance:** a per-section wall-clock table for sections 1–11 exists in the research doc, measured
directly, and the move/cheapen/keep decision is made against it.

**DoD:**
- [x] Per-section breakdown of sections 1–11, measured **directly** rather than by subtraction, ≥2 samples
- [x] Appended to `docs/research/qa-gate-timing.md` with the measurement method stated
- [x] If direct timing needs a script edit, that is recorded as a **finding**, not worked around — SPRINT-058 T2's brief refused the same trade and the refusal is what kept the measurement honest
- [x] The current total is re-taken too: the gate was ~130 s at 131 checks and is now ~173 s at 141
<!-- QA: measurement task; the numbers are the deliverable. -->

### T4 — Rule on `loop-hygiene-prd.md`'s status: current vs superseded `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/loop-hygiene-prd.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` (only if the RESEARCH status rule needs sharpening)
Depends-on: none
Cites: T1

Every workstream in the doc has shipped, which is what the RESEARCH template says triggers
`superseded`. SPRINT-058 T1 corrected its "nothing here has been applied" banner on exactly that
evidence and stopped short of ruling on the field itself.

**Acceptance:** the doc carries a deliberate `status:`, with the reasoning recorded wherever the ruling
lands.

**DoD:**
- [x] The `status:` field is set deliberately — either outcome is a result; what is unacceptable is it staying `current` because nobody looked
- [x] The reasoning is written down, not just the field changed
- [x] Note explicitly that this changes nothing mechanical: §11 archives a superseded doc only once nothing live cites it, and three live surfaces cite this one, so it stays put and keeps its cap coverage either way
<!-- QA: judgement task; the recorded reasoning is the artifact. -->

### T5 — Exercise the reaper on a genuinely partial Plan `[size: S · risk: low · class: execution · HITL]`
Layers: `scripts/night-run.sh` (only if the exercise finds a defect) · a sprint Execution Log
Depends-on: none
Cites: T2 T4

The reaper's partial-Plan path is proven three ways that each stop short of the others: a real log
replayed through `--reap`, a zero-ticked-box regression, and an end-to-end launcher run against a Plan
that was already complete. What has never run together is both halves at once.

**Acceptance:** a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks as
`unattempted`, produced end-to-end through `scripts/night-run.sh`.

**DoD:**
- [ ] **Do not manufacture a partial sprint to produce the evidence.** This sprint's own tasks are the natural vehicle: if a night run over T2–T4 stops mid-Plan for its own reasons, that IS this exercise. Flagged at promote and promoted anyway as an explicit owner decision — so the guardrail lives here, in the Plan, rather than in whoever runs it
- [ ] If no run stops early on its own, the honest outcome is to say so and carry the task forward — a green tick bought by staging a fake partial run would be exactly the report-disagrees-with-artifact failure SPRINT-059 existed to fix
- [ ] Any defect found is fixed in `night-run.sh` and covered the way T2's siblings are
- [ ] The result — exercised, or not-yet-exercised-and-why — is recorded in the Execution Log either way
<!-- QA: the run itself is the test; there is nothing to assert until one happens. -->

## Owner-action checklist
- [x] Decide whether SPRINT-060 runs unattended. T2 is AFK-shaped; T1, T3, T4 and T5 are HITL, so an unattended run would park four of five — which is itself the natural way to satisfy T5's acceptance.

## Decisions (pre-locked)

- **D1** — `L-108` is **blocked, not parked**: it earned promotion at this promote (`count: 3`) and both
  candidate homes are at their caps. Unblock condition is T1 landing with stated headroom; it is
  promoted at the **next** promote. Recorded here because a flow-blocking question parked as a silent
  note is the anti-pattern, and because a learning that quietly fails to land is how the loop stops
  working without anyone noticing.
- **D2** — No shared-file ownership map is needed: **all five tasks are file-disjoint**. This is the
  first sprint in several where the tasks could genuinely parallel-build. The one semantic coupling to
  watch is T1 ↔ T2 — T1 may produce an ADR moving a cap, and T2 guards how cap breaches are recorded —
  so if T1 goes the ADR route, re-read T2's assumptions before building it.

## Assumptions

- **A1** — The duplication T1 hunts for is really there. *Confirm: diff the three files first; TD-006
  and L-008 both describe the accretion, but that is the hypothesis, not the finding (L-091).*
- **A2** — `check-doc-caps.sh` already parses soft-vs-hard, so T2 is a comparison against a list it
  already reads. *Confirm: verified at decomposition — `soft = (cap ~ /~/ || cap ~ /soft/)`.*
- **A3** — T3's direct measurement is possible without restructuring the gate. *Confirm: if it is not,
  that is a finding to record, per T3's own DoD.*
- **A4** — Every workstream in the loop-hygiene PRD has shipped. *Confirm: SPRINT-058 T1 established
  this when correcting the doc's banner; re-check before ruling.*
- **A5** — T5 cannot be forced. *Confirm: its DoD makes not-yet-exercised an acceptable outcome, so the
  task cannot pressure anyone into staging a fake partial run.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-060-make-room.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

**Retrieval check** — no prior `L-NNN`/ADR was missed or contradicted, and four were actively load-
bearing: **L-091** (re-derive before building) is the reason T1 diffed before deleting and found its own
premise false; **L-088** stopped T5 being ticked against an unmet acceptance; **L-058/L-076** shaped T2's
two-fixture design; **L-107** was *re-observed*, one level below where it was written. ADR-014's glob
guard and `check-layers-observed.sh` each caught a real error mid-sprint.

**Cost** — inline, no dispatch. Two instrumented gate samples (~5.4 min of compute) plus ~10 ordinary
gate runs at 135–169 s each. No paid sub-agent runs and no night run this sprint, so there is no
harness cost row to transcribe; the honest figure is *session cost only*, which the harness does not
expose to me. Stated as unavailable rather than omitted (Part 4 degrade rule). **4 of 5 units
delivered.**

**Worked**

- **DoDs that force re-derivation before action.** T1's first DoD line was "diff before judging anything
  removable". That single clause is why a task written to delete prose became an ADR instead of a
  wrong deletion. Three of four completed tasks overturned the premise they were handed; in every case
  the DoD had a re-derivation step in front of the doing.
- **Measuring the artifact, not the report.** T3 used an instrumented *copy* so the shipped gate stayed
  byte-identical, and proved it (`git diff --stat` empty). T4's "nothing mechanical changes" was
  verified by running the retention checker, not asserted.
- **Writing the guardrail into the Plan rather than carrying it in someone's head.** T5 was promoted
  over a flagged concern, so the concern went into its DoD. When the moment came, the Plan itself
  refused the shortcut.

**Friction**

- **A criterion depended on a decision no gate had taken yet.** T5's acceptance needed a night run;
  the run mode was decided at G2, *after* promote froze the Plan. Neither G1 nor G2 surfaced the
  dependency, and by the time the mode existed the criterion was unreachable. → **L-111**.
- **`L-107` recurred inside the sprint that promoted it.** SPRINT-058 cleared the harnesses and then
  measured the remainder as an undifferentiated blob; "the inline half is 66%" became the new resting
  place for exactly the same reason the harnesses were the original suspect. → count bumped to 2.
- **Two tasks' stated assumptions were wrong in detail** (T4's "three live citers" was five; its
  "trigger" was not the template's actual trigger). Harmless here because both pointed the same way,
  but a `assumes:` line is a claim and was treated as one only because the DoD forced a check.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)

- A task's acceptance can depend on a decision that no gate has taken yet (L-111).
- L-107's second sighting: the blob beside the suspect gets measured *as a blob*, and the aggregate
  becomes the new unexamined resting place.
